---
title: "行列式による数え上げ"
description: "「行列式による数え上げ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 164
---

# 行列式による数え上げ

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

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 線形方程式・rank。

線形方程式・rankで得た考え方と実装を再利用し、行列式による数え上げの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h)
- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

## 根拠

- [ABC216 H 公式解説](https://atcoder.jp/contests/abc216/editorial/2561)
- [ABC216 H 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-determinant-counting`
