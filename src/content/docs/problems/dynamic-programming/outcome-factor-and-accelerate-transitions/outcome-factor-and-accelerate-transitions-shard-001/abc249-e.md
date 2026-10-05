---
title: "ABC249-E — RLE"
draft: true
authoringUnit: {"problemId":"abc249-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc249-e.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d","source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"文字列の最大同文字run分解は一意である。最初のrunの文字は26通り、以後は直前と異なる25通りで、長さrを足すと元長がr、圧縮長が1+digits(r)だけ増える。したがって示したDPは各文字列を一度だけ数える。固定桁数dのr区間和はその全遷移の和と一致するのでprefix sumで置換でき、j<Nだけを合計すれば条件を満たす文字列をちょうど数える。","sourceRevisionIds":["source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d","source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

dp[i][j]を、元の文字列長i、RLE後の長さjとなる文字列数とする。空文字列から最初のrun長rを置く遷移はdp[r][1+digits(r)]へ26通りを加える。以後のrun長rでは直前と異なる25通りを選び、dp[i-r][j-d-1]からdp[i][j]へ寄与する。ただしd=digits(r)である。

固定したdでL=10^(d−1)、U=min(10^d−1,i)とすると、後続runの遷移元長t=i-rは[max(0,i−U), i−L]に入る。d=1ならrは[1,9]、すなわち25·Σ_{t=max(0,i−9)}^{i−1}dp[t][j−2]である。圧縮長j-d-1ごとに元長方向のprefix sumを保てば、この区間和をO(1)で取得できる。L≤iのdだけを処理し、区間が空なら寄与を0とする。元長iを昇順に処理して各dの寄与を足し、最後にΣ_{j=0}^{N−1}dp[N][j]を答える。

## 典型の発動条件

### 長さDP

発動条件: 構成要素を順に追加したとき、元の長さと出力長の両方を追う必要がある。

ランを1個追加する遷移として文字列を数え、圧縮長がN未満の状態だけを答えに含める。

### 遷移の区間和

発動条件: 遷移量が入力値そのものではなく、その桁数など少数の区分だけで決まる。

ラン長を10の冪で区切り、同じ圧縮長増分を持つ遷移元の和をまとめて取得する。

## 問題固有の要素

RLE長に影響するラン長の情報は十進桁数だけなので、N通りのラン長遷移が高々log N個の区間遷移へ縮約される。

別の問題へ持ち帰る視点: 遷移のパラメータが区分的に一定なら、その区切りを状態遷移の集約単位にする。

## 正当性

文字列の最大同文字run分解は一意である。最初のrunの文字は26通り、以後は直前と異なる25通りで、長さrを足すと元長がr、圧縮長が1+digits(r)だけ増える。したがって示したDPは各文字列を一度だけ数える。固定桁数dのr区間和はその全遷移の和と一致するのでprefix sumで置換でき、j<Nだけを合計すれば条件を満たす文字列をちょうど数える。

## 実装上の注意

- 法Pは入力で与えられるため全ての加減算をPで正規化し、最初のランの26倍と後続ランの25倍、圧縮長j<Nという境界を分けて扱う。

## 復習の核

- 小さいNで全ラン長を列挙する三次DPと照合し、桁数が変わる9/10、99/100付近と最初のランの係数を重点的に確認する。

## 計算量と制約

### 時間

O(N² log N)、ラン長の桁区間数O(log N)を累積和で処理。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 3000; 10^8 \le P \le 10^9; N and P are integers.; P is a prime.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_e) — source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3840) — source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b
