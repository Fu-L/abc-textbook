---
title: "ABC306-G — Return to 1"
draft: true
authoringUnit: {"problemId":"abc306-g","docPath":"src/content/docs/problems/graph-search/outcome-compute-directed-walk-period/outcome-compute-directed-walk-period-shard-001/abc306-g.md","learningOutcomeIds":["outcome-compute-directed-walk-period"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-structure","unit-scc-condensation"],"excludedTopics":["有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-directed-walk-periodicity","tag-gcd-structure","tag-scc-condensation"],"sourceRevisionIds":["source-abc306-g-problem-c3624248a58217293cd4adf62a012b97c82400af1e9990662c5bd977d01e0bcd","source-abc306-editorial-6602-e768422ef0d55286e016962cb115a4ef11b1585228994a242d209b188e497483"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"1から戻れる walk は1のSCC内だけ。DFS potential d に対する全辺の差 d_u+1−d_v のgcd Gは閉walk長のperiodに一致する。SCCの十分大きい閉walk長はこのperiodの倍数すべてを含むので巨大指定長がGの倍数かで判定できる。指定長の素因数は2,5だけのため G から2,5を全て取り除いた残りが1なら成立。正閉walkがないG=0は除外する。","sourceRevisionIds":["source-abc306-g-problem-c3624248a58217293cd4adf62a012b97c82400af1e9990662c5bd977d01e0bcd","source-abc306-editorial-6602-e768422ef0d55286e016962cb115a4ef11b1585228994a242d209b188e497483"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有向walkの周期・cycle差分gcd](src/content/docs/learn/graph/directed-walk-periodicity.md)

- 往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。

先に読む単元:

- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md) — 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [SCC・縮約DAG・トポロジカル順序](src/content/docs/learn/graph/scc-condensation.md) — DAGのtopological processingで得た考え方と実装を再利用し、SCC・縮約DAG・トポロジカル順序の発動条件・正当化・境界を重複なく学ぶ。

## 考察

walkがstart/endともvertex 1なら途中で使えるのは1から到達でき、かつ1へ戻れるverticesだけなので、1を含むSCC以外を削除できる。 このSCC内のclosed-walk lengthsのgcd Gが巨大step数を割ることが必要十分であり、10^(10^100)のprime factorsは2と5だけである。 全edgesでd_v≡d_u+1 mod aなら任意closed walk長はaの倍数で、違反edgeがあればtree pathsと組み合わせてa非倍数のclosed walkを作れる。 十分大きいlengthではcycle lengthsの非負結合がgcdの倍数をすべて表すため、exact huge lengthの存在はperiodのdivisibilityだけで決まる。

棄却する候補: 巨大回数までreachable length setsをDPまたはmatrix exponentiationで追う。

指数自体を保持できず、N×N matrixも総N=20万に不適切である。

採用する候補: 1-rooted spanning treeのdepth dを作り、全SCC edges u→vについて|d_u+1−d_v|のgcdを取る。

このgcdは全closed-walk lengthsのperiodと一致し、graph一走査で計算できる。

全edgesでd_v≡d_u+1 mod aなら任意closed walk長はaの倍数で、違反edgeがあればtree pathsと組み合わせてa非倍数のclosed walkを作れる。

十分大きいlengthではcycle lengthsの非負結合がgcdの倍数をすべて表すため、exact huge lengthの存在はperiodのdivisibilityだけで決まる。

strongly connected directed graphのperiodをDFS potentialsに対するedge discrepanciesのgcdとして計算し、target lengthのprime supportと照合する。

## 典型の発動条件

### 有向graphの周期gcd

発動条件: 同じvertexへ戻るwalkの可能lengthを巨大なexact値について判定したいとき。

root distance potentialと各edgeのdepth差+1のgcdからSCC periodを得る。

### 往復可能領域の抽出

発動条件: startから出て同じstartへ戻るwalkだけが対象のとき。

forward reachableとreverse reachableのintersection、すなわちstart SCCだけを残す。

## 問題固有の要素

G>0からfactor 2と5を繰り返し除き、残りが1ならGはtargetのdivisorになる。

別の問題へ持ち帰る視点: target整数が巨大でもprime factorizationが既知なら、divisibilityはcandidate gcdの余分なprime factorsだけ調べればよい。

## 正当性

1から戻れる walk は1のSCC内だけ。DFS potential d に対する全辺の差 d_u+1−d_v のgcd Gは閉walk長のperiodに一致する。SCCの十分大きい閉walk長はこのperiodの倍数すべてを含むので巨大指定長がGの倍数かで判定できる。指定長の素因数は2,5だけのため G から2,5を全て取り除いた残りが1なら成立。正閉walkがないG=0は除外する。

## 実装上の注意

- 1のSCC内にpositive closed walkがなくG=0ならNoとし、gcd更新ではabsolute valueを取る。
- Tが多いため各caseのadjacency/reverse adjacencyとvisited arraysをcase sizeに応じて初期化する。

## 復習の核

- exact-length closed walk問題は、個々のcyclesではなくSCCのperiod gcdへ圧縮する。
- cycle length gcdは全cycles列挙を避け、spanning-tree potentialに対するnon-tree edge discrepancyから得る。

## 計算量と制約

### 時間

各 case の N 頂点、M 有向辺に O(N+M)。SCC抽出と discrepancy gcd（整数幅固定）を一巡ずつ。

### 空間

正逆隣接とSCC・potentialで O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1\leq T \leq 2\times 10^5; 2\leq N \leq 2\times 10^5; 1\leq M \leq 2\times 10^5; The sum of N over all test cases is at most 2 \times 10^5.; The sum of M over all test cases is at most 2 \times 10^5.; 1 \leq U_i, V_i \leq N; U_i \neq V_i; If i\neq j, then (U_i,V_i) \neq (U_j,V_j).

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/tasks/abc306_g) — source-abc306-g-problem-c3624248a58217293cd4adf62a012b97c82400af1e9990662c5bd977d01e0bcd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/editorial/6602) — source-abc306-editorial-6602-e768422ef0d55286e016962cb115a4ef11b1585228994a242d209b188e497483
