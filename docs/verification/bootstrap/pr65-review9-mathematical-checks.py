# coding: utf-8
"""PR65 review 5400631527: finite independent checks, Python 3.9+, no dependencies.

These checks supplement the written proofs; they do not prove unrestricted inputs.
"""
from collections import Counter, deque
from functools import lru_cache
from itertools import combinations, combinations_with_replacement, permutations, product
from math import comb
from random import Random

rng = Random(6509)
checks = Counter()


def matching(adj):
    mate = [-1] * len(adj)

    def augment(v, seen):
        for u in adj[v]:
            if u in seen:
                continue
            seen.add(u)
            if mate[u] < 0 or augment(mate[u], seen):
                mate[u] = v
                return True
        return False

    return sum(augment(v, set()) for v in range(len(adj)))


def closure(adj):
    result = []
    for v in range(len(adj)):
        seen, queue = set(), list(adj[v])
        for u in queue:
            if u not in seen:
                seen.add(u)
                queue.extend(adj[u])
        result.append(sorted(seen))
    return result


def cover(n, masks):
    dp = [n + 1] * (1 << n)
    dp[0] = 0
    for state in range(1 << n):
        for mask in masks:
            dp[state | mask] = min(dp[state | mask], dp[state] + 1)
    return dp[-1]


edges = list(combinations(range(5), 2))
for bits in range(1 << len(edges)):
    adj = [[] for _ in range(5)]
    for k, (v, u) in enumerate(edges):
        if bits >> k & 1:
            adj[v].append(u)
    reach = closure(adj)
    paths, chains = [], []
    for mask in range(1, 32):
        vs = [v for v in range(5) if mask >> v & 1]
        if all(u in adj[v] for v, u in zip(vs, vs[1:])):
            paths.append(mask)
        if all(u in reach[v] for v, u in zip(vs, vs[1:])):
            chains.append(mask)
    # Disjoint path partitions use a separate brute-force recursion.
    @lru_cache(None)
    def partition(mask):
        if not mask:
            return 0
        first = mask & -mask
        return 1 + min(partition(mask ^ p) for p in paths if p & first and p & mask == p)
    assert 5 - matching(adj) == partition(31)
    assert 5 - matching(reach) == cover(5, chains) == cover(5, paths)
    checks['DAG covers'] += 1
adj = [[2], [2], [3, 4], [], []]
assert (5 - matching(adj), 5 - matching(closure(adj))) == (3, 2)


for bits in range(1 << len(edges)):
    graph = [[] for _ in range(5)]
    for k, (v, u) in enumerate(edges):
        if bits >> k & 1:
            graph[v].append(u)
            graph[u].append(v)
    parent = [-1] * 5
    seen = {0}
    stack = [(0, 0)]
    while stack:
        v, k = stack[-1]
        if k == len(graph[v]):
            stack.pop()
            continue
        stack[-1] = (v, k + 1)
        u = graph[v][k]
        if u not in seen:
            seen.add(u)
            parent[u] = v
            stack.append((u, 0))
    if len(seen) < 5:
        continue
    rec_parent, rec_seen = [-1] * 5, {0}
    def dfs(v):
        for u in graph[v]:
            if u not in rec_seen:
                rec_seen.add(u)
                rec_parent[u] = v
                dfs(u)
    dfs(0)
    assert parent == rec_parent
    def ancestor(v, u):
        while u >= 0:
            if u == v:
                return True
            u = parent[u]
        return False
    assert all(ancestor(v, u) or ancestor(u, v) for v, u in edges if u in graph[v])
    depth, bfs_parent = [None] * 5, [-1] * 5
    depth[0] = 0
    queue = deque([0])
    while queue:
        v = queue.popleft()
        for u in graph[v]:
            if depth[u] is None:
                depth[u], bfs_parent[u] = depth[v] + 1, v
                queue.append(u)
    assert all(abs(depth[v] - depth[u]) <= 1 for v, u in edges if u in graph[v])
    checks['DFS/BFS graphs'] += 1
# Marking all root neighbours makes siblings in the triangle: it is not DFS.
triangle = [[1, 2], [0, 2], [0, 1]]
naive_parent, naive_seen, naive_stack = [-1]*3, {0}, [0]
while naive_stack:
    v = naive_stack.pop()
    for u in triangle[v]:
        if u not in naive_seen:
            naive_seen.add(u)
            naive_parent[u] = v
            naive_stack.append(u)
assert naive_parent == [-1, 0, 0]  # Non-tree edge 1--2 joins siblings.


def support(points, a, b):
    if a == b == 0:
        return 0
    if b == 0:
        return a * (max if a > 0 else min)(x for x, _ in points)
    by_x = {}
    for x, y in points:
        by_x[x] = ((max if b > 0 else min)(by_x[x], y) if x in by_x else y)
    hull = []
    for p in sorted(by_x.items()):
        while len(hull) >= 2:
            u, v = hull[-2:]
            cross = (v[0]-u[0])*(p[1]-v[1])-(v[1]-u[1])*(p[0]-v[0])
            if (cross >= 0 if b > 0 else cross <= 0):
                hull.pop()
            else:
                break
        hull.append(p)
    lo, hi = 0, len(hull)-1
    while lo < hi:
        m = (lo+hi)//2
        delta = a*(hull[m+1][0]-hull[m][0])+b*(hull[m+1][1]-hull[m][1])
        if delta > 0:
            lo = m+1
        else:
            hi = m
    return a*hull[lo][0]+b*hull[lo][1]


grid = list(product(range(-1, 2), repeat=2))
for mask in range(1, 1 << len(grid)):
    points = [p for k, p in enumerate(grid) if mask >> k & 1]
    for a, b in product(range(-2, 3), repeat=2):
        assert support(points, a, b) == max(a*x+b*y for x, y in points)
        checks['hull supports'] += 1
valley = [(0, 100), (1, -100), (2, -99), (3, -97), (4, 0)]
assert support(valley, 0, 1) == 100


@lru_cache(None)
def nim_recursive(a, b, width):
    if width == 1:
        return a*b
    h = width//2
    mask = (1 << h)-1
    a0, a1, b0, b1 = a & mask, a >> h, b & mask, b >> h
    c = nim_recursive(a1, b1, h)
    d = nim_recursive(a0, b0, h)
    e = nim_recursive(a0 ^ a1, b0 ^ b1, h)
    return (d ^ nim_recursive(c, 1 << (h-1), h)) | ((d ^ e) << h)


mex_table = [[0]*16 for _ in range(16)]
for a in range(16):
    for b in range(16):
        values = {mex_table[x][b] ^ mex_table[a][y] ^ mex_table[x][y]
                  for x in range(a) for y in range(b)}
        value = 0
        while value in values:
            value += 1
        mex_table[a][b] = value
        assert value == nim_recursive(a, b, 4)
        checks['Nim mex products'] += 1
small_table = [[nim_recursive(a, b, 8) for b in range(256)] for a in range(256)]
# Bound the memo table; 64-bit random inputs must exercise the actual recurrence.
nim_recursive.cache_clear()


def nim(a, b, width=64):
    if width <= 8:
        return small_table[a][b]
    h = width//2
    mask = (1 << h)-1
    a0, a1, b0, b1 = a & mask, a >> h, b & mask, b >> h
    c, d, e = nim(a1, b1, h), nim(a0, b0, h), nim(a0 ^ a1, b0 ^ b1, h)
    return (d ^ nim(c, 1 << (h-1), h)) | ((d ^ e) << h)


def expanded_product(a, b, width=64):
    if width <= 8:
        return small_table[a][b]
    h = width//2
    mask = (1 << h)-1
    a0, a1, b0, b1 = a & mask, a >> h, b & mask, b >> h
    c = expanded_product(a1, b1, h)
    low = expanded_product(a0, b0, h) ^ expanded_product(c, 1 << (h-1), h)
    high = expanded_product(a0, b1, h) ^ expanded_product(a1, b0, h) ^ c
    return low | (high << h)


def nim_power(a, exponent):
    result = 1
    while exponent:
        if exponent & 1:
            result = nim(result, a)
        a = nim(a, a)
        exponent >>= 1
    return result


for _ in range(200):
    a, b, c = [rng.getrandbits(64) for _ in range(3)]
    assert nim(a, b) == expanded_product(a, b) == nim(b, a)
    assert nim(a, b ^ c) == nim(a, b) ^ nim(a, c)
    assert nim(nim(a, b), c) == nim(a, nim(b, c))
    if a:
        assert nim(a, nim_power(a, (1 << 64)-2)) == 1
    checks['Nim field identities'] += 1
for width in (1, 2, 4, 8, 16, 32):
    eta = 1 << (width-1)
    trace, value = 0, eta
    for _ in range(width):
        trace ^= value
        value = nim_recursive(value, value, width)
    assert trace == 1
nim_recursive.cache_clear()


def lis(a):
    dp = [1]*len(a)
    for i, v in enumerate(a):
        dp[i] = 1 + max([0]+[dp[j] for j in range(i) if a[j] < v])
    return max(dp, default=0)


def changed_lis(a):
    h0, h1 = {}, {}
    for i, v in enumerate(a):
        b = 0 if i == 0 else a[i-1]+1
        u0 = 1 + max([0]+[z for x, z in h0.items() if x < v])
        u1 = 1 + max([0]+[z for x, z in h1.items() if x < v])
        e1 = 1 + max([0]+[z for x, z in h0.items() if x < b])
        h0[v] = max(h0.get(v, 0), u0)
        h1[v] = max(h1.get(v, 0), u1)
        h1[b] = max(h1.get(b, 0), e1)
    return max(h1.values())


for n in range(1, 8):
    for a in product(range(1, 4), repeat=n):
        brute = lis(a)
        for i in range(n):
            for v in range(5):
                brute = max(brute, lis(a[:i]+(v,)+a[i+1:]))
        assert changed_lis(a) == brute, a
        checks['edited LIS arrays'] += 1


def tree_from_prufer(seq, n):
    degree = [1]*n
    for v in seq:
        degree[v] += 1
    graph = [[] for _ in range(n)]
    for v in seq:
        leaf = next(u for u in range(n) if degree[u] == 1)
        graph[leaf].append(v)
        graph[v].append(leaf)
        degree[leaf] -= 1
        degree[v] -= 1
    u, v = [u for u in range(n) if degree[u] == 1]
    graph[u].append(v)
    graph[v].append(u)
    return graph


def path_masks(graph):
    n = len(graph)
    paths, distance = {}, [[0]*n for _ in range(n)]
    for s in range(n):
        queue = [(s, -1, 1 << s, 0)]
        for v, parent, mask, depth in queue:
            paths[s, v], distance[s][v] = mask, depth
            queue.extend((u, v, mask | (1 << u), depth+1) for u in graph[v] if u != parent)
    return paths, distance


def mex_counts(graph):
    n = len(graph)
    paths, distance = path_masks(graph)
    parent, size = [-1]*n, [1]*n
    order = [0]
    for v in order:
        for u in graph[v]:
            if u != parent[v]:
                parent[u] = v
                order.append(u)
    for v in reversed(order[1:]):
        size[parent[v]] += size[v]
    def outside(x, y):
        # Independently walk parents instead of using LCA's binary lifting.
        q = y
        while q >= 0 and parent[q] != x:
            q = parent[q]
        return n-size[q] if q >= 0 else size[x]
    counts = [n*(n+1)//2-sum(size[u]*(size[u]+1)//2 for u in graph[0])]
    x = y = 0
    for z in range(1, n):
        if distance[x][z]+distance[z][y] == distance[x][y]:
            pass
        elif distance[z][x]+distance[x][y] == distance[z][y]:
            x = z
        elif distance[x][y]+distance[y][z] == distance[x][z]:
            y = z
        else:
            counts.extend([0]*(n-len(counts)))
            break
        counts.append(outside(x, y)*outside(y, x))
    brute = [sum(mask & ((1 << k)-1) == (1 << k)-1
                 for (u, v), mask in paths.items() if u <= v) for k in range(1, n+1)]
    assert counts == brute, (graph, counts, brute)
    direct = 0
    for (u, v), mask in paths.items():
        if u <= v:
            mex = 0
            while mask >> mex & 1:
                mex += 1
            direct += mex
    assert sum(counts) == direct


for n in range(2, 7):
    for seq in product(range(n), repeat=n-2):
        mex_counts(tree_from_prufer(seq, n))
        checks['tree mex sums'] += 1


for n in range(1, 7):
    for a in combinations_with_replacement(range(1, 5), n):
        freq = Counter(a)
        for d in range(1, 5):
            answer = 1
            for v, c in sorted(freq.items()):
                window = sum(k for x, k in freq.items() if v-d <= x < v)
                answer *= comb(window+c, c)
            brute = sum(all(x-y <= d for x, y in zip(p, p[1:])) for p in set(permutations(a)))
            assert answer == brute
            checks['multiset arrangements'] += 1


def functional_dp(a, m):
    n = len(a)
    indegree = [0]*n
    children = [[] for _ in a]
    for v, u in enumerate(a):
        indegree[u] += 1
        children[u].append(v)
    queue = deque(v for v in range(n) if indegree[v] == 0)
    while queue:
        v = queue.popleft()
        indegree[a[v]] -= 1
        if indegree[a[v]] == 0:
            queue.append(a[v])
    on_cycle = [d > 0 for d in indegree]
    def below(v):
        ways = [1]*m
        for u in children[v]:
            if on_cycle[u]:
                continue
            c = below(u)
            prefix = 0
            for j in range(m):
                prefix += c[j]
                ways[j] *= prefix
        return ways
    visited, result = set(), 1
    for v in range(n):
        if not on_cycle[v] or v in visited:
            continue
        ways = [1]*m
        u = v
        while u not in visited:
            visited.add(u)
            ways = [x*y for x, y in zip(ways, below(u))]
            u = a[u]
        result *= sum(ways)
    return result


for n in range(1, 5):
    for a in product(range(n), repeat=n):
        for m in range(1, 4):
            brute = sum(all(x[v] <= x[u] for v, u in enumerate(a)) for x in product(range(1, m+1), repeat=n))
            assert functional_dp(a, m) == brute
            checks['functional graph inequalities'] += 1


def recursive_prefix(x, y, count):
    if count == 0:
        return Counter()
    lengths = [0, min(count, len(x)), min(count, len(y))]
    while lengths[-1] < count:
        lengths.append(min(count, lengths[-1]+lengths[-2]))
    k = len(lengths)-1  # k starts at 2 even if S1 was already long enough.
    def prefix(k, n):
        if k <= 2:
            return Counter((x if k == 1 else y)[:n])
        if n <= lengths[k-1]:
            return prefix(k-1, n)
        return prefix(k-1, lengths[k-1]) + prefix(k-2, n-lengths[k-1])
    return prefix(k, count)


words = [''.join(p) for n in range(1, 4) for p in product('ab', repeat=n)]
for x, y in product(words, repeat=2):
    s1, s2 = x, y
    for _ in range(10):
        s1, s2 = s2, s2+s1
    for n in range(1, min(60, len(s2))+1):
        assert recursive_prefix(x, y, n) == Counter(s2[:n]), (x, y, n)
        checks['recursive string prefixes'] += 1
assert recursive_prefix('a', 'b', 1) == Counter('b')


def subset_groups(delta):
    n = len(delta)
    sums, dp = [0]*(1 << n), [-n]*(1 << n)
    dp[0] = 0
    for mask in range(1, 1 << n):
        bit = mask & -mask
        sums[mask] = sums[mask ^ bit] + delta[bit.bit_length()-1]
        dp[mask] = max(dp[mask ^ (1 << i)] for i in range(n) if mask >> i & 1) + (sums[mask] == 0)
    @lru_cache(None)
    def partition(mask):
        if mask == 0:
            return 0
        first = mask & -mask
        sub, best = mask, -n
        while sub:
            if sub & first and sums[sub] == 0:
                best = max(best, 1+partition(mask ^ sub))
            sub = (sub-1) & mask
        return best
    assert dp[-1] == partition((1 << n)-1)


for _ in range(500):
    n = rng.randrange(1, 9)
    delta = [rng.randrange(-5, 6) for _ in range(n-1)]
    delta.append(-sum(delta))
    subset_groups(delta)
    checks['zero-sum subset partitions'] += 1


for _ in range(100):
    n = rng.randrange(1, 20)
    blocks, last = [(1, n, 0)], [0]*(n+1)
    day = 0
    for _ in range(30):
        day += rng.randrange(1, 6)
        l, r = sorted([rng.randrange(1, n+1), rng.randrange(1, n+1)])
        for cut in (l, r+1):
            if cut > n:
                continue
            split = []
            for a, b, t in blocks:
                split.extend([(a, cut-1, t), (cut, b, t)] if a < cut <= b else [(a, b, t)])
            blocks = split
        total, kept = 0, []
        for a, b, t in blocks:
            if l <= a <= r:
                total += (day-t)*(a+b)*(b-a+1)//2
            else:
                kept.append((a, b, t))
        kept.append((l, r, day))
        blocks = sorted(kept)
        assert total == sum(i*(day-last[i]) for i in range(l, r+1))
        last[l:r+1] = [day]*(r-l+1)
        assert sum(b-a+1 for a, b, _ in blocks) == n
        checks['interval harvests'] += 1


for _ in range(500):
    n = rng.randrange(2, 8)
    graph = tree_from_prufer([rng.randrange(n) for _ in range(n-2)], n)
    for v, u in combinations(range(n), 2):
        if u not in graph[v] and rng.randrange(4) == 0:
            graph[v].append(u)
            graph[u].append(v)
    distances = []
    for s in range(n):
        dist, queue = [-1]*n, deque([s])
        dist[s] = 0
        while queue:
            v = queue.popleft()
            for u in graph[v]:
                if dist[u] < 0:
                    dist[u] = dist[v]+1
                    queue.append(u)
        distances.append(dist)
    constraints = [(rng.randrange(n), rng.randrange(n+1)) for _ in range(rng.randrange(5))]
    black = [all(distances[p][v] >= d for p, d in constraints) for v in range(n)]
    feasible = any(black) and all(any(black[v] and distances[p][v] == d for v in range(n)) for p, d in constraints)
    brute = any(all(min(distances[p][v] for v in range(n) if mask >> v & 1) == d for p, d in constraints)
                for mask in range(1, 1 << n))
    assert feasible == brute
    checks['distance colourings'] += 1


for _ in range(500):
    n = rng.randrange(1, 9)
    a, b = [rng.randrange(1, 6) for _ in range(n)], [rng.randrange(1, 5) for _ in range(n)]
    possible, best = {0}, 0
    for x, y in zip(a, b):
        possible = {v+x for v in possible} | {v*y for v in possible}
        best = max(best+x, best*y)
    assert best == max(possible)
    checks['monotone operation dominance'] += 1


def abc_dp(s, k):
    n, inf = len(s), len(s)+1
    z, f = [0]*(n+1), [0]*(n+1)
    for i in range(1, n+1):
        z[i] = int(i >= 3 and s[i-3:i] == 'ABC')
        f[i] = f[i-1]+z[i]
    dp = [[inf]*(k+1) for _ in range(n+1)]
    for i in range(n+1):
        dp[i][0] = 0
    for i in range(1, n+1):
        for j in range(1, k+1):
            if j+z[i] <= k:
                dp[i][j] = dp[i-1][j+z[i]]
            if i >= 3:
                x = f[i]-f[i-3]
                y = sum(a != b for a, b in zip(s[i-3:i], 'ABC'))
                dp[i][j] = min(dp[i][j], dp[i-3][j-1+x]+y)
    return min(dp[-1][k], inf)


for n in range(3, 7):
    targets = [(''.join(t), ''.join(t).count('ABC')) for t in product('ABC', repeat=n)]
    for source, original_count in targets:
        costs = [n+1]*(n//3+1)
        for target, count in targets:
            if count >= original_count:
                gain = count-original_count
                costs[gain] = min(costs[gain], sum(a != b for a, b in zip(source, target)))
        for k in range(1, n//3+1):
            assert abc_dp(source, k) == costs[k], (source, k, abc_dp(source, k), costs[k])
            checks['ABC-increase DP states'] += 1
# Letters outside A/B/C can only be useful as unchanged separators; replacement
# targets A/B/C plus an unchanged X independently exercise the dominance rule.
for _ in range(40):
    source = ''.join(rng.choice('ABCX') for _ in range(7))
    brute = 8
    for target in product('ABCX', repeat=7):
        target = ''.join(target)
        if target.count('ABC') == source.count('ABC')+1:
            brute = min(brute, sum(a != b for a, b in zip(source, target)))
    assert abc_dp(source, 1) == brute
    checks['ABC-increase outside alphabet'] += 1

def kmp_contains(pattern, text):
    pi = [0]*len(pattern)
    for i in range(1, len(pattern)):
        j = pi[i-1]
        while j and pattern[i] != pattern[j]:
            j = pi[j-1]
        if pattern[i] == pattern[j]:
            j += 1
        pi[i] = j
    j = 0
    for char in text:
        while j and char != pattern[j]:
            j = pi[j-1]
        if char == pattern[j]:
            j += 1
        if j == len(pattern):
            return True
    return False


for n in range(1, 9):
    for letters in product('ab', repeat=n):
        source = ''.join(letters)
        pals = sorted({source[l:r] for l in range(n) for r in range(l+1, n+1)
                       if source[l:r] == source[l:r][::-1]}, key=lambda s: (len(s), s))
        assert len(pals) <= n
        adj = [[] for _ in pals]
        for i, p in enumerate(pals):
            for j, q in enumerate(pals):
                contains = kmp_contains(p, q)
                assert contains == (p in q)
                if len(p) < len(q) and contains:
                    adj[i].append(j)
        brute = 0
        for mask in range(1 << len(pals)):
            if all(not (mask >> i & 1 and mask >> j & 1) for i, row in enumerate(adj) for j in row):
                brute = max(brute, bin(mask).count('1'))
        assert len(pals)-matching(adj) == brute
        checks['palindrome antichains'] += 1


for _ in range(500):
    n = rng.randrange(1, 13)
    a = [rng.getrandbits(20) for _ in range(n)]
    beta = rng.getrandbits(64) | 2
    powers, prefix = [1], [0]
    for value in a:
        powers.append(nim(powers[-1], beta))
        prefix.append(nim(prefix[-1], beta) ^ value)
    def hashed(l, length):
        return prefix[l+length] ^ nim(prefix[l], powers[length])
    length = rng.randrange(1, n+1)
    l1, l2 = rng.randrange(n-length+1), rng.randrange(n-length+1)
    l3 = rng.randrange(n)
    length3 = rng.randrange(1, n-l3+1)
    xor_seq = [x ^ y for x, y in zip(a[l1:l1+length], a[l2:l2+length])]
    target = a[l3:l3+length3]
    lo, hi = 0, min(length, length3)
    while lo < hi:
        mid = (lo+hi+1)//2
        if hashed(l1, mid) ^ hashed(l2, mid) == hashed(l3, mid):
            lo = mid
        else:
            hi = mid-1
    if lo == min(length, length3):
        less = length < length3
    else:
        less = (a[l1+lo] ^ a[l2+lo]) < a[l3+lo]
    assert less == (xor_seq < target)
    checks['Nim virtual sequence comparisons'] += 1


# A count alone cannot distinguish descending from ascending restrictions:
# reversal is a bijection. Check the legal sequences and insertion gaps too.
for n in range(1, 7):
    for a in combinations_with_replacement(range(1, 4), n):
        for d in (1, 2):
            maximum = max(a)
            smaller = tuple(v for v in a if v < maximum)
            previous = {p for p in set(permutations(smaller))
                        if all(x-y <= d for x, y in zip(p, p[1:]))}
            legal = {p for p in set(permutations(a))
                     if all(x-y <= d for x, y in zip(p, p[1:]))}
            generated = set()
            for p in set(permutations(a)):
                if tuple(v for v in p if v < maximum) not in previous:
                    continue
                if all(v != maximum or j+1 == n or p[j+1] == maximum or maximum-p[j+1] <= d
                       for j, v in enumerate(p)):
                    generated.add(p)
            assert legal == generated
            checks['multiset insertion witnesses'] += 1

def occurrence_prefix(pattern, x):
    if x <= 0 or len(pattern) > len(str(x)):
        return 0
    m, value = len(pattern), int(pattern)
    offset, result = int(pattern[0] == '0'), 0
    for r in range(len(str(x))-m+1):
        t, b = 10**r, 10**m
        def generated(i):
            return (i//t+offset)*b*t+value*t+i%t
        lo, hi = -1, x+1
        while hi-lo > 1:
            mid = (lo+hi)//2
            if generated(mid) <= x:
                lo = mid
            else:
                hi = mid
        result += lo+1
    return result


def occurrences(pattern, value):
    text = str(value)
    return sum(text[i:i+len(pattern)] == pattern for i in range(len(text)))


patterns = ['0', '00', '01', '10', '11', '22', '0295', '999', '1111']
patterns += [''.join(rng.choice('0123') for _ in range(rng.randrange(1, 5))) for _ in range(100)]
for pattern in patterns:
    brute = 0
    for x in range(1001):
        if x:
            brute += occurrences(pattern, x)
        assert occurrence_prefix(pattern, x) == brute, (pattern, x)
        checks['digit occurrence prefixes'] += 1
samples = [('22', 23, 234, 12), ('0295', 295, 295, 0),
           ('0', 1, 9999999999999999, 14888888888888889),
           ('2718', 998244353, 9982443530000000, 12982260572545),
           ('869120', 1234567890123456, 2345678901234567, 10987664021),
           ('2023032520230325', 1, 9999999999999999, 1)]
for pattern, l, r, expected in samples:
    assert occurrence_prefix(pattern, r)-occurrence_prefix(pattern, l-1) == expected


for n in range(1, 8):
    for a in product(range(3), repeat=n):
        total = sum((n-length+1)*(length//2) for length in range(1, n+1))
        positions = [[i+1 for i, v in enumerate(a) if v == x] for x in range(3)]
        for p in positions:
            l, r = 0, len(p)-1
            while l < r:
                if p[l] <= n+1-p[r]:
                    total -= p[l]*(r-l)
                    l += 1
                else:
                    total -= (n+1-p[r])*(r-l)
                    r -= 1
        brute = sum(sum(a[l+i] != a[r-i] for i in range((r-l+1)//2))
                    for l in range(n) for r in range(l, n))
        assert total == brute
        checks['palindrome repair sums'] += 1


MOD = 998244353
for n in range(1, 5):
    for m in range(1, 4):
        for a in product(range(m+1), repeat=n):
            zero = a.count(0)
            sums = [0]*n
            for replacement in product(range(1, m+1), repeat=zero):
                iterator = iter(replacement)
                completed = sorted(next(iterator) if value == 0 else value for value in a)
                for k, value in enumerate(completed):
                    sums[k] += value
            inv = pow(m, MOD-2, MOD)
            for k in range(1, n+1):
                expected = sums[k-1]*pow(m**zero, MOD-2, MOD) % MOD
                answer = 0
                for x in range(1, m+1):
                    required = n+1-k-sum(v >= x for v in a)
                    p, q = (m-x+1)*inv % MOD, (x-1)*inv % MOD
                    powers_p, powers_q = [1], [1]
                    for _ in range(zero):
                        powers_p.append(powers_p[-1]*p % MOD)
                        powers_q.append(powers_q[-1]*q % MOD)
                    answer += sum(comb(zero, t)*powers_p[t]*powers_q[zero-t]
                                  for t in range(max(0, required), zero+1))
                assert answer % MOD == expected
                checks['order statistic expectations'] += 1

print('PR65 review9 independent finite checks passed')
for name, count in checks.items():
    print(f'  {name}: {count}')
