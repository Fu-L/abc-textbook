---
title: "ABC328-E — Modulo MST"
draft: true
authoringUnit: {"problemId":"abc328-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc328-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-dsu-components"],"sourceRevisionIds":["source-abc328-e-problem-63f9831a5e438065409cd34e5cc3e6ef1745e12de308b5a8eea5b1bd357701d2","source-abc328-editorial-7645-86fd80b016d3db116d4260c75791a66123c638e800609b79259ea56b5963dce5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"N-1本を選んだundirected graphではacyclicなら自動的にconnected、connectedなら自動的にacyclicなので、DSUのcycle検出とcomponent確認のどちらでもtree性を判定できる。 costはedge追加ごとに(sum+w)%Kと更新してよく、tree完成時のresidueだけを比較する。 小さいNが保証する約118万候補を直接検査し、modulo目的関数の非単調性を回避できる。","sourceRevisionIds":["source-abc328-e-problem-63f9831a5e438065409cd34e5cc3e6ef1745e12de308b5a8eea5b1bd357701d2","source-abc328-editorial-7645-86fd80b016d3db116d4260c75791a66123c638e800609b79259ea56b5963dce5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

spanning treeはちょうどN-1 edgeを持つので、まずM本からN-1本を選ぶ全組合せだけを候補にすればよい。

N≤8のsimple graphではM≤28で、最大組合せ数C(28,7)=1184040に収まる。

選んだN-1 edgeがcycleを持たず全頂点を結べばspanning treeであり、DSUで判定できる。

採用する候補: N-1 edgeの全組合せを列挙し、DSUでtree判定してweight sum mod Kの最小を取る。

棄却する候補: 通常のKruskal法でweight sum最小spanning treeを作り、その和をmod Kにする。

mod前の和が小さいtreeがmod後も小さいとは限らず、cut propertyが目的関数に成立しない。

棄却する候補: 全2^M edge subsetを列挙する。

tree候補はN-1 edgeに限られるため、不要なsizeのsubsetまで調べると最大2^28へ増える。

edge indexからN-1個を選ぶcombination DFSを行う。leafでは新しいDSUを作って各chosen edgeをunionし、既に同rootならtreeでないとして捨てる。同時にsum=(sum+w_i)%Kを更新し、全edgeがcycleなしならanswer=min(answer,sum)とする。graph connected保証により少なくとも1候補は成立する。

## 典型の発動条件

### 固定size combination列挙

発動条件: 全体M≤30程度から解が必ずr個選択で構成されるとき。

r個だけを選ぶDFSで2^Mより候補を削る。

### DSUによるtree判定

発動条件: 選んだundirected edge集合がacyclicか高速に調べるとき。

同component間edgeをcycleとしてrejectする。

### 非単調mod目的の全候補評価

発動条件: 加算値をmodした最終値を最小化し、通常のgreedy順序が使えないとき。

小さい構造制約を利用して完成候補のresidueを比較する。

## 問題固有の要素

頂点数8ではCayleyの完全graph tree数も26万程度、N-1 edge subsetも約118万なので、modulo MSTを無理にgreedy化せず全tree候補を調べられる。

別の問題へ持ち帰る視点: 目的関数が標準最適化則を壊す場合、構造sizeから完成解の列挙上限を先に正確に見積もる。

## 正当性

N-1本を選んだundirected graphではacyclicなら自動的にconnected、connectedなら自動的にacyclicなので、DSUのcycle検出とcomponent確認のどちらでもtree性を判定できる。 costはedge追加ごとに(sum+w)%Kと更新してよく、tree完成時のresidueだけを比較する。 小さいNが保証する約118万候補を直接検査し、modulo目的関数の非単調性を回避できる。

## 実装上の注意

- combination DFSで残りedge数が必要選択数未満なら枝刈りし、chosen数がN-1の時点で評価する。
- Kとweight sumは最大10^15級なので64bit整数を使い、modを逐次取る。

## 復習の核

- 通常weight和が小さいtreeとmod後が小さいtreeが異なる3頂点例を作り、Kruskalを棄却する理由とN-1 edge判定を確認する。

## 計算量と制約

### 時間

O(C(M,N−1)·Nα(N))、各候補でDSU tree性を検査。

### 空間

O(N+M)、選択edgeとDSU。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq8; N-1\leq M\leq\dfrac{N(N-1)}2; 1\leq K\leq10^{15}; 1\leq u_i\lt v_i\leq N\ (1\leq i\leq M); 0\leq w_i\lt K\ (1\leq i\leq M); The given graph is simple and connected.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/tasks/abc328_e) — source-abc328-e-problem-63f9831a5e438065409cd34e5cc3e6ef1745e12de308b5a8eea5b1bd357701d2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/editorial/7645) — source-abc328-editorial-7645-86fd80b016d3db116d4260c75791a66123c638e800609b79259ea56b5963dce5
