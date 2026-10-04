---
title: "ABC353-F — Tile Distance"
draft: true
authoringUnit: {"problemId":"abc353-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc353-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9","source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"大タイルを使わない経路はManhattan上界より改善しない。使う場合は最初・最後の大タイルへの小タイル部分を直進候補へ置き換えて費用を増やさない。大タイル間では対角1,1の移動が2料金で両軸を縮め、一軸2の移動はK+1料金または対角二回の4料金で行える。これらで2min(dx,dy)+min(K+1,4)|dx−dy|/2を実現でき、各移動の料金と座標差からこれより安い進行はできない。K=2とK≥3の閉式、全入口・出口候補、直行候補の最小が全最適路を覆う。","sourceRevisionIds":["source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9","source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

小タイルだけの移動は一歩ごとに料金1で、Manhattan距離が上界になる。K=1ではこれが答え。K≥2で改善する道は大タイルを通るので、最初と最後の大タイルを固定して比較する。

位置(x,y)のblockを(a,b)=(floor(x/K),floor(y/K))、block内offsetを(u,v)=(x mod K,y mod K)とする。a+b奇数なら大タイル内で、候補は(a,b,費用0)だけ。偶数なら左右上下の隣の大タイルへ直接入り、候補と費用は(a−1,b,u+1)、(a+1,b,K−u)、(a,b−1,v+1)、(a,b+1,K−v)。目標側も同じ候補を作る。最初の大タイルへ至る小タイル部分を直進へ置き換えられるので、これらで最適路を覆う。

二つの大タイルindex差をdx,dy≥0、s=min(dx,dy),t=max(dx,dy)とする。大タイルはindex和が奇数なのでt−sは偶数。対角隣接は小タイル一個を跨ぐ2料金で、両座標を一つずつ進められる。まずs回対角へ進み2sを払う。残る一軸の距離t−sは、二回の対角zigzagで2indexを4料金で進めるから、K≥3では総距離2s+2(t−s)=2t。

K=2では同じ一軸の2index移動を、幅2の小blockを横切る3料金で行える。従って距離は2s+3(t−s)/2=dx+dy+|dx−dy|/2。K≥3ではその直進費用K+1が4以上なのでzigzagで十分。例えば差(2,0)はK=2なら3、K≥3なら4であり、特殊分岐を省けない。

始点・終点の高々16候補対について、入口料金＋この大タイル間距離＋出口料金を評価し、Manhattan上界との最小を返す。負の隣接blockを避けたい場合は両点を(K,K)だけ平行移動してから計算する。

## 典型の発動条件

### 周期盤面の gateway 列挙

発動条件: 広大・無限な周期空間で、低コスト領域へ入るまでの候補方向が定数個のとき。

始終点から最初/最後に使う gateway を列挙し、内部距離を閉形式化する。

### 格子距離の座標変換

発動条件: checkerboard 状の大 block 間移動が対角・軸方向で異なるとき。

block index の和差または dx,dy から最小 toll を算出する。

## 問題固有の要素

大 tile を使わない上界を先に持つことで、「使うなら最初と最後の大 tile だけを決める」という経路正規化ができる。

別の問題へ持ち帰る視点: 特殊な高速領域がある最短路では、通常経路上界と高速領域への gateway 分解を試す。

## 正当性

大タイルを使わない経路はManhattan上界より改善しない。使う場合は最初・最後の大タイルへの小タイル部分を直進候補へ置き換えて費用を増やさない。大タイル間では対角1,1の移動が2料金で両軸を縮め、一軸2の移動はK+1料金または対角二回の4料金で行える。これらで2min(dx,dy)+min(K+1,4)|dx−dy|/2を実現でき、各移動の料金と座標差からこれより安い進行はできない。K=2とK≥3の閉式、全入口・出口候補、直行候補の最小が全最適路を覆う。

## 実装上の注意

- K=1 と K=2 は距離式の例外として分岐する。floor(x/K) の parity と tile の実座標を混同せず、全計算を 64 bit 以上で行う。

## 復習の核

- 大 tile graph を小さい K で描き、対角接触と横移動の toll を数えて式を導く。例外 K=2 を一般式へ無理に混ぜない。

## 計算量と制約

### 時間

O(1)。四方向入口・出口の高々16組を比較する。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq K\leq10^{16}; 0\leq S_x\leq2\times10^{16}; 0\leq S_y\leq2\times10^{16}; 0\leq T_x\leq2\times10^{16}; 0\leq T_y\leq2\times10^{16}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/editorial/9936) — source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/tasks/abc353_f) — source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9
