---
title: "ABC214-G — Three Permutations"
draft: true
authoringUnit: {"problemId":"abc214-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc214-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-generating-functions"],"sourceRevisionIds":["source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15","source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"違反位置集合k個を固定した包除項は、選択辺への単射な端点割当て数と(N−k)!の積になる。選択辺のパス成分は未使用頂点の選択でL通り、サイクルは一方向へ向ける2通り。成分多項式の積に(−1)^k(N−k)!を掛けて足すと違反なしだけ残る。自己ループの割当ては1通りとして分ける。","sourceRevisionIds":["source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15","source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

条件に反する順列は、ある添字 i で r_i が p_i または q_i に等しいという事象の和であり、固定した違反添字数ごとに包除できる。

違反させる添字 i を辺 (p_i,q_i) とみなすと、必要なのは選んだ各辺へ相異なる端点を一つずつ割り当てる方法数である。

棄却する候補: 全ての順列 r を列挙し、各添字について p_i と q_i のどちらとも異なるかを確認する。

順列は N の階乗個あり、N が 2×10⁵ の制約では生成できない。

採用する候補: 違反添字集合への包除を行い、二つの順列が作る次数 2 以下のグラフをパス・サイクルへ分解して集合サイズ別の係数を DP で集約する。

選択辺への単射な端点割当てが成分ごとの積に分かれ、全ての添字集合を個別列挙せず係数多項式として畳み込める。

p と q がともに順列なので、値を頂点とする全体グラフでは各頂点の次数が高々 2 となり、非自明な連結成分はパスかサイクルに限られる。

選択辺だけからなる一成分がサイクルなら端点割当ては 2 通り、頂点数 L のパスなら割り当てない頂点の選び方に対応して L 通りになる。

包除の交差項を次数 2 以下のグラフ上の端点単射数へ変換し、元の各パス・サイクル成分から選ぶ辺数別多項式を作って全体 DP と階乗係数へ合成する。

## 典型の発動条件

### 順列制約への包除原理

発動条件: 各位置に少数の禁止値があり、それらを全て避ける順列の個数を求めるとき。

禁止値を取ると指定した添字集合ごとの単射数を求め、集合サイズに応じた符号と残りの階乗を掛ける。

### 次数 2 グラフの成分多項式

発動条件: 二つの順列や対応が作るグラフで各頂点次数が高々 2 になり、選択部分をサイズ別に数えるとき。

パス・サイクルごとに選択辺数別の端点割当て総数を計算し、成分間を多項式 DP で畳み込む。

## 問題固有の要素

選択しない辺があるサイクルは切れたパスの集合となるため、最小の未選択辺を固定すると回転による重複を避けて二項係数で集約できる。

別の問題へ持ち帰る視点: サイクル上の部分集合を数える際は、全選択を別扱いし、未選択要素を一つ基準にしてパスへ切り開く。

## 正当性

違反位置集合k個を固定した包除項は、選択辺への単射な端点割当て数と(N−k)!の積になる。選択辺のパス成分は未使用頂点の選択でL通り、サイクルは一方向へ向ける2通り。成分多項式の積に(−1)^k(N−k)!を掛けて足すと違反なしだけ残る。自己ループの割当ては1通りとして分ける。

## 実装上の注意

- p_i＝q_i の添字は自己ループとして一つの値しか選べないため、通常の二端点辺と分けて係数へ反映する。
- 全辺を選ぶサイクルの 2 通りを切り開いた場合の式へ混ぜず、包除の符号と未固定位置の階乗の添字を揃える。

## 復習の核

- 位置ごとの禁止値が二つの順列で与えられたら、位置を辺、値を頂点とするグラフで次数制約が生まれるか確かめる。
- 包除の交差項では、選んだ禁止事象が同時成立する条件を「辺へ異なる端点を割り当てる」と具体化してから成分を数える。

## 計算量と制約

### 時間

O(N²)。成分多項式を次数別DPで合成する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3000; 1 \leq p_i, q_i \leq N; p_i \neq p_j \, (i \neq j); q_i \neq q_j \, (i \neq j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2442) — source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_g) — source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613
