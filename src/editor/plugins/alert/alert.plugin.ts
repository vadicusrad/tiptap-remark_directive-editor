/**
 * Плагин Alert: блок-уведомление (:::alert{type} ... :::).
 * Типы: info, warning, success, error. Custom commands для смены типа.
 */
import { registerDirective } from "@/editor/directives/registry";
import { AlertWidget } from "./alert.widget";
import { Editor } from "@tiptap/core";

const ALERT_TYPES = [
  { type: "error", label: "Error" },
  { type: "success", label: "Success" },
  { type: "warning", label: "Warning" },
  { type: "info", label: "Info" },
] as const;

const customCommands = ALERT_TYPES.map(({ type, label }) => ({
  id: `changeAlertType${type}`,
  label,
  onClick: (editor: Editor, getPos: () => number | undefined) => {
    const pos = getPos();
    if (pos === undefined) return;
    const node = editor.state.doc.resolve(pos).nodeAfter;
    if (!node) return;
    const props = (node.attrs.props as Record<string, unknown>) ?? {};
    editor
      .chain()
      .setNodeSelection(pos)
      .updateAttributes("directiveContainer", {
        props: { ...props, type },
      })
      .run();
  },
  isActive: (editor: Editor, getPos: () => number | undefined) => {
    const pos = getPos();
    if (pos === undefined) return false;
    const node = editor.state.doc.resolve(pos).nodeAfter;
    if (!node) return false;
    return (node.attrs.props as Record<string, unknown>)?.type === type;
  },
}));

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
  customCommands: [...customCommands],
});
