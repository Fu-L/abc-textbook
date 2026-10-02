---
title: "ABC284-G — Only Once"
draft: true
authoringUnit: {"problemId":"abc284-g","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc284-g.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-normalization","unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b","source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点1の重複前pathの異頂点数lを固定すると、順序は(N−1)P(l−1)、外側写像はN^(N−l)通り。戻り先pの一回訪問頂点数p−1の和はl(l−1)/2。これら分類は各写像を一意に表す。頂点対称性でN倍すれば全頂点の総和となる。三角数は整数で2除算してから法を取る。","sourceRevisionIds":["source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b","source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-functional-graph"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、法100。写像は(1,1),(1,2),(2,1),(2,2)。","procedure":["自己loopの点は一回訪問数0。","写像(1,1)では2だけ一回訪れ総和1、(2,2)では1だけで1。","残る二写像の総和0。"],"executionTarget":null,"expectedResult":"全写像総和2","verificationStatus":"not_applicable","learningUnitIds":["unit-functional-graph-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-functional-graph"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-normalization","unit-state-graph-search"],"attainmentCondition":"法が偶数のとき1/2の逆元を使えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"使えない。lとl−1の偶数側を整数で2除算してから積と剰余を取る。"},"answer":{"reasoningOrVerification":"使えない。lとl−1の偶数側を整数で2除算してから積と剰余を取る。","procedure":["具体例の各状態・寄与を再計算する。","使えない。lとl−1の偶数側を整数で2除算してから積と剰余を取る。"],"expectedResult":"使えない。lとl−1の偶数側を整数で2除算してから積と剰余を取る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

全頂点は対称なので、全写像Aに対するS_1の総和だけを求め、最後にN倍すれば全頂点分になる。 1からfunctional graphを辿り、最初の重複までに異なる頂点がl個、戻り先がpath上のp番目なら、ちょうど1回訪れる頂点数はp-1である。 1以外のl-1個のpath頂点の並べ方は(N-1)P(l-1)、path外N-l頂点の遷移は軌道へ影響せず各N通りである。 固定lで戻り先p=1..lの寄与を合計すると0+1+…+(l-1)=l(l-1)/2になる。

採用する候補: 軌道の異なる頂点数lと戻り先pで写像を分類し、pathの順列・未使用遷移・寄与p-1を積で数える。

N^N個の写像を直接扱わず、lごとの閉形式へまとめられ、合成数modulusでも整数演算で計算できる。

棄却する候補: すべてのA_1..A_Nを列挙して各functional graphをsimulationする。

写像がN^N個あり、Nが大きい制約では列挙不能である。

棄却する候補: l(l-1)/2をmod Mで2の逆元を掛けて求める。

Mは素数とは限らず、Mが偶数なら2の逆元が存在しない。

1以外のl-1個のpath頂点の並べ方は(N-1)P(l-1)、path外N-l頂点の遷移は軌道へ影響せず各N通りである。

固定lで戻り先p=1..lの寄与を合計すると0+1+…+(l-1)=l(l-1)/2になる。

l=1..Nを走査し、falling=(N-1)P(l-1)とpow=N^(N-l)をmod Mで管理する。term=falling·pow·l(l-1)/2を加算し、最後に対称性のNを掛ける。三角数はlまたはl-1の偶数側を整数として2で割ってからmod Mへ落とし、modular inverseを使わない。

## 典型の発動条件

### functional graphの軌道分類

発動条件: 各頂点の出次数が1で、開始点から最初のcycleまでの訪問性質を数えるとき。

tailとcycleを、最初の重複までの長さと戻り先で表す。

### 対称性による代表頂点

発動条件: labelled頂点すべてが同じ役割を持つ総和を求めるとき。

頂点1の総寄与を数えてN倍する。

### 合成数modでの整数除算

発動条件: 組合せ式に小さい整数除算があるがmodulusが素数とは限らないとき。

積の中で割り切れる因子をmodを取る前に除く。

## 問題固有の要素

戻り先より前のtailだけが1回訪問され、戻り先以降のcycle頂点は無限回訪問されるため、S_1=p-1へ単純化する。

別の問題へ持ち帰る視点: functional graphの訪問回数条件は、tail・cycle・未到達の三分類へ分けると数えやすい。

## 正当性

頂点1の重複前pathの異頂点数lを固定すると、順序は(N−1)P(l−1)、外側写像はN^(N−l)通り。戻り先pの一回訪問頂点数p−1の和はl(l−1)/2。これら分類は各写像を一意に表す。頂点対称性でN倍すれば全頂点の総和となる。三角数は整数で2除算してから法を取る。

## 実装上の注意

- l=1の三角数は0であり、積の更新順をずらして(N-1)P(l-1)とN^(N-l)を正しく対応させる。
- M=1でも動くよう全加算・乗算をmod Mで行い、逆元に依存しない。

## 復習の核

- l=3の軌道を描き、戻り先p=1,2,3で寄与が0,1,2になること、path外の遷移がN^(N-l)通り自由なこと、偶数Mで逆元を使っていないことを点検する。

## 計算量と制約

### 時間

N 頂点。Nの冪表と falling product を一巡で作り O(N)。

### 空間

冪表 O(N)、総和作業 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 10^8\leq M \leq 10^9; N and M are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、法100。写像は(1,1),(1,2),(2,1),(2,2)。

1. 自己loopの点は一回訪問数0。
2. 写像(1,1)では2だけ一回訪れ総和1、(2,2)では1だけで1。
3. 残る二写像の総和0。

期待される結果: 全写像総和2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

法が偶数のとき1/2の逆元を使えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

使えない。lとl−1の偶数側を整数で2除算してから積と剰余を取る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/editorial/5468) — source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/tasks/abc284_g) — source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad
