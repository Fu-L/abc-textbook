---
title: "ABC350-G — Mediator"
draft: true
authoringUnit: {"problemId":"abc350-g","docPath":"src/content/docs/problems/hybrid/outcome-balance-heavy-light-threshold/outcome-balance-heavy-light-threshold-shard-001/abc350-g.md","learningOutcomeIds":["outcome-balance-heavy-light-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-threshold-heavy-light"],"sourceRevisionIds":["source-abc350-editorial-9875-c1953a91ccf515b4855ce59eab0463bd9066284f0794c7d3e7d2b535ae72be78","source-abc350-g-problem-3e794967dfdad695f3e5812d9a3bc0dc5b72f581425872eb0a655d97428cdd83"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"block開始時forest G_0でu,vが同一成分なら、共通隣接点候補はparent[u],parent[v]だけである。別成分なのに現在は共通隣接点を持つなら、その二辺の少なくとも一方は現在blockで追加されたのでpending辺の走査で候補を拾える。 過去blockの全辺は親・component IDへO(N)で圧縮し、現在blockの高々B辺だけを未反映差分として残す。このbase+delta不変条件がonline性と平方根計算量を両立させる。 一blockごとのO(N)再構築と一queryごとのO(B)pending辺走査に分けられ、O(NQ/B+BQ)をB≈√NでO(Q√N)へ均衡できる。暗号化queryも到着順に復号して扱える。","sourceRevisionIds":["source-abc350-editorial-9875-c1953a91ccf515b4855ce59eab0463bd9066284f0794c7d3e7d2b535ae72be78","source-abc350-g-problem-3e794967dfdad695f3e5812d9a3bc0dc5b72f581425872eb0a655d97428cdd83"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-balance-heavy-light-threshold"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺1-2,2-3、query(1,3)。","procedure":["既存forestで共通隣接候補2を得る。","両辺の存在を検査する。"],"executionTarget":null,"expectedResult":"答え2。","verificationStatus":"not_applicable","learningUnitIds":["unit-threshold-heavy-light"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-balance-heavy-light-threshold"],"prerequisiteIds":[],"attainmentCondition":"block内に辺3-4を追加しquery(2,4)を問うと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"共通隣接3が答え。base成分が異なるならpending辺3-4から候補3を拾う。"},"answer":{"reasoningOrVerification":"共通隣接3が答え。base成分が異なるならpending辺3-4から候補3を拾う。","procedure":["具体例の各状態・寄与を再計算する。","共通隣接3が答え。base成分が異なるならpending辺3-4から候補3を拾う。"],"expectedResult":"共通隣接3が答え。base成分が異なるならpending辺3-4から候補3を拾う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [平方根・閾値による軽重分類](src/content/docs/learn/modeling/threshold-heavy-light.md)

- 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

現在グラフは常にforestなので、u,vが同じ木にあり共通隣接点wを持つなら、任意に根を付けたときwはparent[u]またはparent[v]のどちらかである。最終forestを先読みできれば候補は二つだが、queryが直前回答で暗号化されているためonlineで近似的に固定する必要がある。

採用する候補: queryをblock分割し、block前のforestだけ親・成分を再構築してblock内新辺を直接検査する

一blockごとのO(N)再構築と一queryごとのO(B)pending辺走査に分けられ、O(NQ/B+BQ)をB≈√NでO(Q√N)へ均衡できる。暗号化queryも到着順に復号して扱える。

棄却する候補: 全queryを復号して最終forestに根を付け、各質問でparent候補だけを見る

次queryの復号が過去のtype 2回答に依存するため、回答前に将来の辺を確定するoffline処理は循環してしまう。

棄却する候補: 辺追加のたびに現在forest全体のparentと成分を再計算する

一回O(N)、Q回でO(NQ)となり、N,Q≤10^5では実行できない。

block開始時forest G_0でu,vが同一成分なら、共通隣接点候補はparent[u],parent[v]だけである。別成分なのに現在は共通隣接点を持つなら、その二辺の少なくとも一方は現在blockで追加されたのでpending辺の走査で候補を拾える。

過去blockの全辺は親・component IDへO(N)で圧縮し、現在blockの高々B辺だけを未反映差分として残す。このbase+delta不変条件がonline性と平方根計算量を両立させる。

B件ごとに、それまでの全辺からforestをDFSしてparentとcomponentを再計算しpendingを空にする。辺追加は全体の隣接判定構造とpendingへ記録する。質問ではbase成分が同じなら二つのparent候補、異なるならuまたはvに接するpending辺の反対端を候補にし、現在辺集合で両隣接を確認して唯一のwまたは0を返す。

## 典型の発動条件

### query平方分割

発動条件: 更新を完全反映した全体再構築は重いが、少数の未反映更新ならquery時に直接走査できる。

過去辺をO(N)の親・成分情報へ固め、block内のO(B)辺をdeltaとして残す。

### 根付きforestの距離2候補

発動条件: forest上で二頂点に共通して隣接する頂点を求めたい。

同一treeではparent[u]とparent[v]だけを候補にして実辺の存在を確認する。

## 問題固有の要素

暗号化はoffline化だけを封じており、過去を定期的に固定するblock処理は可能である。baseで別成分という情報が、答えを作る辺の少なくとも一方をdelta側へ限定する。

別の問題へ持ち帰る視点: online制約下では、全履歴を固定部分と小さい差分に分け、固定部分で候補を定数個へ絞るか、差分に証人が必ず現れることを示す。

## 正当性

block開始時forest G_0でu,vが同一成分なら、共通隣接点候補はparent[u],parent[v]だけである。別成分なのに現在は共通隣接点を持つなら、その二辺の少なくとも一方は現在blockで追加されたのでpending辺の走査で候補を拾える。 過去blockの全辺は親・component IDへO(N)で圧縮し、現在blockの高々B辺だけを未反映差分として残す。このbase+delta不変条件がonline性と平方根計算量を両立させる。 一blockごとのO(N)再構築と一queryごとのO(B)pending辺走査に分けられ、O(NQ/B+BQ)をB≈√NでO(Q√N)へ均衡できる。暗号化queryも到着順に復号して扱える。

## 実装上の注意

- a,b,cは必ず直前のtype 2回答を使って64 bitで復号し、その後にquery種別を判定する。pendingには現在blockで既に処理した辺だけを入れ、rootのparent=0を候補から除き、無向辺keyは端点順を正規化する。

## 復習の核

- 小さいforestの隣接list全走査と比較し、u,vがbaseで同成分・別成分の両場合、共通点を作る一辺がpendingの場合、block先頭と末尾、答え0後の復号、rootが端点になる場合を確認する。

## 計算量と制約

### 時間

O(QN/B+QB)、森林の再構築O(N)、差分辺最大B。B≈√N。隣接hash検査は期待O(1)。

### 空間

O(N+B)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 256 MiB; Constraints: All input values are integers.; 2 \le N \le 10^5; 1 \le Q \le 10^5; 1 \le u < v \le N; 0 \le a,b,c < 998244353

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺1-2,2-3、query(1,3)。

1. 既存forestで共通隣接候補2を得る。
2. 両辺の存在を検査する。

期待される結果: 答え2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

block内に辺3-4を追加しquery(2,4)を問うと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

共通隣接3が答え。base成分が異なるならpending辺3-4から候補3を拾う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/editorial/9875) — source-abc350-editorial-9875-c1953a91ccf515b4855ce59eab0463bd9066284f0794c7d3e7d2b535ae72be78
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/tasks/abc350_g) — source-abc350-g-problem-3e794967dfdad695f3e5812d9a3bc0dc5b72f581425872eb0a655d97428cdd83
