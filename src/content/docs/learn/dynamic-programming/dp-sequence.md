---
title: "列・subsequence DP"
description: "「列・subsequence DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 63
---

# 列・subsequence DP

習得対象の目安: **緑色（800–1199）**。選ぶ・選ばない遷移と最後の要素を状態にし、同じ要素の重複利用を避ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 列・subsequence DP

列のprefixや最後に選んだ要素を状態にし、順序を保つ選択を組み立てる。

左から処理し、未来の延長可能性が等しい履歴を同じ状態へまとめる。ABC327 Eでは選択個数jと重み付き得点の最大値を持ち、各要素で選ぶ・選ばないを更新する。同じ要素を再使用しないようjを降順に走査する。

最後の位置、選択数、差分など、未来の可否や報酬に影響する情報を残す。LISの長さ別最小末尾への圧縮は、この一般の状態設計に支配関係を追加して導く。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC327 E「Maximize Rating」](https://atcoder.jp/contests/abc327/tasks/abc327_e)
2. [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e)
3. [ABC362 E「Count Arithmetic Subsequences」](https://atcoder.jp/contests/abc362/tasks/abc362_e)
4. [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f)
5. [ABC238 F「Two Exams」](https://atcoder.jp/contests/abc238/tasks/abc238_f)
6. [ABC299 F「Square Subsequence」](https://atcoder.jp/contests/abc299/tasks/abc299_f)
7. [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f)
8. [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g)

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC225 F 公式解説](https://atcoder.jp/contests/abc225/editorial/2833)
- [ABC225 F 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC238 F 公式解説](https://atcoder.jp/contests/abc238/editorial/3354)
- [ABC238 F 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-sequence`
