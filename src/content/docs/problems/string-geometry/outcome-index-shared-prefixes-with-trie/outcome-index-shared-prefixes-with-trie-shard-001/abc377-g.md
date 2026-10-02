---
title: "ABC377-G — Edit to Match"
draft: true
authoringUnit: {"problemId":"abc377-g","docPath":"src/content/docs/problems/string-geometry/outcome-index-shared-prefixes-with-trie/outcome-index-shared-prefixes-with-trie-shard-001/abc377-g.md","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。"],"tagIds":["tag-trie-prefix"],"sourceRevisionIds":["source-abc377-editorial-11244-f5941b10cd7d44e81a62374d091caa772405c26ae8fe723044fa153ec8db2c9b","source-abc377-g-problem-c47c0dc695430363ff5c459e97a1f4cdc8c4d0ed503230ac98b5fc0495cda29a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"末尾削除追加だけの最短編集は共通prefixまで戻る距離|S|+|T|−2LCP。固定prefix深さiでは最短の過去Tだけ残せば他Tより候補が悪化しない。全prefix候補を走査するため実際の最良LCPも含まれる。自己挿入前に評価し空列候補をrootへ入れれば全許可過去列との最小値を得る。","sourceRevisionIds":["source-abc377-editorial-11244-f5941b10cd7d44e81a62374d091caa772405c26ae8fe723044fa153ec8db2c9b","source-abc377-g-problem-c47c0dc695430363ff5c459e97a1f4cdc8c4d0ed503230ac98b5fc0495cda29a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"入力順abc,abd,ab。","procedure":["abcは空から3追加。abdはabcからc削除+d追加で2。","abはabc/abdから末尾一文字削除で1。"],"executionTarget":null,"expectedResult":"3,2,1。","verificationStatus":"not_applicable","learningUnitIds":["unit-trie-prefix"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"prerequisiteIds":[],"attainmentCondition":"現在文字列をtrieへ先に登録すると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"評価後に登録。"},"answer":{"reasoningOrVerification":"自分自身を距離0候補にしてしまう。前の列だけ使えるので評価後にminLen更新する。","procedure":["具体例の各状態・寄与を再計算する。","自分自身を距離0候補にしてしまう。前の列だけ使えるので評価後にminLen更新する。"],"expectedResult":"評価後に登録。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

- 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 考察

過去文字列 T を S_k に変える最小操作数は |S_k|+|T|-2·lcp(S_k,T) である。各 prefix p について、p を接頭辞にもつ過去文字列の最小長だけ分かれば全 T の最小を取れる。

採用する候補: 過去文字列を trie に挿入し、各 node にその prefix をもつ文字列の最小長を保持して、S_k の root-to-leaf path 上で式を最小化する。

必要な候補は S_k の各 prefix に対応する O(|S_k|) 個へ集約され、全長和に比例する時間で query と挿入ができる。

棄却する候補: 新しい文字列ごとに全過去文字列との LCP を直接比較する。

文字列数と総長が2×10^5でも、類似した長い文字列が多いと比較総量が二乗になる。

削除して LCP まで戻り、残りを追加する編集だけなので距離式は長さと LCP だけで決まる。

固定 prefix 長 i の候補では |T| が最小の過去文字列だけ残せば、他は同じ LCP で必ず劣る。

trie root を空文字列長0で初期化する。S_k を辿りながら node の minLen を使い |S_k|+minLen-2i を評価し、出力後に path 上の minLen を |S_k| で chmin する。

## 典型の発動条件

### Trie 上の prefix DP

発動条件: 文字列間コストが共通 prefix 長と相手の要約値で決まるとき。

各 prefix node に過去候補の最小長を集約する。

## 問題固有の要素

編集列を考える代わりに、最適な折返し地点が二文字列の LCP であることを式にする。

別の問題へ持ち帰る視点: 同じ prefix を共有する候補は、将来の query に必要な min 長だけを残せる。

## 正当性

末尾削除追加だけの最短編集は共通prefixまで戻る距離|S|+|T|−2LCP。固定prefix深さiでは最短の過去Tだけ残せば他Tより候補が悪化しない。全prefix候補を走査するため実際の最良LCPも含まれる。自己挿入前に評価し空列候補をrootへ入れれば全許可過去列との最小値を得る。

## 実装上の注意

- 空文字列を過去候補として root に長さ0で入れる。答えを計算してから S_k 自身を挿入し、同時刻の自己利用を防ぐ。

## 復習の核

- 距離式 |S|+|T|-2·lcp を先に導き、固定 LCP なら T のどの情報だけが必要かを問い直す。

## 計算量と制約

### 時間

O(L)、L=Σ|S_i|。trie上の最小長を更新する。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; Each S_i is a string of length at least 1 consisting of lowercase English letters.; \displaystyle \sum_{i=1}^N |S_i|\le 2\times 10^5

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

入力順abc,abd,ab。

1. abcは空から3追加。abdはabcからc削除+d追加で2。
2. abはabc/abdから末尾一文字削除で1。

期待される結果: 3,2,1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

現在文字列をtrieへ先に登録すると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

自分自身を距離0候補にしてしまう。前の列だけ使えるので評価後にminLen更新する。

確認結果: 評価後に登録。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/editorial/11244) — source-abc377-editorial-11244-f5941b10cd7d44e81a62374d091caa772405c26ae8fe723044fa153ec8db2c9b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc377/tasks/abc377_g) — source-abc377-g-problem-c47c0dc695430363ff5c459e97a1f4cdc8c4d0ed503230ac98b5fc0495cda29a
