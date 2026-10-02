---
title: "ABC266-E — Throwing the Die"
draft: true
authoringUnit: {"problemId":"abc266-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc266-e.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc266-e-problem-b4078f3a25c0f7222945ea73787db8dea7832e63499ac27ff98aeab7b4f4bb5c","source-abc266-editorial-4662-d09848e18c64c28b2b8aa10f7b697eaec58d646a27870109e976be8eb7c9cb8f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"出目xを見た後、停止価値xと残り試行の最適期待値fの最大を選べる。各出目の条件付き最適を平均すれば一回追加した最適期待値。最終一回の平均3.5から試行数の帰納法で正しい。","sourceRevisionIds":["source-abc266-e-problem-b4078f3a25c0f7222945ea73787db8dea7832e63499ac27ff98aeab7b4f4bb5c","source-abc266-editorial-4662-d09848e18c64c28b2b8aa10f7b697eaec58d646a27870109e976be8eb7c9cb8f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"最大2回の6面dice。","procedure":["残り1回期待3.5。","一回目1,2,3なら振り直し、4,5,6なら停止。","期待(3×3.5+4+5+6)/6。"],"executionTarget":null,"expectedResult":"4.25","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"E[max(x,f)]をmax(E[x],f)へ交換できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"できない。出目を観測して行動を変えられる利益を失う。二回例で4.25が3.5へ落ちる。"},"answer":{"reasoningOrVerification":"できない。出目を観測して行動を変えられる利益を失う。二回例で4.25が3.5へ落ちる。","procedure":["具体例の各状態・寄与を再計算する。","できない。出目を観測して行動を変えられる利益を失う。二回例で4.25が3.5へ落ちる。"],"expectedResult":"できない。出目を観測して行動を変えられる利益を失う。二回例で4.25が3.5へ落ちる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

続行を選ぶと過去の出目は最終scoreに残らないため、将来の最適期待値は残りturn数だけで決まる。 現在の出目xを見た後は、今終了してxを得るか、残りturnの最適期待値を得るかの大きい方を選べる。 最適方策は出目xが継続価値f(n−1)以上なら終了し、未満なら続行するthreshold ruleになる。

棄却する候補: 全ての出目履歴と各時点の終了・続行判断を決定木として列挙する。

履歴数が6^Nに増える一方、過去履歴は続行後の価値へ影響しない。

採用する候補: f(n)を残りn回での最適期待値とし、f(n)=Σ_{x=1}^6 max(x,f(n−1))/6 を小さいnから計算する。

出目を観測した後の最適行動を各xで独立に選び、その条件付き価値を平均すればよい。

最適方策は出目xが継続価値f(n−1)以上なら終了し、未満なら続行するthreshold ruleになる。

有限期限optimal stoppingをBellman value iterationにし、観測後のstop payoffとcontinuation valueの最大を取る。

## 典型の発動条件

### 有限期限の最適停止DP

発動条件: 各stepで確率結果を観測してから終了か続行を選び、期限が固定されているとき。

残りstep数の価値を状態にし、各観測結果で即時報酬と継続価値の最大を平均する。

## 問題固有の要素

N=1では強制終了なのでf(1)=3.5となり、同じ漸化式をf(0)=0から始めてもこの基底を自然に得られる。

別の問題へ持ち帰る視点: 期限付き停止問題は残り0stepの継続価値を定義すると基底と遷移を統一できる。

## 正当性

出目xを見た後、停止価値xと残り試行の最適期待値fの最大を選べる。各出目の条件付き最適を平均すれば一回追加した最適期待値。最終一回の平均3.5から試行数の帰納法で正しい。

## 実装上の注意

- doubleでN回更新し、各回で1から6までのmaxを加えて6で割る。
- 十分な小数桁を出力して絶対・相対誤差10^{-6}を満たす。

## 復習の核

- 最適停止では、続行後に過去情報が残るかを確認し、残らないなら残り期限だけへ状態を圧縮する。
- 判断が確率結果の観測後なら、期待値を取る前に各結果でmaxを取る順序を守る。

## 計算量と制約

### 時間

再抽選上限N、dice6面。Bellman更新 O(6N)=O(N)。

### 空間

直前期待値 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

最大2回の6面dice。

1. 残り1回期待3.5。
2. 一回目1,2,3なら振り直し、4,5,6なら停止。
3. 期待(3×3.5+4+5+6)/6。

期待される結果: 4.25

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

E[max(x,f)]をmax(E[x],f)へ交換できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

できない。出目を観測して行動を変えられる利益を失う。二回例で4.25が3.5へ落ちる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/tasks/abc266_e) — source-abc266-e-problem-b4078f3a25c0f7222945ea73787db8dea7832e63499ac27ff98aeab7b4f4bb5c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/editorial/4662) — source-abc266-editorial-4662-d09848e18c64c28b2b8aa10f7b697eaec58d646a27870109e976be8eb7c9cb8f
