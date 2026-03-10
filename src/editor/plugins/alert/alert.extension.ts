import type { ComponentType } from "react";
import { Node } from "@tiptap/core";
import type { ReactNodeViewProps } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AlertWidget } from "./alert.nodeview";

/** Расширение TipTap: блок alert (:::alert{type="info"}). Markdown: containerDirective */
export const AlertExtension = Node.create({
  name: "alert",

  group: "block",

  content: "block+",

  addAttributes() {
    return {
      type: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-type") ?? "info",
        renderHTML: (attrs) => ({ "data-type": attrs.type }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      AlertWidget as ComponentType<ReactNodeViewProps>
    );
  },
});
