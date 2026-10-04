---
title: "ABC348-G — Max (Sum - Max)"
draft: true
authoringUnit: {"problemId":"abc348-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-monge-transitions/outcome-optimize-monge-transitions-shard-001/abc348-g.md","learningOutcomeIds":["outcome-optimize-monge-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization","unit-recursive-divide-and-conquer"],"excludedTopics":["Monge・monotone minima最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-monge-optimization","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc348-editorial-9707-e31a81617e57dd150c2c05cfe814e6a9b424cc80720ccfe1da0f26a7f8fad44a","source-abc348-g-problem-c6f9ebb220dc35e4c233cabf0a3b5e1898952199a2414b14ee2c8587232d84a4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"B順のcross選択ではmax Bは右にあるので、左側の最適寄与は個数jのA上位和x_j、右はその部分問題の答えy_kになる。xの限界利得が非増加なので行iの列k差はiについて非減少、左tie優先の右選択数kが単調になる。単調探索で各行最大を取り、left-only/right-only/crossを比較すると全選択を互いに素に覆う。","sourceRevisionIds":["source-abc348-editorial-9707-e31a81617e57dd150c2c05cfe814e6a9b424cc80720ccfe1da0f26a7f8fad44a","source-abc348-g-problem-c6f9ebb220dc35e4c233cabf0a3b5e1898952199a2414b14ee2c8587232d84a4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Monge・monotone minima最適化](src/content/docs/learn/geometry-optimization/monge-optimization.md)

- quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

B昇順にsortすると、左右区間の両方から選ぶ集合のmax Bは必ず右区間側で決まる。よって左からj個選ぶ寄与はAの上位j個prefix和、右からk個選ぶ寄与は右部分問題の答えとして分離できる。

採用する候補: B順divide-and-conquerとconcave max-plus convolutionを行う

各区間のk個選択答えを統合し、左prefix和のconcavityからMonotone Minimaで全kを準二次未満に計算できる。

棄却する候補: 各kについて候補max-B indexと選ぶAを全探索する

kとmax位置の二重以上の探索になり、全kでO(N^2)を超える。

左Aの降順prefix和xは差分が非増加である。行を合計個数i、列を右選択数kとしてM[i,k]=x[i-k]+y[k]を作ると、列差M[i,k+1]−M[i,k]=y[k+1]−y[k]−(x[i-k]−x[i-k-1])はiについて非減少。したがって同点を左優先した行最大位置kは非減少であり、分割統治で探索範囲を絞れる。単調なのは右選択数kで、左選択数j=i-kではない。

pair(A_i,B_i)をB昇順sortする。solve(l,r)は各選択数の最大値vectorを返し、左右を再帰する。merge時に左Aを降順sortしたprefix x、右answer yからmonotone max-plus convolution zをO(len log len)で計算し、left-only、right-only、cross zの最大を各kへ格納する。root vectorの1…Nを出力する。

## 典型の発動条件

### 分割統治による最大要素の所在分離

発動条件: 目的に集合内max Bがあり、B順区間を左右に分けられる。

両側選択時のpenalty担当を右側へ固定し、左側はA和だけにする。

### concave max-plus convolution

発動条件: z_i=max_j(x_j+y_{i-j})を多数iで求め、xの差分が単調である。

Monge性からargmax単調性を使い、Monotone Minimaまたは分割統治最適化で計算する。

## 問題固有の要素

max penaltyをB sortで右端側へ割り当てることで、通常は非分離なΣA-maxBを、concaveな自由選択prefixと再帰部分問題のconvolutionへ変えられる。

別の問題へ持ち帰る視点: 集合objectiveのmax項はkey順divide-and-conquerでmaxを含む側へ責任を持たせる。

## 正当性

B順のcross選択ではmax Bは右にあるので、左側の最適寄与は個数jのA上位和x_j、右はその部分問題の答えy_kになる。xの限界利得が非増加なので行iの列k差はiについて非減少、左tie優先の右選択数kが単調になる。単調探索で各行最大を取り、left-only/right-only/crossを比較すると全選択を互いに素に覆う。

## 実装上の注意

- 0個選択は問題答えとして-∞としつつ、cross用x_0=0を許す範囲を明示する。A,Bが負でもsort・prefix・-INF演算を64bitで安全に行う。

## 復習の核

- N小で全subsetを列挙し、A負値、B tie、最適集合が左右片側だけ・両側に跨る場合をmerge結果と比較する。

## 計算量と制約

### 時間

O(N log²N)。B順分割統治と単調max-plus mergeを行う。

### 空間

O(N log N)の再帰保持、解放でO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; -10^9 \leq A_i \leq 10^9; -2 \times 10^{14} \leq B_i \leq 2 \times 10^{14}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/editorial/9707) — source-abc348-editorial-9707-e31a81617e57dd150c2c05cfe814e6a9b424cc80720ccfe1da0f26a7f8fad44a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc348/tasks/abc348_g) — source-abc348-g-problem-c6f9ebb220dc35e4c233cabf0a3b5e1898952199a2414b14ee2c8587232d84a4
