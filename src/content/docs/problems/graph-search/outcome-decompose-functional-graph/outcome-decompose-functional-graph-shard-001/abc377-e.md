---
title: "ABC377-E — Permute K times 2"
draft: true
authoringUnit: {"problemId":"abc377-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc377-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc377-e-problem-ffa6944b90c3f057053b100634a547deeb0bb4ca2423c96632b7a1d176f67038","source-abc377-editorial-11238-25534d683c1a7a13bda3efa75d7b1bf148fde3143638b94a0430c4e8793f0ca6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一操作で写像が二乗されるためK回後はP^(2^K)。各cycleでは指数の長さmodだけが作用を決めるので高速冪でshiftを求める。cycle分割は全点を一度ずつ含み全回答を正確に構成する。","sourceRevisionIds":["source-abc377-e-problem-ffa6944b90c3f057053b100634a547deeb0bb4ca2423c96632b7a1d176f67038","source-abc377-editorial-11238-25534d683c1a7a13bda3efa75d7b1bf148fde3143638b94a0430c4e8793f0ca6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回の操作で permutation は自分自身との合成になり、K 回後は P^{2^K} である。各 cycle 内では必要なのは 2^K を cycle 長で割った余りだけである。 P←P∘P を繰り返すと指数は 1→2→4→… と倍化し、K 回後の写像は P^{2^K} になる。 cycle 長 L 上では P^t が t mod L の回転に等しいため、巨大指数そのものを保持する必要がない。

採用する候補: P を cycle 分解し、各 cycle 長 L ごとに pow_mod(2,K,L) を求め、その offset だけ要素を回転する。

K≤10^18でも modular exponentiation は O(log K) であり、各頂点を一度だけ cycle へ入れて答えを構成できる。

棄却する候補: 操作を K 回そのままシミュレーションして permutation を二乗する。

K は10^18で、各回 O(N) の合成は実行不可能である。

P←P∘P を繰り返すと指数は 1→2→4→… と倍化し、K 回後の写像は P^{2^K} になる。

cycle 長 L 上では P^t が t mod L の回転に等しいため、巨大指数そのものを保持する必要がない。

未訪問位置から P を辿って cycle 配列を作る。shift=2^K mod length を高速冪で求め、cycle[j] の答えを cycle[(j+shift) mod length] とする。

## 典型の発動条件

### permutation 冪の cycle 回転

発動条件: permutation の巨大指数回適用を全要素に求めるとき。

cycle 長ごとに指数を剰余化して配列を回転する。

## 問題固有の要素

操作回数 K と最終的な permutation の指数を混同せず、指数が毎回二倍になる漸化式を先に立てる。

別の問題へ持ち帰る視点: 巨大指数は cycle ごとに別の法で落とすため、全体 lcm は不要である。

## 正当性

一操作で写像が二乗されるためK回後はP^(2^K)。各cycleでは指数の長さmodだけが作用を決めるので高速冪でshiftを求める。cycle分割は全点を一度ずつ含み全回答を正確に構成する。

## 実装上の注意

- P^t の向きを cycle 配列の index 増加と一致させる。length=1 と K=0 相当の指数も同じ式で扱える。

## 復習の核

- 小さな3-cycleで操作ごとの指数 1,2,4,…を手計算し、shift の向きまでコードと照合する。

## 計算量と制約

### 時間

N 頂点、操作回数K。cycle数Cとして O(N+C log(K+1))。

### 空間

cycle列、visited、回答で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq K\leq10^{18}; 1\leq P_i\leq N\ (1\leq i\leq N); P_i\neq P_j\ (1\leq i\lt j\leq N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/tasks/abc377_e) — source-abc377-e-problem-ffa6944b90c3f057053b100634a547deeb0bb4ca2423c96632b7a1d176f67038
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/editorial/11238) — source-abc377-editorial-11238-25534d683c1a7a13bda3efa75d7b1bf148fde3143638b94a0430c4e8793f0ca6
