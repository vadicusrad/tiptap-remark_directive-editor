"use client";

import { useMemo, useState } from "react";
import { Editor } from "@/components/Editor/Editor";
import { parseMarkdown } from "@/editor/markdown/parseMarkdown";
import { mdastToPm } from "@/editor/markdown/mdastToPm";

const EXAMPLE_MARKDOWN = `# Демо

:::lead
Это блок lead.
:::

:::product{id="123"}

:::

Параграф с **жирным**, *курсивом*, \`inline code\` и [ссылкой](https://example.com).

:::alert{type="info"}
Информационный блок
:::

:::alert{type="warning"}
Предупреждение
:::

:::alert{type="success"}
Успех
:::

:::alert{type="error"}
Ошибка
:::

Метки: :badge[inline]{badgeType="error"} и :badge[New]{badgeType="success"}. Подсказка: :tooltip[наведи]{content="Привет!"}.

::badge[Block badge]

> Цитата

\`\`\`js
const x = 1;
\`\`\`

- Маркированный список
- Второй пункт

1. Нумерованный список
2. Второй пункт
`;

export default function Home() {
  const [savedMarkdown, setSavedMarkdown] = useState<string | null>(null);

  const initialContent = useMemo(() => {
    const tree = parseMarkdown(EXAMPLE_MARKDOWN);
    const pmDoc = mdastToPm(tree);
    return pmDoc;
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Markdown Editor</h1>
      <Editor content={initialContent} onSave={setSavedMarkdown} />
      {savedMarkdown !== null && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Сохранённый Markdown:</h2>
          <pre className="bg-gray-100  p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
            {savedMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
}
