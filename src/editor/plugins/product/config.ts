import { createContainerPlugin } from "../plugin-factories";
import { ProductExtension } from "./product.extention";

/** Конфиг плагина Product: блок-продукт (:::product{type="buy"}) */
export const productConfig = createContainerPlugin({
  name: "product",
  pmType: "product",
  extensions: [ProductExtension],
  attrsFromMdast: (n) => ({
    type: (n.attributes?.type as string) ?? "buy",
    id: (n.attributes?.id as string) ?? "",
  }),
  attrsFromPm: (n) => ({
    type: (n.attrs?.type as string) ?? "buy",
    id: (n.attrs?.id as string) ?? "",
  }),
  defaultAttrs: { type: "buy", id: "" },
  slashMenu: {
    title: "Product",
    keywords: ["product", "product", "product"],
    onSelect: (editor) => {
      const id = window.prompt("id продукта:", "");
      if (id === null || id === "") return;

      const { from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .insertContent({
          type: "product",
          attrs: { id },
          content: [{ type: "paragraph" }],
        })
        .setTextSelection(from + 1)
        .run();
    },
  },
});
