---
title: "ABC310-F — Make 10 Again"
draft: true
authoringUnit: {"problemId":"abc310-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc310-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc310-editorial-6791-97d7f1f412ee6d6ce11c3eafc9a45b2eaebd6163518981c398bb324443a75b07","source-abc310-f-problem-ceb440da4cd164253e7b55de56ad6496baf85705d667d8b4ba231f4a76ace7cf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"maskはprefix出目から作れる0..10部分和集合。出目xを使わない旧和と使う旧和+xをORすれば新集合が厳密。x>10は正数なので目標≤10を作れずmask不変。各出目確率を配り最後bit10状態を合計すると存在確率。","sourceRevisionIds":["source-abc310-editorial-6791-97d7f1f412ee6d6ce11c3eafc9a45b2eaebd6163518981c398bb324443a75b07","source-abc310-f-problem-ceb440da4cd164253e7b55de56ad6496baf85705d667d8b4ba231f4a76ace7cf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、A=(5,5)、各diceは1..5等確率。","procedure":["一個では和10不可。","二個のsubsetで10を作るには両出目5。","確率(1/5)²。"],"executionTarget":null,"expectedResult":"1/25","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-state"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"prerequisiteIds":["unit-dp-state-design","unit-dp-stochastic","unit-modular-arithmetic"],"attainmentCondition":"部分和bit更新をmask<<xだけにしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。新diceを使わないsubsetも必要なので旧maskをORする。"},"answer":{"reasoningOrVerification":"不可。新diceを使わないsubsetも必要なので旧maskをORする。","procedure":["具体例の各状態・寄与を再計算する。","不可。新diceを使わないsubsetも必要なので旧maskをORする。"],"expectedResult":"不可。新diceを使わないsubsetも必要なので旧maskをORする。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

必要なのは選んだ出目の和が 10 になるかだけなので、到達可能和 0..10 より大きい情報は将来も 10 を作る助けにならない。 各サイコロ後の到達可能集合は 11 bit で表せ、出目 x を追加した集合は S | (S<<x) の下位 11 bit で一意に決まる。 x>10 の出目は非負和 10 以下を新しく作らないため、A_i−10 通りを状態不変の一本の遷移へ合算できる。 確率を法上で扱うとき、各出目の等確率 1/A_i を逆元として掛ければ通常の加算 DP になる。

採用する候補: 到達可能和集合の bitmask ごとの確率を持つ DP を行い、各出目による shift-or を遷移させる。

状態数は 2^11、意味のある出目も 1..10 と「10超」の一群にまとめられ、N=100 で十分小さい。

棄却する候補: 全サイコロの出目を列挙して、各結果に部分和 10 があるか subset sum で調べる。

出目の直積が巨大であり、A_i が最大 10^6 なので列挙不能である。

x>10 の出目は非負和 10 以下を新しく作らないため、A_i−10 通りを状態不変の一本の遷移へ合算できる。

確率を法上で扱うとき、各出目の等確率 1/A_i を逆元として掛ければ通常の加算 DP になる。

初期 mask は bit0 のみ。各 i で全 mask と x=1..min(A_i,10) を走査し、next=mask|((mask<<x)&((1<<11)−1)) へ dp/A_i を加える。A_i>10 なら mask 自身へ (A_i−10)dp/A_i を加え、最後に bit10 が立つ確率を合計する。

## 典型の発動条件

### subset sum 可否集合の bitset 表現

発動条件: 部分集合和の目標値が小さく、要素を順に追加する過程を状態化するとき。

可能和集合を shift と OR で更新し、その集合自体を bitmask DP の状態にする。

### 同一遷移を生む確率事象の集約

発動条件: 乱択結果の種類は多いが、多数の結果が DP 上で同じ次状態へ移るとき。

10 を超える出目を状態不変遷移として個数重みでまとめる。

## 問題固有の要素

目標がちょうど 10 で出目が正なので、10 を超えた部分和は切り捨てても二度と必要にならない。

別の問題へ持ち帰る視点: 小さい目標値の存在判定では、単調に増える量なら目標超過状態を安全に捨てられるか確認する。

## 正当性

maskはprefix出目から作れる0..10部分和集合。出目xを使わない旧和と使う旧和+xをORすれば新集合が厳密。x>10は正数なので目標≤10を作れずmask不変。各出目確率を配り最後bit10状態を合計すると存在確率。

## 実装上の注意

- bit0 は空集合として常に保持し、shift 後を 11 bit に mask する。A_i>10 の余剰出目数が負にならないよう場合分けする。

## 復習の核

- 確率DPでは、個々の出目ではなく「同じ次状態になる出目の個数」を数える。目標値より大きい出目が本当に無作用か、値の符号と再利用可否まで確認する。

## 計算量と制約

### 時間

N dice、合計上限10。状態2^11、意味ある出目10個で O(10N2^11)。

### 空間

rolling mask分布 O(2^11)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; 1 \leq A_i \leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、A=(5,5)、各diceは1..5等確率。

1. 一個では和10不可。
2. 二個のsubsetで10を作るには両出目5。
3. 確率(1/5)²。

期待される結果: 1/25

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

部分和bit更新をmask<<xだけにしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。新diceを使わないsubsetも必要なので旧maskをORする。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/editorial/6791) — source-abc310-editorial-6791-97d7f1f412ee6d6ce11c3eafc9a45b2eaebd6163518981c398bb324443a75b07
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/tasks/abc310_f) — source-abc310-f-problem-ceb440da4cd164253e7b55de56ad6496baf85705d667d8b4ba231f4a76ace7cf
