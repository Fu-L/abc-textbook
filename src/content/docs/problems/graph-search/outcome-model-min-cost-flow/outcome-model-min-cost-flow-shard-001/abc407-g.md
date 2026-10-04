---
title: "ABC407-G — Domino Covering SUM"
draft: true
authoringUnit: {"problemId":"abc407-g","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc407-g.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow"],"sourceRevisionIds":["source-abc407-editorial-13077-aa159cb15d934434d2eb3d4052fd10a9ca9a1133ac28ae724d49dbba8febe61c","source-abc407-g-problem-10a1a22ae39383d2e2d15bccdb44c7a07f690a43c5906a252f6ec3e44d774d6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dominoは隣接二セルmatchingでvertex容量1が重なり禁止。残る値総和はtotal−matching edge和なので任意matching濃度で辺和を最小にすればよい。shift CはkCだけ費用へ加えるため各flow kから引いて比較すると元目的を厳密に復元する。","sourceRevisionIds":["source-abc407-editorial-13077-aa159cb15d934434d2eb3d4052fd10a9ca9a1133ac28ae724d49dbba8febe61c","source-abc407-g-problem-10a1a22ae39383d2e2d15bccdb44c7a07f690a43c5906a252f6ec3e44d774d6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

domino の集合は grid graph の matching であり、覆われたセル値の総和は選んだ各辺の端点値和の総和に一致する。よって未被覆得点最大化は matching 辺重み和の最小化である。 grid graph は checkerboard 色で二部グラフになる。matching size k ごとの最小費用 f(k) を min-cost flow の流量 k の最小費用として求められる。 全辺重みに C を加えた size k matching の費用を f_C(k) とすれば、元の費用は厳密に f_C(k)-Ck。shift 後の非負費用で標準 min-cost flow を使える。 domino を0枚置く場合も候補なので k=0 の費用0を含めて最小化し、答えは全セル総和からその最小被覆和を引く。

採用する候補: 辺重みを定数 C だけ非負へ shift した二部 matching の min_cost_slope を求め、全流量 k から元費用 f_C(k)-Ck の最小を選ぶ

任意個の domino を許すため matching size も最適化する。source→黒、隣接辺、白→sink を容量1で結べば matching と整数 flow が一対一に対応する。

棄却する候補: 負の端点和をもつ隣接 pair を重みの小さい順に貪欲選択する

一辺を選ぶと両端に接する複数辺が使えなくなるため局所最小は全体最小 matching を保証せず、cardinality 間の比較も必要である。

全辺重みに C を加えた size k matching の費用を f_C(k) とすれば、元の費用は厳密に f_C(k)-Ck。shift 後の非負費用で標準 min-cost flow を使える。

domino を0枚置く場合も候補なので k=0 の費用0を含めて最小化し、答えは全セル総和からその最小被覆和を引く。

各セルを parity で左右に分け、source→片側と他側→sink に容量1・費用0、隣接セル辺に容量1・費用 A_u+A_v+C を張る。min_cost_slope の各流量候補で shiftedCost-C·k を評価し、その最小を totalSum から引く。

## 典型の発動条件

### 二部 matching の最小費用流帰着

発動条件: 二部グラフで互いに端点を共有しない辺集合の重み和を cardinality ごとに最小化するとき。

各頂点容量を1にした source-left-right-sink network を作る。

### コストの一様 shift

発動条件: 負辺を含む固定 cardinality 最適化を、非負コストを要求する実装へ渡したいとき。

全辺へ C を足し、flow k の結果から Ck を引いて元費用へ戻す。

### min_cost_slope

発動条件: 最適な flow 量自体も選ぶ必要があるとき。

0 から最大 matching size までの費用曲線を求め、補正後の最小点を選ぶ。

## 問題固有の要素

未被覆和を最大化する問題では、総和を定数として「覆う二セルの和」を最小化する matching に反転すると、負のセルも自然に扱える。

別の問題へ持ち帰る視点: 選択されなかった頂点重みの最大化は、選択辺が頂点素なら総頂点重みから matching の端点和を引く形を検討する。

## 正当性

dominoは隣接二セルmatchingでvertex容量1が重なり禁止。残る値総和はtotal−matching edge和なので任意matching濃度で辺和を最小にすればよい。shift CはkCだけ費用へ加えるため各flow kから引いて比較すると元目的を厳密に復元する。

## 実装上の注意

- C は全 A_u+A_v+C が非負になる値を選ぶ。総和・費用・Ck は 64 bit を使い、slope が区間を圧縮して返す実装では各線形区間の端点で補正値を評価する。

## 復習の核

- 1×1、1×2、全正、全負、負の辺同士が一セルを奪い合う小 grid を全 matching 列挙と比較し、k=0 と shift 補正を確認する。

## 計算量と制約

### 時間

盤面V=HW、隣接E=O(V)、最大domino数K≤V/2。min-cost slope with potentials O(K E log V)。

### 空間

残余graph、値、slope列 O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq H; 1\leq W; HW\leq2000; -10 ^ {12}\leq A _ {i,j}\leq10 ^ {12}\ (1\leq i\leq H,1\leq j\leq W); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/editorial/13077) — source-abc407-editorial-13077-aa159cb15d934434d2eb3d4052fd10a9ca9a1133ac28ae724d49dbba8febe61c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/tasks/abc407_g) — source-abc407-g-problem-10a1a22ae39383d2e2d15bccdb44c7a07f690a43c5906a252f6ec3e44d774d6a
