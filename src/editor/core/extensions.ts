import StarterKit from "@tiptap/starter-kit";
import { allExtensions } from "@/editor/plugins/registry";
import { SlashCommandExtension } from "@/editor/slash-menu/slash-command.extension";

/** Массив расширений TipTap: StarterKit + плагины из реестра + slash-меню */
export const editorExtensions = [
  StarterKit,
  ...allExtensions,
  SlashCommandExtension,
];
