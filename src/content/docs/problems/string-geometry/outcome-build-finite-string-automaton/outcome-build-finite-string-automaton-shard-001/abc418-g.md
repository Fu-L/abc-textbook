---
title: "ABC418-G — Binary Operation"
draft: true
authoringUnit: {"problemId":"abc418-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc418-g.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-interval-composition","unit-dp-state-design"],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-finite-pattern-automaton","tag-dp-state-equivalence","tag-interval-partition-dp"],"sourceRevisionIds":["source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b","source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"縮約は全二分括弧付けの結果と同じなので短word membershipはinterval attainable-bit DPで判定できる。公式で確定した有限同値類DFAは任意suffixに対する受理を保つため、同stateの部分列をcount/最早startへ集約しても将来の受理を変えない。各位置で既存substringを一文字延ばし長さ1を一個開始するので全非空substringを一度走査し、受理数と最長長を得る。","sourceRevisionIds":["source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b","source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"演算AND=(00→0,01→0,10→0,11→1)、T=1011。","procedure":["ANDは括弧付けによらず全文字1なら1。","1run長1,2のsubstring数は1+3=4、最大長2。"],"executionTarget":null,"expectedResult":"M=4,L=2。","verificationStatus":"not_applicable","learningUnitIds":["unit-finite-pattern-automaton"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"prerequisiteIds":["unit-dp-interval-composition","unit-dp-state-design"],"attainmentCondition":"同じTでOR演算なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"M=9,L=4。"},"answer":{"reasoningOrVerification":"少なくとも一つ1を含めば受理。全10substringから唯一の0だけを除くので9、全列長4も受理。","procedure":["具体例の各状態・寄与を再計算する。","少なくとも一つ1を含めば受理。全10substringから唯一の0だけを除くので9、全列長4も受理。"],"expectedResult":"M=9,L=4。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

隣接二文字を二項演算で縮約する全手順は、元文字列の順序を保つfull binary parenthesizationに対応する。短い文字列がbeautifulかはinterval DPで最終値1が可能か判定できる。

16個の各二項演算についてbeautiful languageは有限automatonで受理でき、公式の同値類探索を行うとlookahead u≤3で安定し、最小DFAは高々7状態になる。

採用する候補: 短いsuffixに対する受理可否signatureからMyhill-Nerode同値類を漸増推定し、安定したDFAを構築してTの全substringを状態DPで数える

DFA構築は16演算・定数小規模で、各演算のscanは状態数≤7のO(N)。各ending位置でstate別substring数と最早startを更新すればMとLを同時に得られる。

棄却する候補: Tの各substringに対し、全縮約順序または全parenthesizationを試してbeautifulか判定する

substringだけでO(N^2)、parenthesizationも指数的で、languageが小さいfinite-state machineになる性質を使っていない。

≈_{L,u}は「長さu以下の任意suffix zを付けたときの受理可否」が同じprefixを同一視する。代表文字列をBFSで0/1拡張し、signatureが同じものをmergeして遷移を作れる。

DFA scanでは各stateへ到達する「現在位置で終わるsubstring数」を遷移し、新しい長さ1 substringもstart stateから加える。受理stateのcount総和がM、最早startがその位置での最長受理substringを与える。

operation tableごとに短いwordのmembershipをinterval attainable-bit DPで判定し、uを増やしてsignature classesからDFAを構築・最小化し、連続二段が同値なら確定する。Tを左からscanし、cnt'[δ(q,c)]+=cnt[q]とstart=iの新規substringを加え、earliest startもmin遷移する。accepting statesから総数Mと最大長Lを更新する。

## 典型の発動条件

### Myhill-Nerode同値類

発動条件: 文字列languageのprefixを、将来suffixに対する受理挙動だけで有限状態化するとき。

bounded suffix signatureを精密化し、安定したclassをDFA stateにする。

### DFA上の全substring DP

発動条件: 固定文字列の全substringについてregular language受理数と最長長を求めるとき。

ending位置ごとに全stateのcountと最早startを一文字遷移する。

### interval parsing DP

発動条件: 短いwordを二項演算で任意順に縮約した到達値を判定するとき。

区間分割と左右到達bitの組から区間の可能値集合を求める。

## 問題固有の要素

16caseを人手分類せず、受理languageへの短いsuffix実験から最小DFAそのものを生成し、その小ささを利用して全substringを一括処理する。

別の問題へ持ち帰る視点: 状態分類が難しい小parameter languageでは、bounded continuation signatureを列挙し、automatonが安定するまで自動推論する方法が使える。

## 正当性

縮約は全二分括弧付けの結果と同じなので短word membershipはinterval attainable-bit DPで判定できる。公式で確定した有限同値類DFAは任意suffixに対する受理を保つため、同stateの部分列をcount/最早startへ集約しても将来の受理を変えない。各位置で既存substringを一文字延ばし長さ1を一個開始するので全非空substringを一度走査し、受理数と最長長を得る。

## 実装上の注意

- beautifulは非空なのでempty start stateの受理をsubstring集計へ混ぜない。演算indexは00=A,01=B,10=C,11=D、MはO(N^2)なので64 bit、受理なしならL=-1とする。

## 復習の核

- N=1、常に0／常に1の演算、XOR/XNOR型を全substring interval DPと比較し、生成DFAを短い全wordで再検証する。

## 計算量と制約

### 時間

O(16·sN+構築費)、s≤7は公式で確認されたDFA状態数。固定演算はO(N)。

### 空間

O(s+構築用短word表)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; N is an integer.; T is a string of length N consisting of 0 and 1.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

演算AND=(00→0,01→0,10→0,11→1)、T=1011。

1. ANDは括弧付けによらず全文字1なら1。
2. 1run長1,2のsubstring数は1+3=4、最大長2。

期待される結果: M=4,L=2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じTでOR演算なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

少なくとも一つ1を含めば受理。全10substringから唯一の0だけを除くので9、全列長4も受理。

確認結果: M=9,L=4。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/editorial/13620) — source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/tasks/abc418_g) — source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3
