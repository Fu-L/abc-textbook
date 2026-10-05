---
title: "ABC271-G — Access Counter"
draft: true
authoringUnit: {"problemId":"abc271-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-accelerate-fixed-linear-transition/outcome-accelerate-fixed-linear-transition-shard-001/abc271-g.md","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["一般のDP遷移の区間集約・単調最適化。"],"tagIds":["tag-linear-recurrence-matrix","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc271-g-problem-7232f294682424bce273370bc368433bbd7331d706edf9a5151c81840824fc58","source-abc271-editorial-4931-b01c59d4b4297b12ce5e2936b33964cc01626c4dea121fda7d515768c9f8faaf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"現在の成功時刻から次の成功時刻への確率は、その間の各時刻で失敗する確率の積と、次時刻で成功する確率の積である。全24時間を失敗する確率qで同じ状況へ戻るため、全周回を幾何級数1/(1−q)で吸収する。これで各行の和が1の24状態遷移行列が得られる。成功を一回ずつ数えるMarkov性より、初成功分布へこの行列のN−1乗を掛けた分布が第N成功時刻の分布となる。","sourceRevisionIds":["source-abc271-g-problem-7232f294682424bce273370bc368433bbd7331d706edf9a5151c81840824fc58","source-abc271-editorial-4931-b01c59d4b4297b12ce5e2936b33964cc01626c4dea121fda7d515768c9f8faaf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md) — 状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 一般のDP遷移の区間集約・単調最適化。

## 考察

次のaccessの分布は最後にaccessが起きたhourだけで決まり、何日目かや以前の履歴は不要なので24状態のMarkov chainになる。

24時間すべてaccessなしの確率qは1未満で、同じhour patternを何周も通過する寄与はgeometric series 1/(1−q)で閉じられる。

棄却する候補: 時系列を日ごとにsimulationし、N番目のaccessまでprobability DPを進める。

access回数Nが10^18で、日数にも有限上限を置けない。

採用する候補: 一つ前のaccess hourから次のaccess hourへの24×24 transition matrixを作り、binary exponentiationでN−1回遷移する。

無限の待機日数をmatrix entryへ吸収し、固定24状態ならlog N回のmatrix squaringで済む。

last hour jからcandidate hour kまでcyclic順にaccessなしが続きkでaccessする一周分の確率を作り、全日no-accessの反復分として1/(1−q)を掛ける。

counter設置直後からfirst access hourのvectorも同じgeometric-series計算で作れ、これにtransition^(N−1)を掛けてN-th hour distributionを得る。

periodic Bernoulli processの無限待ち時間を一accessごとのfinite Markov transitionへ圧縮し、matrix exponentiationで巨大なaccess countを進める。

添字を具体化すると p_h は時刻 h のアクセス確率、q=∏_{h=0}^{23}(1−p_h)。時刻 j の直後から見る24候補を h_t=(j+t) mod 24、t=1,…,24 と置き、行ベクトル用の遷移行列を

```text
T[j,h_t] = p_{h_t}·∏_{s=1}^{t−1}(1−p_{h_s})/(1−q)
v[h] = p_h·∏_{s=0}^{h−1}(1−p_s)/(1−q)
```

とする。v は0時直前に設置してから最初のアクセスの分布で、Tの23時の行に一致する。Tの0時の行は0時直後から次のアクセスを待つので、設置時の初期分布には使わない。第Nアクセスの分布は vT^{N−1}。最後に c_h=A の時刻 h の成分だけを足す。N=1では累乗をせず v を集計し、全て c_h=T なら答えは0になる。

## 典型の発動条件

### 無限等比級数による周期圧縮

発動条件: 一周期でeventが起きない限り同じprobability patternが独立に繰り返されるとき。

一周内で次のaccessがhour kとなる確率を、whole-day failureの総和1/(1−q)で正規化する。

### Markov行列の高速累乗

発動条件: 次状態分布が有限状態だけに依存し、同じtransitionを非常に多く反復するとき。

24 hour statesのtransitionを二乗し、N−1のbinary digitsに従ってprobability vectorへ掛ける。

## 問題固有の要素

N-th accessがAokiによる確率は、最終hour distributionのうちc_h=Aであるhourの成分和として得られる。

別の問題へ持ち帰る視点: event主体がstateから一意に分かるなら、主体を別stateに増やさず終端statesの集合和で評価する。

## 正当性

現在の成功時刻から次の成功時刻への確率は、その間の各時刻で失敗する確率の積と、次時刻で成功する確率の積である。全24時間を失敗する確率qで同じ状況へ戻るため、全周回を幾何級数1/(1−q)で吸収する。これで各行の和が1の24状態遷移行列が得られる。成功を一回ずつ数えるMarkov性より、初成功分布へこの行列のN−1乗を掛けた分布が第N成功時刻の分布となる。

## 実装上の注意

- 各hourのaccess probabilityをX/100またはY/100としてmodular inverseで表し、non-accessは1−pで計算する。
- cyclic intervalでlast hour自身は次の日の候補として最後に現れるため、24 candidatesの積の開始・終了を明確にする。

## 復習の核

- 周期的random trialsの次event分布は、周期全失敗のgeometric seriesを先に閉じて有限transitionにする。
- 巨大なevent番号を問われたら、absolute timeではなくevent間で引き継がれる最小stateを探してmatrix化する。

## 計算量と制約

### 時間

O(24³ log N)、N番目access、24状態行列。

### 空間

O(24²)、行列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{18}; 1 \leq X,Y \leq 99; c_i is T or A.; N, X, and Y are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/tasks/abc271_g) — source-abc271-g-problem-7232f294682424bce273370bc368433bbd7331d706edf9a5151c81840824fc58
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/editorial/4931) — source-abc271-editorial-4931-b01c59d4b4297b12ce5e2936b33964cc01626c4dea121fda7d515768c9f8faaf
