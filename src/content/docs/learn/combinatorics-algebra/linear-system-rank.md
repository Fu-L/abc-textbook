---
title: "線形方程式・rank"
description: "「線形方程式・rank」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 196
---

# 線形方程式・rank

習得対象の目安: **青色（1600–1999）**。体上の消去法を実装し、rankから可解性と自由度を判断する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第65単元。技能の説明を学んでから問題一覧へ進んでください。

前: [graph core・leaf peeling](/learn/graph/graph-core/) ／ 次: [potential・weighted DSU](/learn/graph/potential-dsu/)

## 概要

### 線形方程式・rank

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。

### 習得する技能

- 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
2. [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)。既習技能: 二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC278 H 公式解説](https://atcoder.jp/contests/abc278/editorial/5210)
- [ABC278 H 公式問題文](https://atcoder.jp/contests/abc278/tasks/abc278_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-linear-system-rank`
