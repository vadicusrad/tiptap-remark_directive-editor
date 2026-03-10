"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

/** React NodeView для inline badge. Рендерит pill-стиль с редактируемым текстом */
export function BadgeWidget() {
  return (
    <NodeViewWrapper as="span" className="inline-flex w-fit" data-badge="">
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium min-w-0">
        <NodeViewContent className="contents min-w-[1em]" />
      </span>
    </NodeViewWrapper>
  );
}
