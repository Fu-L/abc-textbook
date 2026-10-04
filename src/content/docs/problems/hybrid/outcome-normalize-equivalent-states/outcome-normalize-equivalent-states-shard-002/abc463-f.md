---
title: "ABC463-F — Senshuraku"
draft: true
authoringUnit: {"problemId":"abc463-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc463-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f","source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各試合は独立で、表は勝者二通りの結果から優勝勝数Vへの整合と候補人数を直接数えている。確定試合全体の整合確率はP、そのときの候補人数はK。可変試合の候補数はx回の公平Bernoulliの和なので二項分布。本人が候補になる場合だけ、総候補人数の逆数を掛けると、最後の公平な優勝決定で本人が選ばれる確率となる。可変選手は本人の試合を分離したA、確定選手は条件付き候補率qを掛けたBで数える。V=W,W+1は排反で全結果を覆うので二caseの寄与和が答え。","sourceRevisionIds":["source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f","source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 交換論による貪欲順の証明。

## 考察

最後の各試合で選手の勝数は0または1増える。現在の最多をWとすると優勝勝数はWまたはW+1で、W−2以下の選手は候補にならない。選手をH（W勝）、L（W−1勝）、O（それ以下）に分け、HH,HL,HO,LL,LO,OOの試合数をm_0,…,m_5とする。

優勝勝数をVに固定すると、各試合が「整合する確率pとそのときの確定候補人数k」を持つか、「確率1/2で候補一人、残り1/2でゼロ」を持つ。後者を可変試合と呼ぶ。次の表で全場合が定まる。

| 試合 | V=W+1 | V=W |
| --- | --- | --- |
| HH | p=1,k=1、各選手の候補率q=1/2 | p=0 |
| HL | 可変、Hが候補 | p=1/2,k=2、両選手q=1 |
| HO | 可変、Hが候補 | p=1/2,k=1、Hだけq=1 |
| LL | p=1,k=0 | p=1,k=1、各選手q=1/2 |
| LO | p=1,k=0 | 可変、Lが候補 |
| OO | p=1,k=0 | p=1,k=0 |

例えばV=WではHLはLが勝つ場合だけ整合し、二人ともW勝になる。HHが一試合でもあれば必ずW+1勝が生まれ、このcaseの確率は0。

確定試合のpの積をP、候補人数の和をK、可変試合数をxとする。V=W+1では(P,K,x)=(1,m_0,m_1+m_2)。V=Wではm_0=0のとき(2^{−(m_1+m_2)},2m_1+m_2+m_3,m_4)である。可変試合の候補人数は二項分布になる。

可変試合にいる候補可能選手の優勝確率への寄与は

A(P,K,x)=P 2^{−x} Σ_{t=0}^{x−1} C(x−1,t)/(K+1+t)。

本人が候補になる1/2と、残るx−1試合の候補数tをまとめた式である。確定試合にいる選手は、整合条件下で候補になる確率qを使い

q B(P,K,x)=q P 2^{−x} Σ_{t=0}^{x} C(x,t)/(K+t)

を加える。候補人数0の項は優勝者がいないcaseなので除き、この式を使う実在候補選手がいるときはK≥1である。可変選手はAを全員で共有し、確定選手もq=1または1/2だけ違う。二つのVについて表から各選手へ配り、足せばよい。

階乗・逆階乗、2冪と候補人数の逆元を2Nまで前計算すると、二つの和を各O(N)で計算して2N選手へO(N)で配れる。

## 典型の発動条件

### 結果classの対称圧縮

発動条件: 独立二択試合が多数あり、参加者の初期状態が少数classに限られるとき。

試合をclass数へまとめ、個別勝敗をbinomial分布で数える。

### 候補人数での期待値分解

発動条件: 同率首位から一様に優勝者が選ばれる確率を求めたいとき。

候補に含まれる確率を候補総数ごとに求めて1/wを掛ける。

## 問題固有の要素

指数個の勝敗列も、最終threshold周辺の状態classだけ残すと独立なtypeとbinomial成功数へ縮約できる。

別の問題へ持ち帰る視点: tie-break期待値は候補集合を列挙せず、特定選手を含む候補人数分布を数える。

## 正当性

各試合は独立で、表は勝者二通りの結果から優勝勝数Vへの整合と候補人数を直接数えている。確定試合全体の整合確率はP、そのときの候補人数はK。可変試合の候補数はx回の公平Bernoulliの和なので二項分布。本人が候補になる場合だけ、総候補人数の逆数を掛けると、最後の公平な優勝決定で本人が選ばれる確率となる。可変選手は本人の試合を分離したA、確定選手は条件付き候補率qを掛けたBで数える。V=W,W+1は排反で全結果を覆うので二caseの寄与和が答え。

## 実装上の注意

- OはW−2以下の分類名であり、実際の勝数0と混同しない。Wが小さい場合も元の勝数からH,L,Oを判定する。
- V=Wでm_0>0ならcase全体を飛ばす。分母の人数0を評価しない。
- 一選手ごとに二項和を計算せず、A,Bをcaseごとに一度計算して表のqだけ掛ける。
- 先に所属classを計算し、対戦入力の左右に戻して確率を出力する。

## 復習の核

- W-2以下を捨てられる理由を確認し、各六classが二つの最多勝caseで候補者を何人作るか表にしてから公式へ落とす。

## 計算量と制約

### 時間

O(N)、六試合classごとの確率を候補人数w=0..Nで一度ずつ集計して同classの全選手へ共有する。

### 空間

O(N)、階乗・逆元・2冪。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 0\le A _ i\lt2N\ (1\le i\le 2N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/editorial/21939) — source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/tasks/abc463_f) — source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01
