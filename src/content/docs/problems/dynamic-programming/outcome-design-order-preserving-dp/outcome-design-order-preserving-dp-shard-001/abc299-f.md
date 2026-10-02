---
title: "ABC299-F — Square Subsequence"
draft: true
authoringUnit: {"problemId":"abc299-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc299-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905","source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同じ値列Tを与える部分列の取り方は多数あるので、各次文字を最左next位置で取る正準表現を使う。後半の先頭q1=xを固定し、前後の位置pairから同じ文字を最左で延長する。前半の直後にTの先頭文字を最左で探した位置がxとなる終了条件が、二つの半分の境界を確定する。任意のTTはこの正準経路と境界を一意に持ち、任意の受理経路は前半より後に同じTを構成するため、全xのDPの和が異なるsquare文字列を一回ずつ数える。","sourceRevisionIds":["source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905","source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-order-preserving-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=aaaa。","procedure":["square部分列TTの値はaaとaaaa。","aaは多くの添字pairから取れるがT=aとして一回だけ数える。"],"executionTarget":null,"expectedResult":"異なるsquare文字列2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-sequence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-order-preserving-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"添字部分列として数えると何個か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"長さ2はC(4,2)=6、長さ4は1で7。問題の値列数2と違うので最左next表による正準表現が必要。"},"answer":{"reasoningOrVerification":"長さ2はC(4,2)=6、長さ4は1で7。問題の値列数2と違うので最左next表による正準表現が必要。","procedure":["具体例の各状態・寄与を再計算する。","長さ2はC(4,2)=6、長さ4は1で7。問題の値列数2と違うので最左next表による正準表現が必要。"],"expectedResult":"長さ2はC(4,2)=6、長さ4は1で7。問題の値列数2と違うので最左next表による正準表現が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ部分列文字列を重複なく数えるには、各文字を常に直前位置より右で最左の出現から取るcanonical embeddingを固定できる。

採用する候補: 後継位置σと前後半同時DP

TTの後半先頭q1を固定し、前半位置pと後半位置qを同じ次文字で最左遷移させれば、文字列Tを一度ずつ数えられる。

棄却する候補: 部分列の取り出し方を全列挙

同じTTを多数回数え、2^Nの候補も大きい。

q1=xを固定するとT_1=S_xと前半p1の最左位置が決まり、終了条件σ(p_last,T_1)=xが前半と後半の境界を保証する。

全位置i・文字cのnext σ(i,c)を前計算する。各xをq1としてdp[p][q]を初期化し、26文字で(dp[next(p,c)][next(q,c)])へ遷移し、σ(p,S_x)=xを満たす状態を答えに加える。

## 典型の発動条件

### distinct subsequenceのcanonical embedding

発動条件: 同一文字列の複数取り出し方を一度だけ数える。

各文字を常に最左の可能位置から選ぶ。

### 二列同期遷移DP

発動条件: 同じ未知文字列を二つのsubsequenceとして並行に埋め込む。

前半・後半位置対を状態にし同じ文字で進める。

## 問題固有の要素

square TTの二コピーを同時に追い、後半の最初位置で分類すると重複除去条件を局所化できる。

別の問題へ持ち帰る視点: 繰返しsubsequenceは複数embeddingを最左規則で正規化する。

## 正当性

同じ値列Tを与える部分列の取り方は多数あるので、各次文字を最左next位置で取る正準表現を使う。後半の先頭q1=xを固定し、前後の位置pairから同じ文字を最左で延長する。前半の直後にTの先頭文字を最左で探した位置がxとなる終了条件が、二つの半分の境界を確定する。任意のTTはこの正準経路と境界を一意に持ち、任意の受理経路は前半より後に同じTを構成するため、全xのDPの和が異なるsquare文字列を一回ずつ数える。

## 実装上の注意

- nextが∞の遷移を除き、長さ0のTを数えず、終了条件を各状態で重複加算しない。

## 復習の核

- N≤12の全subsequence文字列setと比較し、同文字反復、重なるembedding、長さ奇数でsquare不能な例を確認する。

## 計算量と制約

### 時間

O(26N³)、後半先頭xごとに位置pair DP。

### 空間

O(N²+26N)、一xのDPとnext表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string consisting of lowercase English letters whose length is between 1 and 100, inclusive.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=aaaa。

1. square部分列TTの値はaaとaaaa。
2. aaは多くの添字pairから取れるがT=aとして一回だけ数える。

期待される結果: 異なるsquare文字列2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

添字部分列として数えると何個か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

長さ2はC(4,2)=6、長さ4は1で7。問題の値列数2と違うので最左next表による正準表現が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6251) — source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_f) — source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a
