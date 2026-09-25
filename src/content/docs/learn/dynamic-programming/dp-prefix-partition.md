---
title: "prefix分割DP"
description: "「prefix分割DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 64
---

# prefix分割DP

習得対象の目安: **水色（1200–1599）**。最後の切れ目を固定し、漏れと重複のない分割の漸化式を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### prefix分割DP

列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。

dp[r]をprefix [0,r)の答えとし、最後のブロック[l,r)を固定してdp[l]から遷移する。分割を一意に最後の切れ目へ対応させると、漏れ・重複のない漸化式になる。依存は短いprefixから長いprefixへ向かう。

ABC285 Eでは休日間の平日ブロックの価値を前計算する。ABC288 Fでは最後の数の桁を一つ延ばす式を用いて全切れ目の和をまとめる。区間合成と違い、最後のブロック自体を同種の区間DPで解くとは限らない。

ABC234 Gではdp[i]=Σ_{j<i}dp[j]·(max A[j,i)−min A[j,i))。最後の区間の寄与をmaxとminへ分け、各切れ目jの重みdp[j]を極値が等しい連続群ごとに単調stackへ持つ。右端追加で極値が更新される群をまとめて併合するため、各要素は高々一度push・popされる。

ABC374 Fでは、出荷を前へ詰めても待ち時間が悪化しないことから、出荷時刻をT_i+kXへ限定する。到着順に先頭から何個を出荷済みかと、候補時刻を状態にして、次の荷物のブロックを出荷するDPへ進む。候補を残してよい証明を先に行い、時刻差には圧縮順位でなく元の時刻を使う。

### 習得する技能

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: なし。

DPの最小十分状態で得た考え方と実装を再利用し、prefix分割DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC285 E「Work or Rest」](https://atcoder.jp/contests/abc285/tasks/abc285_e) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC230 F「Predilection」](https://atcoder.jp/contests/abc230/tasks/abc230_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。 最後の切れ目jを列挙するdp[i]=Σ_{j<i}dp[j] value(j+1..i)にvalue=10·旧value+d_iを代入する。dp[0]=1,dp[1]=d_1を初期値とし、i≥2ではdp[i]=10dp[i−1]+d_iΣ_{j<i}dp[j]となる。前答えと累積和だけでO(N)。
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC230 F 公式解説](https://atcoder.jp/contests/abc230/editorial/91)
- [ABC230 F 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_f)
- [ABC234 G 公式解説](https://atcoder.jp/contests/abc234/editorial/3227)
- [ABC234 G 公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_g)
- [ABC262 H 公式解説](https://atcoder.jp/contests/abc262/editorial/4481)
- [ABC262 H 公式問題文](https://atcoder.jp/contests/abc262/tasks/abc262_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-dp-prefix-partition`
