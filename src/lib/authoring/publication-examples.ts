import type { ProblemAuthoringUnit } from '../domain/schema-parts/authoring-unit.js';

/** Current prose must be covered by successful examples, independently of old inventories. */
export const validatePublicationExamples = (
  body: string,
  examples: readonly Pick<
    ProblemAuthoringUnit['examples'][number],
    'key' | 'kind' | 'language' | 'verificationStatus'
  >[],
  fail: (reason: string) => never,
): void => {
  const available = new Map<string, number>();
  for (const example of examples) {
    if (example.kind !== 'executable') continue;
    if (example.verificationStatus !== 'passed') fail(`EXAMPLE_HOLD:${example.key}`);
    const language = example.language.toLowerCase();
    available.set(language, (available.get(language) ?? 0) + 1);
  }
  let openFence: string | undefined;
  for (const line of body.split(/\r?\n/u)) {
    const match = /^[ \t]*(?<fence>`{3,}|~{3,})(?<info>[^\r\n]*)$/u.exec(line);
    const fence = match?.groups?.fence;
    if (!fence) continue;
    const info = match.groups?.info?.trim() ?? '';
    if (openFence) {
      if (fence.startsWith(openFence.charAt(0)) && fence.length >= openFence.length && !info)
        openFence = undefined;
      continue;
    }
    openFence = fence;
    const language = info.split(/\s/u)[0]?.toLowerCase() ?? '';
    if (!language || ['text', 'plaintext', 'pseudo', 'pseudocode', 'math'].includes(language))
      continue;
    const remaining = available.get(language) ?? 0;
    if (!remaining) fail(`UNREGISTERED_EXECUTABLE:${language}`);
    available.set(language, remaining - 1);
  }
};
