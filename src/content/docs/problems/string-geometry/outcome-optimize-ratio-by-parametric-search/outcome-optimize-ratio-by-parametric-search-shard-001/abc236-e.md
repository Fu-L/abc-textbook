---
title: "ABC236-E — Average and Median"
draft: true
authoringUnit: {"problemId":"abc236-e","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-ratio-by-parametric-search/outcome-optimize-ratio-by-parametric-search-shard-001/abc236-e.md","learningOutcomeIds":["outcome-optimize-ratio-by-parametric-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-monotone-search"],"excludedTopics":["fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-fractional-parametric-search","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc236-e-problem-5f69c8c6899723655022d7f0e5013316d5a62150df71e9d374df34f169744e32","source-abc236-editorial-3279-5fdbcfbd9d3e46d2ea40d72e73cf40ff8bd6a8395405fd27400b039a6ca44e62"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"閾値Kに対し平均≥Kは選んだ(A_i−K)の和≥0と同値。下側中央値≥Kは選んだ+1（A_i≥K）と−1の和が正であることと同値。選択状態は前の二状態から、非選択状態は前の選択状態だけから遷移するので、連続非選択禁止を満たす全ての集合を過不足なく扱う。最大和による可否はKについて単調だから二分探索できる。中央値の判定を非負にすると偶数枚の下側中央値を誤る。","sourceRevisionIds":["source-abc236-e-problem-5f69c8c6899723655022d7f0e5013316d5a62150df71e9d374df34f169744e32","source-abc236-editorial-3279-5fdbcfbd9d3e46d2ea40d72e73cf40ff8bd6a8395405fd27400b039a6ca44e62"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-ratio-by-parametric-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=[1,4,1]。平均の閾値3、中央値の閾値4。","procedure":["中央だけを選べば隣接対は両方とも選択カードを含む。","平均の変換和は4−3=1≥0、中央値の変換和は+1>0。","各目的の上限は最大要素4であり、この選択が達成する。"],"executionTarget":null,"expectedResult":"最大平均4、最大中央値4。","verificationStatus":"not_applicable","learningUnitIds":["unit-fractional-parametric-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-ratio-by-parametric-search"],"prerequisiteIds":["unit-dp-state-design","unit-monotone-search"],"attainmentCondition":"選んだ値が[1,4]のとき、中央値閾値4を変換和≥0で許してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"許せない。下側中央値は1であり、変換和は−1+1=0。正という条件でなければ偽陽性になる。"},"answer":{"reasoningOrVerification":"許せない。下側中央値は1であり、変換和は−1+1=0。正という条件でなければ偽陽性になる。","procedure":["具体例の各状態・寄与を再計算する。","許せない。下側中央値は1であり、変換和は−1+1=0。正という条件でなければ偽陽性になる。"],"expectedResult":"許せない。下側中央値は1であり、変換和は−1+1=0。正という条件でなければ偽陽性になる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [fractional programming・比率parametric search](src/content/docs/learn/geometry-optimization/fractional-parametric-search.md)

- 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

隣接二枚の少なくとも一方を選ぶ条件は、カードを選ばない状態を二回連続させないという局所制約である。

平均・中央値の値そのものを状態にせず、候補 K 以上を実現できるかへ変えると、どちらも変換後重みの選択総和判定になる。

棄却する候補: 条件を満たす全カード部分集合を列挙し、平均と中央値を個別に計算する。

非選択が連続しない集合でも指数個あり、N＝10 万では列挙できない。

採用する候補: 答え K を二分探索し、各 A_i を平均なら A_i−K、中央値なら A_i≥K で +1、未満で −1 に変換して二状態 DP の最大和を判定する。

K の可否は単調で、共通の選択・非選択 DP が局所制約下の変換重み最大値を一走査で求める。

平均≥K は Σ(A_i−K)≥0、中央値≥K は K 以上の個数が K 未満の個数より多い、という加法条件へ変換できる。

比率・順序統計量の最大化を parametric search で加重選択問題へ移し、直前カードを選んだかだけの DP で各閾値の feasibility oracle を作る。

## 典型の発動条件

### 平均・中央値の答え二分探索

発動条件: 選択集合上の平均または中央値を最大化し、候補値以上という条件が加法的に書けるとき。

平均は値から K を引き、中央値は閾値以上を +1、未満を −1 として選択和を判定する。

### 連続非選択禁止の二状態 DP

発動条件: 各隣接対の少なくとも一方を選ぶという局所制約の下で重み和を最大化するとき。

現在を選ぶ状態は前の両状態、選ばない状態は前を選んだ状態だけから遷移する。

## 問題固有の要素

本問の中央値は小さい方の中央順位なので、中央値≥K の条件は +1 と −1 の和が 0 以上ではなく正であることになる。

別の問題へ持ち帰る視点: 中央値の閾値変換では、偶数個のとき採用する中央順位を確認し、個数差の厳密・非厳密境界を導く。

## 正当性

閾値Kに対し平均≥Kは選んだ(A_i−K)の和≥0と同値。下側中央値≥Kは選んだ+1（A_i≥K）と−1の和が正であることと同値。選択状態は前の二状態から、非選択状態は前の選択状態だけから遷移するので、連続非選択禁止を満たす全ての集合を過不足なく扱う。最大和による可否はKについて単調だから二分探索できる。中央値の判定を非負にすると偶数枚の下側中央値を誤る。

## 実装上の注意

- 平均は十分な回数の浮動小数二分探索または 10^3 倍した整数探索を使い、判定誤差を出力許容内に収める。
- DP の終了値は最後を選ぶ・選ばない両方の最大を取り、非選択状態を前の非選択状態から遷移させない。

## 復習の核

- 平均や中央値の最適化では、固定 K の可否を値の総和へ翻訳できるかを最初に試す。
- 中央値を ±1 へ変換した後の判定符号は、偶数・奇数の小例を並べて定義した順位から確認する。

## 計算量と制約

### 時間

O(NI)。平均の探索回数をI、中央値ではI=O(log max A)。

### 空間

O(1)補助領域。入力保持ならO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq A_i \leq 10^{9}; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=[1,4,1]。平均の閾値3、中央値の閾値4。

1. 中央だけを選べば隣接対は両方とも選択カードを含む。
2. 平均の変換和は4−3=1≥0、中央値の変換和は+1>0。
3. 各目的の上限は最大要素4であり、この選択が達成する。

期待される結果: 最大平均4、最大中央値4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

選んだ値が[1,4]のとき、中央値閾値4を変換和≥0で許してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

許せない。下側中央値は1であり、変換和は−1+1=0。正という条件でなければ偽陽性になる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/tasks/abc236_e) — source-abc236-e-problem-5f69c8c6899723655022d7f0e5013316d5a62150df71e9d374df34f169744e32
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/editorial/3279) — source-abc236-editorial-3279-5fdbcfbd9d3e46d2ea40d72e73cf40ff8bd6a8395405fd27400b039a6ca44e62
