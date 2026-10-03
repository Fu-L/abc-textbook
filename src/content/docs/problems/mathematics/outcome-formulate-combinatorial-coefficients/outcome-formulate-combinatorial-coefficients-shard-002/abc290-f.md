---
title: "ABC290-F — Maximum Diameter"
draft: true
authoringUnit: {"problemId":"abc290-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc290-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a","source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"正次数で総和2N−2の列は、次数1の頂点を除いて次数2以上の頂点を1減らす帰納構成により木として実現できる。\n\n次数2以上の頂点数をk、葉の数をL=N−kとする。直径の内部頂点は全て次数2以上なので、直径は高々k+1辺。k≥2なら全非葉を一本のパスへ並べる。内部の非葉は次数2、両端は次数1を使い、残余次数は全て非負で両端には少なくとも1ずつ残る。非葉の次数和は2N−2−L、パスで使った和は2(k−1)だから、残余の総和は2N−2−L−2(k−1)=Lに一致する。従って各残余をちょうどL枚の葉で埋められ、両端にも葉が付くので直径k+1を達成する。k=1は星で直径2、k=0はN=2の一本の辺で直径1となり、同じ式で扱える。\n\n正次数の総和2N−2を満たす列の総数は、d_i−1の非負整数和N−2を数えてC(2N−3,N−1)。固定頂点の次数が2以上となる列は、その頂点からもう1を引いてC(2N−4,N−1)である。各次数列の値1+kを総和すると、対称性からC(2N−3,N−1)+N·C(2N−4,N−1)を得る。N=2では後半の列は存在しないため0とし、答え1を直接返す。\n\n全テストの最大NをNmaxとして階乗・逆階乗は2Nmax−3まで必要である。Nmaxまででは二項係数の上側添字を参照できない。法998244353に対し2Nmax−3≤1999997なので全階乗が可逆で、前計算O(Nmax)、各テストO(1)で評価できる。","sourceRevisionIds":["source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a","source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

次数列が木として実現可能なのは正整数の総和が2N-2のときで、最大直径は次数2以上の頂点数+1になる。

採用する候補: 次数和条件とstars and barsによる総和計数

直径値を1と各座標が2以上である指示関数へ分解し、正整数列の個数を二つの組合せ数で数えられる。

棄却する候補: 全次数列と木を構成して直径を求める

次数列だけでも指数的で、実際の木の列挙は不要である。

次数2以上の頂点数をk、葉の数をL=N−kとする。直径の内部頂点は全て次数2以上なので、直径は高々k+1辺。k≥2なら全非葉を一本のパスへ並べる。内部の非葉は次数2、両端は次数1を使い、残余次数は全て非負で両端には少なくとも1ずつ残る。非葉の次数和は2N−2−L、パスで使った和は2(k−1)だから、残余の総和は2N−2−L−2(k−1)=Lに一致する。従って各残余をちょうどL枚の葉で埋められ、両端にも葉が付くので直径k+1を達成する。k=1は星で直径2、k=0はN=2の一本の辺で直径1となり、同じ式で扱える。

正次数の総和2N−2を満たす列の総数は、d_i−1の非負整数和N−2を数えてC(2N−3,N−1)。固定頂点の次数が2以上となる列は、その頂点からもう1を引いてC(2N−4,N−1)である。各次数列の値1+kを総和すると、対称性からC(2N−3,N−1)+N·C(2N−4,N−1)を得る。N=2では後半の列は存在しないため0とし、答え1を直接返す。

全テストの最大NをNmaxとして階乗・逆階乗は2Nmax−3まで必要である。Nmaxまででは二項係数の上側添字を参照できない。法998244353に対し2Nmax−3≤1999997なので全階乗が可逆で、前計算O(Nmax)、各テストO(1)で評価できる。

## 典型の発動条件

### 次数和公式

発動条件: 木の次数列を列挙・判定したい。

ΣX_i=2N-2を必要十分条件として使う。

### stars and bars

発動条件: 固定和の正・非負整数列数が必要になる。

|S|とX_1≥2の列数を二項係数で数える。

## 問題固有の要素

直径最大値が次数列の細部でなく「2以上の項数」だけで決まり、対称性から一座標の条件数をN倍できる。

別の問題へ持ち帰る視点: 構成で上界達成を示した後、評価関数を指示関数和へ分解して数える。

## 正当性

正次数で総和2N−2の列は、次数1の頂点を除いて次数2以上の頂点を1減らす帰納構成により木として実現できる。

次数2以上の頂点数をk、葉の数をL=N−kとする。直径の内部頂点は全て次数2以上なので、直径は高々k+1辺。k≥2なら全非葉を一本のパスへ並べる。内部の非葉は次数2、両端は次数1を使い、残余次数は全て非負で両端には少なくとも1ずつ残る。非葉の次数和は2N−2−L、パスで使った和は2(k−1)だから、残余の総和は2N−2−L−2(k−1)=Lに一致する。従って各残余をちょうどL枚の葉で埋められ、両端にも葉が付くので直径k+1を達成する。k=1は星で直径2、k=0はN=2の一本の辺で直径1となり、同じ式で扱える。

正次数の総和2N−2を満たす列の総数は、d_i−1の非負整数和N−2を数えてC(2N−3,N−1)。固定頂点の次数が2以上となる列は、その頂点からもう1を引いてC(2N−4,N−1)である。各次数列の値1+kを総和すると、対称性からC(2N−3,N−1)+N·C(2N−4,N−1)を得る。N=2では後半の列は存在しないため0とし、答え1を直接返す。

全テストの最大NをNmaxとして階乗・逆階乗は2Nmax−3まで必要である。Nmaxまででは二項係数の上側添字を参照できない。法998244353に対し2Nmax−3≤1999997なので全階乗が可逆で、前計算O(Nmax)、各テストO(1)で評価できる。

## 実装上の注意

- 階乗・逆階乗の上限は2Nmax−3まで確保する。
- N=2は1を返し、存在しない非葉条件の組合せ数に負の引数を渡さない。

## 復習の核

- 小さいNの正整数列列挙と比較し、N=2,3と全頂点が葉になれない次数和境界を確認する。

## 計算量と制約

### 時間

O(Nmax+T)。2Nmax−3までの階乗・逆階乗を共有し、各テストを定数時間で評価する。

### 空間

O(Nmax)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T \leq 2\times 10^5; 2 \leq N \leq 10^6; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5768) — source-abc290-editorial-5768-a550d60c46d7d56a4823b0bfa1b2401c08e4812a4d37968396b04c2cf823576a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_f) — source-abc290-f-problem-6837ef8a48b81e6685f37ead90c2c396017c4f2bd0456ddc04e9b6b48c8cfd62
