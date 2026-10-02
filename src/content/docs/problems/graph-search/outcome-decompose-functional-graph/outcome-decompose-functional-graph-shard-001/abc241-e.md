---
title: "ABC241-E — Putting Candies"
draft: true
authoringUnit: {"problemId":"abc241-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc241-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc241-e-problem-aa1078a5980728f8a202a2ab0dd7b8cb2f9dbbf4fda2dc2352a746e378172be4","source-abc241-editorial-3472-223ab10f3662d986ab9f48d7c727f682d9bbc31b921499899f8366059700fd74"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"次参照位置は総和modNで決まり同じ状態に戻ると加算列も同じ周期になる。cycle前prefix、一周期gain、余りprefixに分けることはKステップの正確な分割であり、飛ばしても加算量を失わない。","sourceRevisionIds":["source-abc241-e-problem-aa1078a5980728f8a202a2ab0dd7b8cb2f9dbbf4fda2dc2352a746e378172be4","source-abc241-editorial-3472-223ab10f3662d986ab9f48d7c727f682d9bbc31b921499899f8366059700fd74"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

次に参照する index は現在の総キャンディ数 X そのものではなく X mod N だけで決まり、residue r から (r+A_r) mod N へ移る N 状態の functional graph になる。 各状態の出辺は一つなので、0から進む residue 列は高々 N ステップで既出状態へ戻り、それ以降は同じ状態列と加算量を周期的に繰り返す。 同じ residue に戻った二時点 s<t の間では状態遷移だけでなく加算する A の列も同じになり、cycle gain は prefix[t]-prefix[s] である。

採用する候補: residue の初出 step と、その時点までの累積キャンディ数を記録し、cycle 検出後に残り回数を cycle 単位で飛ばす。

K は巨大でも cycle 前と一周期は合わせて N 状態以下で、加算値も prefix 差から一括計算できる。

棄却する候補: 2^b 回分の遷移先と加算量を全 residue について作る doubling を使う。

公式に示された有効な別解だが、query は一つなので、この record では N 状態を一度たどるだけの cycle 法を採用する。

同じ residue に戻った二時点 s<t の間では状態遷移だけでなく加算する A の列も同じになり、cycle gain は prefix[t]-prefix[s] である。

state=0、prefix[0]=0 から、未訪問 state に step を記録し A_state を加えて次 residue へ進む。K 回前に repeat したら cycleStart s、length p、gain を求め、K-s を商と余りに分けて prefix[s]+商·gain+cycle prefix の余りを返す。

## 典型の発動条件

### functional graph の周期検出

発動条件: 有限状態で各状態の次状態が一意、操作回数だけが非常に大きいとき。

初出時刻を記録し、tail と cycle に分けて反復を飛ばす。

### 重み付き cycle の prefix sum

発動条件: 状態遷移ごとに値を加算し、巨大回数後の総和が必要なとき。

初出時の累積値を保存し、cycle 一周の gain と余り区間を差分で得る。

## 問題固有の要素

総キャンディ数は単調に巨大化するが、制御に使う residue だけを状態、実際の個数を遷移重みとして分離できる。

別の問題へ持ち帰る視点: 状態決定に値の剰余しか使わない反復では、商を捨てて有限 automaton と重みへ分ける。

## 正当性

次参照位置は総和modNで決まり同じ状態に戻ると加算列も同じ周期になる。cycle前prefix、一周期gain、余りprefixに分けることはKステップの正確な分割であり、飛ばしても加算量を失わない。

## 実装上の注意

- K が repeat 前に尽きる場合を先に処理し、cycle の回数と gain の積を 64 bit で持つ。出力は residue ではなく累積キャンディ数である。

## 復習の核

- サンプル1で residue 列と実際の X を別の行に書き、同じ residue の再訪が以後の加算列まで固定することを確認する。

## 計算量と制約

### 時間

状態数N、操作回数K。cycle検出まで O(min(N,K))、検出後の商余り計算 O(1)。

### 空間

訪問時刻とprefix和 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq K \leq 10^{12}; 1 \leq A_i\leq 10^6; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/tasks/abc241_e) — source-abc241-e-problem-aa1078a5980728f8a202a2ab0dd7b8cb2f9dbbf4fda2dc2352a746e378172be4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/editorial/3472) — source-abc241-editorial-3472-223ab10f3662d986ab9f48d7c727f682d9bbc31b921499899f8366059700fd74
