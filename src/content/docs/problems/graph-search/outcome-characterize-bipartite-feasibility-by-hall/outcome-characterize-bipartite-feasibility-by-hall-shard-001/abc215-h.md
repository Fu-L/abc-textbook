---
title: "ABC215-H — Cabbage Master"
draft: true
authoringUnit: {"problemId":"abc215-h","docPath":"src/content/docs/problems/graph-search/outcome-characterize-bipartite-feasibility-by-hall/outcome-characterize-bipartite-feasibility-by-hall-shard-001/abc215-h.md","learningOutcomeIds":["outcome-characterize-bipartite-feasibility-by-hall"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-subset-transforms"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-subset-zeta-mobius-transform"],"sourceRevisionIds":["source-abc215-editorial-2505-739f01421358cdef8be39bc17210037343494e268605256b5ab7c88fa998748d","source-abc215-h-problem-f70b02b2b4fd3c9a1b9c69f8c2ad3d512bd7439abfa2d445be448c001881d377"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Hall条件は全品種subset Sで供給f(S)≥注文g(S)。注文のある集合の最小余裕dを一つ破るにはd+1個食べる必要があり、その集合内で食べれば達成可能。食べる個体集合の台SをMöbiusで一意分類し、最小余裕集合のどれかに含まれる台だけ合計すると複数witnessによる二重計上がない。","sourceRevisionIds":["source-abc215-editorial-2505-739f01421358cdef8be39bc17210037343494e268605256b5ab7c88fa998748d","source-abc215-h-problem-f70b02b2b4fd3c9a1b9c69f8c2ad3d512bd7439abfa2d445be448c001881d377"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)
- [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md)

対象外:

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

会社 j の B_j 個の注文を区別可能な一個注文へ分けると、各注文を許可品種のどれか一個へ割り当てる二部マッチングとして充足可能性を表せる。 Hall の条件は、全注文部分集合 T に対する供給量 f(S_T) と |T| の比較であり、同じ許可集合を持つ注文をまとめれば品種部分集合 S だけの条件へ移せる。 g(S) を許可品種集合が S に含まれる一個注文の総数とすると、全注文を満たせる条件は全 S で f(S)−g(S) が非負であることになる。 実行可能性は全Sでf(S)≥g(S)と判定する。一方、破壊対象は注文が存在するg(S)>0の集合に限り、d=min_{g(S)>0}(f(S)−g(S))とする。実行可能ならその最小集合からd+1個食べられる（g(S)≥1よりd+1≤f(S)）。既に不可能ならX=0、そうでなければX=d+1である。

棄却する候補: 食べるキャベツの各組合せについて、残りの供給から全注文を満たせるか最大流で判定する。

キャベツ個体の選択肢が膨大で、候補ごとにフローを解く列挙はできない。

採用する候補: Hall の定理で最小余裕を品種部分集合上の f(S)−g(S) に変換し、subset zeta・Möbius 変換で最小個数と選び方を集約する。

品種数 N は 20 以下なので全品種部分集合を扱え、会社の大きな注文数は許可マスクへの重みとしてまとめられる。

g(S) を許可品種集合が S に含まれる一個注文の総数とすると、全注文を満たせる条件は全 S で f(S)−g(S) が非負であることになる。

実行可能性は全Sでf(S)≥g(S)と判定する。一方、破壊対象は注文が存在するg(S)>0の集合に限り、d=min_{g(S)>0}(f(S)−g(S))とする。実行可能ならその最小集合からd+1個食べられる（g(S)≥1よりd+1≤f(S)）。既に不可能ならX=0、そうでなければX=d+1である。

許可マスク別注文数をsubset zeta変換して実際の注文数g(S)を求める。全SのHall条件で実行可能性を判定し、不可能なら(X,Y)=(0,1)。可能ならg(S)>0に限った最小余裕dと集合族F={S:g(S)>0かつf(S)−g(S)=d}を作る。X=d+1とし、C(f(S),X)のMöbius反転で台集合がちょうどSの個体選択数h(S)を求める。Fのsuperset zeta変換が正のSについてh(S)を一度ずつ加える。

## 典型の発動条件

### Hall の定理による供給可能性判定

発動条件: 複数種類の資源を、各要求が受け入れる種類のいずれかへ一対一に割り当てるとき。

注文集合の近傍品種が持つ総供給量と注文数を比較し、品種部分集合ごとの余裕へ変形する。

### subset zeta・Möbius 変換

発動条件: ビット集合ごとに部分集合からの重み総和や、包含で集約された個数から正確な台集合別個数を求めるとき。

許可マスク別注文数から g(S) を作り、C(f(S),X) から選択品種集合がちょうど S の方法数を復元する。

## 問題固有の要素

最小個数 X の選択が称号を壊すのは、選んだ品種の台集合が f(S)−g(S) の最小化集合のどれかに含まれる場合に限られる。

別の問題へ持ち帰る視点: 最小障害集合が複数あるときは、個体選択をその台集合で分類し、最小化集合族との包含関係を集合変換で判定する。

## 正当性

Hall条件は全品種subset Sで供給f(S)≥注文g(S)。注文のある集合の最小余裕dを一つ破るにはd+1個食べる必要があり、その集合内で食べれば達成可能。食べる個体集合の台SをMöbiusで一意分類し、最小余裕集合のどれかに含まれる台だけ合計すると複数witnessによる二重計上がない。

## 実装上の注意

- 会社 j は B_j 個の注文を実際に展開せず、許可品種マスクに重み B_j を足して g の基礎配列を作る。
- X＝0 なら空選択の一通りだけを返し、X＞0 では C(f(S),X) の Möbius 反転と最小集合の上位集合判定の向きを混同しない。

## 復習の核

- 注文部分集合が巨大なら、近傍がある品種集合 S に含まれる注文を全て選ぶのが最悪になることから量化対象を入れ替える。
- 選び方の重複は「選択に使った品種集合がちょうど S」で分割し、いずれかの最小化集合に含まれるかで一度だけ数える。

## 計算量と制約

### 時間

品種N≤20、会社M、供給総和A。mask作成O(NM)、subset/superset zeta・Möbius O(N2^N)、二項係数階乗表O(A)。

### 空間

mask表O(2^N)、階乗O(A)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 20; 1 \leq M \leq 10^4; 1 \leq A_i \leq 10^5; 1 \leq B_j \leq 10^5; c_{i, j} \in \lbrace 0, 1 \rbrace; For every 1 \leq j \leq M, there exists 1 \leq i \leq N such that c_{i, j} = 1.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/editorial/2505) — source-abc215-editorial-2505-739f01421358cdef8be39bc17210037343494e268605256b5ab7c88fa998748d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/tasks/abc215_h) — source-abc215-h-problem-f70b02b2b4fd3c9a1b9c69f8c2ad3d512bd7439abfa2d445be448c001881d377
