---
title: "ABC264-EX — Perfect Binary Tree"
draft: true
authoringUnit: {"problemId":"abc264-ex","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc264-ex.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487","source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"深さdの完全二分木は異なる二子の深さd−1解の積。子wの増分Δだけ変わると新組はΔと他子総和の積になる。旧dp_wを除いてからcsumを更新すれば同じ子を二度選ばない。新頂点を含む構造だけ増え、必要サイズ2^(d+1)−1の上界で伝播打切り可能。 dp[v][0]はvが追加された時だけ1にする。根1を含む全合法集合は根の深さdにより排他的に分類されるので、答えはΣ_d dp[1][d]。差分伝播で根の成分が増える時だけanswerへ加算すると各prefixの答えを重複なく更新できる。","sourceRevisionIds":["source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487","source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

深さdの完全二分木には2^(d+1)−1頂点が必要なので、N≤30万では高さを対数個に制限できる。親番号が常に小さいため番号順に追加すると新頂点は既存木の葉となり、その頂点を含む新しい構造だけが祖先上で増える。各prefixで全DPを計算し直す代わりに、この差分だけを伝播できないか考える。

dp[v][d]をv根・深さdの完全二分木数、csum[v][d]を子のdp[w][d]の総和とする。追加済みの頂点ではdp[v][0]=1。深さd≥1では異なる二子の深さd−1の木を一つずつ選ぶため、子wのdp[w][d]だけがdelta増えたとき、親のdp[p][d+1]の増分はdelta×(csum[p][d]−dp[w][d]の旧値)となる。新しい一子側の選択を、それ以外の子の全選択と組み合わせる式である。

求めるのは根1を含む選択だけなので、prefix kの答えはΣ_{d=0}^D dp[1][d]である。全頂点のdpを足してはいけない。D=⌊log₂(N+1)⌋−1は辺数で測った最大深さで、深さ0は一頂点だけの木。まだ追加していない頂点のdpと全csumを0にし、頂点1を追加してdp[1][0]=1、最初の答え1から始める。

新頂点i≥2を加える処理は、v=i,d=0,delta=1として次を繰り返す。代入の前後を固定すると、他の子の和から新値を誤って引くことを避けられる。

```text
old = dp[v][d]
dp[v][d] += delta
if v == 1: answer += delta; stop
if d == D: stop
p = P_v
next = delta * (csum[p][d] - old)
csum[p][d] += delta
v = p; d += 1; delta = next
```

全更新は法998244353。deltaが0になった時点で打ち切ってよいが、その前にcsumへの現在deltaを反映する。rootへ到達した差分だけanswerへ加え、各追加後のanswerを一行出力する。根以外の一頂点木は次の組合せの部品であり、直接答えに加えない。

親が全て1の3頂点なら答えは1,1,2。最後の2は{1}と{1,2,3}だけであり、{2},{3}は数えない。一本道なら子二本の組が一度もできないので全prefixの答えが1になる。

## 典型の発動条件

### 指数サイズ構造による深さ上界

発動条件: 深さに対して必要要素数が指数増加し、全体サイズに強い上限があるとき。

完全二分木の深さを定数程度に切り、祖先更新回数も同じ上界で抑える。

### 木DPの差分祖先伝播

発動条件: 葉が逐次追加され、一つの子部分木のDP変化が祖先だけへ影響するとき。

各層の増分を計算し、親の集約値とDPへ反映して次の祖先へ渡す。

### 異なる二子選択の総和維持

発動条件: 親状態が異なる二つの子から一項ずつ選ぶ積の総和で定義されるとき。

新しい一子側の値に、それ以外の子の値総和を掛けて追加分だけ求める。

## 問題固有の要素

実際の根から深さ20以上にある新頂点は、根付き完全二分木に含めるなら高さ20以上を強制するため、全更新を省略できる。

別の問題へ持ち帰る視点: 局所DPの高さ上限だけでなく、更新点の実木上の深さからその更新が答えへ届き得るかも枝刈りする。

## 正当性

深さdの完全二分木は異なる二子の深さd−1解の積。子wの増分Δだけ変わると新組はΔと他子総和の積になる。旧dp_wを除いてからcsumを更新すれば同じ子を二度選ばない。新頂点を含む構造だけ増え、必要サイズ2^(d+1)−1の上界で伝播打切り可能。 dp[v][0]はvが追加された時だけ1にする。根1を含む全合法集合は根の深さdにより排他的に分類されるので、答えはΣ_d dp[1][d]。差分伝播で根の成分が増える時だけanswerへ加算すると各prefixの答えを重複なく更新できる。

## 実装上の注意

- Dは辺数で測った深さ。dpの初期値は未追加頂点を0、追加した頂点だけdp[v][0]=1。
- 他子の和はcsum[p][d]−dp[v][d]の旧値。次のdeltaを計算してからcsumへ現在deltaを加える。
- 出力はrootのdpの和。全頂点分の和を使わず、N個のprefixそれぞれを出力する。

## 復習の核

- 求める構造の最小サイズが深さに対して指数増加するなら、制約から実用的な深さ定数を先に導く。
- 動的木DPでは全祖先状態を再計算せず、変更された一子の差分と他子集約値から親差分を出す。

## 計算量と制約

### 時間

N頂点、最大完全二分木深さD=⌊log₂(N+1)⌋−1。番号順追加ごと高々D祖先へ一差分伝播し、葉の追加を含め O(N(D+1))。

### 空間

dpとchild sum O(N(D+1))。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 3 \times 10^5; 1 \le P_i < i

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/tasks/abc264_h) — source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/editorial/4584) — source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181
