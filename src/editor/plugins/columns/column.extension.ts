import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ColumnWidget } from "./column.nodeview";

/** Расширение TipTap: блок column (:::column). Используется только внутри columns */
export const ColumnExtension = Node.create({
  name: "column",

  group: "column",

  content: "block+",

  parseHTML() {
    return [{ tag: "div[data-column]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-column": "" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnWidget);
  },
});
