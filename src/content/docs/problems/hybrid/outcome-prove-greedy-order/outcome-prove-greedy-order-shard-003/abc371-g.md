---
title: "ABC371-G — Lexicographically Smallest Permutation"
draft: true
authoringUnit: {"problemId":"abc371-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc371-g.md","learningOutcomeIds":["outcome-prove-greedy-order","outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-functional-graph-decomposition"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-modular-congruence-crt","tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a","source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"既確定prefixを保つ回数をx≡r (mod m)とする不変条件を維持する。長さLで到達できる位置はr+t m mod Lのq=L/gcd(m,L)個で、値が相異なるため最小値を与えるtは一意。新条件x≡r+t m (mod m q)はその最小値を取る回数を全て、かつそれだけ残す。法はLを含むので同cycleの全位置が確定する。各r_k,m_kの更新はこの合同状態をkで還元したものだから巨大整数を保持しなくても全選択が再現される。各長さの法増加は高々一回で、D²=O(N)より更新込みで線形時間になる。","sourceRevisionIds":["source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a","source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

先に読む単元:

- [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、関数グラフのcycle・tree分解の発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

一回の操作は置換Pを適用することなので、x回後のi番目はA_{P_i^x}になる。Aの全値が相異なるため、先頭を最小にする位置を選ぶと、操作回数xの一つの合同条件が確定する。

Pの各cycleをPをたどる順で列挙する。既に決めたprefixを保つ回数をx≡r (mod m)とする。長さLの未確定cycle上では、位置offset+r+t m (mod L)、0≤t<q=L/gcd(m,L)がちょうど到達候補になる。この中でAが最小のtを選ぶと、r←r+t m、m←m q=lcm(m,L)。同じcycleの全位置もこの回数で一括確定できる。prefixを固定したまま最小値を選ぶため、辞書順の貪欲が成り立つ。

m自体は通常整数に収まらない。そこで登場する異なるcycle長kごとにr_k=r mod k、m_k=m mod kだけを保持する。初期値はr_k=0、m_k=1 mod kである。長さLの処理ではgcd(m_L,L)=gcd(m,L)なので、q=L/gcd(m_L,L)を計算できる。r_L+t m_LをLで割った剰余を走査してtを選ぶ。

q>1なら全ての登場長kについて、古いm_kを使って同時に

r_k←(r_k+t m_k) mod k、m_k←q m_k mod k

と更新する。q=1なら候補は一つ、t=0なので全体更新を省く。長さLを一度処理した後はLがmを割るため、同じ長さの別cycleでは必ずq=1になる。更新後のr_Lを使い、cycle列c_0,…,c_{L−1}の回答をans[c_j]=A[c_{(j+r_L) mod L}]として書く。

異なる長さの個数をDとすると、各長さが法を増やすのは高々一度なので全剰余更新はO(D²)。異なる正整数長の総和はN以下で、1+2+…+D≤NよりD²=O(N)。各cycleの候補走査と回答記入もその長さ以下なので、全体O(N)となる。全cycleを毎回無条件に更新すると、この根拠は失われる。

## 典型の発動条件

### permutation の cycle 分解

発動条件: 同じ permutation を巨大回数だけ反復する操作があるとき。

各位置の遷移を独立な巡回列として扱う。

### 辞書順貪欲と合同条件

発動条件: 一つの大域的な操作回数が全要素へ同時に作用し、先頭から最小化したいとき。

既確定 prefix を保つ操作回数の合同類を更新する。

## 問題固有の要素

辞書順では先頭の最小値を決めた瞬間、操作回数の自由度が合同式として残る。

別の問題へ持ち帰る視点: 巨大な lcm を数値で持たず、各 cycle 上で残る到達集合を表現できないか考える。

## 正当性

既確定prefixを保つ回数をx≡r (mod m)とする不変条件を維持する。長さLで到達できる位置はr+t m mod Lのq=L/gcd(m,L)個で、値が相異なるため最小値を与えるtは一意。新条件x≡r+t m (mod m q)はその最小値を取る回数を全て、かつそれだけ残す。法はLを含むので同cycleの全位置が確定する。各r_k,m_kの更新はこの合同状態をkで還元したものだから巨大整数を保持しなくても全選択が再現される。各長さの法増加は高々一回で、D²=O(N)より更新込みで線形時間になる。

## 実装上の注意

- 全剰余の更新はq>1のときだけ行い、r_kには更新前のm_kを使う。
- t m_k,q m_kは最大O(N²)なので64ビットで積を取ってから剰余を取る。
- Pをたどるcycleの向きと答えのoffsetの符号を揃える。Aが置換であることが、一つの最小位置を合同類で表す前提になる。

## 復習の核

- 「先頭を変えない x はどの合同類か」を各段で言葉にし、lcm を直接保持しない実装表現まで含めて復習する。

## 計算量と制約

### 時間

cycle分解と候補走査・回答記入はO(N)。異なるcycle長D個に対しq>1の更新は高々D回、各回O(D)なのでO(D²)。D(D+1)/2≤NからD²=O(N)で、合同状態の更新を含めて全体O(N)。

### 空間

O(N)、巨大lcm値を持たずcycleごとの作用。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq P_i\leq N\ (1\leq i\leq N); P_i\neq P_j\ (1\leq i<j\leq N); 1\leq A_i\leq N\ (1\leq i\leq N); A_i\neq A_j\ (1\leq i<j\leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/editorial/10927) — source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/tasks/abc371_g) — source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923
