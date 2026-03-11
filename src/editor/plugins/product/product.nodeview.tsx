"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { withBlockPluginWrapper } from "../block-plugin-wrapper";
import { useEffect, useState } from "react";
import type { ReactNodeViewProps } from "@tiptap/react";
import type { BlockPluginCommand } from "../block-plugin-wrapper/types";

const PRODUCT_CUSTOM_COMMANDS: BlockPluginCommand[] = [
  {
    id: "changeButtonText",
    label: "Сменить текст кнопки",
    onClick: (editor, getPos) => {
      const pos = getPos();
      if (pos === undefined) return;
      const node = editor.state.doc.resolve(pos).nodeAfter;
      if (!node) return;
      const currentText = (node.attrs.buttonText as string) || "Купить";
      const text = window.prompt("Текст кнопки:", currentText);
      if (text === null || text === "") return;
      editor
        .chain()
        .setNodeSelection(pos)
        .updateAttributes("product", { buttonText: text })
        .run();
    },
  },
];

const productCache = new Map<
  string,
  {
    name: string;
    price: number;
    brand: string;
    image: string;
  }
>();

function ProductWidgetInner({ node }: ReactNodeViewProps) {
  const productId = node.attrs.id ?? "";
  const buttonText = (node.attrs.buttonText as string) || "Купить";

  const [product, setProduct] = useState<{
    name: string;
    price: number;
    brand: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (!productId) return;
    const cachedProduct = productCache.get(productId);
    if (cachedProduct) {
      setProduct(cachedProduct);
      return;
    }
    const promise = new Promise((resolve) => {
      return setTimeout(() => {
        resolve({
          name: "Product 1",
          price: 100,
          brand: "Nike",
          image: "https://placehold.co/400",
        });
      }, 1000);
    });
    promise.then((data) => {
      productCache.set(
        productId,
        data as { name: string; price: number; brand: string; image: string }
      );
      setProduct(
        data as { name: string; price: number; brand: string; image: string }
      );
    });
  }, [productId]);

  if (!product) {
    return (
      <NodeViewWrapper className="px-4 m-2 py-3">Loading...</NodeViewWrapper>
    );
  }

  const displayName = productId
    ? `${product.name} (id: ${productId})`
    : product.name;

  return (
    <NodeViewWrapper className="p-4 m-2">
      <div className="flex justify-center gap-2 h-full">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">{displayName}</div>
          <div className="text-sm text-gray-500">{product.price}</div>
          <div className="text-sm text-gray-500">{product.brand}</div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            {buttonText}
          </button>
        </div>
        <div className="flex flex-col gap-2 m-0">
          <img src={product.image} alt={product.name} className="size-28" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

/** React NodeView для блока product с меню команд */
export const ProductWidget = withBlockPluginWrapper(ProductWidgetInner, {
  customCommands: PRODUCT_CUSTOM_COMMANDS,
});
