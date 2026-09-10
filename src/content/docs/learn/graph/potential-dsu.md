---
title: "potential・weighted DSU"
description: "potential・weighted DSUの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 179
---

# potential・weighted DSU

## 概要

### potential・weighted DSU

親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。

d[v]=potential(v)-potential(parent(v))と定義する。find時は旧親から根への差を加算してから親を根へ変更する。制約potential(y)-potential(x)=wで、根rx,ryへの差をdx,dyとすると、ryをrxの子にする辺差はw+dx-dy。逆向きに付けるなら符号を反転する。同根ならdy-dx=wとの整合性を検査する。

ABC328 Fは制約を順次追加して矛盾する追加を棄却するので、この不変量を直接学べる。全辺が先に与えられるABC280 FのDFSによるpotential伝播と非零cycle判定は静的potentialの節で扱う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: DSUによる連結成分管理・縮約、静的graph等式制約のpotential伝播。

DSUによる連結成分管理・縮約・静的graph等式制約のpotential伝播で得た考え方と実装を再利用し、potential・weighted DSUの発動条件・正当化・境界を重複なく学ぶ。

- potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC328 F「Good Set Query」](https://atcoder.jp/contests/abc328/tasks/abc328_f)
2. [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC328 F 公式解説](https://atcoder.jp/contests/abc328/editorial/7656)
- [ABC328 F 公式問題文](https://atcoder.jp/contests/abc328/tasks/abc328_f)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-potential-dsu`
