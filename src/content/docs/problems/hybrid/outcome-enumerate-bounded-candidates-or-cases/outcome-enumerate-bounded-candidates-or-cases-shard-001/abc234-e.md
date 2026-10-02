---
title: "ABC234-E — Arithmetic Number"
draft: true
authoringUnit: {"problemId":"abc234-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc234-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc234-e-problem-1ddc11f2854e44117e51e8b3048cbcf709205b4865051f1c62c033002b6e96db","source-abc234-editorial-3225-cede12fb81c714f047c71686c1f5971aa655086831eacbbe163e3011929e07db"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"数値範囲の大きさではなく、条件付きオブジェクトを決める自由パラメータ数から候補数を見積もる。 生成パラメータ空間が制約上きわめて小さく、条件を満たす数だけを漏れなく直接作れる。","sourceRevisionIds":["source-abc234-e-problem-1ddc11f2854e44117e51e8b3048cbcf709205b4865051f1c62c033002b6e96db","source-abc234-editorial-3225-cede12fb81c714f047c71686c1f5971aa655086831eacbbe163e3011929e07db"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

等差数の十進各桁は、先頭桁、隣接桁の共通差、桁数の三つを決めれば一意に定まる。

X≤10^17 なので必要な桁数は高々 18、先頭桁は 1 から 9、公差も一桁の差の範囲しかなく、候補総数は数千以下である。

棄却する候補: X から一つずつ整数を増やし、各数の桁差が全て等しいか検査する。

次の等差数までの差に小さい上界がなく、値域を逐次探索できない。

採用する候補: 桁数・先頭桁・公差を全列挙し、全桁が 0 から 9 に収まる候補だけ整数化して X 以上の最小を取る。

生成パラメータ空間が制約上きわめて小さく、条件を満たす数だけを漏れなく直接作れる。

数値範囲の大きさではなく、条件付きオブジェクトを決める自由パラメータ数から候補数を見積もる。

等差 digit sequence の三パラメータ表現を使って全候補を生成・検証し、下限 X を満たす最小値を単純比較する。

## 典型の発動条件

### 構造化された数の生成全探索

発動条件: 値域は大きいが、対象が少数の小さなパラメータで一意に決まるとき。

桁数、初項、公差を列挙し、生成途中で桁範囲を外れた候補を捨てる。

## 問題固有の要素

18 桁の 111…111 が X＝10^17 に対する候補になるため、10^18 以上へ探索範囲を広げる必要がない。

別の問題へ持ち帰る視点: 最小の上界候補を一つ具体的に構成すると、列挙するサイズやオーバーフロー境界を安全に限定できる。

## 正当性

数値範囲の大きさではなく、条件付きオブジェクトを決める自由パラメータ数から候補数を見積もる。 生成パラメータ空間が制約上きわめて小さく、条件を満たす数だけを漏れなく直接作れる。

## 実装上の注意

- 先頭桁は 0 を許さず、第 2 桁以降のどれかが 0 未満または 9 超ならその候補を破棄する。
- 一桁数は公差に依存しないため重複生成しても最小値比較には影響しないが、候補整数は 64 bit で安全に組み立てる。

## 復習の核

- 桁条件を持つ数では、数を走査する前に「何を決めれば残りが一意か」を列挙して候補数を見積もる。

## 計算量と制約

### 時間

O(10·19·L²)、Lは最大桁数。初桁・差・長さ候補の構築を含む。

### 空間

O(L)、最小候補のみ保持。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: X is an integer between 1 and 10^{17} (inclusive).

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/tasks/abc234_e) — source-abc234-e-problem-1ddc11f2854e44117e51e8b3048cbcf709205b4865051f1c62c033002b6e96db
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/editorial/3225) — source-abc234-editorial-3225-cede12fb81c714f047c71686c1f5971aa655086831eacbbe163e3011929e07db
