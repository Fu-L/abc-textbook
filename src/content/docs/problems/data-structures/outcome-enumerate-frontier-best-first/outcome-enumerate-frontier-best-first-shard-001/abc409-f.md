---
title: "ABC409-F — Connecting Points"
draft: true
authoringUnit: {"problemId":"abc409-f","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc409-f.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-dsu-components"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-bounded-enumeration","tag-dsu-components"],"sourceRevisionIds":["source-abc409-editorial-13228-cebc583d6c6842ea88624a86c2b7a418f774191123e7f161b74c2d6d494375e8","source-abc409-f-problem-fec7ee4dd0681cfccdab7c82f1d78d79b19074fe7b587293188aa87e737a047e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"heap 上位が既に連結ならその pair は将来も連結のままなので、永久に捨ててよい。この単調性で stale entry の再構築が不要になる。 最初の有効 pair を union した後も heap key が k の entry をすべて処理する必要がある。途中で component が変化しても、距離 k の全辺を加えた連結成分が問題文の同時 merge と一致する。 頂点追加時に過去頂点との pair だけを追加し、type 2 では最初の非連結 pair の距離 k と同距離の全 pair を union する。各 pair は一度 push/pop される。","sourceRevisionIds":["source-abc409-editorial-13228-cebc583d6c6842ea88624a86c2b7a418f774191123e7f161b74c2d6d494375e8","source-abc409-f-problem-fec7ee4dd0681cfccdab7c82f1d78d79b19074fe7b587293188aa87e737a047e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

component 間距離の最小値は、異なる component に属する頂点 pair の Manhattan 距離の最小値と同じなので、候補を全頂点 pair として持てる。

type 2 で最小距離 k の全 pair を同時に union すれば、同じ k の辺による推移的な連結も一回の query 内で正しく反映される。

採用する候補: 追加済み全頂点 pair を距離付き min-heap に入れ、DSU で既に同 component の stale pair を遅延削除する

各 pair は一度 push/pop される。

棄却する候補: type 2 ごとに現在の component pair ごとの距離を全頂点 pair から再計算する

最大約3000頂点の二乗走査を最大1500 queryで繰り返し、component merge後も同じ距離を何度も評価する。

初期 N 頂点の全 unordered pair を heap に入れる。type 1 では新頂点と既存全頂点の pair を追加する。type 2 は連結済み pair を pop し、heap が空なら -1、そうでなければ最小 key k を固定して key=k の pair を全て pop・unionして k を出力する。type 3 は DSU.same を返す。

## 典型の発動条件

### priority queue の遅延削除

発動条件: 候補の有効性が DSU の merge で失われるが、失効後に復活しないとき。

heap top を使う直前に same を確認し、stale pair を捨てる。

### DSU

発動条件: 辺追加だけで component が併合され、connectivity query があるとき。

最小距離 group の全 pair を union し、type 3 をほぼ定数時間で答える。

### 全 pair の offline 候補化

発動条件: 総頂点数が約3000で、各 pair の固定距離を一度だけ計算すればよいとき。

初期および追加時に unordered pair を heap へ一度登録する。

## 問題固有の要素

component 距離を明示管理せず、頂点 pair の supersets を heap に保持して DSU で現在有効な最小だけを抽出する。

別の問題へ持ち帰る視点: 集合間最小値が要素 pair の最小で、集合がmergeしかしないなら、全 pair候補＋単調なlazy invalidationを検討する。

## 正当性

heap 上位が既に連結ならその pair は将来も連結のままなので、永久に捨ててよい。この単調性で stale entry の再構築が不要になる。 最初の有効 pair を union した後も heap key が k の entry をすべて処理する必要がある。途中で component が変化しても、距離 k の全辺を加えた連結成分が問題文の同時 merge と一致する。 頂点追加時に過去頂点との pair だけを追加し、type 2 では最初の非連結 pair の距離 k と同距離の全 pair を union する。各 pair は一度 push/pop される。

## 実装上の注意

- type 2 の開始前に k 未満を含む連結済み top をすべて除く。同距離 k は有効・無効を問わず全て pop し、距離は 64 bit、総 pair 数分のmemoryを確保する。

## 復習の核

- 既に全連結、同じ最小距離がchain状に並ぶ、同距離pairの一部がstale、新頂点が最小距離を更新する例を愚直component距離計算と比較する。

## 計算量と制約

### 時間

O(P² log P+Q α(P))、Pは全追加後の頂点数。各pairは一回push/popされる。

### 空間

O(P²+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 1500; 1\leq Q\leq 1500; 0\leq x_i,y_i\leq 10^9; For queries of type 1, 0\leq a,b\leq 10^9.; For queries of type 3, let n be the number of vertices in G just before processing that query, then 1\leq u\lt v\leq n.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/editorial/13228) — source-abc409-editorial-13228-cebc583d6c6842ea88624a86c2b7a418f774191123e7f161b74c2d6d494375e8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/tasks/abc409_f) — source-abc409-f-problem-fec7ee4dd0681cfccdab7c82f1d78d79b19074fe7b587293188aa87e737a047e
