---
title: "ABC270-G — Sequence in mod P"
draft: true
authoringUnit: {"problemId":"abc270-g","docPath":"src/content/docs/problems/mathematics/outcome-find-orbit-hit-by-bsgs/outcome-find-orbit-hit-by-bsgs-shard-001/abc270-g.md","learningOutcomeIds":["outcome-find-orbit-hit-by-bsgs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["Baby-Step Giant-Step・可逆作用の反復到達探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-baby-step-giant-step","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc270-g-problem-d2e7f7e98ead091815bbff0cacc9d5bb12379fe195b4aa6f134dfa403c930e96","source-abc270-editorial-4847-f2bf8ee71d83512d90ea93c0c7ced12401891727cf5632de535bcbe42d7368fb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A≠0ならaffine写像は有限体上の全単射で、到達するならP未満の最初の時刻がある。時刻iB+jを、f^{iB}(S)=f^{−j}(G)の衝突として探索すると全候補を覆う。baby重複で最小jを保持し全衝突の最小時刻を選ぶと最初の到達になる。A=0は初期と一歩後Bだけの別case。","sourceRevisionIds":["source-abc270-g-problem-d2e7f7e98ead091815bbff0cacc9d5bb12379fe195b4aa6f134dfa403c930e96","source-abc270-editorial-4847-f2bf8ee71d83512d90ea93c0c7ced12401891727cf5632de535bcbe42d7368fb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Baby-Step Giant-Step・可逆作用の反復到達探索](src/content/docs/learn/number-theory/baby-step-giant-step.md)

- 有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

A≠0ならf(x)=Ax+Bはfield modulo P上のbijectionで、inverseもaffine functionとして計算できる。

有限集合上のbijection orbitではGが現れるなら最初のP step以内なので、indexをiM+jへ分けてmeet-in-the-middleできる。

棄却する候補: Sからrecurrenceを順にsimulationし、Gまたは重複状態に達するまで進める。

一caseでP=10^9 stepかかり得る。

採用する候補: M≈√Pとし、G,f^{-1}(G),…,f^{-(M−1)}(G)をmapへ置き、S,f^M(S),…とのintersectionを探す。

一致 f^{iM}(S)=f^{-j}(G) から候補index iM+jを復元でき、各caseをO(√P log P)以内で処理できる。

affine mapsはpair(a,b)で表し、compositionによりf^MもO(M)またはbinary exponentiationで一つのaffine mapとして得られる。

baby valuesに重複がある場合は最小jを保持し、得られたiM+jの最小値を取らないと最初の到達時刻を保証できない。

invertible affine recurrenceのorbit searchへBaby-Step Giant-Stepを適用し、forward giant stepsとbackward baby stepsを衝突させる。

## 典型の発動条件

### Baby-Step Giant-Step

発動条件: invertible functionの反復でf^n(x)=yとなる最小nを、状態空間全走査より速く求めたいとき。

targetからinverseをM回辿るbaby tableと、startからf^Mを反復するgiant sequenceを照合する。

### affine mapの合成と逆写像

発動条件: modular recurrenceがax+bで、反復・逆向き遷移をまとめたいとき。

pair(a,b)のcompositionでpower mapを作り、a^{-1}からinverse affine mapを導く。

## 問題固有の要素

A=0ではX_0=S、その後は常にBなので別処理し、A≠0のときだけinverse-based BSGSを使える。

別の問題へ持ち帰る視点: inverseを要求するorbit algorithmでは、非可逆parameterを先に分類して小さな直接解へ落とす。

## 正当性

A≠0ならaffine写像は有限体上の全単射で、到達するならP未満の最初の時刻がある。時刻iB+jを、f^{iB}(S)=f^{−j}(G)の衝突として探索すると全候補を覆う。baby重複で最小jを保持し全衝突の最小時刻を選ぶと最初の到達になる。A=0は初期と一歩後Bだけの別case。

## 実装上の注意

- candidate iM+jはP以下の範囲だけを採用し、S=Gなら必ず0を最小解として返す。
- P近傍の積は64 bitで保持してmoduloを取り、baby tableのduplicateは必要なjの向きに合わせて更新する。

## 復習の核

- function iterationの到達時刻はindexをblock quotientとremainderに分け、inverse側とのmeet-in-the-middleを考える。
- BSGSで存在判定だけでなく最小indexが必要なら、tableのduplicateと候補の走査順を別途証明する。

## 計算量と制約

### 時間

各case O(√P)期待時間。affine BSGSのbaby tableをhashで照合する。

### 空間

O(√P)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 100; 2 \leq P \leq 10^9; P is a prime.; 0\leq A,B,S,G < P; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/tasks/abc270_g) — source-abc270-g-problem-d2e7f7e98ead091815bbff0cacc9d5bb12379fe195b4aa6f134dfa403c930e96
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/editorial/4847) — source-abc270-editorial-4847-f2bf8ee71d83512d90ea93c0c7ced12401891727cf5632de535bcbe42d7368fb
