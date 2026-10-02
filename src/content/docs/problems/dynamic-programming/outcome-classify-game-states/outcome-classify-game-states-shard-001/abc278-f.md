---
title: "ABC278-F — Shiritori"
draft: true
authoringUnit: {"problemId":"abc278-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc278-f.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc278-editorial-5232-8837482708fe5b455f562d9bf57f546e49eb9285112b3dabbbcedd75fffb837b","source-abc278-f-problem-519f7651aa3986400132bc1168f74e594bffc48ff2757c5f6ea0842bebdeebc6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未使用単語集合と要求される先頭文字が同じなら、過去の使用順によらず合法手は同じである。未使用数0の状態は負けであり、その他は合法手のいずれかで相手を負け状態へ送れる時に限って勝ちとなる。各手は未使用単語を一つ減らすので、このminimax式は集合サイズの帰納法で正しい。初手には要求文字がないので全単語を試し、その後の相手状態が負けとなる単語の存在を調べれば先手勝敗が決まる。","sourceRevisionIds":["source-abc278-editorial-5232-8837482708fe5b455f562d9bf57f546e49eb9285112b3dabbbcedd75fffb837b","source-abc278-f-problem-519f7651aa3986400132bc1168f74e594bffc48ff2757c5f6ea0842bebdeebc6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-classify-game-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"wordはab,bc。","procedure":["先手がabを出すと相手がbcを出し後手勝ち。","先手bcなら次はc始まりwordがなく相手が負ける。"],"executionTarget":null,"expectedResult":"First。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-game"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-classify-game-states"],"prerequisiteIds":["unit-dp-state-design","unit-dp-subset-state"],"attainmentCondition":"初手にも要求文字aを固定してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"初手は任意wordを出せるのでbcの勝ち手を落とす。初手だけ全wordを比較する。"},"answer":{"reasoningOrVerification":"初手は任意wordを出せるのでbcの勝ち手を落とす。初手だけ全wordを比較する。","procedure":["具体例の各状態・寄与を再計算する。","初手は任意wordを出せるのでbcの勝ち手を落とす。初手だけ全wordを比較する。"],"expectedResult":"初手は任意wordを出せるのでbcの勝ち手を落とす。初手だけ全wordを比較する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

同じwordは二度使えずN≤16なので、gameの履歴で将来に必要なのはused/remaining subsetと直前wordの末尾文字だけである。

有限のnormal-play gameなので、現在playerが相手の負け状態へ遷移できるなら勝ち、全遷移が相手の勝ちなら負けとなる。

採用する候補: remaining word subsetと要求される先頭文字を状態にしたbit DPで勝敗を小subsetから計算する。

wordの使用順序を2^N状態にまとめ、minimaxを通常の勝敗recurrenceで評価できる。

棄却する候補: 可能なshiritori列をgame treeとして重複なく全探索する。

同じsubset・末尾へ至る順序が多数あり、memo化なしではN!規模になる。

状態が勝ちである必要十分条件は、先頭文字が一致するremaining wordの中に、使用後の状態が負けとなるものが1つでもあること。

初手だけ要求文字がないため、各wordを初手に選んだ後の相手状態が負けかを全wordについて調べればよい。

dp[mask][c]をremaining set=mask、要求先頭文字cから手番playerが勝てるかとする。使用可能word iごとにdp[mask\{i}][last_i]がfalseならtrueとし、maskの小さい順に埋める。full maskから任意初手で勝てればFirst。

## 典型の発動条件

### subset game DP

発動条件: 各要素を高々一度使う交互gameで、Nが20未満のとき。

remaining/used subsetと局所的な接続条件を状態にして勝敗をmemo化する。

### normal-play勝敗recurrence

発動条件: 手がないplayerが負ける有限gameを解析するとき。

負け状態への遷移があれば勝ち、なければ負けとする。

## 問題固有の要素

文字列本体の内容は初字・末字以外gameの合法性に影響せず、履歴の最後も末尾1文字へ圧縮できる。

別の問題へ持ち帰る視点: 連結ルール付き列gameでは、次の合法手判定に必要なboundary情報だけを状態に残す。

## 正当性

未使用単語集合と要求される先頭文字が同じなら、過去の使用順によらず合法手は同じである。未使用数0の状態は負けであり、その他は合法手のいずれかで相手を負け状態へ送れる時に限って勝ちとなる。各手は未使用単語を一つ減らすので、このminimax式は集合サイズの帰納法で正しい。初手には要求文字がないので全単語を試し、その後の相手状態が負けとなる単語の存在を調べれば先手勝敗が決まる。

## 実装上の注意

- remaining mask方式なら遷移先は小さいmaskなので昇順、used mask方式なら逆向きになることを揃える。
- 初手を表すdummy文字を26文字に混ぜず、全wordからの遷移を別に評価する。

## 復習の核

- 手がないmaskを負けと置き、1語・2語の小例から『相手を負けへ送れる』recurrenceを逆算する。

## 計算量と制約

### 時間

O(N2ᴺ)、各maskで各wordの先頭文字状態だけを更新。

### 空間

O(26·2ᴺ)、remaining mask×要求文字。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 16; N is an integer.; S _ i\ (1\leq i\leq N) is a non-empty string of length at most 10 consisting of lowercase English letters.; S _ i\neq S _ j\ (1\leq i\lt j\leq N)

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

wordはab,bc。

1. 先手がabを出すと相手がbcを出し後手勝ち。
2. 先手bcなら次はc始まりwordがなく相手が負ける。

期待される結果: First。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

初手にも要求文字aを固定してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

初手は任意wordを出せるのでbcの勝ち手を落とす。初手だけ全wordを比較する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/editorial/5232) — source-abc278-editorial-5232-8837482708fe5b455f562d9bf57f546e49eb9285112b3dabbbcedd75fffb837b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/tasks/abc278_f) — source-abc278-f-problem-519f7651aa3986400132bc1168f74e594bffc48ff2757c5f6ea0842bebdeebc6
