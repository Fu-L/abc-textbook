---
title: "ABC212-E — Safety Journey"
draft: true
authoringUnit: {"problemId":"abc212-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-subtract-exception-transitions/outcome-subtract-exception-transitions-shard-001/abc212-e.md","learningOutcomeIds":["outcome-subtract-exception-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc212-e-problem-70d83985aae32c41e40c182e1f2c9800667a7e4b7106a19f9ea61b0cd85fc0a0","source-abc212-editorial-2357-e6909ba27957b7cf8a9986f14ea4ee3b5813f7d28b6303464500a50de64f973e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"完全graphから自分と禁止neighborへの遷移を引けば許可全neighbor和と一致する。各日の旧dp総和を共有し禁止辺両端を一回ずつ減算して通常のwalk DPを再現する。K日後開始都市の値が帰還数。","sourceRevisionIds":["source-abc212-e-problem-70d83985aae32c41e40c182e1f2c9800667a7e4b7106a19f9ea61b0cd85fc0a0","source-abc212-editorial-2357-e6909ba27957b7cf8a9986f14ea4ee3b5813f7d28b6303464500a50de64f973e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-subtract-exception-transitions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、禁止1–2、K=2、開始1。","procedure":["一手目は3のみ。","二手目3から1または2へ。","開始1へ戻るpathは1→3→1だけ。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-transition-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-subtract-exception-transitions"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"自分へのstay寄与を引く必要があるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ある。移動は別都市間であり完全総和には旧dp[v]も入る。"},"answer":{"reasoningOrVerification":"ある。移動は別都市間であり完全総和には旧dp[v]も入る。","procedure":["具体例の各状態・寄与を再計算する。","ある。移動は別都市間であり完全総和には旧dp[v]も入る。"],"expectedResult":"ある。移動は別都市間であり完全総和には旧dp[v]も入る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

各晩は今いる街にも壊れた道路の相手にも移動できず、それ以外のほぼ全ての街へ移動できる。使えない組だけが M 本の道路として疎に与えられている。 翌日のある街への到達数は、前日の全街への到達数の総和から、その街自身と壊れた道路で隣接する街からの分を除けば得られる。 密な許可関係をそのまま扱うのでなく、「全候補から疎な禁止集合を引く」という補集合側の表現に反転する。 同じ街に留まることも禁止されるため、入力された壊れた道路だけでなく dp の同じ添字の値も必ず総和から除く。

棄却する候補: 各日について全ての出発街と到着街の組を調べ、移動可能なら到達数を加える。

移動可能な組が密なので、街の組を直接列挙すると N の二乗に日数を掛けた回数の遷移が必要になる。

採用する候補: 前日の到達数の総和を先に求め、各到着街について自己ループと壊れた道路の端点に由来する寄与だけを引く。

全ての許可辺を列挙せず、各日につき街と壊れた道路だけを走査して同じ遷移を計算できる。

密な許可関係をそのまま扱うのでなく、「全候補から疎な禁止集合を引く」という補集合側の表現に反転する。

同じ街に留まることも禁止されるため、入力された壊れた道路だけでなく dp の同じ添字の値も必ず総和から除く。

日ごとの街別到達数を DP とし、全成分和を基準値にして禁止辺の両端からの寄与を差し引くことで、完全グラフの補グラフ上の遷移を疎な更新へ変換する。

## 典型の発動条件

### 補集合を使う遷移高速化

発動条件: 許される遷移がほぼ全てで、禁止される遷移だけが少数列挙されているとき。

全状態の値の総和から自己遷移と壊れた道路に対応する値を引き、許可辺の走査を省く。

### ローリング DP

発動条件: 次の段が直前の段だけに依存し、段数分の履歴を保持する必要がないとき。

前日と翌日の街別配列を分け、各晩の遷移後に交換して K 日目の街 1 の値を得る。

## 問題固有の要素

この問題の入力は道路を列挙しているが、道路は移動可能辺ではなく移動禁止辺であり、実際の遷移グラフは非常に密である。

別の問題へ持ち帰る視点: 入力が関係の例外だけを表す問題では、例外を足す発想だけでなく、全集合から例外を引く集約式を検討する。

## 正当性

完全graphから自分と禁止neighborへの遷移を引けば許可全neighbor和と一致する。各日の旧dp総和を共有し禁止辺両端を一回ずつ減算して通常のwalk DPを再現する。K日後開始都市の値が帰還数。

## 実装上の注意

- 壊れた道路の各端点について相手側の前日値を引き、同じ道路の寄与を逆向きにも忘れず更新する。
- 総和から複数の値を引く途中で負になり得るため、各日の更新値を法 998244353 の非負範囲へ戻す。

## 復習の核

- 辺数が少ないのに「辺のない組へ移動する」と書かれていたら、入力辺ではなくその補集合が本体だと読み替える。
- 全体和から引く対象を、入力の禁止辺だけで終えず、問題文が別に禁じる自己遷移まで列挙して確認する。

## 計算量と制約

### 時間

都市N、壊れた道路M、日数K。補graphDP O(K(N+M))。

### 空間

rolling都市DP O(N)、禁止隣接O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5000; 0 \leq M \leq \min\left( \frac{N(N-1)}{2},5000 \right); 2 \leq K \leq 5000; 1 \leq U_i<V_i \leq N; All pairs (U_i, V_i) are pairwise distinct.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、禁止1–2、K=2、開始1。

1. 一手目は3のみ。
2. 二手目3から1または2へ。
3. 開始1へ戻るpathは1→3→1だけ。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

自分へのstay寄与を引く必要があるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ある。移動は別都市間であり完全総和には旧dp[v]も入る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/tasks/abc212_e) — source-abc212-e-problem-70d83985aae32c41e40c182e1f2c9800667a7e4b7106a19f9ea61b0cd85fc0a0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/editorial/2357) — source-abc212-editorial-2357-e6909ba27957b7cf8a9986f14ea4ee3b5813f7d28b6303464500a50de64f973e
