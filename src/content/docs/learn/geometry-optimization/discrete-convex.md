---
title: "凸性・傾き・限界費用・slope trick"
description: "前提から凸性・傾き・限界費用・slope trickを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 90
---

# 凸性・傾き・限界費用・slope trick

このページは **節** です。下位単元が扱う技能を比較し、発動条件・不変量・計算量の違いから学習経路を選ぶための構造単元です。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 直接所有するOutcomeはありません。この単元では下位単元の選択と学習順を扱います。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。

### この単元では扱わない範囲

- 真偽値の単調境界探索と、交換論だけで決まる貪欲順。

## 下位単元と学習順

以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。

1. [一次元凸・単峰最適化](./basic-convex-optimization.md)（標準順 122）— 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
2. [分離凸・凹の単調限界値選択](./separable-convex-marginals.md)（標準順 154）— 離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。
3. [slope trick](./slope-trick.md)（標準順 184）— 一次元凸・単峰最適化で得た考え方と実装を再利用し、slope trickの発動条件・正当化・境界を重複なく学ぶ。
4. [Lagrangian relaxation・Aliens trick](./lagrangian-relaxation.md)（標準順 195）— 一次元凸・単峰最適化で得た考え方と実装を再利用し、Lagrangian relaxation・Aliens trickの発動条件・正当化・境界を重複なく学ぶ。
5. [isotonic regression・PAV](./isotonic-regression.md)（標準順 196）— 一次元凸・単峰最適化で得た考え方と実装を再利用し、isotonic regression・PAVの発動条件・正当化・境界を重複なく学ぶ。
6. [Monge・monotone minima最適化](./monge-optimization.md)（標準順 198）— DP遷移の集約・高速化で得た考え方と実装を再利用し、Monge・monotone minima最適化の発動条件・正当化・境界を重複なく学ぶ。

## 発動条件と見分け方

この構造単元はTagを直接所有しません。下位単元の定義と対象外を比較して学習経路を選びます。

## ガイド例

- 通常のOutcomeガイド例は下位単元で扱います。

## 下位単元を使い分ける比較例

未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。

- **一次元凸・単峰最適化** — 直接到達点: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: 一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **分離凸・凹の単調限界値選択** — 直接到達点: 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。近いが対象外: 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **slope trick** — 直接到達点: 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **Lagrangian relaxation・Aliens trick** — 直接到達点: 個数制約へpenalty λを加えたoracleを解き、最適解の個数単調性とtie-breakを使って元の制約付き最適値を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **isotonic regression・PAV** — 直接到達点: 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。
- **Monge・monotone minima最適化** — 直接到達点: quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。近いが対象外: Monge・monotone minima最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

**比較の到達点**: 未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。


## 転用するときの確認

- なし

## 到達確認

- 直接所有するOutcomeの到達確認はありません。

### 学習経路の選択

**課題**: 未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。

**合格条件**: 採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。


## 解答と自己評価基準

- 直接所有するOutcomeの解答基準はありません。

<details><summary>学習経路の選択の解答基準</summary>

**検証状態**: `pending` — これは T057 の学習経路レビュー前に使う自己評価基準であり、検証済みとは扱いません。

正解は一つの単元名ではなく、問題構造と各候補の定義・対象外との照合である。下位単元のOutcome自体の到達確認はそれぞれの所有Unitで行う。

- 問題を対象・操作・保つ量・求める量へ分解する。
- 各下位単元の発動条件を一つずつ照合し、不足情報を明示する。
- 採用候補の成立理由と、近い候補の最初の破綻点を対にする。
- 前提DAGと標準順を確認し、選んだ経路の最初の単元を決める。

期待する到達点: 未知問に対する学習経路を、発動条件・棄却理由・前提順とともに再現できる。

</details>


## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-discrete-convex`
