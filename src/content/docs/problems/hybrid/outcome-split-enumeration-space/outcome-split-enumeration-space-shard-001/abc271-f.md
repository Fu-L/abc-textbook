---
title: "ABC271-F — XOR on Grid Path"
draft: true
authoringUnit: {"problemId":"abc271-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc271-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle"],"sourceRevisionIds":["source-abc271-editorial-4925-19ad91acd5c2c9a9b19404010121c28e1bfa3f981ac243dc4107ee938b2253c1","source-abc271-f-problem-c81c79b9f08bcfd560d6e4294093f4aa569025fba39c2b64baeade51037625fa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"両half XORがmeeting valueをともに含むなら、full XOR=0は p⊕a_{x,y}⊕q=0、すなわちq=p⊕a_{x,y}と同値である。 XOR valueは同じものが複数pathから生じるため、setではなくfrequency mapを使い、matching frequenciesの積を答えへ足す。 各full pathが一意なhalf-path pairに対応し、総列挙量を指数の半分へ落とせる。","sourceRevisionIds":["source-abc271-editorial-4925-19ad91acd5c2c9a9b19404010121c28e1bfa3f981ac243dc4107ee938b2253c1","source-abc271-f-problem-c81c79b9f08bcfd560d6e4294093f4aa569025fba39c2b64baeade51037625fa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

## 考察

任意のmonotone pathはx+y=N+1のanti-diagonal上のちょうど一つのcellを通り、そこまでにN−1 moves、そこからN−1 movesへ二分できる。

全path数は最大約3.5×10^10だが、各half pathの総数は片側2^(N−1)なのでN≤20なら列挙できる。

棄却する候補: startからgoalへの全monotone pathsを列挙してvisited valuesのXORを計算する。

中央二項係数C(38,19)規模となり列挙不能である。

採用する候補: start側とgoal側からanti-diagonalまでhalf pathsを列挙し、meeting cell別のXOR frequencyを照合する。

## 典型の発動条件

### grid pathの半分全列挙

発動条件: path lengthは小さいが全path数が大きく、全pathが中央layerで一意に二分できるとき。

両端からN−1 movesだけDFSし、anti-diagonal cellごとにhalf-path情報を集める。

### XOR頻度のmeet-in-the-middle

発動条件: 全体のXOR条件を左右partial XOR間の一意なmatching valueへ変形できるとき。

一方のXOR frequencyをmapにし、他方の各qに必要なpのcountを加える。

## 問題固有の要素

meeting cellは両halfで二重にXORされるため、結合条件でa_{x,y}を一度追加してfull pathでは一度だけ含まれるよう補正する。

別の問題へ持ち帰る視点: meet-in-the-middleでは境界要素が左右のどちらに含まれるかを式で固定し、重複・欠落を補正する。

## 正当性

両half XORがmeeting valueをともに含むなら、full XOR=0は p⊕a_{x,y}⊕q=0、すなわちq=p⊕a_{x,y}と同値である。 XOR valueは同じものが複数pathから生じるため、setではなくfrequency mapを使い、matching frequenciesの積を答えへ足す。 各full pathが一意なhalf-path pairに対応し、総列挙量を指数の半分へ落とせる。

## 実装上の注意

- forward/backward DFSをちょうどN−1 movesで止め、meeting cell座標をkeyの一部として混在を防ぐ。
- 答えはpath数で32 bitを超えるため64 bit整数を使い、meeting valueの包含規約を両DFSで統一する。

## 復習の核

- 組合せpath数が大きい一方でlengthが40程度なら、全pathが一度だけ通る中央layerで二分する。
- 左右情報を照合する前に、meeting elementを含む回数をXOR式として明示する。

## 計算量と制約

### 時間

O(N2ᴺ)の保守的上界、半path列挙とmap照合の対数因子を含む。

### 空間

O(2ᴺ)、meeting cell別XOR頻度。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 20; 0 \leq a_{i, j} \lt 2^{30} \, (1 \leq i, j \leq N); All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/editorial/4925) — source-abc271-editorial-4925-19ad91acd5c2c9a9b19404010121c28e1bfa3f981ac243dc4107ee938b2253c1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/tasks/abc271_f) — source-abc271-f-problem-c81c79b9f08bcfd560d6e4294093f4aa569025fba39c2b64baeade51037625fa
