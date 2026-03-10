import type { Root, RootContent, Paragraph, PhrasingContent } from "mdast";
import { getPmToMdastConverter } from "@/editor/plugins/registry";
import type { PMNode } from "@/editor/plugins/plugin-types";

export type { PMNode };

function convertMarksToPhrasing(
  text: string,
  marks?: { type: string; attrs?: Record<string, unknown> }[]
): PhrasingContent {
  if (!marks?.length) {
    return { type: "text", value: text };
  }
  const linkMark = marks.find((m) => m.type === "link");
  const otherMarks = marks.filter((m) => m.type !== "link");
  let result: PhrasingContent = { type: "text", value: text };
  for (const mark of otherMarks) {
    if (mark.type === "bold") {
      result = { type: "strong", children: [result] };
    } else if (mark.type === "italic") {
      result = { type: "emphasis", children: [result] };
    } else if (mark.type === "code") {
      result = { type: "inlineCode", value: text };
    }
  }
  if (linkMark) {
    result = {
      type: "link",
      url: (linkMark.attrs?.href as string) ?? "",
      children: [result],
    };
  }
  return result;
}

async function convertInlineToPhrasing(
  node: PMNode,
  helpers: {
    convertBlockToMdast: (n: PMNode) => Promise<RootContent | null>;
    convertInlineToPhrasing: (n: PMNode) => Promise<PhrasingContent[]>;
  }
): Promise<PhrasingContent[]> {
  if (node.type === "text") {
    const text = node.text ?? "";
    if (!text) return [];
    return [convertMarksToPhrasing(text, node.marks)];
  }
  const plugin = getPmToMdastConverter(node.type);
  if (plugin?.pmToPhrasing) {
    return plugin.pmToPhrasing(node, helpers);
  }
  return [];
}

async function convertBlockToMdast(
  node: PMNode,
  helpers: {
    convertBlockToMdast: (n: PMNode) => Promise<RootContent | null>;
    convertInlineToPhrasing: (n: PMNode) => Promise<PhrasingContent[]>;
  }
): Promise<RootContent | null> {
  switch (node.type) {
    case "paragraph": {
      const results = await Promise.all(
        (node.content ?? []).map(helpers.convertInlineToPhrasing)
      );
      const content = results.flat();
      return {
        type: "paragraph",
        children: content.length ? content : [{ type: "text", value: "" }],
      } as Paragraph;
    }
    case "heading": {
      const results = await Promise.all(
        (node.content ?? []).map(helpers.convertInlineToPhrasing)
      );
      const content = results.flat();
      return {
        type: "heading",
        depth: (node.attrs?.level as number) ?? 1,
        children: content.length ? content : [{ type: "text", value: "" }],
      } as RootContent;
    }
    case "blockquote": {
      const results = await Promise.all(
        (node.content ?? []).map(helpers.convertBlockToMdast)
      );
      const content = results.filter(
        (n): n is RootContent => n !== null
      );
      return content.length
        ? ({ type: "blockquote", children: content } as RootContent)
        : null;
    }
    case "codeBlock": {
      const textContent = node.content ?? [];
      const value = textContent
        .filter((n) => n.type === "text")
        .map((n) => n.text ?? "")
        .join("");
      return {
        type: "code",
        value,
        lang: (node.attrs?.language as string) ?? null,
      } as RootContent;
    }
    case "bulletList":
    case "orderedList": {
      const results = await Promise.all(
        (node.content ?? []).map(helpers.convertBlockToMdast)
      );
      const content = results.filter(
        (n): n is RootContent => n !== null
      );
      return content.length
        ? ({
            type: "list",
            ordered: node.type === "orderedList",
            children: content,
          } as RootContent)
        : null;
    }
    case "listItem": {
      const results = await Promise.all(
        (node.content ?? []).map(helpers.convertBlockToMdast)
      );
      const content = results.filter(
        (n): n is RootContent => n !== null
      );
      return content.length
        ? ({ type: "listItem", children: content } as RootContent)
        : null;
    }
    default: {
      const plugin = getPmToMdastConverter(node.type);
      if (plugin?.pmToMdast) {
        return plugin.pmToMdast(node, helpers);
      }
      return null;
    }
  }
}

/**
 * Конвертирует документ ProseMirror (JSON) в MDAST.
 * Преобразует кастомные ноды (alert, badge, tooltip, columns) в директивы remark-directive через реестр плагинов.
 * @param doc - корневая нода документа (type: "doc" с content)
 * @returns Promise MDAST Root
 */
export async function pmToMdast(doc: PMNode): Promise<Root> {
  const helpers = {
    convertBlockToMdast: (n: PMNode) => convertBlockToMdast(n, helpers),
    convertInlineToPhrasing: (n: PMNode) => convertInlineToPhrasing(n, helpers),
  };
  const results = await Promise.all(
    (doc.content ?? []).map(helpers.convertBlockToMdast)
  );
  const content = results.filter(
    (n): n is RootContent => n !== null
  );
  return { type: "root", children: content };
}
