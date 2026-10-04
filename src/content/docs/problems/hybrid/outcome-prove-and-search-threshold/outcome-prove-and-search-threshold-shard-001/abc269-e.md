---
title: "ABC269-E — Last Rook"
draft: true
authoringUnit: {"problemId":"abc269-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc269-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-interactive-protocol"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-interactive-protocol"],"sourceRevisionIds":["source-abc269-e-problem-8e4896a525fecb86db0fcd4de17d466b9225f950f4f821e20877a5e10bb5f096","source-abc269-editorial-4840-d8749b6eed0a078a255f371f2ff4ac02394f8bb7a44ec8628dc435c2448a0f51"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"二次元の配置を直接特定せず、一方の座標範囲を全面にして行occupancyと列occupancyという二つの一次元問題へ分離する。 候補区間[L,R]の左半分[L,M]へ質問し、返値が区間長より1小さいかどうかだけでmissing coordinateの側を決められる。 各判定で候補区間を半減でき、合計2⌈log2 N⌉≤20回に収まる。","sourceRevisionIds":["source-abc269-e-problem-8e4896a525fecb86db0fcd4de17d466b9225f950f4f821e20877a5e10bb5f096","source-abc269-editorial-4840-d8749b6eed0a078a255f371f2ff4ac02394f8bb7a44ec8628dc435c2448a0f51"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

N−1個のrookは行も列も重ならないため、rookのない行とrookのない列がそれぞれちょうど一つあり、その交点が答えになる。

列範囲を全列に固定すると、連続するk行のrectangle queryはmissing rowを含まなければk、含めばk−1を返す。

棄却する候補: 各行と各列を一つずつqueryしてrookのないものを探す。

最大2N回を要し、20回のquery上限を超える。

採用する候補: 全列を含むqueryでmissing rowを二分探索し、全行を含むqueryでも同様にmissing columnを二分探索する。

rectangle count queryを一次元のdefect detectorとして使い、独立な二回のbinary searchで唯一欠けたrowとcolumnを復元する。

## 典型の発動条件

### 座標ごとの問題分離

発動条件: 二次元対象でも、一方の軸を全範囲にしたqueryが他方の軸の独立な統計量を返すとき。

全列を覆って各行のrook有無を数え、全行を覆って各列のrook有無を数える。

### 欠損位置の二分探索

発動条件: 区間内の正常要素数から、唯一の欠損がその区間に含まれるか判定できるとき。

queried intervalの長さとrook数を比較し、欠損を含む半区間だけを残す。

## 問題固有の要素

rookが同じ行・列を共有しないという条件により、全幅rectangleの返値が行ごとの0/1列の区間和になる。

別の問題へ持ち帰る視点: 高次元queryは、不要な次元を全域に固定して低次元の探索oracleへ落とせないか調べる。

## 正当性

二次元の配置を直接特定せず、一方の座標範囲を全面にして行occupancyと列occupancyという二つの一次元問題へ分離する。 候補区間[L,R]の左半分[L,M]へ質問し、返値が区間長より1小さいかどうかだけでmissing coordinateの側を決められる。 各判定で候補区間を半減でき、合計2⌈log2 N⌉≤20回に収まる。

## 実装上の注意

- 各queryを改行してflushし、judgeから−1が返った場合は直ちに終了する。
- inclusive query [L,M]の長さM−L+1と返値を比較し、更新後も答えが[L,R]にある不変条件を保つ。

## 復習の核

- 二次元の未知位置を探す前に、全面queryで各座標を独立に観測できるかを確認する。
- 区間countが期待される満杯数から何個不足するかをbinary-search predicateにする。

## 計算量と制約

### 時間

O(log N)質問、行・列それぞれ二分探索。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^3; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/tasks/abc269_e) — source-abc269-e-problem-8e4896a525fecb86db0fcd4de17d466b9225f950f4f821e20877a5e10bb5f096
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/editorial/4840) — source-abc269-editorial-4840-d8749b6eed0a078a255f371f2ff4ac02394f8bb7a44ec8628dc435c2448a0f51
