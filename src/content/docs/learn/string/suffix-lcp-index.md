---
title: "接尾辞の順序とLCPを索引化する"
description: "「接尾辞の順序とLCPを索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 154
---

# 接尾辞の順序とLCPを索引化する

習得対象の目安: **青色（1600–1999）**。suffix arrayとLCPの意味を理解し、ライブラリで得た索引を部分文字列queryへ使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 接尾辞順序・LCP索引

全接尾辞の辞書順とLCPを索引化し、部分文字列の順序・出現範囲・順位・distinct数を求める。

### 習得する技能

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

## 考え方

### SA・逆順位・LCPの契約

長さNの文字列SについてSA[r]を辞書順r番目の非空接尾辞の開始位置、rank[SA[r]]=rを逆順位とする。LCP[r]はS[SA[r]:]とS[SA[r+1]:]の一致長（r=0,…,N−2）。ライブラリを使う場合も、この配列の添字と空接尾辞を含むかを固定する。

rank[a]<rank[b]なら、二接尾辞の一致長は `min LCP[rank[a]:rank[b]]` である。共通prefixを持つ接尾辞は辞書順で連続し、両端がh文字一致すればその間も同じprefixを持つ。逆に全隣接対がh文字一致すれば両端も一致するからである。a=bなら一致長はN−a。RMQでこの最小値を取得できる。

### 出現範囲と長さを切った比較

非空pattern Pをprefixに持つ接尾辞はSA上で連続する。接尾辞の先頭を高々|P|文字だけPと比較し、途中で接尾辞が尽きれば小、P全部が一致すれば同値とする。この比較値が初めて0以上になる位置lo、初めて正になる位置hiを二分探索すると、出現はSA[lo:hi]、個数はhi−lo。一比較O(|P|)なら探索O(|P| log N)、位置列挙は出現数に比例する。通常の文字列比較ではPより長い接尾辞も大となるので、prefix一致用の比較を使う。

一般の部分文字列S[a:a+m]とS[b:b+n]では、接尾辞LCPをhとし `q=min(h,m,n)` と切る。q<min(m,n)なら次の二文字で大小が決まる。そうでなければ短い方が小さく、長さも等しければ同じ語である。接尾辞rankをそのまま有限長部分文字列の順位にはしない。

### distinct数とk番目の復元

SAを順に見ると、位置SA[r]のprefixのうち前の接尾辞との共通長p（r=0なら0、他はLCP[r−1]）までは既出で、長さp+1,…,N−SA[r]だけが新しい部分文字列である。以前の接尾辞との最大一致は直前との一致pで得られるため、非空distinct数は `Σ_r(N−SA[r]−p)`。

これらの新しいprefixを長さ昇順に出すと、全distinct部分文字列の辞書順になる。1-indexのk番目を得るには各rの追加数cnt=N−SA[r]−pを引き、k≤cntとなった接尾辞で長さp+kのprefixを返す。追加数の累積を索引化すればrは二分探索できる。kが総数を超える場合は存在しない。部分文字列の「順位」がdistinct語の順位か、重複する出現の順位かも先に固定する。

### 巡回shift

S+S上の開始位置a=0,…,N−1から長さNだけ取ると全巡回shiftが得られる。そのSAで開始位置<Nだけを残せば長さNの語の非減少順になるが、長さN以降の違いは同値なshiftのtie breakに過ぎない。隣接する候補のLCPがN以上なら同じshiftとしてまとめる。最小候補から長さNを切り出せば最小巡回shiftを復元できる。

## 成立条件と計算量

倍増法で各段をrankの整数sortにより線形処理すればO(N log N)、比較sortを各段で使う素朴な実装はO(N log² N)。有界整数文字種のSA-ISはO(N+σ)、LCP構築はO(N)。RMQの構築・query費用を加える。distinct数はO(N²)に達するため整数幅を確保する。空文字列には非空接尾辞・非空distinct語・巡回shiftを作らず、空patternの出現はN+1境界として分ける。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

全接尾辞の辞書順と隣接LCPを索引化し、部分文字列の出現範囲・順位・個数へ答える。

### このUnitでは扱わないもの

- rolling hashによる一致比較と回文半径。

## 問題一覧

- [ABC362 G「Count Substring Query」](https://atcoder.jp/contests/abc362/tasks/abc362_g) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。
- [ABC272 F「Two Strings」](https://atcoder.jp/contests/abc272/tasks/abc272_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。
- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC452 G「221 Substring」](https://atcoder.jp/contests/abc452/tasks/abc452_g) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC268 H 公式解説](https://atcoder.jp/contests/abc268/editorial/4786)
- [ABC268 H 公式問題文](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC272 F 公式解説](https://atcoder.jp/contests/abc272/editorial/4980)
- [ABC272 F 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-suffix-lcp-index`
