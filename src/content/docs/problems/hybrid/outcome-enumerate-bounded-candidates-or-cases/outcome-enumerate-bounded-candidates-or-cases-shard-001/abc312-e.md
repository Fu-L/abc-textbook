---
title: "ABC312-E — Tangency of Cuboids"
draft: true
authoringUnit: {"problemId":"abc312-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc312-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc312-e-problem-9e0049f07c73c21ea4269f199f2d74e3ab3bcc13ee7fe4ae923c890531a8d239","source-abc312-editorial-6838-166d3873dc17293a944a644e428df692fc57fb699b15243d02cb33c7cd219af8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"辺や点だけで触れる場合は六近傍の単位立方体対が存在せず、正面積の接触だけが自然に抽出される。 同じ直方体対が広い面で何度も現れるので、番号ペアを正規化して set/unique し、最後に両端の次数へ一度だけ加える。 座標上限が小さく、面積正という条件を単位面一枚の存在へ正確に離散化できる。","sourceRevisionIds":["source-abc312-e-problem-9e0049f07c73c21ea4269f199f2d74e3ab3bcc13ee7fe4ae923c890531a8d239","source-abc312-editorial-6838-166d3873dc17293a944a644e428df692fc57fb699b15243d02cb33c7cd219af8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

全座標が整数かつ 0..100 なので、空間を単位立方体へ離散化しても面接触の正面積を失わない。直方体同士は正体積で重ならないため各単位立方体の所有者は高々一つである。

二直方体が面積正で接することは、それぞれに属する単位立方体が六近傍で隣接することと同値になる。

採用する候補: 100³ の voxel に所有直方体番号を書き、隣接 voxel の異なる所有者ペアを列挙する。

棄却する候補: 全直方体対について、一軸の端面一致と残る二軸区間の正の重なりを調べる。

N=10^5 に対する N² 組は、各判定が定数時間でも処理できない。

各直方体 i の半開整数領域 [x1,x2)×[y1,y2)×[z1,z2) の voxel を owner=i で塗る。全 voxel から正方向三近傍を見て、所有者が異なり両方存在すれば min/max のペアを収集する。重複除去後、各ペアの両頂点を加算する。

## 典型の発動条件

### 小座標空間の voxel 化

発動条件: 幾何対象数は多いが座標範囲が小さく整数境界を持つとき。

連続空間を単位セル所有者配列へ変え、接触を隣接セルとして検査する。

## 問題固有の要素

「表面の共通部分が正面積」は単位立方体間の face adjacency にちょうど対応し、edge/corner 接触を追加判定なしで除ける。

別の問題へ持ち帰る視点: 離散幾何では、求める交差の次元に対応するセル隣接を選ぶと境界条件が簡潔になる。

## 正当性

辺や点だけで触れる場合は六近傍の単位立方体対が存在せず、正面積の接触だけが自然に抽出される。 同じ直方体対が広い面で何度も現れるので、番号ペアを正規化して set/unique し、最後に両端の次数へ一度だけ加える。 座標上限が小さく、面積正という条件を単位面一枚の存在へ正確に離散化できる。

## 実装上の注意

- 直方体を塗る loop は上端を含めない。配列外と未所有 voxel を接触相手に数えず、同一ペアは面積にかかわらず一回だけ数える。

## 復習の核

- 座標上限 100 を見たら N より空間側を全探索する発想を持つ。正面積・線分・一点の違いがどの近傍関係に対応するか確認する。

## 計算量と制約

### 時間

O(N+U³ log U)、座標上限U、voxel隣接pairをsort uniqueする上界。hash setなら期待O(N+U³)。

### 空間

O(U³+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq X_{i,1} < X_{i,2} \leq 100; 0 \leq Y_{i,1} < Y_{i,2} \leq 100; 0 \leq Z_{i,1} < Z_{i,2} \leq 100; Cuboids do not have an intersection with a positive volume.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/tasks/abc312_e) — source-abc312-e-problem-9e0049f07c73c21ea4269f199f2d74e3ab3bcc13ee7fe4ae923c890531a8d239
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/editorial/6838) — source-abc312-editorial-6838-166d3873dc17293a944a644e428df692fc57fb699b15243d02cb33c7cd219af8
