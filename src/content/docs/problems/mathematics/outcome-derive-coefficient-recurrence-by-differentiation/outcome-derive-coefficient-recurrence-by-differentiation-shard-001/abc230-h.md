---
title: "ABC230-H — Bullion"
draft: true
authoringUnit: {"problemId":"abc230-h","docPath":"src/content/docs/problems/mathematics/outcome-derive-coefficient-recurrence-by-differentiation/outcome-derive-coefficient-recurrence-by-differentiation-shard-001/abc230-h.md","learningOutcomeIds":["outcome-derive-coefficient-recurrence-by-differentiation","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-recursive-divide-and-conquer"],"excludedTopics":["母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-function-coefficients","tag-relaxed-convolution","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1","source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"中身の非空多重集合への分解は一意で、重さごとの幾何級数積は記載の exp 方程式に等しい。その微分と係数比較により、f_n は j_{n−1} と f_i j_{n−i} (1≤i<n) だけから定まる。金塊分を事前に、袋分を f_d の確定直後に倍数へ送ると、葉 n の後で j_n=Σ_{d|n}d(f_d+g_d) が確定する。CDQ は左の f と j を確定してから右へ寄与を送る。l=0 では左同士の積を一度、l>0 では新規左 block と既知 prefix の二方向を送り、区間整列の 2l≥r により両方向は重ならない。各積は和が属する右区間へ一度だけ届くため、葉の acc は漸化式の畳み込み和と一致する。","sourceRevisionIds":["source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1","source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [母関数方程式・高度な係数抽出](src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)

- 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。
- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

袋の外側は重さ1で、中身は「非空袋の状態」と「金塊」の順序のない多重集合である。全中身を列挙すると重さ W=25万には届かない。部品の重さ d の種類数 h_d に対し、同じ部品を何個でも使う母関数は (1−x^d)^{−h_d}。重さごとに積を取ると exp(Σ_{k≥1}H(x^k)/k) となる。この積の説明から、区別しない同重量部品を重複可で選ぶ MULTISET の式を自然に導ける。

f_n を重さ n の非空袋の状態数、g_n をその重さの金塊が入力にあれば1、なければ0とする。F=Σf_n x^n,G=Σg_n x^n,H=F+G。外袋の x を掛け、中身が空の1通りを引くので

```text
F = x (exp(Σ_{k≥1}H(x^k)/k) − 1),  f_0=f_1=0
```

となる。暗黙方程式を微分し、H*(x)=xH'(x)、J(x)=Σ_{k≥1}H*(x^k)=Σj_n x^n と置くと

```text
j_0=0,  j_n=Σ_{d|n}d(f_d+g_d)
xF' = F+(F+x)J
n≥2: f_n = (j_{n−1}+Σ_{1≤i<n}f_i j_{n−i})/(n−1)
```

を得る。右辺には n より小さい添字だけが現れる。f_n が確定すれば j_n も確定し、次の f を求められる。答えは f_2,…,f_W で、法998244353では n−1<W<998244353 の逆元が存在する。

畳み込み和を素朴に計算すると O(W²)。未来への寄与を acc[n] に蓄積し、次の CDQ で確定済み block の積を NTT にまとめる。L は W+1 以上の最小2冪、f,j,acc の添字は0,…,L−1。金塊由来の j は最初に、各 g_d=1 の d の全倍数 m へ d を加えておく。範囲外の g は0。

```text
solve(l,r):                         # 半開区間、長さは2冪
  if r-l == 1:
    n=l
    f[n]=0 if n<2 else (j[n-1]+acc[n])/(n-1)
    for m=n,2n,... < L: j[m] += n*f[n]  # n>0 のときだけ
    return
  m=(l+r)/2
  solve(l,m)                        # f,j の左半分をともに確定
  if l==0:
    z=convolution(f[0:m], j[0:m])
    for n=m,...,r-1: acc[n] += z[n]
  else:
    d=r-l
    z=convolution(f[l:m], j[0:d]) + convolution(j[l:m], f[0:d])
    for n=m,...,r-1: acc[n] += z[n-l]
  solve(m,r)
solve(0,L)
```

切り出した配列の添字は0始まりなので、l>0 の積の n 次寄与は z[n−l] を読む。z の範囲外係数は0。葉で倍数更新する際、j[n] へ自身の n f_n も加え、j の確定を終えてからその block を畳み込む。

なぜ l=0 とそれ以外を分けるのか。l=0 では、右半分に和が入る積の両因子が左半分にあることがあり、一つの積で一度だけ送る。一方 l>0 の2冪整列区間は l≥r−l=d を満たす。i+j<r かつ一方の添字が l 以上なら他方は d 未満なので、既に確定した prefix [0,d) とだけ組めばよい。両方が l 以上の積は和が 2l≥r で今回の範囲外。この性質で未知の j を読まず、左右の向きも重複しない。

各積 f_i j_k は、和 i+k が右半分、最大添字が左半分となる最初の分割で送られる。それより下の区間では和が範囲外か、最大添字が現在の新規 block の外なので再び送られない。これが既知 kernel の CDQ を機械的に流用せず、二列をオンライン確定するための処理順である。

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

中身の非空多重集合への分解は一意で、重さごとの幾何級数積は記載の exp 方程式に等しい。その微分と係数比較により、f_n は j_{n−1} と f_i j_{n−i} (1≤i<n) だけから定まる。金塊分を事前に、袋分を f_d の確定直後に倍数へ送ると、葉 n の後で j_n=Σ_{d|n}d(f_d+g_d) が確定する。CDQ は左の f と j を確定してから右へ寄与を送る。l=0 では左同士の積を一度、l>0 では新規左 block と既知 prefix の二方向を送り、区間整列の 2l≥r により両方向は重ならない。各積は和が属する右区間へ一度だけ届くため、葉の acc は漸化式の畳み込み和と一致する。

## 実装上の注意

- f_0=f_1=j_0=0、g_n は入力重量の指示係数。金塊分だけを j の全倍数へ先に足す。
- 葉 n>0 で f_n を確定した後、m=n,2n,… へ n f_n を加える。自身の j_n も更新してから親の畳み込みへ戻る。
- l=0 の畳み込みは z[n]、l>0 は z[n−l] を読む。右半分に必要な係数だけ acc へ加える。
- n−1 の逆元表を前計算し、配列と NTT の一時領域を使い回す。左から順に葉を確定させる処理順を変えない。

## 復習の核

- 容器の中身が順序なし・同型要素を区別しないなら、列や通常積でなく MULTISET 構造の母関数を選ぶ。
- 暗黙母関数を得た後は、微分により対象係数を一次で孤立させ、残りが畳み込み・約数和へ分かれるかを見る。

## 計算量と制約

### 時間

O(W log²W)。長さ d の CDQ 節点は O(d log d) の NTT を定数回行い、各深さの区間長総和は O(W)。深さ O(log W) でこの費用を合計する。金塊の事前更新と f_n 確定後の倍数更新は Σ_{n≤O(W)}O(W/n)=O(W log W)。

### 空間

O(W)。f,j,acc と NTT 用作業配列。左を解いた後の畳み込み結果を右再帰の前に解放し、各節点の全中間多項式を保存しない。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq W \leq 2.5 \times 10^5; 1 \leq K \leq W; 1 \leq w_i \leq W (1 \leq i \leq K); i \neq j \to w_i \neq w_j (1 \leq i,j \leq K); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/3003) — source-abc230-editorial-3003-70d256e89da0d0eb0e51c7c7184fa0de26dc52504b5604f21a76fd095c71a1b1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_h) — source-abc230-h-problem-4918ec95f5dbeb2947257115e5feb3e54e034bd147dc6c9ff608eb26a24d5f8f
