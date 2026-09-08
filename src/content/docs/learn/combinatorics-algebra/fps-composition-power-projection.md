---
title: "FPS合成・power projection"
description: "前提からFPS合成・power projectionを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 212
---

# FPS合成・power projection

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: FPS演算・多点評価・合成を行う
- この位置で学ぶ理由: 形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### FPS合成・power projection

多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。

検索語: FPS合成、polynomial composition、power projection

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g)

#### このOutcomeを支える根拠

- prime circuit条件をvertex-disjoint cactusへ特徴付け、最新の高速FPS compositionでN=2.5×10^5まで数えられる。

#### 観察

- 全circuitが素数長なら偶数長circuitは存在しない。二つのcycleが頂点を共有すると、その対称差や連結したclosed trailから偶数長circuitを作れるため、cycle同士はvertex-disjointでなければならない。
- 条件を満たすconnected graphは、素数長cycle blockとbridgeからなるvertex-disjoint cactusである。rooted labelled構造の指数型母関数Fは、G(x)=x+Σ_{prime p≥3}x^p/2としてF=G(x exp F)を満たす。

#### 候補を比較する

- **採用**: cactusのrooted EGF方程式を立て、Kinoshita–Li形式的冪級数合成を用いたNewton法または逆関数で解く — N=2.5×10^5では平方根次数の古典的compositionも重く、合成をO(N log²N)で行えば暗黙方程式の係数を制約内で得られる。
- **棄却**: graphのedge subsetやcycle配置を直接列挙する — 単純graphは2^{N choose 2}個あり、cactusへ特徴付けてもlabel配置を個別に数えるのは指数的である。

#### 鍵となる着眼

- rootに付く独立な子構造はx exp F、rootを含むprime cycleはその構造をp個環状に並べ、二方向の対称性で2除算する。
- power projection [x^n]f(x)^i g(x)をBostan–Mori型に計算し、転置原理で線形写像を逆順・転置すると高速composition g(f(x))が得られる。

#### アルゴリズムへ接続する

prime indicatorからGをN次まで構成する。F=G(x exp F)に対し、compositionをKinoshita–Li法で評価してFPS Newton iterationする（またはH=exp Gからx/H(x)のcompositional inverseを求める）。最後にrooted EGF係数をfactorialで戻す。


## 転用するときの確認

- **block decompositionと指数型母関数**: labelled connected構造がroot周りのsetとcycle blockへ分解できるとき。 適用: vertex-disjoint prime cycle cactusをF=G(x exp F)で表す。
- **転置原理によるFPS composition**: 既知の高速線形変換の転置が欲しい係数写像になるとき。 適用: power projectionを転置してKinoshita–Li合成を得る。
- **FPS Newton iteration**: 形式的冪級数の暗黙方程式を高次数まで解くとき。 適用: A(F)=0を倍精度反復し、各評価に高速compositionを使う。
- graphの全trail条件は、複数cycleを組み合わせた新しいtrailが作る禁止構造を調べ、block構造へ翻訳する。
- N≤7で全simple graphを列挙し、circuit条件と「vertex-disjoint prime cycles」の同値を検査する。母関数の低次係数もこの列挙値と照合してから高速compositionを信頼する。

## 到達確認

### 到達確認 1 — 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)

**課題**: ABC439 G「Sugoroku 6」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 多数人のすごろく勝率を、時刻方向の power projection と人方向の有理関数係数化で高速に一括計算できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 多数人のすごろく勝率を、時刻方向の power projection と人方向の有理関数係数化で高速に一括計算できる。

- 対象技能が担う箇所: 多数人のすごろく勝率を、時刻方向の power projection と人方向の有理関数係数化で高速に一括計算できる。
- 転移題材の解法接続: D と G=1+…+x^{N-1} に power projection を適用して f_n=[x^{N-1}]D^nG を得て g を差分化する。各 k の (w_k,r_k) から分数 w_k/(1-r_kx) を作り、積木状に分子分母をマージする。総分母の FPS inverse と分子を掛け、係数0…L-2を人1…L-1の答えにし、人Lは Σg_k f_k^{L-1} を直接求める。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-fps-composition-power-projection`
