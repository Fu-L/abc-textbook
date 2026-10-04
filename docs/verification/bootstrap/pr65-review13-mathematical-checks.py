"""PR65 review 13: independent finite checks for boundaries and proof steps.

Python 3.9+, standard library only. These do not certify all textbook proofs.
"""

from bisect import bisect_left
from collections import Counter
from functools import lru_cache
from heapq import heapify, heappop, heappush
from itertools import combinations, combinations_with_replacement, product
from math import factorial, gcd
from pathlib import Path
import json
import random


COUNTS = Counter()
RNG = random.Random(6513)


def checked(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    COUNTS[name] += 1


@lru_cache(None)
def allocations(total, slots):
    if slots == 0:
        return ((),) if total == 0 else ()
    return tuple(
        (first,) + rest
        for first in range(total + 1)
        for rest in allocations(total - first, slots - 1)
    )


def election_cost(b, prefix, m, i, x):
    left = len(b) - m - int(i >= len(b) - m)
    t = b[i] + x
    right = max(left, bisect_left(b, t + 1))
    cost = (right - left) * (t + 1) - (prefix[right] - prefix[left])
    if i >= len(b) - m:
        cost -= x + 1
    return cost


def election_answer(b, prefix, m, i, rem):
    if m == len(b):
        return 0
    if election_cost(b, prefix, m, i, rem) <= 0:
        return -1
    lo, hi = -1, rem
    while hi - lo > 1:
        x = (hi + lo) // 2
        if election_cost(b, prefix, m, i, x) > rem - x:
            hi = x
        else:
            lo = x
    return hi


def check_election():
    checked("373 tied zero remaining", [election_answer([1, 1], [0, 1, 2], 1, i, 0)
                                        for i in range(2)], [0, 0])
    checked("373 equal budget is unsafe", election_cost([1, 1], [0, 1, 2], 1, 0, 0), 1)
    # Original predicate's missing tie is a concrete mathematical counterexample.
    checked("373 original strict boundary fails", sum(max(0, 2 - a) for a in [1] if a < 1), 0)
    for n in range(1, 5):
        for b in combinations_with_replacement(range(3), n):
            prefix = [0]
            for a in b:
                prefix.append(prefix[-1] + a)
            for m, rem, i in product(range(1, n + 1), range(5), range(n)):
                predicates = []
                for x in range(rem + 1):
                    others = [a for j, a in enumerate(b) if j != i]
                    # All distributions of the actual remaining votes, with ties allowed.
                    brute = all(
                        sum(a + v > b[i] + x for a, v in zip(others, dist)) < m
                        for dist in allocations(rem - x, n - 1)
                    )
                    # For n=1, no opponent can defeat the candidate even with leftover votes.
                    if n == m:
                        brute = True
                    fast = n == m or election_cost(b, prefix, m, i, x) > rem - x
                    checked("373 allocation predicate", fast, brute)
                    predicates.append(brute)
                expected = next((x for x, safe in enumerate(predicates) if safe), -1)
                checked("373 binary answer", election_answer(b, prefix, m, i, rem), expected)
                checked("373 monotonicity", predicates, sorted(predicates))
    # Large values: includes same-vote opponents and the upper sorted region.
    b = [0, 10**12, 10**12]
    prefix = [0, 0, 10**12, 2 * 10**12]
    for i, x in product(range(3), [0, 1, 10**12]):
        for m in [1, 2]:
            costs = sorted(max(0, b[i] + x + 1 - a) for j, a in enumerate(b) if j != i)
            checked("373 64bit aggregation", election_cost(b, prefix, m, i, x), sum(costs[:m]))


@lru_cache(None)
def optimal_merge(weights):
    if len(weights) <= 1:
        return 0
    return min(
        weights[i] + weights[j] + optimal_merge(tuple(sorted(
            [w for k, w in enumerate(weights) if k not in (i, j)] + [weights[i] + weights[j]]
        )))
        for i, j in combinations(range(len(weights)), 2)
    )


def huffman(weights):
    q = list(weights)
    heapify(q)
    ans = 0
    while len(q) > 1:
        value = heappop(q) + heappop(q)
        ans += value
        heappush(q, value)
    return ans


def partitions(total, lower=1):
    if total == 0:
        yield ()
    for w in range(lower, total + 1):
        for rest in partitions(total - w, w):
            yield (w,) + rest


def check_bread():
    for n in range(1, 6):
        for weights in combinations_with_replacement(range(1, 5), n):
            checked("252 all merge choices", huffman(weights), optimal_merge(weights))
            if n >= 2:
                a, b = weights[:2]
                contracted = tuple(sorted(weights[2:] + (a + b,)))
                checked("252 optimal contraction", optimal_merge(weights), a + b + optimal_merge(contracted))
    for n in range(2, 5):
        for weights in combinations_with_replacement(range(1, 4), n):
            for rem in range(6):
                normalized = tuple(sorted(weights + ((rem,) if rem else ())))
                # All legal partitions of the discarded bread, all merge trees for each.
                brute = min(optimal_merge(tuple(sorted(weights + extra))) for extra in partitions(rem))
                checked("252 arbitrary remainder splitting", huffman(normalized), brute)


def partition_dp(ds, limit):
    n = len(ds)
    lcm = [1] * (1 << n)
    weight = [0] * (1 << n)
    for mask in range(1, 1 << n):
        bit = mask & -mask
        d = ds[bit.bit_length() - 1]
        old = lcm[mask ^ bit]
        q = old // gcd(old, d)
        lcm[mask] = limit + 1 if old > limit or q > limit // d else q * d
        size = bin(mask).count("1")
        weight[mask] = limit // lcm[mask] * (-1)**(size - 1) * factorial(size - 1)
    dp = [1] + [0] * ((1 << n) - 1)
    for mask in range(1, 1 << n):
        anchor = mask & -mask
        sub = mask
        while sub:
            if sub & anchor:
                dp[mask] += weight[sub] * dp[mask ^ sub]
            sub = (sub - 1) & mask
    return dp[-1]


def check_signed_components():
    for n in range(1, 7):
        edges = list(combinations(range(n), 2))
        total = connected = 0
        for mask in range(1 << len(edges)):
            adj = [set() for _ in range(n)]
            for e, (a, b) in enumerate(edges):
                if mask >> e & 1:
                    adj[a].add(b)
                    adj[b].add(a)
            seen, stack = {0}, [0]
            while stack:
                for v in adj[stack.pop()] - seen:
                    seen.add(v)
                    stack.append(v)
            sign = (-1)**bin(mask).count("1")
            total += sign
            connected += sign * (len(seen) == n)
        checked("236 all graph cancellation", total, int(n == 1))
        checked("236 connected coefficient", connected, (-1)**(n - 1) * factorial(n - 1))
    for n, limit in product(range(1, 5), range(1, 8)):
        for ds in product(range(1, min(3, limit) + 1), repeat=n):
            brute = sum(len(set(xs)) == n for xs in product(*(range(d, limit + 1, d) for d in ds)))
            checked("236 distinct assignments", partition_dp(ds, limit), brute)
    checked("236 huge LCM saturation", partition_dp([10**18, 10**18 - 1], 10**18), 1)


def baggage(goods, people):
    a, b = [0] * 6, [0] * 6
    for w in goods:
        a[w] += 1
    for c in people:
        b[c] += 1

    def pack(w, c):
        take = min(a[w], b[c])
        a[w] -= take
        b[c] -= take
        b[c - w] += take

    for w, c in [(5, 5), (4, 4), (4, 5), (3, 3), (3, 5), (3, 4)]:
        pack(w, c)
    for w in [2, 1]:
        for c in range(5, w - 1, -1):
            pack(w, c)
    return not any(a)


@lru_cache(None)
def can_pack(goods, people):
    if not goods:
        return True
    if sum(goods) > sum(people):
        return False
    w = goods[-1]
    return any(
        c >= w and can_pack(goods[:-1], tuple(sorted(people[:i] + people[i + 1:] + (c - w,))))
        for i, c in enumerate(people)
        if i == 0 or c != people[i - 1]
    )


def check_baggage():
    for ng, np in product(range(1, 6), range(1, 5)):
        for goods in combinations_with_replacement(range(1, 6), ng):
            for people in combinations_with_replacement(range(1, 6), np):
                checked("226 all assignments", baggage(goods, people), can_pack(goods, people))
    checked("226 total capacity is insufficient criterion", baggage((2, 2), (1, 3)), False)
    checked("226 prefer five over four for three", baggage((2, 2, 2, 3), (4, 5)), True)
    checked("226 multiple twos on same person", baggage((2, 2), (4,)), True)


def interval_greedy(intervals):
    pending = sorted(intervals)
    heap, i, x = [], 0, 0
    while i < len(pending) or heap:
        if not heap:
            x = pending[i][0]
        while i < len(pending) and pending[i][0] <= x:
            heappush(heap, pending[i][1])
            i += 1
        if heappop(heap) < x:
            return False
        x += 1
    return True


def interval_brute(intervals, used=()):
    if not intervals:
        return True
    lo, hi = intervals[0]
    return any(x not in used and interval_brute(intervals[1:], used + (x,)) for x in range(lo, hi + 1))


def chocolate_greedy(chocolates, boxes):
    remaining = list(boxes)
    for a, b in sorted(chocolates, reverse=True):
        options = [(d, j) for j, (c, d) in enumerate(remaining) if c >= a and d >= b]
        if not options:
            return False
        remaining.pop(min(options)[1])
    return True


def chocolate_brute(chocolates, boxes):
    if not chocolates:
        return True
    a, b = chocolates[0]
    return any(c >= a and d >= b and chocolate_brute(chocolates[1:], boxes[:i] + boxes[i + 1:])
               for i, (c, d) in enumerate(boxes))


def check_exchanges():
    intervals = [(a, b) for a in range(1, 5) for b in range(a, 5)]
    for n in range(1, 6):
        for xs in combinations_with_replacement(intervals, n):
            checked("214 interval injections", interval_greedy(xs), interval_brute(xs))
    checked("214 sparse jump and inclusive endpoint", interval_greedy([(1, 1), (10**9, 10**9)]), True)
    rectangles = list(product(range(1, 4), repeat=2))
    for n in [1, 2]:
        for cs in combinations_with_replacement(rectangles, n):
            for m in [n, n + 1]:
                for bs in combinations_with_replacement(rectangles, m):
                    checked("245 rectangle injections", chocolate_greedy(cs, bs), chocolate_brute(cs, bs))
    for _ in range(300):
        cs = tuple(RNG.choices(rectangles, k=4))
        bs = tuple(RNG.choices(rectangles, k=5))
        checked("245 larger injections", chocolate_greedy(cs, bs), chocolate_brute(cs, bs))


def tree_from_prufer(n, code):
    adj = [set() for _ in range(n)]
    degree = [1] * n
    for v in code:
        degree[v] += 1
    for v in code:
        u = next(i for i in range(n) if degree[i] == 1)
        adj[u].add(v)
        adj[v].add(u)
        degree[u] -= 1
        degree[v] -= 1
    if n >= 2:
        a, b = [i for i in range(n) if degree[i] == 1]
        adj[a].add(b)
        adj[b].add(a)
    return adj


def centroid_tree(adj):
    n = len(adj)
    parent = [-2] * n
    removed = set()

    def build(start, ancestor):
        prev, order = {start: -1}, [start]
        for v in order:
            for u in adj[v]:
                if u not in removed and u != prev[v]:
                    prev[u] = v
                    order.append(u)
        sub = {}
        for v in reversed(order):
            sub[v] = 1 + sum(sub[u] for u in adj[v] if prev.get(u) == v)
        size = len(order)
        c = next(v for v in order if max([size - sub[v]] +
                 [sub[u] for u in adj[v] if prev.get(u) == v]) * 2 <= size)
        parent[c] = ancestor
        removed.add(c)
        for u in adj[c] - removed:
            build(u, c)

    build(0, -1)
    return parent


def check_tree_output(adj, parent):
    n = len(adj)
    ancestors = []
    for v in range(n):
        line = []
        while v != -1:
            assert v not in line, ("291 parent cycle", parent)
            line.append(v)
            v = parent[v]
        ancestors.append(line)
    checked("291 one root", parent.count(-1), 1)
    size = [sum(v in line for line in ancestors) for v in range(n)]
    for v, p in enumerate(parent):
        if p >= 0:
            checked("291 subtree halves", 2 * size[v] <= size[p], True)
    distance = []
    for start in range(n):
        dist = {start: 0}
        queue = [start]
        for v in queue:
            for u in adj[v] - dist.keys():
                dist[u] = dist[v] + 1
                queue.append(u)
        distance.append(dist)
    for x, y in combinations(range(n), 2):
        z = next(v for v in ancestors[x] if v in ancestors[y])
        checked("291 LCA on original path", distance[x][z] + distance[z][y], distance[x][y])


def check_centroids():
    for n in range(1, 7):
        for code in product(range(n), repeat=max(0, n - 2)):
            adj = tree_from_prufer(n, code)
            check_tree_output(adj, centroid_tree(adj))
    # A valid output need not have each child equal one original separator component.
    star = [{1, 2, 3}, {0}, {0}, {0}]
    check_tree_output(star, [-1, 0, 1, 0])


def slime_best(strengths, multiplier, start, greedy):
    neighbors = [{1, 2}, {0, 3}, {0, 3}, {1, 2}]
    if greedy:
        seen, q = {start}, []
        total = strengths[start]
        for u in neighbors[start]:
            heappush(q, (strengths[u], u))
            seen.add(u)
        while q and q[0][0] <= (total - 1) // multiplier:
            s, v = heappop(q)
            total += s
            for u in neighbors[v] - seen:
                seen.add(u)
                heappush(q, (strengths[u], u))
        return total
    reached, stack = {1 << start}, [1 << start]
    best = 0
    while stack:
        mask = stack.pop()
        total = sum(s for v, s in enumerate(strengths) if mask >> v & 1)
        best = max(best, total)
        for u, s in enumerate(strengths):
            if not (mask >> u & 1) and multiplier * s < total and any(mask >> v & 1 for v in neighbors[u]):
                nxt = mask | 1 << u
                if nxt not in reached:
                    reached.add(nxt)
                    stack.append(nxt)
    return best


def check_slime():
    for values in product(range(1, 5), repeat=4):
        for multiplier, start in product(range(1, 5), range(4)):
            checked("384 all absorption orders", slime_best(values, multiplier, start, True),
                    slime_best(values, multiplier, start, False))
    checked("384 equality cannot absorb", slime_best((10, 5, 5, 5), 2, 0, True), 10)
    checked("384 reconsider after strengthening", slime_best((10, 4, 5, 5), 2, 0, True), 24)
    for total, s, x in product([1, 10, 10**12, 25 * 10**16], [1, 5, 10**12], [1, 2, 10**9]):
        checked("384 exact integer division", s <= (total - 1) // x, x * s < total)


def check_all_documents():
    paths = sorted(Path("src/content/docs/problems").glob("*/*/*/*.md"))
    checked("all document count", len(paths), 868)
    for p in paths:
        text = p.read_text()
        front, body = text.split("\n---\n", 1)
        unit = json.loads(front.split("authoringUnit: ", 1)[1])
        correctness = body.split("## 正当性\n\n", 1)[1].split("\n\n## 実装上の注意", 1)[0].strip()
        # Canonical renderer escapes brackets that could become Markdown links.
        correctness = correctness.replace(r"\[", "[")
        claim = next(c["text"] for c in unit["claims"] if c["key"] == "correctness")
        checked("all correctness claim synchronization", claim, correctness)


if __name__ == "__main__":
    check_election()
    check_bread()
    check_signed_components()
    check_baggage()
    check_exchanges()
    check_centroids()
    check_slime()
    check_all_documents()
    print(json.dumps({"checks": dict(sorted(COUNTS.items())), "total": sum(COUNTS.values())}, indent=2))
