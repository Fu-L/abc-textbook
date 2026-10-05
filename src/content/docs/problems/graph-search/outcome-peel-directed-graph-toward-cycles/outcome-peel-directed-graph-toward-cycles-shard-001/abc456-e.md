---
title: "ABC456-E — Endless Holidays"
draft: true
authoringUnit: {"problemId":"abc456-e","docPath":"src/content/docs/problems/graph-search/outcome-peel-directed-graph-toward-cycles/outcome-peel-directed-graph-toward-cycles-shard-001/abc456-e.md","learningOutcomeIds":["outcome-peel-directed-graph-toward-cycles"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["有向cycle検出・sink/source peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-directed-core-peeling"],"sourceRevisionIds":["source-abc456-e-problem-c3e51b63fd40c2ce2328caafad47b2b781ce1afa77274de1f82ff6145927c238","source-abc456-editorial-19849-c986ee8612d12ce480a296e55c2761fbd42c85ed54d8d94616a63d4505cc0d52"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"都市と曜日が同じなら次日の合法滞在移動が同じなので有限状態に閉じる。無限合法walkなら状態再訪でcycleを含み、cycleがあれば反復して無限移動可能。open条件付きedgeを正確に構築しcycle存在を調べれば必要十分。","sourceRevisionIds":["source-abc456-e-problem-c3e51b63fd40c2ce2328caafad47b2b781ce1afa77274de1f82ff6145927c238","source-abc456-editorial-19849-c986ee8612d12ce480a296e55c2761fbd42c85ed54d8d94616a63d4505cc0d52"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有向cycle検出・sink/source peeling](src/content/docs/learn/graph/directed-core-peeling.md)

- 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。

## 考察

曜日はW日で周期的なので、都市x・曜日wを状態にすれば翌日の可能な滞在先が固定有向辺で表せる。無限に休日移動を続けられることは有限状態pathがcycleへ入ることと同値である。頂点 (x,w) からは、同都市または道路隣接都市 y が曜日w+1にもopenな場合だけ遷移できる。開始状態も任意なのでgraph内に一つでもcycleがあれば条件を満たし、特定sourceからのreachabilityは不要である。

採用する候補: N×W のtime-expanded graphを構築し、open条件を満たす stay/road遷移を翌曜日layerへ張って、有向cycleをDFS色またはtopological deletionで検出する。

同じ (都市,曜日) に再訪すれば以後そのcycleを繰り返せ、無限pathが存在すれば有限頂点性により必ず状態を再訪してcycleを含む。

棄却する候補: 日数上限を仮定して可能都市集合を日ごとにsimulationし、空になるか観察する。

cycleに入るまでの長さを任意に打ち切れず、曜日情報なしの都市集合だけでは状態再訪を正しく判定できない。

各open状態を頂点化し、wからw mod W+1へstay辺と各道路両方向辺を条件付きで追加する。全頂点に三色DFSを行いback edgeを見つけるか、indegree削除後に残る頂点があるかでYes/Noを返す。

## 典型の発動条件

### 時間展開graph

発動条件: 環境条件が短い周期で変わる無限時系列の移動を扱うとき。

場所×周期phaseを有限状態にして一日遷移を辺にする。

### 無限pathのcycle判定

発動条件: 有限有向graphで任意開始から永遠に遷移可能かを問うとき。

有向cycleの存在へ同値変形する。

## 問題固有の要素

周期的な時間依存graphはphaseを状態へ組み込むと静的graphになり、無限性はcycleへ置き換わる。

別の問題へ持ち帰る視点: 開始点自由の無限walkではcycleへのreachabilityではなくcycle存在だけを調べればよい。

## 正当性

都市と曜日が同じなら次日の合法滞在移動が同じなので有限状態に閉じる。無限合法walkなら状態再訪でcycleを含み、cycleがあれば反復して無限移動可能。open条件付きedgeを正確に構築しcycle存在を調べれば必要十分。

## 実装上の注意

- 曜日Wから1へのwrapを正しく張り、出発日・到着日のopen条件を問題定義通り両方確認する。再帰DFSならNW深さを避ける。

## 復習の核

- 一日の遷移辺のopen条件を書き、無限pathなら有限状態の重複からcycle、cycleなら反復可能という双方向を証明する。

## 計算量と制約

### 時間

都市N道路M、周期W。状態NW、遷移 O(W(N+M))、cycle DFS/peelingも同時間。

### 空間

周期graphとvisited O(W(N+M))。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 1 \leq N \leq 10^5; N-1 \leq M \leq 10^5; 1 \leq U_i \lt V_i \leq N; Any pair of cities can be reached from each other by traversing some roads.; 2 \leq W \leq 10; T,N,M,U_i,V_i,W are integers.; S_i is a string of length W consisting of o, x.; The sum of N over all test cases is at most 10^5.; The sum of M over all test cases is at most 10^5.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/tasks/abc456_e) — source-abc456-e-problem-c3e51b63fd40c2ce2328caafad47b2b781ce1afa77274de1f82ff6145927c238
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/editorial/19849) — source-abc456-editorial-19849-c986ee8612d12ce480a296e55c2761fbd42c85ed54d8d94616a63d4505cc0d52
