---
title: "ABC309-EX — Simple Path Counting Problem"
draft: true
authoringUnit: {"problemId":"abc309-ex","docPath":"src/content/docs/problems/mathematics/outcome-remove-boundaries-by-reflection/outcome-remove-boundaries-by-reflection-shard-001/abc309-ex.md","learningOutcomeIds":["outcome-remove-boundaries-by-reflection"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-polynomial-convolution"],"excludedTopics":["鏡像法・reflection principleの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-reflection-principle","tag-convolution"],"sourceRevisionIds":["source-abc309-editorial-6751-6ce08329a6ac1858c581d4dcaf20125dccad02bd6b0c6a0898679de12244393d","source-abc309-ex-problem-65aeeef57cba7aec6c3dfae69feb941b8f786bc151fe34154c429e4013c949e7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"開始分布を鏡位置へ逆符号で置くと、反射対称な移動作用のもと境界0,M+1の係数は常に0である。内部では隣接・停止の通常遷移と一致するため、内部係数は外へ出ない経路数のDPを満たす。周期環でN−1乗してもこの不変条件を保ち、終点分布との内積で全指定開始終点の経路を数える。","sourceRevisionIds":["source-abc309-editorial-6751-6ce08329a6ac1858c581d4dcaf20125dccad02bd6b0c6a0898679de12244393d","source-abc309-ex-problem-65aeeef57cba7aec6c3dfae69feb941b8f786bc151fe34154c429e4013c949e7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-remove-boundaries-by-reflection"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"M=2、N=3、開始1、終点1。","procedure":["二段の高さ列は1→1→1と1→2→1。","境界0,3へ出る列は除く。"],"executionTarget":null,"expectedResult":"2経路。","verificationStatus":"not_applicable","learningUnitIds":["unit-reflection-principle"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-remove-boundaries-by-reflection"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-polynomial-convolution"],"attainmentCondition":"M=1ではNが巨大でも経路数は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1。"},"answer":{"reasoningOrVerification":"高さ1しかないので毎段停止する唯一の経路。鏡像差分もこの境界条件を保存する。","procedure":["具体例の各状態・寄与を再計算する。","高さ1しかないので毎段停止する唯一の経路。鏡像差分もこの境界条件を保存する。"],"expectedResult":"1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [鏡像法・reflection principle](src/content/docs/learn/combinatorics-algebra/reflection-principle.md)

- 最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- 鏡像法・reflection principleの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

高さ 1..M の単純路を一段進む遷移は、位置を −1,0,+1 だけ動かす線形作用である。N は 10^9 なので段数 DP はできない一方、幅 M は 10^5 に収まる。

端 0 と M+1 から外へ出る歩道を排除する境界条件だけが平行移動不変性を壊しており、鏡像の負符号でその寄与を相殺できる。

採用する候補: 長さ 2M+2 の符号付き鏡像列へ拡張し、循環畳み込み (x^{-1}+1+x)^{N−1} を高速累乗する。

境界を鏡像で吸収すると各段が同じ巡回畳み込みになり、NTT と二乗法で O(M log M log N) にできる。

棄却する候補: M 状態の遷移行列を二乗して N−1 段をまとめる。

疎行列でも二乗後は密になり、M=10^5 に対する行列積・保持は不可能である。

開始分布を位置 j に正、鏡位置 2M+2−j に負で置くと、禁止境界を越えて戻る経路が一対一に逆符号で対応して消える。

巡回添字を x^{2M+2}=1 とみなせば、一段の遷移は多項式への (x^{-1}+1+x) の乗算そのものになる。

長さ D=2M+2 の f を作り、各開始 A_i の係数を +1、D−A_i を −1 とする。環 Z[x]/(x^D−1) で g=x^{-1}+1+x を N−1 乗し f と畳み込み、B_i の係数を合計する。各積は NTT 後に次数を D 周期で折り返す。

## 典型の発動条件

### 鏡像法による境界条件の除去

発動条件: 一様なランダムウォーク・格子路で、壁だけが畳み込み構造を妨げるとき。

反射位置へ逆符号の初期値を置き、壁越え経路を相殺する。

### 多項式遷移の高速累乗

発動条件: 巨大な反復回数に対し、一段の線形遷移が平行移動不変な小 kernel で表せるとき。

状態列を多項式とみなし、商環上で kernel を二分累乗する。

## 問題固有の要素

鏡像法は確率の閉形式だけでなく、有限区間 DP を巡回畳み込みへ変換するためにも使える。

別の問題へ持ち帰る視点: 巨大な時間軸と中程度の空間軸を見たら、境界を処理して遷移を convolution にできないか検討する。

## 正当性

開始分布を鏡位置へ逆符号で置くと、反射対称な移動作用のもと境界0,M+1の係数は常に0である。内部では隣接・停止の通常遷移と一致するため、内部係数は外へ出ない経路数のDPを満たす。周期環でN−1乗してもこの不変条件を保ち、終点分布との内積で全指定開始終点の経路を数える。

## 実装上の注意

- x^{-1} は配列添字 D−1 に置き、畳み込み後の次数を D で正しく折り返す。負係数を法で正規化し、問題文の B の重複もそのまま加算する。

## 復習の核

- 巨大回数の DP ではまず一段作用が線形かを見る。その後、境界だけを切り離し、鏡像で translation invariant に戻せるかを追う。

## 計算量と制約

### 時間

O(M log M·log N+K+L)。周期長D=2M+2の積をNTTで累乗する。

### 空間

O(M+K+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^9; 1 \le M,K,L \le 10^5; 1 \le A_i,B_j \le M

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

M=2、N=3、開始1、終点1。

1. 二段の高さ列は1→1→1と1→2→1。
2. 境界0,3へ出る列は除く。

期待される結果: 2経路。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M=1ではNが巨大でも経路数は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

高さ1しかないので毎段停止する唯一の経路。鏡像差分もこの境界条件を保存する。

確認結果: 1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/editorial/6751) — source-abc309-editorial-6751-6ce08329a6ac1858c581d4dcaf20125dccad02bd6b0c6a0898679de12244393d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/tasks/abc309_h) — source-abc309-ex-problem-65aeeef57cba7aec6c3dfae69feb941b8f786bc151fe34154c429e4013c949e7
