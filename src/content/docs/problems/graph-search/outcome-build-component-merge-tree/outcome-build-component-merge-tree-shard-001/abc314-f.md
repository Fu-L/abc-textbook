---
title: "ABC314-F — A Certain Game"
draft: true
authoringUnit: {"problemId":"abc314-f","docPath":"src/content/docs/problems/graph-search/outcome-build-component-merge-tree/outcome-build-component-merge-tree-shard-001/abc314-f.md","learningOutcomeIds":["outcome-build-component-merge-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dsu-components","unit-modular-arithmetic","unit-rooted-tree-aggregation"],"excludedTopics":["DSU merge tree・Kruskal reconstruction treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-merge-tree","tag-contribution-reordering","tag-dsu-components","tag-modular-arithmetic","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc314-editorial-6953-8d9d67c157a5e69183696230ba93d5758a1bae268d9ba90467dd588d2fe445bc","source-abc314-f-problem-555f054e48f0e643e9d3821fa7a3fd0357becc1b01b7f97210133d00bf3e3618"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"期待勝利数は参加試合の勝率の和。サイズ a,b の試合に参加した子チーム全選手は同じ勝率 a/(a+b) または b/(a+b) を得るので統合木の対応辺へ加える。根から葉の path はその選手の参加試合をちょうど一度含み、線形性により試合間独立性なしに正しい期待値になる。","sourceRevisionIds":["source-abc314-editorial-6953-8d9d67c157a5e69183696230ba93d5758a1bae268d9ba90467dd588d2fe445bc","source-abc314-f-problem-555f054e48f0e643e9d3821fa7a3fd0357becc1b01b7f97210133d00bf3e3618"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSU merge tree・Kruskal reconstruction tree](src/content/docs/learn/tree/dsu-merge-tree.md)

- 成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

## 考察

試合ごとに二チームは一つへ統合され二度と分裂しないので、統合履歴は葉が選手、内部節点が試合の二分木になる。選手 i の期待勝利数は、所属チームが参加する各試合の勝率の和であり、期待値の線形性により試合間の勝敗依存を追う必要がない。サイズ a,b の統合節点から各子への辺に a/(a+b), b/(a+b) を置くと、その subtree の全葉が当該試合で得る期待寄与を表す。最終チームに対応する根から選手葉までの辺和は、その選手が参加した試合を過不足なく一つずつ含む。

採用する候補: Union-Find で各時点のチーム代表を追い、統合木を作って根から辺勝率の prefix 和を葉へ配る。

各試合の勝率をその子チーム全員へ一括加算する操作が、統合木の一辺重みとして表現され全体 O(N α(N)) になる。

棄却する候補: 試合ごとに両チームの全メンバーを列挙し、それぞれの期待値へ勝率を加える。

偏った統合順では同じ大チームを何度も走査して Θ(N²) になる。

最初の N 葉を各一人チームとする。各試合で p,q の DSU representative に対応する現チーム節点 u,v を得て、新節点 w を作り u,v を子にし、辺重み size(u)/(size(u)+size(v)) 等を設定して union する。最後の根から DFS し累積辺和を各葉へ出力する。

## 典型の発動条件

### merge tree（統合木）

発動条件: 集合が時系列に二つずつ不可逆に併合され、各併合の寄与を当時の全要素へ与えるとき。

併合を内部節点として記録し、要素ごとの履歴を根葉 path に変換する。

### 期待値の線形性

発動条件: 複数試行の勝利回数の期待値を求め、試行結果に依存があるとき。

各試合の勝利 indicator の期待値を個別に足し、同時分布を追わない。

## 問題固有の要素

勝ったチームだけが残るのではなく試合後は必ず両者が統合されるため、勝敗は将来の所属に影響せず期待寄与だけを足せる。

別の問題へ持ち帰る視点: 確率イベントが構造更新に影響するかを確認し、影響しないなら履歴木と線形性で分離する。

## 正当性

期待勝利数は参加試合の勝率の和。サイズ a,b の試合に参加した子チーム全選手は同じ勝率 a/(a+b) または b/(a+b) を得るので統合木の対応辺へ加える。根から葉の path はその選手の参加試合をちょうど一度含み、線形性により試合間独立性なしに正しい期待値になる。

## 実装上の注意

- DSU representative と統合木節点番号を別に管理する。勝率分母は統合前サイズ和で、mod 998244353 の逆元を使う。

## 復習の核

- 併合履歴を小例で木にし、葉から根までにどの試合が並ぶか確認する。勝率を勝者確率ではなく、その子チーム全員の期待加算と捉える。

## 計算量と制約

### 時間

N 選手、N−1 試合。DSU と統合木で O(Nα(N))、逆元を各回高速冪で求める場合 O(N log p)、p=998244353。逆元表なら O(N)。

### 空間

N葉とN−1内部節点、DSUで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq p_i, q_i \leq N; Just before the i-th match, player p_i and player q_i belong to different teams.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/editorial/6953) — source-abc314-editorial-6953-8d9d67c157a5e69183696230ba93d5758a1bae268d9ba90467dd588d2fe445bc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/tasks/abc314_f) — source-abc314-f-problem-555f054e48f0e643e9d3821fa7a3fd0357becc1b01b7f97210133d00bf3e3618
