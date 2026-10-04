"""Review 17: executable prose vs small independent models (Python >=3.9)."""

from collections import deque
from copy import deepcopy
from fractions import Fraction
from functools import lru_cache
from itertools import combinations, permutations, product


def merge(a, b):
    return max(a[0], b[0]), a[1] + b[1], a[2] + b[2]


def mapping(f, a):
    turns, add = f
    mx, up, down = a
    if turns % 2:
        up, down = down, up
    return (0 if not up else add if turns else mx + add), up, down


def composition(new, old):
    a, b = old
    c, d = new
    return a + c, d if c else b + d


class Lazy:
    def __init__(self, n):
        self.n = n
        self.data = [(0, 0, 0)] * (4 * n)
        self.lazy = [(0, 0)] * (4 * n)

        def build(k, l, r):
            self.data[k] = (0, r - l, 0)
            if r - l > 1:
                m = (l + r) // 2
                build(k * 2, l, m)
                build(k * 2 + 1, m, r)

        build(1, 0, n)

    def apply(self, k, f):
        self.data[k] = mapping(f, self.data[k])
        self.lazy[k] = composition(f, self.lazy[k])

    def visit(self, ql, qr, f=None, k=1, l=0, r=None):
        if r is None:
            r = self.n
        if qr <= l or r <= ql:
            return 0, 0, 0
        if ql <= l and r <= qr:
            if f is not None:
                self.apply(k, f)
            return self.data[k]
        self.apply(k * 2, self.lazy[k])
        self.apply(k * 2 + 1, self.lazy[k])
        self.lazy[k] = (0, 0)
        m = (l + r) // 2
        result = merge(self.visit(ql, qr, f, k * 2, l, m),
                       self.visit(ql, qr, f, k * 2 + 1, m, r))
        if f is not None:
            self.data[k] = merge(self.data[k * 2], self.data[k * 2 + 1])
        return result


def check_441():
    count = 0
    for n in range(1, 5):
        intervals = [(l, r) for l in range(n) for r in range(l + 1, n + 1)]

        def explore(tree, plates, depth):
            nonlocal count
            for l, r in intervals:
                actual = (max(v for up, v in plates[l:r]),
                          sum(up for up, v in plates[l:r]),
                          sum(not up for up, v in plates[l:r]))
                assert tree.visit(l, r) == actual, (n, l, r, plates)
                count += 1
            assert tree.visit(0, 0) == (0, 0, 0)
            if not depth:
                return
            for l, r in intervals:
                for f in [(0, 1), (0, 2), (1, 0)]:
                    child, copied = deepcopy(tree), list(plates)
                    child.visit(l, r, f)
                    for i in range(l, r):
                        up, value = copied[i]
                        copied[i] = (not up, 0) if f[0] else (up, value + f[1] * up)
                    explore(child, copied, depth - 1)

        explore(Lazy(n), [(True, 0)] * n, 3)
    assert mapping((2, 0), (5, 1, 0)) == (0, 1, 0)
    tree = Lazy(2)
    tree.visit(0, 1, (0, 5))
    assert tree.visit(1, 2)[0] == 0 and tree.visit(0, 2)[0] == 5
    print("ABC441 G:", count, "interval summaries after all <=3 updates")


def build_persistent(l, r):
    if r - l == 1:
        return 0, None, None
    m = (l + r) // 2
    return 0, build_persistent(l, m), build_persistent(m, r)


def persistent_set(old, l, r, p, z):
    if r - l == 1:
        return (z, None, None), 1
    m = (l + r) // 2
    left, right = old[1:]
    if p < m:
        left, made = persistent_set(left, l, m, p, z)
    else:
        right, made = persistent_set(right, m, r, p, z)
    return (left[0] + right[0], left, right), made + 1


def persistent_sum(node, l, r, ql, qr):
    if qr <= l or r <= ql:
        return 0
    if ql <= l and r <= qr:
        return node[0]
    m = (l + r) // 2
    return persistent_sum(node[1], l, m, ql, qr) + persistent_sum(node[2], m, r, ql, qr)


def check_453():
    count = 0
    for n, m in product(range(1, 4), range(1, 5)):
        initial = build_persistent(0, m)

        def explore(roots, arrays, depth):
            nonlocal count
            for x in range(n):
                for l in range(m):
                    for r in range(l + 1, m + 1):
                        assert persistent_sum(roots[x], 0, m, l, r) == sum(arrays[x][l:r])
                        count += 1
            if not depth:
                return
            for x, y in product(range(n), repeat=2):
                rr, aa = list(roots), deepcopy(arrays)
                rr[x], aa[x] = rr[y], list(aa[y])
                explore(rr, aa, depth - 1)
            for x, y, z in product(range(n), range(m), (1, 2)):
                rr, aa = list(roots), deepcopy(arrays)
                rr[x], made = persistent_set(rr[x], 0, m, y, z)
                assert made <= (m - 1).bit_length() + 1
                aa[x][y] = z
                explore(rr, aa, depth - 1)
            # The previous roots remain usable after every branch has updated.
            for x in range(n):
                assert persistent_sum(roots[x], 0, m, 0, m) == sum(arrays[x])

        roots = [initial] * n
        assert all(root is initial for root in roots)
        explore(roots, [[0] * m for _ in range(n)], 3 if (n, m) == (2, 3) else 2)
    print("ABC453 G:", count, "version/range sums, unequal N/M and M=1")


class DiscreteConcave:
    def __init__(self, m):
        self.d = deque([(m, 0)])
        self.s = self.t = 0

    def val(self, p):
        return p[1] + self.s * p[0] + self.t

    def point(self, x, v):
        return x, v - self.s * x - self.t

    def slope(self, p, q):
        dx, dy = q[0] - p[0], q[1] - p[1]
        assert dx > 0 and dy % dx == 0
        return dy // dx + self.s

    def step(self, a, b, c):
        self.s -= b
        self.t += a
        d = self.d
        while d and self.val(d[-1]) < 0:
            q = d.pop()
            if not d:
                break
            p = d[-1]
            if self.val(p) < 0:
                continue
            h = self.slope(p, q)
            assert h < 0
            k = self.val(p) // -h
            if k:
                d.append(self.point(p[0] + k, self.val(p) + h * k))
            break
        while d and self.val(d[0]) < 0:
            p = d.popleft()
            if not d:
                break
            q = d[0]
            if self.val(q) < 0:
                continue
            h = self.slope(p, q)
            assert h > 0
            k = self.val(q) // h
            if k:
                d.appendleft(self.point(q[0] - k, self.val(q) - h * k))
            break
        if not d:
            return False
        while len(d) >= 2 and self.slope(d[0], d[1]) >= c:
            d.popleft()
        p = d[0]
        k = min(p[0], self.val(p) // c)
        if k == p[0]:
            return True
        if k:
            d.appendleft(self.point(p[0] - k, self.val(p) - c * k))
        return None

    def decode(self):
        result = {p[0]: self.val(p) for p in self.d}
        for p, q in zip(self.d, list(self.d)[1:]):
            h = self.slope(p, q)
            for x in range(p[0], q[0]):
                result[x] = self.val(p) + h * (x - p[0])
        return result


@lru_cache(None)
def compositions(total, count):
    if count == 1:
        return ((total,),)
    return tuple((v,) + rest for v in range(total + 1)
                 for rest in compositions(total - v, count - 1))


@lru_cache(None)
def allocate(x, medals, a, b, c):
    if medals + a < b * x:
        return frozenset()
    result = set()
    for shares in compositions(medals + a - b * x, x):
        for mask in range(1 << x):
            if all(not (mask >> i & 1) or shares[i] >= c for i in range(x)):
                result.add((x - bin(mask).count('1'),
                            sum(shares[i] for i in range(x) if not (mask >> i & 1))))
    return frozenset(result)


def check_458():
    count = 0
    days = list(product(range(1, 4), repeat=3))
    for n in range(1, 4):
        for schedule in product(days, repeat=n):
            for m in range(1, 4):
                curve, dp, physical = DiscreteConcave(m), {m: 0}, {(m, 0)}
                for a, b, c in schedule:
                    g = {x: v + a - b * x for x, v in dp.items() if v + a - b * x >= 0}
                    nxt = {}
                    for z, v in g.items():
                        for x in range(z + 1):
                            w = v - c * (z - x)
                            if w >= 0:
                                nxt[x] = max(nxt.get(x, -1), w)
                    physical = set().union(*(allocate(x, v, a, b, c) for x, v in physical))
                    success = any(x == 0 for x, v in physical)
                    assert success == (0 in nxt), (m, schedule, nxt, physical)
                    state = curve.step(a, b, c)
                    count += 1
                    if success:
                        assert state is True
                        break
                    if not physical:
                        assert not nxt and state is False
                        break
                    assert state is None and curve.decode() == nxt
                    # Independently allocated actual people retain the same optimum.
                    assert nxt == {x: max(v for y, v in physical if y == x)
                                   for x in {y for y, v in physical}}
                    dp = nxt
    curve = DiscreteConcave(1)
    assert curve.step(2, 1, 2) is None and curve.decode() == {1: 1}
    assert curve.step(2, 3, 1) is None and curve.decode() == {1: 0}
    print("ABC458 G:", count, "daily states vs integer DP and actual distributions")


def palindrome_bfs(matrix):
    n = len(matrix)
    dist = [[-1] * n for _ in range(n)]
    q = deque()
    for i in range(n):
        dist[i][i] = 0
        q.append((i, i))
    for i, j in product(range(n), repeat=2):
        if i != j and matrix[i][j] != '-':
            dist[i][j] = 1
            q.append((i, j))
    while q:
        i, j = q.popleft()
        for k, l in product(range(n), repeat=2):
            if matrix[k][i] != '-' and matrix[k][i] == matrix[j][l] and dist[k][l] == -1:
                dist[k][l] = dist[i][j] + 2
                q.append((k, l))
    return dist


def palindrome_grammar(matrix):
    # No queue or visited rule: relax the palindrome grammar to its least fixed point.
    n, inf = len(matrix), 10**9
    dist = [[0 if i == j else 1 if matrix[i][j] != '-' else inf
             for j in range(n)] for i in range(n)]
    while True:
        old = deepcopy(dist)
        for k, i, j, l in product(range(n), repeat=4):
            if matrix[k][i] != '-' and matrix[k][i] == matrix[j][l]:
                dist[k][l] = min(dist[k][l], old[i][j] + 2)
        if old == dist:
            return [[-1 if v == inf else v for v in row] for row in dist]


def check_394():
    count = 0
    for n in range(1, 4):
        for entries in product('-ab', repeat=n * n):
            mat = [entries[i * n:(i + 1) * n] for i in range(n)]
            assert palindrome_bfs(mat) == palindrome_grammar(mat), mat
            count += 1
    assert palindrome_bfs(['a']) == [[0]]
    print("ABC394 E:", count, "all <=3 vertex two-letter directed graphs")


def check_397():
    count = 0
    for n in range(3, 8):
        for a in product(range(3), repeat=n):
            last, seen, leaves, best = {}, set(), [-10**9] * n, 0
            for i, value in enumerate(a, 1):
                p, left = last.get(value, 0), len(seen)
                if i >= 2:
                    for j in range(max(1, p) - 1, i - 2):
                        leaves[j] += 1
                    leaves[i - 2] = left + 1
                    expected = [len(set(a[:j])) + len(set(a[j:i])) for j in range(1, i)]
                    assert leaves[:i - 1] == expected
                    if i < n:
                        best = max(best, max(leaves) + len(set(a[i:])))
                seen.add(value)
                last[value] = i
            brute = max(len(set(a[:j])) + len(set(a[j:i])) + len(set(a[i:]))
                        for j in range(1, n) for i in range(j + 1, n))
            assert best == brute, a
            count += 1
    print("ABC397 F:", count, "arrays, every cut state and final three-way split")


def floor_sum(n, m, a, b):
    ans = 0
    while True:
        qa, a = divmod(a, m)
        qb, b = divmod(b, m)
        ans += qa * n * (n - 1) // 2 + qb * n
        y = a * n + b
        if y < m:
            return ans
        n, b = divmod(y, m)
        m, a = a, m


def lattice_envelope(lines):
    lines = [(a, b, c - 1) for a, b, c in lines]
    xmax = min((d - b) // a for a, b, d in lines)
    if xmax < 1:
        return 0
    selected = {}
    for a, b, d in lines:
        slope = Fraction(a, b)
        if slope not in selected or Fraction(d, b) < Fraction(selected[slope][2], selected[slope][1]):
            selected[slope] = a, b, d
    stack = []
    for slope in sorted(selected):
        v = selected[slope]
        start = -10**30
        while stack:
            u, old_start = stack[-1]
            num, den = v[2] * u[1] - u[2] * v[1], v[0] * u[1] - u[0] * v[1]
            assert den > 0
            start = -((-num) // den)
            if start > old_start:
                break
            stack.pop()
        stack.append((v, start if stack else -10**30))
    answer = 0
    for i, ((a, b, d), start) in enumerate(stack):
        l, r = max(1, start), min(xmax + 1, stack[i + 1][1] if i + 1 < len(stack) else xmax + 1)
        if l < r:
            base = d - a * (r - 1)
            assert base >= b
            answer += floor_sum(r - l, b, a, base)
    return answer


def check_372():
    count = 0
    lines = list(product(range(1, 4), range(1, 4), range(1, 9)))
    cases = [(line,) for line in lines]
    cases += list(product(lines, repeat=2))
    # All unordered triples from a broader set, including negative crossover starts.
    cases += list(combinations(list(product((1, 2, 4), (1, 3), (2, 5, 9))), 3))
    for case in cases:
        upper = max(c for a, b, c in case)
        brute = sum(all(a * x + b * y < c for a, b, c in case)
                    for x in range(1, upper) for y in range(1, upper))
        assert lattice_envelope(case) == brute, case
        count += 1
    print("ABC372 G:", count, "strict integer lattice counts vs original inequalities")


def pav(a):
    stack = []
    for value in a:
        stack.append((1, value))
        while len(stack) >= 2:
            u, su = stack[-2]
            v, sv = stack[-1]
            if -((-su) // u) <= sv // v:
                break
            stack[-2:] = [(u + v, su + sv)]
    return tuple((s + t) // length for length, s in stack for t in range(length))


def transfer_bfs(a):
    q, dist = deque([a]), {a: 0}
    while q:
        state = q.popleft()
        if all(x <= y for x, y in zip(state, state[1:])):
            return dist[state], state
        # Original problem allows a transfer at any boundary, including non-inversions.
        for i in range(len(a) - 1):
            nxt = list(state)
            nxt[i] -= 1
            nxt[i + 1] += 1
            nxt = tuple(nxt)
            if nxt not in dist:
                dist[nxt] = dist[state] + 1
                q.append(nxt)


def check_459():
    count = 0
    for n in range(1, 5):
        for original in product(range(3), repeat=n):
            a = tuple(value - i for i, value in enumerate(original))
            b = pav(a)
            h = [sum(a[:i + 1]) - sum(b[:i + 1]) for i in range(n - 1)]
            assert all(v >= 0 for v in h) and sum(a) == sum(b)
            assert all(x <= y for x, y in zip(b, b[1:]))
            minimum, witness = transfer_bfs(a)
            assert sum(h) == minimum, (a, b, witness)
            count += 1
    assert pav((1, 0, 1, 0)) == (0, 0, 1, 1)
    # Larger values test equality with actual single-unit inversion relaxation.
    for a in product(range(-2, 3), repeat=5):
        state = list(a)
        moves = 0
        while any(x > y for x, y in zip(state, state[1:])):
            i = next(i for i in range(4) if state[i] > state[i + 1])
            state[i] -= 1
            state[i + 1] += 1
            moves += 1
        b = pav(a)
        assert tuple(state) == b
        assert moves == sum(i * (b[i] - a[i]) for i in range(5))
        count += 1
    print("ABC459 F:", count, "integer block solutions vs original BFS/unit stabilization")


def run_summary(s):
    if not s:
        return None
    prefix = next((i for i, c in enumerate(s) if c != s[0]), len(s))
    suffix = next((i for i, c in enumerate(reversed(s)) if c != s[-1]), len(s))
    run, best = 0, 0
    for i, c in enumerate(s):
        run = run + 1 if i and c == s[i - 1] else 1
        best = max(best, run)
    return len(s), s[0], prefix, s[-1], suffix, best, prefix == len(s)


def run_merge(a, b):
    if a is None:
        return b
    if b is None:
        return a
    same = a[3] == b[1]
    return (a[0] + b[0], a[1], a[2] + (b[2] if a[6] and same else 0),
            b[3], b[4] + (a[4] if b[6] and same else 0),
            max(a[5], b[5], a[4] + b[2] if same else 0), a[6] and b[6] and same)


def check_415():
    count = 0
    for n in range(1, 8):
        for entries in product('ab', repeat=n):
            s = ''.join(entries)
            for i in range(n + 1):
                assert run_merge(run_summary(s[:i]), run_summary(s[i:])) == run_summary(s)
                for j in range(i, n + 1):
                    a, b, c = run_summary(s[:i]), run_summary(s[i:j]), run_summary(s[j:])
                    assert run_merge(run_merge(a, b), c) == run_merge(a, run_merge(b, c)) == run_summary(s)
                    count += 1
    assert run_merge(run_summary('aa'), run_summary('bb'))[2:6:2] == (2, 2)
    print("ABC415 F:", count, "string partitions vs direct runs, empty identity/associativity")


def check_383():
    count = 0
    for n in range(2, 5):
        pairs = list(combinations(range(n), 2))
        # Complete graphs with all weights 1/2, repeated tokens but disjoint types.
        for weights in product((1, 2), repeat=len(pairs)):
            edges = [(w, u, v) for (u, v), w in zip(pairs, weights)]
            d = [[0 if u == v else 10**9 for v in range(n)] for u in range(n)]
            for w, u, v in edges:
                d[u][v] = d[v][u] = w
            for k, i, j in product(range(n), repeat=3):
                d[i][j] = min(d[i][j], max(d[i][k], d[k][j]))
            for size in (1, 2, 3):
                for a in product(range(n), repeat=size):
                    # Canonicalize same-type multiplicity, B still allows duplicates.
                    if tuple(sorted(a)) != a:
                        continue
                    for b in product(range(n), repeat=size):
                        if tuple(sorted(b)) != b or set(a) & set(b):
                            continue
                        brute = min(sum(d[x][y] for x, y in zip(a, order)) for order in set(permutations(b)))
                        parent, ca, cb = list(range(n)), [a.count(i) for i in range(n)], [b.count(i) for i in range(n)]

                        def find(x):
                            while parent[x] != x:
                                x = parent[x]
                            return x

                        answer = 0
                        for w, u, v in sorted(edges):
                            u, v = find(u), find(v)
                            if u == v:
                                continue
                            assert not (ca[u] and cb[u]) and not (ca[v] and cb[v])
                            matched = min(ca[u], cb[v]) + min(cb[u], ca[v])
                            answer += w * matched
                            parent[v] = u
                            ca[u], cb[u] = ca[u] + ca[v] - matched, cb[u] + cb[v] - matched
                        assert answer == brute
                        count += 1
    print("ABC383 E:", count, "legal disjoint token matchings vs minimax Floyd/permutations")


def swim_hull(points, c, d):
    by_speed = {}
    for b, a in points:
        by_speed[b] = min(by_speed.get(b, a), a)
    hull = []
    for p in sorted(by_speed.items()):
        while len(hull) >= 2:
            u, v = hull[-2:]
            cross = (v[0] - u[0]) * (p[1] - v[1]) - (v[1] - u[1]) * (p[0] - v[0])
            if cross > 0:
                break
            hull.pop()
        hull.append(p)
    alpha = min(range(len(hull)), key=lambda i: (Fraction(hull[i][1], hull[i][0]), -hull[i][0]))

    def slack(p):
        return p[1] * d - p[0] * c

    if slack(hull[alpha]) > 0:
        return None
    if slack(hull[-1]) <= 0:
        return Fraction(d, hull[-1][0])
    lo, hi = alpha, len(hull) - 1
    ratios = [Fraction(a, b) for b, a in hull[alpha:]]
    assert ratios == sorted(ratios)
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if slack(hull[mid]) <= 0:
            lo = mid
        else:
            hi = mid
    u, v = hull[lo], hull[hi]
    eu, ev = slack(u), slack(v)
    return Fraction(d * (ev - eu), u[0] * ev - v[0] * eu)


def swim_pairs(points, c, d):
    # Direct original time mixing, considering every one-style or two-style optimum.
    candidates = [Fraction(d, b) for b, a in points if a * d <= b * c]
    for (bu, au), (bv, av) in combinations(points, 2):
        eu, ev = au * d - bu * c, av * d - bv * c
        if eu == ev:
            continue
        t = Fraction(-eu, ev - eu)
        if 0 <= t <= 1:
            speed = (1 - t) * bu + t * bv
            candidates.append(d / speed)
    return min(candidates) if candidates else None


def check_356():
    count = 0
    rates = list(product(range(1, 4), repeat=2))
    for n in range(1, 5):
        for points in combinations(rates, n):
            for c, d in product(range(1, 6), repeat=2):
                assert swim_hull(points, c, d) == swim_pairs(points, c, d), (points, c, d)
                count += 1
    sample = [(2, 1), (3, 2), (3, 3), (4, 4)]
    for (c, d), answer in zip([(4, 7), (7, 7), (49, 100), (1000, 500), (4, 5)],
                              [Fraction(3), Fraction(7, 4), None, Fraction(125), Fraction(3, 2)]):
        assert swim_hull(sample, c, d) == answer
    print("ABC356 G:", count, "rate/query configurations vs all pairs of original styles")


if __name__ == '__main__':
    for check in (check_441, check_453, check_458, check_394, check_397,
                  check_372, check_459, check_415, check_383, check_356):
        check()
    print('PR65 review17 mathematical checks passed')
