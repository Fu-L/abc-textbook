---
title: "ABC327-F — Apples"
draft: true
authoringUnit: {"problemId":"abc327-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc327-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-actions"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc327-editorial-7579-19143f964595c33a9fb75c3de2ae24608c840e791233afa2c12a9619ca872058","source-abc327-f-problem-caf95a8c3cb45ee5a85c76cc95ddb9e61bf314152fb11c7235ef0b035e9b269a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"時間intervalはinclusiveなのでstart=max(1,T_i-D+1)で+1、T_i+1で−1を発生させると、S=T_iまでactiveになる。 空間intervalもLの整数候補に対するinclusive範囲で、segment treeでは[lower,X_i+1)へ変換する。 二次元rectangle加算を1次元の動的区間加算へ落とし、各appleを追加・削除の2回だけ処理できる。","sourceRevisionIds":["source-abc327-editorial-7579-19143f964595c33a9fb75c3de2ae24608c840e791233afa2c12a9619ca872058","source-abc327-f-problem-caf95a8c3cb45ee5a85c76cc95ddb9e61bf314152fb11c7235ef0b035e9b269a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

apple(T_i,X_i)を取れるbasket start(S,L)はS∈[max(1,T_i-D+1),T_i]かつL∈[max(1,X_i-W+1),X_i]というaxis-aligned rectangleになる。

求める値は全apple rectangleに覆われる格子点(S,L)の最大重なり数である。

Sを昇順sweepすると各rectangleは開始時にL区間へ+1、終了直後に−1するrange-add eventへ変わる。

採用する候補: S方向をevent sweepし、L軸のrange add・global maxをlazy segment treeで管理する。

二次元rectangle加算を1次元の動的区間加算へ落とし、各appleを追加・削除の2回だけ処理できる。

棄却する候補: 全(S,L)格子へ2次元imosを作る。

両座標が2×10^5でgridが約4×10^10 cellになりmemoryを持てない。

棄却する候補: 各Sでactive appleの全L候補をscanする。

時刻ごとに最大Xまで走査すると座標範囲の積に比例する。

時間intervalはinclusiveなのでstart=max(1,T_i-D+1)で+1、T_i+1で−1を発生させると、S=T_iまでactiveになる。

空間intervalもLの整数候補に対するinclusive範囲で、segment treeでは[lower,X_i+1)へ変換する。

各appleについてs0=max(1,T_i-D+1)、l0=max(1,X_i-W+1)を求め、events[s0]へ(+1,[l0,X_i])、events[T_i+1]へ(−1,同区間)を登録する。全L位置を0で持つrange-add/global-max lazy segment treeを作り、S=1..max T_iでその時刻のeventを全てapplyした後、root最大値でanswerを更新する。

## 典型の発動条件

### rectangle overlapのsweep line

発動条件: 二次元axis-aligned rectangleの最大被覆数を求め、一軸のevent端点が離散的なとき。

一軸sweep＋他軸range addへ変換する。

### range add・range max lazy tree

発動条件: intervalへ増減を加えながら全位置の最大値を繰り返し問うとき。

node maxとadd lazy tagを持つ。

### inclusive intervalの差分event

発動条件: 整数時刻[start,end]だけ対象をactiveにしたいとき。

startで追加しend+1で削除する。

## 問題固有の要素

basket配置を直接探索せず、各apple側から「自分を取れる配置parameterのrectangle」を塗るdualな見方で最大取得数が重なり最大へ変わる。

別の問題へ持ち帰る視点: 選択parameterで条件を満たすitem数最大化は、各itemが許すparameter領域を加算し最大被覆点を探す問題へ双対化する。

## 正当性

時間intervalはinclusiveなのでstart=max(1,T_i-D+1)で+1、T_i+1で−1を発生させると、S=T_iまでactiveになる。 空間intervalもLの整数候補に対するinclusive範囲で、segment treeでは[lower,X_i+1)へ変換する。 二次元rectangle加算を1次元の動的区間加算へ落とし、各appleを追加・削除の2回だけ処理できる。

## 実装上の注意

- 同じSに追加・削除があっても全eventを適用してからmaxを読むと、そのSでactiveなinclusive条件になる。
- Lは正整数だけなのでlowerを1でclipし、half-open segment tree indexへの変換を統一する。

## 復習の核

- D=W=1のappleが単一点(S,L)だけを覆う例と、終了T_i+1で削除される例をevent表にしてoff-by-oneを確認する。

## 計算量と制約

### 時間

O(N log N+N log X)、event sort版、Xは位置域の木size。全時刻走査版は追加O(Tmax)。

### 空間

O(N+X)、lazy tree。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N\leq 2\times 10^5; 1 \leq D\leq 2\times 10^5; 1 \leq W\leq 2\times 10^5; 1 \leq T_i\leq 2\times 10^5; 1 \leq X_i\leq 2\times 10^5; All pairs (T_i,X_i) are different.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/editorial/7579) — source-abc327-editorial-7579-19143f964595c33a9fb75c3de2ae24608c840e791233afa2c12a9619ca872058
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/tasks/abc327_f) — source-abc327-f-problem-caf95a8c3cb45ee5a85c76cc95ddb9e61bf314152fb11c7235ef0b035e9b269a
