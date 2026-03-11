import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DirectiveContainerNodeView } from "./DirectiveContainerNodeView";

/** Универсальный TipTap Node для container-директив (:::name{props} ... :::) */
export const DirectiveContainerExtension = Node.create({
  name: "directiveContainer",

  group: "block",

  content: "block+",

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
      { tag: "div[data-directive-container]" },
      {
        tag: "div[data-type]",
        getAttrs: (el) => {
          const dom = el as HTMLElement;
          const type = dom.getAttribute("data-type") ?? "info";
          return { name: "alert", props: { type } };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-directive-container": "",
        "data-directive-name": node.attrs.name,
        ...(Object.keys(node.attrs.props ?? {}).length
          ? { "data-directive-props": JSON.stringify(node.attrs.props) }
          : {}),
      },
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DirectiveContainerNodeView);
  },
});
