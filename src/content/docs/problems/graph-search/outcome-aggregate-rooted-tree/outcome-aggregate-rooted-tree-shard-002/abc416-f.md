---
title: "ABC416-F — Paint Tree 2"
draft: true
authoringUnit: {"problemId":"abc416-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc416-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-resource"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-knapsack-resource"],"sourceRevisionIds":["source-abc416-editorial-13537-e498a5292eb7b837e39dbab06dc44482b245fe9998c203baf15a4b0c8c9e0c9c","source-abc416-f-problem-1b4e0e1da18c3f3627fb622d402fd0d6accd17b478479dd2f626227f6c211a69"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"選択辺のdegree≤2を保つforestはvertex-disjoint path集合。未選択、root選択でdegree0/1/2という境界状態とcomponent数が親との結合に十分。childとedgeで結ぶと二componentが一つになるので数−1、結ばなければ加算。全選択forestを子分解で一意に覆い重み最大を得る。","sourceRevisionIds":["source-abc416-editorial-13537-e498a5292eb7b837e39dbab06dc44482b245fe9998c203baf15a4b0c8c9e0c9c","source-abc416-f-problem-1b4e0e1da18c3f3627fb622d402fd0d6accd17b478479dd2f626227f6c211a69"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、重み(4,−10,5)、K=2。","procedure":["一path全体の重み−1、端だけなら最大5。","二singleton path{1},{3}なら9。","中点未選択で二component。"],"executionTarget":null,"expectedResult":"9","verificationStatus":"not_applicable","learningUnitIds":["unit-rooted-tree-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"prerequisiteIds":["unit-dp-state-design","unit-dp-subset-resource"],"attainmentCondition":"同じ例K=1なら二端を一pathとみなせるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。中点を含めない二端は非連結で二path。答えは5。"},"answer":{"reasoningOrVerification":"不可。中点を含めない二端は非連結で二path。答えは5。","procedure":["具体例の各状態・寄与を再計算する。","不可。中点を含めない二端は非連結で二path。答えは5。"],"expectedResult":"不可。中点を含めない二端は非連結で二path。答えは5。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

白pathを最大K回塗る操作の最終結果は、treeから高々K本のvertex-disjoint pathを選ぶことと同値である。pathの順序は結果に影響しない。 rooted subtreeをparentへ接続できる情報として、rootが未選択か、選択componentのendpointとして開いているか、既に内部頂点で閉じているかを区別すればchildをknapsack mergeできる。 vertex vを単独で選ぶ状態をweight A_v・path数1のopen componentとして初期化し、child endpointと一回結べばvはendpoint、二回結べば内部になり、それ以上は接続できない。 edgeを使わずchildの解を並置する遷移ではpath数を足し、edgeで二open componentを結ぶ遷移ではpath数を足して1引く。このcomponent数管理が操作回数に一致する。

採用する候補: 選択path数kとrootの接続statusを持つtree DPを、各childについてO(K^2)でmergeする

child側のroot endpointと現在rootのopen pathをedgeで結ぶと二componentが一pathへmergeされ、path数が1減る。root degreeは最大2なのでvertex-disjoint path条件を局所的に保てる。

棄却する候補: pathの端点pairを全て列挙し、重ならない最大K本の組合せを探索する

tree上にもΘ(N^2)本のpathがあり、その集合packingを直接扱えない。Kが小さいことはsubtree DPのcount軸に使うべきである。

vertex vを単独で選ぶ状態をweight A_v・path数1のopen componentとして初期化し、child endpointと一回結べばvはendpoint、二回結べば内部になり、それ以上は接続できない。

edgeを使わずchildの解を並置する遷移ではpath数を足し、edgeで二open componentを結ぶ遷移ではpath数を足して1引く。このcomponent数管理が操作回数に一致する。

treeをroot化し、各vで未選択／vをendpointに含むopen／vを内部に含むclosedなどの配列dp[status][k]を初期化する。childの同配列と、edge不使用の並置または両endpoint接続を全k分割でmergeし、vの次数0..2を更新する。rootで全status・k≤Kの最大を取る。

## 典型の発動条件

### tree knapsack

発動条件: 各subtreeから選ぶcomponent数に小さい上限Kがあり、child解を分配して併合するとき。

path数kを軸にchildごとO(K^2) mergeする。

### open/closed component DP

発動条件: subtree境界のrootを介して選択構造がparentへ延長される可能性を区別するとき。

rootがpath endpointか内部か未選択かを状態にする。

### vertex-disjoint path packing

発動条件: tree上でdegree≤2の選択forestを最大重み化するとき。

選択頂点の局所degreeを0..2に制限し、component数をpath本数として数える。

## 問題固有の要素

path本体を保存せず、subtree境界で外へ接続できるendpointがvにあるかだけを伝えると、重なり禁止を局所mergeで保証できる。

別の問題へ持ち帰る視点: tree上の連結部分構造packingでは、parent edgeを通じて未完構造が何本出られるかをboundary stateに圧縮する。

## 正当性

選択辺のdegree≤2を保つforestはvertex-disjoint path集合。未選択、root選択でdegree0/1/2という境界状態とcomponent数が親との結合に十分。childとedgeで結ぶと二componentが一つになるので数−1、結ばなければ加算。全選択forestを子分解で一意に覆い重み最大を得る。

## 実装上の注意

- 不可能状態を十分小さい値にし、同じvertexを複数pathへ含めない。単頂点pathを許し、0本選択の値0、最大値と総和は64 bit、深いtreeのstackにも注意する。

## 復習の核

- K=1、star中心を使うpath、chainで複数区間、単頂点pathが最適な小treeを全path subset列挙と比較する。

## 計算量と制約

### 時間

N頂点、path数上限K。各child knapsack素朴merge O(NK²)。

### 空間

全頂点status×countを保存するなら O(NK)、child解放可能。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; 1\le K\le 5; 1\le A_i\le 10^9; 1\le U_i < V_i \le N; The given graph is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、重み(4,−10,5)、K=2。

1. 一path全体の重み−1、端だけなら最大5。
2. 二singleton path{1},{3}なら9。
3. 中点未選択で二component。

期待される結果: 9

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ例K=1なら二端を一pathとみなせるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。中点を含めない二端は非連結で二path。答えは5。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/editorial/13537) — source-abc416-editorial-13537-e498a5292eb7b837e39dbab06dc44482b245fe9998c203baf15a4b0c8c9e0c9c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/tasks/abc416_f) — source-abc416-f-problem-1b4e0e1da18c3f3627fb622d402fd0d6accd17b478479dd2f626227f6c211a69
