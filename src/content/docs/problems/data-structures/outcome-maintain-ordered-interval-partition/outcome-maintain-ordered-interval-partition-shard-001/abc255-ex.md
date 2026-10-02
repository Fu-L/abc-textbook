---
title: "ABC255-EX — Range Harvest Query"
draft: true
authoringUnit: {"problemId":"abc255-ex","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc255-ex.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-ordered-set-multiset"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc255-editorial-4103-d20d115deccf3382ac7370948ba2c0426d66f1a17a620ed3c61ada4c52c95a2d","source-abc255-ex-problem-935ae4a05d3875c9b16346d07116f1332350b32f66245f03b2c6bbad2f0c5ef4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"木iの成長量は最後の収穫日dからi(D−d)であり、同日block[l,r]の量は(D−d)(l+r)(r−l+1)/2。端点でsplitすれば列挙するblockは更新区間を重複なく被覆する。その全寄与を加え値Dの一blockへ置換すると最後の収穫日という状態を保つ。split二回と代入による生成は一質問あたり定数個なので、生成総数O(Q)、削除総数もO(Q)である。","sourceRevisionIds":["source-abc255-editorial-4103-d20d115deccf3382ac7370948ba2c0426d66f1a17a620ed3c61ada4c52c95a2d","source-abc255-ex-problem-935ae4a05d3875c9b16346d07116f1332350b32f66245f03b2c6bbad2f0c5ef4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、日2に[1,2]収穫、日5に[2,3]収穫。","procedure":["最初は2(1+2)=6。","次は木2が2(5−2)=6、木3が3(5−0)=15。"],"executionTarget":null,"expectedResult":"収穫量は6,21。","verificationStatus":"not_applicable","learningUnitIds":["unit-ordered-interval-partition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"prerequisiteIds":["unit-amortized-monotone-progress","unit-ordered-set-multiset"],"attainmentCondition":"毎回一つだけ新規blockができると言ってsplitを無視してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"splitも高々二つの境界で定数個blockを生成する。生成総数O(Q)なので削除総数O(Q)の償却結論は変わらない。"},"answer":{"reasoningOrVerification":"splitも高々二つの境界で定数個blockを生成する。生成総数O(Q)なので削除総数O(Q)の償却結論は変わらない。","procedure":["具体例の各状態・寄与を再計算する。","splitも高々二つの境界で定数個blockを生成する。生成総数O(Q)なので削除総数O(Q)の償却結論は変わらない。"],"expectedResult":"splitも高々二つの境界で定数個blockを生成する。生成総数O(Q)なので削除総数O(Q)の償却結論は変わらない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

巨大なNに対し必要なのは各木の最終収穫日。区間収穫で日付が一様に上書きされるので一定値blockをordered setへ持つ。L,R+1をsplitし、含まれるblockごとに等差数列和で収穫を計算して削除し、[L,R]を日Dで挿入する。splitによる断片も含め一質問の生成block数は定数なので全列挙をO(Q)へ償却できる。

## 典型の発動条件

### 区間を一定値ブロックで持つODT

発動条件: 巨大な座標域への区間代入があり、値が区間ごとに一定となる。

区間端でブロックをsplitし、被覆ブロックを列挙・削除して一ブロックへ置換する。

### 償却解析

発動条件: 一操作では多数区間を消す可能性があるが、新規区間数は少ない。

各ブロックの削除をその生成へ課金し、全走査量をO(Q)と評価する。

## 問題固有の要素

日付Dが厳密増加するため必要な状態は各木の「最後の収穫日」だけで、区間上書きがそのまま一定値ブロック構造を作る。

別の問題へ持ち帰る視点: 巨大な添字域でも、区間代入が履歴を消し一操作の生成区間数が定数なら、区間集合の償却管理が使える。

## 正当性

木iの成長量は最後の収穫日dからi(D−d)であり、同日block[l,r]の量は(D−d)(l+r)(r−l+1)/2。端点でsplitすれば列挙するblockは更新区間を重複なく被覆する。その全寄与を加え値Dの一blockへ置換すると最後の収穫日という状態を保つ。split二回と代入による生成は一質問あたり定数個なので、生成総数O(Q)、削除総数もO(Q)である。

## 実装上の注意

- N,D,L,Rは10^18なので添字計算のオーバーフローを避け、積は法998244353へ段階的に落とす。R=NではR+1の番兵処理を分け、分割後のiterator無効化に注意する。

## 復習の核

- 小さいNの配列実装と比較し、全域更新、点更新、入れ子・交差区間、R=N、同じ境界を繰り返し分割する場合を確認する。

## 計算量と制約

### 時間

全Q質問で償却O(Q log Q)、端点分割も一回定数個。

### 空間

O(Q)、最終収穫日の区間集合。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{18}; 1 \leq Q \leq 2 \times 10^5; 1 \leq D_1 \lt D_2 \lt \cdots \lt D_Q \leq 10^{18}; 1 \leq L_i \leq R_i \leq N; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、日2に[1,2]収穫、日5に[2,3]収穫。

1. 最初は2(1+2)=6。
2. 次は木2が2(5−2)=6、木3が3(5−0)=15。

期待される結果: 収穫量は6,21。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

毎回一つだけ新規blockができると言ってsplitを無視してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

splitも高々二つの境界で定数個blockを生成する。生成総数O(Q)なので削除総数O(Q)の償却結論は変わらない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/editorial/4103) — source-abc255-editorial-4103-d20d115deccf3382ac7370948ba2c0426d66f1a17a620ed3c61ada4c52c95a2d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/tasks/abc255_h) — source-abc255-ex-problem-935ae4a05d3875c9b16346d07116f1332350b32f66245f03b2c6bbad2f0c5ef4
