---
title: "ABC361-F — x = a^b"
draft: true
authoringUnit: {"problemId":"abc361-f","docPath":"src/content/docs/problems/mathematics/outcome-invert-divisor-lattice-by-mobius/outcome-invert-divisor-lattice-by-mobius-shard-001/abc361-f.md","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-integer-boundary-blocks","unit-prime-divisor"],"excludedTopics":["約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-divisor-mobius-inversion","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc361-editorial-10358-a150ea4a2fbe4c78b6ecdbba6ac264c5652569e14ab83b6e25de6cab90344650","source-abc361-f-problem-eef728e582539f23e3b9502a553c74df4a116920c76ead4002cce17170e21c6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"x>1の素因数指数gcdをgとすると完全冪はg>1と同値。−Σ_{b|g,b>1}μ(b)=1なので、各b乗数の個数floor(N^{1/b})−1をこの符号で足せば、複数指数を持つ値も一度だけ数える。x=1は別に1を加える。整数の飽和冪比較でroot境界を確定する。","sourceRevisionIds":["source-abc361-editorial-10358-a150ea4a2fbe4c78b6ecdbba6ac264c5652569e14ab83b6e25de6cab90344650","source-abc361-f-problem-eef728e582539f23e3b9502a553c74df4a116920c76ead4002cce17170e21c6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=16。","procedure":["完全冪は1,4,8,9,16。","平方から4,9,16、立方から8、四乗16は非square-free指数で補正不要。"],"executionTarget":null,"expectedResult":"5。","verificationStatus":"not_applicable","learningUnitIds":["unit-divisor-mobius-inversion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"prerequisiteIds":["unit-integer-boundary-blocks","unit-prime-divisor"],"attainmentCondition":"64を平方と立方の両方で数えると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"64は1回。"},"answer":{"reasoningOrVerification":"指数gcd6なのでb=2,3から二回足しb=6で一回引く。最終寄与1。","procedure":["具体例の各状態・寄与を再計算する。","指数gcd6なのでb=2,3から二回足しb=6で一回引く。最終寄与1。"],"expectedResult":"64は1回。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

x>1を素因数分解した指数の最大公約数gを取ると、x=a^bと表せる指数bはgの2以上の約数と一致する。よって完全冪の重複は指数側の約数関係で生じる。

N≤10^18では底a≥2に対する指数は60未満だけ調べればよく、各bについてa^b≤Nとなる底の最大値を安全な整数判定で求められる。

採用する候補: square-freeな指数bだけをMöbius符号付きで数え、floor(N^(1/b))−1を包除して最後にx=1を加える。

複数指数で表せる完全冪を、指数の素因数集合に対する包除でちょうど一度数えられる。

棄却する候補: 全てのa,bからa^bを生成してsetへ入れ、重複を除いて数える。

平方数だけでも底が10^9まであり、全生成物を保持・列挙できない。

bが平方因子を持つ項のMöbius係数は0で無視し、異なる素因数の個数が奇数なら加算、偶数なら減算する。

浮動小数のb乗根は境界で丸め誤差を起こすため、二分探索中の累乗をN超過時に打ち切る整数比較でfloor rootを確定する。

答えをx=1の1で始める。b=2..59についてbがsquare-freeかと素因数個数の偶奇を調べ、二分探索で最大a≥2 satisfying a^b≤Nを得る。その個数a−1を包除符号に従って加減する。

## 典型の発動条件

### 指数集合へのMöbius包除

発動条件: 同じ対象が複数の倍数・約数条件で表現されるとき。

square-free指数だけを素因数数のparityで符号付けして重複を消す。

### overflow-safe整数冪判定

発動条件: 大きな上限以下のk乗根を厳密に求めるとき。

乗算前にlimit/baseを比較し、超過を早期検出する二分探索を行う。

## 問題固有の要素

値xの重複表現を直接整理する代わりに、素因数指数のgcdが持つ素因数へ包除を掛けると分類が一意になる。

別の問題へ持ち帰る視点: 冪の重複は底ではなく指数のdivisibility latticeで見るとMöbius反転が現れる。

## 正当性

x>1の素因数指数gcdをgとすると完全冪はg>1と同値。−Σ_{b|g,b>1}μ(b)=1なので、各b乗数の個数floor(N^{1/b})−1をこの符号で足せば、複数指数を持つ値も一度だけ数える。x=1は別に1を加える。整数の飽和冪比較でroot境界を確定する。

## 実装上の注意

- a=1由来のx=1を別扱いし、各root個数からa=1を除く。累乗計算は掛け算後でなく前にoverflowを検知する。

## 復習の核

- 64=2^6のような値で指数2,3,6から何回数えられ符号和が1になるか確認する。root境界はk^b=Nと直前直後を必ず試す。

## 計算量と制約

### 時間

O((log N)³)を安全な整数root二分探索の上界とする。指数b≤59。

### 空間

O(log N)。指数のMöbius表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 10^{18}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=16。

1. 完全冪は1,4,8,9,16。
2. 平方から4,9,16、立方から8、四乗16は非square-free指数で補正不要。

期待される結果: 5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

64を平方と立方の両方で数えると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

指数gcd6なのでb=2,3から二回足しb=6で一回引く。最終寄与1。

確認結果: 64は1回。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/editorial/10358) — source-abc361-editorial-10358-a150ea4a2fbe4c78b6ecdbba6ac264c5652569e14ab83b6e25de6cab90344650
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/tasks/abc361_f) — source-abc361-f-problem-eef728e582539f23e3b9502a553c74df4a116920c76ead4002cce17170e21c6a
