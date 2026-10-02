---
title: "ABC457-E — Crossing Table Cloth"
draft: true
authoringUnit: {"problemId":"abc457-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc457-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc457-e-problem-2f0a474f18270f192dc76fef79170fa1cf44d5e27cec8966569571ab20db7bcc","source-abc457-editorial-20075-104476d338438366890b2e26b13fa6811480adae5fe82698da328a5a7b9624d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"完全一致を使う場合、二枚目は同じ区間の別の布か、左端>Sか右端<Tの布であり、三条件が全候補を尽くす。sufによる存在判定は左端≥Lかつ右端≤Rをそのまま表す。完全一致がない場合は、左端Sの布と右端Tの布は異なる二枚である。前者の右端を最大、後者の左端を最小にすると、他のどの組よりも覆う隙間が小さい。整数区間なので隙間がない条件はr+1≥lであり、これが失敗すれば他の組でも覆えない。","sourceRevisionIds":["source-abc457-e-problem-2f0a474f18270f192dc76fef79170fa1cf44d5e27cec8966569571ab20db7bcc","source-abc457-editorial-20075-104476d338438366890b2e26b13fa6811480adae5fe82698da328a5a7b9624d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

座標数をN、布の枚数をMとする。閉区間の二枚を使って[S,T]を覆うには、左端Sと右端Tを誰かが担当する必要がある。布は二枚とも[S,T]内に収まらなければならない。

前処理では、区間頻度freq(L,R)、左端ごとの右端sorted list、右端ごとの左端sorted listを作る。さらにq[L]=min{R_i:L_i=L}（存在しなければ∞）、suf[L]=min_{x≥L}q[x]を用意する。これにより[L,R]内に布があることはsuf[L]≤Rと等価になる。

freq(S,T)>0なら一枚で既に全域を覆う。別の一枚が必要なので、freq(S,T)≥2、suf[S+1]≤T、suf[S]≤T−1のいずれかを検査する。後二条件は完全一致の布自身を確実に除外する。

完全一致がないなら、左端Sのlistで右端≤Tの最大値r、右端Tのlistで左端≥Sの最小値lを二分探索する。どちらかが存在しなければ失敗。存在すればr+1≥lが必要十分である。r=S,l=S+1のように隣接した布も、整数位置の布の覆いとして隙間がない。

## 典型の発動条件

### interval unionの極値casework

発動条件: 少数intervalで指定区間をちょうど覆うqueryを多数処理するとき。

必要端点を固定し、支配的な最長・最短候補だけを比較する。

### 端点別sorted list

発動条件: 片端固定で他端の閾値以下最大・以上最小を問うとき。

bucket内二分探索で候補intervalを取得する。

## 問題固有の要素

二intervalのunion条件は両端を担う候補を強制し、極値候補が失敗すれば全候補が失敗するdominanceを使える。

別の問題へ持ち帰る視点: 完全一致objectの有無で解の形が変わる場合、先に分岐すると残り条件を少数の包含queryへ整理できる。

## 正当性

完全一致を使う場合、二枚目は同じ区間の別の布か、左端>Sか右端<Tの布であり、三条件が全候補を尽くす。sufによる存在判定は左端≥Lかつ右端≤Rをそのまま表す。完全一致がない場合は、左端Sの布と右端Tの布は異なる二枚である。前者の右端を最大、後者の左端を最小にすると、他のどの組よりも覆う隙間が小さい。整数区間なので隙間がない条件はr+1≥lであり、これが失敗すれば他の組でも覆えない。

## 実装上の注意

- 同じ区間の二枚を使えるかはfreq≥2で判定する。setだけでは区別できない。
- 閉じた整数位置なので、隙間判定はr+1≥l。suf[N+1]=∞を置き、空の内部区間を不成立として扱う。

## 復習の核

- 完全一致あり/なしで全解形を列挙し、なしcaseの二つの極値候補が他候補を支配することを端点不等式で示す。

## 計算量と制約

### 時間

O(N+M log M+Q log M)。座標配列とsuffix最小にO(N)、布のbucket sortにO(M log M)、各照会に定数回の二分探索。

### 空間

O(N+M)。照会を逐次出力する。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; 2 \le M \le 2 \times 10^5; 1 \le L_i \le R_i \le N; 1 \le Q \le 2 \times 10^5; 1 \le S_q \le T_q \le N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/tasks/abc457_e) — source-abc457-e-problem-2f0a474f18270f192dc76fef79170fa1cf44d5e27cec8966569571ab20db7bcc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/editorial/20075) — source-abc457-editorial-20075-104476d338438366890b2e26b13fa6811480adae5fe82698da328a5a7b9624d2
