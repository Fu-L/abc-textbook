---
title: "ABC269-G — Reversible Cards 2"
draft: true
authoringUnit: {"problemId":"abc269-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc269-g.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc269-editorial-4841-ed4eb6b9855fed47f17aa20ed3e7bdd909ec1215e1c635d33bbf024aaf06cb84","source-abc269-g-problem-a524766a4a3ef17cfa192e1df01517dc22fee40a0a8df100de4d6eacb36a8e88"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"表面総和を基準に、カードiの反転を差δ_i=B_i−A_iと費用1の0/1選択にする。同じ差のc枚を大きさ1,2,4,…と残りへ分けると、0..cの全枚数をgroupのsubsetとして表せる。大きさsのgroupを差sδ・費用sのitemにすれば、元の選択と実現する和・費用の最小値が一致する。よって各groupを一回ずつ0/1最小化DPへ入れると、全カードの最少反転数が求まる。groupの絶対差総和はΣ|δ_i|≤Mである。閾値T以下のpower-of-two group数はΣ_j O(T/2^j)=O(T)、残りgroupも差種類ごとに一つでO(T)、T超のgroupはO(M/T)個なので、T=√Mで全group数O(√M)となる。","sourceRevisionIds":["source-abc269-editorial-4841-ed4eb6b9855fed47f17aa20ed3e7bdd909ec1215e1c635d33bbf024aaf06cb84","source-abc269-g-problem-a524766a4a3ef17cfa192e1df01517dc22fee40a0a8df100de4d6eacb36a8e88"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

front-side sum S_Aからcard iをflipするとvisible sumはC_i=B_i−A_iだけ変わるため、各targetは差分のsubset sumで表せる。

Σ|C_i|≤Σ(A_i+B_i)=Mなので、非零な異なる差分値の種類数と、そのmultiplicityをbinary decompositionした総group数はO(√M)に抑えられる。

棄却する候補: cardを一枚ずつ処理するminimum-card subset-sum DPを行う。

状態幅O(M)の遷移をN回行うためO(NM)となる。

採用する候補: 同じCのcardsをまとめ、個数をpowers of twoとremainderへ分割して0/1 knapsack itemsに変換する。

0からmultiplicityまでの任意個数をgroup subsetで表せ、全group数O(√M)に対するDPでO(N+M√M)となる。

multiplicity nを1,2,4,…と残余へ分ければ、0,…,nの全個数をgroup sizesのsubset sumとして表現できる。

size sのgroupは差分sC、flip cost sの一つの0/1 itemなので、DP値を選択枚数の最小値としてそのまま更新できる。

equal flip deltasをfrequency compressionし、binary-split bounded knapsackへ帰着して全visible sumsのminimum flipsを同時に得る。

## 典型の発動条件

### 個数制限付きknapsackの二進分割

発動条件: 同じweight/costのitemが多数あり、0から上限まで任意個選べるとき。

同じCのfrequencyを二進groupへ分け、各groupを一度だけ選べるitemとしてminimum-cost DPする。

### L1 budgetによる種類数の評価

発動条件: 整数値の絶対値総和に上限があり、異なる値ごとの処理回数を評価したいとき。

Σ|C_i|≤Mからfrequency階層ごとの異なるCの数を評価し、binary groups総数をO(√M)と示す。

## 問題固有の要素

答えkはDP index k−S_Aに対応し、Cが負でも差分軸をoffset付き配列にすれば同じsubset-sum transitionで扱える。

別の問題へ持ち帰る視点: 二択の総和問題は一方をbaselineとし、選択変更量のsubset sumへ移すと目的値とcostを分離できる。

## 正当性

表面総和を基準に、カードiの反転を差δ_i=B_i−A_iと費用1の0/1選択にする。同じ差のc枚を大きさ1,2,4,…と残りへ分けると、0..cの全枚数をgroupのsubsetとして表せる。大きさsのgroupを差sδ・費用sのitemにすれば、元の選択と実現する和・費用の最小値が一致する。よって各groupを一回ずつ0/1最小化DPへ入れると、全カードの最少反転数が求まる。groupの絶対差総和はΣ|δ_i|≤Mである。閾値T以下のpower-of-two group数はΣ_j O(T/2^j)=O(T)、残りgroupも差種類ごとに一つでO(T)、T超のgroupはO(M/T)個なので、T=√Mで全group数O(√M)となる。

## 実装上の注意

- C=0のcardはflipしてもsumを変えず最小枚数を改善しないため、group化せず無視できる。
- 正負両方のshiftで同一itemを二重使用しないよう、各groupごとに更新元DPを分離するか走査方向を厳密に選ぶ。

## 復習の核

- 二面cardの総和はfrontをbaselineにしてflip deltaだけを集め、同値deltaのfrequencyを活用する。
- 値の絶対値総和が小さい制約は、DP幅だけでなく異なる値やbinary groupsの総数評価にも使う。

## 計算量と制約

### 時間

O(N+M√M)、M=Σ(A_i+B_i)、差分頻度のbinary split群総数O(√M)。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq M \leq 2 \times 10^5; 0 \leq A_i, B_i \leq M; \sum_{i=1}^N (A_i + B_i) = M; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/editorial/4841) — source-abc269-editorial-4841-ed4eb6b9855fed47f17aa20ed3e7bdd909ec1215e1c635d33bbf024aaf06cb84
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/tasks/abc269_g) — source-abc269-g-problem-a524766a4a3ef17cfa192e1df01517dc22fee40a0a8df100de4d6eacb36a8e88
