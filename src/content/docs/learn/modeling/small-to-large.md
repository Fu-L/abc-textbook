---
title: "small-to-large・DSU on Tree"
description: "前提からsmall-to-large・DSU on Treeを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 144
---

# small-to-large・DSU on Tree

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### small-to-large・DSU on Tree

小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。

検索語: DSU on Tree、sack technique、small-to-large

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 正当化と転用の境界

- 要素を重複も含めて保持する併合なら、小さい側から移る要素の所属サイズは少なくとも倍増し、一要素O(log N)回。重複を消すsetの所属サイズは倍増しないため、ガイドの消滅・生存への課金を使う。
- ABC324 Gの分割は、分割前の各要素が一方だけに属し、小さい側だけを走査するから、走査された要素の所属サイズが半減する。併合の倍増、setの消滅、分割の半減で何を数えているかを区別し、操作一回あたりのデータ構造費用を最後に掛ける。

### 例 1 — 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC329 F「Colored Ball」](https://atcoder.jp/contests/abc329/tasks/abc329_f)

選定理由: set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。集合union queryが続き、片方containerを空にできるとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 全ball移動query後のdestination boxのdistinct color数を、償却的なset mergeで出力できる。

#### 観察

- 各boxについて必要なのは含まれるcolorの集合で、同colorのballが複数あっても出力への寄与は1である。
- query後のbox bはset[a]∪set[b]、box aは空なので、物理containerを交換してから小さいsetを大きいsetへinsertしても論理結果は同じである。
- 重複を消すsetでは所属サイズの倍増は保証されない。例えば{1,2}と{2,3}のunionはサイズ3である。償却解析では色名でなく各container内の要素実体を数え、重複insertで消える実体にも仕事を課金する。

#### 候補を比較する

- **採用**: boxごとにcolor setを持ち、sizeの小さいsetを大きいsetへmergeして必要ならcontainerをswapする。 — queryの向きと物理merge方向をhandle交換で分離し、全insert回数をsmall-to-largeで償却できる。
- **棄却**: 常にset[a]の全colorをset[b]へ順にinsertする。 — 大集合aを小集合bへ繰り返し移すquery列で、同じ多数colorを何度も処理する。
- **棄却**: 各boxにN色のboolean arrayを持ってunionする。 — 1 queryあたりN走査と全体N^2 memoryが必要になる。

#### 鍵となる着眼

- set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。
- 小集合サイズs、移動先t≥s、重複数dとする。d≥s/2ならs回の処理をd個の消滅実体へ高々2ずつ課金する。d<s/2ならs-d個の生存実体へ高々2ずつ課金し、その所属サイズはt+s-d>3s/2となる。消滅への課金は一実体一回、生存への課金はサイズの単調増加によりO(log N)回なので、全insert試行はO(N log N)。平衡木setなら一試行O(log N)で全体O(N log²N+Q)。新規実体の再生成がある問題では別途その総数を界す。

#### アルゴリズムへ接続する

初期box iのsetへC_iを1つ入れる。query(a,b)でsize(set[a])>size(set[b])なら2つのset handleをswapする。その後set[a]の全colorをset[b]へinsertし、set[a]をclearする。size(set[b])を出力する。


## 転用するときの確認

- **small-to-large merging**: 集合union queryが続き、片方containerを空にできるとき。 適用: 常に小集合の要素を大集合へ移す。
- **logical IDとphysical containerのswap**: 操作結果の格納先IDが固定だが効率的なmerge方向は逆になり得るとき。 適用: container handleをO(1)交換して意味を合わせる。
- 可変集合問題では外部IDと内部containerをpointerで分離するとsmall-to-largeの向きを自由に選べる。
- a側が大きいqueryでset objectをswapしてからmergeし、最終的なbox aが空・box bがunionになっているかIDを追う。

## 到達確認

### 到達確認 1 — 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g)

**課題**: ABC324 G「Generate Arrays」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: position suffix splitとvalue threshold splitが混在する全sequence生成を、短い側だけのelement移動で処理できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- position suffix splitとvalue threshold splitが混在する全sequence生成を、短い側だけのelement移動で処理できる。

- 対象技能が担う箇所: position suffix splitとvalue threshold splitが混在する全sequence生成を、短い側だけのelement移動で処理できる。
- 転移題材の解法接続: 各sequence handleにposition-ordered setとvalue-ordered setを持ち、element移動時は両方からeraseして相手containerへinsertする。type 1はcut=min(x,length)からprefix/suffixの小さい側をposition端から移す。type 2はvalue rankで≤x側と>x側のsizeを得て、小さい側をvalue端から移す。移動した側・残った側が仕様のs,iへ対応するようhandleを必要ならswapし、新sequence iのsizeを出力する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC273 H 公式解説](https://atcoder.jp/contests/abc273/editorial/5032)
- [ABC273 H 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC324 G 公式解説](https://atcoder.jp/contests/abc324/editorial/7399)
- [ABC324 G 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_g)
- [ABC329 F 公式解説](https://atcoder.jp/contests/abc329/editorial/7729)
- [ABC329 F 公式問題文](https://atcoder.jp/contests/abc329/tasks/abc329_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-small-to-large`
