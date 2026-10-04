---
title: "ABC257-EX — Dice Sum 2"
draft: true
authoringUnit: {"problemId":"abc257-ex","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc257-ex.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-kinetic-order-maintenance"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull","tag-kinetic-order-maintenance"],"sourceRevisionIds":["source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a","source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"独立性により二乗期待値の異なる二項の積は平均の積に分かれる。対角の平均平方を引いたm_i−μ_i²−C_iを使い、x_i=6μ_i、y_i=36(m_i−μ_i²−C_i)とすればJ=X²+Yは元の期待利益の正確に36倍である。正の定数倍は最適集合を変えず、最後のinv(36)で元の法上の期待値へ戻せる。\n\n和点の内部や支持辺内部における凸目的の値は端の頂点最大以下であり、Yに関して増加するので上側頂点を尽くせばよい。各支持方向(c,1)の最大は個別score上位K個で得られる。イベント間では全順位が固定され、同時交差群を直後の傾き順へ直すと次の区間の順位になる。同じcで同順位となる集合の和点は一つの支持辺上にあり、Jはその辺上でも凸なので直前・直後に得る両端を評価すれば全最大候補を覆う。","sourceRevisionIds":["source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a","source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [kinetic sorting・交差event順序更新](src/content/docs/learn/modeling/kinetic-order-maintenance.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

K個のサイコロを選ぶ全探索はC(N,K)通りで、N≤1000には使えない。まずランダムな出目の分布ではなく、目的である二乗の期待値に必要な量だけを取り出す。出目D_iの平均をμ_i=Σ_j A_{i,j}/6、二次モーメントをm_i=Σ_j A_{i,j}²/6と置く。独立性からi≠lではE[D_iD_l]=μ_iμ_lなので、選択集合Sの利益は

```text
E[(Σ_{i∈S} D_i)²] − Σ_{i∈S} C_i
  = Σ_{i∈S} m_i + 2Σ_{i<l, i,l∈S} μ_iμ_l − Σ_{i∈S} C_i
  = (Σ_{i∈S} μ_i)² + Σ_{i∈S}(m_i−μ_i²−C_i)
```

になる。二次モーメントそのものから費用を引くと、平均の対角項μ_i²を二重に数える。補正は分散m_i−μ_i²である。確率母関数を使うならf_i(z)=Σ_j z^{A_{i,j}}/6、μ_i=f_i'(1)、m_i=f_i''(1)+f_i'(1)となり、同じ式へ戻る。

幾何や最大値比較を法上で行わないため、分母を払う。整数点を

```text
x_i = Σ_{j=1}^6 A_{i,j} = 6μ_i
y_i = 6Σ_{j=1}^6 A_{i,j}² − x_i² − 36C_i
    = 36(m_i−μ_i²−C_i)
X = Σ_{i∈S} x_i,  Y = Σ_{i∈S} y_i
J(S) = X² + Y = 36 × 元の期待利益
```

と定義する。xには6、yには36を掛けることで、X²とYの単位を揃える。最適な整数Jを選んでから、最後にJ·inv(36) mod 998244353を出力する。例えば全目が2で価格3の一個なら(x,y)=(12,−108)、J=36で元の利益1になる。

全K要素集合の和点(X,Y)の上で凸関数X²+Yを最大化する。内部点は頂点の凸結合なので、Jensenの不等式でどれかの頂点以上にはならない。また同じXなら大きいYほどよいので、上側凸包の頂点だけを考えれば足りる。この頂点はある実数cでcX+Yが最大となる。固定cでは個別のc x_i+y_iを大きい順にK個取ればよく、巨大な集合全探索を一次関数N本の順位変化へ移せる。

順位が変わるのはx_i≠x_lの二直線が等しくなるc=(y_l−y_i)/(x_i−x_l)だけ。全O(N²)個のイベントを有理数でソートし、score昇順の配列orderと逆配列posを持つ。c→−∞の初期順はx降順、同じxはy昇順、同点は固定ID順である。末尾K個のX,Yを初期化し、初期のJを保存する。

同じcのイベントはまとめる。その群の両端IDから現在位置を集め、同じscoreの連続blockに分ける。block全体をc直後のscore昇順、すなわちx昇順・同xは固定ID順へ並べ直す。末尾K領域に入るblock要素の旧x,y寄与を先に引き、新しい並びの寄与を足し、posを直す。群を反映した後にJを評価する。block内にはxの異なる少なくとも二群があるので、block要素数はその群の交差pair数の定数倍以下で、全blockの再ソートもO(N² log N)へ収まる。x,yがともに同じ点は常に固定ID順でよい。

同じcで上位Kが複数通りになる場合、支持辺上の和点ではY=定数−cXなのでJ=X²−cX+定数はXの凸関数である。従って最大はこの辺の端点で達成され、直前・直後の上位K集合を評価すればよい。群の途中で偶然得た集合だけを代表にしない。

## 典型の発動条件

### 平均・分散への二次モーメント分解

発動条件: 独立な確率変数の選択和を二乗して期待値を取りたい。

対角はE[D_i²]、異なる二項の積はE[D_i]E[D_l]へ分け、平均和の二乗と分散和へまとめる。独立性がなければ共分散項も残る。

### 凸目的の最大化と支持方向

発動条件: 目的が選択ベクトル和の凸関数で、固定した線形方向の最適選択が容易である。

凸包頂点へ絞り、cX+Yを最大化する上位K個として候補を列挙する。元の集合数が巨大でも点の順位イベントは二次個に抑えられる。

### 順位イベントの一括処理

発動条件: 一次関数の順位だけが変わり、上位K和を追いたい。

同時交差では等値blockを直後の傾き順へ直す。旧寄与の除去と新寄与の追加を分け、各群の両側の集合を評価する。

## 問題固有の要素

サイコロ選択の非線形な相互作用は平均の総和の二乗だけで、各サイコロを二次元ベクトルにすると組合せ和の凸包問題になる。

別の問題へ持ち帰る視点: 選択集合の目的が「総和の凸関数＋個別和」なら、支持線で上位Kを選ぶparametric最適化を検討する。

## 正当性

独立性により二乗期待値の異なる二項の積は平均の積に分かれる。対角の平均平方を引いたm_i−μ_i²−C_iを使い、x_i=6μ_i、y_i=36(m_i−μ_i²−C_i)とすればJ=X²+Yは元の期待利益の正確に36倍である。正の定数倍は最適集合を変えず、最後のinv(36)で元の法上の期待値へ戻せる。

和点の内部や支持辺内部における凸目的の値は端の頂点最大以下であり、Yに関して増加するので上側頂点を尽くせばよい。各支持方向(c,1)の最大は個別score上位K個で得られる。イベント間では全順位が固定され、同時交差群を直後の傾き順へ直すと次の区間の順位になる。同じcで同順位となる集合の和点は一つの支持辺上にあり、Jはその辺上でも凸なので直前・直後に得る両端を評価すれば全最大候補を覆う。

## 実装上の注意

- 選択比較は整数Jで行い、剰余へ減らしてからmaxを取らない。最終出力だけinv(36)を掛ける。
- x_i≤6×10^5、|y_i|≤36×10^10+36×10^5、X≤6×10^8。Jの保持は符号付き64bitで足りるが、イベントの有理数比較の交差積は128bitを用いる。
- x_i=x_lの二直線は交差しない。完全同点は固定IDで並べる。同傾き群の全blockを処理した後に評価し、K=1,K=N、交差なしの初期集合も落とさない。

## 復習の核

- 二乗期待値を平均和の二乗へまとめる際、個別の平均平方を分散の補正として引く。
- 整数化では線形座標と二乗座標の倍率を揃える。最適化の後に確率の分母を戻す。
- 支持方向ごとの上位Kと順位イベントで、組合せ数個の和点を列挙せず凸包頂点を追える。

## 計算量と制約

### 時間

O(N² log N)。O(N²)個の順位交換イベントをsortし、それぞれで順位と上位K和を更新する。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1000; 1 \leq K \leq N; 1 \leq C_i \leq 10^5; 1 \leq A_{i,j} \leq 10^5; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/editorial/4168) — source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/tasks/abc257_h) — source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f
