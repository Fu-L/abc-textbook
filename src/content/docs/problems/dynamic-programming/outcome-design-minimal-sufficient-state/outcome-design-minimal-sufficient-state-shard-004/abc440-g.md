---
title: "ABC440-G — Haunted House"
draft: true
authoringUnit: {"problemId":"abc440-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc440-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-dsu-components"],"sourceRevisionIds":["source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92","source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同階成分内は自由に往復でき全重みを回収して任意出口へ行けるので一頂点縮約は等価。梯子なしは上向きDAGのpath。唯一の梯子は特定の上成分uと下成分vだけを結び、繰り返しても新成分を増やさないため、一度の下降へ整理できる。vからuへ戻るならu重みを再加算せず、別上成分wへ出るならuとwを別々に数える。開始下成分への再訪も同様にID一致で除く。公式の境界状態dvと二種dpはこの上昇・下降・再上昇の全形を網羅し、同じ成分以外には過去重みとの重複がない。候補除外は一致ID一つだけなので異ID上位二件が十分。","sourceRevisionIds":["source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92","source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"F=2,H=1,W=3、下階\"2#3\"、上階\"111\"、開始(1,1,1)。","procedure":["下左成分重み2から上成分重み3へ上がる。","上右端に梯子を置き、下右成分重み3へ降りる。","全非壁セルのコイン2+3+3=8を回収し総量上界を達成。"],"executionTarget":null,"expectedResult":"8","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"上階から下左へ降りて同じ上階へ戻ると上の3枚を再加算するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"しない。上成分IDが一致し一度回収済みである。境界遷移のID検査がこの二重計上を防ぐ。"},"answer":{"reasoningOrVerification":"しない。上成分IDが一致し一度回収済みである。境界遷移のID検査がこの二重計上を防ぐ。","procedure":["具体例の各状態・寄与を再計算する。","しない。上成分IDが一致し一度回収済みである。境界遷移のID検査がこの二重計上を防ぐ。"],"expectedResult":"しない。上成分IDが一致し一度回収済みである。境界遷移のID検査がこの二重計上を防ぐ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

同じ階の空きマスからなる連結成分内では、往復を許して全コインを回収し、任意の階間接続位置まで移動できる。そこで各成分を重み付き頂点へ縮約し、隣接階で同じ座標に空きマスがある成分間だけを結ぶ。 梯子がなければ階間移動は上向きだけなので、縮約後のグラフは階番号に沿う DAG になる。同じ梯子を何度通っても新しい成分は増えないため、最適経路は上向き区間、梯子による一段下降、再び上向き区間へ整理できる。 上階の成分 u から梯子で下階の成分 v へ降り、v から上階の成分 w へ戻るとき、u=w なら u のコインは既に数えているが、u≠w なら u の成分重みを別に加えられる。この一致判定だけが接続先の履歴として残る。 dp_1 を梯子なしの最適値、dp_0 をこれより下で梯子を使う最適値とし、階境界では dv_0 と dv_1 に接続先成分を一つだけ添えると、将来に必要な履歴を過不足なく表せる。 ある下階成分 v から u 以外へ上る dv_0 の最大値は、接続先 ID 付きで保持した全候補の一位または二位のどちらかに必ず含まれる。 梯子を置くことと実際に下向きへ通ることは別なので、各状態では梯子を使う迂回だけでなく、そのまま上へ進む梯子なしの経路も候補に残す必要がある。

採用する候補: 各階を連結成分へ縮約し、梯子をまだ使わない経路、使わないまま特定の上階成分へ出る経路、特定の成分から梯子で戻る経路を層状 DP で管理する。接続先を一つ除く最大値は上位二候補から選ぶ。

全マスを繰り返し探索せず、梯子一本が作る唯一の下向き遷移と再合流先の一致だけを状態に残して、全問い合わせの答えを前計算できる。

棄却する候補: 各問い合わせについて梯子を置く全空きマスを試し、その都度到達可能なマスをグラフ探索する。

空きマス数は最大 250 万、問い合わせ数は 10^5 であり、梯子候補と探索を問い合わせごとに列挙する余地はない。

棄却する候補: 下階成分 v に接する上階成分 u,w の全組を列挙し、下降後にどの成分へ上り直すかをそのまま遷移表へ持つ。

一つの成分が多数の上階成分に接すると次数の二乗個の組が生じ、縮約後の辺数に比例する計算量を保てない。

dp_1 を梯子なしの最適値、dp_0 をこれより下で梯子を使う最適値とし、階境界では dv_0 と dv_1 に接続先成分を一つだけ添えると、将来に必要な履歴を過不足なく表せる。

ある下階成分 v から u 以外へ上る dv_0 の最大値は、接続先 ID 付きで保持した全候補の一位または二位のどちらかに必ず含まれる。

梯子を置くことと実際に下向きへ通ることは別なので、各状態では梯子を使う迂回だけでなく、そのまま上へ進む梯子なしの経路も候補に残す必要がある。

各階を BFS で連結成分分解し、成分重みと隣接階への重複なしの辺を作る。上層側の値が確定する順に dp_1、dp_0 と階境界状態 dv_0、dv_1 を計算する。dv_1[f+1][u][v] では v から上る先 w について、w=u なら dv_0 をそのまま、w≠u なら既訪問の u の重みを加えるため、接続先 ID 付き上位二件から u を除外して最大を取る。同じ上位二件の集約を次の dp 遷移にも用い、各開始成分の答えを前計算する。

## 典型の発動条件

### 連結成分縮約

発動条件: 同一領域内は自由に往復して報酬をすべて回収でき、領域外との接続関係だけが以後の選択を左右する場合。

各階の四近傍連結成分を一頂点にまとめ、数字の総和を頂点重み、上下階で接する関係を辺として扱う。

### 一回だけ逆向き辺を使う層状グラフ DP

発動条件: 本来は単調に層を進む DAG に、一度だけ利用できる逆向き遷移を自由な場所へ追加できる場合。

梯子の未使用・使用済みと階境界の出入口を状態にし、一段下降を挟む経路を上下の単調経路から合成する。

### 除外最大値の上位二件保持

発動条件: 候補集合から指定された ID と同じ候補だけを除外して最大値を求める処理が、多数の遷移で繰り返される場合。

dv の値と接続先成分 ID の上位二件を保持し、一位の ID が除外対象なら二位、異なるなら一位を使う。

## 問題固有の要素

梯子一本が作る非単調性は任意の巡回ではなく、上階成分を出て一段下り、同じ階へ戻る迂回に限られる。

別の問題へ持ち帰る視点: 単調な層状グラフへ逆向き辺を一度だけ加える問題では、迂回の二端点が同一かどうかを状態に残すと二重計上を制御できる。

## 正当性

同階成分内は自由に往復でき全重みを回収して任意出口へ行けるので一頂点縮約は等価。梯子なしは上向きDAGのpath。唯一の梯子は特定の上成分uと下成分vだけを結び、繰り返しても新成分を増やさないため、一度の下降へ整理できる。vからuへ戻るならu重みを再加算せず、別上成分wへ出るならuとwを別々に数える。開始下成分への再訪も同様にID一致で除く。公式の境界状態dvと二種dpはこの上昇・下降・再上昇の全形を網羅し、同じ成分以外には過去重みとの重複がない。候補除外は一致ID一つだけなので異ID上位二件が十分。

## 実装上の注意

- 階間辺を成分単位で重複排除し、最大候補の遷移先 ID も保持して自己除外を判定する。
- 上位二件は値が同じでも接続先 ID を区別して更新し、一位が除外対象のときに同じ ID を二位として再利用しない。
- 成分番号と各マスの対応を全階で保持し、コイン総和と DP 値は 64 bit 整数、到達不能状態は十分小さい番兵で管理する。

## 復習の核

- 三つの階を描き、開始から上昇、梯子で下降、再上昇する経路を dp_0、dp_1、dv_0、dv_1 の各定義へ対応させ、どの時点で成分重みを数えたかを確認する。
- 下降元と再上昇先が同じ場合と異なる場合、候補が一件しかない場合、上階へ進めない場合を別々に試し、上位二件による除外と二重計上防止を検査する。

## 計算量と制約

### 時間

元セル V=FHW、縮約頂点 C≤V、階間distinct辺 E≤(F−1)HW。BFS縮約O(V)、辺sort重複除去O(Vlog V)、ID付き上位二件を走査保持すればDP O(C+E)、Q回答O(Q)。

### 空間

マス→成分、graph、境界dpで O(V+C+E+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: F,H,W are integers.; 1 \leq F \leq 10; 1 \leq H,W \leq 500; S_{k,i,j} is either a digit (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) or #. (1 \leq k \leq F, 1 \leq i \leq H, 1 \leq j \leq W); Q is an integer.; 1 \leq Q \leq 10^5; G_i, A_i, B_i are integers. (1 \leq i \leq Q); 1 \leq G_i \leq F (1 \leq i \leq Q); 1 \leq A_i \leq H (1 \leq i \leq Q); 1 \leq B_i \leq W (1 \leq i \leq Q); S_{G_i, A_i, B_i} is not #. (1 \leq i \leq Q)

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

F=2,H=1,W=3、下階"2#3"、上階"111"、開始(1,1,1)。

1. 下左成分重み2から上成分重み3へ上がる。
2. 上右端に梯子を置き、下右成分重み3へ降りる。
3. 全非壁セルのコイン2+3+3=8を回収し総量上界を達成。

期待される結果: 8

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

上階から下左へ降りて同じ上階へ戻ると上の3枚を再加算するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

しない。上成分IDが一致し一度回収済みである。境界遷移のID検査がこの二重計上を防ぐ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/editorial/15033) — source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/tasks/abc440_g) — source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2
