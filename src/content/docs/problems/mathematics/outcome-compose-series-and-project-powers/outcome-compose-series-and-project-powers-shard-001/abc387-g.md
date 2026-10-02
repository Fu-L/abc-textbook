---
title: "ABC387-G — Prime Circuit"
draft: true
authoringUnit: {"problemId":"abc387-g","docPath":"src/content/docs/problems/mathematics/outcome-compose-series-and-project-powers/outcome-compose-series-and-project-powers-shard-001/abc387-g.md","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-formal-power-series","unit-polynomial-convolution"],"excludedTopics":["FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-formal-power-series","tag-fps-composition-power-projection","tag-generating-functions","tag-convolution"],"sourceRevisionIds":["source-abc387-editorial-11727-51ed3d58cafe5fc3398d59a1439db00f31146203b928f246491f4fa02c90d9f0","source-abc387-g-problem-eecc85664ab281a340433ab68292e3f5b529d75e82f592f22bdc8746d35a2043"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二cycleが頂点を共有すればそれらを繋ぐedge重複なしclosed trailまたは対称差に偶数長が現れ、許容graphではprime cycleが頂点disjointになる。根付き構造はbridge子の集合と、根を含むprime cycleを独立子構造で飾る場合へ一意分解できるためF=G(x exp F)が成立する。定数項0からの形式解をNewtonで一意に復元し、EGF係数にN!を掛け根の選択倍率を戻すとlabel付きgraph数になる。","sourceRevisionIds":["source-abc387-editorial-11727-51ed3d58cafe5fc3398d59a1439db00f31146203b928f246491f4fa02c90d9f0","source-abc387-g-problem-eecc85664ab281a340433ab68292e3f5b529d75e82f592f22bdc8746d35a2043"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3。","procedure":["connected単純graphはpath型treeが3個、triangleが1個。","treeにはcircuitがなく、triangleの唯一cycleは長さ3でprime。"],"executionTarget":null,"expectedResult":"許容graph4個、根付きなら12個。","verificationStatus":"not_applicable","learningUnitIds":["unit-fps-composition-power-projection"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compose-series-and-project-powers","outcome-apply-formal-power-series-operations","outcome-encode-counting-by-generating-function"],"prerequisiteIds":["unit-formal-power-series","unit-polynomial-convolution"],"attainmentCondition":"長さ2cycleの項をGへ入れるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"入れない。"},"answer":{"reasoningOrVerification":"単純graphに平行辺はなく2cycleは存在しない。prime cycleはp≥3だけ。","procedure":["具体例の各状態・寄与を再計算する。","単純graphに平行辺はなく2cycleは存在しない。prime cycleはp≥3だけ。"],"expectedResult":"入れない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [FPS合成・power projection](src/content/docs/learn/combinatorics-algebra/fps-composition-power-projection.md)

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [FPS基本演算と多項式の多点評価を行う](src/content/docs/learn/combinatorics-algebra/formal-power-series.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

全circuitが素数長なら偶数長circuitは存在しない。二つのcycleが頂点を共有すると、その対称差や連結したclosed trailから偶数長circuitを作れるため、cycle同士はvertex-disjointでなければならない。

条件を満たすconnected graphは、素数長cycle blockとbridgeからなるvertex-disjoint cactusである。rooted labelled構造の指数型母関数Fは、G(x)=x+Σ_{prime p≥3}x^p/2としてF=G(x exp F)を満たす。

採用する候補: cactusのrooted EGF方程式を立て、Kinoshita–Li形式的冪級数合成を用いたNewton法または逆関数で解く

N=2.5×10^5では平方根次数の古典的compositionも重く、合成をO(N log²N)で行えば暗黙方程式の係数を制約内で得られる。

棄却する候補: graphのedge subsetやcycle配置を直接列挙する

単純graphは2^{N choose 2}個あり、cactusへ特徴付けてもlabel配置を個別に数えるのは指数的である。

rootに付く独立な子構造はx exp F、rootを含むprime cycleはその構造をp個環状に並べ、二方向の対称性で2除算する。

power projection [x^n]f(x)^i g(x)をBostan–Mori型に計算し、転置原理で線形写像を逆順・転置すると高速composition g(f(x))が得られる。

prime indicatorからGをN次まで構成する。F=G(x exp F)に対し、compositionをKinoshita–Li法で評価してFPS Newton iterationする（またはH=exp Gからx/H(x)のcompositional inverseを求める）。最後にrooted EGF係数をfactorialで戻す。

## 典型の発動条件

### block decompositionと指数型母関数

発動条件: labelled connected構造がroot周りのsetとcycle blockへ分解できるとき。

vertex-disjoint prime cycle cactusをF=G(x exp F)で表す。

### 転置原理によるFPS composition

発動条件: 既知の高速線形変換の転置が欲しい係数写像になるとき。

power projectionを転置してKinoshita–Li合成を得る。

### FPS Newton iteration

発動条件: 形式的冪級数の暗黙方程式を高次数まで解くとき。

A(F)=0を倍精度反復し、各評価に高速compositionを使う。

## 問題固有の要素

circuitを単純cycleだけと同一視せず、二cycleが共有頂点を持つと合成closed trailが偶数になることまで使うと、数えられるvertex-disjoint cactusへ強く特徴付けられる。

別の問題へ持ち帰る視点: graphの全trail条件は、複数cycleを組み合わせた新しいtrailが作る禁止構造を調べ、block構造へ翻訳する。

## 正当性

二cycleが頂点を共有すればそれらを繋ぐedge重複なしclosed trailまたは対称差に偶数長が現れ、許容graphではprime cycleが頂点disjointになる。根付き構造はbridge子の集合と、根を含むprime cycleを独立子構造で飾る場合へ一意分解できるためF=G(x exp F)が成立する。定数項0からの形式解をNewtonで一意に復元し、EGF係数にN!を掛け根の選択倍率を戻すとlabel付きgraph数になる。

## 実装上の注意

- prime cycleは単純graphなのでp≥3のみで、環の二方向対称性の1/2を入れる。EGF係数からlabelled個数へのfactorial係数とroot付き/なしの換算を確認する。

## 復習の核

- N≤7で全simple graphを列挙し、circuit条件と「vertex-disjoint prime cycles」の同値を検査する。母関数の低次係数もこの列挙値と照合してから高速compositionを信頼する。

## 計算量と制約

### 時間

O(N log²N)。Kinoshita–Li型composition/inversionとNewton倍化を用いる。

### 空間

O(N log N)。高速compositionの作業表。

### 制約との対応

公式制約の確認範囲: Time limit: 12 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 2.5 \times 10^5, inclusive.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3。

1. connected単純graphはpath型treeが3個、triangleが1個。
2. treeにはcircuitがなく、triangleの唯一cycleは長さ3でprime。

期待される結果: 許容graph4個、根付きなら12個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

長さ2cycleの項をGへ入れるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

単純graphに平行辺はなく2cycleは存在しない。prime cycleはp≥3だけ。

確認結果: 入れない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/editorial/11727) — source-abc387-editorial-11727-51ed3d58cafe5fc3398d59a1439db00f31146203b928f246491f4fa02c90d9f0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/tasks/abc387_g) — source-abc387-g-problem-eecc85664ab281a340433ab68292e3f5b529d75e82f592f22bdc8746d35a2043
