"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";
import { getTextDirective } from "./registry";

/** Динамический рендер text-директивы по имени из реестра */
export function DirectiveTextNodeView(props: ReactNodeViewProps) {
  const { node } = props;
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
  return <Component {...props} />;
}
