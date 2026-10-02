---
title: "ABC327-E — Maximize Rating"
draft: true
authoringUnit: {"problemId":"abc327-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc327-e.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc327-e-problem-82d5cd0e3dc3b2ed0e77e993c4eabfa3545fb9ffef0f62201f860b0559a5a75a","source-abc327-editorial-7564-c0d8558ee7fe61bcffb1c1da0f5f606c581d76c70301dc25ce5eda2de40c4d24"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"k個選択の分子は前のk−1個分子へ0.9を掛け現在Pを足す。同じkの分母と罰則は固定なので分子最大だけを残せる。降順k更新は一つの成績の再使用を防ぐ。全kのrating最大を最後に取る。","sourceRevisionIds":["source-abc327-e-problem-82d5cd0e3dc3b2ed0e77e993c4eabfa3545fb9ffef0f62201f860b0559a5a75a","source-abc327-editorial-7564-c0d8558ee7fe61bcffb1c1da0f5f606c581d76c70301dc25ce5eda2de40c4d24"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-order-preserving-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(1000,2000)。","procedure":["k=1分子max2000、rating800。","k=2分子0.9×1000+2000=2900、分母1.9。","rating≈1526.3158−848.5281=677.7877。"],"executionTarget":null,"expectedResult":"最大rating800","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-sequence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-order-preserving-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"kを昇順に更新すると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じP_iを何回も選ぶ遷移が混ざる。旧行コピーか降順更新が必要。"},"answer":{"reasoningOrVerification":"同じP_iを何回も選ぶ遷移が混ざる。旧行コピーか降順更新が必要。","procedure":["具体例の各状態・寄与を再計算する。","同じP_iを何回も選ぶ遷移が混ざる。旧行コピーか降順更新が必要。"],"expectedResult":"同じP_iを何回も選ぶ遷移が混ざる。旧行コピーか降順更新が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選ぶcontest数kを固定するとdenominator Σ0.9^iとpenalty 1200/√kは固定され、最大化すべきなのはweighted performance numeratorだけになる。 参加順を保ってj個選んだweighted sumへ新しいperformance P_iを末尾追加すると、既存sum全体が0.9倍されてP_iが加わる。 従ってprefixからj個選ぶ最大numeratorを選択個数DPで全k同時に求められる。 contest iをtakeする遷移はdp_new[j]=max(dp_old[j],0.9dp_old[j-1]+P_i)で、skipと末尾追加の2caseを尽くす。 den[k]=Σ_{r=0}^{k-1}0.9^rもden[k]=0.9den[k-1]+1で同じ方向に前計算できる。

採用する候補: dp[j]を処理済みcontestからj個選ぶweighted numerator最大値としてskip/take更新し、各kのratingを比較する。

2^N subsetを選択個数ごとの最良numeratorへ集約し、k依存のdenominatorとpenaltyを最後に適用できる。

棄却する候補: performanceが高いcontestを値順にk個選ぶ。

weightは参加順で新しい選択ほど大きく、値だけでsortすると元の時系列を無視する。

棄却する候補: 全contest subsetのratingを直接計算する。

N≤5000で2^N候補は列挙不能である。

contest iをtakeする遷移はdp_new[j]=max(dp_old[j],0.9dp_old[j-1]+P_i)で、skipと末尾追加の2caseを尽くす。

den[k]=Σ_{r=0}^{k-1}0.9^rもden[k]=0.9den[k-1]+1で同じ方向に前計算できる。

dp[0]=0、他を−∞とし、P_iを順に見るたびjを大きい方から1まで走査してdp[j]=max(dp[j],0.9·dp[j-1]+P_i)と更新する。den[0]=0からden[k]=0.9den[k-1]+1を作り、全k=1..Nでdp[k]/den[k]−1200/sqrt(k)の最大値をdoubleで出力する。

## 典型の発動条件

### 選択個数別subsequence DP

発動条件: 順序を保つsubsetを選び、末尾追加で評価式が簡単に更新できるとき。

prefix処理と選択数を状態にしてskip/takeする。

### 目的関数parameterの固定

発動条件: 選択数kごとに一部の項が固定され、残りだけ別DPで最大化できるとき。

numerator最大値M(k)を全k求めてrating式へ戻す。

## 問題固有の要素

新しい選択を末尾に加えると過去performanceの全weightが一様に0.9倍されるため、個々の選択時刻を状態に残さずweighted sum1値で十分になる。

別の問題へ持ち帰る視点: 時系列重みが末尾追加で共通倍率を受ける評価は、aggregateへaffine変換を施すsubsequence DPにできる。

## 正当性

k個選択の分子は前のk−1個分子へ0.9を掛け現在Pを足す。同じkの分母と罰則は固定なので分子最大だけを残せる。降順k更新は一つの成績の再使用を防ぐ。全kのrating最大を最後に取る。

## 実装上の注意

- 1次元in-place DPはjを降順に更新し、同じcontestを複数回takeしない。
- 未到達dpを−∞で区別し、最終ratingのsqrtとdivisionはdoubleまたはlong doubleで行う。

## 復習の核

- 古い高performanceと新しい中performanceの2 contestで、末尾追加時に前者だけ0.9倍されることと降順更新を確認する。

## 計算量と制約

### 時間

N 成績、選択数kの全更新で O(N²)。

### 空間

rolling選択数 DP と分母表 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 5000; 1\leq P_i\leq 5000; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(1000,2000)。

1. k=1分子max2000、rating800。
2. k=2分子0.9×1000+2000=2900、分母1.9。
3. rating≈1526.3158−848.5281=677.7877。

期待される結果: 最大rating800

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

kを昇順に更新すると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じP_iを何回も選ぶ遷移が混ざる。旧行コピーか降順更新が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/tasks/abc327_e) — source-abc327-e-problem-82d5cd0e3dc3b2ed0e77e993c4eabfa3545fb9ffef0f62201f860b0559a5a75a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc327/editorial/7564) — source-abc327-editorial-7564-c0d8558ee7fe61bcffb1c1da0f5f606c581d76c70301dc25ce5eda2de40c4d24
