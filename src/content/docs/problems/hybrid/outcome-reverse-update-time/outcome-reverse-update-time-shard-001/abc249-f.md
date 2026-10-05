---
title: "ABC249-F — Ignore Operations"
draft: true
authoringUnit: {"problemId":"abc249-f","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc249-f.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-priority-queue-best-first"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e","source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最後に実行される代入より前は結果に影響せず、後ろの代入はすべて無視する必要がある。逆順走査で候補を一つ固定すれば、後続の加算だけが値に残る。限られた無視枠では、最も負の加算を無視するのが最適である。候補の代入自身は無視しないため、現在の枠で値を評価した後に枠を一つ減らす。この順で全ての有効な代入候補と仮想代入を調べるので、最大値を漏れなく得る。","sourceRevisionIds":["source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e","source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

先に読む単元:

- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md) — 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

最後に実行される代入を固定すると、それより前の操作は答えに影響しない。候補の代入より後ろにある代入は無視し、残った枠で合計を悪化させる負の加算を無視すればよい。

代入候補を後ろから試す。後続加算のうち無視する負数は、より負の値を優先してヒープに残す。候補を一つ前の代入へ移すと、その代入を無視するため枠が一つ減るので、候補の値を評価してから枠を減らす。

採用する候補: 最後に有効な代入を固定した逆順走査と、無視する負数を保つ優先度付きキュー

候補ごとの加算和を一から計算せず、代入境界と無視枠だけを更新すればよい。

棄却する候補: 時刻と無視回数を持つ前向きDP

状態数が N K となり、両方が 2×10^5 級の制約では実行できない。

代入がない場合は値0の仮想代入を最後の候補として扱う。ただし、そこへ進む前に無視枠が負になった場合は候補にできない。

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

最後に実行される代入より前は結果に影響せず、後ろの代入はすべて無視する必要がある。逆順走査で候補を一つ固定すれば、後続の加算だけが値に残る。限られた無視枠では、最も負の加算を無視するのが最適である。候補の代入自身は無視しないため、現在の枠で値を評価した後に枠を一つ減らす。この順で全ての有効な代入候補と仮想代入を調べるので、最大値を漏れなく得る。

## 実装上の注意

- 代入では、現在の枠で `ans=max(ans, 代入値+残す加算和)` を評価してから枠を一つ減らす。枠が負になれば走査を終え、そうでなければヒープが枠を超えないよう、無視中で最も0に近い負数を和へ戻す。
- 先頭の仮想代入0も同じ順序で評価する。総和と答えは64ビット整数で持つ。

## 復習の核

- 全選択を列挙できる小ケースと照合し、K=0、代入がない場合、負加算が枠を超える場合、連続する代入で評価順がずれないかを確認する。

## 計算量と制約

### 時間

O(N log K)、負加算の無視候補heap、Kは無視上限。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq K \leq N; t_i \in \{1,2\} \, (1 \leq i \leq N); |y_i| \leq 10^9 \, (1 \leq i \leq N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3789) — source-abc249-editorial-3789-522657cf400654889f6effd6e0392296e0ee0c82d90f6096f04daf7e8a3c9b5e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_f) — source-abc249-f-problem-98f2efb029580750dc65d201c0c08687414f56bc3d7ae74727e0c43dca6fd43e
