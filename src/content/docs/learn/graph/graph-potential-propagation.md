---
title: "静的graph等式制約のpotential伝播"
description: "「静的graph等式制約のpotential伝播」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 94
---

# 静的graph等式制約のpotential伝播

習得対象の目安: **水色（1200–1599）**。辺の差やXORを伝播し、閉路の整合性と成分ごとの自由度を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 静的graph等式制約のpotential伝播

辺が「片方の頂点値が決まれば、もう片方も決まる」という等式を表すとき、一つの根からDFS・BFSで値を伝播できる。別の経路から同じ頂点へ来たときも同じ値になるかを調べれば、全制約が両立するか分かる。

扱う等式は $$x_v=x_u\odot w$$ の形で、$$x_u,x_v$$ は頂点の値、$$w$$ は辺の重みである。$$\odot$$ は、この単元では加法 $$+$$ またはビットごとの排他的論理和（XOR）$$\oplus$$ を表す。加法なら $$x_v-x_u=w$$、XORなら $$x_u\oplus x_v=w$$ と同じ意味になる。

根の値を仮に0として求めた相対値を**ポテンシャル** $$p_v$$ と呼ぶ。実際の根の値はまだ自由で、その値を成分全体へ反映する共通の調整値を **offset** $$t$$ と呼ぶ。加法では全頂点に $$t$$ を足し、XORでは全頂点に $$t$$ をXORする。この自由度を残しておくと、等式を満たすかの判定と、解の最適化を分けて考えられる。

### 習得する技能

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

## 考え方

### 加法：根からの差を足し上げる

三頂点の独自例として、次の制約を考える。

$$
x_2-x_1=2,\qquad x_3-x_2=3,\qquad x_3-x_1=5
$$

頂点1を根にして $$p_1=0$$ と置く。辺 $$1\to2$$ から $$p_2=2$$、辺 $$2\to3$$ から $$p_3=5$$ と決まる。残る辺 $$1\to3$$ でも $$p_3=p_1+5=5$$ なので一致する。未訪問の頂点では値を割り当て、訪問済みの頂点では既存の値と照合する、という操作で全辺を検査すればよい。

逆向きには $$x_u=x_v-w$$ なので、重み $$w$$ の辺 $$u\to v$$ に対し、逆辺 $$v\to u$$ の重みは $$-w$$ にする。この例の閉路 $$1\to2\to3\to1$$ の和は $$2+3-5=0$$ である。最後の制約だけを $$x_3-x_1=6$$ に変えると、頂点3への二経路が5と6を要求し、閉路和も $$2+3-6=-1$$ となる。このとき等式系に解はない。

整合する例の全解は $$x=(t,t+2,t+5)$$ である。根の値を $$t$$ に変えると、どの頂点も同じだけ平行移動する。同じ成分内の差は変わらない。

### XOR：根からのXORを累積する

今度は、同じ三頂点に次の制約を置く。

$$
x_1\oplus x_2=1,\qquad x_2\oplus x_3=0,\qquad x_1\oplus x_3=1
$$

XORは同じ値を二度適用すると打ち消し合う。従って $$x_v=x_u\oplus w$$ の逆向きも $$x_u=x_v\oplus w$$ であり、逆辺の重みは符号を変えず $$w$$ のままにする。

$$p_1=0$$ から伝播すると $$p_2=0\oplus1=1$$、$$p_3=1\oplus0=1$$ となる。直接の辺 $$1\to3$$ でも $$0\oplus1=1$$ と一致し、閉路のXORは $$1\oplus0\oplus1=0$$ になる。最後の制約だけを $$x_1\oplus x_3=0$$ に変えると、頂点3の値が二経路で1と0に分かれ、閉路XORも1となって解がなくなる。

整合する例の全解は $$x=(t,1\oplus t,1\oplus t)$$ である。例えば $$t=1$$ なら $$x=(1,0,0)$$ となる。加法の平行移動とは異なり、$$t$$ の立っているbitを全頂点で反転する操作になる。

### 各成分に残る自由度を取り出す

どちらの演算でも、未訪問の根を選ぶたびに0を置き、成分内の頂点を探索する。割当て時に訪問済みと記録し、探索中に出会う全ての辺で等式を照合する。ここでのBFSは最短距離を求めるためではなく、等式を伝えるための探索である。

検査に通ったなら、加法では $$x_v=p_v+t$$、XORでは $$x_v=p_v\oplus t$$ とすれば、共通の $$t$$ が差やXORから打ち消されて全辺の等式を満たす。逆に、どの解も根の値 $$t$$ を決めれば辺の伝播で全頂点の値が決まるので、この形で全解を表せる。照合に失敗した辺があれば、どの $$t$$ を選んでも二経路の不一致は解消しない。

別の連結成分との間には辺がないので、成分ごとに独立した $$t$$ を選べる。孤立点も一頂点の成分として扱う。値の範囲や総和最小化などの追加条件がある場合は、この残った自由度へ条件を課す。

## 成立条件と計算量

前提は、辺が加法またはXORの等式を指定し、逆向きにも一意に値を戻せること。両者で検査する条件と全解の形を混ぜない。

| 確認するもの | 加法 | XOR |
| --- | --- | --- |
| 逆辺の重み | $$-w$$ | $$w$$ |
| 閉路の整合条件 | 重みの和が0 | 重みのXORが0 |
| 頂点値の全解 | $$p_v+t$$ | $$p_v\oplus t$$ |

自己ループや多重辺も検査対象になる。加法の累積値は一つの辺重みより大きくなりうるため、経路全体の和が収まる整数型を用意する。XORでは入力の重みを表せるbit幅を確保する。一回の演算を定数時間とすると、$$V$$ 頂点 $$E$$ 辺の隣接リストの構築と伝播は、全成分を合わせて時間・空間ともに $$O(V+E)$$。成分ごとの最適化に必要な計算量は別に評価する。

大小の不等式では、一方の値を決めても他方は一意に決まらないので、この伝播だけでは解けない。また、追加条件まで自動で満たせるわけではない。[ABC396 Eの解説](/problems/abc396-e/)では共通XORの各bitを選んで総和を最小化し、[ABC352 Fの解説](/problems/abc352-f/)では相対順位を求めた後に成分の配置を考える。

[ABC280 Fの解説](/problems/abc280-f/)では、辺は移動による得点の増減を表す。加法の閉路和が非零なら、全辺を満たす頂点値の等式系は不整合である。一方、原問題では辺を何度でも往復でき、非零の閉路を正の利得になる向きで繰り返せる。その成分内の始点・終点への移動を前後に付ければ、得点をいくらでも増やせるため答えが `inf` になる。これは移動の得点を最大化する問題固有の結論であり、等式制約に解があるという意味ではない。

概念上の親: [連結成分を管理し縮約する](/learn/graph/connectivity/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: [potential・weighted DSU](/learn/graph/potential-dsu/)。

通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

### このUnitでは扱わないもの

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC280 F「Pay or Receive」](https://atcoder.jp/contests/abc280/tasks/abc280_f) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。

## 根拠

- [ABC280 F 公式解説](https://atcoder.jp/contests/abc280/editorial/5303)
- [ABC280 F 公式問題文](https://atcoder.jp/contests/abc280/tasks/abc280_f)
- [ABC352 F 公式解説](https://atcoder.jp/contests/abc352/editorial/9924)
- [ABC352 F 公式問題文](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC396 E 公式問題文](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 E 公式解説](https://atcoder.jp/contests/abc396/editorial/12390)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-graph-potential-propagation`
