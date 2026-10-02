---
title: "ABC430-F — Back and Forth Filling"
draft: true
authoringUnit: {"problemId":"abc430-f","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc430-f.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference"],"sourceRevisionIds":["source-abc430-editorial-14331-63c2ede9cdae616804184bf8d1c72438a1e48b1b54f8c158e006b5a7a6352f20","source-abc430-f-problem-f5c3abc7df1b691b9e336851067ce8f4992f4cef60bc811eba21edbacad6c6a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"下限 l_i は左側で i より前を強制される連続 R 数と、右側で i より前を強制される連続 L 数に 1 を加えた値である。 上限 r_i は N から、左側の連続 L 数と右側の連続 R 数を引いた値である。 連続制約が途切れた外側の列は i の左右どちらへも挿入できるため、l_i と r_i の間の全順位が実現できる。 全 i の区間を O(1) で求め、各順位に置ける整数数を累積和で O(N) 集計できる。","sourceRevisionIds":["source-abc430-editorial-14331-63c2ede9cdae616804184bf8d1c72438a1e48b1b54f8c158e006b5a7a6352f20","source-abc430-f-problem-f5c3abc7df1b691b9e336851067ce8f4992f4cef60bc811eba21edbacad6c6a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-static-range-information"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、S=RR。","procedure":["順序は1より2、2より3が後ろなので1,2,3が固定。","可能順位区間は[1,1],[2,2],[3,3]。"],"executionTarget":null,"expectedResult":"各順位の候補個数は1,1,1。","verificationStatus":"not_applicable","learningUnitIds":["unit-prefix-aggregate"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-static-range-information"],"prerequisiteIds":[],"attainmentCondition":"N=1なら不存在のrun長は何か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"全て0で唯一の区間[1,1]を得る。番兵側へSを読みに行かない。"},"answer":{"reasoningOrVerification":"全て0で唯一の区間[1,1]を得る。番兵側へSを読みに行かない。","procedure":["具体例の各状態・寄与を再計算する。","全て0で唯一の区間[1,1]を得る。番兵側へSを読みに行かない。"],"expectedResult":"全て0で唯一の区間[1,1]を得る。番兵側へSを読みに行かない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

L/R 制約から各整数 i が置かれ得る順位は穴のない一つの区間になる。その両端は i の左右に連続する同方向の文字列長だけで決まる。

採用する候補: 各 i について左右の連続 L/R 長を前計算し、可能順位区間 [l_i,r_i] を公式から求めて差分配列へ加算する。

全 i の区間を O(1) で求め、各順位に置ける整数数を累積和で O(N) 集計できる。

棄却する候補: 制約を満たす全順列を生成し、各整数の出現順位を記録する。

可能な並べ方が指数的に増え、N が大きい場合は列挙できない。

下限 l_i は左側で i より前を強制される連続 R 数と、右側で i より前を強制される連続 L 数に 1 を加えた値である。

上限 r_i は N から、左側の連続 L 数と右側の連続 R 数を引いた値である。

連続制約が途切れた外側の列は i の左右どちらへも挿入できるため、l_i と r_i の間の全順位が実現できる。

S の各位置から左・右へ続く L と R の run 長を四配列で前計算する。i ごとに l_i=leftR(i-1)+rightL(i)+1、r_i=N-leftL(i-1)-rightR(i) を求め、差分[l_i]++, 差分[r_i+1]-- として順位別個数を復元する。

## 典型の発動条件

### 連長の前計算

発動条件: 各位置の答えが左右へ連続する同一文字数で決まるとき。

左右走査で L/R それぞれの run 長を持ち、全 i の境界を定数時間で出す。

### 区間加算の差分配列

発動条件: 各対象が連続した答え位置区間すべてへ 1 寄与するとき。

可能順位 [l_i,r_i] を二点更新し、最後の累積和で各順位の候補数を得る。

## 問題固有の要素

局所的な大小制約が連鎖して i の前後を強制するのは、i に接する同方向 run の範囲だけである。

別の問題へ持ち帰る視点: 各対象の実現可能集合が区間になると証明できれば、対象×位置の判定を区間加算へ圧縮できる。

## 正当性

下限 l_i は左側で i より前を強制される連続 R 数と、右側で i より前を強制される連続 L 数に 1 を加えた値である。 上限 r_i は N から、左側の連続 L 数と右側の連続 R 数を引いた値である。 連続制約が途切れた外側の列は i の左右どちらへも挿入できるため、l_i と r_i の間の全順位が実現できる。 全 i の区間を O(1) で求め、各順位に置ける整数数を累積和で O(N) 集計できる。

## 実装上の注意

- i=1,N では存在しない S_0,S_N の run 長を 0 とする。順位は 1-indexed の公式に合わせ、r_i+1 の番兵領域を確保する。

## 復習の核

- l_i,r_i の四つの run の方向と開始位置を例で照合し、区間内の全順位が実現可能である理由を確認する。

## 計算量と制約

### 時間

O(N)、四run配列と差分累積。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 20000; 2 \le N \le 3 \times 10^5; S is a string of length N-1 consisting of L and R.; For a single input, the sum of N does not exceed 3 \times 10^5.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、S=RR。

1. 順序は1より2、2より3が後ろなので1,2,3が固定。
2. 可能順位区間は[1,1],[2,2],[3,3]。

期待される結果: 各順位の候補個数は1,1,1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=1なら不存在のrun長は何か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全て0で唯一の区間[1,1]を得る。番兵側へSを読みに行かない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/editorial/14331) — source-abc430-editorial-14331-63c2ede9cdae616804184bf8d1c72438a1e48b1b54f8c158e006b5a7a6352f20
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/tasks/abc430_f) — source-abc430-f-problem-f5c3abc7df1b691b9e336851067ce8f4992f4cef60bc811eba21edbacad6c6a5
