---
title: "ABC355-G — Baseball"
draft: true
authoringUnit: {"problemId":"abc355-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc355-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation","outcome-optimize-monge-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-monge-optimization"],"sourceRevisionIds":["source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea","source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"端の片側費用と内部の最寄り点費用は各位置の寄与をちょうど一度含むので、K施設とK+1辺の経路の費用が一致する。非負重み付きの距離の寄与比較でMonge不等式が成り立つ。Monge DAGの辺数別最短路費用は離散凸で、整数penaltyの支持線の最大から指定辺数の最適費用を得られる。最適辺数の単調性と0≤λ≤3NSの範囲で探索を完了できる。各penaltyのDPでは左を確定してから矩形遷移を反映し右を解くため、未確定値を参照せず全i<jを一度ずつ扱う。矩形のMonge性によりmonotone minimaが正しい行最小値を返し、同費用の最小辺数を一貫して選べる。したがって求めた最大支持線値が答えとなる。","sourceRevisionIds":["source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea","source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

S=ΣP_yで、問題は期待値そのものではなくS倍を要求する。位置x_1<…<x_Kを選んだ時の費用はΣ_y P_y min_t|y−x_t|。両端0,N+1を仮想頂点として加え、隣接する選択位置間の費用を辺へ持たせる。ただし仮想頂点は選択した施設ではなく、端の費用は片側だけで計算する。

c(0,j)=Σ_{y=1}^{j−1}P_y(j−y)、c(i,N+1)=Σ_{y=i}^N P_y(y−i)。内部の1≤i<j≤Nではc(i,j)=Σ_{y=i}^{j−1}P_y min(y−i,j−y)。y=iの項は0。中点m=⌊(i+j)/2⌋で左右に分け、P_yとyP_yのprefix和を用いれば各cをO(1)で求められる。0→N+1の直接辺は選択0個に対応するため禁止する。

これでちょうどd=K+1辺の最短路になる。通常の層別DPはO(KN²)でN≤5×10^4には大きい。距離の山を重ねると、i<j<k<lでc(i,l)+c(j,k)≥c(i,k)+c(j,l)が成り立つ。各位置yについて比較し非負重みP_yで足すとよく、片側費用でも同じ不等式になる。このMonge性を利用して辺数制約を緩和する。

λ≥0を一辺あたりのpenaltyとする。dp[0]=0、他は∞から始め、dp[j]=min_{i<j}(dp[i]+c(i,j)+λ)とする。dλを最適辺数として同費用では辺数の小さい方を採る。λが増えるほどdλは非増加。辺数別最適費用の離散凸性により、g(λ)=dp[N+1]−λ(K+1)の最大が求める答え。整数のcでは整数λを使える。

λの範囲は0≤λ≤Λ=3NSでよい。全ての実辺費用が0≤c≤NSで、λ=Λなら余分な一辺のpenaltyは任意の二辺への置換による節約を上回り、最適経路は最小の2辺になる。λ=0では全位置を通る0費用の経路も最適なので、目的の辺数は両端の最適辺数の範囲内にある。同費用の最小辺数がd以下となる最初の整数λを二分探索し、そのλと、λ>0なら直前のgを評価して最大を返す。d=N+1やd=2もこの端を含む探索で扱う。

ここで一層のdpが未確定の同じ層を参照する点に注意する。層別DP用の分割統治最適化を一度だけ適用することはできない。solve(l,r)では、①左半分solve(l,m)を確定、②確定したi∈[l,m)からj∈[m,r)への遷移を反映、③右半分solve(m,r)を確定する。葉に到着した時点で、その頂点への全ての早い頂点からの遷移が入っている。

②は行j、列iの矩形行列A[j,i]=dp[i]+c(i,j)+λの行最小値を求める処理になる。dp[i]は確定済みで、列定数の加算はMonge性を壊さない。行の中央値を全許可列で調べ、左の行にはその最小列以下、右にはその最小列以上だけを渡すmonotone minimaを用いる。一矩形の費用はO((r−l)log(r−l))、因果順序の分割統治全体でO(N log²N)。SMAWKで矩形を線形時間に処理する場合だけO(N log N)になる。本節は再現しやすいmonotone minimaの方を採用する。

同費用の辺数比較まで含めて矩形最小化する際は、整数λではcost*(N+2)+辺数を比較キーにするとよい。辺数は高々N+1で、主費用の順序を保ち、列定数としてMonge性も保つ。禁止した直接辺は最後の行の先頭列の∞として、最小列の探索範囲を壊さない。

## 典型の発動条件

### Aliens trick（Lagrangian relaxation）

発動条件: 最適化に「ちょうど d 個」の次元があり、各選択へ一様 penalty を加えた問題が速く解けるとき。

個数制約を λ へ双対化し、最適個数の単調性から λ を探索する。

### Monge shortest path optimization

発動条件: 区間 cost が quadrangle inequality を満たす DAG 最短路 DP。

最適遷移元の単調性を monotone minima/SMAWK/LARSCH で利用する。

## 問題固有の要素

期待値の確率分母 S は問題が既に掛けた値を要求するため、目的は各 y の重み P_y を持つ一次元 k-median に一致する。

別の問題へ持ち帰る視点: 一次元施設配置では隣接施設間への割当 cost が Monge になりやすく、Aliens DP の典型候補になる。

## 正当性

端の片側費用と内部の最寄り点費用は各位置の寄与をちょうど一度含むので、K施設とK+1辺の経路の費用が一致する。非負重み付きの距離の寄与比較でMonge不等式が成り立つ。Monge DAGの辺数別最短路費用は離散凸で、整数penaltyの支持線の最大から指定辺数の最適費用を得られる。最適辺数の単調性と0≤λ≤3NSの範囲で探索を完了できる。各penaltyのDPでは左を確定してから矩形遷移を反映し右を解くため、未確定値を参照せず全i<jを一度ずつ扱う。矩形のMonge性によりmonotone minimaが正しい行最小値を返し、同費用の最小辺数を一貫して選べる。したがって求めた最大支持線値が答えとなる。

## 実装上の注意

- 0,N+1は施設として距離を計算しない。直接辺0→N+1を禁止し、必要辺数はK+1とする。
- costと辺数を組で持つ。同費用は小さい辺数を選ぶ。∞を含む加算や比較キーの乗算には十分な整数幅を使う。
- 矩形の遷移を全体DPへminで反映する。別の再帰から既に入った値を上書きしない。

## 復習の核

- 高速化の前に path edge cost が各 y の最近点寄与を一度ずつ含むか確かめる。Monge証明と λ の個数tie-breakを別々に検証する。

## 計算量と制約

### 時間

O(N log²N log(NS+1))。採用した因果的分割統治＋monotone minimaは一penaltyあたりO(N log²N)、範囲Λ=3NSの二分探索はO(log(NS+1))回。矩形部分をSMAWKに置き換える場合はO(N log N log(NS+1))。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^4; 1 \leq K \leq N; 0 \leq P_i \leq 10^5; 1 \leq \sum_{y'=1}^N P_{y'} \leq 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/editorial/10078) — source-abc355-editorial-10078-5ef38cac7852bb0fe41f3cf428929d6aa1b53cebe533491730d18a30734e01ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/tasks/abc355_g) — source-abc355-g-problem-9558ba88acfc361df2782cb5c4dd1e6df013708bc57cba8d0b5fac6d3f42522c
