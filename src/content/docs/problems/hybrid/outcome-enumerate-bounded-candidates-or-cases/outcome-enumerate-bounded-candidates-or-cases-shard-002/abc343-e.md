---
title: "ABC343-E — 7x7x7"
draft: true
authoringUnit: {"problemId":"abc343-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc343-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-inclusion-exclusion"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-geometry-orientation-transform","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e","source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"軸平行cubeの交差体積は、各軸の区間交差長の積で正確に求まる。上の有界配置に解が必ず含まれるため、全6座標の列挙は可能な解を落とさない。またPでは三重領域を3回数え、Tでは1回数えるので、V2=P−3Tとなり、総cube体積からV1も復元できる。列挙で条件を満たした候補は指定された各領域体積を持つため、探索の成功・失敗は解の存在と一致する。","sourceRevisionIds":["source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e","source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md) — 単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

平行移動で体積は変わらないので、一つのcubeをC1=(0,0,0)に固定する。重なりgraphが連結なら、三角形の場合は任意のcubeを、長さ2のpathの場合は中央のcubeをC1に選ぶ。残る二つはC1と重なるため、各軸の座標差は[-7,7]に入る。重なる一組と孤立した一個に分かれる場合は、重なる組の一方をC1にし、もう一方とのx差を見て孤立cubeを反対側のx=±7へ置く。これで既存の重なりを変えず、孤立cubeは両方から離れる。全て互いに離れているなら、x座標を−7,0,7として配置すれば全ての交差体積0を保つ。いずれも同じ三領域体積を持つ代表配置が各座標差[-7,7]にある。

よってC2,C3の6座標だけを[-7,7]で列挙する。各二個の共通体積の和をP、三個の共通体積をTとすると、三重領域V3=T、二重領域V2=P-3T、単独領域V1=3·7^3-2V2-3V3である。各候補の体積条件を調べる。

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

軸平行cubeの交差体積は、各軸の区間交差長の積で正確に求まる。上の有界配置に解が必ず含まれるため、全6座標の列挙は可能な解を落とさない。またPでは三重領域を3回数え、Tでは1回数えるので、V2=P−3Tとなり、総cube体積からV1も復元できる。列挙で条件を満たした候補は指定された各領域体積を持つため、探索の成功・失敗は解の存在と一致する。

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

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/tasks/abc343_e) — source-abc343-e-problem-f843540e135cdb6b25bd3346102dbd7b34b7409341f6ae65e0e8e50f9302d84e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/editorial/9435) — source-abc343-editorial-9435-ed07cc393d2136d295dda1792c5b598ae1d4ab773e7bb16fa9091f0a4dc62b03
