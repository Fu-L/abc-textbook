---
title: "ABC470 F — Googol Swaps"
draft: true
authoringUnit: {"problemId":"abc470-f","docPath":"src/content/docs/problems/updates/abc470-f.md","learningOutcomeIds":["outcome-augment-components-with-metadata","outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-dsu-components","tag-combinatorial-coefficients","tag-finite-field-subspace-counting","tag-stirling-transform"],"sourceRevisionIds":["source-abc470-f-problem-03e3571da5c865ce303b47eb3aa7e6e3916b40bcb13102011740feb9c9a34f1b","source-abc470-editorial-23854-8f5e3a822ade8391f08cf5ec305085ad554e757f95e8436b90d9fd915480e976"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"成分を越える移動は不可能で、連結成分内の辺交換は全対称群を生成する。偶数回制約は全体の置換の符号を固定する。成分内同文字の入替えは各文字配置の偶奇を両方実現し、重複がない場合は任意の許可辺の交換が偶配置と奇配置の一対一対応を与える。従って多項係数の積と場合分けが正しい。","sourceRevisionIds":["source-abc470-f-problem-03e3571da5c865ce303b47eb3aa7e6e3916b40bcb13102011740feb9c9a34f1b","source-abc470-editorial-23854-8f5e3a822ade8391f08cf5ec305085ad554e757f95e8436b90d9fd915480e976"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

## 考察

交換可能な位置をグラフの辺にする。同じ連結成分の中では、木の葉から目標文字を運び固定することで任意の位置の置換を作れる。しかし操作回数がちょうど10^100、すなわち偶数なので、位置を区別した置換は偶置換に限られる。

各成分内の任意の偶置換は高々N²回で作れる。残りは同じ辺を二回交換する無作用で埋められるため、回数の巨大さは到達性の制約としては偶奇だけを残す。M≥1なのでこの埋め合わせ用の辺が存在する。

ここで数える対象は位置の置換ではなく文字列。ある成分に同じ文字が二つある場合、二つの同文字の行き先を交換すると、文字列を変えず置換の偶奇を反転できる。従って全ての文字配置が実現できる。一方、どの成分にも重複文字がなければ配置と成分内置換が一対一で、全体の偶置換はちょうど半分。

DSUで成分を求め、成分サイズnと26文字の個数c_jから n!/Πc_j! を計算して全成分の積を取る。成分内重複が一つでもあればそのまま、なければ2の逆元を掛ける。異なる成分の同文字は偶奇調整に使えない。

## 典型の発動条件

局所交換の到達性を連結成分と置換の符号で表す。識別不能な同じ要素があると、位置の不変量が観測対象から消えることがある。

## 問題固有の要素

巨大な偶数回を二回の無作用で埋められる。重複は同じ成分の内部に必要。

## 正当性

成分を越える移動は不可能で、連結成分内の辺交換は全対称群を生成する。偶数回制約は全体の置換の符号を固定する。成分内同文字の入替えは各文字配置の偶奇を両方実現し、重複がない場合は任意の許可辺の交換が偶配置と奇配置の一対一対応を与える。従って多項係数の積と場合分けが正しい。

## 実装上の注意

半分にするのは各成分ごとでなく全体の積に一度だけ。N!は法より小さいので逆階乗が使える。

## 復習の核

『位置を区別した操作状態』と『同じ文字を同一視した出力』を分けて不変量を考える。

## 計算量と制約

### 時間

DSU O((N+M)α(N))、階乗と文字集計 O(N+26N)。

### 空間

DSUと成分別26文字のカウント O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N and M are integers.; 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; S is a string of length N consisting of lowercase English letters.; A_i and B_i are integers.; 1 \leq A_i < B_i \leq N; (A_1, B_1), \dots, (A_M, B_M) are pairwise distinct.

## 出典

- [公式問題](https://atcoder.jp/contests/abc470/tasks/abc470_f)
- [公式解説](https://atcoder.jp/contests/abc470/editorial/23854)
