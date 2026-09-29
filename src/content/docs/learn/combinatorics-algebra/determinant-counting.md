---
title: "行列式による数え上げ"
description: "「行列式による数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 198
---

# 行列式による数え上げ

習得対象の目安: **黄色（2000–2399）**。行列木定理やLGV補題の対応を理解し、組合せ対象を行列式で数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 行列式による数え上げ

非交差経路やspanning treeなどの組合せ対象を行列式に対応させ、LGV補題・行列木定理で数える。

入力: 始点x_1<…<x_K、時刻Nの終点y_1<…<y_K。辺は位置を保つか1増やすので、M_ij=C(N,y_j−x_i)が単独経路数。範囲外の二項係数は0。

行列式を展開すると、始点iを終点π(i)へ結ぶ経路族にsgn(π)を掛けた総和となる。交差する族は最初の共通頂点と二経路を一定規則で選び、そこから後ろを交換する。これは積重みを保ち、置換の符号を反転する対合である。

打消し後に残るのは頂点非共有な族。一般のDAGでは複数の端点置換が残り得るため、行列式は常に非共有族の単なる総数になるわけではない。

この時間格子では、順序を逆転する二経路は同じ時刻・位置を必ず共有する。従って非共有族の端点対応は恒等置換のみで、その符号が正だからdet Mが求める数になる。

入力: 非空頂点集合Sの誘導グラフ。各非ループ辺uvの重みwをL_uu,L_vvへ+w、L_uv,L_vuへ−wとして足す。多重辺は重みを加算し、自己ループは除く。

根rの行と列を削った行列L^(r)の行列式が全域木の辺重み積の総和になる。接続行列BからL=BWB^Tと書き、Cauchy–Binetで辺集合へ展開すると、|S|−1辺の集合のうち木だけが小行列式の二乗1を持つためである。

無向木ではどの根を削っても同じ。|S|=1は空行列式1、非連結なら0。法上の掃き出しではpivot交換による符号を保ち、1集合O(|S|³)。

有向木へ転用する場合、根へ向かう木には出次数Laplacianを用いる。L_uuにuから出る非ループ重み和、L_uvに−w(u→v)を置く。BEST定理が必要とするのはこちらの向きである。

### 習得する技能

- 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。
- DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。

このUnitを直接前提とする単元: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)。

線形方程式・rankで得た考え方と実装を再利用し、行列式による数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)（二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)（有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

## 根拠

- [ABC216 H 公式解説](https://atcoder.jp/contests/abc216/editorial/2561)
- [ABC216 H 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-determinant-counting`
