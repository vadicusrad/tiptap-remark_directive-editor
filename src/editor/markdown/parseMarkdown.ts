import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import type { Root } from "mdast";

/**
 * Парсит Markdown-строку в MDAST (Markdown Abstract Syntax Tree).
 * Поддерживает remark-directive для контейнерных, leaf и text директив.
 *
 * @param markdown - исходная Markdown-строка
 * @returns MDAST дерево (Root)
 */
export function parseMarkdown(markdown: string): Root {
  const tree = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .parse(markdown) as Root;
  return tree;
}
