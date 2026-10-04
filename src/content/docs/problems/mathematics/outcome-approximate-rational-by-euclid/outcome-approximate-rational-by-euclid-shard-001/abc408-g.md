---
title: "ABC408-G — A/B < p/q < C/D"
draft: true
authoringUnit: {"problemId":"abc408-g","docPath":"src/content/docs/problems/mathematics/outcome-approximate-rational-by-euclid/outcome-approximate-rational-by-euclid-shard-001/abc408-g.md","learningOutcomeIds":["outcome-approximate-rational-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。"],"tagIds":["tag-rational-approximation"],"sourceRevisionIds":["source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f","source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"左右境界の行列式bc−ad=1と、目標開区間が境界の間に含まれることを維持する。一括更新のkは、左境界≤A/Bまたは右境界≥C/Dを満たす最大整数なので、目標区間を失わず未許可の端点等号も受理しない。現在の境界間の既約p/qは正整数係数α,βによる両境界の和として一意に書け、分母q≥b+d。mediantが目標開区間に入ればこの下界を達成するため、返すb+dが最小分母である。元の端点のmediantは実行可能なので探索は必ず終了し、一括更新により巨大な連分数係数も一回で処理する。","sourceRevisionIds":["source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f","source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [連分数・Stern–Brocotで有理近似する](src/content/docs/learn/number-theory/rational-approximation.md)

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

この解説で扱わないこと:

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 考察

分母qを1から増やす方法では、隣り合う巨大分母の分数の間にある開区間へ間に合わない。Stern–Brocot木は分母の小さい分数から区間を分けるので、与えられた開区間へ最初に入るnodeを探せないか考える。

境界をl=a/b=0/1、r=c/d=1/0（+∞）で始める。常にbc−ad=1、l≤A/B<C/D≤rを保つ。mediant m=(a+c)/(b+d)がA/B<m<C/Dを満たせば、その分母b+dが答えである。

この分母が最小である理由は、現在の隣接境界の間の既約分数p/qが必ず

```text
(p,q)=α(a,b)+β(c,d),  α=cq−dp>0, β=bp−aq>0
```

と書けること。α,βは整数だからq≥b+dであり、mediantがこの下界を達成する。戻り値が区間端点と等しい場合は受理しない。

mediantが左端以下なら左境界を、右端以上なら右境界を寄せる。同じ方向を一段ずつ進めると、大きな整数部分の分だけ遅くなるので、次の整数除算でまとめる。

```text
m≤A/B:
  k=floor((A b−B a)/(B c−A d))
  (a,b) ← (a+k c, b+k d)
m≥C/D:
  k=floor((D c−C d)/(C b−D a))
  (c,d) ← (c+k a, d+k b)
```

各分母は現在の対向境界が目標端の外側にあるため正で、入ったbranchではk≥1。kは更新境界がまだ目標端の外または等しいままである最大回数なので、開区間を飛び越さない。行列式1も保存される。境界が元の端点と一致した場合も、次のmediantへ進んでstrict条件を確かめる。

例えば(1/3,1/2)では、初期mediant1は大きすぎるので右境界を1/2まで一括更新する。次の1/3は左端と等しいので左境界を1/3へ進め、次の2/5が初めて開区間へ入り、答えは5。∞を逆数の除算へ渡す必要はなく、初期右境界を整数pair(1,0)として同じ式で扱える。

この一括更新は連分数の同方向の枝を係数一つ分進める操作で、段数は端点のEuclid法と同じO(log V)、V=max(A,B,C,D)。全比較と式を整数で行う。元端点のmediant(A+C)/(B+D)も必ず開区間にあるので、最小分母の答えはq≤B+D≤2×10^18。探索中のcross積・k倍には128bitを使う。

## 典型の発動条件

### 連分数／Euclid 再帰

発動条件: 二有理数の間にある分母最小の有理数を求めるとき。

Stern–Brocot木の同方向の枝を整数除算でまとめ、端点の連分数に対応する区間を絞る。

### fractional linear transformation

発動条件: 有理数区間の最適 pair を整数平行移動や逆数で小さい同型問題へ移したいとき。

行列式1の二境界を保ち、一方へ他方のk倍を加える整数変換で探索する。

## 問題固有の要素

求めるのは分母の最小値であり、その分母を持つ分子が一意とは限らない。開区間(1,4)には分母1の2/1と3/1がある。現在の隣接境界間では最小分母b+dを達成するmediantを一つ返せば十分である。

別の問題へ持ち帰る視点: 分母を外側から探索せず、区間両端の共通連分数 prefix を剥がして最初に分岐する位置で最小 pair を決める。

## 正当性

左右境界の行列式bc−ad=1と、目標開区間が境界の間に含まれることを維持する。一括更新のkは、左境界≤A/Bまたは右境界≥C/Dを満たす最大整数なので、目標区間を失わず未許可の端点等号も受理しない。現在の境界間の既約p/qは正整数係数α,βによる両境界の和として一意に書け、分母q≥b+d。mediantが目標開区間に入ればこの下界を達成するため、返すb+dが最小分母である。元の端点のmediantは実行可能なので探索は必ず終了し、一括更新により巨大な連分数係数も一回で処理する。

## 実装上の注意

- 目標区間は開区間。mediant=左端なら左へ、mediant=右端なら右へ進める。
- ∞は右境界(1,0)として扱い、浮動小数や0除算を使わない。
- 更新では旧a,b,c,dを使い、cross積とk倍は128bitまたは多倍長で計算する。

## 復習の核

- 区間内に整数がある場合、上端が整数ちょうど、lower=0相当へ正規化される場合、Farey 隣接な端点を小さい q の全探索と比較する。

## 計算量と制約

### 時間

各case O(log V)、V=max(A,B,C,D)。連分数型Euclid再帰。

### 空間

境界pairと一括更新の整数だけなのでO(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le A,B,C,D\le 10^{18}; \displaystyle\frac AB < \frac CD; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/editorial/13160) — source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/tasks/abc408_g) — source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c
