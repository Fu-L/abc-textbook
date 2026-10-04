---
title: "ABC287-F — Components"
draft: true
authoringUnit: {"problemId":"abc287-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc287-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-resource"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-knapsack-resource"],"sourceRevisionIds":["source-abc287-editorial-5632-36fff4af2ff56b09b2f6827fd12c787f4bba6f0510b282ceb2ed77f90a1d8eba","source-abc287-f-problem-e74e569b0d278aac06c0a9b4ffdd3abf77989fd2a435607ec62fd7f8ff6347f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"選択頂点の誘導グラフは森。親子の境界辺は一本で、両端選択時だけ二成分が結合するため新成分数は j+k−(b∧c)。頂点集合は各子の集合へ一意に分解でき、積で併合しても漏れ重複がない。根の二 bit 状態を合計すると成分別の全個数を得る。","sourceRevisionIds":["source-abc287-editorial-5632-36fff4af2ff56b09b2f6827fd12c787f4bba6f0510b282ceb2ed77f90a1d8eba","source-abc287-f-problem-e74e569b0d278aac06c0a9b4ffdd3abf77989fd2a435607ec62fd7f8ff6347f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。

## 考察

treeの頂点subsetが誘導するgraphはforestなので、連結成分数は選択頂点数−両端を選んだtree edge数で表せる。rooted subtreeをchildから結合するとき、親rootとchild rootを両方選んだ場合だけ、その間のedgeが2成分を1つへ繋いで成分数を1減らす。dp_v[j][b]をsubtree v内の選択で成分数j、vの選択状態bとすれば、親subtree外との接続可能性をbだけで保持できる。v単体の初期状態は未選択(j=0,b=0)と選択(j=1,b=1)が各1通りである。child状態(k,c)を結合した新成分数はj+k−(b∧c)となる。

採用する候補: 各subtreeについて成分数とsubtree rootの選択bitを持つtree knapsack DPを行う。

child結合時に境界edgeが成分をmergeするかをroot bitだけで判断でき、全component数を同時に数えられる。

棄却する候補: 全2^N個の頂点subsetを列挙し、誘導graphをDFSして成分数を数える。

N≤5000でsubset列挙は不可能である。

棄却する候補: connectedな誘導subgraphの個数だけを数え、複数componentの答えを積で作る。

異なるconnected subset同士の非隣接条件が依存し、独立な積には分解できない。

任意のrootでtreeを親子化しpostorderに処理する。各vをdp[0][0]=1,dp[1][1]=1で初期化し、child uごとに現在arrayとdp_uを全組合せで畳み込む。indexはj+k-(b&&c)、root選択bitはbのままとして加算する。全treeのrootでdp[x][0]+dp[x][1]をx=1..Nについて出力する。

## 典型の発動条件

### 境界状態付きtree DP

発動条件: subtreeを外へ接続する辺がrootにだけあり、結合結果がroot属性に依存するとき。

root選択bitを状態へ加えて親子edgeのmerge有無を判定する。

### 二乗tree knapsack

発動条件: 各subtreeのサイズまでの個数分布をchildごとに畳み込みたいとき。

処理済みsizeとchild sizeの範囲だけをloopする。

### forestのc=n-m

発動条件: treeの誘導subgraphでcomponent数を追うとき。

頂点選択で+1、選択済み両端のedgeで-1と更新する。

## 問題固有の要素

成分の形や代表点を保持せず、forestであることから成分数の増減を選択頂点と採用edgeだけで追える。

別の問題へ持ち帰る視点: acyclic構造上のcomponent-count DPでは、境界の接続bitとc=n-mで状態を大幅に削れる。

## 正当性

選択頂点の誘導グラフは森。親子の境界辺は一本で、両端選択時だけ二成分が結合するため新成分数は j+k−(b∧c)。頂点集合は各子の集合へ一意に分解でき、積で併合しても漏れ重複がない。根の二 bit 状態を合計すると成分別の全個数を得る。

## 実装上の注意

- 空subsetは成分数0の状態として遷移に必要だが、出力はx=1..Nだけなので含めない。
- childをmergeするたび有効index上限を処理済みsubtree sizeまで広げ、未初期化値との三重loopを避ける。
- 全加算をmod 998244353で行う。

## 復習の核

- 2頂点treeで4つの親子選択bitを結合し、両方選択時だけ成分数が2でなく1になることを確認してから3頂点へ拡張する。

## 計算量と制約

### 時間

N 頂点。子併合の状態対は全体 O(N²)。

### 空間

子配列を併合後解放すると O(N)。全頂点の完成配列を保存すると最悪 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5000; 1 \leq a_i \lt b_i \leq N; The given graph is a tree.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/editorial/5632) — source-abc287-editorial-5632-36fff4af2ff56b09b2f6827fd12c787f4bba6f0510b282ceb2ed77f90a1d8eba
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/tasks/abc287_f) — source-abc287-f-problem-e74e569b0d278aac06c0a9b4ffdd3abf77989fd2a435607ec62fd7f8ff6347f7
