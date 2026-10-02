---
title: "ABC334-E — Christmas Color Grid 1"
draft: true
authoringUnit: {"problemId":"abc334-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc334-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc334-e-problem-3fcc496e040f815592e86224b94ccb06f704495a049994d43e2236e1750702f2","source-abc334-editorial-8987-b5406de59fd4abbb6979c1bc648407117b6f6e6a3358fba9e90bfcb7a486295f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"x=0でも式C-x+1は新しい孤立成分が増える場合を正しく表す。四近傍に同じ成分のcellが複数あってもmergeされる成分は一つなので、cell数でなく成分IDのdistinct数を数える。 一回のBFS/DFS後は各選択結果を定数個の近傍だけで評価できる。","sourceRevisionIds":["source-abc334-e-problem-3fcc496e040f815592e86224b94ccb06f704495a049994d43e2236e1750702f2","source-abc334-editorial-8987-b5406de59fd4abbb6979c1bc648407117b6f6e6a3358fba9e90bfcb7a486295f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

赤cellを一つ緑にすると変化するのは、そのcellに隣接する既存の緑連結成分だけである。隣接する相異なる成分数をxとすれば、それらx個と新cellが一つへまとまり、全体の成分数はC-x+1になる。

採用する候補: 緑cellの成分IDを前計算し、各赤cellの四近傍IDをdeduplicateする

一回のBFS/DFS後は各選択結果を定数個の近傍だけで評価できる。

棄却する候補: 赤cellごとに塗り替えて連結成分を数え直す

赤cell数回の全grid探索が必要でO((HW)^2)になり得る。

x=0でも式C-x+1は新しい孤立成分が増える場合を正しく表す。四近傍に同じ成分のcellが複数あってもmergeされる成分は一つなので、cell数でなく成分IDのdistinct数を数える。

全# cellをBFS/DFSして成分IDを付け、元の成分数Cを得る。各. cellについて四近傍のIDを小配列またはsetで重複除去し、C+1-xを総和する。赤cell数Rで割るためRのmod逆元を掛ける。

## 典型の発動条件

### 連結成分labeling

発動条件: 多数の局所変更が同じ固定グラフの成分構造を参照する。

最初に全緑cellへcomponent IDを付け、変更点の近傍関係だけを調べる。

### 期待値の全事象平均

発動条件: 選択は全赤cellから一様で、各選択後の値を独立に計算できる。

各cellの成分数をmodで合計し、候補数の逆元を掛ける。

## 問題固有の要素

追加頂点が接する相異なる既存成分数xだけで成分数差1-xが決まり、内部形状や接する辺数は不要である。

別の問題へ持ち帰る視点: 頂点追加によるcomponent変化は、隣接componentのdistinct数へ圧縮できる。

## 正当性

x=0でも式C-x+1は新しい孤立成分が増える場合を正しく表す。四近傍に同じ成分のcellが複数あってもmergeされる成分は一つなので、cell数でなく成分IDのdistinct数を数える。 一回のBFS/DFS後は各選択結果を定数個の近傍だけで評価できる。

## 実装上の注意

- 四近傍の同じIDを重複して数えない。赤cell数は少なくとも1であり、C+1-xの負値をmod正規化する。

## 復習の核

- 緑が0個、赤cellが同一成分へ複数辺で接する、2～4成分を橋渡しする、grid端のcellを含む例を直接塗り替えと比較する。

## 計算量と制約

### 時間

O(HW)、成分labelと各赤cellの四ID重複除去。

### 空間

O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 1000; S_{i,j} = . or S_{i,j} = #.; There is at least one (i,j) such that S_{i,j} = ..

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/tasks/abc334_e) — source-abc334-e-problem-3fcc496e040f815592e86224b94ccb06f704495a049994d43e2236e1750702f2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc334/editorial/8987) — source-abc334-editorial-8987-b5406de59fd4abbb6979c1bc648407117b6f6e6a3358fba9e90bfcb7a486295f
