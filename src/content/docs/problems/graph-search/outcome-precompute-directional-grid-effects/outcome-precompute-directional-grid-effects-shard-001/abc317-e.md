---
title: "ABC317-E — Avoid Eye Contact"
draft: true
authoringUnit: {"problemId":"abc317-e","docPath":"src/content/docs/problems/graph-search/outcome-precompute-directional-grid-effects/outcome-precompute-directional-grid-effects-shard-001/abc317-e.md","learningOutcomeIds":["outcome-precompute-directional-grid-effects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["方向別grid scanによる長距離効果の前計算の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-directional-grid-effect-scan","tag-state-graph-search"],"sourceRevisionIds":["source-abc317-e-problem-98c0a26c978ed5d74663e63fb19026ffa7ae80e5dad04f4774b3b25c359b48f1","source-abc317-editorial-7031-f26afd576be4da56ed9277fcbd138dafe8c23b558a21ea07ee547bbc54615777"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各rayは壁か人でだけ止まるので走査方向に最後のblockerを覚えると全viewedセルが厳密に決まる。危険セルを通行不可にした残存graphは元の合法移動と一致し単位辺BFSで最短。S/Gも視線遮断物として扱わず公式セル条件を守る。","sourceRevisionIds":["source-abc317-e-problem-98c0a26c978ed5d74663e63fb19026ffa7ae80e5dad04f4774b3b25c359b48f1","source-abc317-editorial-7031-f26afd576be4da56ed9277fcbd138dafe8c23b558a21ea07ee547bbc54615777"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-precompute-directional-grid-effects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"2×3盤面 S.G / >.. 。","procedure":["下段の人は右二セルを監視。","上段には視線がなくS→空→Gが合法。","二歩。"],"executionTarget":null,"expectedResult":"2","verificationStatus":"not_applicable","learningUnitIds":["unit-directional-grid-effect-scan"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-precompute-directional-grid-effects"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"別の人はその後ろの視線を遮るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"遮る。人を空マス同様に透過させると余計な危険セルを作る。"},"answer":{"reasoningOrVerification":"遮る。人を空マス同様に透過させると余計な危険セルを作る。","procedure":["具体例の各状態・寄与を再計算する。","遮る。人を空マス同様に透過させると余計な危険セルを作る。"],"expectedResult":"遮る。人を空マス同様に透過させると余計な危険セルを作る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [方向別grid scanによる長距離効果の前計算](src/content/docs/learn/graph/directional-grid-effect-scan.md)

- 各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 方向別grid scanによる長距離効果の前計算の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

視線に入るかを先に確定できれば、残る問題は各辺コスト1の grid 最短路なので BFS である。視線は壁または人で止まり、S/G や空きマスでは止まらない。 人ごとに長い ray を独立に伸ばす代わりに、各行・各列を四方向から一度ずつ読む。最後に見たblockerの種類だけを持てば各マスを定数回で処理できる。 左から右のscanでは最後のblockerが右向き人なら、その後の空きマスは監視下にある。壁または別の人に会った時点で状態を更新し、残り三方向も同様に処理する。 監視マスは通れないが視線を遮らない。視線を止めるのは # と四種の人だけなので、mark済み空きマスでscanを止めてはいけない。

採用する候補: 行列の四方向scanで監視マスを印付け、そのマスと障害物・人を通行不可にして S から BFS する。

前処理と探索がともに O(HW) で、視線計算と最短路計算の責務を分離できる。

棄却する候補: BFS 中に各候補マスから四方向を逆走し、見張る人がいるか都度調べる。

開けた行列では一移動判定に O(H+W) かかり、全体が O(HW(H+W)) まで悪化する。

左から右のscanでは最後のblockerが右向き人なら、その後の空きマスは監視下にある。壁または別の人に会った時点で状態を更新し、残り三方向も同様に処理する。

監視マスは通れないが視線を遮らない。視線を止めるのは # と四種の人だけなので、mark済み空きマスでscanを止めてはいけない。

viewed を false で作り、各行を左右から、各列を上下から走査する。対応方向を向く人の後で blocker までの . を viewed=true にする。次に #・人・viewed を禁止として S から四近傍 BFS し、G の距離または −1 を出す。

## 典型の発動条件

### ray制約の四方向scan

発動条件: grid 上の直線効果が blocker まで続き、方向種類が定数個のとき。

各行・各列を一方向にscanし、現在activeなrayの有無だけを持って全マスを一度ずつ印付ける。

### 制約前処理＋BFS

発動条件: 移動不能条件が位置だけで決まり、移動ごとに再計算する必要がないとき。

危険マスを静的 obstacle に変換して単位重み最短路を解く。

## 問題固有の要素

監視されたことと視線を遮ることは別属性であり、前者をobstacleとしてBFSに使っても方向別scanのblockerにはしない。

別の問題へ持ち帰る視点: grid 前処理では「入れない」「効果を止める」を同じ boolean に潰さず、意味ごとに分ける。

## 正当性

各rayは壁か人でだけ止まるので走査方向に最後のblockerを覚えると全viewedセルが厳密に決まる。危険セルを通行不可にした残存graphは元の合法移動と一致し単位辺BFSで最短。S/Gも視線遮断物として扱わず公式セル条件を守る。

## 実装上の注意

- S/Gは監視外保証だが方向別scanでは空きマス同様に視線を通す。人のマス自身はviewedにせずとも常にBFS禁止とする。

## 復習の核

- 前処理の blocker 条件と BFS の通行条件を別に列挙する。四方向実装は方向配列で共通化し、端・連続する人をテストする。

## 計算量と制約

### 時間

H×W。四方向視線走査とBFS O(HW)。

### 空間

盤面、視線flag、dist O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 2000; A_{i,j} is ., #, >, v, <, ^, S, or G.; Each of S and G occurs exactly once among A_{i, j}.; Neither the starting point nor the goal is in a person's line of sight.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

2×3盤面 S.G / >.. 。

1. 下段の人は右二セルを監視。
2. 上段には視線がなくS→空→Gが合法。
3. 二歩。

期待される結果: 2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

別の人はその後ろの視線を遮るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

遮る。人を空マス同様に透過させると余計な危険セルを作る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/tasks/abc317_e) — source-abc317-e-problem-98c0a26c978ed5d74663e63fb19026ffa7ae80e5dad04f4774b3b25c359b48f1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/editorial/7031) — source-abc317-editorial-7031-f26afd576be4da56ed9277fcbd138dafe8c23b558a21ea07ee547bbc54615777
