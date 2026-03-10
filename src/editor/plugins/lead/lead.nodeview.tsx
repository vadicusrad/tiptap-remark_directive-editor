"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { withBlockPluginWrapper } from "../block-plugin-wrapper";

function LeadWidgetInner() {
  return (
    <NodeViewWrapper className="px-4 py-3 text-gray-400">
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}

/** React NodeView для блока lead с меню команд */
export const LeadWidget = withBlockPluginWrapper(LeadWidgetInner);
