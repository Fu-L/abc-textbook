---
title: "ABC261-F — Sorting Color Balls"
draft: true
authoringUnit: {"problemId":"abc261-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc261-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc261-f-problem-efc03c0c6969a8b6609591aafc1ad8af566d970a60417a2a30692b8b9c1bbb1b","source-abc261-editorial-4484-568736e4a5d7b1cbefae39f8c795de9c1b2d67282624dd5a161079111bbaccfb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"異色逆転数M'は、全体の逆転数M_0と各色kの元順序を保つ部分列の逆転数M_kを用いてM'=M_0−Σ_k M_kと書ける。隣接交換では交換した二球の相対順だけが変わる。従って同色の交換はM'を変えず、異色の交換はM'を高々1減らす。完成列のM'=0より費用M'以上が必要である。\n\nこの下界は通常の隣接逆転解消で達成できる。昇順でない列にはX_i>X_{i+1}となる隣接対が存在するので、その対を交換する。同色なら費用0でM'不変、異色なら費用1でM'がちょうど1減る。どちらでも全体の逆転数M_0はちょうど1減るため有限回で昇順となる。終了時M'=0なので有料交換数は初期M'そのもの。よって差の式が最小費用である。Fenwick木で厳密に大きい既出値を数えれば、等値を除いた各逆転数を正しく計算できる。","sourceRevisionIds":["source-abc261-f-problem-efc03c0c6969a8b6609591aafc1ad8af566d970a60417a2a30692b8b9c1bbb1b","source-abc261-editorial-4484-568736e4a5d7b1cbefae39f8c795de9c1b2d67282624dd5a161079111bbaccfb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

数値が逆順の二球は最終的に相対順序を反転する必要があり、色が異なるならその交差には必ず一度コストがかかる。

同色球同士の逆転は無料で解消できるため、必要コストは X_i>X_j かつ C_i≠C_j の添字対の個数になる。

棄却する候補: 各反転対 (i,j) を列挙し、色が異なるものだけ数える。

球の対が二乗個あり、N=30 万では直接比較できない。

採用する候補: X 全体の反転数から、各色の部分列内の反転数を差し引く。

全反転対は同色と異色へ排他的に分かれ、どちらの反転数も元の順序を保った列に Fenwick 木を適用して求められる。

異色逆転数 M' は、全体反転数 M_0 と色 k 内反転数 M_k を用いて M'=M_0−Σ_k M_k と書ける。

異色 swap 一回で M' は高々一しか減らず、同色ブロック内を無料整列して境界の逆転を有料交換すれば一ずつ減らせるので、この数が下界かつ達成可能である。

重み付き隣接 swap の最小費用を、有料で交差しなければならない inversion pair の個数へ変換し、カテゴリ内寄与を inclusion-exclusion 的に除く。

## 典型の発動条件

### 隣接交換コストの反転数化

発動条件: 隣接 swap で数列を整列し、特定属性の組だけ交換コストを持つとき。

最終的に交差が必要な逆転対のうち、有料属性対だけを数える。

### 全体統計量からカテゴリ内統計量を引く

発動条件: 異なるカテゴリ間の対だけを数えたいが、全対と同カテゴリ対は高速に数えられるとき。

全体の反転数から各色部分列の反転数の総和を引く。

## 問題固有の要素

色ごとの部分列は元配列での出現順を保って X だけを抜き出すことで、その色同士の添字順と反転を正しく保存する。

別の問題へ持ち帰る視点: カテゴリ内の順序対を数えるときは、元順序を保つ stable projection を作る。

## 正当性

異色逆転数M'は、全体の逆転数M_0と各色kの元順序を保つ部分列の逆転数M_kを用いてM'=M_0−Σ_k M_kと書ける。隣接交換では交換した二球の相対順だけが変わる。従って同色の交換はM'を変えず、異色の交換はM'を高々1減らす。完成列のM'=0より費用M'以上が必要である。

この下界は通常の隣接逆転解消で達成できる。昇順でない列にはX_i>X_{i+1}となる隣接対が存在するので、その対を交換する。同色なら費用0でM'不変、異色なら費用1でM'がちょうど1減る。どちらでも全体の逆転数M_0はちょうど1減るため有限回で昇順となる。終了時M'=0なので有料交換数は初期M'そのもの。よって差の式が最小費用である。Fenwick木で厳密に大きい既出値を数えれば、等値を除いた各逆転数を正しく計算できる。

## 実装上の注意

- Xの等しい対は逆転ではない。Fenwick木では厳密に大きい既出値だけを数える。
- 色別部分列は元の添字順を保つ。各色の値を個別に圧縮した木なら、初期化を含めΣ n_c log(n_c+1)≤N log(N+1)。全値域Nの配列を毎色丸ごと初期化すると二乗になり得る。
- 逆転数はN(N−1)/2まで増えるので64 bit整数を使う。

## 復習の核

- 隣接交換の最小費用は、各要素対が最終順序までに交差する必要と、その交差コストから下界を作る。
- 属性が異なる対を直接数えにくい場合、全対から同属性対を引く分解を優先して試す。

## 計算量と制約

### 時間

O(N log N)、全体と各色内の反転数、Σn_c log n_c≤N log N。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3\times 10^5; 1\leq C_i\leq N; 1\leq X_i\leq N; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/tasks/abc261_f) — source-abc261-f-problem-efc03c0c6969a8b6609591aafc1ad8af566d970a60417a2a30692b8b9c1bbb1b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/editorial/4484) — source-abc261-editorial-4484-568736e4a5d7b1cbefae39f8c795de9c1b2d67282624dd5a161079111bbaccfb
