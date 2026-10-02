---
title: "ABC254-EX — Multiply or Divide by 2"
draft: true
authoringUnit: {"problemId":"abc254-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc254-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-trie"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-binary-trie"],"sourceRevisionIds":["source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52","source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Aの余剰はどの末尾ビットでも削除して親へ上げられるが、Bの余剰は現在節点へ入る辺が0の場合だけ親へ上げられる。 葉側で可能な一致を後回しにしてもより浅い一致しか得られないため、最深部から最大数を即座に対応させるのが最適である。 深い同一接頭辞でA,Bを先に対応させ、余剰だけを親へ上げれば移動回数を最小化でき、B側の上昇可否も辺ビットで判定できる。","sourceRevisionIds":["source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52","source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(6)、B=(3)。","procedure":["Aの二進110を一度右shiftすると11の3。","最深一致へA側から一辺上がる。"],"executionTarget":null,"expectedResult":"最小操作1。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-binary-trie"],"attainmentCondition":"B側の末尾1の余剰を親へ上げてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"B側の逆操作は末尾0辺だけ上げられる。末尾1を消すと許されない操作を使うことになる。"},"answer":{"reasoningOrVerification":"B側の逆操作は末尾0辺だけ上げられる。末尾1を消すと許されない操作を使うことになる。","procedure":["具体例の各状態・寄与を再計算する。","B側の逆操作は末尾0辺だけ上げられる。末尾1を消すと許されない操作を使うことになる。"],"expectedResult":"B側の逆操作は末尾0辺だけ上げられる。末尾1を消すと許されない操作を使うことになる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md)

対象外:

- 対称操作による状態の正規化。

## 考察

非負整数を二進文字列とみなすと、Aを2で割る操作は末尾ビット削除であり、Aを2倍する操作を逆向きに見ると、B側は末尾が0のときだけその0を削除できる。

採用する候補: 二進trieを葉から処理する貪欲マッチング

深い同一接頭辞でA,Bを先に対応させ、余剰だけを親へ上げれば移動回数を最小化でき、B側の上昇可否も辺ビットで判定できる。

棄却する候補: 数値を整列して近い値同士を対応させる

操作距離は数値差ではなく二進表記の祖先関係で決まり、B側には0辺だけという非対称制約もある。

Aの余剰はどの末尾ビットでも削除して親へ上げられるが、Bの余剰は現在節点へ入る辺が0の場合だけ親へ上げられる。

葉側で可能な一致を後回しにしてもより浅い一致しか得られないため、最深部から最大数を即座に対応させるのが最適である。

A_i,B_iの二進表記を同じtrieへ挿入し、深い節点からA個数とB個数を相殺する。残ったAは親へ移し、残ったBは末尾辺が0なら親へ移し、1なら不可能として-1にする。全移動数を合計する。

## 典型の発動条件

### 二進trie上の祖先マッチング

発動条件: 整数操作が二進表記の末尾追加・削除として表せる。

同じ接頭辞を節点にまとめ、葉から根へ余剰個数を流す。

### 最深優先の貪欲法

発動条件: 深い位置の一致は浅い位置でも一致できるが、その逆はできない。

各節点で可能なA,Bを先に相殺し、未対応分だけを親へ送る。

## 問題固有の要素

二倍と切り捨て半分という操作を片側ずつ正方向で追う代わりに、一方を逆向きにすると、両者がtrieの根方向へ動くマッチングになる。

別の問題へ持ち帰る視点: 異なる向きの変換を共通中間状態で合わせる問題では、一方の操作を逆転して同じ半順序上の祖先移動へ揃える。

## 正当性

Aの余剰はどの末尾ビットでも削除して親へ上げられるが、Bの余剰は現在節点へ入る辺が0の場合だけ親へ上げられる。 葉側で可能な一致を後回しにしてもより浅い一致しか得られないため、最深部から最大数を即座に対応させるのが最適である。 深い同一接頭辞でA,Bを先に対応させ、余剰だけを親へ上げれば移動回数を最小化でき、B側の上昇可否も辺ビットで判定できる。

## 実装上の注意

- 0の二進表記は根の空文字列として扱い、Bの余剰を親へ上げられるのは末尾ビット0だけである。個数はまとめて移し、その個数分を操作回数へ加える。

## 復習の核

- 小さい値と個数で全対応を探索し、0、同じ値の重複、B側が1ビットで止まる例、深い節点で一部だけ相殺される例を確認する。

## 計算量と制約

### 時間

O(NB)、B=max値のbit長、trie node総数O(NB)。

### 空間

O(NB)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq a_1 \leq \ldots \leq a_N \leq 10^9; 0 \leq b_1 \leq \ldots \leq b_N \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(6)、B=(3)。

1. Aの二進110を一度右shiftすると11の3。
2. 最深一致へA側から一辺上がる。

期待される結果: 最小操作1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

B側の末尾1の余剰を親へ上げてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

B側の逆操作は末尾0辺だけ上げられる。末尾1を消すと許されない操作を使うことになる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/editorial/4053) — source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/tasks/abc254_h) — source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea
