---
title: "ABC429-G — Sum of Pow of Mod of Linear"
draft: true
authoringUnit: {"problemId":"abc429-g","docPath":"src/content/docs/problems/mathematics/outcome-evaluate-compressed-integer-blocks/outcome-evaluate-compressed-integer-blocks-shard-001/abc429-g.md","learningOutcomeIds":["outcome-evaluate-compressed-integer-blocks"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-recurrence"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc429-editorial-14242-8c586c50b71364483aa2f1a0744f0edc53b0499f21359991f124117fb9446215","source-abc429-g-problem-8e2a8092102af19fac9206f28a8823b9ba90edb38486977ad961bb232cda385a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"gcd縮約で到達剰余を一つの同合同類へ移し、完全周期では全縮約剰余を一度ずつ巡る。端数をindex差dの列に分けると剰余は±hの小歩幅で動き、wrapごとの区間は通常等差列になる。この分割は全kを一度覆うので、各列の冪和を足しても元の和を保つ。二分(power,sum)合成は乗算と加算だけで幾何和を計算し、合成数法でも成立する。","sourceRevisionIds":["source-abc429-editorial-14242-8c586c50b71364483aa2f1a0744f0edc53b0499f21359991f124117fb9446215","source-abc429-g-problem-8e2a8092102af19fac9206f28a8823b9ba90edb38486977ad961bb232cda385a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-evaluate-compressed-integer-blocks"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=4,M=5,A=2,B=1,X=2,R=7。","procedure":["指数は1,3,0,2。各冪のmod7は2,1,1,4。"],"executionTarget":null,"expectedResult":"和8≡1 mod7。","verificationStatus":"not_applicable","learningUnitIds":["unit-integer-boundary-blocks"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-evaluate-compressed-integer-blocks"],"prerequisiteIds":["unit-linear-recurrence"],"attainmentCondition":"1+3+3² mod8を(3³−1)/(3−1)で計算できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"5。"},"answer":{"reasoningOrVerification":"分母2にmod8逆元がない。二分合成または整数和から13 mod8=5を得る。","procedure":["具体例の各状態・寄与を再計算する。","分母2にmod8逆元がない。二分合成または整数和から13 mod8=5を得る。"],"expectedResult":"5。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

対象外:

- 素因数指数による整数条件の分解。

## 考察

g=gcd(A,M)、B=B_1g+B_2と分けると、指数はB_2+g·((A/g·k+B_1) mod (M/g))になる。まず互いに素な係数へ帰着でき、さらにNを周期Mの完全周回とN<Mの端数へ分けられる。

採用する候補: 鳩の巣原理で小さいindex差dと剰余差hを探し、端数の剰余集合をO(√M)本の等差数列へ分解する

N≤Dなら各項を長さ1の列としてそのまま扱える。N>Dならd≤D、h≤M/Dとなる対を最初のD項から得てk mod dごとに分けると、初期d本とwrapによるO(hN/M)本の合計を、D≈√MでO(√M)にできる。各列の冪和だけ対数時間で求めればよい。

棄却する候補: k=0からN-1まで指数を直接生成する

一testでN=10^9、T=100まであり、周期を除いた後も最大M-1項を列挙できない。

棄却する候補: floor((Ak+B)/M)が同じ区間だけをまとめる

各区間内は等差数列になるが本数がO(AN/M)に達し、A,NがMと同程度なら線形本数を残すため、もう一段の平方根分解が必要である。

N>Dのとき、最初のD個の剰余を値順に並べると、隣接する二値の差の最小hは鳩の巣原理でM/D以下である。その元index差dはD以下で、A·d≡±h (mod M)という小さい歩幅を得られる。

k mod dで分けた各列は剰余円周上を±hずつ進む。wrap位置で切れば通常の等差数列になり、全wrap数はO(hN/M)、初期列数dとの釣り合いが平方根本数を与える。

gcdで(M,A,B,X)を縮約し、完全周期分を幾何級数として加えてN<Mにする。N≤Dなら残るN項を長さ1の列として直接加算する。N>Dなら最初のD≈√M個の剰余から最小差(h,d)を求め、indexをmod dで分割して各列をwrapごとの等差指数列へ切る。各列のΣX^{a+jt}を二分累乗で計算して総和し、縮約時のX^{B_2}を掛ける。

## 典型の発動条件

### Sqrt Heuristic for Floor Sums

発動条件: 線形剰余列をそのまま列挙できず、小さいindex差と値差の積を利用して区間数を抑えたい。

D個の剰余からd≤D,h≤M/Dを作り、d本の巡回列とO(hN/M)回のwrapに分解する。

### 除算を使わない等比数列和

発動条件: 合成数moduloの下で冪の連続和を求め、比−1の逆元を仮定できない。

二分累乗で(power,sum)を合成し、各等差指数列の冪和をO(log M)で求める。

## 問題固有の要素

剰余列の最初の√M項から、時間方向にも値方向にも小さい差を同時に取り出すと、元の大きい歩幅Aを±hの緩やかな巡回へ置き換えられる。

別の問題へ持ち帰る視点: floor sumや線形剰余の列挙では、短いprefixの近接二点を探し、index差で部分列化して値差側のwrap回数と釣り合わせる。

## 正当性

gcd縮約で到達剰余を一つの同合同類へ移し、完全周期では全縮約剰余を一度ずつ巡る。端数をindex差dの列に分けると剰余は±hの小歩幅で動き、wrapごとの区間は通常等差列になる。この分割は全kを一度覆うので、各列の冪和を足しても元の和を保つ。二分(power,sum)合成は乗算と加算だけで幾何和を計算し、合成数法でも成立する。

## 実装上の注意

- A=0で縮約後M=1になる場合を先に処理し、負方向の歩幅と剰余を正規化する。Rは合成数なので(X^t−1)で割らず(power,sum)を二分合成し、Akなどの積は64 bit上限を確認して必要なら128 bitを使う。

## 復習の核

- 小さいM,Nの直接和と比較し、A=0、gcd(A,M)>1、N≥縮約後周期、N≤D、歩幅が負向きになる対、wrap直前・直後、Rが合成数で比−1が非可逆な場合を検査する。

## 計算量と制約

### 時間

各case O(√M log M·log N)を上界とする。小歩幅分解のO(√M)等差指数列を二分合成する。

### 空間

O(√M)。最初のD≈√M剰余をsort。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 100; 1\le N,M,R\le 10^9; 0\le A,B < M; 1\le X < R; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=4,M=5,A=2,B=1,X=2,R=7。

1. 指数は1,3,0,2。各冪のmod7は2,1,1,4。

期待される結果: 和8≡1 mod7。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

1+3+3² mod8を(3³−1)/(3−1)で計算できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

分母2にmod8逆元がない。二分合成または整数和から13 mod8=5を得る。

確認結果: 5。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/editorial/14242) — source-abc429-editorial-14242-8c586c50b71364483aa2f1a0744f0edc53b0499f21359991f124117fb9446215
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/tasks/abc429_g) — source-abc429-g-problem-8e2a8092102af19fac9206f28a8823b9ba90edb38486977ad961bb232cda385a
