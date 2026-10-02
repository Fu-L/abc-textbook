---
title: "ABC233-E — Σ[k=0..10^100]floor(X／10^k)"
draft: true
authoringUnit: {"problemId":"abc233-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc233-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc233-e-problem-4b2430767539052419622c48e465c8e788614454093f49946380e131efd70dbf","source-abc233-editorial-3174-f511e377e70185f224c2b295bf37b6c1df96d12c3b62c48d035d70e1e7f8c060"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各シフト後の数を生成するのでなく、筆算の同じ列に現れる元の数字をまとめると、その合計は prefix 桁和になる。 各入力桁を桁和から一度引くだけで全列の寄与を更新でき、巨大整数を文字列の一走査で処理できる。","sourceRevisionIds":["source-abc233-e-problem-4b2430767539052419622c48e465c8e788614454093f49946380e131efd70dbf","source-abc233-editorial-3174-f511e377e70185f224c2b295bf37b6c1df96d12c3b62c48d035d70e1e7f8c060"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X=123。","procedure":["要求和は123+12+1=136。","右から桁和6で6、次3で3、次1で1を出す。"],"executionTarget":null,"expectedResult":"出力136。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":[],"attainmentCondition":"各切り捨て整数をbigintへ生成する必要はあるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"各桁列の寄与をprefix digit sumへまとめられるので不要。長さLの文字走査で済む。"},"answer":{"reasoningOrVerification":"各桁列の寄与をprefix digit sumへまとめられるので不要。長さLの文字走査で済む。","procedure":["具体例の各状態・寄与を再計算する。","各桁列の寄与をprefix digit sumへまとめられるので不要。長さLの文字走査で済む。"],"expectedResult":"各桁列の寄与をprefix digit sumへまとめられるので不要。長さLの文字走査で済む。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

X は最大 50 万桁なので整数型に収まらず、10^k で割った正の項も X の桁数個だけ存在する。

floor(X/10^k) を右揃えで縦に足すと、答えの右から t 桁目へは X の先頭から対応位置までの全桁が一度ずつ寄与する。

棄却する候補: 各 k について X の末尾を一桁削った文字列を作り、巨大整数の加算を繰り返す。

桁数個の項をそれぞれ桁数に比例して加えるため、50 万桁の二乗規模になる。

採用する候補: 現在列へ寄与する X の prefix 桁和と繰り上がりを持ち、下位桁から答えを一桁ずつ確定する。

各入力桁を桁和から一度引くだけで全列の寄与を更新でき、巨大整数を文字列の一走査で処理できる。

各シフト後の数を生成するのでなく、筆算の同じ列に現れる元の数字をまとめると、その合計は prefix 桁和になる。

巨大な切り捨て除算和を縦書き加算へ変換し、右端から prefix digit sum と carry を更新する文字列上の筆算アルゴリズムで出力する。

## 典型の発動条件

### 巨大整数の桁別集約

発動条件: 非常に長い十進整数に対する多数の桁シフト和を正確な整数として出力するとき。

同じ出力桁へ寄与する入力桁を先に合計し、通常の carry だけを下位から上位へ送る。

## 問題固有の要素

上限 k＝10^100 は巨大だが、k が X の桁数以上なら項は全て 0 なので反復回数には影響しない。

別の問題へ持ち帰る視点: 和の添字上限が巨大でも、各項が恒等的に 0 になる実効的な打切り位置を対象のサイズから探す。

## 正当性

各シフト後の数を生成するのでなく、筆算の同じ列に現れる元の数字をまとめると、その合計は prefix 桁和になる。 各入力桁を桁和から一度引くだけで全列の寄与を更新でき、巨大整数を文字列の一走査で処理できる。

## 実装上の注意

- s を全桁和、carry を 0 で始め、各桁で carry に s を足して一桁出力した後、処理した右端桁を s から引く。
- 全入力桁を処理後も carry が 0 になるまで上位桁を出し、逆順に蓄えた出力を最後に反転する。

## 復習の核

- 巨大な floor(X/10^k) の列は個別計算せず、右揃えの筆算図を書いて同じ列に現れる桁を観察する。

## 計算量と制約

### 時間

O(L)、Lは入力数字長、右からprefix桁和とcarry。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: X is an integer.; 1 \le X < 10^{500000}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X=123。

1. 要求和は123+12+1=136。
2. 右から桁和6で6、次3で3、次1で1を出す。

期待される結果: 出力136。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

各切り捨て整数をbigintへ生成する必要はあるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各桁列の寄与をprefix digit sumへまとめられるので不要。長さLの文字走査で済む。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/tasks/abc233_e) — source-abc233-e-problem-4b2430767539052419622c48e465c8e788614454093f49946380e131efd70dbf
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/editorial/3174) — source-abc233-editorial-3174-f511e377e70185f224c2b295bf37b6c1df96d12c3b62c48d035d70e1e7f8c060
