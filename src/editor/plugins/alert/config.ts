import {
  createContainerPlugin,
  createSlashInsert,
} from "../plugin-factories";
import { AlertExtension } from "./alert.extension";

/** Конфиг плагина Alert: блок-уведомление (:::alert{type="info"}) */
export const alertConfig = createContainerPlugin({
  name: "alert",
  pmType: "alert",
  extensions: [AlertExtension],
  attrsFromMdast: (n) => ({ type: (n.attributes?.type as string) ?? "info" }),
  attrsFromPm: (n) => ({ type: (n.attrs?.type as string) ?? "info" }),
  defaultAttrs: { type: "info" },
  slashMenu: createSlashInsert({
    title: "Alert",
    keywords: ["alert", "алерт", "предупреждение", "callout", "note"],
    insertContent: {
      type: "alert",
      attrs: { type: "info" },
      content: [{ type: "paragraph" }],
    },
  }),
});
