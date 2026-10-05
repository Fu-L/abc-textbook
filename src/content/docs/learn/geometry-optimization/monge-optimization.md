---
title: "Monge・monotone minima最適化"
description: "「Monge・monotone minima最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 230
---

# Monge・monotone minima最適化

習得対象の目安: **橙色（2400–2799）**。Monge性から最適位置の単調性を導き、分割統治やSMAWKの条件を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Monge・monotone minima最適化

quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。

ABC348 Gの分割統治で生じるmax-plus convolutionを考える。入力: x_jは左からj個選ぶAの最大和なので差分が非増加。y_kは右からk個選ぶ最適値で、凹性は仮定しない。z_i=max_k(x_{i-k}+y_k)を求める。

行列: 行を合計個数i、列を右選択数kとし、M[i,k]=x_{i-k}+y_k。両側から選ぶなら1≤k≤|right|かつ1≤i-k≤|left|が有効範囲となる。

正当化: 列kからk+1への差はy_{k+1}−y_k−(x_{i-k}−x_{i-k-1})で、iの増加につれて非減少。離れた列の差も和を取れば同じ性質を持ち、大きい列への優位性は失われない。同点は左優先とすると行最大位置kは非減少。有効列区間の両端も非減少である。

手順: 中央行の有効列を走査して最適kを求め、上半分はk以下、下半分はk以上に探索範囲を絞って再帰する。長さLのmergeはO(L log L)、問題全体はO(N log² N)。SMAWKなら有効域の扱いを保った全単調行列の探索へ接続できる。

境界: 単調なのはkで、左選択数j=i-kではない。無効な個数を有限値0で埋めず、片側だけの選択は別に比較する。xの差分が任意なら単調性は保証されない。

ABC348 Gでは行最大位置の単調性から探索区間を制限する。ABC305 ExでのMonge性の役割は、分割個数別の最適費用の凸性を保証してAliensの復元を正当化すること。行最小値探索を行う教材とは区別し、Lagrangian relaxation側の接続例として読む。

### 習得する技能

- quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

費用がC(a,c)+C(b,d)≤C(a,d)+C(b,c)を満たすなどの四角不等式から、最適な分割点の単調性を導く。遷移の候補範囲を隣の状態の最適点で絞るのが分割統治最適化である。

### 行列の条件と同点の規約

行と列をそれぞれ昇順に並べ、最小値を探す行列Aを考える。i<j、c<dで `A[i,c]+A[j,d]≤A[i,d]+A[j,c]`
が成立するのがMonge性である。移項すると
`A[j,d]−A[j,c]≤A[i,d]−A[i,c]`。上の行で後ろの列dが厳密に良ければ下の行でも厳密に良く、同点も含めて左端の最小位置は非減少になる。最大値探索では不等号を逆にする。

SMAWKが必要とする全単調性は、行・列を任意に間引いたすべての部分行列でも、左端の行最小位置が非減少になること。Monge性は間引いても保存されるので十分条件である。元の行列の最小位置が単調というだけでは、列を削った後まで保証できない。以下では同点なら先の列を残す規約を全比較で統一する。

### 分割統治で探索区間を引き継ぐ

DPの一層を `new[i]=min_k(old[k]+C(k,i))`
と書けるなら、oldを確定した後で行i、列kの行列を評価する。求める行区間と、その区間の最適列が属する候補区間を再帰の引数にする。中央行の全候補を走査し、左端の最適列pを記録する。上半分へは候補区間の右端をp、下半分へは左端をpとして渡す。単調性により正解の候補を落とさず、行区間が空なら停止する。

N行・N列で一要素をO(1)評価できるなら、各深さの候補走査はO(N)、深さO(log N)でO(N log
N)。pを境界として両方へ含めるために重なる候補の費用も、各深さの部分問題数の和でO(N)に収まる。new自身の未確定値へ依存する同一層の遷移は、この行順では評価できない。有効列が行ごとに異なる場合は中央行でその区間との共通部分を調べ、空行を含む境界も定義する。

### SMAWKの列削減と間の行の復元

行のリストRと列のリストCに対する行最小値を求める。Rが空なら終了する。Rが非空でCが空なら最小値は存在しないので、通常のSMAWKの入力から除く。まず列を昇順に走査し、残す候補をstack
Sに持つ。新しい列cについて、Sが非空なら行 `R[|S|−1]`
でcとSの末尾を比較する。cが厳密に小さければ末尾をpopして同じ比較を繰り返す。popしなくなったら、`|S|<|R|`
のときだけcをpushする。各列は高々一回push・popされ、残る列数は高々行数となる。

列削減の不変量は、stackの位置kにある列は、先頭k行では既に別の候補に負けているというもの。末尾を比較する行R[k]で新列が勝てば、全単調性によりそれ以降の行でも新列が勝つので、末尾はどの行の左端最小にも必要なくなる。逆に末尾を残す比較なら新列はその行以前で左端最小になれない。stackが行数に達して新列を捨てるときは、この排除が全行を覆う。これで必要な列を残したまま削減できる。

次にRの位置1,3,5,…の行だけを、削減した列で再帰的に解く。その結果を使い、位置0,2,4,…の各行を埋める。行最小位置の単調性から、直前・直後にある既知行の最適列の間だけ走査すればよい。最初・最後に隣の既知行がない側は、削減後の先頭・末尾列を境界にする。隣接する探索区間は端点以外が重ならないので、この補間は行数と列数の和に比例する。一行の場合もこの段階で全候補を走査して停止する。

最初がr行・c列なら削減と補間はO(r+c)、再帰先は高々r/2行・r列。その次の列削減で列数も高々r/2になり、以後は幾何級数となる。したがって一要素O(1)評価の全単調行列の全行最小値をO(r+c)時間・空間で求められる。元の行列を実際に全要素生成する必要はない。この削減と補間は[元論文の行列探索算法](https://hcsoso.github.io/teaching/topology-f21/papers/SMAWK.pdf)に基づく。

無効な遷移を∞で埋める場合、その拡張後の行列についても全単調性と同点規約を証明する。帯状の有効域があるというだけでSMAWKを適用せず、ABC348
Gのように有効区間を明示して分割統治する方法と区別する。

## 成立条件と計算量

一層N状態でO(1)費用評価なら典型的な分割統治はO(N log
N)。SMAWKは全単調性とO(1)要素評価の下でr行c列をO(r+c)で探索する。Knuth法には別の区間DP条件が必要。等号時の最適点の選び方を固定し、三つの算法の適用条件を混同しない。

概念上の親: [幾何・凸最適化](/learn/geometry-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。

このUnitを直接前提とする単元: なし。

DP遷移の集約・高速化で得た考え方と実装を再利用し、Monge・monotone minima最適化の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Monge・monotone minima最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC355 G「Baseball」](https://atcoder.jp/contests/abc355/tasks/abc355_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC348 G 公式解説](https://atcoder.jp/contests/abc348/editorial/9707)
- [ABC348 G 公式問題文](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC355 G 公式解説](https://atcoder.jp/contests/abc355/editorial/10078)
- [ABC355 G 公式問題文](https://atcoder.jp/contests/abc355/tasks/abc355_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-monge-optimization`
