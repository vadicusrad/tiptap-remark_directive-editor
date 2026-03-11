import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DirectiveTextNodeView } from "./DirectiveTextNodeView";

/** Универсальный TipTap Node для text-директив (:name[текст]{props}) */
export const DirectiveTextExtension = Node.create({
  name: "directiveText",

  inline: true,
  group: "inline",

  content: "inline*",

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
      { tag: "span[data-directive-text]" },
      { tag: "span[data-directive-name]" },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-directive-text": "",
        "data-directive-name": node.attrs.name,
        ...(Object.keys(node.attrs.props ?? {}).length
          ? { "data-directive-props": JSON.stringify(node.attrs.props) }
          : {}),
      },
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DirectiveTextNodeView, {
      contentDOMElementTag: "span",
    });
  },
});
