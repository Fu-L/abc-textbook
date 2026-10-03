"""Small independent models for PR 65 review 5399363439 and the corpus audit.

Python 3.9+, no dependencies. These checks exercise the textbook's mathematics,
including the sweep lifecycle, mandatory roots, RSK insertion, output recovery,
and empty/zero cases. They do not certify every mathematical claim in 868 texts.
"""
from collections import deque
from functools import cmp_to_key, lru_cache
from itertools import combinations, combinations_with_replacement, permutations, product
from math import comb, factorial, prod
from random import Random

rng = Random(65_5)


def top4(entries):
    by_category = {}
    for value, category, index in entries:
        by_category[category] = max(by_category.get(category, (value, category, index)),
                                    (value, category, index))
    return sorted(by_category.values(), reverse=True)[:4]


def six_sweep(k, a):
    n = len(k)
    left, right = [[]], [[] for _ in range(n + 1)]
    for x in range(n):
        left.append(top4(left[-1] + [(a[x], k[x], x)]))
    for x in reversed(range(n)):
        right[x] = top4(right[x + 1] + [(a[x], k[x], x)])
    def pair(entries, banned):
        remaining = [v for v, c, _ in entries if c not in banned]
        return sum(remaining[:2]) if len(remaining) >= 2 else float('-inf')
    ordinary = [a[x] + pair(left[x], {k[x]}) for x in range(n)]
    events = [[] for _ in range(n)]
    for x in range(n):
        selected = [c for _, c, _ in left[x] if c != k[x]][:2]
        if len(selected) < 2:
            continue
        for c in set(selected + [k[x]]):
            value = a[x] + pair(left[x], {k[x], c}) if c != k[x] else float('-inf')
            events[c].append((x, value))
    assert sum(map(len, events)) <= 3*n
    current = ordinary[:]
    ans = -1
    for c in range(n):
        for x, value in events[c]:
            current[x] = value
        for x in range(n):
            expected = a[x] + pair(left[x], {k[x], c}) if c != k[x] else float('-inf')
            assert current[x] == expected
        for y in range(n):
            if k[y] != c:
                continue
            candidates = top4([(current[x], k[x], x) for x in range(y)])
            for value, d, _ in candidates:
                if d != c:
                    ans = max(ans, value + a[y] + pair(right[y + 1], {c, d}))
        for x, _ in events[c]:
            current[x] = ordinary[x]
        assert current == ordinary
    return ans


def six_brute(k, a):
    return max([-1] + [sum(a[i] for i in indices)
                       for indices in combinations(range(len(k)), 6)
                       if len({k[i] for i in indices[:4]}) == 4
                       and len({k[i] for i in indices[2:]}) == 4])


six_cases = 0
assert six_sweep([0, 1, 2, 3, 0, 1], [1]*6) == 6
for k in product(range(4), repeat=6):
    a = [1, 7, 3, 7, 2, 5]
    assert six_sweep(k, a) == six_brute(k, a)
    six_cases += 1
for _ in range(600):
    n = rng.randrange(6, 12)
    k, a = [rng.randrange(n) for _ in range(n)], [rng.randrange(1, 20) for _ in range(n)]
    assert six_sweep(k, a) == six_brute(k, a)
    parts = [[(a[i], k[i], i) for i in range(j, n, 3)] for j in range(3)]
    assert top4(top4(parts[0] + parts[1]) + parts[2]) == top4(parts[0] + top4(parts[1] + parts[2]))
    six_cases += 1
print('ABC447 G sweep / sextuple enumeration / top4 associativity:', six_cases)


def lis(seq):
    d = []
    for x in seq:
        d.append(1 + max([0] + [d[j] for j in range(len(d)) if seq[j] < x]))
    return max(d, default=0)


def insertion(seq):
    rows = []
    for x in seq:
        for row in rows:
            j = next((j for j, y in enumerate(row) if y > x), len(row))
            if j == len(row):
                row.append(x)
                break
            row[j], x = x, row[j]
        else:
            rows.append([x])
    return rows


def tableau_counts(a, b):
    shape = (a,)*(b-1) + (a-1,)
    @lru_cache(None)
    def dp(lengths, constrained):
        if lengths == shape:
            return 1
        result = 0
        for i in range(b):
            if lengths[i] == shape[i] or (i and lengths[i-1] <= lengths[i]):
                continue
            if constrained and lengths[i] == a-1 and lengths[i+1] < a-1:
                continue
            nxt = list(lengths)
            nxt[i] += 1
            result += dp(tuple(nxt), constrained)
        return result
    hook_product = prod(shape[i]-j + sum(length >= j+1 for length in shape)-i-1
                        for i in range(b) for j in range(shape[i]))
    unconstrained = factorial(a*b-1)//hook_product
    assert dp((0,)*b, False) == unconstrained
    return dp((0,)*b, True), unconstrained


permutation_cases = 0
for a, b in [(2, 2), (2, 3), (3, 2), (2, 4), (4, 2), (3, 3)]:
    n, count = a*b-1, 0
    for seq in permutations(range(1, n+1)):
        if lis(seq) == a and lis([-x for x in seq]) == b:
            rows = insertion(seq)
            local = all(rows[i+1][a-2] < rows[i][a-1] for i in range(b-1))
            existence = any(lis(seq + (z+0.5,)) == a
                            and lis(tuple(-x for x in seq) + (-z-0.5,)) == b
                            for z in range(n+1))
            assert local == existence
            count += existence
        permutation_cases += 1
    p, q = tableau_counts(a, b)
    assert p*q == count, (a, b, p, q, count)
assert tableau_counts(3, 2) == (2, 5)
assert max(comb(a+b, a) for a in range(2, 61) for b in range(2, 61) if a*b <= 120) == 646646
print('ABC378 G direct LIS/LDS, insertion equivalence, hook and ideal DP:', permutation_cases)


def tree_answers(parent, beauty, weight, color, capacity):
    n, neg = len(parent), -10**30
    children = [[] for _ in parent]
    for v in range(1, n):
        children[parent[v]].append(v)
    size = [1]*n
    for v in reversed(range(n)):
        children[v].sort(key=lambda u: size[u], reverse=True)
        if v:
            size[parent[v]] += size[v]
    answer = [None]*n
    def dfs(v, d, save):
        if children[v]:
            e = dfs(children[v][0], d, save)
            for u in children[v][1:]:
                e = [dfs(u, e[s], False)[s] for s in range(2)]
        else:
            e = [d[:], d[:]]
        if save:
            assert answer[v] is None
            answer[v] = beauty[v] + max(e[1-color[v]][:capacity-weight[v]+1])
        out = [x[:] for x in e]
        for t in range(capacity-weight[v]+1):
            if e[1-color[v]][t] != neg:
                out[color[v]][t+weight[v]] = max(out[color[v]][t+weight[v]], e[1-color[v]][t]+beauty[v])
        return out
    initial = [0] + [neg]*capacity
    for v in range(n):
        if v == 0 or children[parent[v]][0] != v:
            dfs(v, initial, True)
    brute = []
    for root in range(n):
        nodes = []
        def collect(v):
            nodes.append(v)
            for u in children[v]:
                collect(u)
        collect(root)
        best = 0
        for mask in range(1 << len(nodes)):
            selected = {v for i, v in enumerate(nodes) if mask >> i & 1}
            if root not in selected or sum(weight[v] for v in selected) > capacity:
                continue
            valid = True
            for v in selected - {root}:
                p = parent[v]
                while p not in selected:
                    p = parent[p]
                valid &= color[p] != color[v]
            if valid:
                best = max(best, sum(beauty[v] for v in selected))
        brute.append(best)
    assert answer == brute
    return answer


assert tree_answers([-1, 0], [0, 100], [1, 1], [0, 1], 1) == [0, 100]
for _ in range(600):
    n, capacity = rng.randrange(2, 10), rng.randrange(6)
    tree_answers([-1]+[rng.randrange(v) for v in range(1, n)],
                 [rng.randrange(20) for _ in range(n)],
                 [rng.randrange(capacity+1) for _ in range(n)],
                 [rng.randrange(2) for _ in range(n)], capacity)
print('ABC311 Ex all retained subsets, every root, zero weights and save flag:', 601)


def clamp(x, interval):
    return min(max(x, interval[0]), interval[1])


def distance(x, interval):
    return abs(x-clamp(x, interval))


identity = ((-100, 100), (-100, 100), 0)


def merge(a, b):
    fa, ga, ca = a
    fb, gb, cb = b
    f = (clamp(fa[0], fb), clamp(fa[1], fb))
    g = (clamp(gb[0], ga), clamp(gb[1], ga))
    c = ca+distance(g[0], ga)+cb+distance(clamp(g[0], fa), gb)
    return f, g, c


grid_cases = 0
for _ in range(160):
    n = rng.randrange(1, 7)
    intervals = []
    for i in range(n):
        while True:
            l, u = sorted([rng.randrange(1, 7), rng.randrange(1, 7)])
            if i == 0 or max(l, intervals[-1][0]) <= min(u, intervals[-1][1]):
                intervals.append((l, u))
                break
    blocks = [(x, x, 1) for x in intervals]
    for sx in range(n):
        for sy in range(intervals[sx][0], intervals[sx][1]+1):
            dist, queue = {(sx, sy): 0}, deque([(sx, sy)])
            while queue:
                x, y = queue.popleft()
                for nx, ny in [(x-1, y), (x+1, y), (x, y-1), (x, y+1)]:
                    if 0 <= nx < n and intervals[nx][0] <= ny <= intervals[nx][1] and (nx, ny) not in dist:
                        dist[nx, ny] = dist[x, y]+1
                        queue.append((nx, ny))
            for tx in range(sx, n):
                summary = identity
                for block in blocks[sx+1:tx+1]:
                    summary = merge(summary, block)
                f, g, c = summary
                for ty in range(intervals[tx][0], intervals[tx][1]+1):
                    assert c+distance(sy, g)+abs(clamp(sy, f)-ty) == dist[tx, ty]
                    grid_cases += 1
    for split in range(1, n-1):
        assert merge(merge(blocks[0], blocks[split]), blocks[-1]) == merge(blocks[0], merge(blocks[split], blocks[-1]))
print('ABC365 F block merge and query range versus grid BFS:', grid_cases)


def noadj(n, r):
    return comb(n-r+1, r) if n >= 0 and 0 <= r <= (n+1)//2 else 0


def teapot_matrix(n, r):
    if n == 1:
        return [[int(r == 0), int(r == 1)], [int(r == 0), 0]]
    if n == 2:
        return [[noadj(1, r), noadj(0, r-1)], [noadj(0, r), noadj(0, r-1)]]
    return [[noadj(n-1, r), noadj(n-2, r-1)], [noadj(n-2, r), noadj(n-3, r-1)]]


teapot_cases = 0
for n in range(1, 9):
    for r in range(-1, n+2):
        for s in range(2):
            expected = [0, 0]
            for seq in product(range(2), repeat=n):
                if sum(seq) == r and not any(x and y for x, y in zip((s,)+seq, seq)):
                    expected[seq[-1]] += 1
            assert teapot_matrix(n, r)[s] == expected
            teapot_cases += 1
for _ in range(500):
    n = rng.randrange(2, 9)
    constraints = {}
    for step in range(6):
        x, y = rng.randrange(1, n+1), -1
        if rng.randrange(2):
            y = rng.randrange(x+1)
        if y == -1:
            constraints.pop(x, None)
        else:
            constraints[x] = y
        v, p, a = [1, 0], 0, 0
        for x, y in sorted(constraints.items()):
            mat = teapot_matrix(x-p, y-a)
            v = [sum(v[s]*mat[s][t] for s in range(2)) for t in range(2)]
            p, a = x, y
        fib = [1, 2]
        for i in range(2, n+1):
            fib.append(fib[-1]+fib[-2])
        total = v[0]*fib[n-p]+v[1]*fib[max(n-p-1, 0)]
        brute = 0
        for seq in product(range(2), repeat=n):
            brute += not any(x and y for x, y in zip(seq, seq[1:])) and all(sum(seq[:x]) == y for x, y in constraints.items())
        assert total == brute
        teapot_cases += 1
print('ABC418 F all endpoint matrices / dynamic prefix constraints:', teapot_cases)


range_cases = 0
for n in range(1, 6):
    for a in product(range(3), repeat=n):
        for k in range(1, 5):
            dp, total = [0]*(k+1), 0
            for x in a:
                dp[0] += 1
                out = [0]*(k+1)
                for j in range(k+1):
                    for p in range(k-j+1):
                        out[j+p] += dp[j]*comb(k-j, p)*x**p
                dp = out
                total += dp[k]
            assert total == sum(sum(a[l:r])**k for l in range(n) for r in range(l+1, n+1))
            range_cases += 1
print('ABC399 F rolling label DP versus direct interval powers:', range_cases)


swap_cases = 0
for n in range(2, 7):
    for a in product(range(min(n, 3)), repeat=n):
        pairs = list(combinations(range(n), 2))
        def swapped(pair):
            b = list(a)
            l, r = pair
            b[l], b[r] = b[r], b[l]
            return b
        small = sorted((p for p in pairs if a[p[0]] > a[p[1]]), key=lambda p: (p[0], a[p[1]], -p[1]))
        same = [p for p in pairs if a[p[0]] == a[p[1]]]
        large = sorted((p for p in pairs if a[p[0]] < a[p[1]]), key=lambda p: (-p[0], a[p[1]], p[1]))
        expected = sorted(map(swapped, pairs))
        for rank, pair in enumerate(small + same + large):
            # Recover r through value order and the same-value index list.
            l, r = pair
            if a[l] != a[r]:
                suffix = sorted(range(l+1, n), key=lambda j: (a[j], -j if a[r] < a[l] else j))
                subset = [j for j in suffix if (a[j] < a[l] if a[r] < a[l] else a[j] > a[l])]
                t = (small if a[r] < a[l] else large).index(pair)
                prior = sum(p[0] != l for p in (small if a[r] < a[l] else large)[:t])
                assert subset[t-prior] == r
            assert swapped(pair) == expected[rank]
            swap_cases += 1
print('ABC431 G lexicographic multiplicities and recovered exchange indices:', swap_cases)


def xor_pair(a, m, k, work):
    work[0] += 1
    if not k:
        return 0, 0
    h = 1 << (k-1)
    b = [[x for x in a if x < h], [x-h for x in a if x >= h]]
    if b[0] and b[1]:
        w0, f0 = xor_pair(b[0], min(m, h), k-1, work)
        w1, f1 = xor_pair(b[1], max(0, m-h), k-1, work)
        return w0+w1, f0+f1
    w, f = xor_pair(b[0] or b[1], m if m <= h else m-h, k-1, work)
    if b[0]:
        prefix = f if m <= h else w+f+h*(m-h)
    else:
        prefix = f+h*m if m <= h else w+h*h+f
    return 2*w+h*h, prefix


xor_cases = 0
for mask in range(1, 256):
    a = [x for x in range(8) if mask >> x & 1]
    for m in range(9):
        w, f = xor_pair(a, m, 3, [0])
        assert w == sum(min(x ^ y for y in a) for x in range(8))
        assert f == sum(min(x ^ y for y in a) for x in range(m))
        xor_cases += 1
work = [0]
w, f = xor_pair([0], 10**9, 30, work)
assert f == 10**9*(10**9-1)//2 and work[0] == 31
print('ABC425 G all nonempty 3-bit sets and prefixes / unary recursion count:', xor_cases+1)


def repunit_count(n, m):
    p = [1]
    for t in range(1, n+1):
        numerator = sum((m*j-t)*p[t-j] for j in range(1, min(9, t)+1))
        assert numerator % t == 0
        p.append(numerator//t)
    prefix, answer = 0, 0
    for t in range(n+1):
        prefix += p[t]
        if (n-t) % 9 == 0:
            answer += prefix
    return answer-n//9


repunit_cases = 0
for n in range(1, 25):
    for m in range(1, 5):
        values = [(10**d-1)//9 for d in range(1, m+1)]
        brute = len({sum(c) for c in combinations_with_replacement(values, n)})
        assert repunit_count(n, m) == brute
        repunit_cases += 1
print('ABC449 G low-degree differential recurrence / distinct repunit sums:', repunit_cases)


def z_array(s):
    # Direct LCP computation is independent of a linear Z implementation.
    z = []
    for i in range(len(s)):
        j = 0
        while i+j < len(s) and s[j] == s[i+j]:
            j += 1
        z.append(j)
    return z


def concat_cmp(x, y):
    if len(x) < len(y):
        return -concat_cmp(y, x)
    n, m = len(x), len(y)
    if x[:m] != y:
        return -1 if x[:m] < y else 1
    if n > m:
        z = z_array(x)[m]
        if z < n-m:
            return -1 if x[m+z] < x[z] else 1
    return (y > x[n-m:])-(y < x[n-m:])


words = [''.join(s) for n in range(1, 5) for s in product('ab', repeat=n)]
concat_cases = 0
for x in words:
    for y in words:
        assert concat_cmp(x, y) == ((x+y > y+x)-(x+y < y+x))
        concat_cases += 1
for _ in range(350):
    a = [rng.choice(words) for _ in range(rng.randrange(2, 7))]
    s = sorted(a, key=cmp_to_key(concat_cmp))
    if any(x+y == y+x for x, y in zip(s, s[1:])):
        result = ''.join(s)
    else:
        candidates = []
        for i in range(max(0, len(s)-3), len(s)-1):
            t = s[:]
            t[i], t[i+1] = t[i+1], t[i]
            candidates.append(''.join(t))
        result = min(candidates)
    assert result == sorted(''.join(p) for p in permutations(a))[1]
    concat_cases += 1
print('ABC434 F three-block Z comparator / all concatenation permutations:', concat_cases)


probability_cases = 0
for modulus in [5, 7, 11]:
    for previous, current, people in product(range(modulus), range(modulus), range(2, 9)):
        g = (previous-current) % modulus
        direct = [g*pow(current, i-1, modulus)*pow(previous, people-i, modulus) % modulus
                  for i in range(1, people+1)]
        if previous:
            w = g*pow(previous, people-1, modulus) % modulus
            ratio = current*pow(previous, -1, modulus) % modulus
            obtained = [w*pow(ratio, i, modulus) % modulus for i in range(people-1)]
        else:
            obtained = [0]*(people-1)
        obtained.append(g*pow(current, people-1, modulus) % modulus)
        assert obtained == direct
        probability_cases += 1
print('ABC439 G geometric coefficients with zero denominators and last turn:', probability_cases)


merchant_cases = 0
domain = list(range(-4, 5))
for _ in range(450):
    c, d = rng.randrange(1, 6), rng.randrange(1, 6)
    xs = [rng.randrange(-3, 4) for _ in range(rng.randrange(1, 7))]
    f = [0 if x == 0 else 10**9 for x in domain]
    history, equal_intervals = [], []
    for i, xi in enumerate(xs):
        history.append(f[:])
        g = [min(f[j]+c*abs(x-y) for j, y in enumerate(domain)) for x in domain]
        equal = [x for j, x in enumerate(domain) if f[j] == g[j]]
        assert equal and equal == list(range(equal[0], equal[-1]+1))
        equal_intervals.append((equal[0], equal[-1]))
        if i:
            slopes = [f[j+1]-f[j] for j in range(len(domain)-1)]
            clipped = [max(-c, min(c, q)) for q in slopes]
            assert clipped == [g[j+1]-g[j] for j in range(len(domain)-1)]
        f = [g[j]+d*abs(x-xi) for j, x in enumerate(domain)]
    pos = domain[f.index(min(f))]
    chosen = [pos]
    for i in reversed(range(1, len(xs))):
        pos = clamp(pos, equal_intervals[i])
        chosen.append(pos)
    chosen.reverse()
    assert sum(c*abs(x-y)+d*abs(x-xi) for x, y, xi in zip(chosen, [0]+chosen[:-1], xs)) == min(f)
    merchant_cases += 1
print('ABC406 G original coordinate DP / slope clipping / recovered path cost:', merchant_cases)
