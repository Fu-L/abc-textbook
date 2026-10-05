---
title: "Convex Hull Trick・直線包絡"
description: "「Convex Hull Trick・直線包絡」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 222
---

# Convex Hull Trick・直線包絡

習得対象の目安: **黄色（2000–2399）**。DPなどの候補を一次関数へ写し、傾き・交点順やLi Chao Treeで包絡を保つ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Convex Hull Trick・直線包絡

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。

### 習得する技能

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

## 考え方

dp[i]=h(i)+min_{j<i}(a_j x_i+b_j)の形なら、確定した過去の状態jを直線f_j(x)=a_j x+b_jとして保存し、点x_iでの下側包絡線を求める。h(i)はquery後に足す。j<iが条件なら、初期状態の直線を入れ、queryでdp[i]を確定してからiの直線を追加する。挿入とqueryの順を逆にすると自己遷移が混ざる。

### 傾き降順の挿入

最小値を求め、挿入する傾きは降順、query点は昇順と固定する。dequeに、下側包絡線に現れる直線を傾き降順で保存する。隣接するf_1(x)=a_1 x+b_1、f_2(x)=a_2 x+b_2（a_1>a_2）の交点はt12=(b_2−b_1)/(a_1−a_2)。x<t12ではf_1が、x>t12ではf_2が小さい。

末尾二本f_1,f_2と追加直線f_3の傾きがa_1>a_2>a_3であるとき、t12≥t23ならf_2を末尾から除く。f_2が両隣以下になるにはx≥t12かつx≤t23が必要で、その区間がない。等号でも交点一つで同値になるだけなので、値だけが必要なら除いてよい。この判定を末尾で繰り返してからf_3を追加すると、残る交点は厳密な昇順になる。

例えば2x、x+3、4はt12=3、t23=1なので中央のx+3を除く。残る2xと4はx=2で最適候補が切り替わる。交点を浮動小数点で作らず、(b_2−b_1)(a_2−a_3)≥(b_3−b_2)(a_1−a_2)で削除を判定できる。分母が正という向きの固定がこの不等式の前提である。

同じ傾きなら切片が小さい一本だけを残す。追加直線の切片が大きいか同じなら捨て、より小さいなら旧直線を末尾から除いて通常の挿入へ進む。

### queryと削除の償却

点xで先頭二本を比べ、f_2(x)≤f_1(x)である間は先頭f_1を除く。その後の先頭が最小値を与える。傾きa_2<a_1なので一度f_2が優れば、より大きい将来のxでもf_1が再び優ることはない。後から直線が増えても、この支配関係は保たれる。

各直線は一度追加され、末尾または先頭から高々一度除かれる。したがってL本の挿入とQ回のqueryの総費用はO(L+Q)となる。空のdequeへのqueryは定義しない。最大値を求めるときは各直線の符号を反転して最小値に直し、反転後の傾き順を確認する。最適状態jの復元が必要ならIDも保存し、同値の候補を消す際の優先規則も合わせる。

query点が任意順なら、queryによる先頭削除を行わず、包絡線全体を配列へ保存する。交点が昇順なので、xで次の直線へ切り替わる最後の境界を二分探索できる。整数xでは隣接直線の値を直接比べても、f_{k+1}(x)≤f_k(x)が成立する境界まで単調に探索できる。

### 挿入順が任意のLi Chao Tree

query座標があらかじめ分かる場合は、その昇順列Xの区間を二分する木を作る。各nodeは一本の直線を持つ。新しい直線gを区間へ追加するとき、空nodeなら保存して終了する。既存直線fがあれば、中央座標で小さい方をnodeへ保存し、負けた方をgとする。

二直線の差は一次式なので、中央で負けたgが優る場所は左か右の片側にしかない。左端でgが優れば左子へ、右端で優れば右子へ追加し、どちらでも優らなければ捨てる。一点区間では小さい方を残して終了する。これにより各座標での最小候補は、その座標を含むroot-to-leaf path上のどこかに残る。queryではそのpathの保存直線をすべて評価して最小を取る。交点順や傾きの挿入順を要求しない。

### 整数位置での担当区間

整数x上で担当区間を合計する場合、傾きa_u>a_vの二直線の切替はstart=ceil((b_v−b_u)/(a_u−a_v))となる。分母を正に固定し、分子が負でも数学的な切上げを使う。同値位置を新しい直線へ渡す規約なら、開始整数を厳密に増加させ、各担当を隣接開始の半開区間として持てる。新開始が末尾の開始以下なら末尾には担当整数がなく、削除して交点を再計算する。

元の不等式が整数のstrict条件なら、まずA x+B y<CをA x+B y≤C−1へ直してから、包絡線の切片・交点・合法な座標上限を決める。後から床を取る式と先に作った候補の比較式が別の条件にならないよう、同じ変形後の直線で担当区間と寄与を計算する。

## 成立条件と計算量

傾き降順・query点昇順のCHTは挿入とqueryが償却O(1)、空間O(L)。傾きだけが単調なら挿入は償却O(1)、任意queryはO(log L)。Li Chao TreeはK個の既知座標で各操作O(log K)、整数座標域の幅Uを二分する方式ではO(log U)となる。評価座標域に合わせて木を作り、区間外へ外挿しない。交点比較の積と直線評価a x+bは広い整数型などで正確に計算する。いずれも追加だけの構造であり、過去の候補の削除を求める場合は別途設計が必要になる。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC289 G「Shopping in AtCoder store」](https://atcoder.jp/contests/abc289/tasks/abc289_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC228 H 公式解説](https://atcoder.jp/contests/abc228/editorial/2946)
- [ABC228 H 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC289 G 公式解説](https://atcoder.jp/contests/abc289/editorial/5700)
- [ABC289 G 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_g)
- [ABC372 G 公式解説](https://atcoder.jp/contests/abc372/editorial/10973)
- [ABC372 G 公式問題文](https://atcoder.jp/contests/abc372/tasks/abc372_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-line-envelope`
