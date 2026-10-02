---
title: "ABC222-H — Beautiful Binary Tree"
draft: true
authoringUnit: {"problemId":"abc222-h","docPath":"src/content/docs/problems/mathematics/outcome-invert-generating-function-equation/outcome-invert-generating-function-equation-shard-001/abc222-h.md","learningOutcomeIds":["outcome-invert-generating-function-equation","outcome-derive-coefficient-recurrence-by-differentiation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-modular-arithmetic"],"excludedTopics":["母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-function-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86","source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"許容木を根の値別のA,Bに分けるとB=2A+A²、A=x(1+A+B)²。消去してA=x(1+3A+A²)²となりLagrange反転で[x^N]A=(1/N)[x^{N−1}](1+3x+x²)^{2N}を得る。微分して係数比較した漸化式は定数項1から同じ係数を一意に生成する。","sourceRevisionIds":["source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86","source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [母関数方程式・高度な係数抽出](src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)

- F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。
- 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

小さい木で操作を追うと、成功可能性は操作順そのものではなく、根と葉が1であること、1の総数がNであること、0同士が親子にならないことという静的な条件で決まる。

採用する候補: 根が1の木と根が0の部分木を母関数で分け、関数方程式をラグランジュ反転して必要な一係数を漸化式で求める。

N=10^7 では木のサイズごとの畳み込みを直接計算できず、反転公式で答えを低次数多項式の冪の一係数へ落とす必要がある。

棄却する候補: 左右部分木の1の総数を分配する通常の木DPで a_i,b_i を順に計算する。

漸化式に全ての分割 j+(i-j) の畳み込みが現れて二乗時間となり、N=10^7 の制約に届かない。

根が1の木の母関数を A、根が0の許容部分木を B とすると、子の置き方から B=2A+A^2、A=x(1+A+B)^2=x(1+3A+A^2)^2 を得る。

ラグランジュ反転により答えは (1/N)\[x^(N-1)](1+3x+x^2)^(2N) となり、低次数多項式の冪は微分恒等式から二項漸化式で係数を順に出せる。

m=2N、u_k=\[x^k](1+3x+x^2)^m として u_0=1 から u_k={3(m+1-k)u_(k-1)+(2m+2-k)u_(k-2)}/k を進め、u_(N-1)/N を出力する。

## 典型の発動条件

### 根付き木の母関数分解

発動条件: 木を根の型と左右の独立な部分木へ分解でき、サイズ別個数の畳み込みが現れるとき。

根ラベル0・1の二種類を A,B に分け、空の子を含む左右の選択を積として関数方程式へ写す。

### ラグランジュの反転公式

発動条件: 求める母関数が F=xφ(F) の形で暗黙に定義され、特定次数の係数だけが必要なとき。

[x^N]F を (1/N)[x^(N-1)]φ(x)^N に変え、暗黙方程式を直接解かずに係数を取り出す。

### 微分恒等式による係数漸化式

発動条件: 固定次数の多項式 T の大きな冪 U=T^m の係数を先頭から多数求めるとき。

TU'=mT'U の係数を比較し、直前の少数係数だけを見るP-recursiveな漸化式を作る。

## 問題固有の要素

最大 N-1 回の加算操作による到達可能性が、『根・葉は1、1の総数はN、隣接する0はない』という局所条件へ完全に置き換わる。

別の問題へ持ち帰る視点: 操作列を数える前に、最終状態へ到達できる入力の不変量と局所禁止パターンを必要十分条件として探す。

## 正当性

許容木を根の値別のA,Bに分けるとB=2A+A²、A=x(1+A+B)²。消去してA=x(1+3A+A²)²となりLagrange反転で[x^N]A=(1/N)\[x^{N−1}](1+3x+x²)^{2N}を得る。微分して係数比較した漸化式は定数項1から同じ係数を一意に生成する。

## 実装上の注意

- u_(k-2) を使う漸化式の初期境界を分け、k と N の逆元を正しく掛ける。N<998244353 なので必要な除数は全て可逆である。

## 復習の核

- 巨大な N の木数え上げでは、DPを速くする前に F=xφ(F) の形と『欲しいのは一係数だけ』という構造を探す。

## 計算量と制約

### 時間

O(N)。係数の二項漸化式と逆元表を計算する。

### 空間

O(N)。係数は直前2項だけ保持できる。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^7; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/editorial/2742) — source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/tasks/abc222_h) — source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147
