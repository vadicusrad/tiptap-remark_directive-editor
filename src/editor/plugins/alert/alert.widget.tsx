"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";

export const AlertWidget = ({ node }: ReactNodeViewProps) => {
  const props = (node.attrs.props ?? {}) as Record<string, unknown>;
  const type = (props.type as string) ?? "info";
  return (
    <NodeViewWrapper
      className={`rounded-lg border px-4 m-2 py-3 alert-${type}`}
      data-type={type}
    >
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
};
