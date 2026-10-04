---
title: "ABC382-F — Falling Bars"
draft: true
authoringUnit: {"problemId":"abc382-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc382-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc382-editorial-11476-0492bb268332837af972819863dd94fa5bf870e8304d6ff03347d414bd5f4cff","source-abc382-f-problem-3ba32cb296718a12fbaaced8b18b8752ca1051e7437047ad000ce8c979c72c68"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"初期位置が下のバーは上のバーより先に障害となり、上のバーが途中で下側へ回り込むことはないため処理順を固定できる。 バーは水平かつ剛体なので、被覆するどれか一列で最初に衝突する高さ、すなわち区間 m の最小値が全体の停止位置を決める。 未来の落下を列ごとの最上障害だけへ要約でき、各バーを O(log W) で配置できる。","sourceRevisionIds":["source-abc382-editorial-11476-0492bb268332837af972819863dd94fa5bf870e8304d6ff03347d414bd5f4cff","source-abc382-f-problem-3ba32cb296718a12fbaaced8b18b8752ca1051e7437047ad000ce8c979c72c68"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

下にあるバーから最終位置を確定すると、上のバーはそれを追い越さない。各列について確定済みバーの最上段位置 m_j が分かれば、新しい水平バーは被覆列の min(m_j)-1 まで落ちる。

採用する候補: 初期行の降順にバーを処理し、列配列 m に区間 min query と区間代入を行う遅延セグメント木で最終行を決める。

棄却する候補: 時刻ごと・番号順に全バーの一段落下をシミュレーションする。

安定までの時間は H 級で、各時刻に N バーを調べると HN が最大4×10^10になる。

バーを R 降順に sort し、m_j=H+1 で初期化する。各 (R,C,L) で y=min m[C..C+L)-1 を答えにし、同区間を y へ range assign する。元 index 順に出力する。

## 典型の発動条件

### 落下過程の支持面 DP

発動条件: 物体が追い越さず、下から確定すると上の最終位置が決まるとき。

各座標列の最高障害を区間 query/update で管理する。

## 問題固有の要素

長時間の同時シミュレーションを止め、安定状態を下から一回だけ構築する。

別の問題へ持ち帰る視点: 横棒の停止は被覆列の中で最も高い障害一つが支配する。

## 正当性

初期位置が下のバーは上のバーより先に障害となり、上のバーが途中で下側へ回り込むことはないため処理順を固定できる。 バーは水平かつ剛体なので、被覆するどれか一列で最初に衝突する高さ、すなわち区間 m の最小値が全体の停止位置を決める。 未来の落下を列ごとの最上障害だけへ要約でき、各バーを O(log W) で配置できる。

## 実装上の注意

- 同じ初期 R のバーは非交差なので順序によらないが、sort 規約を固定する。区間は [C,C+L)、空列初期値 H+1 とする。

## 復習の核

- 各列の m_j が何を表すかを言語化し、min-1 がバー全体の停止位置になる図を確認する。

## 計算量と制約

### 時間

O(N log N+N log W+W)、H,Wは盤面寸法、Nはバー数。

### 空間

O(N+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; 1 \leq R_i \leq H; 1 \leq C_i \leq W; 1 \leq L_i \leq W - C_i + 1; In the initial state, there is no cell occupied by two different bars.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/editorial/11476) — source-abc382-editorial-11476-0492bb268332837af972819863dd94fa5bf870e8304d6ff03347d414bd5f4cff
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/tasks/abc382_f) — source-abc382-f-problem-3ba32cb296718a12fbaaced8b18b8752ca1051e7437047ad000ce8c979c72c68
