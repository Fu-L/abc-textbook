---
title: "ABC399-F — Range Power Sum"
draft: true
authoringUnit: {"problemId":"abc399-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc399-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc399-editorial-12565-ac7bdd56e7a6029aea5c663268764b44c2861728cd3012c8cc1c7a307f0c81b2","source-abc399-f-problem-be71505c4e59264a9a1fda8b56d3ce83ca6da99f0247fd672909cc1a7daf40c7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間和のK乗は区間内ballへK個の区別labelを独立に置く総数。左/右仕切りのstageは区間を一意に表し、新箱へp label置く遷移C(K−k,p)A_i^pは未使用label選択とball選択そのもの。全labelを貼り終えたstage2の重みは全非空区間のK乗和を一度ずつ数える。","sourceRevisionIds":["source-abc399-editorial-12565-ac7bdd56e7a6029aea5c663268764b44c2861728cd3012c8cc1c7a307f0c81b2","source-abc399-f-problem-be71505c4e59264a9a1fda8b56d3ce83ca6da99f0247fd672909cc1a7daf40c7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

区間和のK乗は、区間内のA_i個のballから区別されたK枚のlabelをそれぞれ選んで貼る方法数と解釈できる。

区間[l,r]の選択は列の二箇所へ仕切りを置くことなので、左から箱を走査しながら仕切り段階0/1/2と貼付済label数だけを持てる。

採用する候補: 二仕切りの状態と貼ったlabel数を持つ組合せDPを行う

中央段階の箱でp枚の未使用labelを選ぶ係数C(K-k,p)A_i^pを遷移すれば、全区間・全label割当を重複なくO(NK²)で数えられる。

棄却する候補: 全O(N²)区間のsumをprefix sumで求めてK乗する

一区間O(1)でも区間数が二次でN=2×10^5には間に合わない。

K枚のlabelは区別され、一つのballへ複数枚貼れるため、箱iへ新たにp枚貼る方法がC(K-k,p)A_i^pになる。

二つの仕切りは区別しないが左から入れる順序が固定されるので、stage0→1→2で各区間を一度だけ表す。

combinationとA_i^pを前計算し、dp[stage][k]をrollingする。各箱でskip、stageを進める仕切り、stage1なら未貼付labelからp≥1枚をその箱へ貼る遷移を行い、全箱後のstage2,k=Kを答える。

## 典型の発動条件

### powerのlabelled selection解釈

発動条件: (Σw_i)^Kを要素選択DPへ展開したいとき。

K個の区別された選択を箱へ分配する。

### delimiter DP

発動条件: 全連続区間を二境界の選択として一括集計するとき。

走査中の仕切り個数をstateにする。

## 問題固有の要素

数式の二項展開を直接更新するのでなく、K乗をlabel付きball選択として実体化するとbinomial係数を伴う局所遷移が自然に出る。

別の問題へ持ち帰る視点: 小さい指数の全区間power sumは、labelled marksと開始/終了automatonのDPを検討する。

## 正当性

区間和のK乗は区間内ballへK個の区別labelを独立に置く総数。左/右仕切りのstageは区間を一意に表し、新箱へp label置く遷移C(K−k,p)A_i^pは未使用label選択とball選択そのもの。全labelを貼り終えたstage2の重みは全非空区間のK乗和を一度ずつ数える。

## 実装上の注意

- 空区間を数えない仕切り位置規約を揃え、p=0はskip遷移と二重countしない。全演算をmod 998244353で行う。

## 復習の核

- N≤6,K≤4で全区間を直接計算し、A_i=0、長さ1区間、複数labelが同じ箱へ付く寄与を比較する。

## 計算量と制約

### 時間

O(NK²)。stageと既貼付label数のrolling DP。

### 空間

O(K²+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq K \leq 10; 0 \leq A_i < 998244353; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/editorial/12565) — source-abc399-editorial-12565-ac7bdd56e7a6029aea5c663268764b44c2861728cd3012c8cc1c7a307f0c81b2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/tasks/abc399_f) — source-abc399-f-problem-be71505c4e59264a9a1fda8b56d3ce83ca6da99f0247fd672909cc1a7daf40c7
