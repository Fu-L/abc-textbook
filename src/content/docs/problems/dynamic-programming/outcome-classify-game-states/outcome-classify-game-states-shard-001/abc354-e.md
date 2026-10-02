---
title: "ABC354-E — Remove Pairs"
draft: true
authoringUnit: {"problemId":"abc354-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc354-e.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc354-e-problem-0d78e323d08982677aadd9bf82bd8aaa3d61fde4eb7c4c585bb406c6bddf40ad","source-abc354-editorial-10034-5414140ab4d6fbdd70f45fd1f619ea9ea25c170f2769838316fa9952fb7a0cea"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二枚除去で残り集合は必ず小さくなり、履歴や手番番号は合法手へ影響しない。手なしは負け。相手を負け集合へ送れる手があれば勝ち、なければどの手でも相手が勝つという帰納法が成立する。数値順でも bit を二つ消した mask は小さいため、依存先は計算済み。","sourceRevisionIds":["source-abc354-e-problem-0d78e323d08982677aadd9bf82bd8aaa3d61fde4eb7c4c585bb406c6bddf40ad","source-abc354-editorial-10034-5414140ab4d6fbdd70f45fd1f619ea9ea25c170f2769838316fa9952fb7a0cea"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-classify-game-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三枚 (A,B)=(1,2),(1,3),(4,3)。","procedure":["合法 pair は1,2と2,3。","どちらを消しても一枚だけ残り、相手は手なし。","初期局面は勝ち。"],"executionTarget":null,"expectedResult":"Takahashi","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-game"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-classify-game-states"],"prerequisiteIds":["unit-dp-state-design","unit-dp-subset-state"],"attainmentCondition":"四枚全て同じ (A,B) なら先手が勝つか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"負け。先手が二枚消すと残る二枚も合法 pair で、後手が最後の操作を行う。"},"answer":{"reasoningOrVerification":"負け。先手が二枚消すと残る二枚も合法 pair で、後手が最後の操作を行う。","procedure":["具体例の各状態・寄与を再計算する。","負け。先手が二枚消すと残る二枚も合法 pair で、後手が最後の操作を行う。"],"expectedResult":"負け。先手が二枚消すと残る二枚も合法 pair で、後手が最後の操作を行う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

N≤18 なので場に残るカード集合は2^N通り。手番以外の履歴は、現在どのカードが残っているかだけで次の合法手と勝敗が決まる。 有限 impartial game では、現在から相手を負け状態へ送れる手が一つでもあれば勝ち、全て相手勝ちなら負けという後退解析が使える。 mask から合法 pair i,j を消した next が losing なら、その手を選んで相手を負けにできるので mask は winning である。 合法 pair がない空でない状態も、空集合と同じく手を打てず losing になるため、default false 初期化で扱える。

採用する候補: 残存集合 mask ごとに勝敗を持ち、取り除ける同属性 pair を全探索する bitmask DP を行う。

遷移先は必ず popcount が2小さい既計算状態で、O(2^N N²) が N=18 に収まる。

棄却する候補: ゲーム木を手順ごとに DFS し、同じ残存集合へ至る別順序も独立に探索する。

pair の削除順により同一状態が指数的に重複し、memoization なしでは状態数を大幅に超える。

mask から合法 pair i,j を消した next が losing なら、その手を選んで相手を負けにできるので mask は winning である。

合法 pair がない空でない状態も、空集合と同じく手を打てず losing になるため、default false 初期化で扱える。

win[0]=false とし、mask を popcount 昇順または数値昇順に走査する。mask 内の i<j で A_i=A_j または B_i=B_j なら next=mask xor(1<<i)xor(1<<j) を調べ、win[next]=false が一つでもあれば win[mask]=true。full mask で勝者を出す。

## 典型の発動条件

### 有限ゲームの winning/losing DP

発動条件: 各手で状態量が必ず減少し、完全情報・交互手番の normal play を解くとき。

相手の losing 状態へ移れるかを bool DP で判定する。

### 集合状態の bitmask

発動条件: 要素数が20以下で、操作が要素の削除として表せるとき。

残存要素を bit で持ち、pair removal を bit 演算で遷移する。

## 問題固有の要素

カードの並びや削除履歴は将来の合法手に影響せず、残存集合が game state の十分統計量である。

別の問題へ持ち帰る視点: ゲーム DP では、将来の手集合を完全に決める最小状態を探し、手数単調性で DAG 化する。

## 正当性

二枚除去で残り集合は必ず小さくなり、履歴や手番番号は合法手へ影響しない。手なしは負け。相手を負け集合へ送れる手があれば勝ち、なければどの手でも相手が勝つという帰納法が成立する。数値順でも bit を二つ消した mask は小さいため、依存先は計算済み。

## 実装上の注意

- 合法条件は A 一致または B 一致の OR。mask の数値昇順なら pair 削除後は必ず小さいことを確認し、同じカードを二度選ばない。

## 復習の核

- 「勝ち状態」を直接構成せず、相手を負けへ送れる一手の存在として書く。合法手なしの状態を初期条件として小さい mask から検算する。

## 計算量と制約

### 時間

N 枚。合法 pair の事前計算 O(N²)、全状態走査 O(N²2^N)。

### 空間

勝敗配列と合法 pair で O(2^N+N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 18; 1 \leq A_i, B_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三枚 (A,B)=(1,2),(1,3),(4,3)。

1. 合法 pair は1,2と2,3。
2. どちらを消しても一枚だけ残り、相手は手なし。
3. 初期局面は勝ち。

期待される結果: Takahashi

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

四枚全て同じ (A,B) なら先手が勝つか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

負け。先手が二枚消すと残る二枚も合法 pair で、後手が最後の操作を行う。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/tasks/abc354_e) — source-abc354-e-problem-0d78e323d08982677aadd9bf82bd8aaa3d61fde4eb7c4c585bb406c6bddf40ad
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/editorial/10034) — source-abc354-editorial-10034-5414140ab4d6fbdd70f45fd1f619ea9ea25c170f2769838316fa9952fb7a0cea
