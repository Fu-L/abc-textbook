---
title: "Robinson–Schensted対応・Young tableau"
description: "「Robinson–Schensted対応・Young tableau」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 213
---

# Robinson–Schensted対応・Young tableau

習得対象の目安: **赤色（2800以上）**。挿入対応とYoung図形を理解し、LIS・LDS条件をshapeの計数へ移す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Robinson–Schensted対応・Young tableau

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。

### 習得する技能

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

列の要素を行へ挿入し、置き換えられた値を次の行へ送るRSK対応で、順列を同じ形のtableau対へ写す。第一行長とLIS長の一致により、部分列制約をYoung diagramの形へ変えられる。

## 成立条件と計算量

同値要素の挿入規則で狭義・非狭義の対応が変わる。hook-length公式はstandard tableauの個数であり、一般の文字列の個数には別の係数が必要。形の列挙数とtableau評価費用を合わせる。

順列では一つのshape λに対応する二つのstandard tableauを選ぶため、shapeごとの順列数は(f^λ)²である。第一行長がLIS、第一列長がLDSに対応し、許すshapeを分類できる。追加の相対順序条件が付く場合はhook-lengthだけでなく、既に配置したcellが下方閉集合となるideal DPへ戻る。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-rsk-young-tableaux`
