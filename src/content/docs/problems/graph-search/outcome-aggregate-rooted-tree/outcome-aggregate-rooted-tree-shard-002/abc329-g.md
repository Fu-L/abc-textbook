---
title: "ABC329-G — Delivery on Tree"
draft: true
authoringUnit: {"problemId":"abc329-g","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc329-g.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-tree-ancestor-lca"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-tree-ancestor-lca"],"sourceRevisionIds":["source-abc329-editorial-7725-8f3501023fac4b0edb0b0240cae4f8f7f80503e0f89022c3459f972cb22ca3b6","source-abc329-g-problem-719f9728e3b7d21f69d02f2758daa01b8efdebc54757ed867e07efe3c42fb1bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"各辺往復一回のtourはchild順だけで決まる。異LCA子間ballはsource子を先にする必要がありport順制約は必要十分。pickupを必要path直前、dropを到着直後に寄せると保持時間最短で容量を悪化させない。各subtreeのexit load差は固定なのでentry load状態でchild tourを順に合成し途中0..K判定すれば全合法tourを数える。","sourceRevisionIds":["source-abc329-editorial-7725-8f3501023fac4b0edb0b0240cae4f8f7f80503e0f89022c3459f972cb22ca3b6","source-abc329-g-problem-719f9728e3b7d21f69d02f2758daa01b8efdebc54757ed867e07efe3c42fb1bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md) — doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。

## 考察

tree edgeを各2回通るroot closed walkは、各child subtreeへ一度入り一度戻るDFS tourであり、2-child vertexごとにchild訪問順だけを選べばpathが一意に決まる。ballのsourceとgoalがLCAの異なるchild subtreeにある場合、source側childをgoal側より先に訪れる必要があり、各2-child vertexへ順序constraintが生じる。各ballはsourceからgoalへのtree pathへ乗る直前にpickupし、goalへ着いた直後にdropするのがcapacity上最適で、pickup/drop数を各vertexのincident portへ集約できる。ball jのpickup portはS_jからT_jへのpathの最初のneighbor、drop portはT_jへ入る最後のneighborで、binary liftingにより各O(log N)で求められる。subtree vをentry load jで巡回した後のload差は、内部eventのpickup総数−drop総数としてjやchild順によらず一定だが、途中peakの可否と通り数は順序に依存する。2-child vertexでは条件Aが許す1通りまたは2通りのpermutationを試し、各child DPを現在loadで順に合成すればよい。

採用する候補: LCAでchild順constraintと各directed portのpickup/drop数を前計算し、entry load別のtree DPで許容child順を数える。

2^{branch数}のtour列挙を避け、capacity K≤1000をDP軸として各subtreeのload変化を合成できる。

棄却する候補: 全2-child vertexの左右順2択を列挙し、各tourでM ballをsimulationする。

branch数がN規模でpath候補が指数的になる。

棄却する候補: child順constraintだけ満たすpath数を2の自由頂点数乗で数える。

順序が矛盾しなくても同時運搬ball数がKを超えるtourは実行不能である。

LCA/binary liftingを前計算する。各ballについてsource→goalの最初のportへpickup count、goalへ入るportへdrop countを加え、LCAが両端と異なるならsource childを先にするconstraintを設定し、逆constraintと衝突すれば0。dp[v][j]をload jでvへ初回到着したsubtree tour通り数とし、到着portのdrop、各許容child順について「vからchildへ出る直前pickup→child dp→戻った直後drop」を順に適用し、最後にparent向けpickupを加える。loadが0..K外なら棄却し、子通り数を掛けて順序間を加算する。rootのentry 0から最終load 0となるdpを答える。

## 典型の発動条件

### Euler tour順の局所選択

発動条件: tree edgeを各方向1回ずつ通るclosed walkを数えるとき。

各vertexのchild subtree permutationへpath選択を分解する。

### LCAによるsubtree順constraint

発動条件: sourceからtargetへ一回のDFS tour中に運ぶ必要があるとき。

異なるLCA child間ならsource childを先行させる。

### resource量付きtree DP

発動条件: subtree巡回のentry resourceで実行可能性が変わり、exit差が一定のとき。

entry loadを状態にchild transferを合成する。

## 問題固有の要素

pickupをsourceで可能な限り遅く、dropをgoalで可能な限り早くするとcarry intervalが最短になり、任意のgood操作列のcapacityを悪化させずport eventへ正規化できる。

別の問題へ持ち帰る視点: 運搬capacity問題では各itemの保持区間を必要pathに沿う最短intervalへ寄せ、同時保持数をevent sweep/DPへ落とす。

## 正当性

各辺往復一回のtourはchild順だけで決まる。異LCA子間ballはsource子を先にする必要がありport順制約は必要十分。pickupを必要path直前、dropを到着直後に寄せると保持時間最短で容量を悪化させない。各subtreeのexit load差は固定なのでentry load状態でchild tourを順に合成し途中0..K判定すれば全合法tourを数える。

## 実装上の注意

- SがTのancestorなら最初のportはT側child、そうでなければparent[S]で、goal側の最後のportも対称に場合分けする。
- pickup/drop適用の時点をdirected portごとに固定し、load減算が負・加算がK超ならその順序を棄却する。
- constraint conflictをDP前に検出し、leaf・1-childも同じpermutation loopで扱うとcase漏れを減らせる。

## 復習の核

- 異なる2 child間のballで順序が固定される例と、逆向きballもあり矛盾する例、同じ順序でもpeak loadがKを超える例を別々に追う。

## 計算量と制約

### 時間

N二分木頂点、M ball、容量K。LCA/port前計算 O((N+M)log N)、各頂点entry loadと最大2順序 O(NK)。

### 空間

LCA O(N log N)、load DP O(NK)、port eventO(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 10^4; 1\leq M \leq 2\times 10^5; 1\leq K \leq 10^3; 1\leq P_i \leq i; For every v\ (1\leq v \leq N), there are at most two i's such that P_i=v.; 1\leq S_j, T_j \leq N; S_j \neq T_j; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/editorial/7725) — source-abc329-editorial-7725-8f3501023fac4b0edb0b0240cae4f8f7f80503e0f89022c3459f972cb22ca3b6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/tasks/abc329_g) — source-abc329-g-problem-719f9728e3b7d21f69d02f2758daa01b8efdebc54757ed867e07efe3c42fb1bf
