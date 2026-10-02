---
title: "ABC315-G — Ai + Bj + Ck = X (1 <= i, j, k <= N)"
draft: true
authoringUnit: {"problemId":"abc315-g","docPath":"src/content/docs/problems/mathematics/outcome-characterize-integer-solvability/outcome-characterize-integer-solvability-shard-001/abc315-g.md","learningOutcomeIds":["outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。"],"tagIds":["tag-bezout-diophantine"],"sourceRevisionIds":["source-abc315-editorial-6994-7c574a3d3acdded049b42b9ab7f3876e513205fddd22ac930901e1e9463cf6de","source-abc315-g-problem-6b4951d4ac0f3ab72b81c5813a5ea6b1af9c9ca19f08b32ff99923a0bae38e77"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i固定後のBj+Ck=Yが解を持つのはg=gcd(B,C)がYを割るとき。基準解から全解はj=j0+tC/g,k=k0−tB/gと一意に表される。j,k各々の1..N制限がtの閉整数区間を与えるため、交差長がそのiの全解数になる。異なるiは別三tupleなので合計に重複はない。","sourceRevisionIds":["source-abc315-editorial-6994-7c574a3d3acdded049b42b9ab7f3876e513205fddd22ac930901e1e9463cf6de","source-abc315-g-problem-6b4951d4ac0f3ab72b81c5813a5ea6b1af9c9ca19f08b32ff99923a0bae38e77"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-characterize-integer-solvability"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,A=1,B=2,C=3,X=8。","procedure":["i=1では2j+3k=7で(j,k)=(2,1)。","i=2では2j+3k=6に1..2の解はない。"],"executionTarget":null,"expectedResult":"1tuple、(1,2,1)。","verificationStatus":"not_applicable","learningUnitIds":["unit-gcd-diophantine"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-characterize-integer-solvability"],"prerequisiteIds":[],"attainmentCondition":"ceil(−3/2)を0方向の整数除算だけで求めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ceil=−1、floor=−2。"},"answer":{"reasoningOrVerification":"ceilは−1、floorは−2。符号付き上下限を使い分けるのでhelperを明示する必要がある。","procedure":["具体例の各状態・寄与を再計算する。","ceilは−1、floorは−2。符号付き上下限を使い分けるのでhelperを明示する必要がある。"],"expectedResult":"ceil=−1、floor=−2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 考察

N≤10^6 なので三変数のうち i だけは全探索できる。固定後は正の範囲制約付き一次不定方程式 Bj+Ck=Y に落ちる。

Bj+Ck=Y は gcd(B,C) が Y を割るときだけ解を持ち、一つの解が得られれば全解は j=j0+t(C/g), k=k0−t(B/g) という一次 parameter で表せる。

採用する候補: i を列挙し、extgcd で得た基準解に対する整数 parameter t の許容区間長を floor/ceil 除算で数える。

各 i を O(1) の数論計算で処理でき、全体 O(N+log max(B,C)) になる。

棄却する候補: i,j を二重ループし、残りから k が整数かを判定する。

N² は最大10^12回で、一次方程式の解が等差数列をなすことを使えていない。

extgcd の uB+vC=g を Y/g 倍して基準解を得る前に Y%g=0 を検査する。

1≤j0+tC/g≤N と 1≤k0−tB/g≤N の二つから t の整数区間を取り、その共通部分の個数 max(0,R−L+1) を加える。

g,u,v=extgcd(B,C) を一度求める。i=1..N で Y=X−Ai とし、Y≤0 または Y%g≠0 なら skip。基準 j0=u(Y/g), k0=v(Y/g) を作り、二変数の上下限制約から signed floor_div/ceil_div で t の下限・上限を求め、その交差長を答えへ加える。

## 典型の発動条件

### 一次不定方程式の範囲内解数

発動条件: ax+by=c の整数解を箱型範囲内で数えるとき。

extgcd の一解から一般解を作り、自由 parameter の区間を整数除算で交差する。

## 問題固有の要素

三変数でも一軸の上限10^6は走査可能で、残り二軸を数式で一括処理すればよいという制約配分になっている。

別の問題へ持ち帰る視点: 多変数線形式は、列挙できる軸数と Diophantine equation で消せる軸数を分けて見積もる。

## 正当性

i固定後のBj+Ck=Yが解を持つのはg=gcd(B,C)がYを割るとき。基準解から全解はj=j0+tC/g,k=k0−tB/gと一意に表される。j,k各々の1..N制限がtの閉整数区間を与えるため、交差長がそのiの全解数になる。異なるiは別三tupleなので合計に重複はない。

## 実装上の注意

- 言語の整数除算が負数を0方向へ丸める場合、数学的 floor/ceil helper を用意する。Y/g 倍の途中積は 128 bit で overflow を避ける。

## 復習の核

- extgcd で一解を得た後、一般解の符号を暗記せず代入して確かめる。境界数え上げは負の基準解を含むテストを必ず作る。

## 計算量と制約

### 時間

O(N+log min(B,C))。extgcdは一度だけ、各iの整数区間交差は定数時間。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 10^6; 1 \le A,B,C \le 10^9; 1 \le X \le 3 \times 10^{15}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,A=1,B=2,C=3,X=8。

1. i=1では2j+3k=7で(j,k)=(2,1)。
2. i=2では2j+3k=6に1..2の解はない。

期待される結果: 1tuple、(1,2,1)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

ceil(−3/2)を0方向の整数除算だけで求めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ceilは−1、floorは−2。符号付き上下限を使い分けるのでhelperを明示する必要がある。

確認結果: ceil=−1、floor=−2。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/editorial/6994) — source-abc315-editorial-6994-7c574a3d3acdded049b42b9ab7f3876e513205fddd22ac930901e1e9463cf6de
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/tasks/abc315_g) — source-abc315-g-problem-6b4951d4ac0f3ab72b81c5813a5ea6b1af9c9ca19f08b32ff99923a0bae38e77
