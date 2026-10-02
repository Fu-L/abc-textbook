---
title: "ABC280-G — Do Use Hexagon Grid 2"
draft: true
authoringUnit: {"problemId":"abc280-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc280-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-event-sweep"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-geometry-orientation-transform","tag-inclusion-exclusion","tag-contribution-reordering","tag-event-sweep"],"sourceRevisionIds":["source-abc280-editorial-5307-08dbbe27bf52c97c58393c02b70945caf6e1fc8cf22b5097bd443a39029daecc","source-abc280-g-problem-7807ef3931a86fdd7adb0d21d36f4018124829bac93a304e81099c69e8d1a1b3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"hex距離は三座標x,y,x−yの最大差なのでpairwise距離≤Dと各軸の幅≤Dが同値。非空subsetの三軸最小値(X,Y,Z)は一意で、対応cube内に収まり三lower face全てをhitする。8categoryの包除はこのhit条件だけを数えるため、全候補を合計しても同じsubsetを重複しない。","sourceRevisionIds":["source-abc280-editorial-5307-08dbbe27bf52c97c58393c02b70945caf6e1fc8cf22b5097bd443a39029daecc","source-abc280-g-problem-7807ef3931a86fdd7adb0d21d36f4018124829bac93a304e81099c69e8d1a1b3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

hex gridの差分(dx,dy)に対する距離はmax(|dx|,|dy|,|dx-dy|)で、(x,y,x-y)へ写すと3次元Chebyshev距離になる。

pairwise距離≤Dは、選択点の各3座標のmax-min≤D、すなわち一つのD-cubeに収まることと同値である。

採用する候補: 各非空subsetを3座標の最小値(X,Y,Z)で一意に分類し、対応cube内の点をlower face所属8categoryに分け、3面すべてに触れるsubset数を数える。

subset列挙をcanonical minimaごとの数え上げへ変え、N≤300で3座標の候補を多項式時間に走査できる。

棄却する候補: 全2^N subsetについて最大pair距離を検査する。

N≤300で指数列挙は不可能である。

canonical minimaを固定したsubsetはcube内にあり、x=X,y=Y,z=Zの各lower faceから少なくとも1点ずつ選ぶ必要がある。

各点を三つのlower faceに属するかの3-bitで分類すれば、全3bitが選択集合のORに現れる条件を8通りの包除で数えられる。

X,Yを固定したときZを動かすcube内category数はpointの出入りを差分更新でき、全Zをまとめて処理できる。

点を(x,y,x-y)に変換する。候補X,Yごとに[X,X+D]×[Y,Y+D]へ入る点を整理し、候補Zのsweepで8category countを更新する。各(X,Y,Z)でlower 3面を全てhitする非空subset数を包除で加える。

## 典型の発動条件

### metricの座標埋め込み

発動条件: 特殊grid距離が複数線形式の絶対値maxで表せるとき。

必要な線形座標を追加し、Chebyshev distanceへ変換する。

### extremaでsubsetをcanonical化

発動条件: diameter制約付きsubsetを重複なく数えたいとき。

座標最小値tupleを代表にし、bounding box内かつ各lower faceをhitする条件を課す。

### bit category包除

発動条件: 複数の必須属性を少なくとも1要素が満たすsubset数を数えるとき。

要素の属性mask別個数から、欠ける属性集合を包除する。

## 問題固有の要素

hex距離に必要な3座標は独立でなくz=x-yだが、diameter条件の数え上げでは通常の3次元cubeとして扱える。

別の問題へ持ち帰る視点: 低次元格子metricでは、linear formsを座標に追加してL∞ bounding-box問題へ移す。

## 正当性

hex距離は三座標x,y,x−yの最大差なのでpairwise距離≤Dと各軸の幅≤Dが同値。非空subsetの三軸最小値(X,Y,Z)は一意で、対応cube内に収まり三lower face全てをhitする。8categoryの包除はこのhit条件だけを数えるため、全候補を合計しても同じsubsetを重複しない。

## 実装上の注意

- subsetの重複を防ぐためlower faceは『少なくとも1点』を三面すべてに要求し、単にcube内subsetを足さない。
- 座標とDは64 bitを使い、同じX/Y/Z値のpointをgroupで同時更新して境界inclusiveを守る。

## 復習の核

- 2点subsetを変換座標で囲む最小cubeを描き、そのsubsetが3lower faceを必ずhitして一つのminima tupleだけに数えられることを確認する。

## 計算量と制約

### 時間

O(N³ log N)を上界とする。候補X,YごとにZイベントをsortし8categoryをsweepする。

### 空間

O(N²)、一つのX,Yだけ保持ならO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; -10^9\leq X_i,Y_i \leq 10^9; 1\leq D \leq 10^{10}; (X_i,Y_i) are pairwise distinct.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/editorial/5307) — source-abc280-editorial-5307-08dbbe27bf52c97c58393c02b70945caf6e1fc8cf22b5097bd443a39029daecc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/tasks/abc280_g) — source-abc280-g-problem-7807ef3931a86fdd7adb0d21d36f4018124829bac93a304e81099c69e8d1a1b3
