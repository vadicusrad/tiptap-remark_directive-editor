"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { withBlockPluginWrapper } from "../block-plugin-wrapper";

function ColumnsWidgetInner() {
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

/** React NodeView для блока columns с меню команд */
export const ColumnsWidget = withBlockPluginWrapper(ColumnsWidgetInner);
