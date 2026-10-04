---
title: "ABC254-E — Small d and k"
draft: true
authoringUnit: {"problemId":"abc254-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc254-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc254-e-problem-9669d130852dcc7e44d7b12aa782824240270e2896770b7770dd3635168bc518","source-abc254-editorial-4052-1b8d54f29177ebc1039748dd5940323d575efb47a490fea211a369a0a6252efc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"BFSは辺数の少ない順に頂点を取り出すため、各頂点を初めて発見した時点の距離が最短距離である。深さkで展開を止めれば距離k以下の頂点を漏らさず、距離kを超える頂点を含めない。訪問印により各頂点番号は一度だけ足されるので、得られる和は問い合わせの答えに一致する。","sourceRevisionIds":["source-abc254-e-problem-9669d130852dcc7e44d7b12aa782824240270e2896770b7770dd3635168bc518","source-abc254-editorial-4052-1b8d54f29177ebc1039748dd5940323d575efb47a490fea211a369a0a6252efc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

次数が3以下、探索半径kが3以下なので、各問い合わせで距離k以内に現れる頂点数は高々1+3+3²+3³=40程度である。全グラフを前計算するより、問い合わせごとに始点xから深さkまでBFSする。BFSで各頂点の最短距離を確定し、距離0からkまでの頂点番号を一度ずつ合計すればよい。

訪問印は問い合わせごとに初期化せず、今回の探索で触れた頂点だけ戻せる。閉路で同じ頂点へ複数経路から着く場合も、一度だけqueueへ入れる。

## 典型の発動条件

### 次数と深さが小さい局所BFS
発動条件: 問い合わせ数は多いが、各問い合わせの最大次数と探索半径が小さいとき。
距離k以内だけBFSし、訪問済み頂点の値を集計する。

### 触れた要素だけの初期化
発動条件: 一回の探索で訪問配列の一部しか変わらないとき。
今回訪れた頂点を記録し、その印だけを問い合わせ後に戻す。

## 問題固有の要素

制約の「次数3以下」と「k≤3」は別々ではなく、組み合わせることで一問い合わせの探索量そのものを40程度へ制限する。

別の問題へ持ち帰る視点: 多数問い合わせでも、分岐数^深さが十分小さいなら前計算より問い合わせごとの打ち切り探索が単純で強い。

## 正当性

BFSは辺数の少ない順に頂点を取り出すため、各頂点を初めて発見した時点の距離が最短距離である。深さkで展開を止めれば距離k以下の頂点を漏らさず、距離kを超える頂点を含めない。訪問印により各頂点番号は一度だけ足されるので、得られる和は問い合わせの答えに一致する。

## 実装上の注意

- 距離kの頂点は合計へ含めるが隣接先へは展開しない。問い合わせ間の訪問印を全N初期化せず、今回訪れた頂点だけ戻す。k=0ではxのみを答える。

## 復習の核

- 全点BFSとのランダム比較に加え、k=0、次数3の木、三角形など複数経路で同じ頂点へ着くグラフ、孤立頂点を確認する。

## 計算量と制約

### 時間

O(N+M+Q·3ᵏmax)、最大次数3、kmax≤3。

### 空間

O(N+M)、訪問stampと小さいqueue。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1.5 \times 10^5; 0 \leq M \leq \min (\frac{N(N-1)}{2},\frac{3N}{2}); 1 \leq a_i \lt b_i \leq N; (a_i,b_i) \neq (a_j,b_j), if i\neq j.; The degree of each vertex in the graph is at most 3.; 1 \leq Q \leq 1.5 \times 10^5; 1 \leq x_i \leq N; 0 \leq k_i \leq 3; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/tasks/abc254_e) — source-abc254-e-problem-9669d130852dcc7e44d7b12aa782824240270e2896770b7770dd3635168bc518
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/editorial/4052) — source-abc254-editorial-4052-1b8d54f29177ebc1039748dd5940323d575efb47a490fea211a369a0a6252efc
