---
title: "ABC333-G — Nearest Fraction"
draft: true
authoringUnit: {"problemId":"abc333-g","docPath":"src/content/docs/problems/mathematics/outcome-approximate-rational-by-euclid/outcome-approximate-rational-by-euclid-shard-001/abc333-g.md","learningOutcomeIds":["outcome-approximate-rational-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。"],"tagIds":["tag-rational-approximation"],"sourceRevisionIds":["source-abc333-editorial-7937-5a836e814431d363952a01dc5dbeda64c09a4350d01a20b81a2e83c91a6b3c41","source-abc333-g-problem-b2e14eaffb1822e38f5d7dd39d9676c48331b39abfc476cfc57e273fab568392"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"r以下最大とr以上最小の分母≤N分数より遠い同側候補は最適でない。連分数pathの両境界はStern–Brocotの隣接分数で、次のmediant分母がNを超えたらその間に許容分母のfractionはない。係数を最大許容まで進めて左右最隣接を得た後、整数cross積で誤差を比較すれば最適分数になり、tieは小さい側を選ぶ。","sourceRevisionIds":["source-abc333-editorial-7937-5a836e814431d363952a01dc5dbeda64c09a4350d01a20b81a2e83c91a6b3c41","source-abc333-g-problem-b2e14eaffb1822e38f5d7dd39d9676c48331b39abfc476cfc57e273fab568392"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [連分数・Stern–Brocotで有理近似する](src/content/docs/learn/number-theory/rational-approximation.md)

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 考察

入力小数rを正確な既約分数R/Dとして扱う。D≤Nならr自身が誤差0の答えであり、D>Nなら分母N以下でrを左右から挟む最隣接分数のどちらかだけを比較すればよい。

採用する候補: 連分数・Stern–Brocot木で分母上限内の左右隣接分数を求める

分母≤Nの全既約分数を列挙せず、rへのpath上のconvergentとsemiconvergentから候補を二つに絞れる。

棄却する候補: q=1,…,Nを全て試してpをround(rq)する

Nは10^10まであり、分母の線形走査は不可能である。

Stern–Brocot木を分母≤Nで切った探索木で、r以下の最大値xとr以上の最小値yは、rの連分数path上にある。連分数の次係数を分母がNを超えない最大値まで進めたsemiconvergentと、その直前境界からx,yを得られ、最適解はこの二つのどちらかである。

小数文字列から整数Rと10の冪Dを作りgcdで約分する。Euclid法で連分数係数を順に得つつconvergentの分子分母を更新し、次の完全convergentが分母Nを超える箇所では係数をfloor((N-q_prevprev)/q_prev)までに切って左右候補を構成する。|R/D-p/q|を整数cross積で比較し、tieは小さいp/qを選ぶ。

## 典型の発動条件

### 連分数とsemiconvergent

発動条件: 実数へ近い有理数を分母上限付きで求めたい。

continued-fraction pathを辿り、最後の係数だけ分母制約まで切ってFareyの左右隣接候補を得る。

### 有理数の厳密比較

発動条件: 入力が18桁小数で、近似誤差やtieを浮動小数点に任せられない。

誤差|Rq-Dp|/(Dq)同士をcross multiplicationし、分数大小も整数積で比較する。

## 問題固有の要素

最良近似候補はconvergentだけとは限らず、分母上限が次convergentの途中にある場合は最大許容係数のsemiconvergentが境界候補になる。

別の問題へ持ち帰る視点: 分母制限付き有理近似では、連分数の完全収束分数に加えて最後の中間収束分数を確認する。

## 正当性

r以下最大とr以上最小の分母≤N分数より遠い同側候補は最適でない。連分数pathの両境界はStern–Brocotの隣接分数で、次のmediant分母がNを超えたらその間に許容分母のfractionはない。係数を最大許容まで進めて左右最隣接を得た後、整数cross積で誤差を比較すれば最適分数になり、tieは小さい側を選ぶ。

## 実装上の注意

- 末尾0を含む小数を正確にparseして約分する。連分数の二通りの終端表現、分母ちょうどN、128bit overflow、誤差tie時の小さい分数優先を扱う。

## 復習の核

- Nがrの既約分母以上、最適が左右それぞれにある場合、誤差tie、分母上限がsemiconvergent途中に来る小例を全分母列挙と比較する。

## 計算量と制約

### 時間

O(log D)の連分数段数。D≤10^18は正確な入力小数の分母。

### 空間

O(log D)、境界だけ保持すればO(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0\lt r\lt 1; r is given as a real number with at most 18 decimal places.; 1\leq N\leq 10^{10}; N is an integer.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/editorial/7937) — source-abc333-editorial-7937-5a836e814431d363952a01dc5dbeda64c09a4350d01a20b81a2e83c91a6b3c41
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/tasks/abc333_g) — source-abc333-g-problem-b2e14eaffb1822e38f5d7dd39d9676c48331b39abfc476cfc57e273fab568392
