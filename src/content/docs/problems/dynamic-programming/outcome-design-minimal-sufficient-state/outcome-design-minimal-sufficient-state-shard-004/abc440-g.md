---
title: "ABC440-G — Haunted House"
draft: true
authoringUnit: {"problemId":"abc440-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc440-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-dsu-components"],"sourceRevisionIds":["source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92","source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"上るだけの経路は最初の上り先で分類でき、Pの遷移になる。ハシゴを最初に使う場合は、その下り先vと次の上り先wでRを分類する。階は以後増えるので既訪問成分と重なる可能性は同じ階のuだけであり、w=uの場合だけc_uを引く。最初に上る経路では、ハシゴ使用がさらに上ならQ_uを引き継ぎ、すぐに下るならR(u,z)を使う。後者で重なる可能性がある出発成分はz=vだけである。この分類は全経路を尽くし、各コインを一度だけ足す。最初に下るケースも最後の答えで合成している。","sourceRevisionIds":["source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92","source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

各階の移動可能な連結成分を一頂点へ縮約し、コイン総和c_vと、隣接する階の成分間の辺を求める。同一階内では自由に往復できるので、訪れた成分のコインを全て回収できる。下へ降りるハシゴを高々一度使った後は、上へ進むだけになる。

P_vをvから上るだけで得る最大値、Q_vをvから出発して最初は上り、出発階より上で一度だけ下りてもよい最大値とする。下りを使わない場合もQに含める。さらに上階uから下階vへ最初に下り、その後上るだけの値をR(u,v)とする。Rではuは既に訪問済みなので、再びuへ上ってもc_uを二重加算しない。

上階の全P,Qが確定した状態で、階を下へ処理する。U(v)をvの一つ上の隣接成分集合とすると、

P_v=c_v+max(0,max_{u∈U(v)}P_u)。

各辺u-vについて

R(u,v)=max(c_v+P_u, c_u+c_v+max_{w∈U(v),w≠u}P_w)。

前者はvから同じuへ戻る場合、後者は異なるwへ上る場合である。上へ進まずvで止まるc_u+c_vも前者以下なので覆われる。

Q_vはまずc_v+max(0,max_{u∈U(v)}Q_u)で初期化する。さらにv→u→zと上ってから下る全候補を考え、R(u,z)+(z=vなら0、z≠vならc_v)で更新する。z=vではRが既にc_vを含み、z≠vでは出発点vは以後訪れないので加える。

最終的なvからの答えはmax(Q_v,max_{zが一つ下の隣接成分}R(v,z))。後者を落とすと、最初の移動でハシゴを使う経路が欠ける。各最大値で除外する成分は高々一つなので、接続先ID付きの上位二件を保持すれば全辺を定数回走査できる。

## 典型の発動条件

### 連結成分縮約

発動条件: 同一領域内は自由に往復して報酬をすべて回収でき、領域外との接続関係だけが以後の選択を左右する場合。

各階の四近傍連結成分を一頂点にまとめ、数字の総和を頂点重み、上下階で接する関係を辺として扱う。

### 一回だけ逆向き辺を使う層状グラフ DP

発動条件: 本来は単調に層を進む DAG に、一度だけ利用できる逆向き遷移を自由な場所へ追加できる場合。

梯子の未使用・使用済みと階境界の出入口を状態にし、一段下降を挟む経路を上下の単調経路から合成する。

### 除外最大値の上位二件保持

発動条件: 候補集合から指定された ID と同じ候補だけを除外して最大値を求める処理が、多数の遷移で繰り返される場合。

dv の値と接続先成分 ID の上位二件を保持し、一位の ID が除外対象なら二位、異なるなら一位を使う。

## 問題固有の要素

梯子一本が作る非単調性は任意の巡回ではなく、上階成分を出て一段下り、同じ階へ戻る迂回に限られる。

別の問題へ持ち帰る視点: 単調な層状グラフへ逆向き辺を一度だけ加える問題では、迂回の二端点が同一かどうかを状態に残すと二重計上を制御できる。

## 正当性

上るだけの経路は最初の上り先で分類でき、Pの遷移になる。ハシゴを最初に使う場合は、その下り先vと次の上り先wでRを分類する。階は以後増えるので既訪問成分と重なる可能性は同じ階のuだけであり、w=uの場合だけc_uを引く。最初に上る経路では、ハシゴ使用がさらに上ならQ_uを引き継ぎ、すぐに下るならR(u,z)を使う。後者で重なる可能性がある出発成分はz=vだけである。この分類は全経路を尽くし、各コインを一度だけ足す。最初に下るケースも最後の答えで合成している。

## 実装上の注意

- 階間の同じ成分対の辺は重複除去する。上位二件には値だけでなく相手の成分IDを持たせる。
- P_v、R(上階u,v)、Q_vの順に処理し、その後にvより上の開始点用のRを保存する。
- Q_vだけを答えにせず、最初に下るR(v,z)も比較する。コインの二重加算は階ではなく成分IDの一致で判定する。

## 復習の核

- 三つの階を描き、開始から上昇、梯子で下降、再上昇する経路を dp_0、dp_1、dv_0、dv_1 の各定義へ対応させ、どの時点で成分重みを数えたかを確認する。
- 下降元と再上昇先が同じ場合と異なる場合、候補が一件しかない場合、上階へ進めない場合を別々に試し、上位二件による除外と二重計上防止を検査する。

## 計算量と制約

### 時間

元セル V=FHW、縮約頂点 C≤V、階間distinct辺 E≤(F−1)HW。BFS縮約O(V)、辺sort重複除去O(Vlog V)、ID付き上位二件を走査保持すればDP O(C+E)、Q回答O(Q)。

### 空間

マス→成分、graph、境界dpで O(V+C+E+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: F,H,W are integers.; 1 \leq F \leq 10; 1 \leq H,W \leq 500; S_{k,i,j} is either a digit (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) or #. (1 \leq k \leq F, 1 \leq i \leq H, 1 \leq j \leq W); Q is an integer.; 1 \leq Q \leq 10^5; G_i, A_i, B_i are integers. (1 \leq i \leq Q); 1 \leq G_i \leq F (1 \leq i \leq Q); 1 \leq A_i \leq H (1 \leq i \leq Q); 1 \leq B_i \leq W (1 \leq i \leq Q); S_{G_i, A_i, B_i} is not #. (1 \leq i \leq Q)

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/editorial/15033) — source-abc440-editorial-15033-e736b20251169d62c9695d54e2699f8cab16ab21ed6a0a06466c5f30ddecfb92
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/tasks/abc440_g) — source-abc440-g-problem-3878da44dd24e2554a0f3a6202d860f40957ffa364bd7f2c634c695900fde4a2
