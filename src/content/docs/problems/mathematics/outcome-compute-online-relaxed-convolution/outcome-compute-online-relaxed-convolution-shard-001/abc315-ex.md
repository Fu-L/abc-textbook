---
title: "ABC315-EX — Typical Convolution Problem"
draft: true
authoringUnit: {"problemId":"abc315-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-online-relaxed-convolution/outcome-compute-online-relaxed-convolution-shard-001/abc315-ex.md","learningOutcomeIds":["outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution"],"excludedTopics":["Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-relaxed-convolution","tag-convolution","tag-generating-functions"],"sourceRevisionIds":["source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f","source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"確定済みFだけの積を完成block時に送ると各係数pair(i,j)は一意なblock完成時点に対応し一度加算される。したがってF_nを求める前に必要なG_0..G_{n−1}が正しく揃う。prefix和へA_nを掛ける元の再帰と同じ順に値を確定するため、帰納的に全Fが一致する。自己積の左右pairと対角の倍率を区別する。","sourceRevisionIds":["source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f","source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-online-relaxed-convolution"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,3,1)、F_0=1。","procedure":["G_0=1よりF_1=2。G_1=2F_0F_1=4よりF_2=3(1+4)=15。","G_2=2F_0F_2+F_1²=34よりF_3=1(1+4+34)=39。"],"executionTarget":null,"expectedResult":"F=(1,2,15,39)。","verificationStatus":"not_applicable","learningUnitIds":["unit-relaxed-convolution"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-online-relaxed-convolution"],"prerequisiteIds":["unit-generating-functions","unit-polynomial-convolution"],"attainmentCondition":"F_2を求めるときG_2を含めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"G_{n−1}までのprefix和。"},"answer":{"reasoningOrVerification":"G_2はF_2自身を含み循環する。要求はi+j<2なのでG_0,G_1だけ。","procedure":["具体例の各状態・寄与を再計算する。","G_2はF_2自身を含み循環する。要求はi+j<2なのでG_0,G_1だけ。"],"expectedResult":"G_{n−1}までのprefix和。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Relaxed・online convolution](src/content/docs/learn/combinatorics-algebra/relaxed-convolution.md)

- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

F_n は過去の F_i だけから決まるが、必要な量は G_n=[x^n]F(x)^2 の prefix sum である。F_n を確定した直後に次の convolution 係数を知りたいオンライン依存になっている。

通常の NTT で F² を一括計算しようとしても F 自身がまだ未確定で循環する。一方、既確定 prefix を 2 冪 block に分ければ、新旧 block 間の積を確定時にだけ畳み込める。

採用する候補: Relaxed Convolution で F の係数を一つずつ追加しながら G=[F·F] の同次数係数を返し、G の prefix sum から次 F を求める。

block ごとの NTT により online convolution を O(N(log N)²) にし、漸化式の因果順を保てる。

棄却する候補: 各 n で Σ_{i+j<n}F_iF_j を二重和として再計算する。

一係数 O(n)、総 O(N²) となり N=2×10^5 に間に合わない。

係数対 (i,j) は binary block 分解で一意な「片側 block が完成した時」に課金され、漏れ・重複なく未来の convolution 係数へ加えられる。

G_n がオンラインで得られれば prefixG_n=Σ_{t≤n}G_t を更新し、F_{n+1}=A_{n+1}·prefixG_n を O(1) で確定できる。

F_0=1 を relaxed convolution 構造へ追加する。n=0..N−1 で現在返された G_n を prefix sum へ足し、F_{n+1}=A_{n+1}prefixG を計算して構造へ追加する。構造内部では時点ごとの lowbit/2冪区間に応じ、完成 block と既知 block の F/G polynomial product を NTT して該当する未来係数へ蓄積する。

## 典型の発動条件

### Relaxed Convolution

発動条件: a_n,b_n が順次確定し、その時点で c_n=[x^n]AB が必要なオンライン漸化式。

2冪 block が完成するたび必要な block 積を FFT/NTT し、未来係数へ分配する。

### 生成関数による二重和の係数化

発動条件: Σ_{i+j<n}F_iF_j のような添字和条件を高速化したいとき。

F² の係数 G_t とその prefix sum に書き換える。

## 問題固有の要素

漸化式を閉形式へ解くのでなく、必要な convolution 係数だけを確定順に供給する online algorithm が循環依存を解く。

別の問題へ持ち帰る視点: 未知級数を含む再帰では、一括 FPS 操作だけでなく semi-online/relaxed convolution を候補にする。

## 正当性

確定済みFだけの積を完成block時に送ると各係数pair(i,j)は一意なblock完成時点に対応し一度加算される。したがってF_nを求める前に必要なG_0..G_{n−1}が正しく揃う。prefix和へA_nを掛ける元の再帰と同じ順に値を確定するため、帰納的に全Fが一致する。自己積の左右pairと対角の倍率を区別する。

## 実装上の注意

- Σ_{i+j<n} は G_0..G_{n−1} であり G_n を含む添字をずらさない。自己畳み込みでも左右 block の寄与係数2と対角項を実装構造の契約に従う。

## 復習の核

- まず二重和を「どの convolution 係数のどこまでの prefix か」へ正確に変形する。Relaxed Convolution は各係数対の担当 block を図で追ってから実装する。

## 計算量と制約

### 時間

O(N log²N)。完成二冪blockのrelaxed convolutionで未来係数を蓄積する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i < 998244353; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,3,1)、F_0=1。

1. G_0=1よりF_1=2。G_1=2F_0F_1=4よりF_2=3(1+4)=15。
2. G_2=2F_0F_2+F_1²=34よりF_3=1(1+4+34)=39。

期待される結果: F=(1,2,15,39)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

F_2を求めるときG_2を含めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

G_2はF_2自身を含み循環する。要求はi+j<2なのでG_0,G_1だけ。

確認結果: G_{n−1}までのprefix和。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/editorial/6988) — source-abc315-editorial-6988-b53258fb99c95ed3c9be8e0bc9c648f0b80d4c02084f9f308b103e2a37486a0f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/tasks/abc315_h) — source-abc315-ex-problem-40bcbcc33db6b7b1af7bba91db3f5d6c977a6f3287c5b475390cc7bfa6f313f9
