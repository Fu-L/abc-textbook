---
title: "数値半群のconductor以後を一括到達とみなす"
description: "「数値半群のconductor以後を一括到達とみなす」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 177
---

# 数値半群のconductor以後を一括到達とみなす

習得対象の目安: **橙色（2400–2799）**。非負整数結合が十分先を覆う条件を証明し、有限prefixだけを調べる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第149単元。技能の説明を学んでから問題一覧へ進んでください。

前: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/) ／ 次: [巡回群を指数化して数える](/learn/number-theory/cyclic-group-exponent-counting/)

## 概要

### 数値半群・conductor

正の生成元の非負整数結合がconductor以後を全て覆うことを示し、巨大な到達判定を有限prefixへ縮約する。

### 習得する技能

- 正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。

生成元をgcdで正規化し、非負整数結合の到達集合がconductor以後の全整数を含むことを示して巨大距離を有限prefixへ縮約する。

### このUnitでは扱わないもの

- 負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。

## 問題一覧

1. [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC388 F 公式解説](https://atcoder.jp/contests/abc388/editorial/11910)
- [ABC388 F 公式問題文](https://atcoder.jp/contests/abc388/tasks/abc388_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-numerical-semigroup-reachability`
