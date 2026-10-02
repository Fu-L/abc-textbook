---
title: "ABC324-E — Joint Two Strings"
draft: true
authoringUnit: {"problemId":"abc324-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc324-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc324-e-problem-122462833dadb1a89dbaa3b7de191d7423f1c4b68966e12b5abbd2ed0bcb20e8","source-abc324-editorial-7407-ac1b02cade60fe34b326d626abed852b9d908175f319770f619c493b275c28ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"subsequenceとして取れるprefix最大長はS_iを左からT pointerと照合するgreedy、suffix最大長は両文字列を右から照合するgreedyで得られる。 A_i最大長まで前半で取れるなら、それより短いprefixも取れるため、残りsuffixの長さだけが後半への必要条件になる。 全N^2 pairを調べず、文字列scan総長と|T|の前計算だけで各iの相手数を得られる。","sourceRevisionIds":["source-abc324-e-problem-122462833dadb1a89dbaa3b7de191d7423f1c4b68966e12b5abbd2ed0bcb20e8","source-abc324-editorial-7407-ac1b02cade60fe34b326d626abed852b9d908175f319770f619c493b275c28ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"T=ab、S1=a,S2=b。","procedure":["A=(1,0),B=(0,1)。","有効連結はS1+S2=abだけ。"],"executionTarget":null,"expectedResult":"順序付きpair数1。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":[],"attainmentCondition":"同じi=jも候補へ入れるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"問題の順序付きpairでは許される。S_i単独二回の連結も同じA_i+B_i条件で検査する。"},"answer":{"reasoningOrVerification":"問題の順序付きpairでは許される。S_i単独二回の連結も同じA_i+B_i条件で検査する。","procedure":["具体例の各状態・寄与を再計算する。","問題の順序付きpairでは許される。S_i単独二回の連結も同じA_i+B_i条件で検査する。"],"expectedResult":"問題の順序付きpairでは許される。S_i単独二回の連結も同じA_i+B_i条件で検査する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

各S_iについて、Tのprefixをsubsequenceとして何文字取れるかA_iと、Tのsuffixを何文字取れるかB_iを独立にgreedy scanで求められる。

concatenation S_i+S_jがTを含むことは、Tの先頭A_i文字を前半で、残りを後半で取れるA_i+B_j≥|T|と同値である。

従ってiを固定した良いjの数は、B_j≥|T|-A_iを満たす文字列数という1次元threshold queryになる。

採用する候補: 各文字列のprefix-match長Aとsuffix-match長Bを求め、Bの頻度suffix sumで全ordered pairを数える。

全N^2 pairを調べず、文字列scan総長と|T|の前計算だけで各iの相手数を得られる。

棄却する候補: 全ordered pair(i,j)についてS_i+S_jを作り、Tのsubsequence判定を行う。

N≤5×10^5でpair数N^2が大きく、連結文字列生成も不要である。

棄却する候補: S_i単体がTを含むかだけを数える。

Tのprefixとsuffixを2本の文字列へ分担して初めて成立するpairを落とす。

subsequenceとして取れるprefix最大長はS_iを左からT pointerと照合するgreedy、suffix最大長は両文字列を右から照合するgreedyで得られる。

A_i最大長まで前半で取れるなら、それより短いprefixも取れるため、残りsuffixの長さだけが後半への必要条件になる。

各S_iを左からscanしてA_i、右からscanしてB_iを求める。count[b]へB_iの頻度を入れ、ge[l]=Σ_{b≥l}count[b]をsuffix sumする。各iについてl=|T|-A_iを計算してge[l]をanswerへ加え、64bit整数で出力する。

## 典型の発動条件

### subsequenceのgreedy match長

発動条件: 固定patternのprefix/suffixを多数文字列がどこまで含むか求めるとき。

pattern pointerを一方向scanで進める。

### pair条件のthreshold集計

発動条件: ordered pair条件がA_i+B_j≥Lの形になるとき。

B頻度のsuffix sumで各A_iの相手数を得る。

## 問題固有の要素

連結境界を跨ぐsubsequenceは、Tのどこで前半から後半へ担当を切り替えるかだけで、各側の最大match長の和へ圧縮できる。

別の問題へ持ち帰る視点: concatenation上のsubsequence条件では、patternのprefix/suffixを各部分へ割り当てる境界parameterを探す。

## 正当性

subsequenceとして取れるprefix最大長はS_iを左からT pointerと照合するgreedy、suffix最大長は両文字列を右から照合するgreedyで得られる。 A_i最大長まで前半で取れるなら、それより短いprefixも取れるため、残りsuffixの長さだけが後半への必要条件になる。 全N^2 pairを調べず、文字列scan総長と|T|の前計算だけで各iの相手数を得られる。

## 実装上の注意

- B_iはT suffixの長さとして0..|T|で数え、右scanのpointer方向と長さ換算を混同しない。
- 答えは最大N^2で32bitを超えるため64bit整数を使う。

## 復習の核

- Tを前半と後半へ複数の位置で分けられる例を作り、最大A_iと最大B_jの和だけで存在判定できることを確認する。

## 計算量と制約

### 時間

O(L+N+len(T))、L全S文字数、greedy prefix/suffixと頻度suffix和。

### 空間

O(N+len(T)+L)入力込み。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \leq N \leq 5 \times 10^5; S_i and T are strings of length 1 to 5 \times 10^5, inclusive, consisting of lowercase English letters.; The total length of S_1, S_2, \ldots, S_N is at most 5 \times 10^5.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

T=ab、S1=a,S2=b。

1. A=(1,0),B=(0,1)。
2. 有効連結はS1+S2=abだけ。

期待される結果: 順序付きpair数1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じi=jも候補へ入れるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

問題の順序付きpairでは許される。S_i単独二回の連結も同じA_i+B_i条件で検査する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/tasks/abc324_e) — source-abc324-e-problem-122462833dadb1a89dbaa3b7de191d7423f1c4b68966e12b5abbd2ed0bcb20e8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/editorial/7407) — source-abc324-editorial-7407-ac1b02cade60fe34b326d626abed852b9d908175f319770f619c493b275c28ba
