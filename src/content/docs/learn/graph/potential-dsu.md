---
title: "potential・weighted DSU"
description: "「potential・weighted DSU」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 107
---

# potential・weighted DSU

習得対象の目安: **青色（1600–1999）**。DSUの親への差を保ち、経路圧縮・併合時の符号と矛盾判定を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### potential・weighted DSU

親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。

d[v]=potential(v)-potential(parent(v))と定義する。find時は旧親から根への差を加算してから親を根へ変更する。制約potential(y)-potential(x)=wで、根rx,ryへの差をdx,dyとすると、ryをrxの子にする辺差はw+dx-dy。逆向きに付けるなら符号を反転する。同根ならdy-dx=wとの整合性を検査する。

ABC328 Fは制約を順次追加して矛盾する追加を棄却するので、この不変量を直接学べる。全辺が先に与えられるABC280 FのDFSによるpotential伝播と非零cycle判定は静的potentialの節で扱う。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。

DSUによる連結成分管理・縮約・静的graph等式制約のpotential伝播で得た考え方と実装を再利用し、potential・weighted DSUの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC328 F「Good Set Query」](https://atcoder.jp/contests/abc328/tasks/abc328_f)
2. [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC328 F 公式解説](https://atcoder.jp/contests/abc328/editorial/7656)
- [ABC328 F 公式問題文](https://atcoder.jp/contests/abc328/tasks/abc328_f)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-potential-dsu`
