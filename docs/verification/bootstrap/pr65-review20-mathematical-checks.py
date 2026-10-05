"""Finite independent oracles for review 5407113841; Python 3.9+, no dependencies.

These check the amended transitions and boundaries, not all 868 solutions.
"""
from collections import Counter, defaultdict, deque
from functools import lru_cache
from itertools import combinations_with_replacement, permutations, product
from math import lcm

INF = 10**12


def check_lsb_dp():
    comparisons = cases = 0
    for n in range(32):
        for x in range(64):
            flag = True
            for b in range(6):
                u, v = x >> b & 1, n >> b & 1
                flag = flag if u == v else u < v
                assert flag == (x % (1 << (b + 1)) <= n % (1 << (b + 1)))
                comparisons += 1
    for n in range(16):
        for mods in product(range(1, 4), repeat=3):
            dp = {(0, 0, 0, True, True, True): 1}
            for b in range(4):
                nxt = defaultdict(int)
                for state, ways in dp.items():
                    for bits in [(0, 0, 0), (0, 1, 1), (1, 0, 1), (1, 1, 0)]:
                        remainders = tuple((state[j] + bits[j] * (1 << b)) % mods[j]
                                           for j in range(3))
                        flags = tuple(state[j + 3] if bits[j] == (n >> b & 1)
                                      else bits[j] < (n >> b & 1) for j in range(3))
                        nxt[remainders + flags] += ways
                dp = nxt
            answer = dp.get((0, 0, 0, True, True, True), 0) - 1
            answer -= sum(n // lcm(mods[j], mods[k]) for j, k in [(0, 1), (0, 2), (1, 2)])
            direct = sum(not (a ^ b ^ c) for a in range(mods[0], n + 1, mods[0])
                         for b in range(mods[1], n + 1, mods[1])
                         for c in range(mods[2], n + 1, mods[2]))
            assert answer == direct, (n, mods, answer, direct)
            cases += 1
    print('ABC317 F: lower-prefix comparisons:', comparisons, '; positive triples:', cases)


def matrix_apply(matrix, vector):
    return [min(matrix[b][a] + vector[a] for a in range(len(vector)))
            for b in range(len(vector))]


def check_grid_matrix():
    cases = 0
    for n in range(2, 5):
        interior = [(r, c) for r in range(3) for c in range(n)
                    if (r, c) not in [(0, 0), (2, n - 1)]]
        for bits in product([0, 1], repeat=len(interior)):
            walls = {p for p, bit in zip(interior, bits) if bit}
            distance = {(0, 0): 0}
            queue = deque([(0, 0)])
            while queue:
                r, c = queue.popleft()
                for v in [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]:
                    if 0 <= v[0] < 3 and 0 <= v[1] < n and v not in walls and v not in distance:
                        distance[v] = distance[r, c] + 1
                        queue.append(v)
            vector = [0, INF, INF]
            for c in range(n):
                matrix = [[abs(a - b) if all((r, c) not in walls
                           for r in range(min(a, b), max(a, b) + 1)) else INF
                           for a in range(3)] for b in range(3)]
                vector = matrix_apply(matrix, vector)
            answer = vector[2] + n - 1 if vector[2] < INF else -1
            assert answer == distance.get((2, n - 1), -1), (n, walls, answer, distance)
            cases += 1
    print('ABC429 F: leaf matrices and full answer vs unrestricted BFS:', cases)


def z_array(s):
    # Independent naive LCP precomputation; tests the comparison's interval indices.
    z = [0] * len(s)
    for i in range(1, len(s)):
        while i + z[i] < len(s) and s[z[i]] == s[i + z[i]]:
            z[i] += 1
    return z


def compare(x, y):
    if len(x) < len(y):
        return -compare(y, x)
    n, m = len(x), len(y)
    def sign(a, b):
        return (a > b) - (a < b)
    for a, b in zip(x[:m], y):
        if a != b:
            return sign(a, b)
    if n > m:
        z = min(z_array(x)[m], n - m)
        if z < n - m:
            return sign(x[m + z], x[z])
    for a, b in zip(y, x[n - m:]):
        if a != b:
            return sign(a, b)
    return 0


def check_concat():
    from functools import cmp_to_key
    strings = [''.join(s) for n in range(1, 6) for s in product('ab', repeat=n)]
    for x, y in product(strings, repeat=2):
        assert compare(x, y) == ((x + y > y + x) - (x + y < y + x)), (x, y)
    cases = 0
    for n in range(2, 6):
        for values in combinations_with_replacement(['a', 'b', 'aa', 'ab', 'ba', 'bb'], n):
            ordered = sorted(values, key=cmp_to_key(compare))
            if any(compare(a, b) == 0 for a, b in zip(ordered, ordered[1:])):
                answer = ''.join(ordered)
            else:
                candidates = []
                for i in [n - 2, n - 3] if n >= 3 else [0]:
                    copy = ordered[:]
                    copy[i], copy[i + 1] = copy[i + 1], copy[i]
                    candidates.append(''.join(copy))
                answer = min(candidates)
            # Positions are distinct, even when their strings or concatenations coincide.
            direct = sorted(''.join(p) for p in permutations(values))[1]
            assert answer == direct, (values, answer, direct)
            cases += 1
    print('ABC434 F: Z comparator:', len(strings)**2, '; second concatenation:', cases)


def check_holidays():
    cases = 0
    for n in range(1, 8):
        for costs in product([1, 3], repeat=n):
            for k in range(1, n + 1):
                direct = INF
                for mask in range(1, 1 << n):
                    holidays = [i for i in range(n) if mask >> i & 1]
                    if holidays[-1] - holidays[0] >= k - 1 and all(
                            b - a <= 2 for a, b in zip(holidays, holidays[1:])):
                        direct = min(direct, sum(costs[i] for i in holidays))
                answer = INF
                for start in range(n - k + 1):
                    vector = [0, costs[start - 1] if start else INF]
                    for cost in costs[start:start + k]:
                        vector = matrix_apply([[INF, 0], [cost, cost]], vector)
                    answer = min(answer, vector[1])
                assert answer == direct, (costs, k, answer, direct)
                cases += 1
    print('ABC456 F: both initial states, daily matrix and terminal holiday vs subsets:', cases)


def check_second_gap():
    cases = 0
    for n in range(2, 8):
        signatures = Counter()
        for p in permutations(range(n)):
            distances = []
            for i in range(n - 1):
                top = sorted(range(i, n), key=p.__getitem__, reverse=True)[:2]
                distances.append(abs(top[0] - top[1]))
            signatures[tuple(distances)] += 1
        for d in product(*(range(1, n - i) for i in range(n - 1))):
            direct = signatures[d]
            # Direct array updates, then the amended lazy scale/epoch representation.
            dp = [0] * n
            dp[-1] = 1
            base, stamps, epoch, scale = dp[:], [0] * n, 0, 1
            modulus = 998244353
            for i in range(n - 2, -1, -1):
                target = i + d[i]
                v = dp[target]
                lazy_v = scale * base[target] % modulus if stamps[target] == epoch else 0
                assert lazy_v == v
                c = n - i - 2 if i < n - 2 and d[i] == d[i + 1] else 0
                dp = [x * c for x in dp]
                dp[i] += v
                dp[target] += v
                if c:
                    scale = scale * c % modulus
                else:
                    epoch += 1
                    scale = 1
                for a in [i, target]:
                    if stamps[a] != epoch:
                        base[a], stamps[a] = 0, epoch
                    base[a] = (base[a] + lazy_v * pow(scale, -1, modulus)) % modulus
                assert dp == [scale * base[a] % modulus if stamps[a] == epoch else 0
                              for a in range(n)]
            assert sum(dp) == direct, (n, d, sum(dp), direct)
            cases += 1
    print('ABC457 F: all constrained gap arrays (including impossible arrays) vs permutation counts and lazy updates:', cases)


def check_shipping():
    cases = 0
    for n in range(1, 5):
        for arrivals in combinations_with_replacement(range(1, 4), n):
            for capacity in range(1, n + 1):
                for gap in range(1, 4):
                    @lru_cache(None)
                    def arbitrary(remaining, previous):
                        if not remaining:
                            return 0
                        answer = INF
                        selected = remaining
                        while selected:
                            indices = [i for i in range(n) if selected >> i & 1]
                            if len(indices) <= capacity:
                                day = max(previous + gap, max(arrivals[i] for i in indices))
                                answer = min(answer, sum(day - arrivals[i] for i in indices)
                                             + arbitrary(remaining ^ selected, day))
                            selected = (selected - 1) & remaining
                        return answer
                    direct = arbitrary((1 << n) - 1, -gap)
                    events = sorted({t + j * gap for t in arrivals for j in range(n + 1)})
                    from bisect import bisect_left
                    dp = [[INF] * (n + 1) for _ in events]
                    dp[0][0] = 0
                    answer = INF
                    for e, day in enumerate(events):
                        for done in range(n):
                            value = dp[e][done]
                            if value >= INF:
                                continue
                            if e + 1 < len(events):
                                dp[e + 1][done] = min(dp[e + 1][done], value)
                            for count in range(1, min(capacity, n - done) + 1):
                                if arrivals[done + count - 1] > day:
                                    break
                                cost = value + sum(day - t for t in arrivals[done:done + count])
                                if done + count == n:
                                    answer = min(answer, cost)
                                else:
                                    nxt = bisect_left(events, day + gap)
                                    if nxt < len(events):
                                        dp[nxt][done + count] = min(dp[nxt][done + count], cost)
                    assert answer == direct, (arrivals, capacity, gap, answer, direct)
                    cases += 1
    print('ABC374 F: prefix event DP vs arbitrary batch subsets:', cases)


def check_affine_breaks():
    cases = 0
    for n in range(3, 12):
        h = n // 2
        for center in range(n):
            for x in range(center, center + n):
                value = x - center if x < center + h + 1 else -x + center + n
                direct = min((x - center) % n, (center - x) % n)
                assert value == direct, (n, center, x)
                cases += 1
    print('ABC268 E: even/odd half-open affine pieces:', cases)


def digit_bfs(n, stop):
    parent = {(0, 0): None}
    queue = deque([(0, 0)])
    while queue:
        r, c = queue.popleft()
        for d in range(max(1, c), 10):
            target = ((10 * r + d) % n, d)
            if target in parent:
                if stop:
                    break
                continue
            parent[target] = (r, c)
            queue.append(target)
            if target[0] == 0:
                result, current = [], target
                while parent[current] is not None:
                    result.append(str(current[1]))
                    current = parent[current]
                return ''.join(result[::-1])
    return None


def check_digit_break():
    for n in range(1, 1001):
        assert digit_bfs(n, True) == digit_bfs(n, False), n
    print('ABC443 F: suffix break vs full-edge BFS, moduli 1..1000')


def check_empty_strips():
    width, strip_width = 12, 3
    universe = [(x, y) for x in [0, 2, 3, 8, 12] for y in [0, 12]]
    cases = 0
    for count in range(1, 6):
        for points in combinations_with_replacement(universe, count):
            ordered = sorted(points, key=lambda p: (p[0] // strip_width,
                            p[1] if p[0] // strip_width % 2 == 0 else -p[1]))
            edges = list(zip(ordered, ordered[1:] + ordered[:1]))
            horizontal = sum(abs(a[0] - b[0]) for a, b in edges)
            vertical = sum(abs(a[1] - b[1]) for a, b in edges)
            strips = width // strip_width + 1
            assert horizontal <= count * strip_width + 2 * width, points
            assert vertical <= (strips + 1) * width, points
            cases += 1
    assert 60000 * 82000 + 247 * 20000000 == 9860000000 < 10**10
    print('ABC448 F: coordinate bounds with skipped/empty strips:', cases)


if __name__ == '__main__':
    for check in [check_lsb_dp, check_grid_matrix, check_concat, check_holidays,
                  check_second_gap, check_shipping, check_affine_breaks,
                  check_digit_break, check_empty_strips]:
        check()
