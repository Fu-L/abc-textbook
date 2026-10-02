---
title: "ABC456-G — Count Holidays"
draft: true
authoringUnit: {"problemId":"abc456-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc456-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dynamic-modular-product"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-dynamic-modular-product"],"sourceRevisionIds":["source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae","source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"固定xを跨ぐ連休はなく、runごとの割当は独立。印づけた長い連休開始日の包除は、禁止開始がない予定に重み1、それ以外に重み0を与える。初日を含むかどうかの二つのblock配置は全ての印づけを一意に数える。n≤kでは全2^nの割当が合法なので、その積を累積指数2^{E_k}へまとめても値は変わらない。非飽和runの積との合成がF_kを与え、累積事象の差F_k−F_{k−1}が最長連休ちょうどkを数える。","sourceRevisionIds":["source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae","source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [可逆な非零剰余と剰余 0 因子を含む法上の動的積](src/content/docs/learn/number-theory/dynamic-modular-product.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

固定勤務日xは連休を切る。従って自由日のrun長nごとに「最長連休がk以下」の割当数f(n,k)を求めれば、全予定の累積分布F_kはその積になる。最長がちょうどkの数はF_k−F_{k−1}、F_{−1}=0である。

f(n,k)を休日列の逐次DPで全kについて求めると二次時間になる。代わりに、k+1日以上続く連休の開始日を選ぶ包除を考える。開始日とは初日、または直前が勤務の日である。m個の開始日を印づけた予定数をg(n,k,m)とするとf(n,k)=Σ_m(−1)^m g(n,k,m)であり、悪い開始日がv個ある予定の総重みは(1−1)^vになる。

開始日に付随する「勤務1日＋休日k+1日」は互いに重ならない。初日を印づけない場合、長さk+2のblockをm個置き、その他の日を自由にする。blockを一要素へ縮めると配置数はC(n−(k+1)m,m)、自由日はn−(k+2)mなので

g_0 = C(n−(k+1)m,m) 2^{n−(k+2)m}。

初日を印づける場合は先頭の休日k+1日を固定し、残りのm−1個のblockを置くため

g_1 = C(n−(k+1)m,m−1) 2^{n−(k+2)m+1}。

g=g_0+g_1とし、負の自由日数の項は0。m=0はg=2^nだけである。m≤⌊(n+1)/(k+2)⌋なので、一つのfはO(1+n/(k+2))で求まる。階乗・逆階乗・2冪を先に用意する。

ここで全kで全run長を訪ねると、包除を省略しても走査自体が重い。長さn≤kのrunは既に制約がなく、寄与は常に2^nである。長さ頻度c_nを作り、E_k=Σ_{n≤k}n c_nを累積して、飽和部分の積を2^{E_k}としてO(1)で取り出す。distinct run長を降順に置き、各kではn>kの先頭部分だけを訪ねて

F_k = 2^{E_k} × Π_{n>k} f(n,k)^{c_n}

を計算する。kが最大run長以上なら積は空である。頻度冪は二分累乗し、F_k同士を割って更新しないので法上の0因子も問題にならない。

## 典型の発動条件

### 固定separatorによる積分解

発動条件: 列の禁止patternが固定記号を跨がず、自由runごとに独立なとき。

run別の数え上げを掛け合わせる。

### 長run禁止の包除原理

発動条件: binary列で連続1の最大長を制限したいとき。

違反runの開始blockを選び、圧縮配置を二項係数で数える。

## 問題固有の要素

最長値の分布は『最大≤k』の累積数を先に列挙し、差分でexact値へ戻す。

別の問題へ持ち帰る視点: 全kで重いように見える和も、各項のstepがk+2なら二重総和を調和級数で評価できる。

## 正当性

固定xを跨ぐ連休はなく、runごとの割当は独立。印づけた長い連休開始日の包除は、禁止開始がない予定に重み1、それ以外に重み0を与える。初日を含むかどうかの二つのblock配置は全ての印づけを一意に数える。n≤kでは全2^nの割当が合法なので、その積を累積指数2^{E_k}へまとめても値は変わらない。非飽和runの積との合成がF_kを与え、累積事象の差F_k−F_{k−1}が最長連休ちょうどkを数える。

## 実装上の注意

- n≤kを毎回個別に訪ねず、累積指数E_kと2冪表で飽和部分を一括処理する。降順run長の走査はn≤kで終了する。
- m=0は2^nを一度だけ加える。g_0,g_1は自由日数が負なら0とし、負指数や不正な組合せ添字を評価しない。
- 前のF_kの逆元で更新しない。包除で求めたfが法上0でも、各kの積を直接作れば正しい。
- F_{−1}=0とする。全日xでも最大0の予定を一個数える。

## 復習の核

- 違反run開始blockが互いに必要な間隔を図示し、1日目を含む/含まない g の二式とm上限を再導出する。

## 計算量と制約

### 時間

O(N log N)。降順のdistinct run長集合RについてΣ_{n∈R}n≤Σ_n n c_n≤N。一つのnを訪ねるのはk=0,…,n−1のn回だけなので、非飽和runの総訪問数はO(N)。包除項の総数はΣ_{n∈R}Σ_{k<n}(1+⌊(n+1)/(k+2)⌋)=O(Σ_n n log(n+1))=O(N log N)。頻度冪の費用はΣ_{n∈R}n log(c_n+1)≤Σ_n n c_n≤N（定数倍まで）。頻度・累積指数・階乗の前処理とN+1個の出力もO(N)。

### 空間

O(N)。階乗・2冪とrun頻度。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 2 \times 10^5, inclusive.; S is a string of length N consisting of ., x.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/editorial/19853) — source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/tasks/abc456_g) — source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb
