---
title: "ABC465-G — Sum of Mex of Mod of Linear"
draft: true
authoringUnit: {"problemId":"abc465-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc465-g.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-ordered-set-multiset","unit-prefix-aggregate"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition","tag-coordinate-compression","tag-prefix-difference"],"sourceRevisionIds":["source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f","source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"c_xは合同式 Ck+x≡0 mod M のk個数で全query不変なので、必要なx座標だけでprefix sumを前計算できる。 toggle点の左右が同runか別runかにより、局所変化は新run生成・端延長・二run結合またはその逆の定数caseに限られる。 一つのrun [l,r] はその内部startのd_xがr-x+1となる三角形状寄与を持ち、run merge/split差は少数のc区間和・重み付き区間和だけで表せる。","sourceRevisionIds":["source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f","source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"重みc_0=2,c_1=1、run[0,1]、他は欠けている局所寄与。","procedure":["連続長はd_0=2,d_1=1なので寄与2·2+1·1=5。","剰余1をtoggleで除くとrun[0,0]となる。"],"executionTarget":null,"expectedResult":"局所寄与は5から2へ減る。","verificationStatus":"not_applicable","learningUnitIds":["unit-ordered-interval-partition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"prerequisiteIds":["unit-coordinate-compression","unit-ordered-set-multiset","unit-prefix-aggregate"],"attainmentCondition":"全周埋まりも同じ有限run式でよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"欠けた境界がなく通常のrun終端を定義できないため不可。全周と一欠けを専用caseで扱う。"},"answer":{"reasoningOrVerification":"欠けた境界がなく通常のrun終端を定義できないため不可。全周と一欠けを専用caseで扱う。","procedure":["具体例の各状態・寄与を再計算する。","欠けた境界がなく通常のrun終端を定義できないため不可。全周と一欠けを専用caseで扱う。"],"expectedResult":"欠けた境界がなく通常のrun終端を定義できないため不可。全周と一欠けを専用caseで扱う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各start剰余xからA上を円環連続して進める長さd_xを定めると、mex総和は固定weight c_xとの内積 Σc_xd_x になる。queryで変わるのはAの連続run境界だけである。

採用する候補: Aに含まれる剰余を円環interval集合として管理し、toggle前後で分割・結合されるrunが答えへ与える差を、c_xの座標圧縮prefix sumからO(1)区間式で加減する。

一つのrun [l,r] はその内部startのd_xがr-x+1となる三角形状寄与を持ち、run merge/split差は少数のc区間和・重み付き区間和だけで表せる。

棄却する候補: 各query後に全x=0..M-1でd_xを一つずつ延ばし、Σc_xd_xを再計算する。

Mが大きく全剰余を走査できず、Aの要素数Nだけが小さい疎性を利用していない。

c_xは合同式 Ck+x≡0 mod M のk個数で全query不変なので、必要なx座標だけでprefix sumを前計算できる。

toggle点の左右が同runか別runかにより、局所変化は新run生成・端延長・二run結合またはその逆の定数caseに限られる。

queryに現れる座標と必要境界でc_xおよびc_x×xのprefixを用意する。ordered setでAのrun端を円環上に保持し、toggle時に左右neighborを探して旧run寄与を引き新run寄与を足す。全M剰余が埋まるcaseと一欠けcaseを別前計算する。

## 典型の発動条件

### 円環runの動的merge・split

発動条件: subset toggleで連続区間長由来の総和を維持したいとき。

前後neighborから局所runだけを削除・追加する。

### 固定weightの区間moment

発動条件: run内で距離に一次なweight総和を繰り返し求めるとき。

query座標と必要境界をsort-uniqueしてdense indexへ写し、Σc_xとΣxc_xのprefixから閉形式寄与を得る。

## 問題固有の要素

mexの各queryを直接追わず、start剰余ごとの連続被覆長d_xへ二重和を交換する。

別の問題へ持ち帰る視点: dynamic binary circleのglobal統計は、run寄与関数が区間momentで計算できれば局所merge/splitだけで維持できる。

## 正当性

c_xは合同式 Ck+x≡0 mod M のk個数で全query不変なので、必要なx座標だけでprefix sumを前計算できる。 toggle点の左右が同runか別runかにより、局所変化は新run生成・端延長・二run結合またはその逆の定数caseに限られる。 一つのrun [l,r] はその内部startのd_xがr-x+1となる三角形状寄与を持ち、run merge/split差は少数のc区間和・重み付き区間和だけで表せる。

## 実装上の注意

- 0とM-1を跨ぐrunを二倍座標または専用caseで扱い、全周埋まりでは通常の境界探索を使わない。cの合同式解数を正確に計算する。

## 復習の核

- 一runが各startのd_xへ作る寄与を式にし、点toggleの四つの左右在否caseで旧新run差を確認する。

## 計算量と制約

### 時間

座標数K=O(Q)として前処理O(K log K+K log M)、Q toggleはO(Q log Q)。合同式のgcd/逆元をlog Mで求める。

### 空間

O(K+Q)、run集合とc,cxのprefix。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; 0\le C < M \le 10^9; 1\le K\le 10^9; 0\le A_i < M; 1\le Q\le 2\times 10^5; 1\le i_q \le N; 0\le X_q < M; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

重みc_0=2,c_1=1、run[0,1]、他は欠けている局所寄与。

1. 連続長はd_0=2,d_1=1なので寄与2·2+1·1=5。
2. 剰余1をtoggleで除くとrun[0,0]となる。

期待される結果: 局所寄与は5から2へ減る。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全周埋まりも同じ有限run式でよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

欠けた境界がなく通常のrun終端を定義できないため不可。全周と一欠けを専用caseで扱う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/editorial/22419) — source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/tasks/abc465_g) — source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601
