---
title: "ABC304-E — Good Graph"
draft: true
authoringUnit: {"problemId":"abc304-e","docPath":"src/content/docs/problems/graph-search/outcome-maintain-connectivity-components/outcome-maintain-connectivity-components-shard-001/abc304-e.md","learningOutcomeIds":["outcome-maintain-connectivity-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components"],"sourceRevisionIds":["source-abc304-e-problem-eceb26672ff8b114ebdbb725a98843b79d1d4e87c576f3cb95f33d4f4da65278","source-abc304-editorial-6504-0562080137e001ac38d8ca6f87d21048aa78824c5b21340ea4dd542855a78354"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一辺追加で併合されるのは二端成分だけ。新たに禁止pairを連結にするのはその二成分pairが登録されている場合に限る。非順序pairを正規化して同一成分関係を保つのでmembership判定が必要十分。各質問は独立でDSUを変えない。","sourceRevisionIds":["source-abc304-e-problem-eceb26672ff8b114ebdbb725a98843b79d1d4e87c576f3cb95f33d4f4da65278","source-abc304-editorial-6504-0562080137e001ac38d8ca6f87d21048aa78824c5b21340ea4dd542855a78354"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-connectivity-components"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"初期辺1–2、禁止(2,3)、質問(1,3),(1,4)。","procedure":["禁止を({1,2},{3})へ圧縮。","1–3はこのpairと一致。","1–4は未登録。"],"executionTarget":null,"expectedResult":"No,Yes","verificationStatus":"not_applicable","learningUnitIds":["unit-dsu-components"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-connectivity-components"],"prerequisiteIds":[],"attainmentCondition":"質問でYesを返した辺をDSUへ追加するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"追加しない。各質問は初期graphに対する独立判定である。"},"answer":{"reasoningOrVerification":"追加しない。各質問は初期graphに対する独立判定である。","procedure":["具体例の各状態・寄与を再計算する。","追加しない。各質問は初期graphに対する独立判定である。"],"expectedResult":"追加しない。各質問は初期graphに対する独立判定である。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

初期グラフ内では頂点そのものではなく連結成分だけが到達可能性を決める。query辺(p,q)の追加で新たに結ばれるのはpの成分とqの成分なので、禁止頂点pairも成分pairへ圧縮できる。 辺(p,q)を加えて禁止pair(x_i,y_i)が初めて連結になる必要十分条件は、非順序対{id(p),id(q)}が{id(x_i),id(y_i)}と一致することである。元グラフがgoodであるため、禁止pairの両端は初期状態で別成分にある。

採用する候補: DSUで成分を求め、禁止成分pairをsetに保持する

各queryを二つの代表元の非順序pairが禁止集合にあるかという一回のmembership判定へ落とせる。

棄却する候補: queryごとに辺を仮追加して禁止pair間の到達可能性を探索する

Q回それぞれにグラフ探索が必要となり、queryが独立である利点を使えず制約を超える。

辺(p,q)を加えて禁止pair(x_i,y_i)が初めて連結になる必要十分条件は、非順序対{id(p),id(q)}が{id(x_i),id(y_i)}と一致することである。元グラフがgoodであるため、禁止pairの両端は初期状態で別成分にある。

全M辺をDSUへunionする。各禁止pair(x_i,y_i)を代表元pair(min(root(x_i),root(y_i)),max(...))へ正規化してsetへ入れる。各query(p,q)も同様に正規化し、setに含まれればNo、含まれなければYesを出力する。

## 典型の発動条件

### 連結成分の縮約

発動条件: 以後の判定が初期グラフ内の個々のpathではなく、どの成分同士を新しい一辺で結ぶかだけに依存する。

DSUの代表元を成分IDとして、頂点pairを成分pairへ置き換える。

### 非順序pairの正規化

発動条件: 無向辺と禁止関係では(a,b)と(b,a)を同一視する必要がある。

代表元の小さい方を先にしたpairをsetまたはhash setのkeyにする。

## 問題固有の要素

各queryは独立で実際にはグラフを更新しないため、禁止成分pairは初期DSU上で一度だけ作ればよく、query後のunionは不要である。

別の問題へ持ち帰る視点: 仮想的な一辺追加queryでは、独立性を確認して基礎グラフの成分縮約を固定すると判定を静的集合検索にできる。

## 正当性

一辺追加で併合されるのは二端成分だけ。新たに禁止pairを連結にするのはその二成分pairが登録されている場合に限る。非順序pairを正規化して同一成分関係を保つのでmembership判定が必要十分。各質問は独立でDSUを変えない。

## 実装上の注意

- 禁止pairとquery pairの双方で同じmin/max正規化を使う。queryは互いに独立なのでYesの場合でもDSUをunionしない。

## 復習の核

- 同一成分内のquery、禁止pairの向きを逆にしたquery、重複する禁止成分pair、複数queryを順に処理してもDSUが変わらないことを確認する。

## 計算量と制約

### 時間

N 頂点、M 辺、K 禁止、Q 質問。DSU O((N+M)α(N))、hash set照会 expected O(K+Q)、ordered setなら O((K+Q)log K)。

### 空間

DSU O(N)、禁止成分pair O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq 2 \times10^5; 1 \leq u_i, v_i \leq N; 1 \leq K \leq 2 \times 10^5; 1 \leq x_i, y_i \leq N; x_i \neq y_i; i \neq j \implies \lbrace x_i, y_i \rbrace \neq \lbrace x_j, y_j \rbrace; For all i = 1, 2, \ldots, K, there is no path connecting vertices x_i and y_i.; 1 \leq Q \leq 2 \times 10^5; 1 \leq p_i, q_i \leq N; p_i \neq q_i; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

初期辺1–2、禁止(2,3)、質問(1,3),(1,4)。

1. 禁止を({1,2},{3})へ圧縮。
2. 1–3はこのpairと一致。
3. 1–4は未登録。

期待される結果: No,Yes

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

質問でYesを返した辺をDSUへ追加するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

追加しない。各質問は初期graphに対する独立判定である。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_e) — source-abc304-e-problem-eceb26672ff8b114ebdbb725a98843b79d1d4e87c576f3cb95f33d4f4da65278
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6504) — source-abc304-editorial-6504-0562080137e001ac38d8ca6f87d21048aa78824c5b21340ea4dd542855a78354
