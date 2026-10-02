---
title: "ABC423-F — Loud Cicada"
draft: true
authoringUnit: {"problemId":"abc423-f","docPath":"src/content/docs/problems/mathematics/outcome-apply-subset-zeta-mobius-transform/outcome-apply-subset-zeta-mobius-transform-shard-001/abc423-f.md","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-inclusion-exclusion"],"excludedTopics":["subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-zeta-mobius-transform"],"sourceRevisionIds":["source-abc423-editorial-13873-b183c21408906a98fbc0a1ecb2bdafc34c2ae964197a7962a0a578c9cc33050e","source-abc423-f-problem-27082ddda5c782c854c9df91666560e0bb9c3f0adec2cb9f2d0306ea473c917c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"年yが全T条件を満たす数F[T]はLCMの倍数数。exact成立集合Sが一意なのでF[T]=Σ_{S⊇T}G[S]。superset反転がこの累積関係を逆にし、popcount MのGだけ合計すればexactly M条件年を数える。Y超LCMは倍数を持たないのでY+1capで個数0を保存する。","sourceRevisionIds":["source-abc423-editorial-13873-b183c21408906a98fbc0a1ecb2bdafc34c2ae964197a7962a0a578c9cc33050e","source-abc423-f-problem-27082ddda5c782c854c9df91666560e0bb9c3f0adec2cb9f2d0306ea473c917c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,3)、Y=6、M=1。","procedure":["2だけ成立は2,4、3だけ成立は3。6は両方なので除く。"],"executionTarget":null,"expectedResult":"3年。","verificationStatus":"not_applicable","learningUnitIds":["unit-subset-transforms"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"prerequisiteIds":["unit-dp-subset-state","unit-inclusion-exclusion"],"attainmentCondition":"A=(2,2),Y=6,M=1なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。"},"answer":{"reasoningOrVerification":"二条件は同時に成立するためexact一条件年はない。値の重複でもindex条件を別bitで持つ。","procedure":["具体例の各状態・寄与を再計算する。","二条件は同時に成立するためexact一条件年はない。値の重複でもindex条件を別bitで持つ。"],"expectedResult":"0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md)

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

対象外:

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

year yが条件iを満たすのはA_i|yである。subset Tの全条件を少なくとも満たすyear数はlcm(A_i,i∈T)の倍数個floor(Y/lcm)で求まり、exact satisfied subsetへMöbius inversionできる。

採用する候補: 全subset LCMを作りsuperset Möbius transformする

N≤20なので2^N状態で各yearを列挙せず、exactly M条件の年数を得られる。

棄却する候補: 1…Yの各yearで全A_iを試す

Yは10^18まであり列挙不可能である。

F[T]=全i∈Tを満たす年数とG[S]=exactにSを満たす年数にはF[T]=Σ_{S⊇T}G[S]が成り立つ。superset Möbius inversion後、popcount(S)=MのG[S]を合計すればよい。

subset DPでlcm[mask]を一bit追加から計算し、Y超ならY+1へcapする。F[mask]=Y/lcm[mask]を作り、各bitについてmaskにbitなし側からあり側を引くsuperset Möbius transformでGへ変換し、popcount Mを合計する。

## 典型の発動条件

### subset LCM DP

発動条件: 条件subsetの同時成立が数のLCMによる倍数条件になる。

一bit除いたsubsetのLCMと新Aをgcdで安全に更新する。

### superset Möbius inversion

発動条件: at least指定条件のcountからexactly成立条件集合のcountを復元する。

F[T]=Σ_{S⊇T}G[S]をBoolean lattice上で反転する。

## 問題固有の要素

求めるexactly M speciesは単なるM個subset inclusion-exclusionを個別にせず、全exact maskを一括反転してpopcountで集約できる。

別の問題へ持ち帰る視点: exact条件数queryはexact satisfied-set distributionをsubset transformで復元する。

## 正当性

年yが全T条件を満たす数F[T]はLCMの倍数数。exact成立集合Sが一意なのでF[T]=Σ_{S⊇T}G[S]。superset反転がこの累積関係を逆にし、popcount MのGだけ合計すればexactly M条件年を数える。Y超LCMは倍数を持たないのでY+1capで個数0を保存する。

## 実装上の注意

- lcm計算はx/gcd(x,a)>Y/aならY+1へcapしoverflowを避ける。empty maskのlcmは1。

## 復習の核

- N小・Y小でyear列挙し、重複A、A_i>Y、包含関係を比較する。

## 計算量と制約

### 時間

O(N2^N+2^N log max A_i)。subset LCMとsuperset Möbius反転。

### 空間

O(2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 20; 1 \leq Y \leq 10^{18}; 1 \leq A_i \leq 10^{18} (1 \leq i \leq N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,3)、Y=6、M=1。

1. 2だけ成立は2,4、3だけ成立は3。6は両方なので除く。

期待される結果: 3年。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A=(2,2),Y=6,M=1なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二条件は同時に成立するためexact一条件年はない。値の重複でもindex条件を別bitで持つ。

確認結果: 0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/editorial/13873) — source-abc423-editorial-13873-b183c21408906a98fbc0a1ecb2bdafc34c2ae964197a7962a0a578c9cc33050e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc423/tasks/abc423_f) — source-abc423-f-problem-27082ddda5c782c854c9df91666560e0bb9c3f0adec2cb9f2d0306ea473c917c
