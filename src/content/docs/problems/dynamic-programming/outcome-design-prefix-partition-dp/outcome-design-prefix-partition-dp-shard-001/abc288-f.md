---
title: "ABC288-F — Integer Division"
draft: true
authoringUnit: {"problemId":"abc288-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc288-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc288-editorial-5667-d41bd1feaccc5841e9212144b8ff4f65dd05dd41017569ad5aef4434fc2a0a8f","source-abc288-f-problem-2a611b7afef5d226a91904818b9c889ce3c20ae510e938e77bae7976ec80bd70"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最後blockへ次digitを連結すると各分割積の末尾因子は十倍されdp旧値の10倍を作る。次digitの加算寄与は全旧切れ目prefix積和に比例するので d_iΣdp_j。これに新block開始も含まれ、最後blockの切れ目分類で全分割を一度ずつ数える。","sourceRevisionIds":["source-abc288-editorial-5667-d41bd1feaccc5841e9212144b8ff4f65dd05dd41017569ad5aef4434fc2a0a8f","source-abc288-f-problem-2a611b7afef5d226a91904818b9c889ce3c20ae510e938e77bae7976ec80bd70"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

## 考察

最後のsplit位置をjとすると、prefix X[1,j]の全分割積へ最後の整数X[j+1,i]を掛けるので、dp_i=Σ_{j=0}^{i-1}dp_j·X[j+1,i]となる。 substring整数は末尾digit d_iを付けるとX[j+1,i]=10X[j+1,i-1]+d_iになり、二次和を前段DPとprefix sumへまとめられる。 10dp_{i-1}は、以前の全最後blockを1桁左shiftした寄与の総和に一致する。 新digit d_iは最後のsplit jにかかわらずd_i·dp_jとして加わるため、Σ_{j=0}^{i-1}dp_jだけ保持すればよい。 dp_0=1は先頭から1blockを作るj=0の空prefixの積を表すが、i=1は一般式の10dp_0を含めず別初期化する。

採用する候補: dp_iの最後のsplitによる和を式変形し、dp prefix sumを持って一次漸化式で更新する。

全split候補の寄与を10dp_{i-1}+d_iΣdp_jへ集約し、N≤2×10^5を線形走査できる。

棄却する候補: 各末尾iで最後のsplit jを全列挙し、substring値を計算して加算する。

状態ごとにO(i)候補があり、合計O(N^2)になる。

棄却する候補: 2^{N-1}通りのsplit subsetを生成して積を求める。

split位置ごとの二択を直接列挙すると指数時間になる。

10dp_{i-1}は、以前の全最後blockを1桁左shiftした寄与の総和に一致する。

新digit d_iは最後のsplit jにかかわらずd_i·dp_jとして加わるため、Σ_{j=0}^{i-1}dp_jだけ保持すればよい。

dp_0=1は先頭から1blockを作るj=0の空prefixの積を表すが、i=1は一般式の10dp_0を含めず別初期化する。

mod 998244353でdp_0=1、dp_1=d_1、prefix=dp_0+dp_1とする。i=2..Nについてdp_i=10dp_{i-1}+d_i·prefix(dp_0..dp_{i-1})を計算し、prefixへdp_iを加える。最後のdp_Nを出力する。

## 典型の発動条件

### 最後の区切り位置DP

発動条件: 列を連続blockへ分割した全結果を数え上げるとき。

最後のblock開始位置で場合分けしてprefix解と結合する。

### 式変形による遷移集約

発動条件: 全過去状態との遷移weightが桁追加などの共通漸化式を持つとき。

前段の答えとdp累積和へ二次和を圧縮する。

## 問題固有の要素

最後の数を1桁伸ばす操作と直前で新しくsplitする操作を、10倍項とdigit×全prefix解の項として一度に数えられる。

別の問題へ持ち帰る視点: 分割DPでは「最後のblockを延長」と「新blockを開始」の寄与が少数のaggregateで表せないか式を展開する。

## 正当性

最後blockへ次digitを連結すると各分割積の末尾因子は十倍されdp旧値の10倍を作る。次digitの加算寄与は全旧切れ目prefix積和に比例するので d_iΣdp_j。これに新block開始も含まれ、最後blockの切れ目分類で全分割を一度ずつ数える。

## 実装上の注意

- i=1へ一般漸化式を適用すると不要な10dp_0が入るため、base caseを分ける。
- 各乗算・加算をmodで正規化し、digitは文字から整数へ変換する。

## 復習の核

- 2桁abで分割なしの10a+bと分割ありのabが漸化式のどの項から出るか展開し、dp_0とdp_1の初期化を確認する。

## 計算量と制約

### 時間

桁数N。prefix和更新で O(N)。

### 空間

直前dpと累積和 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; X has N digits in decimal representation, none of which is 0.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/editorial/5667) — source-abc288-editorial-5667-d41bd1feaccc5841e9212144b8ff4f65dd05dd41017569ad5aef4434fc2a0a8f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/tasks/abc288_f) — source-abc288-f-problem-2a611b7afef5d226a91904818b9c889ce3c20ae510e938e77bae7976ec80bd70
