import { createSlashInsert, createTextPlugin } from "../plugin-factories";
import type { LeafDirective } from "mdast-util-directive";
import type { MdastHelpers, PMNode } from "../plugin-types";
import { BadgeExtension } from "./badge.extension";

function badgeLeafMdastToPm(
  node: LeafDirective,
  helpers: MdastHelpers
): PMNode | null {
  const inlineContent =
    (node.children ?? []).length > 0
      ? helpers.convertParagraphContent(node.children ?? [])
      : [{ type: "text", text: (node.attributes?.label as string) ?? "" }];
  return {
    type: "paragraph",
    content: [
      {
        type: "badge",
        content:
          inlineContent.length > 0
            ? inlineContent
            : [{ type: "text", text: "" }],
      },
    ],
  };
}

/** Конфиг плагина Badge: inline-метка (:badge[текст] или ::badge[текст]) */
export const badgeConfig = createTextPlugin({
  name: "badge",
  pmType: "badge",
  extensions: [BadgeExtension],
  leafMdastToPm: badgeLeafMdastToPm,
  slashMenu: createSlashInsert({
    title: "Badge",
    keywords: ["badge", "бейдж", "метка"],
    insertContent: { type: "badge", content: [{ type: "text", text: " " }] },
    afterInsert: (ed, from) =>
      ed
        .chain()
        .setTextSelection(from + 1)
        .run(),
  }),
});
