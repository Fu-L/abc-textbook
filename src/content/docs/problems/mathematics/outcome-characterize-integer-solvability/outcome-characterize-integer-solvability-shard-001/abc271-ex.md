---
title: "ABC271-EX — General General"
draft: true
authoringUnit: {"problemId":"abc271-ex","docPath":"src/content/docs/problems/mathematics/outcome-characterize-integer-solvability/outcome-characterize-integer-solvability-shard-001/abc271-ex.md","learningOutcomeIds":["outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-greedy-exchange"],"excludedTopics":["差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。"],"tagIds":["tag-bezout-diophantine","tag-bounded-enumeration","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b","source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"順序を忘れて各方向の非負使用回数を考える。局所交換で同じ変位を保ち操作数を増やさずsupportを2方向へ減らせ、残りうる例外は軸1回と二対角の形である。列挙した非平行pairは行列式で係数が一意に決まり、整数性と非負性を満たすものだけ実現可能。例外も軸を一回引いてpair solverへ渡すので全最適形を覆う。","sourceRevisionIds":["source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b","source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-characterize-integer-solvability"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"許可方向(1,0),(1,1)、目標(3,2)。","procedure":["対角2回と水平1回で到達。","各moveのx増分は1なので少なくとも3回必要。"],"executionTarget":null,"expectedResult":"最小3回。","verificationStatus":"not_applicable","learningUnitIds":["unit-gcd-diophantine"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-characterize-integer-solvability"],"prerequisiteIds":["unit-bounded-enumeration","unit-greedy-exchange"],"attainmentCondition":"目標(3,−1)へ同じ許可方向で行けるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"−1。"},"answer":{"reasoningOrVerification":"全方向のy増分が非負なので不可能。pair係数も対角回数−1となり除外される。","procedure":["具体例の各状態・寄与を再計算する。","全方向のy増分が非負なので不可能。pair係数も対角回数−1となり除外される。"],"expectedResult":"−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 考察

各moveは8方向のinteger vectorで、順序は結果に影響せず、必要なのは許可vectorごとの非負使用回数とその総和だけである。

局所的なvector恒等式でmove countsを交換すると、操作回数を増やさずsupportを高々2方向へ減らせる。ただし二つのdiagonalと一つのaxis directionを使い、axisをちょうど1回残す形だけが例外候補になる。

棄却する候補: 座標平面上でBFSまたはtargetまでのdistance DPを行う。

|A|,|B|が10^9で探索領域を列挙できない。

採用する候補: 許可された高々2方向の組を全列挙して非負整数係数を解き、さらに各axis moveを1回先に使った残targetでも同じpair列挙を行う。

exchange argumentが少数supportのoptimal solutionの存在を保証し、方向数8は定数なので各caseを定数時間で判定できる。

非平行な二vector u,vではdeterminantから係数p,qを一意に求め、割り切れてp,q≥0ならp+qが候補になる。

三方向例外もaxis vectorを一度引けば残りは二方向の非負整数結合になり、同じsolverを再利用できる。

integer lattice shortest walkをexchange argumentでconstant-support representationsへ縮約し、小さなDiophantine systemsの全列挙で解く。

## 典型の発動条件

### 交換法によるsupport削減

発動条件: 多数種類の同価操作を可換に組み合わせ、vector relationで同じ結果をより少ない種類へ変形できるとき。

8方向moveの三種類以上の併用を置換し、定数個の二方向pairと限定された三方向例外を漏れなく全列挙する。

### 二変数一次Diophantine方程式

発動条件: target vectorを二つのinteger vectorsの非負整数結合で表せるか判定したいとき。

determinantとdivisibilityで二係数を求め、nonnegativeなら使用回数和を比較する。

## 問題固有の要素

rotation/reflection symmetryで方向pairの形をさらに定数個へ標準化できるが、8方向全pairを直接列挙しても十分小さい。

別の問題へ持ち帰る視点: 操作集合が小さくtargetが巨大な最短walkでは、探索空間よりoptimal representationのsupport boundを探す。

## 正当性

順序を忘れて各方向の非負使用回数を考える。局所交換で同じ変位を保ち操作数を増やさずsupportを2方向へ減らせ、残りうる例外は軸1回と二対角の形である。列挙した非平行pairは行列式で係数が一意に決まり、整数性と非負性を満たすものだけ実現可能。例外も軸を一回引いてpair solverへ渡すので全最適形を覆う。

## 実装上の注意

- determinantが0のparallel pairは別扱いし、single directionでtargetの両座標が同じ非負倍率になるか確認する。
- 三方向候補で先に使うaxis moveと、残り二方向がすべてs_i=1で許可されていることを確認する。

## 復習の核

- 可換なvector操作では、三種類以上の使用を同じ変位・非増加costで置換するrelationを探す。
- support boundが得られたら、幾何的case分けをdeterminantによる統一solverへ落とす。

## 計算量と制約

### 時間

各case O(1)。許可8方向の全single/pairと軸1回の例外を列挙する。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^4; -10^9 \leq A,B \leq 10^9; s_i is 0 or 1.; T, A, and B are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

許可方向(1,0),(1,1)、目標(3,2)。

1. 対角2回と水平1回で到達。
2. 各moveのx増分は1なので少なくとも3回必要。

期待される結果: 最小3回。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

目標(3,−1)へ同じ許可方向で行けるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全方向のy増分が非負なので不可能。pair係数も対角回数−1となり除外される。

確認結果: −1。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/tasks/abc271_h) — source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/editorial/4932) — source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a
