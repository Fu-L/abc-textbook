---
title: "ordered set・multisetの動的順序管理"
description: "「ordered set・multisetの動的順序管理」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 34
---

# ordered set・multisetの動的順序管理

習得対象の目安: **緑色（800–1199）**。前後要素・重複を管理し、二集合に分けて境界と集計値を保つ基本操作を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### ordered set・multisetの動的順序管理

値の挿入・削除のたびにソートし直さず、現在の最小値や、ある値の直前・直後を知りたい。このような問いでは、比較順を保って値を管理する順序付き集合を使う。同じ値を複数個残す必要があれば、順序付き多重集合を使う。

基本操作を覚えた後は、問いに合わせて何を集合へ入れるかを考える。元の値だけで足りる場合もあれば、隣接対の候補値を別集合へ置く場合、小さい側と大きい側の二集合へ分ける場合もある。集合は順序を保つ道具であり、答えを取り出せる理由はそれぞれの不変条件で説明する。

### 習得する技能

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 境界を探し、必要なら前後の一個を読む

順序付き集合の実装には、挿入・削除で木の高さが偏らないようにした平衡二分探索木を使える。値 $$x$$ 以上の最初の要素を `lower_bound(x)` で探すと、その一つ前が $$x$$ 未満の最大値になる。$$x$$ より大きい最初の要素なら `upper_bound(x)` を使う。

例えば多重集合 $$(1,4,4,9)$$ で、`lower_bound(4)` は最初の4、その直前は1、`upper_bound(4)` は9である。「値4より小さい要素」と「選んだ4の要素の直前」は違う。二つ目の4の直前は、もう一つの4である。隣接関係を更新するときは、値の境界ではなく、実際に挿入・削除する一要素の位置を基準にする。

重複を区別せず消す集合では、4を二個保持できない。多重集合を使うか、値と一意なIDの組にして別要素として管理する。C++の `multiset` なら、値を渡す `erase(value)` は同値要素をすべて消す。一個だけなら `find` で得たイテレータを `erase` へ渡す。削除対象の左右を参照する場合は、消す前に調べる。

### 隣接対の候補を、もう一つの多重集合で保つ

昇順の値が $$(0,2,3)$$ で、隣接XORを候補にすると、多重集合には $$(1,2)$$ が入る。ここへ1を挿入すると、旧対 $$(0,2)$$ は消え、$$(0,1),(1,2)$$ が生まれる。残った対 $$(2,3)$$ と合わせて、候補は $$(1,1,3)$$ になる。

一般に隣接対 $$(p,s)$$ の間へ $$x$$ を入れると、$$f(p,s)$$ を一個消し、$$f(p,x),f(x,s)$$ を加えればよい。削除はその逆である。先頭や末尾なら、存在する隣の分だけ処理する。更新対象が定数個の対に限られるので、他の候補を調べ直さずに済む。

候補の最小値が「全対の最小値」と一致するには、別の証明が要る。ABC308 Gでは、非隣接対は中間の値を使ってXORを改善できる、と最高相違ビットから示す。単にデータ構造へ隣接対を入れただけでは、その削減は正当化されない。

元の値がすべて異なっていても、候補の1は複数個になり得る。1を含む対を一つ削除したとき、他の対の1まで消さない。元集合と候補集合の多重度を独立に保ち、元が $$n$$ 要素なら隣接候補が $$\max(n-1,0)$$ 個になることを確認できる。

### 二集合で小さいk個の和を持つ

小さい $$k$$ 個の和を毎回求めるために、先頭から $$k$$ 個を走査していては一回 $$O(k)$$ 時間かかる。そこで、小さい側を多重集合 $$A$$、残りを $$B$$ に分け、$$A$$ の和 $$s_A$$ も持つ。全要素数を $$n$$ として、次を不変条件にする。

$$
|A|=\min(k,n),\qquad
\max(A)\leq\min(B)\ \text{（両方が非空のとき）},\qquad
s_A=\sum_{x\in A}x
$$

この個数と境界順を満たせば、$$A$$ がちょうど小さい側であり、答えは $$s_A$$ となる。同値の要素をどちらへ置いても、値の和は変わらない。最初は両集合が空で、和は0である。

挿入値 $$x$$ は、$$A$$ が非空かつ $$x\leq\max(A)$$ なら $$A$$ へ入れて和に足し、それ以外は $$B$$ へ入れる。削除は $$A$$ にあれば一個消して和から引き、なければ $$B$$ から一個消す。値だけが重要なら同値要素のどれを消してもよいが、IDが意味を持つ場合は値とIDの組で所属を識別する。

その後、$$A$$ が大き過ぎれば最大要素を $$B$$ へ移し、和から引く。小さ過ぎれば $$B$$ の最小要素を $$A$$ へ移し、和に足す。上の挿入分類と削除は境界順を保つので、サイズを直せば不変条件を回復できる。

$$k=2$$ の独自例を追う。

| 操作後 | $$A$$：小さい二個 | $$B$$：残り | 和 $$s_A$$ |
| --- | --- | --- | --- |
| $$(1,1,5,9)$$ を保持 | $$(1,1)$$ | $$(5,9)$$ | 2 |
| 0を挿入 | $$(0,1)$$ | $$(1,5,9)$$ | 1 |
| 0を削除 | $$(1,1)$$ | $$(5,9)$$ | 2 |

0の挿入では、一旦 $$A=(0,1,1)$$ とした後、最大の1を一個だけ $$B$$ へ移す。0の削除では、残った $$A=(1)$$ へ $$B$$ の最小の1を戻す。サイズ調整のたびに動くのは境界の要素なので、大小関係も保てる。

別の挿入分類を使い、境界順が壊れ得る場合は、$$\max(A)>\min(B)$$ の間に両端を交換し、和へ $$\min(B)-\max(A)$$ を加える処理も必要になる。何となく二集合へ振り分けるのではなく、個数・境界順・和の三つを更新する。

## 成立条件と計算量

要素数を $$n$$ とすると、挿入・値の探索・値を探して一個削除する操作は $$O(\log n)$$。保持領域は $$O(n)$$ である。標準的な平衡木の最小・最大の取得や、既知の位置から隣へ進む操作は、全体を走査せずに行える。先頭の前や末尾の後、空集合の極値は参照しない。

隣接候補を別集合に持つ方法は、一回の挿入・削除につき定数本の対を更新するので $$O(\log n)$$。固定 $$k$$ の二集合では、一要素の変更で目標サイズも高々1しか変わらず、境界の移動は定数回で $$O(\log n)$$、和の取得は $$O(1)$$ となる。全 $$Q$$ 操作の要素数が高々 $$Q$$ なら、これらは全体 $$O(Q\log Q)$$ 時間、$$O(Q)$$ 空間に収まる。

$$k=0$$ では $$A$$ は空、$$k\geq n$$ では $$B$$ が空である。$$k$$ を一度に大きく変えるなら、動かす要素数に比例する費用が必要になる。任意の順位や $$k$$ 番目を頻繁に問う場合、通常の `set`・`multiset` には順位を数える情報がないため、部分木サイズ付きの木や[頻度を持つFenwick Tree](/learn/query/weighted-prefix-fenwick/)などを検討する。

概念上の親: [heap・ordered setで全候補の極値を保つ](/learn/query/ordered-set-heap/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)。

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC330 E「Mex and Update」](https://atcoder.jp/contests/abc330/tasks/abc330_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC306 E「Best Performances」](https://atcoder.jp/contests/abc306/tasks/abc306_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC308 G「Minimum Xor Pair Query」](https://atcoder.jp/contests/abc308/tasks/abc308_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 G「Game on Tree 2」](https://atcoder.jp/contests/abc218/tasks/abc218_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)（隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g) — 主題: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC418 F「We're teapots」](https://atcoder.jp/contests/abc418/tasks/abc418_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC308 G 公式問題文](https://atcoder.jp/contests/abc308/tasks/abc308_g)
- [ABC308 G 公式解説](https://atcoder.jp/contests/abc308/editorial/6707)

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC245 E 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC245 E 公式解説](https://atcoder.jp/contests/abc245/editorial/3635)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-ordered-set-multiset`
