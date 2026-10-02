---
title: "ABC367-G — Sum of (XOR^K or 0)"
draft: true
authoringUnit: {"problemId":"abc367-g","docPath":"src/content/docs/problems/mathematics/outcome-factor-separable-linear-transform/outcome-factor-separable-linear-transform-shard-001/abc367-g.md","learningOutcomeIds":["outcome-factor-separable-linear-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions"],"excludedTopics":["分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-linear-transform","tag-generating-functions"],"sourceRevisionIds":["source-abc367-editorial-10690-f24c8a0b72f2c8d1d14a3064faee85601a781a488fe998e675e447d2da0f4276","source-abc367-g-problem-94994beb59c85def9e0cb5b2e2aee067d6f2c0c3b39a234e3604c18bbf256efe"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各subsetは選択個数をx次数、XORを群添字に加算する。x^M=1へ畳むと長さM倍数は定数項へ集まる。XOR変換後の各frequencyは選択符号が+のB_t個と−のN−B_t個なので(1+x)^{B_t}(1−x)^{N−B_t}になる。その定数項を逆FWTすれば条件付きXOR分布を復元し、z^Kの重みを掛けて合計できる。","sourceRevisionIds":["source-abc367-editorial-10690-f24c8a0b72f2c8d1d14a3064faee85601a781a488fe998e675e447d2da0f4276","source-abc367-g-problem-94994beb59c85def9e0cb5b2e2aee067d6f2c0c3b39a234e3604c18bbf256efe"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離可能線形変換・Walsh–Hadamard変換](src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)

- Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

対象外:

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各n=0..Nについて、F_n=(1+x)^n、G_n=(1−x)^nをmod x^M−1で保持する。F_{n+1}[j]=F_n[j]+F_n[j−1]、G_{n+1}[j]=G_n[j]−G_n[j−1]（添字はmod M）なので二表はO(NM)で作れる。bごとの必要定数項はΣ_{j=0}^{M−1}F_b[j]G_{N−b}[−j]のM項内積で、全bもO(NM)。この前計算をXOR変換の各frequencyへ適用する。

採用する候補: xor軸をHadamard変換し、各周波数で(1+x)^B(1−x)^(N−B) mod(x^M−1)の定数項を求めて逆変換する。

xor convolutionと部分列長生成関数を別軸で対角化し、2^20個のsubset状態を個別更新せずに済む。

棄却する候補: 部分列を一要素ずつ追加し、長さmod Mとxor値の二次元DPを更新する。

一要素ごとにM·2^20状態を触るため、Nも大きい制約では反復できない。

frequency tでHadamard符号が+1となるA_iの個数をB_tとすると、全要素の変換後積は(1+x)^{B_t}(1−x)^{N−B_t}になる。

値frequency cntへFWTを掛ければH(cnt)_t=2B_t−Nなので、B_t=(H(cnt)_t+N)/2を全tで求められる。

値頻度cntを長さ2^20で作りFWTして各tのB_tを得る。b=0..Nについて多項式(1+x)^b(1−x)^(N−b)をx^M−1で剰余した定数項F[b]を前計算し、transform領域の値Vhat[t]=F[B_t]とする。inverse FWTでC_zを復元し、ΣC_z·z^Kを法上で計算する。

## 典型の発動条件

### XOR convolutionのWalsh-Hadamard変換

発動条件: subset選択の集約値がxorで、全xor値の係数が必要なとき。

xor convolutionをfrequencyごとの積へ対角化する。

### 巡回多項式による長さmod管理

発動条件: 選択個数が特定modに属する係数だけ必要なとき。

x^M=1として次数を折り返し、長さMの倍数を定数項へ集める。

## 問題固有の要素

Hadamard後の各要素factorは符号だけが異なる1±xなので、2^20周波数ごとの多項式をBというN+1種類へ再圧縮できる。

別の問題へ持ち帰る視点: transform後の値が少数parameterだけで決まるなら、parameter別前計算を共有する。

## 正当性

各subsetは選択個数をx次数、XORを群添字に加算する。x^M=1へ畳むと長さM倍数は定数項へ集まる。XOR変換後の各frequencyは選択符号が+のB_t個と−のN−B_t個なので(1+x)^{B_t}(1−x)^{N−B_t}になる。その定数項を逆FWTすれば条件付きXOR分布を復元し、z^Kの重みを掛けて合計できる。

## 実装上の注意

- inverse FWTの2^20逆元を掛ける。A_i=0では同じindexの1とxを加えた1+xになり、空部分列も長さ0として含まれる仕様を確認する。

## 復習の核

- Nが小さい場合に全部分列列挙とC_zを照合する。FWTのforward/inverse正規化とx^M=1で折り返す向きを独立にテストする。

## 計算量と制約

### 時間

O(NM+B log B+B log K)、B=2^20。巡回係数列(1±x)^nを各nでO(M)更新し、各bの定数項をM項内積で求める。

### 空間

O(NM+B)。二つの全n巡回係数表とHadamard配列。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,K \leq 2 \times 10^5; 1 \leq M \leq 100; 0 \leq A_i < 2^{20}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/editorial/10690) — source-abc367-editorial-10690-f24c8a0b72f2c8d1d14a3064faee85601a781a488fe998e675e447d2da0f4276
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/tasks/abc367_g) — source-abc367-g-problem-94994beb59c85def9e0cb5b2e2aee067d6f2c0c3b39a234e3604c18bbf256efe
