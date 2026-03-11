import { registerDirective } from "@/editor/directives/registry";
import { BadgeWidget } from "./badge.widget";

registerDirective({
  name: "badge",
  type: "text",
  component: BadgeWidget,
  slashCommand: true,
  slashMenu: { title: "Badge", keywords: ["badge", "бейдж", "метка"] },
  onSlashSelect: (editor) => {
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "directiveText",
        attrs: { name: "badge", props: {} },
        content: [{ type: "text", text: " " }],
      })
      .setTextSelection(from + 1)
      .run();
  },
});
