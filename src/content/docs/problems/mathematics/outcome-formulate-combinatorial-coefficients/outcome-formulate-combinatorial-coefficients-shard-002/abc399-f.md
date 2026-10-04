---
title: "ABC399-F — Range Power Sum"
draft: true
authoringUnit: {"problemId":"abc399-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc399-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc399-editorial-12565-ac7bdd56e7a6029aea5c663268764b44c2861728cd3012c8cc1c7a307f0c81b2","source-abc399-f-problem-be71505c4e59264a9a1fda8b56d3ce83ca6da99f0247fd672909cc1a7daf40c7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"位置iを右端とする区間は、左端iの新しい区間と、右端i−1の区間を一箱伸ばしたものに一意に分かれる。Dはこの二種類を重複なく含む。未使用K−k枚からp枚を選んで各labelのballを選ぶ係数はC(K−k,p)A_i^pであり、p=0を含めて新箱への全割当を一度数える。帰納的にdp_i[K]は右端iの全非空区間のK乗和になるため、全iで合計すると要求する値が得られる。","sourceRevisionIds":["source-abc399-editorial-12565-ac7bdd56e7a6029aea5c663268764b44c2861728cd3012c8cc1c7a307f0c81b2","source-abc399-f-problem-be71505c4e59264a9a1fda8b56d3ce83ca6da99f0247fd672909cc1a7daf40c7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

区間和のK乗は、区間内のA_i個のballから区別されたK枚のlabelをそれぞれ選んで貼る方法数と解釈できる。一つのballへ複数枚貼ってよい。この解釈なら、区間を固定してから全割当を調べる代わりに、区間の左右境界とlabel割当を一緒に左から決められる。

二仕切りDPの中央段階だけを残す。位置iまで処理したdp_i[k]を「右端がiの非空区間に、K枚中k枚を貼り付けた場合の数」とする。どのk枚かの選び方も含む。初期dp_0[k]=0。箱iを処理する前にD[k]=dp_{i−1}[k]+[k=0]とする。追加の1は左端iから新しい区間を始める候補であり、既存候補は区間を一箱伸ばす候補である。

新箱へp枚貼る係数は C(K−k,p)A_i^p。従って別の零配列へ

dp_i[k+p]+=D[k]C(K−k,p)A_i^p （0≤k≤K、0≤p≤K−k）

と更新する。p=0も必須である。これは箱を区間に含めるが一枚も貼らない場合で、独立したskipを重ねて二度数えてはいけない。例えばA=(1,1),K=1では単項区間1+1と二箱区間2の総和4になる。二箱区間のlabelはどちらの箱へ貼ってもよいので、先に貼って最後の箱でp=0にする経路も必要。

各iでdp_i[K]を答えへ加える。これで右端を固定した全区間のK乗和になる。A_i^0=1なのでA_i=0の箱も区間境界として正しく数える。K≥1のためballが全て0の区間は寄与0で、空区間は生成しない。

全O(N²)区間を直接評価する方法はN=2×10^5で遅いが、kとpは高々10なのでこの集約はO(NK²)になる。二項係数はPascalの漸化式で前計算し、各A_iの冪は箱ごとに作って破棄する。

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

位置iを右端とする区間は、左端iの新しい区間と、右端i−1の区間を一箱伸ばしたものに一意に分かれる。Dはこの二種類を重複なく含む。未使用K−k枚からp枚を選んで各labelのballを選ぶ係数はC(K−k,p)A_i^pであり、p=0を含めて新箱への全割当を一度数える。帰納的にdp_i[K]は右端iの全非空区間のK乗和になるため、全iで合計すると要求する値が得られる。

## 実装上の注意

- 初期dpは全0。各箱の更新前にdp[0]へ新しい左端候補1を加える。
- p=0を含む遷移だけでskipも数える。別のskip更新をさらに加えない。更新先は別配列にする。
- 二項係数はO(K²)、冪は各箱につきO(K)で作り、全N箱分の冪を保持しない。

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
