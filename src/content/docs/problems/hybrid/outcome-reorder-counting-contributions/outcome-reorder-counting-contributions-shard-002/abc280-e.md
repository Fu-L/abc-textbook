---
title: "ABC280-E — Critical Hit"
draft: true
authoringUnit: {"problemId":"abc280-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc280-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc280-e-problem-807c8d0a6a65d9a4c82bd33ed9d4d15a6823625f3fd1d04ea08e8a090568d44b","source-abc280-editorial-5331-861bf62d3f05c27dcf8ce95804bba4fd96267d2b7c980f9b95d2bfc1149a1916"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"iを訪れない唯一の形はi-1を訪れた直後にdamage2で飛び越すことなので、p_i=1-q p_{i-1}（q=P/100）となる。 停止までの攻撃回数はdamage level 0,…,N-1のうち実際に訪れたlevel数に一致し、期待値の線形性で訪問確率の和になる。 期待停止時刻を各threshold訪問indicatorの和へ分解し、1次元の定数遷移だけで計算できる。","sourceRevisionIds":["source-abc280-e-problem-807c8d0a6a65d9a4c82bd33ed9d4d15a6823625f3fd1d04ea08e8a090568d44b","source-abc280-editorial-5331-861bf62d3f05c27dcf8ce95804bba4fd96267d2b7c980f9b95d2bfc1149a1916"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md) — 状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

攻撃列のdamage累積は1または2ずつ狭義増加し、N damage以上に初めて達する攻撃回数が求める停止時刻である。

threshold iとi+1へ到達する攻撃回数の差は0か1で、その期待差は累積damageがちょうどiを訪れる確率になる。

採用する候補: damage累積がちょうどiを訪れる確率p_iを漸化式p_0=1,p_i=1-(P/100)p_{i-1}で求め、Σ_{i=0}^{N-1}p_iを取る。

棄却する候補: 攻撃回数ごとに残りstaminaの全確率分布を更新し、終了確率から期待値を合計する。

解けるが二次元分布を持つ必要がなく、訪問確率の一次元recurrenceより状態が多い。

q=P·inv(100)を法上で作り、p=1,ans=0からi=0,…,N-1でans+=p、p=1-q·pと更新する。最後のansを998244353で出力する。

## 典型の発動条件

### 停止時刻のtail/indicator和

発動条件: 単調過程がthresholdへ達するまでのstep期待値を求めるとき。

各中間levelを訪れたindicatorの和として停止回数を表し、期待値を足す。

### overshootの補事象recurrence

発動条件: step幅が小さく、特定levelを飛び越す経路が直前levelからの1patternに限られるとき。

訪問失敗を直前訪問×長step確率として更新する。

## 問題固有の要素

damageが1/2だけなのでlevel iを飛ばすにはi-1から2を出すしかなく、訪問確率が1つ前だけで閉じる。

別の問題へ持ち帰る視点: 単調random walkのhit確率では、最大step幅からovershoot直前の候補状態数を調べる。

## 正当性

iを訪れない唯一の形はi-1を訪れた直後にdamage2で飛び越すことなので、p_i=1-q p_{i-1}（q=P/100）となる。 停止までの攻撃回数はdamage level 0,…,N-1のうち実際に訪れたlevel数に一致し、期待値の線形性で訪問確率の和になる。 期待停止時刻を各threshold訪問indicatorの和へ分解し、1次元の定数遷移だけで計算できる。

## 実装上の注意

- p_iをanswerへ足してからp_{i+1}へ更新し、0からN-1までちょうどN項を合計する。
- P=0,100でも同じ式が使えることを小例で確認し、負剰余1-q·pを正規化する。

## 復習の核

- p_0=1,p_1=1-q,p_2=1-q(1-q)をpathで列挙し、『iを飛ばす』補事象が重複しない理由を確認する。

## 計算量と制約

### 時間

O(N)、訪問確率p_iの一次漸化式。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq P \leq 100; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/tasks/abc280_e) — source-abc280-e-problem-807c8d0a6a65d9a4c82bd33ed9d4d15a6823625f3fd1d04ea08e8a090568d44b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/editorial/5331) — source-abc280-editorial-5331-861bf62d3f05c27dcf8ce95804bba4fd96267d2b7c980f9b95d2bfc1149a1916
