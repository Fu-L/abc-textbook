---
title: "ABC268-EX — Taboo"
draft: true
authoringUnit: {"problemId":"abc268-ex","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc268-ex.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-greedy-exchange","unit-ordered-set-multiset","unit-range-monoid-aggregation"],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index","tag-event-sweep","tag-greedy-exchange-order","tag-ordered-set-multiset","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc268-ex-problem-7bc3740f33b773d694da1a30daf23c74899b34ee2b31af87754be5930ed8a57a","source-abc268-editorial-4786-b4bee560711f772c733767744ffc966a1a9147566653114ecb210162924eac81"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各禁止語に一致する接頭辞を持つsuffixはSA上の連続区間になる。禁止語を短い順に処理し、未割当のS内suffixだけをordered setから削除して最短一致長を渡せば、各開始点は一回しか割り当てられない。同じ開始点の長い禁止区間は最短区間をhitすれば自動的にhitするので捨てられる。残る区間を右端昇順に見て未hitなら右端を変更する貪欲は、最初の未hit区間を変更する位置をその右端に交換しても後続区間への有効性を減らさない。変更文字に入力外の文字を使えば新しい禁止語も生じない。","sourceRevisionIds":["source-abc268-ex-problem-7bc3740f33b773d694da1a30daf23c74899b34ee2b31af87754be5930ed8a57a","source-abc268-editorial-4786-b4bee560711f772c733767744ffc966a1a9147566653114ecb210162924eac81"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=ababa、禁止語はaba一つ。","procedure":["一致区間は0始まりで[0,2]と[2,4]。","最初の区間の右端2を入力外の文字へ変更する。","二番目の区間も位置2を含むので追加変更は不要。"],"executionTarget":null,"expectedResult":"最小変更数1。","verificationStatus":"not_applicable","learningUnitIds":["unit-suffix-lcp-index"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"prerequisiteIds":["unit-event-sweep","unit-greedy-exchange","unit-ordered-set-multiset","unit-range-monoid-aggregation"],"attainmentCondition":"同じ開始点の禁止語abとabaについて長い区間を捨ててよい理由は何か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"短い区間[0,1]は長い[0,2]に含まれる。短い方を壊す変更は長い方も必ず壊すため、長い制約は冗長である。"},"answer":{"reasoningOrVerification":"短い区間[0,1]は長い[0,2]に含まれる。短い方を壊す変更は長い方も必ず壊すため、長い制約は冗長である。","procedure":["具体例の各状態・寄与を再計算する。","短い区間[0,1]は長い[0,2]に含まれる。短い方を壊す変更は長い方も必ず壊すため、長い制約は冗長である。"],"expectedResult":"短い区間[0,1]は長い[0,2]に含まれる。短い方を壊す変更は長い方も必ず壊すため、長い制約は冗長である。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- rolling hashによる一致比較と回文半径。

## 考察

文字を*へ変える操作は新しい小文字patternを作らないため、元Sに現れる全禁止語区間へ少なくとも一つ変更位置を置けば十分かつ必要である。

同じ開始位置に複数の禁止語が一致するなら、最短区間をhitすればそれを含む全長区間も同時にhitする。

棄却する候補: 各開始位置と各禁止語を直接比較し、全出現区間を列挙する。

|S|と禁止語数・総長の積が大きく、一致判定を全組で行えない。

採用する候補: Sと全Tを連結したsuffix array/LCPを作り、短いTからそのprefixを持つSA区間内の未割当S suffixへ最短長を配り、得た区間群を右端貪欲でhitする。

pattern一致suffixはSA上の連続区間になり、各S開始位置を最初の一回だけ削除するordered setで総割当量を線形に抑えられる。

二suffixのLCPはSA順位間のLCP配列最小値なので、RMQと二分探索でpattern Tをprefixに持つsuffix順位区間を求められる。

区間hittingの最少点数は右端昇順に見て、直前の選択点が区間外ならその右端を選ぶ標準貪欲で得られる。

multi-pattern occurrence detectionをsuffix-order range assignmentへ変換し、substring destructionをminimum interval stabbingへ帰着する。

## 典型の発動条件

### suffix arrayとLCPによるpattern一致区間

発動条件: 多数のpatternについて、全text suffixのうちpatternをprefixに持つものをまとめて求めたいとき。

pattern開始suffixのSA順位からLCP閾値を保つ左右境界をRMQ二分探索する。

### 短い順の区間割当とordered set削除

発動条件: 各対象へそれを覆う候補の最小サイズだけを割り当て、候補範囲が順序区間になるとき。

候補をサイズ昇順に処理し、SA区間内の未割当位置をsetから列挙・削除する。

### 区間を刺す最小点の右端貪欲

発動条件: 全区間へ少なくとも一点を置く最小点数を求めるとき。

右端が小さい区間から処理し、未hitならその右端を選ぶ。

## 問題固有の要素

連結文字列では各S,Tの境界を越える偽一致を防ぐため、入力alphabet外のseparatorを入れる。

別の問題へ持ち帰る視点: 複数文字列を一つのsuffix構造へ載せるときは、境界横断substringを無効化するseparator設計を行う。

## 正当性

各禁止語に一致する接頭辞を持つsuffixはSA上の連続区間になる。禁止語を短い順に処理し、未割当のS内suffixだけをordered setから削除して最短一致長を渡せば、各開始点は一回しか割り当てられない。同じ開始点の長い禁止区間は最短区間をhitすれば自動的にhitするので捨てられる。残る区間を右端昇順に見て未hitなら右端を変更する貪欲は、最初の未hit区間を変更する位置をその右端に交換しても後続区間への有効性を減らさない。変更文字に入力外の文字を使えば新しい禁止語も生じない。

## 実装上の注意

- ordered setにはS内開始位置に対応するSA順位だけを入れ、T側やseparator開始suffixを割り当てない。
- 最短一致長が得られた開始iだけ区間[i,i+len−1]を作り、右端でsortしてgreedyを行う。

## 復習の核

- 同じ開始位置のpattern出現が包含関係なら、最小区間だけ残してhitting制約を圧縮する。
- substringを壊す位置選択は、出現検出部分と区間stabbing部分を独立に設計する。

## 計算量と制約

### 時間

L=|S|+Σ|T_i|+N としてO(L log L+N log L+|S| log |S|)。LCPのsparse table RMQを用いる。

### 空間

O(L log L)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq |S| \leq 5 \times 10^5; 1 \leq N; N is an integer.; 1 \leq |T_i|; \sum{|T_i|} \leq 5 \times 10^5; T_i \neq T_j if i \neq j.; S and T_i are strings consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=ababa、禁止語はaba一つ。

1. 一致区間は0始まりで[0,2]と[2,4]。
2. 最初の区間の右端2を入力外の文字へ変更する。
3. 二番目の区間も位置2を含むので追加変更は不要。

期待される結果: 最小変更数1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ開始点の禁止語abとabaについて長い区間を捨ててよい理由は何か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

短い区間[0,1]は長い[0,2]に含まれる。短い方を壊す変更は長い方も必ず壊すため、長い制約は冗長である。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/tasks/abc268_h) — source-abc268-ex-problem-7bc3740f33b773d694da1a30daf23c74899b34ee2b31af87754be5930ed8a57a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/editorial/4786) — source-abc268-editorial-4786-b4bee560711f772c733767744ffc966a1a9147566653114ecb210162924eac81
