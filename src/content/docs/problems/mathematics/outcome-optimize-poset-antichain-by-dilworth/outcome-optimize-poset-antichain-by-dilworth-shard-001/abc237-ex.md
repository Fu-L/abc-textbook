---
title: "ABC237-EX — Hakata"
draft: true
authoringUnit: {"problemId":"abc237-ex","docPath":"src/content/docs/problems/mathematics/outcome-optimize-poset-antichain-by-dilworth/outcome-optimize-poset-antichain-by-dilworth-shard-001/abc237-ex.md","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-dp-sequence"],"excludedTopics":["半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-poset-dilworth-antichain","tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa","source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"相異なる回文文字列の真の包含は半順序で、同時に選べる集合はantichain。Dilworthの定理により最大antichain数は最小chain cover数に等しい。左右複製グラフのmatchingの各辺を鎖の連結として使うとp−|matching|本になり、逆に鎖の隣接関係はmatchingを与えるので最大matchingから幅を得る。 真の包含は推移的で、全包含対に直接辺を張っているので、このgraphでは鎖の隣接対が元辺になり頂点素なpath分割と鎖分解が一致する。","sourceRevisionIds":["source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa","source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半順序・Dilworth・最大反鎖](src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

先に読む単元:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md) — 二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

## 考察

同じ回文が複数箇所に現れても互いに同じ文字列を部分文字列として含むため、異なる回文文字列だけを候補にすればよい。

異なる回文文字列の種類数は |S| 以下であり、包含関係は長さが増える向きの半順序を作る。

棄却する候補: 列挙した回文の全部分集合を試し、どの二つも包含関係にない最大集合を探す。

回文種類数は 200 まであり、2 の N 乗の選択は列挙できない。

採用する候補: 回文を頂点、厳密な部分文字列関係を比較可能性辺とする DAG を作り、Dilworth の定理で最大反鎖を最小鎖分解へ、さらに二部最大マッチングへ変換する。

同時に選べる集合は半順序の反鎖そのもので、最小鎖分解数は頂点数から二部最大マッチング数を引いて求められる。

禁止条件は回文区間の交差ではなく、回文文字列同士の substring 比較可能性なので、求める量は包含半順序の幅である。

各回文を左右に複製し、左 i から右 j へ「i が j の部分文字列」の辺を張った二部グラフで、答えは N−最大マッチング数になる。

文字列包含を半順序として明示し、最大 antichain → minimum chain cover → bipartite matching という Dilworth の定理の標準変換を適用する。

ここで包含辺は既に推移的である。PがQの真の部分文字列、QがRの真の部分文字列ならPもRの真の部分文字列なので、全対包含比較で作ったDAGの辺集合は到達関係そのものになる。このgraphでは鎖の隣接要素に直接辺があり、最小鎖分解と元辺の頂点素なpath分割が一致する。一般DAGで到達対を新たに加えて頂点素なpath分割を求めると、中間頂点の共有を許す別問題になる。

異なる回文の種類数の上界も確認する。一文字追加で新しく現れる回文は必ず末尾で終わる。最長の新回文Pより短い回文suffix Qは、Pが回文なのでそのprefixとしても現れ、その出現は末尾より前で終わっていた。従って新しい種類は最長の一種類だけで、p≤n=|S|。

回文区間はpal[l][r]=[S_l=S_r]かつ（長さ≤2またはpal[l+1][r−1]）で長さ順に前計算し、候補を文字ごとのtrieへ挿入し、同じ終端を一種類として重複除去する。O(n²)個の回文区間を各O(n)文字で挿入するので、この処理はO(n³)時間を上界とする。包含比較をO(n³)で終えるには、各候補Pのprefix functionを作り、各候補QをKMPで走査する。prefix functionは不一致ならj=pi[j−1]へ戻り、一致ならjを一つ増やす。一つの比較はO(|P|+|Q|)≤O(n)なのでp²組でO(n³)。文字列を素朴に各開始位置から比較するO(n²)の検索を全対で使うと、この上界をそのままは主張できない。

## 典型の発動条件

### Dilworth の定理による最大反鎖

発動条件: 二つの要素が半順序で比較可能なら同時に選べず、最大の互いに比較不能な集合を求めるとき。

最大反鎖の大きさを最小鎖分解数へ置き換え、N−最大マッチングで計算する。

### 推移的な比較関係のmatching変換

発動条件: 比較可能な全対を辺とするDAGの最小鎖分解を求めるとき。

各頂点を左右へ複製して真の包含対を結ぶ。matching一辺ごとに二つの鎖を連結できる。本問では包含が推移的なので、全対比較で作った元辺のpath分割とも一致する。一般DAGの頂点素なpath分割は元の辺だけでmatchingし、到達関係の鎖分解と区別する。

## 問題固有の要素

文字列へ一文字追加したとき新たな回文は高々一種類なので、S に現れる異なる回文は高々 |S| 種類である。

別の問題へ持ち帰る視点: 対象区間が二乗個あっても distinct object の個数に強い上界があるなら、重複除去後の関係グラフを直接構築できる。

## 正当性

相異なる回文文字列の真の包含は半順序で、同時に選べる集合はantichain。Dilworthの定理により最大antichain数は最小chain cover数に等しい。左右複製グラフのmatchingの各辺を鎖の連結として使うとp−|matching|本になり、逆に鎖の隣接関係はmatchingを与えるので最大matchingから幅を得る。 真の包含は推移的で、全包含対に直接辺を張っているので、このgraphでは鎖の隣接対が元辺になり頂点素なpath分割と鎖分解が一致する。

## 実装上の注意

- 全回文部分文字列を文字列として重複除去し、同一頂点への自己辺は張らない。
- 包含辺は長さの短い回文から長い回文へ張ると DAG の向きが明確になり、N が 200 以下なので全対比較と単純な増加路法で十分である。

## 復習の核

- ペアごとの禁止条件が推移的なら、一般グラフの独立集合ではなく半順序の反鎖として扱えないか確認する。
- 区間の個数ではなく異なる内容の個数を数え、重複除去後に初めてグラフ規模を見積もる。

## 計算量と制約

### 時間

n=|S|、回文種類p≤n。回文区間表O(n²)、候補文字列のコピーとtrie終端による重複除去O(n³)。KMPを使ったp²組の包含比較O(p²n)、単純増加路matching O(p³)。従って全体O(n³)。

### 空間

O(n²)。候補文字列と包含グラフを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq |S| \leq 200; S consists of lowercase English letters.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/editorial/3321) — source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/tasks/abc237_h) — source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4
