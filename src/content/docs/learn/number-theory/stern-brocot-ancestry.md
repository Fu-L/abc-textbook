---
title: "Stern–Brocot木の経路と祖先"
description: "「Stern–Brocot木の経路と祖先」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 176
---

# Stern–Brocot木の経路と祖先

習得対象の目安: **橙色（2400–2799）**。mediantの移動をEuclidの商で圧縮し、巨大な経路と祖先集合を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第90単元。技能の説明を学んでから問題一覧へ進んでください。

前: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/) ／ 次: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)

## 概要

### Stern–Brocot木の経路と祖先

隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。

隣接するa/b<c/dのbc-ad=1を不変量にmediant(a+c)/(b+d)を挿入する。左右への一歩を巨大回数繰り返す代わりにEuclidの商で一括移動する。ABC273 Exでは必要な祖先集合を合併して数える工程までが対象で、分母上限の最良近似は求めていない。

### 習得する技能

- 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)。

gcd不変量・差分構造で得た考え方と実装を再利用し、Stern–Brocot木の経路と祖先の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-stern-brocot-ancestry`
