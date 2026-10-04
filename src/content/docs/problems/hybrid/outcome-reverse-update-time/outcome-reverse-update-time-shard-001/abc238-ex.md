---
title: "ABC238-EX — Removing People"
draft: true
authoringUnit: {"problemId":"abc238-ex","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc238-ex.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-dp-interval-composition","unit-modular-arithmetic"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-combinatorial-coefficients","tag-contribution-reordering","tag-interval-partition-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc238-editorial-3361-2a85ca62e2aaf6e541f5fa85d0a9d831577cef21b0b07cf76f5995ee6ffb24f3","source-abc238-ex-problem-925c57a0268e42b5c59c90d4c02a25c085f1bf9694c506d458661cbc37071238"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"端点を固定した空隙で最初に戻す人を選ぶと、左右の処理は独立になる。二項係数は両側の内部順を保つ混ぜ方を数え、numとcostは各履歴の数と費用を過不足なく合成する。最後の二人を(u,v)と区別すると、各削除履歴は唯一の二空隙の履歴と、uがvを除く最後の操作へ分解される。従って全組の寄与を足した総費用を、等確率なN!履歴で割れば期待値になる。","sourceRevisionIds":["source-abc238-editorial-3361-2a85ca62e2aaf6e541f5fa85d0a9d831577cef21b0b07cf76f5995ee6ffb24f3","source-abc238-ex-problem-925c57a0268e42b5c59c90d4c02a25c085f1bf9694c506d458661cbc37071238"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md) — DPの最小十分状態で得た考え方と実装を再利用し、区間合成・領域分割DPの発動条件・正当化・境界を重複なく学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

残り k 人の各段階で選ぶ人は k 通り等確率なので、全選択履歴は N! 通りが等確率であり、総コストを全履歴で足して N! で割れば期待値になる。

削除順を逆にして人を円へ戻すと、新しく置く人を直前に除いた候補は、その時点で両隣にいる人のうち新しい人の方向を向く者だけである。

棄却する候補: 残っている人の集合を状態にして、各段階で選ぶ人と削除される人を前向きに遷移する。

削除後の隣接関係は集合全体に依存し、2 の N 乗状態になって N=300 を扱えない。

採用する候補: 削除を逆再生し、配置済みの端点 l,r の間を埋める手順数 num[l][r] と全手順のコスト総和 cost[l][r] を区間 DP で求める。

区間内で最初に戻す人 i を決めると残りは (l,i) と (i,r) に独立分割され、両側の配置順だけを二項係数で混ぜればよい。

i を戻す方法数 c1 は S_l=R と S_r=L の成立個数で、対応するコスト総和 c2 は前者なら i−l、後者なら r−i を足した値になる。

左右の内部人数を x,y とすると、一組の左右手順を混ぜる順序は binom(x+y,x) 通りであり、手順数とコスト総和を積の微分則のように合成できる。

円環上の逐次削除を reverse process の挿入木へ変え、最初の挿入を根とする interval decomposition と count/sum の二量 DP で全履歴を集計する。

最後の接続は順序付きの二人(u,v)で分類する。uを最後に残る人、vをその直前に除かれる人とし、時計回り距離d=(v−u mod N)、uの向きに沿う距離δはS_u=Rならd、LならN−dとする。二つの空隙の内部人数はd−1とN−d−1である。各組の全コストを

```text
C(N−2,d−1) × (cost[u][v] num[v][u]
               + num[u][v] cost[v][u]
               + δ num[u][v] num[v][u])
```

で合成し、すべてのu≠vについて足してN!で割る。二人だけの段階ではuが必ずvを除くので、通常区間の二端点候補数c1を掛けない。区間DP内の距離i−l,r−iは端点を時計回りに展開した添字で測る。N=2では両空隙のnum=1,cost=0、各組の寄与は最後の一歩だけになる。

## 典型の発動条件

### 削除過程の逆再生

発動条件: 前向き削除では隣接関係が複雑に変わるが、逆向き挿入では新要素の両隣が一意に定まるとき。

削除順を逆にして空隙へ人を挿入し、直前の削除者候補を空隙の両端だけに限定する。

### 最初の要素で分割する区間 DP

発動条件: 区間内で最初に処理する位置を決めると左右が独立になり、処理順を自由に interleave できるとき。

分割位置 i を全探索し、左右の手順数、コスト総和、二項係数を合成する。

### 期待値の全事象総和化

発動条件: 確率過程の全履歴が同じ確率を持ち、各履歴の加算量を組合せ DP で数えられるとき。

各状態で手順数とコスト総和を同時に持ち、最後に全履歴数 N! の逆元を掛ける。

## 問題固有の要素

区間 (l,r) を初めて分割する i の削除者は、時計回りを向く l と反時計回りを向く r の高々二人であり、同じ挿入順でも削除履歴が二通りになり得る。

別の問題へ持ち帰る視点: 逆過程で一つの構造に複数の前向き操作が対応する場合、可否だけでなく対応数と各操作の重み総和を遷移係数にする。

## 正当性

端点を固定した空隙で最初に戻す人を選ぶと、左右の処理は独立になる。二項係数は両側の内部順を保つ混ぜ方を数え、numとcostは各履歴の数と費用を過不足なく合成する。最後の二人を(u,v)と区別すると、各削除履歴は唯一の二空隙の履歴と、uがvを除く最後の操作へ分解される。従って全組の寄与を足した総費用を、等確率なN!履歴で割れば期待値になる。

## 実装上の注意

- 隣接端点では num=1、cost=0 とし、長さの短い円環区間から計算する。左右の空区間もこの基底で統一する。
- 円環区間の添字は時計回りに展開する。最後の二人の処理は通常区間のc1を流用せず、uがvを除く一通りとして上の回答式を使う。
- cost の合成では、新規コスト×左右手順数に加え、左 cost×右手順数×c1 と左手順数×右 cost×c1 の両項を入れる。

## 復習の核

- 削除後の状態が非局所的なら、最終状態から要素を戻したときに境界だけで遷移を記述できないか調べる。
- 期待値 DP が複雑なときは、等確率な履歴を数える DP と、その履歴上の量の総和 DP に分離する。

## 計算量と制約

### 時間

O(N³)、円環interval DPの分割位置列挙。

### 空間

O(N²)、count/sum表と二項係数。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 300; N is an integer.; S is a string of length N consisting of L and R.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/editorial/3361) — source-abc238-editorial-3361-2a85ca62e2aaf6e541f5fa85d0a9d831577cef21b0b07cf76f5995ee6ffb24f3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc238/tasks/abc238_h) — source-abc238-ex-problem-925c57a0268e42b5c59c90d4c02a25c085f1bf9694c506d458661cbc37071238
