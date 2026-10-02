---
title: "ABC392-E — Cables and Servers"
draft: true
authoringUnit: {"problemId":"abc392-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc392-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components","tag-constructive-witness"],"sourceRevisionIds":["source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e","source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一操作の成分数減少は高々1なので C−1 が下界。forest外辺は外しても元成分を分断せず、一端を他成分へ付け替えると一成分減る。余剰総数 M−N+C≥C−1 のため成分を併合し余剰を引き継げば下界回数を達成できる。","sourceRevisionIds":["source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e","source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

対象外:

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

連結成分数Cを1へ減らすには一操作で高々1成分しか結べないので、少なくともC-1回必要である。 各成分のspanning forestに使われないcycle辺は一端を外してもその成分を分断せず、別成分へ繋ぎ替えれば成分数を1減らせる。M≥N-1より余剰辺総数は少なくともC-1本ある。 入力辺をDSUへ順に入れ、既に同rootの辺だけを余剰edgeとして記録すればspanning forest外辺を得られる。 繋ぎ替え後は余剰を提供したcomponentと接続先componentがmergeし、両者の残余edge listもまとめて次へ使える。

採用する候補: DSUでcycle辺を余剰として集め、余剰を持つ成分から他成分へ一つずつ繋ぎ替える

各操作が元成分の連結性を保ちながら成分数を必ず1減らすため、下界C-1を達成する構成になる。

棄却する候補: 任意の辺端を別成分へ繋ぎ、切断後に連結性を検査する

bridgeを外すと元成分を分断して成分数が減らず、最小性も構成の成功も保証できない。

入力辺をDSUへ順に入れ、既に同rootの辺だけを余剰edgeとして記録すればspanning forest外辺を得られる。

繋ぎ替え後は余剰を提供したcomponentと接続先componentがmergeし、両者の残余edge listもまとめて次へ使える。

最初のDSU走査でforest edgeとredundant edgeを分類する。componentごとに余剰listを持ち、余剰の多いcomponentをhubとして未接続componentの代表へedge一端を付け替え、DSU/listをmergeしながらC-1操作を出力する。

## 典型の発動条件

### spanning forestの余剰辺利用

発動条件: 辺の端を付け替えてcomponentを結び、元componentを壊したくないとき。

cycle edgeだけを安全な資源として使う。

### component merge構成

発動条件: 各操作で二componentを結び、資源も新componentへ引き継ぐとき。

DSUとcomponent別listを同期して更新する。

## 問題固有の要素

最小回数の下界は成分数だけで決まり、M≥N-1がその下界を達成するだけのcycle辺資源を全体で保証している。

別の問題へ持ち帰る視点: graph再配線では、bridgeでないedgeを消費資源、component数をpotentialとしてgreedyに結ぶ。

## 正当性

一操作の成分数減少は高々1なので C−1 が下界。forest外辺は外しても元成分を分断せず、一端を他成分へ付け替えると一成分減る。余剰総数 M−N+C≥C−1 のため成分を併合し余剰を引き継げば下界回数を達成できる。

## 実装上の注意

- 出力する旧端点は実際に切る側を記録し、付け替え後のcomponent代表を更新する。自己loop・多重辺相当も余剰判定で扱える。

## 復習の核

- 複数余剰が一成分へ偏るgraph、各成分がtree、parallel相当の辺を含む小例で、各出力後のgraph連結性と最終操作数をsimulationする。

## 計算量と制約

### 時間

N 頂点、M 辺。余剰list spliceなら O((N+M)α(N))、成分を sort するなら追加 O(N log N)。

### 空間

辺、DSU、余剰list、出力で O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq 2\times 10^5; 1 \leq A_i, B_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/tasks/abc392_e) — source-abc392-e-problem-cca914b773f4300547dd13f0be4ee0b93de98f083a9d832610bdb677c12e588e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/editorial/12146) — source-abc392-editorial-12146-7cc0915fcaf1a0c3a3b0187c3dbd572b27a4d78f55584d727f99b1a9ca50c1df
