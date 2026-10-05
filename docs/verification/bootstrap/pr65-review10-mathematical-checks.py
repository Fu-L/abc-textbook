# coding: utf-8
"""PR65 review 5401313426: independent finite checks, Python 3.9+, no dependencies.

Compare the written algorithms with original operations, enumeration or direct DP.
Finite checks supplement the general proofs in the textbook.
"""
from collections import Counter, deque
from fractions import Fraction
from functools import lru_cache
from heapq import heappop, heappush
from itertools import combinations, product
from random import Random

rng = Random(6510)
checks = Counter()


def convolution(a, b, cap):
    out = [0] * min(len(a) + len(b) - 1, cap + 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b[:len(out) - i]):
            out[i + j] += x * y
    return out


def odd_product(values, cap):
    if not values:
        return [1], [0]
    if len(values) == 1:
        odd = [0] * (min(values[0], cap) + 1)
        if values[0] <= cap:
            odd[values[0]] = 1
        return [1], odd
    mid = len(values) // 2
    e, o = odd_product(values[:mid], cap)
    f, p = odd_product(values[mid:], cap)

    def add(a, b):
        return [(a[i] if i < len(a) else 0) + (b[i] if i < len(b) else 0)
                for i in range(max(len(a), len(b)))]

    return add(convolution(e, f, cap), convolution(o, p, cap)), add(
        convolution(e, p, cap), convolution(o, f, cap))


for n in range(1, 7):
    for values in product(range(1, 4), repeat=n):
        direct = Counter(sum(values[i] for i in range(n) if mask >> i & 1)
                         for mask in range(1 << n) if bin(mask).count('1') % 2)
        for cap in (1, 3, sum(values), sum(values) + 1):
            _, odd = odd_product(values, cap)
            assert (odd[cap] if cap < len(odd) else 0) == direct[cap]
            checks['ABC267 Ex subset enumeration'] += 1

# The low layers retain N/s products even when the final degree is capped.
for n in (256, 1024, 4096):
    cap = 16
    layer_degree = [sum(min(cap, s) for _ in range(n // s))
                    for s in (2, 4, 8, 16)]
    assert layer_degree == [n] * 4
    checks['ABC267 Ex product-tree layer accounting'] += 1


directions = ((1, 0), (1, 1), (0, 1), (-1, 1),
              (-1, 0), (-1, -1), (0, -1), (1, -1))


def det(a, b):
    return a[0] * b[1] - a[1] * b[0]


def pair_cost(allowed, target):
    best = 0 if target == (0, 0) else 10**9
    for u in allowed:
        axis = 0 if u[0] else 1
        p = target[axis] // u[axis]
        if p >= 0 and tuple(p * x for x in u) == target:
            best = min(best, p)
    for u, v in combinations(allowed, 2):
        d = det(u, v)
        a, b = det(target, v), det(u, target)
        if d and a % d == b % d == 0 and a // d >= 0 and b // d >= 0:
            best = min(best, a // d + b // d)
    return best


for mask in range(256):
    allowed = [v for i, v in enumerate(directions) if mask >> i & 1]
    distance = {(0, 0): 0}
    queue = deque([(0, 0)])
    while queue:
        x, y = queue.popleft()
        for dx, dy in allowed:
            next_point = x + dx, y + dy
            if all(-16 <= a <= 16 for a in next_point) and next_point not in distance:
                distance[next_point] = distance[x, y] + 1
                queue.append(next_point)
    for target in product(range(-4, 5), repeat=2):
        best = pair_cost(allowed, target)
        for e in allowed:
            if 0 in e:
                best = min(best, 1 + pair_cost(allowed, (target[0] - e[0], target[1] - e[1])))
        assert best == distance.get(target, 10**9), (mask, target, best)
        checks['ABC271 Ex all direction masks and bounded BFS'] += 1
assert pair_cost([directions[i] for i in (1, 3, 6)], (0, 1)) == 10**9


def cartesian(a, b):
    def node(lo, hi):
        if lo == hi:
            return None
        root = max(range(lo, hi), key=lambda i: (b[i], i))
        return root, node(lo, root), node(root + 1, hi)
    return node(0, len(a))


def weighted_tree(a, b):
    horizon = max(a) + 2

    def visit(tree):
        if tree is None:
            return 0, 0, []
        i, left, right = tree
        v1, d1, e1 = visit(left)
        v2, d2, e2 = visit(right)
        value, saving, cur = v1 + v2, d1 + d2, 0
        events = sorted(e1 + e2)
        while events and (events[0][0] <= a[i] or saving >= b[i]):
            z, w = events.pop(0)
            value -= (z - cur) * saving
            cur, saving = z, saving - w
            while events and events[0][0] == z:
                _, weight = events.pop(0)
                saving -= weight
        if cur < a[i]:
            value -= (a[i] - cur) * saving
            cur = a[i]
        events.append((cur, b[i] - saving))
        result = value + cur * b[i], b[i], sorted(events)
        probes = range(horizon) if horizon <= 10 else (0, a[i] - 1, a[i], a[i] + 1)
        for j in probes:
            child = lambda state, t: state[0] - state[1] * t + sum(
                w * max(t - z, 0) for z, w in state[2])
            start = max(a[i], j)
            candidates = range(start, horizon + 1) if horizon <= 10 else (
                {start} | {z for z, _ in e1 + e2 if z >= start})
            direct = min((t - j) * b[i] + child((v1, d1, e1), t)
                         + child((v2, d2, e2), t)
                         for t in candidates)
            assert child(result, j) == direct
        return result

    return visit(cartesian(a, b))[0]


def original_attacks(a, b):
    # Each edge is one original attack on any nonempty interval.
    distance = {tuple(a): 0}
    heap = [(0, tuple(a))]
    while heap:
        cost, state = heappop(heap)
        if distance[state] != cost:
            continue
        if not any(state):
            return cost
        for l in range(len(a)):
            for r in range(l + 1, len(a) + 1):
                new = state[:l] + tuple(max(0, x - 1) for x in state[l:r]) + state[r:]
                candidate = cost + max(b[l:r])
                if new != state and candidate < distance.get(new, 10**30):
                    distance[new] = candidate
                    heappush(heap, (candidate, new))
    raise AssertionError('attack state unreachable')


for _ in range(500):
    n = rng.randrange(1, 6)
    a, b = [rng.randrange(1, 4) for _ in range(n)], [rng.randrange(1, 8) for _ in range(n)]
    assert weighted_tree(a, b) == original_attacks(a, b)
    checks['ABC275 Ex weighted events vs original interval attacks'] += 1
assert weighted_tree([10**9], [10**9]) == 10**18


def all_paths(adj, root):
    return [1 << root] + [(1 << root) | mask for v in adj[root] for mask in all_paths(adj, v)]


def collecting_flow(adj, weights, k):
    reachable = [i for i in range(len(adj)) if any(mask >> i & 1 for mask in all_paths(adj, 0))]
    ids = {v: i for i, v in enumerate(reachable)}
    w = [weights[i] for i in reachable]
    prefix = [0]
    for x in w:
        prefix.append(prefix[-1] + x)
    c = len(w)
    source, sink = 2 * c, 2 * c + 1
    graph = [[] for _ in range(2 * c + 2)]

    def edge(u, v, cap, cost):
        assert cost >= 0
        graph[u].append([v, len(graph[v]), cap, cost])
        graph[v].append([u, len(graph[u]) - 1, 0, -cost])

    edge(source, 0, k, 0)
    for u in range(c):
        edge(2 * u, 2 * u + 1, 1, 0)
        edge(2 * u, 2 * u + 1, k, w[u])
        edge(2 * u + 1, sink, k, prefix[-1] - prefix[u + 1])
    for old_u in reachable:
        u = ids[old_u]
        for old_v in adj[old_u]:
            v = ids[old_v]
            edge(2 * u + 1, 2 * v, k, prefix[v] - prefix[u + 1])
    cost = 0
    for _ in range(k):
        dist, parent = [10**30] * len(graph), [None] * len(graph)
        dist[source] = 0
        # An independent residual shortest-path implementation.
        for _ in range(len(graph) - 1):
            updated = False
            for u, edges in enumerate(graph):
                for i, (v, _, cap, fee) in enumerate(edges):
                    if cap and dist[u] < 10**30 and dist[u] + fee < dist[v]:
                        dist[v] = dist[u] + fee
                        parent[v] = u, i
                        updated = True
            if not updated:
                break
        assert parent[sink] is not None
        cost += dist[sink]
        v = sink
        while v != source:
            u, i = parent[v]
            e = graph[u][i]
            e[2] -= 1
            graph[v][e[1]][2] += 1
            v = u
    return k * prefix[-1] - cost


edges = list(combinations(range(5), 2))
for bits in range(1 << len(edges)):
    adj = [[] for _ in range(5)]
    for i, (u, v) in enumerate(edges):
        if bits >> i & 1:
            adj[u].append(v)
    weights = [rng.randrange(1, 10) for _ in adj]
    paths = all_paths(adj, 0)
    for k in (1, 2, 3):
        unions = {0}
        for _ in range(k):
            unions = {a | b for a in unions for b in paths}
        direct = max(sum(w for i, w in enumerate(weights) if mask >> i & 1) for mask in unions)
        assert collecting_flow(adj, weights, k) == direct
        checks['ABC214 H nonnegative network vs K-path enumeration'] += 1


def camera_dual(a, b, c):
    flow_limit = min(sum(a), sum(b))
    big = max(map(max, c))
    best, best_fixed_cost = 0, 10**30
    for values in product(range(flow_limit + 1), repeat=len(a) * len(b)):
        if any(sum(values[i * len(b):(i + 1) * len(b)]) > a[i] for i in range(len(a))):
            continue
        if any(sum(values[i * len(b) + j] for i in range(len(a))) > b[j] for j in range(len(b))):
            continue
        reward = sum(c[i][j] * values[i * len(b) + j] for i in range(len(a)) for j in range(len(b)))
        best = max(best, reward)
        if sum(values) == flow_limit:
            cost = sum((big - c[i][j]) * values[i * len(b) + j]
                       for i in range(len(a)) for j in range(len(b)))
            best_fixed_cost = min(best_fixed_cost, cost)
    assert best == flow_limit * big - best_fixed_cost
    bound = big
    primal = min(sum(x * w for x, w in zip(left, a)) + sum(x * w for x, w in zip(right, b))
                 for left in product(range(bound + 1), repeat=len(a))
                 for right in product(range(bound + 1), repeat=len(b))
                 if all(left[i] + right[j] >= c[i][j] for i in range(len(a)) for j in range(len(b))))
    assert primal == best


for _ in range(500):
    l, r = rng.randrange(1, 3), rng.randrange(1, 3)
    a, b = [rng.randrange(1, 4) for _ in range(l)], [rng.randrange(1, 4) for _ in range(r)]
    c = [[rng.randrange(4) for _ in range(r)] for _ in range(l)]
    camera_dual(a, b, c)
    checks['ABC224 H fixed-flow shift vs all camera assignments and dual flows'] += 1


def clip_reconstruct(xs, c, d):
    alpha, beta, events = -c, 0, {0: 2 * c}
    domains = [(0, 0)]
    lo, hi = min([0] + xs), max([0] + xs)
    direct = {x: c * abs(x) for x in range(lo, hi + 1)}
    for i, coordinate in enumerate(xs):
        if i:
            endpoints = []
            for left in (True, False):
                remaining = d
                while remaining:
                    z = min(events) if left else max(events)
                    take = min(remaining, events[z])
                    if left:
                        alpha += take
                        beta -= take * z
                    events[z] -= take
                    remaining -= take
                    if not events[z]:
                        del events[z]
                endpoints.append(z)
            domains.append(tuple(endpoints))
            direct = {x: min(value + c * abs(x - y) for y, value in direct.items())
                      for x in range(lo, hi + 1)}
        alpha -= d
        beta += d * coordinate
        events[coordinate] = events.get(coordinate, 0) + 2 * d
        direct = {x: value + d * abs(x - coordinate) for x, value in direct.items()}
        evaluate = lambda x: beta + alpha * x + sum(w * max(x - z, 0) for z, w in events.items())
        assert all(evaluate(x) == value for x, value in direct.items())
    best = min(direct, key=direct.get)
    locations = [best]
    for l, r in reversed(domains[1:]):
        best = min(max(best, l), r)
        locations.append(best)
    locations.reverse()
    cost = sum(c * abs(x - y) + d * abs(x - z)
               for x, y, z in zip(locations, [0] + locations, xs))
    assert cost == min(direct.values())


for _ in range(1000):
    clip_reconstruct([rng.randrange(-4, 5) for _ in range(rng.randrange(1, 7))],
                     rng.randrange(1, 8), rng.randrange(1, 8))
    checks['ABC406 G weighted coefficients and reconstruction vs coordinate DP'] += 1


def add(a, b):
    out = [0] * max(len(a), len(b))
    for i, x in enumerate(a):
        out[i] += x
    for i, x in enumerate(b):
        out[i] += x
    return out


def antichain_heavy(parents):
    n = len(parents)
    children = [[] for _ in parents]
    for v in range(1, n):
        children[parents[v]].append(v)
    sizes = [1] * n
    for v in range(n - 1, 0, -1):
        sizes[parents[v]] += sizes[v]

    def compose(x, y):
        a, b = x
        c, d = y
        return add(a, convolution(b, c, n)), convolution(b, d, n)

    def visit(v):
        transforms, weights = [], []
        while True:
            heavy = max(children[v], key=lambda x: sizes[x], default=None)
            g, weight = [1], 1
            for u in children[v]:
                if u != heavy:
                    g = convolution(g, visit(u), n)
                    weight += sizes[u]
            transforms.append(([0, 1], g))
            weights.append(weight)
            if heavy is None:
                break
            v = heavy

        def merge(lo, hi):
            if lo == hi:
                return [0], [1]
            half, accum = sum(weights[lo:hi]) / 2, 0
            pivot = lo
            while accum + weights[pivot] < half:
                accum += weights[pivot]
                pivot += 1
            return compose(compose(merge(lo, pivot), transforms[pivot]), merge(pivot + 1, hi))

        a, b = merge(0, len(transforms))
        return add(a, b)
    return visit(0)


for _ in range(500):
    n = rng.randrange(1, 10)
    parents = [-1] + [rng.randrange(v) for v in range(1, n)]
    counts = [0] * (n + 1)
    for mask in range(1 << n):
        valid = True
        for v in range(n):
            if mask >> v & 1:
                p = parents[v]
                while p >= 0:
                    if mask >> p & 1:
                        valid = False
                    p = parents[p]
        if valid:
            counts[bin(mask).count('1')] += 1
    actual = antichain_heavy(parents)
    assert actual + [0] * (len(counts) - len(actual)) == counts
    checks['ABC269 Ex weighted affine path merge vs antichain enumeration'] += 1


def prefix_perfect(parents):
    n = len(parents)
    depth = (n + 1).bit_length() - 2
    dp = [[0] * (depth + 1) for _ in parents]
    sums = [[0] * (depth + 1) for _ in parents]
    answer, output = 0, []
    for v in range(n):
        d, delta = 0, 1
        while True:
            old = dp[v][d]
            dp[v][d] += delta
            if v == 0:
                answer += delta
                break
            if d == depth:
                break
            p = parents[v]
            next_delta = delta * (sums[p][d] - old)
            sums[p][d] += delta
            v, d, delta = p, d + 1, next_delta
            if not delta:
                break
        output.append(answer)
    return output


def enumerate_perfect(parents, end):
    count = 0
    for mask in range(1, 1 << end, 2):
        leaf_depths, valid = set(), True
        for v in range(end):
            if not mask >> v & 1:
                continue
            if v and not mask >> parents[v] & 1:
                valid = False
            children = sum(mask >> u & 1 for u in range(1, end) if parents[u] == v)
            if children not in (0, 2):
                valid = False
            if not children:
                depth, p = 0, parents[v]
                while p >= 0:
                    depth += 1
                    p = parents[p]
                leaf_depths.add(depth)
        count += valid and len(leaf_depths) == 1
    return count


for _ in range(500):
    n = rng.randrange(1, 10)
    parents = [-1] + [rng.randrange(v) for v in range(1, n)]
    assert prefix_perfect(parents) == [enumerate_perfect(parents, end) for end in range(1, n + 1)]
    checks['ABC264 Ex root-only prefix answers vs induced-subset enumeration'] += 1


def column_moves(state, white):
    mine, other = (1, 2) if white else (2, 1)
    for i, color in enumerate(state):
        if color == other:
            yield state[:i] + (0,) + state[i + 1:]
        if color == mine and i and state[i - 1] == 0:
            out = list(state)
            out[i - 1], out[i] = mine, 0
            yield tuple(out)


def dyadic(lo, hi):
    for exponent in range(40):
        scale = 1 << exponent
        lower = lo * scale if lo is not None else None
        upper = hi * scale if hi is not None else None
        a = lower.numerator // lower.denominator + 1 if lower is not None else -10**9
        b = -((-upper.numerator) // upper.denominator) - 1 if upper is not None else 10**9
        if a <= b:
            return Fraction(min(max(0, a), b), scale)
    raise AssertionError('dyadic bound exceeded')


@lru_cache(None)
def column_value(state):
    left = [column_value(s) for s in column_moves(state, True)]
    right = [column_value(s) for s in column_moves(state, False)]
    lo, hi = max(left, default=None), min(right, default=None)
    assert lo is None or hi is None or lo < hi
    value = dyadic(lo, hi)
    height = sum((i + 1) for i, color in enumerate(state) if color)
    assert value.denominator <= 1 << height
    return value


@lru_cache(None)
def minimax(columns, white):
    for i, column in enumerate(columns):
        for state in column_moves(column, white):
            next_columns = columns[:i] + (state,) + columns[i + 1:]
            if not minimax(next_columns, not white):
                return True
    return False


for height in range(1, 5):
    for column in product(range(3), repeat=height):
        value = column_value(column)
        assert minimax((column,), True) == (value > 0)
        assert minimax((column,), False) == (value < 0)
        checks['ABC229 H exact dyadics vs single-column minimax'] += 1
for _ in range(400):
    columns = tuple(tuple(rng.randrange(3) for _ in range(3)) for _ in range(rng.randrange(1, 4)))
    total = sum(column_value(s) for s in columns)
    assert minimax(columns, True) == (total > 0)
    assert minimax(columns, False) == (total < 0)
    checks['ABC229 H column addition vs whole-board minimax'] += 1


def stern_brocot(left, right):
    a, b, c, d = 0, 1, 1, 0
    while True:
        p, q = a + c, b + d
        if p * left.denominator <= left.numerator * q:
            k = (left.numerator * b - left.denominator * a) // (
                left.denominator * c - left.numerator * d)
            assert k >= 1
            a, b = a + k * c, b + k * d
        elif p * right.denominator >= right.numerator * q:
            k = (right.denominator * c - right.numerator * d) // (
                right.numerator * b - right.denominator * a)
            assert k >= 1
            c, d = c + k * a, d + k * b
        else:
            return p, q
        assert b * c - a * d == 1


endpoints = sorted({Fraction(a, b) for a in range(0, 9) for b in range(1, 9)})
for left, right in combinations(endpoints, 2):
    p, q = stern_brocot(left, right)
    assert left < Fraction(p, q) < right
    for smaller in range(1, q):
        first = left.numerator * smaller // left.denominator + 1
        assert first * right.denominator >= right.numerator * smaller
    checks['ABC408 G strict Stern-Brocot vs denominator enumeration'] += 1
for left, right in ((Fraction(1, 3), Fraction(1, 2)),
                    (Fraction(10**18 - 1, 10**18), Fraction(1)),
                    (Fraction(10**18 - 1), Fraction(10**18))):
    p, q = stern_brocot(left, right)
    assert left < Fraction(p, q) < right
    assert q <= left.denominator + right.denominator

for name, count in sorted(checks.items()):
    print(f'{name}: {count} passed')
