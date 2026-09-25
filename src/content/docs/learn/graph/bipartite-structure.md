---
title: "二部彩色と成分構造を扱う"
description: "「二部彩色と成分構造を扱う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 二部彩色と成分構造を扱う

習得対象の目安: **緑色（800–1199）**。探索で二色塗りと矛盾を判定し、成分ごとの反転対称性を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第10単元。技能の説明を学んでから問題一覧へ進んでください。

前: [同値な状態を正規化する](/learn/modeling/normalization/) ／ 次: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)

## 概要

### 二部グラフの彩色と成分構造

無向グラフを二色に塗れる条件を探索で検証し、各連結成分の二部サイズ・反転対称性を集約する。

### 習得する技能

- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

無向グラフを探索できることを前提に、辺をまたぐたび色を反転し、矛盾検出と成分ごとの二部サイズ集約を行う。

### このUnitでは扱わないもの

- 重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。 二部彩色と整数最大流を既習とする。頂点・色組の使用回数A_{v,k}を容量に置き、流量N−1から各木辺の削除時の色対を固定する。一対一matchingではない。次に、実行可能な辺がないと仮定して葉から根へ条件を伝播させると矛盾することを示す。一辺削除した後も残りの回数制約が保たれるため、この存在証明を帰納的に繰り返して操作列を復元できる。静的な割当の可否と時系列の実行可能性を別々に証明する。
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f) — 主題: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

## 根拠

- [ABC327 G 公式解説](https://atcoder.jp/contests/abc327/editorial/7557)
- [ABC327 G 公式問題文](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC398 E 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G 公式解説](https://atcoder.jp/contests/abc398/editorial/12480)
- [ABC398 E 公式解説](https://atcoder.jp/contests/abc398/editorial/12483)
- [ABC398 G 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bipartite-structure`
