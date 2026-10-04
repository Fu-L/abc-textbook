---
title: "ABC409-E — Pair Annihilation"
draft: true
authoringUnit: {"problemId":"abc409-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc409-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc409-e-problem-a96c7b6c7aa0834cfa6b5144034c339f6e4eaf5c0da3e12bcc0015b52bcc1502","source-abc409-editorial-13202-d5393c36f73ea44afaa45a10186dc2939b238a33d6a9064ed96d17f5e12ff06d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"辺を切った子側の符号付き電荷 X は内部消滅で不変なので、全消滅には少なくとも |X| 粒子がその辺を通る。postorder で余剰を親へ送ると必要量ちょうど通り、各辺の費用下界 |X|w を同時達成する。総電荷0より根でも全消滅する。","sourceRevisionIds":["source-abc409-e-problem-a96c7b6c7aa0834cfa6b5144034c339f6e4eaf5c0da3e12bcc0015b52bcc1502","source-abc409-editorial-13202-d5393c36f73ea44afaa45a10186dc2939b238a33d6a9064ed96d17f5e12ff06d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

辺 e の子側部分木にある電荷総和 X_e は、その部分木内だけで消滅させても符号付きで X_e だけ余る。全消滅には少なくとも |X_e| 個の粒子が境界辺を通る。 木では子側部分木と外部を結ぶ辺が e 一本だけなので、各辺の必要通過量は独立に下界 |X_e| と定まり、葉から余剰を親へ送れば全下界を同時達成できる。 部分木内でどのように annihilate しても正負の差 X_e は保存されるため、辺を横切る必要量は粒子の個別対応によらない。 各辺の寄与は通過個数×w_e で、postorder に子の余剰を親へ一度だけ運ぶと全辺で必要量ぴったりを実現する。

採用する候補: 木を根付き化して postorder で subtree の符号付き粒子和を集計し、各親辺へ |subtreeSum|×weight を加える

正なら陽電子、負なら電子の余剰を親へ送る構成が存在し、根では全体和0により余剰が消えるため、この cut 下界が最適値そのものになる。

棄却する候補: 各陽電子と電子の pair ごとに最短距離を求めて近い順に対応付ける

粒子数が大きく pair を列挙できず、局所的に近い対応は共通辺の流量を考慮した global optimum を保証しない。

部分木内でどのように annihilate しても正負の差 X_e は保存されるため、辺を横切る必要量は粒子の個別対応によらない。

各辺の寄与は通過個数×w_e で、postorder に子の余剰を親へ一度だけ運ぶと全辺で必要量ぴったりを実現する。

頂点1を根に DFS し、sub[v]=x_v+Σsub[child] を postorder で求める。子 v と親を結ぶ辺重み w について ans+=|sub[v]|w とし、sub[v] を親へ加える。最終 sub[root]=0 を確認して ans を出力する。

## 典型の発動条件

### tree cut の保存量

発動条件: 木上で正負の量を移動・相殺し、辺ごとの最小輸送量を求めるとき。

各親辺が作る cut 内の総量から不可避な crossing flow を決める。

### subtree sum

発動条件: 各 edge cut の片側にある符号付き量を全辺について求めたいとき。

postorder DFS で子の総和を親へ集約する。

## 問題固有の要素

粒子の対応関係を決めなくても、木の各 cut を横切る net imbalance が唯一の必要輸送量を決定する。

別の問題へ持ち帰る視点: 木上輸送では source-sink pairing より先に subtree imbalance を計算すると、各辺の最適 flow が直接得られる。

## 正当性

辺を切った子側の符号付き電荷 X は内部消滅で不変なので、全消滅には少なくとも |X| 粒子がその辺を通る。postorder で余剰を親へ送ると必要量ちょうど通り、各辺の費用下界 |X|w を同時達成する。総電荷0より根でも全消滅する。

## 実装上の注意

- |sub[v]|w は 64 bit を使う。再帰深さ N の対策を行い、abs を符号付き十分幅の型で計算する。全 x の和0という保証も最終 root 値で確認できる。

## 復習の核

- 一辺だけ、重み0、正負が同じ部分木内で相殺する例、chain の両端に大量粒子がある例を明示的な輸送と比較する。

## 計算量と制約

### 時間

N 頂点に対して O(N)。

### 空間

木、部分木電荷和で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; |x_i| \leq 10^4; \sum_{i=1}^N x_i = 0; 1 \leq u_j < v_j \leq N; 0 \leq w_j \leq 10^4; The given graph is a tree.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/tasks/abc409_e) — source-abc409-e-problem-a96c7b6c7aa0834cfa6b5144034c339f6e4eaf5c0da3e12bcc0015b52bcc1502
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/editorial/13202) — source-abc409-editorial-13202-d5393c36f73ea44afaa45a10186dc2939b238a33d6a9064ed96d17f5e12ff06d
