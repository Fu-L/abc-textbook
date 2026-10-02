---
title: "ABC336-E — Digit Sum Divisible"
draft: true
authoringUnit: {"problemId":"abc336-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc336-e.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp"],"sourceRevisionIds":["source-abc336-e-problem-e1a185c27eed4201034135246aad460cf12596817fb0cb9ae3fed94d4e8002d1","source-abc336-editorial-9055-6a942b7bd8833f100c70ec690df54f13212b43499edea2e3bf42486a83c9f66d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正整数xは桁和sを一意に持つので、sを固定した対象集合は互いに重複しない。digit DPは処理済み桁の桁和・x mod s・Nのprefixとの比較を持ち、次digit dで和へd、剰余へ10r+dを加える。これらは条件判定に必要十分で、全digit列を一度だけ表す。最後に桁和sかつ剰余0を取ると、ちょうどxがその桁和で割り切れる条件になる。leading zeroは一意のpaddingであり、s≥1なので整数0は受理されない。全sの和が求める個数である。","sourceRevisionIds":["source-abc336-e-problem-e1a185c27eed4201034135246aad460cf12596817fb0cb9ae3fed94d4e8002d1","source-abc336-editorial-9055-6a942b7bd8833f100c70ec690df54f13212b43499edea2e3bf42486a83c9f66d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=12。","procedure":["1..9は全てgood、10はsum1、12はsum3で割れる。","11はsum2で割れない。"],"executionTarget":null,"expectedResult":"good整数11個。","verificationStatus":"not_applicable","learningUnitIds":["unit-digit-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"leading zeroが許されたDPにより0を数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"sは1以上を列挙し最終sum=sなので0は入らない。一意の桁paddingは各正整数を一回だけ表す。"},"answer":{"reasoningOrVerification":"sは1以上を列挙し最終sum=sなので0は入らない。一意の桁paddingは各正整数を一回だけ表す。","procedure":["具体例の各状態・寄与を再計算する。","sは1以上を列挙し最終sum=sなので0は入らない。一意の桁paddingは各正整数を一回だけ表す。"],"expectedResult":"sは1以上を列挙し最終sum=sなので0は入らない。一意の桁paddingは各正整数を一回だけ表す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

条件n mod digitSum(n)=0ではmodulus自体が桁選択で変わるため、そのまま一つの桁DP状態に入れにくい。先に最終桁和sを固定すれば、桁和sかつn mod s=0という通常の有限状態DPになる。

採用する候補: 可能な桁和sを全探索し、各sについて桁和・剰余付きdigit DPを行う

最大桁和は高々9×桁数で小さく、変動する除数を外側loopへ分離できる。

棄却する候補: 1からNまで各整数の桁和と剰余を直接調べる

Nは10^14まであり線形列挙できない。

固定したsごとに、上位d桁までのdigit sum i、値mod s=j、Nのprefixと一致中か未満かを持てば、次digit tで(i+t,(10j+t) mod s)へ遷移できる。最終状態(i,j)=(s,0)だけがそのsのgood整数を数える。

Nをdecimal digit列にし、s=1から9×桁数まで繰り返す。dp[pos][sum][rem][tight]を0初期化しdp[0][0][0][1]=1、許される次digitを配る。全桁後のdp[L][s][0][0/1]を加算する。

## 典型の発動条件

### parameter固定によるdigit DP

発動条件: 桁から決まる値が同時にmodulusとして使われ、状態遷移の法が未確定である。

最終digit sum sを外側で固定し、各DP内では剰余状態0,…,s-1を使う。

### 上限制約付き桁DP

発動条件: 0≤n≤Nのうち桁和と剰余条件を満たす個数を数える。

tight flagでN prefixとの大小を持ち、leading zeroを許して固定長列として処理する。

## 問題固有の要素

各正整数は桁和sをただ一つ持つので、sごとの数え上げは重複せず、その和が答えになる。

別の問題へ持ち帰る視点: 状態遷移のmodulusや目標値が対象自身から決まる場合、取り得る小範囲を外側列挙すると通常DPへ戻せる。

## 正当性

正整数xは桁和sを一意に持つので、sを固定した対象集合は互いに重複しない。digit DPは処理済み桁の桁和・x mod s・Nのprefixとの比較を持ち、次digit dで和へd、剰余へ10r+dを加える。これらは条件判定に必要十分で、全digit列を一度だけ表す。最後に桁和sかつ剰余0を取ると、ちょうどxがその桁和で割り切れる条件になる。leading zeroは一意のpaddingであり、s≥1なので整数0は受理されない。全sの和が求める個数である。

## 実装上の注意

- leading zeroで表した0はs≥1の最終桁和条件を満たさず自動除外される。sum>sの遷移を切り、N=10^14でも安全な最大sを桁数から取る。

## 復習の核

- 小さいNで1…Nを直接列挙し、9の繰上がり境界、N自身を含むtight状態、桁和1・最大付近のsを比較する。

## 計算量と制約

### 時間

O(D(9D)³)、DはNの十進桁数、固定sのsum×remainder状態を全sで走査。

### 空間

O((9D)²)、pos方向rolling。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{14}; N is an integer.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=12。

1. 1..9は全てgood、10はsum1、12はsum3で割れる。
2. 11はsum2で割れない。

期待される結果: good整数11個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

leading zeroが許されたDPにより0を数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

sは1以上を列挙し最終sum=sなので0は入らない。一意の桁paddingは各正整数を一回だけ表す。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/tasks/abc336_e) — source-abc336-e-problem-e1a185c27eed4201034135246aad460cf12596817fb0cb9ae3fed94d4e8002d1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/editorial/9055) — source-abc336-editorial-9055-6a942b7bd8833f100c70ec690df54f13212b43499edea2e3bf42486a83c9f66d
