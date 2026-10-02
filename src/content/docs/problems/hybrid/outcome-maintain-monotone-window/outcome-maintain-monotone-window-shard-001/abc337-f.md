---
title: "ABC337-F — Usual Color Ball Problems"
draft: true
authoringUnit: {"problemId":"abc337-f","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc337-f.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window"],"sourceRevisionIds":["source-abc337-editorial-9141-81f4d2d348ba4cbf459d3850ba9989780768d7db4d1e7d35eb72fa69791fc173","source-abc337-f-problem-ec424f4b73083b657b5d99a1d85b37a7a9d1f374d95d031eb7849c2641b84eaa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"window内の色c個数をcnt_cとすると、そこまでのchance ball数はceil(cnt_c/K)である。先着M個のchance ballが使うbox数を決めるため、最小r with Σ_c ceil(cnt_c/K)≥Mを取り、色cの収納ball数はmin(ceil(cnt_c/K)K,g_c)となる。 開始位置を進めると必要な右端は単調非減少で、各ballを定数回追加削除して全rotationをO(N)で処理できる。","sourceRevisionIds":["source-abc337-editorial-9141-81f4d2d348ba4cbf459d3850ba9989780768d7db4d1e7d35eb72fa69791fc173","source-abc337-f-problem-ec424f4b73083b657b5d99a1d85b37a7a9d1f374d95d031eb7849c2641b84eaa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-monotone-window"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"K=2、色総数g_a=3,g_b=2、window cnt_a=3,cnt_b=1。","procedure":["chance数はceil(3/2)+ceil(1/2)=3。","収納数はmin(4,3)+min(2,2)=5。"],"executionTarget":null,"expectedResult":"このwindowのchance3、収納5。","verificationStatus":"not_applicable","learningUnitIds":["unit-two-pointers-window"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-monotone-window"],"prerequisiteIds":[],"attainmentCondition":"cnt_aを2へ減らすと収納も一つだけ減るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"chanceが2→1となりa収納は3→2。差は1だが色総数によりKとの差は一定でないのでmin式で更新する。"},"answer":{"reasoningOrVerification":"chanceが2→1となりa収納は3→2。差は1だが色総数によりKとの差は一定でないのでmin式で更新する。","procedure":["具体例の各状態・寄与を再計算する。","chanceが2→1となりa収納は3→2。差は1だが色総数によりKとの差は一定でないのでmin式で更新する。"],"expectedResult":"chanceが2→1となりa収納は3→2。差は1だが色総数によりKとの差は一定でないのでmin式で更新する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

rotation rはCを二つ連結した列C'の長さN window [l,l+N)として扱える。ある色では処理順の1,K+1,2K+1,…個目だけが新しい空箱を要求する「chance ball」になる。

採用する候補: M個目のchance ballまでの最小window端をtwo pointersで追い、答えを差分維持する

開始位置を進めると必要な右端は単調非減少で、各ballを定数回追加削除して全rotationをO(N)で処理できる。

棄却する候補: 各rotationを先頭からsimulationする

一回O(N)でN回必要となりO(N^2)になる。

window内の色c個数をcnt_cとすると、そこまでのchance ball数はceil(cnt_c/K)である。先着M個のchance ballが使うbox数を決めるため、最小r with Σ_c ceil(cnt_c/K)≥Mを取り、色cの収納ball数はmin(ceil(cnt_c/K)K,g_c)となる。

C'を作り、色別総数g、現在window count cnt、chance総数S、収納総数Vを持つ。各左端lで、長さN以内かつS<Mの間右端を進め、色cのceil(cnt/K)変化に応じSとmin(ceil(cnt/K)K,g_c)を差分更新する。Vを答えに記録後、左端ballを同様に削除する。

## 典型の発動条件

### circular列の二重化

発動条件: 全cyclic shiftを同じ線形window処理へ統一したい。

列を二つ連結し、開始l=0,…,N-1の長さN区間として表す。

### two pointersと集約値の差分更新

発動条件: 条件S(l,r)≥Mの最小rがlに対して単調で、要素追加削除が一色だけを変える。

右端を戻さず進め、ceil(cnt/K)と収納数の変化だけをglobal値へ反映する。

## 問題固有の要素

boxを開く可能性があるのは各色でK個ごとのblock先頭だけなので、複雑なsmallest box番号のsimulationは全色chance ballの到着順へ置き換えられる。

別の問題へ持ち帰る視点: 容量付き同種groupingでは、新容器を要求する周期的な要素だけをeventとして抽出する。

## 正当性

window内の色c個数をcnt_cとすると、そこまでのchance ball数はceil(cnt_c/K)である。先着M個のchance ballが使うbox数を決めるため、最小r with Σ_c ceil(cnt_c/K)≥Mを取り、色cの収納ball数はmin(ceil(cnt_c/K)K,g_c)となる。 開始位置を進めると必要な右端は単調非減少で、各ballを定数回追加削除して全rotationをO(N)で処理できる。

## 実装上の注意

- M個目のchance ballが長さN内に存在しない場合は右端をl+Nまでに止める。cntがKの倍数を跨ぐ追加・削除時だけceil値が変わることを丁寧に実装する。

## 復習の核

- Mが十分大きく全ballが入る場合、K=1、一色だけ、M個目がwindow末尾、左端削除でchance数が減る例を愚直simulationと比較する。

## 計算量と制約

### 時間

O(N)、円環二周とchance総数の単調window。

### 空間

O(N)、色頻度と二周列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \leq N \leq 2 \times 10^5; 1 \leq M, K \leq N; 1 \leq C_i \leq N

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

K=2、色総数g_a=3,g_b=2、window cnt_a=3,cnt_b=1。

1. chance数はceil(3/2)+ceil(1/2)=3。
2. 収納数はmin(4,3)+min(2,2)=5。

期待される結果: このwindowのchance3、収納5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

cnt_aを2へ減らすと収納も一つだけ減るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

chanceが2→1となりa収納は3→2。差は1だが色総数によりKとの差は一定でないのでmin式で更新する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/editorial/9141) — source-abc337-editorial-9141-81f4d2d348ba4cbf459d3850ba9989780768d7db4d1e7d35eb72fa69791fc173
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/tasks/abc337_f) — source-abc337-f-problem-ec424f4b73083b657b5d99a1d85b37a7a9d1f374d95d031eb7849c2641b84eaa
