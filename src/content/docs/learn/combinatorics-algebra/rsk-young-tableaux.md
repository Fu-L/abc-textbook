---
title: "Robinson–Schensted対応・Young tableau"
description: "「Robinson–Schensted対応・Young tableau」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 192
---

# Robinson–Schensted対応・Young tableau

習得対象の目安: **赤色（2800以上）**。挿入対応とYoung図形を理解し、LIS・LDS条件をshapeの計数へ移す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Robinson–Schensted対応・Young tableau

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。

### 習得する技能

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)（順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC378 G 公式解説](https://atcoder.jp/contests/abc378/editorial/11283)
- [ABC378 G 公式問題文](https://atcoder.jp/contests/abc378/tasks/abc378_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-rsk-young-tableaux`
