---
title: "ABC386-G — Many MST"
draft: true
authoringUnit: {"problemId":"abc386-g","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc386-g.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-contribution-reordering","tag-labeled-component-decomposition","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c","source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"Kruskalで重みk未満のgraphの成分数は、MSTでk以上の辺を何本必要とするかに1を加えた値。threshold和と定数補正が各graphのMST重みに一致する。成分数総和は成分subsetを先に固定し、内部connected重み数・境界高重み・外側自由辺数を掛けて数える。anchor再帰が内部connected数を一度抽出するので全graphのMST総和が得られる。","sourceRevisionIds":["source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c","source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。

## 考察

M通りの各辺重みについてM^{N choose 2} graphを直接列挙できない。MST重みはthreshold k未満の辺からなるgraph G_kの連結成分数の和として表せ、重み付き問題を各kの無向graph数え上げへ分解できる。

Σ_G c(G_k)はgraphを先に数えるのでなく、その連結成分として選ばれる連結部分graph Hを先に固定する主客転倒で扱える。

採用する候補: MST重みをthreshold成分数へ変換し、連結graphの重み付き数え上げDPを各kで行う

頂点数sの指定連結成分の寄与を、頂点1を含む成分を引く標準DPでO(N^2)計算でき、全kでもO(N^2M)がN,M≤500に適合する。

棄却する候補: 各edge重み付けを列挙してKruskal法を実行する

候補はM^{N(N-1)/2}個で指数的であり、個々のMSTを構成できない。

0..M-1重みへshiftすると、MST重みはΣ_{k=1}^M c(G_k)-Mとなり、最後に元の重みshift分を補正する。

kを固定し、f_sを「指定したs頂点への全辺重み割当のうち、k未満の辺だけで連結になる割当数」と定める。f_1=1であり、非連結な割当を頂点1の属する成分サイズiで一意に分類すると、

```text
f_s = M^{s(s−1)/2}
      − Σ_{i=1}^{s−1} C(s−1,i−1) f_i
        (M−k)^{i(s−i)} M^{(s−i)(s−i−1)/2}
```

となる。C(s−1,i−1)は頂点1と同じ成分の頂点選択。残る三因子は、成分内部の割当f_i、成分を切り離す境界辺のM−k通り、外側の自由な辺のM通りである。

全割当にわたる成分数の和T_kは、各成分の頂点集合を一つずつ選んで

```text
T_k = Σ_{s=1}^N C(N,s) f_s
      (M−k)^{s(N−s)} M^{(N−s)(N−s−1)/2}
answer = Σ_{k=1}^M T_k + (N−1−M) M^{N(N−1)/2}
```

と得る。定数補正は各graphのthreshold和からMを引き、重みを元に戻すN−1を足す分。N=2ならT_k=2(M−k)+k=2M−kとなり、答えはM(M+1)/2、一本の辺の重み1..Mの総和と一致する。

二項係数とMの冪を用意し、各kでf_sをsの昇順に埋めてT_kへ足す。各指数は辺本数であり、外部頂点が0個でも0^0=1とする。最後に定数補正を含めてmod 998244353で出力する。

## 典型の発動条件

### MST重みのthreshold積分

発動条件: 全edge重みの分布上でMST総和・期待値を数えたいとき。

各thresholdでの連結成分数を足す式へ変換する。

### 連結graph数え上げDP

発動条件: labelled graphの全体からconnectedなものだけを取り出すとき。

頂点1を含むcomponentを固定し、非連結caseをsize別に引く。

### 主客転倒

発動条件: graphごとのcomponent数総和を直接数えにくいとき。

component候補Hを固定して、それを成分に持つgraph数を数える。

## 問題固有の要素

MSTそのものの組合せを追わず、Kruskalで各重み層が答えへ寄与する量を連結成分数として線形化する。

別の問題へ持ち帰る視点: 全入力に対する最適構造の総和では、目的値をthreshold indicatorの和へ分解し、各層の構造数を数える。

## 正当性

Kruskalで重みk未満のgraphの成分数は、MSTでk以上の辺を何本必要とするかに1を加えた値。threshold和と定数補正が各graphのMST重みに一致する。成分数総和は成分subsetを先に固定し、内部connected重み数・境界高重み・外側自由辺数を掛けて数える。anchor再帰が内部connected数を一度抽出するので全graphのMST総和が得られる。

## 実装上の注意

- 重みを0..M-1へshiftした補正符号、k未満/以上の選択肢数kとM-k、edge本数の指数を混同しない。0^0は1として扱う。

## 復習の核

- N≤4,M≤3で全edge重みを列挙してKruskal結果を足し、各kの成分数総和と最終shift補正を独立に照合する。

## 計算量と制約

### 時間

O(MN²)。二項係数とMの冪をO(N²)で用意し、各thresholdでM−kの冪と連結成分DPをO(N²)で計算する。

### 空間

O(N²)。二項係数表、Mの冪表、現在のthresholdのM−kの冪表、f_s。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 500; 1 \le M \le 500; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/editorial/11690) — source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/tasks/abc386_g) — source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822
