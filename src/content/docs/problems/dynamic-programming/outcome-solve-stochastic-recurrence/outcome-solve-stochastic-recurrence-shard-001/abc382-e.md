---
title: "ABC382-E — Expansion Packs"
draft: true
authoringUnit: {"problemId":"abc382-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc382-e.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-resource"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-knapsack-resource"],"sourceRevisionIds":["source-abc382-e-problem-cada6e51e9f885d9c7388f9f82fbbc352ce0221cb90919bc0c7a3f43f1288ec4","source-abc382-editorial-11483-80a132d8f84c3778cfcddf11c6c3dfc6b0ab8e23bcda3deb951f31b6b3aa827c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"独立各カードの成功率からpack成功枚数gをconvolutionで求める。残りi枚のBellman式f_i=1+g0f_i+Σ_{j≥1}g_j f_max(i−j,0)を移項し、依存先が小さい期待値へ変わる。昇順計算が最適でなく固定過程の厳密期待値を返す。","sourceRevisionIds":["source-abc382-e-problem-cada6e51e9f885d9c7388f9f82fbbc352ce0221cb90919bc0c7a3f43f1288ec4","source-abc382-editorial-11483-80a132d8f84c3778cfcddf11c6c3dfc6b0ab8e23bcda3deb951f31b6b3aa827c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=1、当たり確率1/2、X=2。","procedure":["g0=g1=1/2。","f1=(1+0)/0.5=2。","f2=(1+0.5×2)/0.5=4。"],"executionTarget":null,"expectedResult":"期待4pack","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"prerequisiteIds":["unit-dp-state-design","unit-dp-subset-resource"],"attainmentCondition":"0枚packを無視して1packとして数えないと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"待ち時間を落とす。0枚も一回購入費用1を払い自己loopするので1−g0で割る。"},"answer":{"reasoningOrVerification":"待ち時間を落とす。0枚も一回購入費用1を払い自己loopするので1−g0で割る。","procedure":["具体例の各状態・寄与を再計算する。","待ち時間を落とす。0枚も一回購入費用1を払い自己loopするので1−g0で割る。"],"expectedResult":"待ち時間を落とす。0枚も一回購入費用1を払い自己loopするので1−g0で割る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

一パックから得る rare 枚数 J の分布 g_j が分かれば、残り i 枚必要な状態の期待値は次の一回で条件付けできる。ただし J=0 では同じ状態へ戻る自己 loop がある。 f_i=1+Σ_j g_j f_{max(i-j,0)} で j=0 の項だけが f_i 自身なので、(1-g_0) で割れば前向き DP になる。 各カードの rare/normal を畳み込む通常 DP で、一パックの rare 枚数分布 g_0..g_N を正確に得られる。

採用する候補: Poisson-binomial DP で g_j を求め、期待値式の g_0 f_i を左辺へ移項して i=1..X の順に f_i を計算する。

自己 loop を代数的に除けば依存先は f_{i-j} の小さい index だけになり、O(N^2+NX) で解ける。

棄却する候補: 開封回数を上限まで区切り、累積 rare 枚数の確率 DP から期待値を近似する。

停止時刻に有限の確定上限がなく、打切り誤差を正当化できない。

f_i=1+Σ_j g_j f_{max(i-j,0)} で j=0 の項だけが f_i 自身なので、(1-g_0) で割れば前向き DP になる。

各カードの rare/normal を畳み込む通常 DP で、一パックの rare 枚数分布 g_0..g_N を正確に得られる。

確率を double で持ち、カードごとに枚数分布を後ろ向き更新する。f_0=0 とし、各 i で 1+Σ_{j≥1}g_j f[max(i-j,0)] を計算して 1-g_0 で割り、f_X を出力する。

## 典型の発動条件

### 自己 loop を移項する期待値 DP

発動条件: 一回の試行で進まない確率があり、停止までの期待回数を求めるとき。

同状態項を左辺へ移して DAG 依存へ直す。

## 問題固有の要素

無限反復の期待値でも、一試行分の分布と残り必要量だけで Markov 状態が閉じる。

別の問題へ持ち帰る視点: DP が自分自身を参照したら不可能と決めず、係数を移項して解けるかを見る。

## 正当性

独立各カードの成功率からpack成功枚数gをconvolutionで求める。残りi枚のBellman式f_i=1+g0f_i+Σ_{j≥1}g_j f_max(i−j,0)を移項し、依存先が小さい期待値へ変わる。昇順計算が最適でなく固定過程の厳密期待値を返す。

## 実装上の注意

- P_i≥1より g_0<1 で除算可能である。分布更新は同じカードを二重使用しない順序にし、double の誤差許容を守る。

## 復習の核

- 期待値式を「次の一パック」で条件分けし、j=0 項だけを明示的に左辺へ移すところまで自力で書く。

## 計算量と制約

### 時間

一packカード数N、必要枚数X。pack枚数分布 O(N²)、期待回数 O(NX)。

### 空間

枚数分布O(N)、期待DP O(X)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5000; 1 \leq X \leq 5000; 1 \leq P_i \leq 100; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=1、当たり確率1/2、X=2。

1. g0=g1=1/2。
2. f1=(1+0)/0.5=2。
3. f2=(1+0.5×2)/0.5=4。

期待される結果: 期待4pack

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

0枚packを無視して1packとして数えないと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

待ち時間を落とす。0枚も一回購入費用1を払い自己loopするので1−g0で割る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/tasks/abc382_e) — source-abc382-e-problem-cada6e51e9f885d9c7388f9f82fbbc352ce0221cb90919bc0c7a3f43f1288ec4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/editorial/11483) — source-abc382-editorial-11483-80a132d8f84c3778cfcddf11c6c3dfc6b0ab8e23bcda3deb951f31b6b3aa827c
