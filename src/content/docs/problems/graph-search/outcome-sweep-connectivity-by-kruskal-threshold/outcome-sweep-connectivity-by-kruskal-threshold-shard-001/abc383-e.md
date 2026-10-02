---
title: "ABC383-E — Sum of Max Matching"
draft: true
authoringUnit: {"problemId":"abc383-e","docPath":"src/content/docs/problems/graph-search/outcome-sweep-connectivity-by-kruskal-threshold/outcome-sweep-connectivity-by-kruskal-threshold-shard-001/abc383-e.md","learningOutcomeIds":["outcome-sweep-connectivity-by-kruskal-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange","unit-spanning-tree-optimization"],"excludedTopics":["Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-kruskal-threshold-sweep","tag-dsu-components","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc383-e-problem-936e349ad2d218832382636988104c5e2c9d1f1bcf631fa5971661472ab65e6d","source-abc383-editorial-11542-f324d9a508a43099b3e45ae63a7d21055c042979d4d26403a184b7ae4a4f3145"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"bottleneck costはKruskalで初めて同成分になる重み。二成分の逆種tokenはその時点で全て同費用wで結べ、先送りしても費用は下がらない。最適matchingのpair交換で今cross pairを可能なだけ確定する最適を選べる。残種数だけで将来を決め成分mergeで厳密に管理する。","sourceRevisionIds":["source-abc383-e-problem-936e349ad2d218832382636988104c5e2c9d1f1bcf631fa5971661472ab65e6d","source-abc383-editorial-11542-f324d9a508a43099b3e45ae63a7d21055c042979d4d26403a184b7ae4a4f3145"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Kruskal順の閾値DSU sweep](src/content/docs/learn/graph/kruskal-threshold-sweep.md)

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

対象外:

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

pathの最大辺最小値f(x,y)は、重みw以下の辺だけを残したgraphでx,yが初めて連結になる閾値である。したがって辺を昇順に足すKruskal過程と一致する。 成分を結ぶ重みwの時点で、片成分のA-tokenと他方のB-tokenはどの組もcost wで結べる。より後へ残すとcostは下がらないので、可能なだけ即座にpairにしてよい。 成分には未使用A個数caと未使用B個数cbだけ持てばよく、実際のpairを復元する必要はない。 二成分併合時はmin(ca_left,cb_right)+min(cb_left,ca_right)組を重みwで確定し、残数を新rootへ集約する。

採用する候補: 辺を重み昇順にDSUで併合し、成分内の未matching A/B個数を貪欲に相殺する

各token対の最小bottleneck値が成分の初結合時に確定し、交換論によりcross成分で作れるpairを即時に結んでも最適matchingを失わない。

棄却する候補: 各A_i,B_j間のminimax距離を個別に求めて二部matchingする

K^2個の距離を扱うだけで上限を超え、minimax距離の階層構造も利用していない。

成分には未使用A個数caと未使用B個数cbだけ持てばよく、実際のpairを復元する必要はない。

二成分併合時はmin(ca_left,cb_right)+min(cb_left,ca_right)組を重みwで確定し、残数を新rootへ集約する。

辺を昇順sortし、各頂点のA,B出現回数でDSU成分countを初期化する。異なる成分を辺wで結ぶたびcross方向のpair数だけwを答えへ加え、残countをmergeする。

## 典型の発動条件

### Kruskal reconstructionの閾値解釈

発動条件: path costが辺重みの最大値で、最小化したいとき。

辺を昇順追加した最初の連結時刻を二点間costとみなす。

### DSU成分上の貪欲matching

発動条件: 成分間の全pairが同じ確定costを持ち、将来costが非減少なとき。

相補的tokenを併合時に可能なだけ相殺する。

## 問題固有の要素

minimax距離は通常の距離表でなく、重みthresholdごとの連結成分というultrametric的な階層で表せる。

別の問題へ持ち帰る視点: pair costが「初めて同じ成分になる時刻」なら、全pairを列挙せずcomponent aggregateだけをKruskal順に処理する。

## 正当性

bottleneck costはKruskalで初めて同成分になる重み。二成分の逆種tokenはその時点で全て同費用wで結べ、先送りしても費用は下がらない。最適matchingのpair交換で今cross pairを可能なだけ確定する最適を選べる。残種数だけで将来を決め成分mergeで厳密に管理する。

## 実装上の注意

各vertexでA/B tokenが同居するならmin個を最初に費用0で相殺する。辺重み昇順、同成分辺は無視する。merge前の逆種countからpair数を決め残数を新代表へ渡す。総costはtoken数×最大重みなので64bitにする。

## 復習の核

- 小さいgraphで全pairのminimax距離をFloyd型に求め全permutation matchingと比較し、同重み辺順序や同一頂点のA/B重複でも答えが不変か確認する。

## 計算量と制約

### 時間

N頂点M辺、token数K。sort O(M log M)、DSU/count merge O((N+M+K)α(N))。

### 空間

DSU、辺、二種token count O(N+M+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; N-1 \leq M \leq \min(\frac{N \times (N-1)}{2},2 \times 10^5); 1 \leq K \leq N; 1 \leq u_i<v_i \leq N (1 \leq i \leq M); 1 \leq w_i \leq 10^9; 1 \leq A_i,B_i \leq N (1 \leq i \leq K); The given graph is simple and connected.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/tasks/abc383_e) — source-abc383-e-problem-936e349ad2d218832382636988104c5e2c9d1f1bcf631fa5971661472ab65e6d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/editorial/11542) — source-abc383-editorial-11542-f324d9a508a43099b3e45ae63a7d21055c042979d4d26403a184b7ae4a4f3145
