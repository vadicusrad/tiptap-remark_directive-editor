"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

function ColumnWidgetInner() {
  return (
    <NodeViewWrapper as="div" className="min-w-0" data-column="">
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}

/** React NodeView для блока column с меню команд */
export const ColumnWidget = ColumnWidgetInner;
