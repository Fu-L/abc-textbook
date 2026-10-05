---
title: "ABC213-H — Stroll"
draft: true
authoringUnit: {"problemId":"abc213-h","docPath":"src/content/docs/problems/mathematics/outcome-compute-online-relaxed-convolution/outcome-compute-online-relaxed-convolution-shard-001/abc213-h.md","learningOutcomeIds":["outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["Relaxed・online convolutionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-relaxed-convolution","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc213-editorial-2396-e053a5ddeaefef50ed297507ded11318df1661b6a53445324bb2fecb67ec32f5","source-abc213-h-problem-67e04f8bc5b8dac499f12a37a5e320099eff645eaa33ba256db445080344aac9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"道路長が正なので左時刻区間を先に確定できる。任意の遷移u→tにはu<tを分離する最小の分割節点が一つあり、その節点の畳み込みで寄与が一度加わる。従って葉では全ての過去からの寄与が揃い、初期値d[1,0]=1から時間順に正しい値が確定する。","sourceRevisionIds":["source-abc213-editorial-2396-e053a5ddeaefef50ed297507ded11318df1661b6a53445324bb2fecb67ec32f5","source-abc213-h-problem-67e04f8bc5b8dac499f12a37a5e320099eff645eaa33ba256db445080344aac9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Relaxed・online convolution](src/content/docs/learn/combinatorics-algebra/relaxed-convolution.md)

- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md) — 係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

時刻 t に街 s へ着く散歩コース数を d[s,t] とすると、道路 i を最後に渡る遷移は、出発側の時系列と長さ別通行方法数 p_i の畳み込みになる。

道路の長さは正なので、時刻 t の値は t より前の時刻だけに依存し、時間軸上には循環しない依存関係がある。

棄却する候補: 各時刻と道路について、利用可能な全ての道路長を走査して以前の DP 値を加える。

時刻の組を二重に扱う畳み込みが道路ごとに発生し、T の二乗規模の計算になる。

採用する候補: 時間区間を分割統治し、左半分で確定した DP 列と各道路の p_i を高速畳み込みして右半分へ寄与させる。

未来の値を使わない依存順を守りながら、同じ区間間の畳み込みを NTT でまとめて計算できる。

普通の一括畳み込みでは d 自身が未確定なので計算できないが、分割統治なら左区間の確定値だけを右区間へ送れる。

無向道路では一つの p_i が両方向の遷移に使われるため、左区間の各端点の系列から反対側へ対称に寄与を加える。

時間 DAG 上の自己参照型畳み込み DP を CDQ 型の分割統治で因果順に確定し、各区間間の道路遷移を NTT による多項式積として高速化する。

初期値は d[1,0]=1、他は0。p_e[0]=0 と置けば、道路 e=(u,v) による遷移は d[v,t]+=Σ_{s<t}d[u,s]p_e[t−s] と逆方向の同じ式である。

時刻区間 [l,r) を m で割り、solve(l,m) の後に道路ごとに z=convolution(d[u,l:m],p_e[0:r−l]) を作る。右半分 m≤t<r へ d[v,t]+=z[t−l]、端点を交換した積も同様に加えてから solve(m,r) を呼ぶ。長さ1は既に届いた寄与を確定する葉。T+1 以上の最小2冪まで0でpaddingしてよく、答えは d[1,T]。

出発時刻 s と到着時刻 t が左右に初めて分かれる分割だけでこの道路の寄与を送るので、漏れも重複もない。正の所要時間により同じ葉の循環依存もない。

## 典型の発動条件

### オンライン畳み込みの分割統治

発動条件: 時系列 DP の現在値が過去列との畳み込みで定まり、全入力列を一度に確定できないとき。

左時間区間を先に解き、その確定値から右時間区間への畳み込み寄与を加えてから右を再帰的に解く。

### NTT による多項式積

発動条件: 法が変換に適し、長い係数列どうしの畳み込みを多数まとめて計算するとき。

街ごとの DP 係数列と道路の長さ別係数列の区間積を求め、対応する到着時刻へ加算する。

## 問題固有の要素

正の道路長が時間方向の厳密な前進を保証するため、左区間から右区間への寄与だけを送る分割統治が成立する。

別の問題へ持ち帰る視点: 再帰的な畳み込み式では、添字が必ず増える因果性を見つけると、確定済み区間から未確定区間へのオフライン更新に分解できる。

## 正当性

道路長が正なので左時刻区間を先に確定できる。任意の遷移u→tにはu<tを分離する最小の分割節点が一つあり、その節点の畳み込みで寄与が一度加わる。従って葉では全ての過去からの寄与が揃い、初期値d[1,0]=1から時間順に正しい値が確定する。

## 実装上の注意

- 基底 d[1,0] を一度だけ設定し、各分割区間で既に加算済みの寄与を再度送って二重計上しない不変条件を保つ。
- 畳み込み結果の添字を道路長との和へ正しく対応させ、右区間の範囲外や T を超える係数を切り捨てる。

## 復習の核

- 遷移が「過去時刻×長さ別係数」の和なら、まず畳み込み式を書き、未知列を含むため一括変換できない点まで確認する。
- 分割統治の正当性は、再帰へ入る時点でどの時刻からの寄与が既に反映済みかを区間ごとに説明して確認する。

## 計算量と制約

### 時間

O(MT log²T+NT)。

### 空間

O((N+M)T)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10; 1 \leq M \leq \min \left(10, \frac{N(N-1)}{2} \right); 1 \leq T \leq 4 \times 10^4; 1 \leq a_i \lt b_i \leq N; (a_i, b_i) \neq (a_j, b_j) if i \neq j.; 0 \leq p_{i,j} \lt 998244353

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/editorial/2396) — source-abc213-editorial-2396-e053a5ddeaefef50ed297507ded11318df1661b6a53445324bb2fecb67ec32f5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/tasks/abc213_h) — source-abc213-h-problem-67e04f8bc5b8dac499f12a37a5e320099eff645eaa33ba256db445080344aac9
