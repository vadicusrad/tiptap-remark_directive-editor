"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { ReactNodeViewProps } from "@tiptap/react";

/** React NodeView для inline badge. Рендерит pill-стиль с редактируемым текстом */
export const BadgeWidget = ({ node }: ReactNodeViewProps) => {
  const props = (node.attrs.props ?? {}) as Record<string, unknown>;
  const badgeType = (props.badgeType as string) ?? "info";
  return (
    <NodeViewWrapper as="span" className="inline-flex w-fit" data-badge="">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium min-w-0 badge-${badgeType}`}
      >
        <NodeViewContent className="contents min-w-[1em]" />
      </span>
    </NodeViewWrapper>
  );
};
