---
title: "ABC220-E — Distance on Large Perfect Binary Tree"
draft: true
authoringUnit: {"problemId":"abc220-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc220-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-implicit-binary-tree","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-implicit-binary-tree-arithmetic","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc220-e-problem-66c6b2866e62c6df8bb0a46f0eb92adf42dca9e61996008817ce7c16e797911f","source-abc220-editorial-2679-d998641315051a650c1186e20c01322b5ec0524a266fda2c39d83c2a5535e9c7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"残り高さ H=N-1-d に対し、0<k<D の有効範囲は max(1,D-H)≤k≤min(D-1,H) という一つの整数区間になる。 有効な内部 split 一つにつき、左右の向きを含む順序付き対は 2^{D-1} 個であり、片端が LCA の場合は k=0,D を別々に数える。 完全二分木の対称性により個々の頂点を消し、さらに有効な距離分割 k が連続区間になるため、その個数も端点だけで求められる。","sourceRevisionIds":["source-abc220-e-problem-66c6b2866e62c6df8bb0a46f0eb92adf42dca9e61996008817ce7c16e797911f","source-abc220-editorial-2679-d998641315051a650c1186e20c01322b5ec0524a266fda2c39d83c2a5535e9c7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [対称性・深さ・label区間で巨大な完全二分木を数える](src/content/docs/learn/tree/implicit-binary-tree.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

頂点数は 2^N-1 なので頂点を生成できないが、同じ深さの頂点は残りの部分木高さも子孫数も全て等しい。深さ d の頂点数自体も 2^d と式で扱える。

順序付き対 (i,j) を LCA v で一意に分類し、v から両端までの距離を k と D-k に分けると、両端が部分木の高さ内に収まるかと、最初の辺が左右別になるかだけで個数が決まる。

採用する候補: 二端点のpathが最初に合流する頂点の深さごとに、片端が合流点の場合と両端が左右の子部分木にある場合を式で数え、同深さの頂点数を掛ける。

棄却する候補: 2^N-1 頂点の木を構築し、各頂点から距離 D の頂点を探索する。

N は 10^6 で、木の頂点数そのものが指数的なため入力上の構造を展開できない。

2 の冪を法 998244353 で前計算する。各深さ d で H=N-1-d とし、D≤H なら片端が LCA の 2×2^D を加え、内部 split 区間の長さに 2^{D-1} を掛けて加える。その一頂点分へ 2^d を掛け、全深さを合計する。

## 典型の発動条件

### 完全二分木の距離分割

発動条件: 暗黙の完全二分木で距離を固定した頂点対を数えるとき。

二端点のpathが最初に合流する深さと、そこから両端への距離分割で各対を一意に分類する。

### 対称構造の深さ集約

発動条件: 完全木などで、頂点に依存する量が深さだけで決まるとき。

一頂点分の数を深さから求め、その深さの頂点数を掛けて明示的な木を消す。

## 問題固有の要素

距離 split k を一つずつ調べる必要もなく、高さ制約二つの共通部分が整数区間なので、内部 split 数を区間長だけで集約できる。

別の問題へ持ち帰る視点: 対称な木の path 数え上げで深さ二条件が現れたら、自由変数の可動域が連続区間にならないかを確認する。

## 正当性

残り高さ H=N-1-d に対し、0<k<D の有効範囲は max(1,D-H)≤k≤min(D-1,H) という一つの整数区間になる。 有効な内部 split 一つにつき、左右の向きを含む順序付き対は 2^{D-1} 個であり、片端が LCA の場合は k=0,D を別々に数える。 完全二分木の対称性により個々の頂点を消し、さらに有効な距離分割 k が連続区間になるため、その個数も端点だけで求められる。

## 実装上の注意

- 問題の pair は順序付きなので左右反転と k=0,D の両方を落とさない。内部区間が空なら0とし、D=1 のとき 2^{D-1} を使う項が発生しない境界も分ける。

## 復習の核

- N=3,D=2 で LCA が根の10対と深さ1の各2対を分け、サンプルの14対へ一致させて向きの係数を確認する。

## 計算量と制約

### 時間

O(N+D)、2冪前計算とN深さのclosed form。

### 空間

O(N+D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^6; 1 \leq D \leq 2\times 10^6; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/tasks/abc220_e) — source-abc220-e-problem-66c6b2866e62c6df8bb0a46f0eb92adf42dca9e61996008817ce7c16e797911f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/editorial/2679) — source-abc220-editorial-2679-d998641315051a650c1186e20c01322b5ec0524a266fda2c39d83c2a5535e9c7
