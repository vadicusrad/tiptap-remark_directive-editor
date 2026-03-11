import type { ComponentType } from "react";
import type { Editor } from "@tiptap/core";
import type { ReactNodeViewProps } from "@tiptap/react";
import type { BlockPluginCommand } from "@/editor/plugins/block-plugin-wrapper/types";
import type { InlinePluginCommand } from "@/editor/plugins/inline-plugin-wrapper/types";

/** Тип директивы: leaf (::name), container (:::name), text (:name[]) */
export type DirectiveType = "leaf" | "container" | "text";

/**
 * Конфигурация директивы для регистрации в реестре.
 * @property name - уникальное имя директивы
 * @property type - тип (leaf/container/text)
 * @property component - React-компонент виджета
 * @property defaultProps - значения по умолчанию для props
 * @property attrsFromMdast - маппинг атрибутов из MDAST
 * @property attrsFromPm - маппинг атрибутов из ProseMirror
 * @property slashCommand - показывать в slash-меню
 * @property slashMenu - title и keywords для slash-меню
 * @property onSlashSelect - callback при выборе из slash-меню
 * @property customCommands - команды в меню (BlockPluginCommand для leaf/container, InlinePluginCommand для text)
 */
export interface DirectiveConfig {
  name: string;
  type: DirectiveType;
  component: ComponentType<ReactNodeViewProps>;
  attrs?: Record<string, { default?: unknown }>;
  defaultProps?: Record<string, unknown>;
  attrsFromMdast?: (node: {
    attributes?: Record<string, unknown>;
  }) => Record<string, unknown>;
  attrsFromPm?: (node: {
    attrs?: Record<string, unknown>;
  }) => Record<string, unknown>;
  slashCommand?: boolean;
  slashMenu?: { title: string; keywords: string[] };
  onSlashSelect?: (editor: Editor) => void;
  icon?: ComponentType;
  customCommands?: BlockPluginCommand[] | InlinePluginCommand[];
}

const LEAF_DIRECTIVES = new Map<string, DirectiveConfig>();
const CONTAINER_DIRECTIVES = new Map<string, DirectiveConfig>();
const TEXT_DIRECTIVES = new Map<string, DirectiveConfig>();

/**
 * Регистрирует директиву в реестре.
 * @param config - конфигурация директивы
 */
export function registerDirective(config: DirectiveConfig): void {
  const map =
    config.type === "leaf"
      ? LEAF_DIRECTIVES
      : config.type === "container"
      ? CONTAINER_DIRECTIVES
      : TEXT_DIRECTIVES;
  map.set(config.name, config);
}

/** Возвращает конфиг leaf-директивы по имени */
export function getLeafDirective(name: string): DirectiveConfig | undefined {
  return LEAF_DIRECTIVES.get(name);
}

/** Возвращает конфиг container-директивы по имени */
export function getContainerDirective(
  name: string
): DirectiveConfig | undefined {
  return CONTAINER_DIRECTIVES.get(name);
}

/** Возвращает конфиг text-директивы по имени */
export function getTextDirective(name: string): DirectiveConfig | undefined {
  return TEXT_DIRECTIVES.get(name);
}

/** Возвращает все зарегистрированные директивы */
export function getAllDirectives(): DirectiveConfig[] {
  return [
    ...Array.from(LEAF_DIRECTIVES.values()),
    ...Array.from(CONTAINER_DIRECTIVES.values()),
    ...Array.from(TEXT_DIRECTIVES.values()),
  ];
}

/** Возвращает только leaf-директивы */
export function getAllLeafDirectives(): DirectiveConfig[] {
  return Array.from(LEAF_DIRECTIVES.values());
}
