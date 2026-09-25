---
title: "繰り上がり・借り・混合基数を状態にするDP"
description: "「繰り上がり・借り・混合基数を状態にするDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 76
---

# 繰り上がり・借り・混合基数を状態にするDP

習得対象の目安: **青色（1600–1999）**。繰り上がりや借りだけを次の桁へ渡し、通常の桁DPと異なる走査方向を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第45単元。技能の説明を学んでから問題一覧へ進んでください。

前: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/) ／ 次: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)

## 概要

### 繰り上がり・混合基数DP

整除鎖の丸め、支払いと釣銭、複数項の加算を下位桁から処理し、次の桁へ渡すcarry・borrowだけを状態に保つ。

### 習得する技能

- 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態設計を土台に、整除鎖の丸めや複数項の加算で次の桁へ渡すcarryだけを有限状態として保つ。

### このUnitでは扱わないもの

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 問題一覧

1. [ABC231 E「Minimal payments」](https://atcoder.jp/contests/abc231/tasks/abc231_e) — 主題: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g) — 主題: [potential・weighted DSU](/learn/graph/potential-dsu/)。

## 根拠

- [ABC231 E 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_e)
- [ABC231 E 公式解説](https://atcoder.jp/contests/abc231/editorial/3062)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-carry-mixed-radix`
