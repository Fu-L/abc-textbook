---
title: "有限状態automatonの構成"
description: "「有限状態automatonの構成」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 155
---

# 有限状態automatonの構成

習得対象の目安: **青色（1600–1999）**。suffixや進行状況を状態に選び、全ての文字に対する遷移を構成する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第68単元。技能の説明を学んでから問題一覧へ進んでください。

前: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/) ／ 次: [区間monoid要約](/learn/query/range-monoid-aggregation/)

## 概要

### 有限状態automatonの構成

文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。

ABC301 FはDDoS型の部分列を含まない埋め方を求める。禁止部分列を完成させない状態を足すのが答えである。DD??Sでは二つとも大文字の場合だけ許され、26²=676。全52²から676を引くと禁止される側を数えてしまう。

### 習得する技能

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

## 根拠

- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-finite-pattern-automaton`
