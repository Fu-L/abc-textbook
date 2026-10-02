---
title: "ABC344-F — Earn to Advance"
draft: true
authoringUnit: {"problemId":"abc344-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc344-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc344-editorial-9473-e93b9c642a9f4fdca8fc80437b3b360b32bbfd6554894e058ecf9eef3b29e822","source-abc344-f-problem-1ce348dacdf45e7ee430869830c57cb7ab4b03f187e2300e665afb33c4dde6b3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"経路上で得た最大収入率pで稼ぐ操作は、その率を得た地点で前倒しできるので、必要額が不足した移動の直前に抽象的に稼いでも最適値は変わらない。必要最小回だけ稼ぐ正規形では移動後の残金は常に0以上p未満になる。同cell・pでaction数が少ない状態は、一回追加してpを稼げば残金が他状態以上となり、action差が少なくとも一回あるため他状態の続行を遅れず再現できる。action同数なら残金大だけを残せばよい。この支配性により辞書順一状態へ圧縮しても最適経路は失われず、右・下の全移動を緩和した終点最小が答えとなる。","sourceRevisionIds":["source-abc344-editorial-9473-e93b9c642a9f4fdca8fc80437b3b360b32bbfd6554894e058ecf9eef3b29e822","source-abc344-f-problem-1ce348dacdf45e7ee430869830c57cb7ab4b03f187e2300e665afb33c4dde6b3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

過去に訪れたcellではいつでもstayして稼げるため、稼ぐrateはpath上のP最大値だけを使えばよい。またmoneyが必要になるまでstayを遅らせても行動数は変わらず、各move直後のmoneyを最小限の稼ぎ方で一意に決められる。

採用する候補: cell・path上最大Pの出所を状態にし、(action数,money)をlexicographic DPする

経路ごとに必要な履歴を最大rateへ圧縮し、同状態ではaction最小・tie時money最大の一つだけ残せる。

棄却する候補: money額そのものをDP次元にする

edge costが10^9でmoney範囲が巨大になり、有限な配列状態へ収まらない。

同じcellと最大rate pでaction数が等しい二状態ならmoneyが多い方が以後常に有利である。move cost cに不足する時だけceil((c-money)/p)回stayすれば、余分に先払いして稼ぐ必要はない。

DP[cell][maxP-cell]に最良(action,money)を持ち、開始(1,1)を(0,0)とする。右/下move cost cごとにw=max(0,ceil((c-money)/p))を求め、(action+w+1,money+wp-c)を遷移先へ送る。遷移先のPが大きければmaxP出所を更新し、action小・tieでmoney大にchmaxする。終点の最小actionを出す。

## 典型の発動条件

### 支配関係によるDP状態圧縮

発動条件: 同じ位置・将来の収入rateで、過去差が行動数と所持金だけに現れる。

action数を最小化し、同数ならmoney最大の代表だけを残すPareto順序を使う。

### 必要時のceiling補給

発動条件: rate pで何回でも資源を増やし、cost cを払う前の不足だけ補いたい。

不足額をceil divisionして最小stay回数を算出する。

## 問題固有の要素

過去Pの集合全体でなく最大値を持つcellだけを記録すればよく、その候補はpath上のN^2 cellのいずれかなので巨大moneyを離散stateから外せる。

別の問題へ持ち帰る視点: 反復可能な収入源は最大rateだけが支配し、resource量は目的値tie-breakとして保持できる。

## 正当性

経路上で得た最大収入率pで稼ぐ操作は、その率を得た地点で前倒しできるので、必要額が不足した移動の直前に抽象的に稼いでも最適値は変わらない。必要最小回だけ稼ぐ正規形では移動後の残金は常に0以上p未満になる。同cell・pでaction数が少ない状態は、一回追加してpを稼げば残金が他状態以上となり、action差が少なくとも一回あるため他状態の続行を遅れず再現できる。action同数なら残金大だけを残せばよい。この支配性により辞書順一状態へ圧縮しても最適経路は失われず、右・下の全移動を緩和した終点最小が答えとなる。

## 実装上の注意

- money≥costならstay 0回とし、ceilは正の不足にだけ適用する。action数とmoney積は64bitを用い、maxPが同値の時は既存出所へ統一してstate重複を抑えられる。

## 復習の核

- 最初のPが最大、途中でrate更新、所持金ちょうどcost、同actionでmoneyだけ異なる二pathを小Nのresource探索と比較する。

## 計算量と制約

### 時間

O(N⁴)、現在cell×過去最大rateの出所cell、各state二移動。

### 空間

O(N⁴)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 80; 1 \leq P_{i,j} \leq 10^9; 1 \leq R_{i,j},D_{i,j} \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/editorial/9473) — source-abc344-editorial-9473-e93b9c642a9f4fdca8fc80437b3b360b32bbfd6554894e058ecf9eef3b29e822
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/tasks/abc344_f) — source-abc344-f-problem-1ce348dacdf45e7ee430869830c57cb7ab4b03f187e2300e665afb33c4dde6b3
