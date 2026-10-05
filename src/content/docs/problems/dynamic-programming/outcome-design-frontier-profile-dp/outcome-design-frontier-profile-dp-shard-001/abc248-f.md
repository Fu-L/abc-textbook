---
title: "ABC248-F — Keep Connect"
draft: true
authoringUnit: {"problemId":"abc248-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-frontier-profile-dp/outcome-design-frontier-profile-dp-shard-001/abc248-f.md","learningOutcomeIds":["outcome-design-frontier-profile-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-frontier-profile-dp"],"sourceRevisionIds":["source-abc248-editorial-3794-0f4bea9b117b2b0313d67e7f15133f3917b6a673e5fecf6ff3a0e0707a6a2d18","source-abc248-f-problem-c8c2e67d573ee79935a50ab8e09d8722bf5c2eb4263fdfdb4cf85cbb212ea1ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各列の処理後、未処理部分と接するのは右端の二頂点だけである。過去の全頂点がその二頂点を含む一成分か、それぞれを含む二成分かを記録すれば、将来の連結可能性が決まる。新列の三辺の採否を全列挙し、frontierから接点を失った成分が生じる遷移を捨てる。一つの辺集合は列ごとの選択を一意に定めるので、削除数を加えたDPは各連結部分グラフを一回だけ数え、最終frontierが連結の状態が答えとなる。","sourceRevisionIds":["source-abc248-editorial-3794-0f4bea9b117b2b0313d67e7f15133f3917b6a673e5fecf6ff3a0e0707a6a2d18","source-abc248-f-problem-c8c2e67d573ee79935a50ab8e09d8722bf5c2eb4263fdfdb4cf85cbb212ea1ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [frontier/profile DP・境界状態圧縮](src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)

- 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。

先に読む単元:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md) — 状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。

## 考察

2×N ladder を左から作ると、処理済み部分に右端の上下 2 頂点をどちらも含まない連結成分が生じた時点で、以後の辺では再接続できない。

将来全体が連結になり得る frontier 状態は、処理済み部分が連結な状態 0 と、上下の右端を別々に含む 2 成分だけの状態 1 の 2 種類に限られる。

採用する候補: 列 i、削除辺数 j、frontier の 2 状態を持つ DP で、新しい横 2 辺と縦 1 辺の残し方を遷移する。

全 subgraph を列挙せず、将来の連結可能性に必要な frontier connectivity と削除数だけを保持できる。

棄却する候補: 3N-2 本の辺の各 subset を列挙し、削除後に graph が連結か調べる。

辺 subset が指数個あり、N≤3000 では扱えない。

状態 0 からは新しい 3 辺のうち 3 本または任意の 2 本を残すと状態 0、横辺 a_i,b_i の片方だけを残す 2 通りが状態 1 になる。両横辺を消す遷移は過去成分を孤立させる。

状態 1 からは a_i,b_i の両方を必ず残し、c_i も残せば状態 0、c_i を消せば状態 1 になる。

初列は c_0 を残す dp[0][0][0]=1 と、消す dp[0][1][1]=1 で始める。以後 new0[j]=old0[j]+3old0[j-1]+old1[j]、new1[j]=2old0[j-2]+old1[j-1] を P で計算し、最後の dp[N-1][j][0] を j=1,…,N-1 について出力する。

## 典型の発動条件

### frontier connectivity DP

発動条件: 幅が小さい graph を一方向に構築し、連結性を保つ辺選択を数えるとき。

右端上下頂点の連結/分離だけを状態にし、過去だけの成分を作る遷移を捨てる。

### 個数付き graph DP

発動条件: 構造条件に加えて、選択または削除した要素数ごとの答えが必要なとき。

削除辺数 j を DP 次元に加え、各 3 辺 pattern の削除数だけ shift する。

## 問題固有の要素

ladder の幅が 2 なので、将来へ接続できる frontier partition は連結か上下分離の 2 状態だけになり、8 通りの局所辺選択が定数個の係数へ畳み込める。

別の問題へ持ち帰る視点: 細い graph の連結性問題では、過去全体ではなく frontier に接する成分分割だけを状態にする。

## 正当性

各列の処理後、未処理部分と接するのは右端の二頂点だけである。過去の全頂点がその二頂点を含む一成分か、それぞれを含む二成分かを記録すれば、将来の連結可能性が決まる。新列の三辺の採否を全列挙し、frontierから接点を失った成分が生じる遷移を捨てる。一つの辺集合は列ごとの選択を一意に定めるので、削除数を加えたDPは各連結部分グラフを一回だけ数え、最終frontierが連結の状態が答えとなる。

## 実装上の注意

- 負の添字 old0[j-1],old0[j-2],old1[j-1] は 0 として扱い、各加算を入力の法 P で取る。
- 最終的に連結なら削除可能なのは高々 N-1 本なので、その範囲だけ出力し、状態 1 は答えへ含めない。

## 復習の核

- 旧状態 0/1 と新しい 3 辺の 8 pattern を小図で分類し、係数 3 と 2、および孤立により捨てる pattern の由来を確認する。

## 計算量と制約

### 時間

O(N²)、列×削除数、連結状態は二つ。

### 空間

O(N)、列方向rolling DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3000; 9\times 10^8 \leq P \leq 10^9; N is an integer.; P is a prime.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/editorial/3794) — source-abc248-editorial-3794-0f4bea9b117b2b0313d67e7f15133f3917b6a673e5fecf6ff3a0e0707a6a2d18
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/tasks/abc248_f) — source-abc248-f-problem-c8c2e67d573ee79935a50ab8e09d8722bf5c2eb4263fdfdb4cf85cbb212ea1ad
