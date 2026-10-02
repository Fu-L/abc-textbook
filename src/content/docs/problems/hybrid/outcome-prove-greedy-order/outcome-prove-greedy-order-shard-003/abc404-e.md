---
title: "ABC404-E — Bowls and Beans"
draft: true
authoringUnit: {"problemId":"abc404-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc404-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc404-e-problem-ba601f0017973e934f6482d36aa2100fe6081ac61aed87ffa1167ad37ac1f9f5","source-abc404-editorial-12866-47e6f33188ac21f645f2d92a415f44a523bc1d6126e3574c93bf87a7c4efe33c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"先にある豆へ後ろの豆が到達すれば、以後は同じ茶碗の一塊として動かせるため、その後ろの豆について独立に 0 まで運ぶ必要はない。 到達可能集合が穴のない区間になるので、次状態は個々の経路ではなく左端 l だけで表せる。右端 r は開始位置として固定したままよい。 後続の豆は先行する豆の位置へ到達した時点で合流できる。答えは高々 N-1 なので区間最小を毎回走査しても O(N^2) に収まる。","sourceRevisionIds":["source-abc404-e-problem-ba601f0017973e934f6482d36aa2100fe6081ac61aed87ffa1167ad37ac1f9f5","source-abc404-editorial-12866-47e6f33188ac21f645f2d92a415f44a523bc1d6126e3574c93bf87a7c4efe33c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"茶碗0,1,2、C1=C2=1、豆は1と2に各一個。","procedure":["位置2の豆を1へ移して合流。","合流した豆を1から0へ移す。"],"executionTarget":null,"expectedResult":"最小操作2。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":[],"attainmentCondition":"位置2の豆を独立に0へ運ぶ費用を足すと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2+1=3と過大になる。先にある豆へ合流後は同じ一塊として共有移動できる。"},"answer":{"reasoningOrVerification":"2+1=3と過大になる。先にある豆へ合流後は同じ一塊として共有移動できる。","procedure":["具体例の各状態・寄与を再計算する。","2+1=3と過大になる。先にある豆へ合流後は同じ一塊として共有移動できる。"],"expectedResult":"2+1=3と過大になる。先にある豆へ合流後は同じ一塊として共有移動できる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

操作順は現在もっとも後ろにある豆を先に動かす形へ交換でき、同じ茶碗の豆を複数の行き先へ分割せず一か所へまとめても最適性を失わない。

茶碗 r から同じ豆を k 回動かして到達可能な位置は区間 [l,r] をなし、次の一手後の左端は min_{i∈[l,r]}(i-C_i) になる。

採用する候補: 豆のある茶碗を 0 に近い順に処理し、到達可能区間の左端を反復更新して直前までに統合した豆へ届く最小手数を足す

後続の豆は先行する豆の位置へ到達した時点で合流できる。答えは高々 N-1 なので区間最小を毎回走査しても O(N^2) に収まる。

棄却する候補: 各茶碗の豆数と各分配先を頂点にした全状態 BFS を行う

一操作で豆を任意分割できるため状態数と分岐数が指数的になり、交換・非分割の性質を利用していない。

先にある豆へ後ろの豆が到達すれば、以後は同じ茶碗の一塊として動かせるため、その後ろの豆について独立に 0 まで運ぶ必要はない。

到達可能集合が穴のない区間になるので、次状態は個々の経路ではなく左端 l だけで表せる。右端 r は開始位置として固定したままよい。

A_i=1 の位置を昇順に見る。最初は目標を茶碗 0、各豆について [l,r]=[x,x] から l=min_{i∈[l,r]}(i-C_i) を繰り返し、区間が直前の統合位置へ届くまでの回数を答えへ加えて豆を合流させる。単純走査なら全体 O(N^2)、区間最小構造なら高速化もできる。

## 典型の発動条件

### 交換論

発動条件: 自由な操作順や分割がある最小回数問題で、正規形の操作列へ並べ替えられそうなとき。

後ろの豆を優先し、分配を一か所へまとめる操作列だけ考えてよいことを示す。

### 到達可能区間の拡張

発動条件: 一手の遷移先が連続区間で、複数手後の可到達集合も連続性を保つとき。

左端を区間内の i-C_i の最小値で更新し、目的位置を含むまで反復する。

### 合流による状態圧縮

発動条件: 複数対象が同じ位置へ来た後の操作を共有できるとき。

先行する豆に届いた後続の豆を一塊として扱い、以後のコストを二重計上しない。

## 問題固有の要素

豆を一粒ずつ追う代わりに「この手数で置ける茶碗の区間」を追い、別の豆へ届いた瞬間に将来の経路を共有させる。

別の問題へ持ち帰る視点: 移動対象が合流可能な問題では、各対象を終点まで運ぶコストではなく、すでに処理した成分へ接続するまでの増分を数える。

## 正当性

先にある豆へ後ろの豆が到達すれば、以後は同じ茶碗の一塊として動かせるため、その後ろの豆について独立に 0 まで運ぶ必要はない。 到達可能集合が穴のない区間になるので、次状態は個々の経路ではなく左端 l だけで表せる。右端 r は開始位置として固定したままよい。 後続の豆は先行する豆の位置へ到達した時点で合流できる。答えは高々 N-1 なので区間最小を毎回走査しても O(N^2) に収まる。

## 実装上の注意

- 茶碗 0 では C_0 を参照せず、目的位置を区間が含んだ時点で止める。A_i=0 の位置を新しい豆として処理しない。

## 復習の核

- 豆が一つだけ、全茶碗に豆がある、C_i=1、C_i=i、到達区間が既存の豆をちょうど端で含む場合を小規模 BFS と照合する。

## 計算量と制約

### 時間

O(N²)、到達区間の単純走査を採用。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \le N \le 2000; 1 \le C_i \le i; 0 \le A_i \le 1; \displaystyle \sum_{i=1}^{N-1} A_i > 0

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

茶碗0,1,2、C1=C2=1、豆は1と2に各一個。

1. 位置2の豆を1へ移して合流。
2. 合流した豆を1から0へ移す。

期待される結果: 最小操作2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

位置2の豆を独立に0へ運ぶ費用を足すと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

2+1=3と過大になる。先にある豆へ合流後は同じ一塊として共有移動できる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/tasks/abc404_e) — source-abc404-e-problem-ba601f0017973e934f6482d36aa2100fe6081ac61aed87ffa1167ad37ac1f9f5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/editorial/12866) — source-abc404-editorial-12866-47e6f33188ac21f645f2d92a415f44a523bc1d6126e3574c93bf87a7c4efe33c
