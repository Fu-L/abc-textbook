---
title: "ABC378-G — Everlasting LIDS"
draft: true
authoringUnit: {"problemId":"abc378-g","docPath":"src/content/docs/problems/mathematics/outcome-translate-sequences-by-rsk/outcome-translate-sequences-by-rsk-shard-001/abc378-g.md","learningOutcomeIds":["outcome-translate-sequences-by-rsk"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rsk-young-tableaux","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db","source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"RSKは順列と同形標準盤対(P,Q)の全単射であり、LIS/LDSと面積AB−1から右下欠損形λが一意に定まる。末尾の半整数挿入が欠けた右下へ終わるには、押出列が右へ動けないため全行の列Aを通る必要がある。第一行の半整数を選べることと、以後の t_{i+1,A−1}<t_{i,A} はこの経路の必要十分条件である。行長DPは左・上と追加不等式の前提cellが埋まったときだけ次の値を置くので、制約付きPを各一回数える。追加可否はPだけで決まりQに制約はないため、dp[λ]へhook-length公式のQの個数を掛けた値が求める順列数である。","sourceRevisionIds":["source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db","source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Robinson–Schensted対応・Young tableau](src/content/docs/learn/combinatorics-algebra/rsk-young-tableaux.md)

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

長さ AB−1 の順列で LIS=A、LDS=B を同時に指定するので、[RSKの対応](src/content/docs/learn/combinatorics-algebra/rsk-young-tableaux.md)を候補にする。順列を挿入盤Pと記録盤Qの対へ移すと、図形は幅A・高さBの長方形に入り、面積が一つだけ足りない。Young図形の行長は非増加なので、欠けるマスは右下(B,A)だけ。形 λ=(A,…,A,A−1) が確定する。

ただし通常の盤数の二乗では第三条件を扱えない。末尾への追加値 z=n+0.5 がLIS/LDSを増やさないには、挿入後の形がA×B長方形になる必要がある。ここから、挿入盤Pの押し出し経路を逆向きに調べる。記録盤Qは値の大小を決めないため、この条件を課すのはPである。Pの(i,j)の値をt_{i,j}と書く。

行挿入で押し出す列番号は下の行へ進むほど左へ動くか同じで、右へは動かない。実際、列jの値を押し出すと、次行の列jの値は元の値より大きいので、次の押出位置はj以下になる。最終行で列Aへ追加するには、それまでの各行でも列Aを通る必要がある。第一行では

t_{1,A−1}<z<t_{1,A}

なら最終列の値を押し出す。この区間は相異なる整数の間なので、n=t_{1,A−1}とすれば半整数zが必ず存在する。第二行へ来る値はt_{1,A}である。列Aの手前を全て通過する条件は t_{2,A−1}<t_{1,A}、かつ元の列増加により t_{1,A}<t_{2,A} なので、再び最終列を押し出す。同様に行i+1では

t_{i+1,A−1}<t_{i,A} （1≤i<B）

が必要であり、これらが全て成立すれば最終行の末尾へ追加できるので十分でもある。よって「適切なnが存在する」はこの局所的な順序条件と同値になる。nの選び方を数える問題ではないため、存在するnが複数あっても盤Pを一度だけ数える。

Pは1,…,AB−1を小さい順に置くideal DPで数える。状態 ℓ=(ℓ_1,…,ℓ_B) は各行の埋まった長さで、ℓ_1≥…≥ℓ_B、0≤ℓ_i≤λ_i。dp[(0,…,0)]=1、ほかは0。行iへ次の値を置く条件は ℓ_i<λ_i と、i=1またはℓ_{i−1}>ℓ_i。さらに列Aへ置くとき、すなわちℓ_i=A−1のときは ℓ_{i+1}≥A−1 を要求する。これは t_{i+1,A−1} が今置く t_{i,A} より先に置かれているという追加不等式そのものである。最後の行には列Aがないので、この判定はi<Bだけ。合法なら dp[ℓ+e_i]+=dp[ℓ] を法Mで更新する。

終状態λの値Cが制約付きPの個数。Qは同形の任意の標準盤でよいので、hook長 h_{i,j}=λ_i−j+λ'_j−i+1 により U=(AB−1)!/∏h_{i,j} を求める。最終答えは C·U mod M。M>ABなので分母は全て可逆。A=3,B=2では追加条件 t_{2,2}<t_{1,3} を満たすPが2個、無制約Qが5個なので2×5=10になる。

階乗個の順列を直接列挙するのは不可能だが、idealの行長状態は高々 binom(A+B,A)。AB≤120で最大はA,B=10,12の646646で、各状態からB行を試せば十分である。

## 典型の発動条件

### Robinson–Schensted 対応

発動条件: permutation の LIS/LDS を同時に固定して数えたいとき。

LIS/LDS 条件を Young 図形の形へ変換する。

### Young 図形 ideal DP

発動条件: 小さな面積の標準 tableau に追加順序制約があるとき。

埋め済み領域の境界だけを状態として数える。

## 問題固有の要素

長さが長方形面積より1小さいことが、LIS/LDS の上限から tableau 形を完全に固定する。

別の問題へ持ち帰る視点: 追加要素の row insertion を追うと、難しい第三条件が既存セル間の局所不等式になる。

## 正当性

RSKは順列と同形標準盤対(P,Q)の全単射であり、LIS/LDSと面積AB−1から右下欠損形λが一意に定まる。末尾の半整数挿入が欠けた右下へ終わるには、押出列が右へ動けないため全行の列Aを通る必要がある。第一行の半整数を選べることと、以後の t_{i+1,A−1}<t_{i,A} はこの経路の必要十分条件である。行長DPは左・上と追加不等式の前提cellが埋まったときだけ次の値を置くので、制約付きPを各一回数える。追加可否はPだけで決まりQに制約はないため、dp[λ]へhook-length公式のQの個数を掛けた値が求める順列数である。

## 実装上の注意

- 追加不等式を課すのは挿入盤P。最後に無制約の記録盤Qの個数を掛ける。
- 行長境界をA+B bitで表す。下からi番目の行の長さをr_iとし、位置r_i+i−1を1にすれば一意に符号化できる。AB≤120とA,B≥2よりA+B≤62なので64 bit整数に収まる。各状態でB個の1を走査して行長を復元し、1マス追加は対応する1を一つ右の0へ移す。整数キーのhash表で遷移先を引き、Σℓが小さい順に処理する。列Aへ置く前に次行の列A−1が埋まっているかを確認する。
- 右下セルは遷移先に含めない。法Mは入力の素数で、hook長と階乗の範囲はAB未満。

## 復習の核

- RSK の P,Q tableau のどちらが何通り寄与するかと、末尾 n+0.5 の bumping path が右端不等式を生む過程を図で復習する。

## 計算量と制約

### 時間

期待O(SB+AB+log M)。S≤binom(A+B,A)−1≤646645はideal数。境界bit列の整数キーを使い、各状態の行長をO(B)で復元した後、B行の追加可否を定数時間で調べる。遷移先のhash検索は期待O(1)、hook積と階乗はO(AB)、逆元はO(log M)。B要素のtupleを遷移ごとにコピーすると追加のB倍が掛かるため、ここでは整数キーを使う。

### 空間

O(S+AB)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \leq A, B; AB \leq 120; 10^8 \leq M \leq 10^9; M is a prime.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/editorial/11283) — source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/tasks/abc378_g) — source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0
