---
title: "ABC458-E — Count 123"
draft: true
authoringUnit: {"problemId":"abc458-e","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc458-e.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc458-e-problem-6e4db7c41179aed6676c72ae9bb5f6b852f9f18758d304c670319045b55c6fb1","source-abc458-editorial-20463-e6d5f67830dee2beb7162e5b5cd073fb4aafdfcf0020f20e77d5461bb5a44927"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"2を除いた1/3列Bの異値境界を全て2で遮れば1と3は隣接しない。1run,3runの正長分割は端記号ごとに一意で、partの積がその全Bを数える。各異値境界へ必須2を一つ置き残りを全gapへ配る組合せは元列への全単射なので、四endpoint caseと全run数の和に重複はない。","sourceRevisionIds":["source-abc458-e-problem-6e4db7c41179aed6676c72ae9bb5f6b852f9f18758d304c670319045b55c6fb1","source-abc458-editorial-20463-e6d5f67830dee2beb7162e5b5cd073fb4aafdfcf0020f20e77d5461bb5a44927"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X_1=X_2=X_3=1。","procedure":["六順列のうち1と3が隣接しないのは123と321。"],"executionTarget":null,"expectedResult":"2。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":[],"attainmentCondition":"X_1=X_3=1,X_2=2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"6。"},"answer":{"reasoningOrVerification":"1と3を4位置の非隣接pairへ置く。unordered pair3通り×向き2、残りを2で埋める。","procedure":["具体例の各状態・寄与を再計算する。","1と3を4位置の非隣接pairへ置く。unordered pair3通り×向き2、残りを2で埋める。"],"expectedResult":"6。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

1と3が隣り合わない条件は、1・3だけを抜き出した列Bの交互run境界すべてに少なくとも一個の2を挿入する条件へ変わる。

採用する候補: Bの先頭・末尾が1/3の四caseに分け、1-run数と3-run数をiでparameter化して、正の分割数 part と残り2の挿入二項係数の積を総和する。

固定run数では各記号個数のrun長分配が C(X-1,r-1) で数えられ、異記号境界への必須2を先に置けば残り2はgapへの通常挿入として二項係数で数えられる。

棄却する候補: 長さ X_1+X_2+X_3 の全ternary列を生成し、個数と隣接条件を検査する。

multinomial個の候補が指数的で、総長が大きい。

B両端が同記号なら両run数は1差、異記号なら等しく、1/3境界数はそれぞれ2i-2または2i-1になる。

各1/3境界へ必須2を一個置いた後、残る2はBの要素間・両端へ自由挿入でき、その位置数が公式のbinomになる。

階乗・逆階乗を総長まで前計算し、part(n,k)=C(n-1,k-1)を範囲外0で実装する。四endpoint caseそれぞれで可能iを走査し、part(X1,r1)part(X3,r3)C(total-boundaries,X1+X3)を加算する。

## 典型の発動条件

### run構造による列数え上げ

発動条件: 二記号間の直接隣接を第三記号で禁止するmultiset列のとき。

二記号subsequenceの交互run数と端記号で分類する。

### 正の整数分割とgap挿入

発動条件: 同記号個数を非空runへ分け、separatorを配置したいとき。

part(n,k)=C(n-1,k-1)と残余要素の二項係数を掛ける。

## 問題固有の要素

禁止adjacencyは対象二記号だけを抽出し、そのrun境界にseparatorが必要という配置問題へ変換できる。

別の問題へ持ち帰る視点: 列のendpointを固定すると交互run数の関係が決まり、複雑なcaseが一変数和になる。

## 正当性

2を除いた1/3列Bの異値境界を全て2で遮れば1と3は隣接しない。1run,3runの正長分割は端記号ごとに一意で、partの積がその全Bを数える。各異値境界へ必須2を一つ置き残りを全gapへ配る組合せは元列への全単射なので、四endpoint caseと全run数の和に重複はない。

## 実装上の注意

- X1またはX3が0のcaseでpartの範囲外定義を正しく使い、必須2数がX2を超える項を0にする。異端caseは対称な二通りを数える。

## 復習の核

- 四endpoint caseでrun数と境界数を表にし、必須2を置いた後のbinom上側がどう得られるかを小列で確認する。

## 計算量と制約

### 時間

O(X_1+X_2+X_3)。階乗表とrun数iの四endpoint case。

### 空間

O(X_1+X_2+X_3)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq X_1, X_2, X_3 \leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X_1=X_2=X_3=1。

1. 六順列のうち1と3が隣接しないのは123と321。

期待される結果: 2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

X_1=X_3=1,X_2=2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1と3を4位置の非隣接pairへ置く。unordered pair3通り×向き2、残りを2で埋める。

確認結果: 6。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/tasks/abc458_e) — source-abc458-e-problem-6e4db7c41179aed6676c72ae9bb5f6b852f9f18758d304c670319045b55c6fb1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/editorial/20463) — source-abc458-editorial-20463-e6d5f67830dee2beb7162e5b5cd073fb4aafdfcf0020f20e77d5461bb5a44927
