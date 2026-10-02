---
title: "ABC226-H — Random Kth Max"
draft: true
authoringUnit: {"problemId":"abc226-h","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc226-h.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc226-editorial-2879-dfe38a694cf47c0cb83e3c33f246a7711411d10765451cf115ab90033ef59412","source-abc226-h-problem-a3f12c676bb041bedf550f1c1ae5d7a4ea8ecc01e2399ae7cf16c95ddc393d48"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"YをK番目に大きい値とするとY≥xは少なくともK個のX_i≥xと同値。独立性により成功数の生成多項式は∏((1−p_i(x))+p_i(x)z)。各単位区間ではp_i(x)が一次以下なので係数DPで正確に構成できる。非負変数の尾積分E[Y]=∫P(Y≥x)dxを各区間へ分割し、次数ごとの積分と総和を取れば期待値を求められる。法では全ての分母が可逆な範囲である。","sourceRevisionIds":["source-abc226-editorial-2879-dfe38a694cf47c0cb83e3c33f246a7711411d10765451cf115ab90033ef59412","source-abc226-h-problem-a3f12c676bb041bedf550f1c1ae5d7a4ea8ecc01e2399ae7cf16c95ddc393d48"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-propagate-probability-distribution"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,K=1、両方のXは独立な[0,1]一様分布。","procedure":["0≤x≤1でP(max≥x)=1−x²。","積分は[x−x³/3]_0^1=2/3。"],"executionTarget":null,"expectedResult":"期待値2/3（法では2·3の逆元）。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-propagate-probability-distribution"],"prerequisiteIds":["unit-dp-state-design","unit-modular-arithmetic"],"attainmentCondition":"K=2へ変えると期待値はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"P(min≥x)=(1−x)²の積分で1/3。少なくともK個という成功数条件を大きい順と小さい順で取り違えない。"},"answer":{"reasoningOrVerification":"P(min≥x)=(1−x)²の積分で1/3。少なくともK個という成功数条件を大きい順と小さい順で取り違えない。","procedure":["具体例の各状態・寄与を再計算する。","P(min≥x)=(1−x)²の積分で1/3。少なくともK個という成功数条件を大きい順と小さい順で取り違えない。"],"expectedResult":"P(min≥x)=(1−x)²の積分で1/3。少なくともK個という成功数条件を大きい順と小さい順で取り違えない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

K番目に大きい値Yの期待値は、非負変数なので∫P(Y≥x)dxで求められる。各X_iの端点が0から100の整数であるため、単位区間[a,a+1]内ではP(X_i≥x)が定数または一次式になる。

採用する候補: 各単位区間で、x以上となる変数の個数分布を係数がxの多項式であるDPとして作り、少なくともK個となる確率多項式を区間積分する。

順位統計量を直接追わずtail確率へ変えると独立変数の個数DPになり、整数端点により有限個の区間で厳密な多項式積分ができる。

棄却する候補: 乱数サンプリングでK番目の値を多数回生成し、平均を法998244353へ変換する。

要求値は厳密な有理数の剰余であり、近似誤差を持つMonte Carloや数値積分から復元できない。

Y≥x はN個のうち少なくともK個がx以上であることと同値で、独立性から各変数の成功確率p_i(x)を掛けるPoisson-binomial型DPで求められる。

[a,a+1]内でp_i(x)は0、1、(R_i-x)/(R_i-L_i)のいずれかなので、DP値も次数N以下の多項式となり、係数ごとに割って厳密に積分できる。

a=0,…,99ごとに各p_i(x)の一次多項式を作り、成功個数DPを多項式として更新する。j≥Kの多項式を合計して[a,a+1]で積分し、全区間の値を法998244353で加える。

## 典型の発動条件

### tail確率による期待値積分

発動条件: 非負の連続確率変数の期待値を求め、値以上となる事象の方が組合せ的に数えやすいとき。

順位値Yそのものの密度を作らず、E[Y]=∫P(Y≥x)dxを用いて個数条件へ変換する。

### 区分多項式の確率DP

発動条件: 独立事象の成功確率が区間ごとに低次数多項式となり、成功個数の閾値確率が必要なとき。

成功個数を状態にして一次多項式p_iと1-p_iを掛け、得たtail多項式を係数積分する。

## 問題固有の要素

全分布の端点が小さい整数なので、連続変数の問題でも積分区間を100個の単位区間へ固定し、各区間を有限多項式計算として扱える。

別の問題へ持ち帰る視点: 連続分布の式が区分的に変わる問題では、全breakpointを列挙し、その間で密度・CDFが何次式になるかを確認する。

## 正当性

YをK番目に大きい値とするとY≥xは少なくともK個のX_i≥xと同値。独立性により成功数の生成多項式は∏((1−p_i(x))+p_i(x)z)。各単位区間ではp_i(x)が一次以下なので係数DPで正確に構成できる。非負変数の尾積分E[Y]=∫P(Y≥x)dxを各区間へ分割し、次数ごとの積分と総和を取れば期待値を求められる。法では全ての分母が可逆な範囲である。

## 実装上の注意

- K番目に大きい値には『x以上が少なくともK個』を使う。区間端点は確率0なので開閉を過剰に分岐せず、積分時の1/(d+1)と各(R_i-L_i)の逆元を前計算する。

## 復習の核

- K番目の密度を直接微分する前に、『少なくともK個が閾値以上』というtail事象と、端点間での多項式性を使う。

## 計算量と制約

### 時間

値域上限R=100としてO(RN³)。成功数O(N)×多項式次数O(N)×変数N。

### 空間

O(N²)。区間ごとに多項式DPを作り直す。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 50; 1 \leq K \leq N; 0 \leq L_i \lt R_i \leq 100; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,K=1、両方のXは独立な[0,1]一様分布。

1. 0≤x≤1でP(max≥x)=1−x²。
2. 積分は[x−x³/3]_0^1=2/3。

期待される結果: 期待値2/3（法では2·3の逆元）。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

K=2へ変えると期待値はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

P(min≥x)=(1−x)²の積分で1/3。少なくともK個という成功数条件を大きい順と小さい順で取り違えない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/editorial/2879) — source-abc226-editorial-2879-dfe38a694cf47c0cb83e3c33f246a7711411d10765451cf115ab90033ef59412
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/tasks/abc226_h) — source-abc226-h-problem-a3f12c676bb041bedf550f1c1ae5d7a4ea8ecc01e2399ae7cf16c95ddc393d48
