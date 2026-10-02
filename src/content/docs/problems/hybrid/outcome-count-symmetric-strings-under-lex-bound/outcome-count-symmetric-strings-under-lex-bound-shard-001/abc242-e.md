---
title: "ABC242-E — (∀x∀)"
draft: true
authoringUnit: {"problemId":"abc242-e","docPath":"src/content/docs/problems/hybrid/outcome-count-symmetric-strings-under-lex-bound/outcome-count-symmetric-strings-under-lex-bound-shard-001/abc242-e.md","learningOutcomeIds":["outcome-count-symmetric-strings-under-lex-bound"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc242-e-problem-105c649ecb269302c3783a0fc0425f5042be2f65892d32c9e1a658283a51fa21","source-abc242-editorial-3516-341f0c2b714e9d00396dc06071f467ad103a6c56d7f034cb2d80284e09c1d2f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"S 前半の26進 value は、それより辞書順で小さい長さ h の prefix の個数そのものである。 前半が小さい全候補を桁 DP なしで一括計数し、判断が残る一候補だけを文字列比較できる。","sourceRevisionIds":["source-abc242-e-problem-105c649ecb269302c3783a0fc0425f5042be2f65892d32c9e1a658283a51fa21","source-abc242-editorial-3516-341f0c2b714e9d00396dc06071f467ad103a6c56d7f034cb2d80284e09c1d2f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-symmetric-strings-under-lex-bound"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=ABA。","procedure":["前半ABの26進値は1なので小さいprefix AAが一つ。","同prefixの鏡映ABAはS以下なので一つ追加。"],"executionTarget":null,"expectedResult":"回文AAA,ABAの2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-symmetric-strings-under-lex-bound"],"prerequisiteIds":[],"attainmentCondition":"S=ABBなら答えは増えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"鏡映ABAは依然ABB以下なので答え2。prefixだけの数値に鏡映判定を加える。"},"answer":{"reasoningOrVerification":"鏡映ABAは依然ABB以下なので答え2。prefixだけの数値に鏡映判定を加える。","procedure":["具体例の各状態・寄与を再計算する。","鏡映ABAは依然ABB以下なので答え2。prefixだけの数値に鏡映判定を加える。"],"expectedResult":"鏡映ABAは依然ABB以下なので答え2。prefixだけの数値に鏡映判定を加える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 交換論による貪欲順の証明。

## 考察

長さ N の回文は先頭 h=ceil(N/2) 文字を決めると、残りを鏡映して一意に決まる。したがって26^N候補ではなく、自由な prefix を辞書順に数えればよい。

prefix が S の先頭 h 文字より小さければ、最初の相違は前半にあるので完成した回文も必ず S より小さい。prefix が等しい一候補だけは、鏡映した後半と S を実際に比較する必要がある。

採用する候補: S の前半を A=0,…,Z=25 の26進数として数え、同じ前半から作った境界回文が S 以下なら1を加える。

前半が小さい全候補を桁 DP なしで一括計数し、判断が残る一候補だけを文字列比較できる。

棄却する候補: 全回文を生成して S と辞書順比較する。

自由な前半だけでも26^{ceil(N/2)}通りあり列挙できない。

S 前半の26進 value は、それより辞書順で小さい長さ h の prefix の個数そのものである。

h 文字を左から読み ans=26·ans+(S_i-'A') と更新する。S の前半を左右へ鏡映して palindrome P を作り、P≤S なら ans に1を足して法998244353で出力する。

## 典型の発動条件

### 対称列の自由半分への圧縮

発動条件: 回文など、片側を決めると残りが一意に決まる構造を数えるとき。

独立な ceil(N/2) 要素だけを列挙・数値化し、鏡映で全体を復元する。

### 辞書順の境界候補分離

発動条件: prefix が境界より小さい候補は一括判定でき、等しい prefix だけ後半比較が残るとき。

strictly smaller prefix の個数と equal-prefix candidate の indicator を足す。

## 問題固有の要素

前半比較だけで決まらないのは S と前半が完全一致する回文一つだけであり、複雑な桁 DP は不要である。

別の問題へ持ち帰る視点: 辞書順制約では最初の相違位置を考え、未確定な境界 case が何個残るかを切り出す。

## 正当性

S 前半の26進 value は、それより辞書順で小さい長さ h の prefix の個数そのものである。 前半が小さい全候補を桁 DP なしで一括計数し、判断が残る一候補だけを文字列比較できる。

## 実装上の注意

- 奇数長では中央文字を一度だけ使って鏡映する。26進 value は法上で更新しつつ、境界回文 P の比較は元の文字列で行う。

## 復習の核

- 偶数長で境界回文が S を超える例を作り、前半が一致しても自動で数えてはいけない理由を後半の最初の相違で確認する。

## 計算量と制約

### 時間

各文字列O(N)、総文字数に線形。

### 空間

O(N)、鏡映列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 250000; N is an integer between 1 and 10^6 (inclusive).; In a single input, the sum of N over the test cases is at most 10^6.; S is a string of length N consisting of uppercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=ABA。

1. 前半ABの26進値は1なので小さいprefix AAが一つ。
2. 同prefixの鏡映ABAはS以下なので一つ追加。

期待される結果: 回文AAA,ABAの2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=ABBなら答えは増えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

鏡映ABAは依然ABB以下なので答え2。prefixだけの数値に鏡映判定を加える。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/tasks/abc242_e) — source-abc242-e-problem-105c649ecb269302c3783a0fc0425f5042be2f65892d32c9e1a658283a51fa21
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/editorial/3516) — source-abc242-editorial-3516-341f0c2b714e9d00396dc06071f467ad103a6c56d7f034cb2d80284e09c1d2f7
