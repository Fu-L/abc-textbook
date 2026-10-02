---
title: "ABC212-G — Power Pair"
draft: true
authoringUnit: {"problemId":"abc212-g","docPath":"src/content/docs/problems/mathematics/outcome-count-through-cyclic-exponents/outcome-count-through-cyclic-exponents-shard-001/abc212-g.md","learningOutcomeIds":["outcome-count-through-cyclic-exponents"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-divisor-mobius-inversion","unit-gcd-structure","unit-multiplicative-order-periods","unit-prime-divisor"],"excludedTopics":["乗法的位数から最小周期だけを求める問題。"],"tagIds":["tag-cyclic-exponent-counting","tag-divisor-mobius-inversion","tag-gcd-structure","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc212-editorial-2289-49aaac05cb6d52e864368fbc58b708e72c1fec51fdad952bf09ce972fe3c3e05","source-abc212-g-problem-f65fb746f6879413a4cd941249813537299f67580d7a2dabd97fb9216f17b9d5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非零剰余を原始根の指数aに写す。an≡bの可解条件はgcd(a,P−1)|bなので到達先数は(P−1)/g。gcdがgの指数数f(g)は、gの倍数である指数(P−1)/g個からgcdが真の倍数である分を除くことで得られる。よってΣf(g)(P−1)/gは全非零組を一度数え、最後の1が(0,0)を補う。","sourceRevisionIds":["source-abc212-editorial-2289-49aaac05cb6d52e864368fbc58b708e72c1fec51fdad952bf09ce972fe3c3e05","source-abc212-g-problem-f65fb746f6879413a4cd941249813537299f67580d7a2dabd97fb9216f17b9d5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-through-cyclic-exponents"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=5。","procedure":["x=1の到達先は{1}、x=2,3は{1,2,3,4}、x=4は{1,4}。","非零寄与1+4+4+2に零の1組を加える。"],"executionTarget":null,"expectedResult":"12組。","verificationStatus":"not_applicable","learningUnitIds":["unit-cyclic-group-exponent-counting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-through-cyclic-exponents"],"prerequisiteIds":["unit-divisor-mobius-inversion","unit-gcd-structure","unit-multiplicative-order-periods","unit-prime-divisor"],"attainmentCondition":"P=2では答えはいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2組。"},"answer":{"reasoningOrVerification":"非零組(1,1)と零の組(0,0)だけ。位数1の約数項も1となる。","procedure":["具体例の各状態・寄与を再計算する。","非零組(1,1)と零の組(0,0)だけ。位数1の約数項も1となる。"],"expectedResult":"2組。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [巡回群を指数化して数える](src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)

- 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)
- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md)
- [乗法的位数から最小周期を求める](src/content/docs/learn/number-theory/multiplicative-order-periods.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 乗法的位数から最小周期だけを求める問題。

## 考察

x=0 なら正の整数 n に対して x^n=0 なので、寄与する組は (x,y)=(0,0) の 1 組だけである。残る非零剰余を乗法群として扱えばよい。

P が素数なので非零剰余は位数 m=P-1 の巡回群をなす。原始根 r を取り x=r^a,y=r^b と書くと、ある n で x^n=y となる条件は an≡b (mod m) へ移る。

採用する候補: 原始根の指数へ写し、g=gcd(m,a) ごとに指数 a の個数と到達可能な b の個数を約数上で集約する。

寄与は g=gcd(m,a) だけで決まり、g は m の約数に限られる。m<10^12 の約数数は高々 6720 なので、約数列挙と約数間の差し引きで制約内に収まる。

棄却する候補: a=1..m を全走査し、各 a について m/gcd(m,a) を答えへ加える。

式自体は正しいが O(P) となり P≤10^12 に間に合わないため、同じ gcd を持つ a をまとめる必要がある。

an≡b (mod m) が n について解を持つのは gcd(m,a) が b を割るときに限る。したがって固定した a から到達できる b は m/gcd(m,a) 個であり、a の gcd ごとに寄与をまとめられる。

m の約数を降順に処理し、f(g)=m/g−Σ_{h:g|h,h>g}f(h) により gcd(m,a)=g となる a の個数を求める。最後に (0,0) の寄与を含む 1+Σ_g f(g)(m/g) を mod 998244353 で計算する。

## 典型の発動条件

### 原始根による指数化

発動条件: 素数法の非零剰余に積と冪が現れるとき。

乗法群を Z/(P-1)Z の加法的な指数へ写す。

### 約数上の包除的集計

発動条件: 値が gcd(P-1,a) のみに依存するとき。

倍数側の個数を大きい約数から差し引き、gcd が各約数に等しい個数を得る。

## 問題固有の要素

x=0 を非零剰余の巡回群から先に分離すると、残りを原始根の指数だけで統一できる。

別の問題へ持ち帰る視点: 演算が有限体の乗法に閉じる部分と例外値を分け、群構造へ写せる範囲を確認する。

## 正当性

非零剰余を原始根の指数aに写す。an≡bの可解条件はgcd(a,P−1)|bなので到達先数は(P−1)/g。gcdがgの指数数f(g)は、gの倍数である指数(P−1)/g個からgcdが真の倍数である分を除くことで得られる。よってΣf(g)(P−1)/gは全非零組を一度数え、最後の1が(0,0)を補う。

## 実装上の注意

- m の全約数を列挙して大きい順に処理し、f(g) からは g の真の倍数に対応する既計算値だけを差し引く。最後に巡回群外の (0,0) を 1 組加える。
- m/g と f(g) はそれぞれ 10^12 規模になり得るため、両因子を mod 998244353 へ落としてから 64-bit 整数で掛ける。

## 復習の核

- 固定した a に対する冪写像の像の大きさを gcd から再導出し、P=2 を含む小さい素数で (0,0) の 1 組と約数上の差し引きを全列挙結果に照合する。

## 計算量と制約

### 時間

O(√P+D²)、D=τ(P−1)。約数間の倍数関係を全対比較する。

### 空間

O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq P \leq 10^{12}; P is a prime number.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=5。

1. x=1の到達先は{1}、x=2,3は{1,2,3,4}、x=4は{1,4}。
2. 非零寄与1+4+4+2に零の1組を加える。

期待される結果: 12組。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

P=2では答えはいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

非零組(1,1)と零の組(0,0)だけ。位数1の約数項も1となる。

確認結果: 2組。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/editorial/2289) — source-abc212-editorial-2289-49aaac05cb6d52e864368fbc58b708e72c1fec51fdad952bf09ce972fe3c3e05
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/tasks/abc212_g) — source-abc212-g-problem-f65fb746f6879413a4cd941249813537299f67580d7a2dabd97fb9216f17b9d5
