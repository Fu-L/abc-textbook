---
title: "ABC400-G — Patisserie ABC 3"
draft: true
authoringUnit: {"problemId":"abc400-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc400-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-dp-subset-state"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45","source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"カテゴリーごとの偶数選択と元matchingは相互に構成でき、最適値が一致する。i−1組とi+1組の最適matchingを重ねた交互成分には青が一本多い路があり、その成分の色交換で合計価格を保存したi組ずつの合法matchingができる。従って2M_i≥M_{i−1}+M_{i+1}で、隣接差分は非増加。旧配列から送る8parity DPは各ケーキを一度だけ選び、F(q)=max_i(2M_i−2iq)を正確に得る。同値は多い個数を選ぶのでh(q)≥Kはq≤Δ_Kと同値。最大の整数q=Δ_KはKを支持し、(F(q)+2Kq)/2=M_Kとなる。","sourceRevisionIds":["source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45","source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各pair価格のmaxを達成するcategoryを一つ割り当てると、2K個のcake-category選択になり、各cake高々一回・各category選択数偶数という条件だけが残る。この選択最適値と元pairing最適値は相互に構成でき一致する。

個数制約を外す前に、ちょうど i 組の最適価格 M_i が離散凹になることを示す。i−1 組と i+1 組の最適matchingを赤・青で重ねる。同じ辺は二本として扱う。各頂点には各色高々一本しか接続しないので、各成分は交互路、偶閉路、二重辺になる。各成分の色別本数差は0か±1。成分全体の色交換はmatchingの合法性と二色合計の価格を保存する。

全体の青−赤の本数差は2なので、青が一本多い交互路が存在する。その一本の成分の色を交換すると、本数は双方 i 組になる。この二つの価格はそれぞれ M_i 以下で、合計は元の M_{i−1}+M_{i+1} のままだから 2M_i≥M_{i−1}+M_{i+1}。価格の正負に依存しない、matchingの交換構造からの証明である。本問のカテゴリー割当問題もmatchingと最適値が一致するので、この凹性を引き継ぐ。

採用する候補: 半整数penalty cを二分探索し、3 category parityの8-state DPでpenalized valueと選択数を同時最適化する

固定cでは各cakeを未選択またはX/Y/Zいずれかで選ぶだけなのでO(N)。argmax pair数の単調性からO(N log(V+1))でKに対応するcを見つけ、M_K=f(c)+2Kcを得られる。

棄却する候補: cakeのK disjoint pairと各pairのmax categoryを直接DPする

pair候補Θ(N²)とmatching constraintが絡み、N=10^5では扱えない。

各categoryの選択数が偶数なら、同category内で任意に二つずつpairにして、そのpair価格は割当category和以上なので緩和にgapがない。

DP tie-breakで選択数も保持し、penalty増加に対して最適選択pair数が単調に減るよう一貫した側を選ぶ。

f(c)=max_i(M_i−2ic) とおく。内部の K に対し M_{K+1}−M_K≤2c≤M_K−M_{K−1} なら、非増加な差分から K は全 i に対する最大化点になる。tieで返る個数が K と一致しなくても、支持線が K を含めば M_K=f(c)+2Kc で復元できる。

q=2c を整数として、各選択の利得を 2V−q にする。DPの初期値は mask=0 の (value,count)=(0,0)、他は −∞。ケーキごとに next=dp とし、旧 dp[mask] からカテゴリー t の選択を next[mask xor (1<<t)] へ (2V_t−q,1) 加えて送る。同値では count の大きい方を選ぶ。最終 mask=0 の value を F(q)、count/2 を h(q) とすると F(q)=2f(q/2)=max_i(2M_i−2iq)。

V=max(X_i,Y_i,Z_i) とする。非負価格のmatchingは最大本数まで延長できるので h(0)=floor(N/2)。q=2V+1 では全選択利得が負で h(q)=0。h(q)≥K を満たす最大整数 q を [0,2V+1) で二分探索する。整数の非増加差分 Δ_i=M_i−M_{i−1} により、この q は Δ_K であり K を支持する。端の K=floor(N/2) も同じ探索でよい。答えは (F(q)+2Kq)/2。2倍DPへ戻す定数は 2Kq であり、未スケールの 2Kc と混ぜない。

## 典型の発動条件

### Alien DP

発動条件: exact個数別最適値列が離散凹で、Lagrange penalty下の最適個数を求められるとき。

個数constraintをpenaltyへ移し二分探索でtarget Kを支持する。

### parity state DP

発動条件: 少数categoryの選択数を偶数に制約するとき。

各選択で対応bitをxorし最終mask0を取る。

## 問題固有の要素

max of three sumsをpairごとに扱うのでなく、勝ったcategoryをendpointそれぞれへ付けるとpair構造自体がparityだけへ消える。

別の問題へ持ち帰る視点: pair scoreがmax/min of category-additive termsなら、category assignment後のdegree/parity条件へ緩和してtightnessを証明する。

## 正当性

カテゴリーごとの偶数選択と元matchingは相互に構成でき、最適値が一致する。i−1組とi+1組の最適matchingを重ねた交互成分には青が一本多い路があり、その成分の色交換で合計価格を保存したi組ずつの合法matchingができる。従って2M_i≥M_{i−1}+M_{i+1}で、隣接差分は非増加。旧配列から送る8parity DPは各ケーキを一度だけ選び、F(q)=max_i(2M_i−2iq)を正確に得る。同値は多い個数を選ぶのでh(q)≥Kはq≤Δ_Kと同値。最大の整数q=Δ_KはKを支持し、(F(q)+2Kq)/2=M_Kとなる。

## 実装上の注意

- 半整数 c は q=2c で整数化し、利得は 2V−q、復元は (F(q)+2Kq)/2 とする。同値では選択数が多い方を採る。ケーキごとに旧配列から次配列へ更新し、同じケーキを複数カテゴリーへ使わない。V=0、Kの最大値、同じ傾きで個数が飛ぶ場合も同じ探索で処理できる。

## 復習の核

- N≤10で全matching・全category割当を列挙し、M_iの凹性、penalty境界tie、K=1,N/2を比較する。

## 計算量と制約

### 時間

O(N log(V+1)+N)の整数penalty binary searchと8状態DP。V=max coordinate≤10^9で、V=0でも一回のoracleはO(N)。全caseのNの合計は10^5以下。

### 空間

O(N+8)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 1000; 2\leq N \leq 10^5; The sum of N over all test cases in each input file is at most 10^5.; 1\leq K \leq \lfloor \frac{N}{2}\rfloor (For a real number x, \lfloor x\rfloor denotes the greatest integer not exceeding x.); 0\leq X_i,Y_i,Z_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/editorial/12631) — source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/tasks/abc400_g) — source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721
