---
title: "ABC246-EX — 01? Queries"
draft: true
authoringUnit: {"problemId":"abc246-ex","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc246-ex.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc246-editorial-3705-73fb7421c296a34062f61baff4f3572476241cbc81f54aac6c14d6374e53381a","source-abc246-ex-problem-a1b21b8f8e0ba6be58e2ef77d8a5b8fd73c081165d7832ed9a18d9a5cba6efe5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"d_0,d_1 を作れる非空文字列のうち末尾が 0,1 の個数とすると、0 の追加は (d_0,d_1)→(d_0+d_1+1,d_1)、1 は対称、? は両方を同時に更新する。 定数 +1 を第 3 成分 1 として持てば各更新は線形行列になり、区間の文字列連結は行列積の結合則で segment tree に載る。 1 文字変更を 1 leaf の行列変更にでき、全 prefix DP の合成結果を各 query で対数時間に更新できる。","sourceRevisionIds":["source-abc246-editorial-3705-73fb7421c296a34062f61baff4f3572476241cbc81f54aac6c14d6374e53381a","source-abc246-ex-problem-a1b21b8f8e0ba6be58e2ef77d8a5b8fd73c081165d7832ed9a18d9a5cba6efe5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=?0。","procedure":["?の後は(d0,d1)=(1,1)。","0の後は(3,1)。得られる列は0,1,00,10。"],"executionTarget":null,"expectedResult":"異なる非空部分列は4種類。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":["unit-dp-sequence"],"attainmentCondition":"?を1へ変えると何種類か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"S=10の部分列は1,0,10の3種類。置換方法の個数と部分列集合の個数を混同しない。"},"answer":{"reasoningOrVerification":"S=10の部分列は1,0,10の3種類。置換方法の個数と部分列集合の個数を混同しない。","procedure":["具体例の各状態・寄与を再計算する。","S=10の部分列は1,0,10の3種類。置換方法の個数と部分列集合の個数を混同しない。"],"expectedResult":"S=10の部分列は1,0,10の3種類。置換方法の個数と部分列集合の個数を混同しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各 ? の置換結果を個別に数えるのではなく、いずれかの置換後文字列の部分列として得られる異なる非空文字列の和集合を数える必要がある。

prefix から作れる文字列を末尾 0 と末尾 1 の個数に分けると、次の 1 文字による重複除去込みの更新が 2 変数の affine 変換で閉じる。

採用する候補: 文字 0,1,? ごとの 3×3 affine 遷移行列を作り、順序付き行列積を segment tree で保持して点更新する。

1 文字変更を 1 leaf の行列変更にでき、全 prefix DP の合成結果を各 query で対数時間に更新できる。

棄却する候補: 各 query 後に左から prefix DP を N 文字分やり直す。

1 回は線形だが N,Q≤10^5 の積になり、全 query には間に合わない。

d_0,d_1 を作れる非空文字列のうち末尾が 0,1 の個数とすると、0 の追加は (d_0,d_1)→(d_0+d_1+1,d_1)、1 は対称、? は両方を同時に更新する。

定数 +1 を第 3 成分 1 として持てば各更新は線形行列になり、区間の文字列連結は行列積の結合則で segment tree に載る。

leaf i に A_{s_i} を置く。左区間を先に適用してから右区間を適用するため、親の積を M_right×M_left とする。点更新後、root 行列を (0,0,1)^T に作用させ、先頭 2 成分の和を出力する。

## 典型の発動条件

### DP 遷移の行列化

発動条件: 少数状態の同型遷移が列要素ごとに変わり、区間単位で合成したいとき。

末尾文字別 DP と定数成分を 3 次元 vector にし、各文字を 3×3 行列にする。

### 非可換 monoid segment tree

発動条件: 点更新のたびに順序依存の結合可能な全体積を求めたいとき。

行列積の順序を文字列の適用順に合わせて各 node に保持する。

## 問題固有の要素

wildcard を全置換する代わりに、『どれかの置換で作れる部分列』の集合を末尾文字で分類すると、重複を除いた個数が 2 状態で更新できる。

別の問題へ持ち帰る視点: 動的な列 DP では、局所遷移を小さな写像として表し、その合成が結合的なら segment tree で点更新できる。

## 正当性

d_0,d_1 を作れる非空文字列のうち末尾が 0,1 の個数とすると、0 の追加は (d_0,d_1)→(d_0+d_1+1,d_1)、1 は対称、? は両方を同時に更新する。 定数 +1 を第 3 成分 1 として持てば各更新は線形行列になり、区間の文字列連結は行列積の結合則で segment tree に載る。 1 文字変更を 1 leaf の行列変更にでき、全 prefix DP の合成結果を各 query で対数時間に更新できる。

## 実装上の注意

- 結合順は交換できない。区間 [l,r] の変換は右側行列×左側行列で、入力 vector へ右から作用する。
- 初期 vector は空文字列を定数成分だけに持つ (0,0,1) とし、出力は d_0+d_1 なので空文字列を加えない。

## 復習の核

- 長さ 2 の 01 と 10 で行列積順を実計算し、さらに単独 ? で答えが 2 になることから、定数項と空文字列の扱いを確認する。

## 計算量と制約

### 時間

O(N+Q log N)、3×3行列積は固定サイズ。

### 空間

O(N)、行列積木。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 10^5; N and Q are integers.; S is a string of length N consisting of 0, 1, and ?.; 1 \leq x_i \leq N; c_i is one of the characters 0 , 1, and ?.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=?0。

1. ?の後は(d0,d1)=(1,1)。
2. 0の後は(3,1)。得られる列は0,1,00,10。

期待される結果: 異なる非空部分列は4種類。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

?を1へ変えると何種類か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

S=10の部分列は1,0,10の3種類。置換方法の個数と部分列集合の個数を混同しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/editorial/3705) — source-abc246-editorial-3705-73fb7421c296a34062f61baff4f3572476241cbc81f54aac6c14d6374e53381a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/tasks/abc246_h) — source-abc246-ex-problem-a1b21b8f8e0ba6be58e2ef77d8a5b8fd73c081165d7832ed9a18d9a5cba6efe5
