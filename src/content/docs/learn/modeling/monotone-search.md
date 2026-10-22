---
title: "単調境界を証明して探索する"
description: "「単調境界を証明して探索する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 9
---

# 単調境界を証明して探索する

習得対象の目安: **緑色（800–1199）**。二分探索の実装に加え、判定の単調性と境界の意味を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調境界探索

答えの候補を一つ決めると、その候補で条件を満たせるかは調べやすいことがある。候補を順に並べたとき、判定結果が一度だけ切り替わるなら、全候補を試す代わりにその境界を二分探索できる。

### 習得する技能

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

## 考え方

### 数値を並べて、真偽が変わる場所を見る

ABC269 Eでは、ルークのない行と列を別々に探せる。行だけに注目すると、各行にはルークが高々一つあり、空の行はちょうど一つである。そこで「先頭から $$x$$ 行にあるルークの個数は $$x$$ 未満か」を判定 $$P(x)$$ とする。これは、その範囲に空の行が含まれることと同値である。

説明用に7行のうち4行目が空なら、次の真偽列になる。

| 調べる行数 $$x$$ | ルークの個数 | 判定 $$P(x)$$ |
| --- | --- | --- |
| 1 | 1 | 偽 |
| 2 | 2 | 偽 |
| 3 | 3 | 偽 |
| 4 | 3 | 真 |
| 5 | 4 | 真 |
| 6 | 5 | 真 |
| 7 | 6 | 真 |

一度空の行を含めば、さらに行を増やしても空の行を含んだままである。従って最初の真が空の行番号になる。列も同じ考え方で探せる。

最適化でも同様に、例えば「予算 $$x$$ 以内で要求を満たせるか」と問う。可能な計画は予算を増やしても使えるので、真の後に偽へ戻らない。ただし、**元の要求と判定が同値であること**と、**候補値に対して判定が単調であること**は別々に示す。誤った判定器が単調でも、元の問題の答えは求まらない。

### 最初の真を挟む二つの端点

整数候補の範囲を $$a\leq x\leq b$$ とし、判定は偽から真へ変わるとする。範囲のすぐ外に番兵 $$lo=a-1$$、$$hi=b+1$$ を置き、意味上 $$P(lo)=\mathrm{false}$$、$$P(hi)=\mathrm{true}$$ と定める。番兵は「その側まで探しても答えがない」ことを表す印で、判定器には渡さない。

$$hi-lo>1$$ の間、中央の整数を

$$
mid=lo+\left\lfloor\frac{hi-lo}{2}\right\rfloor
$$

として判定する。真なら $$hi=mid$$、偽なら $$lo=mid$$ とする。小例では初期値 $$(lo,hi)=(0,8)$$ から、4は真なので $$(0,4)$$、2は偽なので $$(2,4)$$、3は偽なので $$(3,4)$$ となって止まる。

常に左端は偽、右端は真であり、単調性から最初の真は $$(lo,hi]$$ に残る。更新後もこの不変条件を保ち、幅がほぼ半分になる。終了時は両端が隣り合うため、$$hi$$ が最初の真である。

- 範囲内が全真なら $$hi=a$$ となる。
- 範囲内が全偽なら $$hi=b+1$$ となり、答えなしと分かる。

真から偽へ変わる判定で「最後の真」を求めるなら、真偽を反転した判定で最初の真を探し、その一つ前を返せる。この場合も全偽なら答えなし、全真なら $$b$$ となる。同じ境界規約へ直してから実装すると、どちら側を返すかが曖昧にならない。

### 単調性の前に、等号を含む判定式を確定する

境界の探し方が決まっても、判定式の等号は問題の条件から導く必要がある。ABC373 Eのように「自分の当選を必ず保証する」問題では、敵対者が落選させる最小費用を考えるとよい。

残っている票の総数を $$R$$、自分へ追加する票を $$x$$、その後に敵対者が失敗例を作る最小費用を $$C(x)$$ とする。敵対者の予算は $$R-x$$ なので、$$C(x)\leq R-x$$ なら失敗可能、$$C(x)>R-x$$ なら保証可能である。費用が予算と等しいときも、敵対者は必要な票を配れる。

自分の最終得票を $$t$$、ある相手の現在得票を $$v$$ とする。相手を $$t$$ より真に大きくする費用は $$\max(0,t+1-v)$$ であり、正の費用が必要なのは $$v\leq t$$ の相手である。例えば $$t=5,v=5$$ でも1票必要になる。従ってソート列の境界は `upper_bound(t)`、整数なので同じ位置を指す `lower_bound(t+1)` である。

同値要素だけの入力、残資源0、費用と資源がちょうど等しい場合を確認してから、この判定の単調性を証明する。

## 成立条件と計算量

整数候補数を $$U=b-a+1$$、一回の判定費用を $$T$$ とすると、判定回数は $$O(\log(U+1))$$、探索時間は $$O(T\log(U+1))$$ である。ソートや累積和などの前処理は別に加える。探索自体の追加空間は $$O(1)$$ だが、判定器と前処理で使う領域は別途必要になる。

使う前に、判定の同値性、候補値の単調性、探索範囲を確認する。貪欲法を判定器にするなら、その貪欲法が実現可能性を正しく答える証明も必要である。試した候補の処理結果が次の判定へ残らないようにし、端点・差・中央を計算できる整数型を選ぶ。実数探索では隣接整数で停止できないため、必要な誤差と反復回数を別に定める。

問題一覧では、ABC269 Eで問い合わせから真偽を得る例、ABC270 Eで完全周回数に対する最後の成功を探す例へ進む。後者は全消費時に成功がいつまでも続くため、その場合を先に処理して有限の探索範囲を作る。ABC373 Eでは、さらに等号を含む判定式の設計を学ぶ。境界探索と判定器の設計を分けて読み返そう。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)、[parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。

判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

### このUnitでは扱わないもの

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 問題一覧

- [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。
- [ABC270 E「Apple Baskets on Circle」](https://atcoder.jp/contests/abc270/tasks/abc270_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC381 E「11/22 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC395 F「Smooth Occlusion」](https://atcoder.jp/contests/abc395/tasks/abc395_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC292 F「Regular Triangle Inside a Rectangle」](https://atcoder.jp/contests/abc292/tasks/abc292_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)（同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。）。
- [ABC374 E「Sensor Optimization Dilemma 2」](https://atcoder.jp/contests/abc374/tasks/abc374_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC373 E「How to Win the Election」](https://atcoder.jp/contests/abc373/tasks/abc373_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC303 F「Damage over Time」](https://atcoder.jp/contests/abc303/tasks/abc303_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（整数区間上の一次関数包絡を交点の前後で分け、各affine blockの値を等差数列和で合計できる。）。
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)（整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 周期性による候補時刻の圧縮と単調判定の二分探索を前提に、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。リールと時刻の一対一対応を二部matchingで判定することが主題。
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC388 E「Simultaneous Kagamimochi」](https://atcoder.jp/contests/abc388/tasks/abc388_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)（各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC269 E 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC269 E 公式解説](https://atcoder.jp/contests/abc269/editorial/4840)
- [ABC270 E 公式問題文](https://atcoder.jp/contests/abc270/tasks/abc270_e)
- [ABC270 E 公式解説](https://atcoder.jp/contests/abc270/editorial/4848)
- [ABC373 E 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_e)
- [ABC373 E 公式解説](https://atcoder.jp/contests/abc373/editorial/11046)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-monotone-search`
