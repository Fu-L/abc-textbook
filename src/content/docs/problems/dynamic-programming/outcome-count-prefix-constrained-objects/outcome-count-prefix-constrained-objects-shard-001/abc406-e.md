---
title: "ABC406-E — Popcount Sum 3"
draft: true
authoringUnit: {"problemId":"abc406-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc406-e.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp"],"sourceRevisionIds":["source-abc406-e-problem-e51929679a44007aaacf170f3736320107093a509f93b68a93ac184ce5f4dbb9","source-abc406-editorial-13044-83db9c133d58e1b20d93b55a7c8729b8132891f780ab91c9fa882dc4b477fe72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"N未満の整数は、上から見てNと初めて異なる1bitを0にする位置で一意分類される。その上位prefixは固定され、下位 d bitに必要個数の1を選ぶ。各 block の総和は lowerSum+prefix×countで、互いに素な block の加算は全[0,N)を一度ずつ覆う。popcount(N)=Kの場合のみN自身を追加して[0,N]を得る。","sourceRevisionIds":["source-abc406-e-problem-e51929679a44007aaacf170f3736320107093a509f93b68a93ac184ce5f4dbb9","source-abc406-editorial-13044-83db9c133d58e1b20d93b55a7c8729b8132891f780ab91c9fa882dc4b477fe72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=10,K=2。","procedure":["該当数を二進で列挙すると3=0011,5=0101,6=0110,9=1001,10=1010。","8のbitを0にする block の総和は3+5+6=14。","prefix8側から9とN自身10を足す。"],"executionTarget":null,"expectedResult":"33","verificationStatus":"not_applicable","learningUnitIds":["unit-digit-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"N自身を足さないとこの例はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"23。上限と一致する10は「最初に異なるbit」のどの block にも入らない。"},"answer":{"reasoningOrVerification":"23。上限と一致する10は「最初に異なるbit」のどの block にも入らない。","procedure":["具体例の各状態・寄与を再計算する。","23。上限と一致する10は「最初に異なるbit」のどの block にも入らない。"],"expectedResult":"23。上限と一致する10は「最初に異なるbit」のどの block にも入らない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

2^i 未満で popcount=j の数の個数 f(i,j) と総和 s(i,j) を持てば、下位 i bit を自由に選ぶブロックの寄与を O(1) で求められる。 N の 1 bit を上位から一つずつ 0 に変えた最初の位置で [0,N) を互いに素なブロックへ分割でき、残りの必要な 1 の個数だけが各ブロックを決める。 f(i,j)=f(i-1,j)+f(i-1,j-1)、s(i,j)=s(i-1,j)+s(i-1,j-1)+2^{i-1}f(i-1,j-1) で個数と値の総和を同時に遷移できる。 現在の N の 1 bit を 0 にしたブロックでは、既に確定した上位 prefix は全候補へ共通なので、その寄与は prefix×f(i,必要 popcount) となる。

採用する候補: 個数と総和を前計算した bit digit DP で、N の立っている bit を上位から走査する

各ブロックの下位 bit 寄与 s と確定済み上位値×個数 f を加え、最後に popcount(N)=K なら N 自身を加える。各 testcase O(log N)。

棄却する候補: 1 から N まで popcount を計算して条件を満たす値を足す

N は 2^60 未満まであり、T=100 なので数値を直接列挙できない。

f(i,j)=f(i-1,j)+f(i-1,j-1)、s(i,j)=s(i-1,j)+s(i-1,j-1)+2^{i-1}f(i-1,j-1) で個数と値の総和を同時に遷移できる。

現在の N の 1 bit を 0 にしたブロックでは、既に確定した上位 prefix は全候補へ共通なので、その寄与は prefix×f(i,必要 popcount) となる。

i,j≤60 の f,s を mod 998244353 で前計算する。N の set bit d を降順に見て、それ以前に確定した 1 の数を used、値を prefix とし、s(d,K-used)+prefix·f(d,K-used) を有効範囲なら加算する。最後に popcount(N)=K なら N を足す。

## 典型の発動条件

### bit digit DP

発動条件: 上限 N 以下で bit 個数など prefix 依存の条件を数えたり総和したりするとき。

N と初めて異なる 1 bit の位置ごとに下位自由ブロックを列挙する。

### 個数と総和の同時 DP

発動条件: 候補数だけでなく候補値の総和が必要なとき。

下位 bit の個数 f と総和 s を組にし、新たに立てる最高 bit の寄与を個数倍で加える。

## 問題固有の要素

候補値の総和を一つずつ生成せず、「共通 prefix の個数倍」と「自由 suffix の総和」へ分解する。

別の問題へ持ち帰る視点: digit DP で値の総和を求めるときは、状態ごとに通り数と数値和を対で持ち、固定桁の値を通り数倍して足す。

## 正当性

N未満の整数は、上から見てNと初めて異なる1bitを0にする位置で一意分類される。その上位prefixは固定され、下位 d bitに必要個数の1を選ぶ。各 block の総和は lowerSum+prefix×countで、互いに素な block の加算は全[0,N)を一度ずつ覆う。popcount(N)=Kの場合のみN自身を追加して[0,N]を得る。

## 実装上の注意

- 必要個数 K-used が負または d を超えるブロックは 0 とする。N 自身の加算を忘れず、2^i と総和は各演算で mod を取る。

## 復習の核

- N=1、K=1、Kがbit長より大きい場合、N=2^m-1、N自身だけが条件を満たす場合を小さい全列挙と比較する。

## 計算量と制約

### 時間

bit数 B=60、T case。個数・総和前計算 O(B²)、各上限の bit走査 O(B)、全体 O(B²+TB)。

### 空間

前計算二表 O(B²)、case を逐次処理すれば追加 O(B)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 100; 1 \leq N < 2^{60}; 1 \leq K \leq 60; T, N, and K are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=10,K=2。

1. 該当数を二進で列挙すると3=0011,5=0101,6=0110,9=1001,10=1010。
2. 8のbitを0にする block の総和は3+5+6=14。
3. prefix8側から9とN自身10を足す。

期待される結果: 33

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N自身を足さないとこの例はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

23。上限と一致する10は「最初に異なるbit」のどの block にも入らない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/tasks/abc406_e) — source-abc406-e-problem-e51929679a44007aaacf170f3736320107093a509f93b68a93ac184ce5f4dbb9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/editorial/13044) — source-abc406-editorial-13044-83db9c133d58e1b20d93b55a7c8729b8132891f780ab91c9fa882dc4b477fe72
