---
title: "ABC400-G — Patisserie ABC 3"
draft: true
authoringUnit: {"problemId":"abc400-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc400-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-dp-subset-state"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45","source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各pair価格を最大化したcategoryへ二cakeを割り当てるとcategory個数は偶数。逆に各categoryの偶数選択をpair化すればpair価格は割当値以上なので、この緩和は元最適値と一致する。8parity DPは各cake高々一選択を守り、penaltyを引いて全個数別凹最適列の支持線を得る。指定Kを跨ぐpenaltyを選び2Kcを戻すことでその最適値を復元できる。","sourceRevisionIds":["source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45","source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"cake値(5,0,0),(4,0,0),(0,7,0),(0,6,0)、K=2。","procedure":["最初二つをXでpair化し価格9、後ろ二つをYでpair化し13。","各cake最大値の総和22が上界で同じ値を達成。"],"executionTarget":null,"expectedResult":"22。","verificationStatus":"not_applicable","learningUnitIds":["unit-lagrangian-relaxation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"prerequisiteIds":["unit-basic-convex-optimization","unit-dp-subset-state"],"attainmentCondition":"二cake(5,0,0),(0,7,0)で各々最大を足して12か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"7。"},"answer":{"reasoningOrVerification":"同categoryに二個選ぶ必要がある。pair価格はmax(5,7,0)=7で、X/Y各1のodd選択は不可。","procedure":["具体例の各状態・寄与を再計算する。","同categoryに二個選ぶ必要がある。pair価格はmax(5,7,0)=7で、X/Y各1のodd選択は不可。"],"expectedResult":"7。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

ちょうどi pairの最適値M_iは離散凹であるため、選択一個あたりpenalty cを引くAlien DPから指定Kを復元できる。

採用する候補: 半整数penalty cを二分探索し、3 category parityの8-state DPでpenalized valueと選択数を同時最適化する

固定cでは各cakeを未選択またはX/Y/Zいずれかで選ぶだけなのでO(N)。argmax pair数の単調性からO(N log maxValue)でKに対応するcを見つけ、M_K=f(c)+2Kcを得られる。

棄却する候補: cakeのK disjoint pairと各pairのmax categoryを直接DPする

pair候補Θ(N²)とmatching constraintが絡み、N=10^5では扱えない。

各categoryの選択数が偶数なら、同category内で任意に二つずつpairにして、そのpair価格は割当category和以上なので緩和にgapがない。

DP tie-breakで選択数も保持し、penalty増加に対して最適選択pair数が単調に減るよう一貫した側を選ぶ。

penaltyを2倍整数qで表し、各選択valueを2V-qとする。8 parity stateでcakeをskip/X/Y/Z選択し、valueと個数をlexicographic更新する。pair数とKの比較でqをbinary searchし、最終penalized optimumへ2Kcを戻して2で割る。

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

各pair価格を最大化したcategoryへ二cakeを割り当てるとcategory個数は偶数。逆に各categoryの偶数選択をpair化すればpair価格は割当値以上なので、この緩和は元最適値と一致する。8parity DPは各cake高々一選択を守り、penaltyを引いて全個数別凹最適列の支持線を得る。指定Kを跨ぐpenaltyを選び2Kcを戻すことでその最適値を復元できる。

## 実装上の注意

- half-integer cは全値を2倍してexact整数化する。DPは(value,selected count)を同じtie規約で比較し、selected countは2iなのでpair数へ直す。

## 復習の核

- N≤10で全matching・全category割当を列挙し、M_iの凹性、penalty境界tie、K=1,N/2を比較する。

## 計算量と制約

### 時間

O(N log V)の整数penalty binary searchと8状態DP。V=max coordinate≤10^9。

### 空間

O(N+8)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 1000; 2\leq N \leq 10^5; The sum of N over all test cases in each input file is at most 10^5.; 1\leq K \leq \lfloor \frac{N}{2}\rfloor (For a real number x, \lfloor x\rfloor denotes the greatest integer not exceeding x.); 0\leq X_i,Y_i,Z_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

cake値(5,0,0),(4,0,0),(0,7,0),(0,6,0)、K=2。

1. 最初二つをXでpair化し価格9、後ろ二つをYでpair化し13。
2. 各cake最大値の総和22が上界で同じ値を達成。

期待される結果: 22。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二cake(5,0,0),(0,7,0)で各々最大を足して12か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同categoryに二個選ぶ必要がある。pair価格はmax(5,7,0)=7で、X/Y各1のodd選択は不可。

確認結果: 7。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/editorial/12631) — source-abc400-editorial-12631-f059ba151278c6cfcd1113f1f3e063cc6a5be17549469e5660b968e5cd06fd45
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/tasks/abc400_g) — source-abc400-g-problem-b0b0a4b77c1e4b6523fc08542c0a9b783a186dac8012bdac14b4e12a62b20721
