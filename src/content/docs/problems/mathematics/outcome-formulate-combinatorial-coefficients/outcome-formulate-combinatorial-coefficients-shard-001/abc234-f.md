---
title: "ABC234-F — Reordering"
draft: true
authoringUnit: {"problemId":"abc234-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc234-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc234-editorial-3223-046d35954e659dc60bc7aa26e0efc75e4f6cca517bad349758550a7f621af1a2","source-abc234-f-problem-63c82d89d32fbc1eedce8bd501c1d65d163257583e40c51ec7ca6ef5d4b88e95"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"使う各文字数を固定すると元の位置は生成文字列に影響しない。同じ文字をk個追加する際、既存長jの列へ入れる位置集合はC(j+k,k)通りで、削除すれば元の列へ一意に戻る。文字種を順に処理するDPは各頻度ベクトルとその並べ方を一度ずつ生成する。最後に空列を除く。","sourceRevisionIds":["source-abc234-editorial-3223-046d35954e659dc60bc7aa26e0efc75e4f6cca517bad349758550a7f621af1a2","source-abc234-f-problem-63c82d89d32fbc1eedce8bd501c1d65d163257583e40c51ec7ca6ef5d4b88e95"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=aab。","procedure":["長さ1はa,bの2種類。長さ2はaa,ab,baの3種類。","長さ3はaab,aba,baaの3種類。"],"executionTarget":null,"expectedResult":"8種類。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":["unit-modular-arithmetic"],"attainmentCondition":"同じaを別の元位置から選ぶ方法を掛けるべきか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"S=aaの答え2。"},"answer":{"reasoningOrVerification":"出来上がる文字列の種類を数えるため掛けない。S=aaならa,aaの2種類だけ。","procedure":["具体例の各状態・寄与を再計算する。","出来上がる文字列の種類を数えるため掛けない。S=aaならa,aaの2種類だけ。"],"expectedResult":"S=aaの答え2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

部分列を最後に自由に並べ替えるため、元の位置や選択順は消え、各文字を何個使うかだけが生成可能性を決める。

使用個数 c_a,…,c_z を固定すると、得られる相異なる文字列数は総文字数の順列を同一文字の入替えで割った多項係数になる。

棄却する候補: 元文字列の全ての部分列を列挙し、それぞれの全順列を集合へ入れて重複排除する。

位置選択と並べ替えの両方が指数・階乗規模で、同じ文字列の重複も非常に多い。

採用する候補: 文字種を一つずつ処理し、使用済み総長 j の文字列へ新文字を k 個挿入する位置 C(j＋k,k) を掛ける DP を行う。

同じ新文字 k 個は区別せず、既存文字列との相対順を保った挿入位置だけで各完成文字列を一度数えられる。

文字種ごとの頻度上限だけを残すことで、長さ最大 5000 の位置情報を「処理済み文字種と総使用数」の二状態へ圧縮する。

部分列選択を文字頻度ベクトルへ商約し、各文字種の同一要素を既存列へ挿入する二項係数遷移で全長の multiset permutation 数を DP する。

## 典型の発動条件

### 頻度制約付き multiset permutation DP

発動条件: 元集合から種類別上限以内を選び、選んだ同種要素を区別せず全順列を数えるとき。

種類を順に追加し、新種類 k 個の配置場所を完成長に対する二項係数で選ぶ。

## 問題固有の要素

新文字を k 個追加する際、既存文字の相対順を固定して新文字の位置だけ選ぶと C(j＋k,k) 通りになり、文字列を一意に分解できる。

別の問題へ持ち帰る視点: 同一要素の追加では factorial 公式を直接全頻度へ適用せず、既存構造へ同一要素を挿入する組合せで逐次 DP にできる。

## 正当性

使う各文字数を固定すると元の位置は生成文字列に影響しない。同じ文字をk個追加する際、既存長jの列へ入れる位置集合はC(j+k,k)通りで、削除すれば元の列へ一意に戻る。文字種を順に処理するDPは各頻度ベクトルとその並べ方を一度ずつ生成する。最後に空列を除く。

## 実装上の注意

- 各文字の k は 0 からその頻度まで、既存長との合計が |S| 以下の範囲だけ遷移する。
- dp[0]＝1 は遷移用の空文字列として保持するが、最終答案では長さ 1 以上の係数だけを合計する。

## 復習の核

- 選択後に自由な並べ替えがあるなら、元位置の情報が消えて種類別個数だけが残ることを最初に確認する。
- 同じ文字 k 個の追加は区別せず、完成列のどの k 位置を新文字にするかという二項係数で数える。

## 計算量と制約

### 時間

O(|S|²)、文字種数26は定数。

### 空間

O(|S|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string of length 1 and 5000 (inclusive) consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=aab。

1. 長さ1はa,bの2種類。長さ2はaa,ab,baの3種類。
2. 長さ3はaab,aba,baaの3種類。

期待される結果: 8種類。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じaを別の元位置から選ぶ方法を掛けるべきか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

出来上がる文字列の種類を数えるため掛けない。S=aaならa,aaの2種類だけ。

確認結果: S=aaの答え2。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/editorial/3223) — source-abc234-editorial-3223-046d35954e659dc60bc7aa26e0efc75e4f6cca517bad349758550a7f621af1a2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/tasks/abc234_f) — source-abc234-f-problem-63c82d89d32fbc1eedce8bd501c1d65d163257583e40c51ec7ca6ef5d4b88e95
