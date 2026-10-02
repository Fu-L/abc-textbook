---
title: "ABC434-G — Keyboard"
draft: true
authoringUnit: {"problemId":"abc434-g","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc434-g.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749","source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"右データの先頭 B は左データ末尾の数字を同数だけ削除し、足りなければ余った B が結果先頭へ残る。よって積には左の末尾 min(l_left,b_right) 桁の値が必要である。 三値 Data だけでは任意同士の積は閉じないが、左 Data がセグメント木節点なら子の要約を辿って必要な suffix 値を復元できる。 残存数字の連結値は 10 の冪を用いて (prefix·10^len+suffix) mod p として合成できる。 通常は失われる末尾情報をマージ履歴から O(log N) で補い、更新・区間積を O(log^2 N) にできる。","sourceRevisionIds":["source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749","source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=12B3BB。","procedure":["12B→1、1の後に3で13。","Bで1、次のBで空列になる。"],"executionTarget":null,"expectedResult":"残存数字長0、値0。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":[],"attainmentCondition":"S=B12の先頭Bは数字を消せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"消せない。Bは右の未来の数字を削除せず先頭に残る。正規形はBと12で、b=1,l=2,x=12。"},"answer":{"reasoningOrVerification":"消せない。Bは右の未来の数字を削除せず先頭に残る。正規形はBと12で、b=1,l=2,x=12。","procedure":["具体例の各状態・寄与を再計算する。","消せない。Bは右の未来の数字を削除せず先頭に残る。正規形はBと12で、b=1,l=2,x=12。"],"expectedResult":"消せない。Bは右の未来の数字を削除せず先頭に残る。正規形はBと12で、b=1,l=2,x=12。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

数字の直後に B があればその数字と B が消える操作を尽くした正規形を考える。正規化は連結と両立し、normalize(S+T)=normalize(normalize(S)+normalize(T)) なので本来はモノイドになる。

採用する候補: 各区間を先頭 B 数 b、残存数字長 l、その数値 mod 998244353 の三値で要約し、必要な左区間末尾だけセグメント木の子を降りて取得する。

通常は失われる末尾情報をマージ履歴から O(log N) で補い、更新・区間積を O(log^2 N) にできる。

棄却する候補: 各セグメント木節点に正規化後文字列を丸ごと保存して連結・削除する。

節点文字列が区間長に比例し、積やクエリが最悪 Ω(N) になる。

右データの先頭 B は左データ末尾の数字を同数だけ削除し、足りなければ余った B が結果先頭へ残る。よって積には左の末尾 min(l_left,b_right) 桁の値が必要である。

三値 Data だけでは任意同士の積は閉じないが、左 Data がセグメント木節点なら子の要約を辿って必要な suffix 値を復元できる。

残存数字の連結値は 10 の冪を用いて (prefix·10^len+suffix) mod p として合成できる。

葉を数字または B の Data にし、内部節点は左の末尾照会を使って正規化積を構築する。末尾 n 桁照会は右子から必要分を取り、足りなければ左子へ降る。点更新で祖先を再構築し、区間クエリでは canonical nodes を左から順に同じ積で合成して (l,x) を返す。

## 典型の発動条件

### 正規形モノイド

発動条件: 局所削除規則が合流的で、連結前後の正規化が同じ結果になるとき。

数字+B の削除を尽くした正規形を区間積として扱う。

### セグメント木の履歴を使う要約補完

発動条件: 定数サイズ要約同士は直接マージ不能だが、一方の元区間が木に保持され追加情報を探索できるとき。

左節点の子へ二分探索し、要約から欠けた末尾 n 桁だけを O(log N) で取り出す。

### 十進連結のローリング値

発動条件: 長い数字列の連結・suffix の値を法上で扱うとき。

10^k を前計算し、長さと剰余値の組で連結を計算する。

## 問題固有の要素

定数サイズ要約が演算に閉じなくても、セグメント木が持つ分解履歴を補助 oracle にすれば必要情報だけ復元できる。

別の問題へ持ち帰る視点: データ構造の節点値は必ずしも自己完結モノイドでなく、木上探索込みの部分演算として設計できる場合がある。

## 正当性

右データの先頭 B は左データ末尾の数字を同数だけ削除し、足りなければ余った B が結果先頭へ残る。よって積には左の末尾 min(l_left,b_right) 桁の値が必要である。 三値 Data だけでは任意同士の積は閉じないが、左 Data がセグメント木節点なら子の要約を辿って必要な suffix 値を復元できる。 残存数字の連結値は 10 の冪を用いて (prefix·10^len+suffix) mod p として合成できる。 通常は失われる末尾情報をマージ履歴から O(log N) で補い、更新・区間積を O(log^2 N) にできる。

## 実装上の注意

- 区間クエリの canonical node は左からの順序を保って合成する。B が左の数字数を超える場合の余り、全削除時の長さ 0、10 冪添字を確認する。

## 復習の核

- Data 積に本当に必要な欠落情報が左末尾だけか、末尾取得が複数節点を跨いでも O(log N) に収まるかを確認する。

## 計算量と制約

### 時間

構築O(N log N)、点更新・区間照会O(log²N)。

### 空間

O(N)、三値summaryと子参照・10の冪。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 8 \times 10^6; 1 \leq Q \leq 2 \times 10^5; S is a string of length N consisting of 1, 2, \dots, 9, and B.; 1 \leq x \leq N; c is 1, 2, \dots, 9, or B.; 1 \leq l \leq r \leq N; N, Q, x, l, r are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=12B3BB。

1. 12B→1、1の後に3で13。
2. Bで1、次のBで空列になる。

期待される結果: 残存数字長0、値0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=B12の先頭Bは数字を消せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

消せない。Bは右の未来の数字を削除せず先頭に残る。正規形はBと12で、b=1,l=2,x=12。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14660) — source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/tasks/abc434_g) — source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c
