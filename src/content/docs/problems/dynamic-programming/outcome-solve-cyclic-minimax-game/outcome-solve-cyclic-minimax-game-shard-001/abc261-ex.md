---
title: "ABC261-EX — Game on Graph"
draft: true
authoringUnit: {"problemId":"abc261-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-cyclic-minimax-game/outcome-solve-cyclic-minimax-game-shard-001/abc261-ex.md","learningOutcomeIds":["outcome-solve-cyclic-minimax-game"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game-value"],"excludedTopics":["循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cyclic-minimax-game"],"sourceRevisionIds":["source-abc261-ex-problem-9f5dba9306961f610913ad38f6a88ac74ad315e427d5a02594e2b2ac78c0e84d","source-abc261-editorial-4449-283c82cd2f95a81da0d4a7511ccaffbfac7d49758651852afd673915bcf5f48d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"状態は頂点と手番の組である。出次数0は費用0で終了し、高橋手番は一つでも有限終了する行先があれば最小の辺費用＋相手値を選べる。青木手番は全行先が有限の時だけ有限で、その最大を選ぶ。終端から逆辺を辿り、高橋状態は優先度付きキューの最小候補を、青木状態は全出辺が確定した時の最大候補を確定する。非負辺費用により未確定の小さい候補を飛ばして高橋状態を確定することはなく、青木状態には未確定枝を含む早期確定もない。確定順の帰納法で各値がminimax値になり、最後に未確定の状態は青木が終了を回避できるため無限である。","sourceRevisionIds":["source-abc261-ex-problem-9f5dba9306961f610913ad38f6a88ac74ad315e427d5a02594e2b2ac78c0e84d","source-abc261-editorial-4449-283c82cd2f95a81da0d4a7511ccaffbfac7d49758651852afd673915bcf5f48d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-cyclic-minimax-game"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"二頂点、1→2 cost3、2が終端。","procedure":["終端の両手番値0。","1のmin状態もmax状態も唯一の遷移3+0。"],"executionTarget":null,"expectedResult":"開始値3。","verificationStatus":"not_applicable","learningUnitIds":["unit-cyclic-minimax-game"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-cyclic-minimax-game"],"prerequisiteIds":["unit-dp-game-value"],"attainmentCondition":"終端へ到達できない閉じた成分を有限値で初期化できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"できない。AND側に未確定出口が残る場合も有限値を確定せず、無限継続できる状態として区別する。"},"answer":{"reasoningOrVerification":"できない。AND側に未確定出口が残る場合も有限値を確定せず、無限継続できる状態として区別する。","procedure":["具体例の各状態・寄与を再計算する。","できない。AND側に未確定出口が残る場合も有限値を確定せず、無限継続できる状態として区別する。"],"expectedResult":"できない。AND側に未確定出口が残る場合も有限値を確定せず、無限継続できる状態として区別する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [循環局面の後退解析とminimax距離](src/content/docs/learn/dynamic-programming/cyclic-minimax-game.md)

- 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md)

対象外:

- 循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

状態は頂点 v と手番 t の組で、出次数 0 の状態はどちらの手番でも有限値 0 の終了状態である。

高橋手番は有限な遷移先が一つあれば終了を選べるが、青木手番が有限になるには全遷移先が有限でなければならない。

棄却する候補: DAG の minimax DP と同じ再帰をメモ化し、未計算の遷移先を再帰的に辿る。

有向閉路では依存関係が循環し、有限終了の可否も値も再帰順だけでは確定できない。

採用する候補: 終了状態から逆辺を辿る後退解析を行い、高橋状態は優先度付きキューで最小候補を確定し、青木状態は全出辺確定後に最大候補を確定する。

存在条件と全称条件を別々の確定規則にでき、非負辺重みの最小側だけ Dijkstra 型の順序で処理すれば minimax 値も同時に得られる。

有限な高橋状態の値は min(C(v,u)+dp[u][1])、有限な青木状態の値は max(C(v,u)+dp[u][0]) である。

青木状態では未確定遷移数を出次数から減らし、0 になった瞬間に蓄積した最大値を確定する。高橋状態は最小候補がキューから出た瞬間に確定する。

reachability game の retrograde analysis に、AND/OR 状態の確定規則と nonnegative minimax distance の Dijkstra ordering を組み合わせる。

## 典型の発動条件

### ゲームグラフの後退解析

発動条件: 閉路を含む有限ゲームで、終端へ到達できる勝敗・有限性を逆向きに確定したいとき。

終端状態をキューへ入れ、逆辺を通じて存在条件の状態と全称条件の状態を伝播する。

### Dijkstra 型 minimax 値確定

発動条件: min 側は複数の確定済み候補の最小、max 側は全候補確定後の最大を取る非負重みゲーム。

min 候補を優先度付きキューへ入れ、max 候補は残り出辺カウンタと最大値で集約する。

## 問題固有の要素

両者の第一目的が終了可否なので、値の min/max を計算する前提となる有限状態だけを終端から生成し、最後まで未確定の状態を INFINITY とできる。

別の問題へ持ち帰る視点: 辞書式目的を持つゲームでは、最優先の勝敗・終了性で状態領域を確定してから二次評価を伝播する。

## 正当性

状態は頂点と手番の組である。出次数0は費用0で終了し、高橋手番は一つでも有限終了する行先があれば最小の辺費用＋相手値を選べる。青木手番は全行先が有限の時だけ有限で、その最大を選ぶ。終端から逆辺を辿り、高橋状態は優先度付きキューの最小候補を、青木状態は全出辺が確定した時の最大候補を確定する。非負辺費用により未確定の小さい候補を飛ばして高橋状態を確定することはなく、青木状態には未確定枝を含む早期確定もない。確定順の帰納法で各値がminimax値になり、最後に未確定の状態は青木が終了を回避できるため無限である。

## 実装上の注意

- 元の各辺 v→u を逆隣接リストにも保存し、候補値へ必ず辺重み C(v,u) を加える。
- 状態ごとの確定済み flag を持ち、優先度付きキューの古い候補による二重確定やカウンタの二重減算を防ぐ。
- 累積値は辺重みが経路上で重なるため 64 bit 整数で保持する。

## 復習の核

- 手番ごとの有限性条件が「一つあればよい」か「全て必要」かを、プレイヤーの目的から先に論理式へする。
- 閉路付きゲームDPは、再帰を工夫するより終端から値が確定する条件を逆向きに設計する。

## 計算量と制約

### 時間

O((N+M)log(N+M))、2N手番状態のretrograde heap。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq M \leq 2\times 10^5; 1 \leq v \leq N; 1 \leq A_i,B_i \leq N; There is no multi-edges. That is, (A_i,B_i)\neq(A_j,B_j) for i\neq j.; There is no self-loops. That is, A_i\neq B_i.; 0 \leq C_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

二頂点、1→2 cost3、2が終端。

1. 終端の両手番値0。
2. 1のmin状態もmax状態も唯一の遷移3+0。

期待される結果: 開始値3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

終端へ到達できない閉じた成分を有限値で初期化できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

できない。AND側に未確定出口が残る場合も有限値を確定せず、無限継続できる状態として区別する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/tasks/abc261_h) — source-abc261-ex-problem-9f5dba9306961f610913ad38f6a88ac74ad315e427d5a02594e2b2ac78c0e84d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/editorial/4449) — source-abc261-editorial-4449-283c82cd2f95a81da0d4a7511ccaffbfac7d49758651852afd673915bcf5f48d
