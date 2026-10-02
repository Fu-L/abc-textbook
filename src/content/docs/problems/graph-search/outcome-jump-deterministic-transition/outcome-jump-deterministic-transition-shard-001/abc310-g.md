---
title: "ABC310-G — Takahashi And Pass-The-Ball Game"
draft: true
authoringUnit: {"problemId":"abc310-g","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc310-g.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5","source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"写像適用はボール移動と等しく線形である。blockの不変条件S=A^ℓ,x=Σ_{t<ℓ}A^t bは、後半がSxになる倍化で保たれる。答え側の不変条件F=A^p,ans=Σ_{t<p}A^t bは、F xを加えてFをS∘Fへ更新すればℓ時刻延ばされる。Kのbitの和でp=Kになり、一回操作後1,…,K時刻の分布を全て一度加える。Kで割れば一様な操作回数の期待分布になる。","sourceRevisionIds":["source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5","source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回の移動写像Aは、ベクトルvに対して(A v)_j=Σ_{i:A_i=j}v_iという分布移動を表す。求めるのは一回移動後の分布bから始まるΣ_{t=0}^{K−1}A^t bをKで割った期待値である。

長さℓのblockに対してS=A^ℓ、x=Σ_{t=0}^{ℓ−1}A^t bを一組にする。倍化はx'=x+Sx、S'=S∘S。写像適用は各iのv_iをS_iへ足すだけで、写像合成もS'_i=S_{S_i}なので両方O(N)である。

Kのbitを下から見て、S=A,x=b, F=恒等写像, ans=0から始める。F=A^pは既に取り込んだp時刻の直後への写像。現在bitが1ならans←ans+F x、F←S∘Fとしてblockを時刻pの後ろへ足す。その後、古いS,xからx←x+Sx、S←S∘Sを別bufferで同時更新する。例えばK=3ではbを取り込み、二倍block(b+Ab)をAで移して、b+Ab+A²bを得る。

全bitを処理したらansをKの法上の逆元で割る。各頂点のボールは合流しても分布ベクトルの加算に吸収されるので、行列N×Nを作る必要はない。

## 典型の発動条件

### 作用と区間和のダブリング

発動条件: 同じ写像を巨大回数適用した途中状態の総和も必要なとき。

2^b 回後の写像と、その 2^b 区間での寄与を対にして合成する。

### functional graph 上の線形輸送

発動条件: 各要素の遷移先が一意で、重みが遷移先へ合算されるとき。

写像配列を使ってベクトルを gather し、写像同士も添字参照で合成する。

## 問題固有の要素

最終状態ではなく全時刻平均なので、通常の doubling table に「区間中に何を足したか」を持たせる。

別の問題へ持ち帰る視点: 巨大反復の累積量は、遷移モノイドを作用付きの pair へ拡張すると二分累乗できる。

## 正当性

写像適用はボール移動と等しく線形である。blockの不変条件S=A^ℓ,x=Σ_{t<ℓ}A^t bは、後半がSxになる倍化で保たれる。答え側の不変条件F=A^p,ans=Σ_{t<p}A^t bは、F xを加えてFをS∘Fへ更新すればℓ時刻延ばされる。Kのbitの和でp=Kになり、一回操作後1,…,K時刻の分布を全て一度加える。Kで割れば一様な操作回数の期待分布になる。

## 実装上の注意

- xとSの倍化は古い値から計算し、移動先への加算を新bufferへ行う。in-place更新では合流やcycleが混ざる。
- 答えにblockを取り込むときはF xを足し、時刻offsetの写像Fも更新する。
- bは一回操作後、blockは0,…,K−1回の追加操作を表す。入力制約でKの逆元が存在することを確認する。

## 復習の核

- 反復過程の平均を見たら、まず求める時刻列を明記して和へ直す。次に「2倍区間の後半は前半へ写像を一度作用させたもの」と捉える。

## 計算量と制約

### 時間

N 頂点、時刻上限 K。写像適用と倍化が各 O(N) なので O(N log K)。

### 空間

現在写像と区間和ベクトルだけなら O(N)、全段保存なら O(N log K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times10^5; 1\leq K\leq 10^{18}; K is not a multiple of 998244353.; 1\leq A _ i\leq N\ (1\leq i\leq N); 0\leq B _ i\lt998244353\ (1\leq i\leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/editorial/6785) — source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/tasks/abc310_g) — source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5
