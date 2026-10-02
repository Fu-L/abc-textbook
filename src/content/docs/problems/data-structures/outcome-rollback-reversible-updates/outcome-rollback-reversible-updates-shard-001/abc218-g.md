---
title: "ABC218-G — Game on Tree 2"
draft: true
authoringUnit: {"problemId":"abc218-g","docPath":"src/content/docs/problems/data-structures/outcome-rollback-reversible-updates/outcome-rollback-reversible-updates-shard-001/abc218-g.md","learningOutcomeIds":["outcome-rollback-reversible-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game-value","unit-ordered-set-multiset"],"excludedTopics":["rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rollback","tag-game-value-dp","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1","source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"DFS の入場時に A_v を追加し、退場時に同じ一個を削除すれば、データ構造は常に現在の root-to-v path だけを表す。 根の深さを0とすると、次の行き先を選ぶのは偶数深さで Taro、奇数深さで Jiro なので、それぞれ子の返り値の max と min を取る。 path への一要素追加・削除と中央値取得を効率化し、葉の payoff 計算と minimax を一度の DFS に統合できる。","sourceRevisionIds":["source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1","source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-rollback-reversible-updates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"根値2、葉値6と10の二子。","procedure":["葉pathの中央値は(2+6)/2=4と(2+10)/2=6。","根はTaroなので最大を選ぶ。"],"executionTarget":null,"expectedResult":"ゲーム値6。","verificationStatus":"not_applicable","learningUnitIds":["unit-rollback"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-rollback-reversible-updates"],"prerequisiteIds":["unit-dp-game-value","unit-ordered-set-multiset"],"attainmentCondition":"葉6を処理後にpathの6を削除しないと何が起きるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"次葉のpathが(2,6,10)となり中央値6。別の値なら誤るので必ず入場追加と退場削除を対にする。"},"answer":{"reasoningOrVerification":"次葉のpathが(2,6,10)となり中央値6。別の値なら誤るので必ず入場追加と退場削除を対にする。","procedure":["具体例の各状態・寄与を再計算する。","次葉のpathが(2,6,10)となり中央値6。別の値なら誤るので必ず入場追加と退場削除を対にする。"],"expectedResult":"次葉のpathが(2,6,10)となり中央値6。別の値なら誤るので必ず入場追加と退場削除を対にする。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rollback・DFS入退場の状態復元](src/content/docs/learn/query/rollback.md)

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

木を頂点1で根付けると、再訪禁止の駒は親へ戻れず子へ進み続け、必ず葉で止まる。終端の葉を固定すれば訪問集合は根からその葉までの path に一意に定まる。

各葉の path 中央値が分かれば、内部頂点では手番に応じて子の値の最大または最小を選ぶだけなので、ゲーム部分は通常の minimax 木 DP になる。

採用する候補: DFS 中の根から現在頂点までの値の multiset を二分割して中央値を保ち、葉の評価値を求めながら深さ偶数で max、奇数で min を返す。

path への一要素追加・削除と中央値取得を効率化し、葉の payoff 計算と minimax を一度の DFS に統合できる。

棄却する候補: 葉ごとに根からの値を集め直してソートし、その後ゲーム木を評価する。

多くの葉が長い共通 path を持つ木では同じ頂点値を繰り返し集計し、N=10^5 に対して二乗規模になり得る。

DFS の入場時に A_v を追加し、退場時に同じ一個を削除すれば、データ構造は常に現在の root-to-v path だけを表す。

根の深さを0とすると、次の行き先を選ぶのは偶数深さで Taro、奇数深さで Jiro なので、それぞれ子の返り値の max と min を取る。

値を座標圧縮した Fenwick Tree の k-th 探索、または大小二つの multiset で path 中央値を管理する。葉では奇数個なら中央、偶数個なら中央二値の平均を返し、内部では深さの偶奇で集約する。

## 典型の発動条件

### DFS path データ構造

発動条件: 各 root-to-node path の統計量を全頂点または全葉で求め、要素の追加と rollback ができるとき。

DFS 入退場で一要素ずつ更新し、兄弟部分木へ path 状態を持ち越さない。

### ゲーム木の minimax

発動条件: 完全情報ゲームが木上を一方向に進み、終端 payoff が決まるとき。

最大化手番では子値の最大、最小化手番では最小を bottom-up に返す。

## 問題固有の要素

再訪禁止と入力が木であることの組合せが、一般の walk ゲームを「葉を選ぶゲーム」へ変える。中央値は終端 path だけで決まり途中手番の履歴を別状態に持たない。

別の問題へ持ち帰る視点: グラフゲームで履歴依存に見えたら、木・非再訪・開始点から合法手が常に子方向だけになるかを先に確認する。

## 正当性

DFS の入場時に A_v を追加し、退場時に同じ一個を削除すれば、データ構造は常に現在の root-to-v path だけを表す。 根の深さを0とすると、次の行き先を選ぶのは偶数深さで Taro、奇数深さで Jiro なので、それぞれ子の返り値の max と min を取る。 path への一要素追加・削除と中央値取得を効率化し、葉の payoff 計算と minimax を一度の DFS に統合できる。

## 実装上の注意

- 重複値を一個ずつ削除できる構造にし、偶数長 path では中央二値の和を2で割る。A_i が偶数なので答えは整数だが、再帰深度 N の実装にも注意する。

## 復習の核

- 根・内部・葉の三段の小木で、手番と深さの対応を書き込み、中央値の管理と max/min の向きを別々に再現する。

## 計算量と制約

### 時間

O(N log N)、path中央値と木minimax。

### 空間

O(N)、path頻度/木/DFS履歴。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 2 \leq A_i \leq 10^9; A_i is even.; 1 \leq u_i < v_i \leq N; The given graph is a tree.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

根値2、葉値6と10の二子。

1. 葉pathの中央値は(2+6)/2=4と(2+10)/2=6。
2. 根はTaroなので最大を選ぶ。

期待される結果: ゲーム値6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

葉6を処理後にpathの6を削除しないと何が起きるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

次葉のpathが(2,6,10)となり中央値6。別の値なら誤るので必ず入場追加と退場削除を対にする。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/editorial/2607) — source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/tasks/abc218_g) — source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8
