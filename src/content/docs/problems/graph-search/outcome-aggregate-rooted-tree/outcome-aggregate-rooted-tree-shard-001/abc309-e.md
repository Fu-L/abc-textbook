---
title: "ABC309-E — Family and Insurance"
draft: true
authoringUnit: {"problemId":"abc309-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc309-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc309-e-problem-6c47775c7f141367461bce7d134a932afa84e4b3a64ef4c7236d3ac359635d48","source-abc309-editorial-6748-51ede1abbaee7e70c7c4f0d149c11c985da3edd466836ffa5e81107bdee7f021"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"祖先の契約が子へ届く残り世代数は親より1小さい。同一頂点の最大残り世代契約は他契約の将来範囲を包含するので max(m_v,dp_parent−1) が十分。親番号が小さいため番号順に値を確定でき、残り0も本人を覆うから非負の個数を数える。","sourceRevisionIds":["source-abc309-e-problem-6c47775c7f141367461bce7d134a932afa84e4b3a64ef4c7236d3ac359635d48","source-abc309-editorial-6748-51ede1abbaee7e70c7c4f0d149c11c985da3edd466836ffa5e81107bdee7f021"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

親 p_i は必ず i より小さいため、人物番号順がそのまま根から子への処理順になる。ある保険が子孫へ残す情報は「あと何世代届くか」だけで、契約履歴そのものは不要である。 同じ人物から始まる保険や祖先から届く保険が重なっても、以後を覆う範囲は残り世代数の最大値だけで決まる。 m_v を頂点 v から始まる保険の y の最大値、dp_v を v で有効な最大残り世代数とすると、dp_v=max(m_v,dp_parent−1) で情報が閉じる。 dp_v が 0 の人物自身までは補償され、子へ渡すと −1 になるため、被保険者判定は dp_v≥0 と一致する。

採用する候補: 各頂点で、その頂点を覆う保険の残り世代数の最大値を親から子へ伝播する。

番号順がトポロジカル順であり、親の値を 1 減らしたものと当人が買った保険の最大 y だけで全保険の和集合を表せる。

棄却する候補: 保険ごとに x_i の部分木を深さ y_i まで探索して被保険者を印付けする。

一本の長い系図に大きい y の保険が多数あると同じ頂点を何度もたどり、最悪で N M に達する。

m_v を頂点 v から始まる保険の y の最大値、dp_v を v で有効な最大残り世代数とすると、dp_v=max(m_v,dp_parent−1) で情報が閉じる。

dp_v が 0 の人物自身までは補償され、子へ渡すと −1 になるため、被保険者判定は dp_v≥0 と一致する。

全 m_v を −1 で初期化して契約を最大集約する。1 番から N 番へ、根では dp_1=m_1、他では dp_i=max(m_i,dp_{p_i}−1) を計算し、dp_i≥0 の個数を数える。

## 典型の発動条件

### 木上の情報伝播

発動条件: 祖先で始まった効果が深さとともに一定量ずつ弱まり、親が子より先に並ぶとき。

効果の残量だけを親から子へ渡し、重なる効果は max で統合する。

### 履歴の十分統計量への圧縮

発動条件: 複数の過去イベントが将来へ与える影響を一つの優劣で比較できるとき。

各保険の識別子を捨て、以後もっとも遠くまで届く残り世代数だけを保持する。

## 問題固有の要素

p_i<i という入力順が、明示的な DFS をせずに木 DP を一走査で行える保証になっている。

別の問題へ持ち帰る視点: 親子関係を見たら、辺だけでなくラベル順が既にトポロジカル順かも確認すると実装を簡約できる。

## 正当性

祖先の契約が子へ届く残り世代数は親より1小さい。同一頂点の最大残り世代契約は他契約の将来範囲を包含するので max(m_v,dp_parent−1) が十分。親番号が小さいため番号順に値を確定でき、残り0も本人を覆うから非負の個数を数える。

## 実装上の注意

- 保険が始まらない頂点の m と補償外の dp をともに −1 とし、dp_parent−1 がさらに小さくなっても判定を壊さない型を使う。

## 復習の核

- 「各イベントを配る」のではなく「現在地点へ届いた効果のうち将来に最も強いものは何か」を先に問う。0 が当人を含む境界も小さい木で再確認する。

## 計算量と制約

### 時間

N 人、M 契約で O(N+M)。

### 空間

親と補償残り世代数で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3 \times 10^5; 1 \leq M \leq 3 \times 10^5; 1 \leq p_i \leq i-1; 1 \leq x_i \leq N; 1 \leq y_i \leq 3 \times 10^5; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/tasks/abc309_e) — source-abc309-e-problem-6c47775c7f141367461bce7d134a932afa84e4b3a64ef4c7236d3ac359635d48
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/editorial/6748) — source-abc309-editorial-6748-51ede1abbaee7e70c7c4f0d149c11c985da3edd466836ffa5e81107bdee7f021
