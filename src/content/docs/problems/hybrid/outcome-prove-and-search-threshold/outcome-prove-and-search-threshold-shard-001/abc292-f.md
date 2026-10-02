---
title: "ABC292-F — Regular Triangle Inside a Rectangle"
draft: true
authoringUnit: {"problemId":"abc292-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc292-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc292-editorial-5884-ca8674d8c02ba4e9de86ab56ed2fc793bfb63f2e4110e636666fa34db9dee257","source-abc292-f-problem-14684cc6ad83cda8b2e7dfa0094c5b55b180871141e9ef06070428a0f66e1d08"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一頂点を長方形の角へ平行移動してよい。そこから二辺の方向をθとθ+60°、0≤θ≤30°にすると、幅はl cosθ、高さはl sin(θ+60°)。前者はθについて減少、後者は増加するので、幅条件を満たす最小θで高さ条件を確認すれば必要十分。辺長を小さくしても収まるので二分探索できる。","sourceRevisionIds":["source-abc292-editorial-5884-ca8674d8c02ba4e9de86ab56ed2fc793bfb63f2e4110e636666fa34db9dee257","source-abc292-f-problem-14684cc6ad83cda8b2e7dfa0094c5b55b180871141e9ef06070428a0f66e1d08"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

正三角形の最上下左右の頂点のうち一つは長方形の角に合わせられる。左下を共有すると二辺の方向はθとθ+60°で0≤θ≤30°。座標を直接書けば幅l cosθ、高さl sin(θ+60°)となる。公式本文の縦幅l sinθという箇所は第三頂点を落としている。幅条件がθの下限、高さ条件が上限を与えるので最小許容角を確認する。辺長を縮小すれば収容可能性は保存され、最大辺長を二分探索できる。

## 典型の発動条件

単調判定の中で別の単調parameterを消す。候補辺長lに対し最小許容角θだけを調べる。

## 問題固有の要素

正三角形の二辺は60°離れている。縦幅は下側辺のendpointでなく上側endpointのl sin(θ+60°)。

## 正当性

一頂点を長方形の角へ平行移動してよい。そこから二辺の方向をθとθ+60°、0≤θ≤30°にすると、幅はl cosθ、高さはl sin(θ+60°)。前者はθについて減少、後者は増加するので、幅条件を満たす最小θで高さ条件を確認すれば必要十分。辺長を小さくしても収まるので二分探索できる。

## 実装上の注意

角度範囲[0,π/6]を保ち、acos引数を[-1,1]へ丸める前に幅の不可能caseを判定する。高さ判定はl sin(θ+π/3)≤A。

## 復習の核

A=1,B=2で最大2/√3となる。θ=0でも高さが0にならないことを確認し、vertex座標から三角関数を再導出する。

## 計算量と制約

### 時間

O(log(C/ε))、εは辺長二分探索精度、Cは探索上限。角度をacosで求める判定O(1)。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq A,B \leq 1000; A and B are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/editorial/5884) — source-abc292-editorial-5884-ca8674d8c02ba4e9de86ab56ed2fc793bfb63f2e4110e636666fa34db9dee257
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/tasks/abc292_f) — source-abc292-f-problem-14684cc6ad83cda8b2e7dfa0094c5b55b180871141e9ef06070428a0f66e1d08
