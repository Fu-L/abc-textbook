---
title: "乱択代数fingerprint"
description: "「乱択代数fingerprint」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 26
---

# 乱択代数fingerprint

習得対象の目安: **黄色（2000–2399）**。体やXORへの写像を設計し、代数的な衝突確率を全比較回数まで含めて評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 乱択代数fingerprint

multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。

### 習得する技能

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

指紋は「等しい対象なら必ず同じ値になる」写像として作る。異なる対象が同じ値になる衝突だけが誤りなので、指紋の不一致は非同値の確定、指紋の一致は同値の推定である。何を同一視するかを先に固定し、以下の三つの構成を使い分ける。入力と操作列は乱数を選ぶ前に固定されているとする。

### 多重集合: 個数を体上の和へ写す

素数pを選び、値vごとに独立一様なr_v∈F_pを一度割り当てる。個数c_vの多重集合をH=Σ_v c_v r_v mod pへ写す。空集合は0、vを一個挿入すればH←H+r_v、削除すればH←H−r_vである。同じ値は常に同じr_vを使い、比較する二つの配列でも割当てを共有する。和なので順序は消え、個数は係数として残る。

異なる二集合の差をΔ_v=c_v−c'_vとする。あるvでΔ_v≠0 mod pなら、他の乱数を固定したときΣ_v Δ_v r_v=0を満たすr_vは体上でただ一つ。従って衝突確率は1/pである。整数として異なる個数がmod pで消えないよう、例えば各集合の大きさをp未満にする。p個の同じ値と空集合は必ず同じ指紋になるので、この条件は乱数を増やしても補えない。

配列AのprefixをP[0]=0、P[i+1]=P[i]+r_(A[i])で作れば、半開区間[l,r)の多重集合指紋はP[r]−P[l]。ABC367 Fのような静的な二配列は、異なる値数Vの乱数表と長さNのprefixをO(V+N)で構築し、一比較O(1)。集合そのものの一挿入・削除もO(1)だが、配列の一点更新後にprefix全体を直すのはO(N)であり、動的な区間比較には別途区間和の構造を使う。

値の乱数をそのままXORする構成では、同じ値が二回現れると消える。{x,x}と{y,y}が常に0になり、一般の多重集合は比較できない。加算とXORを、どちらも「ランダムな和」だからと交換しない。

### 素因数指数: 剰余状態ごとの乱数をXORする

正整数の積が完全k乗かを調べるには、素数qの指数e_qをs_q=e_q mod kへ縮約する。完全k乗であることと、全座標s_qが0であることが同値である。k≥2とし、z_(q,0)=0、1≤s<kには独立一様なW-bit値z_(q,s)を割り当て、状態vectorの指紋をH=⊕_q z_(q,s_q)とする。

初期状態は全座標0、H=0。素数qの指数をδ増減するとき、旧状態sを保存し、s'=(s+δ) mod kを0以上へ正規化して、H←H XOR z_(q,s) XOR z_(q,s')と更新する。旧寄与を消して新寄与を入れるので、指数がkへ到達したときも正しく0へ戻る。例えばk=3で同じ素数を三回掛ければ、寄与はz_(q,1)、z_(q,2)、0と変わる。一個の乱数を掛けるたびXORする方法では二回で0になってしまう。

異なる二vectorには状態の違う座標qがある。そこで一方だけに現れる非零状態の乱数一個を残し、他の全乱数を固定すると、二指紋のXORは一様なW-bit値になる。従って衝突確率は2^(−W)。異なる座標・状態への乱数割当ての独立性が必要である。

ABC238 Gではprefix積の指数剰余vector C_iを順に更新し、その指紋F_iを保存する。[l,r)の積が立方数であることはC_l=C_rと同値なので、F_lとF_rを比較する。Hは指数の数値和ではなく状態vectorの指紋であり、区間の指数指紋を単純な加算差として扱わない。

素因数分解の総費用をT_fact、更新する素数座標の延べ数をE、現れる素数数をVとすると、全状態の乱数表はO(Vk)、prefix構築はO(T_fact+Vk+E+N)、一比較はO(1)。一つの整数の乗除は、その素因数分解費用と異なる素因数数に比例する更新費用がかかる。訪れた(q,s)だけに乱数を割り当てる方法でも、割当てを保存して再利用する。

### 巨大整数式: ランダムな素数で剰余を取る

十進L桁の整数は、h=0から各桁dについてh←(10h+d) mod pとすればO(L)で剰余を作れる。和・差・積は剰余同士の同じ演算へ写り、ABC339 FのA·B=Cはh(A)h(B)=h(C) mod pとして検査できる。これは数値を正確に保存するのではなく、等式が成立するときの一致を保存している。

この方式で乱数にするのは評価点ではなく法pである。非零の整数D=A·B−Cを誤って0と判定するのはpがDを割る場合に限る。K個の相異なる素数からなる集合Pを用意し、全てp≥B≥2とし、その中から一様に選ぶ。PのうちDを割る素数がa個なら、その積も|D|を割りB^a≤|D|。従って|D|≤D_maxに対して、一検査の誤りはε=min(1, floor(log D_max / log B)/K)以下となる。|D|=1なら衝突しない。

各整数がL桁以下なら|A·B−C|<10^(2L)を使える。桁数の上界から悪い素数の個数を界し、実際の素数集合の大きさKで割る。この保証は多項式の次数/評価点数という保証とは別物であり、固定された法や「大きい素数を一つ選んだ」ことだけでは導けない。素数集合の生成・素数性の確認費用も前処理に含める。

t個の独立な法を使う場合、入力の総桁数D_totalに対する剰余構築はO(t D_total)、一つの式の加減乗算や比較はO(t)。N個の整数の全積候補を作る場合はO(t N²)に辞書などの管理費用を加える。一方、確率を評価する対象は計算時間とは別に数える。全てのi,j,kについてA_i A_j=A_kを判定する答えなら、誤り得る等式の数は高々N³であり、辞書で比較をまとめたことだけでN²へ減らさない。剰余乗算には結果を失わない整数幅またはmod乗算を用いる。

## 成立条件と計算量

一比較の誤り上界をεとし、独立な乱数表または法をt組用意して全指紋が一致したときだけ同値と判定すれば、一比較の誤りはε^t以下。固定されたQ個の比較全体ではunion boundによりQε^t以下なので、許容誤りηに対してQε^t≤ηとなるtを選ぶ。比較同士が同じ乱数を共有していてもunion boundは使えるが、ε^tへの減少にはt組の独立性が必要である。処理時間と記憶量もt倍になる。

乱数を公開した後に入力が選ばれる場合には、固定入力に対する上の証明をそのまま使えない。比較内容が途中の指紋判定に依存する場合も、誤りが初めて起きるまでの比較列を固定できるか、候補となる全比較へ上界を取るかを確かめる。[列のrolling fingerprint](/learn/query/sequence-fingerprint/)のような多項式評価では、非零性・次数・評価点の選び方を別に証明する。

概念上の親: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

このUnitを直接前提とする単元: なし。

乱択・Monte Carloアルゴリズムで得た考え方と実装を再利用し、乱択代数fingerprintの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC367 F「Rearrange Query」](https://atcoder.jp/contests/abc367/tasks/abc367_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。
- [ABC339 F「Product Equality」](https://atcoder.jp/contests/abc339/tasks/abc339_f) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。
- [ABC238 G「Cubic?」](https://atcoder.jp/contests/abc238/tasks/abc238_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g) — 主題: [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)（multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)
- [ABC367 F 公式解説](https://atcoder.jp/contests/abc367/editorial/10692)
- [ABC367 F 公式問題文](https://atcoder.jp/contests/abc367/tasks/abc367_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-randomized-algebraic-fingerprint`
