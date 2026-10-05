---
title: "ABC219-F — Cleaning Robot"
draft: true
authoringUnit: {"problemId":"abc219-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc219-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc219-editorial-2654-d2708597a9cadb88dccc2c9f35a8c64a02b03f3a9ae097b4f4498eb46d234014","source-abc219-f-problem-81357b19bc73aa408a3ae3da0732b554e100dd724249f7455f547dfa6db1cbf5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"a≠0 としたとき q=floor(X/a)、s=X-qa、t=Y-qb を使うと、二点の (s,t) が等しいことと差が v の整数倍であることが同値になる。 同じ group の q を q_1<…<q_m とすると、各 q_r の寄与は r<m なら min(q_{r+1}-q_r,K)、最後は K である。 各基準点が新しいマスを生む反復回数は、正方向で次に V と重なる最小 shift d に対する min(d,K) であり、隣接 gap だけから求められる。","sourceRevisionIds":["source-abc219-editorial-2654-d2708597a9cadb88dccc2c9f35a8c64a02b03f3a9ae097b4f4498eb46d234014","source-abc219-f-problem-81357b19bc73aa408a3ae3da0732b554e100dd724249f7455f547dfa6db1cbf5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

この解説で扱わないこと:

- 交換論による貪欲順の証明。

## 考察

S を一回実行して訪れる重複なしの集合 V と、終了変位 v=(a,b) を求めると、r 回目に訪れる集合は V+(r-1)v である。K は巨大でも、異なる形を K 回シミュレーションしているわけではない。

二つの基準点 p,q が異なる反復で同じマスを生成するのは q-p が v の整数倍のときだけである。したがって V を v に平行な同一直線・同じ剰余の orbit ごとに分ければ、重複は一次元の平行移動として数えられる。

採用する候補: V の各点を変位 v による orbit key で分類し、orbit 内の整数位置 q をソートして、次の基準点までの gap と K の小さい方を足す。

棄却する候補: S を K 回連結した経路を順にたどり、訪問座標を hash set に入れる。

K は 10^12 まであり、同じ平行移動構造を反復回数分展開できない。

一回分の全 prefix 座標を set で重複除去して V とする。v=0 なら |V| を返す。そうでなければ必要なら座標軸を交換して a≠0 とし、各点を (s,t,q) へ正規化して (s,t) ごとに q をソートし、隣接 gap の min と末尾の K を合計する。

## 典型の発動条件

### 反復経路の平行移動分解

発動条件: 同じ移動列を非常に多く繰り返し、一周期後の変位が一定であるとき。

一周期の訪問集合を求め、全体をその集合の等差的な平行移動の union として扱う。

### 格子点の orbit 正規化

発動条件: 点集合の重複条件が固定ベクトルの整数倍差で表されるとき。

ベクトル方向の整数座標 q と、それに不変な剰余 key を作り、group 内を一次元ソートする。

## 問題固有の要素

各基準点の K 個の像を全て数えるのではなく、その像が V の別基準点の系列へ初めて吸収される正の shift d までだけ新規と数える。

別の問題へ持ち帰る視点: 有限集合を同じベクトルで多数回動かした union では、各 orbit の開始点列と隣接 gap が新規出現数を決める。

## 正当性

a≠0 としたとき q=floor(X/a)、s=X-qa、t=Y-qb を使うと、二点の (s,t) が等しいことと差が v の整数倍であることが同値になる。 同じ group の q を q_1<…<q_m とすると、各 q_r の寄与は r<m なら min(q_{r+1}-q_r,K)、最後は K である。 各基準点が新しいマスを生む反復回数は、正方向で次に V と重なる最小 shift d に対する min(d,K) であり、隣接 gap だけから求められる。

## 実装上の注意

- V には開始点と一周期終了点を含めて重複除去する。a=0 なら x,y を交換し、さらに a>0 へ座標全体を反転すると正規化しやすい。負の X に対する floor divisionを切り捨て除算で代用せず、積と答えは 64 bit にする。

## 復習の核

- 変位が0の例と、同じ orbit に q=0,2 がある例を手計算し、後者の最初の基準点が min(2,K) 回だけ新規マスを作る理由を確認する。

## 計算量と制約

### 時間

O(L log L)、Lは一回の移動文字数、prefix点の正規化group sort。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string of length between 1 and 2 \times 10^5 (inclusive) consisting of L, R, U, D.; 1 \leq K \leq 10^{12}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/editorial/2654) — source-abc219-editorial-2654-d2708597a9cadb88dccc2c9f35a8c64a02b03f3a9ae097b4f4498eb46d234014
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/tasks/abc219_f) — source-abc219-f-problem-81357b19bc73aa408a3ae3da0732b554e100dd724249f7455f547dfa6db1cbf5
