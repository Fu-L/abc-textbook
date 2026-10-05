---
title: "ABC274-G — Security Camera 3"
draft: true
authoringUnit: {"problemId":"abc274-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc274-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-greedy-exchange"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc274-g-problem-140e49ac25d320fa39a242cd8243b701987b85ba37609883b437ff644d6c6f83","source-abc274-editorial-5024-3468e986ad327531b55ba8d7500752e4a96643d6ee228ed003de46b8384d21ee"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"cameraを同じ壁区切りrunの端へ寄せるとそのrun全体を監視でき不利にならない。各空cellは水平runと垂直runの辺で、そのどちらかを選ぶ必要がある。全監視は二部vertex coverと同値、König定理で最大matching数が最小camera数。","sourceRevisionIds":["source-abc274-g-problem-140e49ac25d320fa39a242cd8243b701987b85ba37609883b437ff644d6c6f83","source-abc274-editorial-5024-3468e986ad327531b55ba8d7500752e4a96643d6ee228ed003de46b8384d21ee"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

up-facing cameraは同じvertical obstacle-delimited runのtopへ移してdown-facingにでき、left-facingもrunのleft端へ移したright-facing cameraで置換できる。各empty cellは一つのmaximal vertical runと一つのmaximal horizontal runのintersectionで、そのcellを監視するには二runsの少なくとも一方へcameraを置けばよい。bipartite graphではKőnigの定理によりminimum vertex cover sizeがmaximum matching sizeに等しい。source→vertical run、vertical→horizontal cell edge、horizontal→sinkのflow networkでも、unit capacitiesとinfinite constraint edgesにより同じminimum cutを表せる。

棄却する候補: 各empty cellで四方向cameraの設置有無を列挙する。

Boolean choicesがgrid sizeに対して指数的で、同じrunを覆うcameraも重複する。

採用する候補: vertical runsとhorizontal runsをbipartite verticesにし、各empty cellを両run間のedgeとしてminimum vertex coverを求める。

camera一台がrun vertex一つの選択に一致し、全cells監視条件が全edgesをcoverする条件と一致する。

## 典型の発動条件

### 支配関係による配置の正規化

発動条件: ある設置位置・方向を別のものへ移してもcoverageが減らないとき。

cameraを各vertical runのtopでdown向き、各horizontal runのleft端でright向きに限定する。

### 二部graphのminimum vertex cover

発動条件: 各requirementがleft choiceまたはright choiceの少なくとも一方を要求するとき。

runsを二部vertices、empty cellsをedgesにし、maximum matching/flowのsizeを求める。

## 問題固有の要素

同じrun内ではcanonical camera一台が全cellsを覆うため、camera candidateをcell数ではなくrun数へ集約できる。

別の問題へ持ち帰る視点: grid visibility問題はobstaclesで区切られたmaximal segmentsをobjectsにし、cellをsegment intersectionsとしてmodel化する。

## 正当性

cameraを同じ壁区切りrunの端へ寄せるとそのrun全体を監視でき不利にならない。各空cellは水平runと垂直runの辺で、そのどちらかを選ぶ必要がある。全監視は二部vertex coverと同値、König定理で最大matching数が最小camera数。

## 実装上の注意

- row/column scanで各empty cellへhorizontal/vertical run IDを付け、cellごとに対応edgeを一つ追加する。
- flow定式化ではcamera cost edgeをcapacity 1、coverage violation edgeを全camera数より大きいinfinityにする。

## 復習の核

- visibility placementはcoverageを広げる端点へcameraを寄せ、支配される方向・位置を候補から除く。
- 各cellが縦optionか横optionの二択でcoverされるなら、runsのbipartite vertex coverを疑う。

## 計算量と制約

### 時間

H×W、空cell数C。run二部graph V=O(C),E=C。Hopcroft–Karp O(C√C)＋走査O(HW)。

### 空間

run対応と二部辺 O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 300; S_{i,j} is . or #.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/tasks/abc274_g) — source-abc274-g-problem-140e49ac25d320fa39a242cd8243b701987b85ba37609883b437ff644d6c6f83
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/editorial/5024) — source-abc274-editorial-5024-3468e986ad327531b55ba8d7500752e4a96643d6ee228ed003de46b8384d21ee
