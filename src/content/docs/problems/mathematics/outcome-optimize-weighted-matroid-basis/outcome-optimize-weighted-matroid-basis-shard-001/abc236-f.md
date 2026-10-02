---
title: "ABC236-F — Spices"
draft: true
authoringUnit: {"problemId":"abc236-f","docPath":"src/content/docs/problems/mathematics/outcome-optimize-weighted-matroid-basis/outcome-optimize-weighted-matroid-basis-shard-001/abc236-f.md","learningOutcomeIds":["outcome-optimize-weighted-matroid-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-xor-linear-basis"],"excludedTopics":["matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-matroid-greedy","tag-xor-linear-basis"],"sourceRevisionIds":["source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea","source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"購入値が作るXOR集合は線形spanである。全値生成はrank=Nと同値。独立集合は線形マトロイドをなし、安価順に独立なものだけ採る貪欲は交換性により最小費用基底を得る。従属候補を捨ててもspanを増やさないので必要な表現能力は失われない。","sourceRevisionIds":["source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea","source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-weighted-matroid-basis"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、価格c_1=4,c_2=5,c_3=1。","procedure":["最安の3を採用、次に1を採用すると3 XOR 1=2も作れる。","rank2で全4ベクトルを生成。"],"executionTarget":null,"expectedResult":"最小費用5。","verificationStatus":"not_applicable","learningUnitIds":["unit-matroid-greedy"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-weighted-matroid-basis"],"prerequisiteIds":["unit-greedy-exchange","unit-xor-linear-basis"],"attainmentCondition":"rank=Nの後に安い従属ベクトルを追加する必要は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"追加不要。"},"answer":{"reasoningOrVerification":"既に全空間を生成しており追加は能力を増やさず費用だけ増える。","procedure":["具体例の各状態・寄与を再計算する。","既に全空間を生成しており追加は能力を増やさず費用だけ増える。"],"expectedResult":"追加不要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [matroid greedy](src/content/docs/learn/combinatorics-algebra/matroid-greedy.md)

- 独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

対象外:

- matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

買った辛さ集合から作れる値は、その整数を N bit ベクトルと見たときの F₂ 上の線形結合、すなわち XOR span である。

1 から 2^N−1 の全辛さを作るには span が N 次元空間全体であればよく、必要なのは最小費用の線形基底である。

棄却する候補: 値段が安い N 種類のスパイスを買い、それらの XOR で全値を作れるか調べる。

安いベクトル同士が線形従属なら rank が N に届かず、全辛さを生成できない。

採用する候補: スパイスを価格昇順に見て、現在の XOR span に含まれないベクトルだけを基底へ追加する。

線形独立集合は線形マトロイドをなし、重み昇順で独立性を保つ greedy が最小重み基底を与える。

独立なベクトルを一つ追加するたびに作れる XOR の個数は 2 倍になり、N 回追加すれば 2^N 個の全ベクトルを生成できる。

辛さの XOR 合成を二元体上の線形代数へ翻訳し、価格順 Kruskal 型 greedy と XOR Gaussian elimination で最小費用基底を選ぶ。

## 典型の発動条件

### XOR 線形基底

発動条件: 選んだ整数の任意 XOR で作れる値集合や、その rank を管理するとき。

各候補を上位 bit から基底で消去し、0 にならなければ新 pivot として追加する。

### 線形マトロイドの重み付き greedy

発動条件: 最小重みでベクトル空間を張る独立集合を選びたいとき。

価格昇順に独立性を増す候補だけ採用し、rank N で停止する。

## 問題固有の要素

「全ての非零辛さを作る」という指数個の要求は、span の次元が N という一つの rank 条件に集約される。

別の問題へ持ち帰る視点: XOR で全値生成を要求されたら各値を確認せず、生成集合が部分空間であることから基底・rank を見る。

## 正当性

購入値が作るXOR集合は線形spanである。全値生成はrank=Nと同値。独立集合は線形マトロイドをなし、安価順に独立なものだけ採る貪欲は交換性により最小費用基底を得る。従属候補を捨ててもspanを増やさないので必要な表現能力は失われない。

## 実装上の注意

- 候補は辛さ値 i と価格 c_i の組でソートし、基底へ追加できた場合だけ価格を答えへ加える。
- rank が N に達したら全辛さを生成可能であり、それ以降の従属・独立候補を見る必要はない。

## 復習の核

- 任意部分集合 XOR で全値を作る条件は、到達配列より先に F₂ 上の span と rank へ読み替える。
- 価格順 greedy の正当性は単なる直感でなく、線形独立集合の交換性を持つマトロイド基底として確認する。

## 計算量と制約

### 時間

O(2^N log(2^N)+N2^N)。価格sortと各候補の基底消去を行う。

### 空間

O(2^N+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 16; 1 \leq c_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、価格c_1=4,c_2=5,c_3=1。

1. 最安の3を採用、次に1を採用すると3 XOR 1=2も作れる。
2. rank2で全4ベクトルを生成。

期待される結果: 最小費用5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

rank=Nの後に安い従属ベクトルを追加する必要は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

既に全空間を生成しており追加は能力を増やさず費用だけ増える。

確認結果: 追加不要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/editorial/3287) — source-abc236-editorial-3287-6e194389570b5191f1996eca8fa2e2dbceabf9c43e18c3c8c2cc1f8d68fc40ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/tasks/abc236_f) — source-abc236-f-problem-5222090d62cf04cc1359e633e3019bbd762b40f11c1fdff029f43675e704d3f1
