---
title: "ABC406-F — Compare Tree Weights"
draft: true
authoringUnit: {"problemId":"abc406-f","docPath":"src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc406-f.md","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-euler-flattening","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc406-editorial-13045-88e5ab7994c41abf34b04962b7a2ffd21aca4604fea4eb821af9d9009f41d591","source-abc406-f-problem-7bae4f2e492c9aec3a247593bc10e1b504e17cfaaa3c624927147a9d7376e5b3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"辺削除の子側はEuler連続区間であり、その和subを求めれば反対側はtotal−sub。二成分差は|total−2sub|。一点加算でBITとtotalを更新すれば不変条件が保たれる。","sourceRevisionIds":["source-abc406-editorial-13045-88e5ab7994c41abf34b04962b7a2ffd21aca4604fea4eb821af9d9009f41d591","source-abc406-f-problem-7bae4f2e492c9aec3a247593bc10e1b504e17cfaaa3c624927147a9d7376e5b3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、初期重み各1、頂点3へ4加算後に辺1–2を切る質問。","procedure":["total=7。","子側{2,3}の和1+5=6。","差は","7−12","。"],"executionTarget":null,"expectedResult":"5","verificationStatus":"not_applicable","learningUnitIds":["unit-tree-euler-flattening"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"prerequisiteIds":["unit-weighted-prefix-fenwick"],"attainmentCondition":"根付けで逆向きに辺入力されていると子側は変わるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"入力順とは無関係。DFSで実際のchildを記録して区間を選ぶ。差はどちら側でも同じ。"},"answer":{"reasoningOrVerification":"入力順とは無関係。DFSで実際のchildを記録して区間を選ぶ。差はどちら側でも同じ。","procedure":["具体例の各状態・寄与を再計算する。","入力順とは無関係。DFSで実際のchildを記録して区間を選ぶ。差はどちら側でも同じ。"],"expectedResult":"入力順とは無関係。DFSで実際のchildを記録して区間を選ぶ。差はどちら側でも同じ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

木を任意の根で根付き化すると、辺を削除した片側は、その辺の子側頂点を根とする部分木になり、もう片側は全体からその部分木を除いた集合になる。 DFS の行きがけ順では任意の部分木の頂点番号が連続区間になるため、頂点重みの一点加算と部分木和は一次元配列の一点加算・区間和へ変換できる。 入力時の辺の向きは根付き木の親子と一致しないので、DFS 後に各 edge id について深い側の端点を保存すれば query から部分木を一意に選べる。 更新後の全体和 total を同時に増やすことで、補集合の和を別のデータ構造なしに total-sub として得られる。

採用する候補: Euler tour 順の頂点重みを Fenwick tree で管理し、全体重みも別に保持する

edge y の子側部分木和 sub を区間和で求めれば、二成分の差は |total-2sub|。前処理 O(N)、各 query O(log N) である。

棄却する候補: type 2 のたびに対象辺を避けて DFS し、二成分の重みを数え直す

一回 O(N) となり Q=3×10^5 では間に合わず、辺が実際には削除されない固定木を再利用していない。

入力時の辺の向きは根付き木の親子と一致しないので、DFS 後に各 edge id について深い側の端点を保存すれば query から部分木を一意に選べる。

更新後の全体和 total を同時に増やすことで、補集合の和を別のデータ構造なしに total-sub として得られる。

頂点 1 を根に DFS し tin[v],tout[v],parent と各辺の child を求める。Fenwick tree を初期値 1 で構築し、type 1 は tin[x] へ w 加算して total も更新、type 2 は sub=sum(tin[child]..tout[child]) として abs(total-2sub) を出力する。

## 典型の発動条件

### Euler tour flattening

発動条件: 固定木の部分木に対する更新・集計を列データ構造へ載せたいとき。

DFS 入時刻と退出時刻で各部分木を連続区間にする。

### Fenwick tree

発動条件: 一点加算と区間和 query が大量にあるとき。

Euler 順の重みを保持し、prefix sum の差から子側部分木和を得る。

## 問題固有の要素

辺削除後の二成分を両方集計せず、根を固定して「子部分木」と「全体−子部分木」に非対称化する。

別の問題へ持ち帰る視点: 固定木の辺 query は、各辺を親子のどちら側で代表させるかを前処理すると部分木 query に変換できる。

## 正当性

辺削除の子側はEuler連続区間であり、その和subを求めれば反対側はtotal−sub。二成分差は|total−2sub|。一点加算でBITとtotalを更新すれば不変条件が保たれる。

## 実装上の注意

- 再帰 DFS は N=3×10^5 で stack overflow の恐れがあるため反復 DFSも検討する。重み総和は 64 bit とし、tout の包含／半開区間を統一する。

## 復習の核

- 根に接続する辺、葉の辺、chain/star、同一点への連続更新を、辺を実際に除いて成分和を走査する実装と比較する。

## 計算量と制約

### 時間

N 頂点、Q 操作。DFS O(N)、各BIT操作 O(log N)、全体 O(N+Qlog N)。

### 空間

木、Euler順、BIT O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3 \times 10^5; 1 \leq U_i, V_i \leq N; 1 \leq Q \leq 3 \times 10^5; 1 \leq x \leq N; 1 \leq w \leq 1000; 1 \leq y \leq N-1; All input values are integers.; The given graph is a tree.; There is at least one query of the second type.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、初期重み各1、頂点3へ4加算後に辺1–2を切る質問。

1. total=7。
2. 子側{2,3}の和1+5=6。
3. 差は
4. 7−12
5. 。

期待される結果: 5

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

根付けで逆向きに辺入力されていると子側は変わるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

入力順とは無関係。DFSで実際のchildを記録して区間を選ぶ。差はどちら側でも同じ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/editorial/13045) — source-abc406-editorial-13045-88e5ab7994c41abf34b04962b7a2ffd21aca4604fea4eb821af9d9009f41d591
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/tasks/abc406_f) — source-abc406-f-problem-7bae4f2e492c9aec3a247593bc10e1b504e17cfaaa3c624927147a9d7376e5b3
