"use client";

import React, { forwardRef } from "react";
import type { NodeViewProps } from "@tiptap/core";
import { BlockPluginWrapper } from "./BlockPluginWrapper";
import type { BlockPluginCommand } from "./types";

type WithBlockPluginWrapperOptions = {
  customCommands?: BlockPluginCommand[];
};

/**
 * HOC: оборачивает компонент в BlockPluginWrapper с меню блока.
 * @param Component - виджет плагина
 * @param options.customCommands - кастомные команды в меню
 */
export function withBlockPluginWrapper<P extends NodeViewProps>(
  Component: React.ComponentType<P>,
  options?: WithBlockPluginWrapperOptions
) {
  const WrappedComponent = forwardRef<HTMLElement, P>((props, ref) => (
    <BlockPluginWrapper
      ref={ref}
      editor={props.editor}
      getPos={props.getPos}
      deleteNode={props.deleteNode}
      node={props.node}
      customCommands={options?.customCommands}
    >
      <Component {...(props as P)} />
    </BlockPluginWrapper>
  ));
  WrappedComponent.displayName = `WithBlockPluginWrapper(${
    Component.displayName ?? Component.name ?? "Component"
  })`;
  return WrappedComponent;
}
