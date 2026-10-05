---
title: "heavy path上の多項式木DP"
description: "「heavy path上の多項式木DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 145
---

# heavy path上の多項式木DP

習得対象の目安: **橙色（2400–2799）**。多項式の木DPをheavy path上の合成にまとめ、軽い部分木の総費用を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### heavy path上の多項式木DP

heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。

ABC269 Exではheavy path上の多項式漸化式を積と合成へまとめ、畳み込みと分割統治で評価する。必要なのは通常の多項式積を高速化できる代数構造であり、一般のmax-plus convolutionをNTTへ置き換えることはできない。

### 習得する技能

- heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

根付き木のantichain、すなわち祖先・子孫を同時に選ばない頂点集合を、選んだ数ごとに数える。部分木vの生成多項式をF_v(x)とすると、vを選ぶ場合は{x}だけ、選ばない場合は各子から独立に選べるので `F_v=x+Π_{u:子}F_u`。空積は1で、葉は1+xになる。

### heavy childへの依存をaffine写像にする

部分木サイズが最大の子hをheavy childにし、light childの結果から `G_v=Π_{u:light child}F_u` を作る。すると `F_v=G_v F_h+x`。heavy childがない場合はF_h=1とする。

heavy path上の各頂点は、多項式を受け取る写像 `T_v(z)=G_v z+x` を持つ。上区間の要約(A,B)と下区間の要約(C,D)を合成すると `(AC,AD+B)`。したがってpath全体を分割統治で合成し、最下端の入力1を代入してA+Bを得れば、path先頭のFが求まる。多項式積にはNTTを使えるが、合成自体の順序は上から下へ固定する。

例えば二頂点のpathなら `T_1(T_2(1))=G_1G_2+xG_1+x` となり、頂点ごとに大きい多項式へxを足して掛け直す必要がない。長い一本のpathではG_v=1なので、答えは1+（path長）xになる。

### light側を完成させてからpathを一括評価する

まず全部分木サイズとheavy childを求める。各heavy pathについて、付いているlight部分木のpathを再帰的に評価して先頭のF_uを得る。各頂点のG_vはlight childの多項式を釣り合った積木で掛けて作り、その後T_vの列を釣り合った合成木で評価する。

heavy pathの途中の全F_vを展開して保存すると、同じ巨大な係数列を繰り返し作る。ここではlight childとなるpath先頭と木の根だけを具体的な多項式へ戻す。途中は写像の列として保持する。次数はそれぞれの担当部分木サイズ以下に制限し、答えをK個以下だけ求めるならmin(K,担当サイズ)まで切り詰める。

## 成立条件と計算量

一つのpathと、そのlight部分木のサイズ総和をsとする。頂点vへ `1+Σ size(light child)` の次数予算を割り当てると、その和はs。均等な合成木の同じ深さで扱う区間は互いに素で、次数予算の総和もO(s)になる。畳み込み費用M(d)=O(d log d)なら一段O(s log s)、O(log s)段でpath評価はO(s log² s)。light側の積木も同じ次数予算で評価できる。

各元頂点は、根からその頂点へ至るlight edgeの数だけpath先頭の部分木に重複して属する。この数はO(log N)なので、全path先頭の部分木サイズの和はO(N log N)。したがってこの素直な構成の全体上界はO(N log³ N)である。次数に応じた重み付き合成でさらに改善できるが、この本文の分割法へその上界を無条件には付けない。

これは通常の多項式積と加算を持つ漸化式の高速化である。一般のmax-plus mergeにはNTTを使えない。典型的なantichainへの適用は[ABC269 Ex公式解説](https://atcoder.jp/contests/abc269/editorial/4838)を参照できる。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（後の章）、[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

このUnitを直接前提とする単元: なし。

畳み込み・相互相関・根付き木DP・部分木集約で得た考え方と実装を再利用し、heavy path上の多項式木DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)（heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC269 H 公式解説](https://atcoder.jp/contests/abc269/editorial/4838)
- [ABC269 H 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-heavy-path-tree-dp`
