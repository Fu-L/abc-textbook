---
title: "ABC255-G — Constrained Nim"
draft: true
authoringUnit: {"problemId":"abc255-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc255-g.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp"],"sourceRevisionIds":["source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132","source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Grundy値は合法な全ての次状態の値のmexである。通常の山xは0..x−1へ移るため、過去の値の集合を管理すればよい。例外(x,y)ではその一手に対応する移動先x−yだけを一時的に頻度集合から除き、残る値のmexを求め、次の山のために頻度を復元する。同じGrundy値を持つ別の合法移動先が残る場合はその値を除かない点が必要である。小さい山から求める帰納法で各mexが正しく、独立な山の合成の勝敗はそのxorで決まる。","sourceRevisionIds":["source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132","source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-classify-game-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"山一つA=2、禁止(X,Y)=(2,1)。","procedure":["g0=0,g1=1。山2から残1への遷移は禁止、残0へだけ進める。","g2=mex{0}=1。"],"executionTarget":null,"expectedResult":"先手勝ち。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-game"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-classify-game-states"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"同じ山2を二個置くと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"g2 xor g2=1 xor1=0なので後手勝ち。例外評価後の通常Nim合成はxor。"},"answer":{"reasoningOrVerification":"g2 xor g2=1 xor1=0なので後手勝ち。例外評価後の通常Nim合成はxor。","procedure":["具体例の各状態・寄与を再計算する。","g2 xor g2=1 xor1=0なので後手勝ち。例外評価後の通常Nim合成はxor。"],"expectedResult":"g2 xor g2=1 xor1=0なので後手勝ち。例外評価後の通常Nim合成はxor。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

禁止手がない山nの遷移先には0..n-1が全て含まれるためGrundy数はそれまでの最大値hに1を足して伸び、挙動が変わるのはX_iだけである。

採用する候補: 例外点だけのGrundy前計算と頻度mex

X_iを昇順に処理し、禁止された遷移先のGrundy頻度と全過去頻度を比較すれば例外点のmexを求め、その他の巨大nは直前例外からの線形式で評価できる。

棄却する候補: 0からmax AまでGrundy数をDP

山サイズが最大10^18なので一つずつ計算・保存できない。

例外でないnでは、直前の例外値bar nからg(n)=n-bar n+h(bar n)と連続的に増える。

0..hのGrundy値は最低一回ずつ現れるので、全頻度表には追加出現分だけを記録すれば、保持するキー数をO(M)へ抑えられる。

S={0,X_i}を昇順に処理し、各例外Xについて禁止遷移先X-YのGrundy値を求める。過去全体での出現数が禁止分を上回る最小値をmexとしてg(X)にし、hと追加頻度を更新する。各A_iは直前例外を二分探索して式で求め、全山のxorを判定する。

## 典型の発動条件

### Sprague-Grundy分解

発動条件: 複数の独立な山から一つを選んで動かす不偏ゲームで勝敗を求める。

各山のGrundy数を求めてxorし、0かどうかで勝者を決める。

### 疎な例外点圧縮

発動条件: 通常位置では単純な規則で状態値が増え、少数の指定位置だけ遷移が欠ける。

例外X_iのみmexを計算し、例外間を閉形式で補間する。

### mexの頻度差分

発動条件: 遷移全集合から少数の禁止先を除いたmexを求めたい。

過去全体のGrundy出現数と禁止先側の出現数を比較する。

## 問題固有の要素

自由に減らせるNimの線形なGrundy列を基準にし、禁止手が置かれたX_iだけを補正することで10^18の状態空間を疎に扱える。

別の問題へ持ち帰る視点: ほぼ完全な遷移集合から少数の辺だけが欠けるゲームでは、例外位置と値頻度の差だけを追う。

## 正当性

Grundy値は合法な全ての次状態の値のmexである。通常の山xは0..x−1へ移るため、過去の値の集合を管理すればよい。例外(x,y)ではその一手に対応する移動先x−yだけを一時的に頻度集合から除き、残る値のmexを求め、次の山のために頻度を復元する。同じGrundy値を持つ別の合法移動先が残る場合はその値を除かない点が必要である。小さい山から求める帰納法で各mexが正しく、独立な山の合成の勝敗はそのxorで決まる。

## 実装上の注意

- 同じXに複数の禁止手があるためグループ単位で処理し、禁止先Grundyの重複頻度も数える。山サイズと式の値は64ビットで持ち、例外点自身には線形式を適用しない。

## 復習の核

- 山サイズが小さい場合の素朴なmex DPと比較し、同一Xの複数禁止手、同じGrundy値を指す禁止先、A_iが例外点・例外直後にある場合を確認する。

## 計算量と制約

### 時間

O((N+M)log M)、例外sortと各禁止遷移先のGrundy照会・頻度map。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq A_i \leq 10^{18}; 1 \leq Y_i \leq X_i \leq 10^{18}; i \neq j \Rightarrow (X_i, Y_i) \neq (X_j, Y_j); All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

山一つA=2、禁止(X,Y)=(2,1)。

1. g0=0,g1=1。山2から残1への遷移は禁止、残0へだけ進める。
2. g2=mex{0}=1。

期待される結果: 先手勝ち。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ山2を二個置くと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

g2 xor g2=1 xor1=0なので後手勝ち。例外評価後の通常Nim合成はxor。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/editorial/4104) — source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/tasks/abc255_g) — source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a
