import { createTextPlugin } from "../plugin-factories";
import type { PluginConfig } from "../plugin-types";
import { TooltipExtension } from "./tooltip.extension";

/** Конфиг плагина Tooltip: inline-подсказка (:tooltip[текст]{content="..."}) */
export const tooltipConfig: PluginConfig = {
  ...createTextPlugin({
    name: "tooltip",
    pmType: "tooltip",
    extensions: [TooltipExtension],
    attrsFromMdast: (n) => ({ content: n.attributes?.content ?? "" }),
    attrsFromPm: (n) => ({ content: (n.attrs?.content as string) ?? "" }),
  }),
  slashMenu: {
    title: "Tooltip",
    keywords: ["tooltip", "тултип", "подсказка"],
    onSelect: (editor) => {
      const visibleText = window.prompt("Видимый текст:", "");
      if (visibleText === null) return;
      const tooltipContent = window.prompt("Текст подсказки:", "");
      if (tooltipContent === null) return;
      const { from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .insertContent({
          type: "tooltip",
          attrs: { content: tooltipContent },
          content: [{ type: "text", text: visibleText }],
        })
        .setTextSelection(from + 1)
        .run();
    },
  },
};
