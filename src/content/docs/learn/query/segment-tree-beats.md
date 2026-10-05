---
title: "Segment Tree Beats"
description: "「Segment Tree Beats」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 58
---

# Segment Tree Beats

習得対象の目安: **橙色（2400–2799）**。一括更新が失敗する条件を要約に持たせ、再帰下降の回数まで償却解析する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Segment Tree Beats

nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。

### 習得する技能

- nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

まず、配列の区間chmin `a_i←min(a_i,cap)`と区間和だけを扱う。和だけでは更新後の和を決められないため、各nodeに`sum`、最大値`max`、最大値より真に小さい値の最大値`secondMax`、最大値の個数`countMax`を持つ。一種類の値しかないnodeでは`secondMax=−∞`とする。

### 一括更新の成功条件

更新区間と交わらなければ終了する。交わる場合も`cap≥max`なら何も変わらない。nodeの区間全体が更新対象に含まれる場合には、次の条件で一括更新できる。

- `secondMax<cap<max`なら最大値の要素だけが変わる。`sum−=(max−cap)·countMax`として`max=cap`にし、secondMaxとcountMaxは保つ。
- `cap≤secondMax`なら、一括更新は失敗する。子へ遅延更新を伝えて再帰し、子の要約を併合し直す。cap=secondMaxでも二つの値の群が合流して最大値の個数が変わるため、この標準形では失敗側に入れる。

区間の一部だけが対象の場合も子へ降りる。併合ではsumを足し、maxは左右のmaxの大きい方にする。countMaxはそのmaxを持つ子の個数だけを足す。secondMaxは、左右のmaxとsecondMaxのうち、新しいmaxより小さい値の最大である。

遅延伝播には親のmaxを上限として使える。子のmaxがそれを超える場合、その子に同じ一括chminを適用する。親で一括更新が成功したとき、子の最大値以外は親の更新前secondMax以下であり、新しい上限より小さい。そのため伝播先でも成功条件を満たす。再帰の前には伝播し、再帰後には併合することで、遅延した変更と要約の整合を保つ。

### 失敗下降を数えるpotential

各nodeの担当区間にある異なる値の種類数をD_vとし、`Φ=Σ_v D_v`をpotentialにする。これは解析上の量であり、実装で集合を保持する必要はない。遅延更新をすべて反映した論理上の配列で定義する。各深さの区間長の総和はNなので、初期ΦはO(N log N)。

区間全体にchminを行うnodeでは、値は一つの写像`x→min(x,cap)`で置き換わるためD_vは増えない。特に一括更新が失敗したnodeでは、maxとsecondMaxという異なる二値が同じcapへ写るため、更新完了後のD_vが少なくとも1減る。

区間の一部だけを更新するnodeでは、更新後の値は元の値かcapなので、D_vの増加は高々1である。このようなnodeは更新区間の左右の境界に沿うO(log N)個だけ。Q回の更新によるΦの総増加はO(Q log N)であり、Φ≥0から、区間全体を覆っているのに失敗して子へ降りる回数Fは`F≤Φ_initial+O(Q log N)=O((N+Q)log N)`となる。

再帰木の内部nodeは境界による下降か、この失敗下降のどちらかで、各下降が増やす子の呼出しは二つだけである。したがって成功・変更なしで終了するnodeも含めた総訪問数はO(Q log N+F)。区間和の取得は通常の区間分割で一回O(log N)である。

### 集合更新への転用

一般化の要点は「要約だけで作用が決まる成功条件」と「失敗によって減る量」を対にして設計すること。ABC430 Gでは、区間内の集合の和集合O、共通部分A、要素数の最大値M、その達成個数Cを持つ。`S_i←(S_i\a)∪b`に対し、`(O\A)∩(a∪b)=∅`なら変更対象の各要素は全集合に入っているか全集合に入っていない。このとき全集合の要素数が同じだけ変わるので、Mをその差で更新しCを保てる。

失敗時は子へ降り、変更対象だった不一致要素は更新後に全集合で存在・不在がそろう。potentialを`Σ_v |O_v\A_v|`にすれば、完全に覆われた失敗nodeごとに少なくとも1減る。本問の一要素追加・削除では境界nodeごとの増加も高々1である。chminの「値の種類」を集合の「存在が不一致の要素」へ置き換えることで、同じ償却解析を使える。

## 成立条件と計算量

chminと区間和の標準形は構築O(N)、Q回の操作全体でO((N+Q)log N)、空間O(N)。一操作の最悪時間はO(N)になり得るので、一回ごとのO(log N)ではなく上の総費用で保証する。sumと`(max−cap)·countMax`を保持できる整数幅を選ぶ。

chmaxと区間和だけなら、値の符号を反転してchminへ写すか、最小値・次点の最小値・最小値の個数を持つ対称な実装にすれば同じ上界になる。chminとchmaxや区間加算を併用すると、ここで用いたpotentialの増加量の証明はそのまま使えないため、操作集合に合わせて改めて評価する。

集合更新では、要素の宇宙サイズをBとすると初期potentialはO(NB)、操作全体のnode訪問数はO(NB+Q log N)。集合が一wordに収まり集合演算・popcountがO(1)なら、構築も含めO(NB+(N+Q)log N)で処理できる。複数wordを使う場合は集合演算の費用を掛ける。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

このUnitを直接前提とする単元: なし。

区間monoid要約で得た考え方と実装を再利用し、Segment Tree Beatsの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)（nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC430 G 公式解説](https://atcoder.jp/contests/abc430/editorial/14300)
- [ABC430 G 公式問題文](https://atcoder.jp/contests/abc430/tasks/abc430_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-segment-tree-beats`
