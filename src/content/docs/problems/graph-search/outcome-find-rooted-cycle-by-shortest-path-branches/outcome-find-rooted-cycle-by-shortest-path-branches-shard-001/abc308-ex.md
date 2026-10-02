---
title: "ABC308-EX — Make Q"
draft: true
authoringUnit: {"problemId":"abc308-ex","docPath":"src/content/docs/problems/graph-search/outcome-find-rooted-cycle-by-shortest-path-branches/outcome-find-rooted-cycle-by-shortest-path-branches-shard-001/abc308-ex.md","learningOutcomeIds":["outcome-find-rooted-cycle-by-shortest-path-branches"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-shortest-path-reconstruction","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-shortest-path-certificate"],"sourceRevisionIds":["source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8","source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"a-rooted shortest treeの異branch辺は二root pathと合わせsimple cycleを作る。任意a-cycleは異branch辺を含み、その両側を最短tree pathへ置換して重みを増やさない。tailがcycleのa隣接辺と衝突する場合はその辺を除いたoracleで検査し、attachmentとtail候補を全て覆うことで最適cycle-with-tailを得る。","sourceRevisionIds":["source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8","source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-find-rooted-cycle-by-shortest-path-branches"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三角形1–2,2–3,3–1が各重み1、tail辺1–4重み2。","procedure":["attachment1のminimum cycleは1–2–3–1、重み3。","tail1–4はcycle外。","合計3+2。"],"executionTarget":null,"expectedResult":"最小Q重み5","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-find-rooted-cycle-by-shortest-path-branches"],"prerequisiteIds":["unit-shortest-path-reconstruction","unit-state-graph-search"],"attainmentCondition":"tail端点をcycleの隣接点2にして同じ辺1–2を使ってよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。cycleとtailの辺が重複する。対象辺をcycle oracleから除外した候補が必要。"},"answer":{"reasoningOrVerification":"不可。cycleとtailの辺が重複する。対象辺をcycle oracleから除外した候補が必要。","procedure":["具体例の各状態・寄与を再計算する。","不可。cycleとtailの辺が重複する。対象辺をcycle oracleから除外した候補が必要。"],"expectedResult":"不可。cycleとtailの辺が重複する。対象辺をcycle oracleから除外した候補が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 根からの最短路木で第一枝の異なる頂点を結ぶ辺を列挙し、二本の木上経路と合わせて根を通る最小閉路を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路を証明する木・経路の復元](src/content/docs/learn/graph/shortest-path-reconstruction.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Qのtail edgeがcycle vertex aからdへ出るとし、cycleでaに隣接するverticesをb,cとすると、本質的制約はd≠b,cまで緩和できる。 固定aのminimum cycleはa-rooted shortest path treeでfirst branch labelsを付け、異なるbranchesを結ぶedgeと二root pathsを合わせた候補のminimumとして得られる。 異branch edge(u,v)はtree paths a→u,a→vと合わせてsimple cycleを作り、任意のa-cycleにも異branch edgeが含まれるためshortest-tree replacementでminimum性が示せる。 baseline cycleのa-b/a-c edgeをtailにしたい場合、そのedgeをcycleから除いてminimum a-cycleを再計算すればtailとcycleのedge重複を防げる。

棄却する候補: 全simple cyclesとincident tail edgeを列挙する。

simple cyclesは指数個存在し得る。

採用する候補: aを全探索し、minimum cycleとそのa-neighborsを求め、通常tail候補およびcycle incident edgeをtailにする二つのedge-deletion caseを評価する。

最適Qのa,b,c,dを全ケースで覆い、各rootのcycle計算をdense O(N^2)で行って全体O(N^3)となる。

異branch edge(u,v)はtree paths a→u,a→vと合わせてsimple cycleを作り、任意のa-cycleにも異branch edgeが含まれるためshortest-tree replacementでminimum性が示せる。

baseline cycleのa-b/a-c edgeをtailにしたい場合、そのedgeをcycleから除いてminimum a-cycleを再計算すればtailとcycleのedge重複を防げる。

cycle-with-tail subgraph optimizationをattachment vertexごとに分け、shortest-path-tree branch crossingによるminimum rooted cycle oracleで解く。

## 典型の発動条件

### 最短路木からのrooted minimum cycle

発動条件: positive weighted undirected graphで指定rootを含むminimum cycleが必要なとき。

root children別にverticesをlabelし、異label endpointsのedge+両distanceを最小化する。

### 構成edgeの役割別case分け

発動条件: 同じincident edgeがcycle側とextra側のどちらかになり得るが重複使用できないとき。

通常extra edgeと、候補incident edgeを一時削除してcycleを求めるcasesを分ける。

## 問題固有の要素

tail endpoint dがcycleの別vertexでも、そこまでのcycle arcを消せばcostを増やさず真のQへ縮められるためdがcycle外という条件をd≠b,cへ緩和できる。

別の問題へ持ち帰る視点: subgraph形状制約は余分なcycle/path edgesを削除するnormalizationで局所条件へ弱められることがある。

## 正当性

a-rooted shortest treeの異branch辺は二root pathと合わせsimple cycleを作る。任意a-cycleは異branch辺を含み、その両側を最短tree pathへ置換して重みを増やさない。tailがcycleのa隣接辺と衝突する場合はその辺を除いたoracleで検査し、attachmentとtail候補を全て覆うことで最適cycle-with-tailを得る。

## 実装上の注意

- edge deletion caseでは該当edge IDだけをDijkstra/cycle scanから除き、parallel edgeのない入力でもID管理を保つ。
- cycleまたはeligible tailがないcaseはinfinityとし、最終minimumがinfinityなら−1を出す。

## 復習の核

- 指定vertexを含むminimum cycleはshortest-path-treeの異なるroot branchesを結ぶedgeで特徴付ける。
- extra edgeがcycle edgeと競合する場合は、そのedgeを役割固定してcycle oracleから除外する。

## 計算量と制約

### 時間

N 頂点のdense graph。各attachment rootの定数回cycle oracleをO(N²)で行い全体 O(N³)。

### 空間

隣接重み表 O(N²)、各rootの距離・branchラベル O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 4\leq N \leq 300; 4\leq M \leq \frac{N(N-1)}{2}; 1 \leq A_i < B_i \leq N; (A_i,B_i) \neq (A_j,B_j), if i \neq j.; 1 \leq C_i \leq 10^5; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三角形1–2,2–3,3–1が各重み1、tail辺1–4重み2。

1. attachment1のminimum cycleは1–2–3–1、重み3。
2. tail1–4はcycle外。
3. 合計3+2。

期待される結果: 最小Q重み5

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

tail端点をcycleの隣接点2にして同じ辺1–2を使ってよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。cycleとtailの辺が重複する。対象辺をcycle oracleから除外した候補が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/tasks/abc308_h) — source-abc308-ex-problem-2caebe996c7978f9549dc514be071ce9e0f3dfb6b41e899d8f90fc9626c9d6e8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/editorial/6709) — source-abc308-editorial-6709-2c67b0a55940a814375986537bb36bec6a17cf8be1df7d462270bb76ada5ad60
