---
title: "ABC441-G — Takoyaki and Flip"
draft: true
authoringUnit: {"problemId":"abc441-g","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc441-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245","source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一枚の皿に対する更新列は最後の反転でそれ以前の個数を失うので、作用(a,b)とその時間順の合成式が元の操作と一致する。向きの奇偶と反転の有無を区別し、作用後の表数が0なら最大0、反転なしなら旧最大+b、反転ありならbとなる。各皿へ同じ作用をかけてから区間を結合した結果は、結合済み要約へ作用させた結果と同じで、空要約も保つ。したがってlazyを子へ伝播してから指定半開区間[L−1,R)の要約を集約すると、その区間の各皿を一度ずつ数え、その最大値を返す。全体要約を回答に代用しない。","sourceRevisionIds":["source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245","source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

照会は、指定された閉区間 [L,R] の最大たこ焼き数である。更新区間と照会区間は毎回異なり得るので、各区間を合成できる要約と、その要約だけへ適用できる更新作用を別々に設計する。各皿を直接更新すると一回 Θ(N)、全体 Θ(NQ) になり、N,Q≤2×10^5 に足りない。

まず一枚の皿の履歴を見る。反転でたこ焼きは全て落ち、裏向きの皿には追加されない。最後の反転より前の追加は結果に残らないため、更新列を「a回反転した後、b個追加する」作用 (a,b) に圧縮する。aの奇偶は向きを、a=0かa>0かは元のたこ焼きが残るかを表す。二回反転は向きを戻しても中身を消すので、aを単なるxorのbitにしてはいけない。

区間要約を (mx,u,d)=(最大個数,表向き枚数,裏向き枚数) とする。左右の合成は (max(mx₁,mx₂),u₁+u₂,d₁+d₂)、空区間の単位元は (0,0,0)。全て表向き・空の初期皿の葉は (0,1,0) である。作用 (a,b) を適用すると、aが奇数ならu,dを交換する。交換後の表数をu'としたとき、新しい最大値は次の三場合になる。

- u'=0なら0。たこ焼きを持てる皿がない。
- u'>0かつa=0ならmx+b。既存個数が残り、全ての表皿へbを足す。
- u'>0かつa>0ならb。反転により既存個数が消えている。

古い作用 (a,b) の後に新しい作用 (c,d) を行う合成は、c=0なら (a,b+d)、c>0なら (a+c,d)。恒等作用は (0,0)。ACLの composition(new,old) は new∘old を返すので、この時間順で式を実装する。

0-index・半開区間の木を構築し、タイプ1は apply(L−1,R,(0,X))、タイプ2は apply(L−1,R,(1,0))、タイプ3は prod(L−1,R).mx を出力する。部分被覆の更新・照会で子へ降りる前にlazyを伝播し、照会で完全被覆する要約だけを結合する。root全体の最大値は照会区間外の皿も含むため、指定区間の回答には使えない。

例えば二枚で皿1だけに5個追加すると、[2,2]への照会は0、[1,2]への照会は5である。更新で全体要約が正しくても、照会する集合を取り違えるとこの二つを区別できない。

## 典型の発動条件

### 作用モノイド付き lazy segment tree

発動条件: 区間更新が順序依存でも、有限情報へ圧縮して結合的に合成できるとき。

更新列を (反転回数,最後の反転後の追加量) として tag に保持する。

## 問題固有の要素

操作履歴はすべて保持せず、将来の結果に残る最後のリセット以後だけを作用として要約できる。

別の問題へ持ち帰る視点: lazy 作用では node 情報だけでなく、old と new の tag をどちらの順に合成するかを代数的に先に定める。

## 正当性

一枚の皿に対する更新列は最後の反転でそれ以前の個数を失うので、作用(a,b)とその時間順の合成式が元の操作と一致する。向きの奇偶と反転の有無を区別し、作用後の表数が0なら最大0、反転なしなら旧最大+b、反転ありならbとなる。各皿へ同じ作用をかけてから区間を結合した結果は、結合済み要約へ作用させた結果と同じで、空要約も保つ。したがってlazyを子へ伝播してから指定半開区間[L−1,R)の要約を集約すると、その区間の各皿を一度ずつ数え、その最大値を返す。全体要約を回答に代用しない。

## 実装上の注意

- a=0と正の偶数aを区別する。反転回数を保持すれば高々Q、追加量は最大Q·10^9なので個数とbは64bit整数にする。
- composition(new,old)の時間順を固定し、照会でも子へ降りる前に作用を伝播する。
- 公式の閉区間[L,R]はapply・prodとも[L−1,R)へ写す。空要約(0,0,0)に追加しても最大値は0のまま。

## 復習の核

- lazyの設計では、向きを戻す操作と中身を復元する操作が同じかを確認する。二回反転はリセットを取り消さない。
- 更新作用の正しさと、出力が集約する区間の正しさを別々に確認する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le Q\le2\times10 ^ 5; In all queries, 1\le L\le R\le N.; In type 1 queries, 1\le X\le10 ^ 9.; There is at least one type 3 query.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/editorial/15103) — source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/tasks/abc441_g) — source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261
