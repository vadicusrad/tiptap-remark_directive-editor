import type { ComponentType } from "react";
import { Node } from "@tiptap/core";
import type { ReactNodeViewProps } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ProductWidget } from "./product.nodeview";

/** Расширение TipTap: блок product (:::product{type="buy"}). Markdown: containerDirective */
export const ProductExtension = Node.create({
  name: "product",

  group: "block",

  content: "block+",

  addAttributes() {
    return {
      type: {
        default: "buy",
        parseHTML: (el) => el.getAttribute("data-type") ?? "buy",
        renderHTML: (attrs) => ({ "data-type": attrs.type }),
      },
      id: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-id") ?? "",
        renderHTML: (attrs) => (attrs.id ? { "data-id": attrs.id } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      ProductWidget as ComponentType<ReactNodeViewProps>
    );
  },
});
