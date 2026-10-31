---
title: "一次元凸・単峰最適化"
description: "「一次元凸・単峰最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 224
---

# 一次元凸・単峰最適化

習得対象の目安: **青色（1600–1999）**。単峰性や差分の単調性を証明し、三分探索・整数境界で最適点を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 一次元凸・単峰最適化

値を一つ動かしたときに、目的関数が増えるか減るかを調べる。整数では隣り合う値の差、連続では導関数や二点の値の比較を使い、最小点が残る側へ探索区間を縮める。

### 習得する技能

- 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

単変数の関数を最小化するとき、値をすべて調べる代わりに「右へ動くと改善するのはどこまでか」を考える。まず探索区間を決め、その区間全体で改善方向が一度だけ切り替わる根拠を示す。凸性はそのための十分条件であり、どんな関数にも二分探索や三分探索を使えるわけではない。

### 整数では「一つ増やす差額」の符号を探す

説明用の小例として、整数 $$x$$ を $$0\leq x\leq 4$$ で動かし、$$f(x)=(x-2)^2$$ を最小化する。隣への差額を $$\Delta(x)=f(x+1)-f(x)$$ と定義すると、次のようになる。最後の点には右隣がないので、差分を定義しない。

| $$x$$ | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| $$f(x)$$ | 4 | 1 | 0 | 1 | 4 |
| $$\Delta(x)$$ | −3 | −1 | 1 | 3 | — |

差分が負なら右隣の方が安く、正なら右隣の方が高い。この例では $$\Delta(x)=2x-3$$ が非減少なので、一度非負になれば、その先で再び負にはならない。初めて非負になる $$x=2$$ までは右へ進むほど安く、それ以降は安くならない。従って最小点は2である。関数値そのものは単調ではないが、判定 $$\Delta(x)\geq 0$$ は単調なので二分探索できる。

一般に、整数区間 $$[L,R]$$ 上で差分が非減少である性質を離散凸性という。$$L<R$$ なら差分を調べる範囲は $$[L,R-1]$$ である。初めて $$\Delta(x)\geq 0$$ となる位置を探し、見つからなければ $$R$$ を返す。実装では $$R$$ を「該当する差分がない場合の返り値」として扱い、$$\Delta(R)$$ を評価しない。この手順は最小点のうち最も左のものを返す。

端や同値でも、この規約を変える必要はない。

- 同じ二次関数を $$[3,4]$$ に制限すると、最初の差分が既に正なので $$L=3$$ を返す。
- $$[0,1]$$ に制限すると、差分がすべて負なので $$R=1$$ を返す。
- 零差分は「右へ一つ進んでも費用が変わらない」を意味する。例えば $$f(x)=\max(1-x,0,x-3)$$ を $$[0,4]$$ で考えると、関数値は $$(1,0,0,0,1)$$、差分は $$(-1,0,0,1)$$ である。最初の非負差分の位置1を返し、最小点は1、2、3である。零差分の区間の右隣の点まで同じ最小値になる。
- $$L=R$$ なら候補は一点しかない。差分を作らず、その点を返して必要なら関数値を一回評価する。

### 連続最小点から整数候補を絞る

実数上の凸関数の最小点を $$t$$ とすると、その左では非増加、右では非減少である。そのため整数候補は $$\lfloor t\rfloor$$ と $$\lceil t\rceil$$ に絞れる。探索域が整数区間 $$[L,R]$$ なら、域外の候補を除き、端点も比べる。例えば $$f(x)=(x-2.4)^2$$ では $$t=2.4$$ であり、$$f(2)=0.16$$ と $$f(3)=0.36$$ から2を選ぶ。域が $$[0,1]$$ なら両候補とも域外で、右端1が最適になる。

ここで必要なのは、丸めた二候補の**関数値を比較する**ことである。一般の凸関数は左右対称ではないため、実数最小点に距離が近い整数を選ぶだけでは足りない。また、多変数凸関数を座標ごとに丸めても、総和などの制約や最適性は保証されない。

[ABC224 G「Roll or Increment」の解説](/problems/abc224-g/)では、振り直し後に受け入れる出目の個数を $$X$$ として、期待費用を

$$
f(X)=\frac{A(X-1)}{2}+\frac{BN}{X}
$$

へ整理する。ここで $$A$$ は一回の加算費用、$$B$$ は一回の振り直し費用、$$N$$ はサイコロの面数である。正の実数上の最小点 $$t=\sqrt{2BN/A}$$ を求めた後、整数条件と端点に戻るのがこの単元との接続になる。受け入れる範囲への帰着や、振り直さず目標へ進む場合との比較は問題の解説で確認する。

### 連続三分探索で残す区間

最小点を式で解けなくても、区間 $$[L,R]$$ で凸性を示せれば、二点の評価から区間を縮められる。三分点を

$$
m_1=L+\frac{R-L}{3},\qquad m_2=R-\frac{R-L}{3}
$$

とする。$$f(m_1)>f(m_2)$$ なら最小点を含む $$[m_1,R]$$ を残し、逆なら $$[L,m_2]$$ を残す。例えば前者では二点の間の傾きが負なので、凸性により $$m_1$$ より左に最小点を探す必要がない。等しい場合も、凸性の下では $$[m_1,m_2]$$ に最小点がある。

各回で区間長が定数率で減る。整数で三分探索する場合は、区間が狭くなると三分点が同じになり更新が止まるので、残りの少数候補を直接列挙する。差分の符号を判定できるなら、先ほどの二分探索の方が境界を明確に扱いやすい。

凸性より弱い単峰性だけを使う場合は、等値の扱いを別に確認する。例えば値が $$(3,3,3,2,1)$$ と並ぶ関数では、途中の二点が等しくても、その間に最小点があるとは限らない。平坦な非最小区間を許して「等しいから中央だけを残す」とすると、最小点を捨てることがある。

ここまでは一つの変数をどこまで増やすかを差分で決めた。[分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)では、同じ差分を複数の変数について作る。総資源量が固定されているため、符号で止める代わりに「どの変数の次の一単位が最も安いか」を比べる。

## 成立条件と計算量

整数区間の幅を $$U=R-L$$ とすると、差分二分探索は $$O(1+\log(U+1))$$ 回の関数評価で済む。差分の評価に二回の関数評価が必要なら、その費用も含める。連続三分探索は初期幅 $$D$$ を必要幅 $$\varepsilon$$ まで縮めるのに、$$D>\varepsilon$$ なら $$O(\log(D/\varepsilon))$$ 回かかる。関数評価一回の時間を掛けたものが全体の時間であり、探索自体の追加空間は $$O(1)$$ である。必要な関数値の誤差から探索幅や反復数を決め、浮動小数点の丸めにも注意する。

整数では端点・零差分・一点の探索域を、連続では凸性または採用する単峰性の定義と等値時の規則を確認する。二分探索用の差分の単調性も、三分探索で区間を捨てる根拠も、探索する区間全体で必要である。

概念上の親: [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)、[Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)、[分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)、[slope trick](/learn/geometry-optimization/slope-trick/)。

差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC224 G「Roll or Increment」](https://atcoder.jp/contests/abc224/tasks/abc224_g) — 主題: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC314 Ex「Disk and Segments」](https://atcoder.jp/contests/abc314/tasks/abc314_h) — 主題: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC240 F 公式解説](https://atcoder.jp/contests/abc240/editorial/3422)
- [ABC240 F 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-basic-convex-optimization`
