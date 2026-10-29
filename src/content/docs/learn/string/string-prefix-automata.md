---
title: "接頭辞との一致長を再利用する"
description: "「接頭辞との一致長を再利用する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 150
---

# 接頭辞との一致長を再利用する

導入対象の目安: **水色（1200–1599）**。既に調べた一致区間を再利用する考え方へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

同じパターンを文字列の各位置と照合するとき、位置を一つずらすたびに先頭から比較し直すと、同じ部分を何度も調べてしまう。既に一致すると分かった区間を先頭側へ対応させ、そこで求めた一致長を再利用するのがZ法の考え方である。

## 考え方

文字位置は0始まりとする。文字列 $$S$$ の位置 $$i$$ からの接尾辞 $$S[i:]$$ と、$$S$$ 自身の接頭辞が先頭から何文字一致するかを $$Z[i]$$ とする。例えば `aaaaa` では、位置1から4文字が一致し、位置2からも3文字が一致する。各位置で比較し直すと、位置2以降の `aaa` が先頭と同じであることを何度も確かめることになる。全て同じ文字なら、長さ $$N$$ に対して比較回数は $$1+2+\cdots+(N-1)$$ となり、二次時間かかる。

位置1からの一致を調べた時点で、`aaaaa` の区間 $$S[1:5]$$ は先頭の $$S[0:4]$$ と等しいと分かっている。その中の位置2から始まる部分 $$S[2:5]$$ は、先頭側の $$S[1:4]$$ と同じである。従って、位置2からの比較を、既に調べた位置1からの比較へ写せる。この例では末尾までの3文字の一致を再利用できる。

一般には、先頭と等しい既知の区間を半開区間 $$[l,r)$$、すなわち $$S[l:r]=S[0:r-l]$$ として保存する。半開区間は左端を含み、右端を含まない。区間内の位置 $$i$$ は先頭側の位置 $$i-l$$ に対応するので、そこで求めた $$Z[i-l]$$ を使える。ただし、対応が保証されるのは右端 $$r$$ の手前までである。区間内で不一致になるならその結果まで再利用でき、一致が右端に達したら、その先を直接調べる。

この「一致区間内の比較を先頭側へ写す」考え方を、[下位のZ単元](/learn/string/z-algorithm/)で具体的な文字位置、初期化と更新の手順へ落とし込む。同じパターンとの多数の照合も、パターンを連結文字列の先頭へ置けば、この一致長の計算へ帰着できる。

## 成立条件と計算量

一文字の比較が $$O(1)$$ なら、長さ $$N$$ の文字列では $$O(N)$$ 時間・空間で全位置の一致長を求められる。再利用で済まない一致比較は既知区間の右端を延ばすので、成功する直接比較の総数は $$O(N)$$。不一致で止まる比較も各位置で高々一回である。パターンと照合先の文字列を連結する場合も、総文字数に対して線形時間で処理できる。

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
