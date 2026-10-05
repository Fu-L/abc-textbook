"""Exact small models for review 5399563167 and nine further explanation fixes.

Python 3.9+, no dependencies. The first three models extend the review's local
verification; the remaining models compare the added derivations with original
operations, exhaustive paths, orders, matchings, placements, or labelled trees.
These finite checks accompany the proofs; they do not prove all 868 texts.
"""
from collections import defaultdict, deque
from fractions import Fraction as F
from functools import lru_cache
from itertools import combinations, combinations_with_replacement, permutations, product
from math import comb, factorial
from heapq import heappop, heappush
from random import Random

rng = Random(65_6)


def dye_transitions(colors):
    n = len(colors)
    result = defaultdict(F)
    for mask in range(1 << n):
        chosen = [i for i in range(n) if mask >> i & 1]
        k = len(chosen)
        probability = F(factorial(n - k), (1 << n) * factorial(n))
        for assignment in permutations(range(n), k):
            after = list(colors)
            for i, color in zip(chosen, assignment):
                after[i] = color
            result[tuple(after)] += probability
    return result


def marginal(n, j):
    row = [F(0)] * (n + 1)
    for s in range(j + 1):
        q = F(comb(j, s), 1 << j)
        alpha = F(2 * s + n - j, 2 * n)
        row[j - s + 1] += q * alpha
        row[j - s] += q * (1 - alpha)
    return row


def partition_key(colors):
    n = len(colors)
    return tuple(sorted(colors.count(c) for c in range(n)))


def gaussian(matrix):
    n = len(matrix)
    for i in range(n):
        pivot = next(k for k in range(i, n) if matrix[k][i])
        matrix[i], matrix[pivot] = matrix[pivot], matrix[i]
        divisor = matrix[i][i]
        matrix[i] = [x / divisor for x in matrix[i]]
        for k in range(n):
            if k != i:
                multiplier = matrix[k][i]
                matrix[k] = [x - multiplier * y for x, y in zip(matrix[k], matrix[i])]
    return [row[-1] for row in matrix]


for n in range(2, 6):
    rows = [marginal(n, j) for j in range(n)]
    g = [F(0)]
    for j, row in enumerate(rows):
        brute = [F(0)] * (n + 1)
        for after, probability in dye_transitions([0] * j + [1] * (n - j)).items():
            brute[after.count(0)] += probability
        assert row == brute, (n, j, row, brute)
        assert sum(row) == 1
        assert row[j + 1] == F(n - j, n * (1 << (j + 1)))
        g.append((g[j] - F(1, n) - sum(row[k] * g[k] for k in range(j + 1))) / row[j + 1])
    keys = sorted({partition_key(list(colors)) for colors in product(range(n), repeat=n)})
    index = {key: i for i, key in enumerate(keys)}
    matrix = [[F(0)] * (len(keys) + 1) for _ in keys]
    for key, i in index.items():
        matrix[i][i] = F(1)
        if max(key) == n:
            continue
        matrix[i][-1] = F(1)
        colors = [color for color, count in enumerate(key) for _ in range(count)]
        for after, probability in dye_transitions(colors).items():
            matrix[i][index[partition_key(list(after))]] -= probability
    answers = gaussian(matrix)
    for key, i in index.items():
        assert sum(g[j] for j in key) - g[n] == answers[i], (n, key)
print('ABC249 Ex: exact marginal distributions and full-process Bellman equations agree for N=2..5')


subset_count = 0
for n in range(2, 7):
    for b in product((1, 2), repeat=n):
        z = b.count(1)
        if z == 0 or z == n:
            continue
        feasible = set()
        for order in permutations(range(n)):
            if b[order[-1]] != 1:
                continue
            coefficient = [1] + [b[i] for i in order[:-1]]
            feasible.add(frozenset(i for i, c in zip(order, coefficient) if c == 1))
        expected = {
            frozenset(i for i in range(n) if mask >> i & 1)
            for mask in range(1 << n)
            if bin(mask).count('1') == z and any(b[i] == 2 and mask >> i & 1 for i in range(n))
        }
        assert feasible == expected, (n, b)
        for selected in expected:
            classes = {(i, j): [k for k in range(n) if b[k] == i and (1 if k in selected else 2) == j]
                       for i in (1, 2) for j in (1, 2)}
            h21, h12 = classes[2, 1], classes[1, 2]
            assert len(h21) == len(h12) >= 1
            order = h21[:1] + classes[2, 2] + h12[:1]
            for x, y in zip(h21[1:], h12[1:]):
                order += [x, y]
            order += classes[1, 1]
            coefficient = [1] + [b[i] for i in order[:-1]]
            assert {i for i, c in zip(order, coefficient) if c == 1} == selected
            assert len(set(order)) == n and b[order[-1]] == 1
            subset_count += 1
print(f'ABC440 F: feasible subsets and explicit construction agree for N=2..6 ({subset_count} subsets)')


@lru_cache(None)
def shapes(n):
    if n == 0:
        return (None,)
    return tuple((left, right) for k in range(n)
                 for left in shapes(k) for right in shapes(n - 1 - k))


def parents_of(tree):
    parents = []
    def visit(t, parent):
        if t is None:
            return
        i = len(parents)
        parents.append(parent)
        visit(t[0], i)
        visit(t[1], i)
    visit(tree, -1)
    return parents


tree_count = 0
for size in range(1, 6):
    for tree in shapes(size):
        parents = parents_of(tree)
        leaves = [i for i in range(size) if i not in parents]
        moves = [(p, v) for v, p in enumerate(parents) if p >= 0]
        moves += [(parents[p], v) for v, p in enumerate(parents) if p >= 0 and parents[p] >= 0]
        for labels in product((0, 1), repeat=size):
            if any(labels[i] == 0 for i in leaves):
                continue
            n = sum(labels)
            target = (n,) + (0,) * (size - 1)
            states = {labels}
            for _ in range(n - 1):
                next_states = set(states)
                for state in states:
                    for u, v in moves:
                        if state[v]:
                            after = list(state)
                            after[u] += after[v]
                            after[v] = 0
                            next_states.add(tuple(after))
                states = next_states
            condition = labels[0] == 1 and all(labels[v] or labels[p] for v, p in enumerate(parents) if p >= 0)
            assert (target in states) == condition, (parents, labels, n)
            tree_count += 1
print(f'ABC222 H: local condition agrees with exhaustive operation search through 5 vertices ({tree_count} labelled trees)')


def distances(adj, start):
    result = [-1] * len(adj)
    result[start] = 0
    stack = [start]
    while stack:
        u = stack.pop()
        for v, w in adj[u]:
            if result[v] < 0:
                result[v] = result[u] + w
                stack.append(v)
    return result


def labelled_tree(n, code):
    degree = [1] * n
    for u in code:
        degree[u] += 1
    remaining = degree[:]
    edges = []
    for u in code:
        leaf = next(i for i, d in enumerate(remaining) if d == 1)
        edges.append((u, leaf))
        remaining[u] -= 1
        remaining[leaf] -= 1
    leaves = [i for i, d in enumerate(remaining) if d == 1]
    edges.append(tuple(leaves))
    return degree, edges


tree_cases = degree_cases = 0
for n in range(2, 7):
    max_diameter = {}
    for code in product(range(n), repeat=n - 2):
        degree, edges = labelled_tree(n, code)
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append((v, 1))
            adj[v].append((u, 1))
        diameter = max(max(distances(adj, u)) for u in range(n))
        key = tuple(degree)
        max_diameter[key] = max(max_diameter.get(key, 0), diameter)
        if n <= 5:
            weighted = [[] for _ in range(2 * n)]
            for u, v in edges:
                w = rng.randint(1, 9)
                weighted[u].append((v, w))
                weighted[v].append((u, w))
            rewards = [rng.randint(1, 20) for _ in range(n)]
            for u, w in enumerate(rewards):
                weighted[u].append((u + n, w))
                weighted[u + n].append((u, w))
            initial = distances(weighted, 0)
            s = max(range(2 * n), key=initial.__getitem__)
            ds = distances(weighted, s)
            t = max(range(2 * n), key=ds.__getitem__)
            dt = distances(weighted, t)
            for u in range(n):
                actual = dt[u] if u == s - n else ds[u] if u == t - n else max(ds[u], dt[u])
                brute = max(distances(weighted, u)[v + n] for v in range(n) if v != u)
                assert actual == brute
            tree_cases += 1
    # Every positive degree sequence of the required sum is represented.
    expected = {tuple(1 + counts.count(i) for i in range(n))
                for counts in combinations_with_replacement(range(n), n - 2)}
    assert set(max_diameter) == expected
    assert all(diameter == 1 + sum(d >= 2 for d in degree)
               for degree, diameter in max_diameter.items())
    formula = comb(2 * n - 3, n - 1) + (n * comb(2 * n - 4, n - 1) if n > 2 else 0)
    assert sum(max_diameter.values()) == formula
    for _ in range(30):
        a = [rng.randint(1, 20) for _ in range(n)]
        best = min(sum(x * d * d for x, d in zip(a, degree)) for degree in expected)
        heap = [(3 * x, i, 1) for i, x in enumerate(a)]
        from heapq import heapify
        heapify(heap)
        answer = sum(a)
        for _ in range(n - 2):
            cost, i, d = heappop(heap)
            answer += cost
            heappush(heap, (a[i] * (2 * (d + 1) + 1), i, d + 1))
        assert answer == best
        degree_cases += 1
print(f'ABC222 F: diameter exception vs all destinations ({tree_cases} trees)')
print(f'ABC290 F / ABC359 F: all labelled trees N=2..6, degree realization, diameters, binomial sum and {degree_cases} convex allocations')


purchase_cases = 0
for k in range(1, 8):
    for choices in product(*(range(i) for i in range(1, k + 1))):
        order = []
        for i, x in enumerate(choices):
            order.insert(x, i)
        for i, x in enumerate(choices):
            assert sum(j < i for j in order[:order.index(i)]) == x
        purchase_cases += 1
for n in range(1, 7):
    for _ in range(20):
        a = [rng.randint(1, 9) for _ in range(n)]
        c = [rng.randint(1, 9) for _ in range(n)]
        mandatory = {i for i in range(n) if rng.randrange(2)}
        brute = 10**9
        for k in range(len(mandatory), n + 1):
            for selected in combinations(range(n), k):
                if not mandatory.issubset(selected):
                    continue
                for order in permutations(selected):
                    cost = sum(a[i] + c[i - sum(j < i for j in order[:t])]
                               for t, i in enumerate(order))
                    brute = min(brute, cost)
        dp = {0: 0}
        for i in range(n):
            nxt = {}
            for j, value in dp.items():
                nxt[j + 1] = min(nxt.get(j + 1, 10**9), value + a[i] + min(c[i - j:i + 1]))
                if i not in mandatory:
                    nxt[j] = min(nxt.get(j, 10**9), value)
            dp = nxt
        assert min(dp.values()) == brute
print(f'ABC288 E: all {purchase_cases} insertion ranks and 120 purchase-order/selection DPs')


grundy_cases = 0
for low in range(1, 16):
    for high in range(low, 21):
        g = []
        for x in range(250):
            options = {g[x - step] for step in range(low, min(high, x) + 1)}
            value = 0
            while value in options:
                value += 1
            g.append(value)
            assert value == (x % (low + high)) // low
            grundy_cases += 1
print(f'ABC297 G: direct mex vs periodic expression ({grundy_cases} states)')


def bfs_grid(h, w, open_mask):
    d = [-1] * (h * w)
    d[0] = 0
    queue = deque([0])
    while queue:
        u = queue.popleft()
        r, c = divmod(u, w)
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            rr, cc = r + dr, c + dc
            if 0 <= rr < h and 0 <= cc < w:
                v = rr * w + cc
                if open_mask >> v & 1 and d[v] < 0:
                    d[v] = d[u] + 1
                    queue.append(v)
    return d[-1]


inf = 10**9
matrix_cases = 0
for w in range(2, 6):
    for internal in range(1 << (3 * w - 2)):
        mask = 1 | (internal << 1) | (1 << (3 * w - 1))
        vector = [0, inf, inf]
        for c in range(w):
            matrix = [[abs(a - b) if all(mask >> (r * w + c) & 1
                                          for r in range(min(a, b), max(a, b) + 1)) else inf
                       for b in range(3)] for a in range(3)]
            vector = [min(vector[a] + matrix[a][b] for a in range(3)) for b in range(3)]
        answer = vector[2] + w - 1 if vector[2] < inf else -1
        assert answer == bfs_grid(3, w, mask), (w, mask, answer)
        matrix_cases += 1
print(f'ABC429 F: column matrices vs unrestricted four-direction BFS ({matrix_cases} boards)')


def punch_dist(h, w, mask, history):
    start = (0, mask) if history else (0, 0)
    dist = {start: 0}
    queue = [(0, *start)]
    areas = [sum(1 << (rr * w + cc) for rr in (r, r + 1) for cc in (c, c + 1))
             for r in range(h - 1) for c in range(w - 1)]
    while queue:
        cost, u, opened = heappop(queue)
        if dist[u, opened] != cost:
            continue
        if u == h * w - 1:
            return cost
        r, c = divmod(u, w)
        edges = []
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            rr, cc = r + dr, c + dc
            if 0 <= rr < h and 0 <= cc < w:
                v = rr * w + cc
                if (opened if history else mask) >> v & 1:
                    edges.append((v, opened, 0))
        if history:
            edges += [(u, opened | area, 1) for area in areas]
        else:
            for rr in range(max(0, r - 2), min(h, r + 3)):
                for cc in range(max(0, c - 2), min(w, c + 3)):
                    if min(abs(rr - r), abs(cc - c)) <= 1:
                        edges.append((rr * w + cc, 0, 1))
        for v, after, extra in edges:
            key = v, after
            if cost + extra < dist.get(key, inf):
                dist[key] = cost + extra
                heappush(queue, (cost + extra, *key))
    raise AssertionError('punching opens all cells')


punch_cases = 0
for h, w in ((2, 2), (2, 3), (3, 3)):
    for internal in range(1 << (h * w - 2)):
        mask = 1 | (internal << 1) | (1 << (h * w - 1))
        assert punch_dist(h, w, mask, True) == punch_dist(h, w, mask, False)
        punch_cases += 1
print(f'ABC213 E: full persistent-wall state vs compressed static graph ({punch_cases} boards)')


@lru_cache(None)
def matching(a):
    if not a:
        return 0
    best = matching(a[1:])
    for j in range(1, len(a)):
        if a[j] >= 2 * a[0]:
            best = max(best, 1 + matching(a[1:j] + a[j + 1:]))
    return best


matching_cases = 0
for n in range(2, 8):
    for a in combinations_with_replacement(range(1, 7), n):
        b = [next((j for j in range(n) if a[j] >= 2 * a[i]), n) for i in range(n)]
        d = [b[i] - i for i in range(n)]
        for left in range(n):
            for right in range(left + 1, n):
                feasible = [True]
                for k in range(1, n - left + 1):
                    # Translate the manuscript's one-based predicate to zero-based.
                    feasible.append(left + k - 1 + max(k, max(d[left:left + k])) <= right)
                assert all(not feasible[k + 1] or feasible[k] for k in range(len(feasible) - 1))
                answer = max(k for k, ok in enumerate(feasible) if ok)
                assert answer == matching(a[left:right + 1])
                matching_cases += 1
print(f'ABC388 G: offset predicate vs exhaustive matching ({matching_cases} intervals)')


def rotate(a):
    return [list(row) for row in zip(*a[::-1])]


def square_partition(a, m):
    n = len(a)
    answer = -inf
    for _ in range(4):
        side = n - m + 1
        b = [[sum(a[r + dr][c + dc] for dr in range(m) for dc in range(m))
              for c in range(side)] for r in range(side)]
        def region(r0, r1, c0, c1):
            return max((b[r][c] for r in range(r0, r1 - m + 1)
                        for c in range(c0, c1 - m + 1)), default=-inf)
        for cut in range(m, n - m + 1):
            # T partition; here direct region scans check the indexing separately.
            top = region(0, cut, 0, n)
            for split in range(m, n - m + 1):
                value = top + region(cut, n, 0, split) + region(cut, n, split, n)
                answer = max(answer, value)
            # Three parallel strips, central maximum updated one row at a time.
            middle = -inf
            for lower in range(cut + m, n - m + 1):
                middle = max(middle, max(b[lower - m]))
                answer = max(answer, top + middle + region(lower, n, 0, n))
        a = rotate(a)
    return answer


square_cases = 0
for n in range(2, 7):
    for m in range(1, n // 2 + 1):
        for _ in range(15):
            a = [[rng.randrange(10) for _ in range(n)] for _ in range(n)]
            positions = [(r, c) for r in range(n - m + 1) for c in range(n - m + 1)]
            weights = {p: sum(a[p[0] + dr][p[1] + dc] for dr in range(m) for dc in range(m))
                       for p in positions}
            brute = -inf
            for chosen in combinations(positions, 3):
                if all(abs(r - rr) >= m or abs(c - cc) >= m
                       for (r, c), (rr, cc) in combinations(chosen, 2)):
                    brute = max(brute, sum(weights[p] for p in chosen))
            assert square_partition(a, m) == brute, (n, m, a)
            square_cases += 1
print(f'ABC347 F: six partitions / central incremental maximum vs all square triples ({square_cases} boards)')
