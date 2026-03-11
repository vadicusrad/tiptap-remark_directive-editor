"use client";

import React, { forwardRef } from "react";
import type { NodeViewProps } from "@tiptap/core";
import { InlinePluginWrapper } from "./InlinePluginWrapper";
import type { InlinePluginCommand } from "./types";

type WithInlinePluginWrapperOptions = {
  customCommands?: InlinePluginCommand[];
};

/**
 * HOC: оборачивает компонент в InlinePluginWrapper с меню (Удалить + customCommands).
 */
export function withInlinePluginWrapper<P extends NodeViewProps>(
  Component: React.ComponentType<P>,
  options?: WithInlinePluginWrapperOptions
) {
  const WrappedComponent = forwardRef<HTMLElement, P>((props, ref) => (
    <InlinePluginWrapper
      ref={ref}
      editor={props.editor}
      getPos={props.getPos}
      deleteNode={props.deleteNode}
      node={props.node}
      customCommands={options?.customCommands}
    >
      <Component {...(props as P)} />
    </InlinePluginWrapper>
  ));
  WrappedComponent.displayName = `WithInlinePluginWrapper(${
    Component.displayName ?? Component.name ?? "Component"
  })`;
  return WrappedComponent;
}
