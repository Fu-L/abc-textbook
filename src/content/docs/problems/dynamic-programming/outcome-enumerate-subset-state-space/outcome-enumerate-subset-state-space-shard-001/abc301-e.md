---
title: "ABC301-E — Pac-Takahashi"
draft: true
authoringUnit: {"problemId":"abc301-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc301-e.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-weighted-shortest-path"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc301-e-problem-45e3a1d01ba2f854b9b279464d0582b090383ac094c182a9319430e2547f9e8e","source-abc301-editorial-6343-b11e11924058addc198935bbd91d06286574d2bfb73d521c8b78cb42849fa957"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重要点間の動きはBFS最短pathへ置換して時間を増やさない。訪問集合と末尾だけで将来を決められ、最短時間だけ保持すれば全訪問順を覆う。最後のgoal距離まで加えT以内の最大popcountを取る。最短区間に他菓子を通る場合も実際の獲得数を減らさず最適上界を保つ。","sourceRevisionIds":["source-abc301-e-problem-45e3a1d01ba2f854b9b279464d0582b090383ac094c182a9319430e2547f9e8e","source-abc301-editorial-6343-b11e11924058addc198935bbd91d06286574d2bfb73d521c8b78cb42849fa957"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

お菓子は高々18個なので、S/G/各菓子間のgrid最短距離を圧縮すれば訪問順だけのTSP型問題になる。 障害物grid上の移動経路は訪問する重要点順が決まれば点間最短距離へ置き換えてよい。

採用する候補: 重要点BFS＋bitmask TSP DP

各重要点間距離をBFSし、dp[mask][last]で菓子集合を訪問する最短時間を求めてgoalまで含めT以下の最大個数を選べる。

棄却する候補: 時刻付きgrid BFSで取得集合も状態化

HWTまたはgrid×2^18状態が大きく、重要点圧縮の方が小さい。

障害物grid上の移動経路は訪問する重要点順が決まれば点間最短距離へ置き換えてよい。

S,G,菓子各点からBFSして距離行列を作る。dp[mask][i]をSからmask菓子を訪れiで終わる最短距離として遷移し、dp+dist(i,G)≤Tのpopcount最大を取る。

## 典型の発動条件

### metric closure

発動条件: 大きいgraphで少数の必訪候補間移動だけが重要。

各重要点BFSで完全距離graphへ圧縮する。

### bitmask TSP DP

発動条件: 高々18候補から訪問subsetと順序を最適化する。

mask,lastで最短路を計算する。

## 問題固有の要素

時間TをDP軸にせず最短距離を値に持つことでT=2×10^6を避ける。

別の問題へ持ち帰る視点: 候補数が小さい収集問題はmetric closure＋subset DPへ落とす。

## 正当性

重要点間の動きはBFS最短pathへ置換して時間を増やさない。訪問集合と末尾だけで将来を決められ、最短時間だけ保持すれば全訪問順を覆う。最後のgoal距離まで加えT以内の最大popcountを取る。最短区間に他菓子を通る場合も実際の獲得数を減らさず最適上界を保つ。

## 実装上の注意

- S→Gが到達不能またはT超なら-1。INF距離を足さず、菓子0個maskも評価する。

## 復習の核

- 小gridの状態BFSと比較し、菓子なし、回収不能菓子、最短S-GがTちょうど、訪問順依存を確認する。

## 計算量と制約

### 時間

盤面HW、菓子C≤18。重要点BFS O((C+2)HW)、subset DP O(C²2^C)。

### 空間

盤面とBFS O(HW)、mask DP O(C2^C)、距離O(C²)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq H,W \leq 300; 1 \leq T \leq 2\times 10^6; H, W, and T are integers.; A_{i,j} is one of S, G, ., #, and o.; Exactly one pair (i,j) satisfies A_{i,j}= S.; Exactly one pair (i,j) satisfies A_{i,j}= G.; At most 18 pairs (i,j) satisfy A_{i,j}= o.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_e) — source-abc301-e-problem-45e3a1d01ba2f854b9b279464d0582b090383ac094c182a9319430e2547f9e8e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6343) — source-abc301-editorial-6343-b11e11924058addc198935bbd91d06286574d2bfb73d521c8b78cb42849fa957
