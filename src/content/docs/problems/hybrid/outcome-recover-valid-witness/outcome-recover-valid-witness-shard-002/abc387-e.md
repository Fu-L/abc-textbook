---
title: "ABC387-E — Digit Sum Divisible 2"
draft: true
authoringUnit: {"problemId":"abc387-e","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc387-e.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"aの末尾を十分な個数の0にすればa+1でcarryが起きず、桁和はちょうど1増える。 範囲保証とgood性を分離し、前者は先頭桁の区間被覆、後者は桁和と2・8・3・9の倍数判定で証明する。 公式のprefix候補17,26,35,62,107等は全て双子良整数を作り、上位2桁の区分により必ずN≤a<2Nを満たす候補を選べる。","sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-recover-valid-witness"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=11、候補a=20。","procedure":["11≤20<22を確認。","digitSum20=2で20を割り、digitSum21=3で21を割る。"],"executionTarget":null,"expectedResult":"20はvalid witness。","verificationStatus":"not_applicable","learningUnitIds":["unit-constructive-witness"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-recover-valid-witness"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"末尾0の候補でa+1の桁和が必ず1増える理由は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"末尾が0なのでcarryが起きず一の位だけ0→1となる。範囲内である証明は別に必要。"},"answer":{"reasoningOrVerification":"末尾が0なのでcarryが起きず一の位だけ0→1となる。範囲内である証明は別に必要。","procedure":["具体例の各状態・寄与を再計算する。","末尾が0なのでcarryが起きず一の位だけ0→1となる。範囲内である証明は別に必要。"],"expectedResult":"末尾が0なのでcarryが起きず一の位だけ0→1となる。範囲内である証明は別に必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

Nは10万桁で通常整数に収まらない一方、必要なのは[N,2N)内の一つの構成である。桁和が1,3,9ならそれぞれ自動的にその桁和で割り切れる。

十分大きいNでは、上位数桁だけで桁和を2または8に調整し、長い0 suffixで偶数性または8の倍数性を保証すると、a+1の桁和を3または9にできる。

採用する候補: 小さいNは範囲全探索し、大きいNは上位2桁区間ごとの有限なprefix表と0 suffixで構成する

公式のprefix候補17,26,35,62,107等は全て双子良整数を作り、上位2桁の区分により必ずN≤a<2Nを満たす候補を選べる。

棄却する候補: Nから順にgood判定して最初の連続pairを探す

Nが10万桁で探索幅の保証がなく、除算と桁和計算を繰り返す方法は実行不能である。

aの末尾を十分な個数の0にすればa+1でcarryが起きず、桁和はちょうど1増える。

範囲保証とgood性を分離し、前者は先頭桁の区間被覆、後者は桁和と2・8・3・9の倍数判定で証明する。

N<10^6ならa=N..2N-1を走査して二数を直接判定する。それ以外は桁数と上位2桁を読み、対応表からprefixを選んで適切な個数の0を付けたaを文字列で出力する。

## 典型の発動条件

### constructive problemの有限パターン被覆

発動条件: 巨大な範囲から一例だけ求め、局所条件を固定suffixで保証できるとき。

先頭桁区間を少数のprefix候補で覆う。

### 桁和と倍数判定

発動条件: 桁和で割り切れる数を構成したいとき。

桁和1,3,9と末尾による2・8の倍数性を組み合わせる。

## 問題固有の要素

大整数を数値として扱わず、上位prefixが大小範囲を、0 suffixが割り切り条件を担当する二層構成にする。

別の問題へ持ち帰る視点: 巨大桁の構成では、比較を決める上位桁と合同条件を決める下位桁を独立に設計できないか探す。

## 正当性

aの末尾を十分な個数の0にすればa+1でcarryが起きず、桁和はちょうど1増える。 範囲保証とgood性を分離し、前者は先頭桁の区間被覆、後者は桁和と2・8・3・9の倍数判定で証明する。 公式のprefix候補17,26,35,62,107等は全て双子良整数を作り、上位2桁の区分により必ずN≤a<2Nを満たす候補を選べる。

## 実装上の注意

- 小N探索の上端はa+1≤2Nを満たす2N-1。大Nではprefix 107により桁数が一つ増えるcaseを含め、先頭0を出力しない。

## 復習の核

- 各prefix候補について桁和と末尾の倍数判定を独立に証明し、区間境界16/17,25/26,34/35,61/62,99/100付近を文字列比較で検査する。

## 計算量と制約

### 時間

O(L+10⁶·Lsmall)、Lは入力桁数、N<10⁶時の全走査は定数上限。大入力は文字列出力O(L)。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer at least 1 and less than 10^{100000}.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=11、候補a=20。

1. 11≤20<22を確認。
2. digitSum20=2で20を割り、digitSum21=3で21を割る。

期待される結果: 20はvalid witness。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

末尾0の候補でa+1の桁和が必ず1増える理由は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

末尾が0なのでcarryが起きず一の位だけ0→1となる。範囲内である証明は別に必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/tasks/abc387_e) — source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/editorial/11830) — source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d
