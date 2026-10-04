---
title: "ABC292-G — Count Strictly Increasing Sequences"
draft: true
authoringUnit: {"problemId":"abc292-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc292-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc292-editorial-5896-28ffb32781354ff1911e1f7e1d693e9dd16107cce13a29b9d80692114ca41c23","source-abc292-g-problem-714218a34f6e89aac6ec320f0cd62bd08c95dad0caf490167c48ee09cb549c82"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"辞書順で隣接行を厳密増加にする時、ある桁で同じ数字を与える行は連続blockになる。異なる数字のblock間の大小はこの桁だけで確定し、同じblock内だけが次の桁で厳密増加を実現する必要がある。したがって0..9の数字順にblock終端を試し、各blockの下位桁DPの個数を掛けて足す。固定文字に合わないblockは除く。実際の完成配列とこの桁ごとのblock分割は一対一であり、最終桁後に複数行が同じblockに残る状態を0とすれば厳密性も保証される。","sourceRevisionIds":["source-abc292-editorial-5896-28ffb32781354ff1911e1f7e1d693e9dd16107cce13a29b9d80692114ca41c23","source-abc292-g-problem-714218a34f6e89aac6ec320f0cd62bd08c95dad0caf490167c48ee09cb549c82"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

辞書順に厳密増加するには、現在桁が広義増加し、同じ桁値が続く各区間だけを次桁以降で厳密増加させればよい。

採用する候補: 行区間・桁・現在数字の区間DP

同一数字ブロックへ再帰する辞書順構造をそのまま区間分割DPにでき、N,M≤40を処理できる。

棄却する候補: ?を全て列挙

最大400個超の未知桁があり指数的になる。

一桁目の0..9の割当は行順に連続ブロックを作り、ブロック内だけが下位桁DPとして独立する。

dp[i][j][k]を行区間[i,j)のk桁目以降で厳密増加させる数とし、数字lごとの先頭ブロック長を補助DPで列挙して下位桁dpを積み上げる。

遷移を明示するため H(l,r,k,d) を、行区間 [l,r) の現在桁 k に数字 d,…,9 だけを使う場合の個数とする。dp(l,r,k)=H(l,r,k,0)。次に数字 d を使う先頭 block を [l,m) として、

```text
H(l,r,k,d) = Σ_{l≤m≤r, block [l,m) が d に適合}
                 dp(l,m,k+1)·H(m,r,k,d+1)
H(l,r,k,10) = (l=r ? 1 : 0)
dp(l,r,M) = (r−l≤1 ? 1 : 0)
```

空 block は全ての d に適合し dp(l,l,k+1)=1 とする。適合とは各行の k 桁目が ? または d であること。桁 k を M−1 から0へ、数字 d を9から0へ計算すれば右辺は確定済みになる。固定文字の不適合数を行方向のprefix和にして、blockの適合を O(1) で判定する。答えは dp(0,N,0)。状態数 O(10MN²)、一状態の分割 m が O(N) なので O(10MN³) であり、各状態でblock全体を再走査しないことが必要である。

## 典型の発動条件

### 辞書順の桁DP

発動条件: 複数文字列を辞書順に並べる割当を数える。

同じ上位桁の連続群だけ下位桁へ再帰する。

### 区間分割DP

発動条件: 順序制約により同値クラスが連続区間になる。

数字ごとの区間境界を列挙して積を取る。

## 問題固有の要素

厳密増加を隣接比較で追わず、最初に異なる桁の階層的な同値ブロックへ分解する。

別の問題へ持ち帰る視点: 辞書順制約はtrie状の連続グループ再帰として数える。

## 正当性

辞書順で隣接行を厳密増加にする時、ある桁で同じ数字を与える行は連続blockになる。異なる数字のblock間の大小はこの桁だけで確定し、同じblock内だけが次の桁で厳密増加を実現する必要がある。したがって0..9の数字順にblock終端を試し、各blockの下位桁DPの個数を掛けて足す。固定文字に合わないblockは除く。実際の完成配列とこの桁ごとのblock分割は一対一であり、最終桁後に複数行が同じblockに残る状態を0とすれば厳密性も保証される。

## 実装上の注意

- 固定数字と?の適合、最終桁で同値を許さない基底、半開区間を統一する。

## 復習の核

- 小N,Mの全埋めと比較し、全固定、全?、同一prefixが最終桁まで続く不可能例を確認する。

## 計算量と制約

### 時間

O(10MN³)、M桁ごとに同digit区間block分割。

### 空間

O(MN²)、桁×行区間DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 40; 1 \leq M \leq 40; N and M are integers.; S_i is a string of length M consisting of digits and ?.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/editorial/5896) — source-abc292-editorial-5896-28ffb32781354ff1911e1f7e1d693e9dd16107cce13a29b9d80692114ca41c23
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/tasks/abc292_g) — source-abc292-g-problem-714218a34f6e89aac6ec320f0cd62bd08c95dad0caf490167c48ee09cb549c82
