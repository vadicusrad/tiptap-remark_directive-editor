import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import type { RootContent, PhrasingContent } from "mdast";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";

/**
 * Упрощённое представление ноды ProseMirror в JSON-формате.
 * @property type - тип ноды
 * @property attrs - атрибуты ноды
 * @property content - дочерние ноды
 * @property text - текст (для text-ноды)
 * @property marks - марки
 */
export interface PMNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}

/** Тип директивы remark-directive: container (:::), text (:), leaf (::) */
export type DirectiveType = "container" | "text" | "leaf";

/**
 * Хелперы для конвертации MDAST → PM. Передаются в mdastToPm плагина.
 * @property convertBlockContent - конвертация block-контента
 * @property convertPhrasingContent - конвертация inline-контента
 * @property convertParagraphContent - конвертация children параграфа
 */
export interface MdastHelpers {
  convertBlockContent: (node: RootContent) => PMNode | null;
  convertPhrasingContent: (node: RootContent) => PMNode | null;
  convertParagraphContent: (children: RootContent[]) => PMNode[];
}

/**
 * Хелперы для конвертации PM → MDAST. Передаются в pmToMdast/pmToPhrasing плагина.
 * @property convertBlockToMdast - конвертация block-ноды
 * @property convertInlineToPhrasing - конвертация inline-ноды в PhrasingContent
 */
export interface PmHelpers {
  convertBlockToMdast: (node: PMNode) => Promise<RootContent | null>;
  convertInlineToPhrasing: (node: PMNode) => Promise<PhrasingContent[]>;
}

/** Union MDAST-директив: container, text или leaf */
export type MdastDirectiveNode =
  | ContainerDirective
  | TextDirective
  | LeafDirective;

/**
 * Конфиг плагина для реестра. Описывает extension, конвертеры mdast/pm и slash-меню.
 * @property name - имя директивы в Markdown (alert, badge, etc.)
 * @property pmType - тип ноды ProseMirror
 * @property extensions - TipTap extensions (Node, Mark, Extension)
 * @property directiveTypes - типы директив (container, text, leaf)
 * @property mdastToPm - конвертер MDAST → PM
 * @property pmToMdast - конвертер PM → RootContent (для block-нод)
 * @property pmToPhrasing - конвертер PM → PhrasingContent (для inline-нод)
 * @property slashMenu - опциональный пункт slash-меню
 */
export interface PluginConfig {
  name: string;
  pmType: string;
  extensions: AnyExtension[];
  directiveTypes: DirectiveType[];

  mdastToPm: (
    node: MdastDirectiveNode,
    helpers: MdastHelpers
  ) => PMNode | PMNode[] | null;

  pmToMdast?: (node: PMNode, helpers: PmHelpers) => Promise<RootContent | null>;

  pmToPhrasing?: (node: PMNode, helpers: PmHelpers) => Promise<PhrasingContent[]>;

  slashMenu?: {
    title: string;
    keywords: string[];
    onSelect: (editor: Editor) => void;
  };
}
