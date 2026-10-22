---
title: "尺取り法・sliding windowで連続区間を走査する"
description: "「尺取り法・sliding windowで連続区間を走査する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 10
---

# 尺取り法・sliding windowで連続区間を走査する

習得対象の目安: **緑色（800–1199）**。窓の条件とpointerが戻らない理由を定め、全体の走査回数を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 尺取り法・sliding window

連続区間の左端を一つ進めたとき、必要な右端も前へ進むだけなら、毎回最初から探し直す必要はない。二つの端点と区間内の情報を保ち、全体を一走査で調べるのが尺取り法である。二列の圧縮された区間を同じ位置で照合する走査も、この単元で扱う。

### 習得する技能

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

## 考え方

### 縮めても合法なら、最大の右端を追う

配列を0始まりの $$A_0,\ldots,A_{N-1}$$ とし、窓を半開区間 $$[L,R)$$ で表す。入っているのは $$A_L,\ldots,A_{R-1}$$ で、$$R$$ は次に追加する位置、$$L=R$$ は空窓である。

正数列 $$A=(2,1,3,2)$$ で、和が4以下の最長区間を探そう。最初は $$L=R=0$$、和0である。2と1を加えると $$[0,2)$$、和3になるが、次の3を加えると6なので止める。その後は左の要素を除き、再び右へ広げる。

| 左端 $$L$$ | 左の要素を除いた直後の窓と和 | 拡張後の最大窓と和 | 止まる理由 |
| --- | --- | --- | --- |
| 0 | 空、0 | $$[0,2)$$、3 | 次の3を加えると6 |
| 1 | $$[1,2)$$、1 | $$[1,3)$$、4 | 次の2を加えると6 |
| 2 | $$[2,3)$$、3 | $$[2,3)$$、3 | 次の2を加えると5 |
| 3 | 空、0 | $$[3,4)$$、2 | 配列の末尾 |

各左端の長さ $$R-L$$ の最大値は2となる。正数の和なので、右へ広げると和は増え、縮めると減る。一つ追加して上限を超えたら、その先まで広げても合法には戻らない。

一般にも、**合法な区間のどの部分区間も合法**なら、この手順で各左端の最大右端を求められる。前の最大窓から左端を一つ除いた窓も合法なので、次の最大右端は前の右端より左には来ない。この不変条件が、右端を戻さずによい理由である。

実装では、$$R<N$$ かつ $$A_R$$ を追加しても合法な間だけ、集計値へ追加して $$R$$ を進める。窓を評価した後、非空なら $$A_L$$ を削除して $$L$$ を進める。一要素も追加できなければ $$R=L$$ の空窓のままなので、存在しない $$A_L$$ を削除しない。$$L,R$$ をともに次の位置へ進め、集計値は空の状態に保つ。例えば上限4で要素が7なら、この処理が必要になる。非空区間を求める問題では、空窓を長さ0の解として採用するか、解なしとして扱うかも区別する。

### 広げても合法なら、最小の右端を追う

同じ正数列で、今度は「和が4以上になる最短区間」を探す。これは広げるほど条件を満たしやすいので、初めて和が4以上になったところで止める。

- $$L=0$$ では、和は2、3、6と増える。最小右端は $$R=3$$、窓は $$[0,3)$$ である。
- 左の2を除くと $$[1,3)$$ の和は4なので、$$L=1$$ でも $$R=3$$ のままでよい。
- 左の1を除くと和3になる。次の2を追加して、$$L=2$$ の最小窓は $$[2,4)$$、和5となる。
- 左の3を除くと和2で、もう追加できない。$$L=3$$ では条件を満たす右端がない。

各左端で条件を満たした窓の長さを比較すると、最短長は2である。最大右端を探す場合と違い、**窓が不成立の間に広げ、成立したら止める**。末尾まで広げても不成立なら、その窓は答えに使わない。

手順は空窓と空の集計値から始め、各左端で条件成立まで追加し、成立した窓を評価してから左の要素を除く。空窓も条件を満たす設定では、長さ0を答えとして許すかを先に決める。空窓からは要素を削除せず、次の左端と同じ位置へ右端も合わせる。

一般に、**合法な区間を含む大きな区間も合法**なら、最小右端は後退しない。前の最小右端より手前で切った区間はすべて不成立だった。その左端を除いて縮めても、成立することはない。もし縮めた区間が合法なら、それを含む元の区間も合法になってしまうからである。左端の削除後も成立していればその右端が最小で、崩れた場合だけ拡張を再開すればよい。末尾まで不成立なら、以後の左端でも成立しない。

ABC260 Eの「すべての組の少なくとも一端を含む」はこの型である。各組の被覆回数と、被覆済みの組数を保ち、全組を覆うまで広げる。ABC258 Eの「重量が閾値以上になる」も最小右端の型である。円環では列を二周分並べ、大きな閾値は完全周回分と余りへ分けて、残りの端点移動を線形に抑える。余り0なら追加区間は空で、窓から要素を削除する必要もない。

ABC250 Fも、凸多角形の切片面積が目標以上になる最初の右端を追う。ただし求めるのは最短長ではなく目標との面積差なので、目標を跨ぐ前後の候補を比較する。各問題の解説では、その問題が半開区間か両端を含む区間かも確認しよう。

### 負数を含む和では境界が一つにならない

和の上限4に対して $$A=(3,3,-3)$$ を考える。左端0からの和は3、6、3であり、合法・不合法・合法と変わる。上限を超えた時点で打ち切ると、長さ3の合法区間を見逃す。左端を除いても負数なら和が増えるため、縮小で合法性を保つ議論も使えない。

負数を含む配列がすべて尺取りに不向きなのではなく、**今回追いたい条件が、区間の伸縮に対してどちら向きに保存されるか**を証明する必要がある。条件名が「区間和」だからという理由だけで、同じ手順を転用しない。

### RLEは、二列の値の組が一定な区間をマージする

連長圧縮（RLE）は、同じ値が連続する部分を「値と長さ」の組で持つ表現である。一つの連続部分をrunと呼ぶ。ABC294 Eでは、二列を展開せず、同じ位置の値が等しい長さを数えたい。

例えば一列目が $$(1,3),(2,2)$$、二列目が $$(1,1),(2,4)$$ なら、最初の1位置は値の組が $$(1,1)$$、次の2位置は $$(1,2)$$、最後の2位置は $$(2,2)$$ である。等しい位置は合計3個となる。変化が起きるのは、どちらかのrunが終わる位置だけである。

両列の未処理部分が同じ位置から始まるようにし、現在runの残長を $$p,q$$ とする。$$\min(p,q)$$ だけ処理し、値が等しければその長さを答えへ加える。両残長から処理長を引き、0になった側だけ次のrunへ進む。同時に0なら両方を進める。

これは、二列のrun境界をマージして「値の組が一定な区間」へ分割する操作である。合法窓の最大・最小右端を探す処理とは目的が異なるが、各ポインタを戻さず、少なくとも片方を前へ進めることで全体の費用を抑える点が共通している。

## 成立条件と計算量

長さ $$N$$ の一列を走査すると、両端はそれぞれ高々 $$N$$ 回進む。追加・削除・条件確認・窓の評価が一回 $$T$$ で行えるなら時間は $$O(NT)$$、和のように $$T=O(1)$$ なら $$O(N)$$ である。二周配列でも端点移動は $$O(N)$$。ただし各更新で集合やFenwick Treeを使うなら、その費用を掛ける。ABC260 Eのように一座標の追加で複数の組を更新する場合は、一更新を定数時間とせず、全座標に属する組の出現数を合計して評価する。

RLEのrun数をそれぞれ $$N_1,N_2$$ とすると、各回で少なくとも一runが終わるため時間は $$O(N_1+N_2)$$。展開後の長さには比例しない。入力を保存する空間は一列なら $$O(N)$$、RLEなら $$O(N_1+N_2)$$ で、和や現在runの残長だけなら走査用の追加空間は $$O(1)$$。頻度表などを使うときはその領域も加える。

二つの端点を使うという形よりも、保持する集計値、合法性が保存される向き、右端が後退しない証明を先に確認する。単調探索で各左端の境界を個別に二分探索する代わりに、隣の左端の探索結果を再利用できるか、という視点も持っておこう。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

### このUnitでは扱わないもの

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 問題一覧

- [ABC294 E「2xN Grid」](https://atcoder.jp/contests/abc294/tasks/abc294_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC260 E「At Least One」](https://atcoder.jp/contests/abc260/tasks/abc260_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC337 F「Usual Color Ball Problems」](https://atcoder.jp/contests/abc337/tasks/abc337_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC250 F 公式解説](https://atcoder.jp/contests/abc250/editorial/3928)
- [ABC250 F 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC258 E 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 E 公式解説](https://atcoder.jp/contests/abc258/editorial/4215)
- [ABC260 E 公式問題文](https://atcoder.jp/contests/abc260/tasks/abc260_e)
- [ABC260 E 公式解説](https://atcoder.jp/contests/abc260/editorial/4458)
- [ABC294 E 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_e)
- [ABC294 E 公式解説](https://atcoder.jp/contests/abc294/editorial/5990)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-two-pointers-window`
