---
title: "ABC290-EX — Bow Meow Optimization"
draft: true
authoringUnit: {"problemId":"abc290-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc290-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-knapsack-resource"],"sourceRevisionIds":["source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d","source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"犬猫それぞれの中央個体を隣接させ最大係数を置く交換論により、奇数個を前処理で除けば両種族偶数の左右分割問題へ帰着する。 最適列を中央へ向け係数昇順となる左右二列へ正規化でき、係数順に各動物を左列Pか右列Qへ割り当てる状態DPで最小値を得られる。","sourceRevisionIds":["source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d","source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=M=1、犬係数A=2、猫係数B=3。","procedure":["犬→猫なら犬は左右猫数0,1で費用2、猫は左右犬数1,0で費用3。","逆順でも同じ絶対差になる。"],"executionTarget":null,"expectedResult":"最小不満度5。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-dp-subset-resource"],"attainmentCondition":"奇数種数を偶数DPへ直接流してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"中央個体の前処理と係数交換による正規化が必要。左右対称の人数状態だけでは中央配置を表せない。"},"answer":{"reasoningOrVerification":"中央個体の前処理と係数交換による正規化が必要。左右対称の人数状態だけでは中央配置を表せない。","procedure":["具体例の各状態・寄与を再計算する。","中央個体の前処理と係数交換による正規化が必要。左右対称の人数状態だけでは中央配置を表せない。"],"expectedResult":"中央個体の前処理と係数交換による正規化が必要。左右対称の人数状態だけでは中央配置を表せない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 対称操作による状態の正規化。

## 考察

中央から離れるほど同種族内の順位差が増えるため、不満係数の大きい動物ほど中央へ置く交換が解を悪化させない。

採用する候補: 偶奇別に中央を処理して左右割当DP

最適列を中央へ向け係数昇順となる左右二列へ正規化でき、係数順に各動物を左列Pか右列Qへ割り当てる状態DPで最小値を得られる。

棄却する候補: 全動物の順列を列挙

最大600匹の順列は扱えず、同種族内の交換可能性を利用していない。

犬猫それぞれの中央個体を隣接させ最大係数を置く交換論により、奇数個を前処理で除けば両種族偶数の左右分割問題へ帰着する。

偶数化後に全動物を係数順に走査し、dp[i][j][k]で左列Pへ入れた犬猫数を持って左右配置時の偏り費用を加え、指定個数状態の最小値を取る。

## 典型の発動条件

### 並べ替え不等式と交換論

発動条件: 位置ごとの偏りが中央から単調に増える。

大係数を小偏りへ寄せ、中央へ向かう係数順を正規化する。

### 個数制約付き割当DP

発動条件: 係数順に要素を二群へ配り、各群の種別個数が指定される。

dp[i][dogP][catP]で左右どちらへ置くかを選ぶ。

## 問題固有の要素

種族ごとの中央値の位置関係を先に固定すると、複雑な混合順列が「昇順列P＋反転列Q」という二群割当に縮む。

別の問題へ持ち帰る視点: 順列最適化では交換で標準形を示してから、残る割当だけをDPする。

## 正当性

犬猫それぞれの中央個体を隣接させ最大係数を置く交換論により、奇数個を前処理で除けば両種族偶数の左右分割問題へ帰着する。 最適列を中央へ向け係数昇順となる左右二列へ正規化でき、係数順に各動物を左列Pか右列Qへ割り当てる状態DPで最小値を得られる。

## 実装上の注意

- N,Mの偶奇4ケースで中央除去と費用を正しく反映し、総費用は64ビットで持つ。

## 復習の核

- 小規模の全順列と比較し、各偶奇組合せ、同じ係数、中央の最大係数を除く前処理を検査する。

## 計算量と制約

### 時間

O(N³)上界、左右配置DPの左右数×犬数×猫数状態、Nは全動物数。

### 空間

O(N²)、走査位置をrollingする。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M \leq 300; 1\leq A_i,B_i \leq 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=M=1、犬係数A=2、猫係数B=3。

1. 犬→猫なら犬は左右猫数0,1で費用2、猫は左右犬数1,0で費用3。
2. 逆順でも同じ絶対差になる。

期待される結果: 最小不満度5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

奇数種数を偶数DPへ直接流してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

中央個体の前処理と係数交換による正規化が必要。左右対称の人数状態だけでは中央配置を表せない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5769) — source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_h) — source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3
