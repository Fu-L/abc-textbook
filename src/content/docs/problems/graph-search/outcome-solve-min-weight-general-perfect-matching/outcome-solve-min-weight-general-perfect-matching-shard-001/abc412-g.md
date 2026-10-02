---
title: "ABC412-G — Degree Harmony"
draft: true
authoringUnit: {"problemId":"abc412-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-min-weight-general-perfect-matching/outcome-solve-min-weight-general-perfect-matching-shard-001/abc412-g.md","learningOutcomeIds":["outcome-solve-min-weight-general-perfect-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching"],"excludedTopics":["一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-weight-general-perfect-matching"],"sourceRevisionIds":["source-abc412-editorial-13380-95067bcd0eb01040baed106ba4d8b2253ceb159ad95bf3b8f1405a4e9b351afb","source-abc412-g-problem-27d73284f299279f9fbbd7a98644b63d7f80d28e6cef49591ca3785e5ab4b6c2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"vertex iのA_i stubsを異labelpairにd_i個使い余りを同label内でpairにするとdegree上限とparityがちょうど成立する。異label費用1、同label0なのでperfect matching最小費用がedge数。最小解で同元edgeの二重使用は四stubを同label0pairへ交換して減らせるため元simple graphにも戻せる。","sourceRevisionIds":["source-abc412-editorial-13380-95067bcd0eb01040baed106ba4d8b2253ceb159ad95bf3b8f1405a4e9b351afb","source-abc412-g-problem-27d73284f299279f9fbbd7a98644b63d7f80d28e6cef49591ca3785e5ab4b6c2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一般グラフの最小重み完全matching](src/content/docs/learn/graph/min-weight-general-perfect-matching.md)

- 一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

対象外:

- 一般グラフの最小重み完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

良いsubgraphのdegree d_iは、A_i個のstubのうちd_i個を他labelと組ませ、残りA_i-d_i個を同label内でpairにする、と解釈できる。後者が可能な条件はd_i≤A_iかつparity一致である。 X=ΣA_i≤150個のcopy頂点を作れば、このstub pairing全体は一般graphのperfect matchingになる。異label pairのweight1が元subgraphのedge数に対応し、同label pairはweight0で余剰を吸収する。 matching中に同じlabel pair間のweight1 edgeが二本あれば、その4 copyを各label内のweight0二辺へ交換して費用を下げられる。よって最小解は元simple graphの同じedgeを重複使用しない。 Xが奇数ならperfect matchingは不可能。偶数ならEdmonds blossomで直接解け、またTutte行列へ辺weightをyの次数として埋め込む乱択判定・補間でも最小weightだけを得られる。

採用する候補: 各label i のcopyをA_i個作った0/1重みgraph Hの最小重みperfect matchingへ帰着する

同label copiesをweight0で完全接続し、元Gにedge i-jがあるlabel間をweight1で完全接続する。perfect matchingの最小weightが良いgraphの最小edge数になり、存在しなければ-1。

棄却する候補: 元graphの各edgeを選ぶ／選ばないでdegree parityと上限をDPする

Mは最大約N^2でedge subsetは指数的になり、頂点ごとのdegree制約を局所状態だけでは分離できない。

matching中に同じlabel pair間のweight1 edgeが二本あれば、その4 copyを各label内のweight0二辺へ交換して費用を下げられる。よって最小解は元simple graphの同じedgeを重複使用しない。

Xが奇数ならperfect matchingは不可能。偶数ならEdmonds blossomで直接解け、またTutte行列へ辺weightをyの次数として埋め込む乱択判定・補間でも最小weightだけを得られる。

Xが奇数なら-1。X頂点のHを構築し、一般graph用minimum-weight perfect matching（blossom等）を実行する。matchingなしなら-1、あればweight0/1辺の総和を出力する。Tutte行列を使う場合はentryを乱数·y^{w}とし、detの最小非零次数の半分を同じ答えとして求める。

## 典型の発動条件

### degree stub の展開

発動条件: 各頂点degreeに上限とparity制約があり、総上限が小さいとき。

A_i個のcopyを作り、cross-label pairを採用edge、same-label pairを未使用stub二個に対応させる。

### 一般graphの最小重みperfect matching

発動条件: 二部とは限らないgraphで全頂点をpairingし、辺重み和を最小化するとき。

0/1重みexpanded graph Hへblossom algorithmを適用する。

### Tutte行列と多項式次数

発動条件: perfect matchingの存在や最小weightだけを代数的・乱択的に求めたいとき。

辺変数へy^{weight}を掛け、detの最小非零次数をmatching weightの2倍として読む。

## 問題固有の要素

degreeを直接決めず、A_i-d_iが偶数という条件を同label stubの0-cost pairへ物理化すると、上限・parity・目的edge数が一つのperfect matchingに統合される。

別の問題へ持ち帰る視点: 小さいdegree総和があるfactor問題では、各許容量をcopy頂点に展開し、未使用単位を内部pairで吸収するmatching模型を検討する。

## 正当性

vertex iのA_i stubsを異labelpairにd_i個使い余りを同label内でpairにするとdegree上限とparityがちょうど成立する。異label費用1、同label0なのでperfect matching最小費用がedge数。最小解で同元edgeの二重使用は四stubを同label0pairへ交換して減らせるため元simple graphにも戻せる。

## 実装上の注意

- 同label cliqueはweight0、異labelは元Gに辺がある場合だけweight1にする。X≤150だがX^2辺を扱い、Tutte法は十分大きい法と乱数でfailure確率を抑える。

## 復習の核

- X奇数、M=0、A_i=1だけ、同じlabel pairのcross edgeが二本現れ得るexpanded matchingを小graphの全subgraph列挙と比較する。

## 計算量と制約

### 時間

stub総数X=ΣA_i≤150、一般matching補助graph辺E≤X²。weighted blossomなら O(X³) の標準実装上界、構築O(X²)。

### 空間

stub graphとblossom作業 O(X²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 150; 0 \leq M \leq \frac{N(N-1)}{2}; 1 \leq u_i < v_i \leq N; The given graph is simple.; 1 \leq A_i \leq 150; 1 \leq \sum_{i=1}^N A_i \leq 150; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/editorial/13380) — source-abc412-editorial-13380-95067bcd0eb01040baed106ba4d8b2253ceb159ad95bf3b8f1405a4e9b351afb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/tasks/abc412_g) — source-abc412-g-problem-27d73284f299279f9fbbd7a98644b63d7f80d28e6cef49591ca3785e5ab4b6c2
