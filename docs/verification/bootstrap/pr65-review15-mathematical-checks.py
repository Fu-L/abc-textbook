"""Independent finite models for PR65 review 5404148632 and adjacent repairs.

Python 3.9+, standard library only. These finite comparisons support the
written general proofs; they are not proofs of the entire 868-problem corpus.
"""

from bisect import bisect_left
from collections import Counter, defaultdict
from heapq import heappop, heappush
from itertools import combinations, product
from pathlib import Path
import json
import random


COUNTS = Counter()
RNG = random.Random(6515)
MOD = 998244353


def checked(name, actual, expected):
    assert actual == expected, (name, actual, expected)
    COUNTS[name] += 1


def apply_values(values, t, a, b):
    for value in values:
        t += a if t <= value else -b
    return t


def merge(p, q, a, b):
    l = r = 0
    out = []
    while l < len(p) or r < len(q):
        if l == len(p):
            out.append(q[r])
            r += 1
        else:
            x = p[l] - r*b
            y = q[r] - (len(p)-l)*a if r < len(q) else None
            if y is not None and y < x:
                out.append(y)
                r += 1
            else:
                out.append(max(out[-1]+a, x) if out else x)
                l += 1
    checked("427 cursor count", len(out), len(p)+len(q))
    assert all(x+a <= y for x, y in zip(out, out[1:]))
    return out


def check_merge():
    for a, b in product(range(1, 4), repeat=2):
        good = [s for n in range(4) for s in product(range(-2, 3), repeat=n)
                if all(x+a <= y for x, y in zip(s, s[1:]))]
        for p, q in product(good, repeat=2):
            out = merge(p, q, a, b)
            thresholds = [x+i*b for i, x in enumerate(out)]
            for t in range(-12, 13):
                expected = apply_values(p+q, t, a, b)
                checked("427 all-input action", apply_values(out, t, a, b), expected)
                k = bisect_left(thresholds, t)
                checked("427 threshold equality", t+len(out)*a-k*(a+b), expected)
    # Actual binary-carry construction, with unequal blocks and signed queries.
    for _ in range(100):
        a, b = RNG.randrange(1, 10), RNG.randrange(1, 10)
        original, blocks = [], []
        for _ in range(40):
            v = RNG.randrange(-40, 41)
            original.append(v)
            blocks.append([v])
            while len(blocks) > 1 and len(blocks[-1]) == len(blocks[-2]):
                q, p = blocks.pop(), blocks.pop()
                blocks.append(merge(p, q, a, b))
            for t in (-100, 0, 100):
                actual = t
                for block in blocks:
                    k = bisect_left([x+i*b for i, x in enumerate(block)], actual)
                    actual += len(block)*a-k*(a+b)
                checked("427 binary blocks", actual, apply_values(original, t, a, b))
    # Quadratic local insertion versus linear cursor merge.
    for m in (1, 2, 5, 20):
        p, q = list(range(m)), list(range(-m, 0))
        local, swaps = p[:], 0
        for value in q:
            local.append(value)
            j = len(local)-2
            while j >= 0 and local[j]+1 > local[j+1]:
                x, y = local[j:j+2]
                local[j:j+2] = [y-1, max(y, x-1)]
                swaps += 1
                j -= 1
        checked("427 quadratic counterexample", swaps, m*m)
        checked("427 local versus bulk", merge(p, q, 1, 1), local)


class DSU:
    def __init__(self, n):
        self.parent = list(range(n))

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def unite(self, x, y):
        self.parent[self.find(x)] = self.find(y)


def radii(s):
    result = []
    for i in range(len(s)):
        r = 0
        while i-r-1 >= 0 and i+r+1 < len(s) and s[i-r-1] == s[i+r+1]:
            r += 1
        result.append(r)
    return tuple(result)


def construct_palindrome(a):
    n = len(a)
    dsu = DSU(n)
    i = j = unions = skips = 0
    while i < n:
        while j < a[i]+1:
            dsu.unite(i-j, i+j)
            j += 1
            unions += 1
        k = 1
        while i-k >= 0 and k+a[i-k]+1 < j:
            k += 1
            skips += 1
        i += k
        j -= k
        assert j >= 0
    assert unions <= n and skips <= n
    COUNTS['349 work bound including invalid input'] += 1
    adj = defaultdict(set)
    for i, r in enumerate(a):
        if i-r-1 >= 0 and i+r+1 < n:
            u, v = dsu.find(i-r-1), dsu.find(i+r+1)
            if u == v:
                return None
            adj[u].add(v)
            adj[v].add(u)
    colors = {}
    s = []
    for i in range(n):
        u = dsu.find(i)
        if u not in colors:
            used = {colors[v] for v in adj[u] if v in colors}
            c = 1
            while c in used:
                c += 1
            colors[u] = c
        s.append(colors[u])
    return tuple(s) if radii(s) == a else None


def partitions(n):
    # Every equality partition, in the lexically earliest positive labelling.
    def visit(prefix, maximum):
        if len(prefix) == n:
            yield tuple(prefix)
        else:
            for x in range(1, maximum+2):
                yield from visit(prefix+[x], max(maximum, x))
    yield from visit([1], 1)


def check_palindrome():
    for n in range(1, 10):
        lex = {}
        for s in partitions(n):
            a = radii(s)
            if a not in lex or s < lex[a]:
                lex[a] = s
        for a in product(*(range(min(i, n-1-i)+1) for i in range(n))):
            checked("349 feasibility and lexical minimum", construct_palindrome(a), lex.get(a))


def is_valid(seq):
    s = 0
    for c, _ in seq:
        s += c
        if s < 0:
            return False
    return True


def is_basic(seq, limit):
    s = 0
    for c, _ in seq:
        s += c
        if not 0 <= s < 2*limit:
            return False
    return True


def inversions(seq):
    return sum(x[0] >= 0 and y[0] < 0 for i, x in enumerate(seq) for y in seq[i+1:])


def short_basic(seq, limit):
    if len(seq) <= 2*limit:
        return [seq] if seq else []
    seen, s = {0: 0}, 0
    for end in range(1, 2*limit+1):
        s += seq[end-1][0]
        if s in seen:
            start = seen[s]
            y = seq[start:end]
            prefix, t = [0], 0
            for c, _ in y:
                t += c
                prefix.append(t)
            cut = min(range(len(y)), key=lambda i: prefix[i])
            rotated = y[cut:]+y[:cut]
            assert is_basic(rotated, limit)
            return [rotated]+short_basic(seq[:start]+seq[end:], limit)
        seen[s] = end
    raise AssertionError('missing prefix collision')


def decompose(seq, limit):
    seq = list(seq)
    while True:
        s, changed = 0, False
        for i in range(len(seq)-1):
            if s >= limit and seq[i][0] >= 0 and seq[i+1][0] < 0:
                before = inversions(seq)
                seq[i], seq[i+1] = seq[i+1], seq[i]
                assert is_valid(seq) and inversions(seq) == before-1
                changed = True
                break
            s += seq[i][0]
        if not changed:
            break
    last = max((i for i, x in enumerate(seq) if x[0] < 0), default=-1)
    basics = ([seq[:last+1]] if last >= 0 else [])+[[x] for x in seq[last+1:]]
    assert all(is_basic(x, limit) for x in basics)
    return [y for x in basics for y in short_basic(x, limit)]


def combo_answer(tech, h):
    limit = max(1, max(abs(c) for c, _ in tech))
    row, ds = {0: 0}, {}
    for length in range(1, 2*limit+1):
        nxt = {}
        for s, value in row.items():
            for c, damage in tech:
                if 0 <= s+c < 2*limit:
                    nxt[s+c] = max(nxt.get(s+c, -1), value+damage)
        row = nxt
        if row:
            ds[length] = max(row.values())
    z = next(iter(ds))
    for t in ds:
        if ds[t]*z > ds[z]*t:
            z = t
    assert all(ds[z]*t >= ds[t]*z for t in ds)
    e = (z-1)*2*limit
    dp = [0]+[-1]*e
    for x in range(1, e+1):
        dp[x] = max((dp[x-t]+d for t, d in ds.items() if t <= x and dp[x-t] >= 0), default=-1)
    return min(x+z*max(0, (h-value+ds[z]-1)//ds[z])
               for x, value in enumerate(dp) if value >= 0)


def original_magic_answer(tech, h):
    # Unbounded magic; no 2L cutoff. One nonnegative-increment technique
    # ensures finishing within H steps for these positive damages.
    row = {0: 0}
    for steps in range(1, h+1):
        nxt = {}
        for s, value in row.items():
            for c, damage in tech:
                if s+c >= 0:
                    nxt[s+c] = max(nxt.get(s+c, -1), value+damage)
        row = nxt
        if max(row.values()) >= h:
            return steps
    raise AssertionError('nonnegative technique missing')


def check_magic():
    for limit in (1, 2):
        for n in range(8):
            for cs in product(range(-limit, limit+1), repeat=n):
                seq = list(zip(cs, range(1, n+1)))
                if not is_valid(seq):
                    continue
                parts = decompose(seq, limit)
                assert all(len(p) <= 2*limit and is_basic(p, limit) for p in parts)
                checked("310 decomposition multiset", Counter(x for p in parts for x in p), Counter(seq))
    types = list(product(range(-2, 3), range(1, 4)))
    for n in range(1, 4):
        for tech in combinations(types, n):
            if not any(c >= 0 for c, _ in tech):
                continue
            for h in range(1, 13):
                checked("310 original unbounded magic", combo_answer(tech, h), original_magic_answer(tech, h))


def circle_dp(c, fees):
    n = len(c)
    c = c+c
    dp, ep = {}, {}
    for l in range(2*n+1):
        dp[l, l] = ep[l, l] = 0
    for length in range(1, n+1):
        for l in range(2*n-length+1):
            r = l+length
            dp[l, r] = min((dp[l, m]+dp[m, r] for m in range(l+1, r)), default=10**10)
            ep[l, r] = min((ep[l, m]+dp[m, r] for m in range(l+1, r)), default=10**10)
            if c[l] == c[r-1]:
                ep[l, r] = min(ep[l, r], ep[l, r-1])
                dp[l, r] = min(dp[l, r], ep[l, r]+length+fees[c[l]])
    return min(dp[l, l+n] for l in range(n))


def check_circle():
    for n in range(1, 6):
        for fees in ({1: 1, 2: 1, 3: 1}, {1: 4, 2: 1, 3: 3}):
            # Original forward paint process on the circle, with all colors
            # and overwrites; independently solves all targets at once.
            start = (0,)*n
            dist, heap = {start: 0}, [(0, start)]
            while heap:
                cost, s = heappop(heap)
                if dist[s] != cost:
                    continue
                for l, length, color in product(range(n), range(1, n+1), range(1, 4)):
                    t = list(s)
                    for k in range(length):
                        t[(l+k) % n] = color
                    t = tuple(t)
                    value = cost+length+fees[color]
                    if value < dist.get(t, 10**10):
                        dist[t] = value
                        heappush(heap, (value, t))
            for c in product(range(1, 4), repeat=n):
                checked("400 original circular painting", circle_dp(c, fees), dist[c])


def maze_path(n, m, k):
    if k < n or (k-n) % 2:
        return None
    path, extra, i = [], k-n, 0
    while i+1 < n:
        if n % 2 == 0 or i < n-3:
            w = 1+min(m-1, extra//2)
            path += [(i, j) for j in range(m-1, m-w-1, -1)]
            path += [(i+1, j) for j in range(m-w, m)]
            extra -= 2*(w-1)
            i += 2
        else:
            if extra <= 2*(m-1):
                w = 1+extra//2
                path += [(i, j) for j in range(m-1, m-w-1, -1)]
                path += [(i+1, j) for j in range(m-w, m)]
                path.append((i+2, m-1))
                extra = 0
            else:
                path += [(i, j) for j in range(m-1, -1, -1)]
                extra -= 2*(m-1)
                j = 0
                while j < m:
                    if extra:
                        path += [(i+1, j), (i+2, j), (i+2, j+1), (i+1, j+1)]
                        extra -= 2
                        j += 2
                    else:
                        path.append((i+1, j))
                        j += 1
                path.append((i+2, m-1))
            break
    assert extra == 0
    return path


def check_maze():
    for n, m in product(range(2, 11), range(1, 11)):
        for k in range(1, n*m+1):
            path = maze_path(n, m, k)
            if path is None:
                continue
            checked("358 length", len(path), k)
            assert len(set(path)) == k and path[0] == (0, m-1) and path[-1] == (n-1, m-1)
            assert all(0 <= r < n and 0 <= c < m for r, c in path)
            assert all(abs(r-s)+abs(c-d) == 1 for (r, c), (s, d) in zip(path, path[1:]))
            walls = [['+' if r % 2 == 0 and c % 2 == 0 else
                      '-' if r % 2 == 0 else '|' if c % 2 == 0 else 'o'
                      for c in range(2*m+1)] for r in range(2*n+1)]
            for (r, c), (s, d) in zip(path, path[1:]):
                walls[r+s+1][c+d+1] = '.'
            walls[0][2*m-1], walls[2*n][2*m-1] = 'S', 'G'
            # Read the rendered walls, not the path list, back into a graph.
            adj = defaultdict(set)
            for r, c in product(range(n), range(m)):
                for s, d in ((r+1, c), (r, c+1)):
                    if s < n and d < m and walls[r+s+1][c+d+1] == '.':
                        adj[r, c].add((s, d))
                        adj[s, d].add((r, c))
            v, previous, reconstructed = (0, m-1), None, []
            while True:
                reconstructed.append(v)
                options = adj[v]-{previous}
                if not options:
                    break
                assert len(options) == 1
                previous, v = v, options.pop()
                assert len(reconstructed) <= k
            checked("358 rendered passage", reconstructed, path)
    # Independent enumeration of possible simple paths for small grids.
    for n, m in product(range(2, 5), range(1, 5)):
        end, lengths = (n-1, m-1), set()
        def visit(v, seen):
            if v == end:
                lengths.add(len(seen))
                return
            r, c = v
            for w in ((r-1, c), (r+1, c), (r, c-1), (r, c+1)):
                if 0 <= w[0] < n and 0 <= w[1] < m and w not in seen:
                    visit(w, seen | {w})
        visit((0, m-1), {(0, m-1)})
        checked("358 necessary and sufficient lengths", lengths, set(range(n, n*m+1, 2)))


def run_time(s):
    t, last, j = 0, 1, len(s)-1
    while j >= 0:
        end, c = j, int(s[j])
        while j >= 0 and int(s[j]) == c:
            j -= 1
        t = t+end-j+t*(last-1) if c == 1 else t+1
        last = c
    return t-1


def check_runs():
    for n in range(2, 8):
        for chars in product('123', repeat=n):
            s = ''.join(chars)
            if any(x != '1' and y != '1' for x, y in zip(s, s[1:])):
                t = ''.join(x*int(y) for x, y in zip(s, s[1:]))
                assert any(x != '1' and y != '1' for x, y in zip(t, t[1:]))
                COUNTS['313 persistent forbidden pair'] += 1
            else:
                t, steps = s, 0
                while len(t) > 1:
                    t = ''.join(x*int(y) for x, y in zip(t, t[1:]))
                    steps += 1
                    assert steps < 10000 and len(t) < 100000
                checked("313 explicit original operations", run_time(s), steps)
                checked("313 modular lifetime", run_time(s) % MOD, steps % MOD)
    for _ in range(100):
        s = '1'
        for i in range(20):
            s += str(RNG.randrange(2, 10))+'1'*RNG.randrange(1, 8)
        # Per-character backwards recurrence provides another independent
        # formulation for large lifetimes and modular wraparound.
        t = 0
        for c in s[:0:-1]:
            t = int(c)*(t+1)
        checked("313 large integer lifetime", run_time(s), t)


def check_suffix():
    for n in range(1, 6):
        strings = [''.join(s) for s in product('az', repeat=n)]
        for s, t in product(strings, repeat=2):
            x = s+s+'a'*n+t+t+'z'*n
            sa = sorted(range(len(x)), key=lambda i: x[i:])
            count = answer = 0
            for i in sa:
                if i < n:
                    count += 1
                elif 3*n <= i < 4*n:
                    answer += count
            expected = sum(s[i:]+s[:i] <= t[j:]+t[:j] for i, j in product(range(n), repeat=2))
            checked("272 rotations including padding extremes", answer, expected)


def wall_interval(x, walls, goal):
    n, origin = len(x), x.index(0)
    dp = {(origin, origin, 0): 0, (origin, origin, 1): 0}
    answer = 10**10
    for length in range(1, n+1):
        for l in range(n-length+1):
            r = l+length-1
            for side in (0, 1):
                value = dp.get((l, r, side), 10**10)
                p = l if side == 0 else r
                if p == goal:
                    answer = min(answer, value)
                for v, key in ((l-1, (l-1, r, 0)), (r+1, (l, r+1, 1))):
                    if 0 <= v < n and (v not in walls or l <= walls[v] <= r):
                        dp[key] = min(dp.get(key, 10**10), value+abs(x[p]-x[v]))
    return answer if answer < 10**10 else -1


def wall_original(x, walls, goal):
    # Item-mask Dijkstra, where every adjacent move and pickup is explicit.
    pickups = {h: 1 << i for i, h in enumerate(walls.values())}
    required = {w: pickups[h] for w, h in walls.items()}
    start = x.index(0)
    dist, heap = {(start, 0): 0}, [(0, start, 0)]
    while heap:
        value, p, mask = heappop(heap)
        if dist[p, mask] != value:
            continue
        if p == goal:
            return value
        for v in (p-1, p+1):
            if 0 <= v < len(x) and (v not in required or mask & required[v]):
                nxt, cost = mask | pickups.get(v, 0), value+abs(x[p]-x[v])
                if cost < dist.get((v, nxt), 10**10):
                    dist[v, nxt] = cost
                    heappush(heap, (cost, v, nxt))
    return -1


def check_walls():
    for _ in range(2000):
        n = RNG.randrange(1, 5)
        coords = RNG.sample([x for x in range(-15, 16) if x], 2*n+1)
        x = sorted([0]+coords)
        goal = x.index(coords[0])
        walls = {x.index(coords[1+2*i]): x.index(coords[2+2*i]) for i in range(n)}
        checked("273 item-mask shortest paths", wall_interval(x, walls, goal), wall_original(x, walls, goal))


def check_documents():
    root = Path(__file__).resolve().parents[3]
    index = json.loads((root/'docs/work-manifests/initial/problem-authoring-units/index.json').read_text())
    counts = Counter()
    ids = set()
    for shard in index['shards']:
        for path in shard['documentPaths']:
            text = (root/path).read_text()
            metadata = json.loads(text.split('authoringUnit: ', 1)[1].split('\n---\n', 1)[0])
            correctness = text.split('## 正当性\n\n', 1)[1].split('\n\n## 実装上の注意', 1)[0].strip()
            checked("document proof and claim agree", metadata['claims'][0]['text'], correctness.replace('\\[', '['))
            assert metadata['problemId'] not in ids
            ids.add(metadata['problemId'])
            counts[shard['domain']] += 1
    checked("full audit membership", len(ids), 868)
    checked("full audit domains", dict(counts), {'dynamic-programming': 174, 'graph-search': 172,
            'data-structures': 94, 'mathematics': 147, 'string-geometry': 79, 'hybrid': 202})


def main():
    for check in (check_merge, check_palindrome, check_magic, check_circle,
                  check_maze, check_runs, check_suffix, check_walls, check_documents):
        check()
        print(check.__name__, 'passed', flush=True)
    print(json.dumps(dict(sorted(COUNTS.items())), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
