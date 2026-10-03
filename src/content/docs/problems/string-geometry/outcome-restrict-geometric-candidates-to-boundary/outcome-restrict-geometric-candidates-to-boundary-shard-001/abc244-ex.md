---
title: "ABC244-EX — Linear Maximization"
draft: true
authoringUnit: {"problemId":"abc244-ex","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc244-ex.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-segment-tree-canonical-decomposition"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull","tag-segment-tree-canonical-decomposition"],"sourceRevisionIds":["source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102","source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"内部点の内積は凸包頂点の内積の凸結合なので頂点最大以下。B>0では上側、B<0では下側の支持点が全凸包の最大を与える。同じxの適切な端点を残すとΔx>0であり、上側の非増加傾き×正B、下側の非減少傾き×負BはいずれもA+B·傾きを非増加にする。よって隣接差の符号は正から非正へ一度だけ変わり、その境界の点が鎖最大になる。B=0はx端点、零vectorは0で正しい。時刻iのprefixを互いに素なcanonical区間へ分け、その各最大の最大を取ると利用可能点全体の最大になり、未来の点は含まれない。","sourceRevisionIds":["source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102","source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Ax+Byは方向vector(A,B)と点(x,y)の内積であり、最大は点集合の凸包上で達成される。内部点は凸包頂点の凸結合なので、その内積も頂点の内積の最大を超えない。ただし凸包全周を任意の開始位置から並べた列や、上下両鎖をそのまま最大値の単峰列として扱うことはできない。

i回目までの点は入力順prefix[1,i]である。全queryを先読みし、index segment treeの各nodeに、その区間内の静的凸包を保存すればよい。時刻iではprefixを覆うO(log Q)個のnodeの支持点を求めて最大を取る。全点走査はO(Q²)、動的凸包の平衡木は可能だが、このprefix帰着なら静的凸包と既習の区間分解で足りる。

### queryの向きで探索する鎖を選ぶ

各nodeで上側・下側の鎖をx昇順に保持する。同じxでは、上側用には最大y、下側用には最小yだけを残す。上側の辺の傾きは非増加、下側は非減少になるよう、不要点を外積のstack判定で消す。

B>0なら同じxでyが高いほど内積が大きいので上側だけを使う。B<0なら下側だけを使う。選んだ鎖の隣接点P_j,P_{j+1}に対し

```text
f(j+1)−f(j) = A Δx + B Δy
            = Δx (A + B·傾き_j),   Δx>0
```

となる。B>0の上側では傾きが非増加、B<0の下側では傾きが非減少なので、いずれも括弧の値は非増加になる。従って隣接差の符号は正から0、負へしか変わらず、この選んだ鎖の内積列は最大値に関して単峰である。差そのものの大きさが単調である必要はない。

鎖長をmとし、d_j=A(x_{j+1}−x_j)+B(y_{j+1}−y_j)を整数で評価する。j=0,…,m−2で最初のd_j≤0を二分探索し、そのjの点を答えにする。一つもなければ最後の点。d_j=0の平坦部では最初の最大点を返してよい。B=0,A>0なら最大x、A<0なら最小xの点を使い、A=B=0なら0。一点の鎖も直接返す。

例えば下側鎖(0,100),(1,−100),(2,−99),(3,−97),(4,0)を方向(0,1)で見ると内積列は谷型100,−100,−99,−97,0である。この向きでは上側を選び、(0,100),(4,0)から最大100を得る。符号を見ずに下側へ最大化の三分探索を行う根拠はない。

全Q点を葉へ置き、各nodeの点集合をsortして上下鎖を作る。query iでは[1,i]のcanonical nodeごとに上述の方向別探索を行い、全nodeの最大を出力する。未来の点は前計算に使えても、時刻iの問い合わせ集合へは入れない。

## 典型の発動条件

### convex hull trick for dot-product query

発動条件: 固定点集合に対し、様々な方向 vector との最大内積を問うとき。

内部点を捨て、Bの符号で上側または下側のx昇順鎖を選ぶ。その鎖の隣接内積差の符号変化を証明して支持点を二分探索する。

### segment tree of static structures

発動条件: 時刻 prefix や index range ごとに、集合上の重い query を行いたいとき。

各 segment node に静的 data structure を前計算し、range を少数 node に分解する。

## 問題固有の要素

逐次追加 query を、点の入力 index に対する prefix range query と読み替えると、dynamic geometry が static hull の集合へ変わる。

別の問題へ持ち帰る視点: 追加-only の online 風問題では、全入力が既知なら time/index 軸の区間 query 化を試す。

## 正当性

内部点の内積は凸包頂点の内積の凸結合なので頂点最大以下。B>0では上側、B<0では下側の支持点が全凸包の最大を与える。同じxの適切な端点を残すとΔx>0であり、上側の非増加傾き×正B、下側の非減少傾き×負BはいずれもA+B·傾きを非増加にする。よって隣接差の符号は正から非正へ一度だけ変わり、その境界の点が鎖最大になる。B=0はx端点、零vectorは0で正しい。時刻iのprefixを互いに素なcanonical区間へ分け、その各最大の最大を取ると利用可能点全体の最大になり、未来の点は含まれない。

## 実装上の注意

- 同xの点は上側で最大y、下側で最小yを残し、両鎖をx昇順へそろえる。全点共線・一つのxだけの集合・一点も扱う。
- 外積は__int128で計算する。内積とd_jも符号付き64bitに収まり、浮動小数の傾きや除算を使わず隣接差を直接比較できる。
- B=0を端点処理し、零vectorは0。凸包全周をそのまま普通の単峰列として探索しない。

## 復習の核

- 支持点を探す前に方向の符号で探索対象の鎖を選び、隣接差の符号が一度だけ変わる理由を示す。
- prefixの時間制約は、静的集合のcanonical区間分解で守れる。

## 計算量と制約

### 時間

各nodeを個別sortする実装で前処理O(Q log² Q)、全問い合わせO(Q log² Q)。

### 空間

O(Q log Q)。各点は木の各階層で一度格納される。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1≤Q≤2 \times 10^5; |X_i|, |Y_i|, |A_i|, |B_i| ≤10^9; If i ≠ j, then (X_i, Y_i) ≠ (X_j, Y_j).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/editorial/3602) — source-abc244-editorial-3602-eaa909af4b84f1fe36bda08c9bf6a281def38864da15ce544a494d48eab60102
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/tasks/abc244_h) — source-abc244-ex-problem-63892ec69190002f23b56f853073e779bd2a3b0b4035ce3c1932df8305512c64
