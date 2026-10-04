---
title: "ABC423-G — Small Multiple 2"
draft: true
authoringUnit: {"problemId":"abc423-g","docPath":"src/content/docs/problems/mathematics/outcome-solve-modular-constraints/outcome-solve-modular-constraints-shard-001/abc423-g.md","learningOutcomeIds":["outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-gcd-diophantine","unit-modular-arithmetic"],"excludedTopics":["可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。"],"tagIds":["tag-modular-congruence-crt","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc423-editorial-13874-875ebf449f21f3c74deeab5317db8177a527b8f48f050154fcad87b18a370a47","source-abc423-g-problem-1bd1bfb0cb52eb6574e68d6c4a6f8bf155dfeb8723a67ef574f19396aa64544a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"S後ろへd桁を付けた数値区間の長さ10^d≥Kなのでmultipleが必ずある。最小解は追加高々d桁で、upperを先頭0paddingすればu+l=dのsplitで全候補を覆える。小さい側を列挙し大側の合同式をgcd可解条件と逆元で解くと各splitの最小候補を得る。leading0を除いた長さ、辞書順の比較は整数値比較と同じ。","sourceRevisionIds":["source-abc423-editorial-13874-875ebf449f21f3c74deeab5317db8177a527b8f48f050154fcad87b18a370a47","source-abc423-g-problem-1bd1bfb0cb52eb6574e68d6c4a6f8bf155dfeb8723a67ef574f19396aa64544a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次合同・CRTで解の類を統合する](src/content/docs/learn/number-theory/modular-congruence.md)

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md) — 最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 考察

Kの桁数dに対し、Sの後へd桁を付けた区間には必ずKのmultipleがあるので、最小解はSの前後に合計高々d桁を加えた形だけ調べればよい。

採用する候補: 前後追加桁数を分け、小さい側を列挙して線形合同式を解く

各splitで高々10^{min(u,l)}候補だけを列挙し、d≤10なので実行可能である。

棄却する候補: Sを含む整数を1から順に探索する

最小multiple自体が最大50万桁級で数値列挙できない。

candidateをupper+S+lowerとしu+l=dへpaddingできる。u<lならupper列挙後に必要lower residueを直接得る。u≥lならlowerを列挙し、10^{|S|+l}upper≡rhs mod Kをgcdで縮約して逆元から最小upper residueを得る。

S mod Kと10冪を前計算する。各split(u,l)で小さい側を0…10^size-1列挙し合同式を解き、反対側が指定桁数内ならzero-padして候補文字列を作る。leading zeroを除いた(length,string)順で全d+1候補の最小を出す。

## 典型の発動条件

### 桁列連結のmod合同式

発動条件: 巨大decimal stringの前後へ短いdigit列を足しKのmultipleにしたい。

concat value mod Kを10冪で表し、一変数線形合同式として解く。

### meet-in-the-middle的桁分割

発動条件: 追加できるd桁を前後へ分け、一方の全列挙と他方の代数解法を組み合わせる。

各splitで短い側だけ10^size列挙して最大10^{d/2}に抑える。

## 問題固有の要素

解の数値比較は巨大整数化せず、leading zero除去後の桁数とdecimal lexicographic順で比較できる。

別の問題へ持ち帰る視点: 巨大非負整数候補はcanonical decimal stringの(length,lex)で順序付ける。

## 正当性

S後ろへd桁を付けた数値区間の長さ10^d≥Kなのでmultipleが必ずある。最小解は追加高々d桁で、upperを先頭0paddingすればu+l=dのsplitで全候補を覆える。小さい側を列挙し大側の合同式をgcd可解条件と逆元で解くと各splitの最小候補を得る。leading0を除いた長さ、辞書順の比較は整数値比較と同じ。

## 実装上の注意

- S前のupperはleading zeroを許すがlowerは固定桁zero-padする。合同式ax=bはgcd(a,K)|bを確認し、reduced modulusで逆元を取る。

## 復習の核

- K小でbrute forceし、upper/lower各側が最適、gcd非可逆case、S自身がmultipleを確認する。

## 計算量と制約

### 時間

各case O(|S|+Σ_{u+l=d}10^{min(u,l)}log K)を候補本体を毎回コピーせず比較する実装の時間とする。dはKの桁数≤10。

### 空間

O(|S|+10^{⌊d/2⌋})。合同式の列挙値を保持しないならO(|S|+d)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: T is an integer.; 1 \leq T \leq 200; K is an integer.; 1 \leq K \leq 10^9; S is a string consisting of digits (0 - 9).; The first character of S is not 0.; 1 \leq |S| \leq 5 \times 10^5; For each input file, the sum of |S| over all test cases is at most 5 \times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/editorial/13874) — source-abc423-editorial-13874-875ebf449f21f3c74deeab5317db8177a527b8f48f050154fcad87b18a370a47
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/tasks/abc423_g) — source-abc423-g-problem-1bd1bfb0cb52eb6574e68d6c4a6f8bf155dfeb8723a67ef574f19396aa64544a
