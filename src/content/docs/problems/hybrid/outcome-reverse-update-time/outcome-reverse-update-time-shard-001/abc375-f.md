---
title: "ABC375-F — Road Blocked"
draft: true
authoringUnit: {"problemId":"abc375-f","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc375-f.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-shortest-path"],"sourceRevisionIds":["source-abc375-editorial-11134-46a7d0b5e5b2d6b4f15c42bbcd674364d05a6523a2c867c4bfb122cd6efe4ec3","source-abc375-f-problem-3fa1c95ca2546d4c0f0158de162875929649a584d8ac3344dd32fbfd96a07704"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"削除は扱いにくいがオフライン逆順なら追加になり、過去の距離は上界としてそのまま利用できる。 辺 (u,v,c) 追加後の dist[x][y] は旧値、dist[x][u]+c+dist[v][y]、dist[x][v]+c+dist[u][y] の最小である。 閉鎖は高々300回で、N≤300 のため O(N^3+TN^2+Q) が許容され、距離問い合わせは O(1) になる。","sourceRevisionIds":["source-abc375-editorial-11134-46a7d0b5e5b2d6b4f15c42bbcd674364d05a6523a2c867c4bfb122cd6efe4ec3","source-abc375-f-problem-3fa1c95ca2546d4c0f0158de162875929649a584d8ac3344dd32fbfd96a07704"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reverse-update-time"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺12=2,23=2,13=5。辺23閉鎖後に1→3距離を問う。","procedure":["閉鎖後は直接辺で5。","reverseで23を追加すると経由距離2+2=4へ改善。"],"executionTarget":null,"expectedResult":"forward query答え5。","verificationStatus":"not_applicable","learningUnitIds":["unit-reverse-offline"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reverse-update-time"],"prerequisiteIds":["unit-weighted-shortest-path"],"attainmentCondition":"追加更新で新辺を二回使うpathも検査すべきか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"非負辺なら最短simple pathは新辺を高々一回使う。旧距離と新辺一回の二方向をminするだけで十分。"},"answer":{"reasoningOrVerification":"非負辺なら最短simple pathは新辺を高々一回使う。旧距離と新辺一回の二方向をminするだけで十分。","procedure":["具体例の各状態・寄与を再計算する。","非負辺なら最短simple pathは新辺を高々一回使う。旧距離と新辺一回の二方向をminするだけで十分。"],"expectedResult":"非負辺なら最短simple pathは新辺を高々一回使う。旧距離と新辺一回の二方向をminするだけで十分。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

道路閉鎖を逆順に見ると辺追加になる。追加前の全点対最短距離が分かると、新しい最短路は追加辺を使わないか、その無向辺を一方向に一度使う形へ単純化できる。

採用する候補: 最終的に残る辺で Floyd–Warshall を行い、クエリを逆処理して閉鎖辺を追加するたび全距離行列を O(N^2) で更新する。

閉鎖は高々300回で、N≤300 のため O(N^3+TN^2+Q) が許容され、距離問い合わせは O(1) になる。

棄却する候補: 各閉鎖・距離問い合わせ後に Dijkstra 法を最初から実行する。

Q は2×10^5で、問い合わせごとの単一始点最短路でも計算量が過大になる。

削除は扱いにくいがオフライン逆順なら追加になり、過去の距離は上界としてそのまま利用できる。

辺 (u,v,c) 追加後の dist[x][y] は旧値、dist[x][u]+c+dist[v][y]、dist[x][v]+c+dist[u][y] の最小である。

先に閉鎖される辺を除いたグラフで APSP を構築する。逆順に type 2 の答えを保存し、type 1 では対応辺を追加して旧距離行列を参照しながら全 x,y を更新する。最後に答えを反転する。

## 典型の発動条件

### 削除クエリの逆順処理

発動条件: オフラインで削除だけが起こり、逆にすると追加情報を単調に維持できるとき。

道路閉鎖を辺追加へ変換する。

### 一辺追加時の APSP 更新

発動条件: 全点対距離が既知の無向グラフへ一辺だけ追加するとき。

新辺を一度使う二方向の経路で全 pair を更新する。

## 問題固有の要素

動的最短路を一般形で解かず、更新回数が300以下という制約と逆順追加を組み合わせる。

別の問題へ持ち帰る視点: 正重みなので新辺を二度以上使う最短路は不要で、旧距離を部品として再利用できる。

## 正当性

削除は扱いにくいがオフライン逆順なら追加になり、過去の距離は上界としてそのまま利用できる。 辺 (u,v,c) 追加後の dist[x][y] は旧値、dist[x][u]+c+dist[v][y]、dist[x][v]+c+dist[u][y] の最小である。 閉鎖は高々300回で、N≤300 のため O(N^3+TN^2+Q) が許容され、距離問い合わせは O(1) になる。

## 実装上の注意

- 同じクエリ列で後に再開される辺の初期除外を正確に印付ける。更新中は新値の連鎖を使っても安全だが、十分大きい INF と overflow を管理する。

## 復習の核

- 追加辺を使う新最短路の三候補を書き、なぜ新辺を複数回通る必要がないかを正重みから説明する。

## 計算量と制約

### 時間

O(N³+CN²+Q)、C閉鎖数、reverse辺追加一回O(N²)。

### 空間

O(N²+M+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 300; 0 \leq M \leq \frac{N(N-1)}{2}; 1 \leq A_i < B_i \leq N; All pairs (A_i, B_i) are distinct.; 1 \leq C_i \leq 10^9; 1 \leq Q \leq 2 \times 10^5; In the queries of the first type, 1 \leq i \leq M.; The road given in a query of the first type is not already closed at that time.; The number of queries of the first type is at most 300.; In the queries of the second type, 1 \leq x < y \leq N.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺12=2,23=2,13=5。辺23閉鎖後に1→3距離を問う。

1. 閉鎖後は直接辺で5。
2. reverseで23を追加すると経由距離2+2=4へ改善。

期待される結果: forward query答え5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

追加更新で新辺を二回使うpathも検査すべきか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

非負辺なら最短simple pathは新辺を高々一回使う。旧距離と新辺一回の二方向をminするだけで十分。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/editorial/11134) — source-abc375-editorial-11134-46a7d0b5e5b2d6b4f15c42bbcd674364d05a6523a2c867c4bfb122cd6efe4ec3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/tasks/abc375_f) — source-abc375-f-problem-3fa1c95ca2546d4c0f0158de162875929649a584d8ac3344dd32fbfd96a07704
