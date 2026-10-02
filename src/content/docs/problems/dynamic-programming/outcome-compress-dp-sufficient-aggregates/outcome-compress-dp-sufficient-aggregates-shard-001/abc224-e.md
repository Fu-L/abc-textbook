---
title: "ABC224-E — Integers on Grid"
draft: true
authoringUnit: {"problemId":"abc224-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-compress-dp-sufficient-aggregates/outcome-compress-dp-sufficient-aggregates-shard-001/abc224-e.md","learningOutcomeIds":["outcome-compress-dp-sufficient-aggregates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing","unit-dp-state-design","unit-event-sweep"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-dag-topological-processing","tag-event-sweep"],"sourceRevisionIds":["source-abc224-e-problem-76cd3a405fe7f1d2134f718f6be23b3b90252ef48741c934da2f1df943fe6ab7","source-abc224-editorial-2814-c729c4251bf523697578ba281e01425700ec2626b809d0607f13cd22b1acbba3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"値が大きい順なら移動先DPは確定済み。同じ行列の最大dp+1だけで最良の一手先が求まる。同値batchは先に全dpを計算し後で更新するため禁止された等値移動を混ぜない。終端からの帰納法で最大移動回数が正しい。","sourceRevisionIds":["source-abc224-e-problem-76cd3a405fe7f1d2134f718f6be23b3b90252ef48741c934da2f1df943fe6ab7","source-abc224-editorial-2814-c729c4251bf523697578ba281e01425700ec2626b809d0607f13cd22b1acbba3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

移動のたびに書かれた値が狭義に増えるので遷移に閉路はなく、値の大きいマスから答えを確定できる。ただし同じ行・列の全候補を毎回走査すると疎なNマスでも二乗時間になる。 dp_i は max(rmax[r_i],cmax[c_i]) であり、rmax,cmax を『現在値より真に大きいマスの dp+1』に保てば漸化式と一致する。 同じ a_i のマス同士は移動できないため、同値の一群は全てdpを計算してからrmax,cmaxへ反映しなければならない。

採用する候補: a_i の降順にマスを処理し、各行・列について既に処理した大きい値への最長移動数を rmax,cmax として集約する。

次の移動先に必要なのは同じ行と列にある大きい値のdp最大値だけであり、二つの配列から各マスを定数回で評価できる。

棄却する候補: 各マスから同じ行・列にある全ての大きい値のマスを列挙してdp遷移する。

一つの行または列にN個近く集中すると遷移辺が二乗個になり、N=2×10^5 を処理できない。

dp_i は max(rmax[r_i],cmax[c_i]) であり、rmax,cmax を『現在値より真に大きいマスの dp+1』に保てば漸化式と一致する。

同じ a_i のマス同士は移動できないため、同値の一群は全てdpを計算してからrmax,cmaxへ反映しなければならない。

N個のマスをa_i降順にsortし、等しい値のbatchごとに dp_i=max(rmax[r_i],cmax[c_i]) を先に求め、その後で両最大値をdp_i+1に更新する。

## 典型の発動条件

### 値順オフラインDP

発動条件: 遷移が値の狭義な大小方向だけに進み、値順がDAGのトポロジカル順序になるとき。

大きい値から処理して遷移先のdpを確定済みにし、同値は一括処理して狭義条件を守る。

### 属性別最大値による遷移集約

発動条件: 次状態候補が同じ行・列・色など少数の属性集合の和で、必要なのが候補値の最大だけのとき。

行ごと・列ごとの最大dpを保持し、明示的な全遷移辺を作らず二つの参照へ縮約する。

## 問題固有の要素

狭義増加条件は処理順を与えるだけでなく、同じ値の更新を遅延させる必要性まで決めている。

別の問題へ持ち帰る視点: 値順DPでは同値間遷移の可否を先に確認し、不可ならquery段階とupdate段階をbatchで分離する。

## 正当性

値が大きい順なら移動先DPは確定済み。同じ行列の最大dp+1だけで最良の一手先が求まる。同値batchは先に全dpを計算し後で更新するため禁止された等値移動を混ぜない。終端からの帰納法で最大移動回数が正しい。

## 実装上の注意

- 等しいa_iの全dpを保存してから更新し、列側は必ず cmax[c_i] を更新する。入力順へ戻して答えるため元indexも保持する。

## 復習の核

- 狭義不等号を見たら、同値を一件ずつ更新してはいけないことを思い出し、batchの読取りと書込みを分ける。

## 計算量と制約

### 時間

指定マス数N、行H、列W。sort O(N log N)、集約 O(N)、初期配列O(H+W)。

### 空間

マス、行列最大で O(N+H+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 2 \times 10^5; 1 \leq N \leq \min(2 \times 10^5, HW); 1 \leq r_i \leq H; 1 \leq c_i \leq W; 1 \leq a_i \leq 10^9; i \neq j \Rightarrow (r_i, c_i) \neq (r_j, c_j); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/tasks/abc224_e) — source-abc224-e-problem-76cd3a405fe7f1d2134f718f6be23b3b90252ef48741c934da2f1df943fe6ab7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/editorial/2814) — source-abc224-editorial-2814-c729c4251bf523697578ba281e01425700ec2626b809d0607f13cd22b1acbba3
