---
title: "ABC216-H — Random Robots"
draft: true
authoringUnit: {"problemId":"abc216-h","docPath":"src/content/docs/problems/mathematics/outcome-count-nonintersecting-paths-by-lgv/outcome-count-nonintersecting-paths-by-lgv-shard-001/abc216-h.md","learningOutcomeIds":["outcome-count-nonintersecting-paths-by-lgv"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-subset-state","unit-linear-system-rank","unit-modular-arithmetic"],"excludedTopics":["行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-determinant-counting","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc216-editorial-2561-01aa8429e2e958692d07c0f82f6cf01e69852b5340bfbccaa77d3502ca587341","source-abc216-h-problem-8fb8270303b0eec2b42f490983ebe92997e275421471c13816b43fe79ece6a97"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"時間DAGのパスは一体の操作列に対応し、衝突は頂点共有である。LGVでは交差パスの後半交換により符号付き項が相殺され、順序を保つ非交差組だけ正符号で残る。終点を昇順に選ぶsubset DPは各置換項を転倒数符号付きで一度生成するため、総数を2^{NK}で割ると非衝突確率になる。 各座標を選ばない場合と一つの未使用始点へ割り当てる場合を旧配列から分けるため、終点は相異なり、昇順終点列と行割当を一度ずつ生成する。新しい行pの追加で生じる転倒は既選択q>pの個数だから、DPの符号は行列式展開の符号に一致する。","sourceRevisionIds":["source-abc216-editorial-2561-01aa8429e2e958692d07c0f82f6cf01e69852b5340bfbccaa77d3502ca587341","source-abc216-h-problem-8fb8270303b0eec2b42f490983ebe92997e275421471c13816b43fe79ece6a97"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [行列式による数え上げ](src/content/docs/learn/combinatorics-algebra/determinant-counting.md)

- DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。
- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md) — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

各ロボットの N 回の移動は、頂点 (時刻,座標) から次時刻の同座標または右隣へ進む時間 DAG 上のパスである。

二体が同時刻に同じ座標へいることは二本のパスが頂点を共有することに等しく、出発順を保つ非交差パスの組を数えればよい。

棄却する候補: 各時刻にロボット間の全ての間隔を状態として、停止・右移動の 2 の K 乗通りを遷移する。

座標差の状態数と時刻ごとの同時操作数が大きく、全配置を保持できない。

採用する候補: 固定した昇順終点への非交差パス数を LGV 行列式で表し、終点座標の走査と始点集合の bit DP で全行列式展開を同時に合計する。

一体の始点から終点へのパス数は二項係数で求まり、置換の階乗列挙を選択済み始点集合だけの状態へ圧縮できる。

終点 y_j を固定したとき、始点 x_i からのパス数は右移動回数を選ぶ C(N,y_j−x_i) であり、LGV により非交差な K 本組はその行列式になる。

行列式展開の置換符号は、新しい終点へ未使用始点 p を対応させる際、既選択のうち p より大きい添字数の偶奇から更新できる。

衝突回避を時間 DAG の頂点非共有パスへ移し、LGV 行列式を終点座標順に展開しながら、選択済み始点マスクと転倒数符号を持つ subset DP で全終点列を合算する。

実際のDPを明示する。y_min=min x_i、y_max=max x_i+Nとし、dp[S]を「y_minから現在の座標の直前までで、始点集合Sを相異なる昇順終点へ割り当てた符号付き重み和」とする。dp[∅]=1、他は0。各座標yを昇順に処理し、next=dpとしてyを選ばない場合を残す。全Sとp∉Sについて

```text
next[S∪{p}] += (−1)^{#{q∈S:q>p}} dp[S] C(N,y−x_p)
```

を加える。全更新は旧dpからnextへ送り、同じyを二回選ばない。最後のdp[全始点]が全昇順終点列への行列式の和であり、2^{NK}の逆元を掛けて確率を出す。C(N,t)=0（t<0またはt>N）、階乗表はNまで。

K=2,N=1,x=(0,1)では4操作列のうち(右移動,停止)だけが衝突する。y=0,1,2の三層DPは符号付き総和3を返し、確率3/4となる。終点ごとの行列式は交差族を相殺するが、途中のmask状態は負になることもあるので全演算を法998244353で行う。

## 典型の発動条件

### LGV 公式による非交差パス数

発動条件: DAG 上で順序付けられた複数始点・終点間の頂点非共有パス組を数えるとき。

一始点一終点のパス数を行列要素にし、固定終点列への衝突しないロボット移動数を行列式で表す。

### 行列式展開の subset DP

発動条件: 行列式の置換和を、列候補の選択や座標走査と同時に合計したいとき。

使用済み行のマスクを持ち、新しい列へ行 p を割り当てる二項係数と転倒数の符号を掛ける。

## 問題固有の要素

一次元で初期位置と終点を昇順に取ると、対応順を逆転させた二本のパスは必ず同じ時刻・座標を通るため LGV の交差条件が満たされる。

別の問題へ持ち帰る視点: 複数粒子の衝突回避は、時刻を一軸に加えた DAG の非交差パスとして表し、順序保存性から行列式を適用できることがある。

## 正当性

時間DAGのパスは一体の操作列に対応し、衝突は頂点共有である。LGVでは交差パスの後半交換により符号付き項が相殺され、順序を保つ非交差組だけ正符号で残る。終点を昇順に選ぶsubset DPは各置換項を転倒数符号付きで一度生成するため、総数を2^{NK}で割ると非衝突確率になる。 各座標を選ばない場合と一つの未使用始点へ割り当てる場合を旧配列から分けるため、終点は相異なり、昇順終点列と行割当を一度ずつ生成する。新しい行pの追加で生じる転倒は既選択q>pの個数だから、DPの符号は行列式展開の符号に一致する。

## 実装上の注意

- y−x_i が 0 未満または N を超える行列要素は 0 とし、終点座標は全始点から到達し得る範囲をずらして走査する。
- 未使用始点 p の追加時に、既選択マスク内で p より大きい添字の個数が奇数なら項の符号を反転する。
- 求めた衝突しない移動列数を、全ロボットの全操作数 2 の NK 乗で割るため、その法逆元を掛ける。
- 座標ごとに旧dpからnextへ更新する。in-placeで小maskから進めると一つの終点へ複数の始点を割り当ててしまう。

## 復習の核

- 同時刻の衝突条件を見たら、時刻と位置を頂点にした DAG 上のパス共有として可視化する。
- 固定終点なら行列式で数えられても終点列が多い場合、置換と終点選択を別々に列挙せず一つの subset DP に融合する。

## 計算量と制約

### 時間

O(YK2^K+N)、Y=max x_i+N−min x_i+1。

### 空間

O(2^K+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq K \leq 10; 1 \leq N \leq 1000; 0 \leq x_1 \lt x_2 \lt \cdots \lt x_K \leq 1000; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/editorial/2561) — source-abc216-editorial-2561-01aa8429e2e958692d07c0f82f6cf01e69852b5340bfbccaa77d3502ca587341
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/tasks/abc216_h) — source-abc216-h-problem-8fb8270303b0eec2b42f490983ebe92997e275421471c13816b43fe79ece6a97
