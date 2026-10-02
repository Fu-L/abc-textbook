---
title: "ABC302-F — Merge Set"
draft: true
authoringUnit: {"problemId":"abc302-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc302-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc302-editorial-6411-6c4c7ecaa76c2c54863116a59357d23574055e21f52eae24f1585497d620d7d0","source-abc302-f-problem-4d05f9f5cc4730f18ade8ed1fb73a61ac369ec022b971e5091c0d0f41ab1d336"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"集合を共通要素で渡る列は要素–集合–要素のpathに対応。距離dのpathはd/2集合を使いそれらをd/2−1回mergeすれば1,M同居になる。逆にmergeで同居する集合列から同程度のpathを取れるので最短二部pathが最小merge。","sourceRevisionIds":["source-abc302-editorial-6411-6c4c7ecaa76c2c54863116a59357d23574055e21f52eae24f1585497d620d7d0","source-abc302-f-problem-4d05f9f5cc4730f18ade8ed1fb73a61ac369ec022b971e5091c0d0f41ab1d336"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-select-state-graph-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S1={1,2},S2={2,4}、M=4。","procedure":["二部pathは1–S1–2–S2–4で距離4。","二集合を一回merge。","4/2−1=1。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-state-graph-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-select-state-graph-search"],"prerequisiteIds":[],"attainmentCondition":"同一集合に1,Mがある場合は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"距離2なので2/2−1=0。最初から同居している。"},"answer":{"reasoningOrVerification":"距離2なので2/2−1=0。最初から同居している。","procedure":["具体例の各状態・寄与を再計算する。","距離2なので2/2−1=0。最初から同居している。"],"expectedResult":"距離2なので2/2−1=0。最初から同居している。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

集合のmergeを続けて1とMを同居させるには、1を含む集合から、共通要素を介して集合を渡り歩き、Mを含む集合へ到達すればよい。集合同士の共通部分を直接調べる代わりに、要素も頂点にする。 二部グラフで要素1から要素Mまでのpathは、要素→集合→要素を交互に進む。pathが使う集合数をrとすると、それらを一つへまとめる操作回数はr-1なので、辺距離dからd/2-1へ変換できる。

採用する候補: 集合頂点と要素頂点からなる二部グラフをBFSする

入力に現れる所属関係だけを辺にでき、集合の共有要素関係を明示的にO(N^2)列挙せず最短merge回数を得られる。

棄却する候補: 全ての集合pairの共通部分を調べて集合グラフを作る

集合pairがO(N^2)あり、所属総数が小さくても制約を満たさない。

二部グラフで要素1から要素Mまでのpathは、要素→集合→要素を交互に進む。pathが使う集合数をrとすると、それらを一つへまとめる操作回数はr-1なので、辺距離dからd/2-1へ変換できる。

N個の集合頂点とM個の要素頂点を作り、j∈S_iごとに無向辺を張る。要素1からBFSし、要素Mが未到達なら-1、到達距離をdとすればd/2-1を出力する。

## 典型の発動条件

### incidence graph

発動条件: 集合間の関係が共有要素で定まり、全pairの交差判定が重い。

集合と要素を別種の頂点にし、所属関係だけを辺として共通部分を暗黙に表す。

### 幅優先探索

発動条件: 全ての所属辺のcostが等しく、必要なmerge回数が最短path長に対応する。

要素1を始点に単位辺BFSを行い、要素Mへの最短交互pathを求める。

## 問題固有の要素

一つの集合が最初から1とMを含むと二部グラフ距離は2だが操作回数は0であり、答えは単なる距離の半分ではなくd/2-1である。

別の問題へ持ち帰る視点: 補助頂点を挟んだ最短路では、元問題の操作数へ戻すためにpath上の実体数と初期状態を数え直す。

## 正当性

集合を共通要素で渡る列は要素–集合–要素のpathに対応。距離dのpathはd/2集合を使いそれらをd/2−1回mergeすれば1,M同居になる。逆にmergeで同居する集合列から同程度のpathを取れるので最短二部pathが最小merge。

## 実装上の注意

- 集合頂点と要素頂点のindex領域を分離する。BFS距離の偶奇を前提に変換し、M未到達を先に判定して負の式を評価しない。

## 復習の核

- 同一集合に1とMがある答え0、集合を二つ使う答え1、共有要素のchain、到達不能を手計算とBFS距離で照合する。

## 計算量と制約

### 時間

集合数N、要素上限M、所属総数L=Σ|S_i|。二部BFS O(N+M+L)。

### 空間

所属辺とdist O(N+M+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; 2 \le M \le 2 \times 10^5; 1 \le \sum_{i=1}^{N} A_i \le 5 \times 10^5; 1 \le S_{i,j} \le M(1 \le i \le N,1 \le j \le A_i); S_{i,j} \neq S_{i,k}(1 \le j < k \le A_i); All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S1={1,2},S2={2,4}、M=4。

1. 二部pathは1–S1–2–S2–4で距離4。
2. 二集合を一回merge。
3. 4/2−1=1。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同一集合に1,Mがある場合は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

距離2なので2/2−1=0。最初から同居している。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/editorial/6411) — source-abc302-editorial-6411-6c4c7ecaa76c2c54863116a59357d23574055e21f52eae24f1585497d620d7d0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/tasks/abc302_f) — source-abc302-f-problem-4d05f9f5cc4730f18ade8ed1fb73a61ac369ec022b971e5091c0d0f41ab1d336
