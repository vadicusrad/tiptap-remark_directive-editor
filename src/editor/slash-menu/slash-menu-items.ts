import type { Editor } from "@tiptap/core";
import { allSlashMenuItems } from "@/editor/plugins/registry";

/**
 * Пункт slash-меню.
 * @property id - уникальный идентификатор
 * @property title - отображаемое название
 * @property keywords - ключевые слова для поиска
 * @property onSelect - callback при выборе, вставляет ноду в редактор
 */
export interface SlashMenuItem {
  id: string;
  title: string;
  keywords: string[];
  onSelect: (editor: Editor) => void;
}

/** Пункты slash-меню из реестра плагинов */
export const SLASH_MENU_ITEMS: SlashMenuItem[] = allSlashMenuItems;

/**
 * Фильтрует пункты меню по поисковому запросу (title и keywords).
 * @param items - массив пунктов
 * @param query - строка поиска
 * @returns отфильтрованный массив
 */
export function filterSlashMenuItems(
  items: SlashMenuItem[],
  query: string
): SlashMenuItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
