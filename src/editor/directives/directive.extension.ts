import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DirectiveNodeView } from "./DirectiveNodeView";

/** Универсальный TipTap Node для всех leaf-директив (::name{props}) */
export const DirectiveLeafExtension = Node.create({
  name: "directiveLeaf",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-directive-name"),
        renderHTML: (attrs) =>
          attrs.name ? { "data-directive-name": attrs.name } : {},
      },
      props: {
        default: {},
        parseHTML: (el) => {
          const raw = el.getAttribute("data-directive-props");
          if (!raw) return {};
          try {
            return JSON.parse(raw) as Record<string, unknown>;
          } catch {
            return {};
          }
        },
        renderHTML: (attrs) =>
          Object.keys(attrs.props ?? {}).length
            ? { "data-directive-props": JSON.stringify(attrs.props) }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      { tag: "div[data-directive]" },
      { tag: "div[data-directive-leaf]" },
      {
        tag: "div[data-buttonText]",
        getAttrs: (el) => {
          const dom = el as HTMLElement;
          const id = dom.getAttribute("data-id") ?? "";
          const buttonText = dom.getAttribute("data-buttonText") ?? "Купить";
          return { name: "product", props: { id, buttonText } };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-directive-leaf": "",
        "data-directive-name": node.attrs.name,
        ...(Object.keys(node.attrs.props ?? {}).length
          ? { "data-directive-props": JSON.stringify(node.attrs.props) }
          : {}),
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DirectiveNodeView);
  },
});
