---
title: "ABC446-E — Multiple-Free Sequences"
draft: true
authoringUnit: {"problemId":"abc446-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc446-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc446-e-problem-0c5beab949050b64c016f59892db61e46001fb5ae35216d0c6f4691877c5a10e","source-abc446-editorial-16370-eefb0bfb53eb98118b5c9db0f5e01d5fe88ab24820d7fb5fcaa5e39bebea9404"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"初期二項と連続二項状態が一対一で、次状態は一意。どこかで0項を持つことは0を含む目標状態への到達と同値なので逆辺探索が該当全初期値を厳密に列挙する。補集合の数が不成立初期値数。","sourceRevisionIds":["source-abc446-e-problem-0c5beab949050b64c016f59892db61e46001fb5ae35216d0c6f4691877c5a10e","source-abc446-editorial-16370-eefb0bfb53eb98118b5c9db0f5e01d5fe88ab24820d7fb5fcaa5e39bebea9404"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-select-state-graph-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=B=1、M=2、初期二項(1,1)。","procedure":["採用漸化式は次項=(Ay+Bx) mod M=x+y mod2。","(1,1)→(1,0)→(0,1)で第一成分0へ至る。","全(0,t)からの逆探索はこの初期(1,1)も拾う。"],"executionTarget":null,"expectedResult":"この初期(1,1)は0到達群に属する。","verificationStatus":"not_applicable","learningUnitIds":["unit-state-graph-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-select-state-graph-search"],"prerequisiteIds":[],"attainmentCondition":"順graphで0状態から探索すれば同じ集合か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"違う。必要なのは0へ入れる先行状態であり逆graphを辿る。"},"answer":{"reasoningOrVerification":"違う。必要なのは0へ入れる先行状態であり逆graphを辿る。","procedure":["具体例の各状態・寄与を再計算する。","違う。必要なのは0へ入れる先行状態であり逆graphを辿る。"],"expectedResult":"違う。必要なのは0へ入れる先行状態であり逆graphを辿る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

数列を mod M で見れば連続二項 (x,y) から次状態 (y,(Ay+Bx) mod M) が一意に決まる functional graph になる。0を含むことは第一成分0の状態へ到達することと同値である。 整数数列と mod M 数列は各項の剰余が一致し、M の倍数を含む条件は剰余0の出現だけで判定できる。 目標集合への到達性は辺を反転して目標から探索すれば、全始点について一回の graph traversal で求まる。

採用する候補: M^2 状態の遷移を逆向きに張り、(0,t) 全てを始点として BFS/DFS し、そこへ到達可能な初期状態をまとめて印付けする。

各初期二項と状態が一対一で、その後の列は唯一の path なので、逆 graph の多点探索が「いつか0へ至る」全状態を漏れなく列挙する。

棄却する候補: 各 (s_1,s_2) から個別に数列を生成し、0または周期へ入るまで追跡する。

初期状態が M^2 個あり各探索も M^2 長になり得て、同じ後続 path を繰り返し辿る。

整数数列と mod M 数列は各項の剰余が一致し、M の倍数を含む条件は剰余0の出現だけで判定できる。

目標集合への到達性は辺を反転して目標から探索すれば、全始点について一回の graph traversal で求まる。

全 x,y∈[0,M) について successor を計算して reverse adjacency へ辺を加える。全 (0,t) を queue に入れて逆到達集合を求め、未訪問状態数を条件を満たさない初期値として数える。

## 典型の発動条件

### functional graph の逆到達探索

発動条件: 決定的遷移を繰り返したとき、どの初期状態が目標集合へ至るかを全件求めたいとき。

遷移を逆向きにして目標集合から多点 BFS する。

## 問題固有の要素

線形漸化式も modulus 上では有限オートマトンになり、直前二項だけが将来を決める。

別の問題へ持ち帰る視点: 全始点 query は個別 simulation せず、終点集合から reverse reachability を一括計算する。

## 正当性

初期二項と連続二項状態が一対一で、次状態は一意。どこかで0項を持つことは0を含む目標状態への到達と同値なので逆辺探索が該当全初期値を厳密に列挙する。補集合の数が不成立初期値数。

## 実装上の注意

- s_1=0 または s_2=0 の初期列も目標集合へ含まれる状態表現か確認する。状態 index x*M+y と逆辺の向きを統一する。

## 復習の核

- 状態 (s_k,s_{k+1}) と一回遷移の対応を確認し、0が第二成分に現れた場合も次状態で第一成分0へ移ることを追う。

## 計算量と制約

### 時間

法M、状態M²、各一出辺。逆graph構築と多始点探索 O(M²)。

### 空間

逆辺とvisited O(M²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq M \leq 1000; 0 \leq A, B \leq M-1; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=B=1、M=2、初期二項(1,1)。

1. 採用漸化式は次項=(Ay+Bx) mod M=x+y mod2。
2. (1,1)→(1,0)→(0,1)で第一成分0へ至る。
3. 全(0,t)からの逆探索はこの初期(1,1)も拾う。

期待される結果: この初期(1,1)は0到達群に属する。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

順graphで0状態から探索すれば同じ集合か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

違う。必要なのは0へ入れる先行状態であり逆graphを辿る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/tasks/abc446_e) — source-abc446-e-problem-0c5beab949050b64c016f59892db61e46001fb5ae35216d0c6f4691877c5a10e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/editorial/16370) — source-abc446-editorial-16370-eefb0bfb53eb98118b5c9db0f5e01d5fe88ab24820d7fb5fcaa5e39bebea9404
