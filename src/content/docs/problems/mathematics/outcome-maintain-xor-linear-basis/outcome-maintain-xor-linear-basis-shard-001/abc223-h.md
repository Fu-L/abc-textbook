---
title: "ABC223-H — Xor Query"
draft: true
authoringUnit: {"problemId":"abc223-h","docPath":"src/content/docs/problems/mathematics/outcome-maintain-xor-linear-basis/outcome-maintain-xor-linear-basis-shard-001/abc223-h.md","learningOutcomeIds":["outcome-maintain-xor-linear-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis","tag-event-sweep"],"sourceRevisionIds":["source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190","source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"挿入中の二行(x,p),(basis[b],q)の同pivot処理を、任意に固定した左端Lで見る。両添字がL以上なら、swapと一方へのXORは行基本変形なのでeligibleな行のspanを保つ。両方がL未満ならeligibleな行に影響しない。一方だけがL以上なら、新しい添字の行をpivotへ置くので、eligibleな行はそのまま残り、消去する古い添字の行はeligibleにならない。添字の大きい行を小さい添字の行へXORしても、残る行は元の小さい添字以上の要素の結合である。\n\nよって作業行を含むeligible spanは全Lで保たれる。新しい独立行をpivotへ保存、または零行を捨てて挿入を終えると、pos[b]≥Lの保存行はちょうどspan(A_L,…,A_R)を生成する。異なる最高bitを持つ行は独立なので、そのsubsetでの高bit消去に成功することとXの所属が同値。R順の挿入により各queryの必要なprefixだけを使う。","sourceRevisionIds":["source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190","source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

## 考察

区間内の部分集合XORは、A_L,…,A_RがF₂上で張るspanへの所属判定である。各queryで基底を作り直すと同じ区間要素を何度も消去する。右端Rを昇順に処理し、各左端Lのsuffix spanを一つの添字付き基底で表せないか考える。

basis[b]の最高bitをb、pos[b]をその行に付けた添字とする。保つ条件は、任意のLについてpos[b]≥Lの行だけがspan(A_L,…,A_R)を生成すること。各行自体もpos[b]以上の元添字の線形結合である。新しいA_Rをx、p=Rとして、次の挿入を行う。

```text
bを59から0へ:
  xのbit bが0なら次へ
  basis[b]が空なら(basis[b],pos[b])=(x,p)を置いて終了
  pos[b]<pなら、(x,p)と(basis[b],pos[b])を同時にswap
  x ^= basis[b]
x=0になれば終了
```

swapした後、残るxは古い方の添字を持つ。ベクトルだけを交換して添字を据え置くとsuffixの表現範囲が壊れる。新しい行を優先する理由は、Lが二つの添字の間にある場合にも、その行を残す必要があるためである。正当性では全Lについてこの更新を確認する。

Rの挿入後、その右端のqueryを処理する。Xを高bitから、pos[b]≥Lのpivotだけで消去する。必要なpivotがなければNo、最後に0ならYes。行数は高々60なので、Rに対応する全suffixを保っても一問60bitで処理できる。

## 典型の発動条件

### F_2 上のXOR線形基底

発動条件: 部分集合XORの実現可能性を問われ、値のbit幅が小さく固定されているとき。

数をベクトルとしてpivotごとに掃き出し、目標ベクトルが生成部分空間に属するかを判定する。

### 右端オフライン走査と添字付き基底

発動条件: 区間問い合わせを右端までのprefixデータへ追加でき、左端制約を要素の時刻で判定できるとき。

基底ベクトルへ有効な最新添字を付け、Rを固定したまま異なるLのsuffix spanを一つの基底から取り出す。

## 問題固有の要素

区間ごとの基底を保存する代わりに、同じpivotでは新しい添字を勝たせると、一つのprefix基底が全ての左端に答えられる。

別の問題へ持ち帰る視点: 可逆な要約構造で区間を扱うとき、要約要素に『どこから有効か』という時刻を持たせてprefixをsuffix判定へ転用する。

## 正当性

挿入中の二行(x,p),(basis[b],q)の同pivot処理を、任意に固定した左端Lで見る。両添字がL以上なら、swapと一方へのXORは行基本変形なのでeligibleな行のspanを保つ。両方がL未満ならeligibleな行に影響しない。一方だけがL以上なら、新しい添字の行をpivotへ置くので、eligibleな行はそのまま残り、消去する古い添字の行はeligibleにならない。添字の大きい行を小さい添字の行へXORしても、残る行は元の小さい添字以上の要素の結合である。

よって作業行を含むeligible spanは全Lで保たれる。新しい独立行をpivotへ保存、または零行を捨てて挿入を終えると、pos[b]≥Lの保存行はちょうどspan(A_L,…,A_R)を生成する。異なる最高bitを持つ行は独立なので、そのsubsetでの高bit消去に成功することとXの所属が同値。R順の挿入により各queryの必要なprefixだけを使う。

## 実装上の注意

- swapは値と添字を一組で行う。swap後の作業添字pは古い方になり、そのpを次のpivotとの比較にも使う。
- X_i>0なので空集合による0は回答に影響しない。元の問題では非空性のためのrank補助情報は不要である。
- queryを右端bucketへまとめ、A_Rを挿入してから回答する。

## 復習の核

- 区間XORの『選び方』を追わず、まず生成部分空間への所属へ言い換え、左端を基底の有効時刻として持たせる。

## 計算量と制約

### 時間

O((N+Q)B)、B=60。

### 空間

O(Q+B)、入力保持込みO(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 4 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq A_i \lt 2^{60}; 1 \leq L_i \leq R_i \leq N; 1 \leq X_i \lt 2^{60}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/editorial/2784) — source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/tasks/abc223_h) — source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e
