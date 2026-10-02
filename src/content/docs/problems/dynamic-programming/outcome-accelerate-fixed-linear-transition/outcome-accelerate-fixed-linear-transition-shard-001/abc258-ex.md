---
title: "ABC258-EX — Odd Steps"
draft: true
authoringUnit: {"problemId":"abc258-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-accelerate-fixed-linear-transition/outcome-accelerate-fixed-linear-transition-shard-001/abc258-ex.md","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["一般のDP遷移の区間集約・単調最適化。"],"tagIds":["tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc258-editorial-4214-72a89899a08f2d41b860c48fb5f3c7b96791737313047cff559161dcc961c9e5","source-abc258-ex-problem-9e2caaf526e12085da313ab4343980f7b9055b33fdb2f61a7be7ef9ef6a55cba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"累積和は厳密に増加し、隣り合う差が正の奇数であることと偶奇の交代は同値である。E,O は最後の累積和の相対偶奇ごとに全prefix列を分類する。次位置を選ばない場合は分類だけが交換され、許可位置を選ぶ場合は直前までの E 個から新しい E の列が一つずつできるため指定の二行列になる。初期0を固定して各許可区間と禁止点を順に処理するので、禁止累積和を含む列は数えない。最後の S への奇数差は位置 S−1 と同じ偶奇の直前累積和からだけ作れ、E_{S−1} が完成列と全単射になる。","sourceRevisionIds":["source-abc258-editorial-4214-72a89899a08f2d41b860c48fb5f3c7b96791737313047cff559161dcc961c9e5","source-abc258-ex-problem-9e2caaf526e12085da313ab4343980f7b9055b33fdb2f61a7be7ef9ef6a55cba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 一般のDP遷移の区間集約・単調最適化。

## 考察

正の奇数列Xの累積和を0からSまで並べると、隣り合う累積和の偶奇は必ず異なり、途中の累積和として禁止位置A_iを選ばない部分集合問題と同値になる。

採用する候補: 二状態DPの長い同一遷移を2×2行列累乗

許可位置が連続する区間では同じFibonacci型遷移が繰り返されるため、禁止点間の最大10^18長区間を行列累乗で飛ばせる。

棄却する候補: 0からSまで一位置ずつDP

Sが最大10^18で、状態が二つでも全位置を走査できない。

最後に選んだ累積和の偶奇だけを状態にし、次位置を選ばない遷移と、許可位置で反対偶奇から選ぶ遷移を足す。

位置iとの相対偶奇で状態を定義すると、許可位置一歩の遷移が一定行列[[1,1],[1,0]]となり、A_iだけを個別処理すればよい。

0を必ず選んだ二状態ベクトルから始め、ソート済み禁止点A_iの間にある許可位置数だけFibonacci遷移行列を高速累乗して掛ける。禁止点では選択遷移を除いた状態更新だけを行い、最後にSを必ず選ぶ条件に対応する成分を答える。

状態を曖昧にしないため、位置 i まで処理した後の E_i を「最後に選んだ累積和と i の偶奇が同じ」列数、O_i を異なる列数とする。0だけを選んだ初期値は (E_0,O_0)=(1,0)。次の位置 i+1 を選ばないと相対偶奇が入れ替わり、選ぶには直前の累積和の偶奇が i+1 と異なる必要があるので、

```text
許可位置: (E',O') = (E+O,E),  L=[[1,1],[1,0]]
禁止位置: (E',O') = (O,E),    B=[[0,1],[1,0]]
```

となる。column vectorへ左から掛ける規約である。前処理位置を p=0 とし、禁止位置 a の順に L^{a−p−1}、B を掛けて p=a にする。最後は L^{S−1−p} を掛け、位置 S を必ず選ぶ場合の個数 E_{S−1} を答える。S自体を選ばない選択は足さない。

## 典型の発動条件

### 累積和位置の部分集合化

発動条件: 正の部品列の和と各部品の偶奇制約がある。

部品境界の累積和を選び、奇数差を隣接境界の異なる偶奇として表す。

### 転送行列の区間累乗

発動条件: 同じ二状態遷移が非常に長い連続区間で反復される。

禁止位置間の許可区間を2×2行列の冪でまとめて進める。

### Fibonacci型DP

発動条件: 選ばない場合と反対偶奇から選ぶ場合の二択がある。

相対偶奇状態を使って一定のFibonacci行列へ変形する。

## 問題固有の要素

奇数部品の列を直接数えるより、累積和境界の交互偶奇な選択へ変えると、禁止値は単に選べない位置になる。

別の問題へ持ち帰る視点: 巨大な座標上の疎な例外問題では、通常位置の有限状態遷移を行列累乗し、例外だけ逐次処理する。

## 正当性

累積和は厳密に増加し、隣り合う差が正の奇数であることと偶奇の交代は同値である。E,O は最後の累積和の相対偶奇ごとに全prefix列を分類する。次位置を選ばない場合は分類だけが交換され、許可位置を選ぶ場合は直前までの E 個から新しい E の列が一つずつできるため指定の二行列になる。初期0を固定して各許可区間と禁止点を順に処理するので、禁止累積和を含む列は数えない。最後の S への奇数差は位置 S−1 と同じ偶奇の直前累積和からだけ作れ、E_{S−1} が完成列と全単射になる。

## 実装上の注意

- 0とSは必須、A_iは途中の禁止位置として区別する。禁止点間の許可個数にoff-by-oneを入れず、状態の偶奇は位置相対定義に合わせ、法998244353で計算する。

## 復習の核

- 小さいSで全compositionを列挙し、禁止点なし相当、連続する禁止点、A_1=1やA_N=S-1、Sの偶奇ごとの終端成分を確認する。

## 計算量と制約

### 時間

O(M log S)、M禁止点数、総和S、固定二状態行列。

### 空間

O(M)、禁止点sort、DP自体O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq A_1 \lt A_2 \lt \dots \lt A_N \lt S \leq 10^{18}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/editorial/4214) — source-abc258-editorial-4214-72a89899a08f2d41b860c48fb5f3c7b96791737313047cff559161dcc961c9e5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/tasks/abc258_h) — source-abc258-ex-problem-9e2caaf526e12085da313ab4343980f7b9055b33fdb2f61a7be7ef9ef6a55cba
