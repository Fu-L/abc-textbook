---
title: "一意な後続・サイクル・ダブリング"
description: "「一意な後続・サイクル・ダブリング」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 100
---

# 一意な後続・サイクル・ダブリング

導入対象の目安: **水色（1200–1599）**。後続が一意な遷移をcycleと流入木に分け、反復を圧縮する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

状態グラフを理解した後、後続が一意という制約からcycleと流入木への分解やダブリングを導く。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 各頂点から複数の後続を選べる一般のグラフ探索・強連結成分への縮約。

## 下位単元

- [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/) — 水色
- [doubling・binary lifting](/learn/graph/binary-lifting/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。追加で学ぶ技能: [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。） / [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g) — 主題: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)（Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5856cce249dc16a05c694fe4136c7592920790e2786135edf898cc4b20161c4a` / LearningUnit `unit-functional-graph`
