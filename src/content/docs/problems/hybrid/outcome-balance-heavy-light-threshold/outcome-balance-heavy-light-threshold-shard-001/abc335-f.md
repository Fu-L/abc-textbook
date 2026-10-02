---
title: "ABC335-F — Hop Sugoroku"
draft: true
authoringUnit: {"problemId":"abc335-f","docPath":"src/content/docs/problems/hybrid/outcome-balance-heavy-light-threshold/outcome-balance-heavy-light-threshold-shard-001/abc335-f.md","learningOutcomeIds":["outcome-balance-heavy-light-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-threshold-heavy-light"],"sourceRevisionIds":["source-abc335-editorial-9038-75d1ffdd8b1f3f04351303bd37aa5663466c9211f668ed0c1fd1e25f0d815f2e","source-abc335-f-problem-43ce80c8813d030f4d8d45e6809eb385d25fd1db5fa21b707b2a9f9c32678483"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"境界B≈√Nに対し、d≤Bはbucket[d][r]へdp[i]を足せば、以後同じ剰余rの位置が到着時にまとめて受け取れる。d>Bは一つのiからの遷移先が高々N/B個なので直接加算してよい。 小stepの多数遷移をlazyなbucketで共有し、大stepは遷移先が少ないため、両方の総量をO(N√N)へ均衡できる。","sourceRevisionIds":["source-abc335-editorial-9038-75d1ffdd8b1f3f04351303bd37aa5663466c9211f668ed0c1fd1e25f0d815f2e","source-abc335-f-problem-43ce80c8813d030f4d8d45e6809eb385d25fd1db5fa21b707b2a9f9c32678483"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [平方根・閾値による軽重分類](src/content/docs/learn/modeling/threshold-heavy-light.md)

- 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

駒はindexが厳密に増えるので、移動列と最終的な黒square集合は一対一に対応する。dp[i]をiへ到達する移動列数とすると、iからはj≡i mod A_iかつj>iの全squareへ加算する必要がある。

採用する候補: A_iをsqrt Nで大小分割し、小stepは剰余別累積、大stepは遷移先列挙する

小stepの多数遷移をlazyなbucketで共有し、大stepは遷移先が少ないため、両方の総量をO(N√N)へ均衡できる。

棄却する候補: 全iからi+A_i,i+2A_i,…へdp[i]を直接配る

A_i=1が多数あると一頂点からO(N)遷移し、合計O(N^2)になる。

境界B≈√Nに対し、d≤Bはbucket[d][r]へdp[i]を足せば、以後同じ剰余rの位置が到着時にまとめて受け取れる。d>Bは一つのiからの遷移先が高々N/B個なので直接加算してよい。

dp[1]=1としindexを昇順に処理する。iでは全d≤Bのbucket[d][i mod d]をdp[i]へ加える。A_i≤Bならdp[i]をbucket[A_i][i mod A_i]へ蓄え、A_i>Bならj=i+A_iからNまでstep A_iでdp[j]へ加える。最後に全dp[i]を合計する。

## 典型の発動条件

### 平方分割

発動条件: 更新step dが小さいと遷移先が多く、大きいと少ないという反比例構造がある。

d≤√Nを剰余bucket、d>√Nを陽な列挙に分ける。

### 剰余classへのlazy加算

発動条件: 遷移条件がj≡i mod dで、同じd,rから将来位置への寄与が共通する。

bucket[d][r]に到達数を保存し、位置jで該当する全小dの値を受け取る。

## 問題固有の要素

小stepから未来全体へ配る代わりに、未来位置が自分の剰余classを照会する向きへ主客転倒すると一更新O(1)になる。

別の問題へ持ち帰る視点: 等差数列更新はstepが小さい範囲をmod別の受取累積へ反転できる。

## 正当性

境界B≈√Nに対し、d≤Bはbucket[d][r]へdp[i]を足せば、以後同じ剰余rの位置が到着時にまとめて受け取れる。d>Bは一つのiからの遷移先が高々N/B個なので直接加算してよい。 小stepの多数遷移をlazyなbucketで共有し、大stepは遷移先が少ないため、両方の総量をO(N√N)へ均衡できる。

## 実装上の注意

- bucketへdp[i]を入れるのは、その時点までの全到達寄与をdp[i]へ集めた後に行う。停止は任意なので答えはdp[N]だけでなくΣdp[i]である。

## 復習の核

- 全A_i=1、全A_i>N/2、A_iが境界B前後、N=1を、全path列挙と比較しbucketの自己寄与が混ざらないことを確認する。

## 計算量と制約

### 時間

O(NB+N²/B)、B≈√NでO(N√N)。

### 空間

O(N+B²)、小stepの剰余bucket。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 1 \le A_i \le 2 \times 10^5

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/editorial/9038) — source-abc335-editorial-9038-75d1ffdd8b1f3f04351303bd37aa5663466c9211f668ed0c1fd1e25f0d815f2e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/tasks/abc335_f) — source-abc335-f-problem-43ce80c8813d030f4d8d45e6809eb385d25fd1db5fa21b707b2a9f9c32678483
