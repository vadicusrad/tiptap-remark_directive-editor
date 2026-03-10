import type { ComponentType } from "react";
import { Node } from "@tiptap/core";
import type { ReactNodeViewProps } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ColumnsWidget } from "./columns.nodeview";

/** Расширение TipTap: блок columns (::::columns) с двумя колонками. Markdown: containerDirective */
export const ColumnsExtension = Node.create({
  name: "columns",

  group: "block",

  content: "column column",

  parseHTML() {
    return [{ tag: "div[data-columns]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-columns": "" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      ColumnsWidget as ComponentType<ReactNodeViewProps>
    );
  },
});
