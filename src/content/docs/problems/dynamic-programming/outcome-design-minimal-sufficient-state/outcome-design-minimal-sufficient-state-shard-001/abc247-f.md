---
title: "ABC247-F — Cards"
draft: true
authoringUnit: {"problemId":"abc247-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc247-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d","source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"P,Qが置換なので各頂点の次数は2で、自己loop・平行辺を許せば全成分はcycleである。数を出すには隣接する2辺の少なくとも一方を選ぶ必要があるため、選択bit列に隣接する0がないことと同値である。長さ1,2の成分はそれぞれ1,3通り。長さm≥3では、先頭辺を選ぶ場合と選ばない場合に分けると残るpath長のFibonacci数え上げから `g(m)=g(m−1)+g(m−2)` となる。各cycleの選択は独立なので成分ごとの積が答えである。","sourceRevisionIds":["source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d","source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

数を頂点、各cardを `P_i` と `Q_i` を結ぶ辺とみなす。全ての数を出す条件は辺被覆であり、各頂点の次数が2なので成分はcycle（自己loopや平行辺を含む）に限られる。cycle上では隣り合う2辺を同時に非選択にしないことが辺被覆条件になる。

長さmのcycleの答えを `g(m)` とすると、`g(1)=1`、`g(2)=3`、`g(3)=4` で、`m≥3` では `g(m)=g(m−1)+g(m−2)`。cycle上の選択bit列は隣り合う0を持てない。先頭bitが1なら残りは長さm−1のpath、0なら両隣が1に固定され残りは長さm−3のpathとなり、path側のFibonacci漸化式からcycle側も同じ漸化式になる。

採用する候補: cycle長ごとの辺被覆数を前計算し、成分ごとに掛ける。

異なる成分の選択は独立で、各成分は長さだけで数えられる。

棄却する候補: N枚のcard subsetを全列挙して、全ての数が現れるか調べる。

候補は2^N個あり、N≤2×10^5では列挙できない。

## 典型の発動条件

### permutation からできる cycle 分解

発動条件: 2 個の permutation の対応を辺にすると各頂点の次数が固定されるとき。

P_i,Q_i を結ぶ多重 graph が 2-正則であることから cycle 成分へ分解する。

### 円環 DP

発動条件: 隣接制約を持つ選択列が cycle 上にあり、先頭と末尾の整合も必要なとき。

path の Fibonacci 型数え上げを端の辺の選択で場合分けして cycle の辺被覆数にする。

## 問題固有の要素

card を選ぶ問題を number 頂点の辺被覆へ写すと、2 つの permutation が保証する次数 2 により一般 graph ではなく cycle DP だけで済む。

別の問題へ持ち帰る視点: 入力の『各ラベルがちょうど一度ずつ現れる』条件は、構成 graph の次数や連結成分形を強く制約する手掛かりになる。

## 正当性

P,Qが置換なので各頂点の次数は2で、自己loop・平行辺を許せば全成分はcycleである。数を出すには隣接する2辺の少なくとも一方を選ぶ必要があるため、選択bit列に隣接する0がないことと同値である。長さ1,2の成分はそれぞれ1,3通り。長さm≥3では、先頭辺を選ぶ場合と選ばない場合に分けると残るpath長のFibonacci数え上げから `g(m)=g(m−1)+g(m−2)` となる。各cycleの選択は独立なので成分ごとの積が答えである。

## 実装上の注意

- P_i=Q_i の self-loop 成分は size 1 で、その card を選ぶ 1 通りだけなので g(1)=1 とする。
- size 2 は平行な 2 辺から少なくとも 1 本を選ぶ 3 通りであり、simple graph 前提の cycle traversal にしない。

## 復習の核

- self-loop、2 頂点の平行辺、通常の 3-cycle を並べ、それぞれの g(1)=1,g(2)=3,g(3)=4 を手で確認する。

## 計算量と制約

### 時間

O(Nα(N))、N辺の成分集計とNまでのFibonacci前計算。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq P_i,Q_i \leq N; P and Q are permutations of (1, 2, \dots, N).; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/editorial/3719) — source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/tasks/abc247_f) — source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e
