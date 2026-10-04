---
title: "ABC302-EX — Ball Collector"
draft: true
authoringUnit: {"problemId":"abc302-ex","docPath":"src/content/docs/problems/data-structures/outcome-rollback-reversible-updates/outcome-rollback-reversible-updates-shard-001/abc302-ex.md","learningOutcomeIds":["outcome-rollback-reversible-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rollback","tag-dsu-components"],"sourceRevisionIds":["source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2","source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一つの値 graph 成分の頂点数を V、辺数を E とする。各 pair から一値しか選べないので異なる値の数は E 以下、成分内の値は V 個なので V 以下。従って min(V,E) が上界である。\n\n木成分では根を一つ選び、各辺から child 側の値を選ぶと、根以外の V−1=E 個をすべて一度ずつ選べる。cycle を含む成分では一つの cycle を選び、cycle の辺を巡回向きに割り当てて全 cycle 頂点を覆う。self-loop は一頂点、平行二辺は二頂点の cycle として扱える。残り頂点は cycle を根集合とする spanning forest で接続し、各 forest 辺から child を選ぶ。これで全 V 頂点を覆え、使わなかった辺は任意に選んでよい。したがって上界 min(V,E) は常に達成される。\n\nDSU で各成分の V,E を持ち、全成分の min(V,E) の和を管理する。新辺の両端が別成分なら旧二成分の寄与を引き、併合後の V=V₁+V₂,E=E₁+E₂+1 の寄与を足す。同成分なら V は変えず E を一つ増やして寄与を更新する。DFS の入場時に現在頂点の pair 辺を加え、退場時にこの更新を戻すと、保持する辺は常に根 1 から現在頂点までの pair と一致する。従って記録する和が各 path の答えとなる。","sourceRevisionIds":["source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2","source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rollback・DFS入退場の状態復元](src/content/docs/learn/query/rollback.md)

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

根1から頂点vへのpath上の各頂点は、値A_iとB_iのどちらか一方を選ぶpairに対応する。値を頂点、各pairを辺とする多重グラフに直すと、選べる相異なる値の最大数を連結成分ごとに評価できる。

採用する候補: 値グラフの連結成分量をrollback DSUでpathごとに保つ

DFSで根から現在頂点までのpair辺だけを追加し、戻り際にundoすれば、全vの独立な質問を共有計算できる。

棄却する候補: 各vについて根からのpathを取り出し、値の選び方を最初から解く

path長の総和がO(N^2)になり得て、各pairの二択も直接探索できない。

値グラフの一つの連結成分に頂点数V、辺数Eがあると、各辺から一端を選んで得られる相異なる値の最大数はmin(V,E)である。木成分なら各辺を異なる頂点へ割り当てられ、cycleを含むなら全頂点を覆える。

元の木を頂点1からDFSし、頂点iへ入ると値A_iとB_iを結ぶ辺をrollback DSUへ追加する。DSUは各成分の頂点数・辺数とΣmin(V,E)を持ち、その時点の総和をiの答えとして記録し、子の処理後に追加前までrollbackする。

## 典型の発動条件

### rollback DSU

発動条件: DFSの現在pathに対応する辺集合へ追加し、subtree処理後に直前の状態へ戻したい。

path compressionを使わずunion by sizeと変更履歴を持ち、辺追加・成分併合・同一成分内辺の増加をundoする。

### 多重グラフ上の選択割当

発動条件: 各二択から一つの値を選び、異なる選択値の個数を最大化する。

二択を辺、候補値を頂点と見て、成分の辺数と頂点数だけに目的値を圧縮する。

## 問題固有の要素

path上のball選択問題は、値グラフの各辺をいずれかの端点へ向ける問題であり、答えは成分ごとのmin(辺数,頂点数)の和になる。

別の問題へ持ち帰る視点: 二択の集合族はグラフ化すると、distinct代表選択の最大数を連結成分のcycle有無で捉えられる。

## 正当性

一つの値 graph 成分の頂点数を V、辺数を E とする。各 pair から一値しか選べないので異なる値の数は E 以下、成分内の値は V 個なので V 以下。従って min(V,E) が上界である。

木成分では根を一つ選び、各辺から child 側の値を選ぶと、根以外の V−1=E 個をすべて一度ずつ選べる。cycle を含む成分では一つの cycle を選び、cycle の辺を巡回向きに割り当てて全 cycle 頂点を覆う。self-loop は一頂点、平行二辺は二頂点の cycle として扱える。残り頂点は cycle を根集合とする spanning forest で接続し、各 forest 辺から child を選ぶ。これで全 V 頂点を覆え、使わなかった辺は任意に選んでよい。したがって上界 min(V,E) は常に達成される。

DSU で各成分の V,E を持ち、全成分の min(V,E) の和を管理する。新辺の両端が別成分なら旧二成分の寄与を引き、併合後の V=V₁+V₂,E=E₁+E₂+1 の寄与を足す。同成分なら V は変えず E を一つ増やして寄与を更新する。DFS の入場時に現在頂点の pair 辺を加え、退場時にこの更新を戻すと、保持する辺は常に根 1 から現在頂点までの pair と一致する。従って記録する和が各 path の答えとなる。

## 実装上の注意

- union by size を使い、path compression は使わない。履歴には根の parent、V,E、全体の答えを保存する。
- 両端が同じ成分でも E と答えが変わるので履歴を残す。A_i=B_i の self-loop も辺として数える。
- 根 1 の pair も加えてから子へ進む。出力対象は頂点 2..N。深い元木には明示 DFS stack を使う。

## 復習の核

- 小さい木で全pathと2択を総当たりし、self-loop、平行辺、木成分がcycle成分へ変わる瞬間、兄弟subtree間で状態が漏れないことを照合する。

## 計算量と制約

### 時間

O(N log N)、union-by-size rollback DSU。

### 空間

O(N)、値座標/DSU/変更履歴。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le A_i,B_i \le N; The given graph is a tree.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/editorial/6409) — source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/tasks/abc302_h) — source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1
