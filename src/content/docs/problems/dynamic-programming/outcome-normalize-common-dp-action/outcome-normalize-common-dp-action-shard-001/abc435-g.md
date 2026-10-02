---
title: "ABC435-G — Domino Arrangement"
draft: true
authoringUnit: {"problemId":"abc435-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc435-g.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc435-editorial-14709-ab9da4b7c0dc0cd5c4357ebcc9efe075a5833e4ef01fe96fea034bc28984a726","source-abc435-g-problem-1c5f30320e1385bd7b970ef2b674da6b62239d9a00603552082b508f60fc3a19"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各同色の連続runは条件から長さちょうど2のdominoである。右端i、色cのdominoを置く場合、prefix i−2の全配置から同色dominoがi−2で終わる配置を引くので dp[i,c]=S[i−2]−dp[i−2,c]。空白終端を加えるとS_iの式を得る。必要和の色集合C_iは各色で連続区間L_c+1..R_cである。偶奇を分ければ存続色の値は一様にx→S[i−4]−x、新色は0、離脱色は削除。これをaffine tagで表す更新は各dp値へ個別式を適用するのと完全に同じで、要素数と和だけでSを正確に計算できる。","sourceRevisionIds":["source-abc435-editorial-14709-ab9da4b7c0dc0cd5c4357ebcc9efe075a5833e4ef01fe96fea034bc28984a726","source-abc435-g-problem-1c5f30320e1385bd7b970ef2b674da6b62239d9a00603552082b508f60fc3a19"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-common-dp-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=4,M=2、両色の許可区間は[1,4]。","procedure":["空白だけ1通り。","一本dominoは置く位置3×色2=6通り。","二本dominoは1–2と3–4で、異色の2通り。","同色二本は長さ4runで不適合。"],"executionTarget":null,"expectedResult":"9","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-transition-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-common-dp-action"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"色を一種類にすると答えは。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"4。空白1と一本dominoの位置3だけ。二本を隣接させることはできない。"},"answer":{"reasoningOrVerification":"4。空白1と一本dominoの位置3だけ。二本を隣接させることはできない。","procedure":["具体例の各状態・寄与を再計算する。","4。空白1と一本dominoの位置3だけ。二本を隣接させることはできない。"],"expectedResult":"4。空白1と一本dominoの位置3だけ。二本を隣接させることはできない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

右端を i とする最後のドミノ色 c の DP は、二つ前までの全配置から同色衝突を除き dp[i][c]=S_{i-2}-dp[i-2][c] となる。必要なのは許可色集合 C_i 上の dp[i-2][c] の和だけである。 S_k=S_{k-1}+|C_k|S_{k-2}-Σ_{c∈C_k}dp[k-2][c] なので、色別値の総和だけ高速に得ればよい。 共通色 c∈C_k∩C_{k-2} は一斉に x→S_{k-4}-x と変わり、これは affine 変換 (-1)·x+S_{k-4} でまとめられる。 理想変換後 T'_k と実際の T_k が異なるのは C_k と C_{k-2} の対称差だけで、その (k,c) 総数は各色区間の端点へ課金して O(M) になる。

採用する候補: 偶奇ごとに疎な色配列 T_k を持ち、全要素への符号反転・定数加算を lazy affine として適用し、C_k の差分色だけ個別更新する。

C_k の変化点総数が入力区間端点数 O(M) に抑えられ、全体 O(N+M) で和を更新できる。

棄却する候補: 各 i で C_i の全色を走査して dp[i][c] と和を計算する。

各位置で利用可能色が多いと N×色数に達する。

S_k=S_{k-1}+|C_k|S_{k-2}-Σ_{c∈C_k}dp[k-2][c] なので、色別値の総和だけ高速に得ればよい。

共通色 c∈C_k∩C_{k-2} は一斉に x→S_{k-4}-x と変わり、これは affine 変換 (-1)·x+S_{k-4} でまとめられる。

理想変換後 T'_k と実際の T_k が異なるのは C_k と C_{k-2} の対称差だけで、その (k,c) 総数は各色区間の端点へ課金して O(M) になる。

偶数 k と奇数 k の二つの色 map を管理し、各 map に有効要素数・値和・全体 affine tag を持たせる。k ごとに前の同 parity map 全体へ x→S_{k-4}-x を適用し、C_k へ出入りする色だけ実値化して追加・削除する。sum T_k から S_k を更新する。

## 典型の発動条件

### 全体 affine lazy

発動条件: 集合内の全値へ同じ一次変換 ax+b を繰り返し適用し、総和を保ちたいとき。

符号・加算 tag と要素数から sum を O(1) 更新する。

### 集合の対称差更新

発動条件: 時刻ごとの対象集合が変わるが、全期間の membership 変化回数が小さいとき。

C_k△C_{k-2} の色だけを個別修正し、共通部分は一括変換する。

### DP の総和圧縮

発動条件: 色別 DP のうち、次の漸化式が対象集合上の和だけを要求するとき。

S_k と T_k の個数・総和を持ち、全色状態の走査を避ける。

## 問題固有の要素

色別 DP の更新が共通集合上で同じ affine 変換になるため、値を個別に更新する必要がない。

別の問題へ持ち帰る視点: 時系列集合 DP は『前集合全体への一様変換＋対称差の例外修正』へ分け、例外総数を端点で償却できる。

## 正当性

各同色の連続runは条件から長さちょうど2のdominoである。右端i、色cのdominoを置く場合、prefix i−2の全配置から同色dominoがi−2で終わる配置を引くので dp[i,c]=S[i−2]−dp[i−2,c]。空白終端を加えるとS_iの式を得る。必要和の色集合C_iは各色で連続区間L_c+1..R_cである。偶奇を分ければ存続色の値は一様にx→S[i−4]−x、新色は0、離脱色は削除。これをaffine tagで表す更新は各dp値へ個別式を適用するのと完全に同じで、要素数と和だけでSを正確に計算できる。

## 実装上の注意

- k と k-2 で同じ parity の構造を更新し、S の負添字に対応する初期条件を定義する。lazy tag 下の個別値を追加・削除するとき実値と内部表現を変換する。

## 復習の核

- S_k の第三項が現在の T_k の和と一致すること、C_k への出入りイベントを二重処理していないことを確認する。

## 計算量と制約

### 時間

マス N、色 M。色ID配列と偶奇別affine tagで O(N+M) の確定的計算量。hash mapを使う実装では同じ上界は期待計算量。

### 空間

色値二組、開始終了event、Sで O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M \leq 5\times 10^5; 1\leq L_i \leq R_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=4,M=2、両色の許可区間は[1,4]。

1. 空白だけ1通り。
2. 一本dominoは置く位置3×色2=6通り。
3. 二本dominoは1–2と3–4で、異色の2通り。
4. 同色二本は長さ4runで不適合。

期待される結果: 9

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

色を一種類にすると答えは。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

4。空白1と一本dominoの位置3だけ。二本を隣接させることはできない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/editorial/14709) — source-abc435-editorial-14709-ab9da4b7c0dc0cd5c4357ebcc9efe075a5833e4ef01fe96fea034bc28984a726
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/tasks/abc435_g) — source-abc435-g-problem-1c5f30320e1385bd7b970ef2b674da6b62239d9a00603552082b508f60fc3a19
