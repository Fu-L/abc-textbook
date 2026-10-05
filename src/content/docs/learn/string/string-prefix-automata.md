---
title: "接頭辞との一致長を再利用する"
description: "「接頭辞との一致長を再利用する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 150
---

# 接頭辞との一致長を再利用する

導入対象の目安: **水色（1200–1599）**。既に調べた一致区間を再利用する考え方へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

各位置から接頭辞との一致長を求める。既に得られた一致区間の情報を再利用し、Z algorithmで全位置を線形時間に処理する。

## 考え方

文字列Sの各位置iについて、Sの先頭とS[i:]が何文字一致するかをZ[i]とする。各位置で先頭から比較し直すと、同じ文字を何度も調べてしまう。Z法では、先頭と一致すると既に分かっている区間[l,r)、すなわちS[l:r]=S[0:r−l]を保存する。

iがこの区間内なら、位置iからの比較を、先頭側の位置i−lからの比較へ写せる。既に求めたZ[i−l]のうち区間内に収まるmin(r−i,Z[i−l])文字は比較せず再利用できる。その一致がrまで届いたときだけ、右端より先を直接調べる。詳しい初期化・更新と連結文字列による照合は、下位のZ algorithm単元で扱う。

## 成立条件と計算量

長さNの文字列ではO(N)時間・空間。再利用で済まない一致比較は既知区間の右端を延ばすので、成功する直接比較の総数はO(N)。不一致で止まる比較も各位置で高々一回である。patternとtextを連結して照合する場合も、総文字数に対して線形時間で処理できる。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 接尾辞・LCPの索引、文字列hash、回文半径。KMPのfailure linkによる逐次照合も本Unitの対象に含めない。

## 下位単元

- [Z algorithmによるprefix matching](/learn/string/z-algorithm/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)（prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。

## 根拠

- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC284 F 公式解説](https://atcoder.jp/contests/abc284/editorial/5469)
- [ABC284 F 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_f)
- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-string-prefix-automata`
