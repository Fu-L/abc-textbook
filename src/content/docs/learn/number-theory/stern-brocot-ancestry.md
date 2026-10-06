---
title: "Stern–Brocot木の経路と祖先"
description: "「Stern–Brocot木の経路と祖先」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 177
---

# Stern–Brocot木の経路と祖先

習得対象の目安: **橙色（2400–2799）**。mediantの移動をEuclidの商で圧縮し、巨大な経路と祖先集合を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Stern–Brocot木の経路と祖先

隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。

隣接するa/b<c/dのbc-ad=1を不変量にmediant(a+c)/(b+d)を挿入する。左右への一歩を巨大回数繰り返す代わりにEuclidの商で一括移動する。ABC273 Exでは必要な祖先集合を合併して数える工程までが対象で、分母上限の最良近似は求めていない。

### 習得する技能

- 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

正の既約分数P/Qを扱う。境界a/b=0/1、c/d=1/0から始め、現在の木の頂点をmediant(a+c)/(b+d)とする。根は1/1。目標がmediantより小さければ左へ進んで上端をmediantへ、大きければ右へ進んで下端をmediantへ置き換える。bc−ad=1は両操作で保存される。

### 残りの座標をEuclidで減らす

現在の境界を基底として、目標をP=q a+p c、Q=q b+p dと表す正整数p,qを持つ。初期境界ではp=P、q=Qである。行列式1の基底変換なのでgcd(p,q)=1が保たれ、目標とmediantの大小はpとqの大小に一致する。

- p>qなら右へt=floor((p−1)/q)回進む。下端は(a+t c)/(b+t d)へ変わり、残りの座標はp←p−t qとなる。
- p<qなら左へt=floor((q−1)/p)回進む。上端は(c+t a)/(d+t b)へ変わり、残りの座標はq←q−t pとなる。
- p=qなら、互いに素なのでp=q=1。現在のmediantが目標そのものであり、ここで終了する。

−1を入れるのは、更新後の座標を正に保ち、目標の頂点を通り過ぎないためである。例えばP/Q=3/1では右runは2であり、floor(3/1)=3回では根1/1から目標3/1を越えて4/1へ進んでしまう。各runを「方向・回数」として計算順に記録すれば、根から目標への経路を得る。逆順へ並べ替えない。

例えば5/2では(R,2)でp=1,q=2、次に(L,1)でp=q=1となる。境界を同時に更新すると根1/1から2/1、3/1、5/2へ進んでいることが分かる。経路を展開しなくても、run途中の祖先は同じ一括式で復元できる。

### 共通prefixと祖先集合

深さはrun長の合計であり、根の深さを0とする。二経路を先頭から比較し、方向が同じなら短い方の残りrun長だけ共通prefixへ加える。長い方には差分を残して次を比較し、方向が異なるか一方の経路が尽きたら止める。その共通prefixの末端がLCAであり、片方の全経路が共通prefixならその頂点は他方の祖先である。異なる長さのrunの途中がLCAになる場合も落とさない。

複数の頂点について根を含む祖先集合の和集合を数えるには、経路をL<Rの辞書順で並べ、prefixは延長より先に置く。最初の経路は深さ+1個、それ以降の経路sはdepth(s)−共通prefix長(s,直前の経路)個を追加する。辞書順では同じprefixを持つ経路が連続するため、既存集合と共有する最長prefixは直前の経路だけで分かる。重複頂点は追加数0になる。

## 成立条件と計算量

U=max(P,Q)として一経路の構成・保存はO(log U)時間・空間。商を取り出す更新はEuclidの剰余更新と同じ減少を持つが、最後は0にせず1,1で止まる。祖先比較もO(log U)。K経路を通常の比較sortで並べて祖先集合を数えるならO(K log K log U)時間、O(K log U)空間が上界となる。深さや和集合サイズはUに比例する場合があるので、runの合計が入る型を使う。0/1・1/0は境界としてのみ使い、正分数の頂点へ数えない。未約分なら最初にgcdで割る。特定の問題で各祖先へ別の集計を行う費用は、この経路構成費用とは別に評価する。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)。

このUnitを直接前提とする単元: なし。

gcd不変量・差分構造で得た考え方と実装を再利用し、Stern–Brocot木の経路と祖先の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。

## 問題一覧

- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)（隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-stern-brocot-ancestry`
