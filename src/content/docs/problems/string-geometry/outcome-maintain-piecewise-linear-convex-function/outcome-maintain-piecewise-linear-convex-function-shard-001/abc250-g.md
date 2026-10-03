---
title: "ABC250-G — Stonks"
draft: true
authoringUnit: {"problemId":"abc250-g","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc250-g.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-priority-queue-best-first"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b","source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"所持数DPは一日の待機・購入・売却の三遷移を全て比較する。初期D_0(0)=0から、D_i(k)=v−昇順価格多重集合の先頭k項和という表現を帰納的に保つ。価格pが最小a_1以下ならv不変でpを一個追加、それより大きければvへp−a_1を加えa_1をp二個へ置換すると、全kで三遷移のmaxに一致する。差分−a_kは非増加なので凹性もこの更新から証明され、初めから仮定しない。最小値だけをheapで取得すれば多重集合を維持でき、最終v=D_N(0)が最適利益。p二個はDPの傾きを表し、同日に二度実際に売買するという意味ではない。","sourceRevisionIds":["source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b","source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

まず正しい二次DPを作る。D_i(k)をi日後にちょうどk株を持つ最大の現金増分とし、D_0(0)=0、他は−∞。一日に高々一株を買う・売る・何もしないので、価格pの日は D_i(k)=max(D_{i−1}(k),D_{i−1}(k−1)−p,D_{i−1}(k+1)+p)。k<0は不可能。最終的な答えはD_N(0)である。

採用する候補: 傾きを最小ヒープで管理するslope trick

各価格を傾きの変化点として挿入し、現在の最小買値より高く売れるときだけ差益を確定すれば、凹DP全体を線形個の要素で表せる。

棄却する候補: 日数と所持株数を列挙するDP

所持可能数が日数に比例するため二次状態となり、N=2×10^5では間に合わない。

このDPの差分を持つ。i日後の値列は、利益v=D_i(0)と、昇順の価格多重集合a_1≤…≤a_iを用いて D_i(k)=v−Σ_{t=1}^k a_t（0≤k≤i）と表せる。差分は−a_kで非増加だから凹。初期はv=0、集合は空である。

三遷移へこの式を代入すると、p≤a_1ならvを変えず集合へpを一個追加する。p>a_1ならvへp−a_1を加え、a_1を一個削除しpを二個追加する。この恒等式は、pより小さい既存aの個数でkを分けて確認できる。前者ではsellはwait以下、buyとwaitのmaxがpを挿入したprefix和になる。後者ではsellが一番安いa_1を差益へ変え、そのa_1を除いた列へpを二回挿入したprefix和が三候補のmaxになる。従って新列も同じ表現を保ち、全日について凹性とheap更新が同時に帰納される。

利益が出ない日もPを1個挿入することで、将来の売却候補となる新しい傾きを残す。

利益を0、最小ヒープを最初の価格一個で初期化する。二日目以降は挿入前の最小値mとP_iを比較し、m<P_iならmを一つ取り出して利益へP_i-mを加え、P_iを二個挿入する。そうでなければP_iを一個挿入する。heapは取引候補の限界費用を表し、過去の売りを後から取り消してより高い価格へ付け替えられる。価格[1,2,100]では利益は1+98=99となる。全体O(N log N)。

## 典型の発動条件

### slope trick

発動条件: 整数状態上の凹・凸なDPが区分線形関数として表せる。

所持株数方向の傾き変化点を価格の多重集合で保持し、日ごとの遷移を挿入・置換にする。

### 優先度付きキューによる売買対応

発動条件: 過去の候補のうち最も安いものを現在価格と対応させたい。

最小買値を取り出して正の差益だけを確定し、売値を将来の境界として戻す。

## 問題固有の要素

ヒープの要素は実際の一対一売買履歴ではなく、所持数DPの傾きであり、売却時に同価格を二重挿入することが状態遷移を保存する。

別の問題へ持ち帰る視点: 大きな離散状態を持つ最適化でも、値関数の凸凹性があれば傾きの変化点だけを管理できる。

## 正当性

所持数DPは一日の待機・購入・売却の三遷移を全て比較する。初期D_0(0)=0から、D_i(k)=v−昇順価格多重集合の先頭k項和という表現を帰納的に保つ。価格pが最小a_1以下ならv不変でpを一個追加、それより大きければvへp−a_1を加えa_1をp二個へ置換すると、全kで三遷移のmaxに一致する。差分−a_kは非増加なので凹性もこの更新から証明され、初めから仮定しない。最小値だけをheapで取得すれば多重集合を維持でき、最終v=D_N(0)が最適利益。p二個はDPの傾きを表し、同日に二度実際に売買するという意味ではない。

## 実装上の注意

- 利益は64ビット整数で持ち、同価格を多重集合として重複保持する。m<P_iのときだけ差益を加え、P_iの挿入個数を間違えない。

## 復習の核

- Nが小さい所持株数DPと比較し、単調増加・単調減少・同価格の連続・同日にヒープへ二重挿入する更新を検証する。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 2 \times 10^5; 1 \le P_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/editorial/3929) — source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/tasks/abc250_g) — source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907
