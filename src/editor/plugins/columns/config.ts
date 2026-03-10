import type { RootContent } from "mdast";
import type { ContainerDirective } from "mdast-util-directive";
import {
  createContainerPlugin,
  createSlashInsert,
} from "../plugin-factories";
import type { MdastHelpers, PMNode } from "../plugin-types";
import { ColumnExtension } from "./column.extension";
import { ColumnsExtension } from "./columns.extension";

function columnsMdastToPm(
  node: ContainerDirective,
  helpers: MdastHelpers
): PMNode | null {
  const columnNodes = (node.children ?? []).filter(
    (c): c is ContainerDirective =>
      c.type === "containerDirective" && c.name === "column"
  );
  const toColumnContent = (colNode: ContainerDirective) =>
    (colNode.children ?? []).flatMap((c: RootContent) => {
      const n = helpers.convertBlockContent(c);
      return n ? [n] : [];
    });
  const col1 =
    columnNodes[0] && toColumnContent(columnNodes[0]).length
      ? toColumnContent(columnNodes[0])
      : [{ type: "paragraph" }];
  const col2 =
    columnNodes[1] && toColumnContent(columnNodes[1]).length
      ? toColumnContent(columnNodes[1])
      : [{ type: "paragraph" }];
  return {
    type: "columns",
    content: [
      { type: "column", content: col1 },
      { type: "column", content: col2 },
    ],
  };
}

/** Конфиг плагина Column: одна колонка внутри columns (:::column) */
export const columnConfig = createContainerPlugin({
  name: "column",
  pmType: "column",
  extensions: [],
});

/** Конфиг плагина Columns: блок с двумя колонками (::::columns) */
export const columnsConfig = createContainerPlugin({
  name: "columns",
  pmType: "columns",
  extensions: [ColumnExtension, ColumnsExtension],
  customMdastToPm: columnsMdastToPm,
  slashMenu: createSlashInsert({
    title: "Columns",
    keywords: ["columns", "колонки", "column"],
    insertContent: {
      type: "columns",
      content: [
        { type: "column", content: [{ type: "paragraph" }] },
        { type: "column", content: [{ type: "paragraph" }] },
      ],
    },
  }),
});
