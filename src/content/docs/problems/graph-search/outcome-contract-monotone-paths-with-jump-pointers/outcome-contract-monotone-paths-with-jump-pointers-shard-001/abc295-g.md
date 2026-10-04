---
title: "ABC295-G — Minimum Reachable City"
draft: true
authoringUnit: {"problemId":"abc295-g","docPath":"src/content/docs/problems/graph-search/outcome-contract-monotone-paths-with-jump-pointers/outcome-contract-monotone-paths-with-jump-pointers-shard-001/abc295-g.md","learningOutcomeIds":["outcome-contract-monotone-paths-with-jump-pointers"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-dsu-components"],"excludedTopics":["単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-monotone-path-contraction","tag-amortized-monotone-progress","tag-dsu-components"],"sourceRevisionIds":["source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735","source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"初期SCCはsingletonで、元の木上で連結かつtopが最小番号という不変条件を満たす。追加u→vが作る閉路は、元の子孫向きの道v→uと戻り辺からなる。既存の縮約木ではv所属成分からu所属成分までの道上成分が相互に到達可能になる。それ以外の成分へ出る辺は子孫向きで戻れないため、新たに同SCCへ入ることはない。\n\nuとvが別成分の間、u側成分のtop=mはこの縮約道上にあり、parent[m]は道上の一つ上の成分に属する。これらを併合すると成分は木上で連結なまま、min(top[a],top[b])が新topとなる。既存の成分内部を飛ばしても必要な成分を漏らさず、同成分になった時点で閉路上の成分をちょうど吸収し終える。この間mは根ではないのでparent[m]の参照も合法である。\n\n更新後の縮約木も親→子の向きで、成分topの番号は各辺で厳密に増える。従ってxから所属SCCのtopへ到達でき、外の到達成分にはそれより小さい番号がない。2 xへtop[find(x)]を返せば最小番号を得る。成功unionごとに成分数が一つ減るため、whileの全反復はN−1回以下である。","sourceRevisionIds":["source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735","source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調path contraction・DSU jump](src/content/docs/learn/graph/monotone-path-contraction.md)

- 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

元の木の辺は親→子であり、親番号は子番号より小さい。追加クエリ1 u vは、uの祖先vへ戻る辺u→vを加える。元の木のv→uという子孫向きの道と合わせて閉路ができ、その道と交わる既存SCCが一つになる。Q回もSCC分解をやり直すO(Q(N+Q))は避け、成分が併合だけする性質を使いたい。

各SCCは元の木で連結な頂点集合であり、その中で最も浅い頂点が一つ存在する。以降これをtopと呼ぶ。祖先ほど番号が小さいのでtopは成分の最小番号でもある。SCCを縮約すると残る辺は子孫方向の木辺であり、外の成分へ進んでもそのtopの番号は増える。従って出力クエリ2 xの答えはx所属成分のtopになる。

DSUはunion by sizeで管理し、各代表rの属性top[r]に成分の最小番号を持つ。DSUの代表自体が木で最上位とは限らない。初期値はsingletonでtop[i]=i、parent[i+1]=p_iとする。

更新は子孫u側から祖先v側へ進める。find(u)≠find(v)の間、m=top[find(u)]、a=find(m)、b=find(parent[m])を求める。newTop=min(top[a],top[b])を保存し、r=merge(a,b)の後にtop[r]=newTopとする。改めてfind(u),find(v)を比較し、同成分になったら止める。この順なら消えた成分内部の道を一頂点ずつ歩かず、次の未併合境界だけへ進める。

例えば二頂点の木1→2に1 2 1を適用すると、m=2からparent[2]=1へ併合し、2 2には1を返す。逆にv=1から親をたどる方法では子孫2へ到達できない。枝分かれした成分が既にある場合も、成分全体を一度に併合してそのtopの親へ進む。追加辺の端点が既に同SCCならwhileは一度も実行しない。

## 典型の発動条件

### DSUによる単調SCC併合

発動条件: 辺追加でSCCが分裂せず併合だけする。

連結成分と最小頂点をunionで維持する。

### path compression jump

発動条件: 木path上の未併合境界を繰り返し越える。

吸収済み区間を代表値で飛ばし総移動を償却する。

## 問題固有の要素

p_i≤iにより頂点番号が木の祖先方向と対応し、SCC最小番号がpath探索のjump pointerを兼ねる。

別の問題へ持ち帰る視点: 単調併合問題では成分の極値を次の未処理位置として使う。

## 正当性

初期SCCはsingletonで、元の木上で連結かつtopが最小番号という不変条件を満たす。追加u→vが作る閉路は、元の子孫向きの道v→uと戻り辺からなる。既存の縮約木ではv所属成分からu所属成分までの道上成分が相互に到達可能になる。それ以外の成分へ出る辺は子孫向きで戻れないため、新たに同SCCへ入ることはない。

uとvが別成分の間、u側成分のtop=mはこの縮約道上にあり、parent[m]は道上の一つ上の成分に属する。これらを併合すると成分は木上で連結なまま、min(top[a],top[b])が新topとなる。既存の成分内部を飛ばしても必要な成分を漏らさず、同成分になった時点で閉路上の成分をちょうど吸収し終える。この間mは根ではないのでparent[m]の参照も合法である。

更新後の縮約木も親→子の向きで、成分topの番号は各辺で厳密に増える。従ってxから所属SCCのtopへ到達でき、外の到達成分にはそれより小さい番号がない。2 xへtop[find(x)]を返せば最小番号を得る。成功unionごとに成分数が一つ減るため、whileの全反復はN−1回以下である。

## 実装上の注意

- 木辺v→uは子孫方向、更新走査uからvは親方向である。変数の大小だけでなく公式の祖先条件から始点を決める。
- union前に両topの最小を保存し、unionが返した新代表へ書く。任意に選ばれるDSU代表のparentを参照せず、必ず成分topのparentを使う。
- 停止条件はfind(u)=find(v)。v側成分のtopがvより上にある場合や、重複した追加でも余分に根へ進まない。

## 復習の核

- 元の道の向きと、その道を縮約する走査の向きは逆になり得る。
- 成分代表と、次の境界を指す成分属性を分ける。
- 成分数の減少で全while回数を評価し、一クエリの長さをQ倍しない。

## 計算量と制約

### 時間

N頂点Q操作。吸収境界は高々N−1、DSU操作で O((N+Q)α(N))。

### 空間

親木、DSUと成分最小 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; 1\leq Q \leq 2\times 10^5; 1\leq p_i\leq i; For each query in the first format: 1\leq u,v \leq N. u \neq v. On G_S, vertex u is reachable from vertex v via some edges.; 1\leq u,v \leq N.; u \neq v.; On G_S, vertex u is reachable from vertex v via some edges.; For each query in the second format, 1\leq x \leq N.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6052) — source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_g) — source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba
