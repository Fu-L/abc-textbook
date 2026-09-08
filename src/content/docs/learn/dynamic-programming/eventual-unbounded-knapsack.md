---
title: "大容量unbounded knapsackのeventual linearity"
description: "前提から大容量unbounded knapsackのeventual linearityを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 210
---

# 大容量unbounded knapsackのeventual linearity

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 集合・資源軸のDP
- この位置で学ぶ理由: 通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### この単元では扱わない範囲

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

検索語: best-density item、eventual linearity knapsack、大容量unbounded knapsack

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 正当化と転用の境界

- ABC310 Exでは短いコンボの列挙までを固有の前処理とし、時間a・報酬bのitem集合が得られた後を比較する。最大密度item(a*,b*)より劣るitemの列に長さa*の剰余prefix衝突があれば、所要時間がa*の倍数となる部分を基準itemで置換して報酬を減らさずに済む。したがって例外itemを有限個へ界し、有限DPと基準itemの反復を併用する。
- ABC415 Gの容量固定で価値を最大化する形式に対し、ABC310 Exは目標価値を満たす時間を最小化する。有限例外の時間・報酬を保持し、残り必要報酬を基準itemで切り上げて満たす。密度greedyだけでは端数を最適化できず、例外上界とceilの処理が正しさに必要である。

### 例 1 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる

題材: [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)

選定理由: 同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。capacityが巨大だがitem weightが小さく、best ratio以外の使用量をboundedにできるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 最大Aが300という小ささを使い、10^15本からの最大drink数をO(M+K^3)で求められる。

#### 観察

- 一本飲んでexchange iを一回行うと最終的な瓶総数をD_i=A_i-B_iだけ消費し、追加でB_i本飲める。逆向きに見ると、容量Nでweight D_i・value B_iのunbounded knapsackに近い。
- ただし初期段階にはx≥B_iという実行条件がある。x≥K=max A_iになれば全B_i<Kなので条件は自動的に満たされ、以後は通常のunbounded knapsackになる。

#### 候補を比較する

- **採用**: best ratio B_i/D_i のitem i*以外を使う総weightがK(K+1)未満の最適解を利用し、小容量DP後をi*の反復で埋める — prefix x<K(K+1)だけ全itemでDPし、各到達xから残容量へi*を可能なだけ使う。鳩の巣原理でK個以上の非i* item blockは同weightのi*群へ価値を下げず交換できる。
- **棄却**: 常にB_i/D_i最大のexchangeだけを最初から繰り返す — 小さいxではx≥B_iを満たさないことがあり、容量の剰余調整でもratioが劣るitemを有限回使う方が総価値を増やす場合がある。

#### 鍵となる着眼

- 同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。
- 非i* itemがK個あればprefix weight和K+1個のmod D_{i*} residueに一致pairがあり、そのblockを同weightのi*複数へ交換できる。best ratioにより価値は減らない。

#### アルゴリズムへ接続する

同じAを最大Bだけにdeduplicateし、cross multiplicationでi*を選ぶ。limit=K(K+1)付近まで、開始xを自由に選べる基底0と条件x≥B_iを反映したunbounded DPで最大追加drink数を求める。各DP state xからi*をfloor((N-x)/D*)回追加する候補を評価し、初期N本を足す。


## 転用するときの確認

- **best density itemによる大容量knapsack**: capacityが巨大だがitem weightが小さく、best ratio以外の使用量をboundedにできるとき。 適用: 有限prefixだけDPし、残りをbest-density itemで埋める。
- **鳩の巣原理による交換**: 非基準itemが多数並び、prefix weight residueを基準weight moduloで比較できるとき。 適用: 同余りの区間を同総weightの基準itemへ置換して非基準総weightを制限する。
- **支配optionの除去**: 同じ必要量parameterを持つ選択肢で一方が常に多い返却を与えるとき。 適用: 同じAでは最大Bだけ残して種類数をK以下へ減らす。
- 巨大capacityのunbounded knapsackではbest ratio解との差分をcycle交換でboundedにし、短いprefix DP＋周期的tailへ分ける。
- 一種類、best ratioが初期に使えない、同A重複、残容量の剰余で別itemが必要な小Nを状態全探索と比較する。

## 到達確認

### 到達確認 1 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる

転移題材: [ABC310 Ex「Negative Cost」](https://atcoder.jp/contests/abc310/tasks/abc310_h)

**課題**: ABC310 Ex「Negative Cost」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 無限に長い実行列を O(L) 長のコンボと O(L²) の例外領域へ圧縮し、O(NL²+L³) で最小使用回数を求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 無限に長い実行列を O(L) 長のコンボと O(L²) の例外領域へ圧縮し、O(NL²+L³) で最小使用回数を求められる。

- 対象技能が担う箇所: 無限に長い実行列を O(L) 長のコンボと O(L²) の例外領域へ圧縮し、O(NL²+L³) で最小使用回数を求められる。
- 転移題材の解法接続: dp[len][balance] で長さ 2L 以下の基本列の最大ダメージを O(NL²) で求め、長さごとの最大値 d_len をコンボとする。効率 d_z/z 最大の z を選び、例外コンボ総コスト O(L²) までの無制限 knapsack で最大ダメージ M_x を O(L³) で計算する。各 x に不足分を z コンボで補った総手数の最小を取る。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

</details>


## 根拠

- [ABC310 H 公式解説](https://atcoder.jp/contests/abc310/editorial/6794)
- [ABC310 H 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_h)
- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-eventual-unbounded-knapsack`
