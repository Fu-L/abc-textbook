---
title: "ABC425-G — Sum of Min of XOR"
draft: true
authoringUnit: {"problemId":"abc425-g","docPath":"src/content/docs/problems/data-structures/outcome-query-bitwise-order-with-trie/outcome-query-bitwise-order-with-trie-shard-001/abc425-g.md","learningOutcomeIds":["outcome-query-bitwise-order-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-recursive-divide-and-conquer"],"excludedTopics":["文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。"],"tagIds":["tag-binary-trie","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc425-editorial-14087-8cdd7294ddd4a59ef9ef2a1b40db4ca62e3e9167e956f318df271eee16191e69","source-abc425-g-problem-625ba8459cf4ed915d88b837470014e58cc381321869d6c0da01c744941db707"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"最高bitが一致する候補は不一致候補より必ず小さいxor値を持つので、両側非空なら各半区間は一致側だけへ進む。片側のみなら不一致半区間の各xへhを加え、下位bitは同じ子集合へ帰着する。Wでは子の全域が二度現れ、Fでは完全半区間をWから、端数半区間をFから取るので、指定式が各xの最小xorを正確に合計する。基底k=0からの帰納法で両返値が正しく、一子を一回だけ呼ぶので全域再計算による重複処理もない。","sourceRevisionIds":["source-abc425-editorial-14087-8cdd7294ddd4a59ef9ef2a1b40db4ca62e3e9167e956f318df271eee16191e69","source-abc425-g-problem-625ba8459cf4ed915d88b837470014e58cc381321869d6c0da01c744941db707"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md)

- 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。

## 考察

各xのmin_i(x xor A_i)は、最上位bitが一致するA_iがあれば必ずそちらで達成される。xの区間[0,M)もそのbitで二つに分けられる。従ってbitごとの分割を候補にするが、一致側が空のときに同じ集合を二回再帰すると、O(NB)という評価は成立しない。全域の和を一回計算して再利用する形が必要である。

値が2^k未満の非空集合Aについて、W(A,k)=Σ_{0≤x<2^k}min_i(x xor A_i)、F(A,m,k)=Σ_{0≤x<m}min_i(x xor A_i)を定義する。0≤m≤2^k。WとFを一組で返す再帰を作る。k=0では両方0。h=2^{k−1}としてAをbit0側B_0とbit1側B_1へ分け、B_1ではhを引いて下位bitだけを残す。

両側非空なら各子を一回ずつ呼ぶ。要求するprefix長はm_0=min(m,h)、m_1=max(0,m−h)。子の返値(W_0,F_0),(W_1,F_1)から W=W_0+W_1、F=F_0+F_1 になる。

片側だけが非空の場合、その子をBとする。全域では、bitが一致するh個と不一致のh個が同じ下位bitを全て一回ずつ取るので W=2W(B,k−1)+h²。子のprefix長はm≤hならm、m>hならm−hとして一回だけ呼び、返値を(w,f)とする。

- B_0だけ非空: m≤hではF=f、m>hではF=w+f+h(m−h)。
- B_1だけ非空: m≤hではF=f+hm、m>hではF=w+h²+f。

上半分へ入る前の完全な下半分はwから得るので、同じ子を全域用とprefix用に二回呼ばない。m=0でもWを求めるための再帰は必要だが、Fは0である。最初は全入力値とMを覆うB bitで呼び、Fを答える。

各子集合は一度だけbit分割され、各A_iは一bit階層で一つの呼出しだけに入る。全域とprefixを同時に返すことでO(NB)を保つ。全M個のxを走査する素朴解はM≤10^9で不可能だが、bit階層は高々30で済む。

## 典型の発動条件

### bit ごとの分割統治

発動条件: xor の最小化で、上位 bit の一致が下位 bit より常に優先されるとき。

A と問い合わせ区間を同じ最高 bit で分け、選ばれる側を確定して一段下へ進む。

### 暗黙 Trie 再帰

発動条件: 値集合を二進 Trie として扱えるが、必要なのが部分集合と深さだけのとき。

配列分割を再帰状態として持ち、Trie ノードを明示構築せず総和を集約する。

## 問題固有の要素

最小 xor の総和は各 x を独立処理せず、同じ上位 bit 接頭辞を持つ x の区間をまとめて処理できる。

別の問題へ持ち帰る視点: 辞書順に優先される bit 評価では、候補集合と問い合わせ集合を同時に二分する再帰が有効である。

## 正当性

最高bitが一致する候補は不一致候補より必ず小さいxor値を持つので、両側非空なら各半区間は一致側だけへ進む。片側のみなら不一致半区間の各xへhを加え、下位bitは同じ子集合へ帰着する。Wでは子の全域が二度現れ、Fでは完全半区間をWから、端数半区間をFから取るので、指定式が各xの最小xorを正確に合計する。基底k=0からの帰納法で両返値が正しく、一子を一回だけ呼ぶので全域再計算による重複処理もない。

## 実装上の注意

- WとFを同時に返し、片側が空のとき同じ集合を二度再帰しない。
- B_1はhを引いて下位bitへ正規化する。集合は非空の子だけ呼ぶ。
- h²、hm、答えは64bit。分割領域を再利用し、子の全返値を全節点で保持しない。

## 復習の核

- M≤2^(k-1)、M=2^k、途中で上下にまたがる三場合について、再帰する集合・長さ・固定寄与を式と照合する。

## 計算量と制約

### 時間

O(NB)。各bit階層の分割で入力値を合計N個処理し、各再帰は非空子ごとに一回だけ呼ぶ。Bはmax(A_i,M)を覆うbit数。

### 空間

O(N+B)、bit分割用領域と再帰stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; 1\le M\le 10^9; 0\le A_i \le 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/editorial/14087) — source-abc425-editorial-14087-8cdd7294ddd4a59ef9ef2a1b40db4ca62e3e9167e956f318df271eee16191e69
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/tasks/abc425_g) — source-abc425-g-problem-625ba8459cf4ed915d88b837470014e58cc381321869d6c0da01c744941db707
