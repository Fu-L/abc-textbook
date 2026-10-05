---
title: "ABC286-F — Guess The Number 2"
draft: true
authoringUnit: {"problemId":"abc286-f","docPath":"src/content/docs/problems/mathematics/outcome-solve-modular-constraints/outcome-solve-modular-constraints-shard-001/abc286-f.md","learningOutcomeIds":["outcome-solve-modular-constraints","outcome-exploit-modular-periodicity"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-diophantine","unit-interactive-protocol","unit-modular-arithmetic"],"excludedTopics":["可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。"],"tagIds":["tag-modular-congruence-crt","tag-modular-periodicity","tag-interactive-protocol"],"sourceRevisionIds":["source-abc286-editorial-5588-84001bb2b92333c70401743584f2dd937e4435e68da73f58abd8dedc18635260","source-abc286-f-problem-cafbda3fb64fbcd274bf163b32a922c2c5d1798c0c2c6c4ec0f55dd8b60aaacb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さcのcycleに写像N乗を適用するとblock先頭がN mod cだけ動く。選んだcycle長は互いに素なのでCRTで[0,L)に唯一解があり、L>10^9は隠し値全域を覆う。そのため応答から得た剰余を統合した解が隠しNそのものになる。","sourceRevisionIds":["source-abc286-editorial-5588-84001bb2b92333c70401743584f2dd937e4435e68da73f58abd8dedc18635260","source-abc286-f-problem-cafbda3fb64fbcd274bf163b32a922c2c5d1798c0c2c6c4ec0f55dd8b60aaacb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次合同・CRTで解の類を統合する](src/content/docs/learn/number-theory/modular-congruence.md)

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。
- 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。

先に読む単元:

- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md) — 最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。
- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md) — 問い合わせ形式・回数上限・応答依存性・交互手番・合法な応答・flushを明示し、アルゴリズムをjudgeとの対話列として安全に実行する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 考察

写像Aに長さcのcycleを作ると、judgeのB=f^NはそのcycleをN mod cだけ回転させるため、応答から合同式N≡r (mod c)を読める。

互いに素なcycle長の積が10^9を超えれば、全合同式を満たす[0,LCM)の値はhidden Nに一意に一致する。

cycle長4,9,5,7,11,13,17,19,23は互いに素で、頂点数の和108≤110、積1338557220>10^9を同時に満たす。

採用する候補: 108頂点を指定した9個の互いに素なcycleへ分け、各回転量を中国剰余定理で統合する。

query長制約内で復元範囲がhidden Nの上限を超え、1回の応答から正確に決定できる。

棄却する候補: 29以下の全prime長2,3,5,…,29のcycleを使う。

LCMは十分大きいがcycle長の和が129となりM≤110を超える。

棄却する候補: 1本の長いcycleだけでNを復元する。

M≤110なので得られる剰余はmod 110以下で、10^9通りを区別できない。

block先頭をsとする長さcのcycleをs→s+1→…→s+c-1→sと張れば、residueは(B_s-s+c) mod cで得られる。

cycle長にはprimeそのものだけでなくprime power 4,9を使うと、互いに素性を保ったまま、同程度の頂点数でLCMを大きくできる。

長さ[4,9,5,7,11,13,17,19,23]の各連続blockをcycleにしたAを出力してflushする。Bを受け取り、各block先頭の移動量からN mod cを復元する。得た9合同式を中国剰余定理で統合し、[0,1338557220)の解を出力して直ちに終了する。

## 典型の発動条件

### 中国剰余定理によるhidden値復元

発動条件: 1回の観測から複数modulusの剰余を独立に得られるとき。

互いに素なcycleの回転量を合同式として統合する。

### functional graphのcycle encoding

発動条件: 写像の反復回数を応答から推定するinteractive問題。

cycle上の位置ずれへ反復回数の剰余を符号化する。

### modulusのpacking

発動条件: 観測サイズの和に制限があり、LCMを閾値以上へしたいとき。

互いに素なprime powerを選び、和108で積を10^9超へする。

## 問題固有の要素

各cycleはNの別々の剰余を並列に返す独立な計測器であり、A全体をpermutationとして構成すればBの1位置だけで回転量を読める。

別の問題へ持ち帰る視点: interactive設計では、応答を解析しやすい独立componentに分け、各componentへ合同情報を埋め込む。

## 正当性

長さcのcycleに写像N乗を適用するとblock先頭がN mod cだけ動く。選んだcycle長は互いに素なのでCRTで[0,L)に唯一解があり、L>10^9は隠し値全域を覆う。そのため応答から得た剰余を統合した解が隠しNそのものになる。

## 実装上の注意

- A,Bは1-indexed頂点番号なので、block内offsetとresidueの0-index差を混同しない。
- 出力のたびにnewlineとflushを行い、judgeから-1を受け取った場合や最終回答後は即終了する。
- CRTの積と途中計算は32bitを超えるため64bit整数を使う。

## 復習の核

- 短いcycleでN=2のB先頭位置からresidueを手計算し、9長の和・互いに素性・積の範囲とinteractive出力順を確認する。

## 計算量と制約

### 時間

O(108+log L)のCRT統合、L=1338557220。対話は固定長108。

### 空間

O(108)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 10^9 (inclusive).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/editorial/5588) — source-abc286-editorial-5588-84001bb2b92333c70401743584f2dd937e4435e68da73f58abd8dedc18635260
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/tasks/abc286_f) — source-abc286-f-problem-cafbda3fb64fbcd274bf163b32a922c2c5d1798c0c2c6c4ec0f55dd8b60aaacb
