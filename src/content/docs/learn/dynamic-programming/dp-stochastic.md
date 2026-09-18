---
title: "確率過程・期待値DP"
description: "「確率過程・期待値DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 77
---

# 確率過程・期待値DP

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 確率・期待値DP

確率遷移に対する期待値・分布・到達確率の再帰式を解く。

確率DPでは、分布・到達確率、期待費用、観測後の行動最適化を区別する。以下ではABC300 E、ABC263 E、ABC266 Eの式を用いて、その違いを示す。

ABC300 Eでは初期値1に公平なサイコロの目を掛け、Nへの到達確率を求める。目1を何回引いても成功事象は変わらない。次に1以外が出るまで待つと、2〜6のどの目も確率1/5である。待機が永遠に続く確率は0。

前向きにはp[1]=1とし、値vから2v,…,6vへ各p[v]/5を配る。Nに達した分を吸収し、Nを越えた分を失敗へ集める。未吸収・成功・失敗の総確率は1のまま。

後ろ向きにはq(N)=1,q(v)=0 (v>N)、q(v)=Σ_{d=2}^6 q(dv)/5。再帰先は真に増え、2,3,5の指数で表せる疎な状態だけをmemo化できる。

期待回数なら一試行の費用1を加えるが、到達確率には加えない。法上では5の逆元を用い、N=1や2,3,5以外の素因数を持つNを確認する。

ABC226 Hは連続分布への発展例。閾値xを固定し、各変数がx以上かの独立Bernoulli分布を成功個数DPで合成する。得た裾確率P(Y≥x)をxについて積分して期待値を得る。確率分布を作る工程と、裾確率から期待値を得る恒等式を分けて理解する。

入力: iからi,…,i+A_iへ等確率で移動し、N到達までの期待試行回数をE_iとする。終端はE_N=0。

一歩解析: E_i=1+(E_i+Σ_{j=i+1}^{i+A_i}E_j)/(A_i+1)。自己項を左へ移すとE_i=(A_i+1+ΣE_j)/A_i。費用1まで自己ループと一緒に消してはいけない。

A_i≥1なのでiを離れるまでの期待時間は有限。離れた後は位置が増えるため、後ろから順に解ける。suffix sumで連続区間の和を取れば全体O(N)。

境界: A_i=1ならE_i=2+E_{i+1}。一般に自己ループ確率p=1なら移項して割れず、正の費用を払う過程の期待時間は無限。

入力: 残りr回まで振れるとき、次の目を見る前の最適期待報酬をV_rとする。最後の1回は必ず採用するのでV_1=3.5。

r≥2では目dを観測してから停止か続行を選ぶ。停止はd、続行は独立な未来の最適値V_{r-1}。従ってV_r=(1/6)Σ_{d=1}^6 max(d,V_{r-1})。

max(E[d],V_{r-1})では、目を観測する前に一律に停止・続行を決めることになり別問題となる。V_2=4.25であり、3.5との差は観測情報の価値を表す。

残り回数が減るので後退帰納で最適性を証明できる。O(N)時間O(1)空間。最後の強制停止、同点でどちらを選んでも値が同じことを確認する。

ABC242 Exでは、異なる区間がk種類集まった段階に分ける。次の新種類までの期待待ち時間はM/(M−k)で、その段階まで被覆が終わっていない確率を掛けて足す。全被覆するk-subset数f(k)を別のDPで求めれば、期待値はΣ_{k=0}^{M−1}(1−f(k)/C(M,k))·M/(M−k)になる。

f(k)の計数は、区間を左端順に処理し、隙間なく覆ったprefixの右端rと選択数kを状態にする走査DPである。区間[L,R]を選ぶならL≤r+1を要求し、右端をmax(r,R)へ更新する。一度隙間を残すと後続の区間では埋められない。二つの独立区間の解を掛け合わせる区間DPではない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。

### このUnitでは扱わないもの

- 二人零和ゲームの勝敗・Grundy数。

## 下位単元

- [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/) — 発展

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC263 E「Sugoroku 3」](https://atcoder.jp/contests/abc263/tasks/abc263_e)
2. [ABC266 E「Throwing the Die」](https://atcoder.jp/contests/abc266/tasks/abc266_e)
3. [ABC275 E「Sugoroku 4」](https://atcoder.jp/contests/abc275/tasks/abc275_e)
4. [ABC280 E「Critical Hit」](https://atcoder.jp/contests/abc280/tasks/abc280_e)
5. [ABC298 E「Unfair Sugoroku」](https://atcoder.jp/contests/abc298/tasks/abc298_e)
6. [ABC300 E「Dice Product 3」](https://atcoder.jp/contests/abc300/tasks/abc300_e)
7. [ABC314 E「Roulettes」](https://atcoder.jp/contests/abc314/tasks/abc314_e)
8. [ABC323 E「Playlist」](https://atcoder.jp/contests/abc323/tasks/abc323_e)
9. [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e)
10. [ABC350 E「Toward 0」](https://atcoder.jp/contests/abc350/tasks/abc350_e)
11. [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e)
12. [ABC382 E「Expansion Packs」](https://atcoder.jp/contests/abc382/tasks/abc382_e)
13. [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e)
14. [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f)
15. [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g)
16. [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g)
17. [ABC226 H「Random Kth Max」](https://atcoder.jp/contests/abc226/tasks/abc226_h)
18. [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h)
19. [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h)
- [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g)
- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h)
- [ABC310 F「Make 10 Again」](https://atcoder.jp/contests/abc310/tasks/abc310_f)
- [ABC332 F「Random Update Query」](https://atcoder.jp/contests/abc332/tasks/abc332_f)
- [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f)
- [ABC342 F「Black Jack」](https://atcoder.jp/contests/abc342/tasks/abc342_f)
- [ABC402 E「Payment Required」](https://atcoder.jp/contests/abc402/tasks/abc402_e)
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)

## 根拠

- [ABC226 H 公式解説](https://atcoder.jp/contests/abc226/editorial/2879)
- [ABC226 H 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_h)
- [ABC239 H 公式解説](https://atcoder.jp/contests/abc239/editorial/3357)
- [ABC239 H 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_h)
- [ABC242 H 公式解説](https://atcoder.jp/contests/abc242/editorial/3523)
- [ABC242 H 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-stochastic`
