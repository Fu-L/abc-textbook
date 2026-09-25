---
title: "Robinson–Schensted対応・Young tableau"
description: "「Robinson–Schensted対応・Young tableau」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 188
---

# Robinson–Schensted対応・Young tableau

習得対象の目安: **赤色（2800以上）**。挿入対応とYoung図形を理解し、LIS・LDS条件をshapeの計数へ移す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第195単元。技能の説明を学んでから問題一覧へ進んでください。

前: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/) ／ 次: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)

## 概要

### Robinson–Schensted対応・Young tableau

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。

### 習得する技能

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC378 G 公式解説](https://atcoder.jp/contests/abc378/editorial/11283)
- [ABC378 G 公式問題文](https://atcoder.jp/contests/abc378/tasks/abc378_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-rsk-young-tableaux`
