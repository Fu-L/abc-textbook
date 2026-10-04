---
title: "ABC418-E — Trapezium"
draft: true
authoringUnit: {"problemId":"abc418-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc418-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc418-e-problem-ceda433652ba568626bdd50b726f80c88bbda34617dc2502db914c5ce5bb4ac6","source-abc418-editorial-13627-d8fc47873256b4fbd91ba38e3378afaacd51b78b21354fe97c2f17f521c0f38a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"direction(dx,dy)はgcd(|dx|,|dy|)で割り、最初の非零成分が正になるよう符号を統一すれば、verticalを含め浮動小数なしに平行判定できる。 midpointは((x_i+x_j)/2,(y_i+y_j)/2)だが、keyを座標和(x_i+x_j,y_i+y_j)にすれば分数を使わず完全一致を判定できる。 前半は非parallelogram trapezoidを1回、parallelogramを2回数え、後半はparallelogramを1回ずつ数えるため最終的に全対象が一回になる。","sourceRevisionIds":["source-abc418-e-problem-ceda433652ba568626bdd50b726f80c88bbda34617dc2502db914c5ce5bb4ac6","source-abc418-editorial-13627-d8fc47873256b4fbd91ba38e3378afaacd51b78b21354fe97c2f17f521c0f38a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

四点がtrapezoidを作るたび、平行な対辺pairが一組あれば同じdirectionの二segmentとして数えられる。parallelogramだけは平行対辺が二組あるので二重に数えられる。

四点がparallelogramを作る必要十分条件は二diagonalのmidpointが一致することであり、segment pairのmidpoint keyから個数を数えられる。

採用する候補: 全点pairの正規化direction別にC(c,2)を足し、midpoint別のC(d,2)を引く

棄却する候補: 四点subsetを全列挙し、並べ替えて辺の平行性を判定する

C(N,4)=Θ(N^4)でN=2000に使えず、parallel sideとdiagonal midpointというpair統計へ分解できていない。

i<jの全pairについてcanonical(dx,dy)の頻度と(x_i+x_j,y_i+y_j)の頻度をmapへ加える。ans=Σ_direction c(c-1)/2-Σ_midpoint d(d-1)/2を64 bitで計算して出力する。

## 典型の発動条件

### pair invariant の頻度数え上げ

発動条件: 四要素構造が同じ不変量を持つ二pairとして特徴づくとき。

全O(N^2) pairをdirection/midpoint keyでgroup化してpair-of-pairsを数える。

### 有理方向の正規化

発動条件: segmentの傾き一致をexactに比較したいとき。

差vectorをgcdでprimitive化し、符号をcanonicalにする。

### 二重計数の補正

発動条件: 特殊構造だけが複数の証拠を持ち主計数で重複するとき。

二組の平行辺を持つparallelogramをdiagonal midpointで一回数えて引く。

## 問題固有の要素

trapezoidの平行辺pairを数えた後、二証拠を持つparallelogramだけを別のpair invariantで抽出して一回補正する。

別の問題へ持ち帰る視点: 対象ごとのcertificate数が通常1・特殊case2なら、certificate総数から特殊case数を引く設計が使える。

## 正当性

direction(dx,dy)はgcd(|dx|,|dy|)で割り、最初の非零成分が正になるよう符号を統一すれば、verticalを含め浮動小数なしに平行判定できる。 midpointは((x_i+x_j)/2,(y_i+y_j)/2)だが、keyを座標和(x_i+x_j,y_i+y_j)にすれば分数を使わず完全一致を判定できる。 前半は非parallelogram trapezoidを1回、parallelogramを2回数え、後半はparallelogramを1回ずつ数えるため最終的に全対象が一回になる。

## 実装上の注意

- dx=0/dy=0の符号規約を統一する。同directionの二segmentがendpointを共有するcaseは三点共線禁止で生じない。頻度pair数と答えは64 bitを使う。

## 復習の核

- parallelogram一個、平行辺一組だけのtrapezoid、vertical/horizontal、同directionが多数ある小点集合を四点全列挙と比較する。

## 計算量と制約

### 時間

O(N² log N)、全pairのdirection/midpoint map。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 4 \leq N \leq 2\,000; 0 \leq X_i, Y_i \leq 10^7 (1 \leq i \leq N); No two points are at the same location.; No three points are collinear.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/tasks/abc418_e) — source-abc418-e-problem-ceda433652ba568626bdd50b726f80c88bbda34617dc2502db914c5ce5bb4ac6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/editorial/13627) — source-abc418-editorial-13627-d8fc47873256b4fbd91ba38e3378afaacd51b78b21354fe97c2f17f521c0f38a
