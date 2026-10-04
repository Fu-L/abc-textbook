---
title: "ABC445-G — Knight Placement"
draft: true
authoringUnit: {"problemId":"abc445-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc445-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-gcd-structure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-bipartite-structure","tag-gcd-structure"],"sourceRevisionIds":["source-abc445-editorial-15902-8856e84e6a547dd61f4e0a419708c4280d1730b3a37b6e43542e2f2eb7223394","source-abc445-g-problem-2d7ebb0233bada43b7bf2f02427ca84c69b3f52392ce63ba9c82c383b8de1d5a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"gcd blockの移動量を互いに素へ割る。両奇なら行block parity、一方奇なら行列和parityが全attack edgeで反転し二部性を示す。非攻撃配置は独立集合で、二部graphの最小cover=最大matchingだから最大独立数V−μ。","sourceRevisionIds":["source-abc445-editorial-15902-8856e84e6a547dd61f4e0a419708c4280d1730b3a37b6e43542e2f2eb7223394","source-abc445-g-problem-2d7ebb0233bada43b7bf2f02427ca84c69b3f52392ce63ba9c82c383b8de1d5a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。
- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md) — 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

同時配置できない二マスを辺で結ぶと、求める配置は障害物を除いたマス graph の最大独立集合である。移動量 (±A,±B),(±B,±A) に応じた特別な二色塗りで graph は二部になる。gcd block へ縮約した後、A/g,B/g が両方奇数なら行 block parity、一方だけ奇数なら行列 block 和 parity で攻撃辺の色が反転する。最大 matching は最小頂点被覆と同サイズなので、その補集合が最大独立集合を与える。

採用する候補: g=gcd(A,B) の block と A/g,B/g の parity から各空きマスを二色化し、攻撃辺を張って最大 matching を flow で求め、空きマス数から引く。

示した色分けでは全攻撃辺が異色間だけに存在し、二部 graph の最大独立集合サイズは König の定理により |V|-最大 matching となる。

棄却する候補: 空きマスごとに置く・置かないを全探索し、攻撃し合わない最大集合を探す。

一般の独立集合列挙は頂点数に対して指数時間で、盤面サイズの制約に対応できない。

障害物でないマスを頂点化し、公式の parity 規則で左右部へ分ける。左部から有効な knight 移動先へ容量1辺を張り、source/left と right/sink も容量1で Dinic 等を実行し、空き数-flow を答える。

## 典型の発動条件

### 二部 graph の最大独立集合

発動条件: 競合関係 graph を二色化でき、同時選択数を最大化したいとき。

最大 matching を flow で求めて頂点数から引く。

### gcd・parity による特殊彩色

発動条件: 格子上の一定変位辺を二部化したいとき。

共通尺度で block 化し、縮約変位の parity から色を定める。

## 問題固有の要素

通常の市松模様で二部にならない移動でも、gcd block と変位 parity を見直すと適切な二色塗りが得られる。

別の問題へ持ち帰る視点: 配置最大化は競合 graph の独立集合へ翻訳し、二部性が証明できれば matching へ落とす。

## 正当性

gcd blockの移動量を互いに素へ割る。両奇なら行block parity、一方奇なら行列和parityが全attack edgeで反転し二部性を示す。非攻撃配置は独立集合で、二部graphの最小cover=最大matchingだから最大独立数V−μ。

## 実装上の注意

- A=B や0を含む移動で同じ辺を重複生成しても正しさを崩さないよう整理し、障害マスと盤外を除く。

## 復習の核

- A/g,B/g の parity 二ケースで全許容変位が色を反転することを式で示してから、König の定理へ接続する。

## 計算量と制約

### 時間

空cell数V、許容攻撃辺E≤8V。特殊parity二色化O(V)、Hopcroft–Karp O(E√V)=O(V√V)。

### 空間

盤面、攻撃graph O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 300; 0 \le A \le B \le N; 1 \le B; N,A,B are integers.; S_i is a string of length N consisting of . and # (1 \le i \le N).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/editorial/15902) — source-abc445-editorial-15902-8856e84e6a547dd61f4e0a419708c4280d1730b3a37b6e43542e2f2eb7223394
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc445/tasks/abc445_g) — source-abc445-g-problem-2d7ebb0233bada43b7bf2f02427ca84c69b3f52392ce63ba9c82c383b8de1d5a
