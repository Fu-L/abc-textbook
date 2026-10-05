---
title: "ABC465-E — Digit Circus"
draft: true
authoringUnit: {"problemId":"abc465-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc465-e.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp"],"sourceRevisionIds":["source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5","source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"maskはleading zeroを除いた実数字集合、剰余は元整数mod3、tightは上限一致を記録する。次digit追加でこの三情報を正しく更新すれば、今後の合法digitと三条件判定に必要な履歴は全て保存される。各整数には長さLのzero埋め表現が一意で、mask0の先頭0だけを集合へ加えないので十進表記条件も一致する。末尾で(mod3=0)+(bit3あり)+(popcount(mask)=3)=1かつmask≠0を合計すれば、三条件のちょうど一つを満たす正整数を一度ずつ数える。","sourceRevisionIds":["source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5","source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

上限N以下の整数をleading zero付き同桁列として読むと、条件判定に必要なのは実際に使ったdigit集合、値mod3、既にNより小さいかの三情報だけである。 leading zeroは桁合わせのpaddingであってdigit 0を使用したことにはならないため、まだ実桁が始まっていない状態をmask=0として扱う。 次剰余は (10m+d) mod3 だが10≡1 mod3なので通常式でも定数stateのまま更新できる。

採用する候補: 桁位置i・digit mask b・mod3 m・tight/lower flag l のdigit DPを行い、次digit0..9を置いて集合・剰余・上限制約を更新する。

将来の許容digitと最終条件は過去の並び順には依存せず使用集合とmod3だけで決まり、上限比較もequalかsmallerの一bitで十分である。

棄却する候補: 1からNまで全整数を列挙し、decimal digit集合と3の倍数条件を検査する。

Nの桁数に対して値域が指数的に広く、Nそのものまでの走査はできない。

dp[mask=0][m=0][tight=1]=1、他は0。Nのdecimal文字列を左から走査し、tightなら現在の上限digit以下、そうでなければ0,…,9のdを選ぶ。次状態は

```text
mask' = (mask=0 かつ d=0 ? 0 : mask OR (1<<d))
m' = (10m+d) mod 3
tight' = tight AND (d=現在のNのdigit)
```

として旧配列から次配列へ加算する。末尾でmask≠0かつ

```text
[m=0]+[maskのbit3が1]+[popcount(mask)=3] = 1
```

を満たす状態だけを、tightの両方について合計する。角括弧は真なら1、偽なら0。三条件のORではなく真の個数がちょうど1であることを判定する。all-leading-zeroの数0はmask=0なので除外される。数3は倍数かつ3を含む二条件で不採用、数6は倍数だけで採用、数1012は3種類のdigitだけで採用となる。全加算と答えはmod 998244353。

## 典型の発動条件

### digit DP

発動条件: 巨大上限以下の整数をdigit集合や剰余条件で数えたいとき。

prefixのtight flagと有限なdigit統計をstateにする。

### 使用digit集合のbitmask

発動条件: 数字の出現有無だけが最終条件に必要なとき。

10 bit maskへ次digitをORして集合を追跡する。

## 問題固有の要素

整数列挙条件はdecimal prefixを一桁ずつ構築し、将来に影響する有限統計だけをstateへ残す。

別の問題へ持ち帰る視点: leading zeroは値表現外なので、通常digit 0の出現と区別する遷移規約が必要になる。

## 正当性

maskはleading zeroを除いた実数字集合、剰余は元整数mod3、tightは上限一致を記録する。次digit追加でこの三情報を正しく更新すれば、今後の合法digitと三条件判定に必要な履歴は全て保存される。各整数には長さLのzero埋め表現が一意で、mask0の先頭0だけを集合へ加えないので十進表記条件も一致する。末尾で(mod3=0)+(bit3あり)+(popcount(mask)=3)=1かつmask≠0を合計すれば、三条件のちょうど一つを満たす正整数を一度ずつ数える。

## 実装上の注意

- 正整数だけを数えるので最終mask=0を必ず除く。実桁が始まった後の0は通常のdigitとしてbit0を立てる。
- 初期tight=1、旧層から次層へ更新する。最後は条件三つの真偽の和が1かを検査し、tight=0と1の両方を足す。

## 復習の核

- Nより小さいflagが一度立つと自由digitになることと、padding zeroでmask bit0を立てない例を確認する。

## 計算量と制約

### 時間

十進桁数 L≤500、digit集合2^10、剰余3、tight2、一桁候補10。O(L·2^10·3·2·10)。

### 空間

rolling二層でO(2^10·3·2)、上限文字列O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \leq N < 10^{500}

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/tasks/abc465_e) — source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/editorial/22563) — source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d
