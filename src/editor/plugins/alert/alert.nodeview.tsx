"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { withBlockPluginWrapper } from "../block-plugin-wrapper";

/** @property node.attrs.type - тип alert: info, warning, success, error */
type AlertWidgetProps = {
  node: { attrs: { type?: string } };
};

function AlertWidgetInner({ node }: AlertWidgetProps) {
  const type = node.attrs.type ?? "info";
  return (
    <NodeViewWrapper
      className={`rounded-lg border px-4 m-2 py-3 alert-${type}`}
      data-type={type}
    >
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}

/** React NodeView для блока alert с меню команд */
export const AlertWidget = withBlockPluginWrapper(AlertWidgetInner);
