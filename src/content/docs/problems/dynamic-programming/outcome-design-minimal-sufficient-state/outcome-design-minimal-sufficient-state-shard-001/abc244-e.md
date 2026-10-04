---
title: "ABC244-E — King Bombee"
draft: true
authoringUnit: {"problemId":"abc244-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc244-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc244-e-problem-c7b0059b4829f2485a38a0654d331cb7e65e73d2b8240fcae584a2fe22a06920","source-abc244-editorial-3601-e4ea51c7997b77a0c14c3e3ddb86207455ef995f49f63e43e08ee2efe6c092a2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"将来必要なのは現在頂点とX到着回数の偶奇だけ。Xへ着く場合にだけxor1する遷移は各walkの条件と一致する。各edgeごとに両方向を配るprefix帰納法で長さKの全walkを一度ずつ数え、終点偶数状態を読む。","sourceRevisionIds":["source-abc244-e-problem-c7b0059b4829f2485a38a0654d331cb7e65e73d2b8240fcae584a2fe22a06920","source-abc244-editorial-3601-e4ea51c7997b77a0c14c3e3ddb86207455ef995f49f63e43e08ee2efe6c092a2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

頂点 S から K 辺の walk を数えるだけなら、step 数と現在頂点の DP で足りる。追加条件は X の正確な訪問回数ではなく偶奇だけなので、必要な履歴は1 bit に圧縮できる。 walk の次頂点 j を追加した瞬間に j=X なら parity を反転すれば、sequence A_0..A_K に現れる X を漏れなく数えられる。X≠S なので初期 parity は偶数である。 「偶数回」という global 条件は、各 X 訪問で状態を0↔1に切り替える有限 automaton として局所遷移へ組み込める。

採用する候補: dp[step][v][parity] を持ち、各無向辺を両方向へ遷移して X 到着時だけ parity を XOR する。

通常の walk DP と二状態 automaton の直積だけで条件を表し、過去の訪問列を保存しなくてよい。

棄却する候補: S-T の K-step walk を列挙し、各列で X の出現回数を数える。

各 step で分岐する walk 数は指数的で、K=2000では列挙できない。

「偶数回」という global 条件は、各 X 訪問で状態を0↔1に切り替える有限 automaton として局所遷移へ組み込める。

cur[S][0]=1 から K 回、辺 (u,v) ごとに u→v と v→u を更新し、到着先が X なら parity を1反転する。rolling array で step を進め、cur[T][0] を法998244353で出力する。

## 典型の発動条件

### DP と有限 automaton の直積

発動条件: path/walk に出現回数 mod m や禁止 pattern などの履歴条件が付くとき。

graph vertex に小さな automaton state を掛け、edge 遷移時に状態を更新する。

### 固定長 walk DP

発動条件: 辺をちょうど K 回通る walk の個数を疎 graph 上で数えるとき。

step ごとに全 edge を両方向へ走査して次層へ加算する。

## 問題固有の要素

X の訪問判定は出発時でなく次頂点を sequence へ追加する時に行い、A_0=S を初期状態へ反映する。

別の問題へ持ち帰る視点: walk の頂点出現条件では、sequence のどの位置を各遷移で数えるかを明示して off-by-one を防ぐ。

## 正当性

将来必要なのは現在頂点とX到着回数の偶奇だけ。Xへ着く場合にだけxor1する遷移は各walkの条件と一致する。各edgeごとに両方向を配るprefix帰納法で長さKの全walkを一度ずつ数え、終点偶数状態を読む。

## 実装上の注意

- 無向辺は二方向を更新し、next 配列を各 step で0 clearする。X≠S,T の保証はあるが、一般化するなら初期頂点分の parity も初期化に反映する。

## 復習の核

- 長さ1の edge walkで A_0 と A_1 のどちらをいつ数えるかを書き、到着時 XOR の規約を固定する。

## 計算量と制約

### 時間

N 頂点、M 辺、手数K。二parityのwalk DP O(K(N+M))。

### 空間

rolling vertex×parity O(N)、隣接O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 2≤N≤2000; 1≤M≤2000; 1≤K≤2000; 1≤S,T,X≤N; X≠S; X≠T; 1≤U_i<V_i≤N; If i ≠ j, then (U_i, V_i) ≠ (U_j, V_j).

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/tasks/abc244_e) — source-abc244-e-problem-c7b0059b4829f2485a38a0654d331cb7e65e73d2b8240fcae584a2fe22a06920
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/editorial/3601) — source-abc244-editorial-3601-e4ea51c7997b77a0c14c3e3ddb86207455ef995f49f63e43e08ee2efe6c092a2
