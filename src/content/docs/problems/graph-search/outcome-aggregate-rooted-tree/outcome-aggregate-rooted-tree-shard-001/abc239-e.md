---
title: "ABC239-E — Subtree K-th Max"
draft: true
authoringUnit: {"problemId":"abc239-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc239-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc239-e-problem-0c0332ca346ab35bfa6ab96fb1358c42c5f5d1900beb6549ac2981886d6d849b","source-abc239-editorial-3385-b6460d588699cea27577b95603a64000088399f80feb54109efed334fa7c8ce5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"子の B 位より下の要素には同じ子内だけで B 個の先行要素がある。他の子と併合しても順位は上がらないため親の上位 B に不要。葉から、自分の値と子の保存列を併合する帰納法で全保存列が正しい。重複値は異なる頂点として保つ。","sourceRevisionIds":["source-abc239-e-problem-0c0332ca346ab35bfa6ab96fb1358c42c5f5d1900beb6549ac2981886d6d849b","source-abc239-editorial-3385-b6460d588699cea27577b95603a64000088399f80feb54109efed334fa7c8ce5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺1–2,1–3,3–4、値 (5,9,7,7)。質問 (1,3),(3,2)。","procedure":["葉2は[9]、葉4は[7]。","頂点3は[7,7]、根1は[9,7,7,5]。","各指定順位を取り出す。"],"executionTarget":null,"expectedResult":"7,7","verificationStatus":"not_applicable","learningUnitIds":["unit-rooted-tree-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"同値7を集合化して一個に減らしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。頂点3の2位も7であるため、集合化すると順位と要素数を壊す。"},"answer":{"reasoningOrVerification":"不可。頂点3の2位も7であるため、集合化すると順位と要素数を壊す。","procedure":["具体例の各状態・寄与を再計算する。","不可。頂点3の2位も7であるため、集合化すると順位と要素数を壊す。"],"expectedResult":"不可。頂点3の2位も7であるため、集合化すると順位と要素数を壊す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各 query の K_i は20以下なので、部分木の全値を保存する必要はない。どの query にも使われない21番目以下の値は、祖先の部分木へ併合しても上位20個へ戻らない。 子部分木の上位候補と自頂点の値を集めれば、親部分木の上位候補が得られるため、葉から根への木 DP として前計算できる。 上位K個だけを求める merge では、各入力集合からK位より下の要素を捨てても、union の上位K個は変わらない。

採用する候補: 各頂点に、その部分木で大きい順の上位20値だけを持たせ、子の配列を併合・降順 sort・20個に truncate する。

query の上限を状態サイズへ直接反映でき、全 query は前計算済み配列の K_i-1 番目を見るだけになる。

棄却する候補: query ごとに V_i の部分木を走査して値を集め、K_i 番目を選ぶ。

根に近い頂点への query が多数あると同じ部分木を繰り返し走査し、NQ 規模になり得る。

上位K個だけを求める merge では、各入力集合からK位より下の要素を捨てても、union の上位K個は変わらない。

根1から親子関係と postorder を作る。各 v の候補を [X_v] で始め、各 child の上位20配列を追加して降順に並べ、先頭20個だけを P_v として残し、query (V,K) へ P_V[K-1] を返す。

## 典型の発動条件

### 上位K個への状態切り詰め

発動条件: 要求される順位 K に小さい上限があり、集合の merge を繰り返すとき。

各部分問題から上位K個だけを保持し、merge 後も即座にK個へ truncate する。

### 部分木の bottom-up DP

発動条件: 親の答えが自頂点と各子部分木の要約の結合で得られるとき。

postorder で子の要約を確定してから親へ併合する。

## 問題固有の要素

Q は大きいが K_i≤20 という query 側の制約が、各部分木の十分統計量を20要素へ縮める。

別の問題へ持ち帰る視点: 大量 query では N や Q だけでなく、query parameter の最大値が前計算状態を切れるか確認する。

## 正当性

子の B 位より下の要素には同じ子内だけで B 個の先行要素がある。他の子と併合しても順位は上がらないため親の上位 B に不要。葉から、自分の値と子の保存列を併合する帰納法で全保存列が正しい。重複値は異なる頂点として保つ。

## 実装上の注意

- 同じ値も別頂点の候補として重複を保つ。path 木での再帰深度に注意し、配列を20個へ切った後だけ保存してメモリを抑える。

## 復習の核

- 子側で21位の値が親側で20位以内へ復活できない理由を、親に別の値を一つ加えた場合まで含めて説明する。

## 計算量と制約

### 時間

N 頂点、Q 質問、保存上限 B=20。子ごとに候補を sort・切り詰める実装は O(NB log B+Q)。全子を一括 sort する実装の安全な上界は O(NB log(NB)+Q)。

### 空間

木と保存列で O(NB)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 0\leq X_i\leq 10^9; 1\leq A_i,B_i\leq N; 1\leq Q \leq 10^5; 1\leq V_i\leq N; 1\leq K_i\leq 20; The given graph is a tree.; The subtree rooted at Vertex V_i has K_i or more vertices.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺1–2,1–3,3–4、値 (5,9,7,7)。質問 (1,3),(3,2)。

1. 葉2は[9]、葉4は[7]。
2. 頂点3は[7,7]、根1は[9,7,7,5]。
3. 各指定順位を取り出す。

期待される結果: 7,7

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同値7を集合化して一個に減らしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。頂点3の2位も7であるため、集合化すると順位と要素数を壊す。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/tasks/abc239_e) — source-abc239-e-problem-0c0332ca346ab35bfa6ab96fb1358c42c5f5d1900beb6549ac2981886d6d849b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/editorial/3385) — source-abc239-editorial-3385-b6460d588699cea27577b95603a64000088399f80feb54109efed334fa7c8ce5
