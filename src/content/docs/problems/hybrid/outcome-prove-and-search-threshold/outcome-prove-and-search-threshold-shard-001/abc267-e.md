---
title: "ABC267-E — Erasing Vertices 2"
draft: true
authoringUnit: {"problemId":"abc267-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc267-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc267-e-problem-2dab07863f474ec1162748d6cadbcbea66a66c8b52362981bca715c3a0a9556a","source-abc267-editorial-4729-73c559264306d24b0e962aae7d50c12ac66a475829671c8c132e75d834abe153"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"vを削除すると未削除隣接頂点uのcurrentCostからA_vを引けばよく、各辺は一度だけこの更新に使われる。 安全頂点を削除すると他頂点も安全側へしか動かず、queueが尽きるまでの貪欲処理が実現可能性の必要十分判定になる。","sourceRevisionIds":["source-abc267-e-problem-2dab07863f474ec1162748d6cadbcbea66a66c8b52362981bca715c3a0a9556a","source-abc267-editorial-4729-73c559264306d24b0e962aae7d50c12ac66a475829671c8c132e75d834abe153"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

頂点vの現在costは未削除隣接頂点のA総和で、他頂点が削除されるたびに減ることはあっても増えない。

最大costをX以下にできるかはXに対して単調であり、一度cost≤Xになった頂点は以後いつ削除しても安全である。

棄却する候補: 全削除順N!通りを探索して各順序の最大costを比較する。

順序数が階乗的で、局所的なcost減少の単調性を利用していない。

採用する候補: 答え候補Xを二分探索し、currentCost≤Xの頂点をqueueで反復削除するpeelingにより全頂点を消せるか判定する。

## 典型の発動条件

### 最大値最小化の答え二分探索

発動条件: 全操作costを閾値X以下にできるかが単調に判定できるとき。

Xで安全な削除順が存在するかをoracleにし、最小の可行Xを探索する。

### 単調な頂点peeling

発動条件: 頂点削除により残存頂点の制約値が減少し、許可状態から不許可へ戻らないとき。

初期許可頂点をqueueへ入れ、削除差分で新たに許可された隣接頂点を追加する。

## 問題固有の要素

安全頂点をどの順でqueueから取っても、削除は残りcostを下げるだけなので全削除可能性は変わらない。

別の問題へ持ち帰る視点: eligibilityが削除に対して単調なら、選択順の探索を任意順のclosure計算へ置き換える。

## 正当性

vを削除すると未削除隣接頂点uのcurrentCostからA_vを引けばよく、各辺は一度だけこの更新に使われる。 安全頂点を削除すると他頂点も安全側へしか動かず、queueが尽きるまでの貪欲処理が実現可能性の必要十分判定になる。

## 実装上の注意

- 各判定でcurrentCostを初期隣接A和へ戻し、removed/enqueued flagも初期化する。
- 隣接和と答え上限は64 bit整数で保持し、削除済み頂点を重複処理しない。

## 復習の核

- 順序最適化のmax-min問題は、閾値を固定したとき許可操作が後から増えるだけかを確認する。
- 頂点削除costが隣接重み和なら、削除時に各隣接頂点へ一回だけ重み差分を配る。

## 計算量と制約

### 時間

O((N+M)log C)、C≤ΣAはcost閾値上限、各判定queue peeling O(N+M)。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; 0 \le M \le 2 \times 10^5; 1 \le A_i \le 10^9; 1 \le U_i,V_i \le N; The given graph is simple.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/tasks/abc267_e) — source-abc267-e-problem-2dab07863f474ec1162748d6cadbcbea66a66c8b52362981bca715c3a0a9556a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/editorial/4729) — source-abc267-editorial-4729-73c559264306d24b0e962aae7d50c12ac66a475829671c8c132e75d834abe153
