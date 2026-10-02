---
title: "ABC295-E — Kth Number"
draft: true
authoringUnit: {"problemId":"abc295-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc295-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc295-e-problem-64981f82f53de95ee235bb36008af7ca7cf34f86df31a7eca487d734e80470bc","source-abc295-editorial-6048-df04ef6fc06286019bbc89131f6293d01a91988bb68b1b5bff7816d9793ed8b5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"0一個がx以上になる確率は(M-x+1)/Mで独立なので、必要成功数以上のbinomial tailになる。 固定x以上の既知要素数と0個数から、少なくともN+1-K個がx以上となる確率を二項係数和で求められる。","sourceRevisionIds":["source-abc295-e-problem-64981f82f53de95ee235bb36008af7ca7cf34f86df31a7eca487d734e80470bc","source-abc295-editorial-6048-df04ef6fc06286019bbc89131f6293d01a91988bb68b1b5bff7816d9793ed8b5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,M=2、A=(0,2)、K=1の小さい方。","procedure":["未知は1か2、order statisticはそれぞれ1,2。","平均(1+2)/2。"],"executionTarget":null,"expectedResult":"期待3/2。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"attainmentCondition":"tail-sum式でthreshold2の確率は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"小さい方が2以上になるのは未知も2のときで1/2。threshold1の1と合わせ3/2。"},"answer":{"reasoningOrVerification":"小さい方が2以上になるのは未知も2のときで1/2。threshold1の1と合わせ3/2。","procedure":["具体例の各状態・寄与を再計算する。","小さい方が2以上になるのは未知も2のときで1/2。threshold1の1と合わせ3/2。"],"expectedResult":"小さい方が2以上になるのは未知も2のときで1/2。threshold1の1と合わせ3/2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

K番目の値Xの期待値はΣ_(x=1)^M Pr[X≥x]であり、閾値ごとなら0の置換成功数だけを数えればよい。

採用する候補: 閾値ごとの二項分布計数

固定x以上の既知要素数と0個数から、少なくともN+1-K個がx以上となる確率を二項係数和で求められる。

棄却する候補: 全M^zero通りの置換を列挙

0が最大2000個あり指数的。

0一個がx以上になる確率は(M-x+1)/Mで独立なので、必要成功数以上のbinomial tailになる。

x=1..Mを走査し、既知の≥x個数を更新しながら、0の成功数が不足分以上となる確率を二項係数と冪で合計して期待値へ加える。

## 典型の発動条件

### tail-sum formula

発動条件: 有限非負整数値確率変数の期待値を求める。

E[X]=ΣPr[X≥x]へ変換する。

### 二項分布

発動条件: 同一確率の独立な0置換の成功数を数える。

閾値以上へ置換される個数のtailを計算する。

## 問題固有の要素

順序統計量そのものの分布より、各閾値を越えるために必要な成功個数の方が単純になる。

別の問題へ持ち帰る視点: 期待順位値は閾値確率へ分解する。

## 正当性

0一個がx以上になる確率は(M-x+1)/Mで独立なので、必要成功数以上のbinomial tailになる。 固定x以上の既知要素数と0個数から、少なくともN+1-K個がx以上となる確率を二項係数和で求められる。

## 実装上の注意

- K番目が昇順であるため必要な≥x個数はN+1-K。確率の分母M^zeroを法逆元で扱う。

## 復習の核

- 小N,Mの全置換と比較し、0なし、全0、K=1,N、閾値不足が0以下の例を確認する。

## 計算量と制約

### 時間

O(MN)、各thresholdで零位置成功数のbinomial tail、階乗前計算O(N)。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq K \leq N \leq 2000; 1\leq M \leq 2000; 0\leq A_i \leq M; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,M=2、A=(0,2)、K=1の小さい方。

1. 未知は1か2、order statisticはそれぞれ1,2。
2. 平均(1+2)/2。

期待される結果: 期待3/2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

tail-sum式でthreshold2の確率は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

小さい方が2以上になるのは未知も2のときで1/2。threshold1の1と合わせ3/2。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_e) — source-abc295-e-problem-64981f82f53de95ee235bb36008af7ca7cf34f86df31a7eca487d734e80470bc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6048) — source-abc295-editorial-6048-df04ef6fc06286019bbc89131f6293d01a91988bb68b1b5bff7816d9793ed8b5
