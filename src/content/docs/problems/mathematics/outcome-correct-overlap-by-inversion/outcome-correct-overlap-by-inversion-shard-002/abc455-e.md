---
title: "ABC455-E — Unbalanced ABC Substrings"
draft: true
authoringUnit: {"problemId":"abc455-e","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc455-e.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-prefix-difference"],"sourceRevisionIds":["source-abc455-e-problem-3d7ca11f8e6a99a3aa31989bf56bdb6637d1a0113ea8bc0fa0f58ed824f52440","source-abc455-editorial-19240-86f0fce7057716e2b98af3d3c42d24426a245f19338fc426ade5917a739d82f5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"個数等値はprefix差の一致へ変わるので同key二端点数が当該区間数になる。A=B,A=C,B=Cの任意二交差は全三等値で、和集合包除は三単独和−2全等値になる。全区間数から引けば三個数pairwise相異だけ残る。prefix0を入れ、各位置で過去頻度だけ足すので非空区間を一度数える。","sourceRevisionIds":["source-abc455-e-problem-3d7ca11f8e6a99a3aa31989bf56bdb6637d1a0113ea8bc0fa0f58ed824f52440","source-abc455-editorial-19240-86f0fce7057716e2b98af3d3c42d24426a245f19338fc426ade5917a739d82f5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

先に読む単元:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

三種類の個数が pairwise 全て異なる条件の補集合は A=B、A=C、B=C の和集合であり、三事象の任意二つの共通部分は全て A=B=C になる。

採用する候補: 包除原理で全区間数-f(A=B)-f(A=C)-f(B=C)+2f(A=B=C) を計算し、各等式数は prefix差signatureの同値pair頻度から求める。

区間内の個数等式は両端prefixの差が等しいことと同値で、scalarまたは二次元signatureが同じprefix pairをhash mapで数えれば線形時間になる。

棄却する候補: 全部分文字列で A,B,C の個数を数え、三値が異なるか判定する。

区間候補が Θ(N^2) 個あり、prefix countで各判定を定数時間にしても間に合わない。

f(A=B) は prefix A_i-B_i が等しい二端点、f(A=B=C) は pair (A_i-B_i,A_i-C_i) が等しい二端点の数である。

三つのpairwise equality事象の二重・三重intersectionはいずれも全三等値なので、係数は -3+3-1=-1、補集合では+2になる。

空prefixを含め各位置の count差を更新する。三つのscalar keyと一つのpair keyについて、現在までの同key頻度を各 f へ加えてから頻度を増やす。全区間数から包除式で答える。

## 典型の発動条件

### 包除原理

発動条件: 複数量がpairwise相異なる条件を数えたいとき。

等値事象三つのunionを全等値intersection込みで引く。

### prefix signatureの同値pair

発動条件: 区間内の複数count差が0になる個数を数えたいとき。

差vectorが同じ二つのprefixをhash頻度で数える。

## 問題固有の要素

区間内countの等式は、必要な独立差だけを座標とするprefix signature一致へ変換できる。

別の問題へ持ち帰る視点: 三事象のintersectionが全て同一になる包除では係数を機械的に展開して重複補正を確認する。

## 正当性

個数等値はprefix差の一致へ変わるので同key二端点数が当該区間数になる。A=B,A=C,B=Cの任意二交差は全三等値で、和集合包除は三単独和−2全等値になる。全区間数から引けば三個数pairwise相異だけ残る。prefix0を入れ、各位置で過去頻度だけ足すので非空区間を一度数える。

## 実装上の注意

- prefix0の各key頻度を1で初期化し、64 bitでpair数を保持する。A=B=Cの係数+2を符号ミスしない。

## 復習の核

- Venn図で等値三事象のintersectionを確認し、各prefix keyがどの区間等式を表すかを式で対応づける。

## 計算量と制約

### 時間

O(N)期待時間。三scalar差と一pair差のhash頻度を更新する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; |S|=N; N is an integer.; S is a string consisting of the three characters A, B, and C.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/tasks/abc455_e) — source-abc455-e-problem-3d7ca11f8e6a99a3aa31989bf56bdb6637d1a0113ea8bc0fa0f58ed824f52440
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/editorial/19240) — source-abc455-editorial-19240-86f0fce7057716e2b98af3d3c42d24426a245f19338fc426ade5917a739d82f5
