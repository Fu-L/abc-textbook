---
title: "frontier/profile DP・境界状態圧縮"
description: "「frontier/profile DP・境界状態圧縮」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 72
---

# frontier/profile DP・境界状態圧縮

難度の目安: **発展**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### frontier/profile DP・境界状態圧縮

走査済み領域と未走査領域の境界だけに未来へ影響する色・値の使用済みフラグ・接続partitionを保持し、必要なら同値な接続ラベルを正規化して幅指数で遷移する。

まずABC248 Fの幅2の接続状態を学び、ABC379 Gで最後の一行の色だけを保持する。次にABC309 Gでは位置iの近傍にある値の使用済みフラグを残す。窓から外れた値は未来の禁止辺に接続しないため、その使用状況を忘れても後続の選択肢は変わらない。

ABC309 Gは包除で固定する位置数kと、幅2X−1の窓のmaskを持つ部分matching計数である。未固定部分の(N−k)!と符号(−1)^kを最後に掛ける。指数部分を全体サイズNから帯幅Xへ移すことが核心である。

ABC296 Exでは色や使用済みbitだけでは足りず、境界上の黒マス同士が既に接続しているかをpartitionとして保持する。同じ接続関係のラベルを正規化し、成分が境界から消えると後から接続できないことも遷移条件に含める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、frontier/profile DP・境界状態圧縮の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC248 F「Keep Connect」](https://atcoder.jp/contests/abc248/tasks/abc248_f)
2. [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g)
3. [ABC379 G「Count Grid 3-coloring」](https://atcoder.jp/contests/abc379/tasks/abc379_g)
4. [ABC296 Ex「Unite」](https://atcoder.jp/contests/abc296/tasks/abc296_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC248 F 公式解説](https://atcoder.jp/contests/abc248/editorial/3794)
- [ABC248 F 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_f)
- [ABC296 H 公式解説](https://atcoder.jp/contests/abc296/editorial/6119)
- [ABC296 H 公式問題文](https://atcoder.jp/contests/abc296/tasks/abc296_h)
- [ABC309 G 公式解説](https://atcoder.jp/contests/abc309/editorial/6745)
- [ABC309 G 公式問題文](https://atcoder.jp/contests/abc309/tasks/abc309_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-frontier-profile-dp`
