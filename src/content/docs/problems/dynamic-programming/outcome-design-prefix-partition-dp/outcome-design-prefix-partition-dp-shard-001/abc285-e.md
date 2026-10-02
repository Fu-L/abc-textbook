---
title: "ABC285-E — Work or Rest"
draft: true
authoringUnit: {"problemId":"abc285-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc285-e.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition"],"sourceRevisionIds":["source-abc285-e-problem-5969ddb4e4b20f1cde65314e6076f59514c97d2a96fac730b85ceab969eca9a7","source-abc285-editorial-5530-310be7210dbffe3c8ce1ed2c646edf0cf96ed70c1505ae86db112906fbd424f5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"休日が一つ以上ある円環では、隣接休日の間が独立な平日runへ分かれる。長さdのrunの生産性は両端の近い休日までの距離からA_1,A_1,A_2,A_2,…の最初d項の和B_dになる。回転して曜日1を休日と固定しても、生産性が曜日名によらないので最適値は変わらない。新休日を置く際に直前runのBを確定し、最後のrunを曜日1へ閉じれば全曜日の寄与が一回ずつ入る。末尾run長だけを持つ最大化DPが全休日集合を覆う。","sourceRevisionIds":["source-abc285-e-problem-5969ddb4e4b20f1cde65314e6076f59514c97d2a96fac730b85ceab969eca9a7","source-abc285-editorial-5530-310be7210dbffe3c8ce1ed2c646edf0cf96ed70c1505ae86db112906fbd424f5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,A1=5,A2=A3=1。","procedure":["休日一日・平日二日の場合、両平日は休日距離1で利益10。","休日二日なら5、全休日なら0。"],"executionTarget":null,"expectedResult":"最大10。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-prefix-partition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"円環で最初の日を休日へ固定すると解を失うか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"曜日に固有の費用がなく回転対称なので任意解を回転できる。最後のrunを最初の休日へ閉じる。"},"answer":{"reasoningOrVerification":"曜日に固有の費用がなく回転対称なので任意解を回転できる。最後のrunを最初の休日へ閉じる。","procedure":["具体例の各状態・寄与を再計算する。","曜日に固有の費用がなく回転対称なので任意解を回転できる。最後のrunを最初の休日へ閉じる。"],"expectedResult":"曜日に固有の費用がなく回転対称なので任意解を回転できる。最後のrunを最初の休日へ閉じる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

曜日は円環だが休日を少なくとも1つ置くので、回転対称性を使って曜日1を休日に固定してよい。

2つの休日の間に平日がd日連続すると、その区間の生産量はB_d=Σ_{k=1..d} A_{floor((k+1)/2)}だけで決まり、他の区間と独立に加算できる。

採用する候補: 曜日1を休日に固定し、処理済み位置と直前の休日から続く平日数を状態にしたDPを行う。

円環の境界を最後の区間へのB加算だけに閉じ込め、休日で区間を閉じるたびに利益を確定できる。

棄却する候補: 休日のsubsetを全列挙して各曜日の最寄り休日を調べる。

候補が2^N通りあり、N≤5000では扱えない。

棄却する候補: 線形列として両端を独立に処理する。

週の末尾と先頭を跨ぐ最寄り休日を無視し、円環上の生産量を誤る。

長さdの平日列では両端から距離1の曜日が2つ、距離2が2つと並ぶため、B_dはA_1,A_1,A_2,A_2,…のprefix sumで前計算できる。

新しい休日を置く遷移で直前の平日列B_jを加え、最後に残った平日列も固定した曜日1の休日へ接続してB_jを加える。

B_0=0とし、d≥1についてB_d=B_{d-1}+A_{floor((d+1)/2)}を前計算する。dp[i][j]を曜日iまで決めて末尾に平日がj日続く最大値とし、dp[1][0]=0から、次を平日にするdp[i+1][j+1]、休日にしてdp[i+1][0]へdp[i][j]+B_jを遷移する。全曜日後にmax_j(dp[N][j]+B_j)を答える。

## 典型の発動条件

### 円環の基準点固定

発動条件: 円環上に必ず存在する特別な要素があり、回転で位置を固定できるとき。

休日1つを曜日1へ固定し、跨ぎ区間だけを終端処理する。

### 区間寄与DP

発動条件: 選んだseparator間の寄与が区間長だけで決まるとき。

休日をseparatorとして平日列を閉じるたびB_jを加算する。

## 問題固有の要素

各平日の価値は左右の休日までの短い方の距離なので、休日間の配置詳細は平日列長dだけへ圧縮される。

別の問題へ持ち帰る視点: 局所価値が左右の境界までの距離で決まる問題では、境界を選ぶDPとgap長の前計算へ分離する。

## 正当性

休日が一つ以上ある円環では、隣接休日の間が独立な平日runへ分かれる。長さdのrunの生産性は両端の近い休日までの距離からA_1,A_1,A_2,A_2,…の最初d項の和B_dになる。回転して曜日1を休日と固定しても、生産性が曜日名によらないので最適値は変わらない。新休日を置く際に直前runのBを確定し、最後のrunを曜日1へ閉じれば全曜日の寄与が一回ずつ入る。末尾run長だけを持つ最大化DPが全休日集合を覆う。

## 実装上の注意

- 不可能状態は十分小さい値で初期化し、A_iの和が32bitを超えるため64bit整数を使う。
- 曜日1は休日として固定済みなので、その生産量を加えず、最後のB_jで週跨ぎ区間を一度だけ精算する。

## 復習の核

- 休日間に平日が1〜5日ある場合のB列を手で並べ、DPで途中のgapと最終gapがそれぞれ一度だけ加算されるかを追う。

## 計算量と制約

### 時間

O(N²)、曜日×末尾平日run長。

### 空間

O(N)、rolling DPとrun利益B。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N \le 5000; 1 \le A_i \le 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,A1=5,A2=A3=1。

1. 休日一日・平日二日の場合、両平日は休日距離1で利益10。
2. 休日二日なら5、全休日なら0。

期待される結果: 最大10。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

円環で最初の日を休日へ固定すると解を失うか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

曜日に固有の費用がなく回転対称なので任意解を回転できる。最後のrunを最初の休日へ閉じる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/tasks/abc285_e) — source-abc285-e-problem-5969ddb4e4b20f1cde65314e6076f59514c97d2a96fac730b85ceab969eca9a7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/editorial/5530) — source-abc285-editorial-5530-310be7210dbffe3c8ce1ed2c646edf0cf96ed70c1505ae86db112906fbd424f5
