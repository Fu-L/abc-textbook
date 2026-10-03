---
title: "ABC267-EX — Odd Sum"
draft: true
authoringUnit: {"problemId":"abc267-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc267-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74","source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各要素は未選択をEの定数1、選択をOのx^{A_i}として表す。二群を併合すると選択数parityはXORなのでE=E_1E_2+O_1O_2、O=E_1O_2+O_1E_2。各subsetは葉の選択を一意に決め、積が合計値を次数へ加算する。全A_i>0なのでM超次数の打切りは目的係数へ影響しない。","sourceRevisionIds":["source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74","source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

通常の部分和DPに選択個数の偶奇を足すとO(NM)になる。N≤10^5、M≤10^6では、要素を一つずつ追加する方針を変える必要がある。一方、A_i≤10なので全重みS=ΣA_i≤10Nであり、独立な要素群の生成関数をまとめて掛ける余地がある。

要素群Xの偶数個選択をE_X(x)、奇数個選択をO_X(x)で表す。一要素aの葉は(E,O)=(1,x^a)。二群を合わせると

```text
E = E_1 E_2 + O_1 O_2
O = E_1 O_2 + O_1 E_2
```

となる。次数は重み和、二成分は選択個数の偶奇を表す。最終OのM次係数が答えで、M>Sなら0。全重みが正なので、各積のM超次数を捨てても後のM次係数は変わらない。

葉の個数で二分して、左右の積をNTTで合成する。葉がs個の節点の次数は高々min(M,10s)。NTTには打切り前の二入力の次数和を覆う長さを使い、積を得た後で切る。EとOをそれぞれ保存すれば四つの積で更新できる。P=E+O、Q=E−Oの二つを掛け、最後にO=(P−Q)/2へ戻してもよい。法998244353では2の逆元がある。

打切り次数D=min(M,S)は一つの積の長さの上限であり、積木全体の仕事量ではない。全A_i=1、M≪Nなら、s≤Mの層にも約N/s個の積が残り、一層の費用はO(N log(s+1))。これを無視してO(D log²D+N)と見積もることはできない。

同じ深さの節点は互いに素な葉集合を持つため、打切り前の次数の総和は高々S。各層のNTT費用はO(S log(S+1))、層数はO(log(N+1))である。S≥Nより全体O(S log²(S+1)+N)、S≤10NなのでO(N log²(N+1))となり、公式制約に対応する。

## 典型の発動条件

### parity別部分和生成関数

発動条件: 部分集合の重み和に加えて選択個数の偶奇を指定して数えるとき。

偶数・奇数の二多項式を持ち、parity XORに従って積を合成する。

### product treeによる多数多項式積

発動条件: 多数の短い生成多項式を掛け、必要次数までの係数を得たいとき。

サイズの近い多項式をbalancedに併合し、各積をNTTで計算して次数上限で切る。

## 問題固有の要素

形式変数yで選択個数を持つ∏(1+yx^{A_i})をy^2=1の下で計算した二成分が(E,O)に対応する。

別の問題へ持ち帰る視点: 個数mod kの条件は、重み生成関数の係数をZ/kZ成分へ分けた畳み込みとして扱える。

## 正当性

各要素は未選択をEの定数1、選択をOのx^{A_i}として表す。二群を併合すると選択数parityはXORなのでE=E_1E_2+O_1O_2、O=E_1O_2+O_1E_2。各subsetは葉の選択を一意に決め、積が合計値を次数へ加算する。全A_i>0なのでM超次数の打切りは目的係数へ影響しない。

## 実装上の注意

- M>Sなら0を返す。打切りは各積の後で行い、NTT長は巡回畳み込みが混ざらない長さにする。
- 葉の個数で均等に二分する。正しい計算量は一つの積の次数ではなく、各層の全入力次数の和から導く。
- 子の積を親へ合成したら解放する。全節点の配列を残す実装と、深さ優先で解放する実装を区別する。

## 復習の核

- 個数mod kと重み和は、k成分の生成関数の積として合成できる。
- 次数打切りは上層の積を短くする。下層にある多数の積の費用まで消すわけではない。
- 積木の時間は各層の総次数、空間は同時に残す配列から数える。

## 計算量と制約

### 時間

O(S log(S+1) log(N+1)+N)⊆O(S log²(S+1)+N)、S=ΣA_i≤10N。各層の総次数≤S、葉の個数で均衡する積木はO(log(N+1))層。M次打切りはこの上界を増やさないが、D=min(M,S)だけへSを置き換えることはできない。

### 空間

全節点の積を保存する場合O(S log(N+1)+N)。深さ優先で子の積を合成後に解放すれば、保持する互いに素な葉群の総次数と最大NTT領域がO(S)なのでO(S+N)=O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^5; 1 \le M \le 10^6; 1 \le A_i \le 10; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/tasks/abc267_h) — source-abc267-ex-problem-53fd370d715324cae8e3d5c9f315e45b9ce92b1b7e6b80ad84576f6b26bafb74
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/editorial/4736) — source-abc267-editorial-4736-2ddc26b1addb51230c1fb95dcc014fc02d67b3681e885e7b64b8c85277e8bbba
