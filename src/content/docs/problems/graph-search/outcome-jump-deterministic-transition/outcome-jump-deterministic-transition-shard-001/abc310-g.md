---
title: "ABC310-G — Takahashi And Pass-The-Ball Game"
draft: true
authoringUnit: {"problemId":"abc310-g","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc310-g.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5","source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"写像による分布移動は線形。長さ2tの分布総和は前半和と、それをt回写像で移した後半和になる。写像と和を同時倍化しKのbitで結合すれば操作後1..K時刻の和を厳密に得る。最後にKで割ると一様に選ぶ時刻の期待分布。","sourceRevisionIds":["source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5","source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-jump-deterministic-transition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,1)、初期球分布(1,0)、K=3。","procedure":["操作後分布は(0,1),(1,0),(0,1)。","三時刻和は(1,2)。","K=3で割る。"],"executionTarget":null,"expectedResult":"期待分布(1/3,2/3)","verificationStatus":"not_applicable","learningUnitIds":["unit-binary-lifting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-jump-deterministic-transition"],"prerequisiteIds":["unit-modular-arithmetic"],"attainmentCondition":"複数頂点が同じ宛先へ移る場合に上書きしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。球数は合流するので宛先値へ加算する。線形写像の係数和を保つ。"},"answer":{"reasoningOrVerification":"不可。球数は合流するので宛先値へ加算する。線形写像の係数和を保つ。","procedure":["具体例の各状態・寄与を再計算する。","不可。球数は合流するので宛先値へ加算する。線形写像の係数和を保つ。"],"expectedResult":"不可。球数は合流するので宛先値へ加算する。線形写像の係数和を保つ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回の操作は各頂点 i の全ボールを A_i へ移す線形写像で、同じ写像を K 回繰り返す。求める期待値は K 個の時刻状態の総和を K で割ったものと見られる。 写像 S を二回適用した写像 S² と、前半二時刻の総和 x+Sx を同時に作れば、長さ 2k の区間和を長さ k の問題へ半減できる。 区間長を倍化するときは遷移先 S² だけでなく、その区間内の状態総和 x+Sx も一緒に合成する必要がある。 問題の時刻のずれを一回操作後の b と 0..K−1 回の A 適用へ直すと、等比級数型の和として扱える。

採用する候補: functional graph の写像合成と状態和を組にして二分累乗し、K 時刻分のボール総和を作る。

写像適用・写像合成・ベクトル加算が各 O(N) で、K≤10^18 を O(N log K) に短縮できる。

棄却する候補: 各時刻に全ボールを次頂点へ移し、その状態を K 回加算する。

一回 O(N) でも K が 10^18 なので反復できない。

区間長を倍化するときは遷移先 S² だけでなく、その区間内の状態総和 x+Sx も一緒に合成する必要がある。

問題の時刻のずれを一回操作後の b と 0..K−1 回の A 適用へ直すと、等比級数型の和として扱える。

一回操作後の分布 b を作る。現在の写像 S=A、区間和用ベクトル x=b とし、K の bit を下から処理する。偶数倍では x←x+Sx、S←S∘S とし、奇数分を答え側へ写像合成付きで取り込む。得た K 状態の総和を法上の K で割る。

## 典型の発動条件

### 作用と区間和のダブリング

発動条件: 同じ写像を巨大回数適用した途中状態の総和も必要なとき。

2^b 回後の写像と、その 2^b 区間での寄与を対にして合成する。

### functional graph 上の線形輸送

発動条件: 各要素の遷移先が一意で、重みが遷移先へ合算されるとき。

写像配列を使ってベクトルを gather し、写像同士も添字参照で合成する。

## 問題固有の要素

最終状態ではなく全時刻平均なので、通常の doubling table に「区間中に何を足したか」を持たせる。

別の問題へ持ち帰る視点: 巨大反復の累積量は、遷移モノイドを作用付きの pair へ拡張すると二分累乗できる。

## 正当性

写像による分布移動は線形。長さ2tの分布総和は前半和と、それをt回写像で移した後半和になる。写像と和を同時倍化しKのbitで結合すれば操作後1..K時刻の和を厳密に得る。最後にKで割ると一様に選ぶ時刻の期待分布。

## 実装上の注意

- 出力対象の時刻が操作前か操作後かを式で固定し、off-by-one を避ける。写像適用では同じ宛先へ来る値を加算し、上書きしない。

## 復習の核

- 反復過程の平均を見たら、まず求める時刻列を明記して和へ直す。次に「2倍区間の後半は前半へ写像を一度作用させたもの」と捉える。

## 計算量と制約

### 時間

N 頂点、時刻上限 K。写像適用と倍化が各 O(N) なので O(N log K)。

### 空間

現在写像と区間和ベクトルだけなら O(N)、全段保存なら O(N log K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times10^5; 1\leq K\leq 10^{18}; K is not a multiple of 998244353.; 1\leq A _ i\leq N\ (1\leq i\leq N); 0\leq B _ i\lt998244353\ (1\leq i\leq N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,1)、初期球分布(1,0)、K=3。

1. 操作後分布は(0,1),(1,0),(0,1)。
2. 三時刻和は(1,2)。
3. K=3で割る。

期待される結果: 期待分布(1/3,2/3)

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

複数頂点が同じ宛先へ移る場合に上書きしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。球数は合流するので宛先値へ加算する。線形写像の係数和を保つ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/editorial/6785) — source-abc310-editorial-6785-613fc6f1ebc6d3c217bb0d69198685d99a6c020d4aa8ea98d2921499ac0fccf5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/tasks/abc310_g) — source-abc310-g-problem-d670b111cffefaec620ceacce53ca59e0ec93e7ceaf9ad40d859cf2758514cb5
