---
title: "ABC291-EX — Balanced Tree"
draft: true
authoringUnit: {"problemId":"abc291-ex","docPath":"src/content/docs/problems/graph-search/outcome-build-balanced-separator-decomposition/outcome-build-balanced-separator-decomposition-shard-001/abc291-ex.md","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["LCA・HLDによる固定木上パスの区間分解。"],"tagIds":["tag-tree-balanced-separator"],"sourceRevisionIds":["source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c","source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一頂点の成分は自明に二条件を満たす。成分Sの重心cをRの根とし、T−cの各成分S_iの帰納的構成の根をcへつなぐ。新しい各子部分木はちょうどS_iで|S_i|≤|S|/2。内部の親子には帰納法が使えるので全親子の半減条件が成立する。\n\n二頂点x,yについて、一方がcならRのLCAはcでTのpath端点にもある。異なるS_iへ属するならRのLCAはcで、Tのpathもcを通る。同じS_iならRのLCAはその再帰内部で決まり、Tの一意pathも連結なS_i内にあるため帰納法で条件が成立する。これらは全頂点対を覆う。各成分を一度だけ子としてつなぐので、全N頂点を含む一つの根付き木を構成する。","sourceRevisionIds":["source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c","source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [木の均衡分離点から重心分解へ進む](src/content/docs/learn/tree/tree-balanced-separators.md)

- 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- LCA・HLDによる固定木上パスの区間分解。

## 考察

求める根付き木Rは元木Tと同じ辺を使う必要がない。必要なのは「RのLCAがTのpath上にある」ことと「Rの子部分木が親部分木の半分以下」である。任意にTを根付き化しただけでは後者を保証できない。二条件を同時に保つ十分な構成として、Tの重心を分離点にする。

現在扱うTの連結成分Sの重心cを取り、RでもSを表す部分木の根をcにする。cを除いた各連結成分S_iは|S|/2以下。各S_iを再帰的に構成し、その根の親をcへ設定すれば、Rでその子部分木の頂点集合はちょうどS_iとなる。Tの異なるS_iに属する二点間のpathは必ずcを通るので、RでLCA=cとなる対の条件も満たす。同じS_i内の対はその再帰に任せられる。

重心を求めるには、削除済みの重心を除いたSだけを一時的な根rからDFSし、訪問順と親を保存する。逆順でsub[v]を計算し、vを除く各成分の最大サイズを

```text
largest[v] = max(|S|−sub[v], 各一時的な子uのsub[u])
```

とする。largest[v]≤|S|/2を満たすvを一つ選べば重心である。存在は、半分より大きい側があればその方向へ移動することで示せる。戻る側は半分未満なので同じ辺を戻らず、有限木で停止した点が重心になる。

cの出力親を現在の分解親（最上位だけ−1）に設定し、cを削除済みにする。未削除の各隣接点から残る成分へ同じ手順を行う。一頂点成分はその点を根にして終了する。

これは十分な構成であり、条件が重心分解の形そのものを要求するわけではない。例えばTが中心1・葉2,3,4のstarなら、Rの親を(−1,1,2,1)とする木も条件を満たす。Rの2の部分木は{2,3}で、T−1の別々の成分をまとめているが、LCA(2,3)=2はTの2−1−3 pathの端点である。この出力を重心分解に限定する必要はない。

## 典型の発動条件

### 重心分解

発動条件: 木を各段階で半分以下の連結成分へ再帰分割したい。

部分木サイズから重心を求め、分解木の親子を出力する。

### 分割統治

発動条件: 重心を通らない制約が除去後成分内で独立になる。

各成分を別問題として再帰し、その根を重心へ結ぶ。

## 問題固有の要素

求める木は元の辺を保つ必要がなく、元木上のパス条件だけを重心が媒介すればよい。

別の問題へ持ち帰る視点: 出力構成問題では、条件が分離するseparatorを新しい親子関係に使う。

## 正当性

一頂点の成分は自明に二条件を満たす。成分Sの重心cをRの根とし、T−cの各成分S_iの帰納的構成の根をcへつなぐ。新しい各子部分木はちょうどS_iで|S_i|≤|S|/2。内部の親子には帰納法が使えるので全親子の半減条件が成立する。

二頂点x,yについて、一方がcならRのLCAはcでTのpath端点にもある。異なるS_iへ属するならRのLCAはcで、Tのpathもcを通る。同じS_iならRのLCAはその再帰内部で決まり、Tの一意pathも連結なS_i内にあるため帰納法で条件が成立する。これらは全頂点対を覆う。各成分を一度だけ子としてつなぐので、全N頂点を含む一つの根付き木を構成する。

## 実装上の注意

- 重心探索時の一時的なDFS親と、出力する分解木の親を別配列にする。largestでは一時的な親側|S|−sub[v]も検査する。
- 削除flagにより現在成分だけを走査する。作業配列を毎回全N要素初期化せず、訪れた頂点だけ書き換える。
- 分解再帰はO(log N)だが、成分を調べる通常DFSはpath木でO(N)深さになる。stackと逆訪問順で実装すればcall stackに依存しない。
- N=1は親−1だけを出力する。

## 復習の核

- 分解木の子部分木と、分離点を除いた元木の成分の頂点集合を一致させる。
- LCAの条件は「一方が分離点・異なる成分・同じ成分」の三つで帰納する。
- 元の全合法出力を特徴付ける必要はない。条件を満たす十分な構成を作る。

## 計算量と制約

### 時間

O(N log(N+1))。サイズsの成分の重心探索はO(s)、同じ分解深さの成分は互いに素で合計サイズ≤N。子成分は半分以下なので深さO(log(N+1))。

### 空間

木、削除flag、分解親で O(N)、分解再帰深さ O(log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1\leq A_i,B_i \leq N; All values in the input are integers.; The given graph is a tree.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/editorial/5840) — source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/tasks/abc291_h) — source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d
