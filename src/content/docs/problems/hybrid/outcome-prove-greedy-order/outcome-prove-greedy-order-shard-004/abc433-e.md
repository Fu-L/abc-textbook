---
title: "ABC433-E — Max Matrix 2"
draft: true
authoringUnit: {"problemId":"abc433-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc433-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-event-sweep"],"sourceRevisionIds":["source-abc433-e-problem-c1c720619b326a64be6ed46ae25e7a4817b290636916afa6bc5d11780707a236","source-abc433-editorial-14636-311d6477e1944f6467b6ce4081f41d65550694299324f13e27a64983dba59c30"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"v が X_i と Y_j の両方なら交点 (i,j) に置くしかなく、片方だけなら他方の最大が v より大きい未使用交点が必要である。 どちらの最大にもない v は v<min(X_i,Y_j) の未使用マスならどこでもよい。 降順処理では v を置ける候補集合は増えるだけなので、その中の任意の未使用マスを選んでも将来の小さい値を妨げない。 大きい値を先に確定することで最大値制約を壊さず、候補追加が単調なので全マスを効率よく割り当てられる。","sourceRevisionIds":["source-abc433-e-problem-c1c720619b326a64be6ed46ae25e7a4817b290636916afa6bc5d11780707a236","source-abc433-editorial-14636-311d6477e1944f6467b6ce4081f41d65550694299324f13e27a64983dba59c30"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 対称操作による状態の正規化。

## 考察

行最大 X_i と列最大 Y_j が同じ値を二回含むことは、1…NM を一度ずつ使う行列では不可能である。値を大きい順に置けば、現在値 v より大きい必要最大値を持つ未使用マスだけが候補になる。

採用する候補: v=NM…1 を降順に処理し、v が X/Y に現れるかの四場合で置き場所を決め、自由マスを min(X_i,Y_j) ごとに管理する。

大きい値を先に確定することで最大値制約を壊さず、候補追加が単調なので全マスを効率よく割り当てられる。

棄却する候補: 全ての順列を N×M 行列へ詰め、行列最大が X,Y か検査する。

(NM)! 通りあり列挙不能である。

v が X_i と Y_j の両方なら交点 (i,j) に置くしかなく、片方だけなら他方の最大が v より大きい未使用交点が必要である。

どちらの最大にもない v は v<min(X_i,Y_j) の未使用マスならどこでもよい。

降順処理では v を置ける候補集合は増えるだけなので、その中の任意の未使用マスを選んでも将来の小さい値を妨げない。

X,Y の重複を検査し、値から行・列への逆引きを作る。min(X_i,Y_j)=v となるマスを bucket[v] に入れ、v を降順走査する。必須交点を先に検証・使用し、片側必須または自由な値は現在利用可能になった条件適合マスから一つ選ぶ。失敗なら No、全て置ければ行列を出す。

## 典型の発動条件

### 大きい値からの貪欲配置

発動条件: 行・列の最大値を指定し、全値を一度ずつ配置するとき。

最大値として必須の位置を高い順に固定し、残りを両最大より小さいマスへ置く。

### 閾値候補のバケット管理

発動条件: 候補条件が v<key で、v を単調に下げながら未使用候補を取るとき。

マスを min(X_i,Y_j) で分類し、閾値を越えた bucket を候補集合へ追加する。

## 問題固有の要素

最大値制約では大きい値ほど配置先が狭く、小さい値ほど自由なので降順貪欲が自然な交換可能性を持つ。

別の問題へ持ち帰る視点: 行・列の二つの上限制約は各セルの許容閾値 min(X_i,Y_j) へまとめられる。

## 正当性

v が X_i と Y_j の両方なら交点 (i,j) に置くしかなく、片方だけなら他方の最大が v より大きい未使用交点が必要である。 どちらの最大にもない v は v<min(X_i,Y_j) の未使用マスならどこでもよい。 降順処理では v を置ける候補集合は増えるだけなので、その中の任意の未使用マスを選んでも将来の小さい値を妨げない。 大きい値を先に確定することで最大値制約を壊さず、候補追加が単調なので全マスを効率よく割り当てられる。

## 実装上の注意

- 必須交点が既使用でないか、そこへ v を置いて両最大を超えないかを確認する。X,Y の値域・重複と全マス一回使用を検査する。

## 復習の核

- 四場合それぞれで選ぶマスが該当行/列を満たし、v<min(X_i,Y_j) または必須等号を満たすことを確認する。

## 計算量と制約

### 時間

O(HW+H+W)、値bucketと利用可能cellを降順処理。

### 空間

O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 10^5; 1\le N,M; The sum of N\times M over all test cases is at most 2\times 10^5.; 1\le X_i,Y_j\le N\times M; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/tasks/abc433_e) — source-abc433-e-problem-c1c720619b326a64be6ed46ae25e7a4817b290636916afa6bc5d11780707a236
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/editorial/14636) — source-abc433-editorial-14636-311d6477e1944f6467b6ce4081f41d65550694299324f13e27a64983dba59c30
