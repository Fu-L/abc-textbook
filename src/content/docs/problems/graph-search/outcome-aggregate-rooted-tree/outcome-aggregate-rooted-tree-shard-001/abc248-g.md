---
title: "ABC248-G — GCD cost on the tree"
draft: true
authoringUnit: {"problemId":"abc248-g","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc248-g.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-gcd-structure"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-gcd-structure"],"sourceRevisionIds":["source-abc248-editorial-3795-269ea6ccb408c6e988b7ae7031b9bc973992e1fde9ff3336da3675b54d83c721","source-abc248-g-problem-7416fec6a03ade341465de82302f2b17ae8d257704fdf74fdf9c1adc573762b6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"cross pairのpath頂点数は親root側長と子root側長の和、gcdは両group keyのgcdである。countとlength sumの積が全pairをまとめて正確に足す。子を親基準へ移すとgcd(A_v,y)、長さ+1なのでsum+count。各pairはLCAで異方向またはroot自身として一度計上される。","sourceRevisionIds":["source-abc248-editorial-3795-269ea6ccb408c6e988b7ae7031b9bc973992e1fde9ff3336da3675b54d83c721","source-abc248-g-problem-7416fec6a03ade341465de82302f2b17ae8d257704fdf74fdf9c1adc573762b6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md) — 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

path cost は『path 上の頂点数』と『path 全体の gcd』の積であり、根から各頂点への path を gcd 値ごとに集約すれば部分木 merge で組合せられる。根 r からの path gcd は必ず A_r の約数なので、値域 10^5 全体ではなく実際に現れる少数の gcd だけを map に持てる。親側 group x と子側 group y の頂点対では path gcd が gcd(x,y)、path の頂点数が親根からの長さと子根からの長さの和になる。したがって cross 寄与は gcd(x,y)×(cnt_parent[x]·sum_child[y]+sum_parent[x]·cnt_child[y]) でまとめて加算できる。子 map を親 root r の基準へ移すと y は gcd(A_r,y) へ変わり、各 path は親子 edge 分だけ 1 長くなるので sum に cnt を加える。

採用する候補: DFS の帰りがけに子部分木を親へ merge し、根からの path gcd x ごとの頂点数 cnt[x] と path 頂点数和 sum[x] を保持する。

子をまたぐ全頂点対の gcd と path 長和を集約値同士の積で加算でき、各部分木の全 pair を列挙せずに済む。

棄却する候補: 全頂点対 s,t について path を復元し、その長さと gcd を計算する。

頂点対だけで二次個あり、N≤10^5 では path query を高速化しても全列挙できない。

各頂点を cnt[A_v]=sum[A_v]=1、部分木内答え 0 で初期化する。子の DP を受け取り、全 gcd group 対で cross pair の寄与を答えへ加えた後、子の key y を gcd(A_v,y) に写して cnt と sum+cnt を親 map へ統合する。root の答えを 998244353 で出力する。

## 典型の発動条件

### gcd 状態圧縮

発動条件: 列や path を延長するたび gcd を取るため、到達値が始点値の約数に限られるとき。

根からの path gcd ごとに cnt と長さ和をまとめ、0 件の値は保持しない。

### 木 DP の部分木 merge

発動条件: 求める pair の path が LCA 付近で異なる子/既処理部分へ分かれ、group 集約同士で cross 寄与を計算できるとき。

親の累積部分木と新しい子部分木の group 全組を掛け合わせて新規 pair を一度だけ数える。

## 問題固有の要素

cost が gcd×path 頂点数なので、gcd group ごとに個数だけでなく根からの頂点数和も持てば、cross pair の長さ総和が cnt×sum の 2 項に分離する。

別の問題へ持ち帰る視点: pair cost が『group 間で決まる係数×片側量の和』なら、各 group の count と量の総和だけで全 pair を merge できる。

## 正当性

cross pairのpath頂点数は親root側長と子root側長の和、gcdは両group keyのgcdである。countとlength sumの積が全pairをまとめて正確に足す。子を親基準へ移すとgcd(A_v,y)、長さ+1なのでsum+count。各pairはLCAで異方向またはroot自身として一度計上される。

## 実装上の注意

- 子の answer は先に加え、cross 寄与は親 map を更新する前の子 map と組ませることで各頂点対を重複なく数える。
- cnt は N、sum と積はさらに大きくなるため 64 bit を使い、乗算ごとに 998244353 で剰余を取る。

## 復習の核

- 親側 u と子側 v の path 頂点数が f(parent,u)+f(child,v) になる小さな木を描き、cross 式の 2 項と子 sum+cnt の意味を照合する。

## 計算量と制約

### 時間

O(ND log V)。二つの部分木の大きさa,bのmergeでgroup対数はmin(a,D)min(b,D)。償却のためΦ(n)=n²/2（n≤2D）、Φ(n)=D(3n−2D)/2（n>2D）と置くと、場合分けでΦ(a+b)−Φ(a)−Φ(b)≥min(a,D)min(b,D)となる。merge木上でこの差を足すと内部の項が相殺され、全group対数はO(ND)。各対のgcdにO(log V)が掛かる。ここでV=max A_i、D=max_{a≤V}τ(a)、V≤10^5ではD=128。

### 空間

全頂点group保存の安全な上界 O(ND)、子group解放で縮減可。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 2048 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq A_i\leq 10^5; 1\leq U_i<V_i\leq N; All values in input are integers.; The given graph is a tree.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/editorial/3795) — source-abc248-editorial-3795-269ea6ccb408c6e988b7ae7031b9bc973992e1fde9ff3336da3675b54d83c721
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/tasks/abc248_g) — source-abc248-g-problem-7416fec6a03ade341465de82302f2b17ae8d257704fdf74fdf9c1adc573762b6
