---
title: "ABC280-EX — Substring Sort"
draft: true
authoringUnit: {"problemId":"abc280-ex","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc280-ex.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-stack-queue"],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index","tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc280-editorial-5332-5fe0f42d10a24b904294ed89de5b1f424075902dd282d2607ff3986a8efa79c5","source-abc280-ex-problem-82d5cbd4eb164acf4fca03545ef6fead6bb70019652981eb20d6143b041a7b14"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全substring occurrenceは各有効suffixの非空prefixと一対一対応する。SAと元文字列末端でcapしたLCPは、同じprefixを持つsuffix群の連続区間を与える。LCP stackで辞書順に、長さ(a,b]とsuffix区間[i,j]のblockを列挙すると、各長さにj−i+1個の等しいoccurrenceがありblock個数は(b−a)(j−i+1)。全blockはprefixを過不足なく分割する。累積個数と昇順のrank質問を同時走査し、block内の長さとoccurrenceへ逆算すれば正しい順位を復元できる。","sourceRevisionIds":["source-abc280-editorial-5332-5fe0f42d10a24b904294ed89de5b1f424075902dd282d2607ff3986a8efa79c5","source-abc280-ex-problem-82d5cbd4eb164acf4fca03545ef6fead6bb70019652981eb20d6143b041a7b14"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

全substring tripleは総数Mが二次規模になり得るため実体化できないが、各substringはある元string suffixの非空prefixとして一意に表せる。

suffixを辞書順に並べると、同じprefix文字列を持つsuffixはLCP条件で連続区間になり、その文字列のoccurrence tripleも連続blockとして数えられる。

採用する候補: 全stringをseparator付きで連結してsuffix array/LCPを作り、LCP intervalをmonotone stackで辞書順blockへ圧縮し、query rankを累積個数から逆算する。

suffix総数は10^5で、最大二次個のsubstring occurrenceをO(total length)個のLCP blockとして扱える。

棄却する候補: 各suffixの全prefix tripleを生成し、文字列比較でsortする。

substring数Mが各|S_i|²の和で、memory・sortingとも制約を超える。

separatorを全英小文字より小さく置いた連結stringのsuffix順は、separatorで切った各元suffixの辞書順を保つ。LCPは元string末尾までにcapする。

suffix区間[i,j]についてa=max(LCP[i-1],LCP[j])、b=min(LCP[i…j-1])なら、a<R≤bの各prefix長はちょうどj-i+1個の等しいsubstring occurrenceを持つ。

有効な(i,j) blockはLCPのCartesian/stack構造上線形個しかなく、所与xがblock内ならoffsetをmultiplicityで割ってprefix長とoccurrenceを復元できる。

各S_iにseparatorを付けて連結しSAとLCPを構築、separator suffixを除いたT=(string id,start)とcap済みLCPを得る。stackで有効(i,j,a,b)を辞書順に走査しblock size=(j-i+1)(b-a)を累積する。昇順query xが入るblockでRとT内occurrenceを選び(K,L,L+R-1)を出す。

## 典型の発動条件

### suffix arrayとLCP

発動条件: 多数のsuffix/prefix由来文字列を辞書順に扱い、共通prefix区間を知りたいとき。

全suffixをsortし、隣接LCPから同prefixを共有する連続範囲を得る。

### LCP intervalのmonotone stack

発動条件: suffix tree相当のprefix groupを明示treeなしで線形列挙したいとき。

LCPの増減をstackで管理し、有効なsuffix区間と深さ範囲をblock化する。

### 巨大sorted multisetのrank selection

発動条件: 要素総数は巨大だが等値groupのsizeを圧縮して順に数えられるとき。

block累積数でrankをlocateし、block内offsetから代表要素を復元する。

## 問題固有の要素

substringの辞書順multisetは、suffix順とLCP intervalごとのprefix長帯(a,b]を組み合わせると線形個の長方形blockに分解できる。

別の問題へ持ち帰る視点: quadraticなsubstring occurrenceを扱うときは、suffixを起点にし、同prefixのoccurrence区間×長さ区間として圧縮する。

## 正当性

全substring occurrenceは各有効suffixの非空prefixと一対一対応する。SAと元文字列末端でcapしたLCPは、同じprefixを持つsuffix群の連続区間を与える。LCP stackで辞書順に、長さ(a,b]とsuffix区間[i,j]のblockを列挙すると、各長さにj−i+1個の等しいoccurrenceがありblock個数は(b−a)(j−i+1)。全blockはprefixを過不足なく分割する。累積個数と昇順のrank質問を同時走査し、block内の長さとoccurrenceへ逆算すれば正しい順位を復元できる。

## 実装上の注意

- separatorを跨ぐLCPを元suffix長で必ずcapし、separator始まりsuffixと空prefixをTから除外する。
- Mとblock累積は文字列長の二次規模で32 bitを超え得るため64 bitを使い、block内のequal occurrenceは任意順でよいという出力許容を利用する。

## 復習の核

- suffix群abab,bab,ab…のprefixをLCP区間へ並べ、同じ'ab'が区間[i,j]・長さR=2のmultiplicityとして現れることを手で確かめる。

## 計算量と制約

### 時間

SA-ISと線形LCP/stack構成でO(L+Q)。L=Σ|S_i|+N。

### 空間

O(L+Q)（全回答を保持する場合）。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq \lvert S_i\rvert \leq 10^5; \displaystyle\sum_{i=1}^N \lvert S_i\rvert\leq 10^5; 1 \leq Q \leq 2\times 10^5; 1 \leq x_1<x_2<\cdots<x_Q \leq \displaystyle\sum_{i=1}^N \frac{|S_i|(|S_i|+1)}{2}; N,Q,x_1,x_2,\ldots,x_Q are integers.; S_i is a string consisting of lowercase English letters.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/editorial/5332) — source-abc280-editorial-5332-5fe0f42d10a24b904294ed89de5b1f424075902dd282d2607ff3986a8efa79c5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc280/tasks/abc280_h) — source-abc280-ex-problem-82d5cbd4eb164acf4fca03545ef6fead6bb70019652981eb20d6143b041a7b14
