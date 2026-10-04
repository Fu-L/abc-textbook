---
title: "ABC275-EX — Monster"
draft: true
authoringUnit: {"problemId":"abc275-ex","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc275-ex.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function","outcome-build-cartesian-tree-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-ordered-set-multiset","unit-small-to-large"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cartesian-tree","tag-slope-trick","tag-ordered-set-multiset","tag-small-to-large"],"sourceRevisionIds":["source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0","source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同じ最大Bを保つ区間拡張は費用を増やさず、Cartesian treeの部分木攻撃だけに正規化できる。祖先攻撃jの下で根iを倒す条件はk≥max(A_i−j,0)であり、左右は独立だから本文の漸化式が最適追加費用を表す。Gの限界節約dが非増加なのでB_i−d(t)は非減少で、A_i以降の最小値は最初のd(t)<B_iのj_0で得られる。j≥j_0では追加攻撃0が最適、j≤j_0ではj_0まで攻撃する。切替は連続で傾きが増すので減少・凸性を保つ。event間の値更新は一定傾きで進む式そのもので、旧prefixの全eventを消し、重みB_i−d(j_0)を追加すると二つの式を正確に表現する。葉の初期値から帰納して全F_i、特に根のF_i(0)が正しい。","sourceRevisionIds":["source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0","source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md) — 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

一回の区間攻撃の費用は区間内の最大Bで決まる。同じ最大Bを保つ範囲まで広げても、余分に体力を削ることに不利益はない。Bが同じなら右端を代表とする最大Cartesian treeを作ると、各代表の攻撃区間はその部分木区間になる。この区間だけで最適解を表せる。

部分木iが祖先からj回攻撃済みのときの最小追加費用をF_i(j)とする。子の和G(j)=F_left(j)+F_right(j)、欠けた子の関数を0とすると

```text
F_i(j) = min_{k≥max(A_i−j,0)} { k B_i + G(j+k) }
       = min_{t≥max(A_i,j)} { t B_i + G(t) } − j B_i
```

である。葉はF_i(j)=B_i max(A_i−j,0)。子の関数が減少・離散凸なら、限界節約d(j)=G(j)−G(j+1)は非増加。tを一つ増やす費用差はB_i−d(t)なので、A_i以上でd(t)<B_iとなる最初の整数j_0まで進めればよい。同値d(t)=B_iでは費用が変わらないので先へ進む規約とする。このとき

```text
j≤j_0: F_i(j)=G(j_0)+(j_0−j)B_i
j≥j_0: F_i(j)=G(j)
```

となり、j_0で連続し、切替後の傾き−d(j_0)は−B_iより大きい。従って凸性も帰納できる。

A_i,B_i≤10^9なので、全jを配列に並べたり、B_i個の単位hingeを作ったりはできない。関数をv=F(0)、初期節約d=F(0)−F(1)、重み付きeventのmultisetで表す。event(z,w)はz≥1において節約がwだけ減り、傾きがwだけ増すこと、すなわちw=d(z−1)−d(z)>0を意味する。値は

```text
F(j)=v−d j+Σ_{(z,w)} w max(j−z,0)
```

で復元できる。葉の表現はv=A_iB_i、d=B_i、event(A_i,B_i)。欠けた子はv=d=0、eventなし。和Gはvとdを足し、二つのevent集合を併合する。同じ座標のeventは別々に残しても、重みを足してもよい。

Gを前からたどってj_0を探す。cur=0、value=G(0)、saving=d(0)で始め、最小event(z,w)について、z≤A_iまたはsaving≥B_iなら、次の二式を行ってeventを取り除く。

```text
value ← value − (z−cur) saving
cur ← z; saving ← saving − w
```

同じ座標では全eventを処理する。終了後cur<A_iならvalue−=(A_i−cur)saving、cur=A_iとする。この時点でcur=j_0、value=G(j_0)、saving=d(j_0)<B_iである。eventがない場合はsaving=0なので、必要ならA_iまで一度に進めばよい。

親の表現はv=value+j_0B_i、初期節約B_iへ置き換え、event(j_0,B_i−saving)を一つ挿入する。取り除いたのはz≤j_0のevent全てで、それより後はGと同じ。公式入力はA_i≥1なのでj_0≥1であり、座標0のeventは不要。葉からpostorderで処理し、根のvを答える。

例えばG(j)=3max(2−j,0)+4max(5−j,0)ならv=26、saving=7、eventは(2,3),(5,4)。A_i=1,B_i=10では次eventへ進まず、j_0=1、G(1)=19。親はv=29、初期節約10、event(1,3),(2,3),(5,4)となり、F(1)=19、F(2)=12へ接続する。重み3,4を保持することで大きなBでもevent数は増えない。

## 典型の発動条件

### Cartesian tree

発動条件: 各区間の最大値で操作費用が決まり、最大要素を境に左右が独立するとき。

shield B の最大位置を根にし、最大値支配区間の包含関係を二分木へする。

### 離散凸関数のbreakpoint表現

発動条件: 巨大な整数引数上のDP関数が単調な傾きを持ち、和・prefix切替で更新されるとき。

初期値・傾き・二階差分eventだけを保持してmin-plus recurrenceを評価する。

### small-to-large merge

発動条件: 木DPで各部分木のordered event集合を親へ併合し、要素の移動回数を抑えたいとき。

左右の小さい集合を大きい集合へ挿入して折れ線を合成する。

## 問題固有の要素

最大shieldの区間攻撃を何回まとめて行うかは、子部分木で1回余分に攻撃して節約できる限界費用とB_iの比較で決まる。

別の問題へ持ち帰る視点: 階層的な一括操作では、親操作の単価と子解の限界差分を比較し、最適回数を傾きの閾値として探す。

## 正当性

同じ最大Bを保つ区間拡張は費用を増やさず、Cartesian treeの部分木攻撃だけに正規化できる。祖先攻撃jの下で根iを倒す条件はk≥max(A_i−j,0)であり、左右は独立だから本文の漸化式が最適追加費用を表す。Gの限界節約dが非増加なのでB_i−d(t)は非減少で、A_i以降の最小値は最初のd(t)<B_iのj_0で得られる。j≥j_0では追加攻撃0が最適、j≤j_0ではj_0まで攻撃する。切替は連続で傾きが増すので減少・凸性を保つ。event間の値更新は一定傾きで進む式そのもので、旧prefixの全eventを消し、重みB_i−d(j_0)を追加すると二つの式を正確に表現する。葉の初期値から帰納して全F_i、特に根のF_i(0)が正しい。

## 実装上の注意

- 同値Bでは右端を代表にする。stackで同値もpopする最大Cartesian treeを構成する。
- eventは座標と傾き増分の組で、重み回数だけ展開しない。節約dと傾き−dの符号を混ぜない。
- eventを削る前に、旧savingで区間長×savingを関数値から引く。最後にj_0B_iを加えた値がF_i(0)。
- A_iB_iや各子の和には64bit整数を使う。答えは全体攻撃max A×max B≤10^18を上界にできるが、更新途中も整数幅を確認する。

## 復習の核

- 葉のF(j)=max(A_i-j,0)B_iから一階差分を描き、親で子の限界節約とB_iが交差するj_0、および同値Bの代表規約を小例で検証する。

## 計算量と制約

### 時間

O(N log²(N+1))。各頂点でeventを高々一つ追加し、削除は全体O(N)。同座標も別eventとして保持するmultisetで、小さい方から大きい方へ移す。削除があるので一eventの所属サイズの単調倍増は仮定しない。全eventについてlog₂(所属集合サイズ)の和をpotentialにすると、サイズs≤tの併合は移すs個により少なくともs増加し、サイズmの集合から一eventを削る減少はm log₂m−(m−1)log₂(m−1)=O(log(N+1))。新規追加はpotentialを減らさず、最終potentialもO(N log N)なので、移動総数O(N log N)。一挿入・削除O(log N)、値と傾きの更新は一eventにつきO(1)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq A_i,B_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/editorial/5128) — source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/tasks/abc275_h) — source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f
