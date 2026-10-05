---
title: "ABC218-F — Blocked Roads"
draft: true
authoringUnit: {"problemId":"abc218-f","docPath":"src/content/docs/problems/hybrid/outcome-localize-change-impact-by-witness/outcome-localize-change-impact-by-witness-shard-001/abc218-f.md","learningOutcomeIds":["outcome-localize-change-impact-by-witness","outcome-build-shortest-path-certificate"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。"],"tagIds":["tag-shortest-path-certificate","tag-witness-impact-localization","tag-shortest-path"],"sourceRevisionIds":["source-abc218-editorial-2606-0f610bb19c682291d44c618748722f77899130ec877784b55292cb9792c0a339","source-abc218-f-problem-be66936a54f85eaa88784247c9a88327726ff2db043b75ad04519be620931023"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"元の最短距離を d とすると、辺削除後の距離は d 以上である。一方 e∉P なら長さ d の P が残るので d 以下でもあり、両方向の不等式から答えは d と決まる。再探索候補は |P|≤N-1 本だけである。 答えが変わり得る辺を高々 N-1 本へ限定でき、他の辺には元距離をそのまま使える。","sourceRevisionIds":["source-abc218-editorial-2606-0f610bb19c682291d44c618748722f77899130ec877784b55292cb9792c0a339","source-abc218-f-problem-be66936a54f85eaa88784247c9a88327726ff2db043b75ad04519be620931023"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準witnessから変更影響を局所化する](src/content/docs/learn/modeling/change-impact-localization.md)

- 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
- 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。

先に読む単元:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

この解説で扱わないこと:

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 考察

M 本それぞれについて辺を一つ削除して BFS する素朴解は O(M(N+M)) で、M≤N(N-1) では重い。再探索が必要な辺を絞る必要がある。

元グラフで頂点 1 から N への最短路 P を一本固定する。P にない辺 e を削除しても P は残り、辺削除によって最短距離が短くなることもないため、e∉P の答えは元の距離と等しい。

採用する候補: 元の最短路を一本復元し、その路上の辺を削除する場合だけ BFS を再実行する。

棄却する候補: M 本の各辺を一つずつ削除して毎回 BFS を行う。

正しいが O(M(N+M)) となり、最短路外の辺について同じ探索を繰り返す。

再探索候補は |P|≤N-1 本だけである。

まず BFS し、頂点 N が到達不能なら全 M 個を -1 とする。到達可能なら元距離 d を全辺の初期答えにし、predecessor edge から P を復元する。P 上の各 edge id だけを一つずつ無効化して BFS し、その距離を対応する答えへ上書きする。

## 典型の発動条件

### 最短路復元による影響範囲限定

発動条件: 要素を一つ除いた各ケースを問われ、元の最適解が残るケースを判別できるとき。

元の最短路を証明用 witness として固定し、路上辺だけ再計算する。

### BFS

発動条件: 無向または有向の単位重みグラフで最短距離を求めるとき。

削除対象の edge id を読み飛ばして始点から距離を再計算する。

## 問題固有の要素

最短路は全て列挙せず一本だけ固定すればよく、その一本が残るかどうかで再計算の必要性を判定できる。

別の問題へ持ち帰る視点: 各変更後の再計算問題では、元の解を witness として固定し、変更がその witness を壊す場合だけを抽出する。

## 正当性

元の最短距離を d とすると、辺削除後の距離は d 以上である。一方 e∉P なら長さ d の P が残るので d 以下でもあり、両方向の不等式から答えは d と決まる。再探索候補は |P|≤N-1 本だけである。 答えが変わり得る辺を高々 N-1 本へ限定でき、他の辺には元距離をそのまま使える。

## 実装上の注意

- 辺を端点 pair でなく edge id で無効化し、元々終点へ到達不能な場合を全問 -1 とする。

## 復習の核

- 「最短路にない辺の削除で距離が短くならない／長くならない」の両方向を説明してから計算量を導く。
- 元々到達不能、削除辺が P の外、P 上だが別の同長最短路が残る、P 上の辺削除で終点が不達になる小グラフを、全 M 回 BFS する実装と照合する。

## 計算量と制約

### 時間

O(N(N+M))、一最短pathの高々N−1辺だけ再BFS。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 400; 1 \leq M \leq N(N-1); 1 \leq s_i,t_i \leq N; s_i \neq t_i; (s_i,t_i) \neq (s_j,t_j) (i \neq j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/editorial/2606) — source-abc218-editorial-2606-0f610bb19c682291d44c618748722f77899130ec877784b55292cb9792c0a339
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/tasks/abc218_f) — source-abc218-f-problem-be66936a54f85eaa88784247c9a88327726ff2db043b75ad04519be620931023
