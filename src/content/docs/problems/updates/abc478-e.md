---
title: "ABC478 E — lt and le"
draft: true
authoringUnit: {"problemId":"abc478-e","docPath":"src/content/docs/problems/updates/abc478-e.md","learningOutcomeIds":["outcome-condense-and-order-directed-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-scc-condensation"],"sourceRevisionIds":["source-abc478-e-problem-9beb6651f02ed2cc586317436261fb95e8d95608ac9df1e1ce609d97f5b38407","source-abc478-editorial-26539-137ab1c0cbb63b96bb0be2a2eb597ac35ac6c90587527152ab0f9d20393941e0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"SCC内部の相互到達性から各変数が互いに≤となり、等値が必要である。内部厳密辺はこの必要条件に反する。逆に内部に厳密辺がなければ成分単位の等値割当は内部条件を満たし、topological番号の狭義増加はすべての成分間条件を満たすため十分である。","sourceRevisionIds":["source-abc478-e-problem-9beb6651f02ed2cc586317436261fb95e8d95608ac9df1e1ce609d97f5b38407","source-abc478-editorial-26539-137ab1c0cbb63b96bb0be2a2eb597ac35ac6c90587527152ab0f9d20393941e0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[SCC・縮約DAG・トポロジカル順序](src/content/docs/learn/graph/scc-condensation.md)

- 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。

## 考察

各条件はA_u≤A_vまたはA_u<A_vである。いずれもu→vの有向辺にする。閉路上では弱い大小関係を一周するので、同じSCCの全変数は等しくなければならない。従ってSCC内部に厳密不等号の辺が一本でもあれば不可能。

そのような辺がなければ、SCCを縮約したDAGをtopological順に並べ、各成分へ1,2,…,Cを与える。成分間の辺では必ず前から後へ向かうため、弱い条件も厳密な条件も満たす。同じ成分には同じ値を与える。C≤Nなので値域1..Nにも収まる。

より小さな値を求める問題なら、厳密辺を重み1、弱辺を0としてDAG上の最長路にする。しかし今回は任意の実現可能値でよく、異なる成分を全て別の値にする方が構成と証明が短い。

## 典型の発動条件

大小制約の閉路が強制する等値関係をSCCでまとめ、残る依存をDAG上の順序へ変換する。

## 問題固有の要素

同じ成分には弱い条件を許すが厳密条件を許さない。実現値の最小化は要求されないため、成分ごとに異なる番号で足りる。

## 正当性

SCC内部の相互到達性から各変数が互いに≤となり、等値が必要である。内部厳密辺はこの必要条件に反する。逆に内部に厳密辺がなければ成分単位の等値割当は内部条件を満たし、topological番号の狭義増加はすべての成分間条件を満たすため十分である。

## 実装上の注意

SCCライブラリが返すID順を仮定するなら、その仕様を確認する。そうでなければ明示的にtopological sortする。自己辺が厳密なら直ちに不可能。

## 復習の核

不等式の閉路が不可能とは限らない。まず等号へ潰せる閉路と、厳密辺を含む矛盾を分ける。

## 計算量と制約

### 時間

SCC、内部辺検査、DAGのtopological処理を合わせ O(N+Q)。

### 空間

隣接リストとSCC情報に O(N+Q)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le Q\le2\times10 ^ 5; t _ i\in\lbrace0,1\rbrace\ (1\le i\le Q); 1\le u _ i\le N\ (1\le i\le Q); 1\le v _ i\le N\ (1\le i\le Q); All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc478/tasks/abc478_e)
- [公式解説](https://atcoder.jp/contests/abc478/editorial/26539)
