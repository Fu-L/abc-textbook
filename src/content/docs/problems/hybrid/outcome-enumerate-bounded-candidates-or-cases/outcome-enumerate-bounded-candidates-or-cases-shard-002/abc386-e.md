---
title: "ABC386-E — Maximize XOR"
draft: true
authoringUnit: {"problemId":"abc386-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc386-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0","source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"XORではtotal XOR = selected XOR xor omitted XORなので、補集合の値からselected値を定数時間で得られる。 C(N,K)=C(N,N-K)により補集合側へ替えても候補数は変わらず、深さだけを小さくできる。 探索深さを小さい側に選べば列挙数はC(N,K)、一候補の処理もmin(K,N-K)で、保証された上限内に収まる。","sourceRevisionIds":["source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0","source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2,4)、K=2。","procedure":["allXor=7、一個除外して候補は7 xor1=6,7 xor2=5,7 xor4=3。"],"executionTarget":null,"expectedResult":"最大6。","verificationStatus":"not_applicable","learningUnitIds":["unit-bounded-enumeration"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"prerequisiteIds":[],"attainmentCondition":"K=Nなら組合せを列挙するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"r=0の唯一の空補集合を評価しallXor=7を返す。"},"answer":{"reasoningOrVerification":"r=0の唯一の空補集合を評価しallXor=7を返す。","procedure":["具体例の各状態・寄与を再計算する。","r=0の唯一の空補集合を評価しallXor=7を返す。"],"expectedResult":"r=0の唯一の空補集合を評価しallXor=7を返す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

制約はN自体でなく組合せ数C(N,K)≤10^6を保証しているため、最終候補集合は全列挙できる。ただし素朴DFSの途中node数はKがNに近いと中央binomialまで膨らむ。

選択K個のXORは、全要素XORと非選択N-K個のXORとのXORで復元できる。

採用する候補: min(K,N-K)側のsubsetを組合せ列挙し、必要なら全体XORで補集合へ戻す

探索深さを小さい側に選べば列挙数はC(N,K)、一候補の処理もmin(K,N-K)で、保証された上限内に収まる。

棄却する候補: 常に選択K個をinclude/exclude DFSで列挙する

KがNに近いと答え候補数は少なくても途中で巨大な浅いsubset群を通り、C(N,⌊N/2⌋)級の呼出しが発生し得る。

XORではtotal XOR = selected XOR xor omitted XORなので、補集合の値からselected値を定数時間で得られる。

C(N,K)=C(N,N-K)により補集合側へ替えても候補数は変わらず、深さだけを小さくできる。

allXorを計算する。r=min(K,N-K)個のindex組合せを列挙してxorを求め、K≤N-Kならそのxor、そうでなければallXor xor xorを候補として最大化する。

## 典型の発動条件

### 補集合の全探索

発動条件: 選ぶ個数が全体に近く、選ばない個数が小さいとき。

XORの可逆性を使って非選択集合だけを列挙する。

### 出力候補数保証の直接利用

発動条件: 入力sizeでなく組合せ総数そのものが制約されているとき。

C(N,K)個の候補を漏れなく列挙する。

## 問題固有の要素

組合せ数が小さくても通常のbinary DFS木は小さいとは限らず、列挙器が完成候補にほぼ比例して動くかまで評価する必要がある。

別の問題へ持ち帰る視点: 特殊制約を読む際は答え状態数だけでなく、選んだ列挙アルゴリズムの中間状態数も同じ上限で抑えられるか確認する。

## 正当性

XORではtotal XOR = selected XOR xor omitted XORなので、補集合の値からselected値を定数時間で得られる。 C(N,K)=C(N,N-K)により補集合側へ替えても候補数は変わらず、深さだけを小さくできる。 探索深さを小さい側に選べば列挙数はC(N,K)、一候補の処理もmin(K,N-K)で、保証された上限内に収まる。

## 実装上の注意

- 値は60 bitなので64 bit unsigned相当で持つ。K=Nではr=0の空組合せを一度処理し、組合せiteratorの終了条件を確認する。

## 復習の核

- (N,K)=(100,98)のような補集合有利例とK=N,1を試し、N≤20ではbitmask全探索の最大値と比較する。

## 計算量と制約

### 時間

O(C(N,r)r)、r=min(K,N−K)、leafごとにxorを計算する上界。逐次xorなら列挙木node数に比例。

### 空間

O(N+r)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq K\leq N\leq 2\times 10^5; 0\leq A_i<2^{60}; \dbinom{N}{K}\leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2,4)、K=2。

1. allXor=7、一個除外して候補は7 xor1=6,7 xor2=5,7 xor4=3。

期待される結果: 最大6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

K=Nなら組合せを列挙するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

r=0の唯一の空補集合を評価しallXor=7を返す。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/tasks/abc386_e) — source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/editorial/11697) — source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251
