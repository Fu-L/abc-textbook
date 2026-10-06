---
title: "ABC472 G — Cascading Grid"
draft: true
authoringUnit: {"problemId":"abc472-g","docPath":"src/content/docs/problems/updates/abc472-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc472-g-problem-c9aa3c7ae920e1c458e4782d37c1774c4f6226fb339c3041a7d9b83b64f1152b","source-abc472-editorial-24419-33d5600731ab36aac72a4fdb5832a0884b496efbe27384208e53d7ba2e6c5d2e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"操作で実現できる残存集合は示した含意を必ず満たし、含意を満たす任意の集合について消去対象の到達先も消去対象なので実現可能である。INF辺は含意違反を禁止し、各有限辺は得点の損失を一度だけ数える。最大流最小カット定理により最小損失を求めれば最大得点になる。","sourceRevisionIds":["source-abc472-g-problem-c9aa3c7ae920e1c458e4782d37c1774c4f6226fb339c3041a7d9b83b64f1152b","source-abc472-editorial-24419-33d5600731ab36aac72a4fdb5832a0884b496efbe27384208e53d7ba2e6c5d2e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

消去操作の順序ではなく、最後に残る集合を考える。横に接する非#セルは相互に到達できるので、残すなら両方残す。縦では下を残すなら上も残す必要がある。逆にこの含意を守る集合なら、消すべきセルを選んで操作しても残す集合には到達しないため、すべての消去を実現できる。

残すセルをsource側に置く最大重み閉包としてモデル化する。横の隣接は両方向へ、縦の隣接は下から上へINF辺を張る。+セルにはsource→セル容量1、−セルにはセル→sink容量1。初期得点を+の総数とすると、+を消す損と−を残す損が有限容量カットに一致する。

INFは全有限容量の総和HWより大きいHW+1でよい。制約違反を含むカットは全セルを消す等の合法カットより大きくなるので選ばれない。最大得点は+の個数−最大流。元の#セルには頂点を作らず、隣接含意も非#間だけに張る。

## 典型の発動条件

操作列の最適化を、最終集合の閉包条件へ移す。利益と損失をsource/sink辺へ、含意を大容量辺へ表現する。

## 問題固有の要素

消去は下方向へ伝わるので、残す集合の含意辺は逆に下→上となる。

## 正当性

操作で実現できる残存集合は示した含意を必ず満たし、含意を満たす任意の集合について消去対象の到達先も消去対象なので実現可能である。INF辺は含意違反を禁止し、各有限辺は得点の損失を一度だけ数える。最大流最小カット定理により最小損失を求めれば最大得点になる。

## 実装上の注意

横は両方向。INFを無根拠な最大整数にせずHW+1とする。残余辺と逆辺を対で管理する。

## 復習の核

含意の方向は『残したら何を残すか』で確認する。操作方向をそのまま辺方向へ写さない。

## 計算量と制約

### 時間

V,E=O(HW)。一般容量Dinicの上界 O(V²E)=O((HW)³)。H,W≤30の小規模ネットワーク。

### 空間

残余グラフ O(HW)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le H,W \le 30; S_i is a string of length W consisting of +, -, #.; H and W are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc472/tasks/abc472_g)
- [公式解説](https://atcoder.jp/contests/abc472/editorial/24419)
