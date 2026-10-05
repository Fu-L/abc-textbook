---
title: "ABC249-EX — Dye Color"
draft: true
authoringUnit: {"problemId":"abc249-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-decompose-expectation-by-additive-potential/outcome-decompose-expectation-by-additive-potential-shard-001/abc249-ex.md","learningOutcomeIds":["outcome-decompose-expectation-by-additive-potential"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["期待値の頻度圧縮と加法的ポテンシャルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-additive-expectation-potential","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec","source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"固定色j個からs個選ばれる確率はq_s=C(j,s)/2^j。他色の選択数tはsと独立で平均(N−j)/2だから、色cが塗り直しで一つ入る確率(s+t)/Nを条件付き平均してα_s=(s+(N−j)/2)/Nを得る。残ったj−s個への0/1追加を全sで足したPは元操作の周辺分布そのものである。g(0)=0とし、行jの一段方程式から唯一の未知g(j+1)を解く。P[j][j+1]=(N−j)/(N·2^(j+1))は法上非零なので全gが一意に決まる。非終端では全N色の頻度はN未満で、Φ=Σ_c g(J_c)は一手あたり期待値が1減る。単色終端でΦ=g(N)なのでΦ−g(N)は終端値0と期待停止回数のBellman式を満たす。任意の状態から一つずつ球を同じ色へ変更する高々N手の事象に一様な正の確率下界があるため、停止時間は有限期待値を持ち、このBellman解が求める期待回数である。","sourceRevisionIds":["source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec","source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [期待値の頻度圧縮と加法的ポテンシャル](src/content/docs/learn/dynamic-programming/additive-expectation-potential.md)

- 対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md) — 状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

ある色が現在j個あるとき、その色の個数の次状態分布はjだけで決まり、1回の操作では増えてもj+1までである。

採用する候補: 色ごとの個数に対する加法的ポテンシャル

期待残り回数を各色の個数だけの関数の和で表すと、一色の遷移式へ分離でき、増加幅が高々1なので値を順番に決定できる。

棄却する候補: 全ての盤面状態を頂点にするマルコフ連鎖

色の配置状態数が指数的で、N=2000まで扱えない。

色名ではなく出現個数だけを見る対称性により、各色へ同じ一変数関数gを適用するポテンシャルを設計できる。

g(j)の式に現れる未確定の大きい添字はg(j+1)だけで、その遷移確率が非零なので、連立方程式を逐次的に解ける。

分布を作る際にも状態を増やしすぎない。色cが現在j個あり、そのうち選ばれる個数をs、他色から選ばれる個数をtとする。一様部分集合では各球が独立に確率1/2で選ばれるので、sの確率はq_s=C(j,s)/2^j、条件付きのE[t]=(N−j)/2である。塗り直す色は重複しないため、選ばれたs+t色の集合にcが入る確率は(s+t)/Nで、入っても新しいcは一つだけ。

tごとに列挙すると全jで三乗時間になる。しかしこの確率はtの一次式なので、tを平均へ置き換えてよい。sを固定したときcが一つ入る確率はα_s=(s+(N−j)/2)/N。元のcのうちj−s個が残るから、一行を0で初期化して全s=0,…,jについて

P[j][j−s+1] += q_s α_s、P[j][j−s] += q_s(1−α_s)

と更新する。一つのkへ二つのsから寄与する場合も必ず加算する。空の選択はs=t=0として含まれ、行和はΣ_s q_s=1になる。増加先j+1はs=0でcが入る場合だけなのでP[j][j+1]=(N−j)/(N·2^(j+1))となる。

法p=998244353上ではinv[1..N]と2^(−j)を前計算する。各jのq_0=2^(−j)からq_(s+1)=q_s(j−s)inv[s+1]と生成すれば、二項係数の表は不要。α_s=(2s+N−j)inv[2]inv[N]と評価でき、N,2,s+1はいずれも法上可逆である。

g(0)=0と固定し、0≤j<Nでg(j)=1/N+Σ_k P[j][k]g(k)を課す。唯一の未確定値g(j+1)を移項すると

g(j+1)=(g(j)−1/N−Σ_{k=0}^j P[j][k]g(k))/P[j][j+1]。

分母はN−jが1..Nなので非零。逆数はN·2^(j+1)inv[N−j]からO(1)で得る。自己ループP[j][j]もこの和に含め、1−P[j][j]で別途割る必要はない。jを昇順に一行ずつ生成・評価すれば、一行O(j+1)、全体O(N²)。行jはg(j+1)を確定した後に使わないので破棄でき、保存するg、逆元、作業行はO(N)である。

初期頻度J_cをc=1,…,Nについて数え、答えはΣ_c g(J_c)−g(N)。存在しない色もg(0)=0として含める。g自体は期待時間ではなくポテンシャルの部品なので負になってもよい。単色の初期状態ではこの式が0になる。

## 典型の発動条件

### 対称性による頻度圧縮

発動条件: ラベルの違いではなく各種類の出現数だけが遷移確率を決める。

色ごとの寄与を同一関数g(頻度)として期待値を加法分解する。

### 上ヘッセンベルグ型の期待値方程式

発動条件: 一回で状態量が増える幅だけが1に制限されている。

各jの方程式から唯一の次項g(j+1)を解き、巨大な一般連立方程式を避ける。

## 問題固有の要素

一色の個数は減少幅こそ大きいが増加は高々1であり、この非対称性が期待値方程式を前から解ける形にする。

別の問題へ持ち帰る視点: 多種類の対称な確率過程では、全体の吸収時間を一種類の周辺過程のポテンシャル和として探す。

## 正当性

固定色j個からs個選ばれる確率はq_s=C(j,s)/2^j。他色の選択数tはsと独立で平均(N−j)/2だから、色cが塗り直しで一つ入る確率(s+t)/Nを条件付き平均してα_s=(s+(N−j)/2)/Nを得る。残ったj−s個への0/1追加を全sで足したPは元操作の周辺分布そのものである。g(0)=0とし、行jの一段方程式から唯一の未知g(j+1)を解く。P[j][j+1]=(N−j)/(N·2^(j+1))は法上非零なので全gが一意に決まる。非終端では全N色の頻度はN未満で、Φ=Σ_c g(J_c)は一手あたり期待値が1減る。単色終端でΦ=g(N)なのでΦ−g(N)は終端値0と期待停止回数のBellman式を満たす。任意の状態から一つずつ球を同じ色へ変更する高々N手の事象に一様な正の確率下界があるため、停止時間は有限期待値を持ち、このBellman解が求める期待回数である。

## 実装上の注意

- q_sは一行内の漸化式で作る。Pの同じ添字への複数寄与を加え、全行を同時に保存しない。
- g(j+1)を解くときは自己ループを和に含め、非零のP[j][j+1]だけで割る。
- g(0)=0、初期の全N色の頻度集計、終端定数g(N)の差し引きを揃える。

## 復習の核

- Nが小さい場合の全状態連立方程式と比較し、単色の初期状態で0になること、各P[j][k]の総和が1になること、終端定数の較正を確認する。

## 計算量と制約

### 時間

O(N²)。行jのq_s・P生成と既知gとの内積はそれぞれO(j+1)、全jの和がO(N²)。逆元・2の冪・初期頻度の前計算はO(N)。

### 空間

O(N)。g、逆元、2の冪と一行の作業配列だけを保持する。全N行の分布表や二項係数表は作らない。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2000; 1 \le A_i \le N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3842) — source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_h) — source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266
