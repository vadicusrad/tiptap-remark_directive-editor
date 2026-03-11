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
      buttonText: {
        default: "Купить",
        parseHTML: (el) => el.getAttribute("data-buttonText") ?? "Купить",
        renderHTML: (attrs) => ({ "data-buttonText": attrs.buttonText }),
      },
      id: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-id") ?? "",
        renderHTML: (attrs) => (attrs.id ? { "data-id": attrs.id } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-buttonText]" }];
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
