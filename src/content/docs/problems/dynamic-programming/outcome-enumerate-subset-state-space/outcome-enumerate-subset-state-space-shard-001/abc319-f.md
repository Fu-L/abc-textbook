---
title: "ABC319-F — Fighter Takahashi"
draft: true
authoringUnit: {"problemId":"abc319-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc319-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-greedy-exchange-order","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc319-editorial-7116-380646a87755c3ff5eaefcc4bb046f4f0fc57791263dcf79be0fa8e78ad8570f","source-abc319-f-problem-c1208d3efebd2340b03da6c8fb0d0d67c5187c463518323e09a9d0c1bf8c1349"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"薬の使用済maskを固定した時、到達可能で倒せる敵を先に倒すことはstrengthを減らさず、未使用薬の選択肢を失わせないので安全である。threshold順に敵を倒す固定点が、そのmask・strengthで追加薬なしに到達できる最大状態となる。同maskで強い状態は弱い状態の討伐と到達を全て再現できるため、最大strengthの一状態だけを残せる。次に使える薬を全て試すmask DPは非可換な倍率の全順序を含み、各遷移の敵closureは安全なので、全敵を倒せる状態の存在がYesと同値である。","sourceRevisionIds":["source-abc319-editorial-7116-380646a87755c3ff5eaefcc4bb046f4f0fc57791263dcf79be0fa8e78ad8570f","source-abc319-f-problem-c1208d3efebd2340b03da6c8fb0d0d67c5187c463518323e09a9d0c1bf8c1349"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md) — 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

現在到達できて必要strength以下のenemyは、将来倒す予定なら今倒してもstrengthが増えるだけで不利益がなく、常に即座に倒してよい。

従って選択が必要なのはmedicineを飲む順序だけであり、その個数P≤10をbitmaskで列挙できる。

同じmedicine集合を飲んだ状態では、greedyに倒せるenemyを尽くした後のstrengthが大きい状態が、それ以後の全選択を支配する。

採用する候補: dp[mask]をそのmedicine集合後にgreedy closureした最大strengthとし、最後に飲むmedicineを選ぶbitmask DP。

最大10個だけの非可換な乗算順を列挙し、最大500個のenemyは各遷移内で単調に処理できる。

棄却する候補: 現在倒せるenemyと到達可能medicineの全選択順をDFSする。

enemyまで分岐させるとN個の順列的探索になるが、enemyは前倒し可能で分岐不要である。

棄却する候補: medicineをg_iの大きい順に飲む。

medicineへ到達するまでのenemy thresholdとtree上の依存があり、倍率だけの順序では実行可能性を保証できない。

enemyをthreshold s_i順の候補構造で管理し、strengthが増えるたび条件を満たすreachable enemyを取り出してgainを加える操作を固定点まで続ける。

未使用medicineはそのvertex以降のbranchを塞ぐ選択肢として扱い、現在のgreedy closureから到達できるmedicineだけを次maskへ追加する。

同maskでより大きいstrengthが得られたら、低い状態で倒せたenemyと到達できたmedicineも再現できるため、最大値だけ残せる。

medicineへ0..P-1のbitを付け、dp[0]をstrength 1からmedicineを跨がず倒せるenemyをすべて倒したclosureで初期化する。各reachable maskについて未使用medicine iを候補にし、そのvertexが現在の探索済み領域から到達可能ならstrengthをg_i倍してiを追加する。predecessorの到達・討伐状態を引き継ぎ、threshold以下のreachable enemyをpriority queue等で繰り返し倒して新しいclosureを作り、dp[next]を最大化する。全medicine maskを処理後、全enemyを倒した状態があればYes。

## 典型の発動条件

### 少数特殊頂点のbitmask DP

発動条件: 大きいgraph/treeの中で、順序選択が必要な特殊操作だけが10個程度のとき。

medicine集合をmaskにし、enemy処理を各遷移のdeterministic closureへ押し込む。

### 安全操作のgreedy closure

発動条件: 実行可能な操作が目的を損なわずresourceを単調増加させるとき。

倒せるenemyを選択肢にせず、なくなるまで即時処理する。

### threshold priority queue

発動条件: 到達済み候補のうちresource以下のthresholdだけを順に処理するとき。

最小s_iのenemyから取り出し、gain後にさらに候補を解禁する。

## 問題固有の要素

加算enemyは前倒しして常に有利だが、乗算medicineは加算の前後で結果が変わるため、前者をclosure、後者だけをDP分岐として明確に分離する。

別の問題へ持ち帰る視点: 操作が単調でも交換可能性が異なる場合、安全に前倒しできる操作を飽和させ、順序依存する少数操作だけを状態化する。

## 正当性

薬の使用済maskを固定した時、到達可能で倒せる敵を先に倒すことはstrengthを減らさず、未使用薬の選択肢を失わせないので安全である。threshold順に敵を倒す固定点が、そのmask・strengthで追加薬なしに到達できる最大状態となる。同maskで強い状態は弱い状態の討伐と到達を全て再現できるため、最大strengthの一状態だけを残せる。次に使える薬を全て試すmask DPは非可換な倍率の全順序を含み、各遷移の敵closureは安全なので、全敵を倒せる状態の存在がYesと同値である。

## 実装上の注意

- 同maskを更新した最大strengthに対応する討伐済み・frontier状態を一緒に保持または再simulationし、enemy gainを二重加算しない。
- strengthはmedicine積で64bitを超え得るため、最大enemy thresholdを十分上回る値でcapし、乗算前にoverflowを防ぐ。
- medicine自身へ至るparent側pathが未突破なら、そのbitを遷移候補にしない。

## 復習の核

- medicine前に倒せるenemy、medicineが塞ぐ子branch、倍率後に別branchのenemyが解禁される例を作り、mask遷移でfrontierとstrengthが同期するか確認する。

## 計算量と制約

### 時間

O(2ᴾPN log N)、P≤10薬数、各薬遷移後に最大N頂点のenemy closure。

### 空間

O(2ᴾN)、maskごとの到達状態とheap。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 500; 1\leq p _ i\lt i\ (2\leq i\leq N); t _ i\in\lbrace1,2\rbrace\ (2\leq i\leq N); t _ i=1\implies1\leq s _ i\leq 10 ^ 9\ (2\leq i\leq N); t _ i=2\implies s _ i=0\ (2\leq i\leq N); 1\leq g _ i\leq 10 ^ 9\ (2\leq i\leq N); There are at most 10 vertices with t _ i=2.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc319/editorial/7116) — source-abc319-editorial-7116-380646a87755c3ff5eaefcc4bb046f4f0fc57791263dcf79be0fa8e78ad8570f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc319/tasks/abc319_f) — source-abc319-f-problem-c1208d3efebd2340b03da6c8fb0d0d67c5187c463518323e09a9d0c1bf8c1349
