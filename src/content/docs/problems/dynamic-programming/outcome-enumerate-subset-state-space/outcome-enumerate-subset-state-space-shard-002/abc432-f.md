---
title: "ABC432-F — Candy Redistribution"
draft: true
authoringUnit: {"problemId":"abc432-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc432-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-dp-state-design","unit-greedy-exchange"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-constructive-witness","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc432-editorial-14577-feebba7751d96a1c9a1985cb9b39f20a2de9e513032215d03d059512feb30c75","source-abc432-f-problem-7f6bf4a691d4fea9c0380d1b3ed3155d978e5981eb5b26b3b020e1585d2ae4c4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"使った移送pair graphの各成分は和が平均X×人数でなければならず、s成分には最低N−s操作が必要。逆に各平衡成分を初期個数降順に並べ、prefix余剰を隣へ渡せば各人をXにできる。降順prefixの平均は全体平均以上なので移送量は非負。最大平衡分割を求めるため、順列prefixの和が0となる回数を最大化するsubset DPを使う。平衡分割は各組を連続に並べれば同数の0prefixを作れ、逆も0prefix間を切れば分割になるので等価。最大分割の組内に0のproper prefixがあればさらに分割できるため、組内移送は真に正で、N−s回を達成する。","sourceRevisionIds":["source-abc432-editorial-14577-feebba7751d96a1c9a1985cb9b39f20a2de9e513032215d03d059512feb30c75","source-abc432-f-problem-7f6bf4a691d4fea9c0380d1b3ed3155d978e5981eb5b26b3b020e1585d2ae4c4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

移送成分ごとの和保存から、平均Xのsubsetへ分ける成分数最大化となる。部分集合の平均との差和を持ち、一要素ずつ順序へ追加する。dp[mask]=max_{i∈mask}dp[mask\{i}]+[sumDeviation(mask)=0] とすれば平衡prefix数を最大化できる。0prefixの境界で復元順を切り、その各組を個数降順に並べて余剰を流す。

整数平均X=ΣA/Nが存在しなければ、全員の値を同じ整数にする解はない。存在するときδ_i=A_i−X、sum[0]=0、dp[0]=0とし、全非空maskへ

```text
sum[mask] = sum[mask without i] + δ_i  （任意の一つのi∈mask）
dp[mask] = max_{i∈mask} dp[mask without i] + [sum[mask]=0]
```

を計算する。maskを数値昇順に処理すれば依存先は全て先に済む。maxを実現したiをparent[mask]として記録し、全maskからiを取り除いて逆順にすれば追加順序を復元できる。復元順のδ累積が0になるたび区間を切り、得た各組をA降順に並べる。隣への移送量はその組の処理済みprefixのΣ(A_i−X)で、各操作後に渡した側をXへ固定する。dp[全mask]が最大成分数s、出力操作数はN−s。

good subsetをすべて列挙して残maskへ足す一般の分割DPはO(3^N)になる。本問は順序の0prefixへ変換して一要素ずつ足すのでO(N2^N)であり、この区別がN=20へ間に合う理由になる。

## 典型の発動条件

### 部分集合分割 DP

発動条件: 小さい N の集合を条件を満たす部分集合へ分割し、部品数を最大化したいとき。

平衡な各組を連続に並べた順序と、累積差が0になる位置で切る逆対応を使う。dp[mask]から一要素ずつ追加して0prefix数を最大化し、O(3^N)の全submask分割をO(N2^N)へ替える。

### 連結成分による下界

発動条件: 操作が二頂点間だけで保存量を移し、使われた組がグラフを作るとき。

各保存量成分に |V|-1 辺が必要として操作数 N-s の下界を得る。

### 貪欲な構成復元

発動条件: 平均を満たす集合内で、非負の移動だけを用いて全値を目標へ揃えるとき。

初期値降順に隣へ余剰を送り、処理済み頂点を X に固定する。

## 問題固有の要素

最小操作数は直接操作列を探索せず、保存量を独立に均せる連結成分を最大何個作れるかへ双対化できる。

別の問題へ持ち帰る視点: 二点移送問題では操作グラフの連結成分ごとの不変量が強い下界と構成方針を同時に与える。

## 正当性

使った移送pair graphの各成分は和が平均X×人数でなければならず、s成分には最低N−s操作が必要。逆に各平衡成分を初期個数降順に並べ、prefix余剰を隣へ渡せば各人をXにできる。降順prefixの平均は全体平均以上なので移送量は非負。最大平衡分割を求めるため、順列prefixの和が0となる回数を最大化するsubset DPを使う。平衡分割は各組を連続に並べれば同数の0prefixを作れ、逆も0prefix間を切れば分割になるので等価。最大分割の組内に0のproper prefixがあればさらに分割できるため、組内移送は真に正で、N−s回を達成する。

## 実装上の注意

- mask 和は広い整数型で計算し、dp の遷移で部分集合の重複・空集合を避ける。構成中の a_x は操作ごとに更新し z>0 を確かめる。

## 復習の核

- 各 DP 成分が正確に平均 X を持つこと、復元した操作数が Σ(|V|-1)=N-s で下界に一致することを確認する。

## 計算量と制約

### 時間

N 人。要素を一つずつ足す subset DP で O(N2^N)、復元後sort O(Nlog N)、操作出力 O(N)。

### 空間

subset和、dp、復元元 O(2^N)、出力 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 20; 1 \leq A_i \leq 10^8; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/editorial/14577) — source-abc432-editorial-14577-feebba7751d96a1c9a1985cb9b39f20a2de9e513032215d03d059512feb30c75
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/tasks/abc432_f) — source-abc432-f-problem-7f6bf4a691d4fea9c0380d1b3ed3155d978e5981eb5b26b3b020e1585d2ae4c4
