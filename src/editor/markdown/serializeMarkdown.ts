import { unified } from "unified";
import remarkDirective from "remark-directive";
import remarkStringify from "remark-stringify";
import type { Root } from "mdast";

/**
 * Сериализует MDAST-дерево обратно в Markdown-строку.
 * Использует remark-directive для корректного вывода директив.
 *
 * @param tree - MDAST дерево (Root)
 * @returns Markdown-строка
 */
export function serializeMarkdown(tree: Root): string {
  return unified()
    .use(remarkDirective)
    .use(remarkStringify)
    .stringify(tree);
}
