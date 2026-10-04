---
title: "ABC218-E — Destruction"
draft: true
authoringUnit: {"problemId":"abc218-e","docPath":"src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc218-e.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-dsu-components"],"sourceRevisionIds":["source-abc218-e-problem-fd038c963e1dc403914d5a7ff3aa845fd04851544626b8e27bad0b6280c77a46","source-abc218-editorial-2580-1817637543e3fc0f4358d20bff06ac071ce817c5352536b89ebc8bcee9714df9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"負辺削除は報酬を減らすため残すのが最適。非正辺を全て残して縮約した後、正辺で連結性を保つ最小cost forestをKruskal交換法で選ぶ。それ以外の正辺を削る報酬が最大になる。","sourceRevisionIds":["source-abc218-e-problem-fd038c963e1dc403914d5a7ff3aa845fd04851544626b8e27bad0b6280c77a46","source-abc218-editorial-2580-1817637543e3fc0f4358d20bff06ac071ce817c5352536b89ebc8bcee9714df9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

この解説で扱わないこと:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

削除した辺の C_i を得る問題は、全辺をいったん削除した総額から、連結にするため戻す辺の C_i を差し引く問題と見られる。したがって、残す辺の重み和を小さくしたい。C_i<0 の辺は削除すると罰金になる一方、余分に残しても連結性を損なわないので、全域木に選ばれなかった負辺も削除しない方がよい。Kruskal 法で両端が既に同じ成分にある辺は連結維持には不要であり、その重みが正のときだけ削除する価値がある。

採用する候補: 辺を C_i の昇順に Kruskal 法で処理し、異なる連結成分を結ぶ辺は残し、既に連結な両端を持つ正辺だけを削除報酬へ加える。

連結に必要な辺を最小全域木と同じ交換則で選びながら、MST 外の負辺を残すという例外も符号判定で正しく扱える。

棄却する候補: 正の大きい辺から実際に削除し、そのたびにグラフが連結か判定する。

貪欲な選択自体は成立するが、辺削除を伴う動的連結性を各回高速に判定する実装が必要になり、単純な BFS/DFS の反復では制約に収まらない。

全辺を重み昇順に並べて DSU で処理する。成分が異なれば unite して辺を残し、同じ成分なら C_i>0 の場合だけ答えに C_i を加え、C_i≤0 なら報酬を悪化させないため残す。

## 典型の発動条件

### 削除利益から残存コストへの反転

発動条件: 要素を削る利益を最大化しつつ、残した集合が連結などの被覆条件を満たすとき。

全削除時の利益を基準に、条件を満たすため戻す要素のコスト最小化として考える。

### Kruskal 法と DSU

発動条件: 無向グラフを連結に保つため必要な辺を、辺重みの和を小さく選びたいとき。

軽い辺から成分間だけを採用し、cycle を作る正辺を不要と判定する。

## 問題固有の要素

最小全域木だけを残すのではなく、MST に入らない負辺も残す必要がある。負辺は「余分な辺」でも削除報酬が負だからである。

別の問題へ持ち帰る視点: 最適な基底を使う変形では、基底外の要素を自由に残せるか、その符号が目的値を改善するかを別に確認する。

## 正当性

負辺削除は報酬を減らすため残すのが最適。非正辺を全て残して縮約した後、正辺で連結性を保つ最小cost forestをKruskal交換法で選ぶ。それ以外の正辺を削る報酬が最大になる。

## 実装上の注意

- 自己ループや多重辺も DSU の「既に同成分」で自然に処理できる。C_i=0 は加算してもしなくても値は同じだが、答えは 64 bit 整数で保持する。

## 復習の核

- 負辺だけで cycle ができる小例を作り、「MST にないから削除」が誤りになることを先に確認してから Kruskal の分岐を復元する。

## 計算量と制約

### 時間

N頂点M辺。sortとKruskal O(M log M+Mα(N))。

### 空間

辺とDSU O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq 2\times 10^5; 1 \leq A_i,B_i \leq N; -10^9 \leq C_i \leq 10^9; The given graph is connected.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/tasks/abc218_e) — source-abc218-e-problem-fd038c963e1dc403914d5a7ff3aa845fd04851544626b8e27bad0b6280c77a46
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/editorial/2580) — source-abc218-editorial-2580-1817637543e3fc0f4358d20bff06ac071ce817c5352536b89ebc8bcee9714df9
