---
title: "有限状態automatonの構成"
description: "前提から有限状態automatonの構成を見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 148
---

# 有限状態automatonの構成

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 有限状態automatonの構成

文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。

検索語: DFA、finite-state automaton、有限オートマトン

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる

題材: [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)

選定理由: 状態 xy から文字 z を追加する辺は yz へ進み、重み P(z)+P(yz)+P(xyz) を持つ。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。次の文字を加えた増分が直前の高々L文字だけで決まるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 短いpattern出現の線形scoreを持つ任意長文字列の最大値と無限性を、suffix状態グラフで判定できる。

#### 観察

- 文字を一つ末尾へ追加したとき新たに発生する長さ1〜3の出現は、その文字と追加前の末尾2文字だけで決まる。
- 一度加点済みのprefixは将来へ影響しないため、現在文字列を末尾2文字だけの有限状態へ圧縮できる。

#### 候補を比較する

- **採用**: 末尾2文字を頂点、次文字追加を重み付き辺とするグラフを作り、初期状態 $$ からの最大walkと到達可能な正閉路をBellman-Ford型緩和で調べる。 — 全文字列が始点からのwalkに一対一対応し、正重みcycleがあれば反復して無限大、なければ有限最大距離になる。
- **棄却**: 文字列長を伸ばしながら全ての文字列を列挙し、美しさの最大値を更新する。 — 長さに上限がなく各長さで26分岐し、Infinity判定もできない。

#### 鍵となる着眼

- 状態 xy から文字 z を追加する辺は yz へ進み、重み P(z)+P(yz)+P(xyz) を持つ。
- ダミー文字 $ を二つ置き、$を含むpatternの点数を0にすれば、長さ1・2のprefixも同じ遷移式で扱える。

#### アルゴリズムへ接続する

bounded-length substring score を de Bruijn 型 suffix automaton のedge weightへ変換し、unbounded sequence optimization を positive-cycle detection 付き longest walk にする。


## 転用するときの確認

- **有限suffix状態への文字列圧縮**: 次の文字を加えた増分が直前の高々L文字だけで決まるとき。 適用: 末尾L文字を状態、文字追加をshift遷移とする有限オートマトンを構築する。
- **最大walkの正閉路判定**: 長さ無制限のwalk重みを最大化し、値が有限か無限かも判定するとき。 適用: 到達可能状態だけを最大距離緩和し、|V|回目にも改善すれば正cycleとしてInfinityにする。
- 短い全pattern空間が小さいときは、trieを作らず固定長lookup tableへ不足値0で展開できる。
- 追加文字によるscore増分が局所suffixだけを見るなら、文字列全体を状態にせずweighted automatonへ変換する。
- 長さ無制限の最大化では、有限DPを始める前に正利益cycleの反復がInfinityを作るか確認する。

## 到達確認

### 到達確認 1 — 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる

転移題材: [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)

**課題**: ABC301 F「Anti-DDoS」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: ?を埋めてDDoS型文字列となる方法数を求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- ?を埋めてDDoS型文字列となる方法数を求められる。

- 対象技能が担う箇所: ?を埋めてDDoS型文字列となる方法数を求められる。
- 転移題材の解法接続: Sのprefix固定大文字種類数を前計算し、29状態の個数DPを左から更新する。固定文字は一遷移、?は52文字を種類別係数でまとめ、最終的にDDoS型を含まない状態を全52^qから引く。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。

</details>


## 根拠

- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-finite-pattern-automaton`
