---
title: "ABC357-G — Stair-like Grid"
draft: true
authoringUnit: {"problemId":"abc357-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc357-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-relaxed-convolution","tag-combinatorial-coefficients","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06","source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"階段から外へ初めて出る経路は二行組の右端直外の仮壁を通り、仮壁を避ける長方形内経路は元の階段内経路と一致する。既に処理した壁への最初の到達数を負のdpとしておけば、自由な始点→vの経路から各最初の壁uまでの合法到達数×g(u,v)を引くことで、以前の壁を避けてvへ到達する数を得る。その負がdp(v)であり、終点だけは負を戻して答える。座標差から導いた四kernelはgそのもの。同じtの遷移を葉で処理し、異なるtの各組をCDQの一つの左→右更新で一度だけ処理するので、加算順を変えても元の因果的な包除DPと一致する。","sourceRevisionIds":["source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06","source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

全マスのDPはΘ(N²)で大きい。右下へしか進まないので、階段の外へ初めて出るときの点だけを禁止すればよい。N×Nの長方形へ埋め込み、t=1,…,N/2−1について

w_{t,1}=(2t−1,2t+1), w_{t,2}=(2t,2t+1)

を仮の壁にする。この二点は二行一組の右端直外であり、階段外へ進む経路は必ずいずれかを通る。既存のM個の壁と合わせ、行・列の順に処理する。

点aからbへの自由な右下経路数をg(a,b)=C(Δrow+Δcol,Δrow)とし、どちらかの差が負なら0とする。壁vについて「以前の壁を通らずvへ着く経路数」の負をdp(v)とする。始点s=(1,1)はdp(s)=1であり、壁を順に

dp(v)=−Σ_{u<v}g(u,v)dp(u)

で求める。終点z=(N,N)も同じ負符号の式で計算すれば、答えは−dp(z)になる。dpが負なのは、vを最初の禁止点としてそこから先の経路を引くためである。

壁を全部愚直に繋ぐとΘ(N²)。しかしM≤50の実壁との遷移だけならO(M(N+M))で、重いのは規則的な仮壁同士である。j<i、d=i−jとし、到着typeを行、出発typeを列にしたkernelは

K(d) = ((C(4d,2d), C(4d−1,2d)), (C(4d+1,2d), C(4d,2d)))。

例えばtype2→type1は座標差(2d−1,2d)なのでC(4d−1,2d)、type1→type2は差(2d+1,2d)なのでC(4d+1,2d)。二つの同typeは差(2d,2d)。これで仮壁の未処理寄与は

dp_{i,α} ← dp_{i,α} − Σ_{j<i}Σ_{β=1,2} K_{αβ}(i−j)dp_{j,β}

という二系列の畳み込みになる。同じtではtype1→type2の経路が一つあるので、dp_{t,1}確定後にdp_{t,2}からdp_{t,1}を引く。逆方向は到達不能であり、差0を通常の四kernelへ含めない。

CDQはtの区間を二分する。左側を先に確定し、左の二系列と四kernelをNTT畳み込みして、右側の添字だけへ負の寄与を送ってから右を解く。各左→右の組は分割木で初めて別halfになる一箇所だけで加算される。実壁を行の二行組へ配置し、実壁・始点・終点を含む遷移は同じ分割で直接加算する。葉では行・列順に、同じtの仮壁間と実壁間の依存を処理する。これにより、まだ確定していないdpを畳み込みに使わない。

N=4、実壁なしなら仮壁は(1,3),(2,3)。dpは−1、−3−(−1)=−2。自由経路20から、終点への経路数4,3を掛けた補正を加え、20−4−6=10になる。さらに実壁(2,2)を置くとそのdpは−2、(2,3)は−3−(−1)−(−2)=0なので答えは20−12−4=4。この計算で壁の順・負符号・同じtの依存を確認できる。

## 典型の発動条件

### 障害物grid pathの包除DP

発動条件: 右下移動pathを少数wallを避けて数え、点間path数が組合せで得られるとき。

topological順に「最初/最後のwall」を課金して到達数を引く。

### CDQ convolution

発動条件: online DP遷移が index差だけのkernelとの畳み込みで、左から値が確定するとき。

分割統治で左block→右block寄与をFFT/NTTでまとめる。

## 問題固有の要素

巨大な欠けたgridを埋込むとwall数もO(N)になるが、その大半が規則列なので「少数例外＋畳み込みkernel」として扱える。

別の問題へ持ち帰る視点: 巨大形状DPでは境界を障害物列へ変え、規則部分のtranslation invarianceを探す。

## 正当性

階段から外へ初めて出る経路は二行組の右端直外の仮壁を通り、仮壁を避ける長方形内経路は元の階段内経路と一致する。既に処理した壁への最初の到達数を負のdpとしておけば、自由な始点→vの経路から各最初の壁uまでの合法到達数×g(u,v)を引くことで、以前の壁を避けてvへ到達する数を得る。その負がdp(v)であり、終点だけは負を戻して答える。座標差から導いた四kernelはgそのもの。同じtの遷移を葉で処理し、異なるtの各組をCDQの一つの左→右更新で一度だけ処理するので、加算順を変えても元の因果的な包除DPと一致する。

## 実装上の注意

- kernelの行は到着type、列は出発type。同じtのtype1→type2は一通りで、葉で別処理する。
- 始点はdp=1、壁と終点は負の累積寄与、答えは−dp(終点)。法上の負数を正規化する。
- 階乗・逆階乗を2Nまで用意し、到達不能な点対はg=0。実壁は行・列の順に挿入する。
- CDQでは左のdpを確定してから右へ送り、畳み込み結果の右halfだけを反映する。作業bufferは再利用・解放してO(N+M)空間にする。

## 復習の核

- まずO(|S|²)のwall包除式を正しく導いてから規則wallだけを切り出す。kernelが本当にi−jだけに依存するか四typeすべて確認する。

## 計算量と制約

### 時間

O(N log²N+MN+M²)。規則wall間はCDQ畳み込み、実wallとの遷移は直接計算する。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2.5 \times 10^5; N is even.; 0 \leq M \leq 50; 1 \leq a_i \leq N; 1 \leq b_i \leq \left \lceil \frac{a_i}{2} \right \rceil \times 2; (a_i, b_i) \neq (1, 1) and (a_i, b_i) \neq (N, N).; (a_i, b_i) \neq (a_j, b_j) if i \neq j.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/editorial/10179) — source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/tasks/abc357_g) — source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f
