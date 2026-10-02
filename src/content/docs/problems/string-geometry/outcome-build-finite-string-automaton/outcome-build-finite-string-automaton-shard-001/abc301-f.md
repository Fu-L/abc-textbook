---
title: "ABC301-F — Anti-DDoS"
draft: true
authoringUnit: {"problemId":"abc301-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc301-f.md","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-normalization"],"excludedTopics":["有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-finite-pattern-automaton","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17","source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"禁止subsequenceは同じ大文字二回、その後の小文字、その後の大文字の段階で進む。未重複大文字段階では具体的集合のうち固定prefix分は既知で、?由来の残りは対称なので種類数だけで新/既出への係数を決められる。各文字追加の分類は52置換を互いに素に分け、禁止完成遷移だけ落とすため全safe完成列を一度数える。","sourceRevisionIds":["source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17","source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=AAa?。","procedure":["AAの重複後にaがあり、最後が大文字なら禁止完成。","?の小文字26択は完成しない。"],"executionTarget":null,"expectedResult":"26通り。","verificationStatus":"not_applicable","learningUnitIds":["unit-finite-pattern-automaton"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-finite-string-automaton","outcome-run-dp-on-finite-automaton"],"prerequisiteIds":["unit-modular-arithmetic","unit-normalization"],"attainmentCondition":"S=ABa?なら同じ26か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"52。"},"answer":{"reasoningOrVerification":"A,Bは異なる大文字で、先行同大文字二回がない。最後一文字ではその後の小文字と大文字まで揃えられず全52択safe。","procedure":["具体例の各状態・寄与を再計算する。","A,Bは異なる大文字で、先行同大文字二回がない。最後一文字ではその後の小文字と大文字まで揃えられず全52択safe。"],"expectedResult":"52。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

- 未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

DDoS型subsequenceの進行はほぼ少数段階で、最初の大文字が再出現したかの判定には具体的集合でなく既出大文字種類数だけが必要である。

採用する候補: 大文字種類数を含む29状態prefix DP

大文字なし、全大文字一度ずつの種類数1..26、重複後の小文字/後続大文字有無を状態にすれば各文字の遷移数を集約できる。

棄却する候補: 既出大文字集合2^26を状態化

文字列長3×10^5で状態が大きすぎる。

固定prefixに現れる大文字種類数xを別途知れば、?で新しい大文字を引く確率とDP文字列内既出へ当たる確率を種類数y-xから計算できる。

固定prefixの大文字情報と29状態の個数DPを左から更新する。?の52通りを種類別係数で集約し、同一大文字2回→小文字→大文字という禁止部分列を完成させる遷移を除外する。最後に禁止部分列が未完成の全状態を足す。全52^qから引かない。

## 典型の発動条件

### automaton DP

発動条件: 禁止/要求subsequenceの進行が有限状態で表せる。

文字列prefixごとに最長進行段階を更新する。

### 対称性による集合圧縮

発動条件: 26文字集合の種類名でなくcardinalityだけが遷移確率に効く。

既出大文字数yを状態にする。

## 問題固有の要素

固定大文字と?由来大文字を分け、具体名の対称性を種類数へ圧縮することで2^26を29状態に落とす。

別の問題へ持ち帰る視点: alphabet対称性がある集合状態はサイズ統計へ縮約する。

## 正当性

禁止subsequenceは同じ大文字二回、その後の小文字、その後の大文字の段階で進む。未重複大文字段階では具体的集合のうち固定prefix分は既知で、?由来の残りは対称なので種類数だけで新/既出への係数を決められる。各文字追加の分類は52置換を互いに素に分け、禁止完成遷移だけ落とすため全safe完成列を一度数える。

## 実装上の注意

- ?の52通り係数、固定prefixの大文字種類x、重複大文字後の小文字・大文字段階を正確に分ける。

## 復習の核

- 短文字列の52^q全探索と比較し、同大文字2回、重複間/後の小文字、?だけの例を確認する。

## 計算量と制約

### 時間

O(29|S|)。固定prefix大文字種類と定数状態DP。

### 空間

O(29+26)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S consists of uppercase English letters, lowercase English letters, and ?.; The length of S is between 4 and 3\times 10^5, inclusive.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=AAa?。

1. AAの重複後にaがあり、最後が大文字なら禁止完成。
2. ?の小文字26択は完成しない。

期待される結果: 26通り。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=ABa?なら同じ26か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

A,Bは異なる大文字で、先行同大文字二回がない。最後一文字ではその後の小文字と大文字まで揃えられず全52択safe。

確認結果: 52。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6331) — source-abc301-editorial-6331-5ae6dc8c4af9784aa44c7ad8851a172873cb1701670c49d59de81601b3306d17
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_f) — source-abc301-f-problem-431cc5cde126dc99944d72bcf4abe0ab3d79a81e62d19e355303dd39e89622f9
