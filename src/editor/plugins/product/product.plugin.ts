/** Плагин Product: leaf-виджет (::product{id}). Custom command: смена текста кнопки */
import type { Editor } from "@tiptap/core";
import { registerDirective } from "@/editor/directives/registry";
import { ProductWidget } from "./product.widget";

registerDirective({
  name: "product",
  type: "leaf",
  component: ProductWidget,
  defaultProps: { id: "", buttonText: "Купить" },
  slashCommand: true,
  slashMenu: { title: "Product", keywords: ["product", "купить", "продукт"] },
  onSlashSelect: (editor) => {
    const id = window.prompt("id продукта:", "");
    if (id === null || id === "") return;
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "directiveLeaf",
        attrs: { name: "product", props: { id, buttonText: "Купить" } },
      })
      .setTextSelection(from + 1)
      .run();
  },
  customCommands: [
    {
      id: "changeButtonText",
      label: "Сменить текст кнопки",
      onClick: (editor: Editor, getPos) => {
        const pos = getPos();
        if (pos === undefined) return;
        const node = editor.state.doc.resolve(pos).nodeAfter;
        if (!node) return;
        const props = (node.attrs.props as Record<string, unknown>) ?? {};
        const currentText = (props.buttonText as string) || "Купить";
        const text = window.prompt("Текст кнопки:", currentText);
        if (text === null || text === "") return;
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("directiveLeaf", { props: { ...props, buttonText: text } })
          .run();
      },
    },
  ],
});
