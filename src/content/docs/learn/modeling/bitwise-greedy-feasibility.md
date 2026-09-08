---
title: "bitwise greedyによるmask最適化"
description: "前提からbitwise greedyによるmask最適化を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 86
---

# bitwise greedyによるmask最適化

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### bitwise greedyによるmask最適化

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。

検索語: bitwise greedy、mask feasibility greedy、上位bit貪欲

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)

選定理由: simple path 条件は connectivity 判定を妨げない。許可辺で walk があれば cycle を除いて simple path にでき、その OR は増えない。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。実行可能 mask が bit 追加に対して上向き閉集合で、数値最小を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 最大 2×10^5 辺のグラフで、path edge label OR の数値最小値を30回の連結性判定で得られる。

#### 観察

- mask x に含まれる bit だけをもつ辺、すなわち w OR x=x の辺だけで 1 から N へ到達できれば、その経路の OR も x の submask である。
- 到達可能な mask の集合は bit を追加する方向に単調であるため、上位 bit から 0 にできるか試すことで数値として最小の mask を確定できる。

#### 候補を比較する

- **採用**: 全30 bitを立てた mask から上位 bit を順に仮消去し、許可辺だけの DSU connectivity が保たれるなら消去を確定する — 各判定は edge label が候補 mask の submask かを調べて DSU で結ぶだけで、全体 O(30(N+M)α(N)) になる。
- **棄却**: 各頂点に数値として最小の OR 値を一つだけ持つ Dijkstra 風緩和 — 数値が小さい mask が bit 集合として別 mask の subset とは限らず、途中の最小値一つが将来の辺との OR に対して常に優越するとは限らない。

#### 鍵となる着眼

- simple path 条件は connectivity 判定を妨げない。許可辺で walk があれば cycle を除いて simple path にでき、その OR は増えない。
- ある候補 x が可能なら x に bit を足した mask も同じ経路を許すので、lexicographic な bit 最小化と同様に高位から貪欲決定できる。

#### アルゴリズムへ接続する

ans=(1<<30)-1 とする。b=29..0 について cand=ans without bit b を作り、(w_i|cand)==cand の辺だけで DSU を再構築する。1,N が連結なら ans=cand とし、最後の ans を出力する。


## 転用するときの確認

- **bit ごとの貪欲最小化**: 実行可能 mask が bit 追加に対して上向き閉集合で、数値最小を求めるとき。 適用: 最上位から各 bit を外した候補の実行可能性を判定する。
- **submask 制約の connectivity**: path 上の全 edge label の OR を指定 mask 以下に抑えたいとき。 適用: label の立っている bit が mask にすべて含まれる辺だけ残して連結性を見る。
- **DSU**: 同じ edge filter で無向グラフの二点連結性だけ判定したいとき。 適用: 候補 mask ごとに初期化し、許可辺の端点を union する。
- bitwise 集約量の最小化では、候補 mask が許可する要素集合を作り、実行可能性 oracle と上位 bit 貪欲を組み合わせる。
- 重み0だけの path、低位bitの少ない値と高位bitのある値が競合する path、bridge に特定bitが必要な例を全 simple path 列挙と比較する。

## 到達確認

### 到達確認 1 — 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる

境界検証の元題材: [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)

**課題**: ABC408 E「Minimum OR Path」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 最大 2×10^5 辺のグラフで、path edge label OR の数値最小値を30回の連結性判定で得られる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC408 E 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC408 E 公式解説](https://atcoder.jp/contests/abc408/editorial/13159)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-bitwise-greedy-feasibility`
