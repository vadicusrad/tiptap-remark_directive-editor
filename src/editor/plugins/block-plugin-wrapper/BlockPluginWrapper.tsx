"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";
import type { BlockPluginCommand } from "./types";

type BlockPluginWrapperProps = {
  children: React.ReactNode;
  editor: Editor;
  getPos: () => number | undefined;
  deleteNode: () => void;
  node: ProseMirrorNode; // required by NodeViewProps, used for type checks
  customCommands?: BlockPluginCommand[];
};

function getMoveUpTargetPos(doc: ProseMirrorNode, from: number): number | null {
  const $pos = doc.resolve(from);
  const index = $pos.index($pos.depth);
  if (index <= 0) return null;
  return $pos.posAtIndex(index - 1, $pos.depth);
}

function getMoveDownTargetPos(
  doc: ProseMirrorNode,
  from: number
): number | null {
  const $pos = doc.resolve(from);
  const index = $pos.index($pos.depth);
  const parent = $pos.parent;
  if (index >= parent.childCount - 1) return null;
  const nextSibling = parent.child(index + 1);
  return $pos.posAtIndex(index + 1, $pos.depth) + nextSibling.nodeSize;
}

export const BlockPluginWrapper = forwardRef<
  HTMLElement,
  BlockPluginWrapperProps
>(function BlockPluginWrapper(
  { children, editor, getPos, deleteNode, node: _node, customCommands = [] },
  ref
) {
  void _node; // required by NodeViewProps
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  const from = getPos();
  const canMoveUp =
    from !== undefined && getMoveUpTargetPos(editor.state.doc, from) !== null;
  const canMoveDown =
    from !== undefined && getMoveDownTargetPos(editor.state.doc, from) !== null;

  const handleMoveUp = () => {
    const pos = getPos();
    if (pos === undefined) return;
    const { doc } = editor.state;
    const $pos = doc.resolve(pos);
    const nodeToMove = $pos.nodeAfter;
    if (!nodeToMove) return;
    const targetPos = getMoveUpTargetPos(doc, pos);
    if (targetPos === null) return;
    editor
      .chain()
      .cut({ from: pos, to: pos + nodeToMove.nodeSize }, targetPos)
      .run();
    closeMenu();
  };

  const handleMoveDown = () => {
    const pos = getPos();
    if (pos === undefined) return;
    const { doc } = editor.state;
    const $pos = doc.resolve(pos);
    const nodeToMove = $pos.nodeAfter;
    if (!nodeToMove) return;
    const targetPos = getMoveDownTargetPos(doc, pos);
    if (targetPos === null) return;
    editor
      .chain()
      .cut({ from: pos, to: pos + nodeToMove.nodeSize }, targetPos)
      .command(({ tr }) => {
        const mappedTarget = tr.mapping.map(targetPos);
        tr.setSelection(
          TextSelection.create(
            tr.doc,
            Math.min(mappedTarget + 1, tr.doc.content.size - 1)
          )
        );
        return true;
      })
      .run();
    closeMenu();
  };

  const handleDelete = () => {
    deleteNode();
    closeMenu();
  };

  const handleCustomCommand = (cmd: BlockPluginCommand) => {
    cmd.onClick(editor, getPos);
    closeMenu();
  };

  return (
    <NodeViewWrapper
      ref={(el: HTMLDivElement | null) => {
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className="group relative flex w-full items-start gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute top-2 -left-4 shrink-0 transition-opacity ${
          isHovered || isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-6 w-6 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label="Меню блока"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
      </div>
      {isOpen && (
        <div
          className="absolute left-0 top-8 z-50 min-w-[160px] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
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
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleMoveUp}
            disabled={!canMoveUp}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Переместить выше
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleMoveDown}
            disabled={!canMoveDown}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Переместить ниже
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
      <div className="min-w-0 flex-1">{children}</div>
    </NodeViewWrapper>
  );
});
