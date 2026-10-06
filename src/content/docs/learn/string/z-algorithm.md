---
title: "Z algorithmによるprefix matching"
description: "「Z algorithmによるprefix matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 151
---

# Z algorithmによるprefix matching

習得対象の目安: **水色（1200–1599）**。Z-boxの不変量と再利用範囲を理解し、prefixとの一致長を線形時間で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Z algorithmによるprefix matching

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。

### 習得する技能

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

## 考え方

長さNの文字列Sに対し、Z[i]をS[0:]とS[i:]の最長共通prefix長とする。ここではZ[0]=Nと定める。N=0なら空配列を返す。各iでZ[i]文字一致し、その次が不一致または文字列末尾であることが配列の意味になる。

### Z-boxの初期化と更新

既に処理した位置のうち一致区間の右端が最も遠いものを[l,r)として持つ。最初はl=r=0とし、i=1からN−1へ順に処理する。

- i≥rなら、Z[i]=0から直接比較を始める。
- i<rなら、k=i−lとしてZ[i]=min(r−i,Z[k])から始める。S[l:r]=S[0:r−l]なので、区間内での比較は位置kで済ませた比較と同じである。Z[k]<r−iなら、その直後の不一致も区間内へ写せるので、Z[i]は既に確定する。
- 一致が右端まで届く場合は、i+Z[i]<NかつS[Z[i]]=S[i+Z[i]]である間Z[i]を増やす。i+Z[i]>rになったら、l=i、r=i+Z[i]へ更新する。

Z[k]をそのままコピーすると既知区間の外まで一致を仮定してしまうため、r−iで切る必要がある。直接比較で新しく一致した文字は右端を進める。右端は戻らずN以下なので成功比較は合計O(N)、不一致比較も各iで高々一回である。

### パターン照合への利用

長さmのpattern Pとtext Tに、両方に出現しない区切り#を挟んでS=P+# +Tを作る。textの位置jでPが出現する条件はZ[m+1+j]≥mである。最大一致長が欲しい場合はmin(m,Z[m+1+j])を取る。すべての位置を調べるので重複出現も見落とさない。区切りを使えない文字集合では文字を整数へ写し、別の整数を区切りにする。

## 成立条件と計算量

一文字の比較がO(1)なら長さNに対してO(N)時間・空間。連結による照合はO(m+|T|)。Z[0]を0とする実装もあるので、その値を使う場合は規約を合わせる。空patternの扱いは照合先の定義で別に決める。Zで検査できる「端が欠けてもよい周期」と、長さが周期の倍数である完全反復との違いは、後続の文字列周期単元で扱う。

概念上の親: [接頭辞との一致長を再利用する](/learn/string/string-prefix-automata/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [文字列周期・primitive word](/learn/string/string-periodicity/)。

各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC430 E「Shift String」](https://atcoder.jp/contests/abc430/tasks/abc430_e) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC284 F「ABCBAC」](https://atcoder.jp/contests/abc284/tasks/abc284_f) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-z-algorithm`
