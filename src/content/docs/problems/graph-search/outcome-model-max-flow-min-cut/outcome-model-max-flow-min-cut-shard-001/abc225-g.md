---
title: "ABC225-G — X"
draft: true
authoringUnit: {"problemId":"abc225-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc225-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc225-editorial-2854-484eb3ccbb21c634dc1498cc3a1e37532b11dec1ee08507a0087165c0dd32d45","source-abc225-g-problem-0044e2a28056e68ffffa3a4cc96513bf99913cc6daa28f96561b9fa5e6015d22"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各斜めrun開始は選択cellと未選択前cellという局所二値条件。cell→前cellの容量Cがそのときだけcutへ寄与し、盤外はsink未選択で表す。source→cellは未選択利益損失A。従って全利益−cutが選択利益−線分費用に一致しmincutが最大利益。","sourceRevisionIds":["source-abc225-editorial-2854-484eb3ccbb21c634dc1498cc3a1e37532b11dec1ee08507a0087165c0dd32d45","source-abc225-g-problem-0044e2a28056e68ffffa3a4cc96513bf99913cc6daa28f96561b9fa5e6015d22"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

同じ斜め方向に連続してXを付けたマスは一本の線分でつながる。したがって必要線分数は、二つの対角方向それぞれで『選択マスだが一つ前の斜めマスは未選択』となるrunの始点数である。source→cellに容量Aを張るとcellを未選択側へ置くcut費用になり、cell→斜め前cellの容量Cは前者だけ選択したrun開始時に限って切られる。盤外は常に未選択とみなすため、上端から始まる二方向のrunにはcell→sinkの容量Cをそれぞれ張れば同じ局所式で扱える。

採用する候補: 総和ΣAから、未選択マスのAと斜めrun開始のCを足す最小コストを引く形にし、各マスの選択をsource側とするs-t最小カットへ変換する。

利益と罰金が二値ラベル間の局所コストへ分解でき、選択→斜め前未選択のCが有向cut辺と一致する。

棄却する候補: 各マスを独立に A_ij-2C が正なら選ぶ。

隣接して選んだXは線分を共有するため一マスの費用は独立でなく、斜め方向のrun構造を無視すると最適集合を失う。

各マスへsourceからA_ij、二つの上側斜め前マスへ各C、前マスが盤外ならsinkへCの辺を張り、ΣA_ij−mincutを答える。

## 典型の発動条件

### 連続runの開始点数え上げ

発動条件: 隣接する選択要素を一操作でまとめられ、費用が連結成分やrunの個数で決まるとき。

各対角線上の選択列を見て、0から1へ変わる位置だけを新しい線分の開始として数える。

### 二値ラベル最適化のs-t最小カット

発動条件: 選択・未選択の単項コストと、特定の向きのラベル不一致に対する非負罰金の和を最小化するとき。

単項コストをsource/sink辺、不一致罰金をラベル間の有向辺としてcut容量に一致させる。

## 問題固有の要素

X一個を二線分と数えるのでなく、各対角方向の選択runの開始だけを数えると、線分共有が隣接二状態の局所罰金になる。

別の問題へ持ち帰る視点: 描画や起動の共有費用は、連続区間の個数を0→1境界の個数へ書き換えて局所化する。

## 正当性

各斜めrun開始は選択cellと未選択前cellという局所二値条件。cell→前cellの容量Cがそのときだけcutへ寄与し、盤外はsink未選択で表す。source→cellは未選択利益損失A。従って全利益−cutが選択利益−線分費用に一致しmincutが最大利益。

## 実装上の注意

- 二つの対角方向を両方張り、盤外前駆をsinkとして扱う。ΣAとcut容量は64 bitにし、答えは必ずΣA−maxflowの符号で復元する。

## 復習の核

- 連続すると費用を共有する選択では、一要素の費用を決めず、各方向の0→1境界だけに費用を置けないか考える。

## 計算量と制約

### 時間

H×W、V=HW+2、E=O(HW)。一般Dinic O(V²E)=O((HW)³)。

### 空間

network O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 100; 1 \leq C \leq 10^9; 1 \leq A_{i,j} \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/editorial/2854) — source-abc225-editorial-2854-484eb3ccbb21c634dc1498cc3a1e37532b11dec1ee08507a0087165c0dd32d45
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/tasks/abc225_g) — source-abc225-g-problem-0044e2a28056e68ffffa3a4cc96513bf99913cc6daa28f96561b9fa5e6015d22
