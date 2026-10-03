---
title: "ABC269-EX — Antichain"
draft: true
authoringUnit: {"problemId":"abc269-ex","docPath":"src/content/docs/problems/graph-search/outcome-accelerate-tree-dp-by-heavy-path/outcome-accelerate-tree-dp-by-heavy-path-shard-001/abc269-ex.md","learningOutcomeIds":["outcome-accelerate-tree-dp-by-heavy-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution","unit-recursive-divide-and-conquer","unit-rooted-tree-aggregation"],"excludedTopics":["heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-heavy-path-tree-dp","tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524","source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"v選択時は子孫を選べず寄与x、非選択時は子のantichain独立選択で積なのでf_v=x+∏f_child。heavy子h以外の積g_vを作るとf_v=x+g_v f_hとなりaffine合成でpath全体をまとめられる。分割統治合成は元漸化式そのものなので答えは変わらず、empty定数1を含めた根係数が各サイズ数。 区間変換(A,B)の合成(A+BC,BD)は上側の式へ下側の式を代入したもの。末端の値1は重い子がない場合の空積を表すので、path全体のA+Bは通常の木DPのfに一致する。","sourceRevisionIds":["source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524","source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [heavy path上の多項式木DP](src/content/docs/learn/tree/heavy-path-tree-dp.md)

- heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

部分木vのantichainを選択個数別に数え、空集合込みの母関数をf_v(x)とする。vを選ぶ場合は子孫を選べず寄与x、選ばない場合は各子から独立に選べるためf_v=x+∏f_childとなる。

各頂点でf_vの配列を作ると、一本道でも祖先ごとに長い配列を繰り返し処理して最悪Θ(N²)になる。畳み込みだけをNTTに置き換えても、櫛型の木で二乗の仕事が残る。長いchain上の状態を一つの変換へまとめる必要がある。

最大部分木の子をheavy、それ以外をlightとする。heavy path上の頂点iでlight子のfの積をg_iと置けば、漸化式はf_i=x+g_i f_nextとなる。light辺を子側へ渡るたび部分木サイズは半分以下なので、light-rooted subproblemのサイズ総和はO(N log N)。この課金先を使い、pathを一回で評価してその先頭のfだけを返す。

pathの合成を具体化する。各頂点の変換をf_i=a_i+b_i f_next、(a_i,b_i)=(x,g_i)と表す。上側区間の変換A+Bzと下側区間の変換C+Dzをこの順に合成すると

```text
(A,B) ∘ (C,D) = (A+BC, BD)
```

となる。単位元は(0,1)。heavy path末端の先には架空の値1を置く。すると葉はx+1、light子がある末端もx+g_iとなり、空積1を正しく含む。path全体の合成(A,B)の返値はA+B。このfだけをlight親へ返し、各heavy頂点のf配列を全部作らない。最終的に根pathのfの係数1,…,Nを出力する。

pathのvertex iには重みw_i=1+Σ_{light child u}|subtree u|を割り当てる。全w_iの和はpath先頭の部分木サイズで、g_iの次数とxの次数もw_i以下。区間の重み総和が半分を跨ぐ頂点をpivotにして、左区間・pivot・右区間の変換を順に合成する。pivot一つが半分超ならそれを一葉として分離するので、残る左右の重みは半分以下。単にpathの頂点個数で二分するだけでなく、合成する係数長で均衡させる。

各path内の各合成層の総次数は部分木サイズs以下で、NTT費用O(s log(s+1))、層数O(log(s+1))。light子の多項式積も同じ次数課金で評価できる。元の一頂点はlight辺を渡るたび所属部分木が半減するため、全path先頭の部分木サイズ総和はO(N log(N+1))。従って全体O(N log³(N+1))になる。途中配列を解放し、終了済みのheavy頂点の係数を保存しないことも必要である。

## 典型の発動条件

### 木DPの母関数化

発動条件: subtreeごとの選び方が子間で独立に直積され、選択個数別の全答えが必要なとき。

係数[x^K]をK頂点のantichain数とするpolynomialを持ち、子の独立選択を積で表す。

### heavy-path分解によるDP高速化

発動条件: tree DPの大きな状態を最大childへ再利用し、それ以外のsubtree処理だけを対数回に償却できるとき。

heavy childのpath representationをmoveし、light childrenの結果だけをpolynomialとしてmergeする。

### NTTと分割統治積

発動条件: 多数のpolynomial積やprefix-product weighted sumを次数準線形で求める必要があるとき。

heavy pathのg列とlight-child polynomialsをproduct treeで畳み込む。

## 問題固有の要素

path X_1,…,X_mについて f_{X_1}=x+xg_1+xg_1g_2+⋯+g_1…g_m と展開できる。

別の問題へ持ち帰る視点: 長いchain上のaffine recurrenceは、係数の区間積とweighted sumを組にしてdivide and conquerで合成する。

## 正当性

v選択時は子孫を選べず寄与x、非選択時は子のantichain独立選択で積なのでf_v=x+∏f_child。heavy子h以外の積g_vを作るとf_v=x+g_v f_hとなりaffine合成でpath全体をまとめられる。分割統治合成は元漸化式そのものなので答えは変わらず、empty定数1を含めた根係数が各サイズ数。 区間変換(A,B)の合成(A+BC,BD)は上側の式へ下側の式を代入したもの。末端の値1は重い子がない場合の空積を表すので、path全体のA+Bは通常の木DPのfに一致する。

## 実装上の注意

- fの定数項は空antichainの1。heavy path末端の入力を0にすると葉の定数項を失うので、1とする。
- affine変換の合成は上側∘下側の順に(A+BC,BD)。多項式の積自体が可換でも、変換の順序は交換できない。
- light子の部分木サイズをpathの重みに含め、次数の大きい係数列が多数の合成層を通らないようにする。
- 子の係数を合成後に解放し、各heavy頂点のfを個別に保存しない。

## 復習の核

- tree polynomial DPが二乗になるときは、最大childに沿うchainだけを残してlight subproblemsへ計算量を課金する。
- chain recurrenceは各頂点を逐次展開せず、区間を表す積と和が結合的にmergeできるかを見る。

## 計算量と制約

### 時間

N頂点。NTT convolutionと次数balanced積、heavy/light償却で O(N log³N)。

### 空間

子多項式を併合後に解放しpath計算も逐次解放する場合 O(N log N) の安全な上界。全祖先の係数を保存すると最悪O(N²)になる。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq P_i \lt i; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/editorial/4838) — source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/tasks/abc269_h) — source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8
