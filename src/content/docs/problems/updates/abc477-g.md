---
title: "ABC477 G — Frequency Query on Tree"
draft: true
authoringUnit: {"problemId":"abc477-g","docPath":"src/content/docs/problems/updates/abc477-g.md","learningOutcomeIds":["outcome-schedule-range-query-updates","outcome-flatten-tree-by-euler-order","outcome-answer-tree-ancestor-queries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-mo-offline-range","tag-tree-euler-flattening","tag-tree-ancestor-lca"],"sourceRevisionIds":["source-abc477-g-problem-afe2b3b15c965cebee78dc66a3bbde1e59e5c498fb87227cace22a6e3554649e","source-abc477-editorial-25886-020273374dcfcfeb234034ab36428ea8236631c8a70360d1bd630fc1ae13c5e8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Euler prefixの奇数出現集合は根から現在頂点までのパスである。二prefixの対称差は二頂点間パスからLCAだけを除くため、区間と一時的なLCA追加が目的集合に一致する。頻度を一段変えるとき閾値を横切るgの添字は一つだけであり、g[a]−g[b+1]はちょうど指定頻度帯の色を数える。","sourceRevisionIds":["source-abc477-g-problem-afe2b3b15c965cebee78dc66a3bbde1e59e5c498fb87227cace22a6e3554649e","source-abc477-editorial-25886-020273374dcfcfeb234034ab36428ea8236631c8a70360d1bd630fc1ae13c5e8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。
- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。
- binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。

先に読む単元:

- [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)
- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)

## 考察

パス上の色の頻度を、頻度区間[a,b]で集計する。root-to-vertexのprefixを単に差し引く方法では、各色の頻度が変わるたびにその頻度帯への所属も変わるため、パス和のような線形集約が使えない。ここではクエリを並べ替えて現在のパスに少しずつ頂点を足し引きする。

DFSの入場・退場で各頂点を一度ずつ記録した長さ2NのEuler列を作る。tin(s)≤tin(t)となるよう端点を交換すると、区間[tin(s)+1,tin(t)]に奇数回現れる頂点は、s-tパスからLCA(s,t)を除いた集合になる。根からsとtへの頂点集合の対称差を考えると、この形が見える。祖先が端点の場合も同じ式で扱える。

これをMo法で処理し、Euler列の位置を追加・削除するたびに頂点の採用フラグをtoggleする。採用頂点の色頻度f[c]を管理し、さらにg[k]=頻度がk以上の色数を持つ。f[c]がd→d+1ならg[d+1]だけ+1、d→d−1ならg[d]だけ−1。よって頂点のtoggleは O(1)、答えもg[a]−g[b+1]で O(1)。各質問の直前だけLCAを足し、回答後に元へ戻す。

Euler区間長2N、クエリ数Qに対してブロック幅を概ね2N/√Qにする。左右端の総移動は O(N√Q)。LCAを別途binary liftingなどで前計算する。

## 典型の発動条件

パス集合をEuler列の出現偶奇へ変換してMo法を適用する。頻度の頻度を累積閾値で持つと、一増減が一地点の変更になる。

## 問題固有の要素

数えたいのは頂点数ではなく指定頻度帯の色数。gをFenwick Treeに載せる必要はなく、全移動を O(1) で更新できる。

## 正当性

Euler prefixの奇数出現集合は根から現在頂点までのパスである。二prefixの対称差は二頂点間パスからLCAだけを除くため、区間と一時的なLCA追加が目的集合に一致する。頻度を一段変えるとき閾値を横切るgの添字は一つだけであり、g[a]−g[b+1]はちょうど指定頻度帯の色を数える。

## 実装上の注意

LCAはEuler区間の奇数集合に含まれない。質問ごとの追加を必ず戻す。a≥1なので未出現色は回答に影響しない。深い木のDFSではstack深度に注意。

## 復習の核

非線形のパス集計では、区間への写像と、要素一つの増減コストを別々に設計する。累積頻度の更新差分も見る。

## 計算量と制約

### 時間

Moの移動 O(N√Q)、LCA前処理・照会 O((N+Q) log N)。

### 空間

Euler・頻度に O(N)、クエリ O(Q)、binary liftingに O(N log N)。

### 制約との対応

Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq u_i \lt v_i \leq N; The given graph is a tree.; 1 \leq x_i \leq N; 1 \leq s \lt t \leq N; 1 \leq a \leq b \leq N; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc477/tasks/abc477_g)
- [公式解説](https://atcoder.jp/contests/abc477/editorial/25886)
