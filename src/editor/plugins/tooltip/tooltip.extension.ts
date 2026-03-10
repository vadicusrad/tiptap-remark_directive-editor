import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TooltipWidget } from "./tooltip.nodeview";

/** Расширение TipTap: inline tooltip (:tooltip[текст]{content="подсказка"}). Markdown: textDirective */
export const TooltipExtension = Node.create({
  name: "tooltip",

  inline: true,
  group: "inline",

  content: "inline*",

  addAttributes() {
    return {
      content: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-content") ?? "",
        renderHTML: (attrs) => ({ "data-content": attrs.content }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-content]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TooltipWidget, {
      contentDOMElementTag: "span",
    });
  },
});
