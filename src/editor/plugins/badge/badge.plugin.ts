/** Плагин Badge: inline-метка (:badge[текст]) */
import { registerDirective } from "@/editor/directives/registry";
import { BadgeWidget } from "./badge.widget";
import { Editor } from "@tiptap/core";

const BADGE_TYPES = [
  { type: "error", label: "Error" },
  { type: "success", label: "Success" },
  { type: "warning", label: "Warning" },
  { type: "info", label: "Info" },
] as const;

const customCommands = BADGE_TYPES.map(({ type, label }) => ({
  id: `changeBadgeType${type}`,
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
      .updateAttributes("directiveText", {
        props: { ...props, badgeType: type },
      })
      .run();
  },
  isActive: (editor: Editor, getPos: () => number | undefined) => {
    const pos = getPos();
    if (pos === undefined) return false;
    const node = editor.state.doc.resolve(pos).nodeAfter;
    if (!node) return false;
    return (node.attrs.props as Record<string, unknown>)?.badgeType === type;
  },
}));

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
        attrs: {
          name: "badge",
          props: {
            badgeType: "info",
          },
        },
        content: [{ type: "text", text: " " }],
      })
      .setTextSelection(from + 1)
      .run();
  },
  customCommands: [...customCommands],
});
