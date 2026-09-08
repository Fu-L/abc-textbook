---
title: "DAGのtopological processing"
description: "前提からDAGのtopological processingを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 114
---

# DAGのtopological processing

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 状態グラフのモデリングと探索
- この位置で学ぶ理由: 状態グラフのモデリングと探索で得た考え方と実装を再利用し、DAGのtopological processingの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### DAGのtopological processing

依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。

検索語: DAG DP、topological processing、トポロジカルソート

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC277 F「Sorting a Matrix」](https://atcoder.jp/contests/abc277/tasks/abc277_f)

#### このOutcomeを支える根拠

- wildcard付きmatrixのrow/column並べ替え可能性を、行値域の整列と圧縮列precedence DAGで判定できる。

#### 観察

- 0は後から任意の正数にできるため、最終flatten列が非減少かは、0を除いた既知値の相対順序だけで決まる。
- 最終条件は、各行の既知値区間が行順に重ならないことと、各行内で既知値が同じ共通列順に非減少になることへ分離できる。

#### 候補を比較する

- **採用**: 非零値だけで行ごとの[min,max]を並べて非重複を検査し、列には各行の大小制約を補助頂点で圧縮したDAGを作ってacyclicか判定する。 — row swapとcolumn swapの影響を独立化し、全cell数に比例するgraphで共通列順の存在を判定できる。
- **棄却**: 各行でA_{i,j}<A_{i,j'}の全列pairへ直接edgeを張ってtopological sortする。 — 1行だけでW² edgeになり、H×W≤10^6でも辺数が大きすぎる。

#### 鍵となる着眼

- 非零要素を持つ行はminの昇順に並べ、直前までのmax≤次のminなら行間の全比較を満たす。全0行は既知制約を持たない。
- 1行の正値を同値group順に並べ、隣接group間に補助頂点を挟めば、低いgroupの全列が高いgroupの全列より前という推移閉包を線形本数のedgeで表せる。

#### アルゴリズムへ接続する

各行の0を除くmin/maxを集め、空行を除いてsortし隣接区間を検査する。列番号W頂点に加え、各行の昇順value group境界ごとに補助頂点とgroup→aux→次groupのedgeを作り、全graphがDAGならYesとする。


## 転用するときの確認

- **行列sorting条件の独立化**: row permutationとcolumn permutationが可換で、最終順序条件を行間・行内へ分けられるとき。 適用: 行は値域interval、列は全行から来るprecedence制約として別々に判定する。
- **dense precedenceの補助頂点圧縮**: group Aの全要素をgroup Bの全要素より前にする完全二部有向edgeが必要なとき。 適用: 隣接value group間にauxiliary nodeを置き、推移性で全大小pairを表す。
- wildcardを任意値へ補完する非減少化では、wildcard除去後の既知列が非減少かを核にする。
- 2×2の矛盾例で列制約cycleを描き、別の例で行[min,max]が交差すると列順に関係なく不可能なことを確認する。

## 到達確認

### 到達確認 1 — 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC291 E「Find Permutation」](https://atcoder.jp/contests/abc291/tasks/abc291_e)

**課題**: ABC291 E「Find Permutation」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 条件を満たす順列が一意なら構成し、そうでなければNoと判定できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 条件を満たす順列が一意なら構成し、そうでなければNoと判定できる。

- 対象技能が担う箇所: 条件を満たす順列が一意なら構成し、そうでなければNoと判定できる。
- 転移題材の解法接続: 入次数0集合を用いるKahn法を行い、各段階で候補がちょうど一つか確認しながら順序Pを作り、A[P_i]=iを出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC224 E 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC224 E 公式解説](https://atcoder.jp/contests/abc224/editorial/2814)
- [ABC277 F 公式解説](https://atcoder.jp/contests/abc277/editorial/5205)
- [ABC277 F 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_f)
- [ABC291 E 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_e)
- [ABC291 E 公式解説](https://atcoder.jp/contests/abc291/editorial/5839)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-dag-topological-processing`
