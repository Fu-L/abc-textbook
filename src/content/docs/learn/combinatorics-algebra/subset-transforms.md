---
title: "subset zeta・Möbius変換"
description: "「subset zeta・Möbius変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 187
---

# subset zeta・Möbius変換

習得対象の目安: **青色（1600–1999）**。集合の包含方向に一bitずつ和を集め、zeta変換と逆変換を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset zeta・Möbius変換

Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。

### 習得する技能

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

F[S]=Σ_{T⊆S}f[T]を、各bitを含むかの伝播へ分ける。zeta変換ではf[S]へf[S\{bit}]を加え、Möbius反転では同じ段を引き算して元へ戻す。


配列a=fを用意し、bit b=0,…,N−1の順に、そのbitが1の全mask Sで `a[S]+=a[S XOR (1<<b)]` を行う。処理済みbitは0/1両方を自由に選べ、未処理bitはSと一致するTだけを足した値、という不変量を保つ。最後には全T⊆Sの和になる。右辺はbit bが0で同段では更新されないので、maskの走査順に依存しない。

inverseは同じbitごとに同じ組で加算を減算へ替える。各段は各二要素組の可逆な三角変換で、異なるbitの段は可換なので同じbit順でも元へ戻る。superset和F[S]=Σ_{T⊇S}f[T]なら、bit bが0のSで `a[S]+=a[S OR (1<<b)]` と逆向きに伝播する。superset inverseもこの加算を減算へ替える。subsetとsupersetで更新する側が逆になることを添字で固定する。

## 成立条件と計算量

N bitに対しO(N·2^N)時間・O(2^N)空間。部分集合向きと上位集合向きを区別する。反転には加法逆元が必要で、min集約を同じ引き算で戻せない。更新前後の配列の意味を段ごとに保つ。

概念上の親: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。

このUnitを直接前提とする単元: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)。

集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC423 F「Loud Cicada」](https://atcoder.jp/contests/abc423/tasks/abc423_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。既習技能: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC349 F 公式解説](https://atcoder.jp/contests/abc349/editorial/9771)
- [ABC349 F 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-subset-transforms`
