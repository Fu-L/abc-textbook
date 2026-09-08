---
title: "二部matching・Hall・Kőnig"
description: "前提から二部matching・Hall・Kőnigを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 160
---

# 二部matching・Hall・Kőnig

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 二部彩色と成分構造を扱う
- この位置で学ぶ理由: 二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 二部matching・Hall・Kőnig

左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。

検索語: Hallの定理、Kőnigの定理、bipartite matching、二部マッチング

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる

題材: [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)

#### このOutcomeを支える根拠

- 大口注文の充足を Hall の最小余裕へ変換し、部分集合変換で最小破壊数とその個体選択数を求められる。

#### 観察

- 会社 j の B_j 個の注文を区別可能な一個注文へ分けると、各注文を許可品種のどれか一個へ割り当てる二部マッチングとして充足可能性を表せる。
- Hall の条件は、全注文部分集合 T に対する供給量 f(S_T) と |T| の比較であり、同じ許可集合を持つ注文をまとめれば品種部分集合 S だけの条件へ移せる。

#### 候補を比較する

- **採用**: Hall の定理で最小余裕を品種部分集合上の f(S)−g(S) に変換し、subset zeta・Möbius 変換で最小個数と選び方を集約する。 — 品種数 N は 20 以下なので全品種部分集合を扱え、会社の大きな注文数は許可マスクへの重みとしてまとめられる。
- **棄却**: 食べるキャベツの各組合せについて、残りの供給から全注文を満たせるか最大流で判定する。 — キャベツ個体の選択肢が膨大で、候補ごとにフローを解く列挙はできない。

#### 鍵となる着眼

- g(S) を許可品種集合が S に含まれる一個注文の総数とすると、全注文を満たせる条件は全 S で f(S)−g(S) が非負であることになる。
- 最小余裕 d を持つ品種集合から d＋1 個食べれば Hall 条件を初めて破れるため、最小摂取数は max(0,d＋1) である。

#### アルゴリズムへ接続する

注文充足を Hall の部分集合不等式へ移し、許可マスクの重みを subset zeta 変換して最小欠損を求め、最小集合族への包含を Möbius・superset zeta 変換で数える。

### 例 2 — 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC241 G「Round Robin」](https://atcoder.jp/contests/abc241/tasks/abc241_g)

#### このOutcomeを支える根拠

- round-robin の未確定勝敗を単位 flow の割当へ変え、候補ごとの単独優勝可能性を判定できる。

#### 観察

- 候補 p が単独優勝できる completion があるなら、未消化の p の試合を全て p 勝利へ変えても p の勝数だけが増え相手は減るので、単独優勝は壊れない。まず p の最終勝数 win を最大に固定してよい。
- 残る各試合は勝者を二人のどちらかへ一勝として割り当て、各 i≠p の合計勝数を win-1 以下に抑える配分問題になる。

#### 候補を比較する

- **採用**: 試合 node へ source から1流し、可能な winner の player node を経て各選手の勝数上限へ流す max-flow feasibility を p ごとに判定する。 — 一試合一勝の選択と選手別 capacity を整数 flow がそのまま表し、全試合分を流せることが必要十分になる。
- **棄却**: 未消化試合の勝敗を全列挙し、最終勝数を比較する。 — 未消化試合は最大 N(N-1)/2 個あり、二択の全列挙はできない。

#### 鍵となる着眼

- 既に終了した試合 node は実際の winner だけへ、未終了試合 node は両 player へ辺を張れば、fixed result と自由選択を同じ network で扱える。

#### アルゴリズムへ接続する

各 p について未終了の p 戦を p 勝利に固定して win を数える。source→全試合 node に容量1、試合→許される winner、player p→sink に win、他 player→sink に win-1 を置き、全試合数だけ flow が流れれば p を出力する。


## 転用するときの確認

- **Hall の定理による供給可能性判定**: 複数種類の資源を、各要求が受け入れる種類のいずれかへ一対一に割り当てるとき。 適用: 注文集合の近傍品種が持つ総供給量と注文数を比較し、品種部分集合ごとの余裕へ変形する。
- **subset zeta・Möbius 変換**: ビット集合ごとに部分集合からの重み総和や、包含で集約された個数から正確な台集合別個数を求めるとき。 適用: 許可マスク別注文数から g(S) を作り、C(f(S),X) から選択品種集合がちょうど S の方法数を復元する。
- 最小障害集合が複数あるときは、個体選択をその台集合で分類し、最小化集合族との包含関係を集合変換で判定する。
- 注文部分集合が巨大なら、近傍がある品種集合 S に含まれる注文を全て選ぶのが最悪になることから量化対象を入れ替える。
- 選び方の重複は「選択に使った品種集合がちょうど S」で分割し、いずれかの最小化集合に含まれるかで一度だけ数える。
- **割当問題の max-flow 化**: 各 item を候補先の一つへ割り当て、各受け手に上限があるとき。 適用: source-item-recipient-sink の層 graph で item の単位流と recipient capacity を表す。
- **候補解の有利な正規化**: ある候補を最適にできるか判定し、その候補に有利な未確定選択へ変えても実現可能性を失わないとき。 適用: 候補自身の未確定試合を全勝に固定し、他者の上限だけを feasibility 条件にする。
- strict な最大者の存在判定では候補値を先に固定し、他者を候補値-1以下へ配る問題に変える。
- 候補 p が負ける未確定試合を p 勝ちへ反転したとき、p と相手以外を含め順位条件が悪化しないことを先に証明する。

## 到達確認

### 到達確認 1 — 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる

転移題材: [ABC317 G「Rearranging」](https://atcoder.jp/contests/abc317/tasks/abc317_g)

**課題**: ABC317 G「Rearranging」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。

### 到達確認 2 — 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g)

**課題**: ABC274 G「Security Camera 3」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 行内並べ替え問題を M-正則二部多重グラフの完全 matching 分解へ帰着し、必ず構成可能であることも同時に証明できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 行内並べ替え問題を M-正則二部多重グラフの完全 matching 分解へ帰着し、必ず構成可能であることも同時に証明できる。

- 対象技能が担う箇所: 行内並べ替え問題を M-正則二部多重グラフの完全 matching 分解へ帰着し、必ず構成可能であることも同時に証明できる。
- 転移題材の解法接続: 行 N 頂点と値 N 頂点の二部多重グラフを作る。col=1..M ごとに Hopcroft–Karp または最大流でサイズ N の matching を求め、matched value を各行の col へ出力し、対応する edge occurrence を graph から削除する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。

</details>

<details><summary>到達確認 2 の解答基準 — 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 全empty cellsを監視するminimum camerasをbipartite matchingまたはmax flowで求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 全empty cellsを監視するminimum camerasをbipartite matchingまたはmax flowで求められる。

- 対象技能が担う箇所: 全empty cellsを監視するminimum camerasをbipartite matchingまたはmax flowで求められる。
- 転移題材の解法接続: camera directions/positionsをmaximal visibility runsへcanonicalizeし、all-cell coverageをbipartite minimum vertex coverすなわちmaximum flowへ帰着する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC241 G 公式解説](https://atcoder.jp/contests/abc241/editorial/3452)
- [ABC241 G 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_g)
- [ABC274 G 公式解説](https://atcoder.jp/contests/abc274/editorial/5024)
- [ABC274 G 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_g)
- [ABC317 G 公式解説](https://atcoder.jp/contests/abc317/editorial/7023)
- [ABC317 G 公式問題文](https://atcoder.jp/contests/abc317/tasks/abc317_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-bipartite-matching`
