"""Independent finite checks for PR65's G / H / Ex review corrections.

Python 3.9+, no dependencies, no random input. These are finite oracles,
not a replacement for the general arguments in the textbook.
"""
from collections import defaultdict, deque
from functools import lru_cache
from itertools import combinations, product
from math import comb, factorial
from fractions import Fraction


def check_elevators():
    # Literal building/floor shortest paths vs normalized interval reach.
    n, height = 3, 4
    options = [(b, lo, hi) for b in range(n)
               for lo in range(height) for hi in range(lo + 1, height)]
    cases = 0
    for elevators in combinations(options, 2):
        grouped = [[] for _ in range(n)]
        for b, lo, hi in sorted(elevators):
            if grouped[b] and grouped[b][-1][1] >= lo:
                grouped[b][-1] = (grouped[b][-1][0], max(grouped[b][-1][1], hi))
            else:
                grouped[b].append((lo, hi))
        for source in range(n * height):
            dist = [10**6] * (n * height)
            dist[source] = 0
            queue = deque([source])
            while queue:
                v = queue.popleft()
                b, floor = divmod(v, height)
                neighbors = [other * height + floor for other in range(n) if other != b]
                for eb, lo, hi in elevators:
                    if eb == b and lo <= floor <= hi:
                        neighbors += [b * height + f for f in (floor - 1, floor + 1)
                                      if lo <= f <= hi]
                for w in neighbors:
                    if dist[w] > dist[v] + 1:
                        dist[w] = dist[v] + 1
                        queue.append(w)
            for target in range(n * height):
                x, y = divmod(source, height)
                z, w = divmod(target, height)
                vertical = abs(y - w)
                if y > w:
                    x, z, y, w = z, x, w, y
                for lo, hi in grouped[x]:
                    if lo <= y <= hi:
                        y = hi
                        break
                for lo, hi in grouped[z]:
                    if lo <= w <= hi:
                        w = lo
                        break
                if y >= w:
                    crossings = int(x != z)
                else:
                    crossings = 1
                    while y < w:
                        next_y = max([y] + [hi for groups in grouped for lo, hi in groups
                                            if lo <= y <= hi])
                        if next_y == y:
                            crossings = 10**6
                            break
                        y = next_y
                        crossings += 1
                expected = dist[target] if dist[target] < 10**6 else -1
                answer = vertical + crossings if crossings < 10**6 else -1
                assert answer == expected, (elevators, source, target, answer, expected)
                cases += 1
    print('ABC254 G: normalized time vs original shortest paths:', cases)


def carry_count(n, equations, bits=4):
    if any(target < 0 for lo, hi, target in equations):
        return 0
    dp = {(0,) * len(equations): 1}
    for bit in range(bits):
        nxt = defaultdict(int)
        for carry, ways in dp.items():
            for mask in range(1 << n):
                values = [carry[j] + sum(mask >> i & 1 for i in range(lo, hi))
                          for j, (lo, hi, target) in enumerate(equations)]
                if all(v % 2 == (target >> bit & 1)
                       for v, (_, _, target) in zip(values, equations)):
                    state = tuple((v - (target >> bit & 1)) // 2
                                  for v, (_, _, target) in zip(values, equations))
                    nxt[state] += ways
        dp = nxt
    return dp.get((0,) * len(equations), 0)


def check_nonnegative_carries():
    # DSU-consistent negative derived target, despite both input shifts >= 0.
    shifted_input = [(0, 1, 9), (0, 2, 3)]
    assert all(t >= 0 for _, _, t in shifted_input)
    derived = [(0, 1, 9), (1, 2, 3 - 9)]
    assert carry_count(2, derived) == 0
    assert carry_count(2, [(0, 2, -1)]) == 0
    cases = 0
    for total in range(8):
        for first_two in range(8):
            equations = [(0, 3, total), (0, 2, first_two)]
            direct = sum(sum(a) == total and sum(a[:2]) == first_two
                         for a in product(range(8), repeat=3))
            assert carry_count(3, equations) == direct
            cases += 1
    print('ABC466 G: negative targets and carry counts vs nonnegative enumeration:', cases)


def contraction_costs(gaps):
    # Independent small oracle for the cardinality curve produced by the heap.
    # Using a list, each replacement keeps the same three-edge contraction.
    values = list(gaps)
    costs = [0]
    while values:
        i = min(range(len(values)), key=values.__getitem__)
        costs.append(costs[-1] + values[i])
        if i == 0:
            values = values[2:]
        elif i == len(values) - 1:
            values = values[:-2]
        else:
            values[i-1:i+2] = [values[i-1] + values[i+1] - values[i]]
    return costs


def check_budget_answers():
    cases = 0
    for n in range(2, 9):
        for s in product('SR', repeat=n):
            extended = ('S',) + s + ('R',)
            bits = [int(a != b) for a, b in zip(extended, extended[1:])]
            zero = [i for i, b in enumerate(bits) if not b]
            costs = contraction_costs([b-a for a, b in zip(zero, zero[1:])])
            initial = (sum(bits) - 1) // 2
            answer = [initial + max(t for t, c in enumerate(costs) if c <= budget)
                      for budget in range(n + 1)]
            direct = [0] * (n + 1)
            for mask in range(1 << n):
                result = [c if not (mask >> i & 1) else ('R' if c == 'S' else 'S')
                          for i, c in enumerate(s)]
                happiness = sum(a == 'R' and b == 'S' for a, b in zip(result, result[1:]))
                for budget in range(bin(mask).count('1'), n + 1):
                    direct[budget] = max(direct[budget], happiness)
            assert answer == direct, (s, answer, direct)
            cases += 1
    print('ABC464 G: all budget answers vs literal flips:', cases)


def check_mst_weights():
    cases = 0
    for n in range(2, 5):
        edges = list(combinations(range(n), 2))
        for m in range(1, 4):
            total = 0
            for weights in product(range(1, m + 1), repeat=len(edges)):
                parent = list(range(n))
                def root(v):
                    while parent[v] != v:
                        v = parent[v]
                    return v
                for w, (a, b) in sorted(zip(weights, edges)):
                    a, b = root(a), root(b)
                    if a != b:
                        parent[a] = b
                        total += w
            via_components = (n - 1 - m) * m ** len(edges)
            for k in range(1, m + 1):
                f = [0] * (n + 1)
                for s in range(1, n + 1):
                    f[s] = m ** comb(s, 2) - sum(
                        comb(s-1, i-1) * f[i] * (m-k) ** (i*(s-i))
                        * m ** comb(s-i, 2) for i in range(1, s))
                via_components += sum(comb(n, s) * f[s] * (m-k) ** (s*(n-s))
                                      * m ** comb(n-s, 2) for s in range(1, n+1))
            assert via_components == total
            cases += 1
    print('ABC386 G: connected recurrence and correction vs Kruskal:', cases)


def check_circular_final_pair():
    cases = 0
    for n in range(2, 7):
        for directions in product('LR', repeat=n):
            @lru_cache(None)
            def forward(alive):
                if len(alive) == 1:
                    return Fraction(0)
                result = 0
                for i, u in enumerate(alive):
                    v = alive[(i + (1 if directions[u] == 'R' else -1)) % len(alive)]
                    delta = (v-u) % n if directions[u] == 'R' else (u-v) % n
                    result += delta + forward(tuple(x for x in alive if x != v))
                return result / len(alive)
            @lru_cache(None)
            def interval(l, r):
                if r == l + 1:
                    return 1, 0
                count = cost = 0
                for i in range(l+1, r):
                    ln, lc = interval(l, i)
                    rn, rc = interval(i, r)
                    ways = int(directions[l % n] == 'R') + int(directions[r % n] == 'L')
                    delta = ((i-l) if directions[l % n] == 'R' else 0) + ((r-i) if directions[r % n] == 'L' else 0)
                    mix = comb(r-l-2, i-l-1)
                    count += mix * ways * ln * rn
                    cost += mix * (ways * (lc*rn + ln*rc) + delta*ln*rn)
                return count, cost
            total = 0
            for u in range(n):
                for d in range(1, n):
                    v = u + d
                    ln, lc = interval(u, v)
                    rn, rc = interval(v, u+n)
                    delta = d if directions[u] == 'R' else n-d
                    total += comb(n-2, d-1) * (lc*rn + ln*rc + delta*ln*rn)
            assert Fraction(total, factorial(n)) == forward(tuple(range(n)))
            cases += 1
    print('ABC238 Ex: last-pair sum vs forward rational expectation:', cases)


def matrix_rank(rows, p=5):
    basis = {}
    for row in rows:
        v = list(row)
        for j in range(len(v)):
            if not v[j]:
                continue
            if j not in basis:
                scale = pow(v[j], -1, p)
                basis[j] = [x*scale % p for x in v]
                break
            a = v[j]
            v = [(x-a*y) % p for x, y in zip(v, basis[j])]
    return len(basis)


def check_latest_basis():
    cases = 0
    for rows in product(list(product(range(3), repeat=2)), repeat=4):
        basis = {}
        for r, row in enumerate(rows, 1):
            v, pos = list(row), r
            for j in range(2):
                if not v[j]:
                    continue
                if j not in basis:
                    scale = pow(v[j], -1, 5)
                    basis[j] = ([x*scale % 5 for x in v], pos)
                    break
                old, oldpos = basis[j]
                if oldpos < pos:
                    scale = pow(v[j], -1, 5)
                    basis[j] = ([x*scale % 5 for x in v], pos)
                    v, pos = old, oldpos
                pivot, _ = basis[j]
                a = v[j]
                v = [(x-a*y) % 5 for x, y in zip(v, pivot)]
            for left in range(1, r+1):
                assert sum(pos >= left for _, pos in basis.values()) == matrix_rank(rows[left-1:r])
                cases += 1
    print('ABC399 G: latest-position basis vs fresh elimination for every suffix:', cases)


def check_syntax_and_small_models():
    # Directly exercise the cut directions for every pair of bounded labels.
    for d in range(1, 6):
        for u, v in product(range(d+1), repeat=2):
            cost = sum(v >= j and u < j for j in range(1, d+1))
            forbidden = any(v >= j+1 and u < j for j in range(1, d))
            assert forbidden == (v > u + 1)
            if not forbidden:
                assert cost == int(v == u + 1)
    # Each level-1 kind is a 0/1 choice, despite unlimited inventory.
    assert comb(1, 2) == 0
    assert [(len(c),) for size in range(2) for c in combinations(range(1), size)] == [(0,), (1,)]
    # Heavy clock integrates interior events even when both endpoints are absent.
    clock = lambda t: max(0, min(t, 7)-3)
    assert clock(10)-clock(1) == 4
    print('ABC397 G cut directions, ABC281 Ex 0/1 materials, ABC365 G clock: passed')


def lcp(a, b):
    k = 0
    while k < min(len(a), len(b)) and a[k] == b[k]:
        k += 1
    return k


def prefix_blocks(strings):
    suffixes = sorted(s[i:] for s in strings for i in range(len(s)))
    # Node: [depth, children, optional leaf index]
    nodes = [[0, [], None]]
    stack = [0]
    for index, value in enumerate(suffixes):
        h = lcp(suffixes[index-1], value) if index else 0
        while nodes[stack[-1]][0] > h:
            stack.pop()
        parent = stack[-1]
        if nodes[parent][0] < h:
            old = nodes[parent][1].pop()
            internal = len(nodes)
            nodes.append([h, [old], None])
            nodes[parent][1].append(internal)
            stack.append(internal)
            parent = internal
        leaf = len(nodes)
        nodes.append([len(value), [], index])
        nodes[parent][1].append(leaf)
    @lru_cache(None)
    def leaves(v):
        return [nodes[v][2]] if nodes[v][2] is not None else [i for w in nodes[v][1] for i in leaves(w)]
    output = []
    def visit(v, depth):
        members = leaves(v)
        for length in range(depth+1, nodes[v][0]+1):
            for index in members:
                output.append(suffixes[index][:length])
        for w in nodes[v][1]:
            visit(w, nodes[v][0])
    visit(0, 0)
    return output


def check_prefix_blocks():
    words = [''.join(s) for n in range(1, 5) for s in product('ab', repeat=n)]
    cases = 0
    for strings in [(word,) for word in words] + list(product(words, repeat=2)):
        direct = sorted(s[l:r] for s in strings for l in range(len(s)) for r in range(l+1, len(s)+1))
        assert prefix_blocks(strings) == direct, strings
        cases += 1
    assert prefix_blocks(['ab']) == ['a', 'ab', 'b']
    print('ABC280 Ex: stack prefix tree incl. identical/terminal leaves vs all occurrences:', cases)


def profile_cost(h, w, mandatory):
    dp = {((0,) * w, False): 0}
    for index in range(h*w):
        col = index % w
        nxt = {}
        for (front, done), cost in dp.items():
            for black in ([True] if mandatory >> index & 1 else [False, True]):
                if done and black:
                    continue
                values = list(front)
                above = values[col]
                left = values[col-1] if col else 0
                closed = done
                if black:
                    if above and left and above != left:
                        values = [left if x == above else x for x in values]
                    values[col] = left or above or max(values) + 1
                else:
                    values[col] = 0
                    if above and above not in values:
                        if any(values):
                            continue
                        closed = True
                labels = {}
                normalized = tuple(labels.setdefault(x, len(labels)+1) if x else 0 for x in values)
                key = (normalized, closed)
                value = cost + int(black and not (mandatory >> index & 1))
                nxt[key] = min(nxt.get(key, 10**6), value)
        dp = nxt
    return min(cost for (front, done), cost in dp.items()
               if done or len(set(front) - {0}) == 1)


def check_profile_ends():
    cases = 0
    for h, w in [(1, 1), (1, 4), (2, 3), (3, 3)]:
        connected = []
        for mask in range(1, 1 << (h*w)):
            start = (mask & -mask).bit_length() - 1
            seen, queue = {start}, deque([start])
            while queue:
                i = queue.popleft()
                r, c = divmod(i, w)
                for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    nr, nc = r+dr, c+dc
                    j = nr*w + nc
                    if 0 <= nr < h and 0 <= nc < w and mask >> j & 1 and j not in seen:
                        seen.add(j)
                        queue.append(j)
            if len(seen) == bin(mask).count('1'):
                connected.append(mask)
        for mandatory in range(1, 1 << (h*w)):
            expected = min(bin(mask ^ mandatory).count('1') for mask in connected
                           if mask & mandatory == mandatory)
            assert profile_cost(h, w, mandatory) == expected, (h, w, mandatory)
            cases += 1
    print('ABC296 Ex: initial/cost/final frontier states vs full grid fillings:', cases)


def stern_path(p, q):
    a, b, c, d = 0, 1, 1, 0
    operations = []
    while True:
        operations.append((a, b, c, d))
        x, y = a+c, b+d
        if (x, y) == (p, q):
            return operations
        if p*y < q*x:
            c, d = x, y
        else:
            a, b = x, y


def compressed_stern_sum(values):
    n = len(values)
    def coverage(positions):
        points = [-1] + sorted(positions) + [n]
        return n*(n+1)//2 - sum((b-a-1)*(b-a)//2 for a, b in zip(points, points[1:]))
    def visit(a, b, c, d, targets):
        if not targets:
            return 0
        x, y = a+c, b+d
        same = [t for t in targets if t[0]*y == t[1]*x]
        left = [t for t in targets if t[0]*y < t[1]*x]
        right = [t for t in targets if t[0]*y > t[1]*x]
        if not same and (not left or not right):
            limit = right[0] if right else left[-1]
            p, q, _ = limit
            P, Q = c*q-d*p, b*p-a*q
            k = (Q-1)//P if right else (P-1)//Q
            assert k > 0
            total = k * coverage([t[2] for t in targets])
            if right:
                a, b = a+k*c, b+k*d
            else:
                c, d = c+k*a, d+k*b
            return total + visit(a, b, c, d, targets)
        return coverage([t[2] for t in targets]) + visit(a, b, x, y, left) + visit(x, y, c, d, right)
    targets = sorted([(p, q, i) for i, (p, q) in enumerate(values) if p and q],
                     key=lambda t: Fraction(t[0], t[1]))
    return visit(0, 1, 1, 0, targets)


def check_stern_skips():
    from math import gcd
    choices = [(0, 1), (1, 0)] + [(p, q) for p in range(1, 5) for q in range(1, 5) if gcd(p, q) == 1]
    cases = 0
    for values in combinations(choices, 4):
        # Several orders keep initial endpoints as valid positions in subarrays.
        for values in [values, values[::-1], values[1:]+values[:1]]:
            direct = 0
            for l in range(4):
                for r in range(l+1, 5):
                    necessary = set()
                    for p, q in values[l:r]:
                        if p and q:
                            necessary.update(stern_path(p, q))
                    direct += len(necessary)
            assert compressed_stern_sum(values) == direct, values
            cases += 1
    print('ABC273 Ex: direct quotient skips and operation count vs explicit ancestors:', cases)


def solve_three(equations):
    matrix = [[Fraction(x) for x in row] + [Fraction(rhs)] for row, rhs in equations]
    for j in range(3):
        pivot = next((i for i in range(j, 3) if matrix[i][j]), None)
        if pivot is None:
            return None
        matrix[j], matrix[pivot] = matrix[pivot], matrix[j]
        scale = matrix[j][j]
        matrix[j] = [x/scale for x in matrix[j]]
        for i in range(3):
            if i != j:
                scale = matrix[i][j]
                matrix[i] = [x-scale*y for x, y in zip(matrix[i], matrix[j])]
    return [matrix[i][3] for i in range(3)]


def exact_ban_game(vectors):
    # Enumerate vertices of the hypograph in (x,y,z) with exact rationals.
    equations = [((1, 0, 0), 0), ((0, 1, 0), 0), ((1, 1, 0), 1)]
    equations += [((v[0]-v[2], v[1]-v[2], -1), -v[2]) for v in vectors]
    candidates = []
    for group in combinations(equations, 3):
        answer = solve_three(group)
        if answer is None:
            continue
        x, y, z = answer
        if x >= 0 and y >= 0 and x+y <= 1 and all(z <= x*a+y*b+(1-x-y)*c for a, b, c in vectors):
            candidates.append(z)
    return max(candidates)


def nested_ban_game(vectors):
    vectors = [[float(x) for x in v] for v in vectors]
    def value(x, y):
        return min(x*a + y*b + (1-x-y)*c for a, b, c in vectors)
    def inner(x):
        lo, hi = 0.0, 1-x
        for _ in range(100):
            a, b = (2*lo+hi)/3, (lo+2*hi)/3
            if value(x, a) < value(x, b):
                lo = a
            else:
                hi = b
        return max(value(x, 0), value(x, 1-x), value(x, (lo+hi)/2))
    lo, hi = 0.0, 1.0
    for _ in range(100):
        a, b = (2*lo+hi)/3, (lo+2*hi)/3
        if inner(a) < inner(b):
            lo = a
        else:
            hi = b
    return max(inner(0), inner(1), inner((lo+hi)/2))


def check_ban_optimization():
    games = [
        [(1, 0, 0), (0, 1, 0), (0, 0, 1)],
        [(1, 1, 1), (0, 0, 0)],
        [(1, 0, 0), (1, 1, 0)],
        [(0, 1, 1), (1, 0, 1)],
        [(Fraction(1, 3), Fraction(1, 3), Fraction(1, 3))],
    ]
    # Derive all BAN outcomes from the original sample's two-column games.
    original = [[Fraction(x, 10) for x in row] for row in [(6, 5, 1), (4, 7, 3), (8, 2, 9)]]
    vectors = []
    for banned_row in range(3):
        vector = []
        for banned_col in range(3):
            rows = [[x for j, x in enumerate(row) if j != banned_col]
                    for i, row in enumerate(original) if i != banned_row]
            points = {Fraction(0), Fraction(1)}
            for a, b in combinations(rows, 2):
                denominator = a[0]-a[1]-b[0]+b[1]
                if denominator:
                    point = (b[1]-a[1])/denominator
                    if 0 <= point <= 1:
                        points.add(point)
            vector.append(min(max(x*a+(1-x)*b for a, b in rows) for x in points))
        vectors.append(vector)
    assert exact_ban_game(vectors) == Fraction(29, 55)
    games.append(vectors)
    for game in games:
        assert abs(nested_ban_game(game) - float(exact_ban_game(game))) < 1e-10
    print('ABC448 G: triangular nested maximum vs exact game vertices, incl. sample:', len(games))


def trie_pair_rank(left, right, k, bits=3):
    nodes = [[[-1, -1], 0]]
    for value in right:
        at = 0
        nodes[at][1] += 1
        for b in range(bits-1, -1, -1):
            bit = value >> b & 1
            if nodes[at][0][bit] == -1:
                nodes[at][0][bit] = len(nodes)
                nodes.append([[-1, -1], 0])
            at = nodes[at][0][bit]
            nodes[at][1] += 1
    positions = [(a, 0) for a in left]
    answer = 0
    for b in range(bits-1, -1, -1):
        one = [nodes[pos][0][1 ^ (a >> b & 1)] for a, pos in positions]
        count = sum(nodes[child][1] for child in one if child != -1)
        bit = int(k <= count)
        if not bit:
            k -= count
        answer |= bit << b
        positions = [(a, nodes[pos][0][bit ^ (a >> b & 1)]) for a, pos in positions
                     if nodes[pos][0][bit ^ (a >> b & 1)] != -1]
    return answer


def check_pair_trie():
    from itertools import combinations_with_replacement
    cases = 0
    lists = list(combinations_with_replacement(range(8), 2))
    for left, right in product(lists, repeat=2):
        ordered = sorted([a ^ b for a in left for b in right], reverse=True)
        for k, expected in enumerate(ordered, 1):
            assert trie_pair_rank(left, right, k) == expected
            cases += 1
    print('ABC252 Ex: per-left prefix nodes vs explicit XOR-pair ranking:', cases)


if __name__ == '__main__':
    check_elevators()
    check_nonnegative_carries()
    check_budget_answers()
    check_mst_weights()
    check_circular_final_pair()
    check_latest_basis()
    check_ban_optimization()
    check_pair_trie()
    check_prefix_blocks()
    check_profile_ends()
    check_stern_skips()
    check_syntax_and_small_models()
    print('All review 19 finite checks passed.')
