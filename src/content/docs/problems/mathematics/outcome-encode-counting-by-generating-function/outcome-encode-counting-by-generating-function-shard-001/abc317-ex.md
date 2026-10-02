---
title: "ABC317-EX — Walk"
draft: true
authoringUnit: {"problemId":"abc317-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc317-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-formal-power-series","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9","source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"戻り辺を除くと頂点indexが非減少なので各到達母関数は局所二階漸化式で一意に定まる。行列積はこの漸化式の合成そのもの。任意walkは頂点1への帰還ごとにprimitive returnを並べ、最後に戻らない終区間を付ける一意分解を持つため、生成関数はF_N/(1−xG_N)になる。全積をK次で切っても非負歩数なので目的係数は変わらない。","sourceRevisionIds":["source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9","source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

頂点1へ戻る辺を一旦禁止すると、遷移は n から n,n+1,n+2 だけで index が戻らない。歩数母関数 F_n(x) は直前二頂点の二階線形漸化式になる。

self-loop は (1−xA_n)^{-1}、前進辺は x の一次有理式係数として表せるため、2×2（prefix return も持つなら3×3）行列積を product tree で高速に計算できる。

採用する候補: 戻り無し excursion の母関数 F_N と1へ戻る primitive walk の母関数 xG_N を多項式行列積で求め、F_N/(1−xG_N) の x^K 係数を取る。

任意 walk は「1へ戻る primitive excursion の0回以上反復＋最後のN行き」に一意分解でき、N・K 双方を準線形多項式演算で扱える。

棄却する候補: 歩数ごとに全頂点の到達数を配る通常 DP を K 回行う。

O(NK) は最大2.5×10^10で、辺の前方局所性と戻りの excursion 構造を利用していない。

戻り辺を除いた F は F_n=P_n(Q_nF_{n−1}+R_nF_{n−2}) と表され、分母 (1−x) の冪を共通化すれば polynomial matrix product にできる。

1へ戻るたび walk を切ると primitive return の列は自由連結なので幾何級数 1/(1−xG_N)、最後の区間だけ F_N を掛ける。

次数 K で打ち切った polynomial を使う。product tree で局所遷移行列を掛け、戻り辺を使わない 1→n の F_n と G_N=ΣD_nF_n を求める。最終生成関数 H=F_N·inv(1−xG_N) mod x^{K+1} を NTT/FPS inverse で計算し [x^K]H を出す。

## 典型の発動条件

### walk の first-return 分解

発動条件: 特定頂点へ何度も戻れる walk を数え、戻らない区間は扱いやすいとき。

primitive return を atom とし、任意回連結を生成関数の幾何級数へ変える。

### 多項式係数行列の product tree

発動条件: 位置方向の低階漸化式を持つ生成関数を、多数位置にわたり高速合成するとき。

各位置を小行列にし、分割統治と NTT で全積を求める。

## 問題固有の要素

唯一の大きな後退先が頂点1なので、一般 graph walk ではなく renewal process と前向き DP の積として分離できる。

別の問題へ持ち帰る視点: 遷移がほぼ単調で少数の reset edge だけを持つなら、reset 間の excursion を生成関数化する。

## 正当性

戻り辺を除くと頂点indexが非減少なので各到達母関数は局所二階漸化式で一意に定まる。行列積はこの漸化式の合成そのもの。任意walkは頂点1への帰還ごとにprimitive returnを並べ、最後に戻らない終区間を付ける一意分解を持つため、生成関数はF_N/(1−xG_N)になる。全積をK次で切っても非負歩数なので目的係数は変わらない。

## 実装上の注意

- A_1=D_1 の self-loop を primitive return と前向き F の双方で二重計上しない定義を固定する。全 polynomial は x^{K+1} で truncate し、行列添字 n±1 を境界条件に合わせる。

## 復習の核

- まず戻り辺を消した graph で F_n の二階漸化式を書く。その後、任意 walk を「最後に1を出た区間」とそれ以前の return 区間へ一意に切る。

## 計算量と制約

### 時間

O((N+K)log²(N+K))を上界とする。次数K打切りの固定サイズ行列積木とFPS逆元。

### 空間

O((N+K)log N)の積木保持。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5 \times 10^4; 1 \leq K \leq 5 \times 10^5; A_i, B_i, C_i, D_i \in \lbrace 0, 1 \rbrace; A_1 = D_1; B_N = C_{N-1} = C_N = 0

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/editorial/7013) — source-abc317-editorial-7013-2e538661c5fbeb428b89076ae6a976e45249a07e838732eab8d9a027635950d9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/tasks/abc317_h) — source-abc317-ex-problem-fbd59b0227a3f35072f9dd14298cbff3e9f5554bf780ea7bdea114628041de95
