---
title: "ABC323-G — Inversion of Tree"
draft: true
authoringUnit: {"problemId":"abc323-g","docPath":"src/content/docs/problems/mathematics/outcome-count-combinatorial-objects-by-determinant/outcome-count-combinatorial-objects-by-determinant-shard-001/abc323-g.md","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-system-rank","unit-polynomial-taylor-shift"],"excludedTopics":["行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-determinant-counting","tag-linear-system-rank","tag-polynomial-taylor-shift"],"sourceRevisionIds":["source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37","source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重み付き行列木定理で余因子det(M_0+xM_1)は全treeのx^{inversion数}和。正則なC=M_0+aM_1を選びE(z)=det(C)det(zI+C^{-1}M_1)とすれば、次数d=N−1の係数反転でQ(t)=det(C+tM_1)を得る。Q(x−a)は元のdetに等しいのでshift後の各係数が要求tree数になる。","sourceRevisionIds":["source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37","source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、P=(3,1,2)。","procedure":["inversion辺は(1,2),(1,3)、他は(2,3)。","tree3種類の重みはx²,x,x。"],"executionTarget":null,"expectedResult":"係数(0,2,1)、D(x)=2x+x²。","verificationStatus":"not_applicable","learningUnitIds":["unit-determinant-counting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"prerequisiteIds":["unit-linear-system-rank","unit-polynomial-taylor-shift"],"attainmentCondition":"M_1が特異ならM_1^{-1}で直接変形できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"shift Cの逆元を使う。"},"answer":{"reasoningOrVerification":"不可。正則shift Cを選ぶ方法はM_1の正則性を要求しない。係数反転はdegree dまでpaddingする。","procedure":["具体例の各状態・寄与を再計算する。","不可。正則shift Cを選ぶ方法はM_1の正則性を要求しない。係数反転はdegree dまでpaddingする。"],"expectedResult":"shift Cの逆元を使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [行列式による数え上げ](src/content/docs/learn/combinatorics-algebra/determinant-counting.md)

- 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)
- [factorial convolutionによる多項式Taylor shift](src/content/docs/learn/combinatorics-algebra/polynomial-taylor-shift.md)

対象外:

- 行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各inversion edgeへweight x、他edgeへweight 1を付けると、treeのweight積はx^{inversion数}であり、全spanning treeの重み和のx^K係数が求める答えになる。

weighted Matrix-Tree theoremにより、この生成多項式はpolynomial Laplacianの任意のcofactor det(M_0+xM_1)として得られる。

cofactor sizeはN-1で各entryがxの一次式なので、determinantのdegreeも高々N-1である。

採用する候補: det(M_0+xM_1)を正則な係数matrixへ変形し、characteristic polynomialをO(N^3)で求めて全係数を復元する。

N≤500で、N点のdeterminant評価を繰り返さず1回の行列多項式計算へ帰着できる。

棄却する候補: xへN個の値を代入して各determinantをGaussian eliminationし、補間する。

1評価O(N^3)をN回行うO(N^4)となり、この制約では重い。

棄却する候補: Cayleyのtree列挙や全edge subsetからtreeだけを検査する。

labelled treeだけでもN^{N-2}個あり列挙不能である。

係数matrix Bが正則ならdet(A+xB)=det(B)det(xI+B^{-1}A)で、後半は−B^{-1}Aのcharacteristic polynomialになる。

M_1がsingularでもshift aを選んでC=M_0+aM_1を正則にし、E(z)=det(M_1+zC)をcharacteristic polynomialとして計算できる。

Q(t)=det(C+tM_1)=t^dE(1/t)なので係数reverseでQを得て、元のD(x)=Q(x-a)へpolynomial shiftすればよい。

全unordered pair u<vについてP_u>P_vならw=x、否则w=1としてpolynomial Laplacianを作り、1行1列を除いてM_0,M_1へ分ける。d=N-1とし、C=M_0+aM_1が正則になるfield要素aを選ぶ。C^{-1}M_1を求め、−C^{-1}M_1のcharacteristic polynomialからE(z)=det(C)det(zI+C^{-1}M_1)を得る。degree dで係数をreverseしてQ(t)=D(a+t)とし、t=x-aのTaylor shiftでD(x)へ戻し、x^0..x^{N-1}係数を出力する。

## 典型の発動条件

### weighted Matrix-Tree theorem

発動条件: spanning treeをedge属性の個数別に数えたいとき。

属性edgeへ形式変数weightを付け、Laplacian cofactorを生成多項式にする。

### matrix pencilのdeterminant

発動条件: entryがA+xBの一次matrixでdeterminant全係数が必要なとき。

正則係数を単位行列へ変えcharacteristic polynomialへ帰着する。

### polynomial reversalとshift

発動条件: x係数matrixがsingularだが、ある評価点のconstant matrixは正則にできるとき。

変数をshiftし逆数変換で正則matrixを最高次係数側へ移す。

## 問題固有の要素

treeごとのinversion edge数という離散統計を、edge weight xの積へ符号化すると、N個の答えが1本のdeterminant polynomialに同時格納される。

別の問題へ持ち帰る視点: 構造ごとの属性個数分布は、属性要素へ形式変数を付けたweighted countの係数として一括計算する。

## 正当性

重み付き行列木定理で余因子det(M_0+xM_1)は全treeのx^{inversion数}和。正則なC=M_0+aM_1を選びE(z)=det(C)det(zI+C^{-1}M_1)とすれば、次数d=N−1の係数反転でQ(t)=det(C+tM_1)を得る。Q(x−a)は元のdetに等しいのでshift後の各係数が要求tree数になる。

## 実装上の注意

- Laplacianはedge weightを両diagへ加えoff-diagonalから引き、同じrow/columnを除いたcofactorをM_0,M_1別々に作る。
- random aを使う場合はCがsingularなら選び直し、998244353上で符号・det(C)・characteristic polynomialの規約を揃える。
- Q係数のreverseはdegree dまでzero paddingして行い、最後のx→x-a shiftの符号を取り違えない。

## 復習の核

- N=3で3本のedge weightからtree3通りの生成多項式を直接展開し、Laplacian cofactor、係数reverse、shift後の符号が一致するか確認する。

## 計算量と制約

### 時間

O(N³+N log N)。行列反転とHessenberg型特性多項式計算、Taylor shift。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 500; P is a permutation of (1,2,\ldots,N).

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、P=(3,1,2)。

1. inversion辺は(1,2),(1,3)、他は(2,3)。
2. tree3種類の重みはx²,x,x。

期待される結果: 係数(0,2,1)、D(x)=2x+x²。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M_1が特異ならM_1^{-1}で直接変形できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。正則shift Cを選ぶ方法はM_1の正則性を要求しない。係数反転はdegree dまでpaddingする。

確認結果: shift Cの逆元を使う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/editorial/7356) — source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/tasks/abc323_g) — source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda
