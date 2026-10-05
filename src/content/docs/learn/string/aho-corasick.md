---
title: "Aho–Corasick"
description: "「Aho–Corasick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 157
---

# Aho–Corasick

習得対象の目安: **黄色（2000–2399）**。Trieのfailure linkで最長suffixを保ち、複数patternの検出情報を伝播する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Aho–Corasick

複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。

### 習得する技能

- 複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。

## 考え方

### Trie状態とfailureの意味

各状態vは根からの文字列P_v、終端patternのID集合terminal[v]を持つ。根は空文字列。根以外のfail[v]は、P_vのproper suffix（自身より短いsuffix）のうちTrieのprefixでもある最長のものを表す。走査状態は、読んだtextのsuffixのうちTrieのprefixである最長のものなので、次の一致に必要な情報がここへ集まる。

### 完全遷移表をBFSで作る

Trieの実際の子childと、全文字に対する遷移goを区別する。fail[root]=rootとし、各文字cについて根に子uがあればgo[root][c]=u、fail[u]=rootとしてuをqueueへ入れる。なければgo[root][c]=rootとする。以下、queueから深さ順にvを取り出す。

- 実際の子u=child[v][c]があるとき、`go[v][c]=u`、`fail[u]=go[fail[v]][c]` としuをqueueへ入れる。
- 子がなければ、`go[v][c]=go[fail[v]][c]` とする。

P_vから一文字cを加えた語の最長proper suffixは、まずP_vのproper suffixからcで進むことで得られる。failure先の深さは小さいので、そのgoはBFS時点で完成している。欠損辺をgoへ補った後は、それをTrieの実子としてqueueへ入れない。

### 受理の集約と出現の列挙

禁止語の有無だけなら `bad[v]=terminal[v]が非空 OR bad[fail[v]]` をBFS順に計算する。pattern集合をbitmaskにする場合も `mask[v]=ownMask[v] OR mask[fail[v]]` とする。suffix側のpatternを落とさず、textは状態q=rootから `q=go[q][c]` の一回で進める。

全出現を列挙する場合は各状態に巨大なID一覧をコピーせず、failure鎖の直近の終端状態へのoutput linkを持つ。状態q自身のterminalを報告し、output linkを辿って各終端のIDも報告する。末尾位置i、pattern長mなら開始位置はi−m+1。出現数だけなら終端個数をfailure先から加算し、一文字ごとにその合計を足せる。重複patternを別IDとして数えるかは入力の意味に従う。

## 成立条件と計算量

総pattern長L、文字種数σの完全遷移表はO((L+1)σ)構築・空間。Boolean受理の伝播はO(L)、text長Nの走査はO(N)、全出現の報告はO(N+Z)（Zは出現数）。pattern bitmaskが機械wordに収まらない場合はORのword数も掛ける。空patternは全ての境界で一致するので、通常の非空patternと分けて処理する。

概念上の親: [禁止・要求patternを有限状態へ圧縮する](/learn/string/string-automata/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)、[Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)。

このUnitを直接前提とする単元: なし。

有限状態automatonの構成・Trieによる共有接頭辞の索引で得た考え方と実装を再利用し、Aho–Corasickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Aho–Corasickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC458 F 公式解説](https://atcoder.jp/contests/abc458/editorial/20159)
- [ABC458 F 公式問題文](https://atcoder.jp/contests/abc458/tasks/abc458_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-aho-corasick`
