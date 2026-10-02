---
title: "ABC366-G — XOR Neighbors"
draft: true
authoringUnit: {"problemId":"abc366-g","docPath":"src/content/docs/problems/mathematics/outcome-solve-linear-system-and-rank/outcome-solve-linear-system-and-rank-shard-001/abc366-g.md","learningOutcomeIds":["outcome-solve-linear-system-and-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bitset-word-parallel","unit-constructive-witness"],"excludedTopics":["線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-linear-system-rank","tag-bitset-word-parallel","tag-constructive-witness"],"sourceRevisionIds":["source-abc366-editorial-10641-ec072cdede89c9d3c18d5de5930b5d6b3bf3684a2bc8a17ae4b7116a2974fce3","source-abc366-g-problem-ad99ac5d70a5a554d814fefa08d734090fad5b47a1b1d082b0a713dfdc27ab75"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各bitの隣接XOR条件はAx=0であり、全合法bit列はkernel。どのkernel基底でもcoordinate iが全基底で0なら全kernelで0となり頂点iへ非零を置けない。逆に各coordinateがある基底で1なら基底番号を異なるbitとして重ねれば全頂点非零で、各bitがkernelなので全隣接XORも0。OR被覆条件は必要十分。","sourceRevisionIds":["source-abc366-editorial-10641-ec072cdede89c9d3c18d5de5930b5d6b3bf3684a2bc8a17ae4b7116a2974fce3","source-abc366-g-problem-ad99ac5d70a5a554d814fefa08d734090fad5b47a1b1d082b0a713dfdc27ab75"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-linear-system-and-rank"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3頂点triangle。","procedure":["kernel vector(1,1,1)がある。","各頂点値を1にすると隣接二値のXORは1 XOR1=0。"],"executionTarget":null,"expectedResult":"Yes、値(1,1,1)。","verificationStatus":"not_applicable","learningUnitIds":["unit-linear-system-rank"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-linear-system-and-rank"],"prerequisiteIds":["unit-bitset-word-parallel","unit-constructive-witness"],"attainmentCondition":"3頂点pathでは。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"No。"},"answer":{"reasoningOrVerification":"端点の式が中央値0を要求するので中央へ非零を置けない。基底ORも中央を覆わない。","procedure":["具体例の各状態・寄与を再計算する。","端点の式が中央値0を要求するので中央へ非零を置けない。基底ORも中央を覆わない。"],"expectedResult":"No。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)

- 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)
- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

対象外:

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各bitについて頂点値vector xを考えると、全頂点で隣接値XORが0という条件はGF(2)上の隣接行列Aに対するAx=0である。

各頂点へ非零整数を置くには、選んだkernel vector群のbitwise ORが全座標を覆えばよい。kernel基底で覆えない座標はkernelのどのvectorでも1にできない。

採用する候補: 隣接行列をGF(2)で掃き出してkernel基底を求め、基底indexを出力整数のbitへ割り当てる。

各bit vectorが条件式を満たし、基底のORによる座標被覆が非零条件の必要十分判定になる。

棄却する候補: 各頂点へ非零整数を順に割り当て、隣接XOR条件を後から局所修正する。

一頂点の変更が全隣接式へ同時に影響し、局所選択では連立一次制約を保てない。

kernelはXORで閉じるvector spaceなので、基底に現れない座標は全解で0、どれかの基底に現れる座標は対応bitで非零化できる。

N≤60なら各rowとvectorを64 bit maskにし、pivot消去でrank・free変数・kernel基底を構成できる。

隣接行列の各rowをbit maskにしてGF(2) Gaussian eliminationを行う。各free変数を1としたkernel基底vectorを復元し、そのORが全N bitを覆わなければNo。覆うなら基底b_kごとに、b_kの頂点i成分が1ならanswer_iのk bitを立て、Yesと全answerを出力する。

## 典型の発動条件

### GF(2) nullspace構成

発動条件: XORによる線形条件を同時に満たすassignmentが必要なとき。

係数行列をbitset掃き出しし、free変数からkernel基底を得る。

### 基底vectorのbit packing

発動条件: 複数の0/1解を各要素の非零性を満たす整数へまとめたいとき。

解vectorごとに別の出力bitを割り当て、各座標の列を整数化する。

## 問題固有の要素

頂点値を直接未知数にせず、整数の各bitを独立なkernel解と見れば、XOR条件と非零条件を分離できる。

別の問題へ持ち帰る視点: bitwise制約ではbit planeごとの線形解を作り、最後に列方向へpackingする。

## 正当性

各bitの隣接XOR条件はAx=0であり、全合法bit列はkernel。どのkernel基底でもcoordinate iが全基底で0なら全kernelで0となり頂点iへ非零を置けない。逆に各coordinateがある基底で1なら基底番号を異なるbitとして重ねれば全頂点非零で、各bitがkernelなので全隣接XORも0。OR被覆条件は必要十分。

## 実装上の注意

- 自己loopなしでも行列対角を勝手に立てない。N=60のmask shiftと出力上限2^N未満をunsigned 64 bitで安全に扱う。

## 復習の核

- 得た各basisについてAx=0を再計算し、全answer_iが非零かassertする。free変数からpivot変数を復元する向きを固定する。

## 計算量と制約

### 時間

O(N³/w+N²)、w=64。bitmask消去とkernel基底復元。

### 空間

O(N²/w+N²)。出力値もN個。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 60; 0 \leq M \leq N(N-1)/2; 1 \leq u_i < v_i \leq N; (u_i, v_i) \neq (u_j, v_j) for i \neq j.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3頂点triangle。

1. kernel vector(1,1,1)がある。
2. 各頂点値を1にすると隣接二値のXORは1 XOR1=0。

期待される結果: Yes、値(1,1,1)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

3頂点pathでは。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

端点の式が中央値0を要求するので中央へ非零を置けない。基底ORも中央を覆わない。

確認結果: No。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/editorial/10641) — source-abc366-editorial-10641-ec072cdede89c9d3c18d5de5930b5d6b3bf3684a2bc8a17ae4b7116a2974fce3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/tasks/abc366_g) — source-abc366-g-problem-ad99ac5d70a5a554d814fefa08d734090fad5b47a1b1d082b0a713dfdc27ab75
