import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BadgeWidget } from "./badge.nodeview";

/** Расширение TipTap: inline badge (:badge[текст]). Markdown: textDirective */
export const BadgeExtension = Node.create({
  name: "badge",

  inline: true,
  group: "inline",

  content: "inline*",

  parseHTML() {
    return [
      { tag: "span[data-badge]" },
      { tag: "span[data-label]" },
      { tag: "div[data-badge]" },
      { tag: "div[data-label]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { ...HTMLAttributes, "data-badge": "" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BadgeWidget, {
      contentDOMElementTag: "span",
    });
  },
});
