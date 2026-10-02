---
title: "ABC365-E — Xor Sigma Problem"
draft: true
authoringUnit: {"problemId":"abc365-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc365-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc365-e-problem-07a2f04c145f7d15a2788f59625115ceb88e52d34710895bf40a3fa79b7f845f","source-abc365-editorial-10607-7955b766683b6962871f47a593281be111da79d04880c6d84ffdc4b1079a5370"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"C_0=0を含むN+1個のprefix parityから異なる二値を選ぶ組数はcount0·count1である。 隣接prefix pair C_{i−1} xor C_iはB_iそのものなので、除外すべき長さ1区間のbit寄与をΣB_iで正確に引ける。 区間を列挙せず、全端点pairを二種類の頻度積へ集約できる。","sourceRevisionIds":["source-abc365-e-problem-07a2f04c145f7d15a2788f59625115ceb88e52d34710895bf40a3fa79b7f845f","source-abc365-editorial-10607-7955b766683b6962871f47a593281be111da79d04880c6d84ffdc4b1079a5370"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2,3)。","procedure":["長さ2以上の区間xorは1 xor2=3、2 xor3=1、全域0。","合計3+1。"],"executionTarget":null,"expectedResult":"答え4。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":[],"attainmentCondition":"長さ1を含む全区間xor和はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"singleton和1+2+3=6を足して10。prefix parity count後にこの6を引く。"},"answer":{"reasoningOrVerification":"singleton和1+2+3=6を足して10。prefix parity count後にこの6を引く。","procedure":["具体例の各状態・寄与を再計算する。","singleton和1+2+3=6を足して10。prefix parity count後にこの6を引く。"],"expectedResult":"singleton和1+2+3=6を足して10。prefix parity count後にこの6を引く。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

XORの総和はbitごとの1になる区間数に分解できる。固定bitではAを0/1列Bとみなし、区間XORはprefix XOR Cの両端が異なるかで決まる。

全ての非空区間ならC中の0個数×1個数で数えられるが、問題は長さ2以上だけなので、長さ1区間の寄与ΣB_iを引く必要がある。

採用する候補: 各bitでprefix parityの0,1出現数を数え、異parity pair数から単項区間を除いてbit重みを掛ける。

区間を列挙せず、全端点pairを二種類の頻度積へ集約できる。

棄却する候補: 各左端から右へXORを更新し、全長2以上の区間値を足す。

一区間のXORは速く得られても区間数が二次で、同じprefix情報を共有できない。

C_0=0を含むN+1個のprefix parityから異なる二値を選ぶ組数はcount0·count1である。

隣接prefix pair C_{i−1} xor C_iはB_iそのものなので、除外すべき長さ1区間のbit寄与をΣB_iで正確に引ける。

必要な各bit bについてC=0からA_iのb bitを順にxorし、prefix parity 0/1の個数を数える。同bitが1の全非空区間数cnt0·cnt1からA_iの当該bitが1の個数を引き、2^b倍して答えへ加える。

## 典型の発動条件

### XORのbit別寄与

発動条件: XOR値の総和を多数の区間・pairについて求めるとき。

各bitを独立なparity問題として数え、最後にbit重みを戻す。

### prefix parityの異値pair計数

発動条件: 区間xorが1となる端点組数を求めるとき。

prefix値0と1の頻度の積で全組をまとめて数える。

## 問題固有の要素

長さ制限を端点pairの添字差として直接数えるより、数えやすい全区間から長さ1だけ引くと簡潔になる。

別の問題へ持ち帰る視点: ほぼ全範囲を求める制約では、補集合が小さければ全体−例外へ変える。

## 正当性

C_0=0を含むN+1個のprefix parityから異なる二値を選ぶ組数はcount0·count1である。 隣接prefix pair C_{i−1} xor C_iはB_iそのものなので、除外すべき長さ1区間のbit寄与をΣB_iで正確に引ける。 区間を列挙せず、全端点pairを二種類の頻度積へ集約できる。

## 実装上の注意

- prefixには空prefix C_0を必ず含める。A_i<2^27付近までの全bitを扱い、組数×bit値は64 bitで計算する。

## 復習の核

- N=2で唯一の長さ2区間と一致するか確認する。全非空区間を数えた式のどこから長さ1を引いたかを明示する。

## 計算量と制約

### 時間

O(NB)、Bは値bit長。

### 空間

O(1)補助、prefix parity counts。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^8; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2,3)。

1. 長さ2以上の区間xorは1 xor2=3、2 xor3=1、全域0。
2. 合計3+1。

期待される結果: 答え4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

長さ1を含む全区間xor和はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

singleton和1+2+3=6を足して10。prefix parity count後にこの6を引く。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/tasks/abc365_e) — source-abc365-e-problem-07a2f04c145f7d15a2788f59625115ceb88e52d34710895bf40a3fa79b7f845f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/editorial/10607) — source-abc365-editorial-10607-7955b766683b6962871f47a593281be111da79d04880c6d84ffdc4b1079a5370
