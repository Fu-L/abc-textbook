---
title: "ABC453-G — Copy Query"
draft: true
authoringUnit: {"problemId":"abc453-g","docPath":"src/content/docs/problems/data-structures/outcome-persist-data-structure-versions/outcome-persist-data-structure-versions-shard-001/abc453-g.md","learningOutcomeIds":["outcome-persist-data-structure-versions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-persistence","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a","source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"初期のN本は同じ全0配列なので、一つの全0の木を全rootで共有して正しい。コピーは指定先rootをコピー元rootへ向け、その時点の全M要素を共有する。一点代入では対象位置を含む経路だけを複製し、新しい葉と祖先の和を作り直す。共有nodeに書き込まないので他配列の版は不変で、新rootは指定位置以外の全値を旧版と共有する。各版の指定区間[L−1,R)を互いに素な木区間へ分解して和を取れば、タイプ3の区間和を得る。木の深さと新規node数は配列数Nではなく長さMによって決まる。","sourceRevisionIds":["source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a","source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [永続data structure・structural sharing](src/content/docs/learn/query/persistence.md)

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

入力にはN本の配列があり、一つの配列の長さはMである。配列番号X,Yは1,…,N、配列内の位置や照会端は1,…,Mを動く。この二つの座標を分けると、木が分割する対象は[0,M)、版を選ぶroots配列の長さはNだと分かる。

タイプ1のコピーでM要素を毎回複製するとO(MQ)、初期木をN本個別に作るとO(NM)になる。初期値は全配列で全て0なので、区間和を持つ全0の木を一つだけO(M)で構築し、N個のrootsを同じ初期rootへ向ける。共有を解く必要があるのは、ある配列の一点を更新するときだけである。

nodeは(sum,left,right)を持ち、一度作ったnodeへ書き込まない。set(old,l,r,p,z)ではoldを一個コピーしてnewを作る。葉ならnew.sum=zとし、内部ならpを含む子だけを再帰更新し、他方の子pointerはoldから引き継ぐ。new.sumを二子の和にしてnewを返す。根から葉までO(1+log M)個を新規作成すれば、旧版と未変更の部分木を共有できる。

0-indexに変換した操作は次のとおりである。

- タイプ1: roots[X−1]=roots[Y−1]。コピー後も両方は同じ版を読む。
- タイプ2: roots[X−1]=set(roots[X−1],0,M,Y−1,Z)。代入更新なので旧値へZを足さない。
- タイプ3: roots[X−1]からprod(L−1,R)の区間和を返す。非交差は0、全被覆はnode.sum、部分被覆は二子の照会結果の和。

例えばコピー直後にXだけを更新しても、roots[Y−1]の下にあるnodeは一つも変更しないためYの値は保たれる。N=1,Mが大きい場合にも木の深さはMに依存する。コピーのたび新しいroot用のnodeを作る必要はなく、更新U回だけがnode poolを増やす。

## 典型の発動条件

### 永続 segment tree

発動条件: 配列版のcopy・一点更新・区間集約を混在させ、copy後の独立更新が必要なとき。

root共有とpath copyingで各版を保持する。

## 問題固有の要素

copy対象を値列ではなくversion rootとして持つと、copy-on-writeが木の構造共有だけで実現できる。

別の問題へ持ち帰る視点: 更新箇所までのpath以外が不変なdata structureは、永続化で履歴・分岐版を安価に扱える。

## 正当性

初期のN本は同じ全0配列なので、一つの全0の木を全rootで共有して正しい。コピーは指定先rootをコピー元rootへ向け、その時点の全M要素を共有する。一点代入では対象位置を含む経路だけを複製し、新しい葉と祖先の和を作り直す。共有nodeに書き込まないので他配列の版は不変で、新rootは指定位置以外の全値を旧版と共有する。各版の指定区間[L−1,R)を互いに素な木区間へ分解して和を取れば、タイプ3の区間和を得る。木の深さと新規node数は配列数Nではなく長さMによって決まる。

## 実装上の注意

- 配列番号を減らす箇所と位置を減らす箇所を分ける。root配列はN個、木の対象位置はM個。
- 通常の二分木なら初期node数は2M−1。更新U回を含むpoolの上界は2M−1+U(⌈log₂M⌉+1)個で、M=1の葉更新も一個を作る。
- node poolがvectorなら再確保で参照が無効になり得るため、子を整数indexで保存するか、容量を確保する。sumは最大M·10^9なので64bit整数。
- rootを共有した後の片側更新と、X=Yのコピーを確認する。

## 復習の核

- 「版を選ぶ番号」と「一版の中の位置」を区別し、木の深さ・初期構築・node poolをその位置数から数える。
- 同一初期状態を一度作り、未変更部分を共有する。コピーの高速化だけでなく初期化にも構造共有を使う。

## 計算量と制約

### 時間

初期化O(N+M)、コピー一回O(1)、一点代入・区間和各O(1+log M)。全Q操作でO(N+M+Q(1+log M))。

### 空間

O(N+M+U(1+log M))、Uは一点更新数。N個のrootと一つの初期木を保持し、更新経路だけを追加する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M \le 2 \times 10^5; 1 \le Q \le 2 \times 10^5; Type 1 queries satisfy the following constraints: 1 \le X_i,Y_i \le N; 1 \le X_i,Y_i \le N; Type 2 queries satisfy the following constraints: 1 \le X_i \le N 1 \le Y_i \le M 0 \le Z_i \le 10^9; 1 \le X_i \le N; 1 \le Y_i \le M; 0 \le Z_i \le 10^9; Type 3 queries satisfy the following constraints: 1 \le X_i \le N 1 \le L_i \le R_i \le M; 1 \le X_i \le N; 1 \le L_i \le R_i \le M; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/editorial/18526) — source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/tasks/abc453_g) — source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc
