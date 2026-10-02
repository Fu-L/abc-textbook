---
title: "ABC371-F — Takahashi in Narrow Road"
draft: true
authoringUnit: {"problemId":"abc371-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc371-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc371-editorial-10926-fcc33011042b86a27c41fe94fb7ae603c81ce7d0ec16740e8615064d8bde0526","source-abc371-f-problem-7c73fa17ad05c2bcfdd4dbe82c66272f01165812986e3aad79cacead3c2c3ae5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"X_i-i の変換は「隣り合う人は同じ地点に立てない」という 1 以上の差を、広義単調という扱いやすい不変量へ変える。 目標 G と現在値の間にある片側の人だけが同じ G へ代入され、費用は |区間和-G×区間長| になる。 単調性により影響範囲が一つの区間となり、移動量は区間和と目標値から求められるため各課題を対数時間で処理できる。","sourceRevisionIds":["source-abc371-editorial-10926-fcc33011042b86a27c41fe94fb7ae603c81ce7d0ec16740e8615064d8bde0526","source-abc371-f-problem-7c73fa17ad05c2bcfdd4dbe82c66272f01165812986e3aad79cacead3c2c3ae5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-range-update-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X=(1,3,4)、人T=2をG=5へ動かす。","procedure":["ずらした列X_i−iは(0,1,1)、目標はG−T=3。","人2,3を3へ代入し、元座標は(1,5,6)。"],"executionTarget":null,"expectedResult":"移動量2+2=4。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-actions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-range-update-action"],"prerequisiteIds":["unit-range-monoid-aggregation"],"attainmentCondition":"元目標G=5をずらした列へそのまま代入してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"人2の元座標が7になってしまう。添字を引いた目標G−T=3を使う。"},"answer":{"reasoningOrVerification":"人2の元座標が7になってしまう。添字を引いた目標G−T=3を使う。","procedure":["具体例の各状態・寄与を再計算する。","人2の元座標が7になってしまう。添字を引いた目標G−T=3を使う。"],"expectedResult":"人2の元座標が7になってしまう。添字を引いた目標G−T=3を使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

人は追い越せず座標は常に狭義増加する。X'_i=X_i-i とずらすと制約は広義単調へ変わり、一人を目標へ動かす際に押される人々は値が目標をまたぐ連続区間になる。

採用する候補: ずらした座標列を区間代入・区間和・区間最小最大を扱う遅延セグメント木で管理し、押される区間を二分探索して一括更新する。

単調性により影響範囲が一つの区間となり、移動量は区間和と目標値から求められるため各課題を対数時間で処理できる。

棄却する候補: 指定された人を一歩ずつ動かし、衝突するたび隣人も逐次押す。

一度の課題で Θ(N) 人が 10^8 歩動く場合があり、Q=2×10^5 に対して到底間に合わない。

X_i-i の変換は「隣り合う人は同じ地点に立てない」という 1 以上の差を、広義単調という扱いやすい不変量へ変える。

目標 G と現在値の間にある片側の人だけが同じ G へ代入され、費用は |区間和-G×区間長| になる。

X'_i=X_i-i を保持する。T の値と G-T のずれを同じ座標系へ直し、segment tree の max_right/min_left 等で値が G をまたぐ端を探し、区間和から費用を加算して区間全体を G に代入する。

## 典型の発動条件

### 制約を吸収する座標変換

発動条件: 順序を保つ点列で隣接差が少なくとも定数という制約があるとき。

index を引いて狭義単調列を広義単調列へ変換する。

### 単調列の区間代入

発動条件: 閾値をまたぐ連続範囲を同じ値へ揃え、区間コストも必要なとき。

遅延セグ木で境界探索・区間和・range assign をまとめて行う。

## 問題固有の要素

押し合いの物理過程を追わず、最終的に同じ座標へ潰れる単調列の区間として見る。

別の問題へ持ち帰る視点: 排他制約が index に比例する下駄なら、座標から index を引いて等値ブロックへ変える。

## 正当性

X_i-i の変換は「隣り合う人は同じ地点に立てない」という 1 以上の差を、広義単調という扱いやすい不変量へ変える。 目標 G と現在値の間にある片側の人だけが同じ G へ代入され、費用は |区間和-G×区間長| になる。 単調性により影響範囲が一つの区間となり、移動量は区間和と目標値から求められるため各課題を対数時間で処理できる。

## 実装上の注意

- 元座標 G と X'_T の比較では目標も G-T に変換する。左右で費用式の符号と探索方向が反転する点を分けて実装する。

## 復習の核

- X_i-i が単調になる理由と、影響範囲が連続区間になる証明を先に固め、左右ケースの境界を小例で照合する。

## 計算量と制約

### 時間

O(N+Q log N)、木上のmax_right/min_leftで端を探索。外側二分探索ならO(Q log²N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 0\leq X_1 < X_2 < \dotsb < X_N \leq10^8; 1\leq Q\leq2\times10^5; 1\leq T_i\leq N\ (1\leq i\leq Q); 0\leq G_i\leq10^8\ (1\leq i\leq Q); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X=(1,3,4)、人T=2をG=5へ動かす。

1. ずらした列X_i−iは(0,1,1)、目標はG−T=3。
2. 人2,3を3へ代入し、元座標は(1,5,6)。

期待される結果: 移動量2+2=4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

元目標G=5をずらした列へそのまま代入してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

人2の元座標が7になってしまう。添字を引いた目標G−T=3を使う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/editorial/10926) — source-abc371-editorial-10926-fcc33011042b86a27c41fe94fb7ae603c81ce7d0ec16740e8615064d8bde0526
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/tasks/abc371_f) — source-abc371-f-problem-7c73fa17ad05c2bcfdd4dbe82c66272f01165812986e3aad79cacead3c2c3ae5
