---
title: "ABC275-EX — Monster"
draft: true
authoringUnit: {"problemId":"abc275-ex","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc275-ex.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function","outcome-build-cartesian-tree-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-ordered-set-multiset","unit-small-to-large"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cartesian-tree","tag-slope-trick","tag-ordered-set-multiset","tag-small-to-large"],"sourceRevisionIds":["source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0","source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間攻撃の費用が最大Bで決まるので、同じ最大値を保つ限り区間を広げて損はない。最大Cartesian treeの部分木区間だけで最適解を表せる。部分木が既にj回攻撃されているとき、根でk≥max(A_i−j,0)回の追加攻撃を行う費用はkB_i+F_left(j+k)+F_right(j+k)。子関数は減少する離散凸関数だから、追加一回の子側節約がB_iを下回る位置まで進むのが最適。子の二階差分eventを合成し、そのprefixの傾きを−B_iへ置換してこの最小化を表現する。葉からの帰納で全関数とrootのF(0)が正しい。","sourceRevisionIds":["source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0","source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function","outcome-build-cartesian-tree-decomposition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=1、A_1=3,B_1=2。","procedure":["唯一の区間を一回攻撃する費用は2。","残体力が0になるまで三回が必要。","F(j)=2max(3−j,0)で、傾きはj<3で−2、以後0。"],"executionTarget":null,"expectedResult":"最小費用F(0)=6。","verificationStatus":"not_applicable","learningUnitIds":["unit-slope-trick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function","outcome-build-cartesian-tree-decomposition"],"prerequisiteIds":["unit-basic-convex-optimization","unit-ordered-set-multiset","unit-small-to-large"],"attainmentCondition":"A=[1,1],B=[1,3]のとき、別々の攻撃と全体攻撃を比較せよ。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"別々なら1+3=4、全体を一回ならmax B=3。Cartesian treeの根の区間を使えば3を達成し、B=3の個体を倒すため少なくとも3必要だから最適。"},"answer":{"reasoningOrVerification":"別々なら1+3=4、全体を一回ならmax B=3。Cartesian treeの根の区間を使えば3を達成し、B=3の個体を倒すため少なくとも3必要だから最適。","procedure":["具体例の各状態・寄与を再計算する。","別々なら1+3=4、全体を一回ならmax B=3。Cartesian treeの根の区間を使えば3を達成し、B=3の個体を倒すため少なくとも3必要だから最適。"],"expectedResult":"別々なら1+3=4、全体を一回ならmax B=3。Cartesian treeの根の区間を使えば3を達成し、B=3の個体を倒すため少なくとも3必要だから最適。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

操作順は総費用に影響せず、同じ最大 shield 値のままなら区間を広げても損をしないため、候補区間は B の極大支配区間へ絞れる。

各 B_i を区間最大の代表とし、同値では右側を代表にする規約を置くと、候補区間は max Cartesian tree の部分木区間になる。

採用する候補: B の Cartesian tree 上で、区間全体が既に j 回攻撃済みのときの最小追加費用 F_i(j) を子から合成し、離散凸な折れ線の変化点だけを small-to-large で管理する。

A_i,j が 10^9 でも関数の傾き変化は部分木頂点数程度であり、全 j を列挙せず再帰式を評価できる。

棄却する候補: 各 node について j=0,…,max A の DP 配列を明示して recurrence の最小 k を調べる。

A_i≤10^9 のため添字範囲だけで不可能で、各 k の探索も重い。

node i で追加の全区間攻撃を k 回行うと、k≥max(A_i-j,0) かつ費用は kB_i+F_left(j+k)+F_right(j+k) になる。

子関数の限界削減量が j とともに減る離散凸性により、最適な到達高さ j_0 は『子側の次の1回の節約が B_i を下回る最初』という閾値になる。

F_i の全値ではなく F_i(0)、初期傾き、二階差分が非零になる位置の multiset を持てば、子の和は集合併合、node追加は prefix傾きの置換として処理できる。

単調 stack等で tie規約付き max Cartesian treeを構築する。postorderで子の折れ線event集合を大きい方へ併合し、j≥A_i かつ子の限界節約<B_iとなる j_0 までeventを消費する。prefix slopeをB_iへ置換するbreakpointを挿入し、rootのF(0)を答える。

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

区間攻撃の費用が最大Bで決まるので、同じ最大値を保つ限り区間を広げて損はない。最大Cartesian treeの部分木区間だけで最適解を表せる。部分木が既にj回攻撃されているとき、根でk≥max(A_i−j,0)回の追加攻撃を行う費用はkB_i+F_left(j+k)+F_right(j+k)。子関数は減少する離散凸関数だから、追加一回の子側節約がB_iを下回る位置まで進むのが最適。子の二階差分eventを合成し、そのprefixの傾きを−B_iへ置換してこの最小化を表現する。葉からの帰納で全関数とrootのF(0)が正しい。

## 実装上の注意

- 前方の strictly greater、後方の greater-or-equal という非対称規約を守り、同じ B では右端が区間代表になる tree を構成する。
- F(0) や A_iB_i は 10^18 規模になるため 64 bit を使い、event削除時の傾き・関数値更新の符号を固定する。

## 復習の核

- 葉のF(j)=max(A_i-j,0)B_iから一階差分を描き、親で子の限界節約とB_iが交差するj_0、および同値Bの代表規約を小例で検証する。

## 計算量と制約

### 時間

O(N log² N)。small-to-largeにより各eventの移動はO(log N)回、ordered set更新がO(log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq A_i,B_i \leq 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=1、A_1=3,B_1=2。

1. 唯一の区間を一回攻撃する費用は2。
2. 残体力が0になるまで三回が必要。
3. F(j)=2max(3−j,0)で、傾きはj<3で−2、以後0。

期待される結果: 最小費用F(0)=6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A=[1,1],B=[1,3]のとき、別々の攻撃と全体攻撃を比較せよ。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

別々なら1+3=4、全体を一回ならmax B=3。Cartesian treeの根の区間を使えば3を達成し、B=3の個体を倒すため少なくとも3必要だから最適。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/editorial/5128) — source-abc275-editorial-5128-cd020736ab87fd89ea58cc741d720fd4ffa5ef0ccf38982b50a633ccf882f0b0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc275/tasks/abc275_h) — source-abc275-ex-problem-847c185976e5ab7661a10935fc2208fe522a3d06be197f9411a7d74de78f081f
