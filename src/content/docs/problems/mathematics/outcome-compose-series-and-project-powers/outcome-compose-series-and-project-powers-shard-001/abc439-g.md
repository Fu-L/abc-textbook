---
title: "ABC439-G — Sugoroku 6"
draft: true
authoringUnit: {"problemId":"abc439-g","docPath":"src/content/docs/problems/mathematics/outcome-compose-series-and-project-powers/outcome-compose-series-and-project-powers-shard-001/abc439-g.md","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-formal-power-series","unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-formal-power-series","tag-fps-composition-power-projection","tag-generating-functions","tag-convolution","tag-modular-arithmetic","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc439-editorial-14995-0a2a7c616c5b380cf5458a7d308d228890333a82e09702d6969594b82d21f75c","source-abc439-g-problem-0da2b7e4b8e02549256c2e22db02498f6e2ce0f1d44974bfbae9b0742dfeaf26"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一人の生存確率f_kから初回goal g_k=f_{k−1}−f_kを得る。人iがk回目に勝つには前のi−1人はk回後生存、後のL−i人はk−1回後生存なので独立性からg_kf_k^{i−1}f_{k−1}^{L−i}。i方向は等比列で一次分母の係数に等しく、分数積木と逆元が全iの和を生成する。法上0の除算を避け最後の人は直接式で評価する。","sourceRevisionIds":["source-abc439-editorial-14995-0a2a7c616c5b380cf5458a7d308d228890333a82e09702d6969594b82d21f75c","source-abc439-g-problem-0da2b7e4b8e02549256c2e22db02498f6e2ce0f1d44974bfbae9b0742dfeaf26"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、歩幅{1,2}を等確率、L=2。","procedure":["人1は初回2を引く確率1/2で勝つ。両者初回1の確率1/4では人1が二回目に勝つ。","人2は人1初回1、人2初回2の確率1/4だけ勝つ。"],"executionTarget":null,"expectedResult":"勝率(3/4,1/4)。","verificationStatus":"not_applicable","learningUnitIds":["unit-fps-composition-power-projection"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"prerequisiteIds":["unit-formal-power-series","unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"attainmentCondition":"歩幅が1だけならL人の勝率は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"人1が1、他0。"},"answer":{"reasoningOrVerification":"全員同じ回数Nでgoalし手番が先の人1が最初に到達する。","procedure":["具体例の各状態・寄与を再計算する。","全員同じ回数Nでgoalし手番が先の人1が最初に到達する。"],"expectedResult":"人1が1、他0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [FPS合成・power projection](src/content/docs/learn/combinatorics-algebra/fps-composition-power-projection.md)

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [FPS基本演算と多項式の多点評価を行う](src/content/docs/learn/combinatorics-algebra/formal-power-series.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一人が n 回行動後も未ゴールの確率 f_n は、歩幅分布 D(x)=M^-1Σx^{A_i} に対し \[x^{N-1}](1+x+…+x^{N-1})D(x)^n と表せる。必要なのは固定係数における多項式冪列である。

採用する候補: power projection で f_0…f_{N-1} を列挙し、各手番 i の勝率を有理関数の分数マージで一括係数化する。

冪ごとの係数抽出を O(N log^2 N)、L 人分の指数和を O(N log^2 N+L log L) 程度に共有できる。

棄却する候補: 各 n ごとに D^n を更新して全係数を計算し、さらに各人・各ゴール時刻を二重ループする。

冪級数更新が N 回必要で、勝率集計も NL に達する。

初回ゴール確率は g_n=f_{n-1}-f_n で、n≥N なら f_n=0 だから有限個だけ必要である。

人 i が k 回目に勝つ確率は g_k f_k^{i-1} f_{k-1}^{L-i}。前の i-1 人が k 回でも未到達、後ろの人が k-1 回で未到達という手番順を表す。

f_{k-1}≠0 では i に関する列は g_k f_{k-1}^{L-1}(f_k/f_{k-1})^{i-1} という等比列で、有理関数 w_k/(1-r_kx) の係数になる。

D と G=1+…+x^{N-1} に power projection を適用して f_n=[x^{N-1}]D^nG を得て g を差分化する。各 k の (w_k,r_k) から分数 w_k/(1-r_kx) を作り、積木状に分子分母をマージする。総分母の FPS inverse と分子を掛け、係数0…L-2を人1…L-1の答えにし、人Lは Σg_k f_k^{L-1} を直接求める。

## 典型の発動条件

### power projection

発動条件: [x^n]f(x)^i g(x) を多数の i について一括列挙したいとき。

二変数生成関数 g/(1-yf) に Bostan–Mori 型縮約を適用する。

### 確率母関数

発動条件: 独立な歩幅和が閾値へ達する時刻分布を多項式係数で表すとき。

n 回後の位置分布 D^n と未到達区間の係数和から f_n を得る。

### 有理関数の分割統治マージ

発動条件: 多数の w/(1-rx) の和の先頭係数を求めたいとき。

分子・分母を積木でマージし、最後に分母逆元を一度計算する。

## 問題固有の要素

反復畳み込みの特定係数を全時刻で欲しい問題は、冪を個別生成せず power projection として扱える。

別の問題へ持ち帰る視点: 人番号方向の指数依存を等比級数へ変換すると、全員分の確率を一つの有理関数の係数列にできる。

## 正当性

一人の生存確率f_kから初回goal g_k=f_{k−1}−f_kを得る。人iがk回目に勝つには前のi−1人はk回後生存、後のL−i人はk−1回後生存なので独立性からg_kf_k^{i−1}f_{k−1}^{L−i}。i方向は等比列で一次分母の係数に等しく、分数積木と逆元が全iの和を生成する。法上0の除算を避け最後の人は直接式で評価する。

## 実装上の注意

- f_N=0 を含む境界と g_k の添字を合わせる。f_{k-1}=0 の除算項を除外し、人 L の式を別計算する。法上の確率として M の逆元を使う。

## 復習の核

- f_n の係数式、手番順を反映した f_k と f_{k-1} の指数、分数係数の人番号対応を確認する。

## 計算量と制約

### 時間

O(N log²N+L log(N+L))を高速power projectionと分数積木の目安とする。

### 空間

O((N+L)log(N+L))。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2.5 \times 10^5; 1 \leq M \leq N; 2 \leq L \leq 2.5 \times 10^5; 1 \leq A_1 \lt A_2 \lt \dots \lt A_M \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、歩幅{1,2}を等確率、L=2。

1. 人1は初回2を引く確率1/2で勝つ。両者初回1の確率1/4では人1が二回目に勝つ。
2. 人2は人1初回1、人2初回2の確率1/4だけ勝つ。

期待される結果: 勝率(3/4,1/4)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

歩幅が1だけならL人の勝率は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全員同じ回数Nでgoalし手番が先の人1が最初に到達する。

確認結果: 人1が1、他0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14995) — source-abc439-editorial-14995-0a2a7c616c5b380cf5458a7d308d228890333a82e09702d6969594b82d21f75c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/tasks/abc439_g) — source-abc439-g-problem-0da2b7e4b8e02549256c2e22db02498f6e2ce0f1d44974bfbae9b0742dfeaf26
