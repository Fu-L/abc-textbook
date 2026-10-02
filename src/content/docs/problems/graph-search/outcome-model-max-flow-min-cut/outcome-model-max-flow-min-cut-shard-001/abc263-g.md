---
title: "ABC263-G — Erasing Prime Pairs"
draft: true
authoringUnit: {"problemId":"abc263-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc263-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132","source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"1+1だけが奇奇素数pairなので使用回数kを固定すると残りは容量二部matchingそのもの。最大flow f(k)は1容量を二ずつ減らすparametric値で損失が単調になりk+f(k)は離散凹。隣接値比較で最大区間を探せば全k列挙なしに最適消去数を得る。","sourceRevisionIds":["source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132","source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"値1が4個、値2が1個。","procedure":["k=0なら1–2一組で1。","k=1なら1–1一組と1–2一組で2。","k=2なら1–1二組で2。"],"executionTarget":null,"expectedResult":"最大2","verificationStatus":"not_applicable","learningUnitIds":["unit-max-flow-min-cut"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"prerequisiteIds":["unit-basic-convex-optimization","unit-state-graph-search"],"attainmentCondition":"1+1例外を普通の奇偶graphへ入れられるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じ奇側同士なので入らない。kを別に固定して残容量を調整する。"},"answer":{"reasoningOrVerification":"同じ奇側同士なので入らない。kを別に固定して残容量を調整する。","procedure":["具体例の各状態・寄与を再計算する。","同じ奇側同士なので入らない。kを別に固定して残容量を調整する。"],"expectedResult":"同じ奇側同士なので入らない。kを別に固定して残容量を調整する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

正の整数二つの和が素数なら、和が2となる (1,1) を除いて一方が奇数、他方が偶数である。 各値の出現数は容量として扱え、奇数値と偶数値を素数和のときだけ結ぶと、(1,1)以外の最大消去回数は容量付き二部最大流になる。 固定 k では source→奇数値、素数和の奇偶対、偶数値→sink にそれぞれ個数・十分大きい容量を置いた最大流が f(k) になる。 k を一つ増やして値1容量を二つ減らしたときの f の損失は単調に大きくなるため、g(k)=k+f(k) は離散的に上に凸ではなく山型の凹関数になる。

棄却する候補: 値を出現回数だけ頂点へ展開し、消せる整数同士の一般グラフ最大マッチングを求める。

B_i は10億まであり個体展開できず、一般グラフ性も値1の自己組だけに由来する。

採用する候補: (1,1)を消す回数 k を固定して値1の容量を B_1−2k にし、残りを奇偶二部最大流 f(k) で求め、凹な k+f(k) を整数三分探索する。

唯一の非二部辺を一変数へ切り出せ、最大流値の容量に対する離散凹性から全 k の列挙を避けられる。

固定 k では source→奇数値、素数和の奇偶対、偶数値→sink にそれぞれ個数・十分大きい容量を置いた最大流が f(k) になる。

k を一つ増やして値1容量を二つ減らしたときの f の損失は単調に大きくなるため、g(k)=k+f(k) は離散的に上に凸ではなく山型の凹関数になる。

almost-bipartite capacitated matching の例外自己辺を使用回数でparameterizeし、parametric max flow value の離散凹性で最適点を探索する。

## 典型の発動条件

### 多重要素ペアリングの容量付き最大流

発動条件: 値種類は少ないが各種類の個数が巨大で、異なる二群間の許可ペアを最大化するとき。

種類を頂点、個数をsource/sink辺容量、許可関係を大容量辺にする。

### 例外辺数固定による二部化

発動条件: ほぼ二部グラフだが少数種類の同側辺だけが構造を壊しているとき。

例外辺の使用回数を固定し、残余容量上の二部問題を解く。

### 離散凹関数の三分探索

発動条件: 整数パラメータに対する目的値の隣接差が単調で、一つの山を作ると証明できるとき。

広い区間を三分探索で縮め、最後の小区間を全探索する。

## 問題固有の要素

偶数素数は2だけなので、奇数同士で許される組は1+1だけであり、他の奇数値同士や偶数同士を考える必要はない。

別の問題へ持ち帰る視点: 数論条件で作る関係グラフは、parityの一般則と小さな例外値を分離して構造を見抜く。

## 正当性

1+1だけが奇奇素数pairなので使用回数kを固定すると残りは容量二部matchingそのもの。最大flow f(k)は1容量を二ずつ減らすparametric値で損失が単調になりk+f(k)は離散凹。隣接値比較で最大区間を探せば全k列挙なしに最適消去数を得る。

## 実装上の注意

- A_i+A_j の最大値まで素数表を作り、値1が入力にない場合は個数0として k=0 だけを評価する。
- 個数と最大流量は32 bitを超えるため64 bit容量を使い、k の範囲を 0…floor(B_1/2) とする。

## 復習の核

- 素数和のペア問題では、奇数素数のparity分割と素数2の例外を最初に切り分ける。
- 最大流を多数回呼ぶparametric問題は、容量変化に対する流量の限界差が単調か調べる。

## 計算量と制約

### 時間

異値数V、最大個数B。素数和pairO(V²·P)（Pは採用素数判定一回の費用）。離散凹binary探索O(log B)回、各Dinic O(V²E)、E≤V²。

### 空間

素数pair二部辺 O(V²)、個数O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; 1 \leq A_i \leq 10^7; 1 \leq B_i \leq 10^9; All A_i are distinct.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

値1が4個、値2が1個。

1. k=0なら1–2一組で1。
2. k=1なら1–1一組と1–2一組で2。
3. k=2なら1–1二組で2。

期待される結果: 最大2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

1+1例外を普通の奇偶graphへ入れられるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ奇側同士なので入らない。kを別に固定して残容量を調整する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_g) — source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4537) — source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2
