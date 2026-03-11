/**
 * Упрощённое представление ноды ProseMirror в JSON-формате.
 * @property type - тип ноды
 * @property attrs - атрибуты ноды
 * @property content - дочерние ноды
 * @property text - текст (для text-ноды)
 * @property marks - марки
 */
export interface PMNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}
