---
title: "ABC250-E — Prefix Equality"
draft: true
authoringUnit: {"problemId":"abc250-e","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc250-e.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc250-e-problem-7e57826303bfe2b9d9c3a11fb1a322d701539b14571e3397052872d29532abe8","source-abc250-editorial-3906-78e504b32c0ebfd41a61836f3acd43520283c852c6412bbe8de3fe7b86d23d37"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各位置にはその接頭辞までのdistinct数を記録すれば、元の長さが違っても同じ初出段階kへ写せる。 AとBのk番目の新値を対称差集合へ順に反転し、集合が空かどうかを記録すればハッシュ衝突なしで判定できる。 両列で異なる値がk個となる接頭辞集合を一段ずつ更新し、等しいkだけの真偽を全問い合わせで共有できる。","sourceRevisionIds":["source-abc250-e-problem-7e57826303bfe2b9d9c3a11fb1a322d701539b14571e3397052872d29532abe8","source-abc250-editorial-3906-78e504b32c0ebfd41a61836f3acd43520283c852c6412bbe8de3fe7b86d23d37"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 交換論による貪欲順の証明。

## 考察

接頭辞に同じ値が何度現れても集合は変わらないため、各列を値が初めて現れた順だけに圧縮すると、問い合わせは異なる値の個数kごとの集合比較になる。

採用する候補: 初出順列と対称差集合を用いる決定的前計算

両列で異なる値がk個となる接頭辞集合を一段ずつ更新し、等しいkだけの真偽を全問い合わせで共有できる。

棄却する候補: 各問い合わせで二つの接頭辞集合を構築する

問い合わせごとに線形時間を要し、N,Qが2×10^5では間に合わない。

各位置にはその接頭辞までのdistinct数を記録すれば、元の長さが違っても同じ初出段階kへ写せる。

AとBのk番目の新値を対称差集合へ順に反転し、集合が空かどうかを記録すればハッシュ衝突なしで判定できる。

A,Bそれぞれについて初出値の列と各位置のdistinct数を作る。kを増やしながら両初出値を対称差集合へ追加・削除し、空ならequal[k]=trueとして、問い合わせでは二つのdistinct数が等しくequal[k]かを答える。

## 典型の発動条件

### 初出圧縮

発動条件: 重複回数を無視した接頭辞集合だけが問われる。

各値の最初の出現だけを並べ、元位置をdistinct数へ写像する。

### 対称差の逐次維持

発動条件: 同じ段階の二集合へ要素が一つずつ追加される。

追加値をトグルし、対称差が空である段階を前計算する。

## 問題固有の要素

接頭辞集合は初出の瞬間にしか変化しないため、N個の位置ではなくdistinct数の段階を比較すればよい。

別の問題へ持ち帰る視点: 二つの単調増加集合列の一致は、各段階の対称差を差分更新して判定できる。

## 正当性

各位置にはその接頭辞までのdistinct数を記録すれば、元の長さが違っても同じ初出段階kへ写せる。 AとBのk番目の新値を対称差集合へ順に反転し、集合が空かどうかを記録すればハッシュ衝突なしで判定できる。 両列で異なる値がk個となる接頭辞集合を一段ずつ更新し、等しいkだけの真偽を全問い合わせで共有できる。

## 実装上の注意

- 重複値ではdistinct数を増やさず、k=0も一致として用意する。入力値が大きいので値そのものを配列添字にせず集合で管理する。

## 復習の核

- 同じdistinct数だが要素が異なる例、同じ値が長く重複する例、片側だけ新値が現れる境界を含め、素朴なset比較と照合する。

## 計算量と制約

### 時間

平衡set版O(N log N+Q)、初出列の対称差。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,Q \leq 2 \times 10^5; 1 \leq a_i,b_i \leq 10^9; 1 \leq x_i,y_i \leq N; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/tasks/abc250_e) — source-abc250-e-problem-7e57826303bfe2b9d9c3a11fb1a322d701539b14571e3397052872d29532abe8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/editorial/3906) — source-abc250-editorial-3906-78e504b32c0ebfd41a61836f3acd43520283c852c6412bbe8de3fe7b86d23d37
