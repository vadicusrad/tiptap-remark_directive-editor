"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

/** @property node.attrs.type - тип alert: info, warning, success, error */
type AlertWidgetProps = {
  node: { attrs: { type?: string } };
};

/** React NodeView для блока alert. Рендерит контейнер с редактируемым контентом */
export function AlertWidget({ node }: AlertWidgetProps) {
  const type = node.attrs.type ?? "info";
  return (
    <NodeViewWrapper
      className={`rounded-lg border px-4 py-3 alert-${type}`}
      data-type={type}
    >
      <NodeViewContent className="contents" />
    </NodeViewWrapper>
  );
}
