---
title: "ABC410-E — Battles in a Row"
draft: true
authoringUnit: {"problemId":"abc410-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc410-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc410-e-problem-09512e3fad866c3fca6c4920a703b97c609e72fbf2633d9801c0a9920c269219","source-abc410-editorial-13207-31c2b3aa0ee74e2d42158ed1cc19ab2115b53d6d4b1f68b14c06b208681d5fb5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同じ残魔力で体力が大きい状態は、以後の任意の戦い方を小さい体力状態以上に実行できる。よって最大体力以外を捨てても最適撃破数を失わない。次敵を物理か魔法で倒す二遷移は全選択を網羅し、層間更新で一敵を一回だけ消費する。到達層が空ならそれ以後のprefixも不可能であり、直前層が最大撃破数となる。","sourceRevisionIds":["source-abc410-e-problem-09512e3fad866c3fca6c4920a703b97c609e72fbf2633d9801c0a9920c269219","source-abc410-editorial-13207-31c2b3aa0ee74e2d42158ed1cc19ab2115b53d6d4b1f68b14c06b208681d5fb5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"H=5,M=3、敵(A,B)=(4,2),(3,2),(2,2)。","procedure":["一体目後は(体力1,魔力3)と(5,1)。","二体目後は(1,1)または(2,1)。","三体目は後者から物理で倒し(0,1)。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"体力を正の値に保つ必要はあるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ない。支払額とちょうど等しければ倒した後0で有効。-1の未到達とは区別する。"},"answer":{"reasoningOrVerification":"ない。支払額とちょうど等しければ倒した後0で有効。-1の未到達とは区別する。","procedure":["具体例の各状態・寄与を再計算する。","ない。支払額とちょうど等しければ倒した後0で有効。-1の未到達とは区別する。"],"expectedResult":"ない。支払額とちょうど等しければ倒した後0で有効。-1の未到達とは区別する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

i 体まで倒した後、同じ残り魔力 m なら残り体力が大きい状態が常に優越するため、二資源の全組を boolean 状態にせず各 m の最大体力だけ残せる。 モンスターは順番固定なので、i-1 体撃破後の状態から体力 A_i を払うか魔力 B_i を払うかの二遷移だけを考えればよい。 将来の行動条件は体力と魔力が各必要量以上かだけなので、魔力を固定したとき小さい体力の状態が大きい体力を上回ることはない。 i 層がすべて未到達になった最初のモンスター以後は進めないため、その直前の i-1 が答え。各層に到達状態があれば i を更新できる。

採用する候補: dp[m] を現在まで倒して残り魔力 m のときの最大残り体力とする一次元 frontier DP

各層で物理攻撃は同じ m へ hp-A_i、魔法攻撃は m-B_i へ hp を遷移する。同じ m の劣る hp を捨てても将来の可否に影響せず O(NM) になる。

棄却する候補: 倒した数・残り体力・残り魔力の全三次元 reachable DP

H,M,N が各3000で O(NHM) の状態を持てず、同じ魔力で最大体力だけ残せる支配関係を使っていない。

将来の行動条件は体力と魔力が各必要量以上かだけなので、魔力を固定したとき小さい体力の状態が大きい体力を上回ることはない。

i 層がすべて未到達になった最初のモンスター以後は進めないため、その直前の i-1 が答え。各層に到達状態があれば i を更新できる。

dp[M]=H、他を -1 で初期化する。各 (A_i,B_i) で next を -1 にし、dp[m]≥A_i なら next[m]をdp[m]-A_iで、m≥B_iならnext[m-B_i]をdp[m]で最大更新する。next が全 -1 なら直前の撃破数を出力し、最後まで到達すれば N。

## 典型の発動条件

### Pareto frontier の DP 圧縮

発動条件: 二資源状態で一方を固定すると他方の大きい値が常に優越するとき。

残り魔力ごとに最大体力だけを保持する。

### 層別 rolling DP

発動条件: 順番固定の選択を一段ずつ処理し、遷移が直前層だけに依存するとき。

current/next 配列を分けて同じモンスターを二度倒す in-place 更新を防ぐ。

## 問題固有の要素

体力と魔力を対称に全列挙せず、上限の小さい一資源を index、もう一資源を優越値にすると二次元 frontier が一次元になる。

別の問題へ持ち帰る視点: 複数消費資源の到達 DP では、固定した座標上で最大化できる残量が将来を完全に代表するか調べる。

## 正当性

同じ残魔力で体力が大きい状態は、以後の任意の戦い方を小さい体力状態以上に実行できる。よって最大体力以外を捨てても最適撃破数を失わない。次敵を物理か魔法で倒す二遷移は全選択を網羅し、層間更新で一敵を一回だけ消費する。到達層が空ならそれ以後のprefixも不可能であり、直前層が最大撃破数となる。

## 実装上の注意

- hp=A_i、m=B_i は使用可能で残量0になる。next は毎層初期化し、物理・魔法の両遷移を同じ旧 dp から行う。-1 と有効な体力0を区別する。

## 復習の核

- 初戦で両方不足、ちょうど0を残す選択、同じ魔力で異なる体力が合流する例、全撃破可能例を全選択列挙と比較する。

## 計算量と制約

### 時間

N 敵、初期魔力 M。各敵で残魔力0..Mを更新し O(NM)。

### 空間

rolling二層で O(M)、敵入力を持つなら O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3000; 1 \leq H,M \leq 3000; 1 \leq A_i,B_i \leq 3000; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

H=5,M=3、敵(A,B)=(4,2),(3,2),(2,2)。

1. 一体目後は(体力1,魔力3)と(5,1)。
2. 二体目後は(1,1)または(2,1)。
3. 三体目は後者から物理で倒し(0,1)。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

体力を正の値に保つ必要はあるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ない。支払額とちょうど等しければ倒した後0で有効。-1の未到達とは区別する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/tasks/abc410_e) — source-abc410-e-problem-09512e3fad866c3fca6c4920a703b97c609e72fbf2633d9801c0a9920c269219
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/editorial/13207) — source-abc410-editorial-13207-31c2b3aa0ee74e2d42158ed1cc19ab2115b53d6d4b1f68b14c06b208681d5fb5
