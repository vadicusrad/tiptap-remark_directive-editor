import { createContainerPlugin, createSlashInsert } from "../plugin-factories";
import { LeadExtension } from "./lead.extention";

/** Конфиг плагина Lead: блок lead (:::lead). Markdown: containerDirective */
export const leadConfig = createContainerPlugin({
  name: "lead",
  pmType: "lead",
  extensions: [LeadExtension],
  slashMenu: createSlashInsert({
    title: "Lead",
    keywords: ["lead", "lead"],
    insertContent: {
      type: "lead",
      content: [{ type: "paragraph" }],
    },
  }),
});
