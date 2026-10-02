---
title: "ABC313-G — Redistribution of Piles"
draft: true
authoringUnit: {"problemId":"abc313-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc313-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-euclidean-floor-sum"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86","source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A を x 回すると皿 i から袋へ移る石は min(a_i,x) 個なので、s(x)=Σmin(a_i,x) は sorted a の隣接値間で一次式になる。 x≤min a の正規形では B を行わない一通りだけを扱い、それ以後は floor(s/N)+1 の y 候補を数えるという境界を分離する。 傾きが変わるのは x=a_i だけなので O(N) 区間に分かれ、各区間を対数時間で一括加算できる。","sourceRevisionIds":["source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86","source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-equivalent-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"a=(1,3)、x=2。","procedure":["s(x)=min(1,2)+min(3,2)=3。","N=2でy=0..floor(3/2)=1。"],"executionTarget":null,"expectedResult":"この正規形xのy候補は2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-equivalent-states"],"prerequisiteIds":["unit-euclidean-floor-sum"],"attainmentCondition":"x≤min aでもfloor(s/N)+1を足し続けてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"その領域は正規形が重複するのでBを行わない一通りだけに境界補正する。"},"answer":{"reasoningOrVerification":"その領域は正規形が重複するのでBを行わない一通りだけに境界補正する。","procedure":["具体例の各状態・寄与を再計算する。","その領域は正規形が重複するのでBを行わない一通りだけに境界補正する。"],"expectedResult":"その領域は正規形が重複するのでBを行わない一通りだけに境界補正する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

操作 B の直後に A をすると全皿へ足した一個を直ちに回収して元へ戻る。同様に A が全皿から取れた直後の B も相殺なので、これらを除いた正規形だけ数えてよい。

正規形は A を x 回した後 B を y 回する形で、x を固定すると袋の石数 s(x) から 0≤y≤floor(s(x)/N) が可能になる。

採用する候補: a_i を sort して s(x)=Σmin(a_i,x) を区分線形化し、区間ごとの floor((αx+β)/N) の和を floor_sum で計算する。

傾きが変わるのは x=a_i だけなので O(N) 区間に分かれ、各区間を対数時間で一括加算できる。

棄却する候補: x=0..max a_i を全て試し、袋の石数から y の個数を足す。

max a_i=10^9 で走査回数が大きく、s(x) の区分線形性を利用していない。

A を x 回すると皿 i から袋へ移る石は min(a_i,x) 個なので、s(x)=Σmin(a_i,x) は sorted a の隣接値間で一次式になる。

x≤min a の正規形では B を行わない一通りだけを扱い、それ以後は floor(s/N)+1 の y 候補を数えるという境界を分離する。

a を昇順 sort し prefix sum を作る。x の区間 [a_k,a_{k+1}) では s(x)=prefix[k]+(N−k)x と書く。各区間で floor(s(x)/N) の総和を ACL floor_sum へ渡し、y=0 の一通りも足す。最小値以前の重複する正規形は公式の境界どおり補正する。

## 典型の発動条件

### 操作列の相殺による正規形

発動条件: 可逆・相殺する隣接操作があり、結果状態の重複を数えたいとき。

無意味な隣接対を禁止し、各到達状態と一対一になる標準操作列を作る。

### 区分線形和と floor_sum

発動条件: Σmin(a_i,x) などが break point 間で一次式となり、その整数除算の総和が必要なとき。

値を sort して係数一定区間へ分け、Σfloor((ax+b)/m) を Euclid 型算法で取る。

## 問題固有の要素

状態を直接特徴付ける前に操作列の冗長な相殺を消すと、二整数 (x,y) が到達列を一意に表す。

別の問題へ持ち帰る視点: 到達状態数では同じ結果を生む操作列が障害になるので、まず canonical sequence の存在を探す。

## 正当性

A を x 回すると皿 i から袋へ移る石は min(a_i,x) 個なので、s(x)=Σmin(a_i,x) は sorted a の隣接値間で一次式になる。 x≤min a の正規形では B を行わない一通りだけを扱い、それ以後は floor(s/N)+1 の y 候補を数えるという境界を分離する。 傾きが変わるのは x=a_i だけなので O(N) 区間に分かれ、各区間を対数時間で一括加算できる。

## 実装上の注意

- floor_sum の引数が半開区間であることに合わせて x の端点を変換する。mod を取る前の係数・積は 64/128 bit で overflow を避ける。

## 復習の核

- 二操作の直後関係を実際に相殺して、正規形と状態の一対一を先に確かめる。floor_sum は式の区間端と傾きを紙上で固定してから実装する。

## 計算量と制約

### 時間

O(N log N+N log Amax)、sortと各一次区間のfloor_sum。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq a_i \leq 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

a=(1,3)、x=2。

1. s(x)=min(1,2)+min(3,2)=3。
2. N=2でy=0..floor(3/2)=1。

期待される結果: この正規形xのy候補は2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

x≤min aでもfloor(s/N)+1を足し続けてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

その領域は正規形が重複するのでBを行わない一通りだけに境界補正する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/editorial/6896) — source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/tasks/abc313_g) — source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2
