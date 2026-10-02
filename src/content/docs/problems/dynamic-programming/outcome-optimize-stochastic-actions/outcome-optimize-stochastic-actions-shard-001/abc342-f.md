---
title: "ABC342-F — Black Jack"
draft: true
authoringUnit: {"problemId":"abc342-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc342-f.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc342-editorial-9345-8a51974000f630b7d802fb75a217b7d432774ee320d77cce7436e8a20bbf9f9c","source-abc342-f-problem-770139f9098b2222706e511e4bcbd138336b0c0da643a589410258d701e9eedd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dealerはscore<Lの状態からだけ続行するので、前向きの確率分布更新で最終score分布を求められる。playerがscore iで止めて勝つのはdealerのscoreがi未満、またはN超過の場合だけである。続行の勝率はi+1..i+Dの最適勝率の平均で、N超過は0とする。scoreが常に増えるためr[i]=max(停止勝率,続行平均)をNから逆順に解く帰納法が成立する。区間和の差分更新と窓平均は同じ確率和を保つので、線形時間の計算も最適停止判断を失わない。","sourceRevisionIds":["source-abc342-editorial-9345-8a51974000f630b7d802fb75a217b7d432774ee320d77cce7436e8a20bbf9f9c","source-abc342-f-problem-770139f9098b2222706e511e4bcbd138336b0c0da643a589410258d701e9eedd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,L=1,D=1。","procedure":["dealerは確定score1で停止。","playerは0→1→2と進み2で止めると必ず勝つ。"],"executionTarget":null,"expectedResult":"最適勝率1。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"prerequisiteIds":["unit-dp-state-design","unit-dp-transition-optimization"],"attainmentCondition":"N=1へ変更した場合score1のtieは勝ちか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"tieは勝ちでなく、超過も負けなので最適勝率0。stop勝率qはdealer score<iをstrictに数える。"},"answer":{"reasoningOrVerification":"tieは勝ちでなく、超過も負けなので最適勝率0。stop勝率qはdealer score<iをstrictに数える。","procedure":["具体例の各状態・寄与を再計算する。","tieは勝ちでなく、超過も負けなので最適勝率0。stop勝率qはdealer score<iをstrictに数える。"],"expectedResult":"tieは勝ちでなく、超過も負けなので最適勝率0。stop勝率qはdealer score<iをstrictに数える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

dealerの最終score分布は戦略と独立なので先に計算できる。playerがscore iで止めた勝率q[i]と、もう一度振る場合の将来最適勝率平均を比較すれば、後ろからoptimal stopping DPになる。

採用する候補: dealer分布をsliding-sum DPで求め、playerを逆順DPする

両者のdice遷移が連続D状態の平均なので、range sumを維持して全体O(N+D)で計算できる。

棄却する候補: playerの全stop/continue戦略をgame treeとして探索する

各scoreで二択、dice分岐D通りが重なり、同じscore状態の再利用をしないと指数的になる。

player score i≤Nで止める勝率はdealer最終yがy<iまたはy>Nとなる確率q[i]である。続行時は一様にi+1,…,i+Dへ移り、N超過stateの勝率0を含むのでr[i]=max(q[i],Σr[i+t]/D)となる。

p[0]=1からdealerがL未満のstateだけを展開し、difference arrayまたはsliding sumで各p[y]を求める。terminal y≥Lのprefix sumから全q[i]を作る。r[j]=0 for j>Nとしてi=N,…,0を走査し、次D個のr平均をwindow sumで得てr[i]を更新し、r[0]を出力する。

## 典型の発動条件

### 吸収Markov DP

発動条件: dealerはscoreがL以上になるまで同じdice transitionを繰り返す。

未吸収stateだけから確率を配り、最終score分布をrange-addで集計する。

### optimal stopping DP

発動条件: 各stateで即時rewardと一回進めた期待値の大きい方を選べる。

stop勝率qとcontinue平均をmaxし、遷移先scoreが大きい順序で逆算する。

## 問題固有の要素

dealerのrandomnessを最終分布qへ周辺化してからplayer戦略を解くことで、二者のprocessを一つの巨大状態空間に結合せずに済む。

別の問題へ持ち帰る視点: 相手の固定確率processは先にterminal payoff分布へ畳み込み、意思決定側のBellman方程式へ渡す。

## 正当性

dealerはscore<Lの状態からだけ続行するので、前向きの確率分布更新で最終score分布を求められる。playerがscore iで止めて勝つのはdealerのscoreがi未満、またはN超過の場合だけである。続行の勝率はi+1..i+Dの最適勝率の平均で、N超過は0とする。scoreが常に増えるためr[i]=max(停止勝率,続行平均)をNから逆順に解く帰納法が成立する。区間和の差分更新と窓平均は同じ確率和を保つので、線形時間の計算も最適停止判断を失わない。

## 実装上の注意

- dealerはy≥Lで停止するためpからの遷移を行わない。playerのi>Nは即敗北0で、q[i]を使わない。double誤差を抑えwindow更新の出入りindexを固定する。

## 復習の核

- D=1、L=N、playerが即stopする境界、必ずbustするcontinueを、小さい状態の直接連立/再帰計算と比較する。

## 計算量と制約

### 時間

O(N+D)、dealer forward差分とplayer backward窓平均。

### 空間

O(N+D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All inputs are integers.; 1 \leq L \leq N \leq 2 \times 10^5; 1 \leq D \leq N

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,L=1,D=1。

1. dealerは確定score1で停止。
2. playerは0→1→2と進み2で止めると必ず勝つ。

期待される結果: 最適勝率1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=1へ変更した場合score1のtieは勝ちか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

tieは勝ちでなく、超過も負けなので最適勝率0。stop勝率qはdealer score<iをstrictに数える。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/editorial/9345) — source-abc342-editorial-9345-8a51974000f630b7d802fb75a217b7d432774ee320d77cce7436e8a20bbf9f9c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/tasks/abc342_f) — source-abc342-f-problem-770139f9098b2222706e511e4bcbd138336b0c0da643a589410258d701e9eedd
