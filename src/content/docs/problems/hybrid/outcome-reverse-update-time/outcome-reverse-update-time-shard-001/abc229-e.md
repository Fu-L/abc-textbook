---
title: "ABC229-E — Graph Destruction"
draft: true
authoringUnit: {"problemId":"abc229-e","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc229-e.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-dsu-components"],"sourceRevisionIds":["source-abc229-e-problem-d9c76ebb631eb668dd6772d319953cc51d2956bed4f77fa174b0c2f60fba8b41","source-abc229-editorial-2958-e1f5841b40bd2ddd793fc39890bd1e7c2cc99e815182f14d0fac099106701eea"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点 i を追加した直後に成分数を一つ増やし、異なる根を結ぶ辺ごとに一つ減らせば現在の連結成分数を維持できる。 Union-Find が得意な単調な辺追加だけになり、各辺を一度だけ処理して全時点の成分数を得られる。","sourceRevisionIds":["source-abc229-e-problem-d9c76ebb631eb668dd6772d319953cc51d2956bed4f77fa174b0c2f60fba8b41","source-abc229-editorial-2958-e1f5841b40bd2ddd793fc39890bd1e7c2cc99e815182f14d0fac099106701eea"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

頂点を 1 から順に削除すると残る頂点集合は常に連続した suffix だが、辺削除を直接扱う Union-Find は用意されていない。

時系列を逆にすると、頂点 N,N−1,… を追加し、その頂点から既に存在する大きい番号の頂点への辺だけを追加する処理になる。

棄却する候補: 各頂点削除後に残ったグラフを探索し直して連結成分数を数える。

同じ辺を多数の時点で繰り返し調べるため、頂点数と辺数の積に近い処理になる。

採用する候補: 削除を逆順の追加へ変換し、追加頂点を新成分として数えた後、既存頂点との辺を Union-Find で併合する。

Union-Find が得意な単調な辺追加だけになり、各辺を一度だけ処理して全時点の成分数を得られる。

頂点 i を追加した直後に成分数を一つ増やし、異なる根を結ぶ辺ごとに一つ減らせば現在の連結成分数を維持できる。

固定順の頂点削除クエリをオフラインで逆転し、suffix グラフを頂点・辺の追加系列として Union-Find と成分数カウンタで復元する。

## 典型の発動条件

### 削除クエリの逆順処理

発動条件: 更新が削除だけで順序も既知だが、利用したいデータ構造が追加しか扱えないとき。

頂点削除列を逆向きの頂点追加列にし、各時点の答えを逆順で記録する。

### Union-Find による成分数維持

発動条件: 無向グラフへ頂点・辺が追加され、各時点の連結成分数が必要なとき。

新頂点で成分数を増やし、異なる集合を併合できた場合だけ成分数を減らす。

## 問題固有の要素

入力辺は A_i＜B_i なので、小さい端点を追加する時点にだけその辺を処理すれば、相手側は必ず既に追加済みである。

別の問題へ持ち帰る視点: 逆順追加では、各関係を初めて両端が有効になる時点へ一意に割り当てると二重処理を防げる。

## 正当性

頂点 i を追加した直後に成分数を一つ増やし、異なる根を結ぶ辺ごとに一つ減らせば現在の連結成分数を維持できる。 Union-Find が得意な単調な辺追加だけになり、各辺を一度だけ処理して全時点の成分数を得られる。

## 実装上の注意

- 頂点 i の答えは i まで削除した後、すなわち逆順処理で i＋1 以上を追加済みの時点に対応させる。
- 既に同じ根に属する端点を結ぶ辺では成分数を減らさず、最後の全頂点削除後は 0 成分とする。

## 復習の核

- 動的連結性で削除だけが現れたら、操作順が固定かを確認し、逆再生で単調追加にできないか最初に試す。
- 逆順時の配列添字は、小さな N の削除状態と追加状態を並べて一対一対応を確認する。

## 計算量と制約

### 時間

O((N+M)α(N))、逆順に各頂点・辺を一度追加。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min(\frac{N(N-1)}{2} , 2 \times 10^5 ); 1 \leq A_i \lt B_i \leq N; (A_i,B_i) \neq (A_j,B_j) if i \neq j.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/tasks/abc229_e) — source-abc229-e-problem-d9c76ebb631eb668dd6772d319953cc51d2956bed4f77fa174b0c2f60fba8b41
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/editorial/2958) — source-abc229-editorial-2958-e1f5841b40bd2ddd793fc39890bd1e7c2cc99e815182f14d0fac099106701eea
