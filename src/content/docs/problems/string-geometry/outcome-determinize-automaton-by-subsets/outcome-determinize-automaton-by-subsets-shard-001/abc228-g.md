---
title: "ABC228-G — Digits on Grid"
draft: true
authoringUnit: {"problemId":"abc228-g","docPath":"src/content/docs/problems/string-geometry/outcome-determinize-automaton-by-subsets/outcome-determinize-automaton-by-subsets-shard-001/abc228-g.md","learningOutcomeIds":["outcome-determinize-automaton-by-subsets","outcome-run-dp-on-finite-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-finite-pattern-automaton"],"excludedTopics":["非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-automaton-dp","tag-automaton-subset-construction","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc228-editorial-2942-95765aba1977229808ad2c05816696527f7c547f42f56a6a101d6ed536bb8fdf","source-abc228-g-problem-0bda9bd2f12555defe74109966b56bc2d699f0f77de68f55f7136575c16a7719"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ある数字prefixを生成できる現在の行または列を全て集合Sへ入れる。次の数字dで進める反対側頂点の集合は、Sの各頂点からdの辺をたどった和集合として一意に定まる。したがって同じprefixはただ一つの集合状態を持ち、経路が複数あっても重複計数しない。異なるprefixが同じ集合へ合流するときは、それらの個数を加算する。将来の遷移は集合だけで決まるので情報を失わない。長さ0の全行集合から2N回遷移し、空集合以外を合計すれば異なる数字列の個数になる。","sourceRevisionIds":["source-abc228-editorial-2942-95765aba1977229808ad2c05816696527f7c547f42f56a6a101d6ed536bb8fdf","source-abc228-g-problem-0bda9bd2f12555defe74109966b56bc2d699f0f77de68f55f7136575c16a7719"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-determinize-automaton-by-subsets","outcome-run-dp-on-finite-automaton"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"H=W=2,N=1、盤面は上段12、下段21。","procedure":["初期の行集合は{1,2}。数字1でも2でも列集合{1,2}へ移るので、この集合のDP値は2。","次の数字1と2はそれぞれ行集合{1,2}へ移り、各遷移が2prefix分を加える。"],"executionTarget":null,"expectedResult":"数字列11,12,21,22の4通り。","verificationStatus":"not_applicable","learningUnitIds":["unit-automaton-subset-construction"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-determinize-automaton-by-subsets","outcome-run-dp-on-finite-automaton"],"prerequisiteIds":["unit-dp-subset-state","unit-finite-pattern-automaton"],"attainmentCondition":"経路を数えるDPを使うと、この盤面の数字列11を何重に数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"11は上段左の1を二度使う経路と下段右の1を二度使う経路の二つがあるが、数字列としては一つ。到達頂点の集合へまとめることでこの重複を消す。"},"answer":{"reasoningOrVerification":"11は上段左の1を二度使う経路と下段右の1を二度使う経路の二つがあるが、数字列としては一つ。到達頂点の集合へまとめることでこの重複を消す。","procedure":["具体例の各状態・寄与を再計算する。","11は上段左の1を二度使う経路と下段右の1を二度使う経路の二つがあるが、数字列としては一つ。到達頂点の集合へまとめることでこの重複を消す。"],"expectedResult":"11は上段左の1を二度使う経路と下段右の1を二度使う経路の二つがあるが、数字列としては一つ。到達頂点の集合へまとめることでこの重複を消す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [非決定性automatonのsubset construction](src/content/docs/learn/string/automaton-subset-construction.md)

- 同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

対象外:

- 非決定性automatonのsubset constructionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各行を左側頂点、各列を右側頂点、マス(i,j)の数字を辺(i,j)のラベルとみなすと、操作で得る長さ2Nの列は、行側から始めて二部グラフを交互に移る歩道の辺ラベル列になる。

同じ数字列でも複数の行・列に到達できるため、現在頂点だけを状態にして経路数を足すと数字列を重複して数える。一方H,W≤10なので、あるprefixを読んだ後に到達可能な頂点全体をbit集合で持てる。

棄却する候補: 長さごと・現在の行または列ごとに経路数をDPし、最後に合計する。

問題が数えるのは経路ではなく異なる数字列なので、同じ列が複数の現在頂点へ到達すると重複する。

採用する候補: 数字列prefixごとの到達可能頂点集合を決定性オートマトンの状態とみなし、集合別に異なるprefix数をDPする。

同じ集合に至ったprefixは、次の各数字で移る集合が完全に一致するため合流でき、集合状態数は小さい側ごとに2^Hまたは2^Wへ収まる。

集合Sと次の数字dから、dと書かれた辺でSのいずれかに隣接する反対側頂点全体が次集合として一意に決まる。この決定的遷移により、経路の曖昧さを集合へ吸収できる。

異なる数字prefixが同じ集合へ到達しても、その個数はDP値として加算する。逆に同じprefixは到達可能頂点を全てまとめたただ一つの集合を持つため、二重に数えられない。

行を全て含む集合を長さ0の初期状態とする。各長さで非空集合Sと数字d=1..9を列挙し、ラベルdの辺で到達する反対側集合next(S,d)へdp値を加える。行集合と列集合を交互に使い、2N文字後の全ての非空集合の値を合計する。

## 典型の発動条件

### グリッドの二部グラフ化

発動条件: 行と列を交互に選び、交点の情報を出力する操作が続くとき。

行・列を頂点、マスの数字を辺ラベルにして、操作列をラベル付き歩道として捉える。

### 非決定的遷移の部分集合構成

発動条件: 同じ入力列が複数状態へ到達し得るが、状態数が小さく、異なる入力列を重複なく数えたいとき。

数字prefixの到達可能な行または列をbit集合にまとめ、数字ごとの決定的な集合遷移を作る。

### 集合状態DP

発動条件: 将来の遷移が現在の要素集合だけで決まり、集合の母数が10程度に収まるとき。

長さと到達可能頂点集合ごとに異なる数字prefixの個数を保持する。

## 問題固有の要素

現在頂点を一つ選んで状態にするのではなく、同じ数字列が実現できる全頂点を同時に保持することで、『経路数』ではなく『ラベル列数』を数えるDPになる。

別の問題へ持ち帰る視点: 経路のラベル列を数える問題で重複が生じたら、各ラベルprefixに対する到達状態集合を一つの正規形として使えないか検討する。

## 正当性

ある数字prefixを生成できる現在の行または列を全て集合Sへ入れる。次の数字dで進める反対側頂点の集合は、Sの各頂点からdの辺をたどった和集合として一意に定まる。したがって同じprefixはただ一つの集合状態を持ち、経路が複数あっても重複計数しない。異なるprefixが同じ集合へ合流するときは、それらの個数を加算する。将来の遷移は集合だけで決まるので情報を失わない。長さ0の全行集合から2N回遷移し、空集合以外を合計すれば異なる数字列の個数になる。

## 実装上の注意

- 奇数長では列集合、偶数長では行集合という向きをそろえ、next(S,d)が空集合なら実現不能なので遷移させない。
- DP加算は問題指定の法998244353で行い、各段の配列を初期化して同じ長さの値を再利用しない。

## 復習の核

- 単一頂点DPが数える経路と、問題が求める数字列の違いを小さな重複例で示す。その後、各prefixが到達集合を一意に持つことを数え上げの正当性として確認する。

## 計算量と制約

### 時間

行・列集合の遷移をlowbitで前計算すると O(HW+9(2^H+2^W)+9N(2^H+2^W))。文字列長は2N。

### 空間

遷移表と二段分DP、および盤面で O(9(2^H+2^W)+HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 10; 1 \leq N \leq 300; 1 \leq c_{i, j} \leq 9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

H=W=2,N=1、盤面は上段12、下段21。

1. 初期の行集合は{1,2}。数字1でも2でも列集合{1,2}へ移るので、この集合のDP値は2。
2. 次の数字1と2はそれぞれ行集合{1,2}へ移り、各遷移が2prefix分を加える。

期待される結果: 数字列11,12,21,22の4通り。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

経路を数えるDPを使うと、この盤面の数字列11を何重に数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

11は上段左の1を二度使う経路と下段右の1を二度使う経路の二つがあるが、数字列としては一つ。到達頂点の集合へまとめることでこの重複を消す。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/editorial/2942) — source-abc228-editorial-2942-95765aba1977229808ad2c05816696527f7c547f42f56a6a101d6ed536bb8fdf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/tasks/abc228_g) — source-abc228-g-problem-0bda9bd2f12555defe74109966b56bc2d699f0f77de68f55f7136575c16a7719
