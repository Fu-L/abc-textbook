---
title: "ABC355-G — Baseball"
draft: true
authoringUnit: {"problemId":"abc355-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc355-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation","outcome-optimize-monge-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-monge-optimization"],"sourceRevisionIds":["source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea","source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"選択位置を端点込みのpathへ写すとgap内の最寄り距離寄与だけで全costが加算できる。prefix和のoracleがそのgap costを正確に返し、Monge性で最適遷移元の単調探索が可能になる。penalty最短路は各辺数の費用に支持線を引く操作で、辺数別最適値の凸性からK+1辺の値をdualで復元できる。tieに同じ辺数規約を用いて単調性を保つ。","sourceRevisionIds":["source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea","source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選んだ位置 x_1<…<x_K は、端0,N+1を加えた path と見られる。区間 (i,j) 内の各 y の最近選択点距離寄与 c(i,j) は P と yP の prefix sum から O(1) で計算できる。

ちょうど K+1 辺の最短路 DP は O(KN²) だが、区間距離 cost c は交差する区間の寄与比較から Monge inequality を満たす。

採用する候補: 一辺 penalty λ の Aliens DP で辺数次元を消し、各 λ の Monge shortest-path DP を分割統治 monotone minima/LARSCH等で高速評価する。

λ を探索して最適辺数を K+1 に合わせ、N²K をおおむね準線形×log値域へ下げられる。

棄却する候補: dp[k][j]=min_{i<j}(dp[k−1][i]+c(i,j)) を全 i,j,k で計算する。

N=5×10^4で O(KN²) は不可能で、Monge 性と辺数制約の双対化を利用していない。

各 edge cost に λ を加えた unconstrained shortest path では、λ を増やすほど採用辺数が非増加になり、value−λ(K+1) の最大が固定辺数最適値を復元する。

Monge 行列では最適遷移元 index が j とともに単調になるため、online依存を分割統治で解消すれば各 λ の DP を高速化できる。

P と yP の prefix sum から c(i,j) oracle を作る。整数 λ に対し dp[j]=min_{i<j}(dp[i]+c(i,j)+λ) と使用辺数を lexicographic に計算し、分割統治＋monotone minima（または簡易LARSCH/CHT）で評価する。辺数が K+1 を跨ぐ λ を凸探索し、dp[N+1]−λ(K+1) の最大を答える。

## 典型の発動条件

### Aliens trick（Lagrangian relaxation）

発動条件: 最適化に「ちょうど d 個」の次元があり、各選択へ一様 penalty を加えた問題が速く解けるとき。

個数制約を λ へ双対化し、最適個数の単調性から λ を探索する。

### Monge shortest path optimization

発動条件: 区間 cost が quadrangle inequality を満たす DAG 最短路 DP。

最適遷移元の単調性を monotone minima/SMAWK/LARSCH で利用する。

## 問題固有の要素

期待値の確率分母 S は問題が既に掛けた値を要求するため、目的は各 y の重み P_y を持つ一次元 k-median に一致する。

別の問題へ持ち帰る視点: 一次元施設配置では隣接施設間への割当 cost が Monge になりやすく、Aliens DP の典型候補になる。

## 正当性

選択位置を端点込みのpathへ写すとgap内の最寄り距離寄与だけで全costが加算できる。prefix和のoracleがそのgap costを正確に返し、Monge性で最適遷移元の単調探索が可能になる。penalty最短路は各辺数の費用に支持線を引く操作で、辺数別最適値の凸性からK+1辺の値をdualで復元できる。tieに同じ辺数規約を用いて単調性を保つ。

## 実装上の注意

- 同じ penalized cost では辺数の大小を一貫して tie-break し、λ探索の単調性を守る。端0,N+1の cost 定義と必要辺数 K+1 をずらさない。

## 復習の核

- 高速化の前に path edge cost が各 y の最近点寄与を一度ずつ含むか確かめる。Monge証明と λ の個数tie-breakを別々に検証する。

## 計算量と制約

### 時間

O(N log N·log Λ)をMonge最短路oracle O(N log N)と整数penalty範囲Λの場合の上界とする。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^4; 1 \leq K \leq N; 0 \leq P_i \leq 10^5; 1 \leq \sum_{y'=1}^N P_{y'} \leq 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/editorial/10078) — source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/tasks/abc355_g) — source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c
