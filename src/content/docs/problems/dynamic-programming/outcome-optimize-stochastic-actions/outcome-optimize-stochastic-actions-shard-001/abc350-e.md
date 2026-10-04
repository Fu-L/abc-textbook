---
title: "ABC350-E — Toward 0"
draft: true
authoringUnit: {"problemId":"abc350-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc350-e.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc350-e-problem-2172166be04dc738ac2859fd537154e5d5cf2c252050988440b91d9db3bdbc19","source-abc350-editorial-9812-5fa52fa0c05cf3a8348ee6ead26ae50e8fca6caf6801b6c1c6cd2b3278073ba4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"決定操作はX+f(floor(n/A))。dice操作の1は同状態で自己loopとなり、移項すると6Y/5と2..6の五依存平均になる。いずれも小nへ進むためmemo Bellmanの最小が最適。floor除算の合成は積のfloor除算なので到達状態は除数の指数組へ限定される。","sourceRevisionIds":["source-abc350-e-problem-2172166be04dc738ac2859fd537154e5d5cf2c252050988440b91d9db3bdbc19","source-abc350-editorial-9812-5fa52fa0c05cf3a8348ee6ead26ae50e8fca6caf6801b6c1c6cd2b3278073ba4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

state nからどちらのoperationを選んでも、dieの1以外またはA除算ではstrictly小さいfloor quotientへ移る。dieで1が出るself-loopだけを期待値方程式の左辺へ移せば、memoized recursion可能な形になる。die操作の期待値EはE=Y+(E+Σ_{b=2}^6f(floor(n/b)))/6を満たすので、E=6Y/5+Σ_{b=2}^6f(floor(n/b))/5となる。従ってf(n)=min(X+f(floor(n/A)),E)である。

採用する候補: 期待値Bellman方程式からself-loopを消去し、floor quotientをmemo化する

各nで二操作の期待costを比較でき、到達する相異なるquotient state数もpolylogarithmicに抑えられる。

棄却する候補: 確率processを試行回数で有限stepまでsimulationする

終了時刻に固定上限がなく、打切り誤差を伴う一方で厳密な期待値方程式が使える。

従ってf(n)=min(X+f(floor(n/A)),E)である。

f(0)=0とし、n>0ではmemoを確認する。deterministic候補X+f(n/A)と、random候補6Y/5+(f(n/2)+…+f(n/6))/5を再帰的に求め小さい方をmemoする。doubleでf(N)を出力する。

## 典型の発動条件

### 期待値方程式のself-loop消去

発動条件: random遷移に現在stateへ戻るoutcomeが含まれ、そのまま再帰できない。

現在期待値の係数を左辺へ移項し、strictly小さいstateだけの式へ解く。

### floor quotient memoization

発動条件: nが最大10^18だが遷移は少数の整数除算だけである。

同じfloor(n/m) stateをhash mapで共有し、再帰木の重複を除く。

## 問題固有の要素

dieの出目1は何も進めずcost Yだけ再試行させるため、実質的には2…6が出るまでの期待支払6Y/5と条件付き一様5択として解釈できる。

別の問題へ持ち帰る視点: 無変化outcomeを持つ試行は成功outcomeまでの幾何待ちcostへ吸収できる。

## 正当性

決定操作はX+f(floor(n/A))。dice操作の1は同状態で自己loopとなり、移項すると6Y/5と2..6の五依存平均になる。いずれも小nへ進むためmemo Bellmanの最小が最適。floor除算の合成は積のfloor除算なので到達状態は除数の指数組へ限定される。

## 実装上の注意

- integer divisionはfloorで、f(0)=0を先に返す。random候補の6Y/5を整数除算せずdoubleで計算し、memo keyは64bit整数にする。

## 復習の核

- A=2…6各場合、Xが極端に安い/高い、N=1を小stateの方程式直接解と比較する。

## 計算量と制約

### 時間

到達quotient状態数S、Nの指数範囲h=O(log N)。memo一状態定数遷移で O(S)、S=O(h⁴)の安全な上界（A,2,3,5の除数指数分類）。

### 空間

memo O(S)、再帰深さ O(log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{18}; 2 \leq A \leq 6; 1 \leq X, Y \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/tasks/abc350_e) — source-abc350-e-problem-2172166be04dc738ac2859fd537154e5d5cf2c252050988440b91d9db3bdbc19
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/editorial/9812) — source-abc350-editorial-9812-5fa52fa0c05cf3a8348ee6ead26ae50e8fca6caf6801b6c1c6cd2b3278073ba4
