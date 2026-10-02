---
title: "ABC437-G — Colorful Christmas Tree"
draft: true
authoringUnit: {"problemId":"abc437-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-002/abc437-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-constructive-witness","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut","tag-bipartite-structure","tag-constructive-witness"],"sourceRevisionIds":["source-abc437-editorial-14853-197af7e234e4b81d38f7ac3947a0bb5c0a18a1e7ee825eb297ebe1d177e2448c","source-abc437-g-problem-64f2258936d02bfced674b6c373b752285b1aae4d20e67c04c8c38dd671d8230"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各頂点のdegree回の色列は初期色と循環規則で固定。flowは各辺へ異色対を割当て頂点別色使用数を満たす。木の葉での次数保存を順に使うと各元辺の総flowは1となる。公式の葉からの順序存在論により現在色に合う辺が必ず一つあり、その辺を消して同不変条件を残せるので割当から全操作を復元できる。","sourceRevisionIds":["source-abc437-editorial-14853-197af7e234e4b81d38f7ac3947a0bb5c0a18a1e7ee825eb297ebe1d177e2448c","source-abc437-g-problem-64f2258936d02bfced674b6c373b752285b1aae4d20e67c04c8c38dd671d8230"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、色(R,G,R)、辺番号1=1–2,2=2–3。","procedure":["辺1はR/Gで削除可、色は(G,B,R)。","残り辺2はB/Rで削除可。","全辺を消す。"],"executionTarget":null,"expectedResult":"Yes、順序1,2","verificationStatus":"not_applicable","learningUnitIds":["unit-max-flow-min-cut"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"prerequisiteIds":["unit-bipartite-structure","unit-constructive-witness","unit-state-graph-search"],"attainmentCondition":"全頂点初期Rなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"初手で異色端点辺が一つもなくNo。最終色数だけでなく異色pair制約が必要。"},"answer":{"reasoningOrVerification":"初手で異色端点辺が一つもなくNo。最終色数だけでなく異色pair制約が必要。","procedure":["具体例の各状態・寄与を再計算する。","初手で異色端点辺が一つもなくNo。最終色数だけでなく異色pair制約が必要。"],"expectedResult":"初手で異色端点辺が一つもなくNo。最終色数だけでなく異色pair制約が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)
- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

木は二部グラフで、各辺を削除する瞬間の両端色は異なる必要がある。さらに各頂点 v が各色 k で担当する削除回数 A_{v,k} は色変化規則からあらかじめ決まる。 source→左(v,k) と右(v,k)→sink の容量 A_{v,k} が各頂点色の使用回数を表し、木辺に対応する k≠k' の容量1辺が削除時の両端色を表す。 整数最大流が N-1 なら各木辺にちょうど一つの色対を割り当てられる。 木ではこの静的割当を満たす削除順が必ず存在する。可能な初手がないと仮定し葉から根へ色条件を伝播すると根で矛盾するためである。

採用する候補: 木を二部彩色し、左頂点の (v,k) から右頂点の (u,k') へ k≠k' の辺削除割当を流す最大流を構築する。

流量 N-1 なら全辺へ端点色の組を一つずつ割り当て、頂点ごとの色別回数制約も容量で同時に満たせる。

棄却する候補: 現在削除可能な辺を任意に選ぶ貪欲を繰り返す。

局所選択が将来必要な頂点色回数を消費し、残りの辺を削除不能にする可能性を判定できない。

source→左(v,k) と右(v,k)→sink の容量 A_{v,k} が各頂点色の使用回数を表し、木辺に対応する k≠k' の容量1辺が削除時の両端色を表す。

整数最大流が N-1 なら各木辺にちょうど一つの色対を割り当てられる。

木ではこの静的割当を満たす削除順が必ず存在する。可能な初手がないと仮定し葉から根へ色条件を伝播すると根で矛盾するためである。

木を二部彩色し、3N+2 頂点のネットワークを作る。各元辺 u-v について左右の向きを揃え、異色9組中 k1≠k2 の6辺を容量1で張る。最大流が N-1 でなければ不可能。流れた色対を各木辺へ記録し、残存辺を走査して現在色と一致する削除可能辺を一つずつ選び、色更新しながら操作列を構成する。

## 典型の発動条件

### 制約付き辺割当の最大流

発動条件: 各辺へ両端ラベルの組を割り当て、頂点ごとのラベル使用回数を満たしたいとき。

左側の供給容量、辺ごとの互換遷移、右側の需要容量として三層 flow にする。

### 二部彩色

発動条件: 木辺の両端に関する割当を一方向の flow network に統一したいとき。

木を左右集合へ分け、全元辺を左から右へ向ける。

### 静的割当から操作順の復元

発動条件: 各操作時の局所状態を先に各辺へ割り当て、後から実行順の存在を示せるとき。

葉から根の背理法により常に少なくとも一つ実行可能辺があることを保証する。

## 問題固有の要素

時系列の色変化を直接探索せず、各辺が削除時に使う色対の総量条件を flow で先に固定できる。

別の問題へ持ち帰る視点: 木構造では局所状態の静的割当が整合すれば、葉を使った議論で実行可能な順序へ線形化できることがある。

## 正当性

各頂点のdegree回の色列は初期色と循環規則で固定。flowは各辺へ異色対を割当て頂点別色使用数を満たす。木の葉での次数保存を順に使うと各元辺の総flowは1となる。公式の葉からの順序存在論により現在色に合う辺が必ず一つあり、その辺を消して同不変条件を残せるので割当から全操作を復元できる。

## 実装上の注意

- A_{v,k} の算出と初期色更新規則を一致させる。流れた元辺色対を一意に復元し、操作シミュレーションで現在色が割当色と一致した辺だけ削除する。

## 復習の核

- 流量 N-1 が全木辺への一対一割当に対応することと、静的割当から常に次の削除辺が存在する証明を確認する。

## 計算量と制約

### 時間

N木頂点、V=3N+2,E=O(N)。flow上限N−1、単位cross容量のaugment実装 O(N²)、操作順復元の全辺走査O(N²)。

### 空間

network、各辺色対、色と出力 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 20000; 2\leq N\leq 2000; c_i is R, G, or B.; 1\leq u_i,v_i\leq N; When viewing the bulbs as vertices and the ribbons as edges, the given graph is a tree.; T,N,u_i,v_i are integers.; The sum of N^2 in one input file is at most 2000^2.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、色(R,G,R)、辺番号1=1–2,2=2–3。

1. 辺1はR/Gで削除可、色は(G,B,R)。
2. 残り辺2はB/Rで削除可。
3. 全辺を消す。

期待される結果: Yes、順序1,2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全頂点初期Rなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

初手で異色端点辺が一つもなくNo。最終色数だけでなく異色pair制約が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/editorial/14853) — source-abc437-editorial-14853-197af7e234e4b81d38f7ac3947a0bb5c0a18a1e7ee825eb297ebe1d177e2448c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/tasks/abc437_g) — source-abc437-g-problem-64f2258936d02bfced674b6c373b752285b1aae4d20e67c04c8c38dd671d8230
