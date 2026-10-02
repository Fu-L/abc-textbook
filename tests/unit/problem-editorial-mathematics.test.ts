import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const dfaDocument = await readFile(
  'src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc418-g.md',
  'utf8',
);
type Machine = readonly (readonly [number, number, number])[];
const machines = new Map<string, Machine>();
const required = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('Incomplete textbook DFA table');
  return value;
};
const at = <T>(items: readonly T[], index: number): T => required(items[index]);
for (const line of dfaDocument.split('\n')) {
  const row = /^\| ([01]{4}) \| (.+) \|$/u.exec(line);
  if (!row) continue;
  const states: [number, number, number][] = [];
  for (const entry of at(row, 2).matchAll(/(\d+):\((\d+),(\d+),([01])\)/gu)) {
    expect(Number(entry[1])).toBe(states.length);
    states.push([Number(entry[2]), Number(entry[3]), Number(entry[4])]);
  }
  machines.set(at(row, 1), states);
}

// Verify the grammar equations on the actual textbook tables. This proves all
// word lengths, unlike comparing only a finite set of short strings with a DP.
describe('ABC418 G textbook DFA tables', () => {
  it('satisfies L_b = {b} union all L_a L_c with f(a,c)=b for all 16 operations', () => {
    expect(machines.size).toBe(16);
    let reached = 0;
    for (const [operation, one] of machines) {
      const opposite = [3, 2, 1, 0].map((i) => 1 - Number(operation[i])).join('');
      const zero = required(machines.get(opposite)).map(
        ([a, b, accept]) => [b, a, accept] as const,
      );
      const language = [zero, one];
      for (let result = 0; result < 2; result++) {
        const pairs: [number, number][] = [];
        for (let a = 0; a < 2; a++) {
          for (let c = 0; c < 2; c++) {
            if (Number(operation[2 * a + c]) === result) pairs.push([a, c]);
          }
        }
        // NFA state: branch, concatenation half, DFA state. Branch -1 accepts
        // only the one-letter word {b}; epsilon edges join the two languages.
        type State = readonly [number, number, number];
        const closure = (states: readonly State[]): State[] => {
          const expanded = [...states];
          for (const [branch, half, q] of states) {
            if (branch >= 0 && half === 0 && at(at(at(language, at(pairs, branch)[0]), q), 2)) {
              expanded.push([branch, 1, 0]);
            }
          }
          return [...new Map(expanded.map((s) => [s.join(','), s])).values()].sort((a, b) =>
            a.join(',').localeCompare(b.join(',')),
          );
        };
        const advance = (states: readonly State[], letter: number): State[] => {
          const next: State[] = [];
          for (const [branch, half, q] of states) {
            if (branch === -1) {
              if (q === 0 && letter === result) next.push([-1, 0, 1]);
            } else {
              next.push([
                branch,
                half,
                at(at(at(language, at(at(pairs, branch), half)), q), letter),
              ]);
            }
          }
          return closure(next);
        };
        const accepting = (states: readonly State[]): boolean =>
          states.some(([branch, half, q]) =>
            branch === -1
              ? q === 1
              : half === 1 && Boolean(at(at(at(language, at(pairs, branch)[1]), q), 2)),
          );
        const start = closure([[-1, 0, 0], ...pairs.map((_, i): State => [i, 0, 0])]);
        const queue: [number, State[]][] = [[0, start]];
        const key = (q: number, states: readonly State[]): string => JSON.stringify([q, states]);
        const seen = new Set([key(0, start)]);
        for (const [q, states] of queue) {
          expect(
            Boolean(at(at(at(language, result), q), 2)),
            `${operation}, result=${String(result)}, q=${String(q)}`,
          ).toBe(accepting(states));
          for (let letter = 0; letter < 2; letter++) {
            const nq = at(at(at(language, result), q), letter);
            const ns = advance(states, letter);
            const identity = key(nq, ns);
            if (!seen.has(identity)) {
              seen.add(identity);
              queue.push([nq, ns]);
            }
          }
        }
        reached += seen.size;
      }
    }
    expect(reached).toBe(498);
  });
});
