---
title: "potential・weighted DSU"
description: "前提からpotential・weighted DSUを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 172
---

# potential・weighted DSU

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: DSUによる連結成分管理・縮約、静的graph等式制約のpotential伝播
- この位置で学ぶ理由: DSUによる連結成分管理・縮約・静的graph等式制約のpotential伝播で得た考え方と実装を再利用し、potential・weighted DSUの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### potential・weighted DSU

親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。

検索語: potential DSU、weighted Union-Find、重み付きUnion-Find

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる

題材: [ABC280 F「Pay or Receive」](https://atcoder.jp/contests/abc280/tasks/abc280_f)

#### このOutcomeを支える根拠

- 符号付きroad score queryを、component potentialと非零cycle flagによりnan/inf/有限差へ分類できる。

#### 観察

- roadを往復するとscore変化が符号反転するため、連結成分内でrootから各頂点へのpotentialが一意なら任意pathのscore差も一意になる。
- 同じ頂点へ異なるscoreで到達できるなら差を持つclosed walkがあり、正になる向きで何度も回ってscoreを無限に増やせる。

#### 候補を比較する

- **採用**: 各componentをDFSし、edge A→Bでpot[B]=pot[A]+Cを割り当て、既割当てとの矛盾があればcomponentをunboundedと印付ける。 — 連結性・有限時のscore差・非零cycleの有無を一度の前処理で得て、queryを定数時間で分類できる。
- **棄却**: 各queryごとに最大score pathをBellman-Ford等で探索する。 — Q,N,M≤10^5で繰返し最短路は重く、undirected符号edgeのpotential構造を活かしていない。

#### 鍵となる着眼

- consistent componentでは任意のx→y walk scoreはpot[y]-pot[x]で、closed walk scoreは全て0になる。
- 不整合edgeが1本でもあるcomponentでは非零closed walkを両方向のうち有利な向きに反復でき、同componentの任意x,y queryがinfになる。

#### アルゴリズムへ接続する

未訪問vertexごとにcomponent idとpot=0を置き、(u,v,+c)をDFS緩和する。pot[v]≠pot[u]+cを見つけたcomponentをbadにする。queryはcomponent不同ならnan、badならinf、それ以外はpot[y]-pot[x]。


## 転用するときの確認

- **potential付きgraph**: edgeが頂点値の差を指定し、path和の一意性や矛盾を判定したいとき。 適用: rootからpotentialを割り当て、各edgeが差分式を満たすか検査する。
- **非零cycleによるunbounded判定**: cycleを繰り返せるwalk最適化で、cycle利得が0でないとき。 適用: 符号反転可能なclosed walkを有利な向きに反復してinfとする。
- 可逆edgeの加法scoreでは、path差の不整合がreversible profitable cycleになるかを見る。
- 同じ2頂点を異なるCのparallel roadで結ぶ例から非零closed walkを作り、なぜcomponent全queryがinfになるか説明する。

## 到達確認

### 到達確認 1 — 差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる

転移題材: [ABC328 F「Good Set Query」](https://atcoder.jp/contests/abc328/tasks/abc328_f)

**課題**: ABC328 F「Good Set Query」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 入力順greedyで追加可能な差分constraint indexを、weighted DSUで整合性判定しながら求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 入力順greedyで追加可能な差分constraint indexを、weighted DSUで整合性判定しながら求められる。

- 対象技能が担う箇所: 入力順greedyで追加可能な差分constraint indexを、weighted DSUで整合性判定しながら求められる。
- 転移題材の解法接続: weighted DSUをN頂点で初期化する。query(a,b,d)ごとにfindして、rootが同じならpot[a]-pot[b]==dのときだけindexをanswerへ追加する。rootが異なるなら常にindexを追加し、X_a-X_b=dを満たすroot間差を設定してsizeの小さいrootを大きいrootへmergeする。最後にaccepted indexを順に出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる。

</details>


## 根拠

- [ABC280 F 公式解説](https://atcoder.jp/contests/abc280/editorial/5303)
- [ABC280 F 公式問題文](https://atcoder.jp/contests/abc280/tasks/abc280_f)
- [ABC328 F 公式解説](https://atcoder.jp/contests/abc328/editorial/7656)
- [ABC328 F 公式問題文](https://atcoder.jp/contests/abc328/tasks/abc328_f)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-potential-dsu`
