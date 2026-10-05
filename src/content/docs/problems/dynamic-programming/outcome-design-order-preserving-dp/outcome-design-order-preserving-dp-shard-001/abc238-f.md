---
title: "ABC238-F — Two Exams"
draft: true
authoringUnit: {"problemId":"abc238-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc238-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc238-editorial-3354-883010a86d52c338be2cfc1329fe84067574c5b9934ac040ec239599a6f3dd21","source-abc238-f-problem-6b3d02d02a5297c375adc6e5bf98f0e8d425228f8f6f6e2361b490e773cdea9d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"第一順位順に処理すると現在より第一試験で上位の者は全て処理済み。現在を選ぶとき両試験で優れた未選択者がいない条件は、現在の第二順位が未選択者全体の最小第二順位より小さいことと同値。したがって未選択集合の履歴はその最小値だけで十分。選択人数とその境界を状態にし、選ぶ・選ばないを両方遷移すれば、支配する人を含む必要条件を全て守ったK人集合を一度ずつ数える。","sourceRevisionIds":["source-abc238-editorial-3354-883010a86d52c338be2cfc1329fe84067574c5b9934ac040ec239599a6f3dd21","source-abc238-f-problem-6b3d02d02a5297c375adc6e5bf98f0e8d425228f8f6f6e2361b490e773cdea9d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

市民を一回目の順位順に並べ、順位 i の人の二回目順位を A_i とすれば、一回目の優劣は処理順に埋め込める。

今の人を選ぶとき問題になるのは、先に選ばなかった人のうち二回目順位が最良の人だけである。

棄却する候補: K 人の全組合せを列挙し、選んだ人より両試験で上位の未選択者がいないか検査する。

組合せ数が指数的で N=300 を扱えず、支配条件の推移性も利用していない。

採用する候補: 一回目順位の昇順に走査し、選択人数 j と、それまでの未選択者の最小二回目順位 k を状態にして選ぶ・選ばないを遷移する。

現在の A_i が k より小さい場合に限り選択可能で、未選択なら k を min(k,A_i) にするだけなので過去を二値の境界へ圧縮できる。

一回目で現在より上位かつ未選択の人 y が存在するとき、現在を選べる条件は全ての Q_y より現在の Q が良いこと、すなわち A_i<min Q_y である。

二次元支配順序の下向き閉包を数える問題を、一方の座標で sweep し、未選択集合が課す他方座標の最小境界だけを持つ DP にする。

## 典型の発動条件

### 一方の順位で整列する支配関係 DP

発動条件: 二つの全順序でともに優る要素との選択整合性が課され、片方の順位が重複しないとき。

一方の順位順に決定してその座標を状態から消し、もう一方の順位境界だけを残す。

### 未選択集合の最小値による状態圧縮

発動条件: 将来の選択可否が過去に除外した要素全てとの大小比較で決まり、最も厳しい境界だけ見ればよいとき。

未選択者の最小二回目順位を持ち、選択時は境界比較、非選択時は min 更新を行う。

## 問題固有の要素

P と Q を市民番号のまま扱わず A[P_i]=Q_i と置くと、一回目順位 i の人を順に処理できる。

別の問題へ持ち帰る視点: 複数の順列順位が与えられたら、一方の逆順列で要素を並べ直して座標対の列に正規化する。

## 正当性

第一順位順に処理すると現在より第一試験で上位の者は全て処理済み。現在を選ぶとき両試験で優れた未選択者がいない条件は、現在の第二順位が未選択者全体の最小第二順位より小さいことと同値。したがって未選択集合の履歴はその最小値だけで十分。選択人数とその境界を状態にし、選ぶ・選ばないを両方遷移すれば、支配する人を含む必要条件を全て守ったK人集合を一度ずつ数える。

## 実装上の注意

- 未選択者がまだいない状態の境界は N＋1 とし、初期状態 dp[0][N＋1]=1 にする。
- 選ぶ遷移は A_i<k のときだけ j を一つ増やし、選ばない遷移では j を保って k=min(k,A_i) とする。

## 復習の核

- 二次元順序の制約では、片方の座標で sweep した後に過去集合から必要な極値だけを特定する。
- 選択集合が支配順序に関して閉じる条件は、選ぶ側よりも「過去に選ばなかった最強の要素」が作る禁止境界から考える。

## 計算量と制約

### 時間

O(N²K)。

### 空間

O(NK)。処理人数次元をrollingする。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 300; 1 \le K \le N; Each of P and Q is a permutation of (1,2,...,N).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/editorial/3354) — source-abc238-editorial-3354-883010a86d52c338be2cfc1329fe84067574c5b9934ac040ec239599a6f3dd21
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/tasks/abc238_f) — source-abc238-f-problem-6b3d02d02a5297c375adc6e5bf98f0e8d425228f8f6f6e2361b490e773cdea9d
