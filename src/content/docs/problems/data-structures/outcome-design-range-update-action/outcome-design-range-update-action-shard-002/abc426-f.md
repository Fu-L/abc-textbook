---
title: "ABC426-F — Clearance"
draft: true
authoringUnit: {"problemId":"abc426-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc426-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc426-editorial-14143-0c6e4382363b1d657429ec69212ff11cb35e9fe9a5858f8a00956f490a3593d3","source-abc426-f-problem-93e6832d004ca768f3f6b7cf4738709114637b35636654bb85d2be9503041827"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"まだ在庫切れしていない商品数 c に対してまず c·k_i 売れたと仮定し、負在庫 -s になった商品の過大計上 s だけを差し引けば正しい販売数になる。 確定済み商品を十分大きい在庫へ置き換えると、以降の range add と range minimum の対象から実質的に除外できる。 各注文を対数時間で処理し、在庫切れ確定は商品ごとに高々一回なので全探索回数が O(N) に抑えられる。","sourceRevisionIds":["source-abc426-editorial-14143-0c6e4382363b1d657429ec69212ff11cb35e9fe9a5858f8a00956f490a3593d3","source-abc426-f-problem-93e6832d004ca768f3f6b7cf4738709114637b35636654bb85d2be9503041827"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

各商品は注文を順に処理すると、全量 k_i を販売できる期間、在庫を使い切る一度だけの注文、その後まったく売れない期間の三段階をたどる。

採用する候補: 販売可能な商品へ区間一様減算し、在庫が負になった商品を区間最小値とセグメント木上の探索で一つずつ確定除去する。

棄却する候補: 各注文区間の商品を逐一走査して販売数と在庫を更新する。

区間長の総和が大きくなり、最悪 O(NQ) になる。

遅延セグメント木に各商品の在庫最小値と未枯渇個数を持つ。注文 [l,r],k ごとに未枯渇数·k を暫定答えとし、区間へ -k を加える。区間最小値が負の間、その位置 x を探索し、負の絶対値を答えから引いて x を INF に更新する。

## 典型の発動条件

### 遅延伝搬セグメント木

発動条件: 区間一様加算と区間最小値取得を交互に行うとき。

注文区間の全在庫を一括減算し、負在庫の存在を根の最小値で検出する。

### 償却解析

発動条件: ある要素に対する高価な個別処理が、その要素の生涯で一度だけ起きるとき。

在庫切れ位置の探索・除去は各商品一回なので、while ループ全体を O(N log N) と評価する。

## 問題固有の要素

一部だけ売れる注文を事前に特定する代わりに、全量販売を仮定した後で在庫切れ時の超過分を補正する。

別の問題へ持ち帰る視点: 単調に対象外になる要素は番兵値へ移し、区間更新データ構造のまま管理できる。

## 正当性

まだ在庫切れしていない商品数 c に対してまず c·k_i 売れたと仮定し、負在庫 -s になった商品の過大計上 s だけを差し引けば正しい販売数になる。 確定済み商品を十分大きい在庫へ置き換えると、以降の range add と range minimum の対象から実質的に除外できる。 各注文を対数時間で処理し、在庫切れ確定は商品ごとに高々一回なので全探索回数が O(N) に抑えられる。

## 実装上の注意

- INF は全区間減算を受けても負にならない余裕を持たせる。未枯渇個数は別の Fenwick 木かセグメント木の集約値で正確に数える。

## 復習の核

- 在庫がちょうど 0 はまだ過大計上を生まない点、負になったときの補正量が現在値 -s に対する s である点を確認する。

## 計算量と制約

### 時間

O((N+Q)log N)、各商品の負在庫確定は一度だけ。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 3 \times 10^5; 1 \le A_i \le 10^{15}; 1 \le Q \le 3 \times 10^5; 1 \le l_i \le r_i \le N; 1 \le k_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/editorial/14143) — source-abc426-editorial-14143-0c6e4382363b1d657429ec69212ff11cb35e9fe9a5858f8a00956f490a3593d3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/tasks/abc426_f) — source-abc426-f-problem-93e6832d004ca768f3f6b7cf4738709114637b35636654bb85d2be9503041827
