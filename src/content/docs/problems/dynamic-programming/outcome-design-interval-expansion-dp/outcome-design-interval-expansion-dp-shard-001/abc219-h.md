---
title: "ABC219-H — Candles"
draft: true
authoringUnit: {"problemId":"abc219-h","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-expansion-dp/outcome-design-interval-expansion-dp-shard-001/abc219-h.md","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design"],"excludedTopics":["区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-interval-expansion","tag-contribution-reordering"],"sourceRevisionIds":["source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726","source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"経路は位置順に訪問済み区間を広げるものへ整理できる。正の残長を得るろうそくだけを事前選択すると目的はΣA_i−Σ到着時刻。選択本数kが未消火の間の移動距離dは到着時刻の和をkd増やすので、時刻を独立に持たず残り本数で局所費用化できる。新しい位置を選ぶならA_iを加えkを減らし、選ばない選択も残す。固定選択集合の最適訪問と全選択集合の最大を区間DPが尽くす。負の寄与がある解はそのろうそくを外して改善できるため、打ち切り0の元目的との最適値も一致する。","sourceRevisionIds":["source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726","source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"ろうそく二本の位置はいずれも0、長さ2と3。出発位置0。","procedure":["dummyも位置0にあるので全移動距離は0。","二本を選ぶと到着時刻はともに0。","寄与は2+3。"],"executionTarget":null,"expectedResult":"最大保存長5。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-expansion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"prerequisiteIds":["unit-contribution-reordering","unit-dp-state-design"],"attainmentCondition":"位置1、長さ1の一本だけなら保存長はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。到着まで1かかるため残長max(1−1,0)=0。選択しない解も0なので、負寄与を強制せず最大を取る。"},"answer":{"reasoningOrVerification":"0。到着まで1かかるため残長max(1−1,0)=0。選択しない解も0なので、負寄与を強制せず最大を取る。","procedure":["具体例の各状態・寄与を再計算する。","0。到着まで1かかるため残長max(1−1,0)=0。選択しない解も0なので、負寄与を強制せず最大を取る。"],"expectedResult":"0。到着まで1かかるため残長max(1−1,0)=0。選択しない解も0なので、負寄与を強制せず最大を取る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間拡張DP](src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)

- 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

訪れた時点でまだ燃えているろうそくは即座に消し、次の目的地へは最速で進めば損をしない。位置を昇順に並べると、既訪問範囲は常に区間で、次に初めて訪れる候補はその左隣か右隣だけになる。

各ろうそくの寄与 max(A_i-到着時刻,0) の 0 打ち切りが扱いにくいが、燃え尽きるろうそくを最初から選ばないと考えれば、選んだろうそくは負の長さまで燃えるモデルでも同じ最適値を持つ。

最初に救う本数を counter C とすると、未消火の選択済みろうそくが k 本ある間の1単位移動は合計長を k 減らし、選んだろうそくへ着くと A_i を加えて k を1減らす。このため時刻そのものではなく残り本数を状態にできる。

採用する候補: 座標0の高さ0の dummy を加え、訪問済み区間 [l,r]、現在の端、counter k を状態とする区間 DP で、次の左右位置を選ぶ。

移動距離×未消火本数を遷移コストにし、新しいろうそくを救うか事前に除外するかを遷移で分けることで、到着時刻と部分集合を明示せず表せる。

棄却する候補: ろうそくを訪れる順列を列挙し、各到着時刻から残量を計算する。

方向転換を端点に限っても左右の選択列は指数個あり、N=300 では列挙できない。

max(A_i-t_i,0) は「寄与が正になるろうそくだけを事前選択し、選択集合について ΣA_i-Σt_i を最大化する」と読み替えられる。

Σt_i は移動の各1単位を、その時点でまだ到達していない選択済みろうそくの本数だけ重複して数えたものなので、距離×counter の局所コストになる。

ろうそくと dummy を座標順に並べる。dp[l][r][side][k] を区間を訪問済みで端にいるときの最大の将来増分とし、次に l-1 または r+1 へ進む距離に k を掛けて引き、新位置を選ぶなら A を足して counter を減らし、選ばない遷移も取る。全区間・k を埋め、dummy 一点の状態で初期 counter を全て試す。

## 典型の発動条件

### 数直線上の区間拡張 DP

発動条件: 原点から点を訪れ、訪問済み点の外側へ進むだけでよい最適順序を持つとき。

訪問済み区間、現在の左右端、追加状態を持ち、次の左端・右端への移動を遷移にする。

### 到着時刻和の残件数課金

発動条件: 選んだ対象それぞれに到着時刻がコストとして加わるとき。

各移動距離を未到着対象数だけ数える二重計数へ変え、残件数を DP 状態にする。

## 問題固有の要素

燃え尽きによる 0 下限を、救わないろうそくの事前除外へ移すことで、非線形な残量を線形な高さ加算と移動課金へ変えられる。

別の問題へ持ち帰る視点: max(value-cost,0) の総和では、正の寄与を持つ項だけ選ぶ部分集合最適化に直し、打ち切りを選択へ吸収できないか考える。

## 正当性

経路は位置順に訪問済み区間を広げるものへ整理できる。正の残長を得るろうそくだけを事前選択すると目的はΣA_i−Σ到着時刻。選択本数kが未消火の間の移動距離dは到着時刻の和をkd増やすので、時刻を独立に持たず残り本数で局所費用化できる。新しい位置を選ぶならA_iを加えkを減らし、選ばない選択も残す。固定選択集合の最適訪問と全選択集合の最大を区間DPが尽くす。負の寄与がある解はそのろうそくを外して改善できるため、打ち切り0の元目的との最適値も一致する。

## 実装上の注意

- 座標0の dummy は高さ0で一個追加し、同一座標の複数本も距離0の別要素として扱える。未到達状態を十分小さい負値で初期化し、距離×k とスコアは 64 bit にする。

## 復習の核

- 二本だけ救う経路で各到着時刻を足した値と、移動区間ごとの「まだ二本／残り一本」という課金を並べ、両者が一致することを確認する。

## 計算量と制約

### 時間

O(N³)。区間二端・残り選択本数・現在端の状態を各定数遷移で処理する。

### 空間

全区間保存ならO(N³)。区間長でrollingするならO(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; -10^9 \leq X_i \leq 10^9; 1 \leq A_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

ろうそく二本の位置はいずれも0、長さ2と3。出発位置0。

1. dummyも位置0にあるので全移動距離は0。
2. 二本を選ぶと到着時刻はともに0。
3. 寄与は2+3。

期待される結果: 最大保存長5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

位置1、長さ1の一本だけなら保存長はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

0。到着まで1かかるため残長max(1−1,0)=0。選択しない解も0なので、負寄与を強制せず最大を取る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/editorial/2601) — source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/tasks/abc219_h) — source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e
