---
title: "ABC261-E — Many Operations"
draft: true
authoringUnit: {"problemId":"abc261-e","docPath":"src/content/docs/problems/data-structures/outcome-compose-finite-functions/outcome-compose-finite-functions-shard-001/abc261-e.md","learningOutcomeIds":["outcome-compose-finite-functions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["有限関数・作用の合成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-finite-function-composition"],"sourceRevisionIds":["source-abc261-e-problem-c8e8008b1c41ab6c87c76ae12879e203c622f67920eca7af05ced1c082b71578","source-abc261-editorial-4451-dfbb3f34b15ce9d7dbfa4321399954f2695e4cfa810541f982c32aa7c74e924f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i 番目の手続きは操作 i だけでなく合成済みの操作 1,…,i を前回の X に再適用するため、prefix 関数そのものを保持する必要がある。 新しい操作は二つの出力値へ適用するだけで合成でき、各 prefix の効果を定数個の bit 演算へ圧縮できる。","sourceRevisionIds":["source-abc261-e-problem-c8e8008b1c41ab6c87c76ae12879e203c622f67920eca7af05ced1c082b71578","source-abc261-editorial-4451-dfbb3f34b15ce9d7dbfa4321399954f2695e4cfa810541f982c32aa7c74e924f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compose-finite-functions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"初期X=1、操作はXOR 1、続いてOR 2。","procedure":["第一prefix写像で1→0。","第二prefix写像はf(x)=(x xor 1) or 2なので、現在0→3。"],"executionTarget":null,"expectedResult":"各手続き後は0,3。","verificationStatus":"not_applicable","learningUnitIds":["unit-finite-function-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compose-finite-functions"],"prerequisiteIds":[],"attainmentCondition":"第二回に操作2だけを適用すると何が起きるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0 or 2=2となり正しい3を失う。各回は新操作だけでなくprefix合成写像を前回値へ適用する。"},"answer":{"reasoningOrVerification":"0 or 2=2となり正しい3を失う。各回は新操作だけでなくprefix合成写像を前回値へ適用する。","procedure":["具体例の各状態・寄与を再計算する。","0 or 2=2となり正しい3を失う。各回は新操作だけでなくprefix合成写像を前回値へ適用する。"],"expectedResult":"0 or 2=2となり正しい3を失う。各回は新操作だけでなくprefix合成写像を前回値へ適用する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限関数・作用の合成](src/content/docs/learn/query/finite-function-composition.md)

- 小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 有限関数・作用の合成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

AND・OR・XOR は各 bit を独立に写し、ある bit への prefix 操作全体も {0,1} から {0,1} への関数になる。

一つの unary Boolean function は入力 0 と 1 の出力の組 (f(0),f(1)) だけで完全に表せる。

棄却する候補: i 回目の出力ごとに操作 1,…,i を現在値へ一から順に実行する。

prefix の長さを毎回走査すると合計二乗回の演算になる。

採用する候補: 各 bit の prefix 合成関数を (f(0),f(1)) で更新し、その合成関数を前回の X に一度適用する。

新しい操作は二つの出力値へ適用するだけで合成でき、各 prefix の効果を定数個の bit 演算へ圧縮できる。

i 番目の手続きは操作 i だけでなく合成済みの操作 1,…,i を前回の X に再適用するため、prefix 関数そのものを保持する必要がある。

bitwise operation sequence を各 bit 上の四種類の unary Boolean function の monoid とみなし、prefix composition を逐次更新する。

## 典型の発動条件

### bit ごとの独立化

発動条件: AND・OR・XOR だけからなる操作列で、bit 間の桁上がりや依存がないとき。

30 個の bit を独立な二値関数として処理し、最後に整数へまとめる。

### 有限関数の prefix 合成

発動条件: 小さな有限集合上の関数を順に合成し、各 prefix の写像を求めるとき。

全入力に対する出力表を状態として、新関数を表の各値へ作用させる。

## 問題固有の要素

30 bit 分の f(0),f(1) は二本の整数 mask f0,f1 として同時に保持でき、X の 0 bit には f0、1 bit には f1 を選べる。

別の問題へ持ち帰る視点: 同型な小状態を全 bit に持つ場合、bitset 的な整数演算で状態遷移を並列化する。

## 正当性

i 番目の手続きは操作 i だけでなく合成済みの操作 1,…,i を前回の X に再適用するため、prefix 関数そのものを保持する必要がある。 新しい操作は二つの出力値へ適用するだけで合成でき、各 prefix の効果を定数個の bit 演算へ圧縮できる。

## 実装上の注意

- 初期写像は f0=0、f1=(1<<30)−1 の恒等関数とし、新操作を f0 と f1 の両方へ適用する。
- X の更新は ((NOT X) AND f0) OR (X AND f1) とし、NOT の上位 bit は30 bit maskで切り落とす。

## 復習の核

- bitwise 操作列では各 bit の入力候補が 0 と 1 しかないことから、合成関数を真理値表で持てないか考える。
- 問題文の各段階が前回状態へ何を再適用するかを小例で追い、単なるオンライン一操作と取り違えない。

## 計算量と制約

### 時間

O(NB)、B=30。bitmask並列ならO(N)。

### 空間

O(1)、f(0),f(1),現在X。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1\leq T_i \leq 3; 0\leq A_i \lt 2^{30}; 0\leq C \lt 2^{30}; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

初期X=1、操作はXOR 1、続いてOR 2。

1. 第一prefix写像で1→0。
2. 第二prefix写像はf(x)=(x xor 1) or 2なので、現在0→3。

期待される結果: 各手続き後は0,3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

第二回に操作2だけを適用すると何が起きるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

0 or 2=2となり正しい3を失う。各回は新操作だけでなくprefix合成写像を前回値へ適用する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/tasks/abc261_e) — source-abc261-e-problem-c8e8008b1c41ab6c87c76ae12879e203c622f67920eca7af05ced1c082b71578
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/editorial/4451) — source-abc261-editorial-4451-dfbb3f34b15ce9d7dbfa4321399954f2695e4cfa810541f982c32aa7c74e924f
