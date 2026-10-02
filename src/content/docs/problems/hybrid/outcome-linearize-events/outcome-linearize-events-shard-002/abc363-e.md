---
title: "ABC363-E — Sinking Land"
draft: true
authoringUnit: {"problemId":"abc363-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc363-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep"],"sourceRevisionIds":["source-abc363-e-problem-5c1cd2b6791656de944ce3c4d0c033f141306ce329dc5b745ef599446b586900","source-abc363-editorial-10482-adabf182c02241c331f157b781a3142d6592aad70f48fd468d17ba6e9c67d5ec"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"外周cellは時刻0に海へ接したとみなし、A≤Yならbucket Aへ入れる。visitedは沈没時でなく初回登録時に立てて重複投入を防ぐ。 年kに沈むcellの隣がA≤kなら同じbucket kの末尾へ入るため、一年内のflood fillも通常queue処理に含まれる。 各cellを海へ接した最初の一度だけ登録し、その年までの沈没数を逐次集計できる。","sourceRevisionIds":["source-abc363-e-problem-5c1cd2b6791656de944ce3c4d0c033f141306ce329dc5b745ef599446b586900","source-abc363-editorial-10482-adabf182c02241c331f157b781a3142d6592aad70f48fd468d17ba6e9c67d5ec"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-events"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3×3の外周高さ2、中央高さ1、Y=2。","procedure":["年1は外周が海を遮り9マス残る。","年2に外周が沈み中央高さ1も同年のqueueへ追加される。"],"executionTarget":null,"expectedResult":"残数9,0。","verificationStatus":"not_applicable","learningUnitIds":["unit-event-sweep"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-events"],"prerequisiteIds":[],"attainmentCondition":"中央を標高1だけで年1に沈めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"海への接続が必要なので不可。沈没年は経路上の最大高さで決まり、隣から登録時max(現在年,A)を取る。"},"answer":{"reasoningOrVerification":"海への接続が必要なので不可。沈没年は経路上の最大高さで決まり、隣から登録時max(現在年,A)を取る。","procedure":["具体例の各状態・寄与を再計算する。","海への接続が必要なので不可。沈没年は経路上の最大高さで決まり、隣から登録時max(現在年,A)を取る。"],"expectedResult":"海への接続が必要なので不可。沈没年は経路上の最大高さで決まり、隣から登録時max(現在年,A)を取る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

区画は海へ接するまでは沈まず、年kに初めて海へ接したならmax(k,A_{i,j})年に沈む。沈没時刻は隣接区画の沈没から一方向に伝播する。

標高と年Yが整数で上限も小さいため、沈没予定年ごとのbucketを用意できる。同じ年のbucketへ追加された低地もその年中に連鎖して沈む。

採用する候補: 外周を初期海岸として、沈没年bucketを1..Yの順に処理し、新たに接した隣接区画を予定年へ登録する。

各cellを海へ接した最初の一度だけ登録し、その年までの沈没数を逐次集計できる。

棄却する候補: 各年ごとに全gridを走査し、海に接する高さ以下の区画がなくなるまで更新する。

地形が一列ずつ沈む場合に同じcellを年ごと・連鎖段階ごとに繰り返し調べる。

外周cellは時刻0に海へ接したとみなし、A≤Yならbucket Aへ入れる。visitedは沈没時でなく初回登録時に立てて重複投入を防ぐ。

年kに沈むcellの隣がA≤kなら同じbucket kの末尾へ入るため、一年内のflood fillも通常queue処理に含まれる。

remaining=HWとし、外周の未登録cellを標高bucketへ入れる。k=1..Yでbucket[k]をqueueとして最後まで処理し、cellを沈めてremainingを減らす。未登録の四近傍はyear=max(k,A)がY以下ならそのbucketへ登録する。各年処理後のremainingを出力する。

## 典型の発動条件

### 時刻bucket付きflood fill

発動条件: event時刻が小整数で、到達により将来eventが一度だけ発生するとき。

priority queueの代わりに年別queueを昇順処理する。

### 境界からの浸水伝播

発動条件: 外部と連結した低い領域だけが閾値に応じて有効化されるgrid問題。

外周をsourceとし、到達時刻とcell固有閾値のmaxを次時刻にする。

## 問題固有の要素

単にA≤kのcellを消すのではなく、海への連結性が満たされた時刻とのmaxが実際の沈没年になる。

別の問題へ持ち帰る視点: 閾値と到達性が組み合わさる過程では、event時刻をmax(arrival,threshold)で伝播する。

## 正当性

外周cellは時刻0に海へ接したとみなし、A≤Yならbucket Aへ入れる。visitedは沈没時でなく初回登録時に立てて重複投入を防ぐ。 年kに沈むcellの隣がA≤kなら同じbucket kの末尾へ入るため、一年内のflood fillも通常queue処理に含まれる。 各cellを海へ接した最初の一度だけ登録し、その年までの沈没数を逐次集計できる。

## 実装上の注意

- 四隅を外周四辺から重複登録しない。A>Yのcellもvisited扱いをどうするか統一し、同年bucketの動的追加を最後まで処理する。

## 復習の核

- 低い盆地が高い外壁の沈没年に同時連鎖する例を追う。visitedを「海へ接した」時点にする理由とbucketへの登録年をセットで検証する。

## 計算量と制約

### 時間

O(HW+Y)、各cell一回登録・沈没、Y年のbucket。

### 空間

O(HW+Y)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W \leq 1000; 1 \leq Y \leq 10^5; 1 \leq A_{i,j} \leq 10^5; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3×3の外周高さ2、中央高さ1、Y=2。

1. 年1は外周が海を遮り9マス残る。
2. 年2に外周が沈み中央高さ1も同年のqueueへ追加される。

期待される結果: 残数9,0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

中央を標高1だけで年1に沈めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

海への接続が必要なので不可。沈没年は経路上の最大高さで決まり、隣から登録時max(現在年,A)を取る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/tasks/abc363_e) — source-abc363-e-problem-5c1cd2b6791656de944ce3c4d0c033f141306ce329dc5b745ef599446b586900
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/editorial/10482) — source-abc363-editorial-10482-adabf182c02241c331f157b781a3142d6592aad70f48fd468d17ba6e9c67d5ec
