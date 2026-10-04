---
title: "ABC401-E — Reachable Set"
draft: true
authoringUnit: {"problemId":"abc401-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc401-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components","tag-event-sweep"],"sourceRevisionIds":["source-abc401-e-problem-f5b4b49bf6752971d0100ab55024ebd0faf72125b6e54b66fe4e4eecd4f53757","source-abc401-editorial-12693-13b4b3a7596f5056fd2c1375310ea6e7add2d326705300c44e9b4e72b7d0b1bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"ちょうどprefixを到達集合にするには内部誘導グラフが連結である必要がある。連結なら外隣接頂点は一歩で到達するため削除必須。これら全てを消すと外へ出る最初の辺がなくなり十分。DSU連結性と相異なる境界頂点数を保つことで最小削除数を得る。","sourceRevisionIds":["source-abc401-e-problem-f5b4b49bf6752971d0100ab55024ebd0faf72125b6e54b66fe4e4eecd4f53757","source-abc401-editorial-12693-13b4b3a7596f5056fd2c1375310ea6e7add2d326705300c44e9b4e72b7d0b1bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

reachable setをちょうど{1..k}にするには、誘導subgraphG[1..k]がvertex1から全てconnectedでなければならない。大きいvertexを削除してもこの内部連結性は作れない。 内部がconnectedなら、{1..k}からedgeで隣接する外部vertexを全て削除すれば、それ以外の外部vertexは残しても1から到達不能である。これが必要十分かつ最小削除数になる。 prefix connected性はDSUにvertex番号maxがk以下となったedgeを追加し、component size of1がkかで判定できる。 削除対象は外部vertex単位で数えるため、prefixへのedgeが複数あっても一度だけcountする。

採用する候補: kを昇順sweepし、DSUでprefix連結性、外部隣接vertexのdistinct countをincremental管理する

vertex k追加時に両端≤kのedgeをunionし、境界を跨ぐ外部endpointをset/countへ追加・prefixへ入ったものを除くことで全kをO((N+M)αN)程度で処理できる。

棄却する候補: 各kで大きいvertexを削除したgraphへBFSし、境界隣接を数える

O(N(N+M))でprefix間の単調なedge追加を再利用していない。

prefix connected性はDSUにvertex番号maxがk以下となったedgeを追加し、component size of1がkかで判定できる。

削除対象は外部vertex単位で数えるため、prefixへのedgeが複数あっても一度だけcountする。

adjacencyを使いk=1..Nでvertex kをactivateする。小さい隣接はunionし、大きい隣接をboundary set/countへ登録する。k自身が以前boundaryなら除去する。DSU component(1) size=kならboundary distinct数、そうでなければ-1を出す。

## 典型の発動条件

### prefix-induced connectivity sweep

発動条件: vertex番号prefixごとのconnected性を全て判定するとき。

vertex activateとDSU unionを昇順で行う。

### dynamic boundary counting

発動条件: 成長集合に隣接する外部頂点数を重複なく保つとき。

外部endpointのincident count/flagを更新する。

## 問題固有の要素

外側全削除は不要で、reachable setを漏らす直接境界vertexだけ消せば、その先全体も自動的に切り離される。

別の問題へ持ち帰る視点: reachable setを指定するvertex deletionでは、内部connectivityと外向きvertex boundaryを分離する。

## 正当性

ちょうどprefixを到達集合にするには内部誘導グラフが連結である必要がある。連結なら外隣接頂点は一歩で到達するため削除必須。これら全てを消すと外へ出る最初の辺がなくなり十分。DSU連結性と相異なる境界頂点数を保つことで最小削除数を得る。

## 実装上の注意

- 外部vertexへの複数edgeをdistinct countし、kへ昇格したvertexのflagを一度だけ外す。k=1は内部connectedとみなす。

## 復習の核

- N≤9でdelete subset全探索し、prefix内部非連結、同じ外部vertexへ複数edge、境界の先にだけ繋がるvertexを比較する。

## 計算量と制約

### 時間

N 頂点、M 辺。境界flagと DSU で O((N+M)α(N))。

### 空間

隣接、DSU、境界flagで O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^{5}; 0 \le M \le 3 \times 10^{5}; 1 \le u_i < v_i \le N\ (1 \le i \le M); (u_i,v_i) \ne (u_j,v_j)\ (1 \le i < j \le M); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/tasks/abc401_e) — source-abc401-e-problem-f5b4b49bf6752971d0100ab55024ebd0faf72125b6e54b66fe4e4eecd4f53757
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/editorial/12693) — source-abc401-editorial-12693-13b4b3a7596f5056fd2c1375310ea6e7add2d326705300c44e9b4e72b7d0b1bf
