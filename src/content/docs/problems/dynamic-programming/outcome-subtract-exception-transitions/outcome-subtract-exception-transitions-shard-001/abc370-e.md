---
title: "ABC370-E — Avoid K Partition"
draft: true
authoringUnit: {"problemId":"abc370-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-subtract-exception-transitions/outcome-subtract-exception-transitions-shard-001/abc370-e.md","learningOutcomeIds":["outcome-subtract-exception-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc370-e-problem-d7ff45d3352a564a1b5f6de1562c31fcf5efce52c658332ce00497f5eb504fb4","source-abc370-editorial-10858-53664a8a6b1d89592b47f761ebce068c5c717e4a955921ededdecf1a92f9d5b7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"最後区間が(j+1..i)ならprefix差B_i−B_j。禁止和Kの切れ目はB_j=B_i−Kに限られる。全旧dp和からそのbucketだけ引くと全許可最後区間の数になる。計算後に現在dpを登録するので空区間を混ぜない。","sourceRevisionIds":["source-abc370-e-problem-d7ff45d3352a564a1b5f6de1562c31fcf5efce52c658332ce00497f5eb504fb4","source-abc370-editorial-10858-53664a8a6b1d89592b47f761ebce068c5c717e4a955921ededdecf1a92f9d5b7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

partitionはprefix境界0..Nの選択とみなせる。直前境界mから新境界nへのsegment sumがKでない場合だけdp[m]をdp[n]へ遷移できる。prefix sum Bを使うと禁止条件はB_m=B_n−Kとなり、過去境界の個別位置ではなくprefix値ごとのdp総和だけが必要になる。dp[0]=1を空prefixの境界としてallとbucket[B_0=0]へ先に登録すると、最初のsegmentも同じ式で処理できる。A_iは負を含むためprefix sumは単調でなく、two pointersではなくhash mapによる値別集約が必要である。

採用する候補: 全過去dpの総和allとprefix sum値別のdp総和bucketを持ち、dp[n]=all−bucket[B_n−K]とする。

許可される全境界の和を毎回列挙せず、禁止される同値class一つだけを差し引ける。

棄却する候補: 各終端nについて全開始境界mを走査し、区間和がKか判定する。

prefix sumで一区間判定は速くても境界pairが二次で、同じ禁止prefix値をまとめていない。

B_0=0、dp[0]=1、all=1、bucket[0]=1で始める。n=1..Nでprefix B_nを更新し、dp[n]=(all−bucket[B_n−K]) mod 998244353とする。その後allへdp[n]を足し、bucket[B_n]へも足す。dp[N]を出力する。

## 典型の発動条件

### 全遷移和から禁止classを除くDP

発動条件: 過去状態の大半が遷移可能で、禁止条件が一つのkey一致で表せるとき。

全dp総和を保ち、key別総和だけ差し引く。

### prefix sum値別集約

発動条件: segment sum条件が固定値との一致・不一致で決まるとき。

開始境界をprefix値でgroup化して連想配列に蓄積する。

## 問題固有の要素

許可条件「Kではない」を直接列挙するより、全候補から唯一の禁止prefix値を引く補集合が単純である。

別の問題へ持ち帰る視点: 否定条件付きDPでは、禁止側のequivalence classが小さく表せるか確認する。

## 正当性

最後区間が(j+1..i)ならprefix差B_i−B_j。禁止和Kの切れ目はB_j=B_i−Kに限られる。全旧dp和からそのbucketだけ引くと全許可最後区間の数になる。計算後に現在dpを登録するので空区間を混ぜない。

## 実装上の注意

- 添字を境界0..Nで統一し、bucket登録はdp計算後に行って空segmentを許さない。mod減算を負のまま残さず64 bit prefix sumをkeyにする。

## 復習の核

- N=1でA_1=K/≠Kの二例を追い、初期bucketと更新順を確認する。負数を含むため順序性を仮定しない。

## 計算量と制約

### 時間

列長N。prefix値bucketをhashで保持し expected O(N)、balanced mapなら O(N log N)。

### 空間

dp値集約bucket O(N)、列逐次処理可。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; -10^{15} \leq K \leq 10^{15}; -10^9 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/tasks/abc370_e) — source-abc370-e-problem-d7ff45d3352a564a1b5f6de1562c31fcf5efce52c658332ce00497f5eb504fb4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/editorial/10858) — source-abc370-editorial-10858-53664a8a6b1d89592b47f761ebce068c5c717e4a955921ededdecf1a92f9d5b7
