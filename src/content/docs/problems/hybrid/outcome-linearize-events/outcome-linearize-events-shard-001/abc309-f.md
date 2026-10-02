---
title: "ABC309-F — Box in Box"
draft: true
authoringUnit: {"problemId":"abc309-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc309-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-range-monoid-aggregation"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-coordinate-compression","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc309-editorial-6749-98ac1871ea8d174b0bd5bff4727ef3a6150b1be6a81d3de97f6a84f185d3dc37","source-abc309-f-problem-af7da23718a2c29e3bde282433111f3d78b057a829c074e805216bd258134b85"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"回転の選択を探索する代わりに三辺をソートすれば、「ある向きで入る」と正規化後の成分ごとの strict dominance が同値になる。 w を座標圧縮し、prefix [0,w) に登録済みの d の最小値を持てば、存在判定に必要な過去全体を一値へ集約できる。 過去集合を h が真に小さい箱だけに限定し、区間最小値が d 未満かで残る二座標の strict dominance を判定できる。","sourceRevisionIds":["source-abc309-editorial-6749-98ac1871ea8d174b0bd5bff4727ef3a6150b1be6a81d3de97f6a84f185d3dc37","source-abc309-f-problem-af7da23718a2c29e3bde282433111f3d78b057a829c074e805216bd258134b85"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-events"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"箱辺(3,1,2),(4,2,3)。","procedure":["正規化は(1,2,3),(2,3,4)。","各成分strictly lessなので前者が後者へ入る。"],"executionTarget":null,"expectedResult":"Yes。","verificationStatus":"not_applicable","learningUnitIds":["unit-event-sweep"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-events"],"prerequisiteIds":["unit-coordinate-compression","unit-range-monoid-aggregation"],"attainmentCondition":"箱(1,2,3),(1,3,4)も入るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"最小辺が同じ1なのでstrict条件を満たさない。同h groupを全query後に更新する。"},"answer":{"reasoningOrVerification":"最小辺が同じ1なのでstrict条件を満たさない。同h groupを全query後に更新する。","procedure":["具体例の各状態・寄与を再計算する。","最小辺が同じ1なのでstrict条件を満たさない。同h groupを全query後に更新する。"],"expectedResult":"最小辺が同じ1なのでstrict条件を満たさない。同h groupを全query後に更新する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

箱は自由に回転できるので、各箱の三辺を昇順 h≤w≤d に正規化してよい。すると必要なのは三座標すべてが真に小さい点対の存在判定である。

h の昇順に走査すれば第一座標は処理順へ移せるが、h が等しい箱同士を参照させない工夫が strict な不等号に必要になる。

採用する候補: h ごとに同値群をまとめ、過去の箱について w 未満の最小 d をセグメント木で問い合わせてから同値群を一括追加する。

過去集合を h が真に小さい箱だけに限定し、区間最小値が d 未満かで残る二座標の strict dominance を判定できる。

棄却する候補: 正規化した全箱の二組を比較して、三辺がすべて小さい組を探す。

N=2×10^5 では N² 比較が不可能であり、第一座標の順序を活用できていない。

回転の選択を探索する代わりに三辺をソートすれば、「ある向きで入る」と正規化後の成分ごとの strict dominance が同値になる。

w を座標圧縮し、prefix [0,w) に登録済みの d の最小値を持てば、存在判定に必要な過去全体を一値へ集約できる。

各箱の辺を昇順化し、h 昇順で同じ h を一群にする。群内の各 (w,d) についてセグメント木の w 未満の最小値が d 未満なら Yes。全照会後に各 w へ d の min 更新を行い、最後まで無ければ No とする。

## 典型の発動条件

### 多次元 strict dominance の平面走査

発動条件: 複数座標がすべて真に小さい点対を多数の点から探すとき。

一座標を走査順へ移し、残る座標を区間集約データ構造で判定する。

### 同値キーの遅延追加

発動条件: 走査キーに strict 不等号があり、同値要素同士を過去として扱うと誤答するとき。

同じ h の問い合わせをすべて済ませてから更新し、h<h_current を不変条件にする。

## 問題固有の要素

三辺を箱ごとにソートする正規化が、6 通りの回転を消すだけでなく比較軸を共通化する。

別の問題へ持ち帰る視点: 対称な向きを持つ物体では、向き全探索の前に sorted components による支配関係へ落ちないか調べる。

## 正当性

回転の選択を探索する代わりに三辺をソートすれば、「ある向きで入る」と正規化後の成分ごとの strict dominance が同値になる。 w を座標圧縮し、prefix [0,w) に登録済みの d の最小値を持てば、存在判定に必要な過去全体を一値へ集約できる。 過去集合を h が真に小さい箱だけに限定し、区間最小値が d 未満かで残る二座標の strict dominance を判定できる。

## 実装上の注意

- w 未満を問い合わせて w 自身を含めないこと、同じ h の更新を照会後に行うことの二箇所で strict 条件を守る。初期値は全 d より大きくする。

## 復習の核

- 多次元比較ではまず等号が許される軸を明記する。この問題では三軸とも strict なので、ソート順だけでなく同値群の更新時刻まで点検する。

## 計算量と制約

### 時間

O(N log N)、三辺sortは固定三値。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq h_i,w_i,d_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

箱辺(3,1,2),(4,2,3)。

1. 正規化は(1,2,3),(2,3,4)。
2. 各成分strictly lessなので前者が後者へ入る。

期待される結果: Yes。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

箱(1,2,3),(1,3,4)も入るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

最小辺が同じ1なのでstrict条件を満たさない。同h groupを全query後に更新する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/editorial/6749) — source-abc309-editorial-6749-98ac1871ea8d174b0bd5bff4727ef3a6150b1be6a81d3de97f6a84f185d3dc37
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/tasks/abc309_f) — source-abc309-f-problem-af7da23718a2c29e3bde282433111f3d78b057a829c074e805216bd258134b85
