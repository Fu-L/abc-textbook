---
title: "ABC227-F — Treasure Hunting"
draft: true
authoringUnit: {"problemId":"abc227-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc227-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-grid-table-dp"],"sourceRevisionIds":["source-abc227-editorial-2914-87defb838bebcd1104697af5ba110c6f49f96bee04b0b32ee2bbe32e8f0ce6d8","source-abc227-f-problem-a9a41987be11c4be4182da98bcd5f68243f97b8b98b6fd3c30ed64e420e3e801"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Xが大きい方からK番目なら、Xより大きい値の個数はK未満で、X以上の値の個数はK以上である。したがって全ての>Xと必要個数の=Xを採用すれば、採用値は上位K個と一致する。 値がXのマスでは採用してkを1増やす遷移と、不採用のまま進む遷移の両方が必要である。片方だけにすると同値Xが複数ある経路で、ちょうどK個を選ぶ解を失う。 a>Xは採用、a<Xは不採用を強制し、a=Xだけ採用・不採用の両遷移を許せば、同値を含む上位K個をちょうど選んだ状態を局所遷移で表せる。","sourceRevisionIds":["source-abc227-editorial-2914-87defb838bebcd1104697af5ba110c6f49f96bee04b0b32ee2bbe32e8f0ce6d8","source-abc227-f-problem-a9a41987be11c4be4182da98bcd5f68243f97b8b98b6fd3c30ed64e420e3e801"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

先に読む単元:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md) — 状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

右・下だけの経路でも候補数は二項係数個あるため全経路は試せない。通常の経路DPは加法的なコストを扱えるが、今回は経路上の大きい方K個だけの和であり、そのままでは局所遷移に分解できない。

大きい方からK番目の値をXと固定すると、Xより大きい通過マスは全て採用し、Xと等しい通過マスから不足分を選んで、ちょうどK個の採用値和として評価できる。Xの候補は盤面に現れる値だけで十分である。

棄却する候補: 経路ごとに通過値を保持し、終点でsortして上位K個を求める。

単調経路の本数が指数的なうえ、通過値集合が同じマスへの履歴を合流させない。

採用する候補: 閾値Xを盤面の各値に固定し、X以上の値をちょうどk個採用した最小和をdp[k][i][j]で求める。

盤面の各A[p][q]をXとして、dp[k][i][j]を左上から(i,j)まででX以上の値をちょうどk個採用した採用値和の最小値とする。次の値aがXより大きければ採用だけ、小さければ不採用だけ、等しければ両方へ遷移する。始点も同じ規則で初期化し、全Xに対するdp[K][H-1][W-1]の最小を答える。

## 典型の発動条件

### K番目の値の有限候補列挙

発動条件: 集合や経路の最大側K個の和など、順位で選ばれる要素の総和を最適化するとき。

K番目の値Xは入力値のいずれかなので、盤面上の値を外側で全列挙し、各Xに対する最適経路を比較する。

### 閾値・採用個数付き単調grid DP

発動条件: 右・下の単調経路で、閾値以上からちょうどK個を選んだ最小和を求めるとき。

位置(i,j)に採用個数kを加え、値とXの大小に応じて採用・不採用を遷移する。境界a=Xでは両遷移を残す。

## 問題固有の要素

外側で試す閾値は任意の整数ではなく、K番目の値になり得る盤面上の値HW個に限ればよい。

別の問題へ持ち帰る視点: 順位に依存する目的関数を閾値化したら、最適値が変化する臨界点を入力値から列挙できないか調べる。

## 正当性

Xが大きい方からK番目なら、Xより大きい値の個数はK未満で、X以上の値の個数はK以上である。したがって全ての>Xと必要個数の=Xを採用すれば、採用値は上位K個と一致する。 値がXのマスでは採用してkを1増やす遷移と、不採用のまま進む遷移の両方が必要である。片方だけにすると同値Xが複数ある経路で、ちょうどK個を選ぶ解を失う。 a>Xは採用、a<Xは不採用を強制し、a=Xだけ採用・不採用の両遷移を許せば、同値を含む上位K個をちょうど選んだ状態を局所遷移で表せる。

## 実装上の注意

- 採用値和は32bitを超えるため64bit整数を使い、始点でもa>X、a<X、a=Xの同じ遷移規則を適用する。
- 各XのDPはO(HWK)、候補は高々HW個なので全体O(H^2W^2K)、メモリO(HWK)である。同値のXをuniqueにすれば同じDPの重複を省ける。

## 復習の核

- 「大きい方K個」が見えたら、K番目をXと固定したときに>Xを全採用し、=Xから何個選ぶべきかを小さいソート済み列で確認する。
- a=Xで採用・不採用の両遷移を実装し、終点で採用個数がちょうどKの状態だけを比較する。

## 計算量と制約

### 時間

O(H²W²K)、HW種類以下の閾値ごとにO(HWK) DP。

### 空間

O(HWK)、閾値一つ分のDP。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 30; 1 \leq K < H+W; 1 \leq A_{i,j} \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/editorial/2914) — source-abc227-editorial-2914-87defb838bebcd1104697af5ba110c6f49f96bee04b0b32ee2bbe32e8f0ce6d8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/tasks/abc227_f) — source-abc227-f-problem-a9a41987be11c4be4182da98bcd5f68243f97b8b98b6fd3c30ed64e420e3e801
