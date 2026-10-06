---
title: "端点更新型のrun分割管理"
description: "「端点更新型のrun分割管理」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 47
---

# 端点更新型のrun分割管理

習得対象の目安: **青色（1600–1999）**。run分割やactive区間の和集合を管理し、endpoint更新・重複被覆・消去回数の償却を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 動的な区間和集合長

区間の追加・削除に応じて被覆の重複を保ち、現在の和集合の長さを更新する。Inventoryで特定されていない実装backendを前提にしない。

### 端点更新型のrun分割管理

順序付きのrun分割をdequeや連結リストで保持し、両端からの削除・分割・追加を行う。左端順setを使うODTとは区別する。

### ordered interval partition・ODT

互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。

### 習得する技能

- 区間の追加・削除に応じて重複被覆を管理し、active区間の和集合長を更新できる。具体的なbackendは採用解法が指定する場合に限って固定する。
- dequeなどの端点操作でrun分割を更新し、左右の境界からの削除・追加と各要素の償却回数を説明できる。
- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

同じ値の連続区間をordered mapへ持ち、操作端点でsplitして対象runを更新する。隣接する同値runをmergeして、互いに素な全域分割を保つ。


### split・mergeとunion長は別の要約

半開run[l,r)を左端lのmap keyとして保存する。split(x)はxを含むrunをpredecessorで探し、xが内部なら[l,x),[x,r)へ分ける。範囲[l,r)を代入する場合は両端をsplitし、その間のrunを消して一runへ置き換え、同じ値の左右隣接runをmergeする。端点だけの追加・削除ならdeque先頭・末尾の長さを減らし、0になったrunをpopし、追加値が同じなら長さを足す。各runの生成・消滅数に費用を課金する。

重複するactive区間の和集合長では、被覆の有無を単なる同値runの値として上書きしてはいけない。全区間端点を圧縮したSegment Treeで、各nodeに担当区間全体を覆う追加数coverとcoveredLenを持つ。区間追加はcanonical nodeのcover+=1、同じ区間削除は−=1。cover>0ならcoveredLen=元座標の右端−左端、cover=0なら左右のcoveredLenの和（葉なら0）。子の状態は親cover>0の間も保持するため、重複被覆を一枚外しても残る被覆を復元できる。根のcoveredLenが答えで、各操作O(log N)、全端点の前処理O(N log N)。

### 左端順の探索で右端条件を確認する

閉区間の白集合から[L,R]を除く場合、lower_bound((L,−∞))は左端がL以上の最初の区間だけを返す。左端がLより前でも右端がL以上なら交差するため、直前区間が存在する場合はその右端も確認する。互いに素な区間ではこの候補は高々一つである。交差区間を左端がR以下の間だけ消し、左右の残片を走査後に入れる。閉区間の長さはr−l+1で、半開区間のr−lと混同しない。

[ABC435 E](https://atcoder.jp/contests/abc435/editorial/14733)では一質問で生成する残片が高々二個なので、初期一区間を含む生成総数は1+2Q以下。各訪問で旧区間を消すことから、全訪問数もこの生成数以下となり、探索・消去・挿入を合計してO(Q log(Q+1))に償却できる。一般のODTに、同じ対数時間を無条件で保証する議論ではない。

## 成立条件と計算量

操作はO(log R)に触れたrun数と削除・挿入費用を加える。任意の操作列で毎回O(log N)とは限らない。runの生成数・消滅数を使った償却証明が必要。区間union長では座標差を使う。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)。

このUnitを直接前提とする単元: なし。

順序付きのrun分割をdequeや連結リストで保持し、両端からの削除・分割・追加を行う。左端順setを使うODTとは区別する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC380 E「1D Bucket Tool」](https://atcoder.jp/contests/abc380/tasks/abc380_e) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)（標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（dequeなどの端点操作でrun分割を更新し、左右の境界からの削除・追加と各要素の償却回数を説明できる。）。
- [ABC449 F「Grid Clipping」](https://atcoder.jp/contests/abc449/tasks/abc449_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（区間の追加・削除に応じて重複被覆を管理し、active区間の和集合長を更新できる。具体的なbackendは採用解法が指定する場合に限って固定する。）。

## 根拠

- [ABC251 H 公式解説](https://atcoder.jp/contests/abc251/editorial/3954)
- [ABC251 H 公式問題文](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-ordered-interval-partition`
