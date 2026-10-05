---
title: "ABC447-F — Centipede Graph"
draft: true
authoringUnit: {"problemId":"abc447-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc447-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e","source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"背骨端点には背骨隣接一辺と脚二辺が必要なので次数3以上、内部には背骨二辺と脚二辺が必要なので次数4以上である。根付き木で下向きpathの上端vを親へ渡すとき、vが長さ1なら端点として次数3で足り、延長するなら内部となるため次数4が必要である。vを最高点とする全pathは、vを端点とする一本の子枝か、異なる二子枝の組合せに分かれる。従って次数条件に応じた一本延長と上位二本結合で全候補を覆う。背骨1頂点の場合だけは脚二本があればよく、degree≥2で判定する。","sourceRevisionIds":["source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e","source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

ムカデの背骨を木に埋め込むと、背骨の端点は元木次数3以上、内部頂点は次数4以上である単純pathになる。根付き木で `dp[v]` を「vを上端にする有効な下向き背骨pathの最大頂点数」とする。次数3ならvだけの長さ1を渡せ、次数4以上なら `1+max(child dp)` まで延長できる。

親へ渡すdpと、その場で答えにする場合は分ける。vが端点なら次数3以上で `1+best child dp`、vが内部なら次数4以上で `1+largest child dp+secondLargest child dp`。背骨が1頂点だけの基底は次数2以上で作れる。

採用する候補: postorderで親へ渡す一本のdpと、vを最高点として閉じる一本・二本の答え候補を更新する。

木のpathは最高点で高々二つの子方向に分かれ、次数条件は元木degreeだけで判定できる。

棄却する候補: 全頂点pairのpathを列挙して次数列を調べる。

pairだけでΘ(N²)個あり、列挙に間に合わない。

## 典型の発動条件

### 木上の次数制約 path DP

発動条件: path の端点と内部で異なる局所条件があり、最大長を求めるとき。

頂点を端とする最良一本と、頂点で結ぶ上位二本を計算する。

## 問題固有の要素

求める部分木の枝を除くと中心 spine の path と元木次数下限だけが残り、特殊 graph 検出が path DP になる。

別の問題へ持ち帰る視点: 木の最大 path 問題では、親へ渡す一本の状態と、その場で完結する二本結合の答えを分ける。

## 正当性

背骨端点には背骨隣接一辺と脚二辺が必要なので次数3以上、内部には背骨二辺と脚二辺が必要なので次数4以上である。根付き木で下向きpathの上端vを親へ渡すとき、vが長さ1なら端点として次数3で足り、延長するなら内部となるため次数4が必要である。vを最高点とする全pathは、vを端点とする一本の子枝か、異なる二子枝の組合せに分かれる。従って次数条件に応じた一本延長と上位二本結合で全候補を覆う。背骨1頂点の場合だけは脚二本があればよく、degree≥2で判定する。

## 実装上の注意

- 答え候補はdegree≥3なら `1+best child dp`、degree≥4なら `1+largest+secondLargest`。親へ返すdpはdegree3で1、degree4以上で `1+best child dp`。
- 背骨1頂点の答えはdegree≥2で1。元木degreeを使い、rootの親を除いた子数で判定しない。長さは頂点数である。

## 復習の核

- ムカデの脚を消した spine と元木次数の対応を導き、deg=3 が開始のみ、deg≥4 が延長可能となる遷移を図示する。

## 計算量と制約

### 時間

N 頂点、子上位二本を走査保持して O(N)。

### 空間

木、頂点 DP で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le Q; 3 \le N \le 2 \times 10^5; 1 \le A_i, B_i \le N; The given graph is a tree.; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/editorial/16458) — source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/tasks/abc447_f) — source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca
