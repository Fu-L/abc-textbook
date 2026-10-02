---
title: "ABC396-F — Rotated Inversions"
draft: true
authoringUnit: {"problemId":"abc396-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc396-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc396-editorial-12374-589f6810ae5c3dccefb418c94eb6369993eca119b4162fd81606ab52afcc8acc","source-abc396-f-problem-3a6c95223afa7acf1d9704bfe06b07779541b9bba7a589f020d7a044c63c41ae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"wrap前はgroup値が最大側なので、その要素が左にあり他groupが右のpairはinversion、wrap後は最小側なので他groupが左・groupが右のpairがinversionになる。 sorted position y_rから左右の非group個数を数えれば、差分をgroup全体で重複なく足せる。 各indexはちょうど一回wrap groupとして処理され、group内positionから前後の他group要素数をO(group size)で合計でき、全体O(N log M+M)になる。","sourceRevisionIds":["source-abc396-editorial-12374-589f6810ae5c3dccefb418c94eb6369993eca119b4162fd81606ab52afcc8acc","source-abc396-f-problem-3a6c95223afa7acf1d9704bfe06b07779541b9bba7a589f020d7a044c63c41ae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(0,2,1),M=3。","procedure":["shift0の反転1。shift1は(1,0,2)で1。","shift2は(2,1,0)で3。"],"executionTarget":null,"expectedResult":"出力1,1,3。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-weighted-prefix-fenwick"],"attainmentCondition":"同じ値のwrap group内部で反転が変わるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同値はwrap後も同値なので変わらない。差分はgroupと他値の位置pairだけを数える。"},"answer":{"reasoningOrVerification":"同値はwrap後も同値なので変わらない。差分はgroupと他値の位置pairだけを数える。","procedure":["具体例の各状態・寄与を再計算する。","同値はwrap後も同値なので変わらない。差分はgroupと他値の位置pairだけを数える。"],"expectedResult":"同値はwrap後も同値なので変わらない。差分はgroupと他値の位置pairだけを数える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

kを1増やすと全値は通常+1され、旧値M-1の要素だけ0へwrapする。大小関係が変わるpairは、このwrap groupとそれ以外のpairだけである。

初期k=0のinversionを一度求めれば、各値groupの位置listからwrap時に失う/得るinversion数を線形総量で計算できる。

採用する候補: 初期inversionをFenwick treeで求め、値M-cのposition groupごとの差分でkをsweepする

各indexはちょうど一回wrap groupとして処理され、group内positionから前後の他group要素数をO(group size)で合計でき、全体O(N log M+M)になる。

棄却する候補: 各kについてB列を作り直してinversionをFenwickで数える

O(MN log M)でN,M≤2×10^5には間に合わない。

wrap前はgroup値が最大側なので、その要素が左にあり他groupが右のpairはinversion、wrap後は最小側なので他groupが左・groupが右のpairがinversionになる。

sorted position y_rから左右の非group個数を数えれば、差分をgroup全体で重複なく足せる。

Aの初期inversionをFenwickで計算しans[0]とする。c=1..M-1でvalue=M-cのsorted positionsを取り、wrap前寄与とwrap後寄与の差を現在値へ加えてans[c]を出す。

## 典型の発動条件

### cyclic shiftの差分更新

発動条件: 全値をmod Mで一様shiftし、順序統計を全shiftで求めるとき。

境界を跨ぐ一value groupだけのpair関係を更新する。

### position listによるcross pair counting

発動条件: 特定groupと補集合の前後pair数を数えたいとき。

各positionの左/右要素数から同group分を除く。

## 問題固有の要素

mod rotationは全要素を動かすように見えて、相対順序が変わるのはそのstepで0へ戻る値groupだけである。

別の問題へ持ち帰る視点: cyclic order上の一様shiftでは、cutを跨ぐbucketの寄与だけを差分する。

## 正当性

wrap前はgroup値が最大側なので、その要素が左にあり他groupが右のpairはinversion、wrap後は最小側なので他groupが左・groupが右のpairがinversionになる。 sorted position y_rから左右の非group個数を数えれば、差分をgroup全体で重複なく足せる。 各indexはちょうど一回wrap groupとして処理され、group内positionから前後の他group要素数をO(group size)で合計でき、全体O(N log M+M)になる。

## 実装上の注意

- 同値pairはinversionにならないのでgroup内部を除外する。空groupのstepもanswerをそのまま引き継ぎ、値とcの対応M-cを確認する。

## 復習の核

- N,M≤8で全kのBを直接作り、duplicate値、空value group、全同値、M=1を比較する。

## 計算量と制約

### 時間

O(N log M+M)、初期反転Fenwickと各値group wrap差分総走査N。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M \le 2\times 10^5; 0 \le A_i < M; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(0,2,1),M=3。

1. shift0の反転1。shift1は(1,0,2)で1。
2. shift2は(2,1,0)で3。

期待される結果: 出力1,1,3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ値のwrap group内部で反転が変わるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同値はwrap後も同値なので変わらない。差分はgroupと他値の位置pairだけを数える。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/editorial/12374) — source-abc396-editorial-12374-589f6810ae5c3dccefb418c94eb6369993eca119b4162fd81606ab52afcc8acc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/tasks/abc396_f) — source-abc396-f-problem-3a6c95223afa7acf1d9704bfe06b07779541b9bba7a589f020d7a044c63c41ae
