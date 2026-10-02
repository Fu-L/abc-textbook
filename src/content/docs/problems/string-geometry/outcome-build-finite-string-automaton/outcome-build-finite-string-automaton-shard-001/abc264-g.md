---
title: "ABC264-G — String Fair"
draft: true
authoringUnit: {"problemId":"abc264-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc264-g.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-detect-improving-cycles"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-finite-pattern-automaton","tag-shortest-path"],"sourceRevisionIds":["source-abc264-g-problem-09dddce54ca2e241785fe37fb400d3c7bc821302dc9139e62bd5831725eae29f","source-abc264-editorial-4580-9a15438df46f1a33d6d81400041f5950bad8c5ea8f0953e5f683c001e42709d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"次文字の追加で新しく生まれる得点項は長さ1,2,3の接尾辞だけなので、末尾二文字とdummy初期文字が将来に必要十分な状態。辺重みをその三項の和にすると非空文字列と始点から一回以上進んだwalkの得点が一致する。到達可能な正閉路は反復して無限大にできる。正閉路がなければ閉路を除いて得点を悪化させない有限最長walkが存在し、Bellman-Ford型最大緩和で求まる。始点の空文字得点0を候補に入れてはいけない。","sourceRevisionIds":["source-abc264-g-problem-09dddce54ca2e241785fe37fb400d3c7bc821302dc9139e62bd5831725eae29f","source-abc264-editorial-4580-9a15438df46f1a33d6d81400041f5950bad8c5ea8f0953e5f683c001e42709d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。
- 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

文字を一つ末尾へ追加したとき新たに発生する長さ1〜3の出現は、その文字と追加前の末尾2文字だけで決まる。

一度加点済みのprefixは将来へ影響しないため、現在文字列を末尾2文字だけの有限状態へ圧縮できる。

棄却する候補: 文字列長を伸ばしながら全ての文字列を列挙し、美しさの最大値を更新する。

長さに上限がなく各長さで26分岐し、Infinity判定もできない。

採用する候補: 末尾2文字を頂点、次文字追加を重み付き辺とするグラフを作り、初期状態 $$ からの最大walkと到達可能な正閉路をBellman-Ford型緩和で調べる。

全文字列が始点からのwalkに一対一対応し、正重みcycleがあれば反復して無限大、なければ有限最大距離になる。

状態 xy から文字 z を追加する辺は yz へ進み、重み P(z)+P(yz)+P(xyz) を持つ。

ダミー文字 $ を二つ置き、$を含むpatternの点数を0にすれば、長さ1・2のprefixも同じ遷移式で扱える。

bounded-length substring score を de Bruijn 型 suffix automaton のedge weightへ変換し、unbounded sequence optimization を positive-cycle detection 付き longest walk にする。

## 典型の発動条件

### 有限suffix状態への文字列圧縮

発動条件: 次の文字を加えた増分が直前の高々L文字だけで決まるとき。

末尾L文字を状態、文字追加をshift遷移とする有限オートマトンを構築する。

### 最大walkの正閉路判定

発動条件: 長さ無制限のwalk重みを最大化し、値が有限か無限かも判定するとき。

到達可能状態だけを最大距離緩和し、|V|回目にも改善すれば正cycleとしてInfinityにする。

## 問題固有の要素

長さ3以下の全英小文字pattern数は26+26^2+26^3で入力上限と一致し、未指定patternは重み0のtableとして直接持てる。

別の問題へ持ち帰る視点: 短い全pattern空間が小さいときは、trieを作らず固定長lookup tableへ不足値0で展開できる。

## 正当性

次文字の追加で新しく生まれる得点項は長さ1,2,3の接尾辞だけなので、末尾二文字とdummy初期文字が将来に必要十分な状態。辺重みをその三項の和にすると非空文字列と始点から一回以上進んだwalkの得点が一致する。到達可能な正閉路は反復して無限大にできる。正閉路がなければ閉路を除いて得点を悪化させない有限最長walkが存在し、Bellman-Ford型最大緩和で求まる。始点の空文字得点0を候補に入れてはいけない。

## 実装上の注意

- 距離は負になり得るので未到達を十分小さい−INFで初期化し、$$だけを0にする。
- 空文字は禁止なので始点距離0自体を有限答え候補にせず、一回以上遷移した状態の最大値を取る。

## 復習の核

- 追加文字によるscore増分が局所suffixだけを見るなら、文字列全体を状態にせずweighted automatonへ変換する。
- 長さ無制限の最大化では、有限DPを始める前に正利益cycleの反復がInfinityを作るか確認する。

## 計算量と制約

### 時間

O(N+VE)。V≤27²、E=O(26V)は末尾二文字グラフの規模。

### 空間

O(V+E+N)（入力スコアを保持する場合）。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 18278; N is an integer.; T_i is a string of length between 1 and 3 consisting of lowercase English letters.; i \neq j \Rightarrow T_i \neq T_j; -10^9 \leq P_i \leq 10^9; P_i is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/tasks/abc264_g) — source-abc264-g-problem-09dddce54ca2e241785fe37fb400d3c7bc821302dc9139e62bd5831725eae29f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/editorial/4580) — source-abc264-editorial-4580-9a15438df46f1a33d6d81400041f5950bad8c5ea8f0953e5f683c001e42709d2
