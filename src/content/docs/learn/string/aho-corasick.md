---
title: "Aho–Corasick"
description: "前提からAho–Corasickを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 180
---

# Aho–Corasick

このページは **小節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 有限状態automatonの構成、Trieで共有接頭辞を索引化する
- この位置で学ぶ理由: 有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

検索語: AC automaton、Aho–Corasick法、多パターン照合

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる

題材: [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f)

#### このOutcomeを支える根拠

- 長さ100の全26進文字列から、最大8patternをすべてsubstringに含むものを制約内で数えられる。

#### 観察

- 文字列を左から生成すると、将来pattern出現に影響する過去情報は「末尾のうちいずれかのS_iのprefixでもある最長suffix」と既出pattern集合だけである。
- 全pattern長合計は高々80なので、Aho-Corasick automatonでこのsuffix状態と一文字遷移、遷移時に新たに含まれるpattern maskを小さく持てる。

#### 候補を比較する

- **採用**: Aho-Corasick状態×既出pattern bitmaskの長さDP — 26文字を追加してautomaton遷移し、destinationのoutput maskをORする。dpをL回進めたfull maskの総数が答えで、O(L·states·2^N·26)。
- **棄却**: 26^L個の文字列を生成して各S_iをsubstring検索する — 候補数が指数的で、pattern matchingに必要なsuffix情報をautomaton stateへ共有できていない。

#### 鍵となる着眼

- failure link先のoutput maskもnodeへ伝播すれば、ある文字追加で終端するpatternだけでなく、そのsuffixとして同時に出現する短いpatternも一度のORで記録できる。
- 未登録文字の遷移もfailure linkに従うcomplete DFAへ前計算すれば、DP内の一文字遷移をO(1)にできる。

#### アルゴリズムへ接続する

S_iをtrieへ挿入して終端nodeにbit iを立て、BFSでfailure link・全26遷移・累積output maskを構築する。dp[start][0]=1からL文字、各state/mask/charでnextStateへ進みmask|output[nextState]へ加算し、最後にmask=(1<<N)-1を全stateで足す。


## 転用するときの確認

- **Aho-Corasick automaton**: 複数patternのsubstring出現を文字列生成DPの有限suffix状態にしたいとき。 適用: trieとfailure linkでprefix/suffix一致をDFA遷移として前計算する。
- **bitmask DP**: 必要pattern数N≤8で、どれが既出かを追うとき。 適用: automaton output集合をmaskへORして全包含状態を数える。
- **文字列生成DP**: 固定長のalphabet列を左から作り、有限automatonで性質を判定するとき。 適用: 位置・automaton state・付加maskを状態に26遷移する。
- 複数substring制約の生成数え上げでは、AC state＋達成maskが標準的な十分統計量になる。
- patternが他patternのsubstring、共通prefix、重なって同時出現、Lが最長pattern未満の例を小alphabet全列挙と比較する。

## 到達確認

### 到達確認 1 — 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる

転移題材: [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f)

**課題**: ABC458 F「Critical Misread」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 複数禁止patternを避ける長さN文字列数を、Aho-Corasick状態圧縮と行列累乗で対数段に計算できる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 複数禁止patternを避ける長さN文字列数を、Aho-Corasick状態圧縮と行列累乗で対数段に計算できる。

- 対象技能が担う箇所: 複数禁止patternを避ける長さN文字列数を、Aho-Corasick状態圧縮と行列累乗で対数段に計算できる。
- 転移題材の解法接続: 全patternをtrieへ入れfailure linkとcomplete gotoをBFS構築し、terminal伝播する。safe node間で26文字の遷移をcountしたmatrixを作り、root one-hot vectorをbinary exponentiationでN回遷移させ、safe state成分を総和する。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。

</details>


## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `16aff2521fde16d8f7695f35e1675cd5bb22fdbf94f6ef6a336eb09a3559f853` / LearningUnit `unit-aho-corasick`
