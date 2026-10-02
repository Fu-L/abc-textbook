---
title: "ABC237-EX — Hakata"
draft: true
authoringUnit: {"problemId":"abc237-ex","docPath":"src/content/docs/problems/mathematics/outcome-optimize-poset-antichain-by-dilworth/outcome-optimize-poset-antichain-by-dilworth-shard-001/abc237-ex.md","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-dp-sequence"],"excludedTopics":["半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-poset-dilworth-antichain","tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa","source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"相異なる回文文字列の真の包含は半順序で、同時に選べる集合はantichain。Dilworthの定理により最大antichain数は最小chain cover数に等しい。左右複製グラフのmatchingの各辺を鎖の連結として使うとp−|matching|本になり、逆に鎖の隣接関係はmatchingを与えるので最大matchingから幅を得る。","sourceRevisionIds":["source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa","source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=ababa。","procedure":["回文種類はa,b,aba,bab,ababa。","abaとbabは互いを含まないので2個選べる。鎖a<aba<ababaとb<babで全体を2本に覆える。"],"executionTarget":null,"expectedResult":"最大2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-poset-dilworth-antichain"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth"],"prerequisiteIds":["unit-bipartite-matching","unit-dp-sequence"],"attainmentCondition":"同じaが3箇所に現れることを3頂点にするか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"aは1頂点。"},"answer":{"reasoningOrVerification":"対象は文字列包含で同じaは相互比較可能。同じ文字列の重複除去で幅を保ち、自己辺も除く。","procedure":["具体例の各状態・寄与を再計算する。","対象は文字列包含で同じaは相互比較可能。同じ文字列の重複除去で幅を保ち、自己辺も除く。"],"expectedResult":"aは1頂点。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半順序・Dilworth・最大反鎖](src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

対象外:

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

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

## 典型の発動条件

### Dilworth の定理による最大反鎖

発動条件: 二つの要素が半順序で比較可能なら同時に選べず、最大の互いに比較不能な集合を求めるとき。

最大反鎖の大きさを最小鎖分解数へ置き換え、N−最大マッチングで計算する。

### DAG 最小パス被覆の二部マッチング変換

発動条件: DAG の頂点を最少本数の頂点素なパスで覆いたいとき。

各頂点を左右へ複製して到達可能な対を結び、最大マッチング一辺ごとに二つの鎖を連結する。

## 問題固有の要素

文字列へ一文字追加したとき新たな回文は高々一種類なので、S に現れる異なる回文は高々 |S| 種類である。

別の問題へ持ち帰る視点: 対象区間が二乗個あっても distinct object の個数に強い上界があるなら、重複除去後の関係グラフを直接構築できる。

## 正当性

相異なる回文文字列の真の包含は半順序で、同時に選べる集合はantichain。Dilworthの定理により最大antichain数は最小chain cover数に等しい。左右複製グラフのmatchingの各辺を鎖の連結として使うとp−|matching|本になり、逆に鎖の隣接関係はmatchingを与えるので最大matchingから幅を得る。

## 実装上の注意

- 全回文部分文字列を文字列として重複除去し、同一頂点への自己辺は張らない。
- 包含辺は長さの短い回文から長い回文へ張ると DAG の向きが明確になり、N が 200 以下なので全対比較と単純な増加路法で十分である。

## 復習の核

- ペアごとの禁止条件が推移的なら、一般グラフの独立集合ではなく半順序の反鎖として扱えないか確認する。
- 区間の個数ではなく異なる内容の個数を数え、重複除去後に初めてグラフ規模を見積もる。

## 計算量と制約

### 時間

O(n³)を上界とする。n=|S|、相異なる回文p≤nの全対包含比較と単純増加路matchingを行う。

### 空間

O(n²)。候補文字列と包含グラフを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq |S| \leq 200; S consists of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=ababa。

1. 回文種類はa,b,aba,bab,ababa。
2. abaとbabは互いを含まないので2個選べる。鎖a<aba<ababaとb<babで全体を2本に覆える。

期待される結果: 最大2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じaが3箇所に現れることを3頂点にするか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

対象は文字列包含で同じaは相互比較可能。同じ文字列の重複除去で幅を保ち、自己辺も除く。

確認結果: aは1頂点。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/editorial/3321) — source-abc237-editorial-3321-d5b30fa3486e51958e009d418e34e1ada90f4939a73ff3554ad6c2888c3b3eaa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc237/tasks/abc237_h) — source-abc237-ex-problem-363079beeddaa885c316734b881a1aec71be00f9e5ec57a208f69c47a72bffb4
