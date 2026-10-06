"""PR65 review 12: compare textbook algorithms with independent small models.

Python 3.9+, standard library only. Finite checks complement the prose proofs.
"""

from collections import Counter, deque
from fractions import Fraction as F
from itertools import combinations, combinations_with_replacement, permutations, product
from pathlib import Path
import json
import random


RNG = random.Random(6512)
COUNTS = Counter()


def checked(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    COUNTS[name] += 1


def basis(values, width):
    rows = [0] * width
    for x in values:
        for b in range(width - 1, -1, -1):
            if x >> b & 1:
                if rows[b]:
                    x ^= rows[b]
                else:
                    rows[b] = x
                    break
    return rows


def xor_values(values):
    result = {0}
    for x in values:
        result |= {y ^ x for y in result}
    return result


def greedy_coins(amount, coins):
    count = 0
    for value in reversed(coins):
        q, amount = divmod(amount, value)
        count += q
    assert amount == 0
    return count


def tree_instance(k, depth):
    children = []
    levels = []
    edges = []

    def build(h):
        v = len(children)
        children.append([])
        levels.append(h)
        if h:
            for _ in range(k):
                u = build(h - 1)
                children[v].append(u)
                edges.append((v, u))
        return v

    build(depth)
    return children, levels, edges


def check_290():
    for k in range(2, 7):
        coins = [1]
        for _ in range(5):
            coins.append(1 + k * coins[-1])
            limit = min(2500, k * coins[-1])
            dp = [0] + [10**9] * limit
            for amount in range(1, limit + 1):
                dp[amount] = 1 + min(dp[amount - c] for c in coins if c <= amount)
                checked("290 coin DP", greedy_coins(amount, coins), dp[amount])

    for k, depth in [(2, 1), (2, 2), (2, 3), (3, 1), (3, 2)]:
        children, levels, edges = tree_instance(k, depth)
        n = len(children)
        best = [10**9] * (n + 1)
        # Original operation: enumerate deleted edges and resulting components.
        for mask in range(1 << len(edges)):
            adj = [[] for _ in range(n)]
            for e, (u, v) in enumerate(edges):
                if not (mask >> e & 1):
                    adj[u].append(v)
                    adj[v].append(u)
            seen = set()
            cost = bin(mask).count("1")
            for v in range(n):
                if v in seen:
                    continue
                stack = [v]
                seen.add(v)
                size = 0
                while stack:
                    u = stack.pop()
                    size += 1
                    for w in adj[u]:
                        if w not in seen:
                            seen.add(w)
                            stack.append(w)
                best[size] = min(best[size], cost)
        sizes = [1]
        for _ in range(depth):
            sizes.append(1 + k * sizes[-1])
        for x in range(1, n + 1):
            answer = min(
                int(h < depth) + greedy_coins(sizes[h] - x, sizes[:h])
                for h in range(depth + 1)
                if sizes[h] >= x
            )
            checked("290 original cuts", answer, best[x])

        def vertices(v):
            return {v}.union(*(vertices(u) for u in children[v]))

        def place(v, amount):
            if levels[v] == 0:
                assert amount == 0
                return set(), 0
            q, r = divmod(amount, sizes[levels[v] - 1])
            removed = set()
            for u in children[v][:q]:
                part = vertices(u)
                assert not removed & part
                removed |= part
            count = q
            if r:
                assert q < k
                part, extra = place(children[v][q], r)
                assert not removed & part
                removed |= part
                count += extra
            return removed, count

        for amount in range(n):
            removed, count = place(0, amount)
            kept = set(range(n)) - removed
            reached = {0}
            stack = [0]
            while stack:
                for u in children[stack.pop()]:
                    if u in kept:
                        reached.add(u)
                        stack.append(u)
            checked("290 disjoint placement", (len(removed), reached, count),
                    (amount, kept, greedy_coins(amount, sizes[:-1])))


def affine_branch(rows, constraints, width):
    v0, free = 0, list(rows)
    for bit, target in constraints:
        at = next((i for i, w in enumerate(free) if w >> bit & 1), None)
        if at is None:
            if v0 >> bit & 1 != target:
                return None
            continue
        w = free.pop(at)
        if v0 >> bit & 1 != target:
            v0 ^= w
        free = [u ^ w if u >> bit & 1 else u for u in free]
    mask = (1 << width) - 1
    res = v0 & mask
    for w in reversed(basis([u & mask for u in free], width)):
        res = max(res, res ^ w)
    return v0, free, res


def cards_answer(cards, k, width):
    packed = [(a << width) | b for a, b in cards]
    rows = [w for w in basis(packed, width * 2) if w]
    branches = [[(width + t, k >> t & 1) for t in range(width - 1, -1, -1)]]
    for t in range(width):
        if k >> t & 1:
            branches.append(
                [(width + b, k >> b & 1) for b in range(width - 1, t, -1)]
                + [(width + t, 0)]
            )
    answer = -1
    for constraints in branches:
        result = affine_branch(rows, constraints, width)
        if result is None:
            continue
        v0, free, value = result
        if value or v0 or free or len(cards) > len(rows):
            answer = max(answer, value)
        expected_set = {x for x in xor_values(packed)
                        if all(x >> b & 1 == e for b, e in constraints)}
        checked("249 affine set", {v0 ^ x for x in xor_values(free)}, expected_set)
    return answer


def check_249():
    cases = [([(1, 5)], 1), ([(1, 0)], 0), ([(1, 0), (1, 0)], 0),
             ([(0, 0)], 0), ([(1, 0)], 1), ([(0, 5)], 0)]
    cases += [([(RNG.randrange(16), RNG.randrange(16))
                for _ in range(RNG.randrange(1, 9))], RNG.randrange(16))
              for _ in range(500)]
    for cards, k in cases:
        brute = -1
        for mask in range(1, 1 << len(cards)):
            a, b = 0, 0
            for i, (ai, bi) in enumerate(cards):
                if mask >> i & 1:
                    a ^= ai
                    b ^= bi
            if a <= k:
                brute = max(brute, b)
        checked("249 nonempty subsets", cards_answer(cards, k, 4), brute)
    checked("249 30-bit representative",
            cards_answer([((1 << 29), (1 << 29) + 5)], (1 << 29), 30),
            (1 << 29) + 5)


def line_key(p, q):
    dx = q[0] - p[0]
    if not dx:
        return None
    a, c = F(q[1] - p[1], dx), F(q[2] - p[2], dx)
    return a, p[1] - a * p[0], c, p[2] - c * p[0]


def line_meet(l, m):
    a, b, c, d = l
    e, f, g, h = m
    if a != e:
        x = (f - b) / (a - e)
    elif c != g:
        x = (h - d) / (c - g)
    else:
        return None
    if x >= 0 or a * x + b != e * x + f or c * x + d != g * x + h:
        return None
    return x, a * x + b, c * x + d


def vector_meet(pair, other):
    # Independent 3D parametric intersection P+tD=Q+uE, without slope keys.
    p, p1 = pair
    q, q1 = other
    d = tuple(p1[i] - p[i] for i in range(3))
    e = tuple(q1[i] - q[i] for i in range(3))
    rhs = tuple(q[i] - p[i] for i in range(3))
    for i, j in combinations(range(3), 2):
        det = e[i] * d[j] - d[i] * e[j]
        if det:
            t = F(e[i] * rhs[j] - rhs[i] * e[j], det)
            u = F(d[i] * rhs[j] - rhs[i] * d[j], det)
            point = tuple(F(p[i]) + t * d[i] for i in range(3))
            if point[0] < 0 and all(point[i] == q[i] + u * e[i] for i in range(3)):
                return point
            return None
    return None


def visible(points, p):
    # Original camera: equal directions from p show only their nearest person.
    return len({(F(q[1] - p[1]) / (q[0] - p[0]),
                 F(q[2] - p[2]) / (q[0] - p[0])) for q in points})


def geometry_answer(points):
    lines = set(filter(None, (line_key(p, q) for p, q in combinations(points, 2))))
    cnt = {l: sum(y == l[0] * x + l[1] and z == l[2] * x + l[3]
                  for x, y, z in points) for l in lines}
    hidden = max([0] + [n - 1 for n in cnt.values()])
    crossings = {}
    for l, m in combinations(lines, 2):
        p = line_meet(l, m)
        if p is not None:
            crossings.setdefault(p, set()).update([l, m])
    for p, ids in crossings.items():
        loss = sum(cnt[l] - 1 for l in ids)
        checked("301 ray contributions", loss, len(points) - visible(points, p))
        hidden = max(hidden, loss)
    # Enumerate raw input-pair lines and independently intersect vector equations.
    raw = [(p, q) for p, q in combinations(points, 2) if p[0] != q[0]]
    direct = len(points)
    raw_crossings = set()
    for pair in raw:
        # A generic negative x avoiding every other canonical line.
        l = line_key(*pair)
        for t in range(1, len(lines) + 2):
            p = (F(-t), l[0] * (-t) + l[1], l[2] * (-t) + l[3])
            if sum(p[1] == m[0] * p[0] + m[1] and
                   p[2] == m[2] * p[0] + m[3] for m in lines) == 1:
                direct = min(direct, visible(points, p))
                break
        else:
            raise AssertionError("generic line point not found")
    for pair, other in combinations(raw, 2):
        p = vector_meet(pair, other)
        if p is not None:
            raw_crossings.add(p)
            direct = min(direct, visible(points, p))
    checked("301 true 3D crossings", set(crossings), raw_crossings)
    checked("301 camera objective", len(points) - hidden, direct)


def check_301():
    skew = [(1, 1, 0), (2, 2, 0), (1, -3, 1), (2, -4, 1)]
    checked("301 projected false intersection",
            line_meet(line_key(*skew[:2]), line_key(*skew[2:])), None)
    # Same xy projection, but z equations meet at negative x.
    checked("301 coincident xy projections",
            line_meet(line_key((1, 1, 1), (2, 2, 2)),
                      line_key((1, 1, 3), (2, 2, 5))),
            (F(-1), F(-1), F(-1)))
    cases = [skew, [(1, i, i * i) for i in range(4)],
             [(x, a * (x + 1), b * (x + 1))
              for a, b in [(1, 0), (0, 1), (1, 1)] for x in [1, 2]],
             [(1, 1, 1), (2, 2, 2), (3, 3, 3)]]
    # Force multi-line intersections, duplicate pair lines and fractional keys.
    for _ in range(100):
        slopes = RNG.sample(list(product(range(-3, 4), repeat=2)), 4)
        cases.append([(x, a * (2 * x + 1), b * (2 * x + 1))
                      for a, b in slopes for x in [1, 2, 3]])
    pool = list(product(range(1, 5), range(-3, 4), range(-3, 4)))
    cases += [RNG.sample(pool, RNG.randrange(2, 8)) for _ in range(250)]
    for points in cases:
        geometry_answer(points)


def group_runs(runs, offset, g):
    if sum(k for _, k in runs) < offset:
        return None
    base, cnt, total = 0, 0, 0
    out = []
    for v, k in runs:
        t = min(offset, k)
        base += t * v
        offset -= t
        k -= t
        if cnt:
            t = min(k, g - cnt)
            cnt += t
            total += t * v
            k -= t
            if cnt < g:
                continue
            out.append((total, 1))
            cnt, total = 0, 0
        if k // g:
            out.append((g * v, k // g))
        cnt, total = k % g, v * (k % g)
    assert len(out) <= 2 * len(runs)
    return base, out


def compressed_knapsack(items, capacity):
    runs = {w: sorted([(v, k) for wi, v, k in items if wi == w], reverse=True)
            for w in [1, 2, 3]}
    answer = 0
    for offsets in product(range(6), range(3), range(2)):
        weight = sum(w * offsets[w - 1] for w in [1, 2, 3])
        if weight > capacity:
            continue
        base, groups = 0, []
        for w in [1, 2, 3]:
            result = group_runs(runs[w], offsets[w - 1], 6 // w)
            if result is None:
                break
            base += result[0]
            groups += result[1]
        else:
            q = (capacity - weight) // 6
            for v, k in sorted(groups, reverse=True):
                t = min(q, k)
                base += t * v
                q -= t
            answer = max(answer, base)
    return answer


def check_442():
    for _ in range(500):
        items = [(RNG.randrange(1, 4), RNG.randrange(1, 20), RNG.randrange(1, 5))
                 for _ in range(RNG.randrange(1, 8))]
        capacity = RNG.randrange(1, 25)
        dp = [0] * (capacity + 1)
        for w, v, k in items:
            for _ in range(k):
                for c in range(capacity, w - 1, -1):
                    dp[c] = max(dp[c], dp[c - w] + v)
        checked("442 bounded knapsack", compressed_knapsack(items, capacity), dp[-1])
        for g in [2, 3, 6]:
            runs = sorted([(v, k) for _, v, k in items], reverse=True)
            expanded = [v for v, k in runs for _ in range(k)]
            for offset in range(g):
                result = group_runs(runs, offset, g)
                if result is None:
                    continue
                groups = [v for v, k in result[1] for _ in range(k)]
                rest = expanded[offset:]
                direct = [sum(rest[i:i + g]) for i in range(0, len(rest) - g + 1, g)]
                checked("442 run boundaries", (result[0], groups),
                        (sum(expanded[:offset]), direct))
    checked("442 billion copies", compressed_knapsack([(1, 7, 10**9)], 8), 56)
    checked("442 unavailable residues",
            compressed_knapsack([(3, 442, 442), (2, 442, 442)], 1), 0)
    checked("442 selected sum bound",
            compressed_knapsack([(1, 10**9, 10**9)] * 200, 2 * 10**9), 2 * 10**18)


def check_223():
    width = 4
    for _ in range(200):
        values = [RNG.randrange(1, 16) for _ in range(RNG.randrange(1, 11))]
        rows, pos = [0] * width, [0] * width
        for r, value in enumerate(values, 1):
            x, p = value, r
            for b in range(width - 1, -1, -1):
                if not (x >> b & 1):
                    continue
                if not rows[b]:
                    rows[b], pos[b] = x, p
                    break
                if pos[b] < p:
                    x, rows[b], p, pos[b] = rows[b], x, pos[b], p
                x ^= rows[b]
            for l in range(1, r + 1):
                eligible = [rows[b] for b in range(width) if pos[b] >= l]
                expected = xor_values(values[l - 1:r])
                checked("223 all suffix spans", xor_values(eligible), expected)
                for target in range(1, 16):
                    x = target
                    for b in range(width - 1, -1, -1):
                        if x >> b & 1 and pos[b] >= l:
                            x ^= rows[b]
                    checked("223 pivot queries", x == 0, target in expected)


def check_236():
    for width in range(1, 5):
        values = list(range(1, 1 << width))
        valid = [chosen for chosen in combinations(values, width)
                 if len(xor_values(chosen)) == 1 << width]
        for _ in range(70):
            prices = {x: RNG.randrange(1, 30) for x in values}
            chosen, span = [], {0}
            for x in sorted(values, key=prices.get):
                if x not in span:
                    chosen.append(x)
                    span |= {y ^ x for y in span}
            brute = min(sum(prices[x] for x in choice) for choice in valid)
            checked("236 optimal basis", sum(prices[x] for x in chosen), brute)


def trie_cost(a, b):
    counts = Counter(a)
    counts.subtract(b)
    nodes = {0}
    for x in a + b:
        while x:
            nodes.add(x)
            x //= 2
    cost = 0
    for x in sorted(nodes, reverse=True):
        if x == 0:
            continue
        delta = counts[x]
        if delta < 0 and x % 2:
            return -1
        cost += abs(delta)
        counts[x // 2] += delta
    assert counts[0] == 0
    return cost


def check_254():
    # Independent scalar shortest paths using the original *2 and floor(/2).
    distances = []
    for source in range(16):
        dist = {source: 0}
        queue = deque([source])
        while queue:
            x = queue.popleft()
            for y in [x * 2, x // 2]:
                if y <= 32 and y not in dist:
                    dist[y] = dist[x] + 1
                    queue.append(y)
        distances.append(dist)
    pairs = [(list(a), list(b))
             for a in combinations_with_replacement(range(8), 2)
             for b in combinations_with_replacement(range(8), 2)]
    pairs += [([RNG.randrange(16) for _ in range(n)],
               [RNG.randrange(16) for _ in range(n)])
              for n in range(1, 6) for _ in range(80)]
    for a, b in pairs:
        brute = min(sum(distances[x].get(y, 10**9) for x, y in zip(a, p))
                    for p in permutations(b))
        if brute >= 10**9:
            brute = -1
        checked("254 original moves and assignments", trie_cost(a, b), brute)


def trie_pairs(values, k, width):
    nodes = [[[-1, -1], 0]]
    answer = 0
    for x in values:
        at = 0
        for b in range(width - 1, -1, -1):
            bit = x >> b & 1
            if k >> b & 1:
                less = nodes[at][0][bit]
                if less != -1:
                    answer += nodes[less][1]
                bit ^= 1
            at = nodes[at][0][bit]
            if at == -1:
                break
        else:
            answer += nodes[at][1]
        at = 0
        nodes[at][1] += 1
        for b in range(width - 1, -1, -1):
            bit = x >> b & 1
            if nodes[at][0][bit] == -1:
                nodes[at][0][bit] = len(nodes)
                nodes.append([[-1, -1], 0])
            at = nodes[at][0][bit]
            nodes[at][1] += 1
    return answer


def check_451():
    for _ in range(250):
        n = RNG.randrange(2, 9)
        edges = [(v, RNG.randrange(v), RNG.randrange(16)) for v in range(1, n)]
        occupied = {frozenset([u, v]) for u, v, _ in edges}
        edges += [(u, v, RNG.randrange(16)) for u, v in combinations(range(n), 2)
                  if frozenset([u, v]) not in occupied and RNG.randrange(3) == 0]
        adj = [[] for _ in range(n)]
        for u, v, w in edges:
            adj[u].append((v, w))
            adj[v].append((u, w))
        potential = [None] * n
        potential[0] = 0
        stack = [0]
        while stack:
            u = stack.pop()
            for v, w in adj[u]:
                if potential[v] is None:
                    potential[v] = potential[u] ^ w
                    stack.append(v)
        rows = basis([w ^ potential[u] ^ potential[v] for u, v, w in edges], 4)

        def norm(x):
            for w in reversed(rows):
                x = min(x, x ^ w)
            return x

        normalized = [norm(x) for x in potential]
        minima = []
        for source in range(n):
            seen = {(source, 0)}
            queue = deque(seen)
            while queue:
                u, x = queue.popleft()
                for v, w in adj[u]:
                    state = v, x ^ w
                    if state not in seen:
                        seen.add(state)
                        queue.append(state)
            for target in range(source + 1, n):
                best = min(x for v, x in seen if v == target)
                minima.append(best)
                checked("451 original xor walks",
                        normalized[source] ^ normalized[target], best)
        for k in range(16):
            checked("451 trie and equality", trie_pairs(normalized, k, 4),
                    sum(x <= k for x in minima))
        for x, y in product(range(16), repeat=2):
            checked("451 linear normal form", norm(x ^ y), norm(x) ^ norm(y))


def check_claims():
    paths = sorted(p for p in Path("src/content/docs/problems").rglob("*.md") if "updates" not in p.parts)
    assert len(paths) == 868
    for path in paths:
        text = path.read_text()
        head, body = text.split("\n---\n", 1)
        unit = json.loads(head.split("authoringUnit: ", 1)[1])
        proof = body.split("## 正当性\n\n")[1].split("\n\n## 実装上の注意")[0].strip()
        # Renderer protects bracket expressions that Markdown might read as links.
        proof = proof.replace(r"\[", "[")
        checked("868 prose and Claim", unit["claims"][0]["text"], proof)


if __name__ == "__main__":
    for check in [check_290, check_249, check_301, check_442, check_223,
                  check_236, check_254, check_451, check_claims]:
        check()
    print(json.dumps(dict(COUNTS), ensure_ascii=False, sort_keys=True))
    print(f"Passed {sum(COUNTS.values())} independent finite comparisons.")
