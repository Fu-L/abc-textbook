---
title: "ABC290-G — Edge Elimination"
draft: true
authoringUnit: {"problemId":"abc290-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc290-g.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc290-editorial-5758-7690d6e087c7b600f72a7e4932035bfae8591d1b67f55dc02cacd48d86f0c897","source-abc290-g-problem-174a58af4aec053b28b4c475102358c2ee65c20bffe08524f99b3db7242dc533"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"V_(i+1)=1+K V_iという桁構造により、大きいV_iを使えるだけ使う貪欲が最小切断数となり、その表現を実際の部分木削除として実現できる。 削除数V_(D-h)-XをV_i硬貨の最小枚数で表す正準性があり、その枚数に親辺切断を加えて各hを評価できる。","sourceRevisionIds":["source-abc290-editorial-5758-7690d6e087c7b600f72a7e4932035bfae8591d1b67f55dc02cacd48d86f0c897","source-abc290-g-problem-174a58af4aec053b28b4c475102358c2ee65c20bffe08524f99b3db7242dc533"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"K=2、完全木の頂点数V0=1,V1=3,V2=7、目標X=5。","procedure":["全体7から葉二つを切れば5。","一辺切断で消えるsubtreeは1か3なので差2を一切断で作れない。"],"executionTarget":null,"expectedResult":"最小切断2。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"V_iを一般の貨幣額としてgreedyしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"正当化はV_{i+1}=1+K V_iと実際のsubtree構成に依存する。任意額のgreedyへ一般化しない。"},"answer":{"reasoningOrVerification":"正当化はV_{i+1}=1+K V_iと実際のsubtree構成に依存する。任意額のgreedyへ一般化しない。","procedure":["具体例の各状態・寄与を再計算する。","正当化はV_{i+1}=1+K V_iと実際のsubtree構成に依存する。任意額のgreedyへ一般化しない。"],"expectedResult":"正当化はV_{i+1}=1+K V_iと実際のsubtree構成に依存する。任意額のgreedyへ一般化しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 対称操作による状態の正規化。

## 考察

頂点vを最高点として残すと初期成分は深さD-hの完全K分木になり、以後の一切断は完全部分木V_i=(K^(i+1)-1)/(K-1)を一つ除く操作である。

採用する候補: 最高点深さを列挙し、大きい部分木から削る貪欲

削除数V_(D-h)-XをV_i硬貨の最小枚数で表す正準性があり、その枚数に親辺切断を加えて各hを評価できる。

棄却する候補: 全ての切断集合を探索

完全木の頂点数は10^18級で、辺を展開できない。

V_(i+1)=1+K V_iという桁構造により、大きいV_iを使えるだけ使う貪欲が最小切断数となり、その表現を実際の部分木削除として実現できる。

h=0..Dを列挙し、初期サイズV_(D-h)がX以上なら差をV_(D-h-1)..V_0で貪欲に割って削除辺数を数え、親辺切断を含む最小値を取る。

## 典型の発動条件

### 構造付きコイン貪欲

発動条件: 削除可能サイズが完全K分木の等比和になる。

目標削除数を大きいV_iから割って切断数を最小化する。

### 根候補の深さ列挙

発動条件: 残す連結成分の最高点を選べる。

h=0..Dごとに初期成分サイズと親辺切断の有無を評価する。

## 問題固有の要素

切断問題を「完全部分木サイズを硬貨とする支払い」へ変えると、K進的な額面関係から貪欲性を説明できる。

別の問題へ持ち帰る視点: 階層構造の部分木削除は、削除サイズの数体系を調べて硬貨問題へ写す。

## 正当性

V_(i+1)=1+K V_iという桁構造により、大きいV_iを使えるだけ使う貪欲が最小切断数となり、その表現を実際の部分木削除として実現できる。 削除数V_(D-h)-XをV_i硬貨の最小枚数で表す正準性があり、その枚数に親辺切断を加えて各hを評価できる。

## 実装上の注意

- Xを含めない深さ候補を捨て、h>0の最初の親辺切断を数える。V_iは10^18上限で飽和計算する。

## 復習の核

- 小さい完全木の切断全探索と比較し、X=全頂点、X=1、最高点が根でない最適例を確認する。

## 計算量と制約

### 時間

O(D²)、D+1の開始subtree候補とD種類のgreedy差分。

### 空間

O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le T \le 100; 1 \le D; 2 \le K; \displaystyle 1 \le X \le \sum_{i=0}^{D} K^i \le 10^{18}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

K=2、完全木の頂点数V0=1,V1=3,V2=7、目標X=5。

1. 全体7から葉二つを切れば5。
2. 一辺切断で消えるsubtreeは1か3なので差2を一切断で作れない。

期待される結果: 最小切断2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

V_iを一般の貨幣額としてgreedyしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

正当化はV_{i+1}=1+K V_iと実際のsubtree構成に依存する。任意額のgreedyへ一般化しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5758) — source-abc290-editorial-5758-7690d6e087c7b600f72a7e4932035bfae8591d1b67f55dc02cacd48d86f0c897
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_g) — source-abc290-g-problem-174a58af4aec053b28b4c475102358c2ee65c20bffe08524f99b3db7242dc533
