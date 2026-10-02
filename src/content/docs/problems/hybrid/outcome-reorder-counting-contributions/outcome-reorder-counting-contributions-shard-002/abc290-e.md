---
title: "ABC290-E — Make it Palindrome"
draft: true
authoringUnit: {"problemId":"abc290-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc290-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-two-pointers-window"],"sourceRevisionIds":["source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81","source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"数え上げの順序を「区間ごとの対」から「位置対が含まれる区間数」へ主客転倒すると、同値判定を値別にまとめられる。 等しい位置l<rの対はmin(l,N+1-r)個の区間で対称位置になるため、各値の位置列を両端から処理すれば全寄与を線形に数えられる。","sourceRevisionIds":["source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81","source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2,1)。","procedure":["singletonのbad対0、長さ2の二区間は各1。","全域は対称端1,1が等しくbad0。"],"executionTarget":null,"expectedResult":"総bad対2。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-two-pointers-window"],"attainmentCondition":"端位置1,3の同値pairが含まれる対称区間数は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"min(1,N+1−3)=1。全域だけなのでこの一寄与を全pair総数から引く。"},"answer":{"reasoningOrVerification":"min(1,N+1−3)=1。全域だけなのでこの一寄与を全pair総数から引く。","procedure":["具体例の各状態・寄与を再計算する。","min(1,N+1−3)=1。全域だけなのでこの一寄与を全pair総数から引く。"],"expectedResult":"min(1,N+1−3)=1。全域だけなのでこの一寄与を全pair総数から引く。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

全区間を回文にする変更回数は、対称位置の値が異なる「悪い対」の総数であり、全対数から値が等しい「良い対」の寄与を引けばよい。

採用する候補: 値ごとの出現位置列を二点法で集計

等しい位置l<rの対はmin(l,N+1-r)個の区間で対称位置になるため、各値の位置列を両端から処理すれば全寄与を線形に数えられる。

棄却する候補: 全区間ごとに対称位置を比較

区間数と比較数の積が三次規模になる。

数え上げの順序を「区間ごとの対」から「位置対が含まれる区間数」へ主客転倒すると、同値判定を値別にまとめられる。

全ての対称位置ペア数を長さ別の式で合計し、値ごとの昇順位置列Pを両端から走査してΣmin(P_i,N+1-P_j)を引き、悪いペア総数を得る。

## 典型の発動条件

### 主客転倒

発動条件: 全区間上の局所寄与の総和を求めたい。

位置対を固定し、それが対称になる区間数min(l,N+1-r)を足す。

### 単調二点法

発動条件: 二変数のminの大小境界が両端の移動に対して単調である。

同値位置列の左端寄与と右端寄与をまとめて確定する。

## 問題固有の要素

回文化費用を変更操作で考えず、対称位置の不一致数へ直すことで、全対−同値対という補集合計数が現れる。

別の問題へ持ち帰る視点: 全区間の対称・距離寄与は位置対を固定して包含区間数を数える。

## 正当性

数え上げの順序を「区間ごとの対」から「位置対が含まれる区間数」へ主客転倒すると、同値判定を値別にまとめられる。 等しい位置l<rの対はmin(l,N+1-r)個の区間で対称位置になるため、各値の位置列を両端から処理すれば全寄与を線形に数えられる。

## 実装上の注意

- 線の総数の式と良い対の端点は1-indexで統一し、合計は64ビットで持つ。

## 復習の核

- 小さい配列の全区間全比較と照合し、同値が全くない列・全て同値・中央要素を含む奇数長区間を確認する。

## 計算量と制約

### 時間

O(N)、同値位置群のtwo pointers総走査N。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N \le 2 \times 10^5; 1 \le A_i \le N

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2,1)。

1. singletonのbad対0、長さ2の二区間は各1。
2. 全域は対称端1,1が等しくbad0。

期待される結果: 総bad対2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

端位置1,3の同値pairが含まれる対称区間数は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

min(1,N+1−3)=1。全域だけなのでこの一寄与を全pair総数から引く。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_e) — source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5757) — source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239
