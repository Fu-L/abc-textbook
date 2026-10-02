---
title: "ABC411-G — Count Cycles"
draft: true
authoringUnit: {"problemId":"abc411-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc411-g.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic","unit-normalization"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc411-editorial-13360-88d62e2f490a7b2bd204d5f1c404398cdd69bec8f823420b771dacda7b56729e","source-abc411-g-problem-86e31d1f7ec35c6370031a0690d76a5cf2afa132666468bef901acf9c227f05a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二頂点 cycle は平行辺から異なる二本を選ぶ組なので別計数する。三頂点以上では最大頂点sが一意。s始点の訪問集合と終点のDPは、未訪問頂点への辺多重度を掛けて全単純pathを数える。sへの閉辺でcycleにし、同じ無向cycleは二方向のちょうど二回現れるため2で割る。最大頂点を制限することで始点回転の重複は生じない。","sourceRevisionIds":["source-abc411-editorial-13360-88d62e2f490a7b2bd204d5f1c404398cdd69bec8f823420b771dacda7b56729e","source-abc411-g-problem-86e31d1f7ec35c6370031a0690d76a5cf2afa132666468bef901acf9c227f05a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、辺1–2が二本、2–3が一本、1–3が一本。","procedure":["長さ2は1–2の二本を選ぶ1通り。","三角形は1–2を二本のどちらか選ぶ2通り。","三角形DPは向き込み4で、2で割る。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-state"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"prerequisiteIds":["unit-dp-state-design","unit-modular-arithmetic","unit-normalization"],"attainmentCondition":"長さ2も向き込みDPで2で割ればよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。同じ辺を往復した非cycleや辺選択の重複が混ざる。異なる平行二辺の組合せとして独立計数する。"},"answer":{"reasoningOrVerification":"不可。同じ辺を往復した非cycleや辺選択の重複が混ざる。異なる平行二辺の組合せとして独立計数する。","procedure":["具体例の各状態・寄与を再計算する。","不可。同じ辺を往復した非cycleや辺選択の重複が混ざる。異なる平行二辺の組合せとして独立計数する。"],"expectedResult":"不可。同じ辺を往復した非cycleや辺選択の重複が混ざる。異なる平行二辺の組合せとして独立計数する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ二頂点間の異なる二辺は長さ2の cycle を作り、その数は各 pair について C_{u,v} choose 2 で、頂点数3以上の simple cycle とは分けて数える必要がある。 長さ3以上の cycle は最大頂点 s を一意に持つ。s から頂点を重複せず辿る subset path DP を頂点1..sだけで行えば、cycleを最大頂点ごとに重複なく分類できる。 一つの長さ≥3の無向 cycle は s から時計回り／反時計回りに辿る二方向だけ dp に現れるため、closing sum へ inv2 を掛ける。 遷移 dp[S∪{j}][j]+=dp[S][i]C_{i,j}、閉じるときさらに C_{i,s} を掛けることで、同じ頂点列でも各隣接 pair の平行辺選択を独立に数えられる。

採用する候補: 辺多重度 C_{u,v} を遷移重みとする subset DP を最大頂点 s ごとに実行し、閉路を閉じる寄与を2で割る

dp[S][i] は s から S を一度ずつ通り i に至る path 数。未訪問 j への遷移と i→s の閉辺選択で multiedge の選び方も数えられ、N≤20で O(2^N N^2)。

棄却する候補: M 本の辺 subset を列挙して各集合が cycle か判定する

multi-edge により M は2×10^5あり 2^M は不可能で、cycleの頂点順序と各pairの辺選択を分離していない。

一つの長さ≥3の無向 cycle は s から時計回り／反時計回りに辿る二方向だけ dp に現れるため、closing sum へ inv2 を掛ける。

遷移 dp[S∪{j}][j]+=dp[S][i]C_{i,j}、閉じるときさらに C_{i,s} を掛けることで、同じ頂点列でも各隣接 pair の平行辺選択を独立に数えられる。

全 edge を C[u][v] に集計し、長さ2の寄与 Σ_{u<v}C_{u,v}(C_{u,v}-1)/2 を先に答えへ加える。s=3..Nごとに dp[{s}][s]=1 から、S⊆{1..s}、未訪問 j<s へ多重度付き遷移する。|S|≥3 の各末端 i から C_{i,s} で閉じる総和だけを inv2 倍し、長さ3以上の寄与として答えへ加える。

## 典型の発動条件

### Hamilton path 型 subset DP

発動条件: 小さい頂点集合上で頂点重複のない path/cycle を数えるとき。

訪問maskと末端頂点を状態にし、未訪問頂点だけへ伸ばす。

### canonical maximum による重複排除

発動条件: 同じ部分構造を複数の頂点集合範囲で数えそうなとき。

cycleの最大番号sを固定し、使用頂点を1..sに制限する。

### multi-edge の multiplicity 重み

発動条件: 頂点遷移は同じでも選べる辺自体を区別して数えるとき。

遷移ごとに端点間辺数 C_{i,j} を掛ける。

## 問題固有の要素

長さ2 cycleだけは二頂点間の平行辺二本という別構文で数え、長さ3以上は最大頂点を根にした二方向 path として数える。

別の問題へ持ち帰る視点: multi-graphのcycle数え上げでは、頂点列のDPと各stepの辺多重度を分け、通常graphにない最短cycleを先に切り出す。

## 正当性

二頂点 cycle は平行辺から異なる二本を選ぶ組なので別計数する。三頂点以上では最大頂点sが一意。s始点の訪問集合と終点のDPは、未訪問頂点への辺多重度を掛けて全単純pathを数える。sへの閉辺でcycleにし、同じ無向cycleは二方向のちょうど二回現れるため2で割る。最大頂点を制限することで始点回転の重複は生じない。

## 実装上の注意

- 長さ2をsubset DPへ混ぜず、|S|≥3だけ閉じる。C_{u,v} とDP積は毎回modを取り、各sでdpを初期化・再利用してmemoryを抑える。

## 復習の核

- 平行辺だけの二頂点graph、triangle各辺の多重度積、一つの4-cycle、chord付き小graphをedge subset全列挙と比較する。

## 計算量と制約

### 時間

N 頂点 M 辺。多重度化 O(M+N²)、最大頂点s別DPの合計 O(N²2^N)、全体 O(M+N²2^N)。

### 空間

pair多重度O(N²)、各sのpathDPを再利用して O(N2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 20; 2\leq M \leq 2\times 10^5; 1\leq U_i < V_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、辺1–2が二本、2–3が一本、1–3が一本。

1. 長さ2は1–2の二本を選ぶ1通り。
2. 三角形は1–2を二本のどちらか選ぶ2通り。
3. 三角形DPは向き込み4で、2で割る。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

長さ2も向き込みDPで2で割ればよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。同じ辺を往復した非cycleや辺選択の重複が混ざる。異なる平行二辺の組合せとして独立計数する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/editorial/13360) — source-abc411-editorial-13360-88d62e2f490a7b2bd204d5f1c404398cdd69bec8f823420b771dacda7b56729e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/tasks/abc411_g) — source-abc411-g-problem-86e31d1f7ec35c6370031a0690d76a5cf2afa132666468bef901acf9c227f05a
