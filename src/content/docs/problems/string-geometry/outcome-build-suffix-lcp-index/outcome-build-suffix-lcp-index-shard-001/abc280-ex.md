---
title: "ABC280-EX — Substring Sort"
draft: true
authoringUnit: {"problemId":"abc280-ex","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc280-ex.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-stack-queue"],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index","tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc280-editorial-5332-5fe0f42d10a24b904294ed89de5b1f424075902dd282d2607ff3986a8efa79c5","source-abc280-ex-problem-82d5cbd4eb164acf4fca03545ef6fead6bb70019652981eb20d6143b041a7b14"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"全substring occurrenceは各有効suffixの非空prefixと一対一対応する。SAと元文字列末端でcapしたLCPは、同じprefixを持つsuffix群の連続区間を与える。LCP stackで辞書順に、長さ(a,b]とsuffix区間[i,j]のblockを列挙すると、各長さにj−i+1個の等しいoccurrenceがありblock個数は(b−a)(j−i+1)。全blockはprefixを過不足なく分割する。累積個数と昇順のrank質問を同時走査し、block内の長さとoccurrenceへ逆算すれば正しい順位を復元できる。","sourceRevisionIds":["source-abc280-editorial-5332-5fe0f42d10a24b904294ed89de5b1f424075902dd282d2607ff3986a8efa79c5","source-abc280-ex-problem-82d5cbd4eb164acf4fca03545ef6fead6bb70019652981eb20d6143b041a7b14"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

先に読む単元:

- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md) — 候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。

この解説で扱わないこと:

- rolling hashによる一致比較と回文半径。

## 考察

全substring tripleは総数Mが二次規模になり得るため実体化できないが、各substringはある元string suffixの非空prefixとして一意に表せる。

suffixを辞書順に並べると、同じprefix文字列を持つsuffixはLCP条件で連続区間になり、その文字列のoccurrence tripleも連続blockとして数えられる。

採用する候補: 全stringをseparator付きで連結してsuffix array/LCPを作り、LCP intervalをmonotone stackで辞書順blockへ圧縮し、query rankを累積個数から逆算する。

suffix総数は10^5で、最大二次個のsubstring occurrenceをO(total length)個のLCP blockとして扱える。

棄却する候補: 各suffixの全prefix tripleを生成し、文字列比較でsortする。

substring数Mが各|S_i|²の和で、memory・sortingとも制約を超える。

separatorを全英小文字より小さく置いた連結stringのsuffix順は、separatorで切った各元suffixの辞書順を保つ。LCPは元string末尾までにcapする。

TのSA順の葉と隣接LCPから、圧縮prefix木を作る。内部nodeの深さは共有prefix長、葉の深さは元文字列内の残りsuffix長であり、separatorを含めない。

stackにはrootから右端の内部nodeまでを深さ昇順で持つ。次の葉を加える前に直前の葉とのLCP=hを読み、深さ>hのnodeをpopする。pop済み部分木は既に親へ接続されているので、最後にpopした部分木（popがなければ直前の葉）を直前の子とする。stack上端の深さ<hなら深さhの内部nodeを作り、親の最後の子をそのnodeへ付け替え、直前の子をその下へ移す。深さ=hなら既存nodeを使う。新しい葉をその末尾の子へ追加する。このpop・付け替えで各nodeを一度ずつ作り、子のSA順も保てる。

親深さaから子深さbへの枝に対して、子の葉範囲[i,j]と長さ帯(a,b]が一blockになる。葉でも同じ扱いで、bは残りsuffix長。suffixが別suffixのprefixだったり同一suffixが複数あったりする場合、深さが等しい葉を許し、長さ0の枝は出力しない。その葉も祖先blockの多重度には含める。

辞書順走査では、枝の長さa+1,…,bを短い順に先に出し、その後で子の枝をSA順に辿る。prefix自身はそれを延ばした文字列より小さいから、この順序でよい。S="ab"ならrootの子の葉は"ab"と"b"で、前者の枝が"a","ab"、後者が"b"を出す。

blockの多重度m=j−i+1、個数m(b−a)を累積し、queryが入ったblock内の0-based offsetをtとする。長さR=a+1+floor(t/m)、出現はT[i+(t mod m)]から取る。出現が元文字列Kの位置Lなら(K,L,L+R−1)を出す。同一文字列の出現順は任意でよく、昇順queryとblockを一緒に走査できる。

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
