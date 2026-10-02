---
title: "ABC231-E — Minimal payments"
draft: true
authoringUnit: {"problemId":"abc231-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-carry-or-mixed-radix-dp/outcome-design-carry-or-mixed-radix-dp-shard-001/abc231-e.md","learningOutcomeIds":["outcome-design-carry-or-mixed-radix-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。"],"tagIds":["tag-carry-mixed-radix-dp"],"sourceRevisionIds":["source-abc231-e-problem-0182305520799068054aff752e2831be3da15feb444ad07a888d3504da02ae9c","source-abc231-editorial-3062-91f2da4e2d837098a67f6f1da5159eea0617558b9a263fe65a677fa0723e7fdb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_iが次額面を割るため、大額面側の調整は基数b=A_{i+1}/A_iの倍数に限られる。桁端数rはr枚支払うかb−r枚釣銭にして繰り上げる二通りを考えればよい。同じ桁で一基数以上の支払と釣銭を相殺した解はより大きい硬貨へ置換して枚数を増やさないので、その他の丸めは不要。各段階のcarryは0,1だけとなり、二状態の最小化を最上位額面まで続ければ全体の最小硬貨枚数になる。","sourceRevisionIds":["source-abc231-e-problem-0182305520799068054aff752e2831be3da15feb444ad07a888d3504da02ae9c","source-abc231-editorial-3062-91f2da4e2d837098a67f6f1da5159eea0617558b9a263fe65a677fa0723e7fdb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-carry-or-mixed-radix-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"額面[1,10]、X=9。","procedure":["1硬貨だけなら9枚。","10硬貨一枚を払い1硬貨一枚を釣銭にすると二枚。","一枚の硬貨で差額9を作ることはできない。"],"executionTarget":null,"expectedResult":"最小2枚。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-carry-mixed-radix"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-carry-or-mixed-radix-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"X=10のとき、端数0でも上へのcarryを強制するべきか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不要。10硬貨一枚で最小1枚。端数0の下側遷移を残し、余計な支払と釣銭を発生させない。"},"answer":{"reasoningOrVerification":"不要。10硬貨一枚で最小1枚。端数0の下側遷移を残し、余計な支払と釣銭を発生させない。","procedure":["具体例の各状態・寄与を再計算する。","不要。10硬貨一枚で最小1枚。端数0の下側遷移を残し、余計な支払と釣銭を発生させない。"],"expectedResult":"不要。10硬貨一枚で最小1枚。端数0の下側遷移を残し、余計な支払と釣銭を発生させない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [繰り上がり・借り・混合基数を状態にするDP](src/content/docs/learn/dynamic-programming/dp-carry-mixed-radix.md)

- 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 考察

A_{i+1} 以上の硬貨では A_{i+1} の倍数単位しか調整できないため、X の A_{i+1} 未満の端数は小さい硬貨側で処理する必要がある。

端数 r に対して検討すべきなのは、r を小額硬貨で支払って下側の倍数へ残すか、A_{i+1}−r を釣銭でもらって上側の倍数へ丸めるかの二通りである。

棄却する候補: 金額 0 から X までについて、各硬貨を支払い・釣銭に使う個数 DP を行う。

X と硬貨額が 10 の 18 乗まであり、金額を状態にした配列を作れない。

採用する候補: 小さい額から各桁の端数を処理し、次の硬貨単位へ切り下げる場合と切り上げる場合を再帰・メモ化する。

額面が整除鎖なので他の丸め方は二択のどちらかより硬貨数を減らせず、各額面で現れる金額も床・天井の二種類に限られる。

支払い額 Y 自体を探索せず、各額面で生じる繰り上がりを 0 または 1 の状態として追う貨幣版の桁 DP と考える。

整除関係を持つ額面列を混合基数の桁として、各桁で端数をそのまま払う遷移と補数を釣銭にする遷移の最小値をメモ化再帰で求める。

## 典型の発動条件

### 切り下げ・切り上げの二択 DP

発動条件: 単位が次の単位を割り切り、目標値を過不足の両方で表して支払いと釣銭を最小化するとき。

現在額を次額面の直下または直上の倍数へ丸め、端数または補数に必要な硬貨数を加える。

## 問題固有の要素

再帰中に現れる金額は元の X を各 A_i 単位へ床または天井丸めした値だけなので、巨大な X に対しても状態数は額面数に比例する。

別の問題へ持ち帰る視点: 巨大な数値 DP でも、遷移が各スケールでの丸めだけなら到達状態集合を先に評価してメモ化可能性を判断する。

## 正当性

A_iが次額面を割るため、大額面側の調整は基数b=A_{i+1}/A_iの倍数に限られる。桁端数rはr枚支払うかb−r枚釣銭にして繰り上げる二通りを考えればよい。同じ桁で一基数以上の支払と釣銭を相殺した解はより大きい硬貨へ置換して枚数を増やさないので、その他の丸めは不要。各段階のcarryは0,1だけとなり、二状態の最小化を最上位額面まで続ければ全体の最小硬貨枚数になる。

## 実装上の注意

- 最上位額面では残額をその硬貨だけで払う基底を置き、存在しない次額面への切り上げを参照しない。
- X、額面、切り上げ後の金額は 10 の 18 乗級なので 64 bit 範囲と加算上限を確認する。

## 復習の核

- 釣銭を許す硬貨問題では、端数を払うだけでなく次単位へ過払いして補数を返してもらう選択を必ず比較する。

## 計算量と制約

### 時間

O(N)。各額面段階で丸め下げ・上げの高々二状態。

### 空間

O(N)メモ化。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \leq N \leq 60; 1=A_1 < \ldots <A_N \leq 10^{18}; A_{i+1} is a multiple of A_i for every 1\leq i \leq N-1.; 1\leq X \leq 10^{18}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

額面[1,10]、X=9。

1. 1硬貨だけなら9枚。
2. 10硬貨一枚を払い1硬貨一枚を釣銭にすると二枚。
3. 一枚の硬貨で差額9を作ることはできない。

期待される結果: 最小2枚。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

X=10のとき、端数0でも上へのcarryを強制するべきか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不要。10硬貨一枚で最小1枚。端数0の下側遷移を残し、余計な支払と釣銭を発生させない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/tasks/abc231_e) — source-abc231-e-problem-0182305520799068054aff752e2831be3da15feb444ad07a888d3504da02ae9c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/editorial/3062) — source-abc231-editorial-3062-91f2da4e2d837098a67f6f1da5159eea0617558b9a263fe65a677fa0723e7fdb
