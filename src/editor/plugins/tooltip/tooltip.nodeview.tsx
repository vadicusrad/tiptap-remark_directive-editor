"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

/** @property node.attrs.content - текст подсказки при наведении */
type TooltipWidgetProps = {
  node: { attrs: { content?: string } };
};

/** React NodeView для inline tooltip. Видимый текст редактируемый, подсказка в title */
export function TooltipWidget({ node }: TooltipWidgetProps) {
  const content = node.attrs.content ?? "";
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
