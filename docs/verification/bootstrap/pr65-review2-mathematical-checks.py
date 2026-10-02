"""Independent small-input oracles for PR65's second review. Python 3.9+.

The formulas below are checked against permutations, cell DP, direct modular
products, and explicit structures. This does not certify arbitrary prose.
"""
from itertools import product, permutations
from math import comb, factorial
from fractions import Fraction
from functools import lru_cache
from collections import defaultdict
from random import Random
from pathlib import Path
import json


# This checks the actual source documents as well as the independent models.
# Escaped mathematical brackets are a Markdown rendering detail, not a change
# to the claim. The second review found a contradictory parity in metadata.
documents = list(Path('src/content/docs/problems').rglob('*.md'))
for document in documents:
    text = document.read_text(encoding='utf8')
    unit = json.loads(text.split('authoringUnit: ', 1)[1].split('\n', 1)[0])
    claim = next(c['text'] for c in unit['claims'] if c['key'] == 'correctness')
    proof = text.split('## 正当性\n\n', 1)[1].split('\n\n## ', 1)[0].strip()
    assert claim.replace('\\[', '[') == proof.replace('\\[', '['), document
print('Actual textbook correctness Claim/body consistency:', len(documents))


def convolution(a, b):
    c = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            c[i + j] += x * y
    return c


def coefficient(a, i):
    return a[i] if 0 <= i < len(a) else 0


checks = 0
for n in range(1, 6):
    for a in product(range(n), repeat=n):
        if tuple(sorted(a)) != a:
            continue
        b = [n - 1 - x for x in a]
        f = [0] * (n + 1)
        for p in permutations(range(n)):
            f[sum(p[i] >= b[i] for i in range(n))] += 1
        dp = [1] + [0] * n
        for i, threshold in enumerate(b, 1):
            dp = [dp[0]] + [dp[j] + (n - threshold - j + 1) * dp[j - 1]
                            for j in range(1, n + 1)]
        g = [dp[l] * factorial(n - l) for l in range(n + 1)]
        assert g == [sum(comb(k, l) * f[k] for k in range(l, n + 1))
                     for l in range(n + 1)]
        h = [1]
        for i, threshold in enumerate(b, 1):
            h = convolution(h, [n - threshold + 1 - i, 1])
        values = [sum(c * j**i for i, c in enumerate(h)) / Fraction(factorial(j))
                  for j in range(n + 1)]
        minus_exp = [Fraction((-1)**j, factorial(j)) for j in range(n + 1)]
        final_f = convolution(values, minus_exp)
        restored_g = [final_f[n - l] * factorial(n - l) for l in range(n + 1)]
        assert restored_g == g
        transformed = [factorial(n - i) * g[n - i] for i in range(n + 1)]
        restored = convolution(transformed, minus_exp)
        assert [restored[i] / factorial(n - i) for i in range(n + 1)] == f[::-1]
        # Simulate all coins, independently of the one-coin reduction.
        total = 0
        for p in permutations(range(n)):
            face = [1] * n
            for x, start in zip(a, p):
                for step in range(x + 1):
                    face[(start + step) % n] ^= 1
            total += sum(face)
        assert total == n * sum(f[::2]), (n, a, total, f)
        checks += 1
print('ABC272 Ex: permutations, DP, FPS and even flip counts:', checks)


def king(h, w, a, b):
    if h == 2:
        return ([(i, j) for j in range(1, b) for i in (1, 2)] + [(3 - a, b)]
                + [(1, j) for j in range(b + 1, w + 1)]
                + [(2, j) for j in range(w, b, -1)] + [(a, b)])
    if w == 2 or b == 1 or (a, b) == (h, 2):
        return [(j, i) for i, j in king(w, h, b, a)]
    return [(i, 1) for i in range(1, h + 1)] + [
        (h + 1 - i, j + 1) for i, j in king(h, w - 1, h + 1 - a, b - 1)]


checks = 0
for h in range(2, 16):
    for w in range(2, 16):
        for a in range(1, h + 1):
            for b in range(1, w + 1):
                if (a, b) == (1, 1):
                    continue
                path = king(h, w, a, b)
                assert len(path) == len(set(path)) == h * w
                assert path[0] == (1, 1) and path[-1] == (a, b)
                assert all(1 <= i <= h and 1 <= j <= w for i, j in path)
                assert all(max(abs(i - x), abs(j - y)) == 1
                           for (i, j), (x, y) in zip(path, path[1:]))
                checks += 1
print('ABC232 H: all endpoints in rectangles up to 15x15:', checks)

checks = 0
for x in range(1, 13):
    for length in range(1, 5):
        for a in product(range(1, 7), repeat=length):
            terms = {x + 1: 1}
            for m in a:
                for end in sorted(list(terms), reverse=True):
                    if end <= m:
                        break
                    c = terms.pop(end)
                    terms[m] = terms.get(m, 0) + c * (end // m)
                    if end % m:
                        assert end % m < end / 2
                        terms[end % m] = terms.get(end % m, 0) + c
            actual = 0
            for value in range(1, x + 1):
                for m in a:
                    value %= m
                actual += value == 0
            assert sum(terms.values()) - 1 == actual
            checks += 1
print('ABC466 F: weighted prefixes vs all starting integers:', checks)

checks = 0
for p, max_q in [(2, 5), (3, 3), (5, 2), (7, 1)]:
    for q in range(1, max_q + 1):
        m = p**q
        c = (p - 1) * p**(q - 1)
        compressed = [1] * (q + 1)
        direct = [1] * m
        for k in range(1, 7):
            for value in range(m):
                t, y = 0, value
                while t < q and y % p == 0:
                    t, y = t + 1, y // p
                assert compressed[t] == direct[value], (p, q, k, value)
                checks += 1
            compressed = [c * sum(compressed[:t + 1]) for t in range(q)] + [
                c * sum(compressed[:q]) + m * compressed[q]]
            nxt = [0] * m
            for v, count in enumerate(direct):
                for a in range(m):
                    nxt[v * a % m] += count
            direct = nxt
print('ABC245 Ex: fixed-residue states vs full residue DP:', checks)


def bag_cdq(gold, w):
    size = 1 << (w + 1).bit_length()
    f, j, acc = ([Fraction(0)] * size for _ in range(3))
    for d in gold:
        for m in range(d, size, d):
            j[m] += d
    def solve(l, r):
        if r - l == 1:
            n = l
            f[n] = (j[n - 1] + acc[n]) / (n - 1) if n >= 2 else Fraction(0)
            if n:
                for m in range(n, size, n):
                    j[m] += n * f[n]
            return
        m = (l + r) // 2
        solve(l, m)
        if l == 0:
            z = convolution(f[:m], j[:m])
        else:
            d = r - l
            u = convolution(f[l:m], j[:d])
            v = convolution(j[l:m], f[:d])
            z = [x + y for x, y in zip(u, v)]
        for n in range(m, r):
            acc[n] += coefficient(z, n - l)
        solve(m, r)
    solve(0, size)
    return f[:w + 1]


checks = 0
for bits in range(1, 64):
    gold = {i + 1 for i in range(6) if bits >> i & 1}
    w = 12
    actual = [0] * (w + 1)
    # Direct enumeration of unordered multisets of all earlier known types.
    for n in range(2, w + 1):
        ways = [1] + [0] * (n - 1)
        for d in range(1, n):
            types = actual[d] + (d in gold)
            if types:
                kernel = [0] * n
                for count in range((n - 1) // d + 1):
                    kernel[d * count] = comb(types + count - 1, count)
                ways = convolution(ways, kernel)[:n]
        actual[n] = ways[n - 1]
    assert bag_cdq(gold, w) == actual
    checks += 1
print('ABC230 H: two-unknown CDQ vs direct multiset counting:', checks)


def span(values):
    s = {0}
    for v in values:
        s |= {x ^ v for x in s}
    return s


checks = 0
for b in range(1, 4):
    qfact = [1]
    for n in range(1, 5):
        qfact.append(qfact[-1] * (2**n - 1))
    u = []
    ratio = 1
    for r in range(5):
        u.append(Fraction(2**(r * (r + 1) // 2) * ratio, qfact[r]) if r < b else 0)
        if r < b - 1:
            ratio *= 2**(b - 1 - r) - 1
    g = [qfact[s] * coefficient(convolution(u, [Fraction(1, x) for x in qfact]), s)
         for s in range(5)]
    for n in range(5):
        brute = sum(1 not in span(seq) for seq in product(range(2**b), repeat=n))
        assert g[n] == brute
        stirling = [1]
        for j in range(n):
            stirling = convolution(stirling, [-j, 1])
        bad = sum(x * y for x, y in zip(stirling, g))
        distinct_bad = sum(1 not in span(seq) for seq in permutations(range(2**b), n))
        assert bad == distinct_bad
        checks += 1
print('ABC278 Ex: rank convolution and Stirling inversion vs vector tuples:', checks)


def walk_fraction(a, b, c, d, k):
    n = len(a)
    one, zero = [1] + [0] * k, [0] * (k + 1)
    vector = [one[:], zero[:], [d[0]] + [0] * k]
    den = one[:]
    for i in range(1, n):
        local_den = [1, -a[i]]
        q, r = [0, b[i - 1]], [0, c[i - 2] if i >= 2 else 0]
        matrix = [[q, r, zero], [local_den, zero, zero],
                  [[v * d[i] for v in q], [v * d[i] for v in r], local_den]]
        nxt = []
        for row in matrix:
            sums = zero[:]
            for polynomial, v in zip(row, vector):
                terms = convolution(polynomial, v)
                sums = [x + coefficient(terms, j) for j, x in enumerate(sums)]
            nxt.append(sums)
        vector = nxt
        den = convolution(den, local_den)[:k + 1]
    u, _, v = vector
    denominator = [den[j] - (v[j - 1] if j else 0) for j in range(k + 1)]
    out = zero[:]
    for j in range(k + 1):
        out[j] = u[j] - sum(denominator[t] * out[j - t] for t in range(1, j + 1))
    return out


checks = 0
for n in range(2, 5):
    for bits in product(range(2), repeat=4 * n - 4):
        a = list(bits[:n])
        b = list(bits[n:2*n - 1])
        c = list(bits[2*n - 1:3*n - 3])
        d = [a[0]] + list(bits[3*n - 3:])
        current = [1] + [0] * (n - 1)
        counts = [current[-1]]
        for _ in range(7):
            nxt = [0] * n
            for i, count in enumerate(current):
                if a[i]: nxt[i] += count
                if i < n - 1 and b[i]: nxt[i + 1] += count
                if i < n - 2 and c[i]: nxt[i + 2] += count
                if i and d[i]: nxt[0] += count
                # i=0 self-loop a[0]=d[0] is only one edge.
            current = nxt
            counts.append(current[-1])
        assert walk_fraction(a, b, c, d, 7) == counts, (n, bits)
        checks += 1
print('ABC317 Ex: polynomial transfer and return denominator vs graph walks:', checks)

rng = Random(65)
checks = 0
for n in range(1, 65):
    for _ in range(3):
        a = [0] + [rng.randrange(4) for _ in range(n)]
        expected = [1]
        for i in range(1, n + 1):
            expected.append(a[i] * sum(expected[x] * expected[y]
                                      for x in range(i) for y in range(i - x)))
        size = 1 << n.bit_length()
        f, h = [0] * size, [0] * size
        prefix = [0]
        def solve(l, r):
            if r - l == 1:
                if l == 0: f[0] = 1
                elif l <= n:
                    prefix[0] += h[l - 1]
                    f[l] = a[l] * prefix[0]
                return
            m = (l + r) // 2
            solve(l, m)
            z = convolution(f[:m], f[:m]) if l == 0 else [
                2 * x for x in convolution(f[l:m], f[:r-l])]
            for t in range(m, min(r, n + 1)):
                h[t - 1] += coefficient(z, t - 1 - l)
            solve(m, r)
        solve(0, size)
        assert f[:n + 1] == expected
        checks += 1
print('ABC315 Ex: shifted CDQ pairs vs quadratic recurrence:', checks)

checks = 0
for n in range(1, 11):
    for s in product('ab', repeat=n):
        words = {''.join(s[i] for i in range(n) if mask >> i & 1)
                 for mask in range(1, 1 << n) if not (mask & (mask << 1))}
        prefix, last = [1], {}
        for i, c in enumerate(s, 1):
            k = last.get(c, 0)
            delta = prefix[max(0, i - 2)] - (prefix[max(0, k - 2)] if k else 0)
            prefix.append(prefix[-1] + delta)
            last[c] = i
        assert prefix[-1] - 1 == len(words)
        checks += 1
print('ABC214 F: first-completion DP vs all nonadjacent subsequences:', checks)

checks = 0
for n in range(1, 7):
    p = tuple(range(n))
    for q in permutations(range(n)):
        if n == 6 and checks > 500:
            break
        seen, polys = set(), []
        for i in range(n):
            if i in seen: continue
            cycle, v = [], i
            while v not in seen:
                seen.add(v); cycle.append(v); v = q[v]
            l = len(cycle)
            polys.append([1, 1] if l == 1 else [1] + [
                Fraction(2 * l, 2 * l - k) * comb(2 * l - k, k)
                for k in range(1, l + 1)])
        rook = [1]
        for poly in polys: rook = convolution(rook, poly)
        ans = sum((-1)**k * rook[k] * factorial(n - k) for k in range(n + 1))
        brute = sum(all(r[i] != p[i] and r[i] != q[i] for i in range(n))
                    for r in permutations(range(n)))
        assert ans == brute
        checks += 1
print('ABC214 G: cycle rook polynomial vs all permutations:', checks)


def frontier(grid):
    m = len(grid[0]); size = 1 << m
    dp = [0] * size; dp[-1] = 1
    for row in grid:
        work = dp[:]; prefix_ok = True
        for j, c in enumerate(row):
            nxt = [0] * size
            prefix_ok &= c != '0'
            for mask in range(size):
                bit = 1 << j
                if c != '1': nxt[mask & ~bit] += work[mask]
                if c != '0' and mask & bit: nxt[mask] += work[mask]
                if prefix_ok and not mask & bit: nxt[mask] += dp[mask]
            work = nxt
        dp = work
    return sum(dp)


checks = 0
for n, m in [(1, 3), (2, 2), (2, 3), (3, 3)]:
    grids = set()
    for rows in product(range(m + 1), repeat=n):
        for columns in product(range(n + 1), repeat=m):
            grids.add(''.join(str(int(j < rows[i] or i < columns[j]))
                              for i in range(n) for j in range(m)))
    patterns = product('01?', repeat=n*m) if n*m <= 6 else list(product('01', repeat=n*m)) + [('?',) * (n*m)]
    for pattern in patterns:
        expected = sum(all(c == '?' or c == v for c, v in zip(pattern, g)) for g in grids)
        assert frontier([''.join(pattern[i*m:(i+1)*m]) for i in range(n)]) == expected
        checks += 1
print('ABC295 Ex: frontier sweep vs deduplicated row/column prefix constructions:', checks)

checks = 0
for s in range(1, 14):
    for mask in range(1 << (s - 1)):
        forbidden = {i + 1 for i in range(s - 1) if mask >> i & 1}
        f = [1] + [0] * s
        for i in range(1, s + 1):
            if i not in forbidden: f[i] = sum(f[i - j] for j in range(1, i + 1, 2))
        e, o = 1, 0
        for i in range(1, s):
            e, o = (o, e) if i in forbidden else (e + o, e)
        assert e == f[s]
        checks += 1
print('ABC258 Ex: relative-parity matrices vs odd-step compositions:', checks)

checks = 0
for k in range(1, 9):
    values = [1] * k
    for _ in range(255): values.append(sum(values[-k:]))
    for n in range(128):
        p = [1 - i for i in range(k)]; q = [1] + [-1] * k
        bits = n
        while bits:
            minus = [v * (-1)**i for i, v in enumerate(q)]
            u, v = convolution(p, minus), convolution(q, minus)
            p = [coefficient(u, 2*i) + ((bits & 1) * coefficient(u, 2*i+1))
                 for i in range(k)]
            q = v[::2]; bits >>= 1
        actual = sum(values[m] for m in range(n + 1) if m & n == m)
        assert Fraction(p[0], q[0]) == actual, (k, n)
        checks += 1
print('ABC300 Ex: submask Bostan-Mori vs direct K-bonacci sequence:', checks)

# Ordered fragments: transition multiplicities and the threshold guard.
checks = 0
for n in range(1, 7):
    for _ in range(12):
        heights = sorted(rng.sample(range(1, 40), 2*n + 1))
        chosen = set(rng.sample(range(2*n + 1), n))
        a = [v for i, v in enumerate(heights) if i in chosen]
        b = [v for i, v in enumerate(heights) if i not in chosen]
        dp = [1] + [0] * n
        for i, value in enumerate(a):
            nxt = [0] * (n + 1)
            for j, count in enumerate(dp):
                for p, factor in [(0, j + 1), (1, 2*j), (2, j - 1)]:
                    jp = j + 1 - p
                    if p > j or i + 1 + jp > n + 1: continue
                    if p <= 1 and b[i + j] <= value: continue
                    nxt[jp] += count * factor
            dp = nxt
        actual = 0
        for order in permutations(a):
            c = sorted([order[0], order[-1]] + [min(x, y) for x, y in zip(order, order[1:])])
            actual += all(x < y for x, y in zip(c, b))
        assert dp[1] == actual
        checks += 1
print('ABC313 Ex: ordered fragment coefficients vs front-row permutations:', checks)

checks = 0
for n in range(1, 4):
    counts = defaultdict(int)
    for flat in product(range(3), repeat=n*n):
        rows = tuple(sum(flat[i*n:(i+1)*n]) for i in range(n))
        cols = tuple(sum(flat[i*n+j] for i in range(n)) for j in range(n))
        if max(rows + cols) <= 2: counts[rows, cols] += 1
    for rows, cols in product(product(range(3), repeat=n), repeat=2):
        dp = {cols.count(2): 1}
        remainder = sum(cols)
        for row in rows:
            nxt = defaultdict(int)
            for x, count in dp.items():
                y = remainder - 2*x
                if x < 0 or y < 0 or x + y > n: continue
                transitions = [(x, 1)] if row == 0 else [(x-1, x), (x, y)] if row == 1 else [
                    (x-1, x), (x-2, x*(x-1)//2), (x-1, x*y), (x, y*(y-1)//2)]
                for target, coefficient_ in transitions:
                    if target >= 0: nxt[target] += count * coefficient_
            remainder -= row; dp = nxt
        actual = dp.get(0, 0) if sum(rows) == sum(cols) else 0
        assert actual == counts[rows, cols]
        checks += 1
print('ABC273 G: transition table vs all matrices up to 3x3:', checks)

checks = 0
for n in range(2, 7):
    counts = defaultdict(int)
    for parents in product(range(n), repeat=n-1):
        children = [[] for _ in range(n)]
        for vertex, parent in enumerate(parents, 1): children[parent].append(vertex)
        order = []
        def visit(v):
            if v in order: return
            order.append(v)
            for child in children[v]: visit(child)
        visit(0)
        if len(order) == n: counts[tuple(order)] += 1
    for suffix in permutations(range(1, n)):
        p = (0,) + suffix
        @lru_cache(None)
        def forest(l, r):
            if l == r: return 1
            return forest(l+1, r) + sum(forest(l+1, k)*forest(k, r)
                                        for k in range(l+1, r) if p[l] < p[k])
        assert forest(1, n) == counts[p]
        checks += 1
print('ABC252 G: forest interval recurrence vs all rooted labelled trees:', checks)

checks = 0
for _ in range(100):
    n, m = rng.randrange(1, 4), rng.randrange(1, 3)
    grid = [[rng.choice('0123456789?') for _ in range(m)] for _ in range(n)]
    @lru_cache(None)
    def digit_dp(l, r, k):
        if k == m: return int(r-l <= 1)
        return blocks(l, r, k, 0)
    @lru_cache(None)
    def blocks(l, r, k, d):
        if d == 10: return int(l == r)
        total = 0
        for end in range(l, r+1):
            if all(grid[i][k] in ('?', str(d)) for i in range(l, end)):
                total += digit_dp(l, end, k+1) * blocks(end, r, k, d+1)
        return total
    words = []
    for row in grid:
        words.append([int(''.join(x)) for x in product(*[
            '0123456789' if c == '?' else c for c in row])])
    actual = sum(all(a < b for a, b in zip(values, values[1:])) for values in product(*words))
    assert digit_dp(0, n, 0) == actual
    checks += 1
print('ABC292 G: digit/block bases and recurrence vs explicit completions:', checks)
