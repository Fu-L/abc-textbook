---
title: "ABC372-E — K-th Largest Connected Components"
draft: true
authoringUnit: {"problemId":"abc372-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc372-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components"],"sourceRevisionIds":["source-abc372-e-problem-95435329aea6c364a0302b7ecf8c28324ac869ea42fe835baaecb395a3689e59","source-abc372-editorial-10967-abf15d02f03a6ce0612e3ba16d6281389413d47d0d0a4904b7c4235a262c1011"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"成分内B位以下の頂点には既にB個の大きい頂点があり、併合で順位は上がらない。二成分の上位Bだけを merge すれば新列を復元できる。singleton からの帰納法で正しく、同成分 union を無視して重複を防ぐ。","sourceRevisionIds":["source-abc372-e-problem-95435329aea6c364a0302b7ecf8c28324ac869ea42fe835baaecb395a3689e59","source-abc372-editorial-10967-abf15d02f03a6ce0612e3ba16d6281389413d47d0d0a4904b7c4235a262c1011"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

## 考察

問い合わせる順位 k は高々 10 であり、連結成分の全頂点集合は不要である。成分を併合しても、併合前の上位10位より下の頂点が新しい上位10位へ入ることはない。 片方の成分で既に10個以上の頂点に負ける要素は、もう片方を加えても全体上位10個にはなれない。 DSU の親を確定してから、二つの小さな降順列を二ポインタで merge すれば重複なく情報を引き継げる。

採用する候補: DSU の各 root に頂点番号上位10個の降順列を持たせ、union 時に二列を merge して10個で打ち切る。

問い合わせに必要な十分統計が定数個で閉じており、各辺追加をほぼ定数時間、順位問い合わせを O(1) で処理できる。

棄却する候補: 各連結成分に全頂点を set として保持して k 番目を求める。

union のたびに大集合を扱う必要があり、必要順位が10以下という制約を使わずメモリと定数倍が大きい。

片方の成分で既に10個以上の頂点に負ける要素は、もう片方を加えても全体上位10個にはなれない。

DSU の親を確定してから、二つの小さな降順列を二ポインタで merge すれば重複なく情報を引き継げる。

各頂点を一要素の上位リストで初期化する。type 1 では DSU を併合し、root の二つのリストから大きい順に最大10個を作る。type 2 では root のリスト長を確認して k-1 番目を返す。

## 典型の発動条件

### DSU への要約情報の付加

発動条件: 辺追加だけの動的連結性で、成分ごとに merge 可能な統計を答えたいとき。

成分の上位 K 個だけを root に保持し union と同時に結合する。

## 問題固有の要素

クエリの k≤10 は、集合全体ではなく上位10個が閉じた十分統計になることを示す。

別の問題へ持ち帰る視点: 成分情報を DSU に載せる際は、併合後も必要情報が子の要約だけから復元できるかを確認する。

## 正当性

成分内B位以下の頂点には既にB個の大きい頂点があり、併合で順位は上がらない。二成分の上位Bだけを merge すれば新列を復元できる。singleton からの帰納法で正しく、同成分 union を無視して重複を防ぐ。

## 実装上の注意

- union が既に同一成分ならリストを二重に混ぜない。k は1-origin、vector は0-originであり、要素不足なら -1 とする。

## 復習の核

- top-K より下を捨てても将来 top-K へ復活しない理由を、成分内ですでに K 個に負けていることから説明する。

## 計算量と制約

### 時間

N 頂点、Q 操作、B=10。O(N+Q(α(N)+B))。

### 空間

DSU と上位列で安全な上界 O(NB)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 2 \times 10^5; In a Type 1 query, 1 \leq u < v \leq N.; In a Type 2 query, 1 \leq v \leq N, 1 \leq k \leq 10.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/tasks/abc372_e) — source-abc372-e-problem-95435329aea6c364a0302b7ecf8c28324ac869ea42fe835baaecb395a3689e59
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/editorial/10967) — source-abc372-editorial-10967-abf15d02f03a6ce0612e3ba16d6281389413d47d0d0a4904b7c4235a262c1011
