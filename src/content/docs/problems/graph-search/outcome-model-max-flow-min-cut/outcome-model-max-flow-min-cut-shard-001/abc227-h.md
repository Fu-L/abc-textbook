---
title: "ABC227-H — Eat Them All"
draft: true
authoringUnit: {"problemId":"abc227-h","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc227-h.md","learningOutcomeIds":["outcome-model-max-flow-min-cut","outcome-construct-euler-trail-or-circuit"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euler-trail-circuit","tag-max-flow-min-cut","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc227-editorial-2915-374933d9212fac4dda1de99b9ef56b841a9eb84e2165f73f5774c963b6d66b5a","source-abc227-h-problem-ea5d90f87cdd2219658f9d0d0538e53f567e1e070756ee47adeebf544d70b681"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"通過多重度の次数2A_vと連結supportがEuler閉路必要十分で、各出発は一缶消費に対応。連結supportはspanning treeを含むのでtreeを全列挙し一回分引けば残余次数を二部flowへ表せる。全残余需要が流れるとEuler復元で元操作列を実現する。","sourceRevisionIds":["source-abc227-editorial-2915-374933d9212fac4dda1de99b9ef56b841a9eb84e2165f73f5774c963b6d66b5a","source-abc227-h-problem-ea5d90f87cdd2219658f9d0d0538e53f567e1e070756ee47adeebf544d70b681"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-max-flow-min-cut","outcome-construct-euler-trail-or-circuit"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3×3の猫缶数: 第一行(1,2,2)、第二行(2,2,2)、第三行(2,2,1)。","procedure":["蛇行path (1,1)→(1,2)→(1,3)→(2,3)→(2,2)→(2,1)→(3,1)→(3,2)→(3,3) を往復する。","両端は一回、各内部マスは二回出発するため指定の猫缶数をちょうど消費する。","行動列RRDLLDRRLLURRULLの16歩で全缶がなくなり(1,1)へ戻る。"],"executionTarget":null,"expectedResult":"可能、行動例RRDLLDRRLLURRULL。","verificationStatus":"not_applicable","learningUnitIds":["unit-max-flow-min-cut"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-max-flow-min-cut","outcome-construct-euler-trail-or-circuit"],"prerequisiteIds":["unit-bounded-enumeration","unit-state-graph-search"],"attainmentCondition":"次数条件だけでsupport連結を省けるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。別々の閉路へ分かれると一つの始点から全缶を消費できない。spanning treeを先に固定する。"},"answer":{"reasoningOrVerification":"不可。別々の閉路へ分かれると一つの始点から全缶を消費できない。spanning treeを先に固定する。","procedure":["具体例の各状態・寄与を再計算する。","不可。別々の閉路へ分かれると一つの始点から全缶を消費できない。spanning treeを先に固定する。"],"expectedResult":"不可。別々の閉路へ分かれると一つの始点から全缶を消費できない。spanning treeを先に固定する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

3×3盤面を9頂点12辺の無向二部グラフとみる。各マスでは餌を食べるたびに1本の辺から出発し、最終的に始点へ戻るので、頂点vを端点とする辺の総通過回数は2A_vでなければならない。 A_vは最大100で行動列を直接探索する分岐は大きいが、盤面の辺数は12で固定されている。先に各辺を何回通るか決めれば、残る条件は次数と正の辺の連結性になる。 辺eの通過回数x_eを多重辺数とみなすと、各頂点の次数は2A_vで全て偶数になる。正の多重辺のsupportが連結ならEuler閉路が存在し、その各出発がちょうど1缶を消費するので元の行動列へ戻せる。 gridは市松模様の二部グラフなので、黒頂点の残余次数をsource側、白頂点の残余次数をsink側に置き、盤面辺へ流す量を追加通過回数と解釈できる。

棄却する候補: 現在位置と9マスの残量を状態にして、行動列をDFSまたはDPで探索する。

残量状態は最大101^9通りで、同じ最終的な辺通過回数へ至る多数の順序も重複してしまう。

採用する候補: 連結性を保証するspanning treeを列挙し、その辺へ1の下限制約を置いた次数充足問題を二部グラフの最大流で解く。

12辺の部分集合は全列挙でき、tree分を引いた残余次数は各辺の追加通過回数を流量とするbipartite flowに一致する。

辺eの通過回数x_eを多重辺数とみなすと、各頂点の次数は2A_vで全て偶数になる。正の多重辺のsupportが連結ならEuler閉路が存在し、その各出発がちょうど1缶を消費するので元の行動列へ戻せる。

gridは市松模様の二部グラフなので、黒頂点の残余次数をsource側、白頂点の残余次数をsink側に置き、盤面辺へ流す量を追加通過回数と解釈できる。

12辺の部分集合から9頂点を結ぶtreeを選び、各tree辺を1回使う分だけ端点の要求次数2A_vを減らす。残余要求を最大流で全て満たせたら辺多重度を復元し、(1,1)からHierholzer法でEuler閉路を構築して各辺をL/R/U/Dへ変換する。

## 典型の発動条件

### 閉じたwalkの辺多重度とEuler閉路への変換

発動条件: 各頂点での訪問・出発回数が指定され、実際のwalkを構成する問題で、順序より辺の使用回数を先に決められるとき。

消費回数を頂点次数へ翻訳し、偶数次数かつ連結な多重グラフを作ってHierholzer法で行動順を復元する。

### 二部グラフ上の次数列実現を最大流で解く

発動条件: 二部グラフの各頂点に必要次数があり、各辺へ非負整数の多重度を割り当てたいとき。

黒側要求をsource容量、白側要求をsink容量、盤面辺を十分大きい容量として、全要求を満たすflowを辺多重度にする。

### 小さい辺集合で連結性のwitnessを全列挙する

発動条件: 量の割当はflowなどで解ける一方、正の辺の連結性だけが非線形で、候補辺数が十分小さいとき。

連結supportが含むspanning treeを12辺から列挙し、tree辺に下限1を課すことで連結性を局所的な次数制約へ落とす。

## 問題固有の要素

固定3×3盤面では辺が12本しかないため、通常は扱いにくい「使用辺が連結」という条件をspanning treeの全列挙で保証できる。

別の問題へ持ち帰る視点: 構成のsupport条件に困ったら、入力全体ではなく候補辺数が小さくないかを数え、連結性の証人となるtreeを先に固定する方法を検討する。

## 正当性

通過多重度の次数2A_vと連結supportがEuler閉路必要十分で、各出発は一缶消費に対応。連結supportはspanning treeを含むのでtreeを全列挙し一回分引けば残余次数を二部flowへ表せる。全残余需要が流れるとEuler復元で元操作列を実現する。

## 実装上の注意

- tree辺の下限1を引いた後の残余次数が負ならそのtreeは不可能であり、黒側と白側の残余次数総和も一致する必要がある。
- Euler構築では無向辺の残り多重度を両端で共有して1ずつ減らし、帰りがけに記録した頂点列を反転して移動文字へ直す。

## 復習の核

- 行動列を直接追う前に、各頂点から何回出るかを数え、閉じたwalkなら次数がその2倍になることを小さい往復で確かめる。
- 次数が合うだけでは離れた閉路ができる反例を忘れず、連結性をspanning treeという明示的witnessで保証する。

## 計算量と制約

### 時間

3×3固定9頂点12辺。2^12 subsetを検査、各固定サイズflow O(1)のgraph演算（容量整数幅固定）。Euler出力長 L=ΣA_v に O(L)。

### 空間

固定network O(1)、Euler多重辺出力 O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq A_{i,j} \leq 100; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3×3の猫缶数: 第一行(1,2,2)、第二行(2,2,2)、第三行(2,2,1)。

1. 蛇行path (1,1)→(1,2)→(1,3)→(2,3)→(2,2)→(2,1)→(3,1)→(3,2)→(3,3) を往復する。
2. 両端は一回、各内部マスは二回出発するため指定の猫缶数をちょうど消費する。
3. 行動列RRDLLDRRLLURRULLの16歩で全缶がなくなり(1,1)へ戻る。

期待される結果: 可能、行動例RRDLLDRRLLURRULL。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

次数条件だけでsupport連結を省けるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。別々の閉路へ分かれると一つの始点から全缶を消費できない。spanning treeを先に固定する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/editorial/2915) — source-abc227-editorial-2915-374933d9212fac4dda1de99b9ef56b841a9eb84e2165f73f5774c963b6d66b5a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/tasks/abc227_h) — source-abc227-h-problem-ea5d90f87cdd2219658f9d0d0538e53f567e1e070756ee47adeebf544d70b681
