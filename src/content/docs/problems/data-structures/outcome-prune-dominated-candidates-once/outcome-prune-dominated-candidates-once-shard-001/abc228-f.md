---
title: "ABC228-F — Stamp Game"
draft: true
authoringUnit: {"problemId":"abc228-f","docPath":"src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc228-f.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["全候補から極値を反復取得するheap・ordered set。"],"tagIds":["tag-monotone-stack-queue","tag-prefix-difference"],"sourceRevisionIds":["source-abc228-editorial-2945-12052f0fe09662260111e151499b5f2b2c3b5c7537f68c1c357cefea7748b13c","source-abc228-f-problem-89dadce4e1a0dc6582e292f9fa5d8b96f6f301dbf03a4e01c582b05833b501da"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"青木の手を『白スタンプの盤面上の位置』で追う必要はなく、固定した黒長方形の内部で最大和となる h2×w2 長方形を引く最小最大問題に変換できる。 白長方形の左上ごとの和を配列にすると、黒長方形内で許される左上座標は長方形範囲になる。その最大値は、横幅w1-w2+1、縦幅h1-h2+1のスライド最大値である。 各配置の和を定数時間で得られ、包含範囲ごとの最大値も横・縦の一方向窓へ分解して全盤面をまとめて処理できる。","sourceRevisionIds":["source-abc228-editorial-2945-12052f0fe09662260111e151499b5f2b2c3b5c7537f68c1c357cefea7748b13c","source-abc228-f-problem-89dadce4e1a0dc6582e292f9fa5d8b96f6f301dbf03a4e01c582b05833b501da"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

先に読む単元:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 全候補から極値を反復取得するheap・ordered set。

## 考察

高橋が黒くした長方形を固定すると、得点はその長方形の総和から、青木が白くする重なり部分の総和を引いた値になる。全要素が正なので、青木は重なりを最大化する白長方形を選ぶ。

白スタンプが黒スタンプより大きい方向は、重なりだけを考えれば黒スタンプと同じ長さに切り詰めてよい。切り詰め後は、青木の最適な重なりを黒長方形の内部に完全に収められる。

棄却する候補: 黒スタンプの各位置について、重なる全ての白スタンプ位置を列挙して最悪得点を求める。

盤面が1000×1000まであり、黒位置ごとに白位置を走査すると組合せが多すぎる。

採用する候補: 長方形和を二次元累積和で求め、各黒長方形内に収まる白長方形和の最大値を二次元スライド最大値として前計算する。

h2,w2をh1,w1以下へ切り詰め、二次元累積和で全ての黒・白長方形和を作る。白長方形和へdequeによる横方向、次に縦方向の窓最大値を適用し、各黒位置について黒和−内部の白最大和を求め、その最大を答える。

## 典型の発動条件

### 固定した一手に対する最悪応答への変換

発動条件: 二人の選択後の評価が、先手の領域量から後手との重なり量を引く形になるとき。

黒長方形を固定し、青木の最小化を内部の白長方形和の最大化として表す。

### 二次元累積和

発動条件: 静的な盤面上で同じ大きさの長方形和を多数評価するとき。

各黒スタンプと白スタンプの配置が覆う要素の総和を定数回の参照で求める。

### 二次元スライド最大値

発動条件: 二次元配列の各長方形窓について最大値を求め、窓を一方向ずつに分解できるとき。

白長方形和に横方向と縦方向のdeque処理を順に行い、各黒長方形内の最大値を得る。

## 問題固有の要素

Aの全要素が正であるため、青木の白スタンプが黒長方形からはみ出す配置より、同じ大きさの重なりを内部へ寄せた配置が不利にならない。これが包含する白長方形だけを調べてよい根拠になる。

別の問題へ持ち帰る視点: 領域同士のゲームでは、盤面上の絶対位置より交差領域が評価を決めないか、また重みの符号から交差を包含配置へ正規化できないかを確認する。

## 正当性

青木の手を『白スタンプの盤面上の位置』で追う必要はなく、固定した黒長方形の内部で最大和となる h2×w2 長方形を引く最小最大問題に変換できる。 白長方形の左上ごとの和を配列にすると、黒長方形内で許される左上座標は長方形範囲になる。その最大値は、横幅w1-w2+1、縦幅h1-h2+1のスライド最大値である。 各配置の和を定数時間で得られ、包含範囲ごとの最大値も横・縦の一方向窓へ分解して全盤面をまとめて処理できる。

## 実装上の注意

- 最初にh2=min(h2,h1), w2=min(w2,w1)とし、白長方形の左上座標配列と最大値配列の添字範囲を別々に確認する。
- 要素値と長方形面積の積は32bitを超えるため、累積和と得点を64bit整数で保持する。

## 復習の核

- 青木の候補を黒長方形内へ制限する証明では、h2,w2の切り詰めとAが正である条件を明示する。窓最大値の実装説明だけでこのゲーム上の変換を省略しない。

## 計算量と制約

### 時間

O(HW)、2D prefixと二方向の窓最大。

### 空間

O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 1000; 1 \leq h_1, h_2 \leq H; 1 \leq w_1, w_2 \leq W; 1 \leq A_{i, j} \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/editorial/2945) — source-abc228-editorial-2945-12052f0fe09662260111e151499b5f2b2c3b5c7537f68c1c357cefea7748b13c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/tasks/abc228_f) — source-abc228-f-problem-89dadce4e1a0dc6582e292f9fa5d8b96f6f301dbf03a4e01c582b05833b501da
