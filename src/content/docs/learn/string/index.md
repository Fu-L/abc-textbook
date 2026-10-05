---
title: "文字列アルゴリズム"
description: "「文字列アルゴリズム」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 148
---

# 文字列アルゴリズム

導入対象の目安: **水色（1200–1599）**。prefix・suffix・一致長・有限状態という文字列の共有単位を学ぶ入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

Trieによる接頭辞共有とprefix matching・Z algorithmによる一致区間の再利用から、周期・回文を調べ、suffix arrayとLCPによる標準的な接尾辞索引へ進む。次に有限状態への同値化、pattern automaton、Aho–Corasick、subset construction、Suffix Automatonを続けて学ぶ。その後、runの局所変化と再帰的な圧縮文字列で、明示展開せずに列を扱う。rolling fingerprintはデータ構造章、automaton上の計数はDP章へ接続する。

### 文字列状態表現

一致・接辞・反復を十分な文字列状態へ圧縮する。

### 習得する技能

- 一致・接頭辞・接尾辞・反復に必要な文字列状態を特定できる。

## 考え方

文字列は文字の列として走査する場合と、prefix・suffix・一致する区間の集合として扱う場合で必要な情報が変わる。まず比較を何回繰り返すのかを数え、一致長を再利用する索引か、将来の一致に必要な履歴をまとめる状態機械かを選ぶ。

## 成立条件と計算量

長さをN、文字種数をσとする。配列遷移と連想配列では時間・空間が変わるためσを隠さない。文字列を実際にコピーする費用も数える。章の目次から必要な表現を選び、各単元の直接前提を確認して問題へ進む。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

接頭辞・接尾辞・一致長などの文字列状態を共通言語にし、各種の照合・索引法へ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 章の構成

項目は各章の読書順に並べています。親子関係は順序と独立しているため、階層を字下げで表さず、子Unitには「概念上の親」を示します。導入項目は関連手法の見取り図で、発展的なUnitは対象色を目安に後から戻って学べます。

- [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/) — 水色
- [接頭辞との一致長を再利用する](/learn/string/string-prefix-automata/) — 水色（導入）
- [Z algorithmによるprefix matching](/learn/string/z-algorithm/) — 水色。概念上の親: [接頭辞との一致長を再利用する](/learn/string/string-prefix-automata/)
- [文字列周期・primitive word](/learn/string/string-periodicity/) — 青色
- [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/) — 青色
- [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/) — 青色
- [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/) — 青色（導入）
- [有限状態automatonの構成](/learn/string/finite-pattern-automaton/) — 青色。概念上の親: [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)
- [Aho–Corasick](/learn/string/aho-corasick/) — 黄色。概念上の親: [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)
- [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/) — 黄色。概念上の親: [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)
- [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/) — 橙色
- [run-length状態の動的遷移](/learn/string/run-length-dynamics/) — 青色
- [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。）。
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。）。
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-chapter-string`
