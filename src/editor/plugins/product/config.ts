import { createContainerPlugin } from "../plugin-factories";
import { ProductExtension } from "./product.extention";

/** Конфиг плагина Product: блок-продукт (:::product{type="buy"}) */
export const productConfig = createContainerPlugin({
  name: "product",
  pmType: "product",
  extensions: [ProductExtension],
  attrsFromMdast: (n) => ({
    id: (n.attributes?.id as string) ?? "",
    buttonText: (n.attributes?.buttonText as string) ?? "Купить",
  }),
  attrsFromPm: (n) => ({
    buttonText: (n.attrs?.buttonText as string) ?? "Купить",
    id: (n.attrs?.id as string) ?? "",
  }),
  defaultAttrs: { buttonText: "Купить", id: "" },
  slashMenu: {
    title: "Product",
    keywords: ["product", "купить", "продукт"],
    onSelect: (editor) => {
      const id = window.prompt("id продукта:", "");
      if (id === null || id === "") return;

      const { from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .insertContent({
          type: "product",
          attrs: { buttonText: "Купить", id },
          content: [{ type: "paragraph" }],
        })
        .setTextSelection(from + 1)
        .run();
    },
  },
});
