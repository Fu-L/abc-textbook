---
title: "ABC338-E — Chords"
draft: true
authoringUnit: {"problemId":"abc338-e","docPath":"src/content/docs/problems/string-geometry/outcome-detect-crossing-by-cyclic-order/outcome-detect-crossing-by-cyclic-order-shard-001/abc338-e.md","learningOutcomeIds":["outcome-detect-crossing-by-cyclic-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cyclic-order-crossing"],"sourceRevisionIds":["source-abc338-e-problem-9dd60d4e5c4ed7772cd791c12f8b48bef91c588ae829b02c763fbe3f7f9e8bc0","source-abc338-editorial-9172-411422b4ddb0a7b0369c40a609943ac7f77967ee10923f39ad7fd7f30c5c8102"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二chordが交差する必要十分は円周端点順が交互になること。開いた区間がnested/disjointなら右端は最新左端のchordを閉じるのでstackが一致する。右端でtop不一致なら先に開いたchordの内側で別chordが開いたまま外へ続く交互順を具体的に得る。従って一度でも不一致が交差、最後まで一致なら非交差。","sourceRevisionIds":["source-abc338-e-problem-9dd60d4e5c4ed7772cd791c12f8b48bef91c588ae829b02c763fbe3f7f9e8bc0","source-abc338-editorial-9172-411422b4ddb0a7b0369c40a609943ac7f77967ee10923f39ad7fd7f30c5c8102"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-detect-crossing-by-cyclic-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"chord(1,3),(2,4)。","procedure":["端点1で第一push、2で第二push。","3のcloseは第一なのにtop第二。"],"executionTarget":null,"expectedResult":"Yes。","verificationStatus":"not_applicable","learningUnitIds":["unit-cyclic-order-crossing"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-detect-crossing-by-cyclic-order"],"prerequisiteIds":["unit-geometry-primitives"],"attainmentCondition":"(1,4),(2,3)なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"No。"},"answer":{"reasoningOrVerification":"二番目が内側で先に閉じ、最後に第一が閉じるのでtopは常に一致。","procedure":["具体例の各状態・寄与を再計算する。","二番目が内側で先に閉じ、最後に第一が閉じるのでtopは常に一致。"],"expectedResult":"No。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [円環順序・chord交差](src/content/docs/learn/geometry-optimization/cyclic-order-crossing.md)

- 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 円環順序・chord交差の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各chordの端点をA_i<B_iに揃え、円を1と2Nの間で切る。二本が交差するのは端点がA_i<A_j<B_i<B_jのように交互に現れる場合であり、交差がなければ開いたchord区間は互いにdisjointか完全にnestedになる。

採用する候補: 端点を順に走査し、open中のchordをstackで照合する

非交差ならnested区間の閉じ順は必ずLIFOであり、一度の線形走査で交差を検出できる。

棄却する候補: 全chord pairの端点順を比較する

pair数がO(N^2)でN=2×10^5に対応できない。

左端を見たchordをpushし、右端iを見た時にstack topがiでなければ、iの内側で開始した別chordがまだ閉じておらずA_i<A_j<B_i<B_jとなる。逆にtopが常に一致すれば全区間は正しくnestedし交差しない。

各chordで端点をmin/maxにし、位置1,…,2Nにchord IDと左/右種別を記録する。左端ならIDをpush、右端ならpopしたIDと比較し、不一致ならYesを即出力する。最後まで一致すればNo。

## 典型の発動条件

### 円環のcut展開

発動条件: 円周上の端点の交互配置を線形順序で判定したい。

端点間の切れ目で円を開き、各chordを区間の開閉eventとして扱う。

### 括弧列としてのstack判定

発動条件: 区間族が交差せずnested/disjointであるかを調べたい。

chord IDを括弧種類とみなし、closeが直近openと一致するか確認する。

## 問題固有の要素

全端点がdistinctなので、非交差chord配置の端点列はID付きの正しい括弧列と同値になる。

別の問題へ持ち帰る視点: 区間の部分重なり検出は、laminar族なら開閉eventがLIFOになることを使える。

## 正当性

二chordが交差する必要十分は円周端点順が交互になること。開いた区間がnested/disjointなら右端は最新左端のchordを閉じるのでstackが一致する。右端でtop不一致なら先に開いたchordの内側で別chordが開いたまま外へ続く交互順を具体的に得る。従って一度でも不一致が交差、最後まで一致なら非交差。

## 実装上の注意

- 各pairをA_i<B_iへswapしてからeventを置く。right event時にstackが空になる入力は端点distinctな正規pairでは起きないが安全に分岐できる。

## 復習の核

- disjoint、完全nested、端点が交互の二本、外側chordを跨いで複数交差する例でstack列を確認する。

## 計算量と制約

### 時間

O(N)。全2N端点のstack走査。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; 1\leq A_i,B_i \leq 2N; A_1,\dots,A_N,B_1,\dots,B_N are all distinct; All input values are integers

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

chord(1,3),(2,4)。

1. 端点1で第一push、2で第二push。
2. 3のcloseは第一なのにtop第二。

期待される結果: Yes。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

(1,4),(2,3)なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二番目が内側で先に閉じ、最後に第一が閉じるのでtopは常に一致。

確認結果: No。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/tasks/abc338_e) — source-abc338-e-problem-9dd60d4e5c4ed7772cd791c12f8b48bef91c588ae829b02c763fbe3f7f9e8bc0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/editorial/9172) — source-abc338-editorial-9172-411422b4ddb0a7b0369c40a609943ac7f77967ee10923f39ad7fd7f30c5c8102
