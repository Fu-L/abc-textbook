---
title: "ABC428-F — Pyramid Alignment"
draft: true
authoringUnit: {"problemId":"abc428-f","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc428-f.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-interval-partition"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-endpoint-run-partition"],"sourceRevisionIds":["source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906","source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各block内では全区間が同じ左端または同じ右端を持ち、幅W_iだけが異なるので、連続番号範囲と共通端点で現在の全区間を復元できる。タイプ1・2はどちらも `[1,v]` を一つの新しい共有端点blockへ置き換える。境界区間vの端点を更新前に読めば操作先が正しく決まり、vをまたぐ旧blockのsuffixだけを保存する更新は他の番号の状態を変えない。座標を含む区間は包含順にsuffixをなすため、二分探索で最初の番号を見つければ答えはN−first+1となる。","sourceRevisionIds":["source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906","source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

先に読む単元:

- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md) — 順序付きのrun分割をdequeや連結リストで保持し、両端からの削除・分割・追加を行う。左端順setを使うODTとは区別する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

区間番号が大きいほど幅 `W_i` は大きく、常に小さい番号の区間を包含する。タイプ1・2のどちらも更新対象は同じ番号prefix `[1,v]` で、タイプが左端・右端のどちらを共通位置へ揃えるかを選ぶ。

番号順の連続区間を、共有する端点とその座標を持つblockで表す。更新前に区間vの指定端点を読み、prefix `[1,v]` に重なるblockを除去する。vをまたぐblockがあれば `[v+1,r]` を残し、更新後のprefix blockを先頭へ置く。除去されたblockは戻らないので、更新で処理するblock総数はO(Q)。

照会では区間が番号順に包含されるため、点を含むかはfalseからtrueへ一度だけ変わる。blockの右端区間で二分探索して該当blockを探し、その中では単調なW_iを二分探索して最初に点を含む番号を求める。答えはそこからNまでの個数。

採用する候補: 番号範囲を持つblockをrandom-access dequeで保ち、prefix更新と二段二分探索を行う。

連続する多数の区間を個別更新せず、同じ端点を共有する区間群をまとめられる。

棄却する候補: 全N区間の座標を更新のたびに書き換える。

一回O(N)、全体O(QN)になる。

## 典型の発動条件

### ランレングス状の区間管理

発動条件: 連続添字範囲が同じ規則・同じ端点を共有し、更新が端から範囲を上書きするとき。

同一整列状態を一ブロックに圧縮し、クエリを split・pop・push で表す。

### ポテンシャル法による償却

発動条件: 一操作で多数要素を削除し得るが、各操作が追加する要素数は定数のとき。

ブロック数をポテンシャルと見て、全 pop 回数を全 push 回数で抑える。

### 包含列上の二分探索

発動条件: 対象を含むかという述語が添字順に単調なとき。

点 x+1/2 を初めて含む区間番号 k+1 を探し、N-k を答える。

## 問題固有の要素

更新対象を値の配列ではなく、同じ幾何制約を共有する最大連続範囲として持つと一括上書きが安くなる。

別の問題へ持ち帰る視点: 大量 pop を伴う端更新は、ブロックの生成回数が少なければ償却定数時間になる。

## 正当性

各block内では全区間が同じ左端または同じ右端を持ち、幅W_iだけが異なるので、連続番号範囲と共通端点で現在の全区間を復元できる。タイプ1・2はどちらも `[1,v]` を一つの新しい共有端点blockへ置き換える。境界区間vの端点を更新前に読めば操作先が正しく決まり、vをまたぐ旧blockのsuffixだけを保存する更新は他の番号の状態を変えない。座標を含む区間は包含順にsuffixをなすため、二分探索で最初の番号を見つければ答えはN−first+1となる。

## 実装上の注意

- タイプ1・2とも番号prefix `[1,v]` を更新する。vの現在端点はblockを書き換える前に読む。範囲がvをまたぐblockは `[v+1,r]` を残す。
- blockは番号順のrandom-access dequeなどで持つ。連結listの `lower_bound` は要素移動が線形になるため、そのままO(logQ)照会とは数えられない。
- 右端共有blockの左端は `x−W_i`、左端共有blockの右端は `x+W_i`。半整数判定は2倍整数で行う。

## 復習の核

- ブロックを途中で切る場合の l,r と、左右どちらの端から pop するかを操作定義に合わせて確認する。

## 計算量と制約

### 時間

全Q更新のblock処理は償却O(Q log Q)、照会は二段二分探索O(log Q+log N)。

### 空間

O(Q)、整列block数。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq W_i \leq 10^9 (1 \leq i \leq N); W_1 < W_2 < \dots < W_N; For v given in queries of types 1 and 2, 1 \leq v \leq N.; For x given in queries of type 3, 0 \leq x \leq 10^9.; At least one query of type 3 is given.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/editorial/14251) — source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/tasks/abc428_f) — source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb
