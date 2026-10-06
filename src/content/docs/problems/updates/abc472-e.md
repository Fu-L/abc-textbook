---
title: "ABC472 E — Odd Cycle"
draft: true
authoringUnit: {"problemId":"abc472-e","docPath":"src/content/docs/problems/updates/abc472-e.md","learningOutcomeIds":["outcome-color-and-classify-bipartite-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-bipartite-structure"],"sourceRevisionIds":["source-abc472-e-problem-05eb35bf6478e538a0151656909bf6d93fcc8b853f404ef33ad9a9948d4573ae","source-abc472-editorial-24429-139e78bd1bf32ab8c9e2407ccb00b319412ae992acd7db2923d54a00f91a71ec"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"木上のパスは単純であり、同色端点間の辺数は偶数。非木辺を一つ加えると単純な奇閉路になる。衝突辺がない場合は全辺が二部彩色を保存するため、元の色に戻る閉路の長さは偶数で、奇閉路の不在も証明できる。","sourceRevisionIds":["source-abc472-e-problem-05eb35bf6478e538a0151656909bf6d93fcc8b853f404ef33ad9a9948d4573ae","source-abc472-editorial-24429-139e78bd1bf32ab8c9e2407ccb00b319412ae992acd7db2923d54a00f91a71ec"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)

- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

## 考察

奇閉路の探索は全閉路列挙でなく、二部彩色の失敗を証拠にする。DFSまたはBFSで一つの全域木を作り、根からの深さの偶奇を色とする。全辺を調べ、同色を結ぶ辺(u,v)が見つかれば、木上のu-vパスにこの辺を足す。

同色なので木上の距離は偶数、追加辺で辺数が奇数になる。復元には親と深さを記録しておく。深い方から親へ上がって深さをそろえ、両端を同時に上げて共通祖先へ達する。u側の列と、v側の列を逆にしたものを連結すれば、重複しないパス頂点列になる。共通祖先は一度だけ含める。

全ての辺が異色を結ぶなら、どの閉路も一歩ごとに色が交互になるので奇閉路はない。復元する閉路は一つだけだから、LCA前処理を追加する必要はない。長い鎖では再帰DFSがスタック上限に達するので反復走査を使える。

## 典型の発動条件

制約の矛盾を単にNoとせず、探索木のパスと衝突辺から証明書を復元する。二部彩色と奇閉路の同値性を使う。

## 問題固有の要素

必要なのは一つの奇閉路なので、親上りの線形復元で十分。

## 正当性

木上のパスは単純であり、同色端点間の辺数は偶数。非木辺を一つ加えると単純な奇閉路になる。衝突辺がない場合は全辺が二部彩色を保存するため、元の色に戻る閉路の長さは偶数で、奇閉路の不在も証明できる。

## 実装上の注意

閉路出力の末尾に始点を重複させない。単純グラフなので衝突辺から長さ1,2の閉路は生じない。

## 復習の核

判定アルゴリズムの失敗位置には、答えの証拠を構成する情報が残る。

## 計算量と制約

### 時間

全域木と辺検査 O(N+M)、一回のパス復元 O(N)。全テストの総和も線形。

### 空間

グラフ・親・深さ O(N+M)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 2\times10^5; 1 \le N, M \le 2\times10^5; The sum of N over all test cases is at most 2\times10^5.; The sum of M over all test cases is at most 2\times10^5.; 1 \le a_i,b_i \le N; a_i\ne b_i; The given graph is a simple connected undirected graph.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc472/tasks/abc472_e)
- [公式解説](https://atcoder.jp/contests/abc472/editorial/24429)
