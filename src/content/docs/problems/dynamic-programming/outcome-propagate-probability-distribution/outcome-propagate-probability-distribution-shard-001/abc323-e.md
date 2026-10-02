---
title: "ABC323-E — Playlist"
draft: true
authoringUnit: {"problemId":"abc323-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc323-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc323-e-problem-5e48fc5e3fa5d92f3844f5dd695d5020a4a80f9ae516bc9c7211ae200296dcf3","source-abc323-editorial-7357-bc6da2c0f9b70d0ca06c9e349916b5e0405fbf5c764658dc443b7ce468946ecf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"曲終了時刻tの確率は各曲が開始したt−T_i確率の1/N倍の和。曲1が時刻Xに演奏中なのは開始tがX−T1<t≤Xという互いに排他的な事象だから、その開始確率和へ選曲1/Nを掛ける。境界の終了時刻は演奏中でない。","sourceRevisionIds":["source-abc323-e-problem-5e48fc5e3fa5d92f3844f5dd695d5020a4a80f9ae516bc9c7211ae200296dcf3","source-abc323-editorial-7357-bc6da2c0f9b70d0ca06c9e349916b5e0405fbf5c764658dc443b7ce468946ecf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

曲の切替時刻は全て整数なので、X+0.5時点で曲1が流れているなら、その開始時刻tはmax(0,X-T_1+1)≤t≤Xのいずれかである。 p[t]を時刻tに新しい曲が始まる確率とすると、その時刻に曲1が選ばれる確率はp[t]/Nで、開始時刻別のeventは排反である。 時刻tに切り替わる直前の曲kはt-T_kに始まったので、p[t]=(1/N)Σ_k p[t-T_k]というrenewal DPになる。 p[0]=1は時刻0に必ず最初の曲を選ぶeventを表し、負時刻のpを0とすれば同じ漸化式で境界を扱える。 X+0.5を使うことで整数時刻ちょうどの曲終了境界を避け、開始tの曲1が有効な条件をt+T_1≥X+1と整数式にできる。

採用する候補: 切替確率p[0..X]をDPし、曲1がX+0.5を覆う開始時刻の確率を合計する。

ランダムな無限playlistを有限な時刻Xまでのrenewal過程として正確に集約できる。

棄却する候補: 曲選択列を深さXまで全列挙し、該当列の確率を足す。

各切替でN分岐し、曲長によって深さも変わるため指数的になる。

棄却する候補: 時刻Xで最後に選ばれた曲だけを状態にするMarkov chain。

次の切替までの残り再生時間が必要で、曲番号だけでは状態が足りない。

p[0]=1は時刻0に必ず最初の曲を選ぶeventを表し、負時刻のpを0とすれば同じ漸化式で境界を扱える。

X+0.5を使うことで整数時刻ちょうどの曲終了境界を避け、開始tの曲1が有効な条件をt+T_1≥X+1と整数式にできる。

invN=N^{-1} mod 998244353を一度求め、p[0]=1とする。t=1..Xでsum=Σ_{k:T_k≤t}p[t-T_k]を計算しp[t]=sum·invNとする。l=max(0,X-T_1+1)からXまでのp[t]を足し、さらにinvNを掛けて曲1が選ばれる確率として出力する。

## 典型の発動条件

### renewal時刻DP

発動条件: 独立に選ぶdurationのtaskを切れ目なく繰り返し、特定時刻の状態を問うとき。

各整数時刻に新しいtaskが始まる確率をduration別に遡って足す。

### 排反な開始時刻分解

発動条件: 観測時点を覆うinterval eventを数えるとき。

対象taskの開始可能時刻ごとの確率を合計する。

## 問題固有の要素

再生中の曲を直接時刻DPする代わりに、全曲共通の「切替が起きる確率」を先に求めると、曲1固有の条件は最後の窓和だけになる。

別の問題へ持ち帰る視点: semi-Markovな過程では、状態の残り時間を持つ代わりにrenewal eventの時刻分布をDPすると簡潔になる。

## 正当性

曲終了時刻tの確率は各曲が開始したt−T_i確率の1/N倍の和。曲1が時刻Xに演奏中なのは開始tがX−T1<t≤Xという互いに排他的な事象だから、その開始確率和へ選曲1/Nを掛ける。境界の終了時刻は演奏中でない。

## 実装上の注意

- invNを内側loopで毎回pow計算せず一度だけ求め、各p[t]の和へ掛ける。
- T_1>X+1ならlower boundは0で、負indexのpを参照しない。

## 復習の核

- X=0とT_1=1の境界で開始時刻0だけが寄与すること、長い曲では窓が0までclipされることをtimelineで確認する。

## 計算量と制約

### 時間

曲N、時刻上限X。開始確率DP O(NX)。

### 空間

曲長O(N)、時刻確率O(X)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N\leq 10^3; 0 \leq X\leq 10^4; 1 \leq T_i\leq 10^4; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/tasks/abc323_e) — source-abc323-e-problem-5e48fc5e3fa5d92f3844f5dd695d5020a4a80f9ae516bc9c7211ae200296dcf3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/editorial/7357) — source-abc323-editorial-7357-bc6da2c0f9b70d0ca06c9e349916b5e0405fbf5c764658dc443b7ce468946ecf
