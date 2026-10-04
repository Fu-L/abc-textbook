---
title: "ABC307-E — Distinct Adjacent"
draft: true
authoringUnit: {"problemId":"abc307-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc307-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-normalization"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-state-normalization"],"sourceRevisionIds":["source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300","source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"先頭色を固定し、現在末尾が先頭と同色か別色かを集約する。対称性により各分類からの選択数はMだけで定まり、隣接異色条件を保って更新できる。最後に先頭と異色状態だけ取り、先頭色M通りを掛けると円環全彩色を一度ずつ数える。","sourceRevisionIds":["source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300","source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md) — 対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。

この解説で扱わないこと:

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

first color を固定した初期値は same=1,different=0。各次の人で old値から same'=different、different'=(M−1)same+(M−2)different と更新する。N−1回後の答えは M·different（法998244353）。N=2 では M(M−1)、M=2 では N の偶数時2・奇数時0となり、cycleの閉じる辺まで数えていることを確認できる。

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

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/tasks/abc307_e) — source-abc307-e-problem-548289d5e47b4369203d1b5cd71609b25ca976c547a62835b66cbaa68f430300
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/editorial/6643) — source-abc307-editorial-6643-5e6128eb82addb9c1ef4eee51ce74721ecfe920047167e2febf7bd2d172c9d4b
