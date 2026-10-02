---
title: "ABC464-F — Random Vault Heist"
draft: true
authoringUnit: {"problemId":"abc464-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-002/abc464-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-combinatorial-coefficients","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0","source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"sumS<Xを満たす全subsetについて到達確率×次選択期待値を足すと、各実行で盗む各金庫金額が一度ずつ寄与する。 右半分の固定size kで sumR<threshold を満たす個数とsumR総和はsort配列のupper_boundとprefix sumで得られる。 特定Sがpermutation prefix集合になる確率は1/C(N,|S|)、次の金額期待値は(A_all-sumS)/(N-|S|)で、同sizeなら分母が共通なのでcountとsum総和だけでまとめられる。","sourceRevisionIds":["source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0","source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-split-enumeration-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"金額A=(2,5)、停止thresholdX=3。","procedure":["順序2,5なら7を盗み、5,2なら5で止まる。","等確率二順序の平均。"],"executionTarget":null,"expectedResult":"期待盗額6。","verificationStatus":"not_applicable","learningUnitIds":["unit-meet-in-the-middle"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-split-enumeration-space"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic"],"attainmentCondition":"subset和がちょうどXの後にも次を盗むか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"既にthresholdへ到達して停止するので次選択対象はsumS<Xだけ。lower_boundでstrict未満を数える。"},"answer":{"reasoningOrVerification":"既にthresholdへ到達して停止するので次選択対象はsumS<Xだけ。lower_boundでstrict未満を数える。","procedure":["具体例の各状態・寄与を再計算する。","既にthresholdへ到達して停止するので次選択対象はsumS<Xだけ。lower_boundでstrict未満を数える。"],"expectedResult":"既にthresholdへ到達して停止するので次選択対象はsumS<Xだけ。lower_boundでstrict未満を数える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

ランダムに残りから選ぶ過程は、全金庫の一様random permutationを作り、prefix総額がX未満の間だけ次を盗む過程と等価である。

採用する候補: 各到達subset Sのsize・sumに対する期待寄与を式化し、集合を左右半分へ分ける。右subsetをsize別sum順にsortしてcountとsumのprefixを作り、各左subsetとの組をthreshold二分探索で集計する。

特定Sがpermutation prefix集合になる確率は1/C(N,|S|)、次の金額期待値は(A_all-sumS)/(N-|S|)で、同sizeなら分母が共通なのでcountとsum総和だけでまとめられる。

棄却する候補: 全N!個の金庫順列を列挙し、停止位置までの盗難額を平均する。

factorial列挙は不可能で、同じprefix集合を異順序で重複している。

sumS<Xを満たす全subsetについて到達確率×次選択期待値を足すと、各実行で盗む各金庫金額が一度ずつ寄与する。

右半分の固定size kで sumR<threshold を満たす個数とsumR総和はsort配列のupper_boundとprefix sumで得られる。

左右subsetを(size,sum)で全列挙する。右をsize別vectorに分けsortしprefix sumを作る。各左subsetと右size kでlimit=X-sumL未満のprefix長を二分探索し、count×(A_all-sumL)-sumRtotalを共通係数 1/C(N,s)/(N-s) で加算する。

## 典型の発動条件

### random permutationのprefix集合化

発動条件: 残りから一様選択を条件失敗まで続ける期待値問題のとき。

順序過程をsubsetがprefixになる確率へ変換する。

### meet-in-the-middleのcount・sum query

発動条件: subset sizeとsum thresholdごとの個数・総和を求めたいとき。

片側をsize別sortしprefix count/sumで他側全subsetを照会する。

## 問題固有の要素

逐次random processを全順序ではなく到達可能subset状態ごとの一回の寄与へ線形化する。

別の問題へ持ち帰る視点: MITMでは存在・個数だけでなく、目的式が一次ならsubset sumのprefix総和も同時に前計算する。

## 正当性

sumS<Xを満たす全subsetについて到達確率×次選択期待値を足すと、各実行で盗む各金庫金額が一度ずつ寄与する。 右半分の固定size kで sumR<threshold を満たす個数とsumR総和はsort配列のupper_boundとprefix sumで得られる。 特定Sがpermutation prefix集合になる確率は1/C(N,|S|)、次の金額期待値は(A_all-sumS)/(N-|S|)で、同sizeなら分母が共通なのでcountとsum総和だけでまとめられる。

## 実装上の注意

- sumS<Xはstrictなのでlower_boundを使い、|S|=Nでは次金庫がなく分母0となるため除外する。mod binomial inverseをsize別に前計算する。

## 復習の核

- 特定subsetが順不同prefixになる確率を組合せで導き、期待寄与式をcount項とsum項へ分配して二分探索集計へつなげる。

## 計算量と制約

### 時間

O(N²2^{ceil(N/2)})、左右subsetのsize別joinと二分探索を含む上界。

### 空間

O(2^{ceil(N/2)})。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 40; 1 \le A_i \le 10^{16}; 1 \le X \le \sum_{i=1}^{N} A_i; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

金額A=(2,5)、停止thresholdX=3。

1. 順序2,5なら7を盗み、5,2なら5で止まる。
2. 等確率二順序の平均。

期待される結果: 期待盗額6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

subset和がちょうどXの後にも次を盗むか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

既にthresholdへ到達して停止するので次選択対象はsumS<Xだけ。lower_boundでstrict未満を数える。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/editorial/22267) — source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/tasks/abc464_f) — source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c
