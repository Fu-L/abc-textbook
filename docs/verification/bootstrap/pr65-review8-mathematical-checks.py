# coding: utf-8
"""PR65 review 5400429043: independent finite checks, Python 3.9+, no dependencies."""
from collections import Counter, deque
from itertools import combinations, permutations, product
from fractions import Fraction
from math import comb, factorial, prod
from random import Random

rng = Random(6508)
MOD = 998244353


def choose(n, k):
    return comb(n, k) if 0 <= k <= n else 0


def multiply(a, b):
    c = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            c[i+j] += x*y
    return c


def determinant(a):
    a = [[x % MOD for x in row] for row in a]
    result = 1
    for i in range(len(a)):
        pivot = next((j for j in range(i, len(a)) if a[j][i]), None)
        if pivot is None:
            return 0
        if pivot != i:
            a[i], a[pivot] = a[pivot], a[i]
            result = -result
        result = result*a[i][i] % MOD
        inv = pow(a[i][i], MOD-2, MOD)
        for j in range(i+1, len(a)):
            rate = a[j][i]*inv % MOD
            for k in range(i, len(a)):
                a[j][k] = (a[j][k]-rate*a[i][k]) % MOD
    return result % MOD


def inverse(a):
    n = len(a)
    a = [[x % MOD for x in row]+[int(i == j) for j in range(n)] for i, row in enumerate(a)]
    for i in range(n):
        pivot = next(j for j in range(i, n) if a[j][i])
        a[i], a[pivot] = a[pivot], a[i]
        inv = pow(a[i][i], MOD-2, MOD)
        a[i] = [x*inv % MOD for x in a[i]]
        for j in range(n):
            if j != i:
                rate = a[j][i]
                a[j] = [(x-rate*y) % MOD for x, y in zip(a[j], a[i])]
    return [row[n:] for row in a]


def characteristic(a):
    """Paired similarities followed by leading-principal polynomial recurrence."""
    n = len(a)
    h = [[x % MOD for x in row] for row in a]
    for c in range(n-2):
        pivot = next((r for r in range(c+1, n) if h[r][c]), None)
        if pivot is None:
            continue
        h[c+1], h[pivot] = h[pivot], h[c+1]
        for row in h:
            row[c+1], row[pivot] = row[pivot], row[c+1]
        inv = pow(h[c+1][c], MOD-2, MOD)
        for r in range(c+2, n):
            rate = h[r][c]*inv % MOD
            h[r] = [(x-rate*y) % MOD for x, y in zip(h[r], h[c+1])]
            for row in h:
                row[c+1] = (row[c+1]+rate*row[r]) % MOD
    assert all(h[r][c] == 0 for c in range(n) for r in range(c+2, n))
    polynomials = [[1]]
    for i in range(n):
        p = [0]*(i+2)
        for j, x in enumerate(polynomials[i]):
            p[j] -= h[i][i]*x
            p[j+1] += x
        chain = 1
        for k in range(i-1, -1, -1):
            chain = chain*h[k+1][k] % MOD
            for j, x in enumerate(polynomials[k]):
                p[j] -= h[k][i]*chain*x
        polynomials.append([x % MOD for x in p])
    return polynomials[-1]


def evaluate(p, x):
    value = 0
    for coefficient in reversed(p):
        value = (value*x+coefficient) % MOD
    return value


seat_cases = 0
for n in range(2, 9):
    for m in range(2, n+1):
        for k in range(m+1):
            for fixed in combinations(range(n), k):
                brute = sum(prod(b-a for a, b in zip(seats, seats[1:]))
                            for seats in combinations(range(n), m) if set(fixed) <= set(seats))
                if not fixed:
                    predicted = choose(n+m-1, 2*m-1)
                else:
                    d = m-k
                    factors = [[choose(fixed[0]+j, 2*j) for j in range(min(fixed[0], d)+1)]]
                    for a, b in zip(fixed, fixed[1:]):
                        q = b-a-1
                        factors.append([choose(q+j+1, 2*j+1) for j in range(min(q, d)+1)])
                    q = n-1-fixed[-1]
                    factors.append([choose(q+j, 2*j) for j in range(min(q, d)+1)])
                    polynomial = [1]
                    for factor in factors:
                        polynomial = multiply(polynomial, factor)
                    predicted = polynomial[d] if d < len(polynomial) else 0
                assert brute*factorial(m-k) == predicted*factorial(m-k), (n, m, fixed)
                seat_cases += 1
assert choose(3, 3)*factorial(2) == 2
print('ABC225 H:', seat_cases, 'seat/fixed-seat configurations through N=8; K=0 and M=N included')


for trial in range(600):
    n = trial % 8
    a = [[rng.randrange(-3, 4) for _ in range(n)] for _ in range(n)]
    if trial % 5 == 0:
        a = [[0]*n for _ in range(n)]
    elif trial % 5 == 1:
        a = [[a[i][j] if i <= j else 0 for j in range(n)] for i in range(n)]
    p = characteristic(a)
    assert len(p) == n+1 and p[-1] == 1
    for x in [-2, 0, 1, 2, 7]:
        expected = determinant([[int(i == j)*x-a[i][j] for j in range(n)] for i in range(n)])
        assert evaluate(p, x) == expected, (a, x, p)
print('ABC323 G: 600 matrices / 3,000 evaluations, including zero pivots and paired swaps')


def prufer_tree(code, n):
    degree = [1]*n
    for x in code:
        degree[x] += 1
    edges = []
    for x in code:
        leaf = next(i for i, d in enumerate(degree) if d == 1)
        edges.append((leaf, x))
        degree[leaf] -= 1
        degree[x] -= 1
    a, b = [i for i, d in enumerate(degree) if d == 1]
    return edges+[(a, b)]


for n in range(2, 6):
    c = [[n*int(i == j)-1 for j in range(n-1)] for i in range(n-1)]
    assert determinant(c) == pow(n, n-2, MOD)
    inv = inverse(c)
    trees = [prufer_tree(code, n) for code in product(range(n), repeat=n-2)]
    for permutation in permutations(range(n)):
        b = [[0]*(n-1) for _ in range(n-1)]
        for i, j in combinations(range(n), 2):
            if permutation[i] > permutation[j]:
                if i < n-1:
                    b[i][i] += 1
                if j < n-1:
                    b[j][j] += 1
                    b[i][j] -= 1
                    b[j][i] -= 1
        a = [[-sum(inv[i][k]*b[k][j] for k in range(n-1)) % MOD
              for j in range(n-1)] for i in range(n-1)]
        q = list(reversed([x*determinant(c) % MOD for x in characteristic(a)]))
        result = [sum(q[j]*choose(j, i)*(-1)**(j-i) for j in range(i, n)) % MOD for i in range(n)]
        brute = Counter(sum(permutation[min(i, j)] > permutation[max(i, j)] for i, j in tree) for tree in trees)
        assert result == [brute[i] for i in range(n)], (n, permutation, result, brute)
print('ABC323 G: every permutation through N=5; full inversion-count distribution against Prufer trees')


def flow(n, edges, s, t):
    capacity = [[0]*n for _ in range(n)]
    for a, b, c in edges:
        capacity[a][b] += c
    total = 0
    while True:
        parent = [-1]*n
        parent[s] = s
        queue = deque([s])
        while queue and parent[t] < 0:
            a = queue.popleft()
            for b, c in enumerate(capacity[a]):
                if c and parent[b] < 0:
                    parent[b] = a
                    queue.append(b)
        if parent[t] < 0:
            return total
        value, b = 10**9, t
        while b != s:
            value = min(value, capacity[parent[b]][b])
            b = parent[b]
        b = t
        while b != s:
            a = parent[b]
            capacity[a][b] -= value
            capacity[b][a] += value
            b = a
        total += value


def label_edges(x, y):
    edges = []
    for k in range(4):
        edges += [(4*x+k, 4*y+k, 1), (4*y+k, 4*x+k, 1)]
        for l in range(k):
            edges += [(4*x+k, 4*y+l, 2), (4*y+k, 4*x+l, 2)]
    return edges


for a, b in product(range(1, 6), repeat=2):
    source = {k for k in range(a-1)} | {4+k for k in range(b-1)}
    cut = sum(c for u, v, c in label_edges(0, 1) if u in source and v not in source)
    assert cut == (a-b)**2, (a, b, cut)
for trial in range(120):
    n = 1 if trial < 10 else 2
    initial = [rng.randrange(6) for _ in range(n*n)]
    pairs = [(i*n+j, a*n+b) for i in range(n) for j in range(n)
             for a, b in [(i+1, j), (i, j+1)] if a < n and b < n]
    edges, s, t = [], 4*n*n, 4*n*n+1
    inf = 32*n*(n-1)+1
    for x, label in enumerate(initial):
        edges += [(4*x+k+1, 4*x+k, inf) for k in range(3)]
        if label > 1:
            edges.append((s, 4*x+label-2, inf))
        if 0 < label < 5:
            edges.append((4*x+label-1, t, inf))
    for x, y in pairs:
        edges += label_edges(x, y)
    brute = min(sum((labels[x]-labels[y])**2 for x, y in pairs)
                for labels in product(range(1, 6), repeat=n*n)
                if all(a == 0 or a == b for a, b in zip(initial, labels)))
    assert flow(t+1, edges, s, t) == brute, initial
print('ABC347 G: all 25 label pairs and 120 fixed/variable grids against all fillings')


for trial in range(700):
    n, m = rng.randrange(1, 9), rng.randrange(1, 9)
    a = [0]+[rng.randrange(1, 5) for _ in range(n)]
    b = [0]+[rng.randrange(1, 5) for _ in range(m)]
    pa = [sum(a[:i+1]) for i in range(n+1)]
    pia = [sum(j*a[j] for j in range(i+1)) for i in range(n+1)]
    value = 0
    for j in range(1, m+1):
        value += b[j]*pia[min(n, j-1)]
        for k in range(1, n//j+1):
            l, r = j*k, min(n, j*(k+1)-1)
            value += b[j]*(pia[r]-pia[l-1]-j*k*(pa[r]-pa[l-1]))
    assert value == sum(a[i]*b[j]*(i % j) for i in range(1, n+1) for j in range(1, m+1))
print('ABC452 E: 700 unequal-length arrays against every ordered pair, including quotient zero')


for k in [2, 3]:
    for x in combinations(range(5), k):
        for n in range(1, 4):
            dp = [0]*(1 << k)
            dp[0] = 1
            for y in range(min(x), max(x)+n+1):
                nxt = dp[:]
                for mask, count in enumerate(dp):
                    for p in range(k):
                        if not mask >> p & 1:
                            sign = (-1)**sum(mask >> q & 1 for q in range(p+1, k))
                            nxt[mask | 1 << p] += sign*count*choose(n, y-x[p])
                dp = nxt
            brute = 0
            for bits in product(range(2), repeat=n*k):
                positions = list(x)
                for step in range(n):
                    positions = [p+bits[step*k+i] for i, p in enumerate(positions)]
                    if len(set(positions)) != k:
                        break
                else:
                    brute += 1
            assert dp[-1] == brute, (n, x, dp[-1], brute)
print('ABC216 H: all robot moves for K=2,3, N<=3 and every start subset in 0..4')


def moments(n, m):
    return sum(choose(n, i) for i in range(m)), sum(i*choose(n, i) for i in range(m))


for n in range(26):
    for m in range(31):
        f, g = moments(n, m)
        c = choose(n, m)
        assert (f+c, g+m*c) == moments(n, m+1)
        if m:
            c = choose(n, m-1)
            assert (f-c, g-(m-1)*c) == moments(n, m-1)
        c = choose(n, m-1)
        assert (2*f-c, 2*g+f-m*c) == moments(n+1, m)
        if n:
            c = choose(n-1, m-1)
            new_f = (f+c)//2
            assert (new_f, (g-new_f+m*c)//2) == moments(n-1, m)
for n in range(1, 11):
    for x in range(-12, 13):
        if abs(x) >= n:
            value = abs(x)*(1 << n)
        else:
            m = (n+x+1)//2
            f, g = moments(n, m)
            value = -x*(1 << n)+2*((n+x)*f-2*g)
        assert value == sum(abs(2*sum(bits)-n-x) for bits in product(range(2), repeat=n))
print('ABC463 G: every directional update through N=25,M=30 and all walks through N=10')


for n in range(1, 7):
    for a in product(range(1, 4), repeat=n):
        stacks, totals, dp = [[], []], [0, 0], 1
        for value in a:
            for side in range(2):
                weight = dp
                while stacks[side] and (stacks[side][-1][0] <= value if side == 0 else stacks[side][-1][0] >= value):
                    old, count = stacks[side].pop()
                    totals[side] -= old*count
                    weight += count
                stacks[side].append((value, weight))
                totals[side] += value*weight
            dp = totals[0]-totals[1]
        brute = 0
        for mask in range(1 << (n-1)):
            cuts = [0]+[i+1 for i in range(n-1) if mask >> i & 1]+[n]
            brute += prod(max(a[l:r])-min(a[l:r]) for l, r in zip(cuts, cuts[1:]))
        assert dp == brute, a
print('ABC234 G: every ternary-valued array through N=6 against every partition')


for trial in range(500):
    n = rng.randrange(2, 7)
    candidates = [rng.choice(list(combinations(range(n), 2))) for _ in range(rng.randrange(1, 9))]
    dp = [0]*n
    dp[0] = 1
    for x, y in sorted(candidates):
        saved = sum(dp[x:y])
        dp = [v*2 if r < x or r >= y else v for r, v in enumerate(dp)]
        dp[y] += saved
    brute = 0
    for mask in range(1 << len(candidates)):
        edges = [(i, i-1) for i in range(1, n)] + [edge for j, edge in enumerate(candidates) if mask >> j & 1]
        seen, todo = {0}, [0]
        for u in todo:
            for a, b in edges:
                if a == u and b not in seen:
                    seen.add(b)
                    todo.append(b)
        brute += len(seen) == n
    assert dp[-1] == brute, (n, candidates)
print('ABC450 F: 500 graphs against all candidate-edge subsets, including duplicate edges')


def qualifies(value):
    digits = set(str(value))
    return int(value % 3 == 0)+int('3' in digits)+int(len(digits) == 3) == 1


for bound in list(range(1, 501))+[1013, 2026, 9999]:
    dp = {(0, 0, True): 1}
    for top in map(int, str(bound)):
        nxt = Counter()
        for (mask, rem, tight), count in dp.items():
            for digit in range((top if tight else 9)+1):
                target = 0 if mask == digit == 0 else mask | 1 << digit
                nxt[target, (rem*10+digit) % 3, tight and digit == top] += count
        dp = nxt
    value = sum(count for (mask, rem, tight), count in dp.items()
                if mask and int(rem == 0)+int(bool(mask >> 3 & 1))+int(bin(mask).count('1') == 3) == 1)
    assert value == sum(qualifies(x) for x in range(1, bound+1)), bound
print('ABC465 E: 503 bounds against integer enumeration; zero, real zero digits, exactly-one condition')


for n in range(1, 6):
    intervals = [sum(1 << i for i in range(l, r)) for l in range(n) for r in range(l+1, n+1)]
    reachable = {0}
    for k in range(3):
        if k:
            reachable |= {mask ^ interval for mask in list(reachable) for interval in intervals}
        for a, b in product(product([1, 4], repeat=n), repeat=2):
            dp = [0]*(2*k+1)
            for front, back in zip(a, b):
                best, nxt = 0, []
                for j, old in enumerate(dp):
                    best = max(best, old)
                    nxt.append(best+(back if j % 2 else front))
                dp = nxt
            brute = max(sum(b[i] if mask >> i & 1 else a[i] for i in range(n)) for mask in reachable)
            assert max(dp) == brute, (n, k, a, b)
print('ABC466 E: all two-valued card faces through N=5 against up to two original interval flips')


for n in range(2, 7):
    for counts in product(range(n+1), repeat=3):
        if sum(counts) != n:
            continue
        colors = tuple(c for c, count in enumerate(counts) for _ in range(count))
        polynomial = [Fraction(1)]
        for count in counts:
            if count:
                polynomial = multiply(polynomial, [Fraction(0)]+[Fraction(choose(count-1, count-k), factorial(k)) for k in range(1, count+1)])
        q = [factorial(n-i)*polynomial[n-i] for i in range(n)]
        p = [sum((-1)**(j-i)*choose(j, i)*q[j] for j in range(i, n)) for i in range(n)]
        u = [q[n-1-j]*factorial(n-1-j) for j in range(n)]
        v = [Fraction((-1)**j, factorial(j)) for j in range(n)]
        uv = multiply(u, v)
        assert p == [uv[n-1-i]/factorial(i) for i in range(n)]
        labels = prod(factorial(count) for count in counts)
        distribution = [int(labels*p[n-1-t]) for t in range(n)]
        brute = Counter(sum(colors[a] != colors[b] for a, b in zip(order, order[1:])) for order in permutations(range(n)))
        assert distribution == [brute[t] for t in range(n)], (counts, distribution, brute)
        for power in range(1, 6):
            assert sum(count*t**power for t, count in enumerate(distribution)) == sum(count*t**power for t, count in brute.items())
print('ABC260 Ex: every three-color frequency vector through N=6 against all labeled permutations')


def interpolate(values):
    n = len(values)-1
    q = [1]
    for j in range(n+1):
        q = [x % MOD for x in multiply(q, [-j, 1])]
    result = [0]*(n+1)
    for j, value in enumerate(values):
        # Synthetic division Q(y)/(y-j), with coefficients in ascending order.
        quotient = [0]*(n+1)
        quotient[n] = q[n+1]
        for k in range(n-1, -1, -1):
            quotient[k] = (q[k+1]+j*quotient[k+1]) % MOD
        denominator = prod(j-k for k in range(n+1) if k != j) % MOD
        rate = value*pow(denominator, MOD-2, MOD) % MOD
        result = [(x+rate*y) % MOD for x, y in zip(result, quotient)]
    return result


for trial in range(180):
    n = rng.randrange(1, 6)
    caps = [rng.randrange(1, 4) for _ in range(n)]
    original = [edge for edge in combinations(range(n), 2) if rng.randrange(2)]
    brute = None
    for mask in range(1 << len(original)):
        degree = [0]*n
        for j, (a, b) in enumerate(original):
            if mask >> j & 1:
                degree[a] += 1
                degree[b] += 1
        if all(d <= cap and (d-cap) % 2 == 0 for d, cap in zip(degree, caps)):
            size = bin(mask).count('1')
            brute = size if brute is None else min(brute, size)
    labels = [i for i, cap in enumerate(caps) for _ in range(cap)]
    x = len(labels)
    if x % 2:
        result = None
    else:
        results = []
        for repeat in range(2):
            matrix = [[0]*x for _ in range(x)]
            weighted = []
            for i, j in combinations(range(x), 2):
                a, b = labels[i], labels[j]
                if a == b or (min(a, b), max(a, b)) in original:
                    weighted.append((i, j, int(a != b), rng.randrange(1, MOD)))
            values = []
            for y in range(x+1):
                for i, j, w, r in weighted:
                    matrix[i][j] = r*(y if w else 1) % MOD
                    matrix[j][i] = -matrix[i][j] % MOD
                values.append(determinant(matrix))
            polynomial = interpolate(values)
            for y, value in enumerate(values):
                assert evaluate(polynomial, y) == value
            first = next((i for i, c in enumerate(polynomial) if c), None)
            if first is not None:
                assert first % 2 == 0
                results.append(first//2)
        result = min(results, default=None)
    assert result == brute, (n, caps, original, result, brute)
print('ABC412 G: 180 degree/parity instances against every original subgraph and Tutte interpolation')


def components(n, edges):
    unseen = set(range(n))
    count = 0
    while unseen:
        root = unseen.pop()
        seen, todo = {root}, [root]
        for a in todo:
            for u, v in edges:
                b = v if u == a else u if v == a else None
                if b is not None and b not in seen:
                    seen.add(b)
                    unseen.discard(b)
                    todo.append(b)
        count += 1
    return count


for n in range(2, 6):
    all_edges = list(combinations(range(n), 2))
    for graph_mask in range(1 << len(all_edges)):
        edges = [e for i, e in enumerate(all_edges) if graph_mask >> i & 1]
        if components(n, edges) != 1:
            continue
        rng.shuffle(edges)
        kept, cost = [], 0
        for i in range(len(edges)-1, -1, -1):
            if components(n, kept+[edges[i]]) == 1:
                cost += 1 << (i+1)
            else:
                kept.append(edges[i])
        assert components(n, kept) == 2
        brute = min(sum(1 << (i+1) for i in range(len(edges)) if deleted >> i & 1)
                    for deleted in range(1 << len(edges))
                    if components(n, [e for i, e in enumerate(edges) if not deleted >> i & 1]) == 2)
        assert cost == brute, edges
print('ABC447 E: every connected simple graph through N=5 with shuffled edge numbers against all deletions')
