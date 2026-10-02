---
title: "ABC264-EX — Perfect Binary Tree"
draft: true
authoringUnit: {"problemId":"abc264-ex","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc264-ex.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487","source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"深さdの完全二分木は異なる二子の深さd−1解の積。子wの増分Δだけ変わると新組はΔと他子総和の積になる。旧dp_wを除いてからcsumを更新すれば同じ子を二度選ばない。新頂点を含む構造だけ増え、必要サイズ2^(d+1)−1の上界で伝播打切り可能。","sourceRevisionIds":["source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487","source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"親 p2=1,p3=1、prefix1,2,3。","procedure":["root深さ0は常に一個。","頂点2追加ではrootの子が一個で深さ1なし。","頂点3で二子pairが一個になりroot深さ1が増える。"],"executionTarget":null,"expectedResult":"root完全二分木数1,1,2","verificationStatus":"not_applicable","learningUnitIds":["unit-rooted-tree-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"child sumを更新してから他子総和を使うと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"変更子の新値が混ざり同じ子二本を選ぶ虚構の組を数える。旧sumと旧child値で差分を作る。"},"answer":{"reasoningOrVerification":"変更子の新値が混ざり同じ子二本を選ぶ虚構の組を数える。旧sumと旧child値で差分を作る。","procedure":["具体例の各状態・寄与を再計算する。","変更子の新値が混ざり同じ子二本を選ぶ虚構の組を数える。旧sumと旧child値で差分を作る。"],"expectedResult":"変更子の新値が混ざり同じ子二本を選ぶ虚構の組を数える。旧sumと旧child値で差分を作る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

深さ d の完全二分木は指数個の頂点を必要とするため、N≤30万では考える深さが20未満に制限される。 親番号が常に小さいので、頂点を番号順に追加すると新頂点は既存木の葉として加わり、その頂点を含む新しい完全二分木だけが祖先上で増える。 dp[v][0]=1で、d≥1では異なる二子から深さ d−1 の完全二分木を一つずつ選ぶ積の総和になる。 子 w の dp[w][d] が Δ 増えたとき、dp[parent(w)][d＋1] の増分は Δ×(csum[parent][d]−dp[w][d]の旧値) であり、この増分をさらに上へ送れる。

棄却する候補: 各prefixごとに全頂点の部分集合を列挙し、誘導部分木が完全二分木か判定する。

選択集合が指数個あり、prefix間でほぼ同じ計算を繰り返す。

採用する候補: dp[v][d] を v 根・深さ d の完全二分木数、csum[v][d] を子の dp 総和として保持し、新頂点による dp 差分を高々20祖先へ伝播する。

一つの子部分木の値だけが変わると、親で新たにできる子二本の組は「その差分×他の子の総和」で計算できる。

dp[v][0]=1で、d≥1では異なる二子から深さ d−1 の完全二分木を一つずつ選ぶ積の総和になる。

子 w の dp[w][d] が Δ 増えたとき、dp[parent(w)][d＋1] の増分は Δ×(csum[parent][d]−dp[w][d]の旧値) であり、この増分をさらに上へ送れる。

incremental rooted tree counting を bounded-height tree DP の delta propagation とし、unordered child-pair convolution を child sum で差分更新する。

## 典型の発動条件

### 指数サイズ構造による深さ上界

発動条件: 深さに対して必要要素数が指数増加し、全体サイズに強い上限があるとき。

完全二分木の深さを定数程度に切り、祖先更新回数も同じ上界で抑える。

### 木DPの差分祖先伝播

発動条件: 葉が逐次追加され、一つの子部分木のDP変化が祖先だけへ影響するとき。

各層の増分を計算し、親の集約値とDPへ反映して次の祖先へ渡す。

### 異なる二子選択の総和維持

発動条件: 親状態が異なる二つの子から一項ずつ選ぶ積の総和で定義されるとき。

新しい一子側の値に、それ以外の子の値総和を掛けて追加分だけ求める。

## 問題固有の要素

実際の根から深さ20以上にある新頂点は、根付き完全二分木に含めるなら高さ20以上を強制するため、全更新を省略できる。

別の問題へ持ち帰る視点: 局所DPの高さ上限だけでなく、更新点の実木上の深さからその更新が答えへ届き得るかも枝刈りする。

## 正当性

深さdの完全二分木は異なる二子の深さd−1解の積。子wの増分Δだけ変わると新組はΔと他子総和の積になる。旧dp_wを除いてからcsumを更新すれば同じ子を二度選ばない。新頂点を含む構造だけ増え、必要サイズ2^(d+1)−1の上界で伝播打切り可能。

## 実装上の注意

- 親のcsumを更新する前の「他の子の総和」で積を作り、変化した同じ子を二本選ぶ誤算を防ぐ。
- 深さ添字の定義を頂点数2^{d+1}−1と揃え、各prefixの答えは根1の全dp深さの和として出力する。

## 復習の核

- 求める構造の最小サイズが深さに対して指数増加するなら、制約から実用的な深さ定数を先に導く。
- 動的木DPでは全祖先状態を再計算せず、変更された一子の差分と他子集約値から親差分を出す。

## 計算量と制約

### 時間

N頂点、最大完全二分木深さD=⌊log₂(N+1)⌋−1。番号順追加ごと高々D祖先へ一差分伝播し O(ND)。

### 空間

dpとchild sum O(ND)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 3 \times 10^5; 1 \le P_i < i

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

親 p2=1,p3=1、prefix1,2,3。

1. root深さ0は常に一個。
2. 頂点2追加ではrootの子が一個で深さ1なし。
3. 頂点3で二子pairが一個になりroot深さ1が増える。

期待される結果: root完全二分木数1,1,2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

child sumを更新してから他子総和を使うと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

変更子の新値が混ざり同じ子二本を選ぶ虚構の組を数える。旧sumと旧child値で差分を作る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/tasks/abc264_h) — source-abc264-ex-problem-abda7f8b06dc62deb02c8bea6d21d9042f93407a6d352a8a58fddb2c9151d487
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/editorial/4584) — source-abc264-editorial-4584-35c13b9d5c60d7105e182f142f28d23cc2580af70d1e75587d2a3b846052e181
