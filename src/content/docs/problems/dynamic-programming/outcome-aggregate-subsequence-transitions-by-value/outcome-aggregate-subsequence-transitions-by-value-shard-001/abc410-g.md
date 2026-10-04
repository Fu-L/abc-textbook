---
title: "ABC410-G — Longest Chord Chain"
draft: true
authoringUnit: {"problemId":"abc410-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-aggregate-subsequence-transitions-by-value/outcome-aggregate-subsequence-transitions-by-value-shard-001/abc410-g.md","learningOutcomeIds":["outcome-aggregate-subsequence-transitions-by-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence","unit-event-sweep","unit-geometry-primitives","unit-range-monoid-aggregation"],"excludedTopics":["値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-value-range-dp","tag-event-sweep","tag-geometry-orientation-transform","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc410-editorial-13206-e2fbdc9a39a7edd04e902742f5f6bd3566f61c63a1fceb56b9d1afdb1158bc5f","source-abc410-g-problem-3028d18c1c027682e0605916145d5cdb51cd071d32e88766adf40142fdc4f9c4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"追加弦の両端で円を二つの弧へ分けると、交わる各残存弦は各弧に一端ずつ持つ。残存弦同士が交差しない条件は、一方の弧での順序と他方での逆順序である。固定cutで区間化すると、この列は一つの入れ子 chain、または空間的に分離した二つの入れ子 chain に分かれる。R昇順の dp[L]=1+max_{x>L}dp[x] は真に内側の弦だけを延長し、全 chain を網羅する。prefixとRより右のchainを組み合わせる全境界を試すため円周上の切断位置依存も取りこぼさない。","sourceRevisionIds":["source-abc410-editorial-13206-e2fbdc9a39a7edd04e902742f5f6bd3566f61c63a1fceb56b9d1afdb1158bc5f","source-abc410-g-problem-3028d18c1c027682e0605916145d5cdb51cd071d32e88766adf40142fdc4f9c4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [値域集約による部分列DP](src/content/docs/learn/dynamic-programming/dp-value-range.md)

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

残す弦は互いに交差しないので、最終的な交点は追加弦と残存弦の間だけに生じる。追加弦と交わる残存弦は、円周上で一本の入れ子列として並ぶ形に正規化できる。 円を点1で切って各弦を区間 [L_i,R_i] と見ると、選択可能集合は一つの入れ子 chain、またはある切断座標 X の左右に完全に分かれた二つの入れ子 chain に一致する。 R が昇順の二区間 I_a,I_b で I_a⊂I_b となる条件は L_a>L_b なので、入れ子最大数は L 列の最長狭義減少部分列になる。 左右二 chain の分割座標は任意実数を試さず R_i だけでよい。R_i≤X の区間集合は区間内で一定で、X を直前の R_i へ戻すと右側候補を減らさない。

採用する候補: R_i 昇順に区間を処理し、L_i の最長減少部分列 DP と segment tree で、一 chain と左右二 chain の最大を求める

prefix の最大 nesting 長と、全区間 DP のうち L>X の最大を各 X=R_i で足せば二 chain case を網羅し、全体 O(N log N) になる。

棄却する候補: 元の弦交差 graph を作り、非交差集合とそれら全てを横切る追加弦を直接探索する

交差辺は O(N^2) あり得て、一般の独立集合として扱うと円周順序が与える入れ子構造を失う。

R が昇順の二区間 I_a,I_b で I_a⊂I_b となる条件は L_a>L_b なので、入れ子最大数は L 列の最長狭義減少部分列になる。

左右二 chain の分割座標は任意実数を試さず R_i だけでよい。R_i≤X の区間集合は区間内で一定で、X を直前の R_i へ戻すと右側候補を減らさない。

各弦を L=min(A,B),R=max(A,B) として R 昇順に sort する。segment tree で dp[L]=1+max_{x>L}dp[x] を更新し、各 prefix の全体最大 pref[i] を保存する。完成した dp から suffix range max max_{x>R_i}dp[x] を取り、単一 chain 最大と max_i(pref[i]+suffix(R_i+1)) の最大を答える。

## 典型の発動条件

### 区間包含と最長減少部分列

発動条件: 右端順に並べた区間から最長の strict nesting chain を選ぶとき。

左端が狭義減少する subsequence として segment tree DP を行う。

### 分割点 sweep

発動条件: 互いに素な左右領域から独立な最適構造を一つずつ選ぶとき。

候補 X を右端座標へ離散化し、左 prefix 最適と右側 endpoint 条件の最適を足す。

### 幾何配置の区間化

発動条件: 円周上の非交差弦と一本の transversal の関係を扱うとき。

円を切って端点順を区間の包含または左右分離へ翻訳する。

## 問題固有の要素

追加弦と交わる非交差弦の端点順は往路で外向き、復路で逆向きになるため、切断点をまたぐか否かだけで一 chain／二 chain に分類できる。

別の問題へ持ち帰る視点: 円環の対象を直線へ切ると解が境界をまたぐ場合があるため、単一構造に加えて左右二構造の合成を調べる。

## 正当性

追加弦の両端で円を二つの弧へ分けると、交わる各残存弦は各弧に一端ずつ持つ。残存弦同士が交差しない条件は、一方の弧での順序と他方での逆順序である。固定cutで区間化すると、この列は一つの入れ子 chain、または空間的に分離した二つの入れ子 chain に分かれる。R昇順の dp[L]=1+max_{x>L}dp[x] は真に内側の弦だけを延長し、全 chain を網羅する。prefixとRより右のchainを組み合わせる全境界を試すため円周上の切断位置依存も取りこぼさない。

## 実装上の注意

- 全端点は相異なるが各弦で L<R に正規化する。range max の strict 条件 x>L と x>R_i、prefix に含める index を統一し、空側は0として扱う。

## 復習の核

- 全弦が一重入れ子、二つの離れた入れ子群、元から交差する弦群、N=1 を小さい subset と追加端点区間の全探索で比較する。

## 計算量と制約

### 時間

弦 N、端点2N。sortと二回のrange maxで O(N log N)。

### 空間

弦、prefix最大、treeで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq A_i,B_i \leq 2N; The 2N values A_1, \ldots, A_N,B_1,\ldots,B_N are pairwise distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/editorial/13206) — source-abc410-editorial-13206-e2fbdc9a39a7edd04e902742f5f6bd3566f61c63a1fceb56b9d1afdb1158bc5f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/tasks/abc410_g) — source-abc410-g-problem-3028d18c1c027682e0605916145d5cdb51cd071d32e88766adf40142fdc4f9c4
