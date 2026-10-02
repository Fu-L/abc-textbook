---
title: "ABC284-F — ABCBAC"
draft: true
authoringUnit: {"problemId":"abc284-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-prefix-match-state/outcome-build-prefix-match-state-shard-001/abc284-f.md","learningOutcomeIds":["outcome-build-prefix-match-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc284-editorial-5469-086567d5bc108a7291f4c1d4973ccd013271e712328f658717cbe60d191ad88b","source-abc284-f-problem-cc633bf52d2810b496bd59853d6a158c16ff4f1060d5538c668187b9b09732e0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"切れ目iを固定すると候補SはT[0,i)+T[N+i,2N)に一意に決まり、中央のT[i,N+i)がそのreverseであることが必要十分。A=T前半、B=reverse(T後半)を作ると条件は二つのprefix一致へ分かれる。A+BとB+AのZ値でそれぞれの必要長を判定できるため、全i=0..Nを調べれば解を漏らさない。長さ0の一致は真として配列末尾の参照を避ける。","sourceRevisionIds":["source-abc284-editorial-5469-086567d5bc108a7291f4c1d4973ccd013271e712328f658717cbe60d191ad88b","source-abc284-f-problem-cc633bf52d2810b496bd59853d6a158c16ff4f1060d5538c668187b9b09732e0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-prefix-match-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、T=abab。","procedure":["i=1なら削除する区間T[1,3)はba。","残るSはabで、そのreverseはba。","Sの先頭a、reverse(S)=ba、Sの末尾bを連結するとabab。"],"executionTarget":null,"expectedResult":"S=ab,i=1が有効。","verificationStatus":"not_applicable","learningUnitIds":["unit-z-algorithm"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-prefix-match-state"],"prerequisiteIds":[],"attainmentCondition":"i=0やi=Nを除外してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。reverse(S)をSの前または後ろへ挿入するケースも許される。該当する一致長0をtrueとして両端を探索に含める。"},"answer":{"reasoningOrVerification":"不可。reverse(S)をSの前または後ろへ挿入するケースも許される。該当する一致長0をtrueとして両端を探索に含める。","procedure":["具体例の各状態・寄与を再計算する。","不可。reverse(S)をSの前または後ろへ挿入するケースも許される。該当する一致長0をtrueとして両端を探索に含める。"],"expectedResult":"不可。reverse(S)をSの前または後ろへ挿入するケースも許される。該当する一致長0をtrueとして両端を探索に含める。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md)

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Tの前半をA=T[0,N)、後半をreverseした列をB=reverse(T[N,2N))とすると、切れ目iの条件はA[0,i)=B[N-i,N)かつA[i,N)=B[0,N-i)になる。

各iを直接比較すると合計が二次になるが、両条件は固定した2本の連結文字列上のprefix一致長として一括計算できる。

採用する候補: A+BとB+AのZ-arrayを求め、各切れ目iで必要な2つの一致長をO(1)判定する。

全iのprefix/suffix一致を線形時間で準備でき、条件を満たすSも元のTから直ちに復元できる。

棄却する候補: i=0..Nごとに候補Sを作り、生成した長さ2Nの文字列とTを比較する。

N+1候補それぞれに線形比較が必要でO(N^2)になる。

棄却する候補: rolling hashで2区間の一致を判定する。

高速化はできるが衝突管理が必要で、この完全一致判定には決定的なZ算法で十分である。

X=A+Bでは位置2N-iからのprefix一致がA[0,i)=B[N-i,N)を、Y=B+Aでは位置N+iからの一致がB[0,N-i)=A[i,N)を表す。

条件を満たすとき、SはT[0,i)+T[N+i,2N)であり、中央のreverse(S)を改めて構築して探索する必要はない。

A=Tの前半、B=後半のreverseを作り、X=A+BとY=B+AのZ-arrayを計算する。i=0..Nについて、i=0なら第1条件、i=Nなら第2条件を空文字として扱い、それ以外はZ_X[2N-i]≥iかつZ_Y[N+i]≥N-iを確認する。最初の成立iでS=T[0,i)+T[N+i,2N)とiを出力し、なければ-1を出す。

## 典型の発動条件

### Z algorithm

発動条件: 同じpatternとの一致長を多数の開始位置で知りたいとき。

2つの連結文字列のZ-arrayで全切れ目の区間一致をO(1)判定する。

### reverseによる向きの統一

発動条件: 条件にreverse文字列とのsuffix/prefix比較が混在するとき。

後半をreverseして、両条件を通常のprefix一致へ変換する。

## 問題固有の要素

生成式をSそのものではなくTの前半Aと後半を反転したBの対応へ書き換えると、未知文字列が消えて切れ目iだけの判定になる。

別の問題へ持ち帰る視点: 未知列を含む文字列構成問題では、観測済み区間同士の等式へ消去してから文字列algorithmを選ぶ。

## 正当性

切れ目iを固定すると候補SはT[0,i)+T[N+i,2N)に一意に決まり、中央のT[i,N+i)がそのreverseであることが必要十分。A=T前半、B=reverse(T後半)を作ると条件は二つのprefix一致へ分かれる。A+BとB+AのZ値でそれぞれの必要長を判定できるため、全i=0..Nを調べれば解を漏らさない。長さ0の一致は真として配列末尾の参照を避ける。

## 実装上の注意

- i=0,Nでは参照位置が配列末尾になる条件があるため、長さ0の比較を先にtrueとして扱う。
- Sの後半はT[N+i,2N)から取り、T[i,N)と取り違えない。

## 復習の核

- AとBをN=3程度で横に並べ、各iの2区間がX,YのどのZ値へ対応するかと、復元したSをreverseしてTが戻るかを確認する。

## 計算量と制約

### 時間

O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^6; N is an integer.; T is a string of length 2N consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、T=abab。

1. i=1なら削除する区間T[1,3)はba。
2. 残るSはabで、そのreverseはba。
3. Sの先頭a、reverse(S)=ba、Sの末尾bを連結するとabab。

期待される結果: S=ab,i=1が有効。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

i=0やi=Nを除外してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。reverse(S)をSの前または後ろへ挿入するケースも許される。該当する一致長0をtrueとして両端を探索に含める。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/editorial/5469) — source-abc284-editorial-5469-086567d5bc108a7291f4c1d4973ccd013271e712328f658717cbe60d191ad88b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/tasks/abc284_f) — source-abc284-f-problem-cc633bf52d2810b496bd59853d6a158c16ff4f1060d5538c668187b9b09732e0
