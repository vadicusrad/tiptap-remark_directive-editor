"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { InlinePluginCommand } from "./types";

type InlinePluginWrapperProps = {
  children: React.ReactNode;
  editor: Editor;
  getPos: () => number | undefined;
  deleteNode: () => void;
  node: ProseMirrorNode;
  customCommands?: InlinePluginCommand[];
};

/**
 * Обёртка для inline/text-плагинов: кнопка меню (три точки), dropdown с командами
 * (Удалить, customCommands). Без перемещения вверх/вниз.
 */
export const InlinePluginWrapper = forwardRef<
  HTMLElement,
  InlinePluginWrapperProps
>(function InlinePluginWrapper(
  { children, editor, getPos, deleteNode, node: _node, customCommands = [] },
  ref
) {
  void _node;
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current?.contains(e.target as Node) === false &&
        buttonRef.current?.contains(e.target as Node) === false
      ) {
        closeMenu();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMenu]);

  const handleDelete = () => {
    deleteNode();
    closeMenu();
  };

  const handleCustomCommand = (cmd: InlinePluginCommand) => {
    cmd.onClick(editor, getPos);
    closeMenu();
  };

  return (
    <NodeViewWrapper
      as="span"
      ref={(el: HTMLSpanElement | null) => {
        (wrapperRef as React.MutableRefObject<HTMLSpanElement | null>).current =
          el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className="group relative inline-flex items-center gap-0.5 align-baseline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="min-w-0">{children}</span>
      <span
        className={`shrink-0 transition-all duration-300 ${
          isHovered || isOpen ? "opacity-100 w-5" : "opacity-0 w-0"
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-5 w-5 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label="Меню"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </button>
      </span>
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          role="menu"
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDelete}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Удалить
          </button>
          {customCommands.length > 0 && (
            <>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              {customCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleCustomCommand(cmd)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  {cmd.label}
                  {cmd.isActive && cmd.isActive(editor, getPos) && (
                    <span className="text-green-500">✓</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
});
