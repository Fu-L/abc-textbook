---
title: "列・文字列のrolling fingerprint"
description: "前提から列・文字列のrolling fingerprintを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 147
---

# 列・文字列のrolling fingerprint

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### この単元では扱わない範囲

- 列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### 列・文字列のrolling fingerprint

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。

検索語: polynomial hash、rolling hash、ローリングハッシュ

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

題材: [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f)

選定理由: nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。

この例で扱う範囲: 連結順を保つhashと逆順hashの構成・比較を取り出す。更新用segment treeの実装はrange monoidの節で扱う。

#### このOutcomeを支える根拠

- nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。

#### 観察から手順へ

- 文字を体F_pの異なる元へ写し、基数bに対してh(s)=s_0 b^(n-1)+…+s_(n-1)と定める。h(st)=h(s)b^|t|+h(t)なので、文字の順序と長さを保って連結できる。
- 各列を(f,r,q)=(順方向hash,逆方向hash,b^長さ)で要約する。SとTの連結は(f_S q_T+f_T, r_S+q_S r_T, q_S q_T)。長さ0は(0,0,1)であり、逆向き側の結合順が反転することを確認する。
- 静的な列ではH[i]=h(S[0:i])と基数冪を前計算すると、h(S[l:r])=H[r]-H[l]b^(r-l)をO(1)で取り出せる。比較する列の長さと指数位置を揃える。
- 回文なら順方向と逆方向のhashは等しい。例えばabaは常に一致するが、異なる列でも衝突し得る。固定された長さLの異なる二列と一様な非零基数に対し、差の非零多項式の次数は高々L-1なので、衝突確率は高々(L-1)/(p-1)。多数比較ではその総数も含めて評価する。
- ABC331 Fではこの要約を順序を保つ区間集約に載せると更新と回文queryを扱える。ここでは要約と結合式までを導出し、後続のデータ構造からそのまま再利用する。


## 転用するときの確認

- **Rolling Hashの結合monoid**: 文字列の連結順を保つ区間情報を、更新可能な木へ載せたいとき。 適用: 両向きhashと基数冪をnodeに持ち、区間結合を定数時間にする。
- **segment treeによる動的文字列query**: 1点更新と任意区間の結合可能な性質判定が混在するとき。 適用: 文字更新を葉更新、substring hashを区間積としてO(log N)処理する。
- 区間性質そのものが合成不能なら、その性質を比較可能な二つの合成可能な表現へ写す。
- 長さ1・偶数長・奇数長、先頭末尾更新、同文字への更新を素朴な反転比較とrandom testし、特に左右結合式を検証する。

## 到達確認

### 到達確認 1 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる

転移題材: [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)

**課題**: ABC274 Exを転移題材とし、加算がXORと一致する体の乗算・減算をO(1)で使える部分問題を与える。体の構成は課さない。二つの区間列の要素ごとのXORと第三の区間列を、共通の基数によるprefix hashとLCP探索で辞書順比較する手順を導く。

**合格条件**: 手法名の列挙に留まらず、学習成果「順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 二subarraysのelementwise XOR列と第三subarrayのlexicographic relationを高速に判定できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 二subarraysのelementwise XOR列と第三subarrayのlexicographic relationを高速に判定できる。

- 同じ長さ・同じ指数位置に揃えたhashを使う。体の分配則からh(A XOR B)=h(A)+h(B)となる。普通の素数法の加算を整数XORと同一視してはいけない。
- 各prefixのhashを前計算し、h(S[l:r])=H[r]-H[l]b^(r-l)で区間を正規化する。二つの区間hashの和と第三の区間hashの等値を比較する。
- 真のprefix一致は長さに関して単調なので、hash衝突がない事象の下で最長一致長を二分探索する。先頭不一致位置の元の整数値を直接比較し、全長一致なら同値とする。
- 前計算O(N)、一比較O(log N)回の体演算。等値試験の総数と差の多項式次数から衝突確率を界す。体演算のAPIを実装する費用は、この部分問題の計算量から分離する。

期待する到達点: 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

</details>


## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-sequence-fingerprint`
