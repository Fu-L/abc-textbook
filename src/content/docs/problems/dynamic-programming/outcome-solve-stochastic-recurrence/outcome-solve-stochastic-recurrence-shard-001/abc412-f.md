---
title: "ABC412-F — Socks 4"
draft: true
authoringUnit: {"problemId":"abc412-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc412-f.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-greedy-exchange","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration","tag-greedy-exchange-order","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55","source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"外の一足を戻した総数 a_i とタンス総数 S=Σa−1は保持色に依らない。二色なら総数の大きい色を保持する方が成功確率と将来選択で劣らない。sort後、保持色iより小さい色のdrawは自己ループ、大きい色jは状態jへ、同色a_i−1枚は終了。E_i=1+(prefixLess/S)E_i+Σ_{j>i}(a_j/S)E_jを移項した式を逆順に計算する。同数色の固定tie順による片方向遷移も実際の最適方策を表す。","sourceRevisionIds":["source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55","source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"タンス枚数A=(1,2)、外の色C=1。","procedure":["戻した総数は(2,2)、S=3。","同じ総数なのでどちらを保持しても次drawの同色成功確率1/3。","失敗後も成功確率1/3で E=1+(2/3)E。"],"executionTarget":null,"expectedResult":"期待回数3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"prerequisiteIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-greedy-exchange","unit-modular-arithmetic"],"attainmentCondition":"外の一足を加えず(1,2)を総数とすると何を誤るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"保持色1の同色成功枚数を0と見なしてしまう。元Aはタンス内だけの数で、状態間の総数不変条件には外の一足も必要。"},"answer":{"reasoningOrVerification":"保持色1の同色成功枚数を0と見なしてしまう。元Aはタンス内だけの数で、状態間の総数不変条件には外の一足も必要。","procedure":["具体例の各状態・寄与を再計算する。","保持色1の同色成功枚数を0と見なしてしまう。元Aはタンス内だけの数で、状態間の総数不変条件には外の一足も必要。"],"expectedResult":"保持色1の同色成功枚数を0と見なしてしまう。元Aはタンス内だけの数で、状態間の総数不変条件には外の一足も必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

初めに外へ出ている色 C の一足を総数へ戻して数えると、各色総数 A_i とタンス内総数 S=ΣA_i-1 は、どの色を保持していても一定になる。 二色を外に持ったときは総数の多い色を保持するのが最適で、同数なら固定順でtie-breakできる。Aを昇順に並べれば状態遷移は現在色より大きい添字へのみ変化する。 j<iを引いた場合は多い色iを保持して同じdp_iへ戻り、j=iなら即終了、j>iならjを保持して既計算dp_jへ移る。 X_i=Σ_{j<i}A_j/S、Y_i=Σ_{j>i}A_jdp_j/S とすれば dp_i=(1+Y_i)/(1-X_i)。iを一つ下げる更新は累積和の一項追加・削除だけである。

採用する候補: 色iを保持中の残りdraw期待値 dp_i を、A_i昇順でiの降順に解く期待値DP

dp_i=1+Σ_{j<i}(A_j/S)dp_i+Σ_{j>i}(A_j/S)dp_j を移項し、prefix A和とsuffix A_jdp_j和を差分管理すればsort後O(N)で求まる。

棄却する候補: 現在の保持色から全draw色への Bellman 方程式を密行列として解く

N状態の一般連立方程式にすると三次時間・二次memoryとなり、最適保持規則による上三角な依存を使っていない。

j<iを引いた場合は多い色iを保持して同じdp_iへ戻り、j=iなら即終了、j>iならjを保持して既計算dp_jへ移る。

X_i=Σ_{j<i}A_j/S、Y_i=Σ_{j>i}A_jdp_j/S とすれば dp_i=(1+Y_i)/(1-X_i)。iを一つ下げる更新は累積和の一項追加・削除だけである。

元のA_Cを1増やし、(A_i,固定tie順,元id)をsortしてCの新indexを記録する。S=ΣA-1、prefix sumを作り、i=N..1で dp_i=(1+suffixWeighted/S)/(1-prefix[i-1]/S) を計算後 suffixWeighted+=A_i dp_i とする。初期色のdpを出力する。

## 典型の発動条件

### 期待値DPの自己loop消去

発動条件: 一step後に同じ状態へ戻る確率を含む期待時間を求めるとき。

dp=1+qdp+r を (1-q)dp=1+r と移項する。

### 状態順序を作る貪欲方策

発動条件: 二候補から将来期待時間を小さくする一方を保持し、状態遷移を単調化できるとき。

総数順に色を並べ、多い色だけへ状態が上がるようにする。

### prefix/suffix集計

発動条件: 各iで左側の係数和と右側の重み付きDP和が必要なとき。

prefix Aと降順更新のsuffixWeightedで二重和を消す。

## 問題固有の要素

保持中の一足を総数へ含めると、タンス内総数と色の比較尺度が状態によらず固定され、期待値式が三角化する。

別の問題へ持ち帰る視点: 状態により母集団が一個だけ欠ける抽選では、その要素を含む固定総数へ正規化して分母と順位を共通化する。

## 正当性

外の一足を戻した総数 a_i とタンス総数 S=Σa−1は保持色に依らない。二色なら総数の大きい色を保持する方が成功確率と将来選択で劣らない。sort後、保持色iより小さい色のdrawは自己ループ、大きい色jは状態jへ、同色a_i−1枚は終了。E_i=1+(prefixLess/S)E_i+Σ_{j>i}(a_j/S)E_jを移項した式を逆順に計算する。同数色の固定tie順による片方向遷移も実際の最適方策を表す。

## 実装上の注意

- 増やした後の色Cをsort後も追跡し、同数色のtie-breakを一貫させる。Sと1-X_iの逆元が取れること、A_i-1枚の同色drawは終了項であることを確認する。

## 復習の核

- N=1、初期色が最小／最大、同数色、二色だけの例を有限Markov方程式またはsimulationと比較する。

## 計算量と制約

### 時間

色数 N。sort O(N log N)、suffix和による期待値DP O(N)。

### 空間

色の対応、prefix、DPで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq C \leq N; 1 \leq A_i \leq 3000; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

タンス枚数A=(1,2)、外の色C=1。

1. 戻した総数は(2,2)、S=3。
2. 同じ総数なのでどちらを保持しても次drawの同色成功確率1/3。
3. 失敗後も成功確率1/3で E=1+(2/3)E。

期待される結果: 期待回数3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

外の一足を加えず(1,2)を総数とすると何を誤るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

保持色1の同色成功枚数を0と見なしてしまう。元Aはタンス内だけの数で、状態間の総数不変条件には外の一足も必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/editorial/13390) — source-abc412-editorial-13390-b263d8539d08b58d21d500d328245a667f0c65f8ff96b3109417e134c1f30b55
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/tasks/abc412_f) — source-abc412-f-problem-352d09bec1db82606463a985d7fc1f10a75f6f5ef3246f6d36c1e8401ccd6787
