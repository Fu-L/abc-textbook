---
title: "半順序・Dilworth・最大反鎖"
description: "前提から半順序・Dilworth・最大反鎖を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 168
---

# 半順序・Dilworth・最大反鎖

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 二部matching・Hall・Kőnig、列・区間・分割のDP
- この位置で学ぶ理由: 二部matching・Hall・Kőnig・列・subsequence DPで得た考え方と実装を再利用し、半順序・Dilworth・最大反鎖の発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 半順序・Dilworth・最大反鎖

比較可能性をposetとして明示し、antichain・chain cover・LDS・bipartite matching/min-cutの双対関係を選んで最適化する。

検索語: Dilworth theorem、Dilworthの定理、minimum chain cover、最大反鎖

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける

題材: [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)

選定理由: 禁止条件は回文区間の交差ではなく、回文文字列同士の substring 比較可能性なので、求める量は包含半順序の幅である。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。二つの要素が半順序で比較可能なら同時に選べず、最大の互いに比較不能な集合を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 部分文字列包含で競合する回文の最大選択数を、半順序の幅と二部最大マッチングで求められる。

#### 観察

- 同じ回文が複数箇所に現れても互いに同じ文字列を部分文字列として含むため、異なる回文文字列だけを候補にすればよい。
- 異なる回文文字列の種類数は |S| 以下であり、包含関係は長さが増える向きの半順序を作る。

#### 候補を比較する

- **採用**: 回文を頂点、厳密な部分文字列関係を比較可能性辺とする DAG を作り、Dilworth の定理で最大反鎖を最小鎖分解へ、さらに二部最大マッチングへ変換する。 — 同時に選べる集合は半順序の反鎖そのもので、最小鎖分解数は頂点数から二部最大マッチング数を引いて求められる。
- **棄却**: 列挙した回文の全部分集合を試し、どの二つも包含関係にない最大集合を探す。 — 回文種類数は 200 まであり、2 の N 乗の選択は列挙できない。

#### 鍵となる着眼

- 禁止条件は回文区間の交差ではなく、回文文字列同士の substring 比較可能性なので、求める量は包含半順序の幅である。
- 各回文を左右に複製し、左 i から右 j へ「i が j の部分文字列」の辺を張った二部グラフで、答えは N−最大マッチング数になる。

#### アルゴリズムへ接続する

文字列包含を半順序として明示し、最大 antichain → minimum chain cover → bipartite matching という Dilworth の定理の標準変換を適用する。


## 転用するときの確認

- **Dilworth の定理による最大反鎖**: 二つの要素が半順序で比較可能なら同時に選べず、最大の互いに比較不能な集合を求めるとき。 適用: 最大反鎖の大きさを最小鎖分解数へ置き換え、N−最大マッチングで計算する。
- **DAG 最小パス被覆の二部マッチング変換**: DAG の頂点を最少本数の頂点素なパスで覆いたいとき。 適用: 各頂点を左右へ複製して到達可能な対を結び、最大マッチング一辺ごとに二つの鎖を連結する。
- 対象区間が二乗個あっても distinct object の個数に強い上界があるなら、重複除去後の関係グラフを直接構築できる。
- ペアごとの禁止条件が推移的なら、一般グラフの独立集合ではなく半順序の反鎖として扱えないか確認する。
- 区間の個数ではなく異なる内容の個数を数え、重複除去後に初めてグラフ規模を見積もる。

## 到達確認

### 到達確認 1 — 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける

転移題材: [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)

**課題**: ABC354 G「Select Strings」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: substring 禁止集合を weighted poset antichain と見抜き、文字列比較後の min-cut で最大重みを求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- substring 禁止集合を weighted poset antichain と見抜き、文字列比較後の min-cut で最大重みを求められる。

- 対象技能が担う箇所: substring 禁止集合を weighted poset antichain と見抜き、文字列比較後の min-cut で最大重みを求められる。
- 転移題材の解法接続: 同一 S を最大 A にまとめる。全 ordered pair で KMP/Z/標準検索により substring 関係を判定する。左右コピーを作り source→L_i capacity A_i、R_i→sink capacity A_i、S_i substring S_j なら L_i→R_j capacity INF を張る。answer=ΣA_i−maxflow。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

</details>


## 根拠

- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC354 G 公式解説](https://atcoder.jp/contests/abc354/editorial/10029)
- [ABC354 G 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC457 G 公式解説](https://atcoder.jp/contests/abc457/editorial/20073)
- [ABC457 G 公式問題文](https://atcoder.jp/contests/abc457/tasks/abc457_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-poset-dilworth-antichain`
