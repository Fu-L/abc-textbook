---
title: "ABC354-G — Select Strings"
draft: true
authoringUnit: {"problemId":"abc354-g","docPath":"src/content/docs/problems/mathematics/outcome-optimize-poset-antichain-by-dilworth/outcome-optimize-poset-antichain-by-dilworth-shard-001/abc354-g.md","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-dp-sequence","unit-max-flow-min-cut"],"excludedTopics":["半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-poset-dilworth-antichain","tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4","source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同一文字列は同時に選べないので最大重みの代表へ統合してよい。異なる文字列の真の substring 関係は半順序をなし、合法な選択はその antichain である。\n\n証明だけのため、重み A_i の頂点 i を A_i 個の互いに比較不能な twin に複製し、i<j のとき i の全 twin を j の全 twin より小さくする。ある i の twin を一つ選べる antichain なら、同じ i の残り twin もすべて追加できる。よってこの展開 poset の最大 antichain サイズは元の最大重みと等しい。\n\nW=ΣA_i とする。重みなし Dilworth と二部 matching により展開 poset の最大 antichain は W−最大 matching。展開 matching のうち i の左 twin と j の右 twin を結ぶ本数を flow にまとめると、source→L_i の容量 A_i、R_j→sink の容量 A_j、比較辺 L_i→R_j の容量 INF>W を満たす。\n\n逆に整数 flow は各左・右頂点で A_i 以下なので、辺ごとに未使用の左 twin と右 twin を割り当てれば展開 matching に戻せる。左右 copy は別の頂点集合なので同じ元 twin の左・右を別々に使ってよい。この両方向の対応から展開 matching と圧縮最大流の値は等しく、答えは W−maxflow。巨大な twin 集合は証明にだけ用い、実装では作らない。","sourceRevisionIds":["source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4","source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半順序・Dilworth・最大反鎖](src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

先に読む単元:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md) — 二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。
- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。

## 考察

substring 関係の推移性を使うと、互いに substring でない文字列の選択は poset の antichain になる。重みなしなら Dilworth と二部 matching が使えるが、A_i≤10^9 を個数として実際に展開できない。

採用する候補: 左右 copy に容量 A_i を置き、真の substring の比較辺に INF を張る最大流で weighted antichain を求める。

証明では A_i 個の twin へ展開し、重みなし Dilworth を適用する。その matching を元頂点ごとの容量へ圧縮できるため、W=ΣA_i に対し W−maxflow が答えになる。重み付き版の定理を別途仮定しなくてよい。

棄却する候補: 重みの大きい文字列から貪欲に選ぶ。

一つの高重み文字列と比較可能な複数の互いに比較不能な文字列を選ぶ方が得な場合を逃す。

同一文字列を最大 A の代表へまとめる。各文字列を pattern とする KMP などで全 ordered pair の真の substring 関係を求め、source→L_i、R_i→sink は容量 A_i、比較辺は INF>W とする。整数最大流を計算して W から引く。

## 典型の発動条件

### weighted Dilworth / antichain の min-cut

発動条件: 推移的 DAG・poset から比較不能な頂点集合の最大重みを選ぶとき。

頂点重みを二部両端容量、比較関係を∞辺にして flow dual を用いる。

### substring 関係の poset 化

発動条件: 選択集合内でどの二文字列も包含関係を持てないとき。

substring の推移性を比較関係として DAG/poset にする。

## 問題固有の要素

同一文字列は最大重み代表にまとめ、自己比較を入れない。異なる文字列間の真の substring だけが展開 poset の比較になる。

別の問題へ持ち帰る視点: 整数重みを概念上の複製数とみなし、重みなしの定理を適用した後、対称な複製を容量へ圧縮する。

## 正当性

同一文字列は同時に選べないので最大重みの代表へ統合してよい。異なる文字列の真の substring 関係は半順序をなし、合法な選択はその antichain である。

証明だけのため、重み A_i の頂点 i を A_i 個の互いに比較不能な twin に複製し、i<j のとき i の全 twin を j の全 twin より小さくする。ある i の twin を一つ選べる antichain なら、同じ i の残り twin もすべて追加できる。よってこの展開 poset の最大 antichain サイズは元の最大重みと等しい。

W=ΣA_i とする。重みなし Dilworth と二部 matching により展開 poset の最大 antichain は W−最大 matching。展開 matching のうち i の左 twin と j の右 twin を結ぶ本数を flow にまとめると、source→L_i の容量 A_i、R_j→sink の容量 A_j、比較辺 L_i→R_j の容量 INF>W を満たす。

逆に整数 flow は各左・右頂点で A_i 以下なので、辺ごとに未使用の左 twin と右 twin を割り当てれば展開 matching に戻せる。左右 copy は別の頂点集合なので同じ元 twin の左・右を別々に使ってよい。この両方向の対応から展開 matching と圧縮最大流の値は等しく、答えは W−maxflow。巨大な twin 集合は証明にだけ用い、実装では作らない。

## 実装上の注意

- INF は ΣA_i より大きい 64 bit 値にする。同一文字列を両方残すと cycle になるため、統合または一方向化を必ず行う。

## 復習の核

- twin の antichain が元の重みを表す理由と、matching・整数 flow の両方向の変換を示す。展開した頂点を実装で作らない。

## 計算量と制約

### 時間

異なる文字列数を n≤N、全入力長を L とする。各 pattern の KMP 前処理と全 text の検索は合計 O(nL)。network は O(n) 頂点・O(n²) 辺で、一般容量 Dinic の安全な上界は O(n⁴)。全体 O(nL+n⁴)。

### 空間

文字列と検索用配列 O(L)、network O(n²)。合計 O(L+n²)。

### 制約との対応

N≤100 に対して小さい network を扱い、A_i≤10^9 は 64 bit 容量として保持する。flow の単位数に比例した反復を行わない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/editorial/10029) — source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/tasks/abc354_g) — source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d
