---
title: "ABC320-G — Slot Strategy 2 (Hard)"
draft: true
authoringUnit: {"problemId":"abc320-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc320-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-coordinate-compression","unit-greedy-exchange","unit-modular-periodicity","unit-monotone-search"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-coordinate-compression","tag-greedy-exchange-order","tag-modular-periodicity","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc320-editorial-7135-1136bca010508d20a90427cf8293f0d5fd30aabd5afb2f392a1a48773d96e6de","source-abc320-g-problem-789eb0778848b8c492240eb30c5aa90b9bf957974ed1d968c6c02800800145cc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同digitで各reelに別時刻を割り当てることは二部matching。各reelのN個目より遅い時刻は不要で、他N−1reelが塞げるのはN−1時刻だから早い候補に一つ空きがある。deadlineで辺を絞る可否は単調なので最小を二分探索し全digit最小を取る。","sourceRevisionIds":["source-abc320-editorial-7135-1136bca010508d20a90427cf8293f0d5fd30aabd5afb2f392a1a48773d96e6de","source-abc320-g-problem-789eb0778848b8c492240eb30c5aa90b9bf957974ed1d968c6c02800800145cc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。
- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [剰余周期と指数法則を利用する](src/content/docs/learn/number-theory/modular-periodicity.md) — 剰余列や冪が有限状態で周期化することを示し、周期前計算や指数法則で巨大な反復を短縮する。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

固定digit Dとdeadline Tに対し、各reelへDが表示される異なる停止時刻≤Tを1つずつ割り当てられるかが判定問題になる。 1秒に押せるbuttonは1つなので、reelと時刻を両側とする二部matchingが全reelを飽和できることが必要十分である。 可能解があれば各reelはDのN回目の出現までのいずれかへ移せるため、各reelの候補edgeは最初のN出現、時刻上限はNMまでで十分である。 あるreelがDのN回目より遅い時刻を使う解では、それ以前のN候補のうち高々N-1個しか他reelに使われないため、空いている早い候補へ交換できる。 deadlineを増やすほどmatching edgeが追加されるだけなので可否はfalseからtrueへの単調predicateになる。

採用する候補: digitごとにdeadline可否を二部matchingで判定し、単調性を使って最小deadlineをbinary searchする。

各reelの候補をN時刻へ制限してedge数をO(N^2)にし、衝突しない時刻割当を最大流で判定できる。

棄却する候補: 各reelをそのdigitが最初に出る時刻でgreedyに止め、衝突時だけ後ろへずらす。

どのreelを後ろへ回すかで将来の候補衝突が変わり、局所的なtie解消では完全matchingを保証できない。

棄却する候補: 時刻0..NMを全てflow graphの頂点にする。

Mが10^5で不要な時刻頂点が多いが、実際にDが現れる候補時刻だけを座標圧縮できる。

あるreelがDのN回目より遅い時刻を使う解では、それ以前のN候補のうち高々N-1個しか他reelに使われないため、空いている早い候補へ交換できる。

deadlineを増やすほどmatching edgeが追加されるだけなので可否はfalseからtrueへの単調predicateになる。

各D=0..9について、各reelの周期文字列を繰り返した最初のN個のD出現時刻を列挙し、全候補時刻を圧縮する。deadline Tの判定ではsource→reel、T以下の候補をreel→time、time→sinkへ容量1のedgeを張り、max flowがNならtrueとする。候補時刻列上でbinary searchして最小Tを求め、10 digitの最小値を出力し、どれも不可なら-1。

## 典型の発動条件

### deadline付き二部matching

発動条件: 各taskへ異なる実行時刻を割り当て、deadline内の候補集合がtaskごとに異なるとき。

reelと停止時刻のmatchingで全task割当を判定する。

### 交換論法による候補打切り

発動条件: 資源をN対象へdistinctに割り当て、各対象の候補列が時刻順に無限反復するとき。

N番目以前に必ず未使用候補があるとして各degreeをNへ制限する。

### 単調判定のbinary search

発動条件: deadlineを延ばすとedgeだけが増えて実行可能性が単調になるとき。

matching成立の最初の候補時刻を探索する。

### 候補時刻の座標圧縮

発動条件: 時刻上限は大きいが、flow graphで区別すべき時刻が有限個の候補に限られるとき。

各reelでdigitが現れる最初のN時刻を集めてsort-uniqueし、順序と等値性を保つtime頂点IDへ写す。

## 問題固有の要素

reelは周期的に無限回Dを表示するが、distinct時刻を必要とする相手はN reelだけなので、鳩ノ巣原理で最初のN出現以外を捨てられる。

別の問題へ持ち帰る視点: 無限候補列でも競合相手数が有限なら、遅い選択を早い未使用候補へ交換して有限化できる場合がある。

## 正当性

同digitで各reelに別時刻を割り当てることは二部matching。各reelのN個目より遅い時刻は不要で、他N−1reelが塞げるのはN−1時刻だから早い候補に一つ空きがある。deadlineで辺を絞る可否は単調なので最小を二分探索し全digit最小を取る。

## 実装上の注意

- 時刻は0始まりで、position rのk周目はr+kMとする。候補時刻の重複はtime頂点を共有させる。
- digitが一度も現れないreelがあればそのDは即不可能とする。
- binary searchごとにflow残容量を正しく再初期化し、edgeはdeadline以下だけを追加する。

## 復習の核

- 同じ時刻候補へ複数reelが集中する例でmatchingを描き、N+1番目の出現を最初のN個中の未使用時刻へ交換できる理由を確認する。

## 計算量と制約

### 時間

reel数N、period長M。digit別候補生成O(10NM)、候補数O(N²)。判定matching Hopcroft–Karp O(N³)、binary探索O(log N)、全体O(10(NM+N³log N))の安全な上界。

### 空間

一digitのreel–time辺O(N²)、文字列O(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; 1 \leq M \leq 10^5; N and M are integers.; S_i is a string of length M consisting of digits.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/editorial/7135) — source-abc320-editorial-7135-1136bca010508d20a90427cf8293f0d5fd30aabd5afb2f392a1a48773d96e6de
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/tasks/abc320_g) — source-abc320-g-problem-789eb0778848b8c492240eb30c5aa90b9bf957974ed1d968c6c02800800145cc
