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

各位置から接頭辞と一致する最大長を並べた配列がZ配列である。先頭と等しい既知の区間（Z-box）を再利用し、全位置の一致長を線形時間で求める。

### 習得する技能

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

## 考え方

長さ $$N$$ の文字列 $$S$$ を0始まりで扱い、$$S[l:r]$$ は位置 $$l$$ から $$r-1$$ までの部分文字列を表す。$$Z[i]$$ は $$S$$ と接尾辞 $$S[i:]$$ の最長共通接頭辞の長さとする。ここでは $$Z[0]=N$$ と定める。$$N=0$$ なら空配列を返す。各位置で $$Z[i]$$ 文字が一致し、その次が不一致または文字列末尾であることが、配列の意味になる。

### Z-boxの初期化と更新

位置を左から処理し、既に処理した位置（位置0を除く）の一致区間のうち、右端が最も遠いものを半開区間 $$[l,r)$$ として持つ。この区間がZ-boxであり、$$S[l:r]=S[0:r-l]$$ が成り立つ。まだ区間がない最初は $$l=r=0$$ とし、$$i=1,2,\ldots,N-1$$ の順に処理する。

- $$i\geq r$$ なら、再利用できる区間がないので $$Z[i]=0$$ から直接比較を始める。
- $$i<r$$ なら、先頭側の対応位置を $$k=i-l$$ とし、$$Z[i]=\min(r-i,Z[k])$$ から始める。区間内では $$S[i+t]=S[k+t]$$（$$0\leq t<r-i$$）なので、位置 $$i$$ と先頭との比較は、位置 $$k$$ と先頭との比較と同じになる。$$Z[k]<r-i$$ なら、その直後の不一致も区間内へ写せるので、$$Z[i]=Z[k]$$ で確定する。
- まだ確定していない場合（$$i\geq r$$、または再利用した一致が右端に届く場合）は、$$i+Z[i]<N$$ かつ $$S[Z[i]]=S[i+Z[i]]$$ である間、$$Z[i]$$ を増やす。

どの場合も、確定後に $$i+Z[i]>r$$ なら、$$l=i$$、$$r=i+Z[i]$$ へ更新する。

$$Z[k]$$ をそのままコピーすると既知区間の外まで一致を仮定してしまうため、$$r-i$$ で切る必要がある。逆に、$$Z[k]<r-i$$ の場合は次の不一致まで保証されるので、それ以上の比較は要らない。

独自例 `aabaaab` で、右端まで一致する場合と、区間内で不一致になる場合を続けて追おう。

| 位置 $$i$$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 文字 $$S[i]$$ | `a` | `a` | `b` | `a` | `a` | `a` | `b` |
| 一致長 $$Z[i]$$ | 7 | 1 | 0 | 2 | 3 | 1 | 0 |

まず $$Z[1]=1$$ である。$$S[1]=S[0]=\texttt{a}$$ は一致するが、次の $$S[2]=\texttt{b}$$ と $$S[1]=\texttt{a}$$ は異なる。位置3では $$S[3:5]=\texttt{aa}$$ が接頭辞と一致し、次の $$S[5]=\texttt{a}$$ と $$S[2]=\texttt{b}$$ が異なるため、$$Z[3]=2$$、既知区間は $$[3,5)$$ となる。

位置 $$i=4$$ では $$k=4-3=1$$、右端までの長さは $$5-4=1$$ なので、$$\min(1,Z[1])=1$$ 文字を再利用する。具体的には、$$S[4]$$ を先頭側の $$S[1]$$ へ写し、既に分かっている $$S[1]=S[0]=\texttt{a}$$ を使う。位置1で見つけた次の不一致はここでは使えない。その対応先の位置5は、既知区間 $$[3,5)$$ の外だからである。そこで外側を直接比べると、$$S[5]=S[1]=\texttt{a}$$、$$S[6]=S[2]=\texttt{b}$$ も一致する。末尾に達して $$Z[4]=3$$ が確定し、区間を $$[4,7)$$ へ延ばす。

次の位置 $$i=5$$ では $$k=5-4=1$$ だが、今度は右端まで2文字ある。$$Z[1]=1<2$$ なので、一致する1文字に加えて、その次の不一致も再利用できる。実際、$$S[5]$$ は $$S[1]=\texttt{a}$$ に対応し、$$S[6]$$ は $$S[2]=\texttt{b}$$ に対応する。位置1で分かっていた $$S[2]\neq S[1]$$ を写すと $$S[6]\neq S[1]$$ となり、2文字目で不一致になる。位置6は区間 $$[4,7)$$ の内側なので、追加比較をせず $$Z[5]=1$$ と確定できる。

重要なのは、一致長だけを無条件にコピーすることではなく、**その一致や不一致を保証した文字位置が既知区間内にあるか**を確かめることである。手順はこの区別と直接比較によって各 $$Z[i]$$ を正しく確定し、最も遠い右端を持つZ-boxを保つ。

直接比較で新しく一致した文字は、それまでの右端 $$r$$ 以降にある。右端は戻らず $$N$$ 以下なので、成功比較は合計 $$O(N)$$ 回。不一致比較も各位置で高々一回であり、処理全体は線形時間となる。例えば全て同じ文字でも、位置1で末尾まで調べた後は残りを再利用できる。$$N=1$$ なら繰り返しはなく、$$Z=(1)$$ を返す。

### パターン照合への利用

長さ $$m$$ のパターン $$P$$ と照合先の文字列 $$T$$ に、両方に出現しない区切り文字 `#` を挟み、$$S=P+\texttt{\#}+T$$ を作る。ここで $$+$$ は文字列の連結を表す。$$T$$ の位置 $$j$$ に $$P$$ が出現する条件は $$Z[m+1+j]\geq m$$ である。最大一致長が欲しい場合は $$\min(m,Z[m+1+j])$$ を取る。すべての位置を調べるので重複出現も見落とさない。区切りを使えない文字集合では、文字を整数へ写し、別の整数を区切りにする。

例えばABC430 Eでは、巡回シフトを二重化した文字列の部分文字列へ写す。ABC284 Fでは、反転して向きをそろえた二つの文字列を両順序で連結し、必要な区間一致を接頭辞との一致へ写す。どちらも、照合したい文字列を連結後の先頭に置くことが使い方の核になる。

## 成立条件と計算量

一文字の比較が $$O(1)$$ なら、長さ $$N$$ に対して $$O(N)$$ 時間・空間。連結による照合は $$O(m+|T|)$$ 時間・空間となる。$$Z[0]$$ を0とする実装もあるので、その値を使う場合は規約を合わせる。空パターンの扱いは照合先の定義で別に決める。Zで検査できる「端が欠けてもよい周期」と、長さが周期の倍数である完全反復との違いは、後続の文字列周期単元で扱う。

概念上の親: [接頭辞との一致長を再利用する](/learn/string/string-prefix-automata/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [文字列周期・primitive word](/learn/string/string-periodicity/)。

同じパターンと多数の位置を照合したいときは、パターンを先頭に置いた連結文字列を考える。再利用できる範囲をZ-boxの右端で区切ることが、正しさと線形時間を両立させる。

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

- [ABC430 E 公式解説](https://atcoder.jp/contests/abc430/editorial/14330)
- [ABC430 E 公式問題文](https://atcoder.jp/contests/abc430/tasks/abc430_e)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC284 F 公式解説](https://atcoder.jp/contests/abc284/editorial/5469)
- [ABC284 F 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_f)
- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-z-algorithm`
