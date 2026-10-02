---
title: "ABC315-EX — Typical Convolution Problem"
draft: true
authoringUnit: {"problemId":"abc315-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-online-relaxed-convolution/outcome-compute-online-relaxed-convolution-shard-001/abc315-ex.md","learningOutcomeIds":["outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution"],"excludedTopics":["Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-relaxed-convolution","tag-convolution","tag-generating-functions"],"sourceRevisionIds":["source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f","source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"寄与先 n=i+j+1 は両方の添字より大きい。max(i,j) と n を左右に分ける最初の分割で、l=0 なら両添字は左半分、l>0 なら一方が新左 block、もう一方が既知の低い prefix にあり、指定した積がこの対を一度だけ送る。異なる分割では再度送らない。葉 n では G_{n−1} が完成しているため、prefix の更新と f[n]=A_n·prefix は元の漸化式に一致する。n=0 の初期値からの帰納で全係数が正しい。","sourceRevisionIds":["source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f","source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Relaxed・online convolution](src/content/docs/learn/combinatorics-algebra/relaxed-convolution.md)

- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

F_0=1、F_n=A_nΣ_{i+j<n}F_iF_j であり、G_s=Σ_{i+j=s}F_iF_j と置くと F_n=A_nΣ_{s=0}^{n−1}G_s。既知の F だけで次の F を求める因果的な依存だが、未知の全 F を通常の NTT に一括投入することはできない。

採用するのは時間軸の分割統治で、左半分を確定し、その積を右半分へ送ってから右を確定する。L を N+1 以上の最小2冪とし、f,h を長さ L の0配列、prefix=0 とする。h[s] は G_s の蓄積先で、n≥1 の葉では prefix+=h[n−1]、f[n]=A_n·prefix とする。n=0 の葉は f[0]=1、n>N の葉は不要である。

区間 solve(l,r) の長さが2以上なら m=(l+r)/2 として次を行う。

```text
solve(l,m)
if l=0:
    z = convolution(f[0:m], f[0:m])
    for m≤n<min(r,N+1): h[n−1] += z[n−1]
else:
    d = r−l
    z = 2·convolution(f[l:m], f[0:d])
    for m≤n<min(r,N+1): h[n−1] += z[n−1−l]
solve(m,r)
```

畳み込み配列の範囲外は0。l>0 の2冪整列区間では l≥d なので、f[0:d] は既に確定している。双方の添字が l 以上なら i+j+1≥2l+1>r となり、この右半分への寄与にはならない。そのため l>0 では新しい左 block と既知の低い prefix の二方向だけを係数2で送る。l=0 では自己積をそのまま使い、対角項を倍にしない。

各順序付き対 (i,j) の寄与先を n=i+j+1 と見ると、max(i,j) と n が初めて左右に分かれる一つの分割だけで加算される。葉 n を処理する前には h[n−1]=G_{n−1} が揃い、prefix と f[n] を順に確定できる。最後は f[1],…,f[N] を出力する。

素朴には全 G の計算が O(N²)。NTT を使うと各深さの block サイズ総和は O(N) で、一層 O(N log N)、全体 O(N log²N) になる。右再帰の前に一時配列を解放すれば空間は O(N)。

## 典型の発動条件

### Relaxed Convolution

発動条件: a_n,b_n が順次確定し、その時点で c_n=[x^n]AB が必要なオンライン漸化式。

2冪 block が完成するたび必要な block 積を FFT/NTT し、未来係数へ分配する。

### 生成関数による二重和の係数化

発動条件: Σ_{i+j<n}F_iF_j のような添字和条件を高速化したいとき。

F² の係数 G_t とその prefix sum に書き換える。

## 問題固有の要素

漸化式を閉形式へ解くのでなく、必要な convolution 係数だけを確定順に供給する online algorithm が循環依存を解く。

別の問題へ持ち帰る視点: 未知級数を含む再帰では、一括 FPS 操作だけでなく semi-online/relaxed convolution を候補にする。

## 正当性

寄与先 n=i+j+1 は両方の添字より大きい。max(i,j) と n を左右に分ける最初の分割で、l=0 なら両添字は左半分、l>0 なら一方が新左 block、もう一方が既知の低い prefix にあり、指定した積がこの対を一度だけ送る。異なる分割では再度送らない。葉 n では G_{n−1} が完成しているため、prefix の更新と f[n]=A_n·prefix は元の漸化式に一致する。n=0 の初期値からの帰納で全係数が正しい。

## 実装上の注意

- 寄与先は積の次数 s そのものではなく、次の F を作る n=s+1。h[n−1] に加える添字を揃える。
- l=0 の自己積には対角項があるので係数2を掛けない。l>0 の二つの block は分離しており二方向分を掛ける。
- f,h,prefix は法998244353。NTTの長さは積をaliasさせない2冪にし、必要な右区間の係数だけを取り出す。

## 復習の核

- まず二重和を「どの convolution 係数のどこまでの prefix か」へ正確に変形する。Relaxed Convolution は各係数対の担当 block を図で追ってから実装する。

## 計算量と制約

### 時間

O(N log²N)。完成二冪blockのrelaxed convolutionで未来係数を蓄積する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i < 998244353; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/editorial/6988) — source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/tasks/abc315_h) — source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9
