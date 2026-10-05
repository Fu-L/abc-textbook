---
title: "ABC312-F — Cans and Openers"
draft: true
authoringUnit: {"problemId":"abc312-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc312-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc312-editorial-6853-b922391c5997239551db86f1c74077fc12ec6ddd38808df07fb5358c868dca64","source-abc312-f-problem-5f183be91a874fb126f803f5b9cf9cccd1901b25c908dd376b5c6289579b2f03"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未使用 opener capacity>0 なら次の通常缶を取ることが最善で、capacity=0 のときだけ最大容量 opener を取るという交換可能な順序がある。 type0 の prefix sum と、type1/type2 を合わせて s 個取った最適値を M−s と s で足せば、全構成をちょうど覆う。 各長さ s で通常缶側の最大満足度が得られ、残り M−s 個は type0 の最大 prefix と独立に組み合わせられる。","sourceRevisionIds":["source-abc312-editorial-6853-b922391c5997239551db86f1c74077fc12ec6ddd38808df07fb5358c868dca64","source-abc312-f-problem-5f183be91a874fb126f803f5b9cf9cccd1901b25c908dd376b5c6289579b2f03"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

同種の品を選ぶ個数が決まれば、缶は満足度降順、缶切りは開封可能数降順から prefix を取るのが最適である。したがって各種類内の具体的選択は消せる。

通常缶を一つ取るには未使用の開封枠が必要で、枠がなければ缶切りを取るしかない。通常缶側の候補は満足度降順なので、使える枠を遊ばせる利点はない。

採用する候補: 缶切り不要缶の個数を補数として考え、通常缶＋缶切り側を枠の有無に従う貪欲で一個ずつ伸ばし、全 prefix を比較する。

棄却する候補: M 個の価値が高い品から選び、必要になった時だけ缶切りへ交換する。

缶切り一個の価値は開けられる複数缶との組で決まり、単品価値順では交換の影響を局所比較できない。

三種類を X 降順に sort し、type0 の prefix sum を作る。s=0 から type1/type2 側を伸ばし、capacity があれば次の type1 の満足度を加えて枠を1減らし、なければ次の type2 を取り枠を増やす。各 s≤M で value+prefix0[M−s] の最大を取る。

## 典型の発動条件

### 種類別 sort と個数固定

発動条件: 選択制約が種類間だけにあり、同種類では価値または能力の大きい品が常に優越するとき。

各種類を降順 prefix に圧縮し、種類ごとの選択個数だけを探索する。

### resource 解禁型の貪欲

発動条件: 報酬品を取る前に容量を与える補助品が必要で、両者の順序を交換できるとき。

容量が正なら最大報酬、0なら最大容量を選んで各 prefix の最適値を作る。

## 問題固有の要素

缶切りを使い切らなくてもよいが、未使用の通常缶と未使用枠が同時に残る最適解は交換で改善できる。

別の問題へ持ち帰る視点: 補助アイテム問題では「無駄がない最適解」をまず示すと、局所貪欲の選択肢が一意になる。

## 正当性

未使用 opener capacity>0 なら次の通常缶を取ることが最善で、capacity=0 のときだけ最大容量 opener を取るという交換可能な順序がある。 type0 の prefix sum と、type1/type2 を合わせて s 個取った最適値を M−s と s で足せば、全構成をちょうど覆う。 各長さ s で通常缶側の最大満足度が得られ、残り M−s 個は type0 の最大 prefix と独立に組み合わせられる。

## 実装上の注意

- 各 list の枯渇時はその遷移を止める。opener を取った個数も M 枠を消費し、capacity と選択品数を混同しない。

## 復習の核

- 品単体の価値順ではなく、種類ごとの個数を固定した最適形を先に証明する。缶切りを選ぶこと自体が一枠を消費する点を小例で追う。

## 計算量と制約

### 時間

O(N log N)、三type sortとprefix・一方向greedy。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 2 \times 10^5; T_i is 0, 1, or 2.; 1 \leq X_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/editorial/6853) — source-abc312-editorial-6853-b922391c5997239551db86f1c74077fc12ec6ddd38808df07fb5358c868dca64
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/tasks/abc312_f) — source-abc312-f-problem-5f183be91a874fb126f803f5b9cf9cccd1901b25c908dd376b5c6289579b2f03
