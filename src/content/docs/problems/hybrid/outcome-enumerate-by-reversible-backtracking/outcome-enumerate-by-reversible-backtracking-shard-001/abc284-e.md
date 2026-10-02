---
title: "ABC284-E — Count Simple Paths"
draft: true
authoringUnit: {"problemId":"abc284-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-by-reversible-backtracking/outcome-enumerate-by-reversible-backtracking-shard-001/abc284-e.md","learningOutcomeIds":["outcome-enumerate-by-reversible-backtracking"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["backtracking・可逆な探索状態の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-backtracking-search","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc284-e-problem-e3aa0c7dc6b9a0eeb249e80baa5619e13ef8df92d556656b7ef9b2d3f0d5a7a1","source-abc284-editorial-5494-aed35b7f2bd9d203b74300434d0e36f1fa1a4d6d9aa223ea87b424bc70a9ba5f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点vへ入った瞬間のstackは始点1からvまでの新しい単純pathなので、長さ0のpathも含めて各呼出しを1回数えればよい。 visitedはgraph全体の確定情報ではなく現在pathの禁止集合であり、backtrack時の解除が数え上げの核心になる。 単純性を保ちながら異なるpathで同じ頂点を再利用でき、上限到達時には探索全体を直ちに終了できる。","sourceRevisionIds":["source-abc284-e-problem-e3aa0c7dc6b9a0eeb249e80baa5619e13ef8df92d556656b7ef9b2d3f0d5a7a1","source-abc284-editorial-5494-aed35b7f2bd9d203b74300434d0e36f1fa1a4d6d9aa223ea87b424bc70a9ba5f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-by-reversible-backtracking"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三角形1-2-3-1、始点1。","procedure":["長さ0は1、長さ1は1→2,1→3。","長さ2は1→2→3,1→3→2。"],"executionTarget":null,"expectedResult":"単純path5本。","verificationStatus":"not_applicable","learningUnitIds":["unit-backtracking-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-by-reversible-backtracking"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"visitedを永久にmarkすると何を落とすか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1→2処理後に2,3を解除しないと別path1→3を探索できない。visitedは現在pathだけを表す。"},"answer":{"reasoningOrVerification":"1→2処理後に2,3を解除しないと別path1→3を探索できない。visitedは現在pathだけを表す。","procedure":["具体例の各状態・寄与を再計算する。","1→2処理後に2,3を解除しないと別path1→3を探索できない。visitedは現在pathだけを表す。"],"expectedResult":"1→2処理後に2,3を解除しないと別path1→3を探索できない。visitedは現在pathだけを表す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [backtracking・可逆な探索状態](src/content/docs/learn/modeling/backtracking-search.md)

- 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- backtracking・可逆な探索状態の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

数える対象は頂点1から始まる単純pathであり、DFS中の現在の再帰stackがそのまま1本のpathを表す。

答えは10^6へ達した時点で打ち切ってよいので、指数個になり得る単純pathを最後まで列挙する必要はない。

採用する候補: 現在path上の頂点だけをvisitedにし、進入時に1本を数えて未訪問neighborへDFSし、復帰時にunmarkする。

単純性を保ちながら異なるpathで同じ頂点を再利用でき、上限到達時には探索全体を直ちに終了できる。

棄却する候補: 一度訪れた頂点を探索終了までvisitedのままにする通常の到達性DFS。

同じ頂点へ別の単純pathから到達する場合まで捨て、path本数を過小評価する。

棄却する候補: 上限を考えず全単純pathを列挙してから10^6との最小値を取る。

単純path数は指数的になり得て、答えが早く上限へ達する入力でも探索が終わらない。

頂点vへ入った瞬間のstackは始点1からvまでの新しい単純pathなので、長さ0のpathも含めて各呼出しを1回数えればよい。

visitedはgraph全体の確定情報ではなく現在pathの禁止集合であり、backtrack時の解除が数え上げの核心になる。

visited[1]=trueとしてDFS(1)を始め、各呼出しの冒頭でcountを1増やす。countが10^6なら終了flagを立てて全再帰から戻る。各neighborについて未訪問ならmarkして再帰し、戻ったらunmarkする。最後にcountを出力する。

## 典型の発動条件

### backtracking DFS

発動条件: 単純pathや重複なし列を列挙し、使用済み集合が現在候補にだけ依存するとき。

再帰の前後で頂点をmark/unmarkしてpath上の重複だけを禁止する。

### 上限付き列挙

発動条件: 必要な答えがmin(候補数,C)で、Cが十分小さいとき。

C件見つけた時点で終了を全再帰へ伝播する。

## 問題固有の要素

最大次数10なので、10^6個を見つけるまでの各DFS状態から試すedge数も小さく抑えられる。

別の問題へ持ち帰る視点: 列挙数にcapがある探索では、訪問状態数だけでなく各状態の分岐確認量も合わせて実行可能性を判断する。

## 正当性

頂点vへ入った瞬間のstackは始点1からvまでの新しい単純pathなので、長さ0のpathも含めて各呼出しを1回数えればよい。 visitedはgraph全体の確定情報ではなく現在pathの禁止集合であり、backtrack時の解除が数え上げの核心になる。 単純性を保ちながら異なるpathで同じ頂点を再利用でき、上限到達時には探索全体を直ちに終了できる。

## 実装上の注意

- 終了flagまたはcount判定を各loopと再帰復帰直後に確認し、10^6到達後に別branchへ進まない。
- 頂点1だけのpathも数えるため、edgeを選ぶ前に現在状態を加算する。

## 復習の核

- 三角形で1→2→3と1→3がともに数えられることを手計算し、2から戻った後に頂点をunmarkする位置と上限終了の伝播を確認する。

## 計算量と制約

### 時間

O(min(P,10⁶)Δ+N+M)、Pは単純path数、Δ≤10。

### 空間

O(N+M)、path visitedとDFS stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min \left(2 \times 10^5, \frac{N(N-1)}{2}\right); 1 \leq u_i, v_i \leq N; The given graph is simple.; The degree of each vertex in the given graph is at most 10.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三角形1-2-3-1、始点1。

1. 長さ0は1、長さ1は1→2,1→3。
2. 長さ2は1→2→3,1→3→2。

期待される結果: 単純path5本。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

visitedを永久にmarkすると何を落とすか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1→2処理後に2,3を解除しないと別path1→3を探索できない。visitedは現在pathだけを表す。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/tasks/abc284_e) — source-abc284-e-problem-e3aa0c7dc6b9a0eeb249e80baa5619e13ef8df92d556656b7ef9b2d3f0d5a7a1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/editorial/5494) — source-abc284-editorial-5494-aed35b7f2bd9d203b74300434d0e36f1fa1a4d6d9aa223ea87b424bc70a9ba5f
