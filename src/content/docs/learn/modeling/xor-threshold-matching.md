---
title: "XOR閾値matchingのbit分割再帰"
description: "「XOR閾値matchingのbit分割再帰」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 28
---

# XOR閾値matchingのbit分割再帰

習得対象の目安: **赤色（2800以上）**。XOR閾値ごとにpair可能数を最大化するbit分割再帰を組み立て、同一部分集合内と二集合間のmatching数を合成する根拠を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### XOR閾値matchingのbit分割再帰

固定閾値xに対し、XORがx以上となる最大pair数を求める。最上位bitで集合を分け、閾値bitが0なら確定できるcross pairを最大化し、1ならcross pairだけを残し、同一集合内と二集合間の再帰値を合成する。

### 習得する技能

- 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。

## 考え方

閾値xを固定する。f_d(C)を、C内で下位d+1 bitのXORが `x mod 2^{d+1}` 以上となる、要素を重複使用しない最大pair数とする。g_d(C,D)は同じ条件でCとDから一つずつ選ぶ最大pair数とする。C,Dは多重集合で、同じ値の要素も別の要素として扱う。

bit dが0,1の部分集合をC_0,C_1（Dも同様）とする。空集合なら0、d=−1では残る閾値が0なので `f_{-1}(C)=floor(|C|/2)`、`g_{-1}(C,D)=min(|C|,|D|)` となる。

### 閾値bitが1のとき

同じbit同士のXORは閾値未満で、違うbit同士だけが下位条件を残す。したがって

`f_d(C)=g_{d-1}(C_0,C_1)`、

`g_d(C,D)=g_{d-1}(C_0,D_1)+g_{d-1}(C_1,D_0)`。

後者の二つのmatchingは要素集合が互いに素なので、そのまま足せる。

### 閾値bitが0のときの同一集合

違うbit同士は下位bitによらず必ず許される。|C_0|≤|C_1|となるよう名前を入れ替え、a=|C_0|,b=|C_1|とする。このとき

`f_d(C)=a+min(floor((b-a)/2),f_{d-1}(C_1))`。

小さい側のa要素をすべてcross pairへ使い、大きい側から残すb-a要素の内部matchingを考える。ただし先に大きい側の任意要素を削除して再帰するのではない。C_1全体の最大matchingから必要な `min(floor((b-a)/2),f_{d-1}(C_1))` 組を残せば、その端点以外にcross用のa要素が確保できる。

crossを減らして小さい側の内部pairを増やしても得をしない。内部pair二つをcross二つへ置き換えられ、片側の内部pairと反対側の未使用要素がある場合もcrossへ置き換えられる。この交換で最大解をcross最大の形へ直せる。

### 閾値bitが0のときの二集合

`a=|C_0|, b=|C_1|, c=|D_0|, e=|D_1|` とする。二つの無条件cross部分の余剰を `r=a-e, s=b-c`、無条件pair数を `base=min(a,e)+min(b,c)` と置く。

- r,sが同符号、またはいずれか0なら `g_d=base`。余剰が同じ集合側にしか残らず、その集合の全要素を使う上界に既に達する。
- r>0,s<0なら `g_d=base+min(r,-s,g_{d-1}(C_0,D_0))`。
- r<0,s>0なら `g_d=base+min(-r,s,g_{d-1}(C_1,D_1))`。

追加再帰は余剰のある同bit二集合全体で行う。そのmatchingから必要な組数だけ端点を確保し、残りを無条件crossへ回すため、残余の要素を恣意的に選ぶ必要がない。

例えばr>0,s<0では、任意の解で使う同bit pairを00がu組、11がv組とする。cross pairは高々e-v組とb-v組なので、全体は `base+u-v≤base+g_{d-1}(C_0,D_0)`。さらに全C・全Dの要素数から `base+r`、`base-s` の上界も得る。上の構成はこの三上界の最小値を達成するので最適である。

## 成立条件と計算量

各再帰でbitごとに集合を分割する。同一深さの再帰へ渡す要素は互いに素で、gでも一要素が二つの再帰へ複製されないため、N要素・B bitの判定一回はO(NB)。目標pair数を作れるかはxに対して単調なので、閾値の二分探索全体はO(NB²)となる。

再帰式は最大個数を返す。実際のpairを復元するなら、再帰matchingから残す組とcrossへ回す要素も記録する。閾値bitが既に勝っているcrossには、下位の閾値条件を課さない。この二種類の再帰は[ABC304 G公式解説](https://atcoder.jp/contests/abc304/editorial/6509)の判定に対応する。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。

このUnitを直接前提とする単元: なし。

固定したXOR閾値でpair可能数を最大化する問題を、bitごとの同一集合内matchingと二集合間matchingへ分ける。閾値bitによる確定pairと下位bitへ残すpairを区別し、再帰式が最大数を保つ理由を証明する。

### このUnitでは扱わないもの

- 一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。
- 二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。

## 問題一覧

- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)（整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC304 G 公式解説](https://atcoder.jp/contests/abc304/editorial/6509)
- [ABC304 G 公式問題文](https://atcoder.jp/contests/abc304/tasks/abc304_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-xor-threshold-matching`
