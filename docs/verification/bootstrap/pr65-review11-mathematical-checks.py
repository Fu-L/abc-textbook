# coding: utf-8
"""PR65 review 5401561435: finite checks against independent original models.

Python 3.9+, no dependencies. These comparisons supplement the general proofs.
"""
from collections import Counter
from fractions import Fraction
from functools import lru_cache
from heapq import heappop, heappush
from itertools import combinations, combinations_with_replacement, product
from math import comb, factorial
from random import Random

rng = Random(6511)
checks = Counter()
NEG = -10**30


def covers(n, intervals, mask):
    return all(any(mask >> i & 1 and l <= x <= r
                   for i, (l, r) in enumerate(intervals)) for x in range(1, n + 1))


def coverage_dp(n, intervals, in_place=False):
    m = len(intervals)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 1
    for done, (l, r) in enumerate(sorted(intervals)):
        if in_place:
            for k in range(done, -1, -1):
                for j in range(l - 1, n + 1):
                    dp[max(j, r)][k + 1] += dp[j][k]
        else:
            out = [row[:] for row in dp]
            for j in range(l - 1, n + 1):
                for k in range(done + 1):
                    out[max(j, r)][k + 1] += dp[j][k]
            dp = out
    return dp[n]


def stage_expectation(f):
    m = len(f) - 1
    return sum((1 - Fraction(f[k], comb(m, k))) * Fraction(m, m - k)
               for k in range(m))


def original_expectation(n, intervals):
    m = len(intervals)

    @lru_cache(None)
    def visit(mask):
        if covers(n, intervals, mask):
            return Fraction(0)
        unseen = [i for i in range(m) if not mask >> i & 1]
        return (m + sum(visit(mask | 1 << i) for i in unseen)) / len(unseen)

    return visit(0)


assert coverage_dp(1, [(1, 1)] * 4) == [0, 4, 6, 4, 1]
assert coverage_dp(1, [(1, 1)] * 4, True) == [0, 4, 6, 4, 1]
assert stage_expectation([0, 4, 6, 10, 15]) == -5
assert stage_expectation([0, 4, 6, 4, 1]) == 1
checks['ABC242 Ex duplicate-interval regression'] += 1
for _ in range(600):
    n, m = rng.randrange(1, 6), rng.randrange(1, 8)
    pool = [(l, r) for l in range(1, n + 1) for r in range(l, n + 1)]
    intervals = [rng.choice(pool) for _ in range(m)]
    if not covers(n, intervals, (1 << m) - 1):
        intervals[0] = (1, n)
    direct = [0] * (m + 1)
    for mask in range(1 << m):
        if covers(n, intervals, mask):
            direct[bin(mask).count('1')] += 1
    assert coverage_dp(n, intervals) == direct
    assert coverage_dp(n, intervals, True) == direct
    assert stage_expectation(direct) == original_expectation(n, intervals)
    checks['ABC242 Ex subset counts and original expectation'] += 1


def matching_values(weights):
    n = len(weights)

    @lru_cache(None)
    def visit(mask):
        if not mask:
            return (0,)
        bit = mask & -mask
        u = bit.bit_length() - 1
        rest = mask ^ bit
        answer = list(visit(rest)) + [NEG]
        for v in range(u + 1, n):
            if rest >> v & 1:
                for k, value in enumerate(visit(rest ^ (1 << v))):
                    answer[k + 1] = max(answer[k + 1], value + weights[u][v])
        return tuple(answer[:bin(mask).count('1') // 2 + 1])

    return visit((1 << n) - 1)


def category_oracle(cakes, q):
    dp = [(NEG, 0)] * 8
    dp[0] = (0, 0)
    for cake in cakes:
        out = dp[:]
        for mask, (value, count) in enumerate(dp):
            if value == NEG:
                continue
            for t, price in enumerate(cake):
                nxt = mask ^ (1 << t)
                out[nxt] = max(out[nxt], (value + 2 * price - q, count + 1))
        dp = out
    return dp[0]


for _ in range(350):
    n = rng.randrange(2, 9)
    cakes = [tuple(rng.randrange(5) for _ in range(3)) for _ in range(n)]
    weights = [[max(cakes[i][t] + cakes[j][t] for t in range(3))
                for j in range(n)] for i in range(n)]
    values = matching_values(weights)
    assert all(2 * values[i] >= values[i - 1] + values[i + 1]
               for i in range(1, len(values) - 1))
    limit = 2 * max(max(cake) for cake in cakes) + 1
    for q in range(limit + 1):
        score, count = category_oracle(cakes, q)
        direct = max((2 * v - 2 * k * q, 2 * k) for k, v in enumerate(values))
        assert (score, count) == direct
    for k in range(1, len(values)):
        lo, hi = 0, limit
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if category_oracle(cakes, mid)[1] >= 2 * k:
                lo = mid
            else:
                hi = mid
        score, _ = category_oracle(cakes, lo)
        assert (score + 2 * k * lo) // 2 == values[k]
    checks['ABC400 G matching enumeration, parity DP and penalty reconstruction'] += 1
# Zero coordinates and large half-integer boundary.
for cakes in ([(0, 0, 0)] * 8, [(10**9, 0, 0), (10**9 - 1, 0, 0)]):
    values = matching_values([[max(a[t] + b[t] for t in range(3))
                               for b in cakes] for a in cakes])
    for k in range(1, len(values)):
        q = values[k] - values[k - 1]
        score, _ = category_oracle(cakes, q)
        assert score + 2 * k * q == 2 * values[k]
    checks['ABC400 G zero and scaled integer boundaries'] += 1
# The exchange proof is independent of the sign of edge weights.
for _ in range(150):
    n = rng.randrange(2, 9)
    weights = [[0] * n for _ in range(n)]
    for i, j in combinations(range(n), 2):
        weights[i][j] = weights[j][i] = rng.randrange(-10, 11)
    values = matching_values(weights)
    assert all(2 * values[i] >= values[i - 1] + values[i + 1]
               for i in range(1, len(values) - 1))
    checks['Matching exchange concavity with signed edge weights'] += 1


def slope_merge(a, b):
    da = [a[i] - a[i - 1] for i in range(1, len(a))]
    db = [b[i] - b[i - 1] for i in range(1, len(b))]
    assert da == sorted(da, reverse=True) and db == sorted(db, reverse=True)
    out, i, j = [a[0] + b[0]], 0, 0
    while i < len(da) or j < len(db):
        if j == len(db) or (i < len(da) and da[i] >= db[j]):
            out.append(out[-1] + da[i])
            i += 1
        else:
            out.append(out[-1] + db[j])
            j += 1
    return out


def independent_bar_dp(b, k, l, r, x, y):
    lo, hi = l + x, r - y
    if lo >= hi:
        return [0]
    dp = [[0] for _ in range(hi - lo + 1)]
    for t in range(1, hi - lo + 1):
        out = dp[t - 1][:]
        previous = dp[max(0, t - k)]
        for count, value in enumerate(previous):
            while len(out) <= count + 1:
                out.append(NEG)
            out[count + 1] = max(out[count + 1], value + b[lo + t - 1])
        dp[t] = out
    return dp[-1]


def divided_bar_dp(b, k):
    def visit(l, r):
        result = {}
        if r - l <= 2 * k:
            for x, y in product(range(k), repeat=2):
                allowed = range(l + x, r - y)
                out = [0]
                for i in allowed:
                    if len(out) < 2:
                        out.append(NEG)
                    out[1] = max(out[1], b[i])
                for i, j in combinations(allowed, 2):
                    if j - i >= k:
                        if len(out) < 3:
                            out.append(NEG)
                        out[2] = max(out[2], b[i] + b[j])
                result[x, y] = out
        else:
            mid = (l + r) // 2
            left, right = visit(l, mid), visit(mid, r)
            for x, y in product(range(k), repeat=2):
                out = []
                for j in range(k):
                    cur = slope_merge(left[x, j], right[k - 1 - j, y])
                    while len(out) < len(cur):
                        out.append(NEG)
                    out = [max(out[t], cur[t]) if t < len(cur) else out[t]
                           for t in range(len(out))]
                result[x, y] = out
        for (x, y), out in result.items():
            assert out == independent_bar_dp(b, k, l, r, x, y), (b, k, l, r, x, y)
            assert all(2 * out[i] >= out[i - 1] + out[i + 1]
                       for i in range(1, len(out) - 1))
            checks['ABC383 G every recursive boundary state vs direct DP'] += 1
        return result
    return visit(0, len(b))[0, 0]


for _ in range(350):
    n = rng.randrange(1, 23)
    k = rng.randrange(1, min(5, n) + 1)
    a = [rng.randrange(-8, 9) for _ in range(n)]
    b = [sum(a[i:i + k]) for i in range(n - k + 1)]
    divided_bar_dp(b, k)
# Concave candidates can have a non-concave pointwise maximum.
a, b = [0, 4, 4, 4], [0, 2, 4, 6]
assert all(2 * seq[i] >= seq[i - 1] + seq[i + 1]
           for seq in (a, b) for i in (1, 2))
out = list(map(max, a, b))
assert 2 * out[2] < out[1] + out[3]
checks['Concavity is not closed under pointwise max'] += 1


@lru_cache(None)
def lance_minimax(w, rows, turn):
    # Read only the original positions and legal lance movements.
    for i, (j, k) in enumerate(rows):
        if turn == 0:
            destinations = range(k + 1 if k < j else 1, j)
            for z in destinations:
                nxt = rows[:i] + ((z, k),) + rows[i + 1:]
                if not lance_minimax(w, nxt, 1):
                    return True
        else:
            destinations = range(k + 1, j if k < j else w + 1)
            for z in destinations:
                nxt = rows[:i] + ((j, z),) + rows[i + 1:]
                if not lance_minimax(w, nxt, 0):
                    return True
    return False


def row_evaluation(w, j, k):
    return (0, j - k - 1) if k < j else (j - 1 - (w - k), 0)


def lance_evaluation(w, rows):
    s, g = 0, 0
    for j, k in rows:
        ds, dg = row_evaluation(w, j, k)
        s, g = s + ds, g ^ dg
    return s, g


for w, max_h in ((2, 4), (3, 3), (4, 3), (5, 2)):
    pool = [(j, k) for j in range(1, w + 1) for k in range(1, w + 1) if j != k]
    distribution = Counter({(0, 0): 1})
    row_distribution = Counter(row_evaluation(w, j, k) for j, k in pool)
    for h in range(1, max_h + 1):
        nxt = Counter()
        for (s, g), count in distribution.items():
            for (ds, dg), ways in row_distribution.items():
                nxt[s + ds, g ^ dg] += count * ways
        distribution = nxt
        actual = Counter()
        for rows in product(pool, repeat=h):
            s, g = lance_evaluation(w, rows)
            left_win = s > 0 or (s == 0 and g != 0)
            right_win = s < 0 or (s == 0 and g != 0)
            assert lance_minimax(w, rows, 0) == left_win
            assert lance_minimax(w, rows, 1) == right_win
            actual[s, g] += 1
            checks['ABC265 Ex original two-turn minimax and mixed distribution'] += 1
        assert distribution == actual


def parity_partitions(cap, parity):
    table = [[0] * (cap + 1) for _ in range(cap + 1)]
    table[0][0] = 1
    for i in range(1, cap + 1):
        for j in range(1, i + 1):
            table[i][j] = sum(comb(i - 1, s - 1) * table[i - s][j - 1]
                              for s in range(1, i + 1) if s % 2 == parity)
    return table


def original_partitions(n):
    # Restricted growth strings create each unlabeled partition once.
    def visit(blocks, done):
        if done == n:
            yield blocks
            return
        for i in range(len(blocks)):
            yield from visit(blocks[:i] + (blocks[i] + 1,) + blocks[i + 1:], done + 1)
        yield from visit(blocks + (1,), done + 1)
    yield from visit((), 0)


for n in range(9):
    odd, even = parity_partitions(n, 1), parity_partitions(n, 0)
    direct_odd, direct_even = Counter(), Counter()
    for partition in original_partitions(n):
        if all(size % 2 for size in partition):
            direct_odd[len(partition)] += 1
        if all(size % 2 == 0 for size in partition):
            direct_even[len(partition)] += 1
    assert odd[n] == [direct_odd[j] for j in range(n + 1)]
    assert even[n] == [direct_even[j] for j in range(n + 1)]
    checks['ABC288 Ex unlabeled parity partitions vs restricted growth enumeration'] += 1
assert parity_partitions(4, 0)[4][2] == 3


def xor_digit_count(length, maximum, target):
    dp = [1] + [0] * length
    bits = max(1, maximum.bit_length(), target.bit_length())
    for bit in range(bits - 1, -1, -1):
        m, e = maximum >> bit & 1, target >> bit & 1
        out = [0] * (length + 1)
        for j, count in enumerate(dp):
            for t in range(length - j + 1) if m else (0,):
                p = e ^ (t & 1)
                q = (1 if p == 0 else 0) if j == 0 else 2**(j - 1)
                nxt = length - t if m else j
                out[nxt] += count * comb(length - j, t) * q
        dp = out
    return sum(dp)


def xor_of(values):
    out = 0
    for value in values:
        out ^= value
    return out


def nameless_count(n, maximum, target):
    odd, even = parity_partitions(n, 1), parity_partitions(n, 0)
    h = [[0] * (n + 1) for _ in range(n + 1)]
    for x in range(n + 1):
        for y in range(min(n, maximum + 1) + 1):
            falling = 1
            for k in range(x + 1):
                h[x][y] += even[x][k] * falling
                falling *= maximum + 1 - y - k if k < maximum + 1 - y else 0
    g = [int(target == 0)]
    for length in range(1, n + 1):
        value = xor_digit_count(length, maximum, target)
        for i in range(length + 1):
            for j in range(min(length - 1, i) + 1):
                value -= comb(length, i) * odd[i][j] * g[j] * h[length - i][j]
        g.append(value)
    answer = sum(g[n - 2 * i] // factorial(n - 2 * i) * comb(maximum + i, i)
                 for i in range(n // 2 + 1))
    return g, answer


for maximum in range(5):
    for n in range(7):
        direct_f, direct_g, direct_answer = Counter(), Counter(), Counter()
        for values in product(range(maximum + 1), repeat=n):
            x = xor_of(values)
            direct_f[x] += 1
            if len(set(values)) == n:
                direct_g[x] += 1
        for values in combinations_with_replacement(range(maximum + 1), n):
            direct_answer[xor_of(values)] += 1
        for x in range(8):
            g, answer = nameless_count(n, maximum, x)
            assert xor_digit_count(n, maximum, x) == direct_f[x]
            assert g[n] == direct_g[x]
            assert answer == direct_answer[x]
            checks['ABC288 Ex digit DP, distinct correction and original sorted enumeration'] += 1


for n in range(1, 8):
    for prices in product(range(1, 4), repeat=n):
        dp, heap, gain = [0], [], 0
        for p in prices:
            old = dp
            dp = [max(old[k] if k < len(old) else NEG,
                      old[k - 1] - p if k else NEG,
                      old[k + 1] + p if k + 1 < len(old) else NEG)
                  for k in range(len(old) + 1)]
            if heap and heap[0] < p:
                gain += p - heappop(heap)
                heappush(heap, p)
            heappush(heap, p)
            represented = [gain]
            for a in sorted(heap):
                represented.append(represented[-1] - a)
            assert represented == dp
        checks['ABC250 G every holding state vs original trading DP'] += 1


def grouped_knapsack(items, cap, truncate):
    dp = [0] + [NEG] * cap
    for w in sorted(set(w for w, _ in items)):
        heap = [-(v - 1) for weight, v in items if weight == w]
        # Sorting is a separate exact implementation of a max priority queue.
        heap.sort()
        values = [0]
        for _ in range(cap // w):
            gain = -heappop(heap)
            if truncate and gain <= 0:
                break
            values.append(values[-1] + gain)
            heappush(heap, -(gain - 2))
        out = [NEG] * (cap + 1)
        for j in range(cap + 1):
            for k, value in enumerate(values[:j // w + 1]):
                if dp[j - k * w] != NEG:
                    out[j] = max(out[j], dp[j - k * w] + value)
        dp = out
    return max(dp)


for _ in range(500):
    cap = rng.randrange(1, 11)
    items = [(rng.randrange(1, cap + 1), rng.randrange(1, 9))
             for _ in range(rng.randrange(1, 5))]
    best = 0
    for counts in product(*(range(cap // w + 1) for w, _ in items)):
        if sum(c * w for c, (w, _) in zip(counts, items)) <= cap:
            best = max(best, sum(c * v - c * c for c, (_, v) in zip(counts, items)))
    assert grouped_knapsack(items, cap, False) == best
    assert grouped_knapsack(items, cap, True) == best
    checks['ABC373 F signed marginal tails vs original multiplicity enumeration'] += 1
assert grouped_knapsack([(2, 1)], 3, False) == 0

for name, count in sorted(checks.items()):
    print(f'{name}: {count} passed')
print(f'Total: {sum(checks.values())} independent finite checks passed')
