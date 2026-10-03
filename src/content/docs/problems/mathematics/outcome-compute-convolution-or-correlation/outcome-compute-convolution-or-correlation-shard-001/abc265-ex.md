---
title: "ABC265-EX — No-capture Lance Game"
draft: true
authoringUnit: {"problemId":"abc265-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc265-ex.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-conway-number-games","unit-dp-game","unit-separable-linear-transform"],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution","tag-conway-number-games","tag-game-grundy-dp","tag-separable-linear-transform"],"sourceRevisionIds":["source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5","source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"向かい合う行は両者が同じ空白数を任意に減らすNim山、外向きの行は各自専用の残量を減らす整数ゲームで、全後続でこの構造を保つ。自分の応答後に「自分の専用残量≥相手、Nim XOR=0」を保つ戦略は、相手のNim手にはXORを0に戻し、相手の専用手には自分の一マス移動を返せるため合法で、有限性から勝つ。初手でこの不変量へ入れる条件と対称性により、先手勝ちはS>0またはS=0,G>0。行は独立なので評価は整数和とGrundy XORで合成され、一行の配置個数分布のH回畳み込みが全配置の分布となる。二軸の正逆変換と点ごとのH乗でこれを求め、全和域paddingとHaのoffset復元を行って勝ち係数だけを合計すれば正しい。","sourceRevisionIds":["source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5","source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [独立な数ゲームの和](src/content/docs/learn/dynamic-programming/conway-number-games.md)
- [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)
- [分離可能線形変換・Walsh–Hadamard変換](src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)

対象外:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

行同士に移動はなく、全体ゲームはH個の独立な一行ゲームの直和として評価できる。

先手の香車は列番号の小さい方へ、後手の香車は大きい方へ進む。一行で後手位置 k が先手位置 j より左なら、二駒は向かい合い、空白数 g=j−k−1 が残る。どちらの手番でも g を任意の 0,…,g−1 へ減らせ、相手を越えることはできないので、これは大きさ g のNim山である。

k>j なら二駒は外向きで干渉しない。先手だけが使える残り移動量 a=j−1、後手だけの b=W−k を持つ二つの独立な片側ゲームとなる。先手は a を、後手は b を正の量だけ減らす。片側に n 単位が残るゲームは {0,…,n−1|}=n、その逆向きは−nという整数ゲームなので、この行の数成分は s=a−b、Nim成分は0。向きは移動後も変わらず、全後続局面で同じ分解が保たれる。

棄却する候補: 全W(W−1)^H配置を列挙し、各盤面のゲーム木を探索する。

配置数がHに対して指数的で、同じ一行局面の合成を繰り返している。

採用する候補: 一行配置の (s,g) 分布を作り、sは加算、gはXORする混合二次元畳み込みをtransform領域でH乗して全体分布を得る。

通常DFTは加算畳み込み、Walsh-Hadamard変換はXOR畳み込みを同時に対角化し、H回の合成を点ごとの冪へ変えられる。

混合後の勝敗も元の操作から示す。外向き全行の先手・後手の残り移動量合計を A,B とし、向かい合う行のNim XORをGとする。S=A−Bである。「自分の残量が相手以上、G=0」を自分の応答直後に保てれば勝てる。

相手がNim山を動かすとXORは非零となり、こちらはNimの標準手で0へ戻せる。相手が専用の移動量を減らしたら、こちらは自分の任意の駒を一マスだけ動かす。相手は少なくとも一単位使ったので、自分の残量≥相手残量を保つ。相手にその手があった以上、応答用の自分の一マスも必ず残る。各応答で全移動量は減り、ゲームは有限なので、自分が応答不能になる前に相手が手を失う。

A>Bなら、最初の自分の手番でG≠0ならNimを0へ、G=0なら専用移動を一マス使い、この応答不変量へ入れる。相手が先に動く場合も同じ応答が使える。従って非零Sでは符号の側が手番によらず勝つ。A=Bなら、G≠0は先手がNimを0へして勝つ。G=0から先手がNimを動かせば後手が0へ戻せ、専用移動を使えば残量が後手より少なくなって後手が勝つ。先手勝ち条件は S>0 または S=0かつG>0 となる。この証明は正の専用移動を一マスずつ使える本問の構造に基づき、一般のpartisan gameとの混合へそのまま拡張しない。

一行分布 d[s,g] は全 j≠k の配置を上記の式で加算して作る。同じ評価を持つ配置もその個数を係数へ残す。−(W−2)≤s≤W−2、0≤g≤W−2。offset a=W−2 を足して s+a を多項式次数へ写す。XOR軸は B>W−2 を満たす最小の2冪、加算軸は L≥2Ha+1 を満たすNTT可能な2冪でzero paddingする。逆変換後の次数tは実際のS=t−Haなので、上の勝ち条件を満たす係数だけを足す。W=2ではa=0,B=L=1で全配置が手なし、答え0となる。

整数成分とNim成分の合成を証明した後で、その分布の加算×XOR畳み込みを二軸の変換で対角化する。ゲームの分解と分布の高速合成は別々に正当化する。

## 典型の発動条件

### 独立ゲームの数値・Grundy合成

発動条件: 複数の独立局面から毎手一つを選ぶゲームで、局面ごとにpartisan値とimpartial値へ分解できるとき。

全後続で分解が保たれることと混合後の応答戦略を先に証明し、その上で整数成分を加算、Nim成分をXORする。

### 加算×XORの混合畳み込み

発動条件: 状態pairの一軸が通常加算、他軸がbitwise XORで合成される分布を反復合成するとき。

加算軸へNTT、XOR軸へWalsh-Hadamard変換を施し、各点をH乗して逆変換する。

## 問題固有の要素

向かい合う二駒の間の空白は通常のNim heapとなり、外向きの二駒は左右の手数差という整数値になるため、一行で両評価が同時に非零にはならない。

別の問題へ持ち帰る視点: 複合ゲームは駒の相対配置ごとに標準ゲームへ分解し、加法則が異なる評価成分を分けて持つ。

## 正当性

向かい合う行は両者が同じ空白数を任意に減らすNim山、外向きの行は各自専用の残量を減らす整数ゲームで、全後続でこの構造を保つ。自分の応答後に「自分の専用残量≥相手、Nim XOR=0」を保つ戦略は、相手のNim手にはXORを0に戻し、相手の専用手には自分の一マス移動を返せるため合法で、有限性から勝つ。初手でこの不変量へ入れる条件と対称性により、先手勝ちはS>0またはS=0,G>0。行は独立なので評価は整数和とGrundy XORで合成され、一行の配置個数分布のH回畳み込みが全配置の分布となる。二軸の正逆変換と点ごとのH乗でこれを求め、全和域paddingとHaのoffset復元を行って勝ち係数だけを合計すれば正しい。

## 実装上の注意

- XOR軸長は全gを含む2冪、加算軸長はH行のs範囲を巡回なしで含むNTT可能長にする。
- 逆Walsh-Hadamard変換では軸長の逆元を掛け、sのoffsetをH倍した位置から実際のSを復元して勝ち状態だけ合計する。

## 復習の核

- 独立部分ゲームの評価が複数の演算で合成されるなら、各演算を対角化する変換の直積を考える。
- 反復畳み込みの対象が全行同一なら、逐次DPではなく変換後の点ごとのH乗へ置き換える。

## 計算量と制約

### 時間

O(W²+LB(1+log L+log B+log(H+1)))。一行の全配置から分布を作るO(W²)、二軸変換とH乗を含む。Bはgを覆う2冪、LはH行のsの全和域を覆うNTT長。

### 空間

O(LB)。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H \leq 8000; 2 \leq W \leq 30; H and W are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_h) — source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4577) — source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72
