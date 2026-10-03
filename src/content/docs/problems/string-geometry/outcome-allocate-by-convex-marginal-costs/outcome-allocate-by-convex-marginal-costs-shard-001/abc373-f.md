---
title: "ABC373-F — Knapsack with Diminishing Values"
draft: true
authoringUnit: {"problemId":"abc373-f","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc373-f.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-dp-subset-resource","unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-greedy-exchange-order","tag-knapsack-resource","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc373-editorial-11027-c6c0619121e108fd210ffb428ef6ed0ca00886e85025e203d1dbacdcb60e9bef","source-abc373-f-problem-348bb5a78629c2632be75b5dcdad18b3f4b3bf80e5f231fa2738edf23e5338bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"種類iのk個価値kv−k²はv−1,v−3,…のprefix和。各同重さ群の全限界列から上位kを取ると後項だけ先に採らないので実現可能で、そのk個の価値最大を与える。容量増分kwが固定なので種類差はf_w(k)へ吸収できる。重さ群のDPは全群個数の分配を一度比較し、容量以下の全jの最大が全品物選択の最適値になる。非正の限界項を除けば重さを減らし価値を下げないため、それ以降の個数を省いても最終最大は変わらない。","sourceRevisionIds":["source-abc373-editorial-11027-c6c0619121e108fd210ffb428ef6ed0ca00886e85025e203d1dbacdcb60e9bef","source-abc373-f-problem-348bb5a78629c2632be75b5dcdad18b3f4b3bf80e5f231fa2738edf23e5338bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ品物を k 個選ぶ価値 kv-k^2 は、1個目から順に v-1,v-3,v-5,…という限界利得の和である。同じ重さの品物群では、限界利得の大きい順に取れば個数 k ごとの最適値が得られる。

採用する候補: 重さ w ごとに priority queue で限界利得を取り出して f_w(k) を作り、容量 j と選択個数 k の grouped knapsack 遷移を行う。

重さ別に選択個数だけへ圧縮でき、遷移総量 ΣW^2/w=O(W^2 log W) が W≤3000 に収まる。

棄却する候補: 品物種類ごとに選ぶ個数を 0..W/w まで試す多重ナップサックを行う。

N 個の各種類で容量と個数を走査すると O(NW^2) 級になり、価値逓減の共通構造を利用できない。

各種類の次の一個の利得は2ずつ減るので、複数の降順列を priority queue で merge するだけで重さ w の最良 k 個が分かる。

重さ w の品物を k 個取ると容量増分は必ず kw であり、種類の区別は f_w(k) の中へ吸収できる。

各wについて価値vの初期限界利得v−1をheapに入れ、最大を取って2減らして戻し、f_w(0)=0からk=1,…,floor(W/w)のprefix和を作る。品物がない重さ群はskipする。dp[j]は重さちょうどjの最大価値で、dp[0]=0、他は−∞。重さ群ごとに next[j]=max_{0≤kw≤j}(dp[j−kw]+f_w(k)) を旧配列から計算し、最後はmax_{0≤j≤W}dp[j]を出す。

容量を全て埋める義務はないので、最大の次利得が非正になった後のkは最終最大値へ不要である。省略する場合もk=0を必ず残す。負の値までf_wへ入れ、exact重さ表を作り切る実装も正しいが、答えをdp[W]だけにしてはならない。

## 典型の発動条件

### 離散限界利得の貪欲

発動条件: 同一選択肢を繰り返す価値が凹で、次の一個の利得が単調減少するとき。

全候補の次利得を heap で比較して個数別最適値を作る。

### 重さ別 grouped knapsack

発動条件: 容量が小さく、同じ重さの品物群を個数別価値へまとめられるとき。

重さごとに f_w(k) を用いて DP を一括遷移する。

## 問題固有の要素

二次式の総価値は差分を取ると等差数列になり、凹資源配分の貪欲へ変わる。

別の問題へ持ち帰る視点: 種類数 N ではなく異なる重さ W を外側に置くことで調和級数の計算量を得る。

## 正当性

種類iのk個価値kv−k²はv−1,v−3,…のprefix和。各同重さ群の全限界列から上位kを取ると後項だけ先に採らないので実現可能で、そのk個の価値最大を与える。容量増分kwが固定なので種類差はf_w(k)へ吸収できる。重さ群のDPは全群個数の分配を一度比較し、容量以下の全jの最大が全品物選択の最適値になる。非正の限界項を除けば重さを減らし価値を下げないため、それ以降の個数を省いても最終最大は変わらない。

## 実装上の注意

- 重さはW以下でよく、負の限界利得で容量を埋める必要はない。exact重さDPの最終値は全j≤Wの最大とし、未到達を−∞で区別する。旧配列から重さ群を一度だけ追加し、価値は64bit整数で扱う。

## 復習の核

- kv-k^2 を差分列へ展開し、heap が「各種類から次に一個取る」選択を正確に表すことを確認する。

## 計算量と制約

### 時間

O(W² log W+N log N)を上界とする。各重さwで⌊W/w⌋利得をheap mergeし、容量と個数を列挙する。

### 空間

O(N+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3000; 1 \leq W \leq 3000; 1 \leq w_i \leq W; 1 \leq v_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/editorial/11027) — source-abc373-editorial-11027-c6c0619121e108fd210ffb428ef6ed0ca00886e85025e203d1dbacdcb60e9bef
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/tasks/abc373_f) — source-abc373-f-problem-348bb5a78629c2632be75b5dcdad18b3f4b3bf80e5f231fa2738edf23e5338bf
