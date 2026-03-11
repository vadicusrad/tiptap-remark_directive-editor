import type { Editor } from "@tiptap/core";

/**
 * Команда в меню блока (BlockPluginWrapper).
 * @property id - идентификатор (может повторяться у нескольких команд)
 * @property label - текст в меню
 * @property onClick - выполняется при клике
 * @property isActive - опционально, для подсветки активного пункта
 */
export interface BlockPluginCommand {
  id: string;
  label: string;
  onClick: (editor: Editor, getPos: () => number | undefined) => void;
  isActive?: (editor: Editor, getPos: () => number | undefined) => boolean;
}
