---
title: "ABC474 E — One Time Coupon"
draft: true
authoringUnit: {"problemId":"abc474-e","docPath":"src/content/docs/problems/updates/abc474-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc474-e-problem-6917879ae8fbda6c5c2601451055e47350c2664bf0e81ab4ec540869f94418da","source-abc474-editorial-25442-a00af220ae77a0f39f7ff3cedcfef0f5cdcd9e195c1cde82a6c3e6cab2730fdd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"クーポン使用k回には、最低でもk枚の供給が必要。通常購入する必要種類N−kだけでは不足する分を余分な通常購入で補い、その一回当たり最小費用はmin A_iである。固定kで節約額上位を選ぶ交換は供給数を変えず費用だけを下げる。全kを列挙し、供給を先に行う構成で下界が達成される。","sourceRevisionIds":["source-abc474-e-problem-6917879ae8fbda6c5c2601451055e47350c2664bf0e81ab4ec540869f94418da","source-abc474-editorial-25442-a00af220ae77a0f39f7ff3cedcfef0f5cdcd9e195c1cde82a6c3e6cab2730fdd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 考察

各種類を一回買う基本コストはΣA_i。クーポンで買う商品iへ変更するとA_i−B_iだけ安くなるが、同時にクーポン供給が一枚減り、消費が一枚増える。

クーポン使用種類数をkとすると、通常購入N−k回からN−k枚を供給でき、足りなければ2k−N枚を余分に通常購入する。重複購入は品揃えを増やさずクーポンを作るためだけに使うので、通常価格a=min A_iの商品でよい。固定kでの追加コストは max(0,2k−N)a となる。

節約額D_i=A_i−B_iを降順に並べてprefix和を取る。k=0,…,Nについて ΣA_i−Σ_{j≤k}D_j+max(0,2k−N)a を評価し、最小を返す。N−k個の通常購入と必要な追加購入をすべて先に行えば、残るk個の割引購入に十分なクーポンがあるため、このコストは実現できる。

## 典型の発動条件

資源使用数を固定して交換論を適用する。資源の獲得と消費を同時に変える選択では差分の係数を先に数える。

## 問題固有の要素

割引購入へ替えるとクーポンの純収支は2枚悪化する。重複購入を許すことが不足分の線形費用を生む。

## 正当性

クーポン使用k回には、最低でもk枚の供給が必要。通常購入する必要種類N−kだけでは不足する分を余分な通常購入で補い、その一回当たり最小費用はmin A_iである。固定kで節約額上位を選ぶ交換は供給数を変えず費用だけを下げる。全kを列挙し、供給を先に行う構成で下界が達成される。

## 実装上の注意

k=Nも候補。コスト・節約和は64 bit整数。追加購入のaは割引価格ではなく通常価格。

## 復習の核

貪欲選択の前に、個数を固定すると資源収支が何だけで決まるかを見る。

## 計算量と制約

### 時間

節約額ソート O(N log N)、全k走査 O(N)。

### 空間

価格とprefix和 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le N\le 2\times 10^5; 1\le B_i < A_i \le 10^9; The sum of N over all test cases is at most 2\times 10^5.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc474/tasks/abc474_e)
- [公式解説](https://atcoder.jp/contests/abc474/editorial/25442)
