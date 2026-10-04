---
title: "ABC353-G — Merchant Takahashi"
draft: true
authoringUnit: {"problemId":"abc353-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc353-g.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-range-monoid-aggregation"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc353-editorial-9953-f3db4ee0df25fb831f574792b92372e265b660413ed4ac07be4539c9edd92c39","source-abc353-g-problem-d66edb45169b1c02e0addf9b9acac4c0fce56c3facc4a96126555450b48c12f5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dp[j] は現在までの市場を選び、最後に町 j にいる最大利益。次の参加市場 t に移る費用は C|j−t| なので、任意の最適経路はこの遷移に分解される。不参加は旧値保存で表す。絶対値を j≤t と j≥t に分けた二式は全 j を覆い、二本の区間最大で元の最大と完全に一致する。時刻順帰納法により全 dp が正しい。","sourceRevisionIds":["source-abc353-editorial-9953-f3db4ee0df25fb831f574792b92372e265b660413ed4ac07be4539c9edd92c39","source-abc353-g-problem-d66edb45169b1c02e0addf9b9acac4c0fce56c3facc4a96126555450b48c12f5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

市場の時刻順は固定なので、dp[j] を最後に参加した市場が町 j の最大利益としてオンライン更新できる。次の市場 t の候補は max_j(dp[j]−C|j−t|)+P である。 絶対値を j<t と j≥t で分けると、左側は max(dp[j]+Cj)−Ct、右側は max(dp[j]−Cj)+Ct になり、区間最大値二本へ分離する。 市場へ参加しない遷移は既存 dp を保持することに相当し、新値は dp[t] へ assignment でなく chmax する。 初期位置1の利益0を dp[1]=0 と置けば、天文学的な初期所持金を値として保持する必要はない。

採用する候補: dp[j]±Cj を持つ二本のセグメント木で prefix/suffix max を取り、各市場で dp[t] を chmax 更新する。

一市場あたり二 query と二 update の O(log N) で、過去全市場からの最良遷移を取得できる。

棄却する候補: 各市場で過去に到達可能な全町 j を走査し、移動費を引いた最大を探す。

市場数・町数とも2×10^5で O(NM) になり、絶対値の線形式分解を使えていない。

市場へ参加しない遷移は既存 dp を保持することに相当し、新値は dp[t] へ assignment でなく chmax する。

初期位置1の利益0を dp[1]=0 と置けば、天文学的な初期所持金を値として保持する必要はない。

未到達 dp を −INF、dp[1]=0 とする。segPlus に dp[j]+Cj、segMinus に dp[j]−Cj を持つ。市場 (t,p) ごとに best=max(queryPlus[1,t]−Ct,queryMinus[t,N]+Ct)+p を求め、dp[t]=max(dp[t],best) として両 tree の t を更新する。最後に max_j dp[j] を答える。

## 典型の発動条件

### 絶対値 DP の二方向分解

発動条件: max/min に距離コスト c|i−j| が入り、位置順序が一次元のとき。

左右で符号を固定し dp[j]±cj の range extremum に変形する。

### 時系列イベントの一点 chmax

発動条件: イベントを選ぶ部分列 DP で、同じ状態位置へ複数時刻から更新が来るとき。

過去最良値を残しつつ今回参加値で chmax する。

## 問題固有の要素

移動途中で市場のない町へ止まる必要はなく、最後に参加した市場だけで状態が閉じる。

別の問題へ持ち帰る視点: 移動自由な時系列選択では、報酬イベント間を直接結んで中間位置を状態から消せるかを見る。

## 正当性

dp[j] は現在までの市場を選び、最後に町 j にいる最大利益。次の参加市場 t に移る費用は C|j−t| なので、任意の最適経路はこの遷移に分解される。不参加は旧値保存で表す。絶対値を j≤t と j≥t に分けた二式は全 j を覆い、二本の区間最大で元の最大と完全に一致する。時刻順帰納法により全 dp が正しい。

## 実装上の注意

- 未到達 −INF に Cj を加減して overflow しない sentinel を選ぶ。prefix/suffix の境界で t 自身をどちらかに含め、漏れを作らない。

## 復習の核

- 絶対値を外すときは j≤t と j≥t の式を別々に展開する。dp[t] の旧値を残す理由を「今回市場を選ばない」選択と対応させる。

## 計算量と制約

### 時間

町 N、市場 M。tree 初期化 O(N)、各市場に定数個の検索更新を行い O(N+M log N)。

### 空間

二本の segment tree と市場入力で O(N+M)、市場を逐次読むなら作業領域 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq C \leq 10^9; 1 \leq M \leq 2 \times 10^5; 1 \leq T_i \leq N (1 \leq i \leq M); 1 \leq P_i \leq 10^{13} (1 \leq i \leq M); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/editorial/9953) — source-abc353-editorial-9953-f3db4ee0df25fb831f574792b92372e265b660413ed4ac07be4539c9edd92c39
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/tasks/abc353_g) — source-abc353-g-problem-d66edb45169b1c02e0addf9b9acac4c0fce56c3facc4a96126555450b48c12f5
