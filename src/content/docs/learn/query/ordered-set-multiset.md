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

整数を追加・削除しながら、「この値以上で最小の要素」「今の最小値」「小さい方から一定個数の和」などを求めたい。毎回ソートすれば順序は分かるが、一要素しか変わらない更新に対して全体を並べ直すのは無駄が多い。

順序付き集合は、挿入・削除の後も比較順を保ち、必要な境界へ直接移動するための道具である。同じ値を複数個残す場合は多重集合を使う。この単元では、境界探索を出発点に、隣接対の局所更新と、二集合による順位の境界の維持へ進む。答えを速く得られる理由は、木構造の名前ではなく、何を集合へ入れ、どの不変条件を保つかから説明する。

### 習得する技能

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 毎回ソートする処理の、何を省きたいか

多重集合に $$(2,6,6,12)$$ があるとする。新しく8を入れても、2、二個の6、12の相対順は変わらない。探す必要があるのは8の入る位置であり、全要素の順序を再計算する必要はない。

平衡二分探索木は、各節点の左右に小さい値・大きい値を置き、高さを対数に保つことで、この位置探索と更新を高速に行う。典型的なインターフェースが、値 $$x$$ 以上の先頭を返す `lower_bound(x)` と、$$x$$ より大きい先頭を返す `upper_bound(x)` である。

| 操作 | $$(2,6,6,12)$$ での結果 |
| --- | --- |
| `lower_bound(6)` | 最初の6 |
| `upper_bound(6)` | 12 |
| `lower_bound(8)` | 12 |
| 最初の6の直前 | 2 |
| 二個目の6の直前 | 一個目の6 |

ここで「6より小さい最大値」と「ある一個の6の直前」は違う。値の条件の境界を求めるのか、実際の一要素の隣を求めるのかを分ける。

同じ値の個数が意味を持つなら、重複を一つへまとめる `set` では足りない。`multiset` を使うか、値と一意なIDの組を順序付き集合に入れる。C++で一個だけ削除するなら、見つけた要素のイテレータを `erase` へ渡す。値を直接渡すと同値要素を全部消すためである。

### 隣接関係を辺として考える

昇順に並ぶ値の間の差をすべて管理したいとする。$$(2,6,12)$$ では隣接差は4と6。ここへ8を入れると、6と12の間の差6が消え、差2と4が生まれる。2と6の間の差4は変わらない。

```text
値の列:  2 ── 6 ───── 12
                 ↓ 8を挿入
値の列:  2 ── 6 ─ 8 ─ 12
```

挿入位置の左右を $$l,r$$、隣接対の情報を $$f(l,r)$$ とすると、消すのは $$f(l,r)$$ 一個、足すのは $$f(l,x),f(x,r)$$ の各一個だけである。削除では逆に、対象に接する二本を消し、左右がそろっていればつなぎ直す。先頭・末尾なら存在する辺だけを扱う。

隣接差の最大値を求めるなら、元の値の多重集合に加え、各辺の差の多重集合を持つ。上の挿入後は候補が $$(2,4,4)$$ になる。もともと4があっても、新たに生じた4は別の辺なので一個追加する。一辺を消すときも一個だけ消す。元の要素数が $$n$$ なら、候補の個数は $$\max(n-1,0)$$ である。

同じ構造を隣接XORへ使うのが[ABC308 G](/problems/abc308-g/)である。ただし、全対の最小XORが隣接対から得られることは、別に最高相違ビットから証明する必要がある。「隣接情報を速く更新できる」と「隣接だけ見れば元の答えが出る」を混同しない。

答えが辺の情報の総和なら、候補の多重集合の代わりに一つの総和を持ち、消える分を引いて生まれる分を足せばよい。必要な取得操作に合わせて、補助情報の持ち方を選ぶ。

### 小さい側を丸ごと保存し、順位の境界だけ動かす

次に、小さい方から $$k$$ 個の和を毎回求めたいとする。順序付き集合でも、先頭から $$k$$ 個を毎回走査すると $$O(k)$$ かかる。そこで、その $$k$$ 個そのものを別の多重集合 $$L$$ に保存し、残りを $$R$$ に置く。さらに $$L$$ の和 $$s$$ を持つ。

全体の要素数を $$n$$ とし、次の三つを保つ。

$$
|L|=\min(k,n)
$$

$$
\max(L)\leq\min(R)\quad\text{（両方が非空なら）}
$$

$$
s=\sum_{x\in L}x
$$

個数が合い、すべての $$L$$ の値が $$R$$ の値以下なら、$$L$$ は小さい方の必要個数をちょうど含む。境界に同じ値がある場合は、どの一個を左へ置いても和は同じである。

$$k=2$$ として、集合 $$(2,5,5,11)$$ から追う。

| 段階 | $$L$$ | $$R$$ | $$s$$ |
| --- | --- | --- | ---: |
| 初め | $$(2,5)$$ | $$(5,11)$$ | 7 |
| 1をいったん左へ追加 | $$(1,2,5)$$ | $$(5,11)$$ | 8 |
| 左の最大5を右へ移動 | $$(1,2)$$ | $$(5,5,11)$$ | 3 |
| 左の2を削除 | $$(1)$$ | $$(5,5,11)$$ | 1 |
| 右の最小5を左へ移動 | $$(1,5)$$ | $$(5,11)$$ | 6 |

全体の順序を作り直す代わりに、必要な個数の境界をまたぐ一要素だけを動かしている。

空の二集合と和0から始める。一要素の追加では、$$L$$ が非空で追加値が $$\max(L)$$ 以下なら左へ、それ以外なら右へ入れる。削除では左にあれば一個消し、なければ右から一個消す。左の変更では和も同時に足し引きする。

その後、左が目標個数より多ければ左の最大を右へ、少なければ右の最小を左へ移す。移動のたびに $$s$$ を更新する。挿入時の振り分けで境界順は保たれ、削除も残る要素の順序を壊さないため、個数を直せば三条件を回復できる。

固定 $$k$$ で一要素を更新すると、個数のずれは高々1なので移動は定数回で済む。$$k=0$$ なら左は常に空で和0、$$k>n$$ なら全要素を左へ置く。同じ値が両集合にあっても、値だけを扱う問題では左の一個を削除してから補充してよい。特定の個体を区別する問題では、IDもキーに含めて所属を追う。

大きい $$k$$ 個の和は大小を反転して同じ考え方を使える。[ABC306 E](/problems/abc306-e/)では上位側の和を更新し、[ABC281 E](/problems/abc281-e/)では移動窓から出る一個の削除と入る一個の追加を組み合わせる。

### 求める情報から道具を選ぶ

最小値を取り出すだけなら優先度付きキューも候補になる。任意の値の削除や、ある値の前後を直接求めたいときに、順序付き集合が役立つ。更新がなく全質問も分かっていれば、ソートと走査の方が簡単なこともある。

標準の `set`・`multiset` は、値による境界探索をしてくれるが、任意の順位へ直接飛ぶ機能は持たない。必要なのが固定個数の境界なら二集合、任意の順位や値域内の個数・総和なら、座標圧縮とFenwick Treeなどを検討する。`lower_bound` の結果まで `distance` で数えると、木のイテレータでは線形時間になる点に注意する。

## 成立条件と計算量

比較規則が処理中に変わらず、要素どうしに一貫した順序を与えられることが前提である。外部の可変値を比較関数から参照し、集合へ入れたまま順序を変えてはいけない。値を更新する場合は旧要素を削除して新要素を挿入する。

平衡木で要素数を $$n$$ とすると、挿入、値の探索、値を探して一個削除する処理は各 $$O(\log n)$$ 時間、保存領域は $$O(n)$$。最小・最大を保持する標準的な実装では端の取得は定数時間である。空集合や、先頭の前・末尾の後は参照できない。該当する境界がない場合の戻り値も確認する。

隣接候補の維持では一更新あたり定数本、固定 $$k$$ の二集合では定数回の境界移動しか起きないので、いずれも一更新は $$O(\log n)$$、答えの取得は $$O(1)$$。全 $$Q$$ 更新で要素数が高々 $$Q$$ なら、全体で $$O(Q\log Q)$$ 時間・$$O(Q)$$ 空間となる。$$k$$ 自体を一度に大きく変える場合は、移動個数も評価へ加える。

和には要素の絶対値と個数の積を格納できる整数幅を使う。単独の値が32 bitに収まっても、和まで収まるとは限らない。復習では、求めたい境界、保つ個数、保存する集約値の三つを言葉で定義してから、更新の前後でそれらが保たれるかを追う。

## 前提と範囲

概念上の親: [heap・ordered setで全候補の極値を保つ](/learn/query/ordered-set-heap/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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
