import { describe, expect, it } from 'vitest';

const permutations = (values: number[]): number[][] =>
  values.length
    ? values.flatMap((v, i) =>
        permutations(values.filter((_, j) => i !== j)).map((rest) => [v, ...rest]),
      )
    : [[]];
const mod = (x: number, m: number) => ((x % m) + m) % m;
describe('independent mathematical checks for catch-up explanations', () => {
  it('ABC476 F rotated-axis aggregation matches direct weighted Chebyshev sums', () => {
    for (let n = 1; n <= 8; n++)
      for (let seed = 1; seed <= 8; seed++) {
        const m = seed + 2;
        const weights = Array.from({ length: n }, (_, i) =>
          Array.from({ length: n }, (_, j) => ((i + 1) * (j + seed)) % m),
        );
        const u = Array<number>(2 * n + 1).fill(0),
          v = Array<number>(2 * n + 1).fill(0);
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const weight = weights[i]?.[j] ?? 0;
            u[i + j] = (u[i + j] ?? 0) + weight;
            v[i - j + n] = (v[i - j + n] ?? 0) + weight;
          }
        const distance = (w: number[], x: number) => {
          const left = w.slice(0, x).reduce((sum, weight, t) => sum + weight * (x - t), 0);
          const right = w.slice(x).reduce((sum, weight, t) => sum + weight * t, 0);
          return left + right;
        };
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const expected = weights.reduce(
              (sum, row, r) =>
                sum +
                row.reduce(
                  (subtotal, weight, c) =>
                    subtotal + weight * Math.max(Math.abs(r - i), Math.abs(c - j)),
                  0,
                ),
              0,
            );
            expect((distance(u, i + j) + distance(v, i - j + n)) / 2).toBe(expected);
          }
      }
  });
  it('ABC478 G crossing-hull candidates have the same boundary as all ordered pairs', () => {
    type Point = [number, number];
    const cross = (a: Point, b: Point, c: Point) =>
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const hull = (points: Point[]): Point[] => {
      const sorted = points
        .slice()
        .sort((a, b) => a[0] - b[0] || a[1] - b[1])
        .filter((p, i, a) => i === 0 || p[0] !== a[i - 1]?.[0] || p[1] !== a[i - 1]?.[1]);
      if (sorted.length <= 1) return sorted;
      const chain = (ps: Point[]) => {
        const result: Point[] = [];
        for (const p of ps) {
          while (result.length >= 2) {
            const a = result.at(-2),
              b = result.at(-1);
            if (!a || !b || cross(a, b, p) > 0) break;
            result.pop();
          }
          result.push(p);
        }
        return result.slice(0, -1);
      };
      return [...chain(sorted), ...chain(sorted.slice().reverse())];
    };
    const combine = (a: Point, b: Point, p: number, q: number): Point => [
      q * a[0] + p * b[0],
      q * a[1] + p * b[1],
    ];
    for (let n = 2; n <= 10; n++)
      for (let seed = 0; seed < 20; seed++) {
        const points: Point[] = Array.from({ length: n }, (_, i) => [
          ((i * i + seed * 13) % 17) - 8,
          ((i * 7 + seed * seed) % 19) - 9,
        ]);
        const candidates: Point[] = [];
        const visit = (part: Point[]) => {
          if (part.length < 2) return;
          const m = Math.floor(part.length / 2),
            left = part.slice(0, m),
            right = part.slice(m);
          const a = hull(left),
            b = hull(right);
          candidates.push(...hull(a.flatMap((x) => b.map((y) => combine(x, y, 2, 5)))));
          visit(left);
          visit(right);
        };
        visit(points);
        const direct = points.flatMap((a, i) =>
          points.slice(i + 1).map((b) => combine(a, b, 2, 5)),
        );
        expect(hull(candidates)).toEqual(hull(direct));
      }
  });
  it('ABC467 E event endpoints agree with exhaustive modular minimization', () => {
    for (let m = 1; m <= 7; m++)
      for (let n = 1; n <= 7; n++)
        for (let seed = 0; seed < 20; seed++) {
          const d = Array.from({ length: n }, (_, i) => (seed * 13 + i * i + 3 * i) % m);
          const f = (s: number) => d.reduce((sum, x, i) => sum + mod(x + (i % 2 ? -s : s), m), 0);
          const candidates = new Set([0, m - 1]);
          d.forEach((x, i) => {
            const event = i % 2 ? x + 1 : m - x;
            for (const s of [event - 1, event]) if (s >= 0 && s < m) candidates.add(s);
          });
          expect(Math.min(...[...candidates].map(f))).toBe(
            Math.min(...Array.from({ length: m }, (_, i) => f(i))),
          );
        }
  });
  it('ABC468 G irreducible block counts match every small permutation pattern', () => {
    const fact = [1];
    for (let i = 1; i <= 7; i++) fact[i] = (fact[i - 1] ?? 1) * i;
    const d = [0, 0, 2];
    for (let i = 3; i <= 7; i++) {
      d[i] = fact[i] ?? 0;
      for (let k = 2; k < i; k++) d[i] = (d[i] ?? 0) - (d[k] ?? 0) * (fact[i - k + 1] ?? 0);
    }
    for (let n = 1; n <= 7; n++) {
      const counts = new Map<string, number>();
      for (const p of permutations(Array.from({ length: n }, (_, i) => i + 1))) {
        const key = Array.from({ length: n }, (_, i) => {
          const positions = p.flatMap((v, j) => (v <= i + 1 ? [j] : []));
          return Math.max(...positions) - Math.min(...positions) === i ? 'o' : 'x';
        }).join('');
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      for (let mask = 0; mask < 2 ** n; mask++) {
        const pattern = Array.from({ length: n }, (_, i) => ((mask >> i) & 1 ? 'o' : 'x')).join('');
        let expected = pattern.startsWith('o') && pattern.at(-1) === 'o' ? 1 : 0;
        let previous = 0;
        for (let i = 1; i < n; i++)
          if (pattern[i] === 'o') {
            expected *= d[i - previous + 1] ?? 0;
            previous = i;
          }
        expect(expected, `${String(n)}:${pattern}`).toBe(counts.get(pattern) ?? 0);
      }
    }
  });
  it('ABC474 G constructs every feasible small Hamilton path with the exact right count', () => {
    for (let n = 1; n <= 13; n += 2)
      for (let k = n - 1; k <= (n * n - 1) / 2; k += 2) {
        const m = (n - 1) / 2;
        let remaining = (k - n + 1) / 2;
        const t = Array.from({ length: m }, () => {
          const take = Math.min(m, remaining);
          remaining -= take;
          return take;
        });
        // Any nonincreasing Ferrers row lengths suffice; this variant fills full rows first.
        let moves = '';
        for (const width of t) moves += 'R'.repeat(2 * width) + 'D' + 'L'.repeat(2 * width) + 'D';
        for (let j = 1; j <= m; j++) {
          const height = 2 * (m - t.filter((width) => width >= j).length);
          moves += 'R' + 'U'.repeat(height) + 'R' + 'D'.repeat(height);
        }
        let r = 0,
          c = 0;
        const visited = new Set(['0,0']);
        for (const move of moves) {
          r += move === 'D' ? 1 : move === 'U' ? -1 : 0;
          c += move === 'R' ? 1 : move === 'L' ? -1 : 0;
          expect(r >= 0 && r < n && c >= 0 && c < n).toBe(true);
          expect(visited.has(`${String(r)},${String(c)}`)).toBe(false);
          visited.add(`${String(r)},${String(c)}`);
        }
        expect([r, c, visited.size, moves.split('').filter((x) => x === 'R').length]).toEqual([
          n - 1,
          n - 1,
          n * n,
          k,
        ]);
      }
  });
  it('ABC478 F parent interval formula matches the exhaustive Prüfer-tree census', () => {
    for (let n = 2; n <= 7; n++) {
      const counts = new Map<string, number>();
      for (let code = 0; code < n ** (n - 2); code++) {
        let value = code;
        const sequence = Array.from({ length: n - 2 }, () => {
          const digit = value % n;
          value = Math.floor(value / n);
          return digit;
        });
        const degree = Array<number>(n).fill(1);
        sequence.forEach((v) => {
          degree[v] = (degree[v] ?? 0) + 1;
        });
        const graph = Array.from({ length: n }, () => [] as number[]);
        const connect = (u: number, v: number) => {
          graph[u]?.push(v);
          graph[v]?.push(u);
          degree[u] = (degree[u] ?? 0) - 1;
          degree[v] = (degree[v] ?? 0) - 1;
        };
        for (const v of sequence) {
          const leaf = degree.indexOf(1);
          connect(leaf, v);
        }
        const last = degree.flatMap((d, i) => (d === 1 ? [i] : []));
        connect(last[0] ?? 0, last[1] ?? 0);
        const available = new Set([0]),
          seen = new Set<number>();
        const order = [];
        while (available.size) {
          const v = Math.min(...available);
          available.delete(v);
          seen.add(v);
          order.push(v);
          for (const u of graph[v] ?? []) if (!seen.has(u)) available.add(u);
        }
        const key = order.join(',');
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      for (const rest of permutations(Array.from({ length: n - 1 }, (_, i) => i + 1))) {
        const q = [0, ...rest];
        let count = 1;
        for (let i = 1; i < n; i++) {
          let m = -1;
          for (let j = 0; j < i; j++) if ((q[j] ?? 0) > (q[i] ?? 0)) m = j;
          count *= i - Math.max(0, m);
        }
        expect(count, q.join(',')).toBe(counts.get(q.join(',')) ?? 0);
      }
    }
  });
});
