---
title: "ABC403-E — Forbidden Prefix"
draft: true
authoringUnit: {"problemId":"abc403-e","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc403-e.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-trie-prefix"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-trie-prefix"],"sourceRevisionIds":["source-abc403-e-problem-a22e29b8f029d78c328c2ea1a831511d5157aeb33df34d4bd540d650d5adcb23","source-abc403-editorial-12825-096a73f0a3867c69a66e98f4a178f82325d99092fd960d007ecfb43ffdc9a8be"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"Y を追加した時点で経路上に X 終端フラグが一つでもあれば直ちに除外し、それでも各 Z_v には登録してよい。後の取り出しでは除外済みかを確認すれば二重減算を防げる。 各 Y の添字は長さ個の Z_v にだけ入り、各集合から高々一度しか取り出されないため、大きな集合を丸ごと処理しても全体では償却線形である。 Y の追加時に全接頭辞の Z_v へその添字を登録し、X の追加時には終端頂点の Z_v を消費する。総登録数と総取り出し数を入力長総和で抑えられる。","sourceRevisionIds":["source-abc403-e-problem-a22e29b8f029d78c328c2ea1a831511d5157aeb33df34d4bd540d650d5adcb23","source-abc403-editorial-12825-096a73f0a3867c69a66e98f4a178f82325d99092fd960d007ecfb43ffdc9a8be"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

答えから除かれるのは、X のいずれかを接頭辞にもつ Y の要素だけである。X への追加で除外された Y は、その後も永久に除外されたままでよい。

全入力文字列の長さの総和は 5×10^5 なので、各文字列について根から終端までの頂点を一度ずつ処理し、候補の取り出しも償却できれば十分である。

採用する候補: X と Y を同じ Trie に挿入し、各頂点 v に「次に v で X が終端したとき除外される未除外 Y」の集合 Z_v と X 終端フラグを持たせる

総登録数と総取り出し数を入力長総和で抑えられる。

棄却する候補: 新しい Y ごとに全 X、新しい X ごとに全 Y を比較する

共通接頭辞を共有せず、同じ長い文字列をクエリ数に比例して再比較すると最悪二次時間になる。

Trie の根から文字列終端までを走査する。T=2 では経路上の X 終端を調べつつ各 Z_v に登録し、未除外なら有効数を増やす。T=1 では終端フラグを立て、Z_v の各 Y を未除外なら無効化して集合を空にし、現在の有効数を出力する。

## 典型の発動条件

### Trie

発動条件: 文字列の追加と「既存文字列が接頭辞か／この文字列を接頭辞にもつか」の両方向をオンラインに扱うとき。

全文字列の共通接頭辞を経路として共有し、X 終端フラグと接頭辞別の待機集合を頂点に置く。

### 償却解析

発動条件: 一回の操作では大きい集合を走査するが、各要素が取り出される総回数を制限できるとき。

Y の添字は各接頭辞の集合から一度だけ取り出されるとして、全処理量を総文字列長で評価する。

## 問題固有の要素

「既存 X が Y の接頭辞」と「新規 X が既存 Y の接頭辞」を、経路上のフラグと終端頂点の待機集合という別の向きの情報で同時に処理する。

別の問題へ持ち帰る視点: 接頭辞関係のオンライン更新では、祖先照会と子孫への影響を分離し、後者を挿入時の予約リストに変換できないか考える。

## 正当性

Y を追加した時点で経路上に X 終端フラグが一つでもあれば直ちに除外し、それでも各 Z_v には登録してよい。後の取り出しでは除外済みかを確認すれば二重減算を防げる。 各 Y の添字は長さ個の Z_v にだけ入り、各集合から高々一度しか取り出されないため、大きな集合を丸ごと処理しても全体では償却線形である。 Y の追加時に全接頭辞の Z_v へその添字を登録し、X の追加時には終端頂点の Z_v を消費する。総登録数と総取り出し数を入力長総和で抑えられる。

## 実装上の注意

- Y の重複を集合値だけで潰さずクエリ添字ごとに管理し、除外済みフラグで同じ Y を複数の Z_v から二重に数えない。空文字列に相当する根は対象外である。

## 復習の核

- 同じ文字列の X/Y 重複、短い X の後の長い Y、長い Y の後の短い X、互いに無関係な枝を含む列を愚直判定と比較する。

## 計算量と制約

### 時間

文字総長Lに対し償却O(L)、Trie固定alphabetと登録添字の全消去。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: Q is an integer between 1 and 2 \times 10^5, inclusive.; T_i \in \{1,2\}; Each S_i is a string of length between 1 and 5\times 10^5, inclusive, consisting of lowercase English letters.; \displaystyle \sum_{i=1}^Q |S_i| \leq 5 \times 10^5

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/tasks/abc403_e) — source-abc403-e-problem-a22e29b8f029d78c328c2ea1a831511d5157aeb33df34d4bd540d650d5adcb23
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/editorial/12825) — source-abc403-editorial-12825-096a73f0a3867c69a66e98f4a178f82325d99092fd960d007ecfb43ffdc9a8be
