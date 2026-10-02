---
title: "ABC230-H — Bullion"
draft: true
authoringUnit: {"problemId":"abc230-h","docPath":"src/content/docs/problems/mathematics/outcome-derive-coefficient-recurrence-by-differentiation/outcome-derive-coefficient-recurrence-by-differentiation-shard-001/abc230-h.md","learningOutcomeIds":["outcome-derive-coefficient-recurrence-by-differentiation","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-recursive-divide-and-conquer"],"excludedTopics":["母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-function-coefficients","tag-relaxed-convolution","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1","source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"袋は外袋1個と非空の非順序多重集合に一意分解される。multisetの母関数はexp(ΣH(x^k)/k)で、空集合を引くことで非空条件を保つ。対数微分で得る約数和j_nとFの畳み込みは同じ母関数の係数式である。f_nを確定してからその倍数へn f_nを送り、過去から未来への寄与をCDQで一度ずつ送れば自己参照式を次数順に解ける。","sourceRevisionIds":["source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1","source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [母関数方程式・高度な係数抽出](src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)

- 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。
- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一つの袋の状態は、重さ 1 の外袋と、その中に入る非空袋または金塊の順序を持たない多重集合から再帰的に構成される。

中身が空の多重集合は非空袋の条件から除く必要があり、同じ状態の子袋や同重量金塊は区別されない。

棄却する候補: 重さごとに全ての中身の多重集合を列挙し、子袋の状態を再帰的に組み合わせる。

入れ子構造と重複可能な多重集合の候補数が急増し、W＝25 万まで列挙できない。

採用する候補: 多重集合構造の母関数を exp と置換 x→x^k で表し、暗黙方程式を微分して得る係数漸化式を分割統治 FFT でオンライン計算する。

順序を持たない再帰構造を正確に母関数へ移し、漸化式中の長い畳み込みを高速化できる。

非空袋の母関数 F、金塊の母関数 G、H＝F＋G とすると、F＝x(exp(Σ_{k>0}H(x^k)/k)−1) が構造をそのまま表す。

J＝Σ_{k>0}H*(x^k) の係数は j_n＝Σ_{d|n}d(f_d＋g_d) という約数和になり、微分後の式は F と J の畳み込みになる。

unlabeled multiset の組合せ構造から暗黙母関数を立て、対数微分で約数和列と自己畳み込みの係数再帰へ落とし、確定済み係数を CDQ 型 FFT で未来へ送る。

## 典型の発動条件

### 多重集合構造の母関数

発動条件: 区別しない部品を重複可・順序なしで集めた構造を重み別に数えるとき。

MULTISET(A) を exp(Σ_{k>0}A(x^k)/k) へ写し、袋の再帰定義を形式冪級数方程式にする。

### 暗黙母関数の微分とオンライン畳み込み

発動条件: 母関数方程式は得られたが、係数を順に求める再帰に自己畳み込みが現れるとき。

微分して n f_n を含む式を作り、既知の f と j の積から新係数を分割統治 FFT で計算する。

## 問題固有の要素

外袋の重さ x を掛け、中身が空の一通りを引くことで、「袋自体は存在するが中身が空なら持ち帰れない」という条件を式へ正確に反映する。

別の問題へ持ち帰る視点: 組合せ構造を母関数化するときは、空構造を許す箇所と禁止する箇所を定数項 1 の加減として逐一確認する。

## 正当性

袋は外袋1個と非空の非順序多重集合に一意分解される。multisetの母関数はexp(ΣH(x^k)/k)で、空集合を引くことで非空条件を保つ。対数微分で得る約数和j_nとFの畳み込みは同じ母関数の係数式である。f_nを確定してからその倍数へn f_nを送り、過去から未来への寄与をCDQで一度ずつ送れば自己参照式を次数順に解ける。

## 実装上の注意

- f₀＝f₁＝0 を基底とし、n≥2 で n−1 の逆元を掛ける係数式を使って 0 除算を避ける。
- f_n が確定するとその倍数添字の j へ n f_n を加える依存も生じるため、CDQ の区間開始が 0 の場合とそれ以外で更新時点を分ける。

## 復習の核

- 容器の中身が順序なし・同型要素を区別しないなら、列や通常積でなく MULTISET 構造の母関数を選ぶ。
- 暗黙母関数を得た後は、微分により対象係数を一次で孤立させ、残りが畳み込み・約数和へ分かれるかを見る。

## 計算量と制約

### 時間

O(W log²W)。CDQ畳み込みと係数確定後の倍数更新を行う。

### 空間

O(W)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq W \leq 2.5 \times 10^5; 1 \leq K \leq W; 1 \leq w_i \leq W (1 \leq i \leq K); i \neq j \to w_i \neq w_j (1 \leq i,j \leq K); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/3003) — source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_h) — source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f
