import type { Editor } from "@tiptap/core";

export interface BlockPluginCommand {
  id: string;
  label: string;
  onClick: (editor: Editor, getPos: () => number | undefined) => void;
}
