---
title: "ABC366-E — Manhattan Multifocal Ellipse"
draft: true
authoringUnit: {"problemId":"abc366-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc366-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-two-pointers-window"],"sourceRevisionIds":["source-abc366-e-problem-cb0d25a165a19479b8e9217c5f357fd3f13c4f691ad47579238461a6f90e952a","source-abc366-editorial-10640-a7dbc542388d153275ac2f9047c67898840b39621ff70e6e0be9a1e5046143fc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"距離和はx軸fとy軸gの和へ分離される。外側座標は一点への距離だけでもDを超えるので有限範囲で十分。隣接移動の差は左点数−右点数で各f,gを正確に求められ、その値列をsortしても各coordinateの重複度を保持する。F+G≤Dのpair数を単調pointerで足せば全格子点を一度数える。","sourceRevisionIds":["source-abc366-e-problem-cb0d25a165a19479b8e9217c5f357fd3f13c4f691ad47579238461a6f90e952a","source-abc366-editorial-10640-a7dbc542388d153275ac2f9047c67898840b39621ff70e6e0be9a1e5046143fc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

Manhattan距離和はf(x)=Σ|x−x_i|とg(y)=Σ|y−y_i|に分離され、条件はf(x)+g(y)≤Dとなる。

候補座標は入力座標絶対値の最大MからDだけ外側までで十分で、その有限範囲ではf,gを隣接座標への差分で一括計算できる。

採用する候補: 全候補x,yの一次元距離和列を作ってsortし、二列の和がD以下のpair数をtwo pointersで数える。

二次元点列挙を独立な一次元costのpair countingへ変換し、全組を直接調べずに済む。

棄却する候補: bounding box内の各格子点でN点へのManhattan距離を加算する。

二次元範囲の面積とNの積になり、距離のx,y分離を利用できない。

sorted x_iに対し座標xを1増やすと、左側点数だけfが増え右側点数だけ減るため、pointerで差分更新できる。gも同様である。

F,Gを昇順にすると、Fを大きい側から見るにつれて許されるGの上端が単調に動き、尺取りでpair数を足せる。

R=max座標絶対値+Dとし、x座標列をsortしてf(−R)を直接求め、−R..Rを点数差分で更新してFを作る。yについてGも作る。両列をsortし、各F値に対してG≤D−Fの個数を単調pointerで数えて総和する。

## 典型の発動条件

### Manhattan距離の軸分離

発動条件: 点群へのL1距離総和で格子点を数えるとき。

xとyの絶対値和を独立な一次元costへ分ける。

### 距離和列の差分生成と尺取り

発動条件: 凸な一次元costを連続整数上で列挙し、その二列の和制約pairを数えるとき。

傾きを左右点数で更新し、sort後の単調境界を走査する。

## 問題固有の要素

二次元の楕円状領域でも、各軸costの値分布さえ作れば答えは二配列の和の組数になる。

別の問題へ持ち帰る視点: separable objectiveの格子点計数では、座標でなく各軸costのhistogramを組み合わせる。

## 正当性

距離和はx軸fとy軸gの和へ分離される。外側座標は一点への距離だけでもDを超えるので有限範囲で十分。隣接移動の差は左点数−右点数で各f,gを正確に求められ、その値列をsortしても各coordinateの重複度を保持する。F+G≤Dのpair数を単調pointerで足せば全格子点を一度数える。

## 実装上の注意

- 探索範囲端を十分外へ取り、負座標からのindex変換を統一する。距離和と格子点pair数は64 bitで保持する。

## 復習の核

- 一点だけの場合に領域がdiamondとなる個数と照合する。f(x)差分の「x未満」と「x以上」の境界を重複座標で確認する。

## 計算量と制約

### 時間

O(N log N+R log R)、R=max(|x_i|,|y_i|)+D、軸列長O(R)。

### 空間

O(N+R)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq D \leq 10^6; -10^6 \leq x_i, y_i \leq 10^6; (x_i, y_i) \neq (x_j, y_j) for i \neq j.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/tasks/abc366_e) — source-abc366-e-problem-cb0d25a165a19479b8e9217c5f357fd3f13c4f691ad47579238461a6f90e952a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/editorial/10640) — source-abc366-editorial-10640-a7dbc542388d153275ac2f9047c67898840b39621ff70e6e0be9a1e5046143fc
