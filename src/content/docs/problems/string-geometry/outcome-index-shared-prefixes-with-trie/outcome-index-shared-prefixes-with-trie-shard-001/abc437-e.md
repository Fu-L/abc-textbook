---
title: "ABC437-E — Sort Arrays"
draft: true
authoringUnit: {"problemId":"abc437-e","docPath":"src/content/docs/problems/string-geometry/outcome-index-shared-prefixes-with-trie/outcome-index-shared-prefixes-with-trie-shard-001/abc437-e.md","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。"],"tagIds":["tag-trie-prefix"],"sourceRevisionIds":["source-abc437-e-problem-4cba7e5ca3c04372a2c7647c04627c95c7aceaacc84a6d8c0b462fb52ad53db4","source-abc437-editorial-14880-76723f083e28ba8b598f49540087d2b1e45e518ac5b7972abb09408ca9ce43e5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_i=A_{x_i}+[y_i]なのでnode[x_i]のラベルy_iの子がA_iの終端である。同じ親prefixと同じyは同nodeに統合され、各入力は高々一node増やす。辞書順ではprefix自身が延長より先、異なる次要素はラベル昇順なので、終端index先・子昇順DFSが全配列の辞書順になる。同列indexは昇順で出す。","sourceRevisionIds":["source-abc437-e-problem-4cba7e5ca3c04372a2c7647c04627c95c7aceaacc84a6d8c0b462fb52ad53db4","source-abc437-editorial-14880-76723f083e28ba8b598f49540087d2b1e45e518ac5b7972abb09408ca9ce43e5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

- 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

この解説で扱わないこと:

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 考察

入力はA_i=A_{x_i}+[y_i]という一要素追加である。全列を実体化するとchain入力で総長Θ(N²)になる。各配列のtrie終端node[i]を保持すれば、node[x_i]のラベルy_iの子を探す一操作で追加できる。同じ子があれば共有、なければ新nodeを作り、終端へiを登録する。辞書順はnodeの終端を先、子ラベル昇順のDFS順なので、全配列を展開せずO(N log N)時間・O(N)空間で全indexを並べられる。

## 典型の発動条件

persistent appendで構成される列は親のtrie nodeから一edgeだけ追加しprefixを共有する。trieの終端先・子ラベル昇順DFSが可変長列の辞書順に一致する。

## 問題固有の要素

x_i<iで親が確定済みだからnode[x_i]を直接使える。同一列の複数indexは同じ終端にまとめ入力順へ出す。

## 正当性

A_i=A_{x_i}+[y_i]なのでnode[x_i]のラベルy_iの子がA_iの終端である。同じ親prefixと同じyは同nodeに統合され、各入力は高々一node増やす。辞書順ではprefix自身が延長より先、異なる次要素はラベル昇順なので、終端index先・子昇順DFSが全配列の辞書順になる。同列indexは昇順で出す。

## 実装上の注意

node[0]=root。node[i]=getOrCreateChild(node[x_i],y_i)として登録し、各A_iの全要素を辿り直さない。再帰depth Nに備え明示stackを使い、子昇順の訪問を維持する。

## 復習の核

chain x_i=i−1で展開長が二次になることを確認し、親node直接参照のO(1)prefix共有を定着させる。等列はindex昇順、短prefixは延長前。

## 計算量と制約

### 時間

O(N log N)。各persistent appendを親trie nodeから一edgeで登録し、子をラベル順に走査する。

### 空間

O(N)。全配列を展開せずtrie nodeを共有する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 3\times 10^5; 0\leq x_i\lt i; 1\leq y_i\leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/tasks/abc437_e) — source-abc437-e-problem-4cba7e5ca3c04372a2c7647c04627c95c7aceaacc84a6d8c0b462fb52ad53db4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/editorial/14880) — source-abc437-editorial-14880-76723f083e28ba8b598f49540087d2b1e45e518ac5b7972abb09408ca9ce43e5
