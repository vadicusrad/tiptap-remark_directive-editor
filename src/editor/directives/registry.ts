import type { ComponentType } from "react";
import type { Editor } from "@tiptap/core";
import type { DirectiveNodeViewProps } from "./types";
import type { BlockPluginCommand } from "@/editor/plugins/block-plugin-wrapper/types";

export type DirectiveType = "leaf" | "container" | "text";

export interface DirectiveConfig {
  name: string;
  type: DirectiveType;
  component: ComponentType<DirectiveNodeViewProps>;
  attrs?: Record<string, { default?: unknown }>;
  defaultProps?: Record<string, unknown>;
  attrsFromMdast?: (node: { attributes?: Record<string, unknown> }) => Record<string, unknown>;
  attrsFromPm?: (node: { attrs?: Record<string, unknown> }) => Record<string, unknown>;
  slashCommand?: boolean;
  slashMenu?: { title: string; keywords: string[] };
  onSlashSelect?: (editor: Editor) => void;
  icon?: ComponentType;
  customCommands?: BlockPluginCommand[];
}

const LEAF_DIRECTIVES = new Map<string, DirectiveConfig>();
const CONTAINER_DIRECTIVES = new Map<string, DirectiveConfig>();
const TEXT_DIRECTIVES = new Map<string, DirectiveConfig>();

export function registerDirective(config: DirectiveConfig): void {
  const map =
    config.type === "leaf"
      ? LEAF_DIRECTIVES
      : config.type === "container"
        ? CONTAINER_DIRECTIVES
        : TEXT_DIRECTIVES;
  map.set(config.name, config);
}

export function getLeafDirective(name: string): DirectiveConfig | undefined {
  return LEAF_DIRECTIVES.get(name);
}

export function getContainerDirective(name: string): DirectiveConfig | undefined {
  return CONTAINER_DIRECTIVES.get(name);
}

export function getTextDirective(name: string): DirectiveConfig | undefined {
  return TEXT_DIRECTIVES.get(name);
}

export function getAllDirectives(): DirectiveConfig[] {
  return [
    ...Array.from(LEAF_DIRECTIVES.values()),
    ...Array.from(CONTAINER_DIRECTIVES.values()),
    ...Array.from(TEXT_DIRECTIVES.values()),
  ];
}

export function getAllLeafDirectives(): DirectiveConfig[] {
  return Array.from(LEAF_DIRECTIVES.values());
}
