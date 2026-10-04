---
title: "ABC279-F — BOX"
draft: true
authoringUnit: {"problemId":"abc279-f","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc279-f.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components"],"sourceRevisionIds":["source-abc279-editorial-5284-2ea014c0428701362b5eb54e72479b68b510301e5a6ea983c6cd976648341c18","source-abc279-f-problem-073733efc404d7b820298114bdc572224b608dd2d787fb84b3b51bc0d56d875b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非空箱に球成分、成分代表に所有箱を対応させる。移動は成分併合または移管、追加は singleton 併合なのでこの不変条件を保つ。union後の新代表に所有箱を書き直せば代表変更にも対応し、find(ball) の所有箱が正しい。","sourceRevisionIds":["source-abc279-editorial-5284-2ea014c0428701362b5eb54e72479b68b510301e5a6ea983c6cd976648341c18","source-abc279-f-problem-073733efc404d7b820298114bdc572224b608dd2d787fb84b3b51bc0d56d875b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

## 考察

box移動は多数のballを一括して別boxへ移すため、ballごとのbox番号更新では同じ巨大集合を何度も走査し得る。 操作1はball集合の併合であり、各boxが現在どのDSU componentを持つか、各componentがどのboxにあるかを対応付ければよい。 DSU leaderはunion by sizeで変わり得るため、union後に返された新leaderへowner boxを設定し直す。 空boxにはcomponentがないというsentinelを持てば、空→非空移動・非空同士union・新ball追加を同じ対応で処理できる。

採用する候補: ballをDSU要素にし、box→component leaderとleader→boxの双方向mapを更新する。

集合併合と新ball追加をamortizedに処理し、queryはballのleaderからboxを即座に得られる。

棄却する候補: 各boxにball listを持ち、type1でYの全ballの所属boxをXへ書き換える。

大集合を箱間で繰り返し移す入力では総更新数が二次になり得る。

DSU leaderはunion by sizeで変わり得るため、union後に返された新leaderへowner boxを設定し直す。

空boxにはcomponentがないというsentinelを持てば、空→非空移動・非空同士union・新ball追加を同じ対応で処理できる。

最大N+Q ballのDSUを用意し、rootOfBox[x]とboxOfRoot[r]を持つ。move Y→Xは空caseを分けてcomponentをunionしYを空にする。addはsingleton ballをX componentへunionし、query ball bはboxOfRoot[find(b)]を返す。

## 典型の発動条件

### DSU componentへのmetadata付与

発動条件: 集合の併合と、要素が属する集合の外部属性queryが混在するとき。

leaderにbox番号を紐付け、leader変更後にmetadataを新rootへ移す。

### containerとcomponentの間接参照

発動条件: 多数要素のcontainer移動を個別更新したくないとき。

containerは集合代表だけ、query要素はfind経由でcontainerへ到達する。

## 問題固有の要素

boxがball集合を所有するのではなく、DSU componentとboxの対応だけを動かすと、10^100個という表現上のball上限も実際の追加数N+Qへ縮む。

別の問題へ持ち帰る視点: bulk moveでは要素属性を書き換えず、集合objectへのpointer/代表とownerの対応を付け替える。

## 正当性

非空箱に球成分、成分代表に所有箱を対応させる。移動は成分併合または移管、追加は singleton 併合なのでこの不変条件を保つ。union後の新代表に所有箱を書き直せば代表変更にも対応し、find(ball) の所有箱が正しい。

## 実装上の注意

- Yが空なら何もせず、Xが空ならunionせずcomponent pointerだけ移してYを空にする。
- union後は旧leaderを使わず新leaderをrootOfBox[X]へ保存し、boxOfRoot[newLeader]=Xを必ず更新する。

## 復習の核

- 大集合をbox1→2→3と移す例で、ball側は一度も更新せずowner[root]だけが変わることを追跡する。

## 計算量と制約

### 時間

初期球 N、操作 Q。O((N+Q)α(N+Q))。

### 空間

球 DSU と箱対応で O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 2 \le N \le 3 \times 10^5; 1 \le Q \le 3 \times 10^5; For each type-1 operation, 1 \le X,Y \le N and X \neq Y.; For each type-2 operation, 1 \le X \le N.; For each type-3 operation, ball X is contained in some box at that point.; There is at least one type-3 operation.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/editorial/5284) — source-abc279-editorial-5284-2ea014c0428701362b5eb54e72479b68b510301e5a6ea983c6cd976648341c18
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/tasks/abc279_f) — source-abc279-f-problem-073733efc404d7b820298114bdc572224b608dd2d787fb84b3b51bc0d56d875b
