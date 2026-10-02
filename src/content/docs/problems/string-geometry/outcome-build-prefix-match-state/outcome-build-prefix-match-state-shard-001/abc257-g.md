---
title: "ABC257-G — Prefix Concatenation"
draft: true
authoringUnit: {"problemId":"abc257-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-prefix-match-state/outcome-build-prefix-match-state-shard-001/abc257-g.md","learningOutcomeIds":["outcome-build-prefix-match-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-z-algorithm-prefix-matching","tag-state-graph-search"],"sourceRevisionIds":["source-abc257-editorial-4185-c3fb04f556015262925a65e6bf12351d871b3716e77dd6fc4e4bbf51a8112de9","source-abc257-g-problem-bfed9ff74f7b42b586492a4c2a60a24d45b4e07466b903b78455d5bd5f3a48a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Z値から開始iに置けるSの接頭辞長L_iが得られ、遷移先は全ての終端[i+1,i+L_i]になる。k断片以下で到達する位置は0からfrontier_kまでの連続区間で、次のfrontierはその範囲の開始点のi+L_iの最大。新たに開いた開始点だけ一度ずつ走査すれば全BFS層を線形に処理できる。frontierが伸びなければ到達不能、初めて|T|を覆う層が最小断片数。現在位置の最長一致を即座に確定する貪欲法とは異なる。","sourceRevisionIds":["source-abc257-editorial-4185-c3fb04f556015262925a65e6bf12351d871b3716e77dd6fc4e4bbf51a8112de9","source-abc257-g-problem-bfed9ff74f7b42b586492a4c2a60a24d45b4e07466b903b78455d5bd5f3a48a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-prefix-match-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=aba、T=ababa。","procedure":["一断片の到達範囲は終端1,2,3。","開始2ではS=abaが三文字一致し終端5へ届く。","ab+abaという二断片の分割が得られる。"],"executionTarget":null,"expectedResult":"最小2。","verificationStatus":"not_applicable","learningUnitIds":["unit-z-algorithm"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-prefix-match-state"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"最初に最長接頭辞abaを必ず使うとどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"残りbaはSの接頭辞で始められず失敗する。開始2という短い第一断片の終端も同じ層で残すfrontier法なら正しい分割を発見する。"},"answer":{"reasoningOrVerification":"残りbaはSの接頭辞で始められず失敗する。開始2という短い第一断片の終端も同じ層で残すfrontier法なら正しい分割を発見する。","procedure":["具体例の各状態・寄与を再計算する。","残りbaはSの接頭辞で始められず失敗する。開始2という短い第一断片の終端も同じ層で残すfrontier法なら正しい分割を発見する。"],"expectedResult":"残りbaはSの接頭辞で始められず失敗する。開始2という短い第一断片の終端も同じ層で残すfrontier法なら正しい分割を発見する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md)

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Tの位置iから切り出せる断片長はSとの最長共通接頭辞L_i以下の全てであり、一つの長さが使えればそれより短いSの接頭辞も全て使える。

採用する候補: Z値と到達可能接頭辞の区間frontier DP

各開始位置iから到達可能な終端が連続区間[i+1,i+L_i]になるため、同じ使用回数で届く最遠端を走査して次のfrontierを線形に広げられる。

棄却する候補: 各位置で最長一致を必ず一断片として選ぶ貪欲法

最長断片を取ると次の境界が合わず、より短い接頭辞で区切れば完成できる場合がある。

棄却する候補: 全ての断片長へDP遷移

L_i個の終端を各位置から列挙すると最悪二次時間になる。

Z-algorithmをS+区切り文字+Tへ適用すれば、全開始位置のL_iを合計線形時間で求められる。

p個以下の断片で到達できる接頭辞長は区間をなし、その全開始位置からのi+L_iの最大がp+1個で届く最遠端になる。

S、未使用文字、Tを連結してZ値から各T位置のL_iを得る。到達済み位置を左から一度ずつ走査し、現在の断片数で使える開始位置のmax(i+L_i)を次frontierとして更新する。frontierが伸びなければ-1、|T|へ達した段階数を答える。

## 典型の発動条件

### Z-algorithm

発動条件: 一つのパターンSと文字列Tの全接尾辞との最長共通接頭辞が必要になる。

連結文字列のZ値を各開始位置の使用可能最大断片長にする。

### 区間到達のfrontier BFS

発動条件: 一遷移で現在位置から連続した終端区間へ進める。

同じ手数で到達可能な全開始位置をまとめて走査し、次層の最遠端だけを保持する。

## 問題固有の要素

辞書がSの全接頭辞なので、一致長L_iは単一の辺でなく終端の連続区間を表し、最短分割DPを区間frontierへ圧縮できる。

別の問題へ持ち帰る視点: 可変長遷移が[次の最小位置,最大位置]を全て覆うなら、個別遷移ではなくBFS層の最遠到達点を更新する。

## 正当性

Z値から開始iに置けるSの接頭辞長L_iが得られ、遷移先は全ての終端[i+1,i+L_i]になる。k断片以下で到達する位置は0からfrontier_kまでの連続区間で、次のfrontierはその範囲の開始点のi+L_iの最大。新たに開いた開始点だけ一度ずつ走査すれば全BFS層を線形に処理できる。frontierが伸びなければ到達不能、初めて|T|を覆う層が最小断片数。現在位置の最長一致を即座に確定する貪欲法とは異なる。

## 実装上の注意

- 区切り文字はS,Tに現れないものを選び、L_iを|S|とTの残長で上限化する。各開始位置を高々一回走査し、次frontier≤現在frontierなら不可能とする。

## 復習の核

- 二次DPとの比較に加え、最長断片貪欲が失敗するS=aba,T=ababa、先頭不一致、同一文字列、短い接頭辞を多数使う場合を確認する。

## 計算量と制約

### 時間

O(|S|+|T|)。

### 空間

O(|S|+|T|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq |S| \leq 5\times 10^5; 1 \leq |T| \leq 5\times 10^5; S and T are strings consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=aba、T=ababa。

1. 一断片の到達範囲は終端1,2,3。
2. 開始2ではS=abaが三文字一致し終端5へ届く。
3. ab+abaという二断片の分割が得られる。

期待される結果: 最小2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最初に最長接頭辞abaを必ず使うとどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

残りbaはSの接頭辞で始められず失敗する。開始2という短い第一断片の終端も同じ層で残すfrontier法なら正しい分割を発見する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/editorial/4185) — source-abc257-editorial-4185-c3fb04f556015262925a65e6bf12351d871b3716e77dd6fc4e4bbf51a8112de9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/tasks/abc257_g) — source-abc257-g-problem-bfed9ff74f7b42b586492a4c2a60a24d45b4e07466b903b78455d5bd5f3a48a5
