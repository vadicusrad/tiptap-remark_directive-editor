"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { DirectiveNodeViewProps } from "@/editor/directives/types";

export function TooltipWidget({ node }: DirectiveNodeViewProps) {
  const props = (node.attrs.props ?? {}) as Record<string, unknown>;
  const content = (props.content as string) ?? "";
  return (
    <NodeViewWrapper as="span" className="inline-flex w-fit" data-tooltip="">
      <span
        className="cursor-help border-b border-dashed border-gray-500"
        title={content}
        data-tooltip={content}
      >
        <NodeViewContent />
      </span>
    </NodeViewWrapper>
  );
}
