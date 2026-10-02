---
title: "ABC439-F — Beautiful Kadomatsu"
draft: true
authoringUnit: {"problemId":"abc439-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc439-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-modular-arithmetic","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-coordinate-compression","tag-fenwick-weighted-prefix","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce","source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9","source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"部分列 a_1,…,a_k が門松的である必要十分条件は a_1<a_2 かつ a_{k-1}>a_k で、内部の大小変化は答えの真偽に影響しない。 l=r、すなわち長さ3では同じ中央要素に対して左小候補 p と右小候補 q の積 pq を数える。 l<r では元列の l と r の間にある要素は自由に採否を決められるため 2^(r-l-1) 倍になる。 美しい条件が両端の二不等式だけに縮み、Fenwick/segment tree と重み付き累積で O(N log N) に数えられる。","sourceRevisionIds":["source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce","source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9","source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(1,3,2)。","procedure":["長さ3の唯一の部分列は1<3>2で山1、谷0。","中央位置のleft小1、right小1の積。"],"executionTarget":null,"expectedResult":"条件部分列1個。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-coordinate-compression","unit-modular-arithmetic","unit-weighted-prefix-fenwick"],"attainmentCondition":"内部に山谷が複数あれば全て状態へ持つか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"折返しは交互なので山数>谷数は最初が上り最後が下りに同値。二端の条件だけへ圧縮できる。"},"answer":{"reasoningOrVerification":"折返しは交互なので山数>谷数は最初が上り最後が下りに同値。二端の条件だけへ圧縮できる。","procedure":["具体例の各状態・寄与を再計算する。","折返しは交互なので山数>谷数は最初が上り最後が下りに同値。二端の条件だけへ圧縮できる。"],"expectedResult":"折返しは交互なので山数>谷数は最初が上り最後が下りに同値。二端の条件だけへ圧縮できる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

順列なので隣接項は等しくない。大小関係列で山 < > の個数 x と谷 > < の個数 y を比べると、折返しは交互に現れ、x>y は部分列の最初が上り、最後が下りであることと同値になる。

採用する候補: 部分列の第2要素位置 l と末尾直前位置 r を固定し、左の小さい候補数 p、右の小さい候補数 q、内部自由選択 2^(r-l-1) を集約する。

美しい条件が両端の二不等式だけに縮み、Fenwick/segment tree と重み付き累積で O(N log N) に数えられる。

棄却する候補: 全ての部分列を列挙し、山と谷の個数を比較する。

部分列数が指数的である。

部分列 a_1,…,a_k が門松的である必要十分条件は a_1<a_2 かつ a_{k-1}>a_k で、内部の大小変化は答えの真偽に影響しない。

l=r、すなわち長さ3では同じ中央要素に対して左小候補 p と右小候補 q の積 pq を数える。

l<r では元列の l と r の間にある要素は自由に採否を決められるため 2^(r-l-1) 倍になる。

各位置 l の左側で P_j<P_l の個数 p_l、各 r の右側で P_j<P_r の個数 q_r を Fenwick 木で求める。長さ3の Σp_iq_i を加え、l<r の Σp_l q_r 2^(r-l-1) は r を走査し、値条件に応じた p_l·2^{-l} の集約を Fenwick/segment tree に保持して 2^(r-1)q_r を掛ける。

## 典型の発動条件

### 隣接比較列への変換

発動条件: 数列条件が山・谷など隣接大小の変化回数だけに依存するとき。

<,> 列で折返しの交互性を見て両端条件へ簡約する。

### 端点固定の部分列数え上げ

発動条件: 内部要素が自由で、最初/最後付近だけに条件がある部分列を数えるとき。

第2・末尾直前位置を固定し、端候補数の積と内部の 2 の冪を掛ける。

### 重み付き Fenwick 集約

発動条件: 二重和に値の大小条件と位置差の分離可能な重みがあるとき。

2^(r-l-1) を 2^(r-1)·2^{-l} に分け、P_l の値域 prefix sum へ載せる。

## 問題固有の要素

山と谷の差は内部の詳細でなく、比較符号列の開始符号と終了符号だけで決まる。

別の問題へ持ち帰る視点: 部分列の自由内部が 2 の冪になる二重和は、位置差指数を左右の積へ分離して sweep できる。

## 正当性

部分列 a_1,…,a_k が門松的である必要十分条件は a_1<a_2 かつ a_{k-1}>a_k で、内部の大小変化は答えの真偽に影響しない。 l=r、すなわち長さ3では同じ中央要素に対して左小候補 p と右小候補 q の積 pq を数える。 l<r では元列の l と r の間にある要素は自由に採否を決められるため 2^(r-l-1) 倍になる。 美しい条件が両端の二不等式だけに縮み、Fenwick/segment tree と重み付き累積で O(N log N) に数えられる。

## 実装上の注意

- 長さ3の l=r を一般 l<r 式と分ける。内部要素数 r-l-1、値の厳密不等号、左右候補が元の添字順を満たすことを確認する。

## 復習の核

- 折返し条件との同値性と、l=r および l<r の部分列が重複なく全て数えられることを確認する。

## 計算量と制約

### 時間

O(N log N)、左右小値countと重み付き集約。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 3 \times 10^5; P is a permutation of (1,2,\dots,N).

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(1,3,2)。

1. 長さ3の唯一の部分列は1<3>2で山1、谷0。
2. 中央位置のleft小1、right小1の積。

期待される結果: 条件部分列1個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

内部に山谷が複数あれば全て状態へ持つか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

折返しは交互なので山数>谷数は最初が上り最後が下りに同値。二端の条件だけへ圧縮できる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14989) — source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14996) — source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/tasks/abc439_f) — source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797
