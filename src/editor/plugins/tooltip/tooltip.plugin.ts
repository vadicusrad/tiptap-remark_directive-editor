/** Плагин Tooltip: inline-подсказка (:tooltip[текст]{content="..."}) */
import { registerDirective } from "@/editor/directives/registry";
import { TooltipWidget } from "./tooltip.widget";
import { Editor } from "@tiptap/core";

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
  customCommands: [
    {
      id: "changeTooltipContent",
      label: "Изменить подсказку",
      onClick: (editor: Editor, getPos: () => number | undefined) => {
        const pos = getPos();
        if (pos === undefined) return;
        const node = editor.state.doc.resolve(pos).nodeAfter;
        if (!node) return;
        const props = (node.attrs.props as Record<string, unknown>) ?? {};
        const currentContent = (props.content as string) ?? "";
        const content = window.prompt("Текст подсказки:", currentContent);
        if (content === null || content === "") return;
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("directiveText", { props: { ...props, content } })
          .run();
      },
    },
  ],
});
