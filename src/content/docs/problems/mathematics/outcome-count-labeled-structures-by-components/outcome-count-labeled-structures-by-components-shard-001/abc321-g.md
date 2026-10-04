---
title: "ABC321-G — Electric Circuit"
draft: true
authoringUnit: {"problemId":"abc321-g","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc321-g.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-dp-subset-state","unit-generating-functions","unit-modular-arithmetic"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-labeled-component-decomposition","tag-combinatorial-coefficients","tag-contribution-reordering","tag-modular-arithmetic","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc321-editorial-7268-00f24219ca82356649b297dd1947370a7049d3a54b8fe0696d5e78022493df05","source-abc321-g-problem-6fa764dbb82c3672a6615a312862133e97a79b7b932fd3bd84b4db885190581b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"subset内端子数が等しければ内部matchingはm!、違えば0。anchorを含む真の連結成分Tで分類して非連結分を引く再帰によりconnected内部数g(S)を得る。Sが全graphの一成分となるmatchingはg(S)(M−m)!で、他との端子接続は禁止される。各実現graphの成分indicatorを全非空Sで足すとその成分数になるので期待値の線形性が答えを与える。","sourceRevisionIds":["source-abc321-editorial-7268-00f24219ca82356649b297dd1947370a7049d3a54b8fe0696d5e78022493df05","source-abc321-g-problem-6fa764dbb82c3672a6615a312862133e97a79b7b932fd3bd84b4db885190581b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

最終graphの各connected componentの頂点集合Sについてindicatorを置くと、component数は非空Sのindicator和なので期待値の線形性を使える。

S内のred端子数とblue端子数が異なればSだけでcableを閉じられず、等しくmならS内端子の全matching数f(S)はm!である。

Sが1componentとなる内部matching数g(S)は、f(S)から複数componentへ分かれるmatchingをsubset DPで引いて求められる。

採用する候補: 各subsetの全内部matching fからconnected matching gをanchor付きsubset recurrenceで抽出し、component indicator確率を総和する。

N≤17のsubset空間でM!個の配線を列挙せず、連結成分分割をO(3^N)の一意な分解として数えられる。

棄却する候補: M!通りのred-blue terminal matchingを列挙し、毎回DSUでcomponent数を数える。

M≤10^5でfactorial個の配線は列挙不能である。

棄却する候補: 各part pair間の期待cable本数からexpected component数を直接求める。

component数はedge本数の線形関数ではなく、cycleや連結性の高次依存を失う。

Sの固定anchor aを含むcomponentをTとすると、Tはconnectedにg(T)通り、残りS\Tは任意の内部matching f(S\T)通りで、非連結caseを一意に分類できる。

従ってg(S)=f(S)-Σ_{T⊊S,a∈T}g(T)f(S\T)となり、小subsetから順に計算できる。

Sが全体の1componentとなるfull matching数はg(S)(M-m)!なので、その確率はこれをM!で割った値になる。

各partのred/blue端子数を数え、subset sumでr[S],b[S]を作る。等しいときf[S]=r[S]!、そうでなければ0。popcount昇順に、Sの最下位bit aを固定してproper submask T⊂S,a∈Tを列挙し、g[S]=f[S]-Σg[T]f[S\T]を求める。各非空Sでm=r[S]=b[S]ならg\[S](M-m)!/M!をanswerへ加え、mod 998244353で出力する。

## 典型の発動条件

### indicator期待値

発動条件: random構造のconnected component数など、部分集合eventの個数として表せる量。

各Sがちょうど1componentになる確率を足す。

### connected構造のsubset DP

発動条件: 全構造数f(S)からconnected構造数g(S)を抽出したいとき。

anchorを含むcomponent Tで非連結構造を一意分解する。

### 3^N submask enumeration

発動条件: 各subset Sに対しanchor条件付きの全submaskを走査するとき。

S,T,S\Tの三分類として総計を評価する。

## 問題固有の要素

terminal matchingがSの外へ1本も出ない確率と、その内部graphがconnectedな割合をg(S)(M-m)!/M!で同時に数えられる。

別の問題へ持ち帰る視点: subsetがcomponentになるeventは、subset内connected構造と補集合側の任意構造を積に分け、全体構造数で割る。

## 正当性

subset内端子数が等しければ内部matchingはm!、違えば0。anchorを含む真の連結成分Tで分類して非連結分を引く再帰によりconnected内部数g(S)を得る。Sが全graphの一成分となるmatchingはg(S)(M−m)!で、他との端子接続は禁止される。各実現graphの成分indicatorを全非空Sで足すとその成分数になるので期待値の線形性が答えを与える。

## 実装上の注意

- red/blue数が異なるsubsetはf=g=0とし、m=0のsingletonはedgeなしでもconnectedなのでrecurrence上g=1になる。
- proper submaskだけを引き、anchor bitを含む条件で同じpartitionを重複計数しない。
- 最後にinv(M!)を共通で掛け、mod減算を正規化する。

## 復習の核

- N=2で端子なしsingletonと両partを結ぶ1 cableのcaseを計算し、fからgを引くrecurrenceとcomponent確率の(M-m)!因子を確認する。

## 計算量と制約

### 時間

O(3^N+N2^N+M)。subsetの端子数とanchor成分再帰。

### 空間

O(2^N+M+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 17; 1 \leq M \leq 10^5; 1 \leq R_i, B_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/editorial/7268) — source-abc321-editorial-7268-00f24219ca82356649b297dd1947370a7049d3a54b8fe0696d5e78022493df05
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc321/tasks/abc321_g) — source-abc321-g-problem-6fa764dbb82c3672a6615a312862133e97a79b7b932fd3bd84b4db885190581b
