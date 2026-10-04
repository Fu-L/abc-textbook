---
title: "ABC402-E — Payment Required"
draft: true
authoringUnit: {"problemId":"abc402-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc402-e.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc402-e-problem-084ab41cc39dd19ddaad7ec9c07bf94060aa33c49ff382844c77c4c0a97a5a2e","source-abc402-editorial-12715-edfc33d3cc4411475c03d3005acbc0c97b5b5cbfa25eb5c7961b9ea9ae792615"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"状態maskと残予算で各再挑戦の成功失敗確率が定まる。costを引いた小予算先で成功報酬+solve状態と失敗未solve状態を重み付けするBellman式は全策略の第一行動を網羅する。予算昇順で依存先が既計算になり最大を取れる。","sourceRevisionIds":["source-abc402-e-problem-084ab41cc39dd19ddaad7ec9c07bf94060aa33c49ff382844c77c4c0a97a5a2e","source-abc402-editorial-12715-edfc33d3cc4411475c03d3005acbc0c97b5b5cbfa25eb5c7961b9ea9ae792615"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

次にどのproblemへsubmitするかを過去結果に応じて変えられるため、固定回数配分ではなくadaptive policyの期待値最適化である。将来に必要なのは既solve集合Tと残金xだけで、提出するたび残金が必ず減るので循環のないDPになる。失敗遷移はsolve集合が同じでも残金が小さいstateなので、x昇順に計算すれば自己mask参照は既に確定している。既solve problemへ再提出してもscoreが増えないためaction候補から除外してよい。

採用する候補: state(T,x)から未solve problemへの一回提出を選ぶ期待値DPを行う

success時はS_i+d[T∪{i}][x-C_i]、failure時はd[T][x-C_i]へ遷移し、全actionの最大を取ればBellman最適性を満たす。O(NX2^N)がN≤8に適合する。

棄却する候補: 各problemへの提出回数を事前に決めて期待scoreを最大化する

途中で早くsolveできたproblemへの追加提出を別problemへ回す適応的選択を表せず、最適policyを失う。

d[mask][x]を0で初期化しx=0..Xを昇順に、全mask・未solve i with C_i≤xについてp_i(S_i+d[mask|bit][x-C_i])+(1-p_i)d[mask][x-C_i]でmax更新する。d[0][X]を出す。

## 典型の発動条件

### stochastic control DP

発動条件: 観測結果に応じ次actionを選び、有限resourceが毎回減るとき。

十分状態と各actionの期待遷移をBellman式にする。

### bitmask solved-state

発動条件: 少数の一度だけrewardを得るtask集合を管理するとき。

solve済み集合を2^N maskにする。

## 問題固有の要素

同じproblemへ何度でも挑戦できるが、moneyがstrictに減るためfailure self-loopを方程式で解かず通常のbottom-up DPで扱える。

別の問題へ持ち帰る視点: 再試行可能な確率DPでは、状態が本当に循環するか、別resource軸が必ず減ってDAGになるか確認する。

## 正当性

状態maskと残予算で各再挑戦の成功失敗確率が定まる。costを引いた小予算先で成功報酬+solve状態と失敗未solve状態を重み付けするBellman式は全策略の第一行動を網羅する。予算昇順で依存先が既計算になり最大を取れる。

## 実装上の注意

- P_i/100をdoubleで計算し、x-C_i stateを同じmask/next maskから読む。何もしない選択の期待値0を残す。

## 復習の核

- N≤3,X小でpolicy treeを全列挙し、P=100、低確率再試行、costが残金ちょうどのcaseをDPと比較する。

## 計算量と制約

### 時間

問題数N≤8、予算X。mask,budgetごと未解決問題を列挙 O(NX2^N)。

### 空間

mask×budget期待値 O(X2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 8; 1 \leq S_i \leq 2718; 1 \leq C_i \leq X \leq 5000; 1 \leq P_i \leq 100; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/tasks/abc402_e) — source-abc402-e-problem-084ab41cc39dd19ddaad7ec9c07bf94060aa33c49ff382844c77c4c0a97a5a2e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/editorial/12715) — source-abc402-editorial-12715-edfc33d3cc4411475c03d3005acbc0c97b5b5cbfa25eb5c7961b9ea9ae792615
