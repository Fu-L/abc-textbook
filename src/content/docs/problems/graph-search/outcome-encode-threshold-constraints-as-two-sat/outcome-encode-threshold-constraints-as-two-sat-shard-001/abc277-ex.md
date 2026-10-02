---
title: "ABC277-EX — Constrained Sums"
draft: true
authoringUnit: {"problemId":"abc277-ex","docPath":"src/content/docs/problems/graph-search/outcome-encode-threshold-constraints-as-two-sat/outcome-encode-threshold-constraints-as-two-sat-shard-001/abc277-ex.md","learningOutcomeIds":["outcome-encode-threshold-constraints-as-two-sat"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-scc-condensation"],"excludedTopics":["2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-two-sat"],"sourceRevisionIds":["source-abc277-editorial-5207-6e0fa737968738d83a5f216d3ce3780e5818ae8d70b54fb98eef329608c7cc66","source-abc277-ex-problem-6b66963c10929368400c3d4badf7542aecb515fea846906ca819168da6941245"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"threshold列の単調性と端固定で各boolean割当は一整数に対応する。和下限・上限は全thresholdでのORclauseへ同値変換できるため2-SAT可解性と元整数制約可解性が一致。矛盾SCCがなければ最大true thresholdを復元する。","sourceRevisionIds":["source-abc277-editorial-5207-6e0fa737968738d83a5f216d3ce3780e5818ae8d70b54fb98eef329608c7cc66","source-abc277-ex-problem-6b66963c10929368400c3d4badf7542aecb515fea846906ca819168da6941245"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-encode-threshold-constraints-as-two-sat"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,M=2、3≤X1+X2≤3。","procedure":["X1=1,X2=2なら各threshold列は単調。","和3で上下clauseを満たす。","例えばX1=X2=0は下限clauseに反する。"],"executionTarget":null,"expectedResult":"可解、例(1,2)","verificationStatus":"not_applicable","learningUnitIds":["unit-two-sat"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-encode-threshold-constraints-as-two-sat"],"prerequisiteIds":["unit-scc-condensation"],"attainmentCondition":"thresholdの単調clauseを省くと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"true,false,trueのような整数に対応しない列が許され元制約と対応が失われる。"},"answer":{"reasoningOrVerification":"true,false,trueのような整数に対応しない列が許され元制約と対応が失われる。","procedure":["具体例の各状態・寄与を再計算する。","true,false,trueのような整数に対応しない列が許され元制約と対応が失われる。"],"expectedResult":"true,false,trueのような整数に対応しない列が許され元制約と対応が失われる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [2-SAT・含意グラフ](src/content/docs/learn/graph/two-sat.md)

- 整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [SCC・縮約DAG・トポロジカル順序](src/content/docs/learn/graph/scc-condensation.md)

対象外:

- 2-SAT・含意グラフの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各X_iは0,…,Mの小さな整数だが、Q個のsum区間制約がcycleを作るため、変数順に決める単純DPにはならない。 threshold命題P_{i,j}: j≤X_iを導入すると、整数値1個がjに関してtrueからfalseへ一度だけ切り替わるboolean列になる。 L≤X_A+X_Bは全整数tについて P_{A,t}∨P_{B,L-t+1}、X_A+X_B≤Rは ¬P_{A,t}∨¬P_{B,R-t+1} と同値になる。 P_{i,0}=true、P_{i,M+1}=false、P_{i,j}⇒P_{i,j-1}を加えると、satisfying assignmentから最大true thresholdをX_iとして復元できる。

採用する候補: 各threshold P_{i,j}を2-SAT変数にし、上下界のsum条件を全tに対する2-literal clauseへ変換してSCCで解く。

M≤100によりNM変数を持て、二変数和の整数不等式をthreshold ORへ正確に線形化できる。

棄却する候補: 各X_iのM+1候補を頂点にした一般CSPをbacktrackingする。

constraint graphに木構造の保証がなく、候補割当ては指数的になる。

L≤X_A+X_Bは全整数tについて P_{A,t}∨P_{B,L-t+1}、X_A+X_B≤Rは ¬P_{A,t}∨¬P_{B,R-t+1} と同値になる。

P_{i,0}=true、P_{i,M+1}=false、P_{i,j}⇒P_{i,j-1}を加えると、satisfying assignmentから最大true thresholdをX_iとして復元できる。

iごとにthreshold 0,…,M+1を用意し、端のunit clauseと単調clauseを張る。各queryと関連tについてlower/upperの2-SAT clauseを追加し、implication graphのSCCで矛盾を判定する。可解なら各iの最大true jを出力する。

## 典型の発動条件

### threshold boolean化

発動条件: 小範囲整数変数への大小・和不等式をboolean制約へ落としたいとき。

j≤Xという単調命題列を作り、値をtrue prefixの長さとして表す。

### 2-SAT

発動条件: 各制約が二つのboolean literalのORへ表せ、全体の可解性と一解が必要なとき。

clauseを2本のimplicationへし、literalと否定が同SCCか調べる。

## 問題固有の要素

二変数和のlower/upper boundは、全cut位置tで『片方がcutを越える』というORの族に変換できる。

別の問題へ持ち帰る視点: 整数和制約では閾値を一方へ配分するcutを全列挙し、forbiddenな同時閾値を二項clauseにできないか考える。

## 正当性

threshold列の単調性と端固定で各boolean割当は一整数に対応する。和下限・上限は全thresholdでのORclauseへ同値変換できるため2-SAT可解性と元整数制約可解性が一致。矛盾SCCがなければ最大true thresholdを復元する。

## 実装上の注意

- threshold indexが0未満なら常true、M+1超なら常falseとしてclauseを簡約し、配列外参照を避ける。
- A_i=B_iのqueryでも同じ変数のliteralを正しく簡約し、復元後に全sum制約を再検査すると安全である。

## 復習の核

- L=5のlower boundでt=X_A+1を選ぶ反証と、true thresholdがprefixになる単調clauseを小さなMで確認する。

## 計算量と制約

### 時間

N整数変数、上限M、Q和制約。threshold変数O(NM)、clause O((N+Q)M)、SCCで同時間。

### 空間

implication graph O((N+Q)M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10000; 1 \leq M \leq 100; 1 \leq Q \leq 10000; 1 \leq A_i, B_i \leq N; 0 \leq L_i \leq R_i \leq 2 \times M; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,M=2、3≤X1+X2≤3。

1. X1=1,X2=2なら各threshold列は単調。
2. 和3で上下clauseを満たす。
3. 例えばX1=X2=0は下限clauseに反する。

期待される結果: 可解、例(1,2)

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

thresholdの単調clauseを省くと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

true,false,trueのような整数に対応しない列が許され元制約と対応が失われる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/editorial/5207) — source-abc277-editorial-5207-6e0fa737968738d83a5f216d3ce3780e5818ae8d70b54fb98eef329608c7cc66
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/tasks/abc277_h) — source-abc277-ex-problem-6b66963c10929368400c3d4badf7542aecb515fea846906ca819168da6941245
