---
title: "ABC404-F — Lost and Pound"
draft: true
authoringUnit: {"problemId":"abc404-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc404-f.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-normalization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-state-normalization"],"sourceRevisionIds":["source-abc404-editorial-12846-02a4f8e1d277892cd04c396236017ee727c354a0679b96a497b9856107a626f3","source-abc404-f-problem-0177ad06dec4c00128c31966769f7140fae58529868e6963494b7bd013a756ab"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"並べ替え後の当たり位置は N 箇所で一様で、押下中に新情報は得られない。同じ位置を c 回押せば当たりなら回数が c 増え、外れなら不変。従って各位置の押下数だけが一ターンの遷移分布を決める。n個の正押下数を合計Mで割り当てた期待値は、各位置の次ターン勝率の和をNで割ったもの。h[n][s]の加算 knapsack は全正分割を網羅し、未押下N−n箇所の寄与を足す。有限ターンの後退帰納法で最適戦略となる。","sourceRevisionIds":["source-abc404-editorial-12846-02a4f8e1d277892cd04c396236017ee727c354a0679b96a497b9856107a626f3","source-abc404-f-problem-0177ad06dec4c00128c31966769f7140fae58529868e6963494b7bd013a756ab"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,T=1,M=2,K=1。","procedure":["同じ位置を二回なら当たり確率1/2。","二箇所へ一回ずつなら必ず当たりを一回押す。","後者の勝率1を採る。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"prerequisiteIds":["unit-dp-state-design","unit-normalization"],"attainmentCondition":"同じ設定で K=2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"別位置一回ずつでは二回当たりにならず勝率0。同じ位置を二回押せば1/2で勝つため最適1/2。"},"answer":{"reasoningOrVerification":"別位置一回ずつでは二回当たりにならず勝率0。同じ位置を二回押せば1/2で勝つため最適1/2。","procedure":["具体例の各状態・寄与を再計算する。","別位置一回ずつでは二回当たりにならず勝率0。同じ位置を二回押せば1/2で勝つため最適1/2。"],"expectedResult":"別位置一回ずつでは二回当たりにならず勝率0。同じ位置を二回押せば1/2で勝つため最適1/2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

各ターンでボタンは無作為に並べ直され、Takahashi は区別できないため、戦略に影響するのは M 回の押下を各位置へ何回ずつ割り振るかという多重集合だけである。 ターン終了時までの当たり押下回数 k が分かるので、残り勝率は (ターン数 t, k) だけの後ろ向き DP で表せ、k≥K は同一の勝利状態へ丸められる。 配分 c_1+…+c_N=M を固定すると当たりボタンは各位置に確率 1/N なので、期待勝率は (1/N)Σ_i DP[t+1][min(K,k+c_i)] である。 非零のボタン数 n は高々 min(M,N)。正の組成だけの補助 DP''[n][s] と、未使用ボタン (N-n) 個の共通項を組み合わせれば N 次元を消せる。

採用する候補: DP[t][k] を以後の最大勝率とし、各ターンの押下回数配分を正の部分数 n と合計 s の補助 DP で最適化する

正の c_i だけを先頭へ寄せ、未使用 N-n 個の寄与を DP[t+1][k] と分離すれば、N が大きくても n≤M の O(TKM^3) で計算できる。

棄却する候補: N 個の区別されたボタンへの M 回の押し方をすべて列挙する

N^M 通りを生み、ランダム並べ替えにより同値な配分の順序まで重複して調べることになる。

配分 c_1+…+c_N=M を固定すると当たりボタンは各位置に確率 1/N なので、期待勝率は (1/N)Σ_i DP[t+1][min(K,k+c_i)] である。

非零のボタン数 n は高々 min(M,N)。正の組成だけの補助 DP''[n][s] と、未使用ボタン (N-n) 個の共通項を組み合わせれば N 次元を消せる。

最終ターン後を k≥K なら 1、それ以外 0 で初期化する。各 t,k について h[n][s]=max_{c_1+…+c_n=s,c_i>0}ΣDP[t+1][min(K,k+c_i)] を正の c で更新し、max_n(h[n][M]+(N-n)DP[t+1][k])/N を DP[t][k] とする。

## 典型の発動条件

### 有限期間ゲーム DP

発動条件: 各ラウンド後に十分統計量が観測され、その後の最適戦略を状態から選べるとき。

ターンと累積当たり回数を状態にして、将来勝率を後ろから最大化する。

### 対称性による次元削減

発動条件: 対象を区別できず、ランダムな特別対象が一様に選ばれるとき。

ボタン番号の順序を捨て、押下回数の正の部分と未使用数だけを数える。

### 整数組成 DP

発動条件: 固定和を正の整数へ分けたときの寄与和を最適化したいとき。

使用ボタン数 n と割当済み押下数 s を状態にして次の正の c を列挙する。

## 問題固有の要素

巨大な N は遷移の選択肢数ではなく、押さないボタンの同一寄与 (N-n) 倍としてだけ残る。

別の問題へ持ち帰る視点: 対称な多数対象への資源配分では、資源量 M が小さければ非零対象数を M 以下へ圧縮し、零対象を一括計上する。

## 正当性

並べ替え後の当たり位置は N 箇所で一様で、押下中に新情報は得られない。同じ位置を c 回押せば当たりなら回数が c 増え、外れなら不変。従って各位置の押下数だけが一ターンの遷移分布を決める。n個の正押下数を合計Mで割り当てた期待値は、各位置の次ターン勝率の和をNで割ったもの。h[n][s]の加算 knapsack は全正分割を網羅し、未押下N−n箇所の寄与を足す。有限ターンの後退帰納法で最適戦略となる。

## 実装上の注意

- k+c は K で clamp し、確率は double など十分な精度で保持する。n≤min(M,N)、s≥n の範囲と、T ターン終了直後の基底条件を揃える。

## 復習の核

- N=1、M≥K、T=1、K>TM の勝率 0、全ボタンを一度ずつ押せる場合を手計算し、補助 DP の n と未使用項を確認する。

## 計算量と制約

### 時間

T ターン、必要当たり K、一ターン M 押下、B=min(N,M)。各(t,k)で正分割 knapsack O(BM²)、全体 O(TKBM²)。

### 空間

次ターン勝率 O(K)、一状態の割当 knapsack O(BM)、rolling で O(K+BM)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2\times 10^5; 1 \le T \le 30; 1 \le M \le 30; 1 \le K \le 30; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,T=1,M=2,K=1。

1. 同じ位置を二回なら当たり確率1/2。
2. 二箇所へ一回ずつなら必ず当たりを一回押す。
3. 後者の勝率1を採る。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ設定で K=2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

別位置一回ずつでは二回当たりにならず勝率0。同じ位置を二回押せば1/2で勝つため最適1/2。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/editorial/12846) — source-abc404-editorial-12846-02a4f8e1d277892cd04c396236017ee727c354a0679b96a497b9856107a626f3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc404/tasks/abc404_f) — source-abc404-f-problem-0177ad06dec4c00128c31966769f7140fae58529868e6963494b7bd013a756ab
