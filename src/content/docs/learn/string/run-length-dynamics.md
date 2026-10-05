---
title: "run-length状態の動的遷移"
description: "「run-length状態の動的遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 160
---

# run-length状態の動的遷移

習得対象の目安: **青色（1600–1999）**。runのsplit・mergeと長さを管理し、一操作と全体のrun数の変化を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### run-length状態の動的遷移

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。

### 習得する技能

- 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

同じ文字や同じ値が続く区間をrunとして持ち、操作によって変わる端点・隣接runだけ更新する。分割・削除・合併の後も、隣接runの値が異なるという正規形を保つ。


位置を変えない列ならrunを半開区間[l,r)と値vでordered mapの左端lへ索引化する。区間[L,R)への代入では、まずL,Rがrun内部ならsplitして境界にする。区間内のrunを全て消し新しい一runを入れ、同値の左右隣接runと併合する。split後も区間の和集合は元の区間で、長さの合計も保存する。

列の両端へ追加・削除するだけなら(value,length)のdequeで足りる。追加値が端runと同じなら長さへ足し、違えば新runを作る。k個の削除は端run長とのminだけ消費し、長さ0ならpopして残りを次runへ進める。各runは一回生成・消滅するため総run走査は生成数で界せる。途中への挿入で全後続座標が変わる場合は、固定左端のmapだけでは済まず、長さ付き平衡木など位置を扱う構造が必要になる。

## 成立条件と計算量

run数Rに対するordered mapでは一操作O(log R)に実際に触るrun数を加える。大量のrunを走査する場合は、消滅数や生成数で総作業量を償却証明する。圧縮表現だけで全操作O(log N)とは主張できない。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC313 E「Duplicate」](https://atcoder.jp/contests/abc313/tasks/abc313_e) — 主題: [run-length状態の動的遷移](/learn/string/run-length-dynamics/)（同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC313 E 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_e)
- [ABC313 E 公式解説](https://atcoder.jp/contests/abc313/editorial/6911)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-run-length-dynamics`
