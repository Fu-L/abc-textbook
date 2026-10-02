---
title: "ABC305-G — Banned Substrings"
draft: true
authoringUnit: {"problemId":"abc305-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc305-g.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-recurrence"],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-finite-pattern-automaton","tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc305-editorial-6540-74ea55ef6854c06051d1da5f206ffb783baa289b24f8530c7f7f02f128fa814c","source-abc305-g-problem-19df3c0c00aafaff917749d3a11ee12bf3bfe0ef5929b0a1c26268c9caea49a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"新しく出来る禁止substringは必ず追加文字を末尾に含む。最長6なので旧末尾5文字と新文字で全て検出できる。安全prefixだけの遷移を残すと、そのpathと禁止列を一度も含まない文字列が全単射になる。各追加が同じ遷移なのでN乗の空状態からの全成分和が長さNのsafe列数。","sourceRevisionIds":["source-abc305-editorial-6540-74ea55ef6854c06051d1da5f206ffb783baa289b24f8530c7f7f02f128fa814c","source-abc305-g-problem-19df3c0c00aafaff917749d3a11ee12bf3bfe0ef5929b0a1c26268c9caea49a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

対象外:

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

禁止文字列の長さは全て6以下なので、現在までの文字列へ次の一文字を付けたとき新しく禁止列が現れるかは、現在の末尾5文字以下と追加文字だけで判定できる。

末尾情報の状態数は空文字を含む長さ0から5までの二進文字列で有限だが、Nは10^18で一文字ずつDPできない。各文字追加は同じ線形遷移を反復するため、遷移行列のN乗としてまとめられる。

棄却する候補: 長さごと・末尾状態ごとのDPを1文字ずつN回更新する。

状態数は小さくてもNが10^18なので、反復回数をそのまま消化できない。

採用する候補: 長さ5以下の安全な末尾を状態とするオートマトンを作り、その遷移行列を二分累乗する。

禁止判定に必要な履歴を有限状態へ圧縮でき、固定遷移の巨大回数反復を指数のビット数だけの行列積へ変えられる。

文字cを追加した列のsuffixのどれかが禁止列と一致した遷移だけを除く。一度禁止列を含んだ状態を保持する必要はなく、安全なprefix間の遷移だけで最終文字列を数えられる。

追加後に残すのは末尾min(5,現在長+1)文字で十分である。長さ6の禁止列も、遷移判定時には保存中の5文字と新文字を合わせて確認できる。

a,bからなる長さ0..5の安全な文字列を状態として列挙する。各状態へaまたはbを足し、末尾に禁止列があれば捨て、なければ末尾5文字以下の次状態へ向けて遷移行列の要素を1増やす。空状態の単位ベクトルへ行列のN乗を作用させ、全状態成分を合計する。

## 典型の発動条件

### 禁止substringの有限オートマトン

発動条件: 禁止パターンの最大長が小さく、文字を末尾へ追加しながら回避列を数えるとき。

新しい違反を判定できる末尾だけを状態にし、安全な文字追加を有向遷移にする。

### 線形DPの行列累乗

発動条件: 小さい固定状態間の同じ線形遷移を、非常に多い回数繰り返すとき。

一文字追加の遷移行列を二分累乗し、長さ10^18までの反復を飛ばす。

## 問題固有の要素

最大禁止長6に対して保存長は6ではなく5でよく、6文字目を追加する瞬間に違反を検出してから古い先頭を捨てる。

別の問題へ持ち帰る視点: 局所パターンを避ける逐次構成では、判定時に追加要素も使えるため、状態が保持すべき履歴は最大パターン長−1まで縮められる。

## 正当性

新しく出来る禁止substringは必ず追加文字を末尾に含む。最長6なので旧末尾5文字と新文字で全て検出できる。安全prefixだけの遷移を残すと、そのpathと禁止列を一度も含まない文字列が全単射になる。各追加が同じ遷移なのでN乗の空状態からの全成分和が長さNのsafe列数。

## 実装上の注意

- 短い禁止列も含め、追加後の文字列の全suffixを照合する。禁止列自身を状態から除くだけでは、その列を既に内部へ含む長い状態を誤って残す可能性がある。
- 行列の向きとベクトルの左右を統一し、N=1や空状態からの最初の遷移で転置ミスを検査する。積ごとに998244353で剰余を取る。

## 復習の核

- 最大長2の禁止列で末尾1文字オートマトンを手で作り、『禁止列を新たに作るのは末尾だけ』という局所性を確認してから、保存長5と行列累乗へ一般化する。

## 計算量と制約

### 時間

O(S³ log N+M·S·6)、S≤1+2+4+8+16+32=63。末尾状態行列を累乗する。

### 空間

O(S²+Σ|s_i|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq10^{18}; 1\leq M\leq126; N and M are integers.; s _ i is a non-empty string of length at most 6 consisting of a and b.; s _ i\neq s _ j\ (1\leq i\lt j\leq M)

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/editorial/6540) — source-abc305-editorial-6540-74ea55ef6854c06051d1da5f206ffb783baa289b24f8530c7f7f02f128fa814c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/tasks/abc305_g) — source-abc305-g-problem-19df3c0c00aafaff917749d3a11ee12bf3bfe0ef5929b0a1c26268c9caea49a5
