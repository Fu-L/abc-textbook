---
title: "ABC462-E — Alternating Costs"
draft: true
authoringUnit: {"problemId":"abc462-e","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc462-e.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4","source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各歩で座標和の偶奇が反転するため、偶数目標には2K手の移動だけを考えればよい。奇数・偶数のslot数が等しく、軸・向きの割当順は座標和を変えないので、費用と軸をそれぞれa≤b,u≤vへ正規化できる。K≤vではv側の安いslotがK個しかなく高費用歩h≥v−Kが必要。一方、v側のK安歩+h高歩、u側の2K−v安歩へ符号を割り当てる構成が、K≥(u+v)/2とu+v偶数を使ってこの下界を達成する。従ってg(K)が厳密な費用であり、一次式の二端が最適。K>vの費用は少なくとも2Ka>2vaだから、既に達成したK=vより良くならない。\n\n奇数目標への任意の合法列は最後の水平または垂直歩と偶数長prefixへ一意に分かれる。その直前位置四候補のeven最小値に、元のAまたはBを足せば全ての列を覆う。evenはb≥3aなら2av、b≤3aなら非負係数の((3a−b)u+(a+b)v)/2となり、非負座標に関して非減少なので、各軸の遠い側の候補は近い側以上である。よって(X−1,Y),(X,Y−1)の二候補だけで最小を得る。evenは引数を絶対値化するため座標0の−1候補も合法な迂回として保持される。","sourceRevisionIds":["source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4","source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 交換論による貪欲順の証明。

## 考察

費用は手番の偶奇だけでなく、水平・垂直の方向でも変わる。奇数手は水平A・垂直B、偶数手は水平B・垂直Aである。符号反転は費用を変えないので、まず目標をX=|X|,Y=|Y|へ写す。移動回数の偶奇はX+Yの偶奇に等しい。

まずX+Yが偶数の場合の最小費用E(A,B,X,Y)を求める。2K手では奇数・偶数のslotがK個ずつある。正負の単位移動の並べ方は自由なので、各slotで選ぶ軸と向きの個数が達成座標を決める。手番slotの交換によるA,Bの交換、軸の交換によるX,Yの交換は偶数手の最適値を変えない。従ってa=min(A,B),b=max(A,B)、u=min(X,Y),v=max(X,Y)としてよい。

必要歩数からK≥(u+v)/2。K≤vなら、v側の軸で安い移動をできるslotはK個しかないため、少なくともh=v−K個の高費用移動が要る。この下界を達成するには、v側をK個の安い正方向とh個の高い正方向で進め、u側には残るK−h=2K−v個の安い移動を使う。2K−v≥uで偶奇もuと一致するので、正方向(u+2K−v)/2個・負方向(2K−v−u)/2個でちょうどuへ届く。

従ってこの範囲の厳密な最小費用はg(K)=2Ka+(v−K)(b−a)。Kについて一次式なので、K=(u+v)/2とK=vの二端だけを比較すればよい。K>vなら全ての一歩が少なくともaなので費用≥2Ka>2va。一方、K=vは上の構成で2vaを達成するから、それ以上の歩数は不要である。「任意のK≥vで全て安い移動ができる」とは主張していない。例えばX=Y=0,K=1では安い水平・垂直を一回ずつ使っても原点に戻れない。

```text
even(A,B,x,y):
    u,v = sorted(abs(x),abs(y))
    a,b = sorted(A,B)
    return min(a*(u+v)+(b-a)*(v-u)/2, 2*a*v)
```

割られるv−uは偶数である。x=y=0なら0を返す。

X+Yが奇数なら最後の手は奇数手なので、水平ならA、垂直ならBを加える。最後の直前位置は(X±1,Y),(X,Y±1)の四候補。evenを使って四候補を評価しても定数時間だが、遠ざかる側は除ける。

a≤bとしてb≥3aならeven=2av、b≤3aならeven=((3a−b)u+(a+b)v)/2である。いずれもu,vに非減少なので、同じ軸での|X−1|≤|X+1|、|Y−1|≤|Y+1|から近い側を選べる。従って答えはmin(even(A,B,X−1,Y)+A,even(A,B,X,Y−1)+B)。X=0やY=0では−1を除かず、even内で絶対値化する。

例えばA=100,B=1,X=1,Y=0なら、水平へ一歩は100だが垂直・水平・垂直の三歩は各1で合計3。Y−1=−1の候補がこの迂回を拾う。常に最短歩数だけを見る候補や、奇数手を全て費用Aとする候補はこの例で棄却できる。

## 典型の発動条件

### 対称性による標準化

発動条件: 格子移動で座標符号・軸・交互costの役割に対称性があるとき。

絶対値とswapでparameter順序を固定する。

### piecewise-linear目的の端点評価

発動条件: 自由な余分移動回数Kに対するcostが区間ごとの一次式になるとき。

傾き一定なので各定義域端だけ比較する。

## 問題固有の要素

巨大grid最短路も、移動回数parityと各cost回数を固定すると一変数の線形最適化へ落ちる。

別の問題へ持ち帰る視点: 対称性で係数と座標を同時にsortするとcaseworkを本質的な一ケースへ縮められる。

## 正当性

各歩で座標和の偶奇が反転するため、偶数目標には2K手の移動だけを考えればよい。奇数・偶数のslot数が等しく、軸・向きの割当順は座標和を変えないので、費用と軸をそれぞれa≤b,u≤vへ正規化できる。K≤vではv側の安いslotがK個しかなく高費用歩h≥v−Kが必要。一方、v側のK安歩+h高歩、u側の2K−v安歩へ符号を割り当てる構成が、K≥(u+v)/2とu+v偶数を使ってこの下界を達成する。従ってg(K)が厳密な費用であり、一次式の二端が最適。K>vの費用は少なくとも2Ka>2vaだから、既に達成したK=vより良くならない。

奇数目標への任意の合法列は最後の水平または垂直歩と偶数長prefixへ一意に分かれる。その直前位置四候補のeven最小値に、元のAまたはBを足せば全ての列を覆う。evenはb≥3aなら2av、b≤3aなら非負係数の((3a−b)u+(a+b)v)/2となり、非負座標に関して非減少なので、各軸の遠い側の候補は近い側以上である。よって(X−1,Y),(X,Y−1)の二候補だけで最小を得る。evenは引数を絶対値化するため座標0の−1候補も合法な迂回として保持される。

## 実装上の注意

- even内部では座標の絶対値とu≤vへの正規化を行う。奇数caseのX−1,Y−1が負でも除外しない。
- a,bの並べ替えはeven内だけで使い、最後の水平・垂直歩の追加費用は元のA,Bで加える。
- v−uは偶数なので先に2で割ってから(b−a)を掛けられる。制約内の積と和は符号付き64 bitで扱える。
- 全test caseの時間はO(T)。原点、片軸0、A=B、b=3a、迂回が得なb>3aを含めて確認する。

## 復習の核

- 位相の回数と、各位相で選べる方向・費用を別々に数える。
- 一次式の端を調べる前に、歩数の下限・高費用歩の下界・達成する符号割当を示す。
- 正規化した費用を、元の位相へ戻る最後の一手へそのまま流用しない。

## 計算量と制約

### 時間

一case O(1)、全T case O(T)。evenの二端評価と、奇数caseの二候補の評価はいずれも定数回。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le A,B\le 10^9; -10^9\le X,Y\le 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/tasks/abc462_e) — source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/editorial/21400) — source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236
