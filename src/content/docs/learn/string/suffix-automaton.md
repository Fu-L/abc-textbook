---
title: "Suffix Automatonで部分文字列集合を表す"
description: "「Suffix Automatonで部分文字列集合を表す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 159
---

# Suffix Automatonで部分文字列集合を表す

習得対象の目安: **橙色（2400–2799）**。endpos同値類・suffix link・cloneを理解し、全部分文字列を線形状態数で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Suffix Automaton

endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。

### 習得する技能

- endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。

## 考え方

### 保持する状態

文字列tの出現が終わる位置集合をendpos(t)とし、同じ集合を持つ部分文字列を一状態へまとめる。状態vの最長文字列の長さをlen[v]、より短い別の同値類へのsuffix linkをlink[v]、文字cを付けた遷移をnext[v][c]とする。vが表す長さはlen[link[v]]+1からlen[v]までで、その範囲の文字列は最長文字列のsuffixである。

初期状態rootはlen=0、link=−1、遷移なし。lastはここまで読んだ文字列全体を表す状態で、最初はrootとする。rootから遷移をたどって読める文字列が全部分文字列であり、suffixだけを受理する用途ではlastからsuffix linkをたどる状態を終状態に指定する。

### 一文字追加とcloneによる分割

文字cを末尾に追加すると、新しい終了位置を持つのは従来の文字列の各suffixにcを付けた文字列である。そのsuffixをlinkでたどり、次の順で更新する。

1. 新状態curを作り、len[cur]=len[last]+1、遷移なしとする。p=lastから始め、p≠−1かつcの遷移がない間、next[p][c]=curを追加してp=link[p]へ進む。
2. p=−1ならlink[cur]=rootとする。そうでなければ、最初に見つかった既存遷移の行き先をq=next[p][c]とする。
3. len[p]+1=len[q]なら、qの最長文字列も今回のsuffixなのでlink[cur]=qでよい。
4. len[p]+1<len[q]なら、qには今回のsuffixより長い文字列も含まれている。短い側だけが新終了位置を得るので、cloneを作り、len[clone]=len[p]+1、next[clone]=next[q]、link[clone]=link[q]とする。遷移表は独立にコピーし、qへの後の変更をcloneに共有しない。
5. 分割時はそのpからsuffix linkをたどり、p≠−1かつnext[p][c]=qの間だけ、行き先をcloneへ付け替える。次にlink[q]=link[cur]=cloneとする。cloneのlinkには変更前のlink[q]が入る。最後に、分割の有無によらずlast=curとする。

短い側と長い側は、既存の終了位置から先へ読める文字列が同じなので遷移をコピーできる。一方、新終了位置を得る短いsuffixへ入る遷移だけをcloneへ向け直す。lenとlinkによる長さ区間も、短いcloneと長いqへ分かれ、同値類の不変量を回復する。

例えばabではbとabのendposはいずれも{2}で、同じq（len=2）に属する。bを追加してabbにすると、bのendposは{2,3}、abは{2}となる。lastからb→curを追加した後、rootの既存b遷移はqへ向くが、len[root]+1=1<2。len=1のcloneへrootのb遷移を移し、qとcurのlinkをcloneへ向ける。qはab、cloneはb、curはbbとabbを表す。

## 成立条件と計算量

一文字につきcur一つと高々一つのcloneを作るので状態数はO(N)。最初の二文字ではcloneが不要なため、N≥2ならrootを含め高々2N−1状態となる。N=0はrootだけ、N=1は2状態である。

構築時間は状態数とは別に、suffix link走査と遷移表の費用を数える。固定サイズの文字種なら新規遷移追加とcloneのコピーは全体O(N)。付け替え走査も全追加を通じた償却O(N)であり、単発の追加はO(N)になり得る。[構築算法の償却解析](https://cp-algorithms.com/string/suffix-automaton.html#linear-number-of-operations)では、付け替えが長いsuffixから短いsuffixへ進み、lastの二つ先のsuffix linkが表す最長suffixの開始位置が前へ戻らないことに課金する。状態数が線形という理由だけで各走査を定数時間とはしない。

固定文字種なら構築O(N)、領域O(N)。文字種数σに対して各状態に配列を確保する実装はO(Nσ)領域・初期化費用となる。平衡木で遷移を保持する実装なら構築O(N log(σ+1))、領域O(N)である。

出現数を求める場合は各curの初期値を1、rootとcloneを0とし、len降順でcnt[link[v]]へcnt[v]を足す。cloneは新しい終了位置を一つ作る状態ではないため1を置かない。lenは0,…,Nなのでbucketで線形時間に並べられる。異なる部分文字列数はroot以外のΣ_v(len[v]−len[link[v]])であり、遷移DAG上の部分文字列DPにも接続できる。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。

このUnitを直接前提とする単元: なし。

有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。

### このUnitでは扱わないもの

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 問題一覧

- [ABC433 G「Substring Game」](https://atcoder.jp/contests/abc433/tasks/abc433_g) — 主題: [Suffix Automatonで部分文字列集合を表す](/learn/string/suffix-automaton/)（endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。）。既習技能: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC433 G 公式解説](https://atcoder.jp/contests/abc433/editorial/14604)
- [ABC433 G 公式問題文](https://atcoder.jp/contests/abc433/tasks/abc433_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-suffix-automaton`
