---
title: "ABC460-E — x + y ≡ x + y"
draft: true
authoringUnit: {"problemId":"abc460-e","docPath":"src/content/docs/problems/mathematics/outcome-solve-modular-constraints/outcome-solve-modular-constraints-shard-001/abc460-e.md","learningOutcomeIds":["outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-diophantine","unit-modular-arithmetic"],"excludedTopics":["可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。"],"tagIds":["tag-modular-congruence-crt"],"sourceRevisionIds":["source-abc460-e-problem-b06cfe7b70e5235e8e2c3330612d3ef7c853c68f3c2d33f60825f5bba53d008e","source-abc460-editorial-21009-f1b15c2f061916282d5a75f4e4924f3f810e46797634aaee40f4d173f7d63a0b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"d桁yのconcatは10^dx+y。合同の両辺からyを除くと(10^d−1)x≡0で、gcd gによりxはM/gの倍数に限り逆に全て成立する。yの値は桁数だけで関係するので各digit範囲の個数とvalid x数を掛け、互いに素な桁groupを足せば全ordered pairを一度数える。","sourceRevisionIds":["source-abc460-e-problem-b06cfe7b70e5235e8e2c3330612d3ef7c853c68f3c2d33f60825f5bba53d008e","source-abc460-editorial-21009-f1b15c2f061916282d5a75f4e4924f3f810e46797634aaee40f4d173f7d63a0b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-modular-constraints"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"1≤x,y≤2、M=3。","procedure":["yは一桁、10−1=9が3の倍数なのでxも全て許される。","四pairのconcat11,12,21,22はそれぞれx+yとmod3で一致。"],"executionTarget":null,"expectedResult":"4pair。","verificationStatus":"not_applicable","learningUnitIds":["unit-modular-congruence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-modular-constraints"],"prerequisiteIds":["unit-gcd-diophantine","unit-modular-arithmetic"],"attainmentCondition":"上限N=10,M=11では。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"10pair。"},"answer":{"reasoningOrVerification":"一桁yではxが11の倍数でなければならず0。二桁yは10だけ、99は11の倍数なので全x1..10が成立。","procedure":["具体例の各状態・寄与を再計算する。","一桁yではxが11の倍数でなければならず0。二桁yは10だけ、99は11の倍数なので全x1..10が成立。"],"expectedResult":"10pair。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次合同・CRTで解の類を統合する](src/content/docs/learn/number-theory/modular-congruence.md)

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 考察

concat(x,y)=x10^d+yなので、concat(x,y)≡x+y mod M は (10^d-1)x≡0 mod M に等しく、yは値ではなく桁数dだけが関係する。

採用する候補: d=1..19ごとに g=gcd(10^d-1,M) を求め、xが M/g の倍数である個数と、範囲内のd桁y個数を掛けて足す。

一次合同式 ax≡0 mod M の解は x≡0 mod M/gcd(a,M) と完全に特徴付けられ、桁数種類は定数個である。

棄却する候補: 全 x,y pairで実際にdecimal連結値を作り合同式を検査する。

候補pairが二乗個で、連結値は64 bitをoverflowし得る。

y項は合同式の両辺で打ち消し合い、10^d倍されたxの差だけが残る。

d桁yの個数は [10^{d-1},10^d-1] と問題のy上限の共通部分長で求められる。

pow10を128 bitまたは飽和で順に更新する。各dでa=10^d-1、step=M/gcd(a,M) とし floor(Xmax/step) をx個数にする。d桁y範囲をclipした個数との積を加算する。

## 典型の発動条件

### decimal連結の代数化

発動条件: concat値の合同条件を数えたいとき。

後半桁数の10冪shiftへ展開して共通項を消す。

### 一次合同式とgcd

発動条件: ax≡0 mod Mの範囲内解数を求めたいとき。

解のstep M/gcd(a,M) を導いて倍数を数える。

## 問題固有の要素

文字列表現の連結も桁数別に数式化すると、片方の具体値が条件から消える場合がある。

別の問題へ持ち帰る視点: 零右辺の一次合同式はmodular inverseではなくgcdで解集合の周期を得る。

## 正当性

d桁yのconcatは10^dx+y。合同の両辺からyを除くと(10^d−1)x≡0で、gcd gによりxはM/gの倍数に限り逆に全て成立する。yの値は桁数だけで関係するので各digit範囲の個数とvalid x数を掛け、互いに素な桁groupを足せば全ordered pairを一度数える。

## 実装上の注意

- 10^19はsigned64 bit範囲外なので128 bitまたは上限clipを使う。y=0を含むかと桁数定義を問題通りに扱う。

## 復習の核

- concat式からyが消える変形と ax≡0 の解stepを導き、各dのy範囲clipを境界値で確認する。

## 計算量と制約

### 時間

各case O(log_{10}N·log M)。桁groupごとのgcdと個数計算。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^4; 1 \leq N \leq 10^{18}; 2 \leq M \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

1≤x,y≤2、M=3。

1. yは一桁、10−1=9が3の倍数なのでxも全て許される。
2. 四pairのconcat11,12,21,22はそれぞれx+yとmod3で一致。

期待される結果: 4pair。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

上限N=10,M=11では。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一桁yではxが11の倍数でなければならず0。二桁yは10だけ、99は11の倍数なので全x1..10が成立。

確認結果: 10pair。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/tasks/abc460_e) — source-abc460-e-problem-b06cfe7b70e5235e8e2c3330612d3ef7c853c68f3c2d33f60825f5bba53d008e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/editorial/21009) — source-abc460-editorial-21009-f1b15c2f061916282d5a75f4e4924f3f810e46797634aaee40f4d173f7d63a0b
