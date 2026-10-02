---
title: "ABC454-F — Make it Palindrome 2"
draft: true
authoringUnit: {"problemId":"abc454-f","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc454-f.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc454-editorial-18568-8ce2cba3bb83660699ad4c3dbb33f0ab5d396d236c33e9a6cea0b08bc3143e9e","source-abc454-f-problem-bbc8d24f06252a3e5e57c69a70f9a50b8e76f4cd8da3d0d358d05e4be52a59a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"C の総和は M の倍数で、増加操作総数と減少操作総数を一致させれば二点移送として全操作をpairingできる。 増加側集合 X の最適サイズは |X|=N''-ΣC/M で、そのサイズでは必要増加数と減少数が一致し、最小 C の和が答えになる。 B の区間±1は C の二点への+1/-1移送に対応し、各 C_i を増加側か減少側のどちらかだけで0へ送る最適化は、選択個数固定なら小さい C_i を選ぶのが最良である。","sourceRevisionIds":["source-abc454-editorial-18568-8ce2cba3bb83660699ad4c3dbb33f0ab5d396d236c33e9a6cea0b08bc3143e9e","source-abc454-f-problem-bbc8d24f06252a3e5e57c69a70f9a50b8e76f4cd8da3d0d358d05e4be52a59a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

中央をまたぐ区間加算は左右へ分割・相殺できるため禁止してよい。左右対称位置の差 B_i=A_i-A_{N+1-i} mod M を全0にすれば palindrome になる。

採用する候補: B の差分列 C_i=B_i-B_{i-1} mod M（両端0番兵）を作り、C の非零値を sort して、公式で定まる個数の小さい値の和を最小操作数とする。

B の区間±1は C の二点への+1/-1移送に対応し、各 C_i を増加側か減少側のどちらかだけで0へ送る最適化は、選択個数固定なら小さい C_i を選ぶのが最良である。

棄却する候補: A の区間と加算方向を状態にして palindrome になるまで BFS する。

状態数は M^N 級で、区間操作の候補も二乗個あるため探索不能である。

C の総和は M の倍数で、増加操作総数と減少操作総数を一致させれば二点移送として全操作をpairingできる。

増加側集合 X の最適サイズは |X|=N''-ΣC/M で、そのサイズでは必要増加数と減少数が一致し、最小 C の和が答えになる。

N'=floor(N/2) の B を計算し、B_0=B_{N'+1}=0 として N''=N'+1 個の C を0..M-1に正規化する。C を昇順sortし、k=N''-ΣC/M 個のprefix sumを出力する。

## 典型の発動条件

### 区間操作の差分二点化

発動条件: range ±1で数列を目標値へ揃える最小操作を考えるとき。

差分列で区間端二点の単位移送へ変換する。

### 方向分割とsort最適化

発動条件: 各剰余を増やすか減らすか選び、両方向回数の最大を最小化するとき。

最適な選択個数を導き、その個数の最小値を取る。

## 問題固有の要素

palindrome 条件は対称pair差へ落とし、range operation はさらに差分の二点 operationへ落とすと一次元輸送問題になる。

別の問題へ持ち帰る視点: subsetが個数と総和だけで評価されるなら、個数固定後はsort prefixが最適になる。

## 正当性

C の総和は M の倍数で、増加操作総数と減少操作総数を一致させれば二点移送として全操作をpairingできる。 増加側集合 X の最適サイズは |X|=N''-ΣC/M で、そのサイズでは必要増加数と減少数が一致し、最小 C の和が答えになる。 B の区間±1は C の二点への+1/-1移送に対応し、各 C_i を増加側か減少側のどちらかだけで0へ送る最適化は、選択個数固定なら小さい C_i を選ぶのが最良である。

## 実装上の注意

- mod差を常に0..M-1へ正規化し、B末尾の0番兵から生じる最後のCを忘れない。kが0やN''になる境界を許す。

## 復習の核

- 一回の左側区間操作が B と C をどう変えるかを追い、増加側集合サイズ k の導出を操作回数二式から再現する。

## 計算量と制約

### 時間

O(N log N)、差分列のsortを含む。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T; 1\le N\le 2\times 10^5; 1\le M\le 10^9; 0\le A_i < M; The sum of N over all test cases is at most 2\times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc454/editorial/18568) — source-abc454-editorial-18568-8ce2cba3bb83660699ad4c3dbb33f0ab5d396d236c33e9a6cea0b08bc3143e9e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc454/tasks/abc454_f) — source-abc454-f-problem-bbc8d24f06252a3e5e57c69a70f9a50b8e76f4cd8da3d0d358d05e4be52a59a5
