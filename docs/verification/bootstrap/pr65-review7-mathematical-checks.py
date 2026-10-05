"""Independent finite models for review 5400120233 and eleven further fixes.

Python 3.9+, no dependencies. Original operations and exhaustive solutions are
compared with the proposed reductions. These checks supplement, not replace,
the general proofs and do not certify every explanation in the corpus.
"""
from collections import deque
from fractions import Fraction
from functools import lru_cache
from itertools import combinations, permutations, product
from math import factorial
from random import Random

rng = Random(65_7)


def connected(n, edges, s, t):
    seen = {s}
    todo = [s]
    for v in todo:
        for a, b in edges:
            if a == v and b not in seen:
                seen.add(b)
                todo.append(b)
            if b == v and a not in seen:
                seen.add(a)
                todo.append(a)
    return t in seen


def acyclic(n, edges):
    parent = list(range(n))
    def root(v):
        while parent[v] != v:
            v = parent[v]
        return v
    for a, b in edges:
        a, b = root(a), root(b)
        if a == b:
            return False
        parent[a] = b
    return True


def flow(n, edges, source, sink):
    cap = [[0] * n for _ in range(n)]
    for a, b, c in edges:
        cap[a][b] += c
    total = 0
    while True:
        prev = [-1] * n
        prev[source] = source
        q = deque([source])
        while q and prev[sink] < 0:
            a = q.popleft()
            for b, c in enumerate(cap[a]):
                if c and prev[b] < 0:
                    prev[b] = a
                    q.append(b)
        if prev[sink] < 0:
            return total
        amount, b = 10**12, sink
        while b != source:
            a = prev[b]
            amount = min(amount, cap[a][b])
            b = a
        b = sink
        while b != source:
            a = prev[b]
            cap[a][b] -= amount
            cap[b][a] += amount
            b = a
        total += amount


def cycle_parts(p):
    seen, result = set(), []
    for a in range(len(p)):
        if a in seen:
            continue
        part, b = [], a
        while b not in seen:
            seen.add(b)
            part.append(b)
            b = p[b]
        result.append(part)
    return result


case_count = 0
for n in range(1, 5):
    counts = [0, 0, 0]
    for p in permutations(range(n)):
        edges = list(enumerate(p))
        legal = [mask for mask in range(1 << n)
                 if acyclic(n, [e for i, e in enumerate(edges) if not mask >> i & 1])]
        for w in permutations(range(1, n + 1)):
            optimum = min(sum(w[i] for i in range(n) if mask >> i & 1) for mask in legal)
            results = []
            for order in [range(n), range(n - 1, -1, -1)]:
                active, cost = set(range(n)), 0
                for i in order:
                    a, b = edges[i]
                    if connected(n, [edges[j] for j in active if j != i], a, b):
                        active.remove(i)
                        cost += w[i]
                results.append(cost == optimum)
            parts = cycle_parts(p)
            predicted = [all(w[chooser(c)] == min(w[i] for i in c) for c in parts)
                         for chooser in [min, max]]
            assert results == predicted, (p, w, results, predicted)
            counts[0] += results[0]
            counts[1] += all(results)
            counts[2] += not any(results)
            case_count += 1
    e = [Fraction(1)]
    for m in range(1, n + 1):
        e.append(sum(e[m - i] / i for i in range(1, m + 1)) / m)
    assert counts == [factorial(n)**2 * e[n], factorial(n),
                      factorial(n)**2 * (1 - 2 * e[n]) + factorial(n)]
print(f'ABC318 Ex: {case_count} individual AC/WA classifications and EGF totals agree')


for n in range(1, 6):
    choices = list(combinations(range(n), 2))
    for mask in range(1 << len(choices)):
        edges = [e for i, e in enumerate(choices) if mask >> i & 1]
        net = [(2*n, i, 1) for i in range(n)] + [(n+i, 2*n+1, 1) for i in range(n)]
        net += [(a, n+b, 1) for u, v in edges for a, b in [(u, v), (v, u)]]
        mu = flow(2*n+2, net, 2*n, 2*n+1)
        for bound in ([2, 4] if n <= 3 else [2]):
            brute = max(sum(w) for w in product(range(bound+1), repeat=n)
                        if all(w[u]+w[v] <= bound for u, v in edges))
            assert brute == bound//2 * (2*n-mu), (n, edges, bound)
print('ABC461 G: every simple graph on at most five vertices, including isolated vertices')


for trial in range(1500):
    n = rng.randrange(2, 8)
    labels = list(range(n))
    rng.shuffle(labels)
    edges = [(labels[i], labels[j]) for i in range(n) for j in range(i+1, n) if rng.randrange(4)==0]
    lr = [sorted([rng.randrange(1, n+1), rng.randrange(1, n+1)]) for _ in range(n)]
    r = [x[1] for x in lr]
    for a in reversed(labels):
        for u, v in edges:
            if u == a:
                r[u] = min(r[u], r[v]-1)
    order = []
    for pos in range(1, n+1):
        ready = [v for v in range(n) if v not in order and lr[v][0] <= pos
                 and all(u in order for u, w in edges if w == v)]
        if not ready:
            break
        v = min(ready, key=lambda v:r[v])
        if r[v] < pos:
            break
        order.append(v)
    def valid(p):
        inv = [0]*n
        for i, v in enumerate(p, 1):
            inv[v] = i
        return all(l <= inv[v] <= h for v, (l, h) in enumerate(lr)) and all(inv[u]<inv[v] for u,v in edges)
    witness = next((p for p in permutations(range(n)) if valid(p)), None)
    exists = witness is not None
    assert (len(order)==n) == exists, (edges, lr, order)
    if exists:
        assert valid(order)
        witness = list(witness)
        for i, v in enumerate(order):
            j = witness.index(v)
            changed = witness[:]
            changed[i] = v
            u, current = witness[i], i
            while current < j:
                positions = [witness.index(t) for a, t in edges
                             if a == u and current < witness.index(t) < j]
                k = min(positions, default=j)
                changed[k] = u
                u, current = witness[k], k
            assert valid(changed), (edges, lr, witness, changed)
            assert changed[:i+1] == order[:i+1]
            witness = changed
print('ABC304 Ex: 1,500 release/deadline DAGs against every permutation')


def bottleneck(n, edges, s, t):
    for limit in sorted({w for a, b, w in edges}):
        if connected(n, [(a,b) for a,b,w in edges if w<=limit], s, t):
            return limit
    return None


class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
    def root(self, v):
        if self.parent[v] != v:
            self.parent[v] = self.root(self.parent[v])
        return self.parent[v]
    def union(self, a, b):
        a, b = self.root(a), self.root(b)
        self.parent[a] = b


def batch_answers(n, edges):
    queries = [(eid, s, t) for eid in range(len(edges)) for s, t in combinations(range(n), 2)]
    answer = [0] * len(queries)
    candidates = set()
    dsu = DSU(n)
    weights = sorted({w for a, b, w in edges})
    for weight in weights:
        pending = [i for i, (eid, s, t) in enumerate(queries)
                   if edges[eid][2] == weight and dsu.root(s) != dsu.root(t)]
        for a, b, w in edges:
            if w == weight:
                dsu.union(a, b)
        candidates.update(i for i in pending if dsu.root(queries[i][1]) == dsu.root(queries[i][2]))
    dsu = DSU(n)
    for weight in weights:
        batch = [(eid, dsu.root(a), dsu.root(b)) for eid, (a,b,w) in enumerate(edges) if w == weight]
        representatives = sorted({v for eid,a,b in batch for v in (a,b)})
        local = {v:i for i,v in enumerate(representatives)}
        adj = [[] for _ in local]
        for eid,a,b in batch:
            if a != b:
                a,b = local[a],local[b]
                adj[a].append((b,eid))
                adj[b].append((a,eid))
        tin = [-1]*len(local);tout = [-1]*len(local);low = [-1]*len(local)
        bridges = {};timer = [0]
        def dfs(v, parent_edge):
            tin[v] = low[v] = timer[0];timer[0] += 1
            for u,eid in adj[v]:
                if eid == parent_edge:
                    continue
                if tin[u] < 0:
                    dfs(u,eid);low[v] = min(low[v],low[u])
                    if low[u] > tin[v]:
                        bridges[eid] = u
                else:
                    low[v] = min(low[v],tin[u])
            tout[v] = timer[0]
        for v in range(len(local)):
            if tin[v] < 0:
                dfs(v,-1)
        for i in candidates:
            eid,s,t = queries[i]
            if edges[eid][2] != weight:
                continue
            s,t = local[dsu.root(s)],local[dsu.root(t)]
            if eid in bridges:
                c = bridges[eid]
                answer[i] = int((tin[c] <= tin[s] < tout[c]) != (tin[c] <= tin[t] < tout[c]))
        for a,b,w in edges:
            if w == weight:
                dsu.union(a,b)
    return dict(zip(queries,answer))


for trial in range(350):
    n = rng.randrange(2, 7)
    edges = [(i, i+1, rng.randrange(1, 5)) for i in range(n-1)]
    edges += [(rng.randrange(n), rng.randrange(n), rng.randrange(1,5)) for _ in range(5)]
    batch_result = batch_answers(n, edges)
    for eid, (a, b, w) in enumerate(edges):
        for s, t in combinations(range(n), 2):
            before = connected(n, [(u,v) for u,v,h in edges if h<w], s, t)
            after = connected(n, [(u,v) for u,v,h in edges if h<=w], s, t)
            candidate = not before and after
            # Remove the queried edge from the threshold graph, independently of lowlink.
            expected = int(candidate and not connected(n, [(u,v) for j,(u,v,h) in enumerate(edges) if h<=w and j!=eid],s,t))
            updated = [(u,v,h+(j==eid)) for j,(u,v,h) in enumerate(edges)]
            assert batch_result[eid,s,t] == expected == bottleneck(n,updated,s,t)-bottleneck(n,edges,s,t)
print('ABC301 Ex: 350 multigraphs, every edge and endpoint pair; same-weight and parallel edges')


for trial in range(400):
    h, w = rng.randrange(1,4), rng.randrange(1,4)
    edges = [(a,b,rng.randrange(1,10)) for a in range(h) for b in range(w) if rng.randrange(3)]
    if any(not any(a==i for a,b,c in edges) for i in range(h)) or any(not any(b==j for a,b,c in edges) for j in range(w)):
        continue
    cv = [min(c for a,b,c in edges if a==i) for i in range(h)] + [min(c for a,b,c in edges if b==j) for j in range(w)]
    cover, delta = 10**9, 0
    for mask in range(1<<len(edges)):
        selected = [e for i,e in enumerate(edges) if mask>>i&1]
        left, right = [a for a,b,c in selected], [b for a,b,c in selected]
        if len(set(left))==h and len(set(right))==w:
            cover = min(cover, sum(c for a,b,c in selected))
        if len(set(left))==len(left) and len(set(right))==len(right):
            delta = min(delta, sum(c-cv[a]-cv[h+b] for a,b,c in selected))
    assert cover == sum(cv)+delta
print('ABC231 H: exhaustive weighted edge covers versus all differential matchings')


def prime(x):
    return x>=2 and all(x%d for d in range(2,int(x**0.5)+1))


for trial in range(350):
    values = rng.sample(range(1,10), rng.randrange(1,6))
    counts = [rng.randrange(1,4) for _ in values]
    b = counts[values.index(1)] if 1 in values else 0
    def f(c):
        net = []
        for i, v in enumerate(values):
            net.append((len(values), i, c if v==1 else counts[i]) if v%2 else (i,len(values)+1,counts[i]))
        net += [(i,j,100) for i,v in enumerate(values) for j,u in enumerate(values) if v%2 and not u%2 and prime(v+u)]
        return flow(len(values)+2,net,len(values),len(values)+1)
    h,t = f(0),f(b)
    assert all(f(c)==min(t,c+h) for c in range(b+1))
    individual = tuple(v for v,count in zip(values,counts) for _ in range(count))
    @lru_cache(None)
    def pairs(rem):
        if not rem:
            return 0
        best = pairs(rem[1:])
        for j in range(1,len(rem)):
            if prime(rem[0]+rem[j]):
                best = max(best,1+pairs(rem[1:j]+rem[j+1:]))
        return best
    assert pairs(individual)==max(min(t+k,b+h-k) for k in range(b//2+1))
print('ABC263 G: 350 multisets against individual pairing; every intermediate capacity checked')


for trial in range(500):
    edges = [(rng.randrange(5),rng.randrange(5)) for _ in range(rng.randrange(1,9))]
    brute = max(len({edge[side] for edge,side in zip(edges,bits)}) for bits in product(range(2),repeat=len(edges)))
    unseen, score = set(range(5)), 0
    while unseen:
        a=next(iter(unseen))
        vertices={v for v in unseen if connected(5,edges,a,v)}
        count=sum(u in vertices for u,v in edges)
        score += min(len(vertices),count)
        unseen -= vertices
    assert score == brute
print('ABC302 Ex: 500 value multigraphs against all endpoint selections')


for n,m in [(1,1),(1,4),(4,1),(2,3),(3,2)]:
    for forced in range(1<<(n*m)):
        brute=0
        for mask in range(1<<(n*m)):
            if mask&forced != forced:
                continue
            if all(not (mask>>(i*m+j)&1) or all(mask>>(a*m+b)&1 for a,b in [(i+1,j),(i+1,j+1)] if a<n and b<m) for i in range(n) for j in range(m)):
                brute+=1
        dp={m+1:1}
        for c in range(1-m,n):
            a,b=max(1,1-c),min(m,n-c)
            h=min([j for j in range(a,b+1) if forced>>((c+j-1)*m+j-1)&1]+[b+1])
            dp={j:sum(count for k,count in dp.items() if k>=j) for j in range(a,min(b+1,h)+1)}
        assert sum(dp.values())==brute,(n,m,forced)
print('ABC311 F: every forced grid through 2x3 and 3x2, including one-row/column boundaries')


strings=['a','b','aa','ab','ba','bb','aba','bab']
for trial in range(350):
    chosen=rng.sample(strings,rng.randrange(1,7))
    weights=[rng.randrange(1,6) for _ in chosen]
    n=len(chosen);total=sum(weights)
    edges=[(n*2,i,a) for i,a in enumerate(weights)]+[(n+i,n*2+1,a) for i,a in enumerate(weights)]
    edges += [(i,n+j,total+1) for i,s in enumerate(chosen) for j,t in enumerate(chosen) if i!=j and s in t]
    brute=max(sum(weights[i] for i in range(n) if mask>>i&1) for mask in range(1<<n) if all(not(mask>>i&1 and mask>>j&1) or not(s in t or t in s) for i,s in enumerate(chosen) for j,t in enumerate(chosen) if i<j))
    assert total-flow(n*2+2,edges,n*2,n*2+1)==brute
print('ABC354 G: 350 substring posets against every antichain')


def compressed_area(stones):
    xmax=max(x for x,y in stones)+1;ymax=max(y for x,y in stones)+1
    occupied=sorted({y for x,y in stones})
    blocks=[];prev=-2
    for y in occupied+[ymax+1]:
        if y-prev>1:
            blocks.append((prev+1,y-1,[(-1,xmax)]))
        if y<=ymax:
            xs=sorted(x for x,z in stones if z==y)
            ends=[-2]+xs+[xmax+1]
            blocks.append((y,y,[(a+1,b-1) for a,b in zip(ends,ends[1:]) if a+1<=b-1]))
        prev=y
    nodes=[];layers=[]
    for bottom,top,runs in blocks:
        layer=[]
        for l,r in runs:
            layer.append(len(nodes));nodes.append((l,r,bottom,top))
        layers.append(layer)
    adj=[[] for _ in nodes]
    for first,second in zip(layers,layers[1:]):
        i=j=0
        while i<len(first) and j<len(second):
            a,b=first[i],second[j];l,r,_,_=nodes[a];s,t,_,_=nodes[b]
            if max(l,s)<=min(r,t):
                adj[a].append(b);adj[b].append(a)
            if r<=t:i+=1
            if t<=r:j+=1
    todo=[i for i,(l,r,b,t) in enumerate(nodes) if l==-1 or r==xmax or b==-1 or t==ymax];seen=set(todo)
    for a in todo:
        for b in adj[a]:
            if b not in seen:seen.add(b);todo.append(b)
    return sum((r-l+1)*(t-b+1) for i,(l,r,b,t) in enumerate(nodes) if i not in seen)


for trial in range(700):
    stones={(x,y) for x in range(7) for y in range(7) if rng.randrange(3)==0}
    if not stones:continue
    seen={(-1,-1)};todo=[(-1,-1)]
    for x,y in todo:
        for p in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            if -1<=p[0]<=7 and -1<=p[1]<=7 and p not in stones and p not in seen:
                seen.add(p);todo.append(p)
    brute=sum((x,y) not in stones and (x,y) not in seen for x in range(7) for y in range(7))
    assert compressed_area(stones)==brute,stones
print('ABC361 G: 700 sparse boards against full-grid flood fill')


for trial in range(1800):
    n=rng.randrange(2,180);a=rng.randrange(1,8);b=rng.randrange(a,9)
    bad={x for x in range(2,n) if rng.randrange(5)==0}
    full=[False]*(n+1);full[1]=True
    for x in range(2,n+1):
        full[x]=x not in bad and any(x-s>=1 and full[x-s] for s in range(a,b+1))
    if a==b:
        predicted=(n-1)%a==0 and not any((x-1)%a==0 for x in bad)
    else:
        d=(b-1)*(b-2);reach=[True]+[False]*max(0,d-1)
        for x in range(1,d):reach[x]=any(x-s>=0 and reach[x-s] for s in range(a,b+1))
        def possible(x):return x>=0 and (x>=d or reach[x])
        bounds=[0]+sorted(bad)+[n+1]
        intervals=[(l+1,r-1) for l,r in zip(bounds,bounds[1:]) if l+1<=r-1]
        layers=[(list(range(l,min(r+1,l+b))),list(range(max(l,r-b+1),r+1))) for l,r in intervals]
        points=sorted({x for head,tail in layers for x in head+tail});dp={x:False for x in points};dp[1]=True
        for x in points:
            if not dp[x]:continue
            for step in range(a,b+1):
                if x+step in dp:dp[x+step]=True
            for head,tail in layers:
                if x in head:
                    for y in tail:
                        if y>x and possible(y-x):dp[y]=True
        predicted=dp[n]
    assert predicted==full[n],(n,a,b,bad)
print('ABC388 F: 1,800 obstacle/step instances against all-position DP')


for trial in range(900):
    x=rng.randrange(1,12)
    rows=[sorted([0]+[rng.randrange(20) for _ in range(x)]) for _ in range(3)]
    budget=[0]*3
    for _ in range(x):
        v=min(range(3),key=lambda v:rows[v][budget[v]])
        budget[v]+=1
    greedy=min(rows[v][budget[v]] for v in range(3))
    brute=max(min(rows[0][a],rows[1][b],rows[2][x-a-b]) for a in range(x+1) for b in range(x-a+1))
    assert greedy==brute
print('ABC390 E: 900 nondecreasing budget frontiers, including ties and plateaus')


def light_path(h,w,types):
    x=y=0;d=1;seen=set()
    while (x,y,d) not in seen:
        seen.add((x,y,d));d ^= types[x*w+y]
        x += [1,0,-1,0][d];y += [0,1,0,-1][d]
        if not (0<=x<h and 0<=y<w):return x==h-1 and y==w and d==1
    return False


def light_bfs(h,w,types):
    inf=10**6;dist={(0,0,1):0};q=deque([(0,0,1)]);answer=inf
    while q:
        x,y,d=q.popleft();old=dist[x,y,d]
        for change in [0,1,3]:
            nd=d^change;nx=x+[1,0,-1,0][nd];ny=y+[0,1,0,-1][nd]
            cost=int(change!=types[x*w+y]);new=old+cost
            if nx==h-1 and ny==w and nd==1:answer=min(answer,new)
            if 0<=nx<h and 0<=ny<w and new<dist.get((nx,ny,nd),inf):
                dist[nx,ny,nd]=new
                if cost:q.append((nx,ny,nd))
                else:q.appendleft((nx,ny,nd))
    return answer


for h,w in [(1,1),(1,4),(4,1),(2,2),(2,3),(3,2)]:
    all_types=list(product([0,1,3],repeat=h*w))
    successful=[t for t in all_types if light_path(h,w,t)]
    for initial in all_types:
        brute=min(sum(a!=b for a,b in zip(initial,t)) for t in successful)
        assert light_bfs(h,w,initial)==brute,(h,w,initial)
print('ABC431 E: every initial and final mirror placement through 2x3 and 3x2')


for n in range(1,7):
    for heights in permutations(range(1,n+1)):
        @lru_cache(None)
        def original(mask,cat):
            best=0
            for removed in range(n):
                if not mask>>removed&1:continue
                after=mask&~(1<<removed)
                if removed!=cat:
                    best=max(best,original(after,cat));continue
                l=r=cat
                while l>0 and mask>>(l-1)&1:l-=1
                while r+1<n and mask>>(r+1)&1:r+=1
                targets=[j for j in range(l,r+1) if j!=cat]
                if targets:
                    nxt=max(targets,key=lambda j:heights[j])
                    best=max(best,abs(cat-nxt)+original(after,nxt))
            return best
        def cart(l,r):
            if l==r:return None,0
            i=max(range(l,r),key=lambda j:heights[j]);ans=0
            for a,b in [(l,i),(i+1,r)]:
                child,value=cart(a,b)
                if child is not None:ans=max(ans,abs(i-child)+value)
            return i,ans
        cat=heights.index(n)
        assert original((1<<n)-1,cat)==cart(0,n)[1],heights
print('ABC435 F: all height permutations through N=6 against every removal operation')


def tree_edges(n):
    if n==2:return [(0,1)]
    code=[rng.randrange(n) for _ in range(n-2)];degree=[1]*n
    for v in code:degree[v]+=1
    result=[]
    for v in code:
        u=next(i for i,d in enumerate(degree) if d==1)
        result.append((u,v));degree[u]-=1;degree[v]-=1
    u,v=[i for i,d in enumerate(degree) if d==1];result.append((u,v))
    return result


for trial in range(1000):
    n=rng.randrange(2,15);edges=tree_edges(n);degree=[0]*n
    for a,b in edges:degree[a]+=1;degree[b]+=1
    leaves={i for i,d in enumerate(degree) if d==1}
    caps=[rng.randrange(1,n+1) for _ in range(rng.randrange(1,n+1))]
    if sum(caps)<n:continue
    colors=[-1]*n;remaining=caps[:]
    if n==2:
        eligible=[i for i,c in enumerate(caps) if c>=2]
        if not eligible:continue
        colors=[eligible[0]]*2;remaining[eligible[0]]-=2
    else:
        if sum(c for c in caps if c>=2)<len(leaves):continue
        center=None;groups=None
        for x in range(n):
            if x in leaves:continue
            unseen=set(range(n))-{x};parts=[]
            cut=[e for e in edges if x not in e]
            while unseen:
                a=next(iter(unseen));component={v for v in unseen if connected(n,cut,a,v)}
                parts.append(list(component&leaves));unseen-=component
            if max(map(len,parts))<=len(leaves)/2: center=x;groups=parts;break
        assert center is not None
        for c,cap in enumerate(caps):
            if cap<2:continue
            r=sum(map(len,groups))
            if not r:break
            if r==1:
                g=next(g for g in groups if g);colors[g.pop()]=colors[center]=c;remaining[c]-=2;break
            ranked=sorted(range(len(groups)),key=lambda i:len(groups[i]),reverse=True)
            for i in ranked[:2]:colors[groups[i].pop()]=c;remaining[c]-=1
            for _ in range(cap-2):
                if not sum(map(len,groups)):break
                i=max(range(len(groups)),key=lambda i:len(groups[i]));colors[groups[i].pop()]=c;remaining[c]-=1
            r=sum(map(len,groups));assert max(map(len,groups),default=0)<=(r+1)//2
    for v in range(n):
        if colors[v]<0:
            c=next(i for i,r in enumerate(remaining) if r);colors[v]=c;remaining[c]-=1
    assert all(colors.count(c)<=cap for c,cap in enumerate(caps))
    for eid,(a,b) in enumerate(edges):
        cut=[e for i,e in enumerate(edges) if i!=eid]
        side={v for v in range(n) if connected(n,cut,a,v)}
        assert {colors[v] for v in side}&{colors[v] for v in range(n) if v not in side}
print('ABC453 F: 1,000 sampled trees/capacity lists; every constructed edge cut checked')
