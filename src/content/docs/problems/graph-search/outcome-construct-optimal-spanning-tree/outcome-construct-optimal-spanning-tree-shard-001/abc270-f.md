---
title: "ABC270-F — Transportation"
draft: true
authoringUnit: {"problemId":"abc270-f","docPath":"src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc270-f.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-dsu-components","unit-greedy-exchange"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-bounded-enumeration","tag-dsu-components"],"sourceRevisionIds":["source-abc270-f-problem-efec89ac1c43e22dd35597a3e0251e203121f0c37021c39d09bbaead2ee11869","source-abc270-editorial-4879-a4659bb56ec1be762b27323f903ffbc21ef4d2d95fc7cf02b8275440b009f3df"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"同種空港・港の接続はhub経由の二辺で表せ、建設費は各島hub辺の費用と一致する。最適解が使うhub集合は四通り。固定集合を含む連結解からcycleを除けるので最小費用はその頂点集合のMSTに等しい。非連結ケースを除いて四ケース最小を取ると全最適解を覆う。","sourceRevisionIds":["source-abc270-f-problem-efec89ac1c43e22dd35597a3e0251e203121f0c37021c39d09bbaead2ee11869","source-abc270-editorial-4879-a4659bb56ec1be762b27323f903ffbc21ef4d2d95fc7cf02b8275440b009f3df"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

この解説で扱わないこと:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

airport利用をhub vertex X、harbor利用をhub vertex Yとして表すと、island iでの建設はi−Xまたはi−Yのweighted edgeになる。optimal solutionでislandsを含むconnected componentがX,Yを含むかはそれぞれ二択なので、使うhub集合は4通りだけで尽くせる。同種のairportを持つ任意二島間の移動は一つの仮想hubを介する二辺pathとして表せ、pairwise complete graphを作る必要がない。連結なsolutionからcycle edgeを除いても到達性を失わずcostは増えないため、固定caseではtreeだけを考えればよい。

棄却する候補: airport・harborを建てるisland subsetを直接列挙し、roadとの組合せを試す。

各hubだけでも2^N通りのsubsetがあり探索不能である。

採用する候補: 二つのhubを追加したgraphを作り、hubをnone/X/Y/both含める4 induced subgraphsでKruskal MSTを計算する。

固定したvertex集合を最小費用で連結する問題はそのsubgraphのMSTに一致し、4ケースで全解を覆う。

## 典型の発動条件

### 仮想頂点による共通接続の表現

発動条件: 同じ設備を持つ任意の二頂点が相互接続され、各頂点の参加costが個別に与えられるとき。

airport hubとharbor hubを追加し、各建設optionをhubへの一辺にする。

### Kruskal法とDSU

発動条件: 候補edgeから全対象vertexを最小総weightで連結したいとき。

各hub inclusion caseで許可edgeをweight順に見て、異なるcomponentだけをunionする。

## 問題固有の要素

hubを使わないcaseではそのvertexとincident edgesを除外し、残るN、N+1、N+2頂点が一componentになった場合だけ候補costにする。

別の問題へ持ち帰る視点: optionalなglobal mechanismが少数なら、仮想頂点を採用するsubsetだけ列挙して通常graph problemへ戻す。

## 正当性

同種空港・港の接続はhub経由の二辺で表せ、建設費は各島hub辺の費用と一致する。最適解が使うhub集合は四通り。固定集合を含む連結解からcycleを除けるので最小費用はその頂点集合のMSTに等しい。非連結ケースを除いて四ケース最小を取ると全最適解を覆う。

## 実装上の注意

- 各4ケースでDSUとedge countを初期化し、採用vertex数−1本を選べない非連結caseはinfinityとする。
- 総costは最大edge weightの和で32 bitを超えるため64 bit整数を使う。

## 復習の核

- 任意二点を結ぶ共通設備はcomplete edgesではなくvirtual hubへのstarとしてmodel化する。
- optional hubが少数なら使用有無を列挙し、各caseがMSTになる理由をconnectivityとcycle eliminationで確認する。

## 計算量と制約

### 時間

N 島、M 道路。hub二個を加え4ケースのKruskalで O((N+M)log(N+M))。

### 空間

道路とhub辺、DSUで O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1\leq X_i\leq 10^9; 1\leq Y_i\leq 10^9; 1\leq A_i<B_i\leq N; 1\leq Z_i\leq 10^9; (A_i,B_i)\neq (A_j,B_j), if i\neq j.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/tasks/abc270_f) — source-abc270-f-problem-efec89ac1c43e22dd35597a3e0251e203121f0c37021c39d09bbaead2ee11869
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/editorial/4879) — source-abc270-editorial-4879-a4659bb56ec1be762b27323f903ffbc21ef4d2d95fc7cf02b8275440b009f3df
