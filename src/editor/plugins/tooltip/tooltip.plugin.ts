import { registerDirective } from "@/editor/directives/registry";
import { TooltipWidget } from "./tooltip.widget";

registerDirective({
  name: "tooltip",
  type: "text",
  component: TooltipWidget,
  attrsFromMdast: (n) => ({ content: (n.attributes?.content as string) ?? "" }),
  attrsFromPm: (n) => ({
    content:
      ((n.attrs?.props as Record<string, unknown>)?.content as string) ?? "",
  }),
  slashCommand: true,
  slashMenu: { title: "Tooltip", keywords: ["tooltip", "тултип", "подсказка"] },
  onSlashSelect: (editor) => {
    const visibleText = window.prompt("Видимый текст:", "");
    if (visibleText === null) return;
    const tooltipContent = window.prompt("Текст подсказки:", "");
    if (tooltipContent === null) return;
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "directiveText",
        attrs: { name: "tooltip", props: { content: tooltipContent } },
        content: [{ type: "text", text: visibleText }],
      })
      .setTextSelection(from + 1)
      .run();
  },
});
