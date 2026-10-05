---
title: "ABC378-F — Add One Edge 2"
draft: true
authoringUnit: {"problemId":"abc378-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc378-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc378-editorial-11293-8a6a5dc991589df7d159e121ccdb27acd14bd59dc31992b6fed747eeee3d9a3d","source-abc378-f-problem-581d56027b2dfeff972127fc57895ebaef53d01db5febed2d6ff99433034dc3b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"追加辺の閉路は元の端点間道そのもの。端点の次数だけ1増えるので端点は元次数2、内部は元次数3が必要十分。道を最高点で分類すると異子方向の結合と上端自身の場合に一意分解される。次数2端点同士の隣接を除くことで3頂点以上の閉路だけを数える。","sourceRevisionIds":["source-abc378-editorial-11293-8a6a5dc991589df7d159e121ccdb27acd14bd59dc31992b6fed747eeee3d9a3d","source-abc378-f-problem-581d56027b2dfeff972127fc57895ebaef53d01db5febed2d6ff99433034dc3b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

辺を追加して生じる cycle は元の木の二端点間 path そのものである。全頂点次数が3となる条件は、path の端点の元次数が2、内部頂点の元次数が3であることに等しい。端点から一歩以上の次数3連鎖を通って到達する次数2頂点数を各子方向ごとに持つと、現在頂点を内部に含むpathは異なる二方向の積で数えられる。現在頂点が次数2なら端点候補として上へ1を返し、次数3なら子からの候補を合算し、それ以外の次数では伝播を止める。

採用する候補: 木を根付き化し、次数3の頂点だけを伝播路として、各子方向から到達できる次数2端点数をbottom-upに集計して異なる方向の組を数える。

数える対象を次数列が制限された単純pathへ言い換えると、頂点ごとの子方向の集約だけで各pathを一度だけ数え、O(N)の木DPにできる。

棄却する候補: 追加する頂点対を全て試し、できた cycle 上の次数を確認する。

頂点対が Θ(N^2) あり、path 確認を加えるとさらに重くなる。

任意根でDFSし、a_vを「vが次数2ならその1頂点、次数3なら子方向から次数3だけを内部にして到達できる次数2端点数」とする。deg(v)=2では、最初の内部頂点を必ず1個含めるためdeg(child)=3のchildについてだけΣa_childを答えへ加え、a_v=1とする。deg(v)=3ではΣ_{i<j}a_i a_jを加えてa_v=Σa_iとし、それ以外はa_v=0とする。

## 典型の発動条件

### 次数条件で伝播を切り替える木DP

発動条件: 端点と内部で異なる頂点条件を満たす木上pathを数えるとき。

次数3だけを通る端点候補数を子から集約し、現在頂点の次数に応じて組の加算と親への返値を切り替える。

## 問題固有の要素

追加後の cycle 条件を元の木上の path の次数列へ翻訳すると、辺追加を試す必要がなくなる。

別の問題へ持ち帰る視点: 内部条件を満たす連鎖だけを DP 値として親へ渡し、壊れた時点で0にする。

## 正当性

追加辺の閉路は元の端点間道そのもの。端点の次数だけ1増えるので端点は元次数2、内部は元次数3が必要十分。道を最高点で分類すると異子方向の結合と上端自身の場合に一意分解される。次数2端点同士の隣接を除くことで3頂点以上の閉路だけを数える。

## 実装上の注意

- pathは3頂点以上なので端点同士が隣接するケースを除く。各pathは根付き木上の最高点または上側端点で一度だけ数え、親方向とのpairを同じ頂点で重ねて数えない。

## 復習の核

- 追加辺の端点・path内部で次数がそれぞれ1増えることから、元次数2/3の条件をまず自力で導く。

## 計算量と制約

### 時間

N 頂点。子候補の和と積和を一回ずつ更新して O(N)。

### 空間

木と各頂点の端点候補数で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2 \times 10^5; 1 \leq u_i, v_i \leq N; The given graph is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/editorial/11293) — source-abc378-editorial-11293-8a6a5dc991589df7d159e121ccdb27acd14bd59dc31992b6fed747eeee3d9a3d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/tasks/abc378_f) — source-abc378-f-problem-581d56027b2dfeff972127fc57895ebaef53d01db5febed2d6ff99433034dc3b
