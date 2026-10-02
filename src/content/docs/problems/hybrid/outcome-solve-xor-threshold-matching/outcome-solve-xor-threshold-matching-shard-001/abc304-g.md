---
title: "ABC304-G — Max of Medians"
draft: true
authoringUnit: {"problemId":"abc304-g","docPath":"src/content/docs/problems/hybrid/outcome-solve-xor-threshold-matching/outcome-solve-xor-threshold-matching-shard-001/abc304-g.md","learningOutcomeIds":["outcome-solve-xor-threshold-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search","unit-recursive-divide-and-conquer"],"excludedTopics":["一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。","二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。"],"tagIds":["tag-xor-threshold-matching","tag-monotone-threshold-search","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092","source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"XORの最上位の異なるbitが大小を決めるため、x_d=1では交差群だけが候補、x_d=0では交差群は完全二部グラフになる。fの後者では小群の各要素を使うaペアと、大群の残りb−a要素によるペアが上界を与える。大群の良いペアを上限まで先に選べば、未使用要素がa個以上残り、小群を全て対応させられるので上界に達する。gでも、不足している二群間の下位ペアを先に確保し、完全な交差群で残りを埋めることで表の上界に達する。各再帰でbitが一つ減る帰納法により最大個数を得る。良いペア数はxについて非増加なので二分探索が正しい。","sourceRevisionIds":["source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092","source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR閾値matchingのbit分割再帰](src/content/docs/learn/modeling/xor-threshold-matching.md)

- 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。
- 二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。

## 考察

N個のXOR値の中央値をx以上にするには、x以上のペアを少なくとも⌊(N+1)/2⌋個作ればよい。残った要素は任意に組にできるため、判定では良いペアの最大個数だけを求める。

上位bitから条件を確定する。f_d(C,x)を一列C内、g_d(C,D,x)を二列間で、下位d+1bitのXORがxの下位d+1bit以上になる最大ペア数とする。各列をbit dが0/1の群へ分ける。d=−1ではf=⌊|C|/2⌋、g=min(|C|,|D|)。

x_d=1なら同bit同士は使えないので、f_d(C,x)=g_{d−1}(C_0,C_1,x)、g_d(C,D,x)=g_{d−1}(C_0,D_1,x)+g_{d−1}(C_1,D_0,x)。

x_d=0なら異bit同士は下位bitに関係なく使える。fでは小さい群をC_0としてa=|C_0|≤b=|C_1|と置き、f_d=a+min(⌊(b−a)/2⌋,f_{d−1}(C_1,x))。重要なのは、任意の交差ペアを実際に作って残りを再帰するのではなく、大きい群で必要な良いペアを先に確保できることを使って個数を計算する点である。

二列間はa=|C_0|,b=|C_1|,c=|D_0|,e=|D_1|として次の四場合になる。

| 条件 | g_d(C,D,x) |
| --- | --- |
| a≤eかつb≤c | a+b |
| a>eかつb>c | c+e |
| a≤eかつb>c | a+c+min(b−c,e−a,g_{d−1}(C_1,D_1,x)) |
| a>eかつb≤c | b+e+min(a−e,c−b,g_{d−1}(C_0,D_0,x)) |

例えば第三行ではC_0とD_0を交差ペアで全て使い、余るC_1,D_1の良い同bitペアを下位再帰で数える。そのペアを先に確保しても、残りは完全に交差可能なのでa+c個を必ず作れる。f_29(A,x)を判定としてxを整数二分探索する。

## 典型の発動条件

### bitwise divide and conquer

発動条件: xorと閾値の比較が、最上位の異なるbitで決まる。

各bitで要素を0/1群へ分け、既に閾値超過が確定するpairと下位bit比較が必要なpairを分離する。

### 最大値の二分探索

発動条件: medianをx以上にできるなら、より小さい閾値も必ず実現できる。

最大good-pair数f(A,x)を判定関数とし、30bit範囲の最大の真となるxを探す。

## 問題固有の要素

長さNのxor列のmedianは昇順でfloor(N/2)+1番目なので、全N pairを閾値以上にする必要はなく、ceil(N/2)=floor((N+1)/2)組だけ作れればよい。

別の問題へ持ち帰る視点: 順列自由なmedian最大化は、閾値以上の要素を必要個数だけ作る最大matching判定へ変えると扱いやすい。

## 正当性

XORの最上位の異なるbitが大小を決めるため、x_d=1では交差群だけが候補、x_d=0では交差群は完全二部グラフになる。fの後者では小群の各要素を使うaペアと、大群の残りb−a要素によるペアが上界を与える。大群の良いペアを上限まで先に選べば、未使用要素がa個以上残り、小群を全て対応させられるので上界に達する。gでも、不足している二群間の下位ペアを先に確保し、完全な交差群で残りを埋めることで表の上界に達する。各再帰でbitが一つ減る帰納法により最大個数を得る。良いペア数はxについて非増加なので二分探索が正しい。

## 実装上の注意

- 入力長は2N、中央値の必要ペア数は⌊(N+1)/2⌋である。再帰ではxの下位bitだけを参照する。
- 配列を一度sortし、各群を半開区間で渡す。bitごとの分割位置を前計算すれば配列コピーを避け、各bit層の走査量をO(N)にできる。

## 復習の核

- Nの小さいmultisetで全perfect matchingを列挙し、重複値、0、bit境界直前・直後のx、Nの偶奇について判定fとmedianの最大値を比較する。

## 計算量と制約

### 時間

O(NB²+N log N)、B=30。一判定で各bit層の群の総長がO(N)、判定O(NB)、二分探索O(B)回。

### 空間

O(NB)。sort済み列と各bitの分割位置。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq A_i < 2^{30}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6509) — source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_g) — source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a
