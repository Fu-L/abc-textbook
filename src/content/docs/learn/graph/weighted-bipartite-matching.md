---
title: "重み付き二部完全matching"
description: "「重み付き二部完全matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 125
---

# 重み付き二部完全matching

習得対象の目安: **黄色（2000–2399）**。assignmentの双対potentialとtight edgeを理解し、Hungarian法や費用流を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 重み付き二部完全matching

assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。

### 習得する技能

- assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 双対下界とtightな辺

左右N頂点の完全割当てを考え、辺(i,j)の費用をc_ijとする。左potential u_i・右potential v_jについて `u_i+v_j≤c_ij` を保つ。これが双対の実行可能性であり、どの完全matchingの費用も各頂点を一回ずつ使うため `Σ_i u_i+Σ_j v_j` 以上である。等号の辺をtightと呼ぶ。tightな辺だけの完全matchingができればこの下界を達成し、最小費用が証明できる。

全許可辺で `u_i=min_j c_ij,v_j=0` と初期化し、matchingは空とする。許可辺がない左頂点があれば不可能。以後はtight辺だけを選ぶ。最大化は費用の符号を反転して最小化へ戻す。

### 交互木を伸ばすpotential更新

未使用の左頂点rを根に、未選択のtight辺を左→右、選択辺を右→左へたどる交互木を作る。到達した左集合をS、右集合をTとする。未使用右頂点へ着けば親辺を逆にたどり、増加路の選択・非選択を反転する。

まだ増加できないとき、Tの全右頂点は使用済みでその相手はS、Sのr以外の全頂点はTの相手である。そこで `Δ=min_{i∈S,j∉T}(c_ij−u_i−v_j)`（許可辺だけ）とし、u_iをS内でΔ増やし、v_jをT内でΔ減らす。S×Tの和は変わらず、S×(R∖T)では最小slackだけ増えるため制約を破らない。Sの外からTへの和は減るので安全である。全matching辺は両端が到達済みか両端未到達なので、tightのまま保たれる。

新たにslack=0になった右頂点へ交互木を伸ばす。候補辺が一本もなければHall条件を破るSがあり完全割当ては不可能である。完全二部グラフなら、N回の増加で必ず完全matchingとなり、tight性から最適になる。

### O(N³)へ抑えるslackの持ち方

一回の増加探索中、各j∉Tに `slack[j]=min_{i∈S}(c_ij−u_i−v_j)` と、その最小値を作る左頂点を持つ。根rの行から初期化し、Δ更新で全j∉TのslackからΔを引く。slack=0のjをTへ入れ、使用済みならその相手iをSへ入れてiの行で各slackをmin更新する。未使用なら記録した親で増加する。各右頂点を高々一回追加し、一回あたりO(N)で行とslackを走査するので、一増加O(N²)、全N増加O(N³)となる。

min-cost flowへの帰着ではs→左、左i→右j、右→tを全て容量1とし、中央辺だけ費用c_ij、他は0とする。流量Nの整数flowと完全matchingが費用を保って対応し、中央辺の流量1をmatchingへ戻せる。potential付き最短路の詳細は[最小費用流](/learn/graph/min-cost-flow/)で学ぶ。このUnitの双対条件・tight性は、上の交互木算法だけでも再構成できる。

## 成立条件と計算量

N×Nの明示行列ならO(N³)時間・O(N²)空間、potential・slack・matchingの補助領域はO(N)。禁止辺は候補から除くか、有限費用の絶対値上限をCとしてNCより十分大きい費用を置き、最後に禁止辺の不使用を確認する。左右サイズが違う場合はdummyが表す未割当てとその費用を定義する。部分matchingで全potential和が下界になるとは限らないため、必要個数を固定したnetworkなどへ帰着する。

概念上の親: [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

このUnitを直接前提とする単元: なし。

二部matching・Hall・Kőnigで得た考え方と実装を再利用し、重み付き二部完全matchingの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g) — 主題: [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)（assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC373 G 公式解説](https://atcoder.jp/contests/abc373/editorial/11045)
- [ABC373 G 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-weighted-bipartite-matching`
