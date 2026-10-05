---
title: "ABC301-F — Anti-DDoS"
draft: true
authoringUnit: {"problemId":"abc301-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc301-f.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-normalization"],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-finite-pattern-automaton","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17","source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"`A_y` では固定prefixに含まれるx種類以外の26−x文字が対称であり、そのうちy−x種類を既に?で選んでいる。したがって新しい固定大文字が既出集合に含まれる割合は `(y−x)/(26−x)` で、残りは新種類として加わる。`?` の52文字は状態定義どおり小文字、既出大文字、新大文字へ漏れなく分かれる。固定小文字はA_y,Cを保ちBをCへ進め、固定大文字はA_yを上記の割合で分け、Bを保ち、Cからの遷移を禁止完成として除く。これらは部分列が完成する瞬間をちょうど除外するので、DPは全ての未禁止prefixを一度ずつ数える。","sourceRevisionIds":["source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17","source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md) — 対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。

## 考察

禁止部分列は「同じ大文字が2回、その後に小文字、その後に大文字」が揃った時点で完成する。未重複段階では具体的な大文字集合を持たず、種類数 `y` だけを持てばよい。状態は `A_y (0≤y≤26)`（重複前）、`B`（重複後でまだ小文字なし）、`C`（重複後に小文字あり、後続大文字なし）の計29個。

`?` から `A_y` は26通りの小文字でA_y、y通りの既出大文字でB、26−y通りの新大文字でA_{y+1}へ進む。Bは大文字26通りでB、小文字26通りでC。Cは小文字26通りでC、大文字は全て禁止完成として捨てる。固定小文字はA_yとCに留まり、BからはCへ進む。固定大文字はBではBへ、Cでは禁止完成として除き、A_yからは次の割合で分ける。

固定大文字を読むときは、固定prefixに既出の大文字種類数をxとして持つ。既出固定文字ならA_yから必ずBへ進む。新しい固定文字なら、A_yのうち割合 `(y−x)/(26−x)` が既にその文字を?で使っておりBへ、残り `(26−y)/(26−x)` が未使用でA_{y+1}へ進む。遷移後にxを一つ増やす。

採用する候補: 文字集合の対称性で種類数へ圧縮した29状態DP

?由来の大文字は固定文字以外で対称なので、既出種類数だけで遷移係数を決められる。

棄却する候補: 既出大文字集合2^26をそのまま状態にする。

文字列長3×10^5に対して状態が大きすぎる。

初期値は `A_0=1`、他のDP状態0、`x=0`。全文字を処理した後の `Σ_{y=0}^{26}A_y+B+C` が答えである。禁止が完成する遷移だけを捨てているので、残る全状態を集計する。

## 典型の発動条件

### automaton DP

発動条件: 禁止/要求subsequenceの進行が有限状態で表せる。

文字列prefixごとに最長進行段階を更新する。

### 対称性による集合圧縮

発動条件: 26文字集合の種類名でなくcardinalityだけが遷移確率に効く。

既出大文字数yを状態にする。

## 問題固有の要素

固定大文字と?由来大文字を分け、具体名の対称性を種類数へ圧縮することで2^26を29状態に落とす。

別の問題へ持ち帰る視点: alphabet対称性がある集合状態はサイズ統計へ縮約する。

## 正当性

`A_y` では固定prefixに含まれるx種類以外の26−x文字が対称であり、そのうちy−x種類を既に?で選んでいる。したがって新しい固定大文字が既出集合に含まれる割合は `(y−x)/(26−x)` で、残りは新種類として加わる。`?` の52文字は状態定義どおり小文字、既出大文字、新大文字へ漏れなく分かれる。固定小文字はA_y,Cを保ちBをCへ進め、固定大文字はA_yを上記の割合で分け、Bを保ち、Cからの遷移を禁止完成として除く。これらは部分列が完成する瞬間をちょうど除外するので、DPは全ての未禁止prefixを一度ずつ数える。

## 実装上の注意

- 状態は `A_0,…,A_26,B,C` の29個。固定prefixの大文字種類数xは、固定大文字を読むたび、重複判定より後で更新する。
- 固定大文字の係数はmod上で分数として計算し、`26−x` は新しい固定文字がある間だけ分母にする。?は小文字26通り・大文字26通りで数える。

## 復習の核

- 短文字列の52^q全探索と比較し、同大文字2回、重複間/後の小文字、?だけの例を確認する。

## 計算量と制約

### 時間

O(29|S|)。固定prefix大文字種類と定数状態DP。

### 空間

O(29+26)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S consists of uppercase English letters, lowercase English letters, and ?.; The length of S is between 4 and 3\times 10^5, inclusive.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6331) — source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_f) — source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9
