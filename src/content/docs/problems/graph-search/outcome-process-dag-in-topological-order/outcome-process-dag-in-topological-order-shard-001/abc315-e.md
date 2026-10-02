---
title: "ABC315-E — Prerequisites"
draft: true
authoringUnit: {"problemId":"abc315-e","docPath":"src/content/docs/problems/graph-search/outcome-process-dag-in-topological-order/outcome-process-dag-in-topological-order-shard-001/abc315-e.md","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dag-topological-processing"],"sourceRevisionIds":["source-abc315-e-problem-746510fe523d6206c9704c9bc4663caf3f35c2e5369ba36984004381f97f11ed","source-abc315-editorial-6989-65329880be8ffdf3bbd6f96ad076c13c71c69b7fb34114edd01acb4deec7de6f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"1から前提辺を辿ると必要本だけを列挙する。DAGでのDFS postorderでは辺i→pのpが必ずiより先に記録され、既訪問も既に完了かDAG上の依存順に含まれる。根1を除けば必要本を各一回、前提を先に読む順に出力する。","sourceRevisionIds":["source-abc315-e-problem-746510fe523d6206c9704c9bc4663caf3f35c2e5369ba36984004381f97f11ed","source-abc315-editorial-6989-65329880be8ffdf3bbd6f96ad076c13c71c69b7fb34114edd01acb4deec7de6f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"本1の前提2,3、本2の前提4、本3の前提4。","procedure":["DFS1→2→4で4,2を記録。","3では4は既訪問、3を記録。","最後の1を除く。"],"executionTarget":null,"expectedResult":"読書順4,2,3","verificationStatus":"not_applicable","learningUnitIds":["unit-dag-topological-processing"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-process-dag-in-topological-order"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"postorderを逆順に出力するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"逆にしない。辺は本→前提なのでpostorderがそのまま前提優先の順。"},"answer":{"reasoningOrVerification":"逆にしない。辺は本→前提なのでpostorderがそのまま前提優先の順。","procedure":["具体例の各状態・寄与を再計算する。","逆にしない。辺は本→前提なのでpostorderがそのまま前提優先の順。"],"expectedResult":"逆にしない。辺は本→前提なのでpostorderがそのまま前提優先の順。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

本 i から前提 P_{i,j} へ有向辺を張ると、本1に必要な集合は頂点1から到達可能な頂点と一致する。全書籍を読める保証から依存関係には cycle がない。 辺の向きは「本→先に読む前提」なので、そのままの DFS postorder なら前提を出力してから本へ戻り、必要集合内の読書順になる。 「最小冊数」は選択最適化ではなく、推移的な全前提が必須なので到達可能集合として一意に決まる。 一般の topological order との向きを混同せず、i→prerequisite の graph では DFS の finish order が読む順になる。

採用する候補: 頂点1から依存先へ DFS し、各頂点を帰りがけに記録する postorder を出力する。

到達可能集合だけを訪れ、全辺 i→p について p が i より先に記録されるので集合抽出と順序付けを同時に行える。

棄却する候補: 全 N 冊をトポロジカル sort し、その後で本1に必要かを別に判定する。

正解にはなるが不要な頂点まで処理・filter する二段構成で、依存先 DFS の postorder だけで十分である。

「最小冊数」は選択最適化ではなく、推移的な全前提が必須なので到達可能集合として一意に決まる。

一般の topological order との向きを混同せず、i→prerequisite の graph では DFS の finish order が読む順になる。

visited[1]=true から DFS/BFS で依存辺をたどる。DFS なら各子の探索後に v を answer へ push し、最後に根1だけを除いた列をそのまま出力する。再帰を避けるなら enter/exit を持つ明示 stack で postorder を作る。

## 典型の発動条件

### 依存 DAG の到達閉包

発動条件: ある対象を実行するために必要な前提すべてを最小集合として求めるとき。

対象から prerequisite 辺をたどった reachable set を採用する。

### DFS postorder による依存順

発動条件: 辺がタスクからその前提へ向いている DAG で、前提を先に並べたいとき。

探索終了時に記録して各 prerequisite を利用側より前へ置く。

## 問題固有の要素

問題文が「必要集合は一意」と述べる理由は、前提のどれかを選ぶのではなく AND 条件で推移閉包全体が強制されるからである。

別の問題へ持ち帰る視点: 依存問題では edge が AND/OR のどちらかを判別すると、最小集合が探索だけか最適化かを切り分けられる。

## 正当性

1から前提辺を辿ると必要本だけを列挙する。DAGでのDFS postorderでは辺i→pのpが必ずiより先に記録され、既訪問も既に完了かDAG上の依存順に含まれる。根1を除けば必要本を各一回、前提を先に読む順に出力する。

## 実装上の注意

- N=2×10^5 なので言語によっては再帰深度を回避する。共有前提を一度だけ出力し、頂点1自身は postorder から除く。

## 復習の核

- 辺の向きを紙に一つ書き、preorder/postorder/reverse のどれが前提先行になるか確かめる。集合の最小性は到達頂点が全て必須であることから説明する。

## 計算量と制約

### 時間

本数N、前提辺M。必要部分だけDFSは O(N+M) の範囲。

### 空間

隣接、visited、明示stack、出力 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq C_i < N; \sum_{i=1}^{N} C_i \leq 2 \times 10^5; C_1 \geq 1; 1 \leq P_{i,j} \leq N; P_{i,j} \neq P_{i,k} for 1 \leq j < k \leq C_i.; It is possible to read all the books.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

本1の前提2,3、本2の前提4、本3の前提4。

1. DFS1→2→4で4,2を記録。
2. 3では4は既訪問、3を記録。
3. 最後の1を除く。

期待される結果: 読書順4,2,3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

postorderを逆順に出力するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

逆にしない。辺は本→前提なのでpostorderがそのまま前提優先の順。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/tasks/abc315_e) — source-abc315-e-problem-746510fe523d6206c9704c9bc4663caf3f35c2e5369ba36984004381f97f11ed
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/editorial/6989) — source-abc315-editorial-6989-65329880be8ffdf3bbd6f96ad076c13c71c69b7fb34114edd01acb4deec7de6f
