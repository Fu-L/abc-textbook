---
title: "ABC281-G — Farthest City"
draft: true
authoringUnit: {"problemId":"abc281-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc281-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc281-editorial-5370-8c0c17274b70fbc71d255e9aec2cce8fb6b4d651c73c44634620502b569f27b6","source-abc281-g-problem-0bef5b5691e862ad9fdea49d92f600ea4c1771d9e43d42b97f4196f90849cd64"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"根1からの距離層を固定すると、層差2以上の辺は禁止され、同層内の辺は自由である。次層の各頂点は直前層への非空接続を持つことが、指定距離を実現する必要十分条件になる。よって層の頂点選択数、直前層との(2^k−1)^l、同層の2^{l(l−1)/2}を独立に掛けられる。頂点Nを最後の単独層へ置けば他全頂点より距離が大きくなり、逆に条件を満たすグラフはこの層分解を一意に持つ。層サイズDPは全対象グラフを一回だけ数える。","sourceRevisionIds":["source-abc281-editorial-5370-8c0c17274b70fbc71d255e9aec2cce8fb6b4d651c73c44634620502b569f27b6","source-abc281-g-problem-0bef5b5691e862ad9fdea49d92f600ea4c1771d9e43d42b97f4196f90849cd64"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

root1からの距離layerを固定すると、各非root頂点は直前layerへのedgeを少なくとも1本持ち、2層以上離れたedgeを持たないことが必要十分である。

vertex Nだけが最遠なので、まず1…N-1を非空layerへ順に配置・配線し、最後にNをその次layerへ単独で接続すれば重複なく数えられる。

採用する候補: 既に配置した通常頂点数nと最新layer size kのDPで、次layerの頂点集合・前layerへの非空edge・layer内edgeをまとめて遷移する。

距離列そのものを列挙せず、次の配線数に必要な最新layer sizeだけへ状態圧縮できる。

棄却する候補: 各頂点のdistance labelを全割当てし、その後全edge subsetがBFS条件を満たすか数える。

distance割当てとedge subsetが指数的で、N≤500に使えない。

次layerにl個選ぶ方法は残りlabelからC(rem,l)、各新頂点の前layer接続は(2^k-1)^l、同layer内edgeは2^{l(l-1)/2}通りで独立である。

全通常頂点を配置後、Nは最新layerの非空subsetへ接続する2^k-1通りだけで、これにより他全頂点より距離が1大きい。

dp[1][1]=1から、remaining=N-1-nの通常頂点よりl≥1を選び、C(remaining,l)(2^k-1)^l2^{C(l,2)}を掛けてdp[n+l][l]へ送る。n=N-1になった各kから(2^k-1)を掛けて合計する。全演算は入力M modulo。

## 典型の発動条件

### BFS layer数え上げ

発動条件: rootからの最短距離条件を満たすlabelled graphを数えるとき。

distance layerを順に作り、直前layerへの非空接続と禁止edgeで特徴付ける。

### layer size DP

発動条件: 次遷移が配置済み数とfrontier layerの大きさだけに依存するとき。

個々のlayer頂点ではなく(n,k)へ集約する。

## 問題固有の要素

最遠vertex Nを最後の単独layerとして後付けすると、『他は全て近い』条件を自然に強制できる。

別の問題へ持ち帰る視点: distinguishedな唯一最遠点を持つgraph数え上げでは、その点を通常layer生成から除外し最後に接続する。

## 正当性

根1からの距離層を固定すると、層差2以上の辺は禁止され、同層内の辺は自由である。次層の各頂点は直前層への非空接続を持つことが、指定距離を実現する必要十分条件になる。よって層の頂点選択数、直前層との(2^k−1)^l、同層の2^{l(l−1)/2}を独立に掛けられる。頂点Nを最後の単独層へ置けば他全頂点より距離が大きくなり、逆に条件を満たすグラフはこの層分解を一意に持つ。層サイズDPは全対象グラフを一回だけ数える。

## 実装上の注意

- 法Mはprimeとは限らないのでfactorial inverseでC(n,k)を作らず、Pascal recurrence等でmod Mの組合せを前計算する。
- rootをn=1,k=1に含め、通常頂点の残数とdistinguished Nを二重に数えない。

## 復習の核

- N=3でroot layer{1}、通常layer{2}、最遠{3}しかないことから答え1を遷移式で再現する。

## 計算量と制約

### 時間

O(N³)、配置済数×最新layer size×次layer size。

### 空間

O(N²)、DP・二項係数・冪。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 500; 10^8 \leq M \leq 10^9; N and M are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/editorial/5370) — source-abc281-editorial-5370-8c0c17274b70fbc71d255e9aec2cce8fb6b4d651c73c44634620502b569f27b6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/tasks/abc281_g) — source-abc281-g-problem-0bef5b5691e862ad9fdea49d92f600ea4c1771d9e43d42b97f4196f90849cd64
