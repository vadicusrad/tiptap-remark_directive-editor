import { registerDirective } from "@/editor/directives/registry";
import { AlertWidget } from "./alert.widget";
import { Editor } from "@tiptap/core";

registerDirective({
  name: "alert",
  type: "container",
  component: AlertWidget,
  defaultProps: { type: "info" },
  attrsFromMdast: (n) => ({ type: (n.attributes?.type as string) ?? "info" }),
  attrsFromPm: (n) => ({
    type:
      ((n.attrs?.props as Record<string, unknown>)?.type as string) ?? "info",
  }),
  slashCommand: true,
  slashMenu: {
    title: "Alert",
    keywords: ["alert", "алерт", "предупреждение", "callout", "note"],
  },
  onSlashSelect: (editor) => {
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "directiveContainer",
        attrs: { name: "alert", props: { type: "info" } },
        content: [{ type: "paragraph" }],
      })
      .setTextSelection(from + 1)
      .run();
  },
  customCommands: [
    {
      id: "changeAlertType",
      label: "Error",
      onClick: (editor: Editor, getPos) => {
        const pos = getPos();
        if (pos === undefined) return;
        const node = editor.state.doc.resolve(pos).nodeAfter;
        if (!node) return;
        const props = (node.attrs.props as Record<string, unknown>) ?? {};

        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("directiveContainer", {
            props: { ...props, type: "error" },
          })
          .run();
      },
    },
    {
      id: "changeAlertType",
      label: "Success",
      onClick: (editor: Editor, getPos) => {
        const pos = getPos();
        if (pos === undefined) return;
        const node = editor.state.doc.resolve(pos).nodeAfter;
        if (!node) return;
        const props = (node.attrs.props as Record<string, unknown>) ?? {};
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("directiveContainer", {
            props: { ...props, type: "success" },
          })
          .run();
      },
    },
  ],
});
