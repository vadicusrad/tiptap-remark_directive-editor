"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { withBlockPluginWrapper } from "../block-plugin-wrapper";
import { useEffect, useState } from "react";
import type { ReactNodeViewProps } from "@tiptap/react";

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
    <NodeViewWrapper className="px-4 m-2 py-3">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">{displayName}</div>
        <div className="text-sm text-gray-500">{product.price}</div>
        <div className="text-sm text-gray-500">{product.brand}</div>
        <img
          src={product.image}
          alt={product.name}
          width={96}
          height={96}
          className="size-24"
        />
      </div>
    </NodeViewWrapper>
  );
}

/** React NodeView для блока product с меню команд */
export const ProductWidget = withBlockPluginWrapper(ProductWidgetInner);
