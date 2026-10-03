"""Independent small-input checks for the fourth PR 65 correction pass.

Python 3.9+, no dependencies. Compare the described formulas with recurrence,
cycle enumeration, lattice enumeration, exhaustive facility/day partitions,
coordinate DP, and a separate finite linear-programming envelope. These are
mathematical regression checks, not a proof of the entire textbook.
"""
from collections import Counter, deque
from fractions import Fraction
from functools import cmp_to_key
from heapq import heappop, heappush
from itertools import combinations, permutations, product
from math import isqrt, prod
from random import Random

rng = Random(65_4)
MOD = 998244353


def convolution(a, b):
    out = [0]*(len(a)+len(b)-1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            out[i+j] += x*y
    return out


def field_ops(p):
    def add(a, b):
        return ((a[0]+b[0]) % p, (a[1]+b[1]) % p)
    def mul(a, b):
        return ((a[0]*b[0]+5*a[1]*b[1]) % p, (a[0]*b[1]+a[1]*b[0]) % p)
    def power(a, n):
        out = (1, 0)
        while n:
            if n & 1:
                out = mul(out, a)
            a, n = mul(a, a), n//2
        return out
    def inv(a):
        z = pow((a[0]*a[0]-5*a[1]*a[1]) % p, -1, p)
        return (a[0]*z % p, -a[1]*z % p)
    return add, mul, power, inv


def fast_fibonacci_product(p, x, y, n):
    add, mul, power, inv = field_ops(p)
    neg = lambda a: (-a[0] % p, -a[1] % p)
    half = pow(2, -1, p)
    a, b = (half, half), (half, -half % p)
    diff = add(a, neg(b))
    c1 = mul(add((y, 0), neg(mul(b, (x, 0)))), inv(mul(a, diff)))
    c2 = mul(add(mul(a, (x, 0)), (-y % p, 0)), inv(mul(b, diff)))
    d = mul(a, inv(b))
    def polynomial(k):
        if k == 0:
            return [(1, 0)]
        f = polynomial(k//2)
        shifted = [mul(v, power(d, (k//2)*j)) for j, v in enumerate(f)]
        out = [(0, 0)]*(len(f)+len(shifted)-1)
        for i, u in enumerate(f):
            for j, v in enumerate(shifted):
                out[i+j] = add(out[i+j], mul(u, v))
        if k % 2:
            factor = mul(c1, power(d, k))
            nxt = [(0, 0)]*(len(out)+1)
            for j, v in enumerate(out):
                nxt[j] = add(nxt[j], mul(v, c2))
                nxt[j+1] = add(nxt[j+1], mul(v, factor))
            out = nxt
        return out
    def finite(t):
        if not t:
            return (1, 0)
        m = isqrt(t)
        f, q = polynomial(m), power(d, m)
        u = [mul(v, power(inv(q), j*(j-1)//2)) for j, v in enumerate(f)]
        v = [power(q, j*(j-1)//2) for j in range(2*m)]
        z = [(0, 0)]*(len(u)+len(v)-1)
        for j, xj in enumerate(reversed(u)):
            for k, yk in enumerate(v):
                z[j+k] = add(z[j+k], mul(xj, yk))
        out = (1, 0)
        for i in range(m):
            value = mul(z[m+i], power(inv(q), i*(i-1)//2))
            # Independent Horner evaluation checks the chirp extraction.
            horner = (0, 0)
            for coefficient in reversed(f):
                horner = add(mul(horner, power(q, i)), coefficient)
            assert value == horner
            out = mul(out, value)
        for j in range(m*m+1, t+1):
            out = mul(out, add(mul(c1, power(d, j)), c2))
        return mul(out, power(b, t*(t+1)//2))
    quotient, remainder = divmod(n, 2*(p+1))
    return mul(power(finite(2*(p+1)), quotient) if quotient else (1, 0), finite(remainder))


cases = 0
for p in (3, 7, 13, MOD):
    inputs = product(range(p), repeat=2) if p < 20 else [(1, 1), (0, 0), (2, 3), (0, 4)]
    for x, y in inputs:
        seq = [x, y]
        for _ in range(100):
            seq.append((seq[-1]+seq[-2]) % p)
        expected = 1
        for n in range(41):
            if n:
                expected = expected*seq[n-1] % p
            assert fast_fibonacci_product(p, x, y, n) == (expected, 0), (p, x, y, n)
            cases += 1
assert fast_fibonacci_product(MOD, 1, 1, 5) == (30, 0)
print('ABC381 G: restored factors, block/chirp evaluation, cycles versus recurrence:', cases)


def shortest_root_cycle(n, edges, root, omitted=None):
    adj = [[] for _ in range(n)]
    for bit, (u, v, w) in enumerate(edges):
        if bit != omitted:
            adj[u].append((v, w, bit))
            adj[v].append((u, w, bit))
    inf = 10**20
    dist, parent, label = [inf]*n, [-1]*n, [-1]*n
    dist[root], label[root] = 0, root
    queue = [(0, root)]
    while queue:
        dv, v = heappop(queue)
        if dv != dist[v]:
            continue
        for u, w, _ in adj[v]:
            if dv+w < dist[u]:
                dist[u], parent[u] = dv+w, v
                label[u] = u if v == root else label[v]
                heappush(queue, (dist[u], u))
    best, pair = inf, None
    for bit, (u, v, w) in enumerate(edges):
        if bit == omitted or parent[u] == v or parent[v] == u or label[u] == label[v]:
            continue
        cost = dist[u]+w+dist[v]
        if cost < best:
            best, pair = cost, (u, v)
    if pair is None:
        return best, set()
    vertices = {root}
    for v in pair:
        while v != root:
            vertices.add(v)
            v = parent[v]
    # The two root-neighbours can be recovered directly, including a root-return edge.
    neighbours = {label[v] for v in pair if v != root}
    if root in pair:
        neighbours.add(pair[0] if pair[1] == root else pair[1])
    assert len(neighbours) == 2
    return best, neighbours


def simple_cycles(n, edges, root):
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
    found = []
    def visit(path, cost):
        for v, w in adj[path[-1]]:
            if v == root and len(path) >= 3:
                found.append((cost+w, set(path), {path[1], path[-1]}))
            elif v not in path:
                visit(path+[v], cost+w)
    visit([root], 0)
    return found


cases = 0
for n in range(3, 7):
    for _ in range(90):
        edges = [(u, v, rng.randrange(1, 8)) for u in range(n) for v in range(u+1, n)
                 if rng.randrange(3)]
        for root in range(n):
            cycles = simple_cycles(n, edges, root)
            assert shortest_root_cycle(n, edges, root)[0] == min(
                [c for c, _, _ in cycles]+[10**20])
            expected = min([cost+w for cost, vertices, _ in cycles
                            for u, v, w in edges if root in (u, v)
                            and (v if u == root else u) not in vertices]+[10**20])
            base, competing = shortest_root_cycle(n, edges, root)
            actual = 10**20
            for bit, (u, v, w) in enumerate(edges):
                if root not in (u, v):
                    continue
                d = v if u == root else u
                c = shortest_root_cycle(n, edges, root, bit)[0] if d in competing else base
                actual = min(actual, c+w)
            assert min(actual, 10**20) == expected, (edges, root)
            cases += 1
assert shortest_root_cycle(4, [(0, 1, 1), (1, 2, 1), (0, 2, 100), (0, 3, 1)], 0)[0] == 102
print('ABC308 Ex: root/non-tree oracle and full Q cost versus simple-cycle enumeration:', cases)


def gaussian_mul(a, b, c):
    return ((a[0]*b[0]-a[1]*b[1]) % c, (a[0]*b[1]+a[1]*b[0]) % c)


def gaussian_power(a, n, c):
    out = (1 % c, 0)
    while n:
        if n & 1:
            out = gaussian_mul(out, a, c)
        a, n = gaussian_mul(a, a, c), n//2
    return out


def factor_distribution(pi, p, e, c):
    seen, powers, v = {}, [], (1 % c, 0)
    while v not in seen:
        seen[v] = len(powers)
        powers.append(v)
        v = gaussian_mul(v, pi, c)
    mu, period = seen[v], len(powers)-seen[v]
    def pi_power(k):
        return powers[k if k < len(powers) else mu+(k-mu) % period]
    def term(k):
        t = pi_power(e-2*k)
        scalar = pow(p, k, c)
        return (scalar*t[0] % c, scalar*t[1] % c)
    last = e//2
    lo, hi = mu, min(last, (e-mu)//2)
    half = Counter()
    if lo <= hi:
        for k in range(lo, min(hi+1, lo+period)):
            half[term(k)] += 1+(hi-k)//period
        direct = list(range(min(lo, last+1)))+list(range(hi+1, last+1))
    else:
        direct = range(last+1)
        assert last+1 <= 2*mu+1
    for k in direct:
        half[term(k)] += 1
    full = half.copy()
    for (a, b), count in half.items():
        full[a, -b % c] += count
    if e % 2 == 0:
        full[pow(p, e//2, c), 0] -= 1
    return +full


cases = 0
for p, pi in [(5, (1, 2)), (13, (2, 3)), (17, (1, 4)), (29, (2, 5))]:
    for c in range(1, 13):
        for e in range(41):
            expected = Counter(gaussian_mul(gaussian_power(pi, e-k, c),
                                           gaussian_power((pi[0], -pi[1]), k, c), c)
                               for k in range(e+1))
            assert factor_distribution(pi, p, e, c) == expected, (p, c, e)
            cases += 1
        large = factor_distribution(pi, p, 10**18, c)
        assert sum(large.values()) == 10**18+1
for factors in [[(5, (1, 2), 2)], [(5, (1, 2), 1), (13, (2, 3), 1)]]:
    norm = 1
    for p, _, e in factors:
        norm *= p**e
    for c in range(1, 8):
        distribution = Counter({(1 % c, 0): 1})
        for p, pi, e in factors:
            nxt = Counter()
            for a, x in distribution.items():
                for b, y in factor_distribution(pi, p, e, c).items():
                    nxt[gaussian_mul(a, b, c)] += x*y
            distribution = nxt
        actual = Counter()
        for a, count in distribution.items():
            for unit in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
                actual[gaussian_mul(a, unit, c)] += count
        radius = isqrt(norm)
        expected = Counter((u % c, v % c) for u in range(-radius, radius+1)
                           for v in range(-radius, radius+1) if u*u+v*v == norm)
        assert actual == expected
print('ABC444 G: nonunit preperiod/both ends and conjugate counts versus all exponents:', cases)


def facility_costs(weights):
    n = len(weights)
    def c(i, j):
        if i == 0 and j == n+1:
            return 10**30
        if i == 0:
            return sum(weights[y-1]*(j-y) for y in range(1, j))
        if j == n+1:
            return sum(weights[y-1]*(y-i) for y in range(i, n+1))
        return sum(weights[y-1]*min(y-i, j-y) for y in range(i, j))
    return c


def causal_monge_dp(weights, penalty):
    n, c = len(weights), facility_costs(weights)
    dp = [(10**30, 0)]*(n+2)
    dp[0] = (0, 0)
    def solve(l, r):
        if r-l == 1:
            return
        m = (l+r)//2
        solve(l, m)
        def rectangle(jl, jr, il, ir):
            if jl >= jr:
                return
            j = (jl+jr)//2
            def value(i):
                return (dp[i][0]+c(i, j)+penalty, dp[i][1]+1)
            arg = min(range(il, ir), key=value)
            dp[j] = min(dp[j], value(arg))
            rectangle(jl, j, il, arg+1)
            rectangle(j+1, jr, arg, ir)
        rectangle(m, r, l, m)
        solve(m, r)
    solve(0, n+2)
    naive = [(0, 0)]
    for j in range(1, n+2):
        naive.append(min((naive[i][0]+c(i, j)+penalty, naive[i][1]+1) for i in range(j)))
    assert dp == naive
    return dp[-1]


cases = 0
for n in range(1, 8):
    for _ in range(18):
        weights = [rng.randrange(4) for _ in range(n)]
        c = facility_costs(weights)
        for penalty in range(12):
            causal_monge_dp(weights, penalty)
        for k in range(1, n+1):
            expected = min(sum(weights[y-1]*min(abs(y-z) for z in xs)
                               for y in range(1, n+1)) for xs in combinations(range(1, n+1), k))
            left, right = 0, 3*n*sum(weights)
            while left < right:
                mid = (left+right)//2
                if causal_monge_dp(weights, mid)[1] <= k+1:
                    right = mid
                else:
                    left = mid+1
            candidates = [left]+([left-1] if left else [])
            assert max(causal_monge_dp(weights, p)[0]-p*(k+1) for p in candidates) == expected
            for xs in combinations(range(1, n+1), k):
                vertices = [0]+list(xs)+[n+1]
                assert sum(c(i, j) for i, j in zip(vertices, vertices[1:])) == sum(
                    weights[y-1]*min(abs(y-z) for z in xs) for y in range(1, n+1))
            cases += 1
print('ABC355 G: causal rectangle DP, end costs, penalty/ties versus all facilities:', cases)


def grid_metrics(a, b, edges):
    return sum(abs(b[u]-b[v]) for u, v in edges), sum(abs(x-y) for x, y in zip(a, b))


def circulation_oracle(a, edges, penalty):
    """Small residual-flow solver, using Bellman-Ford instead of production Dijkstra."""
    numerator, denominator = penalty.numerator, penalty.denominator
    n, s = len(a), len(a)
    ss, tt = n+1, n+2
    adj = [[] for _ in range(n+3)]
    original = []
    def insert(u, v, cap, cost, flow=0, record=False):
        edge = [v, len(adj[v]), cap-flow, cost]
        reverse = [u, len(adj[u]), flow, -cost]
        adj[u].append(edge)
        adj[v].append(reverse)
        if record:
            original.append((u, edge))
    for u, v in edges:
        insert(u, v, denominator, 0, record=True)
        insert(v, u, denominator, 0, record=True)
    cost = -numerator*sum(a)
    for v, av in enumerate(a):
        insert(s, v, numerator, av, record=True)
        insert(v, s, numerator, -av, numerator, record=True)
        insert(v, tt, numerator, 0)
    insert(ss, s, numerator*n, 0)
    remaining = numerator*n
    while remaining:
        dist, parent = [10**30]*(n+3), [None]*(n+3)
        dist[ss] = 0
        for _ in range(n+2):
            changed = False
            for u in range(n+3):
                for j, e in enumerate(adj[u]):
                    v, _, cap, w = e
                    if cap and dist[u]+w < dist[v]:
                        dist[v], parent[v] = dist[u]+w, (u, j)
                        changed = True
            if not changed:
                break
        assert parent[tt] is not None
        amount, v = remaining, tt
        while v != ss:
            u, j = parent[v]
            amount = min(amount, adj[u][j][2])
            v = u
        v = tt
        while v != ss:
            u, j = parent[v]
            e = adj[u][j]
            e[2] -= amount
            adj[v][e[1]][2] += amount
            v = u
        remaining -= amount
        cost += amount*dist[tt]
    residual = []
    for u, e in original:
        v, reverse, cap, w = e
        if cap:
            residual.append((u, v, w))
        if adj[v][reverse][2]:
            residual.append((v, u, -w))
    potential = [0]*(n+1)
    for _ in range(n+1):
        changed = False
        for u, v, w in residual:
            if potential[v] > potential[u]+w:
                potential[v] = potential[u]+w
                changed = True
        if not changed:
            break
    assert all(potential[v] <= potential[u]+w for u, v, w in residual)
    b = [min(max(potential[v]-potential[s], 0), max(a)) for v in range(n)]
    phi, length = grid_metrics(a, b, edges)
    assert Fraction(phi)+penalty*length == Fraction(-cost, denominator)
    return b, phi, length


def rational_budget_solution(a, edges, budget, accelerated=True):
    median = sorted(a)[len(a)//2]
    baseline = [median]*len(a)
    if grid_metrics(a, baseline, edges)[1] <= budget:
        return baseline
    d = len(a)*max(a)
    lo, hi = (0, 1), (1, 0)
    left, right = baseline, a[:]
    while True:
        numerator, denominator = lo[0]+hi[0], lo[1]+hi[1]
        if denominator > d or numerator > 4*d:
            break
        b, _, length = circulation_oracle(a, edges, Fraction(numerator, denominator))
        if length == budget:
            return b
        lower_side = length > budget
        if not accelerated:
            if lower_side:
                lo, left = (numerator, denominator), b
            else:
                hi, right = (numerator, denominator), b
            continue
        base, increment = (lo, hi) if lower_side else (hi, lo)
        bounds = []
        if increment[0]:
            bounds.append((4*d-base[0])//increment[0])
        if increment[1]:
            bounds.append((d-base[1])//increment[1])
        maximum = min(bounds)
        low, high, chosen = 1, 2, b
        def evaluate(t):
            candidate = (base[0]+t*increment[0], base[1]+t*increment[1])
            point, _, amount = circulation_oracle(a, edges, Fraction(*candidate))
            return candidate, point, amount
        while high <= maximum:
            candidate, point, amount = evaluate(high)
            if amount == budget:
                return point
            if (amount > budget) != lower_side:
                break
            low, chosen, high = high, point, high*2
        high = min(high, maximum+1)
        while low+1 < high:
            mid = (low+high)//2
            candidate, point, amount = evaluate(mid)
            if amount == budget:
                return point
            if (amount > budget) == lower_side:
                low, chosen = mid, point
            else:
                high = mid
        endpoint = (base[0]+low*increment[0], base[1]+low*increment[1])
        if lower_side:
            lo, left = endpoint, chosen
        else:
            hi, right = endpoint, chosen
    ll, lr = grid_metrics(a, left, edges)[1], grid_metrics(a, right, edges)[1]
    alpha = (budget-lr)/(ll-lr)
    return [alpha*x+(1-alpha)*y for x, y in zip(left, right)]


cases = 0
edges = [(0, 1), (0, 2), (1, 3), (2, 3)]
for a in product(range(3), repeat=4):
    configs = [grid_metrics(a, b, edges) for b in product(range(max(a)+1), repeat=4)]
    for penalty in (Fraction(1, 3), Fraction(1), Fraction(5, 3), Fraction(4)):
        _, phi, length = circulation_oracle(a, edges, penalty)
        assert phi+penalty*length == min(p+penalty*l for p, l in configs)
    for budget in [Fraction(j, 2) for j in range(2*sum(abs(x-sorted(a)[2]) for x in a)+1)]:
        # Independent LP envelope: mix every pair of integral configurations.
        expected = min([Fraction(p) for p, l in configs if l <= budget]+[
            (budget-l2)/(l1-l2)*p1+(l1-budget)/(l1-l2)*p2
            for p1, l1 in configs for p2, l2 in configs if l2 < budget < l1])
        b = rational_budget_solution(a, edges, budget)
        phi, length = grid_metrics(a, b, edges)
        assert length <= budget and phi == expected, (a, budget, b, expected)
        plain = rational_budget_solution(a, edges, budget, accelerated=False)
        assert grid_metrics(a, plain, edges)[0] == phi
        cases += 1
assert grid_metrics([0, 2, 0, 2], rational_budget_solution([0, 2, 0, 2], edges, Fraction(1)), edges)[0] == 3
print('ABC393 G: scaled circulation, residual potentials, rational budget interpolation versus LP envelope:', cases)


def floor_moments(n, m, a, b):
    if not n:
        return (0, 0, 0)
    q, a0 = divmod(a, m)
    r, b0 = divmod(b, m)
    s1, s2 = n*(n-1)//2, n*(n-1)*(2*n-1)//6
    y = (a0*(n-1)+b0)//m
    if not a0 or not y:
        g0 = g1 = g2 = 0
    else:
        u0, u1, u2 = floor_moments(y, a0, m, m+a0-1-b0)
        g0, g1, g2 = n*y-u0, y*s1-(u2-u0)//2, n*y*y-2*u1-u0
    return (q*s1+r*n+g0, q*s2+r*s1+g1,
            q*q*s2+2*q*r*s1+r*r*n+2*q*g1+2*r*g0+g2)


cases = 0
for n, m, a, b in product(range(10), range(1, 8), range(-3, 10), range(-3, 10)):
    f = [(a*k+b)//m for k in range(n)]
    assert floor_moments(n, m, a, b) == (sum(f), sum(k*v for k, v in enumerate(f)), sum(v*v for v in f))
    cases += 1
for _ in range(400):
    n, m, a = rng.randrange(1, 30), rng.randrange(1, 20), rng.randrange(30)
    b1, b2 = sorted([rng.randrange(m), rng.randrange(m)])
    t01, t11, t21 = floor_moments(n, m, a, b1)
    t02, t12, t22 = floor_moments(n, m, a, b2)
    s1, s2 = n*(n-1)//2, n*(n-1)*(2*n-1)//6
    numerator = t21+t22-t02+t01
    assert numerator % 2 == 0
    answer = a*a*s2+a*(b1+b2)*s1+b1*b2*n-m*(a*(t11+t12)+b1*t02+b2*t01)+m*m*(numerator//2)
    assert answer == sum(((a*k+b1) % m)*((a*k+b2) % m) for k in range(n))
print('ABC402 G: closed Euclidean moments versus direct signed floors:', cases)


def count_bit_bands(a, upper):
    w = sum(a)
    distribution = [0]*(w+1)
    distribution[0] = 1
    for ai in a:
        for s in range(w, ai-1, -1):
            distribution[s] += distribution[s-ai]
    lo, hi, coefficients = upper, upper, [1]
    while hi:
        z = convolution(coefficients, list(reversed(distribution)))
        nlo, nhi = max(0, (lo-w)//2), hi//2
        def read(k):
            return z[k] if 0 <= k < len(z) else 0
        coefficients = [read(2*q+w-lo)+read(2*q+1+w-lo) for q in range(nlo, nhi+1)]
        lo, hi = nlo, nhi
        assert len(coefficients) <= w+2
    return coefficients[0]


cases = 0
for n in range(1, 5):
    for _ in range(50):
        a, upper = [rng.randrange(1, 6) for _ in range(n)], rng.randrange(25)
        dp = [0]*(upper+1)
        dp[0] = 1
        for ai in a:
            for k in range(ai, upper+1):
                dp[k] += dp[k-ai]
        assert count_bit_bands(a, upper) == sum(dp)
        cases += 1
assert count_bit_bands([2], 10**18) == 5*10**17+1
print('ABC436 G: shifted narrow coefficient bands versus unbounded knapsack:', cases)


def slope_minimum(events):
    n = len(events)
    left, right = [0]*(n+1), [0]*(n+1)
    ol = oright = value = previous = 0
    for t, direction, a in events:
        ol -= t-previous
        oright += t-previous
        if direction == 0:
            value += max(0, a-(right[0]+oright))
            heappush(right, a-oright)
            popped = heappop(right)+oright
            heappush(left, -(popped-ol))
        else:
            value += max(0, -left[0]+ol-a)
            heappush(left, -(a-ol))
            popped = -heappop(left)+ol
            heappush(right, popped-oright)
        previous = t
    return value


cases = 0
for n in range(1, 7):
    for _ in range(80):
        times = sorted(rng.randrange(1, 7) for _ in range(n))
        events = [(t, rng.randrange(2), rng.randrange(-7, 8)) for t in times]
        states, previous = {0: 0}, 0
        for t, direction, a in events:
            nxt = {}
            for x in range(-t, t+1):
                cost = min(v for y, v in states.items() if abs(x-y) <= t-previous)
                nxt[x] = cost+max(0, a-x) if direction == 0 else cost+max(0, x-a)
            states, previous = nxt, t
        assert slope_minimum(events) == min(states.values()), events
        cases += 1
assert slope_minimum([(1, 0, 3)]) == 2
print('ABC217 H: hard origin via finite anchors versus reachable-coordinate DP:', cases)


def palindrome_formula(b, modulus):
    c = [b[0]]+[y-x for x, y in zip(b, b[1:])]+[-b[-1]] if b else [0]
    c = [x % modulus for x in c]
    k = len(c)-sum(c)//modulus
    return sum(sorted(c)[:k])


cases = 0
for m in range(1, 6):
    for length in range(1, 4):
        dist, queue = {(0,)*length: 0}, deque([(0,)*length])
        while queue:
            b = queue.popleft()
            for l in range(length):
                for r in range(l+1, length+1):
                    for sign in (-1, 1):
                        nxt = tuple((x+sign) % m if l <= j < r else x for j, x in enumerate(b))
                        if nxt not in dist:
                            dist[nxt] = dist[b]+1
                            queue.append(nxt)
        for b, expected in dist.items():
            assert palindrome_formula(b, m) == expected, (b, m)
            cases += 1
print('ABC454 F: decrease-side selection versus all interval operations modulo M:', cases)


def day_cost(items):
    ordered = sorted(items, key=cmp_to_key(lambda x, y: (x[1]*(y[0]-1) > y[1]*(x[0]-1))
                                           -(x[1]*(y[0]-1) < y[1]*(x[0]-1))))
    f = 0
    for a, b in ordered:
        f = a*f+b
    return f


def shojin(items, budget):
    fixed = sum(b for a, b in items if a == 1)
    remaining = [(a, b) for a, b in items if a > 1]
    if not remaining:
        return 1, fixed
    x, n = budget-fixed, len(remaining)
    costs = {(l, r): day_cost(remaining[l:r]) for r in range(1, n+1)
             for l in range(max(0, r-x.bit_length()), r)}
    def oracle(p):
        dp = [(0, 0)]
        for r in range(1, n+1):
            dp.append(min((dp[l][0]+cost+p, dp[l][1]+1) for (l, j), cost in costs.items()
                          if j == r and cost <= x))
        return dp[-1]
    # Enumerate all small penalties to independently check the stated dual and
    # the exact integer ternary search, including flat maxima and ties.
    ratios = {p: Fraction(oracle(p)[0]-x, p) for p in range(1, x+1)}
    lo, hi = 1, x
    while hi-lo > 5:
        first, second = (2*lo+hi)//3, (lo+2*hi)//3
        if ratios[first] < ratios[second]:
            lo = first+1
        else:
            hi = second-1
    maximum = max(ratios[p] for p in range(lo, hi+1))
    assert maximum == max(ratios.values())
    days = max(1, -(-maximum.numerator//maximum.denominator))
    lo, hi = 0, x
    while lo < hi:
        mid = (lo+hi)//2
        if oracle(mid)[1] <= days:
            hi = mid
        else:
            lo = mid+1
    return days, oracle(lo)[0]-lo*days+fixed


cases = 0
for n in range(1, 7):
    for _ in range(90):
        items = [(rng.randrange(1, 5), rng.randrange(1, 5)) for _ in range(n)]
        budget = sum(b for _, b in items)+rng.randrange(20)
        by_count = {}
        for mask in range(1 << (n-1)):
            bounds = [0]+[j+1 for j in range(n-1) if mask >> j & 1]+[n]
            cost = sum(day_cost(items[l:r]) for l, r in zip(bounds, bounds[1:]))
            days = len(bounds)-1
            by_count[days] = min(by_count.get(days, 10**20), cost)
        expected = next((k, by_count[k]) for k in sorted(by_count) if by_count[k] <= budget)
        assert shojin(items, budget) == expected, (items, budget, expected)
        if n <= 4:
            assert day_cost(items) == min(
                sum(b*prod(pair[0] for pair in order[j+1:])
                    for j, (_, b) in enumerate(order)) for order in permutations(items))
        cases += 1
print('ABC305 Ex: bounded edges, fixed A=1, both outputs and ties versus every partition:', cases)


# Verify the reduction also against the original, one-directional operation.
cases = 0
for n in range(1, 6):
    for m in range(1, 4):
        roots = [a for a in product(range(m), repeat=n) if a == a[::-1]]
        dist, queue = {a: 0 for a in roots}, deque(roots)
        while queue:
            a = queue.popleft()
            for l in range(n):
                for r in range(l+1, n+1):
                    predecessor = tuple((x-1) % m if l <= j < r else x for j, x in enumerate(a))
                    if predecessor not in dist:
                        dist[predecessor] = dist[a]+1
                        queue.append(predecessor)
        for a, expected in dist.items():
            b = [(a[j]-a[n-1-j]) % m for j in range(n//2)]
            assert palindrome_formula(b, m) == expected
            cases += 1
print('ABC454 F: central-crossing normalization versus original interval +1 and all palindromes:', cases)


def height_hull(items, fixed_fee):
    items = sorted(items)
    hull = deque([(0, 0)])
    count = value = initial = 0
    for height, number in items:
        def at(line):
            return line[0]*height+line[1]
        while len(hull) >= 2 and at(hull[0]) >= at(hull[1]):
            hull.popleft()
        count += number
        initial += height*number
        value = count*height+fixed_fee+at(hull[0])
        new = (-count, value)
        while len(hull) >= 2:
            m1, b1 = hull[-2]
            m2, b2 = hull[-1]
            m3, b3 = new
            if (b2-b1)*(m2-m3) < (b3-b2)*(m1-m2):
                break
            hull.pop()
        hull.append(new)
    return value-initial


cases = 0
for n in range(1, 6):
    for _ in range(45):
        items = [(rng.randrange(1, 7), rng.randrange(1, 4)) for _ in range(n)]
        fee = rng.randrange(1, 10)
        heights = sorted({h for h, _ in items})
        expected = min(sum((z-h)*c for z, (h, c) in zip(targets, items))+fee*len(set(targets))
                       for targets in product(*(list(z for z in heights if z >= h) for h, _ in items)))
        assert height_hull(items, fee) == expected
        cases += 1
print('ABC228 H: addition-cost hull DP versus all admissible final heights:', cases)


cases = 0
for n in range(1, 10):
    for _ in range(45):
        edges = [(u, v) for u in range(n) for v in range(u+1, n) if rng.randrange(4) == 0]
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        threshold = max(1, isqrt(len(edges))+(isqrt(len(edges))**2 < len(edges)))
        heavy = {v for v in range(n) if len(adj[v]) >= threshold}
        neighbours = [[v for v in adj[u] if v in heavy] for u in range(n)]
        explicit = [(-1, v+1) for v in range(n)]
        signs = [(-2, 0)]*n
        direct = list(range(1, n+1))
        def resolve(v):
            explicit[v] = max([explicit[v]]+[signs[u] for u in neighbours[v]])
            return explicit[v][1]
        for t in range(30):
            v = rng.randrange(n)
            value = resolve(v)
            assert value == direct[v]
            if v in heavy:
                signs[v] = (t, value)
            else:
                for u in adj[v]:
                    explicit[u] = (t, value)
            for u in adj[v]:
                direct[u] = value
        assert [resolve(v) for v in range(n)] == direct
        assert sum(len(row) for row in neighbours) <= 2*len(edges)
        cases += 1
print('ABC219 G: sparse/isolated heavy-light timestamps and final resolution versus direct updates:', cases)
