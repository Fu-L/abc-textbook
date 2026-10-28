---
title: "doubling・binary lifting"
description: "「doubling・binary lifting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 107
---

# doubling・binary lifting

習得対象の目安: **水色（1200–1599）**。二の冪回の遷移を合成し、行き先や累積値を対数回で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### doubling・binary lifting

一意に決まる遷移の、2の冪回後の行き先と累積値を合成し、巨大な回数の移動を二進分解で求める。

### 習得する技能

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 考え方

一回後の行き先が分かれば、それを二回つないで二回後、二回後の結果を二つつないで四回後を求められる。このように2の冪回の結果を前計算し、必要な回数を二進分解してつなぐ方法をダブリングという。

[関数グラフの分解](/learn/graph/functional-graph-decomposition/)と同じ独自例 $$f=(2,3,2,3)$$ を使う。頂点を $$1,2,3,4$$ とし、出発点にいる時点を時刻0とすると、頂点1からの移動は $$1\to2\to3\to2\to3\to2$$ となる。ここでは周期に分ける代わりに、5歩を $$5=1+4=2^0+2^2$$ と分け、一回分と四回分の結果をつなぐ。

### 添字は歩数ではなく、2の冪の段を表す

後続を表す写像を $$f$$、頂点を $$v$$ とし、`jump[k][v]` を $$v$$ から $$2^k$$ 回進んだ後の頂点とする。$$k$$ は歩数そのものではなく、表の段の番号である。0段目は0歩ではなく $$2^0=1$$ 歩、1段目は2歩、2段目は4歩を表す。

一回分の初期表は $$\mathrm{jump}[0][v]=f(v)$$。$$2^{k+1}$$ 回を前半と後半の $$2^k$$ 回ずつに分けると、

$$
\mathrm{jump}[k+1][v]=\mathrm{jump}[k][\mathrm{jump}[k][v]]
$$

となる。前半の到着先から後半を始めることが、表の添字にも現れている。初期表が正しく、二つの区間を正しい中間点でつないでいるので、段を増やしても行き先は正しい。

質問では、$$K$$ の二進表現を下位の bit から読む。$$2^k$$ の位が1なら、現在の頂点から `jump[k]` で進む。適用済みの区間の合計歩数後にいる、という対応が更新のたびに保たれ、立っている bit をすべて使うとちょうど $$K$$ 歩になる。

### 行き先と、その間に集めた値を対にする

同じ写像に、出発点で加える寄与 $$w=(10,20,30,40)$$ を置く。一回の操作を「現在の頂点 $$v$$ の $$w(v)$$ を加えてから、$$f(v)$$ へ移る」とする。これは公式入力例ではなく、合成を確認するための独自例である。頂点1から5回進む間の寄与は $$10,20,30,20,30$$ なので、**到着先は頂点2、累積値は110**になる。最後に到着した頂点2の寄与は、まだ加えない。

頂点1は1歩後も5歩後も頂点2へ着くが、累積値はそれぞれ10と110である。行き先だけを保存しても、途中の値は復元できない。そこで `agg[k][v]` に、$$v$$ から同じ $$2^k$$ 回の操作で得られる集約値も保存する。和の場合は、最初の出発点から最後の到着点の一つ手前までの寄与の合計である。

より一般に、二つの区間の集約値をつなぐ演算を $$\otimes$$ と書く。この演算には、括弧の付け方を変えても結果が同じになる結合則が必要である。空の区間の値を表す単位元を $$e$$ とすると、和では $$\otimes$$ は加算、$$e=0$$ になる。文字列の連結のように順序で結果が変わる演算でもよいが、必ず前半、後半の順に合成する。

一回分は $$\mathrm{agg}[0][v]=w(v)$$。後半の出発点は前半の到着先なので、倍増の式は

$$
\mathrm{agg}[k+1][v]
=\mathrm{agg}[k][v]\otimes\mathrm{agg}[k][\mathrm{jump}[k][v]]
$$

となる。`jump` と同じ区間分割であり、正しい二つの区間の値を進行順に合成するから、`agg` も各段で正しい。

小例の頂点2から四回進む区間は $$2\to3\to2\to3\to2$$ なので、`jump[2][2] = 2`、`agg[2][2] = 20+30+20+30 = 100` となる。5歩の質問を、まず一回、続いて四回の順に処理すると、次の二つの区間を使う。

| 歩数 | 出発点 | 到着点 | 加算 | 累計 |
| --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 10 | 10 |
| 4 | 2 | 2 | 100 | 110 |

一般の質問でも、現在の頂点を `v`、ここまでの集約値を `answer` として `answer = e` から始める。$$K$$ の $$2^k$$ の位が1なら、次の順に更新する。

```text
answer = answer ⊗ agg[k][v]
v = jump[k][v]
```

これは擬似コードである。**両方の表を更新前の頂点で引く**ため、集約値を末尾へ加えてから頂点を変える。小例の最初の一回で先に頂点2へ移ると、`agg[0][2] = 20` を加えてしまい、出発点1の寄与10を取り違える。後半も、最初の頂点1ではなく、その時点の頂点2からの区間を使う。

更新のたびに、`v` は適用済みの歩数後の頂点、`answer` はその区間全体の集約値となる。従って全 bit を処理した後の二つが答えである。$$K=0$$ では一度も更新せず、答えは出発点と単位元になる。和なら累積値は0で、出発点の寄与も加えない。

## 成立条件と計算量

遷移先が現在の状態だけから一意に決まり、同じ遷移を繰り返すときに使う。累積値も求める場合は、寄与がその状態から決まり、区間の値を結合的に合成できる必要がある。自己ループ、複数成分、途中での合流があっても合成式は変わらない。

頂点数を $$N\geq1$$、扱う最大回数を $$U\geq0$$ とする。`bit_length(U)` を $$U$$ の二進表現の桁数とし、`bit_length(0) = 0` と定める。表の段数を

$$
L=\max\bigl(1,\operatorname{bit\_length}(U)\bigr)
$$

とし、$$k=0,\ldots,L-1$$ の表を作る。例えば $$U=5$$ なら3段、$$U=0$$ でも初期表の1段を持てる。後者では、質問でその表を使うことはない。

各集約値の保持と一回の合成が $$O(1)$$ なら、表の構築は $$O(NL)$$ 時間・空間、質問は一回につき $$O(L)$$ 時間となる。質問数を $$Q$$ とすれば全体の時間は $$O(NL+QL)$$。質問を一つずつ処理すると、表以外の作業領域は $$O(1)$$ で済む。文字列をそのまま連結するように合成や保持に長さに応じた費用がかかる場合は、その分も数える。

$$U$$ が $$N$$ より巨大なら、段数を $$\log N$$ 程度に固定すると足りない。[関数グラフを分解する方法](/learn/graph/functional-graph-decomposition/)で周期部分を剰余に任せた場合は、木の途中の質問だけを小さい表で処理できる。どの歩数までを表に任せるかで、必要な段数を決める。

概念上の親: [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)。

一意に決まる遷移の、2の冪回後の行き先と累積値を合成し、巨大な回数の移動を二進分解で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC367 E「Permute K times」](https://atcoder.jp/contests/abc367/tasks/abc367_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC438 E「Heavy Buckets」](https://atcoder.jp/contests/abc438/tasks/abc438_e) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC212 F「Greedy Takahashi」](https://atcoder.jp/contests/abc212/tasks/abc212_f) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC310 G「Takahashi And Pass-The-Ball Game」](https://atcoder.jp/contests/abc310/tasks/abc310_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC254 G 公式解説](https://atcoder.jp/contests/abc254/editorial/4066)
- [ABC254 G 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC310 G 公式解説](https://atcoder.jp/contests/abc310/editorial/6785)
- [ABC310 G 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_g)
- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 個別公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC438 E 公式問題文](https://atcoder.jp/contests/abc438/tasks/abc438_e)
- [ABC438 E 個別公式解説](https://atcoder.jp/contests/abc438/editorial/14964)

2026-10-28にABC241 E・ABC438 Eの公式問題文・個別公式解説を再照合した。ABC241 Eでは操作前の剰余で選ぶアメの追加個数、ABC438 Eでは受け渡し前の持ち主が注ぐ水量が、一回分の寄与になる。いずれも出発点の寄与を加えてから移動する定義と一致する。本文の写像と重みは、公式入力例とは別の独自例である。

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-binary-lifting`
