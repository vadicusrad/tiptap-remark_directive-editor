"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export function LeadWidget() {
  return (
    <NodeViewWrapper className="px-4 py-3 text-gray-400">
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}
