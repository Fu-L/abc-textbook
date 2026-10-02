---
title: "ABC354-G — Select Strings"
draft: true
authoringUnit: {"problemId":"abc354-g","docPath":"src/content/docs/problems/mathematics/outcome-optimize-poset-antichain-by-dilworth/outcome-optimize-poset-antichain-by-dilworth-shard-001/abc354-g.md","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-dp-sequence","unit-max-flow-min-cut"],"excludedTopics":["半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-poset-dilworth-antichain","tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4","source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"相異なる文字列の真のsubstring関係は半順序で、合法集合はantichain。重み付きDilworthのflow双対で、source/terminal容量Aと比較関係の無限辺がchainへの共通重みを流し、最大antichain重みはΣA−maxflowになる。同一文字列は一つしか選べないので最大重み代表への統合で最適値を保ち、真の比較だけをgraphに入れる。","sourceRevisionIds":["source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4","source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"文字列(a,ab,b)、重み(3,4,2)。","procedure":["abを選ぶとa,bを選べない。","a,bは互いを含まないので合計5。"],"executionTarget":null,"expectedResult":"最大5。","verificationStatus":"not_applicable","learningUnitIds":["unit-poset-dilworth-antichain"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"prerequisiteIds":["unit-bipartite-matching","unit-dp-sequence","unit-max-flow-min-cut"],"attainmentCondition":"同じaが重み3,7で二つ与えられたら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"代表重み7。"},"answer":{"reasoningOrVerification":"二つ同時選択は不許可。最大の7だけ残しても任意の最適解を悪化させない。","procedure":["具体例の各状態・寄与を再計算する。","二つ同時選択は不許可。最大の7だけ残しても任意の最適解を悪化させない。"],"expectedResult":"代表重み7。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半順序・Dilworth・最大反鎖](src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

対象外:

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

S_i が S_j の substring なら両方は選べず、substring 関係は推移的なので、異なる文字列を頂点とする poset の antichain 最大重み問題になる。

重みなしの Dilworth 定理では最大 antichain と最小 chain cover が二部 matching で双対になる。重み付き版は各頂点容量 A_i と比較辺容量∞の min-cutへ拡張できる。

採用する候補: substring poset を左右二部化し、source→left_i と right_i→sink に A_i、比較可能 i→j に∞容量を張る min-cut から最大重み antichain を求める。

ΣA_i−maxflow が weighted Dilworth の antichain 重みに一致し、N≤100 の dense network を扱える。

棄却する候補: 文字列を重み降順に見て、既選択の substring/superstring でなければ貪欲に追加する。

高重みの一文字列を捨てて複数の互いに比較不能な中重み文字列を選ぶ方が良い場合があり、局所選択は成立しない。

比較関係 i<j へ∞辺を置くことで cut は poset の closure 条件を破れず、有限cutが選択/非選択の整合した分割だけを表す。

同一文字列は互いに選べないので、最大重み occurrence 一つへ統合するか、index 順に片向き比較を張って DAG 性を保つ。

同一 S を最大 A にまとめる。全 ordered pair で KMP/Z/標準検索により substring 関係を判定する。左右コピーを作り source→L_i capacity A_i、R_i→sink capacity A_i、S_i substring S_j なら L_i→R_j capacity INF を張る。answer=ΣA_i−maxflow。

## 典型の発動条件

### weighted Dilworth / antichain の min-cut

発動条件: 推移的 DAG・poset から比較不能な頂点集合の最大重みを選ぶとき。

頂点重みを二部両端容量、比較関係を∞辺にして flow dual を用いる。

### substring 関係の poset 化

発動条件: 選択集合内でどの二文字列も包含関係を持てないとき。

substring の推移性を比較関係として DAG/poset にする。

## 問題固有の要素

一般 graph の最大重み独立集合ではなく、substring 関係が推移閉包を持つ特殊な comparability graph だから flow で解ける。

別の問題へ持ち帰る視点: 難しい独立集合問題では、辺関係が順序・区間・二部など追加構造を持つかを確認する。

## 正当性

相異なる文字列の真のsubstring関係は半順序で、合法集合はantichain。重み付きDilworthのflow双対で、source/terminal容量Aと比較関係の無限辺がchainへの共通重みを流し、最大antichain重みはΣA−maxflowになる。同一文字列は一つしか選べないので最大重み代表への統合で最適値を保ち、真の比較だけをgraphに入れる。

## 実装上の注意

- INF は ΣA_i より大きい 64 bit 値にする。同一文字列を両方残すと cycle になるため、統合または一方向化を必ず行う。

## 復習の核

- まず関係の推移性を確認して一般独立集合との差を説明する。flow network は有限 cut と antichain/chain cover の対応を小posetで検算する。

## 計算量と制約

### 時間

O(N²L+N³)を単純substring検査と二部flowの上界とする。L=Σ|S_i|。

### 空間

O(N²+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; S_i is a string consisting of lowercase English letters.; 1 \leq |S_i|; |S_1| + |S_2| + \ldots + |S_N| \leq 5000; 1 \leq A_i \leq 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

文字列(a,ab,b)、重み(3,4,2)。

1. abを選ぶとa,bを選べない。
2. a,bは互いを含まないので合計5。

期待される結果: 最大5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じaが重み3,7で二つ与えられたら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二つ同時選択は不許可。最大の7だけ残しても任意の最適解を悪化させない。

確認結果: 代表重み7。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/editorial/10029) — source-abc354-editorial-10029-71112419c3ca2e0f8e450a31c21672da849fab8fe54f6d6b73f10dcdbbcf5ea4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/tasks/abc354_g) — source-abc354-g-problem-7fdec5e1c59064d4ae3f21325120b426c2d4375d6b5c4782d7c92404f8b6511d
