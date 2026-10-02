---
title: "ABC447-G — Div. 1 & Div. 2"
draft: true
authoringUnit: {"problemId":"abc447-g","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc447-g.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-event-sweep"],"sourceRevisionIds":["source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111","source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"L_i,R_i にジャンル重複を除いた上位4だけを持てば、二ジャンルを禁止して上位二件を選ぶ問い合わせに必ず十分である。 固定 c で各左中央 x の M(x) を定義すると、必要なのは prefix 区間内の異ジャンル top4 M だけで segment tree の結合が閉じる。 右側の選択で排除されるジャンル数が定数なので各区間の上位4ジャンルより下は最適にならず、c の変化で各 M(x) が変わる回数も定数に抑えられる。","sourceRevisionIds":["source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111","source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"候補価値/ジャンルは(9,a),(8,b),(7,c),(6,d)、禁止ジャンルa,b。","procedure":["異ジャンルtop4を保持する。","禁止a,bを除くとc,dの二件が残る。"],"executionTarget":null,"expectedResult":"許可二件の最大和13。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":["unit-event-sweep"],"attainmentCondition":"top3だけで十分か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"上位二ジャンルを禁止すると残るのはc一件だけで二件選べない。この境界がtop4の必要性を示す。"},"answer":{"reasoningOrVerification":"上位二ジャンルを禁止すると残るのはc一件だけで二件選べない。この境界がtop4の必要性を示す。","procedure":["具体例の各状態・寄与を再計算する。","上位二ジャンルを禁止すると残るのはc一件だけで二件選べない。この境界がtop4の必要性を示す。"],"expectedResult":"上位二ジャンルを禁止すると残るのはc一件だけで二件選べない。この境界がtop4の必要性を示す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

六つの問題案でジャンルを全て異ならせるが、ある位置で禁止されるジャンルは高々定数個である。そのため prefix/suffix からジャンル distinct な価値上位4件だけで最適候補を復元できる。

採用する候補: prefix・suffix の異ジャンル top4 を前計算し、中央ジャンル c を sweep する。左三件の候補値 M(x) の異ジャンル top4 を各 node に持つ segment tree を差分点更新し、右三件と結合する。

右側の選択で排除されるジャンル数が定数なので各区間の上位4ジャンルより下は最適にならず、c の変化で各 M(x) が変わる回数も定数に抑えられる。

棄却する候補: i_1<…<i_6 を六重ループし、ジャンル distinct を検査する。

候補組は Θ(N^6) あり、中央位置を固定して左右を愚直に選んでも高次時間になる。

L_i,R_i にジャンル重複を除いた上位4だけを持てば、二ジャンルを禁止して上位二件を選ぶ問い合わせに必ず十分である。

固定 c で各左中央 x の M(x) を定義すると、必要なのは prefix 区間内の異ジャンル top4 M だけで segment tree の結合が閉じる。

prefix/suffix top4 を小配列 merge で作る。c を順に動かし、各 x の M(x) が切り替わるイベントだけを segment tree に point update する。K_{i4}=c の各位置で左区間 top4 と R_{i4+1} を定数全探索して六件価値和を最大化する。

## 典型の発動条件

### カテゴリ distinct top-K 要約

発動条件: 禁止カテゴリが定数個で、区間からカテゴリ重複なしの上位候補を取りたいとき。

各区間に異ジャンル上位4の固定長配列を保持する。

### parameter sweep と差分更新

発動条件: 全 parameter ごとの値が各要素で定数回しか変化しないとき。

再構築せず変化点だけ segment tree へ反映する。

## 問題固有の要素

distinct 制約で候補を削る数が定数なら、最適解探索に必要な各側 top-K も定数にできる。

別の問題へ持ち帰る視点: 外側 parameter の全探索で前計算を繰り返す前に、各状態値の変化回数を数えて event 化する。

## 正当性

L_i,R_i にジャンル重複を除いた上位4だけを持てば、二ジャンルを禁止して上位二件を選ぶ問い合わせに必ず十分である。 固定 c で各左中央 x の M(x) を定義すると、必要なのは prefix 区間内の異ジャンル top4 M だけで segment tree の結合が閉じる。 右側の選択で排除されるジャンル数が定数なので各区間の上位4ジャンルより下は最適にならず、c の変化で各 M(x) が変わる回数も定数に抑えられる。

## 実装上の注意

- 仮想 -∞ 候補とジャンル重複を merge 時に除き、同じ index を左右で再利用しない。固定長配列で定数倍を抑える。

## 復習の核

- なぜ top4 より下を捨てられるかを禁止ジャンル数から説明し、M(x) の c に対する変化点が定数個となることを復習する。

## 計算量と制約

### 時間

O(N log N)、各候補top4と各位置の更新イベント数を定数とする。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 6 \leq N \leq 10^5; 1 \leq K_i \leq N; 1 \leq A_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

候補価値/ジャンルは(9,a),(8,b),(7,c),(6,d)、禁止ジャンルa,b。

1. 異ジャンルtop4を保持する。
2. 禁止a,bを除くとc,dの二件が残る。

期待される結果: 許可二件の最大和13。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

top3だけで十分か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

上位二ジャンルを禁止すると残るのはc一件だけで二件選べない。この境界がtop4の必要性を示す。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/editorial/16718) — source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/tasks/abc447_g) — source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200
