---
title: "ABC236-F — Spices"
draft: true
authoringUnit: {"problemId":"abc236-f","docPath":"src/content/docs/problems/mathematics/outcome-optimize-weighted-matroid-basis/outcome-optimize-weighted-matroid-basis-shard-001/abc236-f.md","learningOutcomeIds":["outcome-optimize-weighted-matroid-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-xor-linear-basis"],"excludedTopics":["matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-matroid-greedy","tag-xor-linear-basis"],"sourceRevisionIds":["source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea","source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"購入値が作るXOR集合はF₂上のspanで、全値生成はrank=Nと同値。全価格は正なので、従属な購入値を削除してもspanを保ち費用を減らせる。従って最適解はN本の基底として選べる。\n\n現在の貪欲な独立集合Gを含む最適基底Oが存在する、と帰納する。次に価格順で初めてGのspanに入らないeを選ぶ。e∈Oならそのまま。そうでなければeをOの基底で一意に表すと、係数1のf∈O\\Gが存在する。全てG内ならe∈span(G)となり矛盾するからである。fの係数が1なのでO−{f}+{e}も基底であり、Gを含む。fはGに加えて独立となる候補なので、eの選び方からprice(e)≤price(f)。交換後も最適費用を増やさず、G∪{e}を含む最適基底が残る。N回の採用後はG自身が最適基底になる。これは線形マトロイドの交換性を本問のベクトルで導いた証明である。","sourceRevisionIds":["source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea","source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [matroid greedy](src/content/docs/learn/combinatorics-algebra/matroid-greedy.md)

- 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md) — 整数をF_2 vectorとして最高bit pivotで消去し、独立性・最大XOR・表現可能性を管理する。基底をreduced formへ整えてaffine cosetの最小代表を求める方法も扱う。

## 考察

買った辛さ集合から作れる値は、その整数を N bit ベクトルと見たときの F₂ 上の線形結合、すなわち XOR span である。

1 から 2^N−1 の全辛さを作るには span が N 次元空間全体であればよく、必要なのは最小費用の線形基底である。

棄却する候補: 値段が安い N 種類のスパイスを買い、それらの XOR で全値を作れるか調べる。

安いベクトル同士が線形従属なら rank が N に届かず、全辛さを生成できない。

採用する候補: スパイスを価格昇順に見て、現在の XOR span に含まれないベクトルだけを基底へ追加する。

線形独立集合は線形マトロイドをなし、重み昇順で独立性を保つ greedy が最小重み基底を与える。

独立なベクトルを一つ追加するたびに作れる XOR の個数は 2 倍になり、N 回追加すれば 2^N 個の全ベクトルを生成できる。

辛さの XOR 合成を二元体上の線形代数へ翻訳し、価格順 Kruskal 型 greedy と XOR Gaussian elimination で最小費用基底を選ぶ。

## 典型の発動条件

### XOR 線形基底

発動条件: 選んだ整数の任意 XOR で作れる値集合や、その rank を管理するとき。

各候補を上位 bit から基底で消去し、0 にならなければ新 pivot として追加する。

### 線形マトロイドの重み付き greedy

発動条件: 最小重みでベクトル空間を張る独立集合を選びたいとき。

価格昇順に独立性を増す候補だけ採用し、rank N で停止する。

## 問題固有の要素

「全ての非零辛さを作る」という指数個の要求は、span の次元が N という一つの rank 条件に集約される。

別の問題へ持ち帰る視点: XOR で全値生成を要求されたら各値を確認せず、生成集合が部分空間であることから基底・rank を見る。

## 正当性

購入値が作るXOR集合はF₂上のspanで、全値生成はrank=Nと同値。全価格は正なので、従属な購入値を削除してもspanを保ち費用を減らせる。従って最適解はN本の基底として選べる。

現在の貪欲な独立集合Gを含む最適基底Oが存在する、と帰納する。次に価格順で初めてGのspanに入らないeを選ぶ。e∈Oならそのまま。そうでなければeをOの基底で一意に表すと、係数1のf∈O\Gが存在する。全てG内ならe∈span(G)となり矛盾するからである。fの係数が1なのでO−{f}+{e}も基底であり、Gを含む。fはGに加えて独立となる候補なので、eの選び方からprice(e)≤price(f)。交換後も最適費用を増やさず、G∪{e}を含む最適基底が残る。N回の採用後はG自身が最適基底になる。これは線形マトロイドの交換性を本問のベクトルで導いた証明である。

## 実装上の注意

- 候補は辛さ値 i と価格 c_i の組でソートし、基底へ追加できた場合だけ価格を答えへ加える。
- rank が N に達したら全辛さを生成可能であり、それ以降の従属・独立候補を見る必要はない。

## 復習の核

- 任意部分集合 XOR で全値を作る条件は、到達配列より先に F₂ 上の span と rank へ読み替える。
- 価格順 greedy の正当性は単なる直感でなく、線形独立集合の交換性を持つマトロイド基底として確認する。

## 計算量と制約

### 時間

O(2^N log(2^N)+N2^N)。価格sortと各候補の基底消去を行う。

### 空間

O(2^N+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 16; 1 \leq c_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/editorial/3287) — source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/tasks/abc236_f) — source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1
