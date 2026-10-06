"""PR65 review 14: independent finite checks for directions and missing derivations.

Python 3.9+, standard library only. Finite checks and document synchronization
are reported separately; they do not prove all 868 textbook explanations.
"""

from bisect import bisect_left
from collections import Counter, defaultdict
from fractions import Fraction
from functools import lru_cache
from heapq import heappop, heappush
from itertools import combinations, combinations_with_replacement, permutations, product
from math import comb, factorial
from pathlib import Path
import json
import random


MOD = 998244353
COUNTS = Counter()
RNG = random.Random(6514)


def checked(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    COUNTS[name] += 1


def mod_fraction(value):
    return value.numerator % MOD * pow(value.denominator, -1, MOD) % MOD


class Components:
    def __init__(self, parent):
        self.parent = parent
        self.root = list(range(len(parent)))
        self.size = [1] * len(parent)
        self.top = list(range(len(parent)))
        self.merges = 0

    def find(self, x):
        while x != self.root[x]:
            self.root[x] = self.root[self.root[x]]
            x = self.root[x]
        return x

    def update(self, u, v):
        while self.find(u) != self.find(v):
            m = self.top[self.find(u)]
            assert m != 0
            a, b = self.find(m), self.find(self.parent[m])
            new_top = min(self.top[a], self.top[b])
            if self.size[a] < self.size[b]:
                a, b = b, a
            self.root[b] = a
            self.size[a] += self.size[b]
            self.top[a] = new_top
            self.merges += 1


def reachability(adj):
    result = []
    for start in range(len(adj)):
        seen, stack = {start}, [start]
        while stack:
            v = stack.pop()
            for w in adj[v]:
                if w not in seen:
                    seen.add(w)
                    stack.append(w)
        result.append(seen)
    return result


def check_tree_updates():
    for n in range(2, 7):
        for tail in product(*(range(i) for i in range(1, n))):
            parent = [0] + list(tail)
            legal = []
            for u in range(1, n):
                v = parent[u]
                while True:
                    legal.append((u, v))
                    if v == 0:
                        break
                    v = parent[v]
            for updates in product(legal, repeat=2):
                fast = Components(parent)
                adj = [set() for _ in range(n)]
                for child in range(1, n):
                    adj[parent[child]].add(child)
                for u, v in updates:
                    adj[u].add(v)
                    fast.update(u, v)
                    reach = reachability(adj)
                    checked("295 reachable minima",
                            [fast.top[fast.find(x)] for x in range(n)],
                            [min(row) for row in reach])
                    checked("295 full SCC partition",
                            [[fast.find(x) == fast.find(y) for y in range(n)] for x in range(n)],
                            [[y in reach[x] and x in reach[y] for y in range(n)] for x in range(n)])
                    checked("295 successful union bound", fast.merges <= n - 1, True)
    # v may be inside a component whose top is above v; representatives need
    # not equal top. Also includes an already merged edge and a branching SCC.
    parent = [0, 0, 1, 1, 3, 3]
    fast = Components(parent)
    for u, v in [(2, 1), (2, 0), (4, 1), (5, 3), (5, 0), (2, 0)]:
        fast.update(u, v)
    checked("295 root attributes after branch merges",
            [fast.top[fast.find(x)] for x in range(6)], [0] * 6)
    checked("295 ancestor root differs from DSU root", fast.find(0) != 0, True)


def multiply(a, b, degree):
    out = [0] * (degree + 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b[:degree + 1 - i]):
            out[i + j] = (out[i + j] + x * y) % MOD
    return out


def binary_power(a, k, degree):
    answer = [1] + [0] * degree
    while k:
        if k & 1:
            answer = multiply(answer, a, degree)
        a = multiply(a, a, degree)
        k >>= 1
    return answer


def coefficient_power(a, k, degree):
    assert a[0] == 1
    b = [1] + [0] * degree
    for j in range(1, degree + 1):
        b[j] = sum(((k + 1) * i - j) * a[i] * b[j - i]
                   for i in range(1, j + 1)) * pow(j, -1, MOD) % MOD
    return b


def submasks(s):
    t = s
    while True:
        yield t
        if t == 0:
            break
        t = (t - 1) & s


def ranked_power(g, n, k):
    a = [[0] * (n + 1) for _ in g]
    for s in range(len(g)):
        a[s][bin(s).count("1")] = g[s]
    for bit in range(n):
        for s in range(len(g)):
            if s >> bit & 1:
                a[s] = [(x + y) % MOD for x, y in zip(a[s], a[s ^ (1 << bit)])]
    b = [coefficient_power(row, k, n) for row in a]
    for bit in range(n):
        for s in range(len(g)):
            if s >> bit & 1:
                b[s] = [(x - y) % MOD for x, y in zip(b[s], b[s ^ (1 << bit)])]
    return [row[bin(s).count("1")] for s, row in enumerate(b)]


def subset_product(a, b):
    return [sum(a[t] * b[s ^ t] for t in submasks(s)) % MOD for s in range(len(a))]


def direct_subset_power(g, k):
    answer = [1] + [0] * (len(g) - 1)
    while k:
        if k & 1:
            answer = subset_product(answer, g)
        g = subset_product(g, g)
        k >>= 1
    return answer


def core_coloring(n, edges, k):
    independent = [int(not any(s >> u & 1 and s >> v & 1 for u, v in edges))
                   for s in range(1 << n)]
    return ranked_power(independent, n, k)[-1]


def hybrid_coloring(n, edges, k):
    if n == 0:
        return 1
    neighbors = [set() for _ in range(n)]
    for u, v in edges:
        neighbors[u].add(v)
        neighbors[v].add(u)
    v = min(range(n), key=lambda u: len(neighbors[u]))
    degree = len(neighbors[v])
    if degree >= 3:
        return core_coloring(n, edges, k)
    remaining = [u for u in range(n) if u != v]
    index = {u: i for i, u in enumerate(remaining)}
    h = tuple(sorted((index[u], index[w]) for u, w in edges if v not in (u, w)))
    f = hybrid_coloring(n - 1, h, k)
    if degree < 2:
        return (k - degree) * f % MOD
    a, b = sorted(neighbors[v])
    if (a, b) in edges:
        contraction = 0
    else:
        representatives = [u for u in remaining if u != b]
        ci = {u: i for i, u in enumerate(representatives)}
        contracted = set()
        for u, w in edges:
            if v in (u, w):
                continue
            u, w = (a if u == b else u), (a if w == b else w)
            contracted.add(tuple(sorted((ci[u], ci[w]))))
        contraction = hybrid_coloring(n - 2, tuple(sorted(contracted)), k)
    return ((k - 2) * f + contraction) % MOD


def brute_coloring(n, edges, k):
    return sum(all(colors[u] != colors[v] for u, v in edges)
               for colors in product(range(k), repeat=n))


def check_powers():
    for degree in range(10):
        for _ in range(15):
            a = [1] + [RNG.randrange(MOD) for _ in range(degree)]
            for k in [0, 1, 2, 3, 7, 100, 10**9]:
                checked("294 coefficient recurrence", coefficient_power(a, k, degree),
                        binary_power(a, k, degree))
    for n in range(7):
        for _ in range(8):
            g = [1] + [RNG.randrange(5) for _ in range((1 << n) - 1)]
            for k in [0, 1, 2, 3, 10**9]:
                checked("294 all ranks and all masks", ranked_power(g, n, k),
                        direct_subset_power(g, k))
    for n in range(6):
        pairs = list(combinations(range(n), 2))
        for mask in range(1 << len(pairs)):
            edges = tuple(pair for i, pair in enumerate(pairs) if mask >> i & 1)
            for k in [1, 2, 3]:
                expected = brute_coloring(n, edges, k)
                checked("294 core versus all colorings", core_coloring(n, edges, k), expected)
                checked("294 deletion contraction versus all colorings",
                        hybrid_coloring(n, edges, k), expected)
    for n in [6, 7]:
        for _ in range(12):
            edges = tuple(pair for pair in combinations(range(n), 2) if RNG.randrange(2))
            for k in [2, 3, 4]:
                checked("294 larger hybrid graphs", hybrid_coloring(n, edges, k),
                        brute_coloring(n, edges, k))


def point_sweep(points, k):
    n = len(points)
    order = sorted(range(n), key=lambda i: (-points[i][0], points[i][1], i))
    pos = [0] * n
    for p, i in enumerate(order):
        pos[i] = p
    sx = sum(points[i][0] for i in order[-k:])
    sy = sum(points[i][1] for i in order[-k:])
    best = sx * sx + sy
    events = defaultdict(list)
    for i, j in combinations(range(n), 2):
        xi, yi = points[i]
        xj, yj = points[j]
        if xi != xj:
            events[Fraction(yj - yi, xi - xj)].append((i, j))
    for c, pairs in sorted(events.items()):
        positions = sorted({pos[i] for pair in pairs for i in pair})
        blocks = []
        for p in positions:
            score = c * points[order[p]][0] + points[order[p]][1]
            if blocks and p == blocks[-1][-1] + 1:
                previous = order[blocks[-1][-1]]
                if score == c * points[previous][0] + points[previous][1]:
                    blocks[-1].append(p)
                    continue
            blocks.append([p])
        for block in blocks:
            before = [order[p] for p in block]
            after = sorted(before, key=lambda i: (points[i][0], i))
            for p, old, new in zip(block, before, after):
                if p >= n - k:
                    sx += points[new][0] - points[old][0]
                    sy += points[new][1] - points[old][1]
                order[p], pos[new] = new, p
        expected_order = sorted(range(n), key=lambda i: (c * points[i][0] + points[i][1],
                                                       points[i][0], i))
        checked("257 simultaneous event order", order, expected_order)
        checked("257 maintained sums", (sx, sy),
                (sum(points[i][0] for i in order[-k:]), sum(points[i][1] for i in order[-k:])))
        best = max(best, sx * sx + sy)
    return best


def dice_point(die, cost):
    x = sum(die)
    return x, 6 * sum(a * a for a in die) - x * x - 36 * cost


def brute_point_max(points, k):
    return max(sum(points[i][0] for i in chosen)**2 + sum(points[i][1] for i in chosen)
               for chosen in combinations(range(len(points)), k))


def check_dice():
    fixtures = [([(1,) * 6, (2,) * 6, (3,) * 6], [1, 2, 3]),
                ([(2,) * 6] * 4, [3] * 4),
                ([(1, 2, 3, 4, 5, 6)] * 3, [1, 2, 3])]
    for n in range(1, 9):
        for _ in range(15):
            fixtures.append(([tuple(RNG.randrange(1, 7) for _ in range(6)) for _ in range(n)],
                             [RNG.randrange(1, 80) for _ in range(n)]))
    for dice, costs in fixtures:
        points = [dice_point(die, cost) for die, cost in zip(dice, costs)]
        for k in range(1, len(dice) + 1):
            checked("257 sweep versus all subsets", point_sweep(points, k), brute_point_max(points, k))
            if len(dice) <= 3:
                expected_max = None
                for chosen in combinations(range(len(dice)), k):
                    outcomes = list(product(*(dice[i] for i in chosen)))
                    expected = Fraction(sum(sum(outcome)**2 for outcome in outcomes), len(outcomes))
                    expected -= sum(costs[i] for i in chosen)
                    mapped = Fraction(sum(points[i][0] for i in chosen)**2
                                      + sum(points[i][1] for i in chosen), 36)
                    checked("257 mapping versus all dice outcomes", mapped, expected)
                    expected_max = expected if expected_max is None else max(expected_max, expected)
                checked("257 final modular scale", point_sweep(points, k) * pow(36, -1, MOD) % MOD,
                        mod_fraction(expected_max))
    for points in [[(0, 0), (1, 0), (2, 0), (3, 10), (4, 10)],
                   [(1, 3), (1, 3), (2, 6), (3, 9)], [(1, 7), (1, -2), (1, 7)]]:
        for k in range(1, len(points) + 1):
            checked("257 collinear and duplicate blocks", point_sweep(points, k), brute_point_max(points, k))
    large = [dice_point((10**5,) * 6, 10**5)] * 1000
    checked("257 64bit objective", abs(brute_point_max(large, 1000)) < 2**63, True)


def kinetic_queries(points, queries):
    n = len(points)
    order = sorted(range(n), key=lambda i: (*points[i], i))
    pos = [0] * n
    for p, i in enumerate(order):
        pos[i] = p
    heap = []
    current = None
    swaps = set()

    def register(p):
        if not 0 <= p < n - 1:
            return
        i, j = order[p:p + 2]
        xi, yi = points[i]
        xj, yj = points[j]
        if xi < xj:
            h = Fraction(yj - yi, xj - xi)
            assert current is None or h >= current
            heappush(heap, (h, i, j))

    for p in range(n - 1):
        register(p)
    answers = []
    for a, b in sorted(queries):
        while heap:
            h, i, j = heap[0]
            if pos[j] != pos[i] + 1 or points[i][0] >= points[j][0]:
                heappop(heap)
                continue
            if h > a:
                break
            heappop(heap)
            current = h
            pair = tuple(sorted((i, j)))
            assert pair not in swaps
            swaps.add(pair)
            p = pos[i]
            order[p], order[p + 1] = j, i
            pos[j], pos[i] = p, p + 1
            for q in [p - 1, p + 1]:
                register(q)
        scores = [points[i][1] - a * points[i][0] for i in order]
        checked("344 sorted scores after tied events", scores, sorted(scores))
        answers.append(n - bisect_left(scores, b))
    checked("344 one swap per pair", len(swaps) <= comb(n, 2), True)
    return answers


def check_kinetic():
    fixtures = [[(0, 0), (1, 0), (2, 0)],
                [(0, 0), (1, 0), (2, 0), (3, 8), (4, 8)],
                [(1, -4), (1, 0), (1, 7)], [(0, 4)]]
    pool = list(product(range(-2, 3), repeat=2))
    for n in range(2, 10):
        fixtures += [RNG.sample(pool, n) for _ in range(20)]
    for points in fixtures:
        slopes = {Fraction(yj - yi, xj - xi)
                  for (xi, yi), (xj, yj) in combinations(points, 2) if xi != xj}
        slopes |= {Fraction(a) for a in range(-5, 6)}
        queries = [(a, b) for a in slopes for b in [-5, 0, 5]]
        expected = [sum(y - a * x >= b for x, y in points) for a, b in sorted(queries)]
        checked("344 heap versus original point inequalities", kinetic_queries(points, queries), expected)


def compressed_meeting(starts, t_max):
    lo, hi = min(starts), max(starts)
    delta = (hi - lo) // 2
    if delta > t_max:
        return [0] * (t_max + 1)
    inv_fact = [pow(factorial(i), -1, MOD) for i in range(t_max + 1)]
    q, r = [], []
    for a in range(t_max - delta + 1):
        q.append(product_value(inv_fact[a + (hi - p) // 2] for p in starts))
        r.append(product_value(inv_fact[a + (p - lo) // 2] for p in starts))
    c = multiply(q, r, 2 * (t_max - delta))
    return [0 if t < delta else factorial(t)**3 * pow(8, -t, MOD) * c[t - delta] % MOD
            for t in range(t_max + 1)]


def product_value(values):
    result = 1
    for value in values:
        result = result * value % MOD
    return result


def walk_distributions(starts, t_max):
    # Original independent moves; a separate absorbing model for first meeting.
    ordinary = {starts: 1}
    alive = {} if len(set(starts)) == 1 else {starts: 1}
    g, first = [int(len(set(starts)) == 1)], [int(len(set(starts)) == 1)]
    moves = list(product([-1, 1], repeat=3))
    for t in range(1, t_max + 1):
        new, new_alive = defaultdict(int), defaultdict(int)
        hits = 0
        for state, count in ordinary.items():
            for move in moves:
                new[tuple(x + d for x, d in zip(state, move))] += count
        for state, count in alive.items():
            for move in moves:
                destination = tuple(x + d for x, d in zip(state, move))
                if len(set(destination)) == 1:
                    hits += count
                else:
                    new_alive[destination] += count
        ordinary, alive = new, new_alive
        g.append(sum(count for state, count in new.items() if len(set(state)) == 1)
                 * pow(8, -t, MOD) % MOD)
        first.append(hits * pow(8, -t, MOD) % MOD)
    return g, first


def check_meeting():
    for starts in product(range(0, 7, 2), repeat=3):
        t_max = 6
        expected_g, expected_first = walk_distributions(starts, t_max)
        g = compressed_meeting(starts, t_max)
        h = compressed_meeting((0, 0, 0), t_max)
        f = []
        for t in range(t_max + 1):
            f.append((g[t] - sum(f[u] * h[t - u] for u in range(t))) % MOD)
        checked("289 compressed convolution versus original walks", g, expected_g)
        checked("289 renewal versus absorbing walks", f, expected_first)
        shifted = tuple(p + 100001 for p in starts)
        checked("289 absolute offset and odd parity", compressed_meeting(shifted, t_max), expected_g)
    checked("289 unreachable time range", compressed_meeting((0, 10, 20), 3), [0] * 4)
    checked("289 zero time initial meeting", compressed_meeting((100000,) * 3, 0), [1])


def inversion_count(values):
    return sum(values[i] > values[j] for i, j in combinations(range(len(values)), 2))


def inversion_moments(partial):
    fixed = [v for v in partial if v != -1]
    a = inversion_count(fixed)
    positions = [i for i, v in enumerate(partial) if v == -1]
    values = sorted(set(range(1, len(partial) + 1)) - set(fixed))
    q = len(positions)
    if q == 0:
        return Fraction(a * a)
    w = [[sum(v > value for v in partial[:p] if v != -1)
          + sum(v < value for v in partial[p + 1:] if v != -1)
          for value in values] for p in positions]
    rows = [sum(row) for row in w]
    cols = [sum(w[p][v] for p in range(q)) for v in range(q)]
    total, square = sum(rows), sum(x * x for row in w for x in row)
    eb = Fraction(total, q)
    eb2 = Fraction(square, q)
    eu, eu2, eub = Fraction(0), Fraction(0), Fraction(0)
    if q >= 2:
        eu = Fraction(q * (q - 1), 4)
        eu2 = Fraction(q * (q - 1) * (2 * q + 5), 72) + eu * eu
        eb2 += Fraction(total**2 - sum(x*x for x in rows) - sum(x*x for x in cols) + square,
                        q * (q - 1))
        for p, v in product(range(1, q + 1), repeat=2):
            conditional = Fraction(comb(q - 1, 2), 2) + Fraction(
                (p - 1) * (q - v) + (q - p) * (v - 1), q - 1)
            eub += Fraction(w[p - 1][v - 1], q) * conditional
    return a*a + eu2 + eb2 + 2*a*(eu + eb) + 2*eub


def check_inversions():
    for n in range(1, 7):
        # Accumulate original completed permutations by all choices of fixed
        # positions; no moment formula is used in this independent model.
        sums, counts = defaultdict(int), Counter()
        for perm in permutations(range(1, n + 1)):
            squared = inversion_count(perm)**2
            for mask in range(1 << n):
                partial = tuple(v if mask >> i & 1 else -1 for i, v in enumerate(perm))
                sums[partial] += squared
                counts[partial] += 1
        for partial in sums:
            exact = inversion_moments(partial)
            checked("330 moments versus all completions", exact, Fraction(sums[partial], counts[partial]))
            q = partial.count(-1)
            checked("330 restore factorial and modular answer",
                    mod_fraction(exact) * factorial(q) % MOD, sums[partial] % MOD)


@lru_cache(None)
def subtract_expectation(values):
    if len(values) == 1:
        return Fraction(values[0]**2)
    total = Fraction(0)
    for i, j in combinations(range(len(values)), 2):
        rest = [v for k, v in enumerate(values) if k not in (i, j)]
        for merged in [values[i] - values[j], values[j] - values[i]]:
            total += subtract_expectation(tuple(sorted(rest + [merged])))
    return total / (2 * comb(len(values), 2))


def check_subtraction():
    correlations = {1: Fraction(0), 2: Fraction(-1)}
    for n in range(3, 8):
        correlations[n] = -1 + Fraction(n - 3, n - 1) * correlations[n - 1]
    for n in range(1, 8):
        for values in combinations_with_replacement(range(4), n):
            expected = subtract_expectation(values)
            square, total = sum(v*v for v in values), sum(values)
            e = correlations[n] / comb(n, 2) if n >= 2 else Fraction(0)
            exact = square + e * (total*total - square)
            checked("450 pair recurrence versus original subtractions", exact, expected)
            checked("450 modular expectation", mod_fraction(exact), mod_fraction(expected))


def check_documents():
    paths = sorted(p for p in Path("src/content/docs/problems").rglob("*.md") if "updates" not in p.parts)
    checked("document count", len(paths), 868)
    for p in paths:
        text = p.read_text()
        head, body = text.split("\n---\n", 1)
        unit = json.loads(head.split("authoringUnit: ", 1)[1])
        proof = body.split("## 正当性\n\n", 1)[1].split("\n\n## 実装上の注意", 1)[0].strip()
        proof = proof.replace(r"\[", "[")
        checked("correctness Claim synchronization", unit["claims"][0]["text"], proof)


if __name__ == "__main__":
    check_tree_updates()
    check_powers()
    check_dice()
    check_kinetic()
    check_meeting()
    check_inversions()
    check_subtraction()
    check_documents()
    for name, count in sorted(COUNTS.items()):
        print(f"{name}: {count}")
    print(f"Finite mathematical comparisons: {sum(v for k, v in COUNTS.items() if k not in ('document count', 'correctness Claim synchronization'))}")
    print(f"Document synchronization comparisons: {COUNTS['correctness Claim synchronization']}")
