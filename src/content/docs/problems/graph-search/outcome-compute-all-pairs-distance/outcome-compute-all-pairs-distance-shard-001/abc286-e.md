---
title: "ABC286-E — Souvenir"
draft: true
authoringUnit: {"problemId":"abc286-e","docPath":"src/content/docs/problems/graph-search/outcome-compute-all-pairs-distance/outcome-compute-all-pairs-distance-shard-001/abc286-e.md","learningOutcomeIds":["outcome-compute-all-pairs-distance"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc286-e-problem-8454afd2d7cbf93f7d73902a6055c610ab7cbfb726bb93e69934145bacd7924e","source-abc286-editorial-5572-6f1f3b4f5ad6878e0e42cb4f8c140808d5f176a3ada4b42bc6a24bbf081f5871"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"path比較は辺数最小、その中で価値最大の辞書順で、共通中継kの価値を一回引いて合成する。正の辺数により同距離候補は余計なcycleを含まずFloydの中継prefix不変条件が成立する。各段で最良pairを保持し全最短path最大価値を得る。","sourceRevisionIds":["source-abc286-e-problem-8454afd2d7cbf93f7d73902a6055c610ab7cbfb726bb93e69934145bacd7924e","source-abc286-editorial-5572-6f1f3b4f5ad6878e0e42cb4f8c140808d5f176a3ada4b42bc6a24bbf081f5871"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-all-pairs-distance"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"価値(2,5,9)、辺1→2,2→3,1→3。","procedure":["直行1→3は1便、価値11。","経由は2便、価値16。","便数優先で直行を採る。"],"executionTarget":null,"expectedResult":"1便、価値11","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-all-pairs-distance"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"最大価値だけで経由を選んでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。価値は最少便数の中での第二目的。上例は16より11を選ぶ。"},"answer":{"reasoningOrVerification":"不可。価値は最少便数の中での第二目的。上例は16より11を選ぶ。","procedure":["具体例の各状態・寄与を再計算する。","不可。価値は最少便数の中での第二目的。上例は16より11を選ぶ。"],"expectedResult":"不可。価値は最少便数の中での第二目的。上例は16より11を選ぶ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

最優先はflight本数の最小化であり、その同率解の間だけsouvenir価値を最大化するので、経路評価は(distance, value)の辞書式順序になる。 最短pathは同じ都市を繰り返さないため、頂点価値は出発都市を一度加え、edge u→vを通るたび到着都市A_vを加える形へ移せる。 候補は距離が小さければ常に優先し、距離が等しいときだけ価値が大きい方へ更新すれば、問題の二段階最適化と一致する。 i→kとk→jを連結すると都市kの価値を二重に数えるため、価値はval[i][k]+val[k][j]-A_kで合成する。

採用する候補: 全点対Floyd–Warshallの値を最短距離と同距離での最大価値のpairに拡張する。

N≤300で全queryを一括前計算でき、距離優先・価値優先の更新規則を厳密に実装できる。

棄却する候補: 各edge costを1-εA_vとする浮動小数最短路。

概念上は優先順位を埋め込めても、εと丸め誤差によりflight本数と価値の比較が壊れ得る。

棄却する候補: flight本数だけの最短距離を求めた後、任意の到達pathから価値を集計する。

同じ最短距離を持つ複数pathから最大価値のものを選ぶ情報が失われる。

候補は距離が小さければ常に優先し、距離が等しいときだけ価値が大きい方へ更新すれば、問題の二段階最適化と一致する。

i→kとk→jを連結すると都市kの価値を二重に数えるため、価値はval[i][k]+val[k][j]-A_kで合成する。

dist[i][i]=0,val[i][i]=A_i、direct flight i→jにはdist=1,val=A_i+A_jを設定し、他は到達不能とする。各k,i,jで到達可能なら候補(distance=dist[i][k]+dist[k][j], value=val[i][k]+val[k][j]-A_k)を作り、distance最小・同率value最大で更新する。queryは到達不能ならImpossible、否则pairを出力する。

## 典型の発動条件

### 多目的最短路の辞書式pair

発動条件: 最優先costを最適化し、その同率解でsecondary scoreを最適化するとき。

比較演算を距離昇順・価値降順に定義してrelaxする。

### Floyd–Warshallの半環拡張

発動条件: 全点対queryが多く、path情報を結合可能な値として持てるとき。

pairの選択と中継点での結合を定義して三重loopを適用する。

## 問題固有の要素

都市価値をedge到着時の加点へ変換すると、出発点だけを初期値に持たせればpathの各都市を一度ずつ数えられる。

別の問題へ持ち帰る視点: 頂点重み付きpathは、開始点の初期寄与と入辺通過時の到着点寄与へ分解すると標準的な最短路更新へ載せやすい。

## 正当性

path比較は辺数最小、その中で価値最大の辞書順で、共通中継kの価値を一回引いて合成する。正の辺数により同距離候補は余計なcycleを含まずFloydの中継prefix不変条件が成立する。各段で最良pairを保持し全最短path最大価値を得る。

## 実装上の注意

- 到達不能なpairを加算せず、価値総和は最大約300×10^9なので64bit整数を使う。
- 中継合成ではA_kを一度引き、direct edgeの両端価値や始点価値を欠落・二重計上しない。

## 復習の核

- 同じ2-edge距離で価値だけ異なる2経路を作って更新順を確認し、i→k→jのkが一度だけ加算されることとImpossible判定を照合する。

## 計算量と制約

### 時間

N都市、Q質問。pair最適Floyd O(N³)、照会O(Q)。

### 空間

距離と価値二行列 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 300; 1\leq A_i\leq 10^9; S_i is a string of length N consisting of Y and N.; The i-th character of S_i is N.; 1\leq Q\leq N(N-1); 1\leq U_i,V_i\leq N; U_i\neq V_i; If i \neq j, then (U_i,V_i)\neq (U_j,V_J).; N,A_i,Q,U_i, and V_i are all integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

価値(2,5,9)、辺1→2,2→3,1→3。

1. 直行1→3は1便、価値11。
2. 経由は2便、価値16。
3. 便数優先で直行を採る。

期待される結果: 1便、価値11

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最大価値だけで経由を選んでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。価値は最少便数の中での第二目的。上例は16より11を選ぶ。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/tasks/abc286_e) — source-abc286-e-problem-8454afd2d7cbf93f7d73902a6055c610ab7cbfb726bb93e69934145bacd7924e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/editorial/5572) — source-abc286-editorial-5572-6f1f3b4f5ad6878e0e42cb4f8c140808d5f176a3ada4b42bc6a24bbf081f5871
