import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import type { MdastHelpers, PluginConfig, PMNode } from "./plugin-types";

/**
 * Хелпер slash-меню: insertContent + опционально afterInsert.
 * @param afterInsert - вызывается после вставки, fromBeforeInsert — позиция до вставки
 */
export function createSlashInsert(options: {
  title: string;
  keywords: string[];
  insertContent: PMNode;
  afterInsert?: (editor: Editor, fromBeforeInsert: number) => void;
}): { title: string; keywords: string[]; onSelect: (editor: Editor) => void } {
  return {
    title: options.title,
    keywords: options.keywords,
    onSelect: (editor) => {
      const from = editor.state.selection.from;
      editor.chain().focus().insertContent(options.insertContent).run();
      options.afterInsert?.(editor, from);
    },
  };
}

/**
 * Фабрика для container-плагинов (alert, column, columns).
 * @param customMdastToPm - переопределение для сложной структуры (columns)
 */
export function createContainerPlugin(options: {
  name: string;
  pmType: string;
  extensions: AnyExtension[];
  attrsFromMdast?: (node: ContainerDirective) => Record<string, unknown>;
  attrsFromPm?: (node: PMNode) => Record<string, unknown>;
  defaultAttrs?: Record<string, unknown>;
  customMdastToPm?: (
    node: ContainerDirective,
    helpers: MdastHelpers
  ) => PMNode | null;
  slashMenu?: {
    title: string;
    keywords: string[];
    onSelect: (editor: Editor) => void;
  };
}): PluginConfig {
  const {
    name,
    pmType,
    extensions,
    attrsFromMdast,
    attrsFromPm,
    defaultAttrs = {},
    customMdastToPm,
    slashMenu,
  } = options;

  const mdastToPm: PluginConfig["mdastToPm"] = (node, helpers) => {
    if (node.type !== "containerDirective") return null;
    if (customMdastToPm) return customMdastToPm(node, helpers);
    const content = (node.children ?? []).flatMap((c) => {
      const n = helpers.convertBlockContent(c);
      return n ? [n] : [];
    });
    const attrs = attrsFromMdast?.(node) ?? defaultAttrs;
    const defaultContent = [{ type: "paragraph" }];
    return content.length
      ? {
          type: pmType,
          attrs: Object.keys(attrs).length ? attrs : undefined,
          content,
        }
      : {
          type: pmType,
          attrs: Object.keys(attrs).length ? attrs : undefined,
          content: defaultContent,
        };
  };

  const pmToMdast: PluginConfig["pmToMdast"] = async (node, helpers) => {
    const results = await Promise.all(
      (node.content ?? []).map(helpers.convertBlockToMdast)
    );
    const content = results.filter(
      (n): n is NonNullable<typeof n> => n !== null
    );
    if (!content.length) return null;
    const attributes = attrsFromPm?.(node);
    return {
      type: "containerDirective",
      name,
      ...(attributes && Object.keys(attributes).length ? { attributes } : {}),
      children: content,
    } as import("mdast").RootContent;
  };

  return {
    name,
    pmType,
    extensions,
    directiveTypes: ["container"],
    mdastToPm,
    pmToMdast,
    ...(slashMenu && { slashMenu }),
  };
}

/**
 * Фабрика для text-плагинов (tooltip, badge).
 * @param leafMdastToPm - обработка leaf-директивы (badge на отдельной строке)
 */
export function createTextPlugin(options: {
  name: string;
  pmType: string;
  extensions: AnyExtension[];
  attrsFromMdast?: (node: TextDirective) => Record<string, unknown>;
  attrsFromPm?: (node: PMNode) => Record<string, unknown>;
  leafMdastToPm?: (node: LeafDirective, helpers: MdastHelpers) => PMNode | null;
  slashMenu?: {
    title: string;
    keywords: string[];
    onSelect: (editor: Editor) => void;
  };
}): PluginConfig {
  const {
    name,
    pmType,
    extensions,
    attrsFromMdast,
    attrsFromPm,
    leafMdastToPm,
    slashMenu,
  } = options;

  const mdastToPm: PluginConfig["mdastToPm"] = (node, helpers) => {
    if (node.type === "textDirective") {
      const children = (node.children ?? []).flatMap((c) => {
        const n = helpers.convertPhrasingContent(c);
        return n ? [n] : [];
      });
      const attrs = attrsFromMdast?.(node);
      return {
        type: pmType,
        ...(attrs && Object.keys(attrs).length ? { attrs } : {}),
        content: children.length ? children : [{ type: "text", text: "" }],
      };
    }
    if (node.type === "leafDirective" && leafMdastToPm) {
      return leafMdastToPm(node, helpers);
    }
    return null;
  };

  const pmToPhrasing: PluginConfig["pmToPhrasing"] = async (node, helpers) => {
    const results = await Promise.all(
      (node.content ?? []).map(helpers.convertInlineToPhrasing)
    );
    const content = results.flat();
    const attributes = attrsFromPm?.(node);
    return [
      {
        type: "textDirective",
        name,
        ...(attributes && Object.keys(attributes).length ? { attributes } : {}),
        children: content.length ? content : [{ type: "text", value: "" }],
      } as import("mdast").PhrasingContent,
    ];
  };

  return {
    name,
    pmType,
    extensions,
    directiveTypes: leafMdastToPm ? ["text", "leaf"] : ["text"],
    mdastToPm,
    pmToPhrasing,
    ...(slashMenu && { slashMenu }),
  };
}
