---
title: "ABC326-E — Revenge of \"The Salary of AtCoder Inc.\""
draft: true
authoringUnit: {"problemId":"abc326-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc326-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc326-e-problem-826a5d0552e758924802b9b180548c1d4f7f8cd80e3b0db5723f958e890a850b","source-abc326-editorial-7538-cfe2fc8d0501fdbb3376caf6ada2c9b1872bf406e2fe711524bf9960abd1918c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"次のdiceが現在indexより大きい場合だけ継続するため各indexiへ届く確率は過去全到達確率和/N。訪問indexは厳密増加で各報酬一回なので期待報酬はΣA_i p_i。prefix維持がこの和を厳密に共有する。","sourceRevisionIds":["source-abc326-e-problem-826a5d0552e758924802b9b180548c1d4f7f8cd80e3b0db5723f958e890a850b","source-abc326-editorial-7538-cfe2fc8d0501fdbb3376caf6ada2c9b1872bf406e2fe711524bf9960abd1918c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

salary総額は各A_iの支払indicatorの和なので、期待値の線形性によりΣA_i·Pr(A_iが支払われる)で求められる。 A_iが支払われる直前のxは0..i-1のいずれかで、各状態jへ到達した後に出目iを1/Nで出すeventは互いに排反である。 p_jをstate x=jへ到達してA_jを受け取る確率、p_0=1とするとp_i=(1/N)Σ_{j<i}p_jになる。 stateは出目が現在値より大きいときだけ増え、一度訪れたiを再訪しないため、A_iの支払確率とstate iへの到達確率が同じである。 Σ_{j<i}p_jをprefとして持てばp_i=pref/N、続いてpref+=p_iと更新するだけでよい。

採用する候補: 各indexへ到達する確率p_iをprefix sumで更新し、A_i p_iを加える。

strictly increasingなstate遷移を1次元確率DPにし、全過去和を累積値1つで線形計算できる。

棄却する候補: die roll列をterminationまで全列挙してsalaryを平均する。

長さは有限でもroll列の分岐数が指数的である。

棄却する候補: 各stepの期待paymentが一定としてexpected step数を掛ける。

現在xにより支払対象となる出目とpayment A_yが変わり、stepごとの分布は同じでない。

stateは出目が現在値より大きいときだけ増え、一度訪れたiを再訪しないため、A_iの支払確率とstate iへの到達確率が同じである。

Σ_{j<i}p_jをprefとして持てばp_i=pref/N、続いてpref+=p_iと更新するだけでよい。

mod 998244353でinvN=N^{-1}を求め、pref=p_0=1、answer=0とする。i=1..Nでp_i=pref·invN、answer+=A_i·p_i、pref+=p_iと更新する。最後にanswerを正規化して出力する。

## 典型の発動条件

### indicator期待値

発動条件: random過程中に各rewardが高々一度発生し総額がその和になるとき。

各rewardの発生確率を独立に求めて重み付き加算する。

### 単調stateの到達確率DP

発動条件: state indexが遷移ごとにstrictly増加し、前状態から同確率で飛ぶとき。

過去到達確率のprefix sumで次stateを計算する。

## 問題固有の要素

processの終了時刻分布を求めず、各salary項目が一度支払われる確率だけを見ると、停止rollはDP遷移に明示せず自然に確率massから抜ける。

別の問題へ持ち帰る視点: 期待総報酬では過程全体を追うより、各一回限りeventの到達確率へ分解できないか考える。

## 正当性

次のdiceが現在indexより大きい場合だけ継続するため各indexiへ届く確率は過去全到達確率和/N。訪問indexは厳密増加で各報酬一回なので期待報酬はΣA_i p_i。prefix維持がこの和を厳密に共有する。

## 実装上の注意

- p_0=1は実在するpaymentではなく初期state用なのでanswerへA_0を加えない。
- invNはmodがprimeかつN<modなので存在し、一度だけ計算する。

## 復習の核

- N=2で全roll列を短く展開し、p_1=1/2、p_2=(p_0+p_1)/2と停止eventを含む確率が一致するか確認する。

## 計算量と制約

### 時間

報酬列長N。累積確率一値で O(N)。

### 空間

prefix、answerだけ O(1)、入力O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All inputs are integers.; 1 \le N \le 3 \times 10^5; 0 \le A_i < 998244353

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/tasks/abc326_e) — source-abc326-e-problem-826a5d0552e758924802b9b180548c1d4f7f8cd80e3b0db5723f958e890a850b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/editorial/7538) — source-abc326-editorial-7538-cfe2fc8d0501fdbb3376caf6ada2c9b1872bf406e2fe711524bf9960abd1918c
