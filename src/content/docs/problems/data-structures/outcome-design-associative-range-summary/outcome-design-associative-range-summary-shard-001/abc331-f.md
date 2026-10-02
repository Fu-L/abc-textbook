---
title: "ABC331-F — Palindrome Query"
draft: true
authoringUnit: {"problemId":"abc331-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc331-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-sequence-fingerprint"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-sequence-fingerprint"],"sourceRevisionIds":["source-abc331-editorial-7820-84f397ddaac63f4cee808b3ca295902b86653b9cfaf7abb14f91cbc35c371522","source-abc331-f-problem-0825f85271fc207f1f00eedd069b0591836c847c6da3ce4b4c51085bd71ae66b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。 hash一致は決定的な同値判定ではない。十分大きい法と複数独立hashを使い、衝突確率を実用上無視できる水準へ落とす。 葉の1点変更と任意substringの両向きhash取得をともにO(log N)で処理でき、回文を高確率で判定できる。","sourceRevisionIds":["source-abc331-editorial-7820-84f397ddaac63f4cee808b3ca295902b86653b9cfaf7abb14f91cbc35c371522","source-abc331-f-problem-0825f85271fc207f1f00eedd069b0591836c847c6da3ce4b4c51085bd71ae66b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=abca、質問全区間、次に位置3をbへ変更。","procedure":["初期列と逆列はabca,acbaで不一致。","変更後はabbaで両向きが一致。"],"executionTarget":null,"expectedResult":"初回No、変更後Yes。ただしhash判定には衝突の可能性がある。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":["unit-sequence-fingerprint"],"attainmentCondition":"hash一致を決定的証明と呼べるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"呼べない。実列の回文なら必ずhash一致するが逆向きは衝突し得る。独立hashで誤判定確率を抑える。"},"answer":{"reasoningOrVerification":"呼べない。実列の回文なら必ずhash一致するが逆向きは衝突し得る。独立hashで誤判定確率を抑える。","procedure":["具体例の各状態・寄与を再計算する。","呼べない。実列の回文なら必ずhash一致するが逆向きは衝突し得る。独立hashで誤判定確率を抑える。"],"expectedResult":"呼べない。実列の回文なら必ずhash一致するが逆向きは衝突し得る。独立hashで誤判定確率を抑える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [列・文字列のrolling fingerprint](src/content/docs/learn/query/sequence-fingerprint.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

1点更新を挟むため、各queryでsubstringを直接反転比較すると合計O(NQ)になり得る。一方、回文条件は順方向列と逆方向列の一致なので、結合可能な要約を区間データ構造へ載せたい。

多項式hashなら、区間を左・右に結合するとき長さに応じた基数冪を掛けるだけで順方向hashと逆方向hashを合成できる。

採用する候補: 順方向・逆方向Rolling Hashと長さをsegment treeのmonoidとして管理する

葉の1点変更と任意substringの両向きhash取得をともにO(log N)で処理でき、回文を高確率で判定できる。

棄却する候補: 各回文queryでS[L..R]を両端から比較する

長さNのqueryがQ回続くとO(NQ)で、N=10^6,Q=10^5には間に合わない。

棄却する候補: Manacher法で全回文半径を前計算する

静的文字列には有効だが、1点更新後に多数の回文半径が変化し得て更新を局所化できない。

nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。

hash一致は決定的な同値判定ではない。十分大きい法と複数独立hashを使い、衝突確率を実用上無視できる水準へ落とす。

各文字をhash nodeとしてsegment treeを構築する。更新queryでは対応葉を置換し、判定queryでは[L,R]のnodeを取得してforward hashとbackward hashを全採用modulusで比較する。

## 典型の発動条件

### Rolling Hashの結合monoid

発動条件: 文字列の連結順を保つ区間情報を、更新可能な木へ載せたいとき。

両向きhashと基数冪をnodeに持ち、区間結合を定数時間にする。

### segment treeによる動的文字列query

発動条件: 1点更新と任意区間の結合可能な性質判定が混在するとき。

文字更新を葉更新、substring hashを区間積としてO(log N)処理する。

## 問題固有の要素

回文を直接表す情報は結合しにくいが、同じ区間を左右から読んだ二つのhashへ言い換えるとmonoidになる。

別の問題へ持ち帰る視点: 区間性質そのものが合成不能なら、その性質を比較可能な二つの合成可能な表現へ写す。

## 正当性

nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。 hash一致は決定的な同値判定ではない。十分大きい法と複数独立hashを使い、衝突確率を実用上無視できる水準へ落とす。 葉の1点変更と任意substringの両向きhash取得をともにO(log N)で処理でき、回文を高確率で判定できる。

## 実装上の注意

- 左右nodeの長さ（または基数冪）を取り違えず、query区間のindex規約を統一する。単一modulusの衝突率を過小評価せず複数hashを用いる。

## 復習の核

- 長さ1・偶数長・奇数長、先頭末尾更新、同文字への更新を素朴な反転比較とrandom testし、特に左右結合式を検証する。

## 計算量と制約

### 時間

O(N+Q log N)、採用hash本数は固定。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^6; 1 \leq Q \leq 10^5; S is a string of length N consisting of lowercase English letters.; 1 \leq x \leq N; c is a lowercase English letter.; 1 \leq L \leq R \leq N; N, Q, x, L, R are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=abca、質問全区間、次に位置3をbへ変更。

1. 初期列と逆列はabca,acbaで不一致。
2. 変更後はabbaで両向きが一致。

期待される結果: 初回No、変更後Yes。ただしhash判定には衝突の可能性がある。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

hash一致を決定的証明と呼べるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

呼べない。実列の回文なら必ずhash一致するが逆向きは衝突し得る。独立hashで誤判定確率を抑える。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/editorial/7820) — source-abc331-editorial-7820-84f397ddaac63f4cee808b3ca295902b86653b9cfaf7abb14f91cbc35c371522
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/tasks/abc331_f) — source-abc331-f-problem-0825f85271fc207f1f00eedd069b0591836c847c6da3ce4b4c51085bd71ae66b
