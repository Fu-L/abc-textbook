---
title: "ABC269-EX — Antichain"
draft: true
authoringUnit: {"problemId":"abc269-ex","docPath":"src/content/docs/problems/graph-search/outcome-accelerate-tree-dp-by-heavy-path/outcome-accelerate-tree-dp-by-heavy-path-shard-001/abc269-ex.md","learningOutcomeIds":["outcome-accelerate-tree-dp-by-heavy-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-polynomial-convolution","unit-recursive-divide-and-conquer","unit-rooted-tree-aggregation"],"excludedTopics":["heavy path上の多項式木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-heavy-path-tree-dp","tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524","source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"v選択時は子孫を選べず寄与x、非選択時は子のantichain独立選択で積なのでf_v=x+∏f_child。heavy子h以外の積g_vを作るとf_v=x+g_v f_hとなりaffine合成でpath全体をまとめられる。分割統治合成は元漸化式そのものなので答えは変わらず、empty定数1を含めた根係数が各サイズ数。","sourceRevisionIds":["source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524","source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-accelerate-tree-dp-by-heavy-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"根1、子2,3。","procedure":["葉f2=f3=1+x。","f1=x+(1+x)²=1+3x+x²。","非空係数を読む。"],"executionTarget":null,"expectedResult":"K1:3、K2:1、K3:0","verificationStatus":"not_applicable","learningUnitIds":["unit-heavy-path-tree-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-accelerate-tree-dp-by-heavy-path"],"prerequisiteIds":["unit-generating-functions","unit-polynomial-convolution","unit-recursive-divide-and-conquer","unit-rooted-tree-aggregation"],"attainmentCondition":"path木で素朴多項式を全祖先へcopyすると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"各配列次数が大きくなるため総copyが二乗。heavy path表現をmoveし一括合成する。"},"answer":{"reasoningOrVerification":"各配列次数が大きくなるため総copyが二乗。heavy path表現をmoveし一括合成する。","procedure":["具体例の各状態・寄与を再計算する。","各配列次数が大きくなるため総copyが二乗。heavy path表現をmoveし一括合成する。"],"expectedResult":"各配列次数が大きくなるため総copyが二乗。heavy path表現をmoveし一括合成する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

subtree vのantichain generating functionをempty set込みでf_v(x)とすると、vを選ぶ場合はxだけ、選ばない場合は各childから独立に選べるため f_v=x+∏f_child となる。 このtree DPを素朴なpolynomial convolutionで行うと、細長い木やcentipede型で総次数処理が二乗に達する。 heavy path上でg_iをlight childrenのfの積と置くと f_i=x+g_i f_{i+1} となり、path先頭のfはprefix productsの和としてまとめて計算できる。 light edgeを子側へ渡るたびsubtree sizeは半分以下なので、light-rooted subproblemのサイズ総和には対数回分しか課金されない。

棄却する候補: 各頂点で子のpolynomialを順に畳み込み、f_vを明示的に構築する。

部分木サイズに比例する配列を多数の祖先で作り直し、最悪Θ(N^2)となる。

採用する候補: 最大subtreeのchildをheavyとし、各heavy pathではlight-child積g_iを使う一次元漸化式をdivide-and-conquer polynomial productsで評価する。

light edgeを跨ぐ部分木サイズ総和がO(N log N)で、NTTによる積とpath評価を全体O(N log^3 N)に抑えられる。

heavy path上でg_iをlight childrenのfの積と置くと f_i=x+g_i f_{i+1} となり、path先頭のfはprefix productsの和としてまとめて計算できる。

light edgeを子側へ渡るたびsubtree sizeは半分以下なので、light-rooted subproblemのサイズ総和には対数回分しか課金されない。

antichainのtree generating-function DPをheavy pathsへ分解し、path recurrenceをNTT付きdivide and conquer、light subtreesをsize-aware mergingで合成する。

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

v選択時は子孫を選べず寄与x、非選択時は子のantichain独立選択で積なのでf_v=x+∏f_child。heavy子h以外の積g_vを作るとf_v=x+g_v f_hとなりaffine合成でpath全体をまとめられる。分割統治合成は元漸化式そのものなので答えは変わらず、empty定数1を含めた根係数が各サイズ数。

## 実装上の注意

- fはempty setのconstant term 1を含め、出力時だけK=1,…,Nの係数を取り出す。
- polynomial degreeをsubtree sizeまでに切り、heavy childのvectorはcopyせずmoveして二乗memory trafficを避ける。

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

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

根1、子2,3。

1. 葉f2=f3=1+x。
2. f1=x+(1+x)²=1+3x+x²。
3. 非空係数を読む。

期待される結果: K1:3、K2:1、K3:0

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

path木で素朴多項式を全祖先へcopyすると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各配列次数が大きくなるため総copyが二乗。heavy path表現をmoveし一括合成する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/editorial/4838) — source-abc269-editorial-4838-c30b479eb416f50d4f286ad6b698e2eb13b631f037caa01b68c45d7498952524
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/tasks/abc269_h) — source-abc269-ex-problem-f742e5223616f7665fcc961022130ba6863b060b10574df5001fb15403bb0ee8
