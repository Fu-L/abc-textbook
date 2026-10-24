---
title: "結合的な区間要約・区間分解・合成"
description: "「結合的な区間要約・区間分解・合成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 38
---

# 結合的な区間要約・区間分解・合成

導入対象の目安: **水色（1200–1599）**。結合則・単位元・順序を区間集約の共通言語として使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

列の一部を毎回走査する代わりに、短い区間の結果を組み合わせて答えを作りたい。そのために、**区間を分けても、元の順序で結合すれば同じ結果になる**という性質を使う。ここではSegment Treeを通して、区間の分解と順序を保つ結合を学ぶ。何を要約すれば答えを作れるかの設計は、子単元の[区間monoid要約](/learn/query/range-monoid-aggregation/)で扱う。

## 考え方

### 括る位置を変えても、並び順は変えない

隣り合う区間の要約を結合する演算を $$\otimes$$ とする。結合結果も同じ種類の要約になり、任意の要約 $$x,y,z$$ について

$$
(x\otimes y)\otimes z=x\otimes(y\otimes z)
$$

が成り立つことを**結合則**という。これにより、左から一つずつ結合する代わりに、いくつかのまとまりを先に作って結合できる。また、左右のどちらにつないでも相手を変えない要約 $$e$$、すなわち $$e\otimes x=x\otimes e=x$$ を**単位元**という。区間集約では空区間の要約に対応する。結合則と単位元を備えたこの仕組みをmonoid（モノイド）、列を元の順に結合して一つの値にする操作をfold（畳み込み）という。結合結果を区間積とも呼ぶ。

例えば文字列連結なら、`a` と `bc` をつなげても、`ab` と `c` をつなげても `abc` になる。単位元は空文字列 `""` である。一方、`ab` と `cd` の順序を逆にすると `cdab` になってしまう。**結合則で変えられるのは括る位置だけ**であり、左右を交換できる可換性とは別の性質である。

### 二分した区間の結果を保存する

列の長さを $$N\geq 1$$、要素を0始まりで $$a_0,\ldots,a_{N-1}$$ とする。全区間の結果を保存すると個数が二次的に増えるので、まず全体を半分ずつに分けた木の区間だけを保存する。これがSegment Treeである。

葉数を $$N$$ 以上の最小の2冪 $$P$$ に広げ、根の添字を1とする配列 `tree` を使う。葉 `tree[P+i]` には $$a_i$$ の要約を置く。余った葉には単位元を置く。この埋め草をpaddingという。内部節点 $$v$$ は、左の子を先にして次のように作る。

$$
\mathrm{tree}[v]=\mathrm{tree}[2v]\otimes\mathrm{tree}[2v+1]
$$

葉に近い節点から計算すれば、各節点は担当区間を元順に結合した要約を持つ。一点の値を変更したときは、その葉を置き換え、親から根へ順に再計算する。変更位置を含む区間だけが変わるので、他の節点を触る必要はない。

順序を見るため、長さ7の列 `a, b, c, d, e, f, g` を文字列連結で扱ってみよう。以下は**非実行の模型**であり、実際に文字列を保存して高速化する実装例ではない。このとき $$P=8$$ で、葉とそのすぐ上の要約は次のようになる。

| 担当区間 | 葉の値 | 親の要約 |
| --- | --- | --- |
| $$[0,2)$$ | `a`, `b` | `tree[4] = ab` |
| $$[2,4)$$ | `c`, `d` | `tree[5] = cd` |
| $$[4,6)$$ | `e`, `f` | `tree[6] = ef` |
| $$[6,8)$$ | `g`, `""` | `tree[7] = g` |

ここで $$[l,r)$$ は位置 $$l$$ 以上、$$r$$ 未満の半開区間を表す。最後の葉の空文字列がpaddingである。さらに結合すると左半分は `abcd`、右半分は `efg`、根は `abcdefg` になる。余分な葉があっても、単位元なら実際の列の区間積を変えない。

### 左から取る区間と右から取る区間を分ける

問い合わせ区間を $$[l,r)$$、$$0\leq l\leq r\leq N$$ とする。木の節点を使って区間を飛び越せれば、一要素ずつ読む必要はない。ただし、分解した区間は左端側と右端側の両方から見つかる。そこで左側の累積 $$L$$ と右側の累積 $$R$$ をそれぞれ単位元で初期化する。

木上の左右の境界添字を $$p=P+l,\ q=P+r$$ とし、$$p<q$$ の間、次を繰り返す。

1. $$p$$ が奇数なら、節点 $$p$$ は右の子である。左の兄弟は問い合わせ範囲の外なので、親ごと取ることはできない。この節点だけを取り込み、$$L\leftarrow L\otimes\mathrm{tree}[p]$$ として $$p$$ を1増やす。
2. $$q$$ が奇数なら、範囲内の最後の節点 $$q-1$$ は左の子である。その右の兄弟は範囲外なので、$$q$$ を1減らし、$$R\leftarrow\mathrm{tree}[q]\otimes R$$ とする。
3. 両境界が偶数になり、残った節点は兄弟の対ごとにまとまる。$$p,q$$ をそれぞれ2で割って親の段へ進む。

終了したら $$L\otimes R$$ が答えである。上の列から $$[1,7)$$、すなわち `bcdefg` を取得する経過を追おう。表の境界添字は各反復の開始時、累積 $$L,R$$ はその段で取り込んだ後の値である。追加区間は左側、右側の順に示す。

| 境界 $$(p,q)$$ | 追加区間（左／右） | $$L$$ | $$R$$ |
| --- | --- | --- | --- |
| $$(9,15)$$ | $$[1,2)$$ ／ $$[6,7)$$ | `b` | `g` |
| $$(5,7)$$ | $$[2,4)$$ ／ $$[4,6)$$ | `bcd` | `efg` |

1段目では端を取り込んだ後の境界が $$(10,14)$$ なので、親の段では $$(5,7)$$ となる。2段目では $$(6,6)$$ となり、2で割った $$(3,3)$$ で終了する。最後に `bcd` と `efg` を結合して `bcdefg` を得る。

左側では元の列の左から右へ区間を見つけるため、$$L$$ の**後ろへ**足す。一方、右側では `g` の後に、その左隣の `ef` を見つけるため、$$R$$ の**前へ**足す。ここを逆にして `g` の後ろに `ef` を足すと、答えが `bcdgef` になる。和や最小値だけで試すと、この誤りに気づきにくい。

各反復で、元の問い合わせ区間は「$$L$$ に取り込んだ左部分・未処理の中央部分・$$R$$ に取り込んだ右部分」に、この順で分かれている。端の節点を取り込んでも重複や隙間はできず、中央部分を兄弟ごとに親へ移しても覆う範囲は変わらない。終了時には中央部分が空なので、選んだ節点区間は問い合わせ区間と一致し、$$L\otimes R$$ は結合則により元の列を順に畳み込んだ結果と一致する。

## 成立条件と計算量

各段で選ぶ節点は左右高々一つずつで、木の高さは $$\lceil\log_2 N\rceil$$。したがって、一点更新と区間取得で行う結合は $$O(\log(N+1))$$ 回である。葉の要約を用意した後、構築では $$P-1$$ 個の内部節点を計算する。$$N\leq P<2N$$ なので結合は $$O(N)$$ 回となる。

一つの要約の大きさを $$s$$、一回の結合に必要な時間の上限を $$T$$ とする。要約のコピーなどの費用も含めれば、構築は $$O(NT)$$、一点更新・区間取得は各 $$O(T\log(N+1))$$、空間は $$O(Ns)$$ である。葉の要約を作る費用は別に加える。$$s,T$$ が定数なら、通常の構築 $$O(N)$$、各操作 $$O(\log N)$$（$$N\geq2$$）になる。上の文字列模型を実際の文字列コピーで実装すると、長い区間ほど要約も結合費用も増えるので、この定数の仮定は使えない。

空区間 $$[l,l)$$ では最初から $$p=q$$ で、何も取り込まず $$e\otimes e=e$$ を返す。$$N=1$$ では $$P=1$$ で内部節点はなく、全区間の取得も一点更新も定数回の処理で済む。非2冪長でもpaddingは単位元とし、問い合わせの右端は $$N$$ 以下に保つ。こうすれば、存在しない要素をデータとして扱わずに同じ手順を使える。

### 要約の設計と、ほかの区間分解への接続

[ABC223 F](/problems/abc223-f/)では、文字列そのものの代わりに「括弧を数値化した区間の総和と、空の接頭辞を含む最小接頭辞和」を要約として持つ。[公式問題](https://atcoder.jp/contests/abc223/tasks/abc223_f)の文字交換と部分括弧列の判定に対し、[個別公式解説](https://atcoder.jp/contests/abc223/editorial/2774)はこの二つの値を定数時間で結合し、二点の更新と区間取得で処理している（2026-10-24再照合）。必要な情報をどう選ぶかは[区間monoid要約](/learn/query/range-monoid-aggregation/)、括弧列の判定と結合式は問題本文へ進んで確認しよう。

同じ「区間を分ける」という見方でも、追加で使える性質や操作によって手法が変わる。

- [Sparse Table](/learn/query/idempotent-overlap-range-query/)は更新のない列で、さらに $$x\otimes x=x$$ という冪等性があるとき、重なりを許した二つの区間から答える。文字列連結や和は重複が答えを変えるので、この取得方法を使えない。
- [SWAG](/learn/query/swag/)は末尾への追加と先頭からの削除で動く窓を、二つのstackに分けて集約する。結合則と単位元があればよく、逆元は不要だが、任意位置の更新や削除を扱う手法ではない。
- [有限関数・作用の合成](/learn/query/finite-function-composition/)は、小さな状態集合上の操作を遷移表で要約する。先の操作を後の操作へ通す順序で結合を定義すれば、ここで学んだ区間取得に載せられる。一回の結合費用には、表の大きさを数える。
- [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)では、ここで選んだような節点区間を使い、区間に対する制約などの対象物を節点へ配置する。ある一点に関わる対象物は、その葉から根までの経路上で取得できる。**節点が持つ列の要約を結合する用途と、区間に関わる対象物を配置・取得する用途は区別する**。後者の対象物にmonoid演算が必要とは限らない。

復習では、結合則・単位元を確かめた上で、**分解した区間が元の列を過不足なく覆い、結合する順序も元どおりか**を確認する。非可換な小例を一度手で追うと、左右の累積の向きを自分で再構成できる。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- Fenwick Treeで保つ重み付き接頭辞統計。

## 下位単元

- [区間monoid要約](/learn/query/range-monoid-aggregation/) — 水色
- [有限関数・作用の合成](/learn/query/finite-function-composition/) — 水色
- [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/) — 水色
- [SWAG・two-stack queue aggregation](/learn/query/swag/) — 青色
- [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/) — 青色
- [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f) — 主題: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。 max_j(dp[j]−C|j−t|)+pを、j≤tのmax(dp[j]+Cj)−Ct+pとj≥tのmax(dp[j]−Cj)+Ct+pへ分ける。二本の区間最大で各イベントO(log N)。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。）。
- [ABC437 F「Manhattan Christmas Tree 2」](https://atcoder.jp/contests/abc437/tasks/abc437_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC453 G「Copy Query」](https://atcoder.jp/contests/abc453/tasks/abc453_g) — 主題: [永続data structure・structural sharing](/learn/query/persistence/)（変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。

## 根拠

- [ABC223 F 公式解説](https://atcoder.jp/contests/abc223/editorial/2774)
- [ABC223 F 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_f)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-monoid-segment-tree`
