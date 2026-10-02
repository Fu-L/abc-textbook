---
title: "圧縮・反復・再帰文字列へ問い合わせる"
description: "「圧縮・反復・再帰文字列へ問い合わせる」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 161
---

# 圧縮・反復・再帰文字列へ問い合わせる

習得対象の目安: **青色（1600–1999）**。再帰blockの長さと位置を追い、展開せずに問い合わせや作用の合成を行う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 再帰・圧縮・入れ子文字列の走査

明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。

### 習得する技能

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

## 考え方

連結・反復・再帰生成された文字列を展開せず、各部品の長さと結合関係を持つ。位置kがどの子の範囲に入るかを判定して降り、反復なら剰余で子の位置へ戻す。内容より構成式を索引にする。

0-index位置kへのqueryでは、連結ABはk<|A|ならAへ、それ以外はk−|A|でBへ降りる。反復A^mはk mod |A|へ戻し、反転Aは|A|−1−kへ戻す。空blockを反復する場合は位置query自体が存在しない。各nodeの長さと必要なaggregateを下から計算し、文字への作用は降りる間に時間順で合成する。

括弧区間を反転する入れ子変換なら、まずstackで各開閉括弧の対応matchを作る。i=0、進行方向d=+1から走査し、通常文字は出力してi+=d、括弧ではi=match[i]へjumpしd=−dとしてからi+=dする。内外の反転で読む方向が切り替わるため、中身を移動せず完成列順に読める。各括弧対は両端を高々一回ずつ処理し、文字も一回出力するのでO(入力長+出力長)。文字の大小反転などを併用するなら、括弧に入る・出る両端で作用のparityを切り替え、通常文字への出力時に適用する。

## 成立条件と計算量

query時間は構成木の深さと子の選択費用で決まる。prefix側からの連結位置queryだけなら、最大問い合わせ位置を超えた長さを飽和させても分岐を決められる。反転の|A|−1−kや、反復の剰余に必要な正確な長さは別途保持する。例えば実長100を10へ飽和させた反転blockでk=0を9へ写すと、本来の位置99を失う。後ろからの距離を状態にするか多倍長で実長を持つなど、使う変換に必要な情報を残す。共有部分を毎回展開すると指数時間になる。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。

### このUnitでは扱わないもの

- 明示された文字列への接尾辞索引の構築。

## 問題一覧

- [ABC450 E「Fibonacci String」](https://atcoder.jp/contests/abc450/tasks/abc450_e) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。
- [ABC350 F「Transpose」](https://atcoder.jp/contests/abc350/tasks/abc350_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC346 F 公式解説](https://atcoder.jp/contests/abc346/editorial/9644)
- [ABC346 F 公式問題文](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC350 F 公式解説](https://atcoder.jp/contests/abc350/editorial/9820)
- [ABC350 F 公式問題文](https://atcoder.jp/contests/abc350/tasks/abc350_f)
- [ABC417 G 公式解説](https://atcoder.jp/contests/abc417/editorial/13580)
- [ABC417 G 公式問題文](https://atcoder.jp/contests/abc417/tasks/abc417_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-recursive-compressed-string`
