---
title: "ABC295-F — substr = S"
draft: true
authoringUnit: {"problemId":"abc295-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc295-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73","source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Sの右にr桁置くと固定block値S·10^rを持ち、上位自由部を列挙順へ対応させられるが、S先頭0では先頭ゼロ回避のoffsetが必要。 [L,R]をF(R)-F(L-1)へし、各桁位置の固定blockを持つ整数を上位・下位自由桁から数えられる。","sourceRevisionIds":["source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73","source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=12、L=1,R=130。","procedure":["一致整数は12,112,120..129。","各々の12出現回数は一回。"],"executionTarget":null,"expectedResult":"合計12回。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":[],"attainmentCondition":"S=0をleading zero付きの数に固定して数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"整数の標準表記に先頭0はない。右のr桁自由部とは別に上位自由部の先頭0を避けるoffsetが必要。"},"answer":{"reasoningOrVerification":"整数の標準表記に先頭0はない。右のr桁自由部とは別に上位自由部の先頭0を避けるoffsetが必要。","procedure":["具体例の各状態・寄与を再計算する。","整数の標準表記に先頭0はない。右のr桁自由部とは別に上位自由部の先頭0を避けるoffsetが必要。"],"expectedResult":"整数の標準表記に先頭0はない。右のr桁自由部とは別に上位自由部の先頭0を避けるoffsetが必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

全整数での出現回数和は、出現開始桁kを固定し、その位置にSを持つX以下の整数個数を足す主客転倒で数えられる。

採用する候補: prefix関数F(X)と開始桁ごとの個数計数

[L,R]をF(R)-F(L-1)へし、各桁位置の固定blockを持つ整数を上位・下位自由桁から数えられる。

棄却する候補: 各整数を文字列化してsubstring検索

区間幅は10^16で走査不能。

Sの右にr桁置くと固定block値S·10^rを持ち、上位自由部を列挙順へ対応させられるが、S先頭0では先頭ゼロ回避のoffsetが必要。

F(X)について全開始位置rを列挙し、その位置にSを固定した正整数の単調なi番目構成を二分探索してX以下の個数を足し、F(R)-F(L-1)を返す。

## 典型の発動条件

### prefix差分

発動条件: 整数区間上の加法的総和を求める。

[1,R]と[1,L-1]の差へ変える。

### 出現位置を固定する主客転倒

発動条件: 全対象に含まれるpatternの総出現回数を数える。

patternの開始桁を先に固定し、その位置にpatternを持つ整数を生成順に数える。

## 問題固有の要素

文字列出現を整数側で探さず、出現位置を固定して該当整数を数えると重複出現も自然に別寄与になる。

別の問題へ持ち帰る視点: substring総数は位置を主客転倒してdigit countingする。

## 正当性

Sの右にr桁置くと固定block値S·10^rを持ち、上位自由部を列挙順へ対応させられるが、S先頭0では先頭ゼロ回避のoffsetが必要。 [L,R]をF(R)-F(L-1)へし、各桁位置の固定blockを持つ整数を上位・下位自由桁から数えられる。

## 実装上の注意

- 先頭0のSは数の先頭に置けず上位部を1以上にする。10^16境界とオーバーフローを確認する。

## 復習の核

- 短区間の直接検索と比較し、Sが0開始、重なり出現、L=1、16桁上限を確認する。

## 計算量と制約

### 時間

O(D² log X)、Dは境界Xの桁数。各開始位置の単調構成二分探索と文字長を含む。

### 空間

O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 1000; S is a string consisting of digits whose length is between 1 and 16, inclusive.; L and R are integers satisfying 1 \le L \le R < 10^{16}.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=12、L=1,R=130。

1. 一致整数は12,112,120..129。
2. 各々の12出現回数は一回。

期待される結果: 合計12回。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=0をleading zero付きの数に固定して数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

整数の標準表記に先頭0はない。右のr桁自由部とは別に上位自由部の先頭0を避けるoffsetが必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6035) — source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_f) — source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540
