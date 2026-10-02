---
title: "ABC419-F — All Included"
draft: true
authoringUnit: {"problemId":"abc419-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-multi-pattern-automaton/outcome-build-multi-pattern-automaton-shard-001/abc419-f.md","learningOutcomeIds":["outcome-build-multi-pattern-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-finite-pattern-automaton","unit-trie-prefix"],"excludedTopics":["Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-aho-corasick","tag-automaton-dp","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc419-editorial-13623-83863d26c9a12a69f07be60afab51ff05603fa4e6f48038a54d1ac0e6c881f43","source-abc419-f-problem-6f4acd79816fc01bc857e64983555f3c7e040847741a7f21ee0fdbd1d0004ee9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Aho–Corasick状態は将来の一致へ必要な最長pattern-prefix suffixを保存する。failure出力をORすれば同時に終わる短patternも記録できる。既出maskは過去出現を忘れず、文字を一つ選ぶ遷移で各生成列を一意に構成する。exact L回後full maskだけ合計するので全patternを含む長さL列を過不足なく数える。","sourceRevisionIds":["source-abc419-editorial-13623-83863d26c9a12a69f07be60afab51ff05603fa4e6f48038a54d1ac0e6c881f43","source-abc419-f-problem-6f4acd79816fc01bc857e64983555f3c7e040847741a7f21ee0fdbd1d0004ee9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Aho–Corasick](src/content/docs/learn/string/aho-corasick.md)

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)
- [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

対象外:

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

文字列を左から生成すると、将来pattern出現に影響する過去情報は「末尾のうちいずれかのS_iのprefixでもある最長suffix」と既出pattern集合だけである。

全pattern長合計は高々80なので、Aho-Corasick automatonでこのsuffix状態と一文字遷移、遷移時に新たに含まれるpattern maskを小さく持てる。

採用する候補: Aho-Corasick状態×既出pattern bitmaskの長さDP

26文字を追加してautomaton遷移し、destinationのoutput maskをORする。dpをL回進めたfull maskの総数が答えで、O(L·states·2^N·26)。

棄却する候補: 26^L個の文字列を生成して各S_iをsubstring検索する

候補数が指数的で、pattern matchingに必要なsuffix情報をautomaton stateへ共有できていない。

failure link先のoutput maskもnodeへ伝播すれば、ある文字追加で終端するpatternだけでなく、そのsuffixとして同時に出現する短いpatternも一度のORで記録できる。

未登録文字の遷移もfailure linkに従うcomplete DFAへ前計算すれば、DP内の一文字遷移をO(1)にできる。

S_iをtrieへ挿入して終端nodeにbit iを立て、BFSでfailure link・全26遷移・累積output maskを構築する。dp[start][0]=1からL文字、各state/mask/charでnextStateへ進みmask|output[nextState]へ加算し、最後にmask=(1<<N)-1を全stateで足す。

## 典型の発動条件

### Aho-Corasick automaton

発動条件: 複数patternのsubstring出現を文字列生成DPの有限suffix状態にしたいとき。

trieとfailure linkでprefix/suffix一致をDFA遷移として前計算する。

### bitmask DP

発動条件: 必要pattern数N≤8で、どれが既出かを追うとき。

automaton output集合をmaskへORして全包含状態を数える。

### 文字列生成DP

発動条件: 固定長のalphabet列を左から作り、有限automatonで性質を判定するとき。

位置・automaton state・付加maskを状態に26遷移する。

## 問題固有の要素

substring条件を各patternごとのKMP状態で別々に持たず、共有prefix trieとfailure suffixで合成した一automatonにまとめる。

別の問題へ持ち帰る視点: 複数substring制約の生成数え上げでは、AC state＋達成maskが標準的な十分統計量になる。

## 正当性

Aho–Corasick状態は将来の一致へ必要な最長pattern-prefix suffixを保存する。failure出力をORすれば同時に終わる短patternも記録できる。既出maskは過去出現を忘れず、文字を一つ選ぶ遷移で各生成列を一意に構成する。exact L回後full maskだけ合計するので全patternを含む長さL列を過不足なく数える。

## 実装上の注意

- failure link構築時にoutput maskを親failからORし、rootの欠損遷移をrootへ張る。DPはexact length L、加算はmod 998244353、rolling arrayでmemoryを抑える。

## 復習の核

- patternが他patternのsubstring、共通prefix、重なって同時出現、Lが最長pattern未満の例を小alphabet全列挙と比較する。

## 計算量と制約

### 時間

O(26L·S·2^N)、S≤1+Σ|S_i|≤81。

### 空間

O(S2^N+26S)。長さ軸rolling。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 8; 1\leq L\leq 100; N and L are integers.; Each S_i is a string of length 1 and 10, inclusive, consisting of lowercase English letters.; S_i\neq S_j\ (i\neq j)

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/editorial/13623) — source-abc419-editorial-13623-83863d26c9a12a69f07be60afab51ff05603fa4e6f48038a54d1ac0e6c881f43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/tasks/abc419_f) — source-abc419-f-problem-6f4acd79816fc01bc857e64983555f3c7e040847741a7f21ee0fdbd1d0004ee9
