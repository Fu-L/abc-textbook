---
title: "ABC349-F — Subsequence LCM"
draft: true
authoringUnit: {"problemId":"abc349-f","docPath":"src/content/docs/problems/mathematics/outcome-apply-subset-zeta-mobius-transform/outcome-apply-subset-zeta-mobius-transform-shard-001/abc349-f.md","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-inclusion-exclusion","unit-modular-arithmetic","unit-prime-divisor"],"excludedTopics":["subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-zeta-mobius-transform","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc349-editorial-9771-ece89ac4e36de2f5b5d715a4a4c0a80b82289d20f20e5bf5efa6edc90eb3f1f1","source-abc349-f-problem-a6ea07412e8e6d7e00fa627dc9c4f61d080085e14c0ca44face1f0083b8b2ec8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Mを割らない要素はLCMをMにできない。残りの要素は各prime最大指数の供給bitを持ち、そのORがfullとLCM=Mは同値。h[mask]=2^{Σ_{submask}cnt}はORがmask以内の全subsetを数えるのでexact OR数のzeta変換であり、Möbius反転が目的fullの数を得る。M=1では空subsetもfullになるため1を引く。","sourceRevisionIds":["source-abc349-editorial-9771-ece89ac4e36de2f5b5d715a4a4c0a80b82289d20f20e5bf5efa6edc90eb3f1f1","source-abc349-f-problem-a6ea07412e8e6d7e00fa627dc9c4f61d080085e14c0ca44face1f0083b8b2ec8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md)

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md) — 単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

## 考察

LCMがMになるsubsequenceはMを割らない要素を含められない。M=∏p_t^{e_t}に対し、各divisor A_iが最大指数p_t^{e_t}を供給するかをbit tで表すと、選択LCM=MはmaskのORがfullになることと同値である。

採用する候補: mask frequencyへ圧縮し、subset zeta/Möbius transformでOR=fullを数える

Mのdistinct prime数K≤13なので2^K状態で全subsequenceをまとめて数えられる。

棄却する候補: 全subsequenceのLCMを列挙する

N=2×10^5で2^N選択を扱えない。

OR結果がmaskのsubsetに収まるsubsequence数h[mask]は、そのmaskのsubmask型を持つ全要素から任意に選ぶ2^{Σ_{s⊆mask}cnt[s]}通りである。hはexact OR個数gのsubset zeta transformなのでMöbius inversionでg[full]を得られる。

Mをfactorizeし、各A_iでM%A_i≠0なら捨てる。残りについて各primeのmax powerで割り切れるbit maskを作りcntへ加える。cntをsubset zetaして各maskのeligible個数を得てh=2^countとし、subset Möbius transformを行ってg[full]を出す。M=1はA_i=1の個数cから2^c-1。

## 典型の発動条件

### prime-exponent coverage mask

発動条件: LCMが各primeの最大指数を少なくとも一要素から得る条件である。

divisorごとにどの最大prime powerを供給するかをbitset化し、LCMをORへ写す。

### subset zeta・Möbius transform

発動条件: OR結果がmask以内の選択数からexact OR別個数へ反転したい。

submask frequency和をzetaで求め、2の冪を取った後Möbiusでexact値を復元する。

## 問題固有の要素

A_iの中間的なprime指数は、Mの最大指数に達していない限りそのprimeのLCM達成へ寄与しないので、各primeにつき一bitだけで十分である。

別の問題へ持ち帰る視点: target LCM固定の数え上げは、各target prime powerをcoverするset-union問題に圧縮できる。

## 正当性

Mを割らない要素はLCMをMにできない。残りの要素は各prime最大指数の供給bitを持ち、そのORがfullとLCM=Mは同値。h[mask]=2^{Σ_{submask}cnt}はORがmask以内の全subsetを数えるのでexact OR数のzeta変換であり、Möbius反転が目的fullの数を得る。M=1では空subsetもfullになるため1を引く。

## 実装上の注意

- M=1ではK=0かつempty subsequenceもOR=0なので1を引く。一般でもMを割らないA_iを必ず除外し、10^16の剰余・prime powerを64bitで扱う。

## 復習の核

- M=1、Mがprime power、複数prime、A_i=Mの重複、M非divisor要素を小N全subset LCMと比較する。

## 計算量と制約

### 時間

O(√M+Ns+s2^s)を試し割りfactorizationの場合の上界とする。sはMの相異なる素因数数。

### 空間

O(2^s+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \leq 10^{16}; 1 \leq A_i \leq 10^{16}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/editorial/9771) — source-abc349-editorial-9771-ece89ac4e36de2f5b5d715a4a4c0a80b82289d20f20e5bf5efa6edc90eb3f1f1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/tasks/abc349_f) — source-abc349-f-problem-a6ea07412e8e6d7e00fa627dc9c4f61d080085e14c0ca44face1f0083b8b2ec8
