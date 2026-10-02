---
title: "ABC302-E — Isolation"
draft: true
authoringUnit: {"problemId":"abc302-e","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc302-e.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc302-e-problem-11b090eb53471a5e3315ce1c2837d74511b3dbb4e27cef33f24c523b09821da0","source-abc302-editorial-6410-4a22dd9ce6220c919d246e3b7809bb34dc5372fbfdb9e41e7caacacdd5e5fe8e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点vから削除される各辺は、それ以前の追加queryで存在するようになった辺である。したがって全削除queryを通した隣接頂点列挙回数は辺追加回数以下に償却できる。 局所的な次数0↔正の変化だけを反映でき、削除対象の隣接頂点も直接列挙できる。","sourceRevisionIds":["source-abc302-e-problem-11b090eb53471a5e3315ce1c2837d74511b3dbb4e27cef33f24c523b09821da0","source-abc302-editorial-6410-4a22dd9ce6220c919d246e3b7809bb34dc5372fbfdb9e41e7caacacdd5e5fe8e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-bound-monotone-total-work"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、辺12追加、辺23追加、頂点2の全辺を削除。","procedure":["孤立数3→1→0。","二辺の削除後は全て孤立する。"],"executionTarget":null,"expectedResult":"出力1,0,3。","verificationStatus":"not_applicable","learningUnitIds":["unit-amortized-monotone-progress"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-bound-monotone-total-work"],"prerequisiteIds":[],"attainmentCondition":"辺削除時に相手uの孤立数を常に増やすか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"最後の隣接辺を失ったときだけ増やす。残り辺があるuは孤立でない。"},"answer":{"reasoningOrVerification":"最後の隣接辺を失ったときだけ増やす。残り辺があるuは孤立でない。","procedure":["具体例の各状態・寄与を再計算する。","最後の隣接辺を失ったときだけ増やす。残り辺があるuは孤立でない。"],"expectedResult":"最後の隣接辺を失ったときだけ増やす。残り辺があるuは孤立でない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各query後に必要なのは孤立頂点数だけである。辺追加で変化するのは両端、頂点vの全辺削除で変化するのはvとその隣接頂点だけなので、全頂点を数え直す必要はない。

採用する候補: 頂点ごとの隣接集合と孤立頂点数を動的に保つ

局所的な次数0↔正の変化だけを反映でき、削除対象の隣接頂点も直接列挙できる。

棄却する候補: 各query後に全頂点の次数を走査する

1回O(N)となり、Q回のqueryに対して制約を超える。

頂点vから削除される各辺は、それ以前の追加queryで存在するようになった辺である。したがって全削除queryを通した隣接頂点列挙回数は辺追加回数以下に償却できる。

初期値を孤立頂点数Nとする。辺(u,v)追加時は追加前の隣接集合が空なら各端点について1減らして相互に挿入する。全辺削除時はvの各隣接uからvを消し、uが空になれば1増やし、最後にvを空にして必要なら1増やす。

## 典型の発動条件

### 動的グラフの隣接集合

発動条件: 辺の追加と、指定頂点に接続する全辺の削除が混在する。

各頂点の隣接先をsetで持ち、追加・削除と次数0判定を同じ表現で行う。

### 償却計算量

発動条件: 一つの更新が多数の辺を消すが、消した辺は再追加されるまで再び消されない。

削除時の走査を辺単位で課金し、全queryでの総走査量を追加回数に抑える。

## 問題固有の要素

孤立頂点数は辺集合全体ではなく、更新で次数0の境界をまたぐ頂点だけを見れば保てる。

別の問題へ持ち帰る視点: 大域的な個数を問われても、1更新で状態が変わり得る要素を局所化して差分管理する。

## 正当性

頂点vから削除される各辺は、それ以前の追加queryで存在するようになった辺である。したがって全削除queryを通した隣接頂点列挙回数は辺追加回数以下に償却できる。 局所的な次数0↔正の変化だけを反映でき、削除対象の隣接頂点も直接列挙できる。

## 実装上の注意

- 全辺削除中にvの集合そのものを変更するとiteratorが無効化され得るため、隣接先を走査して相手側だけを消し、v側は走査後に一括clearする。

## 復習の核

- 同じ辺の再追加、すでに孤立している頂点への削除、次数1の隣接頂点が同時に孤立する例で差分更新を確認する。

## 計算量と制約

### 時間

平衡set版O(Q log N)、削除辺の総列挙O(Q)。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N\leq 3\times 10^5; 1 \leq Q\leq 3\times 10^5; For each query of the first kind, 1\leq u,v\leq N and u\neq v.; For each query of the second kind, 1\leq v\leq N.; Right before a query of the first kind is given, there is no edge between vertices u and v.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、辺12追加、辺23追加、頂点2の全辺を削除。

1. 孤立数3→1→0。
2. 二辺の削除後は全て孤立する。

期待される結果: 出力1,0,3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

辺削除時に相手uの孤立数を常に増やすか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

最後の隣接辺を失ったときだけ増やす。残り辺があるuは孤立でない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/tasks/abc302_e) — source-abc302-e-problem-11b090eb53471a5e3315ce1c2837d74511b3dbb4e27cef33f24c523b09821da0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/editorial/6410) — source-abc302-editorial-6410-4a22dd9ce6220c919d246e3b7809bb34dc5372fbfdb9e41e7caacacdd5e5fe8e
