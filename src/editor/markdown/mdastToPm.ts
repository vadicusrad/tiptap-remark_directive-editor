import type { Root, RootContent } from "mdast";
import {
  getContainerConverter,
  getLeafConverter,
  getTextConverter,
} from "@/editor/plugins/registry";
import type { PMNode } from "@/editor/plugins/plugin-types";

export type { PMNode };

function getText(node: { children?: unknown[] }): string {
  if (!node.children) return "";
  return node.children
    .map((c: unknown) => {
      const child = c as { value?: string; children?: unknown[] };
      if (child.value) return child.value;
      if (child.children) return getText(child);
      return "";
    })
    .join("");
}

function convertPhrasingContent(
  node: RootContent,
  helpers: {
    convertBlockContent: (n: RootContent) => PMNode | null;
    convertPhrasingContent: (n: RootContent) => PMNode | null;
    convertParagraphContent: (children: RootContent[]) => PMNode[];
  }
): PMNode | null {
  switch (node.type) {
    case "text":
      return { type: "text", text: node.value ?? "" };
    case "emphasis":
      return getText(node)
        ? { type: "text", text: getText(node), marks: [{ type: "italic" }] }
        : null;
    case "strong":
      return getText(node)
        ? { type: "text", text: getText(node), marks: [{ type: "bold" }] }
        : null;
    case "link":
      return {
        type: "text",
        text: getText(node),
        marks: [{ type: "link", attrs: { href: node.url ?? "" } }],
      };
    case "inlineCode":
      return {
        type: "text",
        text: node.value ?? "",
        marks: [{ type: "code" }],
      };
    case "textDirective": {
      const converter = getTextConverter(node.name);
      if (converter) {
        const r = converter.mdastToPm(node, helpers);
        return Array.isArray(r) ? r[0] ?? null : r;
      }
      return null;
    }
    default:
      return null;
  }
}

function convertBlockContent(
  node: RootContent,
  helpers: {
    convertBlockContent: (n: RootContent) => PMNode | null;
    convertPhrasingContent: (n: RootContent) => PMNode | null;
    convertParagraphContent: (children: RootContent[]) => PMNode[];
  }
): PMNode | null {
  switch (node.type) {
    case "paragraph": {
      const content = (node.children ?? []).flatMap((c) => {
        const n = convertPhrasingContent(c, helpers);
        return n ? [n] : [];
      });
      return {
        type: "paragraph",
        content: content.length ? content : undefined,
      };
    }
    case "heading": {
      const content = (node.children ?? []).flatMap((c) => {
        const n = convertPhrasingContent(c, helpers);
        return n ? [n] : [];
      });
      return {
        type: "heading",
        attrs: { level: node.depth ?? 1 },
        content: content.length ? content : [{ type: "text", text: "" }],
      };
    }
    case "blockquote": {
      const content = (node.children ?? []).flatMap((c) => {
        const n = convertBlockContent(c, helpers);
        return n ? [n] : [];
      });
      return content.length ? { type: "blockquote", content } : null;
    }
    case "code": {
      const text = node.value ?? "";
      return {
        type: "codeBlock",
        attrs: { language: node.lang ?? null },
        content: text ? [{ type: "text", text }] : undefined,
      };
    }
    case "list": {
      const content = (node.children ?? []).flatMap((c) => {
        const n = convertBlockContent(c, helpers);
        return n ? [n] : [];
      });
      return content.length
        ? {
            type: node.ordered ? "orderedList" : "bulletList",
            content,
          }
        : null;
    }
    case "listItem": {
      const content = (node.children ?? []).flatMap((c) => {
        const n = convertBlockContent(c, helpers);
        return n ? [n] : [];
      });
      return content.length ? { type: "listItem", content } : null;
    }
    case "containerDirective": {
      const converter = getContainerConverter(node.name);
      if (converter) {
        const r = converter.mdastToPm(node, helpers);
        if (r === null) return null;
        return Array.isArray(r) ? r[0] ?? null : r;
      }
      return null;
    }
    default:
      return null;
  }
}

function flattenInlineWithMarks(
  node: RootContent,
  helpers: {
    convertBlockContent: (n: RootContent) => PMNode | null;
    convertPhrasingContent: (n: RootContent) => PMNode | null;
    convertParagraphContent: (children: RootContent[]) => PMNode[];
  }
): PMNode[] {
  if (node.type === "text") {
    return node.value ? [{ type: "text", text: node.value }] : [];
  }
  if (node.type === "emphasis") {
    const inner = (node.children ?? []).flatMap((c) =>
      flattenInlineWithMarks(c, helpers)
    );
    return inner.map((n) => ({
      ...n,
      marks: [...(n.marks ?? []), { type: "italic" }],
    }));
  }
  if (node.type === "strong") {
    const inner = (node.children ?? []).flatMap((c) =>
      flattenInlineWithMarks(c, helpers)
    );
    return inner.map((n) => ({
      ...n,
      marks: [...(n.marks ?? []), { type: "bold" }],
    }));
  }
  if (node.type === "link") {
    const inner = (node.children ?? []).flatMap((c) =>
      flattenInlineWithMarks(c, helpers)
    );
    return inner.map((n) => ({
      ...n,
      marks: [
        ...(n.marks ?? []),
        { type: "link", attrs: { href: node.url ?? "" } },
      ],
    }));
  }
  if (node.type === "inlineCode") {
    return [
      { type: "text", text: node.value ?? "", marks: [{ type: "code" }] },
    ];
  }
  if (node.type === "textDirective") {
    const converter = getTextConverter(node.name);
    if (converter) {
      const r = converter.mdastToPm(node, helpers);
      if (r === null) return [];
      return Array.isArray(r) ? r : [r];
    }
  }
  return [];
}

function convertParagraphContent(
  children: RootContent[],
  helpers: {
    convertBlockContent: (n: RootContent) => PMNode | null;
    convertPhrasingContent: (n: RootContent) => PMNode | null;
    convertParagraphContent: (children: RootContent[]) => PMNode[];
  }
): PMNode[] {
  return children.flatMap((c) => flattenInlineWithMarks(c, helpers));
}

/**
 * Конвертирует MDAST в документ ProseMirror (JSON).
 * Парсит директивы (containerDirective, leafDirective, textDirective) в кастомные ноды через реестр плагинов.
 * @param tree - MDAST Root
 * @returns объект документа { type: "doc", content: PMNode[] }
 */
export function mdastToPm(tree: Root): { type: "doc"; content: PMNode[] } {
  const content: PMNode[] = [];

  const helpers = {
    convertBlockContent: (n: RootContent) => convertBlockContent(n, helpers),
    convertPhrasingContent: (n: RootContent) =>
      convertPhrasingContent(n, helpers),
    convertParagraphContent: (children: RootContent[]) =>
      convertParagraphContent(children, helpers),
  };

  for (const node of tree.children ?? []) {
    if (node.type === "paragraph") {
      const inlineContent = convertParagraphContent(
        node.children ?? [],
        helpers
      );
      content.push({
        type: "paragraph",
        content: inlineContent.length ? inlineContent : undefined,
      });
    } else if (node.type === "heading") {
      const inlineContent = convertParagraphContent(
        node.children ?? [],
        helpers
      );
      content.push({
        type: "heading",
        attrs: { level: node.depth ?? 1 },
        content: inlineContent.length
          ? inlineContent
          : [{ type: "text", text: "" }],
      });
    } else if (node.type === "blockquote") {
      const blockContent = (node.children ?? []).flatMap((c) => {
        const n = convertBlockContent(c, helpers);
        return n ? [n] : [];
      });
      if (blockContent.length) {
        content.push({ type: "blockquote", content: blockContent });
      }
    } else if (node.type === "code") {
      content.push({
        type: "codeBlock",
        attrs: { language: node.lang ?? null },
        content: node.value ? [{ type: "text", text: node.value }] : undefined,
      });
    } else if (node.type === "list") {
      const listContent = (node.children ?? []).flatMap((c) => {
        const n = convertBlockContent(c, helpers);
        return n ? [n] : [];
      });
      if (listContent.length) {
        content.push({
          type: node.ordered ? "orderedList" : "bulletList",
          content: listContent,
        });
      }
    } else if (node.type === "containerDirective") {
      const converter = getContainerConverter(node.name);
      if (converter) {
        const r = converter.mdastToPm(node, helpers);
        if (r !== null) {
          const arr = Array.isArray(r) ? r : [r];
          content.push(...arr);
        }
      }
    } else if (node.type === "leafDirective") {
      const converter = getLeafConverter(node.name);
      if (converter) {
        const r = converter.mdastToPm(node, helpers);
        if (r !== null) {
          const arr = Array.isArray(r) ? r : [r];
          content.push(...arr);
        }
      }
    }
  }

  return { type: "doc", content };
}
