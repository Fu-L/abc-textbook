---
title: "ABC235-EX — Painting Weighted Graph"
draft: true
authoringUnit: {"problemId":"abc235-ex","docPath":"src/content/docs/problems/graph-search/outcome-build-component-merge-tree/outcome-build-component-merge-tree-shard-001/abc235-ex.md","learningOutcomeIds":["outcome-build-component-merge-tree","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-polynomial-convolution"],"excludedTopics":["DSU merge tree・Kruskal reconstruction treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-merge-tree","tag-generating-functions","tag-convolution"],"sourceRevisionIds":["source-abc235-editorial-3250-cd5c501ff9ee547bbc0513197461dfe95bd5595c90ffe6e31f27efc8c83e342c","source-abc235-ex-problem-c8f86bd896468479c054ae82a8c0d91b851ee22cd52180f59f0be8a321f0651f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"閾値成分は重み別併合の階層をなす。子の赤集合を独立選択する積のうち全子が全赤の一項 X^m だけが親全赤と一致する。この集合の最小必要操作は m から1に下がるので ∏dp_child−X^m+X と置く。ほかの赤集合は親全体操作で作れず子独立選択の最小操作和を保つ。同重みを一つの多子併合にまとめれば存在しない中間閾値成分を混ぜない。","sourceRevisionIds":["source-abc235-editorial-3250-cd5c501ff9ee547bbc0513197461dfe95bd5595c90ffe6e31f27efc8c83e342c","source-abc235-ex-problem-c8f86bd896468479c054ae82a8c0d91b851ee22cd52180f59f0be8a321f0651f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSU merge tree・Kruskal reconstruction tree](src/content/docs/learn/tree/dsu-merge-tree.md)

- 成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- DSU merge tree・Kruskal reconstruction treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回の操作で赤くなる集合は、ある重み閾値以下の辺だけを残したグラフにおける一つの連結成分である。 辺を重み昇順に追加すると成分が階層的に併合され、同じ重みの辺で同時につながる複数成分は一つの新成分として扱う必要がある。 m 個の子成分が一つになるとき、独立選択の積に含まれる「各子全体を一回ずつ塗る」X^m は、親全体を一回で塗る同じ集合 X に置き換える。 係数 k をその集合に必要な最小操作回数と定義すれば、同じ赤集合を余分な操作回数でも作れる重複を排除できる。

棄却する候補: K 回以下の操作で選ぶ開始点と閾値の全組を列挙し、得られる赤頂点集合を重複排除する。

一操作の候補だけでも多数あり、その組合せと集合重複を扱えない。

採用する候補: 最小全域森が作る閾値連結成分の併合階層上で、各成分の赤集合を作る最小操作回数別の生成多項式を畳み込む。

任意閾値の連結成分は最小全域森で再現でき、子成分の独立選択と親全体を一操作で塗る場合を局所式で統合できる。

m 個の子成分が一つになるとき、独立選択の積に含まれる「各子全体を一回ずつ塗る」X^m は、親全体を一回で塗る同じ集合 X に置き換える。

係数 k をその集合に必要な最小操作回数と定義すれば、同じ赤集合を余分な操作回数でも作れる重複を排除できる。

Kruskal の重み別成分併合を reconstruction forest として、葉の 1＋X から親で ∏dp_child−X^m＋X を計算し、最後に森の根多項式を掛けて K 次まで合計する。

## 典型の発動条件

### Kruskal reconstruction tree

発動条件: 辺重み閾値ごとの連結成分集合が操作候補となり、その包含階層上で数え上げるとき。

同重みで連結する現在成分をまとめて親とし、閾値成分の階層を最小全域森から作る。

### 最小使用回数別の生成多項式 DP

発動条件: 独立成分の選択数を畳み込みつつ、同じ完成物を作る異なる使用回数を最小回数へ正規化したいとき。

子多項式積から全子一括選択の重複項を引き、親を一操作で選ぶ一次項へ置換する。

## 問題固有の要素

非木辺を含む元グラフでも、任意二頂点の最小 bottleneck 閾値を保つ最小全域森だけで全操作の到達集合を再現できる。

別の問題へ持ち帰る視点: 操作が重み閾値以下の連結成分を選ぶなら、全辺よりも minimax connectivity を保存する MST・MSF への圧縮を検討する。

## 正当性

閾値成分は重み別併合の階層をなす。子の赤集合を独立選択する積のうち全子が全赤の一項 X^m だけが親全赤と一致する。この集合の最小必要操作は m から1に下がるので ∏dp_child−X^m+X と置く。ほかの赤集合は親全体操作で作れず子独立選択の最小操作和を保つ。同重みを一つの多子併合にまとめれば存在しない中間閾値成分を混ぜない。

## 実装上の注意

- 同重みの辺はDSU更新前の成分間で連結塊を作り、多子併合を一つの親にする。自己ループや既に同成分の辺は新しい親を作らない。
- 葉の多項式は1+X。積はmin(K,処理済み葉数)次までの実在係数だけ掛ける。孤立頂点も最後の森の積へ含める。
- 多子併合内の逐次積には重複補正を入れず、全m子の積が済んでから−X^m+Xを一度適用する。m>Kなら減算項は打切り範囲外。
- 子のDP配列は積へ取り込んだ後に解放すれば、不要なO(NK)配列保持を避けられる。

## 復習の核

- 閾値以下辺の到達集合が操作単位なら、重み sweep で成分がどう包含されるかを木として可視化する。
- 多項式積の中で同じ完成集合を表す項がないか確認し、親全体を一回で選ぶ項との重複を最小回数へ置き換える。

## 計算量と制約

### 時間

辺のsort O(M log M)、同重みごとの成分併合O(Mα(N))に加え、多項式DP全体はO(NK)になる。各積でK次だけでなく、処理済みの葉（元頂点）の個数sでも次数を制限し、配列長をmin(K,s)+1とする。二つの塊のサイズをa,bとすると、実在係数だけを掛ける費用はO(min(K,a)min(K,b))。定数項の処理も含めて同じ上界である。

多子併合と最後の森の根の積を、解析のため葉集合を二分併合する木に展開する。この二分併合は積の計算順に過ぎず、中間塊へ−X²+Xを適用してはならない。費用を三つに分ける。

- a,b<K：一つの部分木内ではΣabが異なる葉対の個数以下になる。小塊同士を併合して初めてK以上になる塊は2K未満で、互いに葉集合が交わらない。この塊内の総費用はO(塊サイズ·K)。最後までK未満の塊も同様なので、合計O(NK)。
- 一方だけK未満：小塊サイズをbとすればO(Kb)。その小塊の各葉はこの段で初めて大塊に入るので、一葉あたり高々一度課金され、合計O(NK)。
- 両方K以上：K以上の塊が最初にできる箇所は互いに素なK頂点以上の葉集合なので高々N/K個。その大塊同士を併合する回数はO(N/K)、各回O(K²)で合計O(NK)。

従って全体O(M log M+Mα(N)+NK)。最大N=10^5,K=500ではNKは5×10^7の規模で、各辺追加を一律K²回と数える上界より大幅に小さい。

### 空間

復元森と辺 O(N+M)、全ノードの打切り DP を保存する場合 O(NK)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 0 \leq M \leq 10^5; 1 \leq K \leq 500; 1 \leq A_i,B_i \leq N; 1 \leq C_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/editorial/3250) — source-abc235-editorial-3250-cd5c501ff9ee547bbc0513197461dfe95bd5595c90ffe6e31f27efc8c83e342c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/tasks/abc235_h) — source-abc235-ex-problem-c8f86bd896468479c054ae82a8c0d91b851ee22cd52180f59f0be8a321f0651f
