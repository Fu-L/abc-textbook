---
title: "ABC295-F — substr = S"
draft: true
authoringUnit: {"problemId":"abc295-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc295-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73","source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"rを固定した出現は、上位部分h≥h_0、固定block S、下位r桁l∈[0,10^r)へ一意に分解できる。h_0=1はSが0で始まるときだけであり、整数の先頭0を排除する。i=(h−h_0)10^r+lが構成q_rの逆写像になるので、q_rは該当整数を全て一度生成する。その値はiに狭義増加し、二分探索がX以下の個数を返す。全rを足すと同一整数の別の出現も一つずつ数え、F(R)−F(L−1)で区間内の総出現数になる。","sourceRevisionIds":["source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73","source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

F(X)を1≤x≤XでのS出現回数の総和とする。答えはF(R)−F(L−1)。同じ整数に重なってSが現れる場合も、出現位置を別の寄与として数える。Sの右にある桁数rを固定すれば、一つの位置について該当整数を順序付けて数えられる。

m=|S|、sをSの整数値、t=10^r、B=10^mとする。下位r桁は0,…,t−1（不足桁は0で埋める）、Sの左の整数部分hは、Sが0で始まらなければ0以上、0で始まれば1以上にする。後者はSを数の先頭に置かないための条件で、h=0のまま0295を295へ縮めてはいけない。h_0=[Sの先頭が0]とすると、0-basedでi番目の該当整数は

```text
q_r(i) = (floor(i/t)+h_0)·B·t + s·t + (i mod t),  i≥0
```

である。同じ上位hの中では下位桁が増え、次のhではB·tずつ上位blockが増えるのでq_rは狭義増加。この構成はその桁位置にSを持つ整数を全て一度ずつ生成する。

X≤0ならF(X)=0。X>0の十進桁数をDとし、r=0,…,D−mだけを見る（m>Dなら寄与0）。各rでq_r(i)≤Xとなるiの個数を二分探索する。lo=−1を未存在、hi=X+1を不成立の番兵とし、midの成立ならlo←mid、そうでなければhi←mid。hi−lo=1で止め、lo+1をFへ加える。q_r(i)≥iなのでhiは確実に不成立となる。

S=22、X=222ではr=0で22,122,222の3個、r=1で220,221,222の3個が寄与し、222の二出現は両方数える。S=0295、X=295ではh_0=1なので最小生成数は10295、寄与0。位置を固定する全単射と単調性を実際の整数生成式へ接続すれば、巨大区間でもO(D log X)で数えられる。

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

rを固定した出現は、上位部分h≥h_0、固定block S、下位r桁l∈[0,10^r)へ一意に分解できる。h_0=1はSが0で始まるときだけであり、整数の先頭0を排除する。i=(h−h_0)10^r+lが構成q_rの逆写像になるので、q_rは該当整数を全て一度生成する。その値はiに狭義増加し、二分探索がX以下の個数を返す。全rを足すと同一整数の別の出現も一つずつ数え、F(R)−F(L−1)で区間内の総出現数になる。

## 実装上の注意

- Sは先頭0を保持した文字列として持ち、m=|S|と整数値sを別に扱う。X≤0は0、m>Dなら候補位置なし。
- 二分探索の番兵iはX+1まで使うため、生成数は入力上限を大きく越える。q_rの中間積は最大10^32規模なので128bit整数を使うか、Xを超える前に除算比較で打ち切る。16桁の入力だから64bitの全中間積が安全だとは考えない。
- 10の冪を前計算し、位置は右側の桁数rで統一する。先頭0、重なり出現、F(0)を確かめる。

## 復習の核

- 短区間の直接検索と比較し、Sが0開始、重なり出現、L=1、16桁上限を確認する。

## 計算量と制約

### 時間

各case O(|S|+D log X)、Dは境界Xの十進桁数。定数時間の整数生成を各位置で二分探索する。

### 空間

O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 1000; S is a string consisting of digits whose length is between 1 and 16, inclusive.; L and R are integers satisfying 1 \le L \le R < 10^{16}.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6035) — source-abc295-editorial-6035-ff096632d65b2245e644ed1e953c945408fcb66eae149c9c5f15bf6e75801b73
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_f) — source-abc295-f-problem-b30370616947ea6138cad14cf7b276e9ae23e08087db6dcd068d9a797aead540
