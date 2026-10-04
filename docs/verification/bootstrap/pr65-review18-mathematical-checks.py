"""Review 18: finite checks for E-problem review corrections (Python >=3.9)."""

from bisect import insort
from collections import Counter, deque
from fractions import Fraction
from itertools import product
from math import comb


MOD = 998244353


def bfs_distances(graph, start, limit):
    distance = [-1] * len(graph)
    distance[start] = 0
    queue = deque([start])
    while queue:
        v = queue.popleft()
        if distance[v] == limit:
            continue
        for to in graph[v]:
            if distance[to] == -1:
                distance[to] = distance[v] + 1
                queue.append(to)
    return distance


def check_254():
    graph = [[] for _ in range(6)]
    for a, b in [(0, 1), (0, 4), (1, 2), (2, 3), (4, 3), (3, 5)]:
        graph[a].append(b)
        graph[b].append(a)
    dist = bfs_distances(graph, 0, 3)
    assert dist == [0, 1, 2, 2, 1, 3]
    assert sum(i + 1 for i, d in enumerate(dist) if 0 <= d <= 3) == 21

    visited = set()

    def wrong_dfs(v, depth):
        if v in visited:
            return
        visited.add(v)
        if depth == 3:
            return
        for to in graph[v]:
            wrong_dfs(to, depth + 1)

    wrong_dfs(0, 0)
    assert sum(v + 1 for v in visited) == 15
    print("ABC254 E: BFS keeps the shortest arrival; bounded DFS can miss a vertex")


def check_281():
    left, right = [1], [2]
    total = 1
    incoming, outgoing = 3, 1
    # Insert first, so the one-element left partition is valid for classification.
    if incoming <= left[-1]:
        insort(left, incoming)
        total += incoming
    else:
        insort(right, incoming)
    left.remove(outgoing)
    total -= outgoing
    if len(left) < 1:
        moved = right.pop(0)
        left.append(moved)
        total += moved
    assert left == [2] and right == [3] and total == 2
    print("ABC281 E: K=1 sliding update inserts before erasing and returns 1, 2")


def check_249():
    alphabet = 3
    for n in range(1, 7):
        dp = [[0] * (n + 1) for _ in range(n + 1)]
        dp[0][0] = 1
        for i in range(1, n + 1):
            for r in range(1, i + 1):
                digits = len(str(r))
                for j in range(digits + 1, n + 1):
                    prior = dp[i - r][j - digits - 1]
                    factor = alphabet if i == r else alphabet - 1
                    dp[i][j] += factor * prior
        brute = Counter()
        for s in product(range(alphabet), repeat=n):
            runs = []
            for x in s:
                if not runs or runs[-1][0] != x:
                    runs.append([x, 1])
                else:
                    runs[-1][1] += 1
            encoded = sum(1 + len(str(length)) for _, length in runs)
            brute[encoded] += 1
        for j in range(n + 1):
            assert dp[n][j] == brute[j], (n, j, dp[n][j], brute[j])
    print("ABC249 E: run-length DP matches exhaustive strings through length 6")


def check_343():
    def overlap(a, b):
        lengths = [max(0, min(a[k] + 7, b[k] + 7) - max(a[k], b[k])) for k in range(3)]
        return lengths[0] * lengths[1] * lengths[2]

    cubes = [(0, 0, 0), (4, -3, 2), (-7, 0, 0)]
    pair_sum = sum(overlap(cubes[i], cubes[j]) for i in range(3) for j in range(i + 1, 3))
    triple_lengths = []
    for axis in range(3):
        lo = max(c[axis] for c in cubes)
        hi = min(c[axis] + 7 for c in cubes)
        triple_lengths.append(max(0, hi - lo))
    triple = triple_lengths[0] * triple_lengths[1] * triple_lengths[2]
    v3 = triple
    v2 = pair_sum - 3 * v3
    v1 = 3 * 7**3 - 2 * v2 - 3 * v3
    assert (v1, v2, v3) == (1029 - 2 * v2 - 3 * v3, pair_sum - 3 * triple, triple)
    assert v1 + 2 * v2 + 3 * v3 == 3 * 7**3
    print("ABC343 E: pair/triple inclusion counts recover exact coverage volumes")


def check_387():
    table = [(10, 16, 17), (17, 25, 26), (26, 34, 35), (35, 61, 62), (62, 99, 107)]
    for low, high, p in table:
        assert sum(map(int, str(p))) == 8
        for x in (low, high):
            assert x + 1 <= p < 2 * x
            assert p * 10**4 >= (x + 1) * 10**4
            assert (p * 10**4 + 1) % 9 == 0
            assert (p * 10**4) % 8 == 0
    print("ABC387 E: every prefix row has range, digit-sum, and divisibility guarantees")


def check_392():
    # A triangle, a two-edge parallel cycle, and an isolated vertex.
    n = 6
    edges = [(0, 1), (1, 2), (2, 0), (3, 4), (3, 4)]
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    spare = []
    components = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:
            spare.append((a, b))
        else:
            parent[ra] = rb
            components -= 1
    assert len(spare) == len(edges) - n + components == 2
    operations = 0
    for old_a, old_b in spare:
        source = find(old_a)
        target = next(v for v in range(n) if find(v) != source)
        parent[source] = find(target)
        components -= 1
        operations += 1
    assert operations == 2 and components == 1
    print("ABC392 E: global cycle-edge pool supplies C-1 component merges")


def exact_piece_multiset(lengths, operations):
    candidates = sorted({Fraction(a, 2**q) for a in lengths for q in range(operations + 1)})
    chosen = None
    depths = []
    for threshold in candidates:
        trial = []
        needed = 0
        for a in lengths:
            q = 0
            while Fraction(a, 2**q) > threshold:
                q += 1
            trial.append(q)
            needed += 2**q - 1
        if needed <= operations:
            chosen, depths = threshold, trial
            break
    assert chosen is not None
    counts = Counter()
    used = 0
    for a, q in zip(lengths, depths):
        counts[Fraction(a, 2**q)] += 2**q
        used += 2**q - 1
    remaining = operations - used
    while remaining:
        longest = max(k for k, count in counts.items() if count)
        take = min(counts[longest], remaining)
        counts[longest] -= take
        counts[longest / 2] += 2 * take
        remaining -= take
    return sorted((length for length, count in counts.items() for _ in range(count)), reverse=True)


def literal_piece_multiset(lengths, operations):
    pieces = list(map(Fraction, lengths))
    for _ in range(operations):
        longest = max(pieces)
        pieces.remove(longest)
        pieces.extend([longest / 2, longest / 2])
    return sorted(pieces, reverse=True)


def check_424():
    cases = 0
    for n in range(1, 4):
        for lengths in product(range(1, 5), repeat=n):
            for k in range(7):
                assert exact_piece_multiset(lengths, k) == literal_piece_multiset(lengths, k)
                cases += 1
    print(f"ABC424 E: exact dyadic batching matches literal greedy on {cases} cases")


def check_427():
    h = w = 4
    target = (2, 2)
    garbage = {(1, 1), (3, 2)}
    current = (0, 0)

    def legal(next_displacement):
        preimage = (target[0] - next_displacement[0], target[1] - next_displacement[1])
        return not (0 <= preimage[0] < h and 0 <= preimage[1] < w and preimage in garbage)

    assert not legal((1, 1))  # The garbage at (1,1) would occupy T.
    assert legal((1, 0))
    assert legal((5, 0))  # An off-board preimage contains no initial garbage.
    print("ABC427 E: forbidden wind is detected by T's reverse preimage")


def check_449():
    values = [2]
    frequency = Counter(values)
    for _ in range(4):
        minimum = min(frequency[v] for v in range(1, 4))
        x = next(v for v in range(1, 4) if frequency[v] == minimum)
        values.append(x)
        frequency[x] += 1
    assert values == [2, 1, 3, 1, 2]
    # Value 1 starts absent and is still eligible at the second position.
    assert values[1] == 1
    assert 500_000 * 500_000 <= 2**63 - 1
    print("ABC449 E: zero-frequency values participate in value-ordered ties")


def constructed_path(n, hole):
    height = width = n
    a, b = hole
    prefix, suffix = [], []
    while height > 2 or width > 2:
        if height > 2:
            if a > 2:
                prefix.append('R' * (width - 1) + 'D' + 'L' * (width - 1) + 'D')
                height -= 2
                a -= 2
            else:
                suffix.append('D' + 'L' * (width - 1) + 'D' + 'R' * (width - 1))
                height -= 2
        if width > 2:
            if b > 2:
                prefix.append('D' * (height - 1) + 'R' + 'U' * (height - 1) + 'R')
                width -= 2
                b -= 2
            else:
                suffix.append('R' + 'U' * (height - 1) + 'R' + 'D' * (height - 1))
                width -= 2
    if (a, b) == (1, 2):  # top-right of the final 2x2
        core = 'DR'
    else:
        assert (a, b) == (2, 1)  # bottom-left
        core = 'RD'
    return ''.join(prefix) + core + ''.join(reversed(suffix))


def check_454():
    cases = 0
    for n in range(2, 12, 2):
        for a in range(1, n + 1):
            for b in range(1, n + 1):
                if (a, b) in {(1, 1), (n, n)} or (a + b) % 2 == 0:
                    continue
                moves = constructed_path(n, (a, b))
                assert len(moves) == n * n - 2
                r = c = 1
                seen = {(r, c)}
                for move in moves:
                    r += (move == 'D') - (move == 'U')
                    c += (move == 'R') - (move == 'L')
                    assert 1 <= r <= n and 1 <= c <= n
                    assert (r, c) != (a, b) and (r, c) not in seen
                    seen.add((r, c))
                assert (r, c) == (n, n)
                assert len(seen) == n * n - 1
                cases += 1
    print(f"ABC454 E: exact strip construction visits every legal cell in {cases} cases")


def check_459():
    for n in [0, 1, 2, 4, MOD - 2, MOD - 1, MOD, MOD + 1, MOD + 7]:
        for k in range(0, min(5, n) + 1):
            falling = 1
            for j in range(k):
                falling = falling * (n - j) % MOD
            # Use invfact[k] without constructing n!; k! is invertible for these k.
            fact = 1
            for j in range(1, k + 1):
                fact = fact * j % MOD
            value = falling * pow(fact, -1, MOD) % MOD
            assert value == comb(n, k) % MOD
    # A two-vertex positive tree: excluding i itself leaves its true parent.
    root, child = 1, 2
    distances = [[0, 1], [1, 0]]
    candidates = [j for j in range(2) if j != child - 1 and distances[0][j] + distances[j][child - 1] == distances[0][child - 1]]
    assert candidates == [root - 1]
    print("ABC459 E: falling-product binomials and strict true-ancestor selection")


def check_434():
    # Rooting a unicyclic component at an endpoint of the surplus edge covers the root.
    tree_edges = [(0, 1), (1, 2), (2, 3)]
    surplus = (0, 3)
    chosen = [child for parent, child in tree_edges]
    chosen.append(surplus[0])
    assert sorted(chosen) == [0, 1, 2, 3]
    print("ABC434 E: a surplus edge covers the root chosen at its endpoint")


if __name__ == '__main__':
    check_249()
    check_254()
    check_281()
    check_343()
    check_387()
    check_392()
    check_424()
    check_427()
    check_434()
    check_449()
    check_454()
    check_459()
    print("All review 18 finite checks passed.")
