---
title: "一次合同・CRTで解の類を統合する"
description: "「一次合同・CRTで解の類を統合する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 169
---

# 一次合同・CRTで解の類を統合する

習得対象の目安: **青色（1600–1999）**。一次合同の可解条件を確認し、非互いに素な法も含めてCRTで統合する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 一次合同・CRT

一次合同のgcd可解性を判定し、互いに素でない法も含めて複数の剰余類を一つへ統合する。

### 習得する技能

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

## 考え方

合同式で条件を整理するときは、解の整数を一つだけ求めるのではなく、**どの間隔で解が現れるか**まで持つ。例えば $$x\equiv 4\pmod 5$$ は、整数 $$t$$ を使って $$x=4+5t$$ と書ける整数全体を表す。このように同じ余りを持つ整数の集合を剰余類と呼ぶ。

まず一次合同を一つの剰余類へ直す。その後、複数の条件を二つずつ統合するのが中国剰余定理（CRT）の使い方である。法が互いに素でなくても、条件が両立すれば一つの剰余類にまとめられる。

### 一次合同を解いてから二類を統合する

例えば $$6x\equiv 4\pmod {10}$$ を解きたい。これは $$6x-4$$ が $$10$$ の倍数という条件なので、両辺だけでなく法も $$2$$ で割り、$$3x\equiv 2\pmod 5$$ と同値に変形できる。法 $$5$$ では $$3\cdot 2\equiv 1$$ より $$3$$ の逆元は $$2$$ だから、次を得る。

$$
\begin{aligned}
&6x\equiv 4\pmod {10}\\
&\iff 3x\equiv 2\pmod 5\\
&\iff x\equiv 4\pmod 5
\end{aligned}
$$

元の法 $$10$$ で $$0$$ 以上 $$10$$ 未満の代表を並べると、解は $$4,9$$ の二つである。実際、$$6\cdot 4=24$$ も $$6\cdot 9=54$$ も $$10$$ で割った余りが $$4$$ になる。この二つを別々に管理する代わりに、$$\ldots,-1,4,9,14,\ldots$$ をまとめて $$x\equiv 4\pmod 5$$ と持てばよい。**法を縮めることで、元の法で複数あった解の代表を一つの類で表せる。**

一般に、整数 $$a,b$$ と正の法 $$m$$ に対して $$ax\equiv b\pmod m$$ を考える。$$g=\gcd(a,m)$$ とすると、$$ax$$ も $$m$$ の倍数も $$g$$ の倍数なので、$$b$$ が $$g$$ の倍数でなければ解はない。例えば $$6x\equiv 3\pmod {10}$$ は偶数と奇数が一致しないため解なしとなる。

$$g$$ が $$b$$ を割るときは、$$a'=a/g,\ b'=b/g,\ m'=m/g$$ と置く。$$m$$ が $$ax-b$$ を割る条件は、$$m'$$ が $$a'x-b'$$ を割る条件と同値である。さらに $$\gcd(a',m')=1$$ なので、$$m'>1$$ なら逆元を使える。

$$
\begin{aligned}
&ax\equiv b\pmod m\\
&\iff a'x\equiv b'\pmod {m'}\\
&\iff x\equiv b'(a')^{-1}\pmod {m'}
\end{aligned}
$$

この解の代表を $$0\leq x_0<m'$$ に取ると、全解は $$x=x_0+m't$$（$$t$$ は任意の整数）である。元の法 $$m=gm'$$ での代表は $$x_0,x_0+m',\ldots,x_0+(g-1)m'$$ のちょうど $$g$$ 個となる。これで可解条件が十分でもあることと、解を漏らしていないことが分かる。

$$m'=1$$ の場合は、割った後の条件が法 $$1$$ の合同式となるため全整数が解である。逆元は計算せず、$$x\equiv 0\pmod 1$$ を返す。元の法が $$1$$ の場合や、$$a=0$$ かつ $$m$$ が $$b$$ を割る場合もここに含まれる。

### 互いに素でない二つの条件を統合する

次に、$$x\equiv 1\pmod 6$$ と $$x\equiv 3\pmod {10}$$ を同時に満たす整数を求めよう。一つ目を満たす整数は $$x=1+6k$$（$$k$$ は整数）なので、これを二つ目へ代入する。

$$
\begin{aligned}
1+6k&\equiv 3\pmod {10}\\
6k&\equiv 2\pmod {10}\\
3k&\equiv 1\pmod 5\\
k&\equiv 2\pmod 5
\end{aligned}
$$

ここで使ったのは、先ほどの一次合同の解き方そのものである。$$k=2+5t$$ を戻すと $$x=1+6(2+5t)=13+30t$$ だから、統合結果は $$x\equiv 13\pmod {30}$$。$$13$$ が両条件を満たすだけでなく、$$30$$ 間隔の全解を表している。法は $$6\cdot 10=60$$ ではなく、最小公倍数 $$\operatorname{lcm}(6,10)=30$$ になる。

二つ目を $$x\equiv 2\pmod {10}$$ に替えると、代入後は $$6k\equiv 1\pmod {10}$$ となる。$$\gcd(6,10)=2$$ は右辺の $$1$$ を割らないので解はない。元の条件でも、一つ目は奇数、二つ目は偶数を要求しており両立しないと確認できる。

一般の二条件 $$x\equiv a\pmod m$$、$$x\equiv b\pmod n$$（$$m,n>0$$）でも、$$x=a+mk$$ と置けば $$mk\equiv b-a\pmod n$$ となる。したがって $$g=\gcd(m,n)$$ が差 $$b-a$$ を割ることが両立の必要十分条件である。これは $$a\equiv b\pmod g$$ と同じで、二つの条件が共通の約数に関して矛盾しないかを調べている。

両立するとき、$$n'=n/g>1$$ なら、法 $$n'$$ で $$m/g$$ の逆元を使って $$k$$ を求める。

$$
k\equiv \frac{b-a}{g}\left(\frac{m}{g}\right)^{-1}\pmod {n'}
$$

この右辺を $$0\leq k_0<n'$$ に正規化する。全解 $$k=k_0+n't$$ を戻すと、$$x=a+mk_0+mn' t$$ となる。そこで $$L=mn'=\operatorname{lcm}(m,n)$$ とし、$$a+mk_0$$ を法 $$L$$ で正規化した代表を $$r$$ とすれば、統合結果は $$x\equiv r\pmod L$$ である。逆にこの形の整数は両条件を満たすので、解全体がこの一類に一致する。二解の差が $$m,n$$ 双方の倍数、つまり $$L$$ の倍数になることからも一意性を確認できる。

$$n'=1$$ なら $$n$$ が $$m$$ を割る。両立を確認済みなら、一つ目を満たすすべての整数が二つ目も満たすので、逆元を取らず既存の類 $$x\equiv a\pmod m$$ を正規化して返す。例えば $$x\equiv 13\pmod {30}$$ に $$x\equiv 3\pmod {10}$$ を加えても類は変わらない。同じ法同士の統合もこの場合に含まれ、代表が合同ならその類を返し、合同でなければ両立判定で解なしとなる。

### 複数条件では全整数の類から始める

初期状態を $$x\equiv 0\pmod 1$$ とすれば、まだ条件のない全整数を表せる。条件を一つ加えるたびに、現在の類と新しい類を上の手順で統合する。「現在の類は、これまでの全条件を満たす整数全体」という意味を保てるため、途中で両立しなければ全体も解なしとなる。

[ABC286 F の公式解説](https://atcoder.jp/contests/abc286/editorial/5588)では、巡回の移動量から得た複数の余りを CRT で統合する。[ABC423 G の公式解説](https://atcoder.jp/contests/abc423/editorial/13874)では、桁列の連結から生じる一次合同を、最大公約数による可解判定と法の縮約で解く。問題へ進む際は、まず得られる条件が一次合同なのか、既に余りを指定した類なのかを見分ける。上の数値例と一般 CRT の導出は、本単元で補った説明である。

## 成立条件と計算量

法は正とし、逆元を取る前に必ず最大公約数による可解判定を行う。一次合同では $$m'=1$$、CRT では $$n'=1$$ を先に分岐させる。逆元を取れるのは、縮約した係数と法が互いに素で、法が $$1$$ より大きい場合である。

負の代表も同じ類を表す。例えば $$x\equiv -1\pmod 5$$ は $$x\equiv 4\pmod 5$$ と同じである。各段階の代表は、法を $$M>0$$ として $$0$$ 以上 $$M$$ 未満へ正規化する。負数の `%` が負になり得る言語では、剰余を求めて負なら $$M$$ を加える。CRT の差 $$b-a$$ が負になる場合も、この正規化を省かない。

最小公倍数は $$L=m(n/g)$$ として、積より先に割り算を行う。ただし、それだけでオーバーフローを防げるわけではない。$$L$$、代表を作る $$a+mk_0$$、$$k_0$$ を求める逆元との積まで収まる整数幅を確認する。最終的な代表が小さくても、途中の積や統合後の法は大きくなり得る。収まらない場合は、より広い整数型・多倍長整数・積を直接作らない剰余乗算などを、必要な箇所に使う。

扱う整数の絶対値と法を上から抑える値を $$U\geq 2$$ とする。整数の四則演算を定数時間と数える範囲では、最大公約数と逆元を拡張ユークリッドの互除法で求め、一次合同一つ、または二類の統合一回につき時間 $$O(\log U)$$。$$q$$ 個の条件の逐次統合は全体で $$O(q\log U)$$ となる。$$U$$ には入力の法だけでなく、統合で成長する法や途中の整数も含める。反復版の互除法を使い、条件を順に読み込めば、追加空間は $$O(1)$$ 個の整数で済む。多倍長整数を使う場合は、これに桁数に応じた演算時間・記憶量がかかる。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)、[法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

法上の演算とBézout等式を使えることを前提に、一次合同の可解性を判定して複数条件をCRTで統合する。

### このUnitでは扱わないもの

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 問題一覧

- [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。追加で学ぶ技能: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。追加で学ぶ技能: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC286 F 公式解説](https://atcoder.jp/contests/abc286/editorial/5588)
- [ABC286 F 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC371 G 公式解説](https://atcoder.jp/contests/abc371/editorial/10927)
- [ABC371 G 公式問題文](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC423 G 公式解説](https://atcoder.jp/contests/abc423/editorial/13874)
- [ABC423 G 公式問題文](https://atcoder.jp/contests/abc423/tasks/abc423_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-modular-congruence`
