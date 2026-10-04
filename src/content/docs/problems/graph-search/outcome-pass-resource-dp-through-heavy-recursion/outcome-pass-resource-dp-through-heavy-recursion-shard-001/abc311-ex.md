---
title: "ABC311-EX — Many Illumination Plans"
draft: true
authoringUnit: {"problemId":"abc311-ex","docPath":"src/content/docs/problems/graph-search/outcome-pass-resource-dp-through-heavy-recursion/outcome-pass-resource-dp-through-heavy-recursion-shard-001/abc311-ex.md","learningOutcomeIds":["outcome-pass-resource-dp-through-heavy-recursion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource","unit-rooted-tree-aggregation"],"excludedTopics":["資源DPを引数で渡すHLRecDPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-heavy-light-recursive-dp","tag-knapsack-resource"],"sourceRevisionIds":["source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f","source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"削除後の親は直前残存祖先なので、各子で最初に残す色の二状態で採否を判定できる。子を全て反映したEはvを含まない全合法選択を表す。初期配列からの呼出しでは、反対色のEへ根vの利益と重さを必ず追加した式がF(v)そのものである。その後Eから一度だけ採用枝を作り削除枝と併せた返値は、親の外部選択を正しく延長する。heavy先行では初期配列が同じpath内で共有されるので、trueの呼出しだけで回答を保存すれば各F(v)を外部選択なしで一度ずつ回収できる。light二回評価とheavy一回評価は全選択を保持し、lightサイズ半減の償却により全path先頭の処理量もO(N^(log₂3)(X+1))となる。","sourceRevisionIds":["source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f","source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源DPを引数で渡すHLRecDP](src/content/docs/learn/tree/heavy-light-recursive-dp.md)

- 外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

## 考察

頂点削除は子を親へ付け替えるので、残した集合が良い木になる条件は、祖先方向で直前に残した頂点と色が異なり、重さ総和がX以下であること。ただしF(v)では部分木の根vを削除できない。この必須選択を回答へ戻す段階まで保持する必要がある。

自然な部分木knapsackは子同士のmax-plus畳み込みにO(X²)掛かる。ここでは[HLRecDPの二状態](src/content/docs/learn/tree/heavy-light-recursive-dp.md)を使い、外部で既に選んだ重さ別利益配列dへ子の選択を順に反映する。状態sでは部分木内で最初に残す頂点の色をsに制限し、全削除も許す。dfs(v,d)は採用・削除の両方を含む二配列を返す。この返値の最大は、根必須のF(v)ではない。

子を全て反映し、v自身をまだ選んでいない二配列をE_0,E_1とする。葉では両方d、葉でなければheavy childへdを一回渡して二返値を受け取り、各light child uでは E_s←dfs(u,E_s)_s をs=0,1について別々に行う。重い子だけ入力が共通なので呼出しを一回にできる。

初期配列 d[0]=0、d[t>0]=−∞ からの呼出しでは、この時点で

F(v)=B_v+max_{0≤t≤X−W_v} E_{1−C_v}[t]

を保存する。根vを必ず残すから子側で最初に残す色は1−C_v、子側の重さはX−W_v以下である。W_v≤Xなので子を全て削除するt=0は必ず合法。例えばX=1、根と子の重さが共に1、美しさ0と100、色が異なる場合、返値には根を消して子を残す100があるが、F(根)=0になる。

回答を保存した後、親へ返すR_sをE_sのコピーで初期化して削除枝を残し、各tで

R_{C_v}[t+W_v]=max(R_{C_v}[t+W_v],E_{1−C_v}[t]+B_v)

を更新する。必ずv更新前のEから読み、W_v=0でもvを一回しか選ばない。採用枝と削除枝を併せるこの操作はO(X+1)。

全頂点を独立に開始するとさらにN倍になる。heavy pathの先頭だけへ初期配列を渡す。heavyを最初に処理するため、そのpath上では同じ初期配列がそのまま下へ渡る。`saveAnswer=true`を先頭で付け、heavy childだけへ引き継ぎ、通常のlight呼出しではfalseにする。別のheavy path先頭は新しい初期配列とtrueで開始する。初期配列以外の文脈でF(v)を上書きしてはいけない。

子サイズn_1≥n_2≥…では T(n)≤T(n_1)+2Σ_{i≥2}T(n_i)+O(X+1)。light側が親の半分以下というだけでO(NX log N)にはならず、二回評価の係数も必要である。Unitの償却証明より α=log₂3 として一呼出しO(n^α(X+1))。light深さdのpath先頭のサイズα乗の総和は N^α/2^{d(α−1)} 以下なので、全先頭を合計してもO(N^α(X+1))を保つ。

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

削除後の親は直前残存祖先なので、各子で最初に残す色の二状態で採否を判定できる。子を全て反映したEはvを含まない全合法選択を表す。初期配列からの呼出しでは、反対色のEへ根vの利益と重さを必ず追加した式がF(v)そのものである。その後Eから一度だけ採用枝を作り削除枝と併せた返値は、親の外部選択を正しく延長する。heavy先行では初期配列が同じpath内で共有されるので、trueの呼出しだけで回答を保存すれば各F(v)を外部選択なしで一度ずつ回収できる。light二回評価とheavy一回評価は全選択を保持し、lightサイズ半減の償却により全path先頭の処理量もO(N^(log₂3)(X+1))となる。

## 実装上の注意

- Eはvを選ぶ前、Rは採用・削除を含む返値。Fは初期配列の文脈でのみ保存し、通常のRの最大を答えにしない。
- W_v=0を許すので、更新先Rから読み戻さずEから読む。利益総和は最大2×10^17で64bitが必要。
- heavy処理で作業配列を共有し、light再帰の間だけ親配列を保持する。saveAnswerはheavyだけへ引き継ぐ。

## 復習の核

- 通常の subtree DP の意味をそのまま当てはめず、dfs の入力配列と返値が表す文脈を一段ずつ追う。計算量は light child が半分以下という事実から再帰式を自分で立てる。

## 計算量と制約

### 時間

N木頂点、重さ上限X。heavy recursionの上界 O(N^(log₂3)(X+1))。

### 空間

O(N+(X+1)log(N+1))。入力・回答・heavy分解はO(N)。heavy先行では祖先ごとに配列を確保せず子の返値を受け取り、light再帰でだけ親の二配列を保持する。light深さはO(log N)。全N頂点分のDPを保存しない。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 200; 0 \leq X \leq 50000; 1 \leq P_i \leq i - 1; 0 \leq B_i \leq 10^{15}; 0 \leq W_i \leq X; C_i is 0 or 1.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6814) — source-abc311-editorial-6814-952ca8df25e1dc29d36a2d97bf5823cc8ec71cafd9a762902cea712a7640e19f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_h) — source-abc311-ex-problem-e370488f1342f8751a5f37a9f0b8ab00784f5baee29786d775a1e52907cd7dc1
