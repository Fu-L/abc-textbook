---
title: "ABC470 G — ΣШX"
draft: true
authoringUnit: {"problemId":"abc470-g","docPath":"src/content/docs/problems/updates/abc470-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc470-g-problem-58d1c97145a77978ac7655245e8f8e658c60fedad4b85a21a96d863d45c1be02","source-abc470-editorial-23879-4ac53a0ec1d4126c7b1a00644e677461d34a433b67c1bf0609837e84a5d04ed0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"mexの閾値展開は各区間の値を同じ整数個数の指示関数へ分解する。nextの最大は必要な全値が初めて揃う最小右端であり、右端候補の数がN+1−fに一致する。値追加は区間chmaxそのもの。fの単調性により更新対象のprefixを正確に代入すれば、全kの寄与を漏れなく加算できる。","sourceRevisionIds":["source-abc470-g-problem-58d1c97145a77978ac7655245e8f8e658c60fedad4b85a21a96d863d45c1be02","source-abc470-editorial-23879-4ac53a0ec1d4126c7b1a00644e677461d34a433b67c1bf0609837e84a5d04ed0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

## 考察

mexを直接各区間へ求めると O(N²)。非負整数mはΣ_{k≥0}[m>k]なので、mex>kを『0,…,kを全て含む』へ言い換えて総和の順を交換する。

左端lから右にある値kの最初の位置をnext_k(l)、なければN+1とし、f_k(l)=max_{0≤v≤k}next_v(l)。必要な全値を含む区間の右端は f_k(l) 以上なので、その個数は N+1−f_k(l)。答えは各k=0,…,N−1の N(N+1)−Σ_l f_k(l) の総和。基底f_{−1}(l)=0を置き、値kの出現をp_1<…<p_c、番兵p_0=0,p_{c+1}=N+1とすると、各l∈(p_{j−1},p_j]にfをchmax(p_j)する。

f_k(l)はlについて非減少。kの出現区間を左から順に更新すると、更新中もこの単調性が維持される。従ってchmaxする区間内で現在値がp_j未満の部分はprefixに限られる。Segment Treeの最大値を使った境界探索でその末尾を見つけ、そこだけp_jへ区間代入する。木には区間和と最大値を持ち、代入lazyを作用させる。

全値の出現数はN、各値に末尾番兵区間を一つ付けるので区間処理は高々2N回。値が存在しないkでは全体がN+1へ上がり、その後の寄与は0である。

## 典型の発動条件

mexを閾値の指示関数へ展開する。単調な配列のchmaxは、境界探索と区間代入へ簡約できる。

## 問題固有の要素

右端の番兵N+1は『区間が存在しない』を0寄与として表す。値Nはmex閾値として処理しなくてよい。

## 正当性

mexの閾値展開は各区間の値を同じ整数個数の指示関数へ分解する。nextの最大は必要な全値が初めて揃う最小右端であり、右端候補の数がN+1−fに一致する。値追加は区間chmaxそのもの。fの単調性により更新対象のprefixを正確に代入すれば、全kの寄与を漏れなく加算できる。

## 実装上の注意

Σ_l(N+1)はN(N+1)であり(N+1)²ではない。最終答えと区間和は64 bit整数。空区間への更新をしない。

## 復習の核

mexの総和は『全部含む』区間の数へ変える。配列の単調性が汎用chmaxより単純な作用を可能にする。

## 計算量と制約

### 時間

高々2N回の境界探索・代入で O(N log N)。

### 空間

出現位置リストとlazy Segment Tree O(N)。

### 制約との対応

Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 0 \leq A_i \leq N; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc470/tasks/abc470_g)
- [公式解説](https://atcoder.jp/contests/abc470/editorial/23879)
