---
title: "ABC276-E — Round Trip"
draft: true
authoringUnit: {"problemId":"abc276-e","docPath":"src/content/docs/problems/graph-search/outcome-maintain-connectivity-components/outcome-maintain-connectivity-components-shard-001/abc276-e.md","learningOutcomeIds":["outcome-maintain-connectivity-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components"],"sourceRevisionIds":["source-abc276-e-problem-426c86932b36db5a3d07ccaf25ee679a3eccfae746c5dcd0916fbad027f00628","source-abc276-editorial-5162-d44653efd19dfda81c93f3f3e585971c184a46f681ddffdb2dbdc9cb775d0ea4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Sを通るsimple cycleは異なる二隣接をS以外のpathで結ぶ。逆に二隣接がSを除いたroad成分でつながるならsimple pathを取りSの二辺を足してcycleを得る。成分一致を全隣接対で検査すれば必要十分。","sourceRevisionIds":["source-abc276-e-problem-426c86932b36db5a3d07ccaf25ee679a3eccfae746c5dcd0916fbad027f00628","source-abc276-editorial-5162-d44653efd19dfda81c93f3f3e585971c184a46f681ddffdb2dbdc9cb775d0ea4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。

## 考察

条件を満たすcycleがSを出る隣接roadと戻る隣接roadは相異なる。S自身を除けば、その2マスをroadだけで結ぶpathが残る。 Sのroad隣接は高々4個なので、巨大なH×Wでも調べるべき組は高々6組に限られる。 cycleからSを削除すれば2隣接点間pathになり、逆にそのpathの両端へSを足せばsimple cycleになるので必要十分である。 4近傍gridではSの異なる隣接2マスは直接隣接しないため、得られるcycle長は自動的に4以上になる。

採用する候補: Sを通行禁止にしてroad成分をBFS/Union-Findで求め、Sの異なる隣接road 2マスが同じ成分にあるか調べる。

cycle条件を通常の連結性へ落とし、各grid edgeを定数回見るだけで判定できる。

棄却する候補: Sから単純pathを全探索し、Sへ戻る経路を列挙する。

simple pathの候補は指数的で、H×W≤10^6では探索できない。

cycleからSを削除すれば2隣接点間pathになり、逆にそのpathの両端へSを足せばsimple cycleになるので必要十分である。

4近傍gridではSの異なる隣接2マスは直接隣接しないため、得られるcycle長は自動的に4以上になる。

S以外の'.'を頂点として隣接roadを連結する。Sの上下左右にあるroadを列挙し、その任意の2つのcomponent idが一致すればYes、なければNoを出す。

## 典型の発動条件

### 特定頂点を除いたcycle判定

発動条件: 指定頂点を必ず通るcycleの有無を問われ、その頂点の次数が小さいとき。

指定頂点を削除し、異なる隣接頂点同士の連結性を調べる。

### grid連結成分

発動条件: 障害物を除くマス間の到達可能性だけが必要なとき。

BFS/DFSまたはUnion-Findでroad componentをラベル付けする。

## 問題固有の要素

Sを一度だけ含むround tripは、Sを除いた後の『Sの隣接点同士がつながるか』に完全に言い換えられる。

別の問題へ持ち帰る視点: 必須頂点を含むcycleは、その頂点を切り離した隣接端点間pathとして見ると単純になる。

## 正当性

Sを通るsimple cycleは異なる二隣接をS以外のpathで結ぶ。逆に二隣接がSを除いたroad成分でつながるならsimple pathを取りSの二辺を足してcycleを得る。成分一致を全隣接対で検査すれば必要十分。

## 実装上の注意

- Sを通常のroadとして連結すると全隣接点がS経由で同成分になり誤判定するため、探索対象から除外する。
- Sの隣接候補は盤外と#を除き、異なる2マスだけを比較する。

## 復習の核

- Sの隣接2点がS経由でしかつながらない例と、外周を迂回してつながる例を比べ、探索でSを塞ぐ理由を確認する。

## 計算量と制約

### 時間

H×W盤面で O(HW)、S隣接組検査は高々6組。

### 空間

盤面とcomponent情報 O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 4 \leq H \times W \leq 10^6; H and W are integers greater than or equal to 2.; C_{i, j} is S, ., or #.; There is exactly one (i, j) such that C_{i, j} = S.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/tasks/abc276_e) — source-abc276-e-problem-426c86932b36db5a3d07ccaf25ee679a3eccfae746c5dcd0916fbad027f00628
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/editorial/5162) — source-abc276-editorial-5162-d44653efd19dfda81c93f3f3e585971c184a46f681ddffdb2dbdc9cb775d0ea4
