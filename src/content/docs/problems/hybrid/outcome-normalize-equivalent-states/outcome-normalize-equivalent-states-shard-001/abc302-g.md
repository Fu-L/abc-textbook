---
title: "ABC302-G — Sort from 1 to 4"
draft: true
authoringUnit: {"problemId":"abc302-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc302-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc302-editorial-6393-61b7ea0d859ff4fb59b59a0bf2e9f9fb2093d207e077d62e668cd3583843d22e","source-abc302-g-problem-a6e5157f05f8846c2c25f0821320fa4c725fd772d70553ef3ca56d068a43abf0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"C[i][j]を現在値i・目標値jの位置数とする。値の順列pごとにF(p)=Σ_{a<b}C[p_a][p_b]を置くと、一回のswapでF(p)は高々1しか減らず下界になる。逆向きpairの相殺後に残るbalancedな誤配置cycleを解消することで、この下界の最大値を達成できる。 任意swapの最小回数を、定数個のpotentialの最大値としてO(N)で厳密に計算できる。","sourceRevisionIds":["source-abc302-editorial-6393-61b7ea0d859ff4fb59b59a0bf2e9f9fb2093d207e077d62e668cd3583843d22e","source-abc302-g-problem-a6e5157f05f8846c2c25f0821320fa4c725fd772d70553ef3ca56d068a43abf0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

目標は昇順列なので、各位置について現在値iと目標値jだけを数えれば、同じ型の位置は交換上区別しなくてよい。値が1～4に限られるため、不一致は4×4行列Cに圧縮できる。

採用する候補: 不一致行列と4値の全順列24通りを用いる

任意swapの最小回数を、定数個のpotentialの最大値としてO(N)で厳密に計算できる。

棄却する候補: 現在列のinversion数を答えとみなす

一回の操作で任意の二位置を交換でき、隣接swapとは異なるためinversion数は操作回数を表さない。

C[i][j]を現在値i・目標値jの位置数とする。値の順列pごとにF(p)=Σ_{a<b}C[p_a][p_b]を置くと、一回のswapでF(p)は高々1しか減らず下界になる。逆向きpairの相殺後に残るbalancedな誤配置cycleを解消することで、この下界の最大値を達成できる。

入力をsortした目標列と比較してCを作る。1,2,3,4の全24順列pを列挙し、pで前に置いた値から後に置いた値への誤配置数ΣC[p_a][p_b]を計算し、その最大値を最小swap回数として出力する。

## 典型の発動条件

### 小さい値域への頻度圧縮

発動条件: 列長は大きいが、交換の振る舞いが現在値と目標値の組だけで決まる。

各位置を4×4の誤配置型へ集約し、位置列を定数サイズの状態へ落とす。

### 有限全探索によるpotential最大化

発動条件: 値種類数が4で、順序を固定した下界を全順序から選べる。

24通りの順列を列挙し、swap一回あたり変化量が1以下のpotentialの最大を取る。

## 問題固有の要素

二要素の直接相殺だけでなく、3-cycle・4-cycleとして残る誤配置も、値順序pに対する向き付き誤配置数で一括して数えられる。

別の問題へ持ち帰る視点: 任意交換による分類修正は、誤配置flowと、一操作で高々1変わる順序potentialから最適回数を証明できることがある。

## 正当性

C[i][j]を現在値i・目標値jの位置数とする。値の順列pごとにF(p)=Σ_{a<b}C[p_a][p_b]を置くと、一回のswapでF(p)は高々1しか減らず下界になる。逆向きpairの相殺後に残るbalancedな誤配置cycleを解消することで、この下界の最大値を達成できる。 任意swapの最小回数を、定数個のpotentialの最大値としてO(N)で厳密に計算できる。

## 実装上の注意

- Cの添字は「現在値→目標値」の向きに統一し、順列内のa<bと組み合わせる。対角成分は既に正しいので和へ入れない。

## 復習の核

- Nの小さい全列でswap BFSの真値と比較し、2-cycleだけ、3-cycle、4-cycle、同値が多数ある場合を含めて式の向きを検証する。

## 計算量と制約

### 時間

O(N+4!·4²)、目標の頻度区分はO(N)で作れる。

### 空間

O(N)、または誤配置4×4と入力。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1\leq A_i \leq 4; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/editorial/6393) — source-abc302-editorial-6393-61b7ea0d859ff4fb59b59a0bf2e9f9fb2093d207e077d62e668cd3583843d22e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/tasks/abc302_g) — source-abc302-g-problem-a6e5157f05f8846c2c25f0821320fa4c725fd772d70553ef3ca56d068a43abf0
