---
title: "ABC293-F — Zero or One"
draft: true
authoringUnit: {"problemId":"abc293-f","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc293-f.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc293-editorial-5945-a10a0b003741ded035e6b0ff15b384193828cd111785bd4b8963d93f6bbaa529","source-abc293-f-problem-40d4cd66fa2af2e4845b6d59fdb8eb0d12fff10f92cc15b47f545dbd7549439f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"d≥3桁の01表現が存在するならb^{d−1}≤N≤Σ_{i<d}b^i。後者は(b+1)^{d−1}未満なので異基数の可能域は重ならず、その桁数で調べるbは高々一つ。d=2のN,N−1と全d≥3の候補を取り、実際の除算で全桁0/1を確認すれば全可能基数を尽くす。","sourceRevisionIds":["source-abc293-editorial-5945-a10a0b003741ded035e6b0ff15b384193828cd111785bd4b8963d93f6bbaa529","source-abc293-f-problem-40d4cd66fa2af2e4845b6d59fdb8eb0d12fff10f92cc15b47f545dbd7549439f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=7。","procedure":["2進111、6進11、7進10は条件を満たす。","3進21、4進13、5進12は満たさない。"],"executionTarget":null,"expectedResult":"3基数。","verificationStatus":"not_applicable","learningUnitIds":["unit-integer-boundary-blocks"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"prerequisiteIds":[],"attainmentCondition":"N=2の二桁候補N,N−1を両方採るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1基数。"},"answer":{"reasoningOrVerification":"基数は2以上なので1を除く。2進10だけが残る。","procedure":["具体例の各状態・寄与を再計算する。","基数は2以上なので1を除く。2進10だけが残る。"],"expectedResult":"1基数。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 素因数指数による整数条件の分解。

## 考察

d≥3桁では基数bごとの可能値区間[b^(d-1),Σb^i]が互いに交わらず、Nに対する候補bは高々一つである。

採用する候補: 桁数列挙と整数(d-1)乗根候補の検査

d=2を別処理し、各d≥3で最大b^(d-1)≤Nのbだけを実際に基数変換すればよい。

棄却する候補: 全基数2..Nを試す

Nは10^18で線形列挙できない。

Σ_(i=0)^(d-1)b^i < (b+1)^(d-1)により隣接基数のd桁01表現範囲が分離する。

d=2..floor(log2 N)+1を列挙し、d=2の候補N,N-1を処理する。d≥3は整数二分探索でbを求め、Nをb進除算して全桁0/1か検査し重複なく数える。

## 典型の発動条件

### 整数k乗根

発動条件: 巨大整数Nに対しb^k≤Nの最大bを求める。

オーバーフローを抑えた比較で二分探索する。

### 表現範囲の分離

発動条件: 基数候補が多そうだが桁数固定で値域が離れる。

O(log N)個の桁数を列挙し、各桁数では表現範囲の非交差性から候補基数を高々一つへ絞る。

## 問題固有の要素

01桁という疎な表現条件が、二項定理によって基数ごとの値域を非交差にする。

別の問題へ持ち帰る視点: 基数探索は桁数固定時の表現可能区間の重なりを調べる。

## 正当性

d≥3桁の01表現が存在するならb^{d−1}≤N≤Σ_{i<d}b^i。後者は(b+1)^{d−1}未満なので異基数の可能域は重ならず、その桁数で調べるbは高々一つ。d=2のN,N−1と全d≥3の候補を取り、実際の除算で全桁0/1を確認すれば全可能基数を尽くす。

## 実装上の注意

- b≥2、d=2の候補重複、N=2境界を処理し、冪計算はN超で飽和する。

## 復習の核

- 小Nで全基数を試し、2桁候補、同じbが別dで数えられないこと、最大桁数を確認する。

## 計算量と制約

### 時間

各case O((log N)³)を上界とする。桁数ごとに整数二分探索と飽和冪評価を行う。

### 空間

O(log N)。候補基数を重複除去する。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 1000; 2 \leq N \leq 10^{18}; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=7。

1. 2進111、6進11、7進10は条件を満たす。
2. 3進21、4進13、5進12は満たさない。

期待される結果: 3基数。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=2の二桁候補N,N−1を両方採るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

基数は2以上なので1を除く。2進10だけが残る。

確認結果: 1基数。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/editorial/5945) — source-abc293-editorial-5945-a10a0b003741ded035e6b0ff15b384193828cd111785bd4b8963d93f6bbaa529
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/tasks/abc293_f) — source-abc293-f-problem-40d4cd66fa2af2e4845b6d59fdb8eb0d12fff10f92cc15b47f545dbd7549439f
