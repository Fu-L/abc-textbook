---
title: "ABC311-EX — Many Illumination Plans"
draft: true
authoringUnit: {"problemId":"abc311-ex","docPath":"src/content/docs/problems/graph-search/outcome-pass-resource-dp-through-heavy-recursion/outcome-pass-resource-dp-through-heavy-recursion-shard-001/abc311-ex.md","learningOutcomeIds":["outcome-pass-resource-dp-through-heavy-recursion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource","unit-rooted-tree-aggregation"],"excludedTopics":["資源DPを引数で渡すHLRecDPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-heavy-light-recursive-dp","tag-knapsack-resource"],"sourceRevisionIds":["source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f","source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"削除後の親は直前残存祖先なのでその色だけが採否を決める。重さDPを親側から渡すと採用/削除の局所更新はO(X)。heavy側の共有分岐一回とlight二回評価が元全選択を保持し、lightサイズ半減で再帰量を3分岐型へ償却する。各subtree根は削除不可として全F(v)を回収する。","sourceRevisionIds":["source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f","source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-pass-resource-dp-through-heavy-recursion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、色(0,0,1)、美しさ(2,10,5)、重さ各1、X=2。","procedure":["F1は2を削除して1–3を残すと色不同、重さ2、美しさ7。","F2は2–3で重さ2、美しさ15。","F3は自身5。"],"executionTarget":null,"expectedResult":"F=(7,15,5)","verificationStatus":"not_applicable","learningUnitIds":["unit-heavy-light-recursive-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-pass-resource-dp-through-heavy-recursion"],"prerequisiteIds":["unit-dp-subset-resource","unit-rooted-tree-aggregation"],"attainmentCondition":"F1計算で根1も削除して2,3だけ残せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。取り出したsubtreeの根は削除できないのでF1では必ず1を残す。"},"answer":{"reasoningOrVerification":"不可。取り出したsubtreeの根は削除できないのでF1では必ず1を残す。","procedure":["具体例の各状態・寄与を再計算する。","不可。取り出したsubtreeの根は削除できないのでF1では必ず1を残す。"],"expectedResult":"不可。取り出したsubtreeの根は削除できないのでF1では必ず1を残す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源DPを引数で渡すHLRecDP](src/content/docs/learn/tree/heavy-light-recursive-dp.md)

- 外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 資源DPを引数で渡すHLRecDPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点削除は子を親へ付け替えるので、残した頂点集合が良い木になる条件は、祖先方向で直前に残した頂点と色が異なること、および重さ合計 X 以下である。自然な部分木 knapsack は子同士の max-plus convolution が X² になる。 結合を bottom-up で畳み込む代わりに、親側から渡された DP 配列を参照して「この頂点を残す/消す」の二分岐を top-down に評価すれば、各局所処理は O(X) になる。 top-down DP の引数は「部分木単独の答え」ではなく、ここまでの選択を織り込んだ配列であり、参照渡しと返値の意味を通常の木 DP と混同しない。 最大子を heavy にすれば二回呼ばれる各 light 部分木は親の半分以下で、三分木型の再帰評価から指数が log_2 3 に落ちる。

採用する候補: heavy child には DP 配列を一度だけ渡し、light child の二分岐だけ複製する重軽再帰 DP を全 heavy path の根から実行する。

再帰量が f(n)≤f(n1)+2f(n2)+O(X)≤3f(n/2)+O(X) となり、全根列挙も O(N^{log2 3}X) に収まる。

棄却する候補: 各根について子の部分木 knapsack を max-plus convolution で順に merge する。

一根でも O(NX²)、全 N 根ではさらに一桁増え、X=50000 を扱えない。

top-down DP の引数は「部分木単独の答え」ではなく、ここまでの選択を織り込んだ配列であり、参照渡しと返値の意味を通常の木 DP と混同しない。

最大子を heavy にすれば二回呼ばれる各 light 部分木は親の半分以下で、三分木型の再帰評価から指数が log_2 3 に落ちる。

部分木サイズから heavy child を決める。dfs(c,dp) で c を残す/削る場合の配列を O(X) で作り、heavy child は共有できる一方の経路を一回、各 light child は必要な二状態へ再帰させる。根1で全 heavy path を構成した後、各 heavy path 根から初期配列を渡すことで、その path 上の全 v の F(v) を同時に回収する。

## 典型の発動条件

### 重軽再帰 DP (HLRecDP)

発動条件: 木 DP の子 merge が高価だが、外部 DP を引数にした top-down 分岐として書き換えられるとき。

最大部分木を一回だけ処理し、小さい子だけ複製して再帰木の総量を抑える。

### heavy path 単位の全方位列挙

発動条件: 各頂点を根とする値が必要で、同じ初期状態が heavy edge を越えて再利用できるとき。

各 heavy path の根だけから計算を始め、path 内の全根候補を一走査で得る。

## 問題固有の要素

畳み込みを高速化するのでなく、DP の評価方向を反転して merge 自体を消すことが核心である。

別の問題へ持ち帰る視点: 遷移の algebra が難しいときは、同じ決定木を top-down に評価し直し、コピー回数を分解で抑えられないか考える。

## 正当性

削除後の親は直前残存祖先なのでその色だけが採否を決める。重さDPを親側から渡すと採用/削除の局所更新はO(X)。heavy側の共有分岐一回とlight二回評価が元全選択を保持し、lightサイズ半減で再帰量を3分岐型へ償却する。各subtree根は削除不可として全F(v)を回収する。

## 実装上の注意

- DP 配列の参照・move・コピーの所有権を設計し、light edge 深さ O(log N) 分だけ確保する。色条件は直前に残る祖先との関係として分岐へ正しく組み込む。

## 復習の核

- 通常の subtree DP の意味をそのまま当てはめず、dfs の入力配列と返値が表す文脈を一段ずつ追う。計算量は light child が半分以下という事実から再帰式を自分で立てる。

## 計算量と制約

### 時間

N木頂点、重さ上限X。heavy recursionの上界 O(N^(log₂3)(X+1))。

### 空間

top-down配列を必要branchだけ保持する安全な上界 O(N(X+1))、入力O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 200; 0 \leq X \leq 50000; 1 \leq P_i \leq i - 1; 0 \leq B_i \leq 10^{15}; 0 \leq W_i \leq X; C_i is 0 or 1.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、色(0,0,1)、美しさ(2,10,5)、重さ各1、X=2。

1. F1は2を削除して1–3を残すと色不同、重さ2、美しさ7。
2. F2は2–3で重さ2、美しさ15。
3. F3は自身5。

期待される結果: F=(7,15,5)

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

F1計算で根1も削除して2,3だけ残せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。取り出したsubtreeの根は削除できないのでF1では必ず1を残す。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6814) — source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_h) — source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1
