---
title: "ABC392-E — Cables and Servers"
draft: true
authoringUnit: {"problemId":"abc392-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc392-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components","tag-constructive-witness"],"sourceRevisionIds":["source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e","source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"未使用のforest外辺は元成分の連結性を保ったまま取り外せる。別成分へ付け替えると二成分が一つになり、成分数が必ず一つ減る。DSUの併合により次の操作時の所属成分も正しく分かる。forest外辺の総数はM−N+C≥C−1なので、下界と同じ回数の操作を完了できる。","sourceRevisionIds":["source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e","source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

## 考察

連結成分を一回の操作で併合できる数は高々一つなので、初期成分数をCとするとC−1回が下界である。最初にDSUで全入力辺を走査し、既に同じ成分を結ぶ辺、つまりspanning forestに使わなかった辺を一つのglobal listへ集める。各辺はforestを外してもその時点の成分を分断しない余剰辺である。

余剰辺を一つ取り出し、その現在の成分から別成分へ一端をつなぎ替える。二成分が併合されたらDSUを更新し、別の余剰辺を同じlistから続けて使う。未使用の余剰辺は元成分を保つので、併合後も次の候補として使える。操作時点での所属成分はDSUから判定する。

## 典型の発動条件

### 全体の余剰辺を使う成分併合
発動条件: 余剰辺の持ち主が操作で変わり、component別資源の移送が複雑になるとき。
cycle edgeを一つのglobal listへ集め、各操作で別DSU成分へ付け替える。

### DSUによる操作後の成分管理
発動条件: 一操作ごとに二成分を併合する構成問題。
接続先が現在も別成分かを調べ、併合後の成分数を更新する。

## 問題固有の要素

最小回数の下界は成分数だけで決まり、M≥N-1がその下界を達成するだけのcycle辺資源を全体で保証している。

別の問題へ持ち帰る視点: graph再配線では、bridgeでないedgeを消費資源、component数をpotentialとしてgreedyに結ぶ。

## 正当性

未使用のforest外辺は元成分の連結性を保ったまま取り外せる。別成分へ付け替えると二成分が一つになり、成分数が必ず一つ減る。DSUの併合により次の操作時の所属成分も正しく分かる。forest外辺の総数はM−N+C≥C−1なので、下界と同じ回数の操作を完了できる。

## 実装上の注意

- まずforest外辺を全て収集し、その後に構成を行う。各操作で余剰辺の現在の成分と異なるDSU成分を接続し、同じ辺を再利用しない。
- 付け替え対象の旧端点と接続先頂点を出力してからDSUを併合する。

## 復習の核

- 複数余剰が一成分へ偏るgraph、各成分がtree、parallel相当の辺を含む小例で、各出力後のgraph連結性と最終操作数をsimulationする。

## 計算量と制約

### 時間

O((N+M)α(N))、DSUで全辺を分類してからC−1回併合する。

### 空間

O(N+M)、DSU、全体の余剰辺list、出力。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq 2\times 10^5; 1 \leq A_i, B_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/tasks/abc392_e) — source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/editorial/12146) — source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df
