---
title: "ABC226-F — Score of Permutations"
draft: true
authoringUnit: {"problemId":"abc226-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc226-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-bounded-enumeration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc226-editorial-2878-2de04cf0703a44bc099836c041ba9edc8d01da823227f38738ef602d5dbe9e10","source-abc226-f-problem-445d4ec66745084a734b87bfa5c86445e188cebfd19fc703876bb5f7b890cdba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"順列の全体周期は巡回長のLCM。頻度f_lのcycle typeの個数はN!/Π(l^{f_l}f_l!)で、巡回回転と同長巡回の交換を除いている。非減少な巡回長のDFSは全typeを一度列挙するので、その個数にLCM^Kを掛けた和が全順列のスコア和になる。","sourceRevisionIds":["source-abc226-editorial-2878-2de04cf0703a44bc099836c041ba9edc8d01da823227f38738ef602d5dbe9e10","source-abc226-f-problem-445d4ec66745084a734b87bfa5c86445e188cebfd19fc703876bb5f7b890cdba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、K=1。","procedure":["type 1+1+1は1個で周期1、2+1は3個で周期2、3は2個で周期3。","1+3·2+2·3を計算する。"],"executionTarget":null,"expectedResult":"13。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":["unit-bounded-enumeration","unit-modular-arithmetic"],"attainmentCondition":"N=4で長さ2の巡回2個の順列数は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"3個。"},"answer":{"reasoningOrVerification":"4!/(2²·2!)=3。巡回回転だけでなく二つの巡回の交換も除く。","procedure":["具体例の各状態・寄与を再計算する。","4!/(2²·2!)=3。巡回回転だけでなく二つの巡回の交換も除く。"],"expectedResult":"3個。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

順列を矢印 i→p_i で描くと互いに素な巡回へ分解され、全てのボールが戻る時刻は巡回長の最小公倍数になる。誰が各巡回に属するかはスコアへ影響しない。

採用する候補: Nの整数分割として巡回長の多重集合を列挙し、そのcycle typeを持つ順列数と巡回長LCMのK乗の積を加算する。

N=50ではN!個の順列は扱えないが整数分割数は十分小さく、同じ巡回長頻度を持つ順列を一状態へ同一視できる。

棄却する候補: 全順列を生成し、ボールが戻るまで操作をシミュレーションする。

順列数N!が支配的で、各順列の周期を高速に求めてもN=50には全く届かない。

長さlの巡回がf_l個あるcycle typeの順列数は N!/Π_l(l^(f_l)·f_l!) であり、頂点の分割順と各巡回の回転同値をまとめて除いている。

同じcycle typeではスコアが lcm({l | f_l>0}) に等しいため、個々の順列を復元せず頻度とLCMだけで全寄与を計算できる。

非減少な巡回長を選ぶDFSで総和Nの整数分割を列挙し、各頻度の順列数を階乗・逆元で求め、count×lcm^Kを998244353で加算する。

## 典型の発動条件

### 順列の巡回分解

発動条件: 順列を同時に繰り返し適用し、元へ戻る周期や不変な軌道が評価に現れるとき。

各軌道を巡回置換として分解し、全体周期を巡回長のLCMとして求める。

### cycle typeの整数分割列挙

発動条件: 順列の評価が各要素の名前でなく巡回長の多重集合だけに依存し、Nが50程度のとき。

Nの整数分割を列挙し、同じ巡回構造の順列を組合せ係数でまとめて数える。

## 問題固有の要素

ボールの所有者という属人的な状態を捨て、巡回長だけを残すと、N!個の過程がNの整数分割個へ圧縮される。

別の問題へ持ち帰る視点: 置換過程の総和では、評価が共役類すなわちcycle typeだけで決まらないかを確認し、ラベル付き対象を型別にまとめる。

## 正当性

順列の全体周期は巡回長のLCM。頻度f_lのcycle typeの個数はN!/Π(l^{f_l}f_l!)で、巡回回転と同長巡回の交換を除いている。非減少な巡回長のDFSは全typeを一度列挙するので、その個数にLCM^Kを掛けた和が全順列のスコア和になる。

## 実装上の注意

- 同じ長さの巡回のf!と各巡回の回転lを両方除く。LCM更新とK乗は整数値とmod値を混同せず、整数分割を重複なく列挙する。

## 復習の核

- 順列を繰り返す問題では、まず矢印を描いて巡回長を出し、答えが要素名を忘れてcycle typeだけで決まるかを見る。

## 計算量と制約

### 時間

O(Π(N)(N log N+log K))を上界とする。Π(N)は整数分割数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 50; 1 \leq K \leq 10^4; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、K=1。

1. type 1+1+1は1個で周期1、2+1は3個で周期2、3は2個で周期3。
2. 1+3·2+2·3を計算する。

期待される結果: 13。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=4で長さ2の巡回2個の順列数は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

4!/(2²·2!)=3。巡回回転だけでなく二つの巡回の交換も除く。

確認結果: 3個。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/editorial/2878) — source-abc226-editorial-2878-2de04cf0703a44bc099836c041ba9edc8d01da823227f38738ef602d5dbe9e10
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/tasks/abc226_f) — source-abc226-f-problem-445d4ec66745084a734b87bfa5c86445e188cebfd19fc703876bb5f7b890cdba
