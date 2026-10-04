---
title: "ABC431-F — Almost Sorted 2"
draft: true
authoringUnit: {"problemId":"abc431-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc431-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-two-pointers-window"],"sourceRevisionIds":["source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730","source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"値を昇順に追加する際、新最大値vの直後に大き過ぎる下降を作らない挿入gapは、既存のv−D..v−1の各要素の直前と末尾だけ。新しいvへの上昇は常に合法なので直前要素は制限しない。g=w+1個の区別gapへ同値cnt[v]個を分けるstars-and-barsはC(w+cnt[v],cnt[v])。最終列から最大値群を削除すると前段と各gapの個数が一意に戻るため、全値の積が各合法列を一度数える。","sourceRevisionIds":["source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730","source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md) — 窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

最終列Bの条件はB_i−B_{i+1}≤Dであり、大きすぎる下降だけが禁止される。順列を直接並べると階乗個になるが、値の小さい方から挿入していけば、追加するvは現在の最大値なので、新しいvへの上昇は必ず合法である。制限されるのはvの直後の値だけになる。

cnt[v]を値vの個数とし、すでにv未満の値の順序を決めたとする。vを入れられるのは、値が閉区間[v−D,v−1]にある各既存要素の直前と、列の末尾。窓内の要素数wは頻度だけで決まり、今の並びに依存しない。同じvをまとめて入れたblockの内部は差0なので、w+1個の区別されたgapへcnt[v]個を非負個数ずつ分配する。stars-and-barsより分配数はC(w+cnt[v],cnt[v])。

この操作を逆に見ても合法列が保存される。最大値vのblockを削除して小さい値x,yが新しく隣接したとき、元のv→yが合法ならx−y≤v−y≤D。従って小さい値だけの前段も合法で、各gapへ入れた個数は最終列から一意に復元できる。前段の全合法列に同じ数の挿入方法があるので、値ごとの二項係数を掛ければよい。

factorialとinverse factorialを0..Nで前計算する。cntのprefix P[t]=Σ_{u≤t}cnt[u]（t≤0では0）を用い、v=1,…,max Aを昇順に見てw=P[v−1]−P[v−D−1]を求め、answerへC(w+cnt[v],cnt[v])を掛ける。初期answer=1。同値要素は区別しないので、さらにN!やcnt[v]!を掛けない。cnt[v]=0なら係数1で何も変わらない。

A=(1,3)でD=1では3を入れるgapは末尾だけで1通り、D=2なら1の直前と末尾で2通り。A=(1,1,3,3),D=2では三つのgapへ二個の3を分配し、C(4,2)=6通り。差Dの境界を残す理由と、同値でも位置gapは異なる理由がこの例で分かる。

## 典型の発動条件

頻度のsliding windowとstars-and-bars。値vの許容既存要素数wに対してC(w+cnt[v],cnt[v])を積算する。

## 問題固有の要素

同値要素を区別せず、許容gapは窓内の各既存要素の直前と末尾。vから後続要素への下降差をD以下に制限するので、直後ではなく直前に挿入する。Dの境界を閉区間で扱う。

## 正当性

値を昇順に追加する際、新最大値vの直後に大き過ぎる下降を作らない挿入gapは、既存のv−D..v−1の各要素の直前と末尾だけ。新しいvへの上昇は常に合法なので直前要素は制限しない。g=w+1個の区別gapへ同値cnt[v]個を分けるstars-and-barsはC(w+cnt[v],cnt[v])。最終列から最大値群を削除すると前段と各gapの個数が一意に戻るため、全値の積が各合法列を一度数える。

## 実装上の注意

窓から削除するのはv−D−1以下で、v−Dを残す。二項係数の最大添字はN。

## 復習の核

A=(1,3)でD=1なら1列、D=2なら13と31の2列。差Dを除く半開境界の実装をこの二例で検出する。

## 計算量と制約

### 時間

O(V+N)、V=max A+D。頻度窓と二項係数表。

### 空間

O(V+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq D\leq 10^6; 1\leq A_i\leq 10^6; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/editorial/14492) — source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/tasks/abc431_f) — source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f
