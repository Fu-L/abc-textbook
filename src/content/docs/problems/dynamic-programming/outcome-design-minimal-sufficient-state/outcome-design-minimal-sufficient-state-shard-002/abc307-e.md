---
title: "ABC307-E — Distinct Adjacent"
draft: true
authoringUnit: {"problemId":"abc307-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc307-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-normalization"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-state-normalization"],"sourceRevisionIds":["source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300","source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"先頭色を固定し、現在末尾が先頭と同色か別色かを集約する。対称性により各分類からの選択数はMだけで定まり、隣接異色条件を保って更新できる。最後に先頭と異色状態だけ取り、先頭色M通りを掛けると円環全彩色を一度ずつ数える。","sourceRevisionIds":["source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300","source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,M=3。","procedure":["先頭色を1に固定。","二人目は2か3、三人目は残る一色。","先頭3通りを掛ける。"],"executionTarget":null,"expectedResult":"6","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-normalization"],"attainmentCondition":"N=3,M=2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"奇数cycleを二色で彩色できないので0。末尾が先頭と異色で閉じる条件が必須。"},"answer":{"reasoningOrVerification":"奇数cycleを二色で彩色できないので0。末尾が先頭と異色で閉じる条件が必須。","procedure":["具体例の各状態・寄与を再計算する。","奇数cycleを二色で彩色できないので0。末尾が先頭と異色で閉じる条件が必須。"],"expectedResult":"奇数cycleを二色で彩色できないので0。末尾が先頭と異色で閉じる条件が必須。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

cycleを一箇所で切ってperson 1のcolorを固定すれば、linear DPの最後にperson Nのcolorがfirstと異なる状態だけを採用すればよい。 color labelsは対称なのでcurrent colorそのものではなく、first colorとsame/differentの二状態だけで遷移数を決められる。 previousがfirstとsameなら次はM−1通りすべてdifferent、previousがdifferentなら次をfirstにする1通りと別のdifferent color M−2通りに分かれる。 最後をdifferentに限定することが、切断したcycleのclosing edge (N,1) の不一致条件を復元する。

棄却する候補: last colorを0,…,M−1すべて持つDPをfirst colorごとに行う。

状態・初期color列挙がMに比例しN,M≤10^6では大きすぎる。

採用する候補: first colorを一つに固定し、same/differentの2-state DPをN人まで進めてdifferent countへMを掛ける。

対称性で全first colorsの答えが等しく、各positionを定数遷移で処理できる。

previousがfirstとsameなら次はM−1通りすべてdifferent、previousがdifferentなら次をfirstにする1通りと別のdifferent color M−2通りに分かれる。

最後をdifferentに限定することが、切断したcycleのclosing edge (N,1) の不一致条件を復元する。

cyclic coloringをanchor colorで切り開き、color symmetryでtwo-state linear DPへ圧縮する。

## 典型の発動条件

### cycle DPの一点固定

発動条件: 局所隣接制約がcycleで閉じ、linear scanではfirst stateとの整合だけが残るとき。

person 1を固定してscanし、終端でlast≠firstをfilterする。

### 対称性による状態同値化

発動条件: labelsの置換で問題が不変で、特定anchorとの関係だけが将来に影響するとき。

M colorsをsame-as-first/differentへまとめ、multiplicityをtransition係数にする。

## 問題固有の要素

固定first colorでsame=1,different=0から開始し、最後のdifferent ways×Mがlabel付き全coloringsである。

別の問題へ持ち帰る視点: 対称labelsは代表一つを固定し、orbit数ではなく代表caseの数へ選択肢数を掛ける。

## 正当性

先頭色を固定し、現在末尾が先頭と同色か別色かを集約する。対称性により各分類からの選択数はMだけで定まり、隣接異色条件を保って更新できる。最後に先頭と異色状態だけ取り、先頭色M通りを掛けると円環全彩色を一度ずつ数える。

## 実装上の注意

- M=2ではM−2 transitionが0になるが同じ式で処理でき、各stepでmoduloを取る。
- N=2でもclosing edgeとlinear edgeは同じpairを要求するだけなのでDP初期化・終端規約を変えない。

## 復習の核

- cycle上のlocal DPはanchorを固定し、最後にclosing constraintを適用する。
- 多数のlabel statesはanchorとの同値関係と選択肢multiplicityへ圧縮する。

## 計算量と制約

### 時間

人数N、色数M。anchor色固定の二状態 DP O(N)。

### 空間

同色/異色の二状態 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N,M \leq 10^6; N and M are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,M=3。

1. 先頭色を1に固定。
2. 二人目は2か3、三人目は残る一色。
3. 先頭3通りを掛ける。

期待される結果: 6

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=3,M=2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

奇数cycleを二色で彩色できないので0。末尾が先頭と異色で閉じる条件が必須。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/tasks/abc307_e) — source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/editorial/6643) — source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b
