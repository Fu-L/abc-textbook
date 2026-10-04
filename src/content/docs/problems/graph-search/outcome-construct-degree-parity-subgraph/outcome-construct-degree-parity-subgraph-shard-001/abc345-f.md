---
title: "ABC345-F — Many Lamps"
draft: true
authoringUnit: {"problemId":"abc345-f","docPath":"src/content/docs/problems/graph-search/outcome-construct-degree-parity-subgraph/outcome-construct-degree-parity-subgraph-shard-001/abc345-f.md","learningOutcomeIds":["outcome-construct-degree-parity-subgraph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-euler-trail-circuit"],"excludedTopics":["指定次数parityの部分グラフ構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-degree-parity-subgraph","tag-constructive-witness"],"sourceRevisionIds":["source-abc345-editorial-9558-cb10281ba2d26e522eaef3bebf2b27924a4104f16b20a401b0d5d54fcc969830","source-abc345-f-problem-e058936f6d4cce8ac7c5b99b904a5b93cfeb2f98a0b9d9d7000bfb8e042710e3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一辺toggleはon数parityを変えず成分ごと最大偶数2floor(size/2)が上界。postorderでoff子を親辺でonにすると親がoffならon数+2、onなら±0で減らない。最終各非根がonで上界Yへ達し、0..Yを2刻みで通るため任意偶数Kで停止可能。","sourceRevisionIds":["source-abc345-editorial-9558-cb10281ba2d26e522eaef3bebf2b27924a4104f16b20a401b0d5d54fcc969830","source-abc345-f-problem-e058936f6d4cce8ac7c5b99b904a5b93cfeb2f98a0b9d9d7000bfb8e042710e3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [指定次数parityの部分グラフ構成](src/content/docs/learn/graph/degree-parity-subgraph.md)

- 選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。
- [Euler trail・circuit](src/content/docs/learn/graph/euler-trail-circuit.md) — 全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

一edge操作は両端lampをtoggleするため、各connected component内のon個数parityは常に偶数である。size sのcomponentで到達可能な最大on数は最大の偶数2floor(s/2)で、全component合計をYとする。 postorderで非root頂点vがoffならparent edgeをtoggleしてvをonに固定してからvを切り離す。この操作はvをoff→on、parentをtoggleするので全体on数は0または2増え、component終了時にはroot以外全てon、parityによりちょうど2floor(s/2)個onになる。

採用する候補: DFS forestの帰りがけに必要なparent edgeだけ使い、on数がKになった時点で止める

各edgeを高々一度使い、on数を0からYまで0または2ずつ単調に増やす構成が得られる。

棄却する候補: 任意edgeを選ぶ状態空間BFS

lamp状態は2^N通りで、N=2×10^5では探索できない。

postorderで非root頂点vがoffならparent edgeをtoggleしてvをonに固定してからvを切り離す。この操作はvをoff→on、parentをtoggleするので全体on数は0または2増え、component終了時にはroot以外全てon、parityによりちょうど2floor(s/2)個onになる。

全componentでDFS spanning treeとparent edgeを記録しY=Σ2floor(size/2)を計算する。Kが奇数またはK>YならNo。そうでなければ各treeをpostorder走査し、v≠rootがoffならparent edge IDを答えへ追加して両端stateをtoggleする。on countがKになった瞬間に停止してedge列を出す。

## 典型の発動条件

### parity invariant

発動条件: 一操作が各component内のbitを二つ反転する。

on個数の偶奇が0から変わらないことを必要条件として使う。

### spanning tree上のleaf elimination

発動条件: 任意graphでedge操作構成が必要だがcycleは不要である。

DFS treeを葉から処理し、各非root頂点の最終stateをparent edge一回で確定する。

## 問題固有の要素

leaf elimination中のon数が減らないため、最終最大値だけでなく途中の全偶数値を必ず通り、希望Kでprefixを切れば構成になる。

別の問題へ持ち帰る視点: 単調な構成processが到達値を刻み幅ごとに通過するなら、途中停止で全中間目標を実現できる。

## 正当性

一辺toggleはon数parityを変えず成分ごと最大偶数2floor(size/2)が上界。postorderでoff子を親辺でonにすると親がoffならon数+2、onなら±0で減らない。最終各非根がonで上界Yへ達し、0..Yを2刻みで通るため任意偶数Kで停止可能。

## 実装上の注意

- K=0なら操作0回で即終了する。edge IDは入力番号を保存し、component rootにはparent edge操作を行わない。

## 復習の核

- 孤立頂点、奇数/偶数size componentの混在、K=0・Y、parentがonのため増分0となるstepをsimulationして最終個数を確認する。

## 計算量と制約

### 時間

N頂点M辺。spanning forestとpostorder O(N+M)、出力O(N)。

### 空間

木親辺、色、走査順 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min\left( 2 \times 10^5, \frac{N(N-1)}{2} \right); 0 \leq K \leq N; 1 \leq u_i < v_i \leq N; The given graph is simple.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/editorial/9558) — source-abc345-editorial-9558-cb10281ba2d26e522eaef3bebf2b27924a4104f16b20a401b0d5d54fcc969830
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/tasks/abc345_f) — source-abc345-f-problem-e058936f6d4cce8ac7c5b99b904a5b93cfeb2f98a0b9d9d7000bfb8e042710e3
