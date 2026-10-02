---
title: "ABC332-F — Random Update Query"
draft: true
authoringUnit: {"problemId":"abc332-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc332-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc332-editorial-7890-b6db5da6f35bcbe75e94efe972aacbb1dae17b24e342dcdc8e307f8062e698fe","source-abc332-f-problem-24a1fcf4e5c5bb6779072ea00c387425b9402686d993728c49921369d0cd6fd2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間の一箇所だけが変わる操作でも、任意の固定位置から見た置換確率は1/λなので、全位置へ同じ期待値変換を同時に適用してよい。 既存作用f(x)=ax+bの後にg(x)=cx+dを行う合成はg∘f(x)=ca x+(cb+d)で、queryの時間順を逆にしない。 各操作をa=(λ-1)/λ,b=X/λとして区間へ作用させ、M回のrange updateと最終値取得をO((N+M)log N)で処理できる。","sourceRevisionIds":["source-abc332-editorial-7890-b6db5da6f35bcbe75e94efe972aacbb1dae17b24e342dcdc8e307f8062e698fe","source-abc332-f-problem-24a1fcf4e5c5bb6779072ea00c387425b9402686d993728c49921369d0cd6fd2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-range-update-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,8)、区間全体から一位置を選びX=4へ置換。","procedure":["各位置の置換確率は1/2。","期待値は(2+4)/2=3、(8+4)/2=6。"],"executionTarget":null,"expectedResult":"期待値列(3,6)。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-actions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-range-update-action"],"prerequisiteIds":["unit-modular-arithmetic","unit-range-monoid-aggregation"],"attainmentCondition":"長さ1の操作は同じ式でどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"a=0,b=Xなので選ばれた一点は確定的にXへ置換される。"},"answer":{"reasoningOrVerification":"a=0,b=Xなので選ばれた一点は確定的にXへ置換される。","procedure":["具体例の各状態・寄与を再計算する。","a=0,b=Xなので選ばれた一点は確定的にXへ置換される。"],"expectedResult":"a=0,b=Xなので選ばれた一点は確定的にXへ置換される。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

操作区間の各位置pは、長さλのうち1/λでXへ置換され、残り(λ-1)/λで以前の値を保つ。期待値の線形性により位置間の依存を追わず、各E_pを同じaffine写像へ更新できる。

queryは区間一様な変換E←aE+bであり、affine写像同士は合成してもaffine写像のままなので遅延伝搬できる。

採用する候補: 区間affine作用を持つlazy segment treeで期待値列を更新する

各操作をa=(λ-1)/λ,b=X/λとして区間へ作用させ、M回のrange updateと最終値取得をO((N+M)log N)で処理できる。

棄却する候補: 乱択結果の分布や位置間の相関まで状態に持つ

求めるのは各位置の期待値だけで、線形性により周辺期待値の更新が閉じるため過剰な状態である。

棄却する候補: 各queryで区間内の期待値を直接更新する

全区間queryが続けばΘ(NM)となり、N,M≤2×10^5に間に合わない。

区間の一箇所だけが変わる操作でも、任意の固定位置から見た置換確率は1/λなので、全位置へ同じ期待値変換を同時に適用してよい。

既存作用f(x)=ax+bの後にg(x)=cx+dを行う合成はg∘f(x)=ca x+(cb+d)で、queryの時間順を逆にしない。

期待値配列をAで初期化し、各queryのλ=R-L+1と逆元を求め、区間[L,R]へf(x)=((λ-1)/λ)x+X/λをlazy適用する。全操作後に各点を取得しmod 998244353で出力する。

## 典型の発動条件

### 期待値の線形性による周辺量の更新

発動条件: 相関する乱択操作でも、要求が各成分の一次量だけであるとき。

位置ごとの置換確率から期待値の閉じた漸化式を作る。

### range affine lazy propagation

発動条件: 区間全要素へx←ax+bを時系列で適用するとき。

affine作用を合成してlazy tagとし、区間更新を対数時間化する。

## 問題固有の要素

同じ操作内では「どれか一位置だけ」が更新されるという負の相関があるが、各最終A_iの期待値には影響せず周辺期待値だけで完結する。

別の問題へ持ち帰る視点: 確率過程でjoint distributionを持つ前に、求める統計量が線形性で閉じるかを確認する。

## 正当性

区間の一箇所だけが変わる操作でも、任意の固定位置から見た置換確率は1/λなので、全位置へ同じ期待値変換を同時に適用してよい。 既存作用f(x)=ax+bの後にg(x)=cx+dを行う合成はg∘f(x)=ca x+(cb+d)で、queryの時間順を逆にしない。 各操作をa=(λ-1)/λ,b=X/λとして区間へ作用させ、M回のrange updateと最終値取得をO((N+M)log N)で処理できる。

## 実装上の注意

- affine tagのcomposition順序をqueryの適用順に合わせ、λ=1ではa=0,b=Xとなることを確認する。indexの半開区間変換も統一する。

## 復習の核

- N=1、λ=1、同一区間への連続更新を手計算し、二つのaffine作用の順序を逆にした実装との差が出るcaseで検証する。

## 計算量と制約

### 時間

逆元を長さ別に前計算してO(N+M log N)、最終展開O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \leq N, M \leq 2 \times 10^5; 0 \leq A_i \leq 10^9; 1 \leq L_i \leq R_i \leq N; 0 \leq X_i \leq 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,8)、区間全体から一位置を選びX=4へ置換。

1. 各位置の置換確率は1/2。
2. 期待値は(2+4)/2=3、(8+4)/2=6。

期待される結果: 期待値列(3,6)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

長さ1の操作は同じ式でどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

a=0,b=Xなので選ばれた一点は確定的にXへ置換される。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/editorial/7890) — source-abc332-editorial-7890-b6db5da6f35bcbe75e94efe972aacbb1dae17b24e342dcdc8e307f8062e698fe
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/tasks/abc332_f) — source-abc332-f-problem-24a1fcf4e5c5bb6779072ea00c387425b9402686d993728c49921369d0cd6fd2
