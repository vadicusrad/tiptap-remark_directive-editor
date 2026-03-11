import type { Editor } from "@tiptap/core";

/**
 * Команда в меню inline-плагина (InlinePluginWrapper).
 * @property id - идентификатор
 * @property label - текст в меню
 * @property onClick - выполняется при клике
 * @property isActive - опционально, для подсветки активного пункта
 */
export interface InlinePluginCommand {
  id: string;
  label: string;
  onClick: (editor: Editor, getPos: () => number | undefined) => void;
  isActive?: (editor: Editor, getPos: () => number | undefined) => boolean;
}
