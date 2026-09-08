---
title: "要素索引と連結リストで局所linkを更新する"
description: "前提から要素索引と連結リストで局所linkを更新するを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 26
---

# 要素索引と連結リストで局所linkを更新する

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 配列やmapの索引を使い、順序全体を走査せず前後linkだけを更新して列を保つ。

### この単元では扱わない範囲

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 発動条件と見分け方

### 索引付き連結リスト

要素IDから前後linkへ直接到達し、挿入・削除で影響する局所的なlinkだけを更新する。

検索語: doubly linked list、linked list、連結リスト

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる

題材: [ABC344 E「Insert or Erase」](https://atcoder.jp/contests/abc344/tasks/abc344_e)

選定理由: distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。既知node位置での挿入・削除を頻繁に行い、最後に順序走査したい。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 全insert/erase query後のsequenceを正しい順序で出力できる。

#### 観察

- queryは既知の値xの直後挿入またはx自身の削除であり、位置indexによるrandom accessは不要である。各valueから前後valueへ直接辿れるようにすれば、変更箇所は常に定数本のlinkだけになる。

#### 候補を比較する

- **採用**: valueをnode keyとするdoubly linked listをhash mapで実装する — xのnodeをO(1)期待で特定し、挿入・削除を前後pointerの定数更新で処理できる。
- **棄却**: vectorの途中へinsert/eraseする — 後続要素のshiftが一query O(|A|)となり、合計二乗時間になり得る。

#### 鍵となる着眼

- distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。

#### アルゴリズムへ接続する

各valueに(prev,next)を持つ連想配列を作り、head/tail sentinelも接続する。type 1はxとそのnextの間へy nodeを挿入し、type 2はxの両隣を直結してmapからxを消す。最後にhead.nextからtailまでnextを辿り出力する。


## 転用するときの確認

- **doubly linked list**: 既知node位置での挿入・削除を頻繁に行い、最後に順序走査したい。 適用: prev/next双方を持ち、局所linkの張替えだけで操作する。
- **key-to-node indexing**: 操作対象が位置でなく一意なvalueで指定される。 適用: hash mapでvalueからlink情報へ直接accessし、linear searchを避ける。
- 一意key指定のlinked sequenceはnode objectなしでもkey→neighbor mapsで実装できる。
- head/tail削除、末尾挿入、挿入直後の削除、長さ1を保つ操作列でlinkの双方向整合性を検査する。

## 到達確認

### 到達確認 1 — 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる

転移題材: [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f)

**課題**: ABC421 F「Erase between X and Y」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 一意ID列の挿入・区間削除をnext配列へ落とし、未知の端点順序を並行探索で決めて総走査量を削除数へ償却できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 一意ID列の挿入・区間削除をnext配列へ落とし、未知の端点順序を並行探索で決めて総走査量を削除数へ償却できる。

- 対象技能が担う箇所: 一意ID列の挿入・区間削除をnext配列へ落とし、未知の端点順序を並行探索で決めて総走査量を削除数へ償却できる。
- 転移題材の解法接続: next[0]=-1から始め、挿入は二本のnextを更新する。削除queryではcurX=x,curY=yと二つの一時和を持ち、両側を一歩ずつ進める。curXがyへ届けばx側の和を出してnext[x]=y、curYがxへ届けばy側の和を出してnext[y]=xとし、中間nodeを列から切り離す。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 時間計算量 O(Q)（公式解法全体。特殊な計算量解析を含む）を問題制約と照合し、対象技能が律速かを確認する。

期待する到達点: 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

</details>


## 根拠

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC344 E 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_e)
- [ABC344 E 公式解説](https://atcoder.jp/contests/abc344/editorial/9487)
- [ABC421 F 公式解説](https://atcoder.jp/contests/abc421/editorial/13787)
- [ABC421 F 公式問題文](https://atcoder.jp/contests/abc421/tasks/abc421_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-linked-list-index`
