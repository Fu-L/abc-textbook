---
title: "frontier/profile DP・境界状態圧縮"
description: "「frontier/profile DP・境界状態圧縮」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 70
---

# frontier/profile DP・境界状態圧縮

習得対象の目安: **黄色（2000–2399）**。境界から離れた情報を忘れ、接続関係を正規化した幅指数の状態を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### frontier/profile DP・境界状態圧縮

走査済み領域と未走査領域の境界だけに未来へ影響する色・値の使用済みフラグ・接続partitionを保持し、必要なら同値な接続ラベルを正規化して幅指数で遷移する。

まずABC248 Fの幅2の接続状態を学び、ABC379 Gで最後の一行の色だけを保持する。次にABC309 Gでは位置iの近傍にある値の使用済みフラグを残す。窓から外れた値は未来の禁止辺に接続しないため、その使用状況を忘れても後続の選択肢は変わらない。

ABC309 Gは包除で固定する位置数kと、幅2X−1の窓のmaskを持つ部分matching計数である。未固定部分の(N−k)!と符号(−1)^kを最後に掛ける。指数部分を全体サイズNから帯幅Xへ移すことが核心である。

ABC296 Exでは色や使用済みbitだけでは足りず、境界上の黒マス同士が既に接続しているかをpartitionとして保持する。同じ接続関係のラベルを正規化し、成分が境界から消えると後から接続できないことも遷移条件に含める。

### 習得する技能

- 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)、[最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)、[部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。

このUnitを直接前提とする単元: なし。

DPの最小十分状態で得た考え方と実装を再利用し、frontier/profile DP・境界状態圧縮の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC248 F「Keep Connect」](https://atcoder.jp/contests/abc248/tasks/abc248_f) — 主題: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。
- [ABC379 G「Count Grid 3-coloring」](https://atcoder.jp/contests/abc379/tasks/abc379_g) — 主題: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC296 Ex「Unite」](https://atcoder.jp/contests/abc296/tasks/abc296_h) — 主題: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

## 根拠

- [ABC248 F 公式解説](https://atcoder.jp/contests/abc248/editorial/3794)
- [ABC248 F 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_f)
- [ABC296 H 公式解説](https://atcoder.jp/contests/abc296/editorial/6119)
- [ABC296 H 公式問題文](https://atcoder.jp/contests/abc296/tasks/abc296_h)
- [ABC309 G 公式解説](https://atcoder.jp/contests/abc309/editorial/6745)
- [ABC309 G 公式問題文](https://atcoder.jp/contests/abc309/tasks/abc309_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-frontier-profile-dp`
