---
title: "探索空間を分けて照合・再帰分割する"
description: "探索空間を分けて照合・再帰分割するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 51
---

# 探索空間を分けて照合・再帰分割する

## 概要

下位の単元を、前提を満たす順にまとめます。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

探索空間を独立な二集合または再帰部分へ分けるか、部分結果をbalancedな積木・remainder tree・CDQで合成し、重複なく扱える入力規模を広げる。

- 候補数を制約・生成パラメータ・有限caseで直接界して全列挙する探索、軽重分類による償却解析、および入力木・trie・区間DPの構造をそのまま辿るだけの再帰。

## 下位単元

- [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)
- [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h)
- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f)
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g)
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g)
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g)
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g)
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g)
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-divide-enumeration`
