---
title: "ABC303-G — Bags Game"
draft: true
authoringUnit: {"problemId":"abc303-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-evaluate-adversarial-game-value/outcome-evaluate-adversarial-game-value-shard-001/abc303-g.md","learningOutcomeIds":["outcome-evaluate-adversarial-game-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-monotone-stack-queue"],"excludedTopics":["勝敗だけを分類する通常の後退解析・Grundy数。"],"tagIds":["tag-game-value-dp","tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc303-editorial-6444-5611246de28948f9c9a7b632b84c007be451b111f0e0f135a76d5e329d598ad1","source-abc303-g-problem-fbcaf504a69e006d352d0458cb7b4b758db0b7d6fce4cdda38956ce856ca348f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"残袋は連続区間である。一手後に残す長さkとその左端lを固定すると、取る袋の総額は区間総額S(i,j)−S(k,l)、費用はZ、相手の最適差はdp[k,l]なので、手番側の差はS(i,j)−S(k,l)−Z−dp[k,l]となる。全合法lを試した最大がその行動のminimax値であり、三行動の最大を取れば正しい。長さkが同じ全始点について必要なのはS(k,l)+dp[k,l]の窓最小であり、単調キューで計算しても全lの最小と一致する。","sourceRevisionIds":["source-abc303-editorial-6444-5611246de28948f9c9a7b632b84c007be451b111f0e0f135a76d5e329d598ad1","source-abc303-g-problem-fbcaf504a69e006d352d0458cb7b4b758db0b7d6fce4cdda38956ce856ca348f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-evaluate-adversarial-game-value"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"x=(3,5)、A=1,B=2、C=9,D=1。","procedure":["普通の一個取りは得点差2。","B=2の有料行動は全額8から費用1を引き相手の残り0。"],"executionTarget":null,"expectedResult":"最適得点差7。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-game-value"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-evaluate-adversarial-game-value"],"prerequisiteIds":["unit-dp-state-design","unit-monotone-stack-queue"],"attainmentCondition":"次手番DPを足すと何が崩れるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"得点差は手番が逆転するので残区間dpを引く。式は全額−残額−費用−相手dp。"},"answer":{"reasoningOrVerification":"得点差は手番が逆転するので残区間dpを引く。式は全額−残額−費用−相手dp。","procedure":["具体例の各状態・寄与を再計算する。","得点差は手番が逆転するので残区間dpを引く。式は全額−残額−費用−相手dp。"],"expectedResult":"得点差は手番が逆転するので残区間dpを引く。式は全額−残額−費用−相手dp。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md)

- 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

対象外:

- 勝敗だけを分類する通常の後退解析・Grundy数。

## 考察

どの行動でも列の左右から何個かを取るため、行動後に残るbagは必ず連続区間である。ゲーム状態は残存区間だけで決まり、現在手番の「自分の利益−相手の利益」を区間DPにできる。

採用する候補: 区間minimax DPの遷移をsliding minimumでまとめる

一手で残す同じ長さの全subintervalから最小値を選ぶ形へ変形でき、各長さの全始点を線形に処理してO(N^2)へ収められる。

棄却する候補: 各区間で取り方を全列挙する素朴なminimax DP

状態がO(N^2)、一状態の残存区間候補もO(N)となりO(N^3)でN=3000に間に合わない。

長さi・左端jの総額をS(i,j)、行動後に残す長さをk、支払額をZとする。残す区間の左端lに対する手番側の得点差はS(i,j)-S(k,l)-Z-dp[k,l]なので、必要なのは範囲j≤l≤j+i-kでのS(k,l)+dp[k,l]の最小値である。

dp[i][j]を残存区間[j,j+i)から手番の人が得る最適得点差とする。三行動に対応する(k,Z)=(i-1,0),(max(i-B,0),A),(max(i-D,0),C)ごとに、配列S(k,l)+dp[k,l]の幅i-k+1のsliding minimumをdequeで求め、S(i,j)-Z-minを候補として最大を取る。答えはdp[N][0]。

## 典型の発動条件

### zero-sum区間ゲームDP

発動条件: 両者の目的がX-Yの最大化・最小化で、操作後も連続区間だけが残る。

手番側から見た得点差を状態値にし、獲得額−支払額−次手番のdpで符号反転を吸収する。

### sliding window minimum

発動条件: 各始点jで、固定長kの残存区間候補lが連続範囲を一つずつずらして現れる。

S(k,l)+dp[k,l]のrange minimumをmonotone dequeで全jまとめて求める。

## 問題固有の要素

複数個を左右から取る全手順は、最終的にどの連続subintervalを残したかだけで同値になるため、2^(取得数)の手順を残存区間の左端選択へ圧縮できる。

別の問題へ持ち帰る視点: 端からの反復削除は、削除順ではなく残った区間を状態・遷移にすると選択肢を線形範囲へまとめられる。

## 正当性

残袋は連続区間である。一手後に残す長さkとその左端lを固定すると、取る袋の総額は区間総額S(i,j)−S(k,l)、費用はZ、相手の最適差はdp[k,l]なので、手番側の差はS(i,j)−S(k,l)−Z−dp[k,l]となる。全合法lを試した最大がその行動のminimax値であり、三行動の最大を取れば正しい。長さkが同じ全始点について必要なのはS(k,l)+dp[k,l]の窓最小であり、単調キューで計算しても全lの最小と一致する。

## 実装上の注意

- i≤Bまたはi≤Dではk=0となり空区間のdpと和を0にする。各actionの支払額を取得額から引き、次手番dpも引く符号を崩さない。

## 復習の核

- Nの小さい列で全手順minimaxを実装して比較し、BやDが残数以上、支払う行動が不利、左右どちらも同額となる場合を検証する。

## 計算量と制約

### 時間

O(N²)、各残長で三行動のsliding minimumを線形構築。

### 空間

O(N²)、非隣接長を参照する全区間DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3000; 1 \leq x_i \leq 10^9; 1 \leq A,C \leq 10^9; 1 \leq B,D \leq N; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

x=(3,5)、A=1,B=2、C=9,D=1。

1. 普通の一個取りは得点差2。
2. B=2の有料行動は全額8から費用1を引き相手の残り0。

期待される結果: 最適得点差7。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

次手番DPを足すと何が崩れるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

得点差は手番が逆転するので残区間dpを引く。式は全額−残額−費用−相手dp。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/editorial/6444) — source-abc303-editorial-6444-5611246de28948f9c9a7b632b84c007be451b111f0e0f135a76d5e329d598ad1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/tasks/abc303_g) — source-abc303-g-problem-fbcaf504a69e006d352d0458cb7b4b758db0b7d6fce4cdda38956ce856ca348f
