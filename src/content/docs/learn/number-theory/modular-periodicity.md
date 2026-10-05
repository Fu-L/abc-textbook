---
title: "剰余周期と指数法則を利用する"
description: "「剰余周期と指数法則を利用する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 171
---

# 剰余周期と指数法則を利用する

習得対象の目安: **青色（1600–1999）**。Fermat・Euler型の指数簡約で必要な互いに素条件と周期を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 剰余周期・指数法則

有限剰余状態の周期またはFermat/Euler型指数簡約を示し、巨大な反復やtower exponentを短縮する。

### 習得する技能

- 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。

## 考え方

反復列の剰余状態は有限なので、決定性遷移ではいつか同じ状態へ戻る。cycleに入る前のprefixと、cycle長を分ければ巨大回数を剰余へ移せる。


決定性遷移fでは、初期sから状態列state[t]とfirst[state]を持ち、未登録状態を時刻tで記録して進める。既出stateへ戻った時刻がt、その初出がμなら周期λ=t−μ。K<μではstate[K]、K≥μでは `state[μ+(K−μ) mod λ]` を返す。Kそのものを最初からλで割ると、前周期を含む場合に別状態へ写してしまう。

gcd(a,m)=1ならEulerの定理でa^φ(m)=1だから、非負指数EはE mod φ(m)へ簡約できる。素数pでは非零aに対しp−1を使う。towerの上段を別の法で評価するときも、この可逆性を段ごとに確認する。例えばa≡0 mod pではE=0なら1、E>0なら0であり、Eをp−1で割って0にしただけでは両者を区別できない。非可逆な場合は素数冪ごとの指数飽和条件や前周期を別に扱う。

## 成立条件と計算量

状態数Sなら直接cycle検出O(S)時間、訪問記録O(S)空間。Floyd法なら空間を減らせる。乗法だけの周期が群の位数で決まるのは可逆な元の場合で、非可逆な元には前周期があり得る。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

剰余列や冪が有限状態で周期化することを示し、周期前計算や指数法則で巨大な反復を短縮する。

### このUnitでは扱わないもの

- 逆元・一次合同・CRTによる合同条件の統合、および巡回群の位数を使う計数。

## 問題一覧

- [ABC319 E「Bus Stops」](https://atcoder.jp/contests/abc319/tasks/abc319_e) — 主題: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。）。
- [ABC228 E「Integer Sequence Fair」](https://atcoder.jp/contests/abc228/tasks/abc228_e) — 主題: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。）。追加で学ぶ技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。追加で学ぶ技能: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 周期性による候補時刻の圧縮と単調判定の二分探索を前提に、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。リールと時刻の一対一対応を二部matchingで判定することが主題。

## 根拠

- [ABC228 E 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_e)
- [ABC228 E 公式解説](https://atcoder.jp/contests/abc228/editorial/2932)
- [ABC286 F 公式解説](https://atcoder.jp/contests/abc286/editorial/5588)
- [ABC286 F 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC319 E 公式問題文](https://atcoder.jp/contests/abc319/tasks/abc319_e)
- [ABC319 E 公式解説](https://atcoder.jp/contests/abc319/editorial/7100)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-modular-periodicity`
