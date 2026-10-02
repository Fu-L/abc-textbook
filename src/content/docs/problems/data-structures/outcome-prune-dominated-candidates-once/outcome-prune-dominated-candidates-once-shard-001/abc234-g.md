---
title: "ABC234-G — Divide a Sequence"
draft: true
authoringUnit: {"problemId":"abc234-g","docPath":"src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc234-g.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-prefix-partition"],"excludedTopics":["全候補から極値を反復取得するheap・ordered set。"],"tagIds":["tag-monotone-stack-queue","tag-dp-prefix-partition"],"sourceRevisionIds":["source-abc234-editorial-3227-9fabd73639dc7e10a436503cbcb90c463de740b56e8f78de4a0fb4e8080453e6","source-abc234-g-problem-8abd243ffa8e3e459b73e6d9c43a87b061f09a6f6ef5b7c665a6fc5c1c4655fc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"単調 stack の各要素に極値だけでなく、その極値を持つ全左端 j の dp_j 総和を持たせると、必要な重み付き極値和を差分更新できる。 新しい A_i が極値を更新する連続群を一括併合でき、各左端は各 stack へ一度 push・pop される。","sourceRevisionIds":["source-abc234-editorial-3227-9fabd73639dc7e10a436503cbcb90c463de740b56e8f78de4a0fb4e8080453e6","source-abc234-g-problem-8abd243ffa8e3e459b73e6d9c43a87b061f09a6f6ef5b7c665a6fc5c1c4655fc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

対象外:

- 全候補から極値を反復取得するheap・ordered set。

## 考察

最後の区間が A_{j+1}…A_i である分割の寄与は、prefix j の全分割積 dp_j にその区間の max−min を掛けたものになる。

よって dp_i は全 j の重み付き区間最大値和から重み付き区間最小値和を引いた形であり、両者を独立に維持できる。

棄却する候補: 各右端 i について全ての左端 j を遡り、区間の最大・最小を更新しながら dp_j を加える。

最大・最小の更新は軽くても区間が二乗個あり、N＝30 万では処理できない。

採用する候補: 現在右端に対する区間最大値が同じ左端群を単調減少 stack、最小値が同じ群を単調増加 stack にまとめ、群の dp 重み和と寄与総和を更新する。

新しい A_i が極値を更新する連続群を一括併合でき、各左端は各 stack へ一度 push・pop される。

単調 stack の各要素に極値だけでなく、その極値を持つ全左端 j の dp_j 総和を持たせると、必要な重み付き極値和を差分更新できる。

区間分割 DP の遷移を max 部と min 部へ線形分離し、右端追加時の区間極値の変化を重み付き単調スタックでまとめて dp_i を算出する。

## 典型の発動条件

### 重み付き区間極値和の単調スタック

発動条件: 全左端から現在右端までの max または min に、左端ごとの重みを掛けた総和を逐次求めるとき。

同じ極値を共有する左端の重み和を stack 要素へまとめ、新値で pop される群の寄与を一括置換する。

### 最後の区間を固定する分割 DP

発動条件: 列を連続区間へ分け、各区間評価の積または加算を全分割について集約するとき。

最後の切れ目 j を固定し、prefix の集約値 dp_j と最後区間の評価を掛けて足す。

## 問題固有の要素

区間評価 max−min をそのまま管理せず、max の総和と min の総和へ分けると同じ単調スタック処理を符号違いで二回使える。

別の問題へ持ち帰る視点: 複合した区間統計が線形結合なら、各成分を高速化しやすい標準統計へ分解してから合成する。

## 正当性

単調 stack の各要素に極値だけでなく、その極値を持つ全左端 j の dp_j 総和を持たせると、必要な重み付き極値和を差分更新できる。 新しい A_i が極値を更新する連続群を一括併合でき、各左端は各 stack へ一度 push・pop される。

## 実装上の注意

- 新しい一要素区間の左端重み dp_{i−1} を max・min 両 stack へ加え、その同じ値の寄与が差で 0 になるようにする。
- 同値を pop する比較規則を各 stack で統一し、寄与の減算後は法 998244353 の非負範囲へ戻す。

## 復習の核

- 最後の区間の全左端を足す DP で max・min が現れたら、右端追加時に極値が同じ左端群を単調 stack でまとめる。
- stack 要素の意味を「値」だけでなく「その値を担当する dp 重みの総和」として説明できるようにする。

## 計算量と制約

### 時間

O(N)、各単調stackへのpush/popは一度ずつ。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/editorial/3227) — source-abc234-editorial-3227-9fabd73639dc7e10a436503cbcb90c463de740b56e8f78de4a0fb4e8080453e6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/tasks/abc234_g) — source-abc234-g-problem-8abd243ffa8e3e459b73e6d9c43a87b061f09a6f6ef5b7c665a6fc5c1c4655fc
