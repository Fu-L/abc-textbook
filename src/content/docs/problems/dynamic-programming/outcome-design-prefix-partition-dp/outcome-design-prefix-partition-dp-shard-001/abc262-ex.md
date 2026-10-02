---
title: "ABC262-EX — Max Limited Sequence"
draft: true
authoringUnit: {"problemId":"abc262-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc262-ex.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-coordinate-compression","unit-dp-state-design","unit-range-actions"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-contribution-reordering","tag-coordinate-compression","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc262-ex-problem-de2025a355403c5a29188b1a2c77e5202aae675d072424616bc9234ffc54934e","source-abc262-editorial-4481-7dc9800d861a624cb870e308fc7f960ae57d9e219b101185ba6966ef8b2e5058"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"max(A_l..A_r)=xは、その区間の全位置がx以下であることと、少なくとも一位置がxに等しいことに分かれる。まず区間chminで各位置の上限を求める。値xを実現できるのは上限がxの位置だけなので、異なるxの選択は独立になる。同じxの位置を順に処理し、最後にxを選んだ位置が各制約区間の左端以上であることを右端到着時に検査する。xを選ばない位置には上限未満の値の通り数を掛けるので、数値の大小と存在条件を両方満たす配列を一回ずつ数える。","sourceRevisionIds":["source-abc262-ex-problem-de2025a355403c5a29188b1a2c77e5202aae675d072424616bc9234ffc54934e","source-abc262-editorial-4481-7dc9800d861a624cb870e308fc7f960ae57d9e219b101185ba6966ef8b2e5058"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、区間[1,2]の最大値1。","procedure":["各位置は0または1。","少なくとも一つ1を置き(0,1),(1,0),(1,1)。"],"executionTarget":null,"expectedResult":"3通り。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-prefix-partition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"prerequisiteIds":["unit-contribution-reordering","unit-coordinate-compression","unit-dp-state-design","unit-range-actions"],"attainmentCondition":"両位置を0にした状態を右端で残せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"last1が制約左端1未満なので無効化する。上界だけでは最大値の等号を保証しない。"},"answer":{"reasoningOrVerification":"last1が制約左端1未満なので無効化する。上界だけでは最大値の等号を保証しない。","procedure":["具体例の各状態・寄与を再計算する。","last1が制約左端1未満なので無効化する。上界だけでは最大値の等号を保証しない。"],"expectedResult":"last1が制約左端1未満なので無効化する。上界だけでは最大値の等号を保証しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

対象外:

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

位置 i を含む全制約の X の最小値 B_i は A_i の必要上界であり、区間 chmin・一点取得で全位置について求められる。

最大値 X の制約で X の witness になれるのは B_i=X の位置だけで、B_i<X は届かず、B_i>X の位置はその区間内には存在しない。

棄却する候補: 各 A_i を 0,…,M から選ぶ DP に全区間最大値を状態として持たせる。

値域と重なる区間制約の組合せが大きく、位置順だけの局所状態にできない。

採用する候補: B_i ごとに位置をグループ化し、同じ X の圧縮列上で「各指定区間に値 X が少なくとも一つある」数え上げ DP を行い、全 X の答えを掛ける。

各位置の値選択は所属する上界グループだけに関与し、異なる最大値の制約が独立な witness 条件へ分離される。

固定 X の列では各位置に 0,…,X−1 の X 通りと値 X の一通りがあり、最後に X を置いた圧縮位置だけを状態にすれば全区間の witness を判定できる。

右端まで処理した制約 [l,r] は lastX≥l を要求するので、必要下限より前を最後の X とする DP 状態をまとめて無効化できる。

range maximum equality を pointwise envelope B と level-set ごとの hitting constraint に分解し、各levelを last occurrence DP で数える。

## 典型の発動条件

### 区間制約の点ごとの包絡上界

発動条件: 各区間の最大値・最小値が指定され、まず全要素へ必要な上下界を伝播したいとき。

区間 chmin の双対セグメント木で各位置を覆う制約値の最小を取る。

### 値の level set への独立分解

発動条件: 点ごとの上界を作ると、値 X の等号条件を上界がちょうど X の点だけが満たせるとき。

同じ B_i の位置を座標圧縮し、その値の制約だけを投影して独立に数える。

### 最終出現位置 DP

発動条件: 各区間が特別値を少なくとも一つ含む条件を持つ列を数えるとき。

特別値の最後の位置を状態にし、区間右端で許されない古い状態を切り捨てる。

## 問題固有の要素

X 制約の区間を B_i=X の位置列へ射影した結果が空なら、その最大値 X を達成する位置がなく答えは0になる。

別の問題へ持ち帰る視点: 制約を部分集合へ射影して独立化するときは、射影後の実現可能 witness が消えていないか最初に検査する。

## 正当性

max(A_l..A_r)=xは、その区間の全位置がx以下であることと、少なくとも一位置がxに等しいことに分かれる。まず区間chminで各位置の上限を求める。値xを実現できるのは上限がxの位置だけなので、異なるxの選択は独立になる。同じxの位置を順に処理し、最後にxを選んだ位置が各制約区間の左端以上であることを右端到着時に検査する。xを選ばない位置には上限未満の値の通り数を掛けるので、数値の大小と存在条件を両方満たす配列を一回ずつ数える。

## 実装上の注意

- 固定 X の位置を元添字順に並べ、各制約 [L,R] を lower_bound/upper_bound で圧縮区間へ写す。
- 通常値を置く遷移は既存状態を X 倍し、X を置く遷移は全既存状態の和を現在位置の last 状態へ加える。
- 右端ごとの条件は lastX の必要下限の最大を取り、走査中の累積下限より小さい状態を再び数えない。

## 復習の核

- 区間最大値の等式は、全点が X 以下という上界条件と、少なくとも一点が X という witness 条件に分解する。
- 点ごとの最も厳しい制約を先に確定すると、等号を達成できる点が値ごとに分離しないか調べる。

## 計算量と制約

### 時間

O((N+M)log N)、上界envelopeの構築とlevel内のrange DP更新をsegment treeで処理。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \lt 998244353; 1 \leq Q \leq 2 \times 10^5; 1 \leq L_i \leq R_i \leq N \, (1 \leq i \leq Q); 1 \leq X_i \leq M \, (1 \leq i \leq Q); All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、区間[1,2]の最大値1。

1. 各位置は0または1。
2. 少なくとも一つ1を置き(0,1),(1,0),(1,1)。

期待される結果: 3通り。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

両位置を0にした状態を右端で残せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

last1が制約左端1未満なので無効化する。上界だけでは最大値の等号を保証しない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/tasks/abc262_h) — source-abc262-ex-problem-de2025a355403c5a29188b1a2c77e5202aae675d072424616bc9234ffc54934e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/editorial/4481) — source-abc262-editorial-4481-7dc9800d861a624cb870e308fc7f960ae57d9e219b101185ba6966ef8b2e5058
