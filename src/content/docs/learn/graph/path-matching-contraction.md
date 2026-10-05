---
title: "path matchingのheap縮約greedy"
description: "「path matchingのheap縮約greedy」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 127
---

# path matchingのheap縮約greedy

習得対象の目安: **橙色（2400–2799）**。選んだ辺の近傍を補正して縮約し、各cardinalityの最適値が得られる理由を示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### path matchingのheap縮約greedy

pathの非隣接edgeからk本を選ぶ最小重みmatchingを、最小edgeの採用と近傍二辺の補正縮約 w_l+w_r-w_i により全cardinalityについて順に求める。

列の非隣接な要素iを選ぶことは、頂点0,…,nのpathで辺(i-1,i)を選ぶmatchingと同値。ABC218 Hの最大化はw_i=-B_iで最小化へ写り、w_l+w_r-w_iの符号を戻すとB_l+B_r-B_iとなる。個数を固定するため、途中の負の限界利益を勝手に打ち切らない。

端の辺を採用したときは存在しない隣辺を通常の重み0として扱わない。その辺と唯一の隣辺を除き、内部のときだけ左右二辺と中央を補正辺へ置き換える。番兵を使う実装では実辺を表さないことと、無限値の加減算を避けることを確認する。ABC464 GとABC218 Hで端点と選択可能数を比較する。

### 習得する技能

- 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。

## 考え方

### 最適matchingを二つの形に正規化する

path Gの重み最小の辺iを選び、左右の隣辺をl,rとする。k≥1の最適matchingでiを使わない場合を考える。l,rのうち一本だけ使うなら、それをiへ置き換えても競合せず、w_iが最小なので費用は増えない。どちらも使わないなら、選択辺の一本をiへ置き換えればよい。よって「iを使う」または「l,rを両方使う」形の最適解が存在する。後者があるため、最初に選んだiが最終matchingに残るとは限らない。

内部の三辺l,i,rを取り除き、その区間の外側の二頂点をつなぐ補正辺jを重み `w'_j=w_l+w_r−w_i` で置いたpathをG'とする。他の辺はそのまま残す。

- iを使う形: iを外すとG'のk−1辺matchingになり、補正辺jは使わない。費用はw_iだけ減る。逆にjを使わないmatchingへiを足せば元のmatchingに戻る。
- l,rを両方使う形: l,rを補正辺jへ置き換えると辺数が一つ減る。外側の辺との競合はjがそのまま表し、費用も `w_l+w_r−w'_j=w_i` だけ減る。逆にjをl,rへ展開できる。

G'の全matchingはこのどちらかに展開でき、Gの最適解には正規化した形を選べる。両方向から上界・下界が一致して `OPT_G(k)=w_i+OPT_G'(k−1)` を得る。この式が全ての実行可能なk≥1で成り立つことが、各cardinalityを順番に求められる理由である。

端のiには隣辺が高々一本しかなく、最適解をiを使う形へ必ず交換できる。その場合はiと存在する隣辺を削除するだけで、同じ対応式が成り立つ。残りが複数成分になってもpathの森として同じ局所対応を使える。k=0の最適値は0で、対応式は適用しない。

### 限界費用の列と解の復元

各回の現在の最小重みを累積すると、1辺、2辺、…の最適費用が得られる。補正辺の重みはw_l,w_rのどちら以上にもなるので、取り出す限界費用は非減少。元の重みが(2,1,2)なら、最初の値は1、次の補正辺は2+2−1=3で、2辺の最適費用は1+3=4。二回目は中央1を左右2,2へ置き換えたことを表す。これは中央を永久に固定するgreedyではない。

復元では各縮約について、採用したiとl,r、補正辺jを記録する。目的のK回までの操作を逆順に辿り、縮約後のmatchingがjを含めばjを外してl,rを採用、含まなければiを採用する。端の縮約ではiを採用する。補正辺自身が過去の縮約から作られた場合も、この逆順の対応を展開すれば元辺へ戻せる。

## 成立条件と計算量

N辺・K回の縮約では、heapで最小辺を選び、双方向linkでl,rを取得・削除・接続する。各回で定数個の辺だけを無効化・追加するのでO((N+K) log N)、記憶はO(N+K)。辺IDまたは版番号で古いheap要素を捨てる。逆順の復元も各記録に定数回の更新でO(N+K)。端点に架空の重み0を足さず、実辺がなくなったらその先のcardinalityは実行不能とする。

重みの符号に制約はなく、固定個数の最大化は符号反転で扱える。ただし、負の限界利益が出ても指定個数までは処理する。証明はpathの局所競合に依存し、一般graphへこの縮約式を適用できない。[ABC464 G公式解説](https://atcoder.jp/contests/abc464/editorial/22263)の距離列とABC218 Hの利益列も、この費用保存対応で比較する。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)、[priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。

このUnitを直接前提とする単元: なし。

path matchingの交互構造を使い、最小edgeの採用後も残りの全cardinality最適値を保存する補正縮約を導いてheapと双方向linkで実装する。

### このUnitでは扱わないもの

- path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC464 G 公式解説](https://atcoder.jp/contests/abc464/editorial/22263)
- [ABC464 G 公式問題文](https://atcoder.jp/contests/abc464/tasks/abc464_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-path-matching-contraction`
