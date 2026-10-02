---
title: "ABC288-G — 3^N Minesweeper"
draft: true
authoringUnit: {"problemId":"abc288-g","docPath":"src/content/docs/problems/mathematics/outcome-factor-separable-linear-transform/outcome-factor-separable-linear-transform-shard-001/abc288-g.md","learningOutcomeIds":["outcome-factor-separable-linear-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-linear-transform"],"sourceRevisionIds":["source-abc288-editorial-5668-ef5c3075ac804bab211e75a08af10f6ebb16e459bc0b1aff5de1646db74da3cd","source-abc288-g-problem-db639708c759ee9e18690d8b5632e289ed81f9465831f8d77a0270f935cdbde1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一次元の近傍和はF_0=v_0+v_1,F_1=v_0+v_1+v_2,F_2=v_1+v_2で、その逆式が一意にvを復元する。N次元の近傍は軸ごとの直積なので変換はこの行列のtensor積であり、各軸逆変換を順に適用すると全変換の逆になる。同一組の旧3値を保存して同時更新すればin-placeでも式を保てる。","sourceRevisionIds":["source-abc288-editorial-5668-ef5c3075ac804bab211e75a08af10f6ebb16e459bc0b1aff5de1646db74da3cd","source-abc288-g-problem-db639708c759ee9e18690d8b5632e289ed81f9465831f8d77a0270f935cdbde1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-factor-separable-linear-transform"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=1、bomb列B=(1,0,1)。","procedure":["近傍数A=(1,2,1)。","逆式で(2−1,1+1−2,2−1)=(1,0,1)。"],"executionTarget":null,"expectedResult":"B=(1,0,1)。","verificationStatus":"not_applicable","learningUnitIds":["unit-separable-linear-transform"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-factor-separable-linear-transform"],"prerequisiteIds":[],"attainmentCondition":"一組を順に上書きしてf_1−f_0へ新f_0を使うと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"旧値3個を用いる同時更新。"},"answer":{"reasoningOrVerification":"元の連立逆式と異なる。例ではf_0は1のままだが一般に変わるので必ず旧f0,f1,f2を一時保存する。","procedure":["具体例の各状態・寄与を再計算する。","元の連立逆式と異なる。例ではf_0は1のままだが一般に変わるので必ず旧f0,f1,f2を一時保存する。"],"expectedResult":"旧値3個を用いる同時更新。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離可能線形変換・Walsh–Hadamard変換](src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)

- Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各ternary桁で中心digit 0,1,2のneighbor許容集合はそれぞれ{0,1},{0,1,2},{1,2}であり、入力Aはこれらの直積領域にあるbomb数である。

求めるBは各桁を{0},{1},{2}へ固定した直積領域の値なので、各次元の3個の区間和から3個のsingleton値を逆変換すればよい。

近傍条件が桁ごとの直積なので、N次元変換は1次元の逆変換を各桁へ順に施すtensor productとして分離できる。

採用する候補: 各ternary桁について3値の局所逆変換を全3^N entryへ適用する多次元差分変換。

3×3の関係をN軸へ順番に解くだけで、入力の近傍和から各位置の0/1を復元できる。

棄却する候補: 3^N個のbomb有無を未知数とする一般の連立一次方程式をGaussian eliminationする。

行列dimensionが最大531441で、直積構造を無視した一般消去は不可能である。

棄却する候補: 全bomb配置2^(3^N)を列挙してAと一致するか調べる。

位置数自体が指数的であり、そのpower setは到底列挙できない。

1次元で近傍和をF_0=v_0+v_1、F_1=v_0+v_1+v_2、F_2=v_1+v_2とすると、v_0=F_1-F_2、v_1=F_0+F_2-F_1、v_2=F_1-F_0で復元できる。

他の桁条件を固定したまま同じ3式が成立するため、1軸変換後の値を次軸の入力としてin-placeに更新できる。

AをindexのN桁ternary配列とみなす。各axisのstride=3^axisについて、他桁が同じ3 entry (f0,f1,f2)を全blockから取り出し、(f1-f2, f0+f2-f1, f1-f0)へ同時更新する。全N軸の処理後、array[index]がその位置のbomb有無B_indexなので順に出力する。

## 典型の発動条件

### 多次元累積和の逆変換

発動条件: 入力が各座標軸の小区間の直積上の和で与えられるとき。

各軸の局所差分を順に適用してpoint値へ戻す。

### Kronecker積構造の分離

発動条件: 高次元線形変換が同じ小行列の各軸作用として表せるとき。

巨大行列を作らず、strideごとの小変換を反復する。

## 問題固有の要素

ternary digit差≤1というneighbor定義は、数直線上の距離ではなく各桁独立の3値区間なので、近傍和matrixが完全にtensor分解する。

別の問題へ持ち帰る視点: 座標が進数digitで定義された問題では、条件がdigitwiseなら状態空間全体の演算を各桁変換へ分解できる。

## 正当性

一次元の近傍和はF_0=v_0+v_1,F_1=v_0+v_1+v_2,F_2=v_1+v_2で、その逆式が一意にvを復元する。N次元の近傍は軸ごとの直積なので変換はこの行列のtensor積であり、各軸逆変換を順に適用すると全変換の逆になる。同一組の旧3値を保存して同時更新すればin-placeでも式を保てる。

## 実装上の注意

- 3値をin-placeに1つずつ上書きせず、旧f0,f1,f2を一時変数へ保存してから同時更新する。
- 値は中間的に負になり得るのでsigned整数を使い、全軸後の値が保証により0または1になることを確認する。
- axis順とindexのlowest ternary digitに対応するstride=1,3,9,…を揃える。

## 復習の核

- N=1で3本の式を直接逆算し、N=2では一方の桁を固定した3-entry更新を縦横に1回ずつ施してsingleton値になるか確認する。

## 計算量と制約

### 時間

O(N3^N)。各ternary軸の3値組を一度変換する。

### 空間

O(3^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 12; There is a placement of bombs consistent with A_0, A_1, \ldots, A_{3^N-1}.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=1、bomb列B=(1,0,1)。

1. 近傍数A=(1,2,1)。
2. 逆式で(2−1,1+1−2,2−1)=(1,0,1)。

期待される結果: B=(1,0,1)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

一組を順に上書きしてf_1−f_0へ新f_0を使うと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

元の連立逆式と異なる。例ではf_0は1のままだが一般に変わるので必ず旧f0,f1,f2を一時保存する。

確認結果: 旧値3個を用いる同時更新。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/editorial/5668) — source-abc288-editorial-5668-ef5c3075ac804bab211e75a08af10f6ebb16e459bc0b1aff5de1646db74da3cd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/tasks/abc288_g) — source-abc288-g-problem-db639708c759ee9e18690d8b5632e289ed81f9465831f8d77a0270f935cdbde1
