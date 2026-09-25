---
title: "二部matching・Hall・Kőnig"
description: "「二部matching・Hall・Kőnig」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 120
---

# 二部matching・Hall・Kőnig

習得対象の目安: **青色（1600–1999）**。増加路を理解し、Hall条件と最小頂点被覆を割当て問題へ使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第82単元。技能の説明を学んでから問題一覧へ進んでください。

前: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/) ／ 次: [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)

## 概要

### 二部matching・Hall・Kőnig

左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。

左右の各頂点が高々一つの相手を選ぶ条件から始める。ABC401 Gの人とボタンの一対一対応で、距離の閾値を固定した完全matching判定を学ぶ。ABC274 Gでは横区間と縦区間からなる二部グラフへ還元し、matchingと最小vertex coverの関係を確認する。複数の仕事を同じ受け手へ割り当てる場合は、最大流の容量付き割当へ進む。

ABC215 Hでは品種集合Sの在庫総数をf(S)、許可品種がすべてSに含まれる注文数をg(S)とする。全Sでf(S)≥g(S)がHallの条件である。供給を減らして割当て不能にする最小削除数は、g(S)>0でのf(S)−g(S)+1の最小値。注文0の条件は供給を0まで減らしても破れない。

品種一つ、在庫3、注文1なら空集合の余裕0を最小化へ入れず、非空集合の余裕2から3個を食べる。選び方を数える最小集合族にもg(S)>0を課し、複数の最小集合に含まれる同じ個体選択を重複計数しない。

### 習得する技能

- 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。

二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
2. [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
3. [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。
4. [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
5. [ABC461 G「Graph Problem 2026」](https://atcoder.jp/contests/abc461/tasks/abc461_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。
6. [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
7. [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。 / 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。
8. [ABC317 G「Rearranging」](https://atcoder.jp/contests/abc317/tasks/abc317_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。
9. [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC274 G 公式解説](https://atcoder.jp/contests/abc274/editorial/5024)
- [ABC274 G 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-bipartite-matching`
