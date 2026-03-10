import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { LeadWidget } from "./lead.nodeview";

/** Расширение TipTap: блок lead (:::lead). Markdown: containerDirective */
export const LeadExtension = Node.create({
  name: "lead",
  group: "block",
  content: "block+",
  parseHTML() {
    return [{ tag: "div[data-lead]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-lead": "" }, 0];
  },
  addAttributes() {
    return {};
  },
  addNodeView() {
    return ReactNodeViewRenderer(LeadWidget);
  },
});
