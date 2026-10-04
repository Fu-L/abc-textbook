---
title: "ABC259-G — Grid Card Game"
draft: true
authoringUnit: {"problemId":"abc259-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc259-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc259-editorial-4284-a25457dfeead7602125f9196b2951be97642758194bb48f204a4b1fab4a187e5","source-abc259-g-problem-d43876664d61be4e70a53399cdfc70d319194144c438ac4a2ee97ee5efc1ed1c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"行はT側、列はS側を選択とする。正cellの未獲得だけR→C有限cut、負cellの各単独選択費用はsource/ sink単項へ入り、負cell両選択はC→R INFで禁止。全正利益からcutを引くと元得点に一致する。0選択得点0があり大失敗は最適でないためINF化が安全。","sourceRevisionIds":["source-abc259-editorial-4284-a25457dfeead7602125f9196b2951be97642758194bb48f204a4b1fab4a187e5","source-abc259-g-problem-d43876664d61be4e70a53399cdfc70d319194144c438ac4a2ee97ee5efc1ed1c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

行と列を何も選ばなければ得点0なので、−10^100の大失敗を含む選択は最適にならない。従って負のマスで行と列を同時に選ぶ組合せは、禁止制約として扱える。正のマスを全て獲得したΣ+を基準にすると、最大化は『取り逃した正値』『獲得した負値』『大失敗』による減点を最小化する問題へ変わる。これらは行・列の二値選択に対する単項費用と組合せ費用である。cutでR_iがT側なら行iを選択、C_jがS側なら列jを選択と対応させる。S→R_iは行選択時の負値総和、C_j→Tは列選択時の負値総和を課す。A_ij>0ではR_i→C_jに容量A_ijを置くと、行も列も非選択のときだけ辺がS側からT側へ切れて取り逃しを払う。A_ij<0ではC_j→R_iを無限容量にすると、行・列の同時選択だけが禁止される。

棄却する候補: H個の行またはW個の列の選択を全列挙し、残り側の最善選択を評価する。

H,Wはともに100まであり、片側だけでも2^100通りになる。

採用する候補: Σ+からの減点をs-t cutの容量として表し、最小カットを最大流で求める。

行・列の選択側をcutの所属で表すと、正値の取り逃しは有限辺、負値上の同時選択禁止は無限容量辺として正確に符号化できる。

S,T、行頂点R_i、列頂点C_jを作る。S→R_iへ行内負値の絶対値和、C_j→Tへ列内負値の絶対値和を張る。正マスはR_i→C_jへA_ij、負マスはC_j→R_iへ十分大きい容量を張る。答えはΣ+−最大流、すなわちΣ+−最小カット容量である。

## 典型の発動条件

### 利益最大化から損失最小化への基準移動

発動条件: 正負の利益が混在する二値選択で、全ての正利益を得た仮想状態からの逸失として費用を書けるとき。

全正値和Σ+を先に得たとみなし、各選択による減点だけをcut容量へ割り当てる。

### 二値選択の最小s-t cut

発動条件: 変数ごとの単項費用と、二変数の特定組合せへの非負費用・禁止制約を有向辺で表せるとき。

行・列の選択をcutの所属に対応させ、減点が発生する所属パターンだけで辺が切れるネットワークを作る。

## 問題固有の要素

負マスの絶対値を行と列の両方の単項費用へ入れても、無限容量辺が同時選択を禁じるため二重払いは起きない。この禁止制約が単項化を成立させる。

別の問題へ持ち帰る視点: 相互作用費用を変数ごとへ配るときは、二重計上する組合せが別の制約で不可能になっていないかを確認するとcut表現が簡単になる。

## 正当性

行はT側、列はS側を選択とする。正cellの未獲得だけR→C有限cut、負cellの各単独選択費用はsource/ sink単項へ入り、負cell両選択はC→R INFで禁止。全正利益からcutを引くと元得点に一致する。0選択得点0があり大失敗は最適でないためINF化が安全。

## 実装上の注意

- 無限容量は、全ての有限減点の総和より大きい64bit整数にする。Σ+、行列の負値和、最大流も64bitで保持する。
- R_iとC_jでは『選択』に対応するcut側が逆である。四つの選択組合せごとに各有向辺が切れる条件を表にして向きを検算する。

## 復習の核

- ネットワーク図だけで済ませず、R_i・C_jの各cut側が選択のどちらを表すかを宣言し、正マスの四場合と負マスの同時選択で切断容量が目的の減点に一致するかを確認する。

## 計算量と制約

### 時間

行H列W。network V=H+W+2、E=O(HW)、一般Dinic O((H+W)²HW)。

### 空間

network O(HW+H+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W \leq 100; -10^9 \leq A_{i, j} \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/editorial/4284) — source-abc259-editorial-4284-a25457dfeead7602125f9196b2951be97642758194bb48f204a4b1fab4a187e5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/tasks/abc259_g) — source-abc259-g-problem-d43876664d61be4e70a53399cdfc70d319194144c438ac4a2ee97ee5efc1ed1c
