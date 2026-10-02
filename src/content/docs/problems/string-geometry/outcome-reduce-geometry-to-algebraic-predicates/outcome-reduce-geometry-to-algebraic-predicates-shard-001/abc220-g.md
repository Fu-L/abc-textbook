---
title: "ABC220-G — Isosceles Trapezium"
draft: true
authoringUnit: {"problemId":"abc220-g","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc220-g.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc220-editorial-2684-ebe75396fb3dc16f89b1952b2f1e9bb2bc23e34bff5179ed35fe39c2888ac327","source-abc220-g-problem-11cd77caf912f0d4d4a1772f3a50e387c0c294519ddc6ef41e8278462c72a6ed"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等脚台形の二底辺は平行で、両中点を通る共通の垂直二等分線を持つ。逆に同じ垂直二等分線を持ち中点が異なる二線分を選ぶと、両端の対応は軸対称となり、四頂点は異なる二平行線上にあって等脚台形を作る。したがって直線keyが同じで中点keyが異なる二候補を選べば十分である。同じ中点groupでは最大重みの線分以外は不要で、異なる二groupの最大重み和を選ぶ。primitive方向と中点の内積によるkeyは同じ直線を一意に表す。","sourceRevisionIds":["source-abc220-editorial-2684-ebe75396fb3dc16f89b1952b2f1e9bb2bc23e34bff5179ed35fe39c2888ac327","source-abc220-g-problem-11cd77caf912f0d4d4a1772f3a50e387c0c294519ddc6ef41e8278462c72a6ed"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"点(−1,0),(1,0),(−2,2),(2,2)、重みは順に1,2,3,4。","procedure":["下の点対と上の点対はいずれも水平で、垂直二等分線はx=0。","二倍中点は(0,0)と(0,4)で異なる。点対重みは3と7。"],"executionTarget":null,"expectedResult":"四頂点の重み和10の等脚台形を作れる。","verificationStatus":"not_applicable","learningUnitIds":["unit-geometry-primitives"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"同一直線keyだけで採用すると、点(−1,0),(1,0),(−2,0),(2,0)で何が起こるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"二線分の垂直二等分線は共通だが、中点も共通で四点は一直線。台形にならないため中点keyが異なる条件が必要。"},"answer":{"reasoningOrVerification":"二線分の垂直二等分線は共通だが、中点も共通で四点は一直線。台形にならないため中点keyが異なる条件が必要。","procedure":["具体例の各状態・寄与を再計算する。","二線分の垂直二等分線は共通だが、中点も共通で四点は一直線。台形にならないため中点keyが異なる条件が必要。"],"expectedResult":"二線分の垂直二等分線は共通だが、中点も共通で四点は一直線。台形にならないため中点keyが異なる条件が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

等脚台形の平行な二辺を取り出すと、対称軸である垂直二等分線が一致する。逆に二線分の垂直二等分線が同じで中点が異なれば、その四端点は等脚台形を作る。

N≤1000 なので点対を辺候補として全列挙できるが、四点の全列挙はできない。必要なのは同じ垂直二等分線を持つ二辺のうち、中点が異なる重い組である。

採用する候補: 全点対を正規化した垂直二等分線で group 化し、各 group で中点の異なる二辺の重み和最大を求める。

等脚条件の必要十分条件を二辺の共通 key に変え、点対列挙後は group 内の上位候補だけを比較すればよい。

棄却する候補: 四点集合を全て選び、頂点順を試して辺の平行性と角を判定する。

候補数が N^4 であり、N=1000 に対して列挙できない。

線分方向の primitive vector (dx,dy) と、二倍中点 (x_i+x_j,y_i+y_j) のその方向への内積を組にすれば、垂直二等分線を実数なしで一意に正規化できる。

同じ垂直二等分線でも中点が一致する二辺は平行な対辺にならないため、最大辺と組ませる候補は中点 key が異なるものに限る。

各 i<j について方向差を gcd と符号で primitive 化し、bisector key と二倍中点、重み C_i+C_j を記録する。bisector key で分類し、重み降順に見て中点が異なる二候補の最大和を更新し、存在しなければ -1 を出す。

## 典型の発動条件

### 幾何条件の線分対への分解

発動条件: 四点図形の条件が、向かい合う二線分が共有する軸・中点・長さなどで特徴付けられるとき。

全点対を列挙して共通 invariant で group 化し、四点列挙を二辺選択へ落とす。

### 整数による直線正規化

発動条件: 傾き0・無限大を含む直線の一致判定を誤差なく行いたいとき。

方向係数を gcd と符号で正規化し、直線定数も整数の内積で表す。

## 問題固有の要素

平行な辺そのものを key にするのではなく、等脚性まで同時に保証する共通の垂直二等分線を key にする。

別の問題へ持ち帰る視点: 図形の名称から辺条件を順に検査せず、図形を特徴付ける対称軸や中心という一つの invariant を探す。

## 正当性

等脚台形の二底辺は平行で、両中点を通る共通の垂直二等分線を持つ。逆に同じ垂直二等分線を持ち中点が異なる二線分を選ぶと、両端の対応は軸対称となり、四頂点は異なる二平行線上にあって等脚台形を作る。したがって直線keyが同じで中点keyが異なる二候補を選べば十分である。同じ中点groupでは最大重みの線分以外は不要で、異なる二groupの最大重み和を選ぶ。primitive方向と中点の内積によるkeyは同じ直線を一意に表す。

## 実装上の注意

- 方向 vector の符号を一意にし、中点は割らず座標和で比較する。直線 key の内積と四点重みは 64 bit を使い、同じ中点の辺二本を採用しない。

## 復習の核

- 長さの異なる二本の平行辺を描き、なぜ等脚なら垂直二等分線が同じか、また中点一致を除く必要があるかを図で確認する。

## 計算量と制約

### 時間

Vを座標差の最大絶対値として、全点対のgcd計算とgroupのsortで O(N²(log(V+1)+log(N+1)))。

### 空間

点対のkey・中点・重みを保持して O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 4 \leq N \leq 1000; -10^9 \leq X_i,Y_i \leq 10^9; 1 \leq C_i \leq 10^9; (X_i,Y_i) \neq (X_j,Y_j) if i \neq j.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

点(−1,0),(1,0),(−2,2),(2,2)、重みは順に1,2,3,4。

1. 下の点対と上の点対はいずれも水平で、垂直二等分線はx=0。
2. 二倍中点は(0,0)と(0,4)で異なる。点対重みは3と7。

期待される結果: 四頂点の重み和10の等脚台形を作れる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同一直線keyだけで採用すると、点(−1,0),(1,0),(−2,0),(2,0)で何が起こるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二線分の垂直二等分線は共通だが、中点も共通で四点は一直線。台形にならないため中点keyが異なる条件が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/editorial/2684) — source-abc220-editorial-2684-ebe75396fb3dc16f89b1952b2f1e9bb2bc23e34bff5179ed35fe39c2888ac327
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/tasks/abc220_g) — source-abc220-g-problem-11cd77caf912f0d4d4a1772f3a50e387c0c294519ddc6ef41e8278462c72a6ed
