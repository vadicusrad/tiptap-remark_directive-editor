import type { Editor } from "@tiptap/core";
import type { AnyExtension } from "@tiptap/core";
import type { PluginConfig } from "./plugin-types";
import { alertConfig } from "./alert/config";
import { badgeConfig } from "./badge/config";
import { columnConfig, columnsConfig } from "./columns/config";
import { tooltipConfig } from "./tooltip/config";
import { leadConfig } from "./lead/config";

/** Все конфиги плагинов. Добавление плагина = импорт + добавление в массив */
const PLUGIN_CONFIGS: PluginConfig[] = [
  alertConfig,
  leadConfig,
  badgeConfig,
  columnConfig,
  columnsConfig,
  tooltipConfig,
];

const CONTAINER_PLUGINS = new Map<string, PluginConfig>();
const TEXT_PLUGINS = new Map<string, PluginConfig>();
const LEAF_PLUGINS = new Map<string, PluginConfig>();
const PM_TO_MDAST = new Map<string, PluginConfig>();

for (const config of PLUGIN_CONFIGS) {
  for (const dt of config.directiveTypes) {
    if (dt === "container") CONTAINER_PLUGINS.set(config.name, config);
    if (dt === "text") TEXT_PLUGINS.set(config.name, config);
    if (dt === "leaf") LEAF_PLUGINS.set(config.name, config);
  }
  if (config.pmToMdast || config.pmToPhrasing) {
    PM_TO_MDAST.set(config.pmType, config);
  }
}

/** Все TipTap extensions из зарегистрированных плагинов */
export const allExtensions: AnyExtension[] = PLUGIN_CONFIGS.flatMap(
  (c) => c.extensions
);

/** Пункты slash-меню из плагинов с slashMenu */
export const allSlashMenuItems: {
  id: string;
  title: string;
  keywords: string[];
  onSelect: (editor: Editor) => void;
}[] = PLUGIN_CONFIGS.flatMap((c) =>
  c.slashMenu
    ? [
        {
          id: c.pmType,
          title: c.slashMenu.title,
          keywords: c.slashMenu.keywords,
          onSelect: c.slashMenu.onSelect,
        },
      ]
    : []
);

/**
 * Возвращает конфиг плагина для containerDirective по имени директивы.
 * @param name - имя директивы (alert, columns, column)
 */
export function getContainerConverter(name: string): PluginConfig | undefined {
  return CONTAINER_PLUGINS.get(name);
}

/**
 * Возвращает конфиг плагина для textDirective по имени директивы.
 * @param name - имя директивы (tooltip, badge)
 */
export function getTextConverter(name: string): PluginConfig | undefined {
  return TEXT_PLUGINS.get(name);
}

/**
 * Возвращает конфиг плагина для leafDirective по имени директивы.
 * @param name - имя директивы (badge)
 */
export function getLeafConverter(name: string): PluginConfig | undefined {
  return LEAF_PLUGINS.get(name);
}

/**
 * Возвращает конфиг плагина для конвертации PM → MDAST по типу ноды.
 * @param pmType - тип ноды ProseMirror (alert, badge, tooltip, columns, column)
 */
export function getPmToMdastConverter(
  pmType: string
): PluginConfig | undefined {
  return PM_TO_MDAST.get(pmType);
}
