---
title: "区間monoid要約"
description: "前提から区間monoid要約を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 151
---

# 区間monoid要約

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 区間monoid要約

queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。

検索語: monoid range query、segment tree、セグメント木、線分木

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる

題材: [ABC223 F「Parenthesis Checking」](https://atcoder.jp/contests/abc223/tasks/abc223_f)

選定理由: minPrefix は空 prefix を含めて定義する。左 (s_L,m_L) と右 (s_R,m_R) の結合は (s_L+s_R,min(m_L,s_L+m_R))、identity は (0,0) となり、結合順を逆にできない非可換 monoid である。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。部分括弧列の正当性を判定するとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 括弧部分列の正当性を (sum,minPrefix) の非可換 monoid へ要約し、swap 後も各 query を O(log N) で判定できる。

#### 観察

- query 区間を '('=+1, ')'=-1 とし、左端直前を 0 とした相対 prefix p_0,...,p_len を考える。正しい括弧列である必要十分条件は p_len=0 かつ min_j p_j≥0 である。
- N,Q≤2×10^5 なので query ごとの線形走査は使えない。swap は二点の値変更だから、判定条件を結合可能な区間要約にできれば点更新と区間積へ落とせる。

#### 候補を比較する

- **採用**: 各区間の総和と最小 prefix 和を monoid とし、segment tree で点更新と区間積を管理する。 — 二つの隣接区間の (sum,minPrefix) を O(1) で結合でき、swap の二点更新と query 区間の取得をともに O(log N) で処理できる。
- **棄却**: 各 query のたびに区間を左から走査して prefix 和を確認する。 — 一回 O(r-l+1)、全体で最悪 O(NQ) となり、N,Q≤2×10^5 に合わない。

#### 鍵となる着眼

- minPrefix は空 prefix を含めて定義する。左 (s_L,m_L) と右 (s_R,m_R) の結合は (s_L+s_R,min(m_L,s_L+m_R))、identity は (0,0) となり、結合順を逆にできない非可換 monoid である。

#### アルゴリズムへ接続する

leaf を '('=(1,0), ')'=(-1,-1)、identity を (0,0) として segment tree を構築する。type 1 は文字を交換して二点更新し、type 2 は [l,r] の積 (s,m) を取得して s=0 かつ m≥0 なら Yes、それ以外は No とする。


## 転用するときの確認

- **括弧列の prefix 条件**: 部分括弧列の正当性を判定するとき。 適用: 総和 0 と最小 prefix 0 以上を必要十分条件として使う。
- **segment tree の monoid 設計**: 点更新を受けながら結合可能な区間要約を取得するとき。 適用: (sum,minPrefix) を順序付きで結合する。
- 区間条件を左からの走査で判定できるなら、走査中に必要な要約とその結合則を探す。
- 結合則を具体的な二つの短い括弧列で再導出し、順序を逆にできない理由を確認する。
- 同一文字の swap、()、)(、((、左端以前の global balance が 0 でなくても区間自体は正しい例を、区間の直接走査と照合する。

## 到達確認

### 到達確認 1 — 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる

転移題材: [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h)

**課題**: ABC246 Ex「01? Queries」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 点更新される wildcard 文字列の部分列集合数を、3 状態行列積の segment tree として維持できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 点更新される wildcard 文字列の部分列集合数を、3 状態行列積の segment tree として維持できる。

- 対象技能が担う箇所: 点更新される wildcard 文字列の部分列集合数を、3 状態行列積の segment tree として維持できる。
- 転移題材の解法接続: leaf i に A_{s_i} を置く。左区間を先に適用してから右区間を適用するため、親の積を M_right×M_left とする。点更新後、root 行列を (0,0,1)^T に作用させ、先頭 2 成分の和を出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

</details>


## 根拠

- [ABC223 F 公式解説](https://atcoder.jp/contests/abc223/editorial/2774)
- [ABC223 F 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_f)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC246 H 公式解説](https://atcoder.jp/contests/abc246/editorial/3705)
- [ABC246 H 公式問題文](https://atcoder.jp/contests/abc246/tasks/abc246_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-range-monoid-aggregation`
