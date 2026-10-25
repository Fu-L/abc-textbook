---
title: "区間更新を要約へ作用させる"
description: "「区間更新を要約へ作用させる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 40
---

# 区間更新を要約へ作用させる

習得対象の目安: **青色（1600–1999）**。要約に対する作用と作用同士の合成を定義し、遅延評価の整合性を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 遅延評価する区間作用

区間更新を要約へ作用させ、作用の合成を遅延評価する。

### 習得する技能

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

## 考え方

区間の全要素を更新するたびに葉まで降りると、長い区間の更新に時間がかかる。区間の要約だけから更新後の要約を求められるなら、節点で処理を止め、子への更新を後回しにできる。これが遅延評価の出発点である。

### 和だけでは区間加算を処理できない

配列 $$(2)$$ と $$(1,1)$$ はどちらも和が2である。しかし各要素に3を加えると、それぞれ $$(5)$$ と $$(4,4)$$ になり、和は5と8に分かれる。更新前の和だけでは、どちらの答えを返すべきか決められない。加えた値が何個分あるかも必要なので、区間の要約を $$(s,\ell)$$、すなわち和 `sum` と長さ `len` の組にする。

隣接区間の要約を結合する演算を $$\otimes$$ と書くと、和も長さも足せばよい。

$$
(s_1,\ell_1)\otimes(s_2,\ell_2)=(s_1+s_2,\ell_1+\ell_2)
$$

一方、各要素を $$f(x)=ax+b$$ に置き換えるアフィン変換は、係数の組 $$(a,b)$$ で表せる。これを更新の「作用」と呼ぶ。要約は区間の現在の情報、作用はその情報をどう変えるかという指示である。要約へ作用を適用する関数を `mapping` とすると、各要素の変換後の和を取ることから次を得る。

$$
\operatorname{mapping}((a,b),(s,\ell))=(as+b\ell,\ell)
$$

加算は $$(a,b)=(1,b)$$、値 $$b$$ への代入は $$(a,b)=(0,b)$$ で表せる。区間を左右に分けても、先に結合してから更新しても、和は同じになる。左右の要約を $$u=(s_1,\ell_1),v=(s_2,\ell_2)$$ とすれば、どちらの手順でも次の値を得る。

$$
\bigl(a(s_1+s_2)+b(\ell_1+\ell_2),\ell_1+\ell_2\bigr)
$$

つまり、遅延評価で必要なのは、要約の結合と作用の適用が次の意味で両立することである。

$$
\operatorname{mapping}(f,u\otimes v)
=\operatorname{mapping}(f,u)\otimes\operatorname{mapping}(f,v)
$$

空区間の単位要約は $$e=(0,0)$$ であり、どのアフィン作用でも `mapping(f,e)=e` となる。代入も空区間に要素を作るわけではなく、長さが0なので和は0のままである。**要約の単位元** $$(0,0)$$ と、何も更新しない**恒等作用** $$\mathrm{id}=(1,0)$$ を区別しよう。

### 加算と代入で合成順を確かめる

作用を後回しにするには、未処理の更新列も一つの作用にまとめたい。ただし更新の順序は保存する必要がある。配列 $$(1,3)$$ 全体へ「2を加算」と「4を代入」を適用して比べる。

- 加算してから代入: $$(1,3)\to(3,5)\to(4,4)$$。最後の代入が以前の加算を上書きする。
- 代入してから加算: $$(1,3)\to(4,4)\to(6,6)$$。代入した値にも加算が効く。

古い作用を $$f(x)=ax+b$$、後から来た作用を $$g(x)=cx+d$$ とすると、時間順に適用した結果は $$g(f(x))=cax+cb+d$$ である。そこで、`composition(new,old)` は **old の後に new** を適用する約束にする。

$$
\operatorname{composition}((c,d),(a,b))=(ca,cb+d)
$$

上の例では加算の作用が $$(1,2)$$、代入の作用が $$(0,4)$$ なので、加算後の代入は $$(0,4)$$、代入後の加算は $$(0,6)$$ にまとまる。いずれも元の要約 $$(4,2)$$ に適用すると、和はそれぞれ8と12になり、配列を逐次更新した結果と一致する。このように、合成後も同じ二つの係数で表せるため、更新回数に比例して未処理の列が伸びることはない。

関数合成の結合則から、作用を途中でまとめても適用結果は変わらない。要約への適用も `mapping(g,mapping(f,u))=mapping(composition(g,f),u)` を満たし、恒等作用を適用しても要約は変わらない。ここまでが、更新をまとめて遅延させるための確認事項である。

### 節点に反映し、子への適用を遅らせる

各節点に現在の要約 `value` と、まだ子へ伝えていない作用 `lazy` を持つ。`value` にはその節点への更新が反映済みで、`lazy` は子への反映だけが残っている。初期化では実要素の葉を $$(A_i,1)$$、余分な葉を $$e$$ とし、下から結合して要約を作る。すべての `lazy` は恒等作用で始める。

節点の区間全体を覆う更新 $$f$$ は、`value←mapping(f,value)` と `lazy←composition(f,lazy)` だけで処理する。これまでの `lazy` の後に新しい $$f$$ を適用するので、先ほどの時間順と一致する。

一部だけを更新するときは、子へ降りる前に親の `lazy` を左右の子へ同じ規則で適用し、親の `lazy` を恒等作用へ戻す。子の更新を終えたら、左右の `value` を結合し直す。親で一括更新していたものを子へ分配しても、`mapping` と結合の両立により要約は変わらない。これが遅延させても正しい理由である。

### 更新区間と照会区間を区別する

1始まりの閉区間 $$[L,R]$$ を0始まりの木へ写すなら、更新も照会も半開区間 $$[L-1,R)$$ にする。照会は非交差で単位要約 $$e$$、全被覆で節点の `value` を返し、部分被覆では `lazy` を伝播してから左右の照会結果を結合する。根の要約は全配列の回答なので、指定区間への照会には `prod` を使う。更新が正しくても、回答を集める集合が違えば解けない。

別の更新を扱うときも、「向き」など一つの属性が戻っただけで作用全体が恒等になったと判断しない。例えば、列の末尾への追加と列の反転が混在すると、反転を二回して向きが戻っても、途中で追加した要素は残る。代入のようなリセットを含む場合も、以前の更新をどこまで上書きするかが分かる情報を作用に残す必要がある。

## 成立条件と計算量

要約の結合、作用の合成、`mapping` がそれぞれ定数時間で、要約・作用が定数サイズに収まることを前提とする。長さ $$N$$ の配列では、葉と内部節点がそれぞれ $$O(N)$$ 個なので、構築は $$O(N)$$ 時間、空間は $$O(N)$$。区間更新・区間取得は各階層の境界付近だけを分割し、全被覆の節点では処理を止められるため、それぞれ $$O(\log N)$$ 時間となる。

使う前には、要約だけで更新後を決められるか、`mapping` と結合が両立するか、作用の合成と恒等作用を同じ形式で持てるかを確認する。両立しない更新に、この計算量をそのまま当てはめることはできない。

[ABC332 F](/problems/abc332-f/) では、ある位置が選ばれる確率から、期待値の更新がアフィン変換になる。この単元ではその更新を要約へ適用し、時間順に合成する部分を学んだ。確率から係数を導く過程は問題解説で確認しよう。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。

### このUnitでは扱わないもの

- 過去の版の保存・rollback・構造共有。

## 問題一覧

- [ABC340 E「Mancala 2」](https://atcoder.jp/contests/abc340/tasks/abc340_e) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC382 F「Falling Bars」](https://atcoder.jp/contests/abc382/tasks/abc382_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC389 F「Rated Range」](https://atcoder.jp/contests/abc389/tasks/abc389_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC357 F「Two Sequence Queries」](https://atcoder.jp/contests/abc357/tasks/abc357_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC322 F「Vacation Query」](https://atcoder.jp/contests/abc322/tasks/abc322_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC397 F「Variety Split Hard」](https://atcoder.jp/contests/abc397/tasks/abc397_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC441 G「Takoyaki and Flip」](https://atcoder.jp/contests/abc441/tasks/abc441_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC237 G「Range Sort Query」](https://atcoder.jp/contests/abc237/tasks/abc237_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC371 F「Takahashi in Narrow Road」](https://atcoder.jp/contests/abc371/tasks/abc371_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC265 G「012 Inversion」](https://atcoder.jp/contests/abc265/tasks/abc265_g) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。

## 根拠

- [ABC332 F 公式問題文](https://atcoder.jp/contests/abc332/tasks/abc332_f)
- [ABC332 F 公式解説](https://atcoder.jp/contests/abc332/editorial/7890) — 期待値の更新を区間のアフィン変換へ帰着する根拠。本文の短い配列による検算は本書で補った説明。
- [ABC237 G 公式解説](https://atcoder.jp/contests/abc237/editorial/3341)
- [ABC237 G 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_g)
- [ABC248 H 公式解説](https://atcoder.jp/contests/abc248/editorial/3748)
- [ABC248 H 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-range-actions`
