---
title: "ABC244-EX — Linear Maximization"
draft: true
authoringUnit: {"problemId":"abc244-ex","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc244-ex.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-segment-tree-canonical-decomposition"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull","tag-segment-tree-canonical-decomposition"],"sourceRevisionIds":["source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102","source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"線形関数の最大は点集合の凸包頂点にある。時刻iで使用可能な点集合は葉prefix[1,i]で、segment treeのO(log Q)個の互いに素な区間へ分解できる。各区間の上下鎖では内積列が単峰となるためO(log Q)で最大を得る。全区間の最大を取ればprefix全体の最大に等しい。未来の点を構築には使っても、問い合わせ区間へ含めないことで時間制約を守る。","sourceRevisionIds":["source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102","source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"順に点(1,0),(0,2)を追加。各時刻の質問方向は(A,B)=(1,1)。","procedure":["時刻1のprefixには(1,0)だけあり内積1。","時刻2には内積1と2の二点があり最大2。"],"executionTarget":null,"expectedResult":"順に1,2。","verificationStatus":"not_applicable","learningUnitIds":["unit-convex-boundary-hull"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"prerequisiteIds":["unit-geometry-primitives","unit-segment-tree-canonical-decomposition"],"attainmentCondition":"未来の点の凸包を一つだけ作って全時刻に使うと何が起こるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"時刻1でも(0,2)を選び2を返してしまう。静的前処理と時刻ごとの利用可能範囲を分け、prefix区間だけを問い合わせる必要がある。"},"answer":{"reasoningOrVerification":"時刻1でも(0,2)を選び2を返してしまう。静的前処理と時刻ごとの利用可能範囲を分け、prefix区間だけを問い合わせる必要がある。","procedure":["具体例の各状態・寄与を再計算する。","時刻1でも(0,2)を選び2を返してしまう。静的前処理と時刻ごとの利用可能範囲を分け、prefix区間だけを問い合わせる必要がある。"],"expectedResult":"時刻1でも(0,2)を選び2を返してしまう。静的前処理と時刻ごとの利用可能範囲を分け、prefix区間だけを問い合わせる必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Ax+By は query vector (A,B) と点 (x,y) の内積であり、最大値は点集合の convex hull 上で達成される。hull の頂点順では支持方向に対する内積が unimodal になる。

i 回目に利用できる点は入力順 prefix [1,i] なので、online insertion と見なくても、全 query を先読みして index 区間への線形最大 query として処理できる。

採用する候補: index segment tree の各 node 区間に点の convex hull を前計算し、prefix [1,i] を覆う node 群の hull で最大内積を二分・三分探索する。

標準的な静的 hull と segment tree だけで、動的 hull 用の高度な平衡木を避けられる。

棄却する候補: 各 query 後に、それまでの全点を走査して内積最大を取る。

prefix 長の総和が Q^2 になり、Q=2×10^5では間に合わない。

棄却する候補: convex hull を挿入ごとに動的更新する。

有効な方針だが、hull 上の順序統計と削除を扱う高機能な平衡木が必要なため、この record では offline 区間化を採用する。

追加-only 集合は時刻 index の prefix なので、segment tree の range decomposition を使えば一つの query を O(log Q) 個の静的点集合 query へ分解できる。

全 Q 点を葉へ置く segment tree を作り、各 node の点を sort して上下 convex hull を構築する。時刻 i では range [1,i] を分解し、各 hull 上で A x+B y の最大頂点を unimodal search して全 node の最大を出力する。

## 典型の発動条件

### convex hull trick for dot-product query

発動条件: 固定点集合に対し、様々な方向 vector との最大内積を問うとき。

内部点を捨てた convex hull 上で支持点を単峰探索する。

### segment tree of static structures

発動条件: 時刻 prefix や index range ごとに、集合上の重い query を行いたいとき。

各 segment node に静的 data structure を前計算し、range を少数 node に分解する。

## 問題固有の要素

逐次追加 query を、点の入力 index に対する prefix range query と読み替えると、dynamic geometry が static hull の集合へ変わる。

別の問題へ持ち帰る視点: 追加-only の online 風問題では、全入力が既知なら time/index 軸の区間 query 化を試す。

## 正当性

線形関数の最大は点集合の凸包頂点にある。時刻iで使用可能な点集合は葉prefix[1,i]で、segment treeのO(log Q)個の互いに素な区間へ分解できる。各区間の上下鎖では内積列が単峰となるためO(log Q)で最大を得る。全区間の最大を取ればprefix全体の最大に等しい。未来の点を構築には使っても、問い合わせ区間へ含めないことで時間制約を守る。

## 実装上の注意

- hull の collinear 点処理と1点・2点 nodeを分け、A=B=0なら答え0になる。外積は __int128、内積と出力は符号付き64 bitで扱う。

## 復習の核

- 内積の等高線を query vector 方向へ動かす図を描き、内部点が最大にならないことと hull 上の支持点探索を結び付ける。

## 計算量と制約

### 時間

各nodeを個別sortする実装で前処理O(Q log² Q)、全問い合わせO(Q log² Q)。

### 空間

O(Q log Q)。各点は木の各階層で一度格納される。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1≤Q≤2 \times 10^5; |X_i|, |Y_i|, |A_i|, |B_i| ≤10^9; If i ≠ j, then (X_i, Y_i) ≠ (X_j, Y_j).

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

順に点(1,0),(0,2)を追加。各時刻の質問方向は(A,B)=(1,1)。

1. 時刻1のprefixには(1,0)だけあり内積1。
2. 時刻2には内積1と2の二点があり最大2。

期待される結果: 順に1,2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

未来の点の凸包を一つだけ作って全時刻に使うと何が起こるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

時刻1でも(0,2)を選び2を返してしまう。静的前処理と時刻ごとの利用可能範囲を分け、prefix区間だけを問い合わせる必要がある。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/editorial/3602) — source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/tasks/abc244_h) — source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64
