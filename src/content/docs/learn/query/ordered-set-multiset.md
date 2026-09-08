---
title: "ordered set・multisetの動的順序管理"
description: "前提からordered set・multisetの動的順序管理を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 126
---

# ordered set・multisetの動的順序管理

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### ordered set・multisetの動的順序管理

比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。

検索語: multiset、order statistics tree、ordered set、平衡二分探索木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e)

選定理由: 新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。動的multisetの小さい方K個と残りを分け、その集約値を維持したいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 全固定長windowのK最小要素和を、二つのordered multisetと境界rebalanceで求められる。

#### 観察

- 隣接windowは左端1要素を削除し右端1要素を追加するだけなので、毎回sortし直す情報の大半は共通である。
- windowを小さいK個のmultiset Lと残りRに分ければ、答えはsum(L)であり、必要な不変条件は|L|=Kかつmax(L)≤min(R)である。

#### 候補を比較する

- **採用**: ordered multiset L,RとsumLを維持し、削除・挿入後に境界要素を高々1個移して|L|=Kへ戻す。 — window更新2要素だけを対数時間で反映し、K最小値の和を直接保持できる。
- **棄却**: 各windowのM要素をcopyしてsortし先頭K個を足す。 — window数とMの積が二次規模になり、N≤2×10^5に間に合わない。

#### 鍵となる着眼

- 新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。
- 重複値があるため、削除対象をどちらのmultisetに属するか判定し、iteratorまたは(value,index)で1個だけ消す必要がある。

#### アルゴリズムへ接続する

初windowをsortしてK個をL、残りをRへ入れsumLを作る。slideごとにoutgoingを所属setから削除し、incomingを境界比較で挿入する。|L|<KならminRをLへ、>KならmaxLをRへ移しsumLを更新して出力する。


## 転用するときの確認

- **two-multiset order statistics**: 動的multisetの小さい方K個と残りを分け、その集約値を維持したいとき。 適用: 境界maxL/minRとsizeを不変量にし、insert/erase後にrebalanceする。
- **sliding window差分更新**: 連続window間で出入りする要素が少数のとき。 適用: outgoing削除とincoming挿入だけをdata structureへ反映する。
- dynamic order statisticのprefix集約では、境界で集合を二分し片側のsum/countを持つ。
- 境界値が重複するwindowで同値要素がL/R両方にある例を作り、どちらから1個消しても不変量を戻せる実装を確認する。

## 到達確認

### 到達確認 1 — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC306 E「Best Performances」](https://atcoder.jp/contests/abc306/tasks/abc306_e)

**課題**: ABC306 E「Best Performances」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: point update後のlargest K valuesのsumを対数時間で出力できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- point update後のlargest K valuesのsumを対数時間で出力できる。

- 対象技能が担う箇所: point update後のlargest K valuesのsumを対数時間で出力できる。
- 転移題材の解法接続: dynamic top-K aggregateをorder-statistic boundaryで二分したmultisetsとrunning sumにより維持する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC245 E 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC245 E 公式解説](https://atcoder.jp/contests/abc245/editorial/3635)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC281 E 公式問題文](https://atcoder.jp/contests/abc281/tasks/abc281_e)
- [ABC281 E 公式解説](https://atcoder.jp/contests/abc281/editorial/5368)
- [ABC306 E 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_e)
- [ABC306 E 公式解説](https://atcoder.jp/contests/abc306/editorial/6607)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-ordered-set-multiset`
