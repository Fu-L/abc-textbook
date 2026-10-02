# PR #65: independent small-input oracles. Run with Python 3.9 or later.
# These models validate the mathematical claims; shard checks bind the prose.

from itertools import permutations,product,combinations
from fractions import Fraction
from math import comb,factorial
from functools import lru_cache
checks=0
for n in range(1,6):
 for a in product(range(1,4),repeat=n):
  for x in range(1,sum(a)+2):
   full=sum(a);e=Fraction(0)
   for mask in range(1<<n):
    subset=[a[i] for i in range(n) if mask>>i&1];s=sum(subset)
    if len(subset)<n and s<x:e+=Fraction(full-s,comb(n,len(subset))*(n-len(subset)))
   actual=0
   for order in permutations(a):
    total=0
    for v in order:
     if total>=x:break
     total+=v
    actual+=total
   assert e==Fraction(actual,factorial(n)),(a,x,e,actual)
   checks+=1
print('ABC464 F: subset expectation vs all permutations:',checks)
checks=0
for n in range(13):
 for k in range(n+1):
  ans=2**n
  for m in range(1,(n+1)//(k+2)+1):
   r=n-(k+1)*m;t=n-(k+2)*m
   v=(comb(r,m)*2**t if t>=0 and r>=m else 0)+(comb(r,m-1)*2**(t+1) if t+1>=0 and r>=m-1 else 0)
   ans+=(-1)**m*v
  brute=sum(max(map(len,''.join(s).split('0')))<=k for s in product('01',repeat=n))
  assert ans==brute,(n,k,ans,brute)
  checks+=1
print('ABC456 G: inclusion-exclusion vs all binary words:',checks)
checks=0
for n in range(2,25,2):
 for walls in [set(),{(2,2)},{(n//2,n//2)}]:
  virtual={(2*t-1,2*t+1) for t in range(1,n//2)}|{(2*t,2*t+1) for t in range(1,n//2)}
  points=[(1,1)]+sorted(walls|virtual)+[(n,n)];dp=[1]
  for b in points[1:]:
   total=0
   for a,w in zip(points,dp):
    dr,dc=b[0]-a[0],b[1]-a[1]
    if min(dr,dc)>=0:total+=w*comb(dr+dc,dr)
   dp.append(-total)
  grid={}
  for r in range(1,n+1):
   for c in range(1,min(n,2*((r+1)//2))+1):
    grid[r,c]=0 if (r,c) in walls else (1 if (r,c)==(1,1) else grid.get((r-1,c),0)+grid.get((r,c-1),0))
  assert -dp[-1]==grid[n,n],(n,walls,dp,grid[n,n])
  checks+=1
print('ABC357 G: signed walls vs cell DP:',checks)
checks=0
for n in range(1,7):
 edges=list(combinations(range(n),2))
 def shape(mask):
  adj=[[] for _ in range(n)]
  for i,(a,b) in enumerate(edges):
   if mask>>i&1:adj[a].append(b);adj[b].append(a)
  color=[-1]*n;groups=[]
  for start in range(n):
   if color[start]!=-1:continue
   color[start]=0;queue=[start];ab=[0,0]
   for v in queue:
    ab[color[v]]+=1
    for w in adj[v]:
     if color[w]<0:color[w]=1-color[v];queue.append(w)
     elif color[w]==color[v]:return None
   groups.append(ab)
  return groups
 shapes={mask:g for mask in range(1<<len(edges)) if (g:=shape(mask)) is not None}
 @lru_cache(None)
 def win(mask):return any(not win(mask|1<<i) for i in range(len(edges)) if not(mask>>i&1) and mask|1<<i in shapes)
 for mask,groups in shapes.items():
  x=sum(a*b for a,b in groups)-bin(mask).count('1')
  oo=sum(a%2 and b%2 for a,b in groups)
  iso=sum(a+b==1 for a,b in groups)
  eo=sum((a+b)%2 and a+b>1 for a,b in groups)
  expected=bool((oo+x)%2) if n%2 else (bool((iso//2+x)%2) if eo==0 else True if eo<=2 else bool((oo+x)%2))
  assert win(mask)==expected,(n,mask,groups,x,expected,win(mask))
  checks+=1
print('ABC398 G: classification vs full game tree:',checks)

from functools import lru_cache
from itertools import combinations_with_replacement
@lru_cache(None)
def outcomes(a,m):
 if not m:return {a}
 out=set()
 for i,x in enumerate(a):
  if x<2:continue
  b=tuple(sorted(a[:i]+a[i+1:]+(x//2,(x+1)//2)))
  out.update(outcomes(b,m-1))
 return out

def valid(a,m,x):
 k=(len(a)+m+1)//2
 if sum(v>=x for v in a)+m<k:return False
 stack=list(a);good=[]
 while stack:
  v=stack.pop()
  if v>=max(2,2*x-1):stack.extend([v//2,(v+1)//2])
  elif v>=x:good.append(v)
 if len(good)<k:return False
 good.sort();return sum(a)-sum(good[:k])>=k-1
checks=0
for n in range(1,5):
 for a in combinations_with_replacement(range(1,8),n):
  for m in range(1,sum(a)-n+1):
   if (n+m)%2==0:continue
   best=max(b[len(b)//2] for b in outcomes(a,m))
   for x in range(1,max(a)+1):assert valid(a,m,x)==(best>=x),(a,m,x,best)
   checks+=1
print('median exhaustive operation comparisons',checks,'counterexample',max(b[len(b)//2] for b in outcomes((1,1,1,1,100),2)))

from itertools import combinations
from collections import deque
from heapq import heappop,heappush
from random import Random
rnd=Random(65)
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def intersect(a,b,c,d):return cross(a,b,c)*cross(a,b,d)<0 and cross(c,d,a)*cross(c,d,b)<0
def solve(h,w,s,g,cells):
 path=[s];cur=s
 while cur[0]!=g[0]:cur=(cur[0]+(1 if cur[0]<g[0] else -1),cur[1]);path.append(cur)
 while cur[1]!=g[1]:cur=(cur[0],cur[1]+(1 if cur[1]<g[1] else -1));path.append(cur)
 # integer geometry at scale 154, shift intermediate centers by (22,14)
 points=[(154*x,154*y) for x,y in path];points=[p if i in (0,len(points)-1) else (p[0]+22,p[1]+14) for i,p in enumerate(points)]
 def bit(a,b):return sum(intersect(a,b,points[i],points[i+1]) for i in range(len(points)-1))%2
 vertices=list(cells);omega=len(vertices);edges=[[] for _ in range(omega+1)]
 for i,a in enumerate(vertices):
  for j,b in enumerate(vertices[:i]):
   if max(abs(a[0]-b[0]),abs(a[1]-b[1]))==1:
    c=bit(tuple(154*x for x in a),tuple(154*x for x in b));edges[i].append((j,c));edges[j].append((i,c))
  x,y=a
  if x in (0,h-1) or y in (0,w-1):
   z=(-77,154*y) if x==0 else (154*h-77,154*y) if x==h-1 else (154*x,-77) if y==0 else (154*x,154*w-77)
   c=bit((154*x,154*y),z);edges[i].append((omega,c));edges[omega].append((i,c))
 reds=[vertices.index(x) for x in path if x in cells];blocked=set();best=1000;count=0
 for seed in reds:
  start=(seed,0,0);dist={start:1};heap=[(1,start)]
  while heap:
   d,state=heappop(heap)
   if dist[state]!=d:continue
   v,p,used=state
   for u,b in edges[v]:
    if u in blocked or u==omega and used:continue
    to=(u,p^b,used or u==omega);nd=d+(u!=omega)
    if nd<dist.get(to,1000):dist[to]=nd;heappush(heap,(nd,to))
  cnt={start:1}
  for state in sorted(dist,key=lambda t:(dist[t],t[0]==omega)):
   v,p,used=state
   for u,b in edges[v]:
    if u in blocked or u==omega and used:continue
    to=(u,p^b,used or u==omega)
    if dist.get(to,1000)==dist[state]+(u!=omega):cnt[to]=cnt.get(to,0)+cnt.get(state,0)
  for used in (0,1):
   goal=(seed,1,used);cost=dist.get(goal,1001)-1
   if cost<best:best=cost;count=cnt.get(goal,0)
   elif cost==best:count+=cnt.get(goal,0)
  blocked.add(seed)
 return best,count//2

def brute(h,w,s,g,cells):
 best=1000;count=0
 for size in range(len(cells)+1):
  for subset in combinations(cells,size):
   blocked=set(subset);q=deque([s]);seen={s}
   while q:
    x,y=q.popleft()
    for dx,dy in [(0,1),(0,-1),(1,0),(-1,0)]:
     a=(x+dx,y+dy)
     if 0<=a[0]<h and 0<=a[1]<w and a not in seen and a not in blocked:seen.add(a);q.append(a)
   if g not in seen:best=size;count+=1
  if count:break
 return best,count
checks=0
for h,w in [(2,2),(2,3),(3,3)]:
 allcells=[(x,y) for x in range(h) for y in range(w)]
 for s,g in combinations(allcells,2):
  for trial in range(6):
   cells=[a for a in allcells if a not in (s,g) and (trial==0 or rnd.randrange(4)>0)]
   expected=brute(h,w,s,g,cells);got=solve(h,w,s,g,cells)
   assert got==expected,(h,w,s,g,cells,expected,got)
   checks+=1
print('separator exact subset comparisons',checks)

# ABC251 Ex: compare base-7 window operators with the full binomial formula.
from math import comb
from random import Random
random = Random(251)
checks = 0
for n in range(1, 91):
 for k in range(1, n + 1):
  steps = n - k
  a = [random.randrange(7) for _ in range(n)]
  expected = [sum(comb(steps, j) * a[i+j] for j in range(steps+1)) % 7 for i in range(k)]
  waves = steps
  widths = []; width = 1
  while width <= waves:
   widths.append(width); width *= 7
  got = a[:]
  for width in reversed(widths):
   for _ in range((waves // width) % 7):
    got = [(got[i]+got[i+width]) % 7 for i in range(len(got)-width)]
  assert got == expected, (n,k,got,expected)
  checks += 1
print('ABC251 Ex: compressed-scale windows vs binomial coefficients:', checks)
