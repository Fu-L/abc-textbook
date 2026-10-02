---
title: "ABC275-E — Sugoroku 4"
draft: true
authoringUnit: {"problemId":"abc275-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc275-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc275-e-problem-b97561aecbcc89972a79e16233b56c34864be19f2cce5013fb79a717c8681b35","source-abc275-editorial-5116-c768f7063a150fe8d31d4a09abf16de832b93f5fad9ef4ef79a9903135411754"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非終端状態から全diceを1/Mで配り、超過は問題の反射式へ写すと一手の遷移確率を厳密に表す。到達時だけ答えへ加え終端からは再配布しないのでK手以内の初到達事象を重複なく合計する。","sourceRevisionIds":["source-abc275-e-problem-b97561aecbcc89972a79e16233b56c34864be19f2cce5013fb79a717c8681b35","source-abc275-editorial-5116-c768f7063a150fe8d31d4a09abf16de832b93f5fad9ef4ef79a9903135411754"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-propagate-probability-distribution"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,M=2,K=2。","procedure":["一手後位置1,2各1/2。","二手目1からdice2でgoal、2からdice1でgoal。","各経路確率1/4を足す。"],"executionTarget":null,"expectedResult":"1/2","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-propagate-probability-distribution"],"prerequisiteIds":["unit-dp-state-design","unit-modular-arithmetic"],"attainmentCondition":"goal確率を毎手答えへ加えつつgoalからも遷移すると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"終了済み事象を後の手数でも数えて二重計上する。終端は展開しない。"},"answer":{"reasoningOrVerification":"終了済み事象を後の手数でも数えて二重計上する。終端は展開しない。","procedure":["具体例の各状態・寄与を再計算する。","終了済み事象を後の手数でも数えて二重計上する。終端は展開しない。"],"expectedResult":"終了済み事象を後の手数でも数えて二重計上する。終端は展開しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

N,M,K≤1000 だが M^K 個の出目列は列挙できない。一方、次の位置は現在位置と出目だけで決まり、勝利前の位置は 0,…,N-1 の有限状態である。 M≤N なので j+d は高々 2N-1 で、N を越えた場合の到着位置は 2N-(j+d) と一度の反射で表せる。 ゲームは N 到着時に終了するため、N の確率を次の回へ配らず、その時点で累積答えへ移すと『高々 K 回』を重複なく数えられる。 確率は法 998244353 上で扱え、各等確率遷移はあらかじめ求めた M の逆元を掛ければよい。

採用する候補: 回数 i と勝利前の位置 j の確率 DP を行い、各出目へ 1/M ずつ遷移し、N に着いた確率を回数ごとに答えへ加える。

同じ回数・位置以後の確率過程を共有でき、終了後の不要な遷移も避けられる。

棄却する候補: 長さ 1,…,K のルーレット出目列を全列挙し、初めて N に着く列を数える。

候補数が M^K で、M≤10 でも K≤1000 には適用できない。

ゲームは N 到着時に終了するため、N の確率を次の回へ配らず、その時点で累積答えへ移すと『高々 K 回』を重複なく数えられる。

確率は法 998244353 上で扱え、各等確率遷移はあらかじめ求めた M の逆元を掛ければよい。

dp[0][0]=1 とし、i=0,…,K-1 で j<N と d=1,…,M を走査する。t=j+d が N 以下なら t、超えるなら 2N-t へ invM 倍を配り、t=N の分だけ答えに加える。

## 典型の発動条件

### 有限 Markov 過程の確率 DP

発動条件: 試行回数に上限があり、次状態が現在状態とランダムな結果だけで決まるとき。

回数×盤面位置に確率を集約し、等確率の出目へ分配する。

### 吸収時刻の累積

発動条件: 目標状態へ初めて到着した時点で過程が終了し、上限回数以内の成功確率を求めるとき。

目標への遷移確率を答えへ足し、目標状態からは遷移させない。

## 問題固有の要素

折り返し移動も M≤N により一度の反射式だけで閉じるので、特殊な盤面履歴を持たず位置 DP にできる。

別の問題へ持ち帰る視点: 反射・周期移動では、一手の最大幅から折返し回数を評価し、次状態の正規化式を先に作る。

## 正当性

非終端状態から全diceを1/Mで配り、超過は問題の反射式へ写すと一手の遷移確率を厳密に表す。到達時だけ答えへ加え終端からは再配布しないのでK手以内の初到達事象を重複なく合計する。

## 実装上の注意

- M の逆元は一度だけ計算し、各遷移で冪乗を呼ばない。
- N に着いた確率を dp の次 layerにも残す実装と累積加算を併用すると重複するため、どちらか一方の意味に統一する。

## 復習の核

- N=2,M=2,K=1 の直接到着と、N=4で 3 から出目4が1へ反射する遷移を手計算し、吸収確率の扱いを確認する。

## 計算量と制約

### 時間

盤面終点N、dice M面、手数K。O(KNM)。

### 空間

rolling位置確率 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: M \leq N \leq 1000; 1 \leq M \leq 10; 1 \leq K \leq 1000; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,M=2,K=2。

1. 一手後位置1,2各1/2。
2. 二手目1からdice2でgoal、2からdice1でgoal。
3. 各経路確率1/4を足す。

期待される結果: 1/2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

goal確率を毎手答えへ加えつつgoalからも遷移すると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

終了済み事象を後の手数でも数えて二重計上する。終端は展開しない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/tasks/abc275_e) — source-abc275-e-problem-b97561aecbcc89972a79e16233b56c34864be19f2cce5013fb79a717c8681b35
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/editorial/5116) — source-abc275-editorial-5116-c768f7063a150fe8d31d4a09abf16de832b93f5fad9ef4ef79a9903135411754
