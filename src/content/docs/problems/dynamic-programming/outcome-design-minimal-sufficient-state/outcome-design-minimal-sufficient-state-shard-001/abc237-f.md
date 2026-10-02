---
title: "ABC237-F — |LIS| = 3"
draft: true
authoringUnit: {"problemId":"abc237-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc237-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-lis"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-lis-state"],"sourceRevisionIds":["source-abc237-editorial-3320-9a503b43d73bfdd4b1b155aa6841e8645cdf8efb74dcc3510bd1eacd2e89f2fc","source-abc237-f-problem-05f9e4e288335bd98171079bdbe7ba78cc1982d46880bc581a0e02f52f17fd88"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"厳密増加部分列の各長さの最小末尾は、将来の伸長可否を完全に決めるpatience sortingの不変量。次値xは最初のtail≥xを置換する。三つのtailを全状態として数えれば、同じ情報のprefixを合流しても後続のLIS条件は変わらない。第四tailが必要になる遷移を禁止し、終了時に第三tailが有限な状態だけ合計すれば長さちょうど3を過不足なく数える。","sourceRevisionIds":["source-abc237-editorial-3320-9a503b43d73bfdd4b1b155aa6841e8645cdf8efb74dcc3510bd1eacd2e89f2fc","source-abc237-f-problem-05f9e4e288335bd98171079bdbe7ba78cc1982d46880bc581a0e02f52f17fd88"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,M=3。","procedure":["長さ三の列でLIS3を持つには全列が厳密増加である必要がある。","1..3から取る唯一の増加列は[1,2,3]。"],"executionTarget":null,"expectedResult":"答え1。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-dp-lis"],"attainmentCondition":"値xが既存tailに等しい場合、LIS長を増やすか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"増やさない。strict LISでは最初のtail≥xを置換するlower_boundを使う。upper_boundを使うと等値を伸長に数えてしまう。"},"answer":{"reasoningOrVerification":"増やさない。strict LISでは最初のtail≥xを置換するlower_boundを使う。upper_boundを使うと等値を伸長に数えてしまう。","procedure":["具体例の各状態・寄与を再計算する。","増やさない。strict LISでは最初のtail≥xを置換するlower_boundを使う。upper_boundを使うと等値を伸長に数えてしまう。"],"expectedResult":"増やさない。strict LISでは最初のtail≥xを置換するlower_boundを使う。upper_boundを使うと等値を伸長に数えてしまう。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [LIS・末尾の支配関係](src/content/docs/learn/dynamic-programming/dp-lis.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

LIS の長さだけでは次の値を追加したときに伸びるか判断できず、各長さの増加部分列をどれだけ小さい末尾で作れるかが必要になる。

求める LIS 長が 3 と固定され、値域 M も 10 以下なので、長さ 1、2、3 の最小末尾三つを数え上げ DP の状態にできる。

棄却する候補: 位置ごとに現在の LIS 長だけを状態として、次の値を M 通り試す。

同じ LIS 長でも末尾値によって将来の値が部分列を伸ばせるか異なり、正しい遷移を決められない。

採用する候補: 長さ j の増加部分列の最小末尾 a_j を j=1,2,3 について持ち、各 x を追加したとき最初の a_j≥x を x に置き換える DP を行う。

patience sorting の末尾最小値列は将来の全遷移に十分で、長さ 4 が生じる遷移だけ捨てれば LIS≤3 の全列を数えられる。

厳密増加 LIS では x を lower_bound、すなわち最初の a_j≥x の位置へ入れることで、処理済み列の LIS 情報を三つの最小末尾に圧縮できる。

a_3 が有限な終了状態だけを合計すれば LIS≥3 であり、長さ 4 を作る遷移を除外済みなので LIS はちょうど 3 になる。

通常は一列の LIS を求める patience sorting の tails 配列を、小さい値域上の有限状態へ変えて列の個数を数える DP にする。

## 典型の発動条件

### LIS の最小末尾配列

発動条件: 要素を順に追加したときの増加部分列情報を、将来の延長可能性を保ったまま圧縮したいとき。

長さごとの最小末尾を持ち、新要素で lower_bound の位置を更新する。

### アルゴリズム状態の数え上げ DP 化

発動条件: 通常の逐次アルゴリズムの内部状態数が、小さい値域や小さい目標長によって有限個に抑えられるとき。

各 tails 状態へ到達する数を持ち、次の値 M 通りについてアルゴリズムと同じ更新を配る。

## 問題固有の要素

未到達の末尾値には M＋1 を番兵として使い、初期状態を (M＋1,M＋1,M＋1) と表せる。

別の問題へ持ち帰る視点: 固定長までの部分列情報を数えるときは、存在しない層へ値域外番兵を置くと初期化と終了判定を統一できる。

## 正当性

厳密増加部分列の各長さの最小末尾は、将来の伸長可否を完全に決めるpatience sortingの不変量。次値xは最初のtail≥xを置換する。三つのtailを全状態として数えれば、同じ情報のprefixを合流しても後続のLIS条件は変わらない。第四tailが必要になる遷移を禁止し、終了時に第三tailが有限な状態だけ合計すれば長さちょうど3を過不足なく数える。

## 実装上の注意

- x が a_3 より大きく lower_bound が四番目になる遷移は、LIS 4 を作るため加算しない。
- 各長さで新しい DP 配列へ遷移し、加算のたびに 998244353 で剰余を取る。

## 復習の核

- 逐次アルゴリズムの結果だけでなく、次の入力への応答を決める最小の内部状態を DP にできないか考える。
- 「ちょうど K」は、K＋1 以上になる遷移を遮断した上で K に到達した状態を数える形に分解する。

## 計算量と制約

### 時間

O(NM^4)。三つのtails状態O(M³)から各値Mを遷移する。

### 空間

O(M³)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 1000; 3 \leq M \leq 10; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,M=3。

1. 長さ三の列でLIS3を持つには全列が厳密増加である必要がある。
2. 1..3から取る唯一の増加列は[1,2,3]。

期待される結果: 答え1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

値xが既存tailに等しい場合、LIS長を増やすか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

増やさない。strict LISでは最初のtail≥xを置換するlower_boundを使う。upper_boundを使うと等値を伸長に数えてしまう。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/editorial/3320) — source-abc237-editorial-3320-9a503b43d73bfdd4b1b155aa6841e8645cdf8efb74dcc3510bd1eacd2e89f2fc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/tasks/abc237_f) — source-abc237-f-problem-05f9e4e288335bd98171079bdbe7ba78cc1982d46880bc581a0e02f52f17fd88
