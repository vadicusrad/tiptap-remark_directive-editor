import { registerDirective } from "@/editor/directives/registry";
import { LeadWidget } from "./lead.widget";

registerDirective({
  name: "lead",
  type: "container",
  component: LeadWidget,
  slashCommand: true,
  slashMenu: { title: "Lead", keywords: ["lead", "лид"] },
  onSlashSelect: (editor) => {
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "directiveContainer",
        attrs: { name: "lead", props: {} },
        content: [{ type: "paragraph" }],
      })
      .setTextSelection(from + 1)
      .run();
  },
});
