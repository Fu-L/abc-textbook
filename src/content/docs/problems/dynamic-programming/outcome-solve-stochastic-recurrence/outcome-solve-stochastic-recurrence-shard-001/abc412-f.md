---
title: "ABC412-F — Socks 4"
draft: true
authoringUnit: {"problemId":"abc412-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc412-f.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-greedy-exchange","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration","tag-greedy-exchange-order","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55","source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"色総数をa_iとし、保持色以外から引く遷移を「現在色を残す」か「引いた色を残す」かで比較する。後者が最適となるのは、その色の継続期待値E_jが小さいときである。上の三角再帰を隣り合うi,i+1で引くと `E_i/E_{i+1}=(T−1+a_{i+1})/(T−1+a_i)≥1`。従ってa_jが大きい色ほどE_jは小さく、異色を引いた後は総数の多い色を残す方がBellman最適である。同数では期待値も等しいので固定tie順でよい。この方策の再帰は添字の降順で求まり、prefix個数とsuffix重み付き和だけで評価できる。","sourceRevisionIds":["source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55","source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

外へ持つ一足を色総数へ戻して考えると、どの色を保持していても母集団は `S=Σa_i−1` で一定になる。保持色iから別色jを引いた後は、二色のうち総数が多い色を残す方が最適と予想できる。これを期待値で確認する。

`a_i` 昇順で色を並べ、保持色iの期待draw数をE_iとする。j<iを引いたらiを残す自己loop、j=iなら終了、j>iならjを残してE_jへ進む。したがって
`E_i=1+(Σ_{j<i}a_j/S)E_i+Σ_{j>i}(a_j/S)E_j`。

隣接期待値を比較すると `E_i=E_{i+1}·(T−1+a_{i+1})/(T−1+a_i)`（`T=Σ_{j>i}a_j`）。比率は1以上なのでE_i≥E_{i+1}。よって異色を引いたら総数の多い色、同数なら固定tie順で後ろの色を残すBellman選択が最適。

採用する候補: 保持色を総数順に並べた三角期待値DP

遷移が大きい添字にしか進まず、後ろから一回計算できる。

棄却する候補: 全保持色間のBellman連立方程式をそのまま解く。

一般の連立方程式にせず、保持色の最適順序で依存を三角化できる。

## 典型の発動条件

### 期待値DPの自己loop消去

発動条件: 一step後に同じ状態へ戻る確率を含む期待時間を求めるとき。

dp=1+qdp+r を (1-q)dp=1+r と移項する。

### 状態順序を作る貪欲方策

発動条件: 二候補から将来期待時間を小さくする一方を保持し、状態遷移を単調化できるとき。

総数順に色を並べ、多い色だけへ状態が上がるようにする。

### prefix/suffix集計

発動条件: 各iで左側の係数和と右側の重み付きDP和が必要なとき。

prefix Aと降順更新のsuffixWeightedで二重和を消す。

## 問題固有の要素

保持中の一足を総数へ含めると、タンス内総数と色の比較尺度が状態によらず固定され、期待値式が三角化する。

別の問題へ持ち帰る視点: 状態により母集団が一個だけ欠ける抽選では、その要素を含む固定総数へ正規化して分母と順位を共通化する。

## 正当性

色総数をa_iとし、保持色以外から引く遷移を「現在色を残す」か「引いた色を残す」かで比較する。後者が最適となるのは、その色の継続期待値E_jが小さいときである。上の三角再帰を隣り合うi,i+1で引くと `E_i/E_{i+1}=(T−1+a_{i+1})/(T−1+a_i)≥1`。従ってa_jが大きい色ほどE_jは小さく、異色を引いた後は総数の多い色を残す方がBellman最適である。同数では期待値も等しいので固定tie順でよい。この方策の再帰は添字の降順で求まり、prefix個数とsuffix重み付き和だけで評価できる。

## 実装上の注意

- 増やした後の色Cをsort後も追跡し、同数色のtie-breakを一貫させる。Sと1-X_iの逆元が取れること、A_i-1枚の同色drawは終了項であることを確認する。

## 復習の核

- N=1、初期色が最小／最大、同数色、二色だけの例を有限Markov方程式またはsimulationと比較する。

## 計算量と制約

### 時間

色数 N。sort O(N log N)、suffix和による期待値DP O(N)。

### 空間

色の対応、prefix、DPで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq C \leq N; 1 \leq A_i \leq 3000; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/editorial/13390) — source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/tasks/abc412_f) — source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787
