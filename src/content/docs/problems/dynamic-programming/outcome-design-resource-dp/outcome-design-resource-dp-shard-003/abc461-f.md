---
title: "ABC461-F — Total Product is N"
draft: true
authoringUnit: {"problemId":"abc461-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-003/abc461-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prime-divisor"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc461-editorial-21376-54e77a943453eb6254ddeefdc7218c2812108ca0cb4cab3d03be43a9dce947ea","source-abc461-f-problem-367794ea99529987124048cd99ef50750e517d58f20c34f06a7b261542d89710"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"積Nの各要素は約数であり、相異なる条件から約数を0/1選択する。dp0は選択個数と積別の個数、dp1はその全score和。約数dを追加すると各旧集合のscoreにdが足されるので新score和はold1+d×old0。非採用と採用を併合する帰納法で集合を一度ずつ数える。b個の相異なる要素はちょうどb!通りに並べ替えられscoreは不変。従ってdp1[b,N]b!の総和が全列score。b個の異なる正数の積は最低b!なのでBで打ち切れる。","sourceRevisionIds":["source-abc461-editorial-21376-54e77a943453eb6254ddeefdc7218c2812108ca0cb4cab3d03be43a9dce947ea","source-abc461-f-problem-367794ea99529987124048cd99ef50750e517d58f20c34f06a7b261542d89710"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=6。","procedure":["unordered集合は{6},{1,6},{2,3},{1,2,3}。","score寄与は6×1!,7×2!,5×2!,6×3!。","6+14+10+36。"],"executionTarget":null,"expectedResult":"66","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design","unit-prime-divisor"],"attainmentCondition":"約数1を繰り返し使うunbounded DPでもよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。各要素相異なる条件を破り1を任意回追加できて無限の列を作ってしまう。0/1で1も一度だけ選ぶ。"},"answer":{"reasoningOrVerification":"不可。各要素相異なる条件を破り1を任意回追加できて無限の列を作ってしまう。0/1で1も一度だけ選ぶ。","procedure":["具体例の各状態・寄与を再計算する。","不可。各要素相異なる条件を破り1を任意回追加できて無限の列を作ってしまう。0/1で1も一度だけ選ぶ。"],"expectedResult":"不可。各要素相異なる条件を破り1を任意回追加できて無限の列を作ってしまう。0/1で1も一度だけ選ぶ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

積がNになる選択要素は全てNの約数で、要素数bも小さい。unordered tupleの選択を数えた後にb!を掛ければ順序付き列へ戻せる。 dp1のselect遷移は旧score総和に、全旧選択それぞれへ新値d_aを足す項 dp0×d_a を加える。 1を含めてもdistinct約数を一度ずつ選ぶ0/1 DPなので、選択個数は積制約から14以下に限定できる。

採用する候補: Nの約数d_aを列挙し、選択個数b・現在積cごとに選び方数dp0と選択値総和dp1を持つ0/1 knapsackを行う。

d_aを選べるのはcがd_aの倍数の場合だけで、遷移元積c/d_aも約数である。N≤10^10では約数数≤2304、b≤14なので状態数が収まる。

棄却する候補: 積Nとなる順序付き正整数列を全factorization treeとして列挙する。

factorの順序分岐と長さ分岐が大きく、同じmultisetをb!回重複して探索する。

dp1のselect遷移は旧score総和に、全旧選択それぞれへ新値d_aを足す項 dp0×d_a を加える。

1を含めてもdistinct約数を一度ずつ選ぶ0/1 DPなので、選択個数は積制約から14以下に限定できる。

全約数をsortし積値からindexへのmapを作る。各dについてbを降順、積cを走査し、c%d=0ならdp0[b][c]+=old0[b-1][c/d]、dp1+=old1+old0×d と更新する。Σ_b dp1[b][N]b!を返す。

## 典型の発動条件

### 約数集合上の積knapsack

発動条件: 選択要素の総積が固定Nで、候補がNの約数に限られるとき。

積stateを約数indexへ圧縮して0/1選択する。

### 個数とscore総和の同時DP

発動条件: 全組合せの個数だけでなく選択値和などの総scoreが必要なとき。

count×新規寄与をscore遷移へ追加する。

## 問題固有の要素

積制約DPでは値域を1..Nで持たず、到達し得るNの約数だけへ圧縮する。

別の問題へ持ち帰る視点: 順序付きobjectを直接列挙せず、distinct要素multisetを数えて最後にfactorialで順序を付ける。

## 正当性

積Nの各要素は約数であり、相異なる条件から約数を0/1選択する。dp0は選択個数と積別の個数、dp1はその全score和。約数dを追加すると各旧集合のscoreにdが足されるので新score和はold1+d×old0。非採用と採用を併合する帰納法で集合を一度ずつ数える。b個の相異なる要素はちょうどb!通りに並べ替えられscoreは不変。従ってdp1[b,N]b!の総和が全列score。b個の異なる正数の積は最低b!なのでBで打ち切れる。

## 実装上の注意

- 0/1 DPなのでd処理中のbは降順に回し同じ約数を再利用しない。b=0のscore0基底とmod積を正しく置く。

## 復習の核

- 一要素dを追加した全選択のscore和が old1+old0×d になることと、最後のb!の意味を小さいNで確認する。

## 計算量と制約

### 時間

D=約数個数、B=max{b:b!≤N}≤13。試し割り約数列挙O(√N)、dp O(BD²)。hash indexなら期待O(√N+BD²)、index対応を前計算して配列参照なら確定的O(√N+D²log D+BD²)。

### 空間

二DP O(BD)、商index全pair前計算を持つならO(D²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{10}; The input value is an integer.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=6。

1. unordered集合は{6},{1,6},{2,3},{1,2,3}。
2. score寄与は6×1!,7×2!,5×2!,6×3!。
3. 6+14+10+36。

期待される結果: 66

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

約数1を繰り返し使うunbounded DPでもよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。各要素相異なる条件を破り1を任意回追加できて無限の列を作ってしまう。0/1で1も一度だけ選ぶ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/editorial/21376) — source-abc461-editorial-21376-54e77a943453eb6254ddeefdc7218c2812108ca0cb4cab3d03be43a9dce947ea
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/tasks/abc461_f) — source-abc461-f-problem-367794ea99529987124048cd99ef50750e517d58f20c34f06a7b261542d89710
