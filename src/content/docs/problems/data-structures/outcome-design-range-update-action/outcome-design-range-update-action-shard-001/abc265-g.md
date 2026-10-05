---
title: "ABC265-G — 012 Inversion"
draft: true
authoringUnit: {"problemId":"abc265-g","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc265-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e","source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":4,"claims":[{"key":"correctness","text":"位置順の二要素は、左区間内・右区間内・両区間をまたぐ場合に互いに素に分かれる。結合式はこの三場合を数える。値の写像は各要素と対のラベルを付け替えるだけなので、値が合流する場合も集計を保つ。したがって `prod(L−1,R)` で得た照会区間の要約から `Σ_{x>y}pair[x][y]` を返せば、その区間の転倒数になる。","sourceRevisionIds":["source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e","source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

値域が0,1,2だけなので、区間の反転数は各値の個数と、値xが値yより前に現れるordered pair数だけで表せる。

更新は三値集合上の関数 f=(S,T,U) を区間全体へ作用させる操作で、複数更新の遅延tagも関数合成で閉じる。

棄却する候補: 更新区間の全要素を書き換え、問い合わせごとにFenwick木等で反転数を数え直す。

区間長に比例する更新・照会が10万回あり最悪二乗時間になる。

採用する候補: 各segment nodeにcnt[x]とpair[x][y]を持ち、三値写像をlazy actionとしてpair表を写し替える遅延segment treeを使う。

node結合も写像適用も固定3値の定数個演算で閉じる。照会では0始まりの半開区間 `[L−1,R)` の要約を `prod(L−1,R)` で取得し、その `Σ_{x>y}pair[x][y]` を返す。

左右nodeを結合すると pair[x][y]=leftPair[x][y]+rightPair[x][y]+leftCnt[x]×rightCnt[y] になる。

写像f適用後はnewCnt[u]=Σ_{f(x)=u}cnt[x]、newPair[u][v]=Σ_{f(x)=u,f(y)=v}pair[x][y] と再分類できる。

## 典型の発動条件

### 小値域のpair統計量monoid

発動条件: 列の順序統計が値種類ごとの個数とordered pair数で決まり、値域が定数のとき。

部分列結合時に左右内部pairと左右をまたぐcnt積を足す。

### 写像作用付き遅延segment tree

発動条件: 区間更新が有限集合上の一括写像で、更新合成とnode統計の写し替えが定数時間でできるとき。

lazy tagを値ごとの行き先配列として持ち、新tagを既存tagの出力へ適用して合成する。

## 問題固有の要素

異なる値x,yの逆向きpairは pair[x][y]+pair[y][x]=cnt[x]cnt[y] から復元できるため、個数3つと反転方向3つの計6量だけを持つ実装も可能である。

別の問題へ持ち帰る視点: 値域が小さく、区間更新が値の一括写像なら、個数と値ごとの対の個数を要約にして遅延評価できるか考える。対称な恒等式があれば保存する方向も減らせる。

## 正当性

位置順の二要素は、左区間内・右区間内・両区間をまたぐ場合に互いに素に分かれる。結合式はこの三場合を数える。値の写像は各要素と対のラベルを付け替えるだけなので、値が合流する場合も集計を保つ。したがって `prod(L−1,R)` で得た照会区間の要約から `Σ_{x>y}pair[x][y]` を返せば、その区間の転倒数になる。

## 実装上の注意

- full 3×3 pair表を持つ場合、pair[x][x]は同値二位置の組数として扱い、leafでは0、mergeでcnt積を加える。
- lazy合成の順序は「既存の写像を受けた値へ新しい写像を適用」であり、配列代入順を逆にしない。
- pair数と反転数はN(N−1)/2まで増えるため64 bit整数を使う。

## 復習の核

- 小alphabetの区間統計は、全値pairの個数を持てば更新写像に対して閉じるか検討する。
- 遅延作用素が代入値ではなく写像なら、恒等写像と合成順序を先に定義してから実装する。

## 計算量と制約

### 時間

O(N+Q log N)、値域3なのでpair表は定数サイズ。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq A_i \leq 2; 1\leq Q\leq 10^5; In each query, 1\leq L \leq R \leq N.; In each query of the second kind, 0\leq S,T,U \leq 2.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_g) — source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4586) — source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00
