---
title: "ABC291-E — Find Permutation"
draft: true
authoringUnit: {"problemId":"abc291-e","docPath":"src/content/docs/problems/graph-search/outcome-process-dag-in-topological-order/outcome-process-dag-in-topological-order-shard-001/abc291-e.md","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dag-topological-processing"],"sourceRevisionIds":["source-abc291-e-problem-b4aa6695652e76710d85f04edb8fe4142c9a223d035e21a448bd784511ebbdef","source-abc291-editorial-5839-75dbcb01785be767795015ac01a55f88d3edeac3073ff634fb07b2dd0451dce9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各段の入次数0は次に置ける要素。二候補ならどちら先でも残りのtopological orderを完成でき順序非一意。全段一候補なら選択が強制され一意。取り出し数N未満ならcycleで順序が存在しない。得た順序の逆対応が要求順位列。","sourceRevisionIds":["source-abc291-e-problem-b4aa6695652e76710d85f04edb8fe4142c9a223d035e21a448bd784511ebbdef","source-abc291-editorial-5839-75dbcb01785be767795015ac01a55f88d3edeac3073ff634fb07b2dd0451dce9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"制約1<2、2<3。","procedure":["初期候補は1だけ。","1を消すと2だけ、次に3だけ。","各頂点の順位を1,2,3へ置く。"],"executionTarget":null,"expectedResult":"Yes、順位(1,2,3)","verificationStatus":"not_applicable","learningUnitIds":["unit-dag-topological-processing"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"制約1<3,2<3だけなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"初期候補1,2の二つで非一意。No。"},"answer":{"reasoningOrVerification":"初期候補1,2の二つで非一意。No。","procedure":["具体例の各状態・寄与を再計算する。","初期候補1,2の二つで非一意。No。"],"expectedResult":"初期候補1,2の二つで非一意。No。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)

- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

大小制約X_i<Y_iは有向辺X_i→Y_iとみなせ、条件を満たす順列はこのDAGのトポロジカル順序と一対一に対応する。 ある段階で入次数0が二頂点以上ならどちらを先にしても順序が作れ、常に一頂点なら選択の余地がない。

採用する候補: Kahn法で各段階の入次数0頂点が一つか検査

トポロジカル順序が一意である必要十分条件を探索中の候補数として直接判定し、その順序から各値を復元できる。

棄却する候補: 任意のトポロジカル順序を一つ求める

一解の存在は保証されるが、別順序の有無を判定できない。

ある段階で入次数0が二頂点以上ならどちらを先にしても順序が作れ、常に一頂点なら選択の余地がない。

入次数0集合を用いるKahn法を行い、各段階で候補がちょうど一つか確認しながら順序Pを作り、A[P_i]=iを出力する。

## 典型の発動条件

### 一意なトポロジカルソート

発動条件: DAGの線形拡張が一意かを知りたい。

入次数0集合のサイズを毎段階確認する。

### 順序から順位への逆写像

発動条件: 頂点列Pが大小順位を表す。

A[P_i]=iとして要求順列を構成する。

## 問題固有の要素

順列制約の一意性を値の推測でなくDAGの線形拡張一意性へ置き換える。

別の問題へ持ち帰る視点: 全順序制約はDAG化し、Kahn法の選択肢数で一意性を調べる。

## 正当性

各段の入次数0は次に置ける要素。二候補ならどちら先でも残りのtopological orderを完成でき順序非一意。全段一候補なら選択が強制され一意。取り出し数N未満ならcycleで順序が存在しない。得た順序の逆対応が要求順位列。

## 実装上の注意

- 候補集合サイズは取り出す直前に判定し、得た頂点順とAへの逆写像を混同しない。

## 復習の核

- 小DAGの全トポロジカル順列と比較し、途中だけ候補が二つになる例と完全鎖を確認する。

## 計算量と制約

### 時間

N 頂点、M 制約。Kahn法 O(N+M)。

### 空間

隣接、入次数、queueと順列 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1\leq X_i,Y_i \leq N; All values in the input are integers.; There is an A consistent with the input.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

制約1<2、2<3。

1. 初期候補は1だけ。
2. 1を消すと2だけ、次に3だけ。
3. 各頂点の順位を1,2,3へ置く。

期待される結果: Yes、順位(1,2,3)

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

制約1<3,2<3だけなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

初期候補1,2の二つで非一意。No。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/tasks/abc291_e) — source-abc291-e-problem-b4aa6695652e76710d85f04edb8fe4142c9a223d035e21a448bd784511ebbdef
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/editorial/5839) — source-abc291-editorial-5839-75dbcb01785be767795015ac01a55f88d3edeac3073ff634fb07b2dd0451dce9
