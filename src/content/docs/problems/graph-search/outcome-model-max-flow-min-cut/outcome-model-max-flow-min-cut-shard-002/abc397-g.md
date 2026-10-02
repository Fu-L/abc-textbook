---
title: "ABC397-G — Maximize Distance"
draft: true
authoringUnit: {"problemId":"abc397-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-002/abc397-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc397-editorial-12453-7826b19c59d1c67b3cd090ff5177238021ac8d459e8fe2b0dff3ab388384c1d2","source-abc397-g-problem-52a95239df69f599f295560aba115d40481c076aa8e1addf95fed5d689044a64"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"整数labelの増分を1以下へ制限し、labelが一段増える元edgeだけweight1費用をcutへ課すとpathのtelescopingより1→N距離≥d。逆に任意0/1重み距離からcapped距離labelを作れば同制約とcost上界を満たす。必要one数≤Kなら余りをoneへ増やしても距離が減らずexactKを実現する。","sourceRevisionIds":["source-abc397-editorial-12453-7826b19c59d1c67b3cd090ff5177238021ac8d459e8fe2b0dff3ab388384c1d2","source-abc397-g-problem-52a95239df69f599f295560aba115d40481c076aa8e1addf95fed5d689044a64"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

ある0/1 edge割当でshortest distance≥dとは、各vertexへlabel x_v∈[0,d]を与えx_1=0,x_N=dとし、edge u→vがlabelを一つ進める箇所にweight1を置き、二つ以上飛ぶlabel差を禁止するcut問題として表せる。 距離dを達成するために必要な最小weight1辺数がK以下なら、残りedgeも1へ変えても距離は減らないのでexactly Kを満たせる。 y_{v,j}=1 iff x_v≥jとするとy_{v,j+1}=1,y_{v,j}=0をINF edgeで禁止して整数labelを表す。 edge(u,v)について同levelの0→1 cutにcost1を置き、x_v≥x_u+2をINF制約で禁止すると、選ぶべきweight1辺数とcut costが一致する。

採用する候補: 距離dのlayered binary variablesをs-t min-cutへ帰着し、dを二分探索する

label x_vをthreshold bits y_{v,j}へ展開すると単調性とedge制約がdirected cut edgeになり、O(Nd)頂点graphのmin-cutで必要edge最小数を求められる。

棄却する候補: K本のedge subsetを列挙して0-1 BFSする

C(M,K)通りでM≤100でも巨大で、距離下界というglobal条件を直接扱えない。

y_{v,j}=1 iff x_v≥jとするとy_{v,j+1}=1,y_{v,j}=0をINF edgeで禁止して整数labelを表す。

edge(u,v)について同levelの0→1 cutにcost1を置き、x_v≥x_u+2をINF制約で禁止すると、選ぶべきweight1辺数とcut costが一致する。

d候補ごとにNd threshold nodeを作り、vertex内単調INF edge、元edge由来cost1/INF edge、x_1=0,x_N=dのsource/sink固定を張る。max-flow=min-cutがK以下か判定し、最大dをbinary searchする。

## 典型の発動条件

### multi-label submodular problemのgraph cut

発動条件: ordered label差にconvex/禁止costがあり最小化したいとき。

labelをthreshold binary列へ展開してcutへ変換する。

### 答え二分探索

発動条件: 達成目標dを上げるほど必要resourceが非減少なとき。

必要edge数≤Kを判定する。

## 問題固有の要素

shortest distanceを直接最大化せず、各vertexのdistance labelがedgeごとに満たすべき局所不等式へ翻訳するとmin-cutになる。

別の問題へ持ち帰る視点: 最短路を悪化させる設計問題では、distance potentialを変数にしてedge constraint違反costを最小化する双対的視点を持つ。

## 正当性

整数labelの増分を1以下へ制限し、labelが一段増える元edgeだけweight1費用をcutへ課すとpathのtelescopingより1→N距離≥d。逆に任意0/1重み距離からcapped距離labelを作れば同制約とcost上界を満たす。必要one数≤Kなら余りをoneへ増やしても距離が減らずexactKを実現する。

## 実装上の注意

- INFはKまたはMを確実に超える値にし、x_1=0,x_N=d固定方向を確認する。d=0と最大N-1の探索境界を扱う。

## 復習の核

- N≤7,M≤12で全K-edge subsetと0-1 shortest pathを列挙し、各dのmin-cut値・exact K補完を比較する。

## 計算量と制約

### 時間

元N頂点M辺、試行距離d≤N−1。threshold graph V=Nd+2,E=O((N+M)d)。一般Dinic判定O(V²E)、二分探索O(log N)回。

### 空間

一判定network O((N+M)d)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 30; 1 \leq K \leq M \leq 100; 1 \leq u_j, v_j \leq N; u_j \neq v_j; In the given graph, vertex N is reachable from vertex 1.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/editorial/12453) — source-abc397-editorial-12453-7826b19c59d1c67b3cd090ff5177238021ac8d459e8fe2b0dff3ab388384c1d2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/tasks/abc397_g) — source-abc397-g-problem-52a95239df69f599f295560aba115d40481c076aa8e1addf95fed5d689044a64
