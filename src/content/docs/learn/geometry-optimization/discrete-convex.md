---
title: "凸性・傾き・限界費用・slope trick"
description: "「凸性・傾き・限界費用・slope trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 223
---

# 凸性・傾き・限界費用・slope trick

導入対象の目安: **青色（1600–1999）**。差分の単調性を入口に、凸関数の選択・合成・制約付き最適化を見渡す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

目的関数の値そのものに加え、「変数を一つ増やすと値がいくつ変わるか」を調べる。その差分が単調なら、最適点の探索や資源配分に使える。関数全体を更新する問題では、傾きが変わる点を保持する方法へ進む。

## 考え方

整数区間上の関数 $$f$$ に対し、一つ右へ動いたときの値の変化を

$$
\Delta f(x)=f(x+1)-f(x)
$$

と置く。この差分が $$x$$ とともに非減少となることを、ここでは離散凸性と呼ぶ。小例として $$f(x)=(x-2)^2$$ を、整数 $$x=0,1,2,3,4$$ で計算する。

| $$x$$ | $$f(x)$$ | 次の整数への差分 $$\Delta f(x)$$ |
| --- | --- | --- |
| $$0$$ | $$4$$ | $$-3$$ |
| $$1$$ | $$1$$ | $$-1$$ |
| $$2$$ | $$0$$ | $$1$$ |
| $$3$$ | $$1$$ | $$3$$ |
| $$4$$ | $$4$$ | —（区間の右端） |

差分は $$-3,-1,1,3$$ と増えている。負の間は右へ進むと値が減り、正になると値が増えるので、最初に差分が非負になる $$x=2$$ が最小点である。この例では $$\Delta f(x)=2x-3$$ と展開しても、非減少であることを確かめられる。

差分の単調性を見つけた後は、問題が何を求めるかで使い方を選ぶ。

- 一つの変数の最適点を求めたいなら、[一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)へ進む。値や差分を必要な位置で計算できれば、上の表を全範囲に作らず、差分の符号が変わる位置を二分探索できる。
- 複数の対象へ合計量を決めて資源を配りたいなら、[分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)へ進む。費用が対象ごとの和に分かれ、各対象に上下限だけがある場合、一単位を足す差分が次の限界費用となる。各対象の次の費用のうち最小のものから配れば、各列の先頭から必要個数を選べる。利益の最大化では、差分が非増加となる凹関数を対称に扱う。
- DPなどで、後の操作に備えて費用関数全体を更新したいなら、[slope trick](/learn/geometry-optimization/slope-trick/)へ進む。区分線形凸関数を保つ遷移では、各座標の値を並べる代わりに傾きが変わる折れ点を保持できる。上の二乗関数をそのままこの表現で扱うという意味ではなく、実際の遷移が区分線形性と凸性を保つことを確認する。
- 変数間に値の昇順などの順序制約があるなら、独立に資源を配る方法では扱えない。[isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/)で、順序に違反する隣接部分をまとめる理由を学ぶ。

## 成立条件と計算量

差分が非減少な整数区間では、ある点から右へ進む値の変化は、その右側の差分の和になる。最初の差分が非負なら、それ以降を足しても値は下がらない。同様に、左側の差分が非正なら、左へ戻っても値は下がらない。したがって、両隣への移動で改善しない点は区間全体の最小点である。差分が $$0$$ なら隣の点も同値で、最小点が複数になることもある。差分がすべて負なら右端、すべて正なら左端が最小で、一点だけの区間には差分がない。

小さい表は意味を確認する例であり、一般の入力での凸性の証明にはならない。差分の式や遷移の性質から単調性を示す。[ABC224 Gの公式解説](https://atcoder.jp/contests/abc224/editorial/2816)では、戦略を一変数に絞って費用の期待値を式にし、その凸性から整数の候補を減らしている。図が滑らかに見えることだけを根拠に探索へ進まない。

整数区間 $$[L,R]$$ の要素数を $$U=R-L+1$$ とし、一回の関数評価に $$T$$ 時間かかるなら、差分の符号を二分探索する費用は $$O(T\log U)$$ 時間である（$$U=1$$ では一回の評価）。一方、限界費用を一単位ずつ配る方法は配る総量にも、slope trickは生成する折れ点の総数と更新方法にも依存する。差分の単調性は正しさの根拠であり、全体の計算量は評価・選択・更新の操作数を数えて求める。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 真偽値の単調境界探索と、交換論だけで決まる貪欲順。

## 下位単元

- [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/) — 青色
- [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) — 青色
- [slope trick](/learn/geometry-optimization/slope-trick/) — 黄色
- [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-discrete-convex`
