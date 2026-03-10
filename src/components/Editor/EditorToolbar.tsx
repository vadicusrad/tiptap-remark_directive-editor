"use client";

import type { Editor } from "@tiptap/core";

/** @property editor - экземпляр TipTap Editor или null */
type EditorToolbarProps = {
  editor: Editor | null;
};

/** Кнопка тулбара с поддержкой активного состояния */
function ToolbarButton({
  onClick,
  isActive,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded hover:bg-gray-200 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Тулбар редактора: форматирование (bold, italic, code), блоки (paragraph, heading, blockquote, code),
 * списки, ссылки.
 */
export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Введите URL", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50 ">
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          ariaLabel="Жирный"
        >
          <span className="font-bold text-sm">Ж</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          ariaLabel="Курсив"
        >
          <span className="italic text-sm">К</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          ariaLabel="Код"
        >
          <code className="text-xs px-1">&lt;/&gt;</code>
        </ToolbarButton>
      </div>
      <div className="w-px bg-gray-300 dark:bg-gray-600 self-stretch" />
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          ariaLabel="Параграф"
        >
          <span className="text-sm">P</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          ariaLabel="Заголовок 1"
        >
          <span className="text-sm font-semibold">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          ariaLabel="Заголовок 2"
        >
          <span className="text-sm font-semibold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          ariaLabel="Заголовок 3"
        >
          <span className="text-sm font-semibold">H3</span>
        </ToolbarButton>
      </div>
      <div className="w-px bg-gray-300 dark:bg-gray-600 self-stretch" />
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          ariaLabel="Цитата"
        >
          <span className="text-sm">&ldquo;</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          ariaLabel="Код-блок"
        >
          <code className="text-xs">{"{}"}</code>
        </ToolbarButton>
      </div>
      <div className="w-px bg-gray-300 dark:bg-gray-600 self-stretch" />
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          ariaLabel="Маркированный список"
        >
          <span className="text-sm">•</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          ariaLabel="Нумерованный список"
        >
          <span className="text-sm">1.</span>
        </ToolbarButton>
      </div>
      <div className="w-px bg-gray-300 dark:bg-gray-600 self-stretch" />
      <ToolbarButton
        onClick={handleLink}
        isActive={editor.isActive("link")}
        ariaLabel="Ссылка"
      >
        <span className="text-sm underline">Link</span>
      </ToolbarButton>
    </div>
  );
}
