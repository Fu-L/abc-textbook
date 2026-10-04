---
title: "ABC361-E — Tree and Hamilton Path 2"
draft: true
authoringUnit: {"problemId":"abc361-e","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc361-e.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter"],"sourceRevisionIds":["source-abc361-e-problem-ce9c750a97916f18b3d3098bd260d0c8f15bdb0ee35f6faabcfc877e62a4776f","source-abc361-editorial-10329-5d702ad8ea3a3933c9202a8a2ff757fbc503462e86d378c4ad3fe10892ebd359"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"開始終了s,t間pathの辺は一回以上、それ以外は木のcutを出て戻るため二回以上通る。下界は2Σw−dist(s,t)、最小化には直径を引く。直径を背骨に枝を往復するwalkが下界を達成する。","sourceRevisionIds":["source-abc361-e-problem-ce9c750a97916f18b3d3098bd260d0c8f15bdb0ee35f6faabcfc877e62a4776f","source-abc361-editorial-10329-5d702ad8ea3a3933c9202a8a2ff757fbc503462e86d378c4ad3fe10892ebd359"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

この解説で扱わないこと:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

木の全頂点を訪れて出発点へ戻るwalkでは、各辺を切った両側を往復する必要があり、全辺を少なくとも二回使う。DFS巡回でこの下界は達成できる。終点を自由にすると、始点から終点までの一本のpathだけは戻らずに済む。節約できる重みを最大にするpathが木の直径である。任意の訪問walkに終点から始点へのpathを加えると閉路walkになり、その長さは少なくとも2ΣCなので元walkは2ΣC−dist(s,t)以上である。直径端からDFSし、直径へ進む枝を最後に回せば、直径辺を一回、他辺を二回通って下界を達成できる。

採用する候補: 全辺重みの2倍から重み付き木の直径を引く。

直径外の枝は往復し、直径上だけ一方向に進むwalkが下界2ΣC−Dを実現する。

棄却する候補: 開始・終了頂点の全組について、全頂点を訪れる最短walkを探索する。

端点選択と巡回順を同時に扱っているが、木では往復回数が辺ごとに決まり端点間pathだけが例外である。

辺重み総和Sを求める。任意頂点から最遠点uを探索し、uからの最遠距離Dをもう一度の木走査で求める。答えとして2S−Dを出力する。

## 典型の発動条件

### 木walkの辺横断下界

発動条件: 全頂点訪問で同じ辺を再利用でき、開始・終了位置が自由なとき。

辺cutの両側を訪れる必要性から往復回数を数える。

### 二回探索による重み付き直径

発動条件: 木上で最大端点間距離を求めるとき。

任意点の最遠点を一端とし、そこから最遠の距離を得る。

## 問題固有の要素

Hamilton pathという名前でも頂点の再訪が許されるため、問題は順列ではなくDFS巡回から一本の戻り道を省く形になる。

別の問題へ持ち帰る視点: 訪問問題では再訪可否を確認し、木なら各辺を何回横断すべきかへ分解する。

## 正当性

開始終了s,t間pathの辺は一回以上、それ以外は木のcutを出て戻るため二回以上通る。下界は2Σw−dist(s,t)、最小化には直径を引く。直径を背骨に枝を往復するwalkが下界を達成する。

## 実装上の注意

- 重み付きなので辺数ではなく距離和で最遠点を選ぶ。再帰深さを避ける実装と64 bitの合計値を用意する。

## 復習の核

- まず閉じたwalkの2ΣCをcut argumentで示し、開いたwalkとの差を端点pathとして説明する。直径探索が重み付きである点も明記する。

## 計算量と制約

### 時間

N頂点。辺和と二直径探索で O(N)。

### 空間

重み付き木と距離stack O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq A_i, B_i \leq N; 1 \leq C_i \leq 10^9; All input values are integers.; Any pair of cities can be reached from each other by traveling through some roads.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/tasks/abc361_e) — source-abc361-e-problem-ce9c750a97916f18b3d3098bd260d0c8f15bdb0ee35f6faabcfc877e62a4776f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/editorial/10329) — source-abc361-editorial-10329-5d702ad8ea3a3933c9202a8a2ff757fbc503462e86d378c4ad3fe10892ebd359
