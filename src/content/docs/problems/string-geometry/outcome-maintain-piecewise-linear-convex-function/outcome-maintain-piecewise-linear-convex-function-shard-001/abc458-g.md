---
title: "ABC458-G — Children Yearn for the Evil Kindergarten"
draft: true
authoringUnit: {"problemId":"abc458-g","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc458-g.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-monotone-search"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0","source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"脱出予定者mだけを追えば他者は初日に脱落させられ、余計な支出を省ける。固定mの日次DPは残人数ごとの最大medalを持ち、収入A−Bx追加、負state除去、脱出ごとのC消費は元処理と一致する。凹折れ線の一次加算と傾きclip/延長はこの最大遷移を正確に実行する。m人数成功から任意少人数へ余分な支出を減らせるため可否は単調、二分探索で最大を得る。","sourceRevisionIds":["source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0","source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=1、A_1=5,B_1=C_1=1。","procedure":["二人へ2枚ずつ配ればB支払後各1枚で二人脱出、残り一枚は任意配分。","三人脱出には各B+C=2枚で合計6枚必要。"],"executionTarget":null,"expectedResult":"最大2人。","verificationStatus":"not_applicable","learningUnitIds":["unit-slope-trick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"prerequisiteIds":["unit-basic-convex-optimization","unit-monotone-search"],"attainmentCondition":"一日でA=1,B=C=1なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0人。"},"answer":{"reasoningOrVerification":"一人脱出にも2枚必要で不足。B支払後の脱出条件を先に判定すると誤る。","procedure":["具体例の各状態・寄与を再計算する。","一人脱出にも2枚必要で不足。B支払後の脱出条件を先に判定すると誤る。"],"expectedResult":"0人。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

B_i>0なので m人全員を脱出させられれば任意のm'<m人でも可能であり、最大mを二分探索できる。固定mでは日ごとの最適所持medalが残人数xの上に凸な関数になる。

採用する候補: mの実現可能性を二分探索し、dp[x]=各日終了時にx人残る最大medalを、一次関数加算・負区間切捨て・傾きC_iでの左側closureとしてslope trickの折れ線dequeで更新する。

reachable xは常に区間でdpはconcaveを保ち、各日追加されるbreakpointは高々一つ、端から削除されるbreakpointは全期間で一度だけなので一判定を線形時間にできる。

棄却する候補: 固定mごとに日数×残人数の表 dp[i][x] を全て更新する。

一判定 O(Nm) でmもN級となり、二分探索を重ねると二乗以上になる。

日iの収支は全stateへ A_i-B_i x という一次関数を加え、負になった両端stateを不可能として削る操作である。

一人脱出させる遷移 dp[x]=max(dp[x],dp[x+1]-C_i) は、左から傾きC_i以上のsegmentを削り、傾きC_iのsegmentを非負範囲へ延ばす操作になる。

feasible(m)をdp[0][m]=0の一点折れ線で初期化する。各日、global切片・傾きへA_i,-B_iを加え、左右端を値0との交点までtrimし、C_iに基づき左側の傾きstackをpop/extendする。最後にx=0がdomain内ならtrueとし、mを整数二分探索する。

## 典型の発動条件

### 人数に対する可能性二分探索

発動条件: 対象人数を減らすと手順をそのまま流用できるresource配分問題のとき。

固定mの全員脱出可能性を単調predicateにする。

### slope trickによるconcave DP

発動条件: 一変数DPが区間domainとconcave折れ線を保ち、一次加算・max closureを繰り返すとき。

傾き変化点をdequeで管理して各breakpointを償却定数回処理する。

## 問題固有の要素

人数dimensionのDPを配列として走査せず、関数形のconcavityとbreakpoint列そのものをstateにできる。

別の問題へ持ち帰る視点: 遷移式を値更新ではなくグラフへの一次関数加算・切断・傾き制約として幾何的に読むとslope trickが見える。

## 正当性

脱出予定者mだけを追えば他者は初日に脱落させられ、余計な支出を省ける。固定mの日次DPは残人数ごとの最大medalを持ち、収入A−Bx追加、負state除去、脱出ごとのC消費は元処理と一致する。凹折れ線の一次加算と傾きclip/延長はこの最大遷移を正確に実行する。m人数成功から任意少人数へ余分な支出を減らせるため可否は単調、二分探索で最大を得る。

## 実装上の注意

- 問題のdpは最大値なので上に凸/concaveの用語と傾き順を実装規約に合わせる。domain端の非負判定、-∞状態、整数交点の丸めを厳密に扱う。

## 復習の核

- 素朴dpの二遷移を先に式で確認し、それぞれが折れ線へ行う三操作を小さいmの配列とgraphで対応づける。

## 計算量と制約

### 時間

O(N log U)、U≤ΣA_i/min B_iは初期追跡人数の安全上限。各判定は償却O(N)の傾きstack。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 3 \times 10^5; 1 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq 10^6; 1 \leq B_i \leq 10^6; 1 \leq C_i \leq 10^6; The sum of N over all test cases is at most 3 \times 10^5.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=1、A_1=5,B_1=C_1=1。

1. 二人へ2枚ずつ配ればB支払後各1枚で二人脱出、残り一枚は任意配分。
2. 三人脱出には各B+C=2枚で合計6枚必要。

期待される結果: 最大2人。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

一日でA=1,B=C=1なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一人脱出にも2枚必要で不足。B支払後の脱出条件を先に判定すると誤る。

確認結果: 0人。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/editorial/20460) — source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/tasks/abc458_g) — source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae
