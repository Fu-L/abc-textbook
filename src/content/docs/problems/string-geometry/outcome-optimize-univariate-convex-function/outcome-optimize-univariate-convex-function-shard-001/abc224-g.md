---
title: "ABC224-G — Roll or Increment"
draft: true
authoringUnit: {"problemId":"abc224-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-univariate-convex-function/outcome-optimize-univariate-convex-function-shard-001/abc224-g.md","learningOutcomeIds":["outcome-optimize-univariate-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc224-editorial-2816-092c55acb67922ed532903f2a80456d83768e4b1f92e1282c7087463f2c55a92","source-abc224-g-problem-fe18c86a06443c15aef802f40b20abb901129623e2f8687d75fb58216dbace72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"将来振り直すことが確定している経路で先に増加するのは、振り直し後の分布を変えず費用だけ増やすため不要である。振り直し後は目標T以下のうち増加費用が小さい連続区間だけを受け入れればよい。区間幅Xの成功確率はX/Nで、成功までの振り直し費用はBN/X、受理位置からの平均増加費用はA(X−1)/2。よってこの和f(X)を1≤X≤Tで最小化する。fは下に凸で実数最小点はsqrt(2BN/A)なので、範囲へ制限した隣接整数の比較で整数最適値を得る。初期位置Sから直接増加できる場合のA(T−S)も比較する。","sourceRevisionIds":["source-abc224-editorial-2816-092c55acb67922ed532903f2a80456d83768e4b1f92e1282c7087463f2c55a92","source-abc224-g-problem-fe18c86a06443c15aef802f40b20abb901129623e2f8687d75fb58216dbace72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-univariate-convex-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=6,S=6,T=3,A=B=1。","procedure":["受理する出目を1,2,3にするとX=3。成功確率は1/2なので平均2回振る。","成功後の増加回数は2,1,0の平均1。費用は2+1=3。","X=1の費用は6、X=2は3.5。初期S>Tなので直接増加では目標へ戻れない。"],"executionTarget":null,"expectedResult":"最小期待費用は3。","verificationStatus":"not_applicable","learningUnitIds":["unit-basic-convex-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-univariate-convex-function"],"prerequisiteIds":[],"attainmentCondition":"S=Tの入力でも振り直し方針だけを評価してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"すでに目標なので操作せず費用0。振り直し費用は正であり、初期位置からの直接到達候補を落としてはならない。"},"answer":{"reasoningOrVerification":"すでに目標なので操作せず費用0。振り直し費用は正であり、初期位置からの直接到達候補を落としてはならない。","procedure":["具体例の各状態・寄与を再計算する。","すでに目標なので操作せず費用0。振り直し費用は正であり、初期位置からの直接到達候補を落としてはならない。"],"expectedResult":"すでに目標なので操作せず費用0。振り直し費用は正であり、初期位置からの直接到達候補を落としてはならない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

- 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

出目だけが将来を決めるがNは10^9なので状態別DPは作れない。増加した直後に目標へ着く前に振り直す戦略は、最初から振り直すよりA円だけ損である。

採用する候補: 目標Tの直前X個の出目だけ増加を選ぶ閾値戦略へ絞り、振り直し後の期待費用 f(X)=A(X-1)/2+BN/X を整数X上で最小化する。

支配される『増加してから振る』を除くと増加を選ぶ状態はT直前の連続区間になり、凸な一変数関数だけを比較すればよい。

棄却する候補: 1からNまで各出目の最適期待費用をBellman方程式で反復計算する。

N=10^9 の状態を保持・走査できず、振り直しが全状態へ遷移するため素朴な更新も重い。

閾値区間へ入る確率はX/Nなので入るまでの振り直し回数の期待値はN/X、入った位置は一様なのでTまでの増加回数の期待値は(X-1)/2である。

f(x) は下に凸で実数上の最小点が sqrt(2BN/A) にあるため、整数解はその近傍と範囲端だけを調べればよい。

S≤Tなら直接増加するA(T-S)も候補にし、1≤X≤Tへ丸めた sqrt(2BN/A) 前後の整数について f(X) を評価して最小値を出す。S=Tなら0である。

## 典型の発動条件

### 支配関係からの閾値方策

発動条件: 順序付き状態で二操作を選び、一方を選んだ後に他方へ戻る行動が常に損になるとき。

増加を選ぶ状態が目標直前のsuffixになることを示し、方策全体を区間長X一つへ圧縮する。

### 連続緩和による離散凸最小化

発動条件: 巨大な整数範囲上の目的関数が凸で、実数上の停留点を閉形式で求められるとき。

相加相乗平均または微分で sqrt(2BN/A) を得て、その近傍整数だけを比較する。

## 問題固有の要素

『増加した後に振り直す』が支配されることから、複雑に見える最適方策がT直前の連続X状態だけを増加する形へ固定される。

別の問題へ持ち帰る視点: 確率制御では各状態の方程式を書く前に、操作列の支配関係から方策の単調性・閾値性を証明する。

## 正当性

将来振り直すことが確定している経路で先に増加するのは、振り直し後の分布を変えず費用だけ増やすため不要である。振り直し後は目標T以下のうち増加費用が小さい連続区間だけを受け入れればよい。区間幅Xの成功確率はX/Nで、成功までの振り直し費用はBN/X、受理位置からの平均増加費用はA(X−1)/2。よってこの和f(X)を1≤X≤Tで最小化する。fは下に凸で実数最小点はsqrt(2BN/A)なので、範囲へ制限した隣接整数の比較で整数最適値を得る。初期位置Sから直接増加できる場合のA(T−S)も比較する。

## 実装上の注意

- sqrtで得た候補を1からTへclampし、床・天井とその近傍を評価する。BNやA(T-S)は10^18級なので整数積と浮動小数変換の範囲に注意する。

## 復習の核

- 二操作の最適戦略では、まず『片方をしてからもう片方』が支配されないかを調べ、状態ごとの方程式より先に閾値を探す。

## 計算量と制約

### 時間

実数最小点の床・天井と範囲端の定数個の候補を評価して O(1)。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^9; 1 \leq S, T \leq N; 1 \leq A, B \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=6,S=6,T=3,A=B=1。

1. 受理する出目を1,2,3にするとX=3。成功確率は1/2なので平均2回振る。
2. 成功後の増加回数は2,1,0の平均1。費用は2+1=3。
3. X=1の費用は6、X=2は3.5。初期S>Tなので直接増加では目標へ戻れない。

期待される結果: 最小期待費用は3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=Tの入力でも振り直し方針だけを評価してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

すでに目標なので操作せず費用0。振り直し費用は正であり、初期位置からの直接到達候補を落としてはならない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/editorial/2816) — source-abc224-editorial-2816-092c55acb67922ed532903f2a80456d83768e4b1f92e1282c7087463f2c55a92
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/tasks/abc224_g) — source-abc224-g-problem-fe18c86a06443c15aef802f40b20abb901129623e2f8687d75fb58216dbace72
