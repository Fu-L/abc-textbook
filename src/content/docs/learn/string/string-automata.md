---
title: "禁止・要求patternを有限状態へ圧縮する"
description: "「禁止・要求patternを有限状態へ圧縮する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 155
---

# 禁止・要求patternを有限状態へ圧縮する

導入対象の目安: **青色（1600–1999）**。未来の受理条件が同じprefixをまとめ、有限状態へ変換する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

長い文字列を一文字ずつ読むとき、毎回その全体を覚え直す必要はない。次の文字でpattern（探したい文字の並び）が完成するかを決める情報だけを残し、一文字ごとの遷移を作る。この有限状態の仕組みをautomaton（オートマトン）と呼び、文字列の判定や数え上げへ使う。

## 考え方

独自の小例として、`a,b,c`からなる文字列で`ab`を避けたいとする。まず、`ab`が**連続する部分文字列**として現れたら禁止する場合を考える。`a`を読んだ後は、次の`b`で完成する。`aa`を読んだ後も、最後の`a`だけが次の一致の候補なので同じ状態でよい。一方、`ac`を読んだ後は、間に`c`が入って連続性が切れ、続けて`b`を読んでも`ab`はできない。

今度は、文字を飛ばして選べる**部分列**として`ab`が現れたら禁止するとする。`ac`の後も、先ほどの`a`を選べた事実は残る。その後に`b`が来れば、`acb`の1文字目と3文字目を選んで完成する。同じ入力でも、部分文字列なら「末尾のどこから一致を続けられるか」、部分列なら「どこまで選べたか」が必要になる。

この違いを一般化すると、二つの履歴をまとめてよいのは、**どんな文字列をこの先に付けても、最後に条件を満たすかが同じになるとき**である。条件を満たすことを受理と呼ぶ。禁止patternの回避だけなら、既に禁止を破った履歴は捨て、安全な履歴の中で次の違反に必要な情報を比べればよい。出現を要求する場合は、末尾の一致が消えても「過去に一度は現れた」という情報を忘れてはいけない。

まず最小の状態数を探すより、保持する情報から「全ての文字の次状態」と「最後の受理判定」が決まることを確かめる。[有限状態automatonの構成](/learn/string/finite-pattern-automaton/)では、この`ab`の例を一致長と遷移表へ落とし込む。複数patternの末尾一致は[Aho–Corasick](/learn/string/aho-corasick/)、同時に可能な状態を集合で保持する場合は[subset construction](/learn/string/automaton-subset-construction/)へ進む。

## 成立条件と計算量

状態数を $$S$$、入力に使う文字の種類数を $$\sigma$$ とする。各状態・各文字から次状態が一意に決まる表を作れば、一つの入力文字列は一文字 $$O(1)$$、長さ $$N$$ で $$O(N)$$ 時間で読める。表の領域は $$O(S\sigma)$$。表を作る時間は、一致判定の方法を含めて別に評価する。有限個の状態にできても、状態数が実用的な大きさとは限らない。

長さ $$N$$ の文字列を全て数えるなら、状態は「同じ続きを付けられる履歴の分類」、DP値は「その分類へ来た文字列の個数」である。到達しない状態の個数は0とし、合法な一文字遷移で個数を足す。構築済みの表に対する通常DPは $$O(NS\sigma)$$ 時間となる。禁止完成を捨てるか、出現履歴を加えて最後に受理状態を選ぶかを決めてから、[automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)へ接続する。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 数値上限・桁・繰り上がりを状態にする桁DP、および接頭辞一致長だけを求めるKMP・Z法。

## 下位単元

- [有限状態automatonの構成](/learn/string/finite-pattern-automaton/) — 青色
- [Aho–Corasick](/learn/string/aho-corasick/) — 黄色
- [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-string-automata`
