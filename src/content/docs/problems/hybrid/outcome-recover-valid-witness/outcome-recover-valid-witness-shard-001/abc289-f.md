---
title: "ABC289-F — Teleporter Takahashi"
draft: true
authoringUnit: {"problemId":"abc289-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc289-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d","source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"反射では各座標の偶奇が保たれる。非退化軸は隣り合う中心の反射2回で座標を任意の同偶奇値へ動かせる。singleton軸で可能な操作回数の偶奇は、初期値を保つ偶数回、または中心反射値へ移す奇数回であり、evenPossible / oddPossible がその条件を表す。偶数が可能なら反射対だけで両座標を調整できる。奇数だけ可能なら `(a,c)` を先に反射し、現在点を更新した後、残りを偶数回の反射対で調整できる。両方不可能なら、どの操作列も共有する操作回数の偶奇を満たせない。","sourceRevisionIds":["source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d","source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

反射中心が整数なら各座標の偶奇は変わらない。また、中心 `a` と `a+1` の反射をこの順で行うと x だけが `+2`、逆順なら `−2` され、y方向も同様に独立調整できる。

singleton軸では、その座標を保つ偶数回と中心反射で移る奇数回の両方が可能な場合がある。したがって偶数回で到達できるか、奇数回で到達できるかを別々に判定する。

`evenPossible=(a<b または sx=tx) かつ (c<d または sy=ty)`、`oddPossible=(a<b または sx+tx=2a) かつ (c<d または sy+ty=2c)` とする。両方偽なら不可能。偶数が可能なら反射せず、奇数だけ可能なら `(a,c)` を一回反射してから ±2 の組で残差を埋める。

採用する候補: 座標偶奇と操作回数偶奇を判定し、反射対を並べて操作列を構成する。

操作を短い組へ合成すれば、2次元の結合は最初の一回の偶奇選択だけに整理できる。

棄却する候補: x用・y用の1次元操作列を独立に作って連結する。

各反射は両座標へ同時に作用するため、singleton軸が要求する総操作回数の偶奇が衝突し得る。

## 典型の発動条件

### reflection合成によるtranslation

発動条件: 中心反転を複数回使って目標座標へ構成的に移動するとき。

近接2中心での反射を合成して±2の平行移動を作る。

### 不変量と退化case

発動条件: 操作可能領域が区間で、長さ0の場合だけ自由度が失われるとき。

座標parityに加え、singleton中心での操作回数parityを判定する。

### 構成問題の現在状態更新

発動条件: 出力操作列を段階的に組み立てるとき。

各reflection後の現在座標を更新し、残差をtranslation pairで消す。

## 問題固有の要素

2操作を同じy中心で行えばyへの反射が相殺され、xだけを動かせるため、2次元の結合は総操作回数parity以外ほぼ分離できる。

別の問題へ持ち帰る視点: 複数座標へ同時作用する操作は、短い操作列を合成して不要座標への作用をidentityにできないか探す。

## 正当性

反射では各座標の偶奇が保たれる。非退化軸は隣り合う中心の反射2回で座標を任意の同偶奇値へ動かせる。singleton軸で可能な操作回数の偶奇は、初期値を保つ偶数回、または中心反射値へ移す奇数回であり、evenPossible / oddPossible がその条件を表す。偶数が可能なら反射対だけで両座標を調整できる。奇数だけ可能なら `(a,c)` を先に反射し、現在点を更新した後、残りを偶数回の反射対で調整できる。両方不可能なら、どの操作列も共有する操作回数の偶奇を満たせない。

## 実装上の注意

- まず `sx≡tx`、`sy≡ty (mod 2)` を確認し、その後evenPossibleとoddPossibleを独立に計算する。片方が真でもう片方が偽とは限らない。
- 奇数だけ可能な場合は最初の反射後に x,y の両方を更新してから差を計算する。singleton軸では `a+1` や `c+1` を中心に使わない。

## 復習の核

- 両区間がsingletonで一方だけ反射を要求する不可能例と、片軸だけ非退化な可能例を試し、初回reflection後の±2 pairが他軸を保つか追う。

## 計算量と制約

### 時間

O(Dx+Dy)、Dx,Dyは2刻みtranslation数。

### 空間

O(Dx+Dy)、操作列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0\leq s _ x,s _ y,t _ x,t _ y\leq2\times10^5; 0\leq a\leq b\leq2\times10^5; 0\leq c\leq d\leq2\times10^5; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5711) — source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_f) — source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8
