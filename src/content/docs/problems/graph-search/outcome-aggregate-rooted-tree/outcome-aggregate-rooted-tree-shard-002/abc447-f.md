---
title: "ABC447-F — Centipede Graph"
draft: true
authoringUnit: {"problemId":"abc447-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc447-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e","source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"背骨内部には背骨二辺と脚二辺、端点には背骨一辺と脚二辺が要るので元木次数4/3条件となる。木では別背骨点の脚が衝突しない。背骨を最高点で分けると高々二つの子pathとなり、延長と上位二本結合で全候補を覆える。x=1 の単点背骨の脚条件は別に検査する。","sourceRevisionIds":["source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e","source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さ x のムカデ graph を木が含むことは、端点の元木次数が3以上、内部頂点の次数が4以上である長さ x の単純 path を含むことと同値である。 deg(v)≥4 なら子 path を延長でき、deg(v)=3 なら端点として長さ1を開始できるが内部にはなれず、deg(v)≤2 は使えない。 v を path の内部最高点にする場合は、異なる二子から来る dp の上位二本を v で結ぶ。

採用する候補: 木を根付き化し、dp[v] を部分木内で v を端とする次数条件付き path の最大長として、子の上位値から一本延長または v で二本結合して答えを更新する。

木上の任意の path は最高点で二つの子方向 path に一意に分かれ、頂点次数に応じて開始・延長可能性が局所的に決まるため postorder DP で全候補を覆える。

棄却する候補: 全頂点 pair の単純 path を列挙し、各 path の次数列を検査する。

pair が Θ(N^2) 個あり、path 検査まで行うと線形・二乗制約に収まらない。

deg(v)≥4 なら子 path を延長でき、deg(v)=3 なら端点として長さ1を開始できるが内部にはなれず、deg(v)≤2 は使えない。

v を path の内部最高点にする場合は、異なる二子から来る dp の上位二本を v で結ぶ。

親を除いた子を postorder で処理し、その dp 上位二つを取る。次数3なら dp[v]=1、次数4以上なら dp[v]=1+max child dp とし、端点ケースと二本結合ケースで最大長を更新する。x=1の基底も扱う。

## 典型の発動条件

### 木上の次数制約 path DP

発動条件: path の端点と内部で異なる局所条件があり、最大長を求めるとき。

頂点を端とする最良一本と、頂点で結ぶ上位二本を計算する。

## 問題固有の要素

求める部分木の枝を除くと中心 spine の path と元木次数下限だけが残り、特殊 graph 検出が path DP になる。

別の問題へ持ち帰る視点: 木の最大 path 問題では、親へ渡す一本の状態と、その場で完結する二本結合の答えを分ける。

## 正当性

背骨内部には背骨二辺と脚二辺、端点には背骨一辺と脚二辺が要るので元木次数4/3条件となる。木では別背骨点の脚が衝突しない。背骨を最高点で分けると高々二つの子pathとなり、延長と上位二本結合で全候補を覆える。x=1 の単点背骨の脚条件は別に検査する。

## 実装上の注意

- 問題の path 長は辺数ではなく頂点数である。root の親除外後子数ではなく元木の degree で3・4条件を判定する。

## 復習の核

- ムカデの脚を消した spine と元木次数の対応を導き、deg=3 が開始のみ、deg≥4 が延長可能となる遷移を図示する。

## 計算量と制約

### 時間

N 頂点、子上位二本を走査保持して O(N)。

### 空間

木、頂点 DP で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le Q; 3 \le N \le 2 \times 10^5; 1 \le A_i, B_i \le N; The given graph is a tree.; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/editorial/16458) — source-abc447-editorial-16458-cc8202a42fd8a8e168d6e0a40a0c6b481b5a43ceb67302805d03f285b5a78d1e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/tasks/abc447_f) — source-abc447-f-problem-b82e4de98e75c38cc3a5431dacc8918dd5c39e05ce67f2bd72d7523b2724acca
