"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

/** React NodeView для блока column. Рендерит контейнер с редактируемым block-контентом */
export function ColumnWidget() {
  return (
    <NodeViewWrapper as="div" className="min-w-0" data-column="">
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}
