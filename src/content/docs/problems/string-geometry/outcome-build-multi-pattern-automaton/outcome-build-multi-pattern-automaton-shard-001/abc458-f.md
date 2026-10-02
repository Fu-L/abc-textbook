---
title: "ABC458-F — Critical Misread"
draft: true
authoringUnit: {"problemId":"abc458-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-multi-pattern-automaton/outcome-build-multi-pattern-automaton-shard-001/abc458-f.md","learningOutcomeIds":["outcome-build-multi-pattern-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-finite-pattern-automaton","unit-linear-recurrence","unit-trie-prefix"],"excludedTopics":["Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-aho-corasick","tag-automaton-dp","tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc458-editorial-20159-cd84e0dd7d040aa4baf7a31029f7f976734f461304118f5d9ee6f64a7b64bfca","source-abc458-f-problem-4cc44c1d7cc919609272d3502594318f2f3965b58e2e08c63cb2dcb24d0cbd27"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"AC状態は将来の禁止検出に必要なsuffixを完全に保存する。failure祖先terminalも伝播したunsafe stateへの遷移を落とせば、safe graphのpathと禁止を含まない列が全単射。matrix要素は同state間の文字数を表すので積は文字選択の全方法を数え、N乗のroot分布成分和がsafe長N列数になる。","sourceRevisionIds":["source-abc458-editorial-20159-cd84e0dd7d040aa4baf7a31029f7f976734f461304118f5d9ee6f64a7b64bfca","source-abc458-f-problem-4cc44c1d7cc919609272d3502594318f2f3965b58e2e08c63cb2dcb24d0cbd27"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Aho–Corasick](src/content/docs/learn/string/aho-corasick.md)

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)
- [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

対象外:

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

禁止文字列をまだ含まないprefixの将来は、禁止patternのprefixでもある最長suffixだけで決まる。この状態集合はAho-Corasick trieのnodeに一致する。

採用する候補: 禁止patternからAho-Corasick automatonを作り、禁止出力stateを除いた文字遷移数行列 M を構築して、初期vectorに M^N を掛ける。

automaton stateがpattern出現判定に必要十分なsuffix情報を保持し、長さ一文字のDP遷移は時刻に依存しないため巨大Nを行列二分累乗できる。

棄却する候補: 末尾最大K文字をそのままstateにしたDPをN段行う。

state数が26^K、段数がN≤10^9で両方とも制約を超える。

failure linkにより現在suffixに文字cを足した後の最長pattern prefix suffixへ定数時間遷移できる。

同じstate pairへ移る文字種類数を行列要素として足し、pattern terminalまたはそのfailure祖先terminalのstateへの遷移を除外する。

全patternをtrieへ入れfailure linkとcomplete gotoをBFS構築し、terminal伝播する。safe node間で26文字の遷移をcountしたmatrixを作り、root one-hot vectorをbinary exponentiationでN回遷移させ、safe state成分を総和する。

## 典型の発動条件

### Aho-Corasick automaton DP

発動条件: 複数禁止patternを含まない文字列数を数えたいとき。

最長prefix-suffix状態とfailure linkで全patternを同時監視する。

### 遷移行列の二分累乗

発動条件: 有限automaton上の固定遷移を巨大長だけ繰り返すとき。

文字種類数を重みとするstate遷移行列を累乗する。

## 問題固有の要素

末尾文字列DPは、将来patternを完成させる可能性が同じsuffixをautomaton stateとして最小化できる。

別の問題へ持ち帰る視点: 長さが巨大なautomaton DPは、遷移が時間一様なら線形漸化式の行列累乗へ移す。

## 正当性

AC状態は将来の禁止検出に必要なsuffixを完全に保存する。failure祖先terminalも伝播したunsafe stateへの遷移を落とせば、safe graphのpathと禁止を含まない列が全単射。matrix要素は同state間の文字数を表すので積は文字選択の全方法を数え、N乗のroot分布成分和がsafe長N列数になる。

## 実装上の注意

- failure先terminalを含むnodeも禁止stateとして伝播し、そこへの遷移を数えない。行列の行列vector向きとN=0基底を統一する。

## 復習の核

- pattern prefix集合とfailure遷移を小例で構築し、terminal伝播後のsafe遷移行列が一文字DPを正確に表すか確認する。

## 計算量と制約

### 時間

O(S³ log N+26S)、S≤1+Σ|S_i|≤101。AC安全state行列のN乗。

### 空間

O(S²+Σ|S_i|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 10^9, inclusive.; K is an integer between 1 and 10, inclusive.; S_i is a string consisting of lowercase English letters with length between 1 and 10, inclusive.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/editorial/20159) — source-abc458-editorial-20159-cd84e0dd7d040aa4baf7a31029f7f976734f461304118f5d9ee6f64a7b64bfca
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/tasks/abc458_f) — source-abc458-f-problem-4cc44c1d7cc919609272d3502594318f2f3965b58e2e08c63cb2dcb24d0cbd27
