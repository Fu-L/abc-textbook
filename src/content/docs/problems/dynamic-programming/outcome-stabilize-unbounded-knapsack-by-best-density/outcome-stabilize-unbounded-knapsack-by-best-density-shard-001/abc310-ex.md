---
title: "ABC310-EX — Negative Cost"
draft: true
authoringUnit: {"problemId":"abc310-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-stabilize-unbounded-knapsack-by-best-density/outcome-stabilize-unbounded-knapsack-by-best-density-shard-001/abc310-ex.md","learningOutcomeIds":["outcome-stabilize-unbounded-knapsack-by-best-density"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-eventual-unbounded-knapsack","tag-knapsack-resource"],"sourceRevisionIds":["source-abc310-editorial-6794-7767ff020d4423335f0997e80c56115825006dcfae36bf7a5468095cc489bb5b","source-abc310-ex-problem-db87c46124e4ba901645279dde5b9f7c4b4c380f5d256656c04f6cee7ec94eba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"符号を反転した魔力増分を用いる。高い魔力で隣接する増加技と減少技を交換しても、減少幅はL以下なので有効性を保つ。この交換で任意の有効列を、全prefix魔力が2L未満の列の連結へ変えられる。長い基本列では最初2L+1個のprefixに同じ魔力が現れる。間のゼロ収支区間を取り除いた列は有効で、その区間は最小prefixの直後へ巡回して有効にできる。長さに関する帰納法で長さ2L以下の基本列だけで十分となる。各長さの最大damageをDPで求める。最良damage/長さのcombo z以外がz個あれば、prefix長さのmod zが一致する区間をzの反復に交換し、長さを増やさずdamageを減らさず例外数を減らせる。従って例外総長さO(L²)だけをknapsackで調べ、残りをzで埋める全候補の最小が最適値である。","sourceRevisionIds":["source-abc310-editorial-6794-7767ff020d4423335f0997e80c56115825006dcfae36bf7a5468095cc489bb5b","source-abc310-ex-problem-db87c46124e4ba901645279dde5b9f7c4b4c380f5d256656c04f6cee7ec94eba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-stabilize-unbounded-knapsack-by-best-density"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"攻撃(C,D)=(0,3),(−1,1)、H=5。","procedure":["一actionの最大damage3なので一回では届かない。","cost0攻撃二回でdamage6、費用制約を満たす。"],"executionTarget":null,"expectedResult":"最少2action。","verificationStatus":"not_applicable","learningUnitIds":["unit-eventual-unbounded-knapsack"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-stabilize-unbounded-knapsack-by-best-density"],"prerequisiteIds":["unit-dp-subset-resource"],"attainmentCondition":"Hを直接knapsackの軸にするべきか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"Hは10¹⁸なので不可。最大効率comboの反復を閉形式にし、交換でO(L²)費用の例外だけDPする。"},"answer":{"reasoningOrVerification":"Hは10¹⁸なので不可。最大効率comboの反復を閉形式にし、交換でO(L²)費用の例外だけDPする。","procedure":["具体例の各状態・寄与を再計算する。","Hは10¹⁸なので不可。最大効率comboの反復を閉形式にし、交換でO(L²)費用の例外だけDPする。"],"expectedResult":"Hは10¹⁸なので不可。最大効率comboの反復を閉形式にし、交換でO(L²)費用の例外だけDPする。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [大容量unbounded knapsackのeventual linearity](src/content/docs/learn/dynamic-programming/eventual-unbounded-knapsack.md)

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

魔力増減 C_i の絶対値上限 L=300 は小さい一方、目標ダメージ H は 10^18 と巨大で、使用回数をそのまま DP の軸にできない。

有効列の prefix 収支が高くなり過ぎた部分は技の交換で並べ替えられ、同じ長さ・ダメージを保ったまま収支 2L 未満の基本列の連結へ分解できる。

採用する候補: 長さ 2L 以下の基本有効列をコンボへ圧縮し、効率最大コンボの大量反復と少数の例外コンボを組み合わせる。

収支状態が O(L)、基本列長が 2L に制限され、さらに最適解の非最強コンボ数も 2L 未満へ交換できるため H 依存を消せる。

棄却する候補: 魔力と累積ダメージを状態にして、技を一手ずつ選ぶ最短路または DP を行う。

魔力は上限がなく H も 10^18 なので状態空間を有限の実用範囲へ切れない。

prefix 収支を 0..2L−1 に抑えた列では 2L+1 個の prefix に同じ収支が現れ、ゼロ収支区間を切り出して短い基本列へ分解できる。

コスト当たりダメージ最大の長さ z のコンボに対し、z 個の例外コンボにはコスト和が mod z で一致する部分列があり、最強コンボへ置換できる。

dp[len][balance] で長さ 2L 以下の基本列の最大ダメージを O(NL²) で求め、長さごとの最大値 d_len をコンボとする。効率 d_z/z 最大の z を選び、例外コンボ総コスト O(L²) までの無制限 knapsack で最大ダメージ M_x を O(L³) で計算する。各 x に不足分を z コンボで補った総手数の最小を取る。

## 典型の発動条件

### 交換論法による列の正規形

発動条件: 順序制約付きの長い列で、十分な資源がある区間の要素交換が実行可能性を壊さないとき。

高収支域で正負の技を交換し、短い有効ブロックの連結へ正規化する。

### 効率最大要素＋有界な例外

発動条件: 目標値だけが巨大な unbounded knapsack で、品物コストが小さく効率順の置換が可能なとき。

最良比率の品物を大量使用し、それ以外の総コストだけ小範囲 DP する。

## 問題固有の要素

小さいのは技数 N ではなく魔力変化幅 L であり、鳩の巣原理を prefix 収支へ使うことで任意長の戦闘を有限コンボへ圧縮できる。

別の問題へ持ち帰る視点: 巨大目標の最適化では、局所変化幅から周期・交換・短い生成元を作れないか探す。

## 正当性

符号を反転した魔力増分を用いる。高い魔力で隣接する増加技と減少技を交換しても、減少幅はL以下なので有効性を保つ。この交換で任意の有効列を、全prefix魔力が2L未満の列の連結へ変えられる。長い基本列では最初2L+1個のprefixに同じ魔力が現れる。間のゼロ収支区間を取り除いた列は有効で、その区間は最小prefixの直後へ巡回して有効にできる。長さに関する帰納法で長さ2L以下の基本列だけで十分となる。各長さの最大damageをDPで求める。最良damage/長さのcombo z以外がz個あれば、prefix長さのmod zが一致する区間をzの反復に交換し、長さを増やさずdamageを減らさず例外数を減らせる。従って例外総長さO(L²)だけをknapsackで調べ、残りをzで埋める全候補の最小が最適値である。

## 実装上の注意

- C の符号反転後の「魔力増加」の向きを統一し、到達不能 dp を十分小さい sentinel にする。比率は除算せず d_i·z で比較し、H 付近の切上げを 128 bit で行う。

## 復習の核

- 制約の小さい定数 L が何を有界化するかを追う。二段の交換論法――有効列の短ブロック化と最良効率以外の回数制限――を混同せず復元する。

## 計算量と制約

### 時間

O(NL²+L³)、L=max(1,max_i abs(C_i))≤300。長さ2L・魔力2L未満の基本列DPとO(L²)総長さの例外knapsack。

### 空間

O(L²)、基本列と例外table。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; 1 \leq H \leq 10^{18}; -300 \leq C_i \leq 300; C_i \leq 0 for some 1 \leq i \leq N.; 1 \leq D_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

攻撃(C,D)=(0,3),(−1,1)、H=5。

1. 一actionの最大damage3なので一回では届かない。
2. cost0攻撃二回でdamage6、費用制約を満たす。

期待される結果: 最少2action。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

Hを直接knapsackの軸にするべきか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

Hは10¹⁸なので不可。最大効率comboの反復を閉形式にし、交換でO(L²)費用の例外だけDPする。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/editorial/6794) — source-abc310-editorial-6794-7767ff020d4423335f0997e80c56115825006dcfae36bf7a5468095cc489bb5b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/tasks/abc310_h) — source-abc310-ex-problem-db87c46124e4ba901645279dde5b9f7c4b4c380f5d256656c04f6cee7ec94eba
