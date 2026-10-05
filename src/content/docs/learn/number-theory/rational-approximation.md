---
title: "連分数・Stern–Brocotで有理近似する"
description: "「連分数・Stern–Brocotで有理近似する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 176
---

# 連分数・Stern–Brocotで有理近似する

習得対象の目安: **橙色（2400–2799）**。連分数や隣接分数の行列式を使い、分母制約下で最良の候補を残す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 連分数・Stern–Brocot有理近似

Euclidの商列またはStern–Brocot区間を辿り、分母制約下の最良有理近似を求める。

下側a/bと上側c/dにbc−ad=1を保つと、mediant (a+c)/(b+d)で区間を細分できる。同方向に何回進めるかをEuclidの商に相当する整数でまとめ、分母上限によって打ち切る。この境界表現を続くStern–Brocot木の単元でも再利用する。

ABC333 Gでは目標値を挟む隣接分数を保ち、分母上限を越えない最大の連続移動回数を計算する。停止後は上下両候補の誤差を分母も含めて比較する。Stern–Brocotの祖先経路を求めることと、分母制約で切った境界候補を比較することを区別する。

### 習得する技能

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

## 考え方

ここでは非負の有理数x=P/Qに対し、分母が1以上N以下の既約分数yで絶対誤差|x−y|を最小にする。P,Qを約分し、Q≤Nならx自身を返して終了する。有限小数の入力は桁列から整数Pと10の冪Qを作れば、大小判定を整数だけで行える。

### 隣接境界を初期化する

x>0では下端a/b=0/1、上端c/d=1/0（形式的な∞）から始める。a/b<x<c/dとbc−ad=1を保つ。mediant m=(a+c)/(b+d)は両端の間にあり、片方の端をmに置き換えても行列式は1である。このため新しい分数は常に既約となる。x=0は0/1で終了する。

毎回、まずb+d>Nなら停止する。そうでなければmとxを交差積Q(a+c)とP(b+d)で比較し、一致ならmを返す。m<xなら下端をmへ、m>xなら上端をmへ動かす。一歩ずつ進むと、xが大きい整数に近い場合などに探索が長くなるため、同方向の移動をまとめる。

### 同方向を最大t回まとめる

現在の境界についてA=P b−Q a>0、B=Q c−P d>0を置く。

- 下端をt回進めた値は(a+t c)/(b+t d)。xを越えない条件はt B≤A、分母条件はb+t d≤Nである。m<xなら、t=min(floor(A/B), floor((N−b)/d))として下端を更新する。d=0のときは分母側の上限がないのでfloor(A/B)だけを使う。
- 上端をt回進めた値は(c+t a)/(d+t b)。xを下回らない条件はt A≤B、分母条件はd+t b≤Nである。m>xなら、t=min(floor(B/A), floor((N−d)/b))として上端を更新する。bは正なのでこの除算は定義される。

直前にmediantが分母制約を満たすことを確認したので、選んだ方向ではt≥1になる。更新した端点がxに一致したらその場で終了する。そうでなければ次の反復へ進む。比の上限で止まると方向が変わり、分母の上限で止まると次のmediantが上限を越える。A,Bは、下端更新でA←A−t B、上端更新でB←B−t Aとなるので、これはEuclid互除法の商ごとの更新である。

### 停止した両端が最良候補となる理由

隣接分数a/b<c/dの間にある既約分数h/kを考える。u=c k−d h、v=b h−a kは正整数であり、bc−ad=1からh=u a+v c、k=u b+v dとなる。したがってk≥b+d。次のmediantの分母がNを越えたら、両端の間に分母N以下の分数は一つもない。

両端より外側の分数は、同じ側の端点よりxから遠い。よって両端が分母制約下の最良の下側・上側候補であり、答えはこの二つのどちらかとなる。初期上端の1/0は出力候補ではないが、停止前に上端を一度更新するか完全一致で終了するので、候補を比較する時点では両分母が正である。

誤差は(x−a/b)=A/(Q b)、(c/d−x)=B/(Q d)なので、A dとB bを整数で比較する。小さい方の分数を選び、等しい場合は問題の優先規則に従う。例えばx=9/20、N=5では上端を1/2、下端を2/5まで進め、次の分母7で止まる。両候補の誤差はともに1/20であり、同値規則が必要になる。

### 連分数・中間分数への接続

Euclidの商を並べるとx=[a_0;a_1,…]という連分数になる。収束分数はH_i=a_i H_{i−1}+H_{i−2}、K_i=a_i K_{i−1}+K_{i−2}で、初期値は(H_{−2},H_{−1})=(0,1)、(K_{−2},K_{−1})=(1,0)。商a_iの途中をtへ置き換えた(t H_{i−1}+H_{i−2})/(t K_{i−1}+K_{i−2})が中間分数であり、上の一括移動に対応する。分母上限で商を途中までしか進めない場合も、この中間候補を残す必要がある。

開区間α<y<βで最小分母を探す問題にも、同じ隣接境界を使える。α=A_0/B_0、β=C_0/D_0（0≤α<β）とする。mediantがα以下ならt=floor((A_0 b−B_0 a)/(B_0 c−A_0 d))回だけ下端を進め、β以上ならt=floor((D_0 c−C_0 d)/(C_0 b−D_0 a))回だけ上端を進める。分母はそれぞれ上端>α、下端<βから正であり、これらのtは新端点を開区間へ入れない最大回数である。

初めて区間内へ入ったmediantで終了する。区間全体が現在の隣接境界の間に含まれ、その内部の分数の分母はb+d以上なので、このmediantの分母が最小である。点への近似と異なり、端点への一致では終了しない。同じ最小分母の候補が複数ある場合もあり、分子の選択規則は別に定める。

## 成立条件と計算量

整数の基本演算をO(1)と数えると、有理数入力の商の段数はO(log U)、U=max(P,Q,N)。境界だけを持つ探索はO(1)空間であり、商列を保存するならO(log U)。分母上限での打切りは最後の一回なので、一歩ずつの深さには依存しない。交差積や誤差比較の積が入る広い整数型を選び、多倍長整数ならその演算費用も加える。負の目標は整数部分を分けるか符号を反転して扱える。ここで証明した最適性は絶対誤差と分母制約に対するもので、分子制約・相対誤差では条件と候補選択を改めて導く。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。

### このUnitでは扱わないもの

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 問題一覧

- [ABC408 G「A/B < p/q < C/D」](https://atcoder.jp/contests/abc408/tasks/abc408_g) — 主題: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。）。
- [ABC333 G「Nearest Fraction」](https://atcoder.jp/contests/abc333/tasks/abc333_g) — 主題: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC333 G 公式解説](https://atcoder.jp/contests/abc333/editorial/7937)
- [ABC333 G 公式問題文](https://atcoder.jp/contests/abc333/tasks/abc333_g)
- [ABC393 G 公式解説](https://atcoder.jp/contests/abc393/editorial/12192)
- [ABC393 G 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC408 G 公式解説](https://atcoder.jp/contests/abc408/editorial/13160)
- [ABC408 G 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-rational-approximation`
