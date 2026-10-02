---
title: "ABC321-E — Complete Binary Tree"
draft: true
authoringUnit: {"problemId":"abc321-e","docPath":"src/content/docs/problems/graph-search/outcome-count-implicit-binary-tree-layers/outcome-count-implicit-binary-tree-layers-shard-001/abc321-e.md","learningOutcomeIds":["outcome-count-implicit-binary-tree-layers"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。"],"tagIds":["tag-implicit-binary-tree-arithmetic"],"sourceRevisionIds":["source-abc321-e-problem-0074e7d43934eb73ea96b27938b9a2a56d7c265abb3cdb40e35245fe5d9c3615","source-abc321-editorial-7267-650051c033b77bb70605dcb374d412fd3c16a53bb33e6b7fa2fa5f8a99beb305"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"距離Kの相手をLCAがXか各祖先かで一意分類する。祖先z側の残り深さ子孫からX方向の子孫だけ除けばLCAが正確にzの頂点を得る。heap子孫は連続区間なのでNで切って数え、互いに素な全場合を足す。","sourceRevisionIds":["source-abc321-e-problem-0074e7d43934eb73ea96b27938b9a2a56d7c265abb3cdb40e35245fe5d9c3615","source-abc321-editorial-7267-650051c033b77bb70605dcb374d412fd3c16a53bb33e6b7fa2fa5f8a99beb305"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [対称性・深さ・label区間で巨大な完全二分木を数える](src/content/docs/learn/tree/implicit-binary-tree.md)

- 同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。

## 考察

heap番号のtreeでは頂点vから下へd段の子孫labelが連続区間[v·2^d,(v+1)·2^d)になる。 Xから距離Kの頂点Yは、そのLCAがX自身か、Xの各ancestorのいずれかという高々tree高さ個のcaseへ一意に分かれる。 ancestor zをLCAとするcaseは、zから残りd段の全子孫からXへ向かうchild subtree分を引けば数えられる。 countDesc(v,d)はmax(0,min(N+1,(v+1)2^d)-v2^d)で、label上限Nとの区間intersectionだけになる。 Xからu段上のancestor zについてd=K-uが0ならz自身1個、d>0ならcountDesc(z,d)-countDesc(child,d-1)が寄与する。 u=0、すなわちLCA=XのcaseはcountDesc(X,K)として最初に数える。

採用する候補: Xからrootまでancestorを算術で列挙し、各ancestorをpathの折返し点とするcaseを子孫label区間の長さでO(1)計数する。

Nが10^18でもtree高さは約60で、頂点やedgeを生成せず各testを処理できる。

棄却する候補: 頂点Xから通常のBFSをK layer行う。

Nが最大10^18でtreeを明示できず、Kも非常に大きい。

棄却する候補: 深さがdepth(X)±Kの全labelを数える。

同じ深さ差でもLCA位置によりXからの距離が異なり、不要な別subtreeを含む。

countDesc(v,d)はmax(0,min(N+1,(v+1)2^d)-v2^d)で、label上限Nとの区間intersectionだけになる。

Xからu段上のancestor zについてd=K-uが0ならz自身1個、d>0ならcountDesc(z,d)-countDesc(child,d-1)が寄与する。

u=0、すなわちLCA=XのcaseはcountDesc(X,K)として最初に数える。

overflowを避けるcountDesc(v,d)を用意し、まずanswer=countDesc(X,K)とする。child=X,z=floor(X/2),u=1からz=0またはu>Kまで上る。d=K-uが0なら1を加え、正ならcountDesc(z,d)-countDesc(child,d-1)を加える。その後child=z,z=floor(z/2)へ更新し、各testのanswerを出力する。

## 典型の発動条件

### implicit complete binary tree

発動条件: 親i/2・子2i,2i+1で巨大treeが番号だけ与えられるとき。

子孫levelを連続label区間として数える。

### ancestor位置での距離case分解

発動条件: 固定始点から距離Kの頂点をrooted treeで数えるとき。

pathが上へ何段進んでから別の枝へ下るかをancestorごとに分ける。

### 全体subtreeから進入branchを引く

発動条件: LCAを特定ancestorに固定し、始点側branchを除外したいとき。

ancestorのd段子孫数からpath childのd-1段子孫数を引く。

## 問題固有の要素

heap labelでは同じ深さの子孫が区間になるため、通常ならsubtree size前計算が必要な距離計数を端点2つの算術へ変えられる。

別の問題へ持ち帰る視点: implicit treeの番号規則から、depth固定のsubtreeがinterval・等差列などの数えやすい集合にならないか確認する。

## 正当性

距離Kの相手をLCAがXか各祖先かで一意分類する。祖先z側の残り深さ子孫からX方向の子孫だけ除けばLCAが正確にzの頂点を得る。heap子孫は連続区間なのでNで切って数え、互いに素な全場合を足す。

## 実装上の注意

- 2^dやv·2^dが64bitを超える前に、dが十分大きい・v>N>>dならcount 0と判定してshift overflowを避ける。
- KはN-1までで64bit値なのでint loop上限に変換せず、実際のancestorが尽きる約60回だけ回す。

## 復習の核

- Xの子孫case、親自身case、祖先の反対側subtree caseを小さいheap treeに色分けし、同じ頂点を重複せず全て数えるか確認する。

## 計算量と制約

### 時間

Nまでのheap木の高さ h=⌊log₂N⌋。祖先列挙と区間算術で各質問 O(h)。

### 空間

木を生成せず O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T \leq 10^5; 1\leq N \leq 10^{18}; 1\leq X \leq N; 0\leq K \leq N-1; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/tasks/abc321_e) — source-abc321-e-problem-0074e7d43934eb73ea96b27938b9a2a56d7c265abb3cdb40e35245fe5d9c3615
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/editorial/7267) — source-abc321-editorial-7267-650051c033b77bb70605dcb374d412fd3c16a53bb33e6b7fa2fa5f8a99beb305
