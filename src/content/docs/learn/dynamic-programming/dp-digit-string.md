---
title: "接頭辞から更新する有限状態DP"
description: "「接頭辞から更新する有限状態DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 71
---

# 接頭辞から更新する有限状態DP

導入対象の目安: **水色（1200–1599）**。prefixの有限情報だけを持つDPを、桁の上限や文字列の制約へ使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

数字や文字を左から一つずつ決めるとき、既に決めた部分を接頭辞という。接頭辞そのものは指数的に増えるが、続きを選ぶために必要な情報が同じなら、一つの状態へまとめられる。この考え方を入口に、文字列の制約を扱うautomaton上のDPと、数値上限を扱う桁DPへ進む。

## 考え方

例えば、`11`を連続する部分文字列として含まない二進列を数えたい。まだ`11`を含んでいない接頭辞`000`と`010`は、どちらも末尾が`0`である。次に`0`も`1`も置け、その先も全く同じ続きを付けられる。末尾が`1`の`001`と`101`も同じ続きを付けられるが、こちらは次に`1`を置くと違反する。

従って、処理した長さごとに「末尾が`1`か」だけを残し、同じ状態に至る接頭辞の個数を足せばよい。空列は、次に`0`も`1`も置けるので末尾`0`側と同じ状態に置く。**同じ状態なら、どの続きを付けられ、最後に条件を満たすかも同じ**であることが、履歴を捨ててよい理由である。この二状態の遷移と数え上げは、子単元の[automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)で追う。

一方、数値上限があると、末尾だけでは次の桁を選べない。上限を二進数の`100`とし、候補も3桁へ`0`埋めして比べる。2桁目までの`10`と`00`はともに末尾`0`だが、前者に`1`を足すと上限を超え、後者なら超えない。そこで「ここまで上限の接頭辞と一致しているか」を追加する。一致中は次の桁を上限の対応桁以下に制限し、既に小さければ残りは自由に選べる。これが[上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)の追加情報であり、文字列の制約もあれば両方を状態に持つ。

加算の繰り上がり（carry）も短い情報を次へ渡すが、自然な処理方向は下位桁からである。本単元の範囲は左から接頭辞を伸ばすDPとし、carryは別単元の[繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)との比較として扱う。

## 成立条件と計算量

長さを $$L$$、一つの長さで持つ状態数を $$S$$、選べる数字・文字の種類数を $$\sigma$$ とする。一文字の遷移と個数の加算が定数時間なら、各長さ・状態で文字を試す時間は $$O(LS\sigma)$$。現在と次の長さの配列を分けて更新すれば、DPの作業領域は $$O(S)$$ で済む。遷移表を保存する場合は別に $$O(S\sigma)$$ の領域と、その構築時間が必要になる。剰余や既出集合などを加えるときは、それらとの組合せも状態数へ含める。

状態へまとめる前に、同じ状態からの合法な文字・遷移先・終端条件が一致することを確かめる。二進列の例では先頭の`0`も一文字だが、整数の桁DPでは桁数合わせの`0`を実際の数字として扱うかを決める必要がある。空列や整数0を答えに含めるかも、子単元で初期状態と終端条件へ反映する。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 整除鎖・加算式のcarryだけを下位桁から渡すDP、および接頭辞状態を使わない一般の表DP。

## 下位単元

- [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/) — 水色
- [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC235 F 公式解説](https://atcoder.jp/contests/abc235/editorial/3247)
- [ABC235 F 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_f)
- [ABC288 H 公式解説](https://atcoder.jp/contests/abc288/editorial/5663)
- [ABC288 H 公式問題文](https://atcoder.jp/contests/abc288/tasks/abc288_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-digit-string`
