---
title: "ABC461-E — E-liter"
draft: true
authoringUnit: {"problemId":"abc461-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc461-e.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc461-e-problem-cc659356b0d8f91d82016ffea49a6a7eea2831e6cd5d4bb4827537050dda17ed","source-abc461-editorial-21023-e0b0dbc3096edcd6e7f7335a89b21a22cdd23803811fb37e22c4452a2d2e73e2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"列Cに新しいtype2が来たら旧latest時刻の1を0、新時刻を1にして、distinct列を一つだけ表す。 行Rの初回type1では増加数をNとし、列Cのtype2ではcolLast[C]以後に最新type1を持つdistinct行数を減少数とする。 latest event代表により時刻区間内に一度でも現れたdistinct列数がFenwick sumと一致し、行ごとのlast時刻で必要区間を定められる。","sourceRevisionIds":["source-abc461-e-problem-cc659356b0d8f91d82016ffea49a6a7eea2831e6cd5d4bb4827537050dda17ed","source-abc461-editorial-21023-e0b0dbc3096edcd6e7f7335a89b21a22cdd23803811fb37e22c4452a2d2e73e2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、row1黒、col1白、col1白、row1黒。","procedure":["黒数2→1、同じcol1再白は変化0。","最後のrow1は白化されたdistinct列1だけを再黒化。"],"executionTarget":null,"expectedResult":"黒数2,1,1,2。","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-prefix-fenwick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"prerequisiteIds":["unit-prefix-aggregate"],"attainmentCondition":"col1の二つの白化時刻を両方残すと何が起きるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"最後のrow1で同じ列を二度加算し3と誤る。latest markerだけを一個保持する。"},"answer":{"reasoningOrVerification":"最後のrow1で同じ列を二度加算し3と誤る。latest markerだけを一個保持する。","procedure":["具体例の各状態・寄与を再計算する。","最後のrow1で同じ列を二度加算し3と誤る。latest markerだけを一個保持する。"],"expectedResult":"最後のrow1で同じ列を二度加算し3と誤る。latest markerだけを一個保持する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

行を初めて黒塗りすると全Nマスが増え、二回目以降に増えるのは前回操作後に一度以上白塗りされた列数である。同じ列への複数操作は最後の時刻一つだけ数えればよい。

採用する候補: query時刻軸のFenwick treeに各列の最新type2時刻だけ1を置き、行Rの前回type1時刻以後の1数をrange sumして黒数を更新する。行列を入れ替えた対称構造も同時に持つ。

latest event代表により時刻区間内に一度でも現れたdistinct列数がFenwick sumと一致し、行ごとのlast時刻で必要区間を定められる。

棄却する候補: N×N盤面の各cell色を保持し、行・列操作ごとにNマスを塗り替える。

N,Qが大きく一query O(N)、盤面memory O(N^2) は不可能である。

列Cに新しいtype2が来たら旧latest時刻の1を0、新時刻を1にして、distinct列を一つだけ表す。

行Rの初回type1では増加数をNとし、列Cのtype2ではcolLast[C]以後に最新type1を持つdistinct行数を減少数とする。

列latest type2を表すBITと行latest type1を表すBIT、rowLast・colLastを用意する。type1はrowLast=0ならN、そうでなければそれ以後の列latest数を加える。type2はcolLast以後の行latest数を引き、自typeのlatest markerを更新する。

## 典型の発動条件

### 最新出現時刻のFenwick管理

発動条件: 前回時刻以後に現れたdistinct key数をonlineで問いたいとき。

各keyのlatest位置だけ1にして時刻区間和を取る。

### 行列操作の対称処理

発動条件: row全体とcolumn全体への上書きが交互に来るとき。

二方向に同じlast-event構造を持ち黒数差分だけ更新する。

## 問題固有の要素

上書き後の差分はcell状態ではなく、対象行/列の前回時刻より新しい反対方向operationのdistinct数で決まる。

別の問題へ持ち帰る視点: 『区間内に一度以上現れた値』はofflineでなくてもlatest位置indicatorのrange sumで数えられる。

## 正当性

列Cに新しいtype2が来たら旧latest時刻の1を0、新時刻を1にして、distinct列を一つだけ表す。 行Rの初回type1では増加数をNとし、列Cのtype2ではcolLast[C]以後に最新type1を持つdistinct行数を減少数とする。 latest event代表により時刻区間内に一度でも現れたdistinct列数がFenwick sumと一致し、行ごとのlast時刻で必要区間を定められる。

## 実装上の注意

- 初回操作の番兵時刻0と初期色を正しく式へ入れ、BIT更新で旧latestを必ず消す。黒数はN^2までなので64 bitを使う。

## 復習の核

- 同じ列を複数回白塗りした後に一行を黒塗りする例で、latest markerだけがdistinct列数を表すことを確認する。

## 計算量と制約

### 時間

O(Q log Q)、N×N盤面を時刻latest代表で処理。

### 空間

O(Q)、触れた行列のlastと二BIT。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 3 \times 10^5; For type 1 queries, 1 \leq R \leq N.; For type 2 queries, 1 \leq C \leq N.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、row1黒、col1白、col1白、row1黒。

1. 黒数2→1、同じcol1再白は変化0。
2. 最後のrow1は白化されたdistinct列1だけを再黒化。

期待される結果: 黒数2,1,1,2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

col1の二つの白化時刻を両方残すと何が起きるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

最後のrow1で同じ列を二度加算し3と誤る。latest markerだけを一個保持する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/tasks/abc461_e) — source-abc461-e-problem-cc659356b0d8f91d82016ffea49a6a7eea2831e6cd5d4bb4827537050dda17ed
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/editorial/21023) — source-abc461-editorial-21023-e0b0dbc3096edcd6e7f7335a89b21a22cdd23803811fb37e22c4452a2d2e73e2
