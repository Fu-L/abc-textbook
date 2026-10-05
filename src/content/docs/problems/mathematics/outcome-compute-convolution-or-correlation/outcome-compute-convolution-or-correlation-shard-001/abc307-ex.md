---
title: "ABC307-EX — Marquee"
draft: true
authoringUnit: {"problemId":"abc307-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc307-ex.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution"],"sourceRevisionIds":["source-abc307-ex-problem-506e072acecfa90ffe96aad108798bb3e5c6919de0ae1c05e3c0ca6cf148a467","source-abc307-editorial-6598-80d8a8aa72d932c227c443d13ec476be1fe4a005eb77e94cf8f37dcea7cc2227"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"周期U=S+空白W−1個を延長すれば全display状態が各長さWwindowに一度現れる。指定位置の二乗差和は非負で0と完全一致が同値。文字符号の範囲とWにより総scoreは法未満なのでmod0の偽一致がない。二乗展開の相関を反転patternとの畳み込みで評価し、正しいwindow範囲だけ数える。","sourceRevisionIds":["source-abc307-ex-problem-506e072acecfa90ffe96aad108798bb3e5c6919de0ae1c05e3c0ca6cf148a467","source-abc307-editorial-6598-80d8a8aa72d932c227c443d13ec476be1fe4a005eb77e94cf8f37dcea7cc2227"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

この解説で扱わないこと:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

一周期U=S+'.'^(W−1)を作り、その先頭W−1文字を再度付けたTの各length-W windowが、L+W−1個のdisplay statesと一対一対応する。

文字をdistinct small integers、wildcard '_'だけをmask 0とすると、alignmentのmismatch score Σ(T−P)^2[P≠_]はnonnegativeで、0 iff 全指定位置がmatchする。

棄却する候補: 各stateのW positionsをPと直接比較する。

(L+W)Wが最大Θ(W^2)となる。

採用する候補: mismatch polynomialをΣT^2mask−2ΣTP+ΣP^2へ展開し、reverseしたP側arraysとのNTT convolutionsで全alignmentsを求める。

各cross-correlationを一回のconvolutionで一括評価でき、score 0のwindowsだけを数えられる。

Tにはwildcardがないため(P指定位置だけの)squared differenceで十分で、character valuesを0…53にすればscoreは998244353未満になりmodulo zeroの偽一致が起きない。

cross-correlationはpattern arraysをreverseしてconvolutionし、window start iに対応するcoefficientを正しいoffsetから読む。

## 典型の発動条件

### wildcard matchingのmismatch polynomial

発動条件: 有限alphabetの全alignmentsで、wildcard以外の不一致数を一括判定したいとき。

指定位置だけ(x−y)^2を足し、sum zeroをmatch条件にする。

### 畳み込みによるcross-correlation

発動条件: 全shiftについてΣ_k F(T_{i+k})G(P_k)型の量が必要なとき。

pattern coefficient列をreverseしてNTTし、各window scoreのcross termsを得る。

## 問題固有の要素

periodic displayをcycleごと複製せず、一周期とW−1文字のprefixだけで全length-W windowsを線形文字列に埋め込める。

別の問題へ持ち帰る視点: cyclic window列挙はperiod列へwindow length−1のprefixをappendする。

## 正当性

周期U=S+空白W−1個を延長すれば全display状態が各長さWwindowに一度現れる。指定位置の二乗差和は非負で0と完全一致が同値。文字符号の範囲とWにより総scoreは法未満なのでmod0の偽一致がない。二乗展開の相関を反転patternとの畳み込みで評価し、正しいwindow範囲だけ数える。

## 実装上の注意

- '.'も通常のalphabet symbolとしてlettersと異なる値を割り当て、'_'だけmaskから除く。
- convolution coefficient indexとvalid start range0…L+W−2を合わせ、余分なwindowsを数えない。

## 復習の核

- 全shift matchingは不一致時だけ正になるcharacter pair scoreを代数展開できないか考える。
- modular convolutionでzero判定するなら、真のscore上界をmodulus未満にしてcollisionを排除する。

## 計算量と制約

### 時間

O((L+W)log(L+W))。固定本数のNTT相関を計算する。

### 空間

O(L+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq L \leq W \leq 3\times 10^5; L and W are integers.; S is a string of length L consisting of uppercase and lowercase English letters.; P is a string of length W consisting of uppercase and lowercase English letters, ., and _.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/tasks/abc307_h) — source-abc307-ex-problem-506e072acecfa90ffe96aad108798bb3e5c6919de0ae1c05e3c0ca6cf148a467
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/editorial/6598) — source-abc307-editorial-6598-80d8a8aa72d932c227c443d13ec476be1fe4a005eb77e94cf8f37dcea7cc2227
