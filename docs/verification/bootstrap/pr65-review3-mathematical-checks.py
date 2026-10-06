"""Independent small-input checks of the third review's textbook algorithms.

Python 3.9+, no dependencies. The optimized formulas are compared with paths,
permutations, direct polynomial updates, and full Markov equations. These
checks catch boundary/index/counting regressions, not every possible prose error.
"""
from bisect import bisect_right
from collections import Counter, deque
from itertools import product, permutations
from math import comb, gcd, lcm
from pathlib import Path
from random import Random
import json

MOD = 998244353
rng = Random(65_3)


def convolution(a, b, modulus=MOD):
    c = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            c[i+j] = (c[i+j] + x*y) % modulus
    return c


def tree_distances(adj):
    rows = []
    for s in range(len(adj)):
        d = [-1] * len(adj)
        d[s] = 0
        q = deque([s])
        while q:
            v = q.popleft()
            for u in adj[v]:
                if d[u] == -1:
                    d[u] = d[v] + 1
                    q.append(u)
        rows.append(d)
    return rows


def rooted_data(adj, root):
    n = len(adj)
    parent = [-1] * n
    depth = [0] * n
    order = [root]
    for v in order:
        for u in adj[v]:
            if u != parent[v]:
                parent[u] = v
                depth[u] = depth[v] + 1
                order.append(u)
    size = [1] * n
    h = depth[:]
    for v in order[:0:-1]:
        size[parent[v]] += size[v]
        h[parent[v]] += h[v]
    s = [0] * n
    total = [0] * n
    s[root] = size[root]
    total[root] = h[root]
    for v in order[1:]:
        s[v] = s[parent[v]] + size[v]
        total[v] = total[parent[v]] + n - 2*size[v]
    return parent, depth, size, h, s, total


def lca(a, b, parent, depth):
    while depth[a] > depth[b]:
        a = parent[a]
    while depth[b] > depth[a]:
        b = parent[b]
    while a != b:
        a, b = parent[a], parent[b]
    return a


def ancestor_query(data, a, b):
    parent, dep, sz, h, s, total = data
    if a == b:
        return total[a]
    if dep[a] > dep[b]:
        a, b = b, a
    c = lca(a, b, parent, dep)
    distance = dep[a] + dep[b] - 2*dep[c]
    m = b
    for _ in range((distance-1)//2):
        m = parent[m]
    c = lca(a, m, parent, dep)
    right = h[m] - dep[m]*sz[m] + (dep[b]-dep[m])*sz[m] - 2*(s[b]-s[m])
    left = h[m] + sz[m]*(dep[a]-2*dep[c])
    return total[a] - left + right


def centroid_sum(adj, labels, vertices):
    if len(vertices) <= 1:
        return 0
    allowed = set(vertices)
    parent, order = {vertices[0]: -1}, [vertices[0]]
    for v in order:
        for u in adj[v]:
            if u in allowed and u != parent[v]:
                parent[u] = v
                order.append(u)
    size = {v: 1 for v in vertices}
    for v in order[:0:-1]:
        size[parent[v]] += size[v]
    c = min(vertices, key=lambda v: max(
        [len(vertices)-size[v]] + [size[u] for u in adj[v] if parent.get(u) == v]))
    groups = []
    all_counts = Counter([labels[c]])
    for u in adj[c]:
        if u not in allowed:
            continue
        group = [(u, c, 1)]
        for v, p, d in group:
            for w in adj[v]:
                if w in allowed and w != p:
                    group.append((w, v, d+1))
        groups.append(group)
        all_counts.update(labels[v] for v, _, _ in group)
    result = 0
    for group in groups:
        child = Counter(labels[v] for v, _, _ in group)
        result += sum(d*(all_counts[labels[v]]-child[labels[v]]) for v, _, d in group)
        result += centroid_sum(adj, labels, [v for v, _, _ in group])
    return result


queries = pairs = 0
for n in range(1, 8):
    for parents in product(*(range(v) for v in range(1, n))):
        adj = [[] for _ in range(n)]
        for v, p in enumerate(parents, 1):
            adj[v].append(p)
            adj[p].append(v)
        distances = tree_distances(adj)
        # Every root for tiny trees; two different roots for the larger ones.
        for root in (range(n) if n <= 4 else [0, n-1]):
            data = rooted_data(adj, root)
            for a, b in product(range(n), repeat=2):
                expected = sum(min(distances[a][v], distances[b][v]) for v in range(n))
                assert ancestor_query(data, a, b) == expected, (n, parents, root, a, b)
                queries += 1
        assignments = product(range(3), repeat=n) if n <= 4 else [
            [rng.randrange(3) for _ in range(n)] for _ in range(3)]
        for labels in assignments:
            expected = sum(distances[u][v] for u in range(n) for v in range(u+1, n)
                           if labels[u] == labels[v])
            assert centroid_sum(adj, labels, list(range(n))) == expected
            pairs += 1
# Review's path-versus-edge counterexample.
assert centroid_sum([[1, 3], [0, 2], [1], [0]], [1, 2, 1, 3], [0, 1, 2, 3]) == 2
print('ABC298 Ex: all endpoints including equality and different roots:', queries)
print('ABC359 G: centroid path contributions versus pair distances:', pairs)


def online_product(n, a):
    if n == 1:
        return a % MOD
    answer = [0] * (n+1)
    def solve(l, r, g):
        assert len(g) == r-l
        if r == l+1:
            answer[l] = g[0]
            return [1, g[0]]
        m = (l+r)//2
        q = solve(l, m, g[:m-l])
        h = convolution(g, q)
        return convolution(q, solve(m, r, h[m-l:r-l]))
    solve(2, n+1, [comb(a, k) % MOD for k in range(2, n+1)])
    return answer[n]


cases = 0
for a in list(range(1, 18)) + [MOD-1, MOD, MOD+1, 10**9]:
    for n in range(1, 33):
        p = [comb(a, k) % MOD for k in range(n+1)]
        expected = a % MOD
        for i in range(2, n+1):
            expected = p[i]
            p = convolution(p, [1, expected])[:n+1]
        assert online_product(n, a) == expected, (n, a)
        cases += 1
print('ABC281 Ex: coefficient slices versus sequential whole-polynomial updates:', cases)


def bow_meow(a, b):
    n, m = len(a), len(b)
    if n % 2 and m % 2:
        correction = sum(a)+sum(b)
    elif n % 2:
        correction = sum(b)
    elif m % 2:
        correction = sum(a)
    else:
        correction = 0
    a, b = sorted(a), sorted(b)
    if n % 2:
        a.pop()
    if m % 2:
        b.pop()
    n, m = len(a), len(b)
    dp = {(0, 0): 0}
    d = e = 0
    for w, kind in sorted([(w, 0) for w in a]+[(w, 1) for w in b]):
        nxt = {}
        for (j, k), cost in dp.items():
            if kind == 0:
                moves = [(j+1, k, d-j, e-k, w*(m-2*k)),
                         (j, k, d-j+1, e-k, w*(m-2*(e-k)))]
            else:
                moves = [(j, k+1, d-j, e-k, w*(n-2*j)),
                         (j, k, d-j, e-k+1, w*(n-2*(d-j)))]
            for nj, nk, qj, qk, fee in moves:
                if nj <= n//2 and qj <= n//2 and nk <= m//2 and qk <= m//2:
                    nxt[nj, nk] = min(nxt.get((nj, nk), 10**20), cost+fee)
        dp = nxt
        d += kind == 0
        e += kind == 1
    return correction + dp[n//2, m//2]


cases = 0
for n, m in product(range(5), repeat=2):
    if n+m > 7:
        continue
    for _ in range(6):
        a = [rng.randrange(1, 5) for _ in range(n)]
        b = [rng.randrange(1, 5) for _ in range(m)]
        animals = [(0, w) for w in a]+[(1, w) for w in b]
        def score(order):
            return sum(w*abs(sum(t != kind for kind, _ in order[:i])
                             - sum(t != kind for kind, _ in order[i+1:]))
                       for i, (t, w) in enumerate(order))
        expected = min(score(order) for order in set(permutations(animals)))
        assert bow_meow(a, b) == expected, (a, b)
        cases += 1
assert bow_meow([2], [3]) == 5
print('ABC290 Ex: all parity cases, empty reduced DP, versus permutations:', cases)


def gaussian(a, b):
    a = [row[:] + [v] for row, v in zip(a, b)]
    n = len(a)
    for col in range(n):
        pivot = next(r for r in range(col, n) if a[r][col] % MOD)
        a[col], a[pivot] = a[pivot], a[col]
        inv = pow(a[col][col] % MOD, MOD-2, MOD)
        a[col] = [x*inv % MOD for x in a[col]]
        for r in range(n):
            if r != col:
                x = a[r][col]
                a[r] = [(u-x*v) % MOD for u, v in zip(a[r], a[col])]
    return [row[-1] for row in a]


def multiply(a, b):
    return [[sum(x*y for x, y in zip(row, col)) % MOD for col in zip(*b)] for row in a]


def dice_matrix_values(r):
    if r <= 0:
        return 0, [int(r == t) for t in range(-5, 1)]
    inv = pow(6, MOD-2, MOD)
    matrix = [[inv]*6+[1]]
    matrix += [[int(j == i-1) for j in range(7)] for i in range(1, 6)]
    matrix += [[0]*6+[1]]
    power = [[int(i == j) for j in range(7)] for i in range(7)]
    while r:
        if r & 1:
            power = multiply(power, matrix)
        matrix = multiply(matrix, matrix)
        r >>= 1
    return power[0][6], list(reversed(power[0][:6]))


def boundary_dice(period):
    inv = pow(6, MOD-2, MOD)
    # Direct recurrence is an independent oracle for the matrix powers.
    e = {r: 0 for r in range(-5, 1)}
    p = {r: [int(r == t) for t in range(-5, 1)] for r in range(-5, 1)}
    for r in range(1, period):
        e[r] = (1 + inv*sum(e[r-a] for a in range(1, 7))) % MOD
        p[r] = [inv*sum(p[r-a][t] for a in range(1, 7)) % MOD for t in range(6)]
        assert dice_matrix_values(r) == (e[r], p[r])
    matrix = [[int(i == j) for j in range(6)] for i in range(6)]
    rhs = [1] * 6
    for i in range(1, 7):
        for a in range(1, 7):
            if a < i:
                matrix[i-1][i-a-1] -= inv
            elif a > i:
                r = period+i-a-6
                rhs[i-1] = (rhs[i-1] + inv*e[r]) % MOD
                for t in range(6):
                    matrix[i-1][t] -= inv*p[r][t]
    near = gaussian(matrix, rhs)
    return [0]+[(e[r-6] + sum(x*y for x, y in zip(p[r-6], near))) % MOD
                for r in range(1, period)]


cases = 0
for period in range(13, 40):
    inv = pow(6, MOD-2, MOD)
    states = period-1
    matrix = [[int(i == j) for j in range(states)] for i in range(states)]
    for r in range(1, period):
        for a in range(1, 7):
            to = (r-a) % period
            if to:
                matrix[r-1][to-1] -= inv
    whole = gaussian(matrix, [1]*states)
    assert boundary_dice(period)[1:] == whole
    cases += states
print('ABC299 Ex: six boundary equations versus full periodic Markov system:', cases)

# The actual 10^9 period also has nonzero modular pivots; real invertibility
# alone would not establish that fact over this finite field.
inv = pow(6, MOD-2, MOD)
matrix = [[int(i == j) for j in range(6)] for i in range(6)]
rhs = [1]*6
for i in range(1, 7):
    for a in range(1, 7):
        if a < i:
            matrix[i-1][i-a-1] -= inv
        elif a > i:
            e, p = dice_matrix_values(10**9+i-a-6)
            rhs[i-1] = (rhs[i-1]+inv*e) % MOD
            for t in range(6):
                matrix[i-1][t] -= inv*p[t]
near = gaussian(matrix, rhs)
assert all(sum(a*b for a, b in zip(row, near)) % MOD == b % MOD
           for row, b in zip(matrix, rhs))
print('ABC299 Ex: matrix powers and nonzero pivots at the actual 10^9 period: OK')


def lexicographic_residues(p, a):
    n = len(p)
    cycles, used = [], set()
    for i in range(n):
        if i in used:
            continue
        c = [i]
        used.add(i)
        while p[c[-1]] != i:
            c.append(p[c[-1]])
            used.add(c[-1])
        cycles.append(c)
    lengths = set(map(len, cycles))
    r = {k: 0 for k in lengths}
    m = {k: 1 % k for k in lengths}
    result = [None]*n
    for c in cycles:
        length = len(c)
        q = length//gcd(m[length], length)
        t = min(range(q), key=lambda t: a[c[(r[length]+t*m[length]) % length]])
        if q > 1:
            for k in lengths:
                r[k] = (r[k]+t*m[k]) % k
                m[k] = q*m[k] % k
        for j, v in enumerate(c):
            result[v] = a[c[(j+r[length]) % length]]
    return result


cases = 0
for n in range(1, 8):
    ps = permutations(range(n)) if n <= 6 else [rng.sample(range(n), n) for _ in range(100)]
    for p in ps:
        a = rng.sample(range(1, n+1), n)
        orbit, cur = [], a[:]
        while not orbit or cur != orbit[0]:
            orbit.append(cur[:])
            cur = [cur[p[i]] for i in range(n)]
        assert lexicographic_residues(p, a) == min(orbit)
        cases += 1
# Different and repeated lengths with noncoprime factors and a huge total period.
for lengths in [[2, 2, 3, 4, 6], [5, 7, 11, 13], [8, 12, 15]]:
    p, at = [], 0
    for k in lengths:
        p.extend(list(range(at+1, at+k))+[at])
        at += k
    a = rng.sample(range(1, at+1), at)
    # A separate arbitrary-precision CRT greedy, without residue arrays.
    r, m, expected, at = 0, 1, [0]*len(p), 0
    for k in lengths:
        t = min(range(k//gcd(m, k)), key=lambda t: a[at+(r+t*m) % k])
        r += t*m
        m = lcm(m, k)
        for j in range(k):
            expected[at+j] = a[at+(j+r) % k]
        at += k
    assert lexicographic_residues(p, a) == expected
    cases += 1
print('ABC371 G: residues versus orbit enumeration / big-integer CRT:', cases)


def graph_components(n, edges, threshold):
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        if w <= threshold:
            adj[u].append(v)
            adj[v].append(u)
    unseen, parts = set(range(n)), []
    while unseen:
        start = unseen.pop()
        c = {start}
        q = [start]
        for v in q:
            for u in adj[v]:
                if u in unseen:
                    unseen.remove(u)
                    c.add(u)
                    q.append(u)
        parts.append(frozenset(c))
    return parts


def painting_dp(n, edges, cap):
    # Explicit laminar hierarchy is independent of DSU's representatives.
    old = {frozenset([i]): [1, 1] for i in range(n)}
    for w in sorted({w for _, _, w in edges}):
        new = {}
        for part in graph_components(n, edges, w):
            children = [q for q in old if q <= part]
            if len(children) == 1:
                new[part] = old[children[0]]
                continue
            f = [1]
            for child in children:
                f = convolution(f, old[child])[:min(cap, len(part))+1]
            if len(children) < len(f):
                f[len(children)] = (f[len(children)]-1) % MOD
            f[1] += 1
            new[part] = f
        old = new
    f = [1]
    for part, dp in old.items():
        f = convolution(f, dp)[:cap+1]
    return sum(f) % MOD


cases = 0
for n in range(1, 7):
    for _ in range(40):
        edges = [(u, v, rng.randrange(1, 4)) for u in range(n)
                 for v in range(u, n) if rng.randrange(3) == 0]
        if edges:
            edges.append(edges[0])  # parallel edge, with equal weight
        operations = {frozenset([i]) for i in range(n)}
        for w in {w for _, _, w in edges}:
            operations.update(graph_components(n, edges, w))
        reachable = {frozenset()}
        for cap in range(1, n+1):
            reachable |= {s | op for s in list(reachable) for op in operations}
            assert painting_dp(n, edges, cap) == len(reachable), (n, edges, cap)
            cases += 1
print('ABC235 Ex: same-weight/multiedge/disconnected painting versus set unions:', cases)


# Check the amortized product work on adversarial and random merge orders.
for n in [1, 2, 7, 32, 200, 1000]:
    for cap in [1, 2, 5, 30, 500]:
        for shape in ['chain', 'balanced', 'random']:
            sizes, cost = deque([1]*n), 0
            while len(sizes) > 1:
                a = sizes.popleft()
                b = sizes.pop() if shape == 'chain' else sizes.popleft()
                cost += min(a, cap)*min(b, cap)
                if shape == 'random' and rng.randrange(2):
                    sizes.appendleft(a+b)
                else:
                    sizes.append(a+b)
            assert cost <= 3*n*cap, (n, cap, shape, cost)
print('ABC235 Ex: truncated convolution work, chain/balanced/random merges: 90')


# Sparse Grundy frequency/mex compared with every legal move.
def sparse_grundy(forbidden, limit):
    groups = {}
    for x, y in forbidden:
        groups.setdefault(x, []).append(x-y)
    positions, values, maxima, extra = [0], [0], [0], Counter()
    def value(v):
        i = bisect_right(positions, v)-1
        return values[i] if positions[i] == v else maxima[i]+v-positions[i]
    for x in sorted(groups):
        h = maxima[-1]+x-positions[-1]-1
        bad = Counter(value(v) for v in groups[x])
        disappearing = [v for v, count in bad.items() if count == 1+extra[v]]
        g = min(disappearing, default=h+1)
        if g <= h:
            extra[g] += 1
        positions.append(x)
        values.append(g)
        maxima.append(max(h, g))
    return [value(v) for v in range(limit+1)]


cases = 0
for limit in range(1, 6):
    moves = [(x, y) for x in range(1, limit+1) for y in range(1, x+1)]
    masks = range(1 << len(moves)) if limit <= 4 else [rng.randrange(1 << len(moves)) for _ in range(500)]
    for mask in masks:
        forbidden = {move for i, move in enumerate(moves) if mask >> i & 1}
        g = [0]
        for x in range(1, limit+1):
            reachable = {g[x-y] for y in range(1, x+1) if (x, y) not in forbidden}
            v = 0
            while v in reachable:
                v += 1
            g.append(v)
        assert sparse_grundy(forbidden, limit) == g
        cases += 1
print('ABC255 G: sparse absent-frequency mex versus all legal moves:', cases)


# The four marks in multidirectional imos are compared with pointwise coverage.
cases = 0
for n in range(1, 5):
    for length in range(1, 2*n+1):
        for sx, sy in product(range(n), repeat=2):
            h, w = n+length+1, n+2*length+3
            v = [[0]*w for _ in range(h)]
            d = [[0]*w for _ in range(h)]
            v[sx][sy] += 1
            v[sx+length][sy] -= 1
            d[sx][sy+2*length] -= 1
            d[sx+length][sy] += 1
            for x in range(h):
                for y in range(w):
                    if x:
                        v[x][y] += v[x-1][y]
                        if y+2 < w:
                            d[x][y] += d[x-1][y+2]
            for x in range(n):
                coverage = 0
                for y in range(n):
                    coverage += v[x][y]+d[x][y]
                    assert coverage == int(x >= sx and y >= sy and 2*(x-sx)+y-sy < 2*length)
            cases += 1
print('ABC260 G: four imos marks versus direct geometric inequality:', cases)


# Circular affine intervals, including both peak parities.
cases = 0
for n in range(3, 31):
    for t in range(n):
        values = [0]*(2*n)
        h = n//2
        for x in range(t, t+h+1):
            values[x] += x-t
        for x in range(t+h+1, t+n):
            values[x] += -x+t+n
        for x in range(n):
            distance = (x-t) % n
            assert values[x]+values[x+n] == min(distance, n-distance)
            cases += 1
print('ABC268 E: affine half-open intervals versus circular distances:', cases)


# Set-action composition and one-node Beats mapping, with every tiny leaf set.
cases = 0
for leaves in product(range(8), repeat=3):
    union = leaves[0] | leaves[1] | leaves[2]
    intersection = leaves[0] & leaves[1] & leaves[2]
    best = max(bin(x).count('1') for x in leaves)
    count = sum(bin(x).count('1') == best for x in leaves)
    for remove, add in product(range(8), repeat=2):
        if remove & add:
            continue
        new = [(x & ~remove) | add for x in leaves]
        if ((union & ~intersection) & (remove | add)) == 0:
            delta = bin(add & ~union).count('1')-bin(remove & intersection).count('1')
            assert max(bin(x).count('1') for x in new) == best+delta
            assert sum(bin(x).count('1') == best+delta for x in new) == count
        cases += 1
for a1, b1, a2, b2, x in product(range(4), repeat=5):
    if a1 & b1 or a2 & b2:
        continue
    b = (b1 & ~a2) | b2
    a = (a1 | a2) & ~b
    assert ((x & ~a) | b) == ((((x & ~a1) | b1) & ~a2) | b2)
print('ABC430 G: set mapping and maximum/count versus explicit leaves:', cases)


# Explicit Tile Distance 3 adjacency, independent of the finite distance tables.
TILE_KEYS = [(0, 1), (0, 2), (0, 3), (1, 0), (2, 0), (3, 0), (1, 1)]
TILE_TABLE_2 = [[[2, 2], [1, 1]], [[3, 4], [2, 3]], [[5, 5], [4, 4]],
                [[1, 2], [1, 2]], [[3, 3], [3, 3]], [[4, 5], [4, 5]], [[2, 3], [2, 2]]]
TILE_TABLE_3 = [[[3, 3, 3], [2, 2, 2], [1, 1, 1]],
                [[4, 5, 6], [3, 4, 5], [2, 3, 4]],
                [[7, 7, 7], [6, 6, 6], [5, 5, 5]],
                [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
                [[4, 4, 4], [4, 4, 4], [4, 4, 4]],
                [[5, 6, 7], [5, 6, 7], [5, 6, 7]],
                [[2, 3, 4], [2, 3, 3], [2, 2, 2]]]


def tile_neighbors(kmax, state):
    i, j, k = state
    if k:
        yield i, j, k-1
    if k < kmax-1:
        yield i, j, k+1
    if (i+j) % 2 == 0:
        yield i-1, j, kmax-1
        yield i+1, j, 0
        if k == 0:
            for t in range(kmax):
                yield i, j-1, t
        if k == kmax-1:
            for t in range(kmax):
                yield i, j+1, t
    else:
        yield i, j-1, kmax-1
        yield i, j+1, 0
        if k == 0:
            for t in range(kmax):
                yield i-1, j, t
        if k == kmax-1:
            for t in range(kmax):
                yield i+1, j, t


def tile_bfs(kmax, start, bound):
    distances, q = {start: 0}, deque([start])
    while q:
        v = q.popleft()
        for w in tile_neighbors(kmax, v):
            if abs(w[0]) > bound or abs(w[1]) > bound:
                continue
            if w not in distances:
                distances[w] = distances[v]+1
                q.append(w)
    return distances


def tile_base(kmax, s, i, j, k):
    if i == j == 0:
        return min(abs(s-k), 2)
    cost = 0
    if i > 0 and j > 0:
        d = min(i, j) - int(i == j)
        i, j, cost = i-d, j-d, 2*d
    if i == 0 or j == 0:
        h = max(0, (max(i, j)-2)//2)
        cost += h*(3 if kmax == 2 else 4)
        if i:
            i -= 2*h
        else:
            j -= 2*h
    if kmax == 2:
        table = TILE_TABLE_2
    else:
        table = TILE_TABLE_3
        s = max(s, kmax-3)-(kmax-3)
        k = min(k, 2)
    return cost+table[TILE_KEYS.index((i, j))][s][k]


def tile_id(kmax, x, y):
    i, j = x//kmax, y//kmax
    return i, j, (y if (i+j) % 2 == 0 else x) % kmax


def tile_answer(kmax, sx, sy, tx, ty):
    if (sx//kmax+sy//kmax) % 2:
        sx, sy, tx, ty = sy, -sx-1, ty, -tx-1
    u, v = sx//kmax, sy//kmax
    sx, sy, tx, ty = sx-u*kmax, sy-v*kmax, tx-u*kmax, ty-v*kmax
    if tx < 0:
        sx, tx = kmax-1-sx, kmax-1-tx
    if ty < 0:
        sy, ty = kmax-1-sy, kmax-1-ty
    i, j, k = tile_id(kmax, tx, ty)
    return tile_base(kmax, sy, i, j, k)


cases = 0
for kmax in range(2, 13):
    for s in range(kmax):
        distances = tile_bfs(kmax, (0, 0, s), 14)
        for i, j, k in product(range(11), range(11), range(kmax)):
            assert tile_base(kmax, s, i, j, k) == distances[i, j, k]
            cases += 1
# Arbitrary source orientations, negative coordinates and reflections.
for kmax in range(2, 7):
    for _ in range(40):
        sx, sy = rng.randrange(-8, 9), rng.randrange(-8, 9)
        distances = tile_bfs(kmax, tile_id(kmax, sx, sy), 15)
        for _ in range(25):
            tx, ty = rng.randrange(-20, 21), rng.randrange(-20, 21)
            assert tile_answer(kmax, sx, sy, tx, ty) == distances[tile_id(kmax, tx, ty)]
            cases += 1
assert tile_answer(3, -2, 1, 4, -1) == 4
assert tile_answer(4, 8, 8, 0, 2) == 4
assert tile_answer(5, -10**12, -10**12, 10**12, 10**12) == 8*10**11
print('ABC382 G: finite tables and coordinate normalization versus tile BFS:', cases)


def candle_dp(xs, heights):
    from functools import lru_cache
    points = sorted(zip(xs, heights)) + [(0, 0)]
    points.sort()
    start = points.index((0, 0))
    n = len(points)

    @lru_cache(None)
    def solve(l, r, side, remaining):
        if remaining == 0:
            return 0
        if remaining > n-(r-l+1):
            return -10**20
        best = -10**20
        current = points[l if side == 0 else r][0]
        for target in (l-1, r+1):
            if not 0 <= target < n:
                continue
            nl, nr, ns = min(l, target), max(r, target), int(target > r)
            fee = remaining*abs(current-points[target][0])
            best = max(best, solve(nl, nr, ns, remaining)-fee,
                       solve(nl, nr, ns, remaining-1)+points[target][1]-fee)
        return best
    return max(solve(start, start, 0, k) for k in range(n))


cases = 0
for n in range(1, 7):
    for _ in range(25):
        xs = rng.sample([x for x in range(-6, 7) if x], n)
        heights = [rng.randrange(1, 13) for _ in range(n)]
        best = 0
        for order in permutations(range(n)):
            time, previous, score = 0, 0, 0
            for i in order:
                time += abs(xs[i]-previous)
                previous = xs[i]
                score += max(heights[i]-time, 0)
            best = max(best, score)
        assert candle_dp(xs, heights) == best
        cases += 1
print('ABC219 H: remaining-count interval DP versus all visit orders:', cases)


cases = 0
for n in range(2, 7):
    for _ in range(60):
        a = [0]+sorted(rng.randrange(0, 13) for _ in range(n-1))
        if a[-1] == 0:
            continue
        y = [0]*(a[-1]+1)
        for k in range(a[-1], 0, -1):
            r = sum(v < k for v in a)
            s = sum(y[v] for v in a[r:])
            y[k-1] = (n*(y[k]+1)-s)*pow(r, MOD-2, MOD) % MOD
        current, total = 0, 0
        for r in range(n-1, 0, -1):
            c = (n-total)*pow(n-r, MOD-2, MOD) % MOD
            current = (pow(n*pow(r, MOD-2, MOD) % MOD, a[r]-a[r-1], MOD)
                       *(current+c)-c) % MOD
            total = (total+current) % MOD
            assert current == y[a[r-1]]
        assert current == y[0]
        # Independent full Markov system, without the y substitution.
        matrix = [[int(i == j) for j in range(a[-1])] for i in range(a[-1])]
        inv = pow(n, MOD-2, MOD)
        for k in range(1, a[-1]+1):
            for v in a:
                target = k-1 if v < k else v
                if target:
                    matrix[k-1][target-1] -= inv
        assert current == gaussian(matrix, [1]*a[-1])[-1]
        cases += 1
print('ABC270 Ex: affine jumps with repeated breakpoints versus full Markov system:', cases)


def distance_pair_step(dp, s, limit):
    n = limit+1
    main, anti = [[0]*n for _ in range(n)], [[0]*n for _ in range(n)]
    def read(table, i, j):
        return table[i][j] if 0 <= i < n and 0 <= j < n else 0
    for i, j in product(range(n), repeat=2):
        main[i][j] = dp[i][j]+read(main, i-1, j-1)
        anti[i][j] = dp[i][j]+read(anti, i-1, j+1)
    nxt = [[0]*n for _ in range(n)]
    for i, j in product(range(n), repeat=2):
        lo, hi = max(0, s-j), min(s, i)
        middle = (read(anti, i-lo, j-s+lo)-read(anti, i-hi-1, j-s+hi+1)
                  if lo <= hi else 0)
        nxt[i][j] = middle+read(main, i-s-1, j-1)+read(main, i-1, j-s-1)
    return nxt


cases = 0
for limit in range(6):
    for _ in range(45):
        n = rng.randrange(1, 4)
        p = [rng.randrange(-3, 4) for _ in range(n)]
        q = [rng.randrange(-3, 4) for _ in range(n)]
        dp = [[0]*(limit+1) for _ in range(limit+1)]
        dp[0][0] = 1
        for u, v in zip(p, q):
            dp = distance_pair_step(dp, abs(u-v), limit)
        expected = sum(sum(abs(x-u) for x, u in zip(point, p)) <= limit
                       and sum(abs(x-v) for x, v in zip(point, q)) <= limit
                       for point in product(*(range(u-limit, u+limit+1) for u in p)))
        assert sum(map(sum, dp)) == expected
        cases += 1
print('ABC265 F: both diagonal sums and coincident centers versus lattice enumeration:', cases)


def square_subsequences(s):
    n = len(s)
    def successor(i, c):
        return next((j for j in range(i+1, n+1) if s[j-1] == c), n+1)
    answer = 0
    for x in range(1, n+1):
        p = successor(0, s[x-1])
        if p >= x:
            continue
        dp = [[0]*(n+1) for _ in range(n+1)]
        dp[p][x] = 1
        for p, q in product(range(1, x), range(x, n+1)):
            if successor(p, s[x-1]) == x:
                answer += dp[p][q]
            for c in 'ab':
                np, nq = successor(p, c), successor(q, c)
                if np < x and nq <= n:
                    dp[np][nq] += dp[p][q]
    return answer


cases = 0
for n in range(1, 10):
    for letters in product('ab', repeat=n):
        s = ''.join(letters)
        subsequences = {''.join(s[i] for i in range(n) if mask >> i & 1)
                        for mask in range(1, 1 << n)}
        expected = sum(len(t) % 2 == 0 and t[:len(t)//2] == t[len(t)//2:]
                       for t in subsequences)
        assert square_subsequences(s) == expected
        cases += 1
print('ABC299 F: canonical boundary DP versus distinct binary subsequences:', cases)


def connected_graph(n, mask):
    edges = list((u, v) for u in range(n) for v in range(u+1, n))
    adj = [[] for _ in range(n)]
    for bit, (u, v) in enumerate(edges):
        if mask >> bit & 1:
            adj[u].append((v, bit))
            adj[v].append((u, bit))
    distance = [-1]*n
    distance[0] = 0
    queue = deque([0])
    while queue:
        u = queue.popleft()
        for v, _ in adj[u]:
            if distance[v] < 0:
                distance[v] = distance[u]+1
                queue.append(v)
    return adj, distance


def every_circuit_prime(adj):
    # Enumerate edge-simple closed walks: vertices may repeat, edges may not.
    primes = {2, 3, 5, 7}
    def visit(start, u, used, length):
        for v, bit in adj[u]:
            if used >> bit & 1:
                continue
            if v == start and length+1 not in primes:
                return False
            if not visit(start, v, used | (1 << bit), length+1):
                return False
        return True
    return all(visit(start, start, 0, 0) for start in range(len(adj)))


def cactus_series(limit):
    def truncated(a, b):
        return convolution(a, b)[:limit+1]
    f = [0]*(limit+1)
    for _ in range(limit+1):
        expf = [0]*(limit+1)
        expf[0] = 1
        for n in range(1, limit+1):
            expf[n] = sum(k*f[k]*expf[n-k] for k in range(1, n+1))*pow(n, MOD-2, MOD) % MOD
        u = [0]+expf[:limit]
        power, nxt = [1]+[0]*limit, [0]*(limit+1)
        for degree in range(1, limit+1):
            power = truncated(power, u)
            if degree == 1 or degree in {3, 5, 7}:
                weight = 1 if degree == 1 else pow(2, MOD-2, MOD)
                nxt = [(a+weight*b) % MOD for a, b in zip(nxt, power)]
        f = nxt
    return f


f = cactus_series(5)
factorial = 1
cases = 0
for n in range(1, 6):
    expected = 0
    for mask in range(1 << (n*(n-1)//2)):
        adj, distance = connected_graph(n, mask)
        expected += all(d >= 0 for d in distance) and every_circuit_prime(adj)
        cases += 1
    assert f[n]*factorial % MOD == expected
    factorial *= n
print('ABC387 G: rooted EGF conversion versus all graphs and edge-simple circuits:', cases)


def layer_graph_counts(n):
    from collections import defaultdict
    weights = {}
    for s, x in product(range(1, n+1), repeat=2):
        h = [1]
        b = [0]+[comb(s, t) for t in range(1, s+1)]
        for _ in range(x):
            h = convolution(h, b, 10**30)
        internal = [comb(x*(x-1)//2, t) for t in range(x*(x-1)//2+1)]
        weights[s, x] = convolution(h, internal, 10**30)
    dp = {(0, 1, 0, 1, 0): 1}
    answer = [0]*(n*(n-1)//2+1)
    for used in range(1, n+1):
        nxt = defaultdict(int)
        for (parity, even, odd, s, j), value in dp.items():
            if even+odd != used:
                continue
            if used == n:
                answer[j] += value
                continue
            capacity = n//2-(odd if parity == 0 else even)
            for x in range(1, min(n-used, capacity)+1):
                ne, no = even+(x if parity else 0), odd+(x if not parity else 0)
                for z, count in enumerate(weights[s, x]):
                    if count and j+z < len(answer):
                        nxt[1-parity, ne, no, x, j+z] += value*comb(n-used, x)*count
        for key, value in nxt.items():
            dp[key] = dp.get(key, 0)+value
    return answer


cases = 0
for n in (2, 4, 6):
    expected = [0]*(n*(n-1)//2+1)
    for mask in range(1 << (n*(n-1)//2)):
        _, distance = connected_graph(n, mask)
        if all(d >= 0 for d in distance) and sum(d % 2 == 0 for d in distance) == n//2:
            expected[bin(mask).count('1')] += 1
        cases += 1
    assert layer_graph_counts(n) == expected
print('ABC389 G: layer-state coefficients versus all labelled graphs and BFS:', cases)


# Actual document/Claim consistency for all problems, after all rewrites.
# This historical regression covers the frozen bootstrap; normal updates are joined separately.
documents = [p for p in Path('src/content/docs/problems').rglob('*.md') if 'updates' not in p.parts]
for document in documents:
    text = document.read_text(encoding='utf8')
    unit = json.loads(text.split('authoringUnit: ', 1)[1].split('\n', 1)[0])
    claim = next(c['text'] for c in unit['claims'] if c['key'] == 'correctness')
    proof = text.split('## 正当性\n\n', 1)[1].split('\n\n## ', 1)[0].strip()
    assert claim.replace('\\[', '[') == proof.replace('\\[', '['), document
print('Actual textbook correctness Claim/body consistency:', len(documents))
