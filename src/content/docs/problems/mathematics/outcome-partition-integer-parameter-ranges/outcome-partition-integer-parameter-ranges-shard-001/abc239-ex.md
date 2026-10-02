---
title: "ABC239-EX — Dice Product 2"
draft: true
authoringUnit: {"problemId":"abc239-ex","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc239-ex.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc239-editorial-3357-54463da08e324651d0050c5b6c170c4021d501f36f2649802462363b16ca18dd","source-abc239-ex-problem-13680a65b0b6c1c57a37d580471b16ddc14afd764ec4d8b683c581db1f284e94"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"積pの後に掛けられる上限x=floor(M/p)が将来を全て決める。出目1の自己ループを移項するとf(x)=(N+Σ_{i=2}^N f(floor(x/i)))/(N−1)。i≥2では状態が減るので再帰が停止する。同じ商を持つ区間の項は同値なため個数を掛けてまとめても和は変わらず、商集合の閉性でmemoが全必要状態を網羅する。","sourceRevisionIds":["source-abc239-editorial-3357-54463da08e324651d0050c5b6c170c4021d501f36f2649802462363b16ca18dd","source-abc239-ex-problem-13680a65b0b6c1c57a37d580471b16ddc14afd764ec4d8b683c581db1f284e94"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、M=2。","procedure":["f(1)=2/(2−1)=2。","f(2)=(2+f(1))/(2−1)=4。"],"executionTarget":null,"expectedResult":"期待回数4。","verificationStatus":"not_applicable","learningUnitIds":["unit-integer-boundary-blocks"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"prerequisiteIds":["unit-dp-stochastic","unit-modular-arithmetic"],"attainmentCondition":"i=1を商区間loopへ含めると何が起きるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"i=2から走査。"},"answer":{"reasoningOrVerification":"f(x)が自身を再帰呼出しする。移項した自己ループを重ねて数えることにもなる。","procedure":["具体例の各状態・寄与を再計算する。","f(x)が自身を再帰呼出しする。移項した自己ループを重ねて数えることにもなる。"],"expectedResult":"i=2から走査。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 素因数指数による整数条件の分解。

## 考察

現在値そのものを状態にすると M 個必要だが、現在の積 p から停止せず掛けられる上限 x=floor(M/p) だけで未来は決まる。出目 i の後はこの上限が floor(x/i) へ移る。

出目1では状態 x に留まる自己ループがあるため、期待値式の f(x) を右辺から移項すると f(x)=(N+Σ_{i=2}^N f(floor(x/i)))/(N-1) になる。

採用する候補: floor(x/i) が同じになる出目区間をまとめ、f(M) から必要になった商状態だけを memoize する。

一状態の和を quotient block ごとに計算でき、再帰で現れる状態も floor(M/d) の形に閉じて約平方根個に限られる。

棄却する候補: 各状態 x で出目1..Nを全て走査し、x=0..M の期待値を順に計算する。

N,M はともに10^9まであり、状態数も一状態の遷移数も列挙できない。

floor(floor(M/i)/j)=floor(M/(ij)) なので、memo 再帰を何段進めても引数は M をある正整数で割った商になり、新しい任意の整数状態は現れない。

l を区間先頭、q=floor(x/l) とすれば同じ商を持つ末尾は floor(x/q) であり、N までに切って multiplicity を一括加算できる。

f(0)=0 とし、未計算の x では i=2 から min(N,x) までを quotient block [l,r] に分け、(r-l+1)f(floor(x/l)) を加える。N とこの和を足して N-1 の法逆元を掛け、map に memoize して f(M) を返す。

## 典型の発動条件

### 商が一定な区間の一括処理

発動条件: Σ f(floor(n/i)) のように切り捨て商だけが遷移先を決めるとき。

次の境界 r=floor(n/floor(n/l)) を使って同じ商の係数をまとめる。

### 期待値 DP の自己ループ除去

発動条件: 確率遷移に同じ状態へ戻る結果が含まれるとき。

自己遷移確率を左辺へ移し、未確定の f(x) が右辺に残らない式へ解く。

## 問題固有の要素

積の進行を残り許容倍率 floor(M/p) へ反転すると、掛け算が切り捨て除算の遷移になり、商集合の少なさを使える。

別の問題へ持ち帰る視点: 値が単調に乗算される過程では、閾値までの余裕を商で表すと状態圧縮できないか考える。

## 正当性

積pの後に掛けられる上限x=floor(M/p)が将来を全て決める。出目1の自己ループを移項するとf(x)=(N+Σ_{i=2}^N f(floor(x/i)))/(N−1)。i≥2では状態が減るので再帰が停止する。同じ商を持つ区間の項は同値なため個数を掛けてまとめても和は変わらず、商集合の閉性でmemoが全必要状態を網羅する。

## 実装上の注意

- i=1 の自己ループを quotient loop に含めない。i>x の項は f(0)=0 なので省略でき、block 末尾は min(N,floor(x/q)) とする。係数と期待値は法10^9+7で正規化する。

## 復習の核

- N=2 の式で出目1のやり直しを左辺へ移し f(1)=2 を導いてから、nested floor が一つの除数積へ潰れることを再確認する。

## 計算量と制約

### 時間

O(Σ_{x∈Q}√x)≤O(M^{3/4})を上界とする。Q={floor(M/d)}で、各状態を商区間走査する。

### 空間

O(√M)。商状態のmemo表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^9; 1 \leq M \leq 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、M=2。

1. f(1)=2/(2−1)=2。
2. f(2)=(2+f(1))/(2−1)=4。

期待される結果: 期待回数4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

i=1を商区間loopへ含めると何が起きるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

f(x)が自身を再帰呼出しする。移項した自己ループを重ねて数えることにもなる。

確認結果: i=2から走査。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/editorial/3357) — source-abc239-editorial-3357-54463da08e324651d0050c5b6c170c4021d501f36f2649802462363b16ca18dd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/tasks/abc239_h) — source-abc239-ex-problem-13680a65b0b6c1c57a37d580471b16ddc14afd764ec4d8b683c581db1f284e94
