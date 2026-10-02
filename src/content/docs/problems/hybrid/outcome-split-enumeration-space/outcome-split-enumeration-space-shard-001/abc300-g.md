---
title: "ABC300-G — P-smooth number"
draft: true
authoringUnit: {"problemId":"abc300-g","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc300-g.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-two-pointers-window"],"sourceRevisionIds":["source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf","source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"素数を個数ではなく現在の列挙数が小さい側へ追加すると、二つの直積サイズを均衡化できる。 各半分で許される素数冪積をN以下だけ列挙し、sort後に積≤Nとなるpair数を二ポインタで数えられる。","sourceRevisionIds":["source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf","source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-split-enumeration-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=10,P=3。","procedure":["allowed primes2,3なので数は1,2,3,4,6,8,9。","左2冪と右3冪の積≤10を数える。"],"executionTarget":null,"expectedResult":"答え7。","verificationStatus":"not_applicable","learningUnitIds":["unit-meet-in-the-middle"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-split-enumeration-space"],"prerequisiteIds":["unit-two-pointers-window"],"attainmentCondition":"1を除いてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"素因数を一つも持たない1も条件を満たす。両listの初期値1の組が一回寄与する。"},"answer":{"reasoningOrVerification":"素因数を一つも持たない1も条件を満たす。両listの初期値1の組が一回寄与する。","procedure":["具体例の各状態・寄与を再計算する。","素因数を一つも持たない1も条件を満たす。両listの初期値1の組が一回寄与する。"],"expectedResult":"素因数を一つも持たない1も条件を満たす。両listの初期値1の組が一回寄与する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

P≤100の素数因子だけを持つ数は約2×10^9個以下で、素数集合を二分すれば各側の生成数列を現実的サイズに抑えられる。

採用する候補: 素数を生成数列サイズが小さい側へgreedy分配するmeet-in-the-middle

各半分で許される素数冪積をN以下だけ列挙し、sort後に積≤Nとなるpair数を二ポインタで数えられる。

棄却する候補: 1..Nをfactor判定

Nは10^16で走査不能。

素数を個数ではなく現在の列挙数が小さい側へ追加すると、二つの直積サイズを均衡化できる。

P以下の素数を列挙し、各qについて小さい側のlistをq^e倍した値で拡張する。両listをsortし、一方昇順・他方pointer降順でuv≤Nのpair数を合計する。

## 典型の発動条件

### meet-in-the-middle

発動条件: 独立な素因数選択の全積は大きいが二群なら列挙可能。

素数集合を分割して半側smooth数を生成する。

### 積制約pair counting

発動条件: sort済み正数列からuv≤Nを数える。

overflowを避けN/uで上限pointerを動かす。

## 問題固有の要素

分割品質を素数数でなく実際の生成listサイズでonline均衡化するのが最大ケースを抑える。

別の問題へ持ち帰る視点: MITMの群分けは状態数推定を重みにする。

## 正当性

素数を個数ではなく現在の列挙数が小さい側へ追加すると、二つの直積サイズを均衡化できる。 各半分で許される素数冪積をN以下だけ列挙し、sort後に積≤Nとなるpair数を二ポインタで数えられる。

## 実装上の注意

- 1を両listに含め、q倍でNを越える前に除算判定し、答えは64ビットで持つ。

## 復習の核

- 小Nのfactor全探索と比較し、P=2、N=1、P以下最大素数の冪境界を確認する。

## 計算量と制約

### 時間

O(U log U+V log V+P(U+V))、P以下primeを列挙し生成list最大長U,V、最後のpair走査O(U+V)。

### 空間

O(U+V+P)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: N is an integer such that 1 \le N \le 10^{16}.; P is a prime such that 2 \le P \le 100.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=10,P=3。

1. allowed primes2,3なので数は1,2,3,4,6,8,9。
2. 左2冪と右3冪の積≤10を数える。

期待される結果: 答え7。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

1を除いてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

素因数を一つも持たない1も条件を満たす。両listの初期値1の組が一回寄与する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/editorial/6275) — source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/tasks/abc300_g) — source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b
