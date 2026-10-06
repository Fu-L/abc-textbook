---
title: "kinetic sorting・交差event順序更新"
description: "「kinetic sorting・交差event順序更新」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 27
---

# kinetic sorting・交差event順序更新

習得対象の目安: **橙色（2400–2799）**。連続的な順序変化を隣接交差に限定し、失効eventと総event数を管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### kinetic sorting・交差event順序更新

連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。

### 習得する技能

- 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。

## 考え方

時間で変わる対象の順序を、隣接対が交差するeventだけで更新する。次の順序変化が隣接対から始まることを利用し、全対象を毎回sortする費用を避ける。


各対象の値がf_i(t)=a_i t+b_iのとき、現在時刻t0直後の順序を配列orderと逆配列posで持つ。隣接i,jで今後順序が逆転するなら交点t=(b_j−b_i)/(a_i−a_j)>t0をheapへ入れる。同傾きは交差しない。eventをpopしたら、二者がまだその向きで隣接し、記録した世代番号も現在と一致するかを確認する。古いeventなら捨て、有効なら二者をswapしてposを直し、変わった高々三つの隣接対の次eventを追加する。

次の順位変化は連続性からどこかの隣接二者の等値で起こるので、全隣接対の次eventを持てば漏れない。同時に三者以上が交差する場合は、同じ時刻の等値連続blockをまとめ、直後の傾き順で並べ直す。二者swapを任意順に進めて終了したとみなさない。値が同一の直線は固定IDで順序を決める。交点は有理数として分母の符号を揃え、交差積で正確に比較できる。

同時交差の別の処理として、直後のtie順でまだ逆転している隣接pairをその同時刻で再登録し、逆転がなくなるまでswapする方法もある。ABC344 Gのscore=Y−AXを昇順で持つ場合、交点cで左X<右Xの隣接二者をswapしてX降順へ直す。swap後に新しくできる交点=cのeventも登録する。全体を一回ずつの二者交換だけで済ませたり、新eventを時刻>cへ限定したりすると、三者以上の交差を落とす。各pairが一度だけ逆転する一次関数という条件の下で、同時刻の連鎖も全pair数へ償却できる。

## 成立条件と計算量

交差event数Kならheapや平衡木でO((N+K) log N)程度だが、K自体が二次になり得る。過去の隣接関係から生まれた古いeventを無効化し、同時交差の扱いを固定する。入力に必要なKの上界を別に証明する。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。

このUnitを直接前提とする単元: なし。

event・値順のオフライン走査で得た考え方と実装を再利用し、kinetic sorting・交差event順序更新の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g) — 主題: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)（隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h) — 主題: [凸包・支持方向・境界候補](/learn/geometry-optimization/convex-boundary-hull/)（目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。）。既習技能: [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/)（隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。）。

## 根拠

- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC344 G 公式解説](https://atcoder.jp/contests/abc344/editorial/9491)
- [ABC344 G 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-kinetic-order-maintenance`
