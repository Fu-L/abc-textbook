---
title: "ABC220-F — Distance Sums 2"
draft: true
authoringUnit: {"problemId":"abc220-f","docPath":"src/content/docs/problems/graph-search/outcome-reroot-tree-aggregation/outcome-reroot-tree-aggregation-shard-001/abc220-f.md","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rerooting"],"sourceRevisionIds":["source-abc220-editorial-2693-f7c6eeff0635eb68893cc43c229955e8354a9299cc64b00ec9cdb3c26904d26a","source-abc220-f-problem-d42fddfdf8339e3b47c0adcae4d2d9f02a944bc94b4777e17427978c3d498223"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"根を親から子cへ移すとsub[c]点の距離が1減り、それ以外は1増えるので差N−2sub[c]。初期根の距離和を正確に求め、親答えから子答えを伝える帰納法で全根の距離和を得る。","sourceRevisionIds":["source-abc220-editorial-2693-f7c6eeff0635eb68893cc43c229955e8354a9299cc64b00ec9cdb3c26904d26a","source-abc220-f-problem-d42fddfdf8339e3b47c0adcae4d2d9f02a944bc94b4777e17427978c3d498223"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3。","procedure":["根1の距離和0+1+2=3。","sub2=2で根2は3+3−4=2。","sub3=1で根3は2+3−2=3。"],"executionTarget":null,"expectedResult":"3,2,3","verificationStatus":"not_applicable","learningUnitIds":["unit-rerooting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"prerequisiteIds":["unit-rooted-tree-aggregation"],"attainmentCondition":"root変更のたび部分木サイズを再計算するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不要。親から子への差は最初に固定した子側成分サイズで表せる。"},"answer":{"reasoningOrVerification":"不要。親から子への差は最初に固定した子側成分サイズで表せる。","procedure":["具体例の各状態・寄与を再計算する。","不要。親から子への差は最初に固定した子側成分サイズで表せる。"],"expectedResult":"不要。親から子への差は最初に固定した子側成分サイズで表せる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rerooting・全方位木DP](src/content/docs/learn/tree/rerooting.md)

- 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各始点から独立に距離和を求めると同じ木を何度も探索する。一つの根1についてなら、全頂点の深さの和がそのまま ans(1) になり、同じ DFS で各部分木サイズも得られる。 根を親 p から子 c へ一辺移すと、c の部分木内の sub(c) 頂点への距離は1減り、それ以外の N-sub(c) 頂点への距離は1増える。 辺 p-c をまたぐ reroot 差分は、近くなる sub(c) 個の -1 と遠くなる N-sub(c) 個の +1 の合計 N-2sub(c) である。

採用する候補: 最初の DFS で ans(1) と部分木サイズを求め、二回目の DFS で ans(c)=ans(p)+N-2sub(c) を全辺へ伝播する rerooting を行う。

根を一辺移した差分が切断された二成分のサイズだけで決まり、各頂点の距離を再計算せず全回答を共有できる。

棄却する候補: 各頂点を始点に BFS または DFS を実行して距離和を足す。

木でも一回の探索に N が必要で、N 個の始点について二乗時間になる。

辺 p-c をまたぐ reroot 差分は、近くなる sub(c) 個の -1 と遠くなる N-sub(c) 個の +1 の合計 N-2sub(c) である。

頂点1を根に DFS し、depth の総和と sub[v] を計算する。ans[1] をその総和で初期化し、親から子へ進むたび ans[child]=ans[parent]+N-2sub[child] を代入して全頂点を出力する。

## 典型の発動条件

### 全方位木 DP（rerooting）

発動条件: 各頂点を根にした値が必要で、隣接する二つの根の答えの差を辺の両側の情報から求められるとき。

一つの根で基準値と部分木情報を作り、辺ごとの差分を全頂点へ伝える。

### 辺切断による寄与差分

発動条件: 根や始点を一辺動かしたとき、対象が辺のどちら側にあるかで寄与変化が一定になるとき。

部分木側と補集合側の個数を数え、距離変化をまとめて加減する。

## 問題固有の要素

距離和全体の reroot に必要なのは各距離値ではなく、移動した辺の子側に何頂点あるかだけである。

別の問題へ持ち帰る視点: 全始点への集約量では、始点を隣へ動かしたとき各対象の寄与が何種類の差分に分かれるかを調べる。

## 正当性

根を親から子cへ移すとsub[c]点の距離が1減り、それ以外は1増えるので差N−2sub[c]。初期根の距離和を正確に求め、親答えから子答えを伝える帰納法で全根の距離和を得る。

## 実装上の注意

- 距離和は最大で N(N-1)/2 なので 64 bit で持つ。深い path 木では再帰 stack が不足し得るため iterative DFS または stack 設定を検討し、親辺を逆走しない。

## 復習の核

- 辺を一本切って子側へ丸を付け、始点を親から子へ移したとき「近くなる個数」と「遠くなる個数」を数えて式を再導出する。

## 計算量と制約

### 時間

N 頂点に対して二回走査 O(N)、出力 O(N)。

### 空間

木、部分木サイズ、答え O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i < v_i \leq N; The given graph is a tree.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3。

1. 根1の距離和0+1+2=3。
2. sub2=2で根2は3+3−4=2。
3. sub3=1で根3は2+3−2=3。

期待される結果: 3,2,3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

root変更のたび部分木サイズを再計算するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不要。親から子への差は最初に固定した子側成分サイズで表せる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/editorial/2693) — source-abc220-editorial-2693-f7c6eeff0635eb68893cc43c229955e8354a9299cc64b00ec9cdb3c26904d26a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc220/tasks/abc220_f) — source-abc220-f-problem-d42fddfdf8339e3b47c0adcae4d2d9f02a944bc94b4777e17427978c3d498223
