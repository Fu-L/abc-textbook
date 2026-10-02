---
title: "ABC443-F — Non-Increasing Number"
draft: true
authoringUnit: {"problemId":"abc443-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc443-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-constructive-witness"],"sourceRevisionIds":["source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b","source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未来に必要なのは剰余と最後digitで、非減少digit制約を候補c≥lastで保つ。leading0を除く一桁からBFSすると最小長、同長ではdigit昇順queueで辞書最小になる。同状態の後到着は長さ/辞書で劣り捨ててよい。","sourceRevisionIds":["source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b","source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-select-state-graph-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=12。","procedure":["一桁倍数はない。","二桁の非減少数を昇順にみると12が剰余0。","digit1≤2で条件成立。"],"executionTarget":null,"expectedResult":"12","verificationStatus":"not_applicable","learningUnitIds":["unit-state-graph-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-select-state-graph-search"],"prerequisiteIds":["unit-constructive-witness"],"attainmentCondition":"先頭0から始めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。0で剰余0となり正整数条件を失う。初期digitは1..9。"},"answer":{"reasoningOrVerification":"不可。0で剰余0となり正整数条件を失う。初期digitは1..9。","procedure":["具体例の各状態・寄与を再計算する。","不可。0で剰余0となり正整数条件を失う。初期digitは1..9。"],"expectedResult":"不可。0で剰余0となり正整数条件を失う。初期digitは1..9。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

良い整数を左から作ると、将来付けられる桁は現在の末尾桁以上に制限される。数値そのものは N での剰余だけ分かれば次の剰余を計算できる。 x の後ろへ c を付けた剰余は (10x+c) mod N で、単調桁制約は次の c≥lastDigit のみに依存する。 BFS の同一層で小さい桁から enqueue し、状態を初回到達で確定すれば、最短の中で最小の整数を復元できる。

採用する候補: 状態 (remainder,lastDigit) を頂点とし、lastDigit 以上の桁を末尾へ付ける辺を張ったグラフを BFS して最短桁数を求め、親を逆走して答えを復元する。

状態数は10Nで各遷移は桁追加を一回表すため BFS が最小桁数を保証し、同距離では桁を昇順に展開すれば数値の辞書順も最小になる。

棄却する候補: 非減少桁の正整数を値の小さい順に生成し、N の倍数が出るまで試す。

答えの桁数は大きくなり得て、巨大整数の列挙数も値域も制約できない。

x の後ろへ c を付けた剰余は (10x+c) mod N で、単調桁制約は次の c≥lastDigit のみに依存する。

BFS の同一層で小さい桁から enqueue し、状態を初回到達で確定すれば、最短の中で最小の整数を復元できる。

先頭0を除く初期一桁状態を昇順に queue へ入れる。各状態から c=last..9 の次状態を未訪問なら親と桁を記録して追加し、remainder=0 の初回到達から親を辿って文字列を反転する。

## 典型の発動条件

### 剰余オートマトンの BFS

発動条件: 桁列条件を満たす最小の N の倍数を探し、値を直接保持できないとき。

先頭桁と各状態からの追加桁を昇順に試し、剰余と末尾桁の未訪問状態へ初めて到達したとき親状態と追加桁を記録する。remainder=0から親を逆に辿り、反転して最短・辞書順最小の整数を復元する。

## 問題固有の要素

巨大整数探索は、割り切れ方を剰余、文字列制約を末尾桁へ要約すると有限状態最短路になる。

別の問題へ持ち帰る視点: 最短文字列の数値最小化では、BFS 層順と遷移文字の昇順を組み合わせる。

## 正当性

未来に必要なのは剰余と最後digitで、非減少digit制約を候補c≥lastで保つ。leading0を除く一桁からBFSすると最小長、同長ではdigit昇順queueで辞書最小になる。同状態の後到着は長さ/辞書で劣り捨ててよい。

## 実装上の注意

- 先頭0を初期状態に入れず、最終 remainder=0 の状態と数0を混同しない。親配列は状態番号と採用桁を保存する。

## 復習の核

- 状態が保持しない過去情報でも、次遷移と目標判定に本当に不要かを確認し、BFS の tie-break を説明する。

## 計算量と制約

### 時間

法N、10N剰余×末digit状態、各最大10遷移。BFS O(100N)。

### 空間

dist親digit・queue O(10N)、復元答え長O(10N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 3\times 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=12。

1. 一桁倍数はない。
2. 二桁の非減少数を昇順にみると12が剰余0。
3. digit1≤2で条件成立。

期待される結果: 12

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

先頭0から始めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。0で剰余0となり正整数条件を失う。初期digitは1..9。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/editorial/15197) — source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/tasks/abc443_f) — source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0
