---
title: "ABC401-G — Push Simultaneously"
draft: true
authoringUnit: {"problemId":"abc401-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc401-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-monotone-search"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc401-editorial-12694-4393607042e8a5fd2f5d8f605b8d6bd21eac9a4a925eb9d71d35a35c25ff976d","source-abc401-g-problem-3ee52766c3365ab2c6a7ab22ab404db98fc8e2635fee97fc4bc2083abb71a823"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"全員のbutton到着時間をT以下にする割当は距離≤T辺のperfect matchingと同値。Tを増やすと辺が増え可否単調なので二分探索の最小feasible閾値が最小最大到着時間。","sourceRevisionIds":["source-abc401-editorial-12694-4393607042e8a5fd2f5d8f605b8d6bd21eac9a4a925eb9d71d35a35c25ff976d","source-abc401-g-problem-3ee52766c3365ab2c6a7ab22ab404db98fc8e2635fee97fc4bc2083abb71a823"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

全員がbuttonへ到着後留まれば同時押下できるため、時間tで可能かはperson-button距離≤tのedgeだけの二部graphにperfect matchingがあるかに等しい。最適bottleneck値はN²個の距離のどれかで、feasibilityはtについて単調である。速度上限1ではt秒以内に到達可能な必要十分条件がEuclidean distance≤tで、trajectory間の干渉はない。候補距離をsortして離散binary searchすれば閾値比較以外に誤差を増やさず、実数binary searchも許容誤差内で可能である。

採用する候補: 距離thresholdを二分探索し、各判定で二部最大matchingを求める

N≤300なのでedgeO(N²)のHopcroft–Karp/DinicをO(log precision)回行うO(N^{2.5}log N)で十分で、bottleneck assignmentを正確に判定できる。

棄却する候補: 各personを最寄りの未使用buttonへgreedy assignする

近いbuttonを誰に譲るべきかが全体Hall条件で決まり、局所最近選択はperfect matchingを失い得る。

全person-button距離をhypotで計算する。mid以下のpairへedgeを張ってmaximum bipartite matching size=Nか判定し、最小feasible thresholdをbinary searchして出力する。

## 典型の発動条件

### bottleneck assignment

発動条件: 一対一対応の最大costを最小化するとき。

cost threshold graphのperfect matching可否を判定する。

### Hall条件のalgorithmic判定

発動条件: 各left vertexの候補集合が重なりgreedyで決められないとき。

maximum bipartite matchingを使う。

## 問題固有の要素

同時性は移動経路のschedulingを生まず、各人が担当buttonへtまでに着けるというstatic bottleneck matchingへ完全に落ちる。

別の問題へ持ち帰る視点: 独立agentの同時到達最小時間は、threshold可到達graph上のassignmentとして考える。

## 正当性

全員のbutton到着時間をT以下にする割当は距離≤T辺のperfect matchingと同値。Tを増やすと辺が増え可否単調なので二分探索の最小feasible閾値が最小最大到着時間。

## 実装上の注意

- 座標差は符号付き広範囲なので浮動小数へ変換してhypotする。threshold等号を含め、matching graphを判定ごとに初期化する。

## 復習の核

- N≤7で全permutation assignmentの最大距離最小値と比較し、同距離tie、greedyが失敗する配置、巨大座標を確認する。

## 計算量と制約

### 時間

N人Nbutton。距離O(N²)、precision回数B。Hopcroft–Karpを各判定に使って O(BN^(5/2))。

### 空間

距離と判定二部graph O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 300; 0\leq\mathit{sx} _ i\leq10 ^ {18}\ (1\leq i\leq N); 0\leq\mathit{sy} _ i\leq10 ^ {18}\ (1\leq i\leq N); 0\leq\mathit{gx} _ i\leq10 ^ {18}\ (1\leq i\leq N); 0\leq\mathit{gy} _ i\leq10 ^ {18}\ (1\leq i\leq N); (\mathit{sx} _ i,\mathit{sy} _ i)\neq(\mathit{sx} _ j,\mathit{sy} _ j)\ (1\leq i\lt j\leq N); (\mathit{gx} _ i,\mathit{gy} _ i)\neq(\mathit{gx} _ j,\mathit{gy} _ j)\ (1\leq i\lt j\leq N); (\mathit{sx} _ i,\mathit{sy} _ i)\neq(\mathit{gx} _ j,\mathit{gy} _ j)\ (1\leq i\leq N,1\leq j\leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/editorial/12694) — source-abc401-editorial-12694-4393607042e8a5fd2f5d8f605b8d6bd21eac9a4a925eb9d71d35a35c25ff976d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/tasks/abc401_g) — source-abc401-g-problem-3ee52766c3365ab2c6a7ab22ab404db98fc8e2635fee97fc4bc2083abb71a823
