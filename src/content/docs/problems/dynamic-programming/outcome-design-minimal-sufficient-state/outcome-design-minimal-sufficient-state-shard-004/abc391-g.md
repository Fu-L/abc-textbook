---
title: "ABC391-G — Many LCS"
draft: true
authoringUnit: {"problemId":"abc391-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc391-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-automaton-dp"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-automaton-dp"],"sourceRevisionIds":["source-abc391-editorial-12087-f639720fd19ac6ed72e77e27e96e282e340d8462db32f56e2b1da5f323c1f6f9","source-abc391-g-problem-3d8533bce00788b3eb9ac9d532744390dcdcc902cacd6d022dfc629af8376c8b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"LCS 行の隣接差は0/1で、先頭0から差分 mask で元行を一意復元できる。次の一文字で得る次行も標準 LCS 漸化式から一意である。よって row を状態とする決定的 automaton と同値。文字列 prefix は最後の文字と直前 prefix へ一意分解されるので、26文字遷移を加算すると全文字列を一度だけ数える。最終行末尾は差分の総和=popcountである。","sourceRevisionIds":["source-abc391-editorial-12087-f639720fd19ac6ed72e77e27e96e282e340d8462db32f56e2b1da5f323c1f6f9","source-abc391-g-problem-3d8533bce00788b3eb9ac9d532744390dcdcc902cacd6d022dfc629af8376c8b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [automaton上のDP・行列遷移](src/content/docs/learn/dynamic-programming/automaton-dp.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

LCS DPの一rowはdp[0]=0かつ隣接差が0または1の非減少列なので、長さN≤10なら差分bitmaskで高々2^N状態しかない。 Tへ一文字追加した次rowは、現在rowとその文字だけから標準LCS遷移で一意に決まる。 maskのpopcountがrow末尾dp[N]、すなわち現在prefix TとSのLCS長になる。 文字cごとのnext maskはrowを復元して一行だけ標準遷移すれば求まり、同じstateから何度でも再利用できる。

採用する候補: LCS rowをN-bit差分maskへ圧縮し、26文字の遷移を前計算して長さMのautomaton DPを行う

状態数2^N、遷移26でO(M·26·2^N·N)または前計算後O(M·26·2^N)となり、26^M文字列を一括集計できる。

棄却する候補: 全26^M個のTを生成して各LCSを計算する

M≤100で指数的に不可能で、LCS rowの状態圧縮を使えていない。

maskのpopcountがrow末尾dp[N]、すなわち現在prefix TとSのLCS長になる。

文字cごとのnext maskはrowを復元して一行だけ標準遷移すれば求まり、同じstateから何度でも再利用できる。

全maskとc∈a..zについてLCS一行更新後のnext[mask][c]を前計算する。count[0]=1からM回、全state・文字へ遷移加算し、最後にpopcount(state)=kのcountをk別に集める。

## 典型の発動条件

### DP rowの差分bitmask圧縮

発動条件: 単調列の隣接差が小さい有限集合に限られるとき。

LCS rowを0/1差分N個で表す。

### automaton上の文字列数え上げ

発動条件: prefix処理の十分状態と各文字transitionが有限なとき。

全長M文字列をstate count DPで集計する。

## 問題固有の要素

LCS値全体ではなく、固定短文字列S方向のfrontier形状だけを状態にすると、相手Tの長さ100でも状態数がS長だけで決まる。

別の問題へ持ち帰る視点: 片側が短いsequence DPでは、長い側prefixごとのDP rowを正規化・差分圧縮してautomaton化する。

## 正当性

LCS 行の隣接差は0/1で、先頭0から差分 mask で元行を一意復元できる。次の一文字で得る次行も標準 LCS 漸化式から一意である。よって row を状態とする決定的 automaton と同値。文字列 prefix は最後の文字と直前 prefix へ一意分解されるので、26文字遷移を加算すると全文字列を一度だけ数える。最終行末尾は差分の総和=popcountである。

## 実装上の注意

- next row更新は同一row内の左遷移を使うためj順を守る。最後の分類はmask値でなくpopcountで行い、mod加算する。

## 復習の核

- N≤4,M≤4で全Tを列挙し、同文字を含むS・全異なるSについてnext maskとLCS長分布をfull DPと比較する。

## 計算量と制約

### 時間

固定列長 N、可変列長 M、alphabet σ=26。遷移前計算 O(σN2^N)、数え上げ O(Mσ2^N)。

### 空間

遷移表 O(σ2^N)、rolling count O(2^N)、LCS 行の作業領域 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 10; 1\leq M\leq 100; N and M are integers.; S is a lowercase English string of length N.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/editorial/12087) — source-abc391-editorial-12087-f639720fd19ac6ed72e77e27e96e282e340d8462db32f56e2b1da5f323c1f6f9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/tasks/abc391_g) — source-abc391-g-problem-3d8533bce00788b3eb9ac9d532744390dcdcc902cacd6d022dfc629af8376c8b
