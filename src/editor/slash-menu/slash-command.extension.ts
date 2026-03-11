import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import {
  SLASH_MENU_ITEMS,
  filterSlashMenuItems,
  type SlashMenuItem,
} from "./slash-menu-items";
import { SlashMenuList } from "./SlashMenuList";

/**
 * TipTap extension: slash-меню при вводе "/".
 * Показывает пункты из SLASH_MENU_ITEMS, фильтрация по title/keywords.
 */
export const SlashCommandExtension = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      Suggestion<SlashMenuItem, SlashMenuItem>({
        editor,
        char: "/",
        allowSpaces: true,
        items: ({ query }) => filterSlashMenuItems(SLASH_MENU_ITEMS, query),
        command: ({ editor: ed, range, props }) => {
          ed.chain().focus().deleteRange(range).run();
          props.onSelect(ed);
        },
        render: () => {
          let renderer: ReactRenderer | null = null;
          let selectedIndex = 0;

          return {
            onStart: (props) => {
              selectedIndex = 0;
              renderer = new ReactRenderer(SlashMenuList, {
                editor,
                props: {
                  items: props.items,
                  selectedIndex: 0,
                  onSelect: (item: SlashMenuItem) => {
                    props.command(item);
                  },
                  clientRect: props.clientRect ?? null,
                },
              });
              document.body.appendChild(renderer.element);
            },
            onUpdate: (props) => {
              if (!renderer) return;
              selectedIndex = Math.min(selectedIndex, props.items.length - 1);
              if (selectedIndex < 0) selectedIndex = 0;
              renderer.updateProps({
                items: props.items,
                selectedIndex,
                onSelect: (item: SlashMenuItem) => {
                  props.command(item);
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onExit: () => {
              renderer?.destroy();
              renderer = null;
            },
            onKeyDown: (props) => {
              if (!renderer) return false;
              const { event } = props;
              const items = (renderer.props as { items: SlashMenuItem[] }).items;

              if (event.key === "ArrowDown") {
                selectedIndex = (selectedIndex + 1) % items.length;
                renderer.updateProps({ selectedIndex });
                return true;
              }
              if (event.key === "ArrowUp") {
                selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
                renderer.updateProps({ selectedIndex });
                return true;
              }
              if (event.key === "Enter") {
                const item = items[selectedIndex];
                if (item) {
                  editor.chain().focus().deleteRange(props.range).run();
                  item.onSelect(editor);
                }
                return true;
              }
              return false;
            },
          };
        },
      }),
    ];
  },
});
