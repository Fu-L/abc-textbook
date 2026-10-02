---
title: "ABC247-F — Cards"
draft: true
authoringUnit: {"problemId":"abc247-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc247-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d","source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"P,Qがともにpermutationなので各数字の次数は2で、成分はcycleに限る。一数字を覆う条件は、その両側のカードの少なくとも一枚を選ぶことに等しい。したがって各cycleで隣接する二辺を同時に未選択にしない二値円環列を数えればよい。先頭辺の選否を固定したpath DPで末尾との条件まで検査するため漏れも重複もなく、別成分の選択は独立なので個数の積が答えになる。","sourceRevisionIds":["source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d","source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(1,2,3),Q=(2,3,1)。","procedure":["三カードの端点はcycle1-2-3-1。","二辺選択三通りと三辺全選択一通りが全頂点を覆う。"],"executionTarget":null,"expectedResult":"被覆部分集合4通り。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":[],"attainmentCondition":"成分size1のloopを未選択にできるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"唯一の頂点を覆えないので選択必須でg(1)=1。通常path初期値2とは分ける。"},"answer":{"reasoningOrVerification":"唯一の頂点を覆えないので選択必須でg(1)=1。通常path初期値2とは分ける。","procedure":["具体例の各状態・寄与を再計算する。","唯一の頂点を覆えないので選択必須でg(1)=1。通常path初期値2とは分ける。"],"expectedResult":"唯一の頂点を覆えないので選択必須でg(1)=1。通常path初期値2とは分ける。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

数 1,…,N を頂点、card i を P_i と Q_i を結ぶ辺とみなすと、全数を少なくとも 1 回出す条件は、選んだ辺が全頂点を被覆することになる。

P,Q がともに permutation なので各頂点には front 側と back 側から計 2 回接続し、loop や平行辺も許した 2-正則 graph、すなわち cycle 成分の集合になる。

採用する候補: 各 cycle 成分の頂点数 m を求め、cycle の辺被覆数 g(m) を Fibonacci 型漸化式で前計算して成分ごとに掛ける。

辺被覆条件が連結成分間で独立し、各成分はサイズだけで同じ円環二値列の数え上げになる。

棄却する候補: N 枚の card subset を全列挙し、全ての数が現れるかを検査する。

候補が 2^N 個あり、N≤2×10^5 では列挙できない。

cycle 上で辺を選ぶ/選ばないを二値化すると、各頂点を覆う条件は隣接する 2 辺を同時に非選択にしない条件である。

path 版 f(1)=2,f(2)=3,f(m)=f(m-1)+f(m-2) を使えば cycle 版は端の扱いを分けて求まり、g(1)=1,g(2)=3,g(3)=4 となる。

DSU または traversal で graph の連結成分サイズを集計する。N まで f と cycle 辺被覆数 g を前計算し、各成分の g(size) を 998244353 で乗算する。

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

P,Qがともにpermutationなので各数字の次数は2で、成分はcycleに限る。一数字を覆う条件は、その両側のカードの少なくとも一枚を選ぶことに等しい。したがって各cycleで隣接する二辺を同時に未選択にしない二値円環列を数えればよい。先頭辺の選否を固定したpath DPで末尾との条件まで検査するため漏れも重複もなく、別成分の選択は独立なので個数の積が答えになる。

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

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(1,2,3),Q=(2,3,1)。

1. 三カードの端点はcycle1-2-3-1。
2. 二辺選択三通りと三辺全選択一通りが全頂点を覆う。

期待される結果: 被覆部分集合4通り。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

成分size1のloopを未選択にできるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

唯一の頂点を覆えないので選択必須でg(1)=1。通常path初期値2とは分ける。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/editorial/3719) — source-abc247-editorial-3719-54138435ddf75ce1e266312ac9adac85c77b1d83ba47f10c0d4b6ef028c5ee2d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/tasks/abc247_f) — source-abc247-f-problem-fce172e6e3b8c3b51cb8547dab42e6e9cede6b4a3842957bc2f78815827cb01e
