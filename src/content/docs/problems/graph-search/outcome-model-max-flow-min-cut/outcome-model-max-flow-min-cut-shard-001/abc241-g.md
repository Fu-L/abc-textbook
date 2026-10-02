---
title: "ABC241-G — Round Robin"
draft: true
authoringUnit: {"problemId":"abc241-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc241-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc241-editorial-3452-f18fa1bc0cea4f5a85bf1f8aa2f537ebd132d8b6b8d079fe7275eb1c7ba4030e","source-abc241-g-problem-e55b95c326721c0417f3cb31af3e1908ab5e7bbfa1f46f703cbd827b346c5a7a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"候補pに残り直接対戦を全勝させてもpの優勝可能性を失わない。各未決試合は勝者一人を選ぶ整数flow、他選手容量win_p−1が単独優勝を強制する。全試合flowが流れるなら合法結果を復元でき、逆に優勝結果は全容量を満たす。","sourceRevisionIds":["source-abc241-editorial-3452-f18fa1bc0cea4f5a85bf1f8aa2f537ebd132d8b6b8d079fe7275eb1c7ba4030e","source-abc241-g-problem-e55b95c326721c0417f3cb31af3e1908ab5e7bbfa1f46f703cbd827b346c5a7a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3選手、まだ全3試合未決、候補1。","procedure":["1対2,1対3を1勝に固定しwin1=2。","残り2対3はどちら勝ちでも一人1勝。","他容量1を満たす。"],"executionTarget":null,"expectedResult":"候補1は単独優勝可能","verificationStatus":"not_applicable","learningUnitIds":["unit-max-flow-min-cut"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"他選手capacityをwin_pにしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。同率優勝を許す。単独優勝なのでwin_p−1。"},"answer":{"reasoningOrVerification":"不可。同率優勝を許す。単独優勝なのでwin_p−1。","procedure":["具体例の各状態・寄与を再計算する。","不可。同率優勝を許す。単独優勝なのでwin_p−1。"],"expectedResult":"不可。同率優勝を許す。単独優勝なのでwin_p−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

候補 p が単独優勝できる completion があるなら、未消化の p の試合を全て p 勝利へ変えても p の勝数だけが増え相手は減るので、単独優勝は壊れない。まず p の最終勝数 win を最大に固定してよい。 残る各試合は勝者を二人のどちらかへ一勝として割り当て、各 i≠p の合計勝数を win-1 以下に抑える配分問題になる。 既に終了した試合 node は実際の winner だけへ、未終了試合 node は両 player へ辺を張れば、fixed result と自由選択を同じ network で扱える。

採用する候補: 試合 node へ source から1流し、可能な winner の player node を経て各選手の勝数上限へ流す max-flow feasibility を p ごとに判定する。

一試合一勝の選択と選手別 capacity を整数 flow がそのまま表し、全試合分を流せることが必要十分になる。

棄却する候補: 未消化試合の勝敗を全列挙し、最終勝数を比較する。

未消化試合は最大 N(N-1)/2 個あり、二択の全列挙はできない。

既に終了した試合 node は実際の winner だけへ、未終了試合 node は両 player へ辺を張れば、fixed result と自由選択を同じ network で扱える。

各 p について未終了の p 戦を p 勝利に固定して win を数える。source→全試合 node に容量1、試合→許される winner、player p→sink に win、他 player→sink に win-1 を置き、全試合数だけ flow が流れれば p を出力する。

## 典型の発動条件

### 割当問題の max-flow 化

発動条件: 各 item を候補先の一つへ割り当て、各受け手に上限があるとき。

source-item-recipient-sink の層 graph で item の単位流と recipient capacity を表す。

### 候補解の有利な正規化

発動条件: ある候補を最適にできるか判定し、その候補に有利な未確定選択へ変えても実現可能性を失わないとき。

候補自身の未確定試合を全勝に固定し、他者の上限だけを feasibility 条件にする。

## 問題固有の要素

単独優勝の strict 条件は、候補の勝数 win を固定すると他選手ごとの容量 win-1 という独立な上限制約になる。

別の問題へ持ち帰る視点: strict な最大者の存在判定では候補値を先に固定し、他者を候補値-1以下へ配る問題に変える。

## 正当性

候補pに残り直接対戦を全勝させてもpの優勝可能性を失わない。各未決試合は勝者一人を選ぶ整数flow、他選手容量win_p−1が単独優勝を強制する。全試合flowが流れるなら合法結果を復元でき、逆に優勝結果は全容量を満たす。

## 実装上の注意

- win=0 では他選手上限が負になるため即不可能とする。終了済み試合の向きを誤らず、最大 flow が全試合 node 数と一致するかで判定する。

## 復習の核

- 候補 p が負ける未確定試合を p 勝ちへ反転したとき、p と相手以外を含め順位条件が悪化しないことを先に証明する。

## 計算量と制約

### 時間

N選手。候補ごとV=O(N²),E=O(N²)、総flow F=O(N²)。単純augment O(FE)を用いる安全上界は全候補O(N⁵)、一般DinicならO(N⁷)の粗い上界。

### 空間

一候補network O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 50; 0\leq M \leq \frac{N(N-1)}{2}; 1\leq W_i,L_i\leq N; W_i \neq L_i; If i\neq j, then (W_i,L_i) \neq (W_j,L_j).; (W_i,L_i) \neq (L_j,W_j); All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3選手、まだ全3試合未決、候補1。

1. 1対2,1対3を1勝に固定しwin1=2。
2. 残り2対3はどちら勝ちでも一人1勝。
3. 他容量1を満たす。

期待される結果: 候補1は単独優勝可能

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

他選手capacityをwin_pにしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。同率優勝を許す。単独優勝なのでwin_p−1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/editorial/3452) — source-abc241-editorial-3452-f18fa1bc0cea4f5a85bf1f8aa2f537ebd132d8b6b8d079fe7275eb1c7ba4030e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/tasks/abc241_g) — source-abc241-g-problem-e55b95c326721c0417f3cb31af3e1908ab5e7bbfa1f46f703cbd827b346c5a7a
