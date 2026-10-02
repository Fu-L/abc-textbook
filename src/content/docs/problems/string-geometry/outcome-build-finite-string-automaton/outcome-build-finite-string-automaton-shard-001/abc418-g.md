---
title: "ABC418-G — Binary Operation"
draft: true
authoringUnit: {"problemId":"abc418-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc418-g.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-interval-composition","unit-dp-state-design"],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-finite-pattern-automaton","tag-dp-state-equivalence","tag-interval-partition-dp"],"sourceRevisionIds":["source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b","source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"表の候補言語が二つの文法方程式と一致することは、連接NFAとDFAの積で全ての到達状態を検査して確認できる。両候補は空文字列を受理せず、連接の両因子は真に短い。長さ1は{b}の基底、長さ2以上は最終縮約の左右分割で決まるため、語長についての帰納法により、この方程式を満たす候補は実際の全括弧付けの言語と一致する。短い語の実験だけを一般的なDFA学習の停止保証にしていない。\n\nDFAの同じ状態へ到達するsubstringは、次の全ての文字列に対して同じ受理挙動になるので、個数と最小開始位置へ集約できる。各位置で既存のsubstringを一文字伸ばし、新規の長さ1を一つ開始することで、全非空substringを一度だけ数える。受理状態の個数がM、最早開始位置がその右端での最長受理substringを与える。","sourceRevisionIds":["source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b","source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

隣接二文字の縮約は、文字順を保った二分括弧付けに対応する。短い文字列は、区間を全分割し左右の到達値を演算する区間DPで判定できる。しかし全substringへこのDPを行うと間に合わない。

各演算の「1へ縮約できる非空文字列」を有限オートマトンで表す。短い継続suffixを付けたときの受理結果をsignatureとし、同じsignatureのprefixをまとめてDFA候補を作る。長さ3以下の全suffixを使い、空prefixからBFSで0/1を追加すると、以下の表を得る。ABCDはf(0,0),f(0,1),f(1,0),f(1,1)の順。状態0が初期状態で、受理1はbeautifulを意味する。

| ABCD | 各状態の (0遷移,1遷移,受理) |
| --- | --- |
| 0000 | 0:(1,2,0); 1:(1,1,0); 2:(1,1,1) |
| 1000 | 0:(1,2,0); 1:(3,4,0); 2:(5,5,1); 3:(4,6,1); 4:(6,6,0); 5:(6,4,0); 6:(6,6,1) |
| 0100 | 0:(0,1,0); 1:(2,2,1); 2:(2,3,0); 3:(2,3,1) |
| 1100 | 0:(1,2,0); 1:(3,3,0); 2:(1,1,1); 3:(3,3,1) |
| 0010 | 0:(1,2,0); 1:(1,1,0); 2:(3,4,1); 3:(3,3,1); 4:(4,3,0) |
| 1010 | 0:(1,2,0); 1:(3,4,0); 2:(3,4,1); 3:(3,3,1); 4:(3,3,0) |
| 0110 | 0:(0,1,0); 1:(1,0,1) |
| 1110 | 0:(1,2,0); 1:(3,3,0); 2:(4,1,1); 3:(3,3,1); 4:(3,1,1) |
| 0001 | 0:(1,2,0); 1:(1,1,0); 2:(1,2,1) |
| 1001 | 0:(1,2,0); 1:(2,1,0); 2:(1,2,1) |
| 0101 | 0:(0,1,0); 1:(0,1,1) |
| 1101 | 0:(1,2,0); 1:(3,3,0); 2:(1,2,1); 3:(3,3,1) |
| 0011 | 0:(1,2,0); 1:(1,1,0); 2:(2,2,1) |
| 1011 | 0:(1,2,0); 1:(2,1,0); 2:(2,2,1) |
| 0111 | 0:(0,1,0); 1:(1,1,1) |
| 1111 | 0:(1,2,0); 1:(2,2,0); 2:(2,2,1) |

ただし短い語の一致や二段の安定だけでは、一般の言語について正しさは証明できない。この表は次の有限な検査で、全ての長さに対して証明できる。L_bを値bへ縮約できる非空文字列の言語とすると、

L_b={b} ∪ ⋃_{f(a,c)=b} L_a L_c

である。0へ縮約する候補DFAは、演算f'(a,c)=1−f(1−a,1−c)の表を取り、入力文字0/1を交換すれば得られる。この二つの候補言語に対して右辺の連接・和集合をNFAで構成し、左辺のDFAとの積オートマトンをBFSする。片方だけ受理する到達状態がなければ言語が厳密に一致する。表の16演算×2値について、この有限検査は全498個の到達積状態で成功する。これで語長に上限を置かず表を確定できる。

各演算のDFAで入力Tを左から走査する。cnt[q]は直前位置で終わるsubstringが状態qへ到達する個数、start[q]はその中の最小開始位置。次文字cへcnt'[δ(q,c)]+=cnt[q]、start'へ最小を伝播し、状態δ(0,c)へ新しい長さ1のsubstringを一つ加える。受理状態のcntの総和をMへ足し、最小startから最大長Lを更新する。表は高々7状態なので各演算O(N)。

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

16個の二項演算に限定された小さな言語を、継続signatureで推測し、文法方程式との厳密な有限比較で確定する。未知の文脈自由言語が短い実験だけで正規と分かるわけではない。

別の問題へ持ち帰る視点: 小さな演算の全ケースでは、実験で候補を作り、再帰的な言語の定義と照合して証明する手順が有効である。確定したDFAでは全substringの個数・最長長を同じ状態遷移で集計できる。

## 正当性

表の候補言語が二つの文法方程式と一致することは、連接NFAとDFAの積で全ての到達状態を検査して確認できる。両候補は空文字列を受理せず、連接の両因子は真に短い。長さ1は{b}の基底、長さ2以上は最終縮約の左右分割で決まるため、語長についての帰納法により、この方程式を満たす候補は実際の全括弧付けの言語と一致する。短い語の実験だけを一般的なDFA学習の停止保証にしていない。

DFAの同じ状態へ到達するsubstringは、次の全ての文字列に対して同じ受理挙動になるので、個数と最小開始位置へ集約できる。各位置で既存のsubstringを一文字伸ばし、新規の長さ1を一つ開始することで、全非空substringを一度だけ数える。受理状態の個数がM、最早開始位置がその右端での最長受理substringを与える。

## 実装上の注意

- beautifulは非空なのでempty start stateの受理をsubstring集計へ混ぜない。演算indexは00=A,01=B,10=C,11=D、MはO(N^2)なので64 bit、受理なしならL=-1とする。

## 復習の核

短い語による候補推測と、文法方程式の有限比較による確定を分ける。連接NFAは左側が受理する各位置で右側の開始状態へε遷移し、全ての分割位置を表す。

## 計算量と制約

### 時間

O(16sN+C)、s≤7。Cは固定された16演算の表構築・文法方程式照合の定数費用。各substring scanでは状態ごとに一遷移。

### 空間

O(s)。各演算のscanでは個数と最小開始位置の二layerのみ。表構築と照合も入力Nに依存しない定数空間。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; N is an integer.; T is a string of length N consisting of 0 and 1.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/editorial/13620) — source-abc418-editorial-13620-544f5a49be506e4052a25315d3ce6d6ac71f96bb21ad9c9fbf58a3022af1ee2b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/tasks/abc418_g) — source-abc418-g-problem-051665252efa45310009132536ebf03318397dc1fb1a4c70829b3e7af7af5df3
