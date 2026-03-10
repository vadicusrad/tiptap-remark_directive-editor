"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "@/editor/core/extensions";
import { EditorToolbar } from "./EditorToolbar";
import { pmToMdast } from "@/editor/markdown/pmToMdast";
import { serializeMarkdown } from "@/editor/markdown/serializeMarkdown";
import type { JSONContent } from "@tiptap/core";
import type { PMNode } from "@/editor/plugins/plugin-types";

/**
 * @property content - начальный контент в формате TipTap JSON
 * @property onSave - callback при сохранении, получает Markdown
 */
type EditorProps = {
  content?: JSONContent;
  onSave?: (markdown: string) => void;
};

/**
 * WYSIWYG-редактор Markdown с поддержкой директив (alert, badge, tooltip и др).
 * Контент хранится как ProseMirror-документ, при сохранении сериализуется в Markdown.
 *
 * @example
 * <Editor content={initialContent} onSave={(md) => console.log(md)} />
 */
export function Editor({ content, onSave }: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: content ?? undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
  });

  const handleSave = async () => {
    if (!editor || !onSave) return;
    setIsSaving(true);
    try {
      const doc = editor.state.doc.toJSON() as PMNode;
      const mdast = await pmToMdast(doc);
      const markdown = serializeMarkdown(mdast);
      onSave(markdown);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      {onSave && (
        <div className="border-t p-2 bg-gray-50">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Сохранить"
          >
            {isSaving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
