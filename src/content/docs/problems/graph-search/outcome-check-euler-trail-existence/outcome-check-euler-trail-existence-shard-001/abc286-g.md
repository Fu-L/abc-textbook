---
title: "ABC286-G — Unique Walk"
draft: true
authoringUnit: {"problemId":"abc286-g","docPath":"src/content/docs/problems/graph-search/outcome-check-euler-trail-existence/outcome-check-euler-trail-existence-shard-001/abc286-g.md","learningOutcomeIds":["outcome-check-euler-trail-existence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["Euler trail・circuitの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euler-trail-circuit","tag-dsu-components"],"sourceRevisionIds":["source-abc286-editorial-5573-b7c203ecb9cdf01e0770ecb5d48490fe62f055dac999dba673135990db17cf3a","source-abc286-g-problem-20f362fc2f2fc85d35edc9a615a3837593c4cf68426cabb9bf748ebbf19a75fa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"必須でない辺は何度でも通れるので各連結成分を一頂点へ縮約できる。必須辺を一度ずつ通るwalkは縮約multigraphのEuler trailと一致する。元graph連結により辺支持も連結で、奇数次数0または2が必要十分。selfloopは次数2を加える。","sourceRevisionIds":["source-abc286-editorial-5573-b7c203ecb9cdf01e0770ecb5d48490fe62f055dac999dba673135990db17cf3a","source-abc286-g-problem-20f362fc2f2fc85d35edc9a615a3837593c4cf68426cabb9bf748ebbf19a75fa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-check-euler-trail-existence"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、両辺必須。","procedure":["縮約は変わらない。","次数1,2,1で奇数二頂点。","1→2→3で各必須辺一回。"],"executionTarget":null,"expectedResult":"Yes","verificationStatus":"not_applicable","learningUnitIds":["unit-euler-trail-circuit"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-check-euler-trail-existence"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"4葉星で全辺必須なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"奇数次数の葉が四つなのでNo。Euler trailは開始終了以外で入出が対になる。"},"answer":{"reasoningOrVerification":"奇数次数の葉が四つなのでNo。Euler trailは開始終了以外で入出が対になる。","procedure":["具体例の各状態・寄与を再計算する。","奇数次数の葉が四つなのでNo。Euler trailは開始終了以外で入出が対になる。"],"expectedResult":"奇数次数の葉が四つなのでNo。Euler trailは開始終了以外で入出が対になる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler trail・circuit](src/content/docs/learn/graph/euler-trail-circuit.md)

- 無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- Euler trail・circuitの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Sに含まれないedgeは何度通ってもよいので、それらだけで連結な頂点同士は、指定edgeを通る順序の間に自由に移動できる1状態へ縮約できる。 縮約後、Sの各edgeをちょうど1回ずつ通るwalkは、multi-edgeやself-loopを許す縮約graph G'で全edgeを1回ずつ通るEuler trailそのものである。 G'のEuler trailがあれば、連続する指定edgeの端点は同じ非S componentに属するので、その間を非S edgeだけのwalkで補間して元graphのwalkへ戻せる。 元graphが連結なので縮約graphも連結であり、Euler trailの判定は奇数次数頂点が0個または2個という条件へ絞れる。 S edgeが同一component内に収まるself-loopなら次数を2増やし、parityには影響しない。

採用する候補: 非S edgeの連結成分をDSUで縮約し、S edgeで作るG'の奇数次数頂点数が0または2か判定する。

繰返し可能な移動をcomponentへ消去し、残るexactly-once条件をEuler trailの必要十分条件へ変換できる。

棄却する候補: 元graph上でS edgeだけの次数parityを数える。

非S edgeによる自由な移動で異なる元頂点を接続できるため、縮約前の次数条件は必要条件にならない。

棄却する候補: S edgeの通過順を全順列で試し、間を非S pathで結べるか調べる。

K!候補になる一方、その順序の存在はEulerの定理だけで判定できる。

G'のEuler trailがあれば、連続する指定edgeの端点は同じ非S componentに属するので、その間を非S edgeだけのwalkで補間して元graphのwalkへ戻せる。

元graphが連結なので縮約graphも連結であり、Euler trailの判定は奇数次数頂点が0個または2個という条件へ絞れる。

S edgeが同一component内に収まるself-loopなら次数を2増やし、parityには影響しない。

Sに属するedgeをmarkし、それ以外の全edgeでDSUをmergeする。各S edge(u,v)についてroot(u),root(v)のdegreeを1ずつ増やす。同じrootなら結果的に2増える。奇数degreeのroot数を数え、0または2ならYes、それ以外ならNoを出力する。

## 典型の発動条件

### 自由移動componentの縮約

発動条件: 一部edgeを無制限に使え、別のedgeだけに使用回数制約があるとき。

無制限edgeの連結成分をDSUで1頂点へまとめる。

### Euler trailの次数判定

発動条件: 指定された全edgeをちょうど1回ずつ使うwalkの存在を問うとき。

連結性の下で奇数次数頂点が0または2かを見る。

## 問題固有の要素

非S edgeは補助移動として何度でも往復できるため、その具体的なpath長や重複は重要でなく、端点が同じcomponentかだけが残る。

別の問題へ持ち帰る視点: exactly-once対象と自由使用対象が混在するwalk問題では、自由側を先に商graphへ潰すとEuler構造が現れる。

## 正当性

必須でない辺は何度でも通れるので各連結成分を一頂点へ縮約できる。必須辺を一度ずつ通るwalkは縮約multigraphのEuler trailと一致する。元graph連結により辺支持も連結で、奇数次数0または2が必要十分。selfloopは次数2を加える。

## 実装上の注意

- S edgeをDSUへ混ぜず、入力indexのmarkを使って二段階で処理する。
- parallel edgeとself-loopを持つG'を明示構築する必要はなく、rootごとのdegree parityだけを管理すればよい。

## 復習の核

- 非S pathで複数頂点が1componentになる例と、S edgeがself-loop・parallel edgeになる例を縮約し、degree parityが元walkの端点数に一致するか確認する。

## 計算量と制約

### 時間

N頂点M辺、必須辺K。DSU O(Mα(N))、次数集計O(K+N)。

### 空間

DSU、必須flag、縮約次数 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq \min(\frac{N(N-1)}{2},2\times 10^5); 1 \leq U_i<V_i\leq N; If i\neq j, then (U_i,V_i)\neq (U_j,V_j) .; G is connected.; 1 \leq K \leq M; 1 \leq x_1<x_2<\cdots<x_K \leq M; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、両辺必須。

1. 縮約は変わらない。
2. 次数1,2,1で奇数二頂点。
3. 1→2→3で各必須辺一回。

期待される結果: Yes

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

4葉星で全辺必須なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

奇数次数の葉が四つなのでNo。Euler trailは開始終了以外で入出が対になる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/editorial/5573) — source-abc286-editorial-5573-b7c203ecb9cdf01e0770ecb5d48490fe62f055dac999dba673135990db17cf3a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/tasks/abc286_g) — source-abc286-g-problem-20f362fc2f2fc85d35edc9a615a3837593c4cf68426cabb9bf748ebbf19a75fa
