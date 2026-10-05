---
title: "下限制約付きflowの実現可能性"
description: "「下限制約付きflowの実現可能性」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 123
---

# 下限制約付きflowの実現可能性

習得対象の目安: **黄色（2000–2399）**。下限を需要へ移し、補助source・sinkでcirculationの可解性を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 下限制約付きflowの実現可能性

各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。

### 習得する技能

- 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 下限を先に流した収支

辺e=u→vの下限l_e・上限u_eを `0≤l_e≤u_e` とする。流量を `x_e=l_e+f_e` と分け、残りの辺容量をu_e−l_eとする。頂点ごとに `b(v)=Σ_{e:流入}l_e−Σ_{e:流出}l_e` を計算する。元の流量保存は `Σ_out f−Σ_in f=b(v)` と同値である。bが正なら、下限による流入超過を追加の流出で解消する必要がある。

補助始点SS・終点TTを作り、b(v)>0ならSS→vに容量b(v)、b(v)<0ならv→TTに容量−b(v)を張る。各元辺の下限は両端へ逆符号で寄与するためΣ_v b(v)=0。必要流量は `D=Σ_v max(b(v),0)` であり、SS→TT最大流がDなら全ての補助辺が飽和する。

補助辺が飽和したflowの保存式から、元辺上では上の収支式が成立し、`x_e=l_e+f_e` が上下限と流量保存を満たす。逆に、実行可能なxからf=x−lを作り、各補助辺を容量まで流せば、SS→TTの流量Dを作れる。従って飽和判定は必要十分であり、辺IDを保存すれば実際の流量も復元できる。D=0では追加flowは不要だが、下限と上限の確認は省かない。

### s-t流をcirculationへ閉じる

内部頂点で保存し、sからtへ非負流量Fを送る場合は、t→sに下限0・上限Uの補助辺を加える。元のs-t流へこの辺の流量Fを足すと全頂点で保存するcirculationになる。全上限が有限なら、sから出る元辺の上限の和をUにすれば十分である。流量Fを指定する場合は、この辺の下限・上限を共にFとして同じ変換を行う。

実行可能性の判定後、補助辺を取り除いて元辺のxを返す。最大流量も欲しい場合は、SS・TTとt→s辺（その残余逆辺も）を除き、現在のxを初期flowとする残余networkでs→t最大流を追加する。元辺の逆残余容量はx−l、順残余容量はu−xなので下限を破らない。追加量を、t→s辺が持っていたFへ加える。

## 成立条件と計算量

補助頂点は2個、補助辺は高々V本（s-tの閉鎖辺を除く）。V+2頂点・O(E+V)辺の最大流の費用になる。整数上下限なら整数flowを復元できる。容量和D・Uを十分な整数幅で計算し、可否判定と最大流量・最小費用の最適化を区別する。

概念上の親: [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。

このUnitを直接前提とする単元: なし。

最大流・最小カットで得た考え方と実装を再利用し、下限制約付きflowの実現可能性の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g) — 主題: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)（各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-flow-lower-bounds`
