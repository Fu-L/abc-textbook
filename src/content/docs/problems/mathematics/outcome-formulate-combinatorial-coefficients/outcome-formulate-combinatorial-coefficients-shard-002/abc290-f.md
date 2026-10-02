---
title: "ABC290-F — Maximum Diameter"
draft: true
authoringUnit: {"problemId":"abc290-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc290-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a","source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正次数の総和2N−2を満たす各列は木として実現できる。直径pathの内部頂点は次数≥2なので直径≤内部候補数+1。全非葉を一本のpathに置き余剰次数を葉で埋めると達成できる。従って次数列総数と各頂点が非葉となる次数列数をstars-and-barsで数えた和が提示の二項係数式になる。","sourceRevisionIds":["source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a","source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

次数列が木として実現可能なのは正整数の総和が2N-2のときで、最大直径は次数2以上の頂点数+1になる。

採用する候補: 次数和条件とstars and barsによる総和計数

直径値を1と各座標が2以上である指示関数へ分解し、正整数列の個数を二つの組合せ数で数えられる。

棄却する候補: 全次数列と木を構成して直径を求める

次数列だけでも指数的で、実際の木の列挙は不要である。

次数2以上の頂点を一本のパスに並べ、残る次数を葉で埋めれば上界を達成できるため、木の形ではなく次数列の組合せだけを数えればよい。

最大Nまで二項係数を前計算し、各テストでC(2N-3,N-1)+N C(2N-4,N-1)を法998244353で計算する。

## 典型の発動条件

### 次数和公式

発動条件: 木の次数列を列挙・判定したい。

ΣX_i=2N-2を必要十分条件として使う。

### stars and bars

発動条件: 固定和の正・非負整数列数が必要になる。

|S|とX_1≥2の列数を二項係数で数える。

## 問題固有の要素

直径最大値が次数列の細部でなく「2以上の項数」だけで決まり、対称性から一座標の条件数をN倍できる。

別の問題へ持ち帰る視点: 構成で上界達成を示した後、評価関数を指示関数和へ分解して数える。

## 正当性

正次数の総和2N−2を満たす各列は木として実現できる。直径pathの内部頂点は次数≥2なので直径≤内部候補数+1。全非葉を一本のpathに置き余剰次数を葉で埋めると達成できる。従って次数列総数と各頂点が非葉となる次数列数をstars-and-barsで数えた和が提示の二項係数式になる。

## 実装上の注意

- 全テストの最大Nまで階乗・逆階乗を前計算し、N=2で負のstars-and-bars引数を作らない。

## 復習の核

- 小さいNの正整数列列挙と比較し、N=2,3と全頂点が葉になれない次数和境界を確認する。

## 計算量と制約

### 時間

O(Nmax+T)。最大Nまで階乗表を共有し各caseを定数時間で評価する。

### 空間

O(Nmax)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T \leq 2\times 10^5; 2 \leq N \leq 10^6; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5768) — source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_f) — source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62
