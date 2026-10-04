---
title: "ABC340-F — S = 1"
draft: true
authoringUnit: {"problemId":"abc340-f","docPath":"src/content/docs/problems/mathematics/outcome-characterize-integer-solvability/outcome-characterize-integer-solvability-shard-001/abc340-f.md","learningOutcomeIds":["outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。"],"tagIds":["tag-bezout-diophantine"],"sourceRevisionIds":["source-abc340-editorial-9250-dd0c5135086252fc4d9f1a23b1d18e0098e3fc9cf7d1678338de2aefd31a461f","source-abc340-f-problem-56c98b2943218a0a2280a44dbf2e2cfb359a0045e00d14918e2c72085f6610cd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"面積1は|AY−BX|=2と同値。左辺の符号付き整数値はgcd(|X|,|Y|)の倍数だけなのでg∤2なら不可能。逆にg|2ならBézout係数を2/g倍することで値2を作れ、三角形面積も1になる。従って判定と構成が必要十分。","sourceRevisionIds":["source-abc340-editorial-9250-dd0c5135086252fc4d9f1a23b1d18e0098e3fc9cf7d1678338de2aefd31a461f","source-abc340-f-problem-56c98b2943218a0a2280a44dbf2e2cfb359a0045e00d14918e2c72085f6610cd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

この解説で扱わないこと:

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 考察

三点(0,0),(X,Y),(A,B)の三角形面積は|XB-YA|/2、同値に|AY-BX|/2である。面積1の条件は整数一次不定方程式|AY-BX|=2になる。

採用する候補: gcd判定後、extended Euclidean algorithmでBézout係数を構成する

解存在条件gcd(X,Y)|2を判定し、存在時は係数を定数倍して範囲内の整数解を直接得られる。

棄却する候補: A,Bを座標範囲内で探索する

各座標は±10^18で候補が広大であり、線形探索も二重探索も不可能である。

g=gcd(|X|,|Y|)はAY-BXの全ての値を割るためg∤2なら不可能である。g=1または2ならextended gcdを(Y,-X)へ適用してcY-dX=±gを得て、2/g倍すれば絶対値2の解になる。

g=gcd(abs(X),abs(Y))を求め、2 mod g≠0なら-1を出す。extended gcdでY·u+(-X)·v=gまたは-gとなる係数を得て、scale=2/gを掛けA=u·scale,B=v·scaleとする。必要なら符号を反転し出力する。

## 典型の発動条件

### determinantによる面積

発動条件: 原点を含む格子三角形の面積条件が座標のbilinear式になる。

2倍面積をdeterminant |XB-YA|として整数方程式へ変換する。

### Bézout identity

発動条件: aA+bBが指定整数2になる整数係数を構成したい。

extended Euclidでgcdの線形結合を得て、gcdが2を割る分だけscaleする。

## 問題固有の要素

gcdが3以上なら不可能、gcdが1または2なら常に可能と完全に分類でき、座標上限もBézout係数の標準boundと2/g倍から満たせる。

別の問題へ持ち帰る視点: 格子上のdeterminant指定は係数のgcdによる存在判定とBézout構成に直結する。

## 正当性

面積1は|AY−BX|=2と同値。左辺の符号付き整数値はgcd(|X|,|Y|)の倍数だけなのでg∤2なら不可能。逆にg|2ならBézout係数を2/g倍することで値2を作れ、三角形面積も1になる。従って判定と構成が必要十分。

## 実装上の注意

- XまたはYが0、負数をextended gcdへ渡す時の符号を確認する。中間積は入力上限とscaleから64bit内だがabsの扱いを統一する。

## 復習の核

- (X,Y)=(±1,0),(0,±2)、gcd=1,2,3の例でdeterminantを再計算し|AY-BX|=2を確認する。

## 計算量と制約

### 時間

O(log max(|X|,|Y|))。extended gcd。

### 空間

O(1)、再帰実装ならO(log max(|X|,|Y|))。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: -10^{17} \leq X, Y \leq 10^{17}; (X, Y) \neq (0, 0); X and Y are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/editorial/9250) — source-abc340-editorial-9250-dd0c5135086252fc4d9f1a23b1d18e0098e3fc9cf7d1678338de2aefd31a461f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/tasks/abc340_f) — source-abc340-f-problem-56c98b2943218a0a2280a44dbf2e2cfb359a0045e00d14918e2c72085f6610cd
