---
title: "ABC429-E — Hit and Away"
draft: true
authoringUnit: {"problemId":"abc429-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc429-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc429-e-problem-9df803b12556162e8f83aed4cd53ca9dcb9fa6107528f1fa7d6f1ab32324fd6b","source-abc429-editorial-14284-f4d1a802037bd607bb764925d6f5da02ab2da46bc71ab5d6b8cda013b83eb71d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"危険vを通る安全点間walkの費用は二安全点からvまでの距離和の最小で、最短二つの相異なるsourceで達成する。任意点で三番目以降のsourceは既に近い二sourceがあり、その先の同じpathを付けても二候補に負けるので伝播不要。BFSで最短二sourceを確定できる。","sourceRevisionIds":["source-abc429-e-problem-9df803b12556162e8f83aed4cd53ca9dcb9fa6107528f1fa7d6f1ab32324fd6b","source-abc429-editorial-14284-f4d1a802037bd607bb764925d6f5da02ab2da46bc71ab5d6b8cda013b83eb71d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-select-state-graph-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3–4、安全点1,4、危険2,3。","procedure":["2への安全距離は1と2。","3への安全距離は2と1。","相異なる二source和を取る。"],"executionTarget":null,"expectedResult":"各危険点の答え3","verificationStatus":"not_applicable","learningUnitIds":["unit-state-graph-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-select-state-graph-search"],"prerequisiteIds":[],"attainmentCondition":"同じ安全sourceが二回届いたものを二候補にしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。出発と到着安全頂点は相異なる必要があるのでsource labelを区別する。"},"answer":{"reasoningOrVerification":"不可。出発と到着安全頂点は相異なる必要があるのでsource labelを区別する。","procedure":["具体例の各状態・寄与を再計算する。","不可。出発と到着安全頂点は相異なる必要があるのでsource labelを区別する。"],"expectedResult":"不可。出発と到着安全頂点は相異なる必要があるのでsource labelを区別する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

危険頂点 V を一度訪れて安全頂点から別の安全頂点へ移る最短時間は、V に近い相異なる安全頂点二つまでの距離の和に等しい。全辺重みは 1 なので探索順で近い候補を得られる。 経路 U→V→U' は条件を満たし、これより短い経路があれば V までの二つの部分距離の少なくとも一方が二番目に近い安全頂点より短くなるため矛盾する。 同じ始点ラベルからの二度目の到達は新しい安全頂点候補にならないので捨て、相異なるラベルだけを各頂点で二つ受理する。

採用する候補: 全安全頂点を同時に始点とし、各状態に始点ラベルを付けた multi-source BFS で各頂点へ異なる二始点からの最短到達を保存する。

各頂点は異なる始点ラベルについて高々二回だけ確定され、全体 O(N+M) で二近傍を得られる。

棄却する候補: 各安全頂点から個別に BFS して全頂点への距離を求める。

安全頂点数に比例して同じ辺を走査し、最悪 O(N(N+M)) になる。

経路 U→V→U' は条件を満たし、これより短い経路があれば V までの二つの部分距離の少なくとも一方が二番目に近い安全頂点より短くなるため矛盾する。

同じ始点ラベルからの二度目の到達は新しい安全頂点候補にならないので捨て、相異なるラベルだけを各頂点で二つ受理する。

全安全頂点 (u,u,0) をキューへ入れる。状態 (v,source,dist) を取り出し、v がその source を既受理なら無視し、未受理で二件未満なら登録して隣接頂点へ dist+1 を伝播する。各危険頂点の二件の距離を足す。

## 典型の発動条件

### ラベル付き multi-source BFS

発動条件: 複数始点から近い始点を一つでなく上位 k 個求めたいとき。

始点 ID を波面に持たせ、各頂点が異なる二 ID を受理するまで探索を継続する。

### k-best 状態の枝刈り

発動条件: 同じ場所への候補が多数あるが、将来必要なのが異なる出所の上位定数個だけのとき。

頂点ごとに二つの始点と距離だけを保存し、それ以降の到達を展開しない。

## 問題固有の要素

求める往復型経路は V を境に独立な二本の最短路へ分かれ、必要なのは最近傍ではなく相異なる二始点の最近傍である。

別の問題へ持ち帰る視点: multi-source 探索に出所ラベルを残すと、Voronoi の最近傍だけでなく定数個の近傍を線形規模で求められる。

## 正当性

危険vを通る安全点間walkの費用は二安全点からvまでの距離和の最小で、最短二つの相異なるsourceで達成する。任意点で三番目以降のsourceは既に近い二sourceがあり、その先の同じpathを付けても二候補に負けるので伝播不要。BFSで最短二sourceを確定できる。

## 実装上の注意

- 同じ安全頂点 source の状態を二回数えない。キューの距離順を保ち、二件確定後の頂点からは不要な三件目を展開しない。

## 復習の核

- 各頂点の二候補が相異なる安全頂点由来であることと、危険頂点自身の二距離の和が求める経路を構成することを確認する。

## 計算量と制約

### 時間

N 頂点、M 辺。各頂点で二sourceを受理するmulti-source BFS O(N+M)。

### 空間

各点二ラベルと隣接、queue O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3\leq N\leq 2\times 10^5; N-1\leq M\leq 2\times 10^5; 1\leq U_i,V_i\leq N; U_i\neq V_i; If i\neq j, then \{ U_i,V_i \}\neq \{ U_j,V_j \}.; S is a string of length N consisting of S and D.; N,M,U_i,V_i are all integers.; G is connected.; There are at least two safe vertices.; There is at least one dangerous vertex.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3–4、安全点1,4、危険2,3。

1. 2への安全距離は1と2。
2. 3への安全距離は2と1。
3. 相異なる二source和を取る。

期待される結果: 各危険点の答え3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ安全sourceが二回届いたものを二候補にしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。出発と到着安全頂点は相異なる必要があるのでsource labelを区別する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/tasks/abc429_e) — source-abc429-e-problem-9df803b12556162e8f83aed4cd53ca9dcb9fa6107528f1fa7d6f1ab32324fd6b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/editorial/14284) — source-abc429-editorial-14284-f4d1a802037bd607bb764925d6f5da02ab2da46bc71ab5d6b8cda013b83eb71d
