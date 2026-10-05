---
title: "ABC266-G — Yet Another RGB Sequence"
draft: true
authoringUnit: {"problemId":"abc266-g","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc266-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc266-g-problem-4ee5a91fce373f12f362921ad22798809578cc0fd909c2c1a3baf936d3b339fc","source-abc266-editorial-4669-9e5b9c4574319b5c66e34de1c935e8aa4ec76cd1f3d87c7e83aa2825f22fb22f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"RGは自己重複しないので各出現をtoken Xへ縮約する全単射がある。縮約後に新RGが生じないことは単独G直前のgapへRを入れない条件と同値。X,G,Bのmultiset配列を選び、許可B+K+1gapへ同一R−K個を分配すれば、元のRGがexactly K個の列だけを一度復元できる。","sourceRevisionIds":["source-abc266-g-problem-4ee5a91fce373f12f362921ad22798809578cc0fd909c2c1a3baf936d3b339fc","source-abc266-editorial-4669-9e5b9c4574319b5c66e34de1c935e8aa4ec76cd1f3d87c7e83aa2825f22fb22f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

pattern RG は自己重複しないため、ちょうどK個の全RGを一つのtoken Xへ縮約できる。

縮約後はXがK個、単独RがR−K個、単独GがG−K個、BがB個で、単独Rの直後に単独Gが来るRGを一つも作らない条件になる。

棄却する候補: R,G,Bの残数と直前文字、現在RG数を持つDPで全文字列を数える。

R,G,Bが各100万で三次元残数状態を持てない。

採用する候補: 先にX・G・Bを並べ、各Gの直前以外のgapへ残るRを重複可で挿入する組合せを数える。

禁止patternがRの挿入禁止gapとして局所化し、base多重集合順列とstars-and-barsの積で閉形式になる。

X・G・Bの並べ方は (G+B)!/(K!(G−K)!B!) 通りである。

base列のG−K個の直前gapを除くと許可gapはB+K+1個で、R−K個の同一Rの挿入法は binom(R+B,R−K) 通りになる。

## 典型の発動条件

### 非重複patternのtoken縮約

発動条件: 出現回数を指定されたpatternが互いに重なれず、縮約後の余分なpatternを禁止条件にできるとき。

指定個のpatternを新tokenへ置換し、残り文字列で同patternを避ける。

### 禁止gapを除く挿入数え上げ

発動条件: ある文字をbase列へ挿入し、特定種類の文字の直前だけ使用できないとき。

許可gap数を数え、同一文字を重複可で配るstars-and-barsを使う。

## 問題固有の要素

X=RGの境界では、Xの前へRを置いてもRRG、後へGを置いてもRGGとなり、新しいRG出現は増えないためtoken化が可逆である。

別の問題へ持ち帰る視点: pattern縮約の全単射性は、token前後で新たな境界出現が生じないことまで確認する。

## 正当性

RGは自己重複しないので各出現をtoken Xへ縮約する全単射がある。縮約後に新RGが生じないことは単独G直前のgapへRを入れない条件と同値。X,G,Bのmultiset配列を選び、許可B+K+1gapへ同一R−K個を分配すれば、元のRGがexactly K個の列だけを一度復元できる。

## 実装上の注意

- 階乗・逆階乗をR+G+Bまで前計算し、K=0やR−K=0でも同じ式を用いる。
- baseのG個ではなく単独GのG−K個だけがR挿入禁止gapを作る。

## 復習の核

- 短いpatternの正確出現数は、そのpatternに自己重複がなければ全出現をtoken化する方針を試す。
- 隣接禁止を持つ多重集合列は、一方の文字を後挿入して禁止されるgapを数えると閉形式になりやすい。

## 計算量と制約

### 時間

O(R+G+B)。階乗・逆階乗を前計算する。

### 空間

O(R+G+B)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq R,G,B\leq 10^6; 0 \leq K \leq \mathrm{min}(R,G); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/tasks/abc266_g) — source-abc266-g-problem-4ee5a91fce373f12f362921ad22798809578cc0fd909c2c1a3baf936d3b339fc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/editorial/4669) — source-abc266-editorial-4669-9e5b9c4574319b5c66e34de1c935e8aa4ec76cd1f3d87c7e83aa2825f22fb22f
