"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";
import { getContainerDirective } from "./registry";
import { BlockPluginWrapper } from "@/editor/plugins/block-plugin-wrapper";

/**
 * NodeView для container-директив (:::name{props} ... :::).
 * Рендерит виджет по node.attrs.name из реестра, оборачивает в BlockPluginWrapper.
 */
export function DirectiveContainerNodeView(props: ReactNodeViewProps) {
  const { node, editor, getPos, deleteNode } = props;
  const name = node.attrs.name as string;
  const config = getContainerDirective(name);

  if (!config) {
    return (
      <NodeViewWrapper className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 text-sm">
        Unknown directive: {name}
      </NodeViewWrapper>
    );
  }

  const Component = config.component;
  const customCommands = config.customCommands ?? [];

  return (
    <BlockPluginWrapper
      editor={editor}
      getPos={getPos}
      deleteNode={deleteNode}
      node={node}
      customCommands={customCommands}
    >
      <Component {...props} />
    </BlockPluginWrapper>
  );
}
