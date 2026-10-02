---
title: "ABC240-EX — Sequence of Substrings"
draft: true
authoringUnit: {"problemId":"abc240-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-aggregate-subsequence-transitions-by-value/outcome-aggregate-subsequence-transitions-by-value-shard-001/abc240-ex.md","learningOutcomeIds":["outcome-aggregate-subsequence-transitions-by-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-dp-sequence","unit-event-sweep","unit-greedy-exchange","unit-range-monoid-aggregation","unit-trie-prefix"],"excludedTopics":["値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-value-range-dp","tag-bounded-enumeration","tag-event-sweep","tag-greedy-exchange-order","tag-range-monoid-aggregation","tag-trie-prefix"],"sourceRevisionIds":["source-abc240-editorial-3428-ef01cef0080e4c8a7281ace14281c1b0615ced2ef79c22d5f38fe8e9a89f432c","source-abc240-ex-problem-24c400f71ce5abbff2214e4997fd861d4734377f3a0faa275f8e09bacbbebb89"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"辞書順増加列の隣接二語U<Vで|V|≥|U|+2なら、Vの末尾一文字を消してもU<Vを保ち、次の語よりはさらに小さい。長さB超の語があり、それ以前にこの長さjumpが一度もなければ、直前長さは一段ずつ以上必要になり総長が1+…+(B+1)>Nとなる。先頭には空語を置いて同じ議論を使う。この交換を繰り返せば全長B以下の最適解が存在する。候補をtrie辞書順に並べ、開始lより前の最良終了値+1を終端rへ更新すれば非重複と増加順を守る。同値語はl降順なので互いにchainできずstrict条件も保つ。","sourceRevisionIds":["source-abc240-editorial-3428-ef01cef0080e4c8a7281ace14281c1b0615ced2ef79c22d5f38fe8e9a89f432c","source-abc240-ex-problem-24c400f71ce5abbff2214e4997fd861d4734377f3a0faa275f8e09bacbbebb89"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [値域集約による部分列DP](src/content/docs/learn/dynamic-programming/dp-value-range.md)

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)
- [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

対象外:

- 値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

候補 substring を辞書順に処理できれば、dp[r]=位置 r で終わる増加列長として、開始 l より前に終わる最良値へ1を足す LIS 型 sweep になる。厳密増加なので同じ文字列同士を遷移させてはいけない。

全 substring は二乗個だが、B を 1+…+B≤N を満たす最大値とすると、公式の短縮交換により全選択 substring の長さを B 以下にした最適解が存在する。候補は N·B 規模まで減る。

採用する候補: 長さ B 以下の substring を trie の辞書順で列挙し、同値なら開始位置降順に並べ、segment tree の prefix max で dp を更新する。

候補削減、辞書順 sweep、非重複区間条件をそれぞれ trie と range maximum に分担できる。

棄却する候補: 全 O(N^2) substring を辞書順 sort し、各候補で過去の dp prefix を走査する。

N=2.5×10^4 では候補数だけで大きく、さらに比較・遷移を掛けると時間制限に収まらない。

選択列中に長さ B 超の文字列があれば、総使用長≤N と三角数の関係から、それ以前に長さが2以上跳ぶ隣接対があり、後者の末尾を一文字削っても辞書順を保てる。

同一 substring を開始位置降順で処理すると、先に処理した同値候補の終点は後の候補の開始より前にならず、strict 条件に反する chain を防げる。

B を求め、各開始位置から長さ B までの substring を trie node と (l,r) に対応させる。trie DFS 順で lex rank を付け、候補を (rank,-l) 順に処理し、best=max dp[0..l-1]+1 を r へ chmax する segment tree を更新して全体最大を返す。

## 典型の発動条件

### 順序付き候補の LIS 型 DP

発動条件: 候補に値の狭義順序と、位置の非重複順序の二条件があるとき。

値順に sweep し、位置 prefix の最良 DP を range maximum structure で取得する。

### 交換法による候補長制限

発動条件: 全区間候補が二乗個だが、最適列の総長と単調な長さ関係から長い要素を短縮できるとき。

三角数で閾値を定め、最適解を保ったまま全要素を閾値以下へ正規化する。

## 問題固有の要素

辞書順で隣接する選択 substring の長さに2以上の隙間があれば、長い側の最後を削っても前後の狭義順を壊さない。

別の問題へ持ち帰る視点: 文字列選択の最適化では、prefix 関係と最初の相違位置を分け、末尾削除が順序を保つ条件を探す。

## 正当性

辞書順増加列の隣接二語U<Vで|V|≥|U|+2なら、Vの末尾一文字を消してもU<Vを保ち、次の語よりはさらに小さい。長さB超の語があり、それ以前にこの長さjumpが一度もなければ、直前長さは一段ずつ以上必要になり総長が1+…+(B+1)>Nとなる。先頭には空語を置いて同じ議論を使う。この交換を繰り返せば全長B以下の最適解が存在する。候補をtrie辞書順に並べ、開始lより前の最良終了値+1を終端rへ更新すれば非重複と増加順を守る。同値語はl降順なので互いにchainできずstrict条件も保つ。

## 実装上の注意

- 等しい文字列は l 降順を必ず tie-break にする。dp[0]=0 の番兵を置き、query は l-1 まで、更新は r の chmax とする。trie は長さ B で打ち切り、全 suffix を末尾まで展開しない。

## 復習の核

- 同じ文字列を l 昇順に処理すると誤って chain できる配置を作り、l 降順で防げることを終点との大小から確認する。

## 計算量と制約

### 時間

B=max{b:b(b+1)/2≤N}としてO(NB log(NB))。trie O(NB)、候補sortとsegment treeを含む。

### 空間

O(NB)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2.5 \times 10^4; N is an integer.; S is a string of length N consisting of 0's and 1's.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/editorial/3428) — source-abc240-editorial-3428-ef01cef0080e4c8a7281ace14281c1b0615ced2ef79c22d5f38fe8e9a89f432c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/tasks/abc240_h) — source-abc240-ex-problem-24c400f71ce5abbff2214e4997fd861d4734377f3a0faa275f8e09bacbbebb89
