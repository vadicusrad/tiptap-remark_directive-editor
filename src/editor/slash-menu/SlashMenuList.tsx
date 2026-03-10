"use client";

import { useEffect, useRef } from "react";
import type { SlashMenuItem } from "./slash-menu-items";

/**
 * @property items - отфильтрованные пункты меню
 * @property selectedIndex - индекс выбранного пункта (для клавиатуры)
 * @property onSelect - callback при выборе пункта
 * @property clientRect - функция получения координат для позиционирования
 */
type SlashMenuListProps = {
  items: SlashMenuItem[];
  selectedIndex: number;
  onSelect: (item: SlashMenuItem) => void;
  clientRect: (() => DOMRect | null) | null;
};

/** Выпадающий список slash-меню. Позиционируется под курсором, поддерживает клавиатуру */
export function SlashMenuList({
  items,
  selectedIndex,
  onSelect,
  clientRect,
}: SlashMenuListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const item = el.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (items.length === 0) return null;

  const rect = clientRect?.();
  if (!rect) return null;

  return (
    <ul
      ref={listRef}
      className="fixed z-50 max-h-72 w-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{
        left: rect.left,
        top: rect.bottom + 4,
      }}
      role="listbox"
      aria-activedescendant={items[selectedIndex]?.id}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          id={item.id}
          role="option"
          aria-selected={index === selectedIndex}
          className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
            index === selectedIndex
              ? "bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
}
