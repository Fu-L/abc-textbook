---
title: "ABC335-E — Non-Decreasing Colorful Path"
draft: true
authoringUnit: {"problemId":"abc335-e","docPath":"src/content/docs/problems/graph-search/outcome-maintain-connectivity-components/outcome-maintain-connectivity-components-shard-001/abc335-e.md","learningOutcomeIds":["outcome-maintain-connectivity-components","outcome-process-dag-in-topological-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dag-topological-processing","tag-dsu-components"],"sourceRevisionIds":["source-abc335-e-problem-74667aba09b44fd468f310632df8e11f7ecd7d1da6aa64ea7e5846d0d52755e9","source-abc335-editorial-9037-b36c2054e83f43171398cad8f9e3b09d456bbdec6363016acbfd0880e4b4c48f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等値連結成分内はscoreを増やさず任意出口へ行けるため縮約可能。残る辺は厳密値増加でDAG。各成分の最大scoreを値順更新する帰納法で全非減少pathの最適を得る。","sourceRevisionIds":["source-abc335-e-problem-74667aba09b44fd468f310632df8e11f7ecd7d1da6aa64ea7e5846d0d52755e9","source-abc335-editorial-9037-b36c2054e83f43171398cad8f9e3b09d456bbdec6363016acbfd0880e4b4c48f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

非減少pathではAが小さい頂点から大きい頂点へしか辺を進めず、Aが等しい辺だけは双方向に使える。同じ値の辺で連結な頂点群は、入った場所から任意の出口へ移れてscore増分も一度だけなので一頂点へ縮約できる。 等値成分内の移動ではdistinct値数は増えず、異なる値の成分へ移るたび必ず1増える。縮約後の辺は値が厳密増加するためDAGであり、simple path条件もcycleを除いた最長pathの構成を妨げない。

採用する候補: 同値連結成分をDSUで縮約し、値が増えるDAG上で最長path DPを行う

等値cycleを消した後は全辺がAの小さい成分から大きい成分へ向き、値順に安全に遷移できる。

棄却する候補: 元graph上で頂点番号順にdpを更新する

依存順は頂点番号でなくAの大小で決まり、等値辺のcycleもあるため一回の走査では伝播しない。

等値成分内の移動ではdistinct値数は増えず、異なる値の成分へ移るたび必ず1増える。縮約後の辺は値が厳密増加するためDAGであり、simple path条件もcycleを除いた最長pathの構成を妨げない。

A_u=A_vの全辺をDSUでunionする。各元辺の異なる代表元間に小さいAから大きいAへの有向辺を作る。頂点1の成分dp=1、他を到達不能として、成分をA昇順に処理しdp[next]=max(dp[next],dp[cur]+1)を行い、頂点Nの成分値を出力する。

## 典型の発動条件

### 同値辺のcomponent縮約

発動条件: 同じlabel間の移動が双方向でcost増分0となりcycleを作る。

DSUで同値連結部分をまとめ、内部pathを一状態として扱う。

### DAG最長path

発動条件: 縮約後の遷移ごとにlabelが厳密増加し、scoreが1増える。

label昇順をtopological orderとしてdp最大値を伝播する。

## 問題固有の要素

scoreは訪問頂点数ではなくdistinctなAの数なので、同じAの連結領域を何頂点通っても一段として数える。

別の問題へ持ち帰る視点: 非減少label pathでは、等値移動を0-cost componentへ縮約して厳密増加DAGへ変える。

## 正当性

等値連結成分内はscoreを増やさず任意出口へ行けるため縮約可能。残る辺は厳密値増加でDAG。各成分の最大scoreを値順更新する帰納法で全非減少pathの最適を得る。

## 実装上の注意

- A_1>A_Nなど到達不能なら答え0とする。同じ代表元の辺は捨て、並行辺は残しても正しさは変わらないがdeduplicate可能である。

## 復習の核

- 1とNが同じ等値成分、等値cycleから複数出口、値が下がる辺しかない場合を小graphの全simple pathと比較する。

## 計算量と制約

### 時間

N 頂点、M 辺。DSU O(Mα(N))、値sort O(N log N)、DAG DP O(N+M)。

### 空間

縮約graphとDSU・DP O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \le N \le 2 \times 10^5; N-1 \le M \le 2 \times 10^5; 1 \le A_i \le 2 \times 10^5; The graph is connected.; 1 \le U_i < V_i \le N; (U_i,V_i) \neq (U_j,V_j) if i \neq j.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/tasks/abc335_e) — source-abc335-e-problem-74667aba09b44fd468f310632df8e11f7ecd7d1da6aa64ea7e5846d0d52755e9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/editorial/9037) — source-abc335-editorial-9037-b36c2054e83f43171398cad8f9e3b09d456bbdec6363016acbfd0880e4b4c48f
