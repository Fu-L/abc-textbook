---
title: "ABC448-G — Conquest"
draft: true
authoringUnit: {"problemId":"abc448-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-line-envelope/outcome-optimize-by-line-envelope-shard-001/abc448-g.md","learningOutcomeIds":["outcome-optimize-by-line-envelope"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-change-impact-localization"],"excludedTopics":["Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-hull-trick","tag-witness-impact-localization"],"sourceRevisionIds":["source-abc448-editorial-16719-b11eff7b70376383870574c557d89c78380420afec2ae7ae0aa370fff764e9b4","source-abc448-g-problem-9c3d193be0c9d1434381d4d84a1343349ce51759b1518d85fcdd834176e390f2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"相手二列混合xに対し各行利得は一次式で、最良応答はそのmax。min_x max行がminimax値。凸包絡線の最小は端点の一本か交点の二supportだけで証明でき、それら以外を除いても最小値は保たれる。support行だけ再計算すれば全BAN値を得る。同じ三成分値vectorを統合しても戦略集合の凸包は変わらないので、定数サイズの最終零和gameへ縮約できる。","sourceRevisionIds":["source-abc448-editorial-16719-b11eff7b70376383870574c557d89c78380420afec2ae7ae0aa370fff764e9b4","source-abc448-g-problem-9c3d193be0c9d1434381d4d84a1343349ce51759b1518d85fcdd834176e390f2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Convex Hull Trick・直線包絡](src/content/docs/learn/geometry-optimization/line-envelope.md)

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

先に読む単元:

- [基準witnessから変更影響を局所化する](src/content/docs/learn/modeling/change-impact-localization.md) — 変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。

## 考察

各 BAN 後の勝率は有限零和 game の値であり、相手の二択混合確率 x を固定すると各自戦略は一次式になる。したがって game 値は直線群の上包絡線の [0,1] 最小値で表せる。

採用する候補: 各相手 BAN j について直線の上包絡線を構築し、一つの自戦略 i を除いた game 値 V_{i,j} を包絡線の基底となる高々定数本だけ再計算する。残る 3×N game は重複列を除き定数規模の凸最適化で解く。

包絡線の最小点を支える直線は高々二本で、それ以外を一本除いても値が変わらないため、V の異なる列型は定数個しか生じない。

棄却する候補: 全 BAN 組ごとに一般線形計画を独立に解き、最後の game も N 列のまま処理する。

同じ包絡線を N 回再構築して高次時間となり、問題固有の二列 game と定数 basis 性を利用できない。

二列零和 game では相手混合率 x に対する最良応答が max_k L_k(x) で、その最小値が minimax value になる。

全直線の包絡線の最小点を決める basis S は高々二本で、i∉S なら L_i を除いた値 V_i は共通の y_0 である。

j=1..3 ごとに残る二列から各行の直線を作り、傾き順の上包絡線と最小点・support setを求める。support 行だけ除外版を個別計算し V_{i,j} を埋める。三成分 vector の重複を消し、定数列の3行零和 game を入れ子三分探索等で解く。

## 典型の発動条件

### 零和 game の包絡線化

発動条件: 一方の純粋戦略が二つで混合率を一変数にできるとき。

最良応答を一次式の上包絡線として minimax 値を求める。

### 最適解 basis の除外 query

発動条件: 全要素集合の凸最適値から一要素除外値を全件求めたいとき。

最適点を支える定数個だけ再計算し、他は共通値とする。

## 問題固有の要素

game の混合戦略を直接列挙せず、低次元側の確率を座標にすると相手の最良応答が凸包・包絡線になる。

別の問題へ持ち帰る視点: 凸最適解を支える制約が少数なら、一要素除外で答えが変わり得る要素も少数に限られる。

## 正当性

相手二列混合xに対し各行利得は一次式で、最良応答はそのmax。min_x max行がminimax値。凸包絡線の最小は端点の一本か交点の二supportだけで証明でき、それら以外を除いても最小値は保たれる。support行だけ再計算すれば全BAN値を得る。同じ三成分値vectorを統合しても戦略集合の凸包は変わらないので、定数サイズの最終零和gameへ縮約できる。

## 実装上の注意

- 交点・同傾き・区間端0/1での最小を誤差込みで頑健に比較する。support が退化する場合も高々二本の例外を漏らさない。

## 復習の核

- 二列 game の payoff を x の一次式へ展開し、包絡線最小点を支えない行を除いても値が不変な図を描いて確認する。

## 計算量と制約

### 時間

O(N log N+I²)の固定三列構造。各列BANの上包絡線と高々二support除去、最終定数サイズgameをI回探索。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 500; 3 \leq N \leq 5 \times 10^4; 0 \leq X_{i,j} \leq 10^6; The sum of N over all test cases is at most 5 \times 10^4.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/editorial/16719) — source-abc448-editorial-16719-b11eff7b70376383870574c557d89c78380420afec2ae7ae0aa370fff764e9b4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/tasks/abc448_g) — source-abc448-g-problem-9c3d193be0c9d1434381d4d84a1343349ce51759b1518d85fcdd834176e390f2
