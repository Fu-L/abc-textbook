"""Finite independent models for PR65 review 5404336223.

Python 3.9+, standard library only. General proofs are in the repaired prose.
The corpus-wide document checks do not establish mathematical correctness.
"""

from collections import Counter, defaultdict, deque
from bisect import bisect_left
from fractions import Fraction
from heapq import heappop, heappush
from itertools import combinations, combinations_with_replacement, permutations, product
from pathlib import Path
import json

MOD = 998244353
COUNTS = Counter()


def checked(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    COUNTS[name] += 1


def runs(values):
    result = []
    for value in values:
        if result and result[-1][0] == value:
            result[-1] = (value, result[-1][1] + 1)
        else:
            result.append((value, 1))
    return result


def valid_221(values):
    return bool(values) and all(value == length for value, length in runs(values))


def subsequence_dp(a, zero_position=-1):
    positions = defaultdict(list)
    for p, value in enumerate(a, 1):
        positions[value].append(p)
    dp, prefix = [1], [1]
    count = Counter()
    for value in a:
        count[value] += 1
        k = count[value] - value
        result = 0
        if k >= 0:
            left = zero_position if k == 0 else positions[value][k-1]
            right = positions[value][k]
            low = max(0, left+1)
            result = prefix[right-1] - (prefix[low-1] if low else 0)
        dp.append(result)
        prefix.append(prefix[-1] + result)
    return sum(dp[1:]), dp[1:]


def check_446():
    for n in range(1, 8):
        for a in product(range(1, min(n, 3)+1), repeat=n):
            # Enumerate the original position subsets, deduplicating by value.
            expected = {tuple(a[i] for i in range(n) if mask >> i & 1)
                        for mask in range(1, 1 << n)}
            expected = sum(valid_221(s) for s in expected)
            checked('446 original subsequences', subsequence_dp(a)[0], expected)
    checked('446 minimum', subsequence_dp((1,))[0], 1)
    checked('446 old sentinel exposes regression', subsequence_dp((1,), 0)[0], 0)
    a = (2, 1, 2, 1, 1, 2, 7, 2)
    checked('446 sample one trace', subsequence_dp(a), (5, [0, 1, 1, 1, 0, 1, 0, 1]))
    checked('446 sample two', subsequence_dp((2, 3, 4, 5, 4))[0], 0)
    checked('446 sample three', subsequence_dp((2, 2, 3, 1, 1, 4, 1, 4, 1, 4,
                                             2, 4, 1, 2, 1, 4, 4, 1, 1, 4))[0], 15)
    checked('446 repeated one', subsequence_dp((1,)*10)[0], 1)


ORDERS = list(permutations(range(4)))


def potentials(a):
    c = Counter(zip(a, sorted(a)))
    return [sum(c[p[i], p[j]] for i in range(4) for j in range(i+1, 4))
            for p in ORDERS]


def sort_construct(a):
    target = sorted(a)
    state = list(a)
    buckets = defaultdict(list)
    for i, (x, y) in enumerate(zip(a, target)):
        if x != y:
            buckets[x, y].append(i)
    trace = []

    def swap(i, j):
        state[i], state[j] = state[j], state[i]
        trace.append((i, j))

    for x, y in combinations(range(4), 2):
        while buckets[x, y] and buckets[y, x]:
            swap(buckets[x, y].pop(), buckets[y, x].pop())
    if not any(buckets.values()):
        return state, trace
    # Find a labelling of the six-edge shape, allowing zero-weight edges.
    for p in ORDERS:
        x, y, z, w = p
        allowed = {(x, z), (y, z), (y, w), (x, y), (z, w), (w, x)}
        if all(not indices or edge in allowed for edge, indices in buckets.items()):
            break
    else:
        raise AssertionError(('302 shape missing', a))
    a_weight, b_weight, c_weight = (len(buckets[x, z]), len(buckets[y, z]),
                                  len(buckets[y, w]))
    checked('302 balanced edge equations',
            (len(buckets[x, y]), len(buckets[z, w]), len(buckets[w, x])),
            (b_weight+c_weight, a_weight+b_weight, a_weight+b_weight+c_weight))
    for cycle, amount in (((x, z, w), a_weight), ((y, z, w, x), b_weight),
                          ((y, w, x), c_weight)):
        for _ in range(amount):
            indices = [buckets[cycle[i], cycle[(i+1) % len(cycle)]].pop()
                       for i in range(len(cycle))]
            for i in range(len(indices)-1):
                swap(indices[i], indices[i+1])
    assert not any(buckets.values())
    return state, trace


def swap_distances(goal):
    distances = {goal: 0}
    queue = deque([goal])
    while queue:
        state = queue.popleft()
        for i, j in combinations(range(len(goal)), 2):
            if state[i] == state[j]:
                continue
            nxt = list(state)
            nxt[i], nxt[j] = nxt[j], nxt[i]
            nxt = tuple(nxt)
            if nxt not in distances:
                distances[nxt] = distances[state]+1
                queue.append(nxt)
    return distances


def check_302():
    # Each multiset has its own reverse BFS from the actual sorted array.
    for n in range(2, 8):
        for goal in combinations_with_replacement(range(4), n):
            for a, distance in swap_distances(goal).items():
                checked('302 original arbitrary swap BFS', max(potentials(a)), distance)
                result, trace = sort_construct(a)
                checked('302 constructed sorted array', result, list(goal))
                checked('302 construction meets lower bound', len(trace), distance)
    # Check the claimed per-swap change for all orders and all four ranks.
    for w, x, y, z in product(range(4), repeat=4):
        decrement = int(w < x)+int(y < z)-int(y < x)-int(w < z)
        checked('302 one swap lower bound', decrement <= 1, True)


def replacement_distances(start, alphabet):
    distances = {start: 0}
    queue = deque([start])
    while queue:
        s = queue.popleft()
        for x in set(s):
            for y in range(alphabet):
                if x == y:
                    continue
                t = tuple(y if value == x else value for value in s)
                if t not in distances:
                    distances[t] = distances[s]+1
                    queue.append(t)
    return distances


def replacement_components(mapping, alphabet):
    neighbors = [set() for _ in range(alphabet)]
    for x, y in mapping.items():
        neighbors[x].add(y)
        neighbors[y].add(x)
    components, seen = [], set()
    for x in range(alphabet):
        if x in seen:
            continue
        component, todo = set(), [x]
        while todo:
            v = todo.pop()
            if v in component:
                continue
            component.add(v)
            todo.extend(neighbors[v]-component)
        seen.update(component)
        components.append(component)
    return components


def replace_construct(start, target, alphabet):
    mapping = dict(zip(start, target))
    if len(mapping) == alphabet and len(set(target)) == alphabet and start != target:
        return None
    current, trace = start, []

    def move(x, y):
        nonlocal current
        assert x != y and x in current
        current = tuple(y if value == x else value for value in current)
        trace.append((x, y))
        # Original tokens that have coalesced must share their final target.
        for value in set(current):
            assert len({target[i] for i, v in enumerate(current) if v == value}) == 1

    pure = []
    for component in replacement_components(mapping, alphabet):
        path = []
        v = next(iter(component))
        while v in mapping and v not in path:
            path.append(v)
            v = mapping[v]
        cycle = path[path.index(v):] if v in path else []
        processed = set(cycle)
        if len(cycle) >= 2:
            if len(cycle) == len(component):
                pure.append(cycle)
                continue
            u = next(x for x in component-set(cycle)
                     if mapping.get(x) in cycle)
            v0 = mapping[u]
            k = cycle.index(v0)
            cycle = cycle[k:]+cycle[:k]
            move(cycle[-1], u)
            for k in range(len(cycle)-2, -1, -1):
                move(cycle[k], cycle[k+1])
            move(u, cycle[0])
            processed.add(u)
        root = set(cycle) if cycle else {v}
        remaining = component-processed

        def depth(x):
            d = 0
            while x not in root:
                x = mapping[x]
                d += 1
            return d

        for x in sorted(remaining, key=depth):
            if x in mapping and mapping[x] != x:
                move(x, mapping[x])
    for cycle in pure:
        spare = next(x for x in range(alphabet) if x not in current)
        move(cycle[-1], spare)
        for k in range(len(cycle)-2, -1, -1):
            move(cycle[k], cycle[k+1])
        move(spare, cycle[0])
    checked('399 constructed final word', current, target)
    return len(trace)


def check_399():
    for alphabet in range(2, 5):
        for size in range(1, alphabet+1):
            for start in combinations(range(alphabet), size):
                distances = replacement_distances(start, alphabet)
                for target in product(range(alphabet), repeat=size):
                    checked('399 original global replace BFS',
                            replace_construct(start, target, alphabet), distances.get(target))
    checked('399 incoming cycle example', replace_construct((0, 1, 2), (1, 0, 0), 3), 3)


def adjacent_distances(items):
    states = set(permutations(items))
    # All color orders at equal values are accepted by the original goal.
    goals = [s for s in states if all(s[i][0] <= s[i+1][0] for i in range(len(s)-1))]
    distances = dict.fromkeys(goals, 0)
    queue = deque(goals)
    while queue:
        s = queue.popleft()
        for i in range(len(s)-1):
            t = list(s)
            cost = int(t[i][1] != t[i+1][1])
            t[i], t[i+1] = t[i+1], t[i]
            t = tuple(t)
            value = distances[s]+cost
            if value < distances.get(t, 10**6):
                distances[t] = value
                if cost:
                    queue.append(t)
                else:
                    queue.appendleft(t)
    assert len(distances) == len(states)
    return distances


def check_261():
    types = list(product(range(1, 4), range(2)))
    for n in range(1, 6):
        for items in combinations_with_replacement(types, n):
            for s, distance in adjacent_distances(items).items():
                inversions = sum(s[i][0] > s[j][0] and s[i][1] != s[j][1]
                                 for i, j in combinations(range(n), 2))
                checked('261 original weighted adjacent swaps', inversions, distance)


def even_cost(a, b, x, y):
    u, v = sorted((abs(x), abs(y)))
    a, b = sorted((a, b))
    assert (u+v) % 2 == 0
    return min(a*(u+v)+(b-a)*(v-u)//2, 2*a*v)


def alternating_cost(a, b, x, y):
    x, y = abs(x), abs(y)
    if (x+y) % 2 == 0:
        return even_cost(a, b, x, y)
    return min(even_cost(a, b, x-1, y)+a, even_cost(a, b, x, y-1)+b)


def walking_distances(a, b, radius):
    dist = {(0, 0, 0): 0}
    heap = [(0, 0, 0, 0)]
    while heap:
        value, x, y, phase = heappop(heap)
        if value != dist[x, y, phase]:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x+dx, y+dy
            if abs(nx) > radius or abs(ny) > radius:
                continue
            cost = a if bool(dx) == (phase == 0) else b
            nxt = nx, ny, phase ^ 1
            total = value+cost
            if total < dist.get(nxt, 10**9):
                dist[nxt] = total
                heappush(heap, (total, *nxt))
    return dist


def check_462():
    for a, b in product(range(1, 7), repeat=2):
        dist = walking_distances(a, b, 12)
        for x, y in product(range(-6, 7), repeat=2):
            checked('462 original phase and direction Dijkstra', alternating_cost(a, b, x, y),
                    dist[x, y, (x+y) % 2])
    checked('462 negative predecessor is necessary', alternating_cost(100, 1, 1, 0), 3)
    # For exactly two moves to the origin, two cheap moves need not be possible.
    exact = {(0, 0): 0}
    for phase in range(2):
        nxt = {}
        for (x, y), value in exact.items():
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                cost = 1 if bool(dx) == (phase == 0) else 10
                key = x+dx, y+dy
                nxt[key] = min(nxt.get(key, 10**6), value+cost)
        exact = nxt
    checked('462 even larger K parity counterexample', exact[0, 0], 11)


def substring_transform(a):
    t = []
    for value, length in runs(a):
        t.extend([0] if length < value else [value] if length == value else [value, 0, value])
    return t


def suffix_count(t):
    sa = sorted(range(len(t)), key=lambda p: t[p:])
    total = 0
    for k, p in enumerate(sa):
        shared = 0
        if k:
            q = sa[k-1]
            while p+shared < len(t) and q+shared < len(t) and t[p+shared] == t[q+shared]:
                shared += 1
        valid = 0
        while p+valid < len(t) and t[p+valid] != 0:
            valid += 1
        total += max(0, valid-shared)
    return total


def check_452():
    for n in range(1, 9):
        for a in product(range(1, 4), repeat=n):
            expected = {a[l:r] for l in range(n) for r in range(l+1, n+1)
                        if valid_221(a[l:r])}
            t = substring_transform(a)
            represented = {tuple(value for v in t[l:r] for value in [v]*v)
                           for l in range(len(t)) for r in range(l+1, len(t)+1)
                           if 0 not in t[l:r]}
            checked('452 types preserved by both directions', represented, expected)
            checked('452 original continuous substrings', suffix_count(t), len(expected))
    checked('452 positions are not types', suffix_count([1, 0, 1]), 1)


def inversion_count(s):
    return sum(s[i] > s[j] for i, j in combinations(range(len(s)), 2))


def check_380():
    for n in range(1, 6):
        for a in permutations(range(n)):
            total = inversion_count(a)
            for k in range(1, n+1):
                summed = 0
                trials = 0
                for l in range(n-k+1):
                    for window in permutations(a[l:l+k]):
                        summed += inversion_count(a[:l]+window+a[l+k:])
                        trials += 1
                expected = Fraction(summed, trials)
                window_sum = sum(inversion_count(a[l:l+k]) for l in range(n-k+1))
                formula = total-Fraction(window_sum, n-k+1)+Fraction(k*(k-1), 4)
                checked('380 original window and permutation mean', formula, expected)
                modular = (total-window_sum*pow(n-k+1, -1, MOD)+k*(k-1)*pow(4, -1, MOD)) % MOD
                checked('380 inverse four and window normalization', modular,
                        expected.numerator*pow(expected.denominator, -1, MOD) % MOD)


def check_435():
    for n in range(1, 7):
        queries = [(l, r) for l in range(1, n+1) for r in range(l, n+1)]
        for sequence in product(queries, repeat=3):
            intervals, total = [(1, n)], n
            cells = set(range(1, n+1))
            visits = 0
            for step, (left, right) in enumerate(sequence, 1):
                start = bisect_left(intervals, (left, -1))
                if start and intervals[start-1][1] >= left:
                    start -= 1
                end, fragments = start, []
                while end < len(intervals) and intervals[end][0] <= right:
                    l, r = intervals[end]
                    assert r >= left
                    total -= min(r, right)-max(l, left)+1
                    if l < left:
                        fragments.append((l, left-1))
                    if right < r:
                        fragments.append((right+1, r))
                    end += 1
                    visits += 1
                intervals[start:end] = fragments
                cells.difference_update(range(left, right+1))
                represented = {x for l, r in intervals for x in range(l, r+1)}
                checked('435 original per-cell repaint', represented, cells)
                checked('435 white count', total, len(cells))
                checked('435 generated intervals bound total visits', visits <= 1+2*step, True)
                assert all(intervals[i][1]+1 < intervals[i+1][0]
                           for i in range(len(intervals)-1))


def check_documents():
    root = Path(__file__).resolve().parents[3]
    index = json.loads((root/'docs/work-manifests/initial/problem-authoring-units/index.json').read_text())
    domains = Counter()
    ids = set()
    for shard in index['shards']:
        for path in shard['documentPaths']:
            text = (root/path).read_text()
            unit = json.loads(text.split('authoringUnit: ', 1)[1].split('\n---\n', 1)[0])
            assert unit['problemId'] not in ids
            ids.add(unit['problemId'])
            domains[shard['domain']] += 1
            proof = text.split('## 正当性\n\n', 1)[1].split('\n\n## 実装上の注意', 1)[0].strip()
            checked('868 document proof and claim agreement', unit['claims'][0]['text'], proof.replace('\\[', '['))
            checked('868 claim source binding', set(unit['claims'][0]['sourceRevisionIds']),
                    set(unit['sourceRevisionIds']))
    checked('868 membership', len(ids), 868)
    checked('868 domains', dict(domains), {'dynamic-programming': 174, 'graph-search': 172,
            'data-structures': 94, 'mathematics': 147, 'string-geometry': 79, 'hybrid': 202})


def main():
    for check in (check_446, check_302, check_399, check_261, check_462,
                  check_452, check_380, check_435, check_documents):
        check()
        print(check.__name__, 'passed', flush=True)
    print(json.dumps(dict(sorted(COUNTS.items())), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
