---
title: "ABC361-G — Go Territory"
draft: true
authoringUnit: {"problemId":"abc361-g","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc361-g.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-event-sweep"],"sourceRevisionIds":["source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b","source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"石から離れた空格子では内外状態が変わらず、境界に必要な情報は石近傍だけ。距離2までの石成分をまとめると近接境界の内外判定を独立処理で壊さない。四近傍外側探索から作る符号eventを行順に足したnesting depthが正な区間だけを内部として数え、長い空区間は座標差で一括集計する。","sourceRevisionIds":["source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b","source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-select-state-graph-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"石(0,1),(1,0),(1,2),(2,1)の四個。","procedure":["中央空点(1,1)は四neighborが全て石。","それ以外の周辺空点は外へ歩ける。","囲まれた空点は中央だけ。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-state-graph-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-select-state-graph-search"],"prerequisiteIds":["unit-event-sweep"],"attainmentCondition":"石が斜めに接するだけでは4近傍空点を遮れないか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"遮れる場合がある。上例は石同士が斜め接触し中央を閉じるので8近傍境界を扱う。"},"answer":{"reasoningOrVerification":"遮れる場合がある。上例は石同士が斜め接触し中央を閉じるので8近傍境界を扱う。","procedure":["具体例の各状態・寄与を再計算する。","遮れる場合がある。上例は石同士が斜め接触し中央を閉じるので8近傍境界を扱う。"],"expectedResult":"遮れる場合がある。上例は石同士が斜め接触し中央を閉じるので8近傍境界を扱う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

石のない格子点が領域内かは、四近傍で基準点(−1,−1)へ到達できるかで決まる。ただし無限平面全体を探索する必要はなく、状態が変わるのは石の周辺だけである。 複数の石成分が入れ子になると、行上の内外は単純な一回の反転では足りない。外→内でnesting depthを増やし、内→外で減らす境界eventとして合成する必要がある。 石が8近傍でつながる場合は周囲8マスだけを候補graphにし、最左下側の外点から四近傍探索すると境界付近の外側を識別できる。 別成分が近くて内外情報を上書きしないよう、Chebyshev距離2以下の石まで同じ処理成分へまとめてから境界eventを作る。

採用する候補: 近接する石を成分化し、石周囲の空点で内外を判定してから、行ごとの境界eventをnesting depth付きで走査する。

有限個の石周辺だけで境界の向きを取得し、長い内部区間は座標差でまとめて数えられる。

棄却する候補: 座標上限を越える十分大きな長方形gridを確保し、全空点をflood fillする。

二次元座標範囲の面積が巨大で、石が疎でも全cellを用意できない。

石が8近傍でつながる場合は周囲8マスだけを候補graphにし、最左下側の外点から四近傍探索すると境界付近の外側を識別できる。

別成分が近くて内外情報を上書きしないよう、Chebyshev距離2以下の石まで同じ処理成分へまとめてから境界eventを作る。

石を近傍探索可能な集合に入れ、Chebyshev距離2以内を辺とする成分を列挙する。各成分で石の周囲空点を集め、外側基準から四近傍BFSして周辺点の内外を分類する。各行へ外→石列→内を+1、内→石列→外を−1のeventとして置き、x順にnesting depthを更新し、depth>0の石でない格子点数を区間長で加える。

## 典型の発動条件

### 障害物境界だけの疎なflood fill

発動条件: 無限または巨大gridで障害物数だけが少ない到達不能領域を求めるとき。

障害物周囲の候補点に探索を限定して境界の内外を判定する。

### 走査線と入れ子depth

発動条件: 複数の閉境界が包含関係を持ち、単純parityでなく向き付き遷移を合成するとき。

行ごとの境界eventを順に足し、正のdepth区間を内部として数える。

## 問題固有の要素

面積を埋める代わりに境界周辺だけでtopologyを決め、内部の広さは行区間の長さとして算術的に加える。

別の問題へ持ち帰る視点: 疎な障害物による巨大領域では、探索対象を面から境界へ落とせないか考える。

## 正当性

石から離れた空格子では内外状態が変わらず、境界に必要な情報は石近傍だけ。距離2までの石成分をまとめると近接境界の内外判定を独立処理で壊さない。四近傍外側探索から作る符号eventを行順に足したnesting depthが正な区間だけを内部として数え、長い空区間は座標差で一括集計する。

## 実装上の注意

- 8近傍連結だけでなく距離2の異成分を統合する条件を実装する。石自身を答えから除き、同じ行・座標のevent順と連続する石列を正規化する。

## 復習の核

- 単一輪、接触する輪、輪の入れ子を別々に描き、周辺空点の内外と行eventの符号を追う。成分統合距離は公式条件どおりか小例で検査する。

## 計算量と制約

### 時間

石数N、近傍候補O(N)。hash近傍探索expected O(N)、行event sort O(N log N)、全体expected O(N log N)。balanced mapなら同漸近log。

### 空間

石近傍graph、境界event O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 0 \leq N \leq 2 \times 10^5; 0 \leq X_i, Y_i \leq 2 \times 10^5; The pairs (X_i, Y_i) are distinct.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

石(0,1),(1,0),(1,2),(2,1)の四個。

1. 中央空点(1,1)は四neighborが全て石。
2. それ以外の周辺空点は外へ歩ける。
3. 囲まれた空点は中央だけ。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

石が斜めに接するだけでは4近傍空点を遮れないか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

遮れる場合がある。上例は石同士が斜め接触し中央を閉じるので8近傍境界を扱う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/editorial/10355) — source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/tasks/abc361_g) — source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51
