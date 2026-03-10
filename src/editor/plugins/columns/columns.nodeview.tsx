"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

/** React NodeView для блока columns. Рендерит grid с двумя колонками */
export function ColumnsWidget() {
  return (
    <NodeViewWrapper
      as="div"
      className="grid w-full grid-cols-2 gap-4"
      data-columns=""
    >
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}
