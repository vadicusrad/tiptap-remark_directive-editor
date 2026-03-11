import type { Editor } from "@tiptap/core";
import type { AnyExtension } from "@tiptap/core";
import {
  DirectiveLeafExtension,
  DirectiveContainerExtension,
  DirectiveTextExtension,
  getAllDirectives,
} from "@/editor/directives";

import "./alert/alert.plugin";
import "./lead/lead.plugin";
import "./tooltip/tooltip.plugin";
import "./badge/badge.plugin";
import "./product/product.plugin";

/** Все TipTap extensions */
export const allExtensions: AnyExtension[] = [
  DirectiveLeafExtension,
  DirectiveContainerExtension,
  DirectiveTextExtension,
];

/** Пункты slash-меню из registerDirective */
export const allSlashMenuItems: {
  id: string;
  title: string;
  keywords: string[];
  onSelect: (editor: Editor) => void;
}[] = [
  ...getAllDirectives()
    .filter((d) => d.slashCommand && d.slashMenu)
    .map((d) => ({
      id: `directive-${d.name}-${d.type}`,
      title: d.slashMenu!.title,
      keywords: d.slashMenu!.keywords,
      onSelect: (editor: Editor) => {
        if (d.onSlashSelect) {
          d.onSlashSelect(editor);
          return;
        }
        const props = d.defaultProps ?? {};
        const { from } = editor.state.selection;
        const nodeType =
          d.type === "leaf"
            ? "directiveLeaf"
            : d.type === "container"
              ? "directiveContainer"
              : "directiveText";
        const content =
          d.type === "container"
            ? [{ type: "paragraph" }]
            : d.type === "text"
              ? [{ type: "text", text: " " }]
              : undefined;
        editor
          .chain()
          .focus()
          .insertContent({
            type: nodeType,
            attrs: { name: d.name, props },
            ...(content && { content }),
          })
          .setTextSelection(from + 1)
          .run();
      },
    })),
];
