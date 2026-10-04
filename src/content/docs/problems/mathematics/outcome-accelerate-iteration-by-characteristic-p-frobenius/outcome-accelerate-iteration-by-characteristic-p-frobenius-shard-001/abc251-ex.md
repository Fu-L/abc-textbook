---
title: "ABC251-EX — Fill Triangle"
draft: true
authoringUnit: {"problemId":"abc251-ex","docPath":"src/content/docs/problems/mathematics/outcome-accelerate-iteration-by-characteristic-p-frobenius/outcome-accelerate-iteration-by-characteristic-p-frobenius-shard-001/abc251-ex.md","learningOutcomeIds":["outcome-accelerate-iteration-by-characteristic-p-frobenius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-ordered-interval-partition"],"excludedTopics":["標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-finite-field-frobenius","tag-combinatorial-coefficients","tag-ordered-interval-partition"],"sourceRevisionIds":["source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004","source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一段上昇T=1+Eは入力の隣接和と一致する。標数7のFrobenius恒等式を繰り返せばT^{7^s}=1+E^{7^s}であり、七進桁の回数だけ合成した操作はT^{N−K}そのものになる。RLEの同時走査は二列のいずれかの値が変わる境界でのみ区切るため、全位置で正しい和を持つ。境界の統合は値列を変えない。降順は合成値のためでなく計算量保証のために必要で、同幅の高々7シフトと残り長さの双方で中間run数を抑える。","sourceRevisionIds":["source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004","source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [標数pのFrobenius恒等式による反復高速化](src/content/docs/learn/number-theory/finite-field-frobenius.md)

- 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md) — 順序付きのrun分割をdequeや連結リストで保持し、両端からの削除・分割・追加を行う。左端順setを使うODTとは区別する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

一段上へ進む隣接和をシフト作用素EでT=1+Eと書く。一般にはT^dの二項係数が多く、N≤10^9の行をそのまま扱えない。しかし法7では中間の二項係数が消え、T^{7^s}=1+E^{7^s}となる。幅h=7^sのジャンプはb_j=a_j+a_{j+h} mod7、出力長は現在長L−hである。

入力はM個の同値区間に圧縮されている。二つの列の境界を二本のpointerで同時に進めれば、列を展開せずO(r)でジャンプできる。例えば列1が5個、3が5個の長さ10から幅7で飛ぶと、残る三つの位置は全て1+3=4になる。異なるrunを跨ぐ加算であり、単に各runの値を二倍する操作ではない。

恒等式の正しさだけでは中間のrun数は保証されない。N−K=Σ_s d_s7^sを七進展開し、必ず大きいsから降順にd_s回ずつジャンプする。各d_sは0〜6。同じ幅hをd回適用した列は、元列の0,h,…,dhシフトの高々d+1本の線形結合なので、境界は元の各境界を高々7通りずらした位置にしか現れない。従って同じ幅の段ではrun数が高々7倍になる。

最上位幅を7^{t−1}とすると、幅7^sを終えた後のrun数はO(M7^{t−s})である。一方、残りの行差は7^s未満なので列長はK+7^s未満。7^t=O(N)より二つの上界の小さい方を使うと、run数はO(min(MN/7^s,K+7^s))。h=7^sが√(MN)以下なら長さの上界、以上なら境界数の上界を使い、どの段もO(K+√(MN))で抑えられる。段の途中も同じ幅の開始時から定数倍以内なので、この評価が実際の走査費用も抑える。

降順の七進ジャンプを終えたら、長さKのRLEを展開して出力する。隣接runが同値になったときはその場で統合し、半開区間の両端とシフト先の境界の小さい方までを一回に処理する。

## 典型の発動条件

### 有限体上のFrobenius

発動条件: 法pのパスカル変換をpの冪単位で高速化したい。

(1+x)^(p^t)=1+x^(p^t)を使い、長い二項係数畳み込みを少数のシフト加算へ変える。

### ラン長圧縮列の区間演算

発動条件: 非常に長い列が少数の定数区間で与えられる。

シフトで生じる境界だけを分割し、値が等しい隣接区間を統合して表現を小さく保つ。

## 問題固有の要素

法7という条件は単なる出力の剰余ではなく、パスカル変換を7の冪ごとの疎な変換へ変える核心である。

別の問題へ持ち帰る視点: 巨大な反復線形変換は、標数pの冪構造と入力の圧縮表現を組み合わせると飛び越せる。

## 正当性

一段上昇T=1+Eは入力の隣接和と一致する。標数7のFrobenius恒等式を繰り返せばT^{7^s}=1+E^{7^s}であり、七進桁の回数だけ合成した操作はT^{N−K}そのものになる。RLEの同時走査は二列のいずれかの値が変わる境界でのみ区切るため、全位置で正しい和を持つ。境界の統合は値列を変えない。降順は合成値のためでなく計算量保証のために必要で、同幅の高々7シフトと残り長さの双方で中間run数を抑える。

## 実装上の注意

- 七進桁は大きい幅から適用する。小さい幅から先に処理すると、残り列長による上界を同時に使えない。
- run数を入力Mのまま扱わず、境界増加と残り列長の小さい方で評価する。
- 区間端とジャンプ幅は64 bit。長さL−hだけ生成し、同値の隣接区間は統合する。

## 復習の核

- 小さいNで一行ずつ作る実装と比較し、ジャンプ幅がラン境界に一致する場合と内部を横切る場合、値が0になってランが再結合する場合を確認する。

## 計算量と制約

### 時間

O((√(MN)+K)log N)。七進桁はO(log N)、各桁のジャンプは高々6回、各回は二本pointerでO(r)。降順処理により段内のrもO(√(MN)+K)となる。最後の展開はO(K)、N=KではジャンプがなくO(M+K)。

### 空間

O(M+√(MN)+K)。入力RLEと現在・次のRLEを保持し、使い終えた段は解放する。出力列を保持する場合もO(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^9; 1 \leq M \leq \min(N, 200); 1 \leq K \leq \min(N,5 \times 10^5); 0 \leq a_i \leq 6; 1 \leq c_i \leq N; \sum_{i=1}^M c_i = N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/editorial/3954) — source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/tasks/abc251_h) — source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0
