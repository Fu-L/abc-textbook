---
title: "ABC343-E — 7x7x7"
draft: true
authoringUnit: {"problemId":"abc343-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc343-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-inclusion-exclusion"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-geometry-orientation-transform","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e","source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"pair intersection総和Pとtriple intersection Tに対し、exactly-three v3=T、exactly-two v2=P-3Tである。cube体積総和3·7^3=v1+2v2+3v3なのでv1も一意に復元できる。 候補は15^6程度で、各候補のpair/triple交差体積を定数時間で計算できる。","sourceRevisionIds":["source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e","source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三cubeの左下は(0,0,0),(7,0,0),(14,0,0)、辺長7。","procedure":["面接触だけなのでpair交差体積0。","各cube単独体積343。"],"executionTarget":null,"expectedResult":"v1=1029,v2=0,v3=0。","verificationStatus":"not_applicable","learningUnitIds":["unit-bounded-enumeration"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"prerequisiteIds":["unit-geometry-primitives","unit-inclusion-exclusion"],"attainmentCondition":"三cubeを同じ位置へ置いたらpair和からv2を直接読むか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"pair和1029は三重領域を3回含む。T=343なのでv2=1029−3·343=0、v3=343。"},"answer":{"reasoningOrVerification":"pair和1029は三重領域を3回含む。T=343なのでv2=1029−3·343=0、v3=343。","procedure":["具体例の各状態・寄与を再計算する。","pair和1029は三重領域を3回含む。T=343なのでv2=1029−3·343=0、v3=343。"],"expectedResult":"pair和1029は三重領域を3回含む。T=343なのでv2=1029−3·343=0、v3=343。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

volumeは三cubeの絶対位置でなく相対位置だけに依存するのでC1を(0,0,0)へ固定できる。さらに解があるならC2,C3をC1と接するまで平行移動でき、各座標差を[-7,7]に制限した解が存在する。

採用する候補: C1を固定しC2,C3の6座標を[-7,7]で全探索する

候補は15^6程度で、各候補のpair/triple交差体積を定数時間で計算できる。

棄却する候補: 9座標を問題の全範囲[-100,100]で探索する

平行移動対称性を使わない探索空間は201^9で到底列挙できない。

pair intersection総和Pとtriple intersection Tに対し、exactly-three v3=T、exactly-two v2=P-3Tである。cube体積総和3·7^3=v1+2v2+3v3なのでv1も一意に復元できる。

C1=(0,0,0)としa2,b2,c2,a3,b3,c3を-7…7でloopする。各axisのoverlap長max(0,min(right)-max(left))を掛けて三pair交差とtriple交差を求め、v3,v2,v1を式で計算する。一致した座標をYesと出し、なければNo。

## 典型の発動条件

### 平行移動対称性の固定

発動条件: 配置問題の目的が物体間の相対位置だけで決まる。

一つのcubeを原点へ固定し、接触まで平行移動できることから残る6座標を[-7,7]へ界して15^6候補を全列挙する。

### 包除的なexact coverage集計

発動条件: pair/triple intersectionからexactly k個に覆われるvolumeを求めたい。

多重に数えたtriple領域の係数を補正し、体積総和式でv1を得る。

## 問題固有の要素

side lengthが7の軸平行cube同士のintersectionも軸平行直方体なので、3D体積は各axisのinterval overlap長の積へ完全分離する。

別の問題へ持ち帰る視点: 直積形状の交差量は各次元の一次元overlapを独立計算して掛ける。

## 正当性

pair intersection総和Pとtriple intersection Tに対し、exactly-three v3=T、exactly-two v2=P-3Tである。cube体積総和3·7^3=v1+2v2+3v3なのでv1も一意に復元できる。 候補は15^6程度で、各候補のpair/triple交差体積を定数時間で計算できる。

## 実装上の注意

- 境界で接するだけならoverlap長0であり候補範囲には±7を含める。v2=P-3v3、v1=1029-2v2-3v3の係数を混同しない。

## 復習の核

- 三cube一致、全てdisjoint、pairだけoverlap、triple overlapありを手計算し、出力座標からvolumeを再検算する。

## 計算量と制約

### 時間

O(15⁶)、各候補のintersectionはO(1)。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0 \leq V_1, V_2, V_3 \leq 3 \times 7^3; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三cubeの左下は(0,0,0),(7,0,0),(14,0,0)、辺長7。

1. 面接触だけなのでpair交差体積0。
2. 各cube単独体積343。

期待される結果: v1=1029,v2=0,v3=0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

三cubeを同じ位置へ置いたらpair和からv2を直接読むか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

pair和1029は三重領域を3回含む。T=343なのでv2=1029−3·343=0、v3=343。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/tasks/abc343_e) — source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/editorial/9435) — source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03
