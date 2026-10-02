---
title: "XOR線形基底"
description: "「XOR線形基底」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 193
---

# XOR線形基底

習得対象の目安: **青色（1600–1999）**。bit列をF₂ベクトルと見なし、pivot消去で独立性・表現可能性を管理し、affine cosetの最小代表を正規化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### XOR線形基底

整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。

### 習得する技能

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。

## 考え方

整数をF₂ベクトルと見なし、最高bitごとにpivotを保存する。新しい値からpivotをXORして消し、最後に非零なら独立な基底を追加する。各消去がspanを保つため表現可能性を判定できる。


basis[b]の最高bitをbとする。挿入xは高位bから、bit bが0なら通過、1でbasis[b]があればXORして消す。なければbasis[b]=xを置いて終了する。最後に0なら既存spanに属する。span内の最大値はres=0から高位順に `res XOR basis[b]>res` のときだけXORする。低位pivotは高位bitを変えないため、その桁の最良選択を固定できる。

reduced formは、低位pivot bから順に、それより高い各basis[c]にbit bがあればbasis[b]をXORして消して作る。各pivot列は対応基底だけが1となる。coset x+Vの正規化norm(x)は、xのpivot bitが1のとき対応基底をXORして全pivotを0にする。非零v∈Vの最高bitはpivotなので、norm(x) XOR vはそこで0→1となり必ず増える。従ってnorm(x)はcosetの一意な最小整数である。

一pivotの消去は `x→x XOR (x_b·basis[b])` というF₂線形写像であり、その合成normも線形。よってnorm(a XOR b)=norm(a) XOR norm(b)。同じ部分空間Vから自由にvを足せる比較なら `min_{v∈V}(a XOR b XOR v)=norm(a) XOR norm(b)` と各値を別々に正規化できる。二つの異なる部分空間や、選べるvを制限した問題にそのまま使うことはできない。

## 成立条件と計算量

B bit・N値でO(NB)、基底空間O(B)。coset最小代表は高位pivotで値を小さくする向きへ消去し、reduced formで一意な代表を得る。最小代表への写像と、自由な二値のXOR比較を同じ操作と誤解しない。

概念上の親: [線形方程式・基底・分離可能変換へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

整数をF_2 vectorとして最高bit pivotで消去し、独立性・最大XOR・表現可能性を管理する。基底をreduced formへ整えてaffine cosetの最小代表を求める方法も扱う。

### このUnitでは扱わないもの

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC283 G「Partial Xor Enumeration」](https://atcoder.jp/contests/abc283/tasks/abc283_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。）。既習技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（spanning treeのroot-to-vertex XOR potentialで辺ラベルをfundamental cycleのXORへ変換し、cycle spaceの線形像が非木辺ごとのcycle XORのspanと一致することを示して、walkへ挿入できるXOR値をbasisで表せる。） / [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。
- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC249 G「Xor Cards」](https://atcoder.jp/contests/abc249/tasks/abc249_g) — 主題: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f) — 主題: [matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)（独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [XOR線形基底](/learn/combinatorics-algebra/xor-linear-basis/)（整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC223 H 公式解説](https://atcoder.jp/contests/abc223/editorial/2784)
- [ABC223 H 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC249 G 公式解説](https://atcoder.jp/contests/abc249/editorial/3791)
- [ABC249 G 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-xor-linear-basis`
