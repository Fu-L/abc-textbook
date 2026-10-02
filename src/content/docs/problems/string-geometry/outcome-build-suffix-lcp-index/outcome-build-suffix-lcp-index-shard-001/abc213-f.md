---
title: "ABC213-F — Common Prefixes"
draft: true
authoringUnit: {"problemId":"abc213-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc213-f.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-stack-queue"],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index","tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc213-editorial-2391-534c84f6432876508004b5c292c65c02485f600cd78973b126d80cdd50be2a0d","source-abc213-f-problem-db1b92140a905bd0d6d2a457fed88756303e0d045ee8df1a5f163cd555443a82"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"接尾辞配列上で順位p<qの二接尾辞のLCPは、その間の隣接LCPの最小値である。隣接区間で共通するprefixは全接尾辞へ共通し、区間内にそれより短い隣接LCPがあれば全体の一致もそこで途切れる。各順位から左への区間最小値和をstackで保ち、新しい値vが来たらv以上の末尾groupを併合する。各開始位置はただ一つの最小値groupへ属し、個数×最小値の和が寄与になる。右からも同じ処理を行い、自己とのLCPである接尾辞長を加えれば全相手を一度ずつ数える。各groupは一度pushされ一度popされる。","sourceRevisionIds":["source-abc213-editorial-2391-534c84f6432876508004b5c292c65c02485f600cd78973b126d80cdd50be2a0d","source-abc213-f-problem-db1b92140a905bd0d6d2a457fed88756303e0d045ee8df1a5f163cd555443a82"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=aba。相手には自分の接尾辞も含める。","procedure":["接尾辞は開始位置順に aba, ba, a。接尾辞配列順では a, aba, ba、隣接LCPは1,0。","abaの寄与は3+0+1=4。baの寄与は0+2+0=2。aの寄与は1+0+1=2。"],"executionTarget":null,"expectedResult":"開始位置順の答えは4,2,2。","verificationStatus":"not_applicable","learningUnitIds":["unit-suffix-lcp-index"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"prerequisiteIds":["unit-monotone-stack-queue"],"attainmentCondition":"S=aaaでは同じLCP値のgroupを統合してよいか。答えも計算する。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"値が同じgroupは開始位置数を足して統合する。要素を一つへ捨てるのではない。各答えは3+2+1=6、2+2+1=5、1+1+1=3。"},"answer":{"reasoningOrVerification":"値が同じgroupは開始位置数を足して統合する。要素を一つへ捨てるのではない。各答えは3+2+1=6、2+2+1=5、1+1+1=3。","procedure":["具体例の各状態・寄与を再計算する。","値が同じgroupは開始位置数を足して統合する。要素を一つへ捨てるのではない。各答えは3+2+1=6、2+2+1=5、1+1+1=3。"],"expectedResult":"値が同じgroupは開始位置数を足して統合する。要素を一つへ捨てるのではない。各答えは3+2+1=6、2+2+1=5、1+1+1=3。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

対象外:

- rolling hashによる一致比較と回文半径。

## 考察

二つの接尾辞の共通接頭辞長は、接尾辞配列上で両者の順位の間に並ぶ隣接 LCP 値の最小値に等しい。

一つの接尾辞を固定すると、他の接尾辞との LCP 総和は、その順位から左へ延ばす区間最小値の総和と右へ延ばす区間最小値の総和に分けられる。

棄却する候補: 全ての接尾辞対について LCP 配列上の区間最小値を問い合わせ、各接尾辞の答えへ加える。

区間最小値を高速に答えても接尾辞対そのものが二乗個あり、全ての答えを作れない。

採用する候補: 接尾辞配列と LCP 配列を構成し、単調スタックで各終端に対する区間最小値の総和を左右から一括計算する。

LCP 値が新たな最小値になる区間をまとめて管理でき、全順位の左右の寄与を線形走査で得られる。

必要なのは各 LCP 問合せの値ではなくそれらの総和なので、RMQ を繰り返す代わりに「区間最小値の総和」の問題として処理する。

単調スタックには LCP 値と、その値が現在の最小値になる開始位置の個数をまとめて持たせると総和を差分更新できる。

接尾辞対の LCP を接尾辞配列上の区間最小値へ写し、LCP 配列を正順・逆順に単調スタックで走査して左右の全区間最小値和を合成する。

## 典型の発動条件

### 接尾辞配列と LCP 配列

発動条件: 多数の接尾辞どうしの辞書順関係や共通接頭辞長をまとめて扱うとき。

各接尾辞を順位へ変換し、二順位間の LCP を隣接 LCP 列の区間最小値として表す。

### 単調スタックによる区間最小値和

発動条件: 全ての始点または終点に対する区間の最小値の合計を求めるとき。

値と担当区間数をまとめ、より小さい LCP が来たら大きい値の区間を併合して累積和を更新する。

## 問題固有の要素

固定した接尾辞自身との LCP はその接尾辞の長さであり、左右の LCP 配列から得る他接尾辞の寄与とは別に足す必要がある。

別の問題へ持ち帰る視点: 全要素との対比較和を左右走査へ分解したときは、比較対象が自分自身である対角成分が走査に含まれるかを確認する。

## 正当性

接尾辞配列上で順位p<qの二接尾辞のLCPは、その間の隣接LCPの最小値である。隣接区間で共通するprefixは全接尾辞へ共通し、区間内にそれより短い隣接LCPがあれば全体の一致もそこで途切れる。各順位から左への区間最小値和をstackで保ち、新しい値vが来たらv以上の末尾groupを併合する。各開始位置はただ一つの最小値groupへ属し、個数×最小値の和が寄与になる。右からも同じ処理を行い、自己とのLCPである接尾辞長を加えれば全相手を一度ずつ数える。各groupは一度pushされ一度popされる。

## 実装上の注意

- 総和は二乗規模まで増えるため 64 bit 整数を使い、接尾辞配列の順位から元の開始位置へ答えを戻す。
- 同じ LCP 値をスタックで併合する比較規則を正順と逆順で統一し、区間数の重複や欠落を防ぐ。

## 復習の核

- 接尾辞対を見たら、まず辞書順で隣接する LCP 列へ移し、個別 RMQ ではなく集約量を求めている点を利用する。
- 単調スタックの各要素が「どの開始位置群の最小値を代表するか」を言葉で説明し、左右の寄与の向きを確認する。

## 計算量と制約

### 時間

SA-ISで接尾辞配列を構築する場合は O(N)。LCP計算と左右の単調stack走査も O(N)。比較ソートによるdoubling構築を使う場合は、その構築費用を別途加える。

### 空間

接尾辞配列・逆順位・LCP・stack・答えの各列を保持して O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^6; S is a string of length N consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=aba。相手には自分の接尾辞も含める。

1. 接尾辞は開始位置順に aba, ba, a。接尾辞配列順では a, aba, ba、隣接LCPは1,0。
2. abaの寄与は3+0+1=4。baの寄与は0+2+0=2。aの寄与は1+0+1=2。

期待される結果: 開始位置順の答えは4,2,2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=aaaでは同じLCP値のgroupを統合してよいか。答えも計算する。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

値が同じgroupは開始位置数を足して統合する。要素を一つへ捨てるのではない。各答えは3+2+1=6、2+2+1=5、1+1+1=3。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/editorial/2391) — source-abc213-editorial-2391-534c84f6432876508004b5c292c65c02485f600cd78973b126d80cdd50be2a0d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/tasks/abc213_f) — source-abc213-f-problem-db1b92140a905bd0d6d2a457fed88756303e0d045ee8df1a5f163cd555443a82
