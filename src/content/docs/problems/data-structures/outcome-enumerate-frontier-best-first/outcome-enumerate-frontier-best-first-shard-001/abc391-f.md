---
title: "ABC391-F — K-th Largest Triplet"
draft: true
authoringUnit: {"problemId":"abc391-f","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc391-f.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc391-editorial-12085-f9ada4466df96ec457b67df1120398f082965da3bcdfda4427208c7f131ee928","source-abc391-f-problem-747d848d57208246abe4cce1daeaa586525b51cc2160fae1ec9403b71e801dd0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未列挙点へ至るindex減少path上には必ずfrontier点があり、単調性によりheap最大が全未列挙中の最大である。 同じ点は複数の親から生成されるのでvisited setで一度だけpushする。 上位K≤5×10^5点だけをpopし、各点から三近傍を一度だけpushすればO(N log N+K log K)でK番目へ到達する。","sourceRevisionIds":["source-abc391-editorial-12085-f9ada4466df96ec457b67df1120398f082965da3bcdfda4427208c7f131ee928","source-abc391-f-problem-747d848d57208246abe4cce1daeaa586525b51cc2160fae1ec9403b71e801dd0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=B=C=(2,1)、K=4。","procedure":["初期(2,2,2)は12。","一軸を1にした三点は各8なので次の三順位を占める。"],"executionTarget":null,"expectedResult":"4番目の値8。","verificationStatus":"not_applicable","learningUnitIds":["unit-priority-queue-best-first"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"prerequisiteIds":[],"attainmentCondition":"同値8の三点を一つにまとめてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"別のindex三つ組なので三順位として数える。visitedは値でなくindex tupleに付ける。"},"answer":{"reasoningOrVerification":"別のindex三つ組なので三順位として数える。visitedは値でなくindex tupleに付ける。","procedure":["具体例の各状態・寄与を再計算する。","別のindex三つ組なので三順位として数える。visitedは値でなくindex tupleに付ける。"],"expectedResult":"別のindex三つ組なので三順位として数える。visitedは値でなくindex tupleに付ける。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

A,B,Cを降順にすると目的f(i,j,k)=A_iB_j+B_jC_k+C_kA_iは各indexについて単調非増加である。

三次元gridの点(i,j,k)が列挙された後にだけ、各軸を1増やした三近傍が次の候補になり得る。

採用する候補: (1,1,1)からmax-heapで単調三次元gridの値をbest-first列挙する

上位K≤5×10^5点だけをpopし、各点から三近傍を一度だけpushすればO(N log N+K log K)でK番目へ到達する。

棄却する候補: N^3個のtriplet値を全て生成してsortする

N=2×10^5で候補数が巨大で、Kが小さい制約を活用していない。

未列挙点へ至るindex減少path上には必ずfrontier点があり、単調性によりheap最大が全未列挙中の最大である。

同じ点は複数の親から生成されるのでvisited setで一度だけpushする。

各列を降順sortし、(value,0,0,0)をmax-heapへ入れる。K回popし、範囲内の(i+1,j,k),(i,j+1,k),(i,j,k+1)を未訪問なら計算してpushする。K回目のvalueを出力する。

## 典型の発動条件

### monotone multidimensional best-first search

発動条件: 各座標増加でscoreが悪化し、上位少数だけ欲しいとき。

原点からpriority queueでfrontierを展開する。

### implicit graphの重複排除

発動条件: 複数経路から同じ状態へ到達するheap探索をするとき。

tupleをhash setへ登録して一回だけ追加する。

## 問題固有の要素

三項式にcross termがあっても全値が正なので各配列index方向の単調性が保たれ、一般の三次元上位列挙として扱える。

別の問題へ持ち帰る視点: 複雑なscoreでも各変数をsortした後の偏微分的な単調性を確認し、K-best grid探索へ落とす。

## 正当性

未列挙点へ至るindex減少path上には必ずfrontier点があり、単調性によりheap最大が全未列挙中の最大である。 同じ点は複数の親から生成されるのでvisited setで一度だけpushする。 上位K≤5×10^5点だけをpopし、各点から三近傍を一度だけpushすればO(N log N+K log K)でK番目へ到達する。

## 実装上の注意

- 積と和は最大3×10^18付近なので符号付き64 bit境界を確認する。visited keyのpackingでcollisionやoverflowを起こさない。

## 復習の核

- N≤8で全triplet sortと比較し、同値が多く同一点が三方向から生成されるcaseで重複countを確認する。

## 計算量と制約

### 時間

O(N log N+K log K)、三列の長さN、上位K点。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq K \leq \min(N^3,5\times 10^5); 1\leq A_i,B_i,C_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=B=C=(2,1)、K=4。

1. 初期(2,2,2)は12。
2. 一軸を1にした三点は各8なので次の三順位を占める。

期待される結果: 4番目の値8。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同値8の三点を一つにまとめてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

別のindex三つ組なので三順位として数える。visitedは値でなくindex tupleに付ける。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/editorial/12085) — source-abc391-editorial-12085-f9ada4466df96ec457b67df1120398f082965da3bcdfda4427208c7f131ee928
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/tasks/abc391_f) — source-abc391-f-problem-747d848d57208246abe4cce1daeaa586525b51cc2160fae1ec9403b71e801dd0
