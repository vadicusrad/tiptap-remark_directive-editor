"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";
import { getTextDirective } from "./registry";
import {
  InlinePluginWrapper,
  type InlinePluginCommand,
} from "@/editor/plugins/inline-plugin-wrapper";

/**
 * NodeView для text-директив (:name[текст]{props}).
 * Рендерит виджет по node.attrs.name из реестра, оборачивает в InlinePluginWrapper.
 */
export function DirectiveTextNodeView(props: ReactNodeViewProps) {
  const { node, editor, getPos, deleteNode } = props;
  const name = node.attrs.name as string;
  const config = getTextDirective(name);

  if (!config) {
    return (
      <NodeViewWrapper as="span" className="text-red-600 dark:text-red-400">
        Unknown directive: {name}
      </NodeViewWrapper>
    );
  }

  const Component = config.component;
  const customCommands = (config.customCommands ?? []) as InlinePluginCommand[];

  return (
    <InlinePluginWrapper
      editor={editor}
      getPos={getPos}
      deleteNode={deleteNode}
      node={node}
      customCommands={customCommands}
    >
      <Component {...props} />
    </InlinePluginWrapper>
  );
}
