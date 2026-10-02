---
title: "ABC214-H — Collecting"
draft: true
authoringUnit: {"problemId":"abc214-h","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc214-h.md","learningOutcomeIds":["outcome-model-min-cost-flow","outcome-condense-and-order-directed-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow","tag-scc-condensation"],"sourceRevisionIds":["source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418","source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"SCC内は任意点へ戻れるので一度入れば全報酬を回収し縮約可能。DAGの一人経路が一単位flowに対応し頂点splitの報酬辺capacity1で全人を通して報酬を一度だけ得る。無報酬平行辺で再通過は可能。再重み付けは全source–sink flowへ同定数を加えるだけなので最適を変えない。","sourceRevisionIds":["source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418","source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-min-cost-flow","outcome-condense-and-order-directed-graph"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"DAG root1から2,3へ枝、報酬(1,4,7)、K=2。","procedure":["一人を1→2、他を1→3へ。","root報酬1は二人でも一度。","総1+4+7。"],"executionTarget":null,"expectedResult":"12","verificationStatus":"not_applicable","learningUnitIds":["unit-min-cost-flow"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-min-cost-flow","outcome-condense-and-order-directed-graph"],"prerequisiteIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"attainmentCondition":"各人ごとに独立の最大報酬pathを選び報酬を足すと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じ頂点報酬を複数回数え得る。本例なら両人1→3で16と誤るが実際8。"},"answer":{"reasoningOrVerification":"同じ頂点報酬を複数回数え得る。本例なら両人1→3で16と誤るが実際8。","procedure":["具体例の各状態・寄与を再計算する。","同じ頂点報酬を複数回数え得る。本例なら両人1→3で16と誤るが実際8。"],"expectedResult":"同じ頂点報酬を複数回数え得る。本例なら両人1→3で16と誤るが実際8。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ強連結成分へ一度入れば成分内を巡って全ての落とし物を回収できるため、成分を一頂点へ縮約し重みを合計してよい。 縮約後は DAG 上で始点から K 本の経路を選び、どれかの経路が初めて通る頂点の重みだけを一度得る問題になる。 頂点 u の in から out へ、容量 1 の報酬辺と容量無限の無報酬辺を並べると、訪問回数にかかわらず X_u を高々一度だけ獲得できる。 トポロジカル順の重みの prefix sum を使って「通らなかった重み」を費用化すると、負の報酬辺を全て非負費用へ置き換えられる。

棄却する候補: 強連結成分を縮約した後、各人の最良経路を独立に選び、その得点を合計する。

複数人が同じ頂点を訪れても落とし物は一度しか得られず、経路間の重複を独立な最長路では扱えない。

採用する候補: 縮約 DAG の各頂点を入出力に分割し、最初の一単位だけ報酬を得る容量辺と再訪用の辺を置いて K 単位の最小費用流へ帰着する。

各流量が一人の経路に対応し、容量 1 の辺が頂点報酬を全経路を通じて一度だけ数える。

頂点 u の in から out へ、容量 1 の報酬辺と容量無限の無報酬辺を並べると、訪問回数にかかわらず X_u を高々一度だけ獲得できる。

トポロジカル順の重みの prefix sum を使って「通らなかった重み」を費用化すると、負の報酬辺を全て非負費用へ置き換えられる。

SCC 縮約で移動を DAG の経路へ変え、頂点報酬を容量付き node-splitting 辺で共有し、トポロジカル prefix による再重み付け後の最小費用流として K 経路を同時最適化する。

## 典型の発動条件

### SCC 縮約

発動条件: 有向グラフで同一強連結成分内を自由に巡回でき、頂点資源をまとめて回収できるとき。

各成分の落とし物数を合計して一頂点にし、成分間辺だけからなる DAG を構成する。

### 一度だけ得る頂点報酬の最小費用流

発動条件: 複数の経路が頂点を共有できるが、その価値は全経路を通じて一回だけ加算されるとき。

頂点分割後に容量 1 と無限容量の二辺を置き、K 単位の流れで経路と報酬共有を表す。

## 問題固有の要素

全頂点重みを各流量の基準得点とし、経路が飛ばしたトポロジカル区間の重みを費用にすると、答えは K×重み総和から最小費用を引いて復元できる。

別の問題へ持ち帰る視点: 負報酬が最短路処理を難しくするときは、全候補の定数報酬から未取得分を非負費用として引く再表現を探す。

## 正当性

SCC内は任意点へ戻れるので一度入れば全報酬を回収し縮約可能。DAGの一人経路が一単位flowに対応し頂点splitの報酬辺capacity1で全人を通して報酬を一度だけ得る。無報酬平行辺で再通過は可能。再重み付けは全source–sink flowへ同定数を加えるだけなので最適を変えない。

## 実装上の注意

- 縮約後の頂点を始点成分から到達可能な範囲でトポロジカル順に並べ、成分重みと prefix sum の添字を一致させる。
- 容量無限は必要流量 K 以上で十分とし、辺費用と総費用には重み和を保持できる整数型を用いる。

## 復習の核

- 複数人が同じ資源を一度だけ回収する問題では、各人別 DP より先に「最初の一流量だけ安い容量 1 辺」を検討する。
- 負辺除去の式は、一本の経路について取得重みと飛ばした区間費用の和が全重みになることから確認する。

## 計算量と制約

### 時間

元N頂点M辺、SCC数C、縮約辺E、K人。SCC O(N+M)、potential付きmin-cost flow O(K(C+E)log C)。

### 空間

元/縮約graphとnetwork O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq K \leq 10; 1 \leq A_i, B_i \leq N; A_i \neq B_i; A_i \neq A_j or B_i \neq B_j, if i \neq j.; 1 \leq X_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

DAG root1から2,3へ枝、報酬(1,4,7)、K=2。

1. 一人を1→2、他を1→3へ。
2. root報酬1は二人でも一度。
3. 総1+4+7。

期待される結果: 12

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

各人ごとに独立の最大報酬pathを選び報酬を足すと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ頂点報酬を複数回数え得る。本例なら両人1→3で16と誤るが実際8。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2441) — source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_h) — source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e
