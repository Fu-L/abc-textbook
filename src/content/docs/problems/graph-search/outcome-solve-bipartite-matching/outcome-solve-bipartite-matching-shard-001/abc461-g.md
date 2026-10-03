---
title: "ABC461-G — Graph Problem 2026"
draft: true
authoringUnit: {"problemId":"abc461-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc461-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7","source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"最大独立集合の indicator を f とする。元辺 (u,v) の二本の cross edge では f(A_u)+f(B_v)≤1、f(A_v)+f(B_u)≤1。足すと W_u+W_v≤2026 であり、各 W_i も 0≤W_i≤2026。よって総和 1013(2N−μ) は実現できる。\n\n逆に任意の実現可能 W に対し x(A_i)=x(B_i)=W_i/2026 と置く。各 x は [0,1] 内で、cross edge の両端の和は 1 以下である。大きさ μ の matching の両端は重複しないので、それらの x の和は μ 以下。残る 2N−2μ 頂点の和は 2N−2μ 以下。孤立頂点もこの後者に含まれる。したがって 2ΣW_i/2026=Σx≤2N−μ、すなわち ΣW_i≤1013(2N−μ)。下界と一致するので最適である。","sourceRevisionIds":["source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7","source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)

対象外:

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各頂点 i を A_i,B_i に複製し、元辺 (u,v) ごとに A_u–B_v と A_v–B_u を結ぶ。左右の copy を部とする二部 graph である。

採用する候補: 最大 matching の大きさ μ を求め、1013(2N−μ) を答える。

Kőnig の定理から最大独立集合の大きさは 2N−μ。独立集合の indicator f から W_i=1013(f(A_i)+f(B_i)) を作ると実現可能な下界を得る。逆向きには任意の実現可能 W を copy 上へ等分し、matching の各辺と未匹配頂点を別々に足すことで同じ上界を示せる。

棄却する候補: 各 W_i を 0..2026 で探索する。

2027^N 通りの割当は扱えない。二部化しても元の実現可能解との対応を示さなければ、matching の値を答えとして使えない。

Hopcroft–Karp で二部最大 matching を計算する。孤立頂点も 2N 頂点に含める。

## 典型の発動条件

### 変数の二層複製による二部化

発動条件: 各元辺に対称な二つの組合せ制約がある重み割当問題のとき。

各変数をA/B copyに分けcross制約をedgeとして表す。

### 二部graphの最大独立集合

発動条件: 0/1選択でedge両端同時選択を禁止し総数を最大化するとき。

Königの定理で最大matchingの補数として求める。

## 問題固有の要素

同じ元変数を二つの copy へ等分すると、元の辺制約が各 cross edge 上の上界になる。matching が互いに素な制約をまとめ、未匹配頂点は個別上界で補う。

別の問題へ持ち帰る視点: 構成で得た下界に対し、互いに重ならない制約の和から上界を作り、最適性を挟み撃ちする。

## 正当性

最大独立集合の indicator を f とする。元辺 (u,v) の二本の cross edge では f(A_u)+f(B_v)≤1、f(A_v)+f(B_u)≤1。足すと W_u+W_v≤2026 であり、各 W_i も 0≤W_i≤2026。よって総和 1013(2N−μ) は実現できる。

逆に任意の実現可能 W に対し x(A_i)=x(B_i)=W_i/2026 と置く。各 x は [0,1] 内で、cross edge の両端の和は 1 以下である。大きさ μ の matching の両端は重複しないので、それらの x の和は μ 以下。残る 2N−2μ 頂点の和は 2N−2μ 以下。孤立頂点もこの後者に含まれる。したがって 2ΣW_i/2026=Σx≤2N−μ、すなわち ΣW_i≤1013(2N−μ)。下界と一致するので最適である。

## 実装上の注意

- 元無向辺ごとにcross edgeを二方向分とも追加し、同じ元頂点のA_v-B_v辺は不要である。答え係数1013とMIS頂点数を混同しない。

## 復習の核

- 独立集合からの構成と、任意の W を matching の両端・未匹配頂点へ分ける上界を両方再現する。孤立頂点を落とさない。

## 計算量と制約

### 時間

元N頂点M辺。二層2N頂点2M辺、Hopcroft–Karp O(M√N+N)。

### 空間

二層adjacencyとmatching O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^4; 0 \leq M \leq 5 \times 10^4; 1 \leq u_i \lt v_i \leq N; (u_1,v_1),(u_2,v_2),\dots,(u_M,v_M) are pairwise distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/editorial/21377) — source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/tasks/abc461_g) — source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94
