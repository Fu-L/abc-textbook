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

## 標準履修順

第66単元。技能の説明を学んでから問題一覧へ進んでください。

前: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/) ／ 次: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)

## 概要

### potential・weighted DSU

親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。

d[v]=potential(v)-potential(parent(v))と定義する。find時は旧親から根への差を加算してから親を根へ変更する。制約potential(y)-potential(x)=wで、根rx,ryへの差をdx,dyとすると、ryをrxの子にする辺差はw+dx-dy。逆向きに付けるなら符号を反転する。同根ならdy-dx=wとの整合性を検査する。

ABC328 Fは制約を順次追加して矛盾する追加を棄却するので、この不変量を直接学べる。全辺が先に与えられるABC280 FのDFSによるpotential伝播と非零cycle判定は静的potentialの節で扱う。

### 習得する技能

- DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)。

DSUによる連結成分管理・縮約・静的graph等式制約のpotential伝播で得た考え方と実装を再利用し、potential・weighted DSUの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC328 F「Good Set Query」](https://atcoder.jp/contests/abc328/tasks/abc328_f) — 主題: [potential・weighted DSU](/learn/graph/potential-dsu/)。
2. [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g) — 主題: [potential・weighted DSU](/learn/graph/potential-dsu/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC328 F 公式解説](https://atcoder.jp/contests/abc328/editorial/7656)
- [ABC328 F 公式問題文](https://atcoder.jp/contests/abc328/tasks/abc328_f)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-potential-dsu`
