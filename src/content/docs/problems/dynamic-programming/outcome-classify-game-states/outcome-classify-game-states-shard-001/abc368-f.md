---
title: "ABC368-F — Dividing Game"
draft: true
authoringUnit: {"problemId":"abc368-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc368-f.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prime-divisor"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc368-editorial-10761-0bc3bb4d8c94b774a34347b8e31848f6917e8123e92e77d5e6eb7d25ad717c9b","source-abc368-f-problem-cd00451a2f62afd4f84d2f5cdebf0a53465ad8c85b06a9fe3c300051f93e968a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重複込み素因数数が x の整数からは任意の0..x−1個へ移れる。元の素因数多重集合から好きな個数を残す約数を選べるためである。帰納法でその Grundy 数は mex{0,..,x−1}=x。操作は一山にしか作用しないので全体 Grundy は各 x の xor。normal play では xor0が負け、非0が勝ちとなる。","sourceRevisionIds":["source-abc368-editorial-10761-0bc3bb4d8c94b774a34347b8e31848f6917e8123e92e77d5e6eb7d25ad717c9b","source-abc368-f-problem-cd00451a2f62afd4f84d2f5cdebf0a53465ad8c85b06a9fe3c300051f93e968a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-classify-game-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(12,8)。","procedure":["12=2²×3でΩ=3。","8=2³でΩ=3。","3 xor3=0。"],"executionTarget":null,"expectedResult":"Bob","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-game"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-classify-game-states"],"prerequisiteIds":["unit-dp-state-design","unit-prime-divisor"],"attainmentCondition":"素因数の種類数を使うとこの例はどう誤るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"12の種類数2、8の種類数1でxor3となり Anna と誤判定する。指数も数える必要がある。"},"answer":{"reasoningOrVerification":"12の種類数2、8の種類数1でxor3となり Anna と誤判定する。指数も数える必要がある。","procedure":["具体例の各状態・寄与を再計算する。","12の種類数2、8の種類数1でxor3となり Anna と誤判定する。指数も数える必要がある。"],"expectedResult":"12の種類数2、8の種類数1でxor3となり Anna と誤判定する。指数も数える必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

A_iをproper divisorへ置き換える操作は、素因数分解に含まれる素因数を重複込みで一個以上取り除く操作と同値である。 Ω(A_i)を素因数の総個数とすると、その山から任意の0..Ω−1へ移れるためGrundy数はΩ(A_i)になる。複数要素のgameはdisjoint sumである。 指数和xの素因数multisetから任意のy<x個を残す約数を選べるので、遷移Grundy集合は{0,1,...,x−1}となりmexはxである。 一手では一つのA_iだけを変更するため、独立heapのGrundy XORという通常Nimの合成条件を満たす。

採用する候補: 各A_iの重複込み素因数個数Ω(A_i)を求め、そのXORが非零かで勝者を判定する。

各数の約数gameが任意個数の石を取るNim heapと同型になり、Sprague-Grundy和を直接使える。

棄却する候補: 全約数を列挙して各値のGrundy数をmex DPする。

値ごとに遷移先約数を展開する必要はなく、操作が素因数個数だけで完全に特徴付けられる。

指数和xの素因数multisetから任意のy<x個を残す約数を選べるので、遷移Grundy集合は{0,1,...,x−1}となりmexはxである。

一手では一つのA_iだけを変更するため、独立heapのGrundy XORという通常Nimの合成条件を満たす。

最大Aまでsmallest prime factorまたはΩ値をsieveで前計算し、各A_iを割りながら重複込み素因数数x_iを得る。全x_iのbitwise XORを取り、0ならBob、非0ならAnnaを出力する。

## 典型の発動条件

### 数論gameのNim同型化

発動条件: 整数を約数へ減らす操作が素因数multisetの削除として表せるとき。

素因数の総数をheap sizeとみなしGrundy数を決定する。

### smallest-prime-factor sieve

発動条件: 多数の上限が小さい整数を重複込みで素因数分解するとき。

最小素因数表で割るたびΩを一つ増やす。

## 問題固有の要素

素因数の種類ではなく指数和だけが重要なのは、任意のproper divisorを選べて残す因子multisetを自由に決められるためである。

別の問題へ持ち帰る視点: divisor move gameでは指数vector全体のどの統計量へ任意に減らせるか調べる。

## 正当性

重複込み素因数数が x の整数からは任意の0..x−1個へ移れる。元の素因数多重集合から好きな個数を残す約数を選べるためである。帰納法でその Grundy 数は mex{0,..,x−1}=x。操作は一山にしか作用しないので全体 Grundy は各 x の xor。normal play では xor0が負け、非0が勝ちとなる。

## 実装上の注意

- Ωはdistinct prime数でなく重複込み指数和とする。勝者名とnormal playでXOR=0が後手勝ちである対応を確認する。

## 復習の核

- 12=2²·3をheap size3として、到達できるΩが0,1,2すべてあるか確認する。square-free因子数と混同しない。

## 計算量と制約

### 時間

N 山、最大値 V。最小素因数 sieve を O(V log log V) で作り、分解は O(N log V)。

### 空間

最小素因数表で O(V)、山入力を持つなら追加 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 2 \leq A_i \leq 10^5; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(12,8)。

1. 12=2²×3でΩ=3。
2. 8=2³でΩ=3。
3. 3 xor3=0。

期待される結果: Bob

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

素因数の種類数を使うとこの例はどう誤るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

12の種類数2、8の種類数1でxor3となり Anna と誤判定する。指数も数える必要がある。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/editorial/10761) — source-abc368-editorial-10761-0bc3bb4d8c94b774a34347b8e31848f6917e8123e92e77d5e6eb7d25ad717c9b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/tasks/abc368_f) — source-abc368-f-problem-cd00451a2f62afd4f84d2f5cdebf0a53465ad8c85b06a9fe3c300051f93e968a
