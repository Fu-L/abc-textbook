---
title: "ABC438-F — Sum of Mex"
draft: true
authoringUnit: {"problemId":"abc438-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc438-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation","unit-tree-ancestor-lca"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-rooted-tree-aggregation","tag-tree-ancestor-lca"],"sourceRevisionIds":["source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a","source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"mexのtail条件f(i,j)≥kは頂点0,…,k−1が全てpath上にあること。必須集合が一本のpathへ含まれる間はその両端だけを保持でき、三叉になったら以後の集合も含められない。端点が異なれば両端から外へ伸びる二成分から選ぶendpoint pairが必須pathを含む全候補と一対一対応する。同端点の場合はその頂点を避ける各隣接成分内のpairを全pairから引く。これをk=1..Nで足してmex総和となる。 新頂点が現在path内・x側延長・y側延長なら三つの距離等式のいずれかで両端を正しく保存し、それ以外では三叉が生じる。外側成分のサイズは祖先の場合N−size[経路上の子]、非祖先の場合size[端点]である。同一点の式はi=jを含む全N(N+1)/2対から、その点を避ける各成分内の対を除くためc_1を正確に数える。","sourceRevisionIds":["source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a","source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。
- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md) — doubling・binary liftingで得た考え方と実装を再利用し、ancestor query・LCAの発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

mexを値ごとに直接分類するより、非負整数のtail-sumを使う。c_kをpathに全頂点0,…,k−1が載る端点対i≤jの数とすれば、答えはΣ_{k=1}^N c_k。必須集合が一本のpathに収まれば、その最小包含pathの両端x,yだけで条件を表せる。新頂点z=k−1の追加で三叉ができると、以後どのpathにも収まらない。

根0でdepth、subtree size、binary liftingを前計算し、d(u,v)=depth[u]+depth[v]−2depth[LCA(u,v)]とする。c_1ではx=y=0。k=2,…,Nでz=k−1を足す時は、次の順で判定する。

```text
d(x,z)+d(z,y)=d(x,y)なら、zは今のpath上なので両端を維持
d(z,x)+d(x,y)=d(z,y)なら、xの外へ延びるのでx←z
d(x,y)+d(y,z)=d(x,z)なら、yの外へ延びるのでy←z
どれでもなければ三叉となり、c_k以降は0で終了
```

path上のzを最初に調べないと、既に含まれる内点の追加を分岐と誤判定する。

### 固定pathを含む端点対を数える

x≠yなら、xからyへ向かう最初の辺を切り、x側成分の大きさをs_xとする。y側もs_y。pathを含むには、端点をこの二つの互いに素な外側成分から一つずつ選ぶことが必要十分なのでc_k=s_x s_y。i≤jという向きは各選択対を一度並べ直すだけで、2倍も2での除算も不要。

s_xは根付き木の情報から得る。xがyの祖先なら、yからdepth[y]−depth[x]−1回上がった子qを用いてs_x=N−size[q]。それ以外ならxからyへの第一辺は親方向なのでs_x=size[x]。s_yも対称に求める。

x=y（c_1だけ）では二成分の積を使えない。xを削除した各隣接成分の大きさt_jについて

```text
c_1 = N(N+1)/2 − Σ_j t_j(t_j+1)/2
```

とする。i=jも含む全unordered pairから、xを通らない同一成分内の対を除く式である。子方向はsize[child]、親方向はN−size[x]。

星0–1,0–2,0–3ではc_1=10−3=7、頂点1を足すとc_2=3、頂点2を足すとc_3=1、頂点3で三叉になりc_4=0。mex総和は11となる。距離等式、外側成分、退化pathの式を使い、全kをO(N log N)で処理する。

## 典型の発動条件

### tail-sum 公式

発動条件: 非負整数値の総和を閾値以上となる対象数へ変換したいとき。

mex の値 k ごとの直接分類を、0…k-1 が全てパスにある条件へ変える。

### パス集合の増分維持

発動条件: 木上の頂点を一つずつ追加し、それら全てを含む一本のパスが存在するか判定するとき。

現在の極端二頂点だけを持ち、新頂点が延長可能か LCA/距離で調べる。

### 部分木サイズによるパス包含組数

発動条件: 固定パスを包含する端点対の個数を数えるとき。

両端の外側成分サイズを求め、その直積として数える。

## 問題固有の要素

mex 総和を閾値条件へ変えると、『小番号頂点集合が一本の木パスに載るか』という幾何的な増分問題になる。

別の問題へ持ち帰る視点: 木上の点集合がパスに収まるなら、集合の情報はその最小包含パスの二端点へ圧縮できる。

## 正当性

mexのtail条件f(i,j)≥kは頂点0,…,k−1が全てpath上にあること。必須集合が一本のpathへ含まれる間はその両端だけを保持でき、三叉になったら以後の集合も含められない。端点が異なれば両端から外へ伸びる二成分から選ぶendpoint pairが必須pathを含む全候補と一対一対応する。同端点の場合はその頂点を避ける各隣接成分内のpairを全pairから引く。これをk=1..Nで足してmex総和となる。 新頂点が現在path内・x側延長・y側延長なら三つの距離等式のいずれかで両端を正しく保存し、それ以外では三叉が生じる。外側成分のサイズは祖先の場合N−size[経路上の子]、非祖先の場合size[端点]である。同一点の式はi=jを含む全N(N+1)/2対から、その点を避ける各成分内の対を除くためc_1を正確に数える。

## 実装上の注意

- 頂点番号 k の追加と c_k が要求する集合 0…k-1 の添字をずらさない。x=y の退化ケース、i≤j の unordered pair 数、根方向成分サイズを正しく数える。

## 復習の核

- tail-sum の k と端点更新順、固定 x-y パスを含む端点対の成分積が i≤j を一度ずつ数えることを確認する。

## 計算量と制約

### 時間

O(N log N)、LCAと各端点更新・外側成分取得。

### 空間

O(N log N)、binary lifting。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; 0\le u_i < v_i < N; The graph given in the input is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/editorial/14945) — source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/tasks/abc438_f) — source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238
