---
title: "ABC375-E — 3 Team Division"
draft: true
authoringUnit: {"problemId":"abc375-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc375-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-knapsack-resource"],"sourceRevisionIds":["source-abc375-e-problem-e634cc42bacb06c26385cba565e1e223f751929f8335e4de342352ec8335c946","source-abc375-editorial-11140-5e3559638ffdc90c2295a763c1e5bb8be59bca1f0c8512a9a2e3312d822c9885"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"処理prefixの第三チーム和はprefix総和−x−yで復元できる。三チームへの配置を全て遷移し元チームと違う場合だけ費用1なので各割当を正しく評価する。同じ二和では変更数最小が全将来に優越し、終端(B,B)で三つ目もBになる。","sourceRevisionIds":["source-abc375-e-problem-e634cc42bacb06c26385cba565e1e223f751929f8335e4de342352ec8335c946","source-abc375-editorial-11140-5e3559638ffdc90c2295a763c1e5bb8be59bca1f0c8512a9a2e3312d822c9885"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3人、元チーム(1,1,3)、強さ(1,1,1)。","procedure":["総和3なので各1。","チーム1の二人の一方をチーム2へ移す。","他二人はそのまま。"],"executionTarget":null,"expectedResult":"最小変更1","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-dp-subset-resource"],"attainmentCondition":"Sが3で割れないとき四捨五入した目標でDPしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。整数強さの三和を等しくできないので−1。"},"answer":{"reasoningOrVerification":"不可。整数強さの三和を等しくできないので−1。","procedure":["具体例の各状態・寄与を再計算する。","不可。整数強さの三和を等しくできないので−1。"],"expectedResult":"不可。整数強さの三和を等しくできないので−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

総強さ S が3で割れなければ不可能である。3チームのうち2チームの強さを決めれば、処理済み総和から3チーム目は一意に決まるため三次元の強さ状態は不要である。 i 人までの B 総和を pref_i とすれば第三チームの強さは pref_i-x-y で、状態から失われる情報はない。 元の所属先へ置く遷移コストは0、それ以外は1であり、最後の dp[S/3][S/3] が変更人数最小値になる。

採用する候補: dp[x][y] をチーム1,2の強さが x,y になる最小変更人数として、人ごとに三つの所属先へ遷移する。

目標は各 S/3 で、第三チームを省略すれば状態数 O(S^2)、遷移 O(NS^2) の範囲に収まる。

棄却する候補: 三チームそれぞれの強さ x,y,z を状態に持つ DP を行う。

処理済み総和から z は決まるのに S^3 状態を確保し、S≤1500でも時間・空間とも過大になる。

i 人までの B 総和を pref_i とすれば第三チームの強さは pref_i-x-y で、状態から失われる情報はない。

元の所属先へ置く遷移コストは0、それ以外は1であり、最後の dp[S/3][S/3] が変更人数最小値になる。

S%3 を確認し、INF で初期化した二次元 DP の dp[0][0]=0 から各人をチーム1,2,3へ割り当てる。x,y は S/3 以下だけを保持し、rolling array で更新する。

## 典型の発動条件

### 総和で次元を落とす DP

発動条件: 複数グループへの配分で総量が既知のとき。

最後の一グループ量を処理済み総和から復元して状態から除く。

## 問題固有の要素

三者均等分割でも自由度は二つしかないので、見かけのチーム数をそのまま状態次元にしない。

別の問題へ持ち帰る視点: 最終目標を超える強さは非負重みゆえ戻せず、早期に枝刈りできる。

## 正当性

処理prefixの第三チーム和はprefix総和−x−yで復元できる。三チームへの配置を全て遷移し元チームと違う場合だけ費用1なので各割当を正しく評価する。同じ二和では変更数最小が全将来に優越し、終端(B,B)で三つ目もBになる。

## 実装上の注意

- S/3 までに配列を切り、同一人物を複数回使わないよう旧配列から新配列へ遷移する。不可能時は -1 を返す。

## 復習の核

- dp の各状態で暗黙の第三チーム強さを書き、なぜ負値や目標超過を捨ててよいかまで確認する。

## 計算量と制約

### 時間

N 人、強さ総和S、目標B=S/3。二チーム和DP O(NB²)。

### 空間

rolling二和 O(B²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 100; A_i \in \lbrace 1, 2, 3 \rbrace; For each x \in \lbrace 1, 2, 3 \rbrace, there exists some i with A_i = x.; 1 \leq B_i; \displaystyle\sum_{i = 1}^{N} B_i \leq 1500; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3人、元チーム(1,1,3)、強さ(1,1,1)。

1. 総和3なので各1。
2. チーム1の二人の一方をチーム2へ移す。
3. 他二人はそのまま。

期待される結果: 最小変更1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

Sが3で割れないとき四捨五入した目標でDPしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。整数強さの三和を等しくできないので−1。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/tasks/abc375_e) — source-abc375-e-problem-e634cc42bacb06c26385cba565e1e223f751929f8335e4de342352ec8335c946
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/editorial/11140) — source-abc375-editorial-11140-5e3559638ffdc90c2295a763c1e5bb8be59bca1f0c8512a9a2e3312d822c9885
