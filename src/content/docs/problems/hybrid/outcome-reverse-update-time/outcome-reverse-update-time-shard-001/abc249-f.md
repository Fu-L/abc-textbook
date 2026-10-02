---
title: "ABC249-F — Ignore Operations"
draft: true
authoringUnit: {"problemId":"abc249-f","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc249-f.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-priority-queue-best-first"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e","source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"代入はそれ以前の履歴を消すため、最終的に実行される最後の代入が解を区切る境界になる。 代入候補を一つ前へ動かすたび無視可能数が減るので、無視中の負数のうち絶対値が最小のものから合計へ戻せば最適性を保てる。 最後の代入候補を逆順に試しつつ、残りの無視枠で最も小さい負加算を保持すれば各候補の値を効率良く評価できる。","sourceRevisionIds":["source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e","source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reverse-update-time"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"操作=代入5、加算−4、加算3、K=1。","procedure":["負加算−4を無視すれば5+3=8。","代入を無視する枝は初期0−4+3=−1。"],"executionTarget":null,"expectedResult":"最大8。","verificationStatus":"not_applicable","learningUnitIds":["unit-reverse-offline"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reverse-update-time"],"prerequisiteIds":["unit-priority-queue-best-first"],"attainmentCondition":"無視枠が減ったらどの負加算を戻すか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"無視中で絶対値最小、つまり0に最も近い負数を戻す。他の大きい損失を無視し続ける。"},"answer":{"reasoningOrVerification":"無視中で絶対値最小、つまり0に最も近い負数を戻す。他の大きい損失を無視し続ける。","procedure":["具体例の各状態・寄与を再計算する。","無視中で絶対値最小、つまり0に最も近い負数を戻す。他の大きい損失を無視し続ける。"],"expectedResult":"無視中で絶対値最小、つまり0に最も近い負数を戻す。他の大きい損失を無視し続ける。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

実行される最後の代入操作を一つ固定すると、それ以前の値は全て消え、それ以後で答えを悪化させる負の加算だけを残り回数の範囲で無視すればよい。

採用する候補: 末尾から走査して無視する負加算をヒープ管理

最後の代入候補を逆順に試しつつ、残りの無視枠で最も小さい負加算を保持すれば各候補の値を効率良く評価できる。

棄却する候補: 時刻と無視回数を持つ前向きDP

状態数がN Kとなり、両方が2×10^5級の制約では実行できない。

代入はそれ以前の履歴を消すため、最終的に実行される最後の代入が解を区切る境界になる。

代入候補を一つ前へ動かすたび無視可能数が減るので、無視中の負数のうち絶対値が最小のものから合計へ戻せば最適性を保てる。

末尾から操作を走査し、後続加算の総和と無視する負加算の集合を優先度付きキューで管理する。代入を跨ぐたび無視枠を一つ消費し、集合サイズを枠内へ縮めて代入値との和を最大化する。

## 典型の発動条件

### 最後のリセットを固定する逆順走査

発動条件: 代入や初期化がそれ以前の寄与を全て消す。

最後に残す代入を境界として後半だけを集約し、候補を末尾から列挙する。

### 上位k個の損失を保つヒープ

発動条件: 限られた回数だけ負の寄与を取り除ける。

最も悪い負加算を無視集合に入れ、枠が減ったら最も害の小さいものを戻す。

## 問題固有の要素

無視する代入の数は、最後に実行する代入より後ろにある代入数で決まり、その残りだけを負加算の除去へ使える。

別の問題へ持ち帰る視点: 履歴を消す操作がある最適化では、最後に有効なリセットを固定すると前半を捨てて後半だけの選択問題へ変換できる。

## 正当性

代入はそれ以前の履歴を消すため、最終的に実行される最後の代入が解を区切る境界になる。 代入候補を一つ前へ動かすたび無視可能数が減るので、無視中の負数のうち絶対値が最小のものから合計へ戻せば最適性を保てる。 最後の代入候補を逆順に試しつつ、残りの無視枠で最も小さい負加算を保持すれば各候補の値を効率良く評価できる。

## 実装上の注意

- 総和と答えは64ビット整数で保持し、無視枠を減らした直後にヒープを縮めてから代入候補を評価する。先頭には値0の仮想代入を置く。

## 復習の核

- 全選択を列挙できる小ケースと照合し、K=0、代入がない場合、負加算が枠を超える場合、連続する代入で評価順がずれないかを確認する。

## 計算量と制約

### 時間

O(N log K)、負加算の無視候補heap、Kは無視上限。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq K \leq N; t_i \in \{1,2\} \, (1 \leq i \leq N); |y_i| \leq 10^9 \, (1 \leq i \leq N); All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

操作=代入5、加算−4、加算3、K=1。

1. 負加算−4を無視すれば5+3=8。
2. 代入を無視する枝は初期0−4+3=−1。

期待される結果: 最大8。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

無視枠が減ったらどの負加算を戻すか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

無視中で絶対値最小、つまり0に最も近い負数を戻す。他の大きい損失を無視し続ける。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3789) — source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_f) — source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e
