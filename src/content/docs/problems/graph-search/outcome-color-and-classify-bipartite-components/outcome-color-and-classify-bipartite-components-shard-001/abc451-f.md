---
title: "ABC451-F — Make Bipartite 3"
draft: true
authoringUnit: {"problemId":"abc451-f","docPath":"src/content/docs/problems/graph-search/outcome-color-and-classify-bipartite-components/outcome-color-and-classify-bipartite-components-shard-001/abc451-f.md","learningOutcomeIds":["outcome-color-and-classify-bipartite-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-small-to-large"],"excludedTopics":["重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。"],"tagIds":["tag-bipartite-structure","tag-dsu-components","tag-small-to-large"],"sourceRevisionIds":["source-abc451-editorial-18091-ee0e42ed4ad9b07800e171e23a7943b9727d1666e268304fbe47d241fe0b351a","source-abc451-f-problem-1795336b8ffdf013868cbc1740d0a0261d6fb20324849793e539548d9821aeb5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二部成分彩色は全反転以外一意で最小黒数min(c0,c1)。別成分は必要なら一方全反転して接続し、同成分同色辺だけが矛盾を作る。寄与の引き算併合足し算は全体最小黒数を保つ。小側移動はサイズ倍増で各頂点log N回。","sourceRevisionIds":["source-abc451-editorial-18091-ee0e42ed4ad9b07800e171e23a7943b9727d1666e268304fbe47d241fe0b351a","source-abc451-f-problem-1795336b8ffdf013868cbc1740d0a0261d6fb20324849793e539548d9821aeb5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)

- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

対象外:

- 重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。

## 考察

二部な連結成分の彩色は全頂点の白黒反転を除いて一意なので、黒頂点数の最小寄与はmin(c_0,c_1)である。全体の答えは成分寄与の和で、辺追加時に変わるのは端点を含む成分だけである。 端点が同じ成分なら、異色の場合は既存彩色を保てるが、同色の場合は奇閉路が生じて以後の辺追加でも二部性は戻らない。別成分なら同色のとき片側全体を反転してから併合すればよい。 頂点数が小さい成分を走査して大きい成分へ移すと、走査された頂点の所属成分サイズは少なくとも2倍になる。各頂点は高々log₂N回しか走査されず、全反転・移動を合計O(N log N)にできる。

採用する候補: DSUと明示的な二色頂点集合を持ち、小さい成分だけを必要なら反転して併合する

同一成分なら端点色だけで奇cycleを判定でき、別成分なら一方の彩色反転で必ず接続できる。小さい側だけを走査すれば各頂点の移動回数をO(log N)へ償却できる。

棄却する候補: 各辺追加後にグラフ全体をBFSして二部彩色し直す

一回O(N+Q)、全queryでは二次規模となり、過去に確定した成分彩色を再利用できていない。

棄却する候補: 成分併合のたびに任意の側を全反転・全移動する

同じ大成分を繰り返し走査する入力でΘ(N²)になり、端点を逆色にする局所条件は満たしても全体計算量を保証できない。

端点が同じ成分なら、異色の場合は既存彩色を保てるが、同色の場合は奇閉路が生じて以後の辺追加でも二部性は戻らない。別成分なら同色のとき片側全体を反転してから併合すればよい。

頂点数が小さい成分を走査して大きい成分へ移すと、走査された頂点の所属成分サイズは少なくとも2倍になる。各頂点は高々log₂N回しか走査されず、全反転・移動を合計O(N log N)にできる。

各DSU成分に色0・1の頂点数とmember一覧を持ち、globalAns=Σmin(c_0,c_1)を管理する。別成分を結ぶときは両寄与を引き、小さい成分の端点色が大側端点と同じなら全memberの色を反転し、memberを大側へ移してDSUを併合し、新寄与を足す。同一成分の同色辺を見つけたら以後-1を出す。

## 典型の発動条件

### 二部彩色の成分反転

発動条件: 連結成分ごとの二色制約があり、成分間を新しい不同色辺で接続する。

端点色が同じ場合だけ片方の成分を全反転し、色数を入れ替えて整合させる。

### DSUとsmall-to-large merge

発動条件: 連結成分をオンライン併合しつつ、成員ごとの状態更新が避けられない。

DSUで同一成分を判定し、member一覧は小さい成分から大きい成分へだけ移す。

## 問題固有の要素

求めるのは一つの固定彩色の黒数ではなく、各成分を独立に反転できる自由度を使ったΣmin(c_0,c_1)であり、merge前後の二成分だけ差分更新できる。

別の問題へ持ち帰る視点: 制約充足解が成分ごとの対称操作を持つときは、その軌道内の最小コストを成分寄与にして、構造変更時の局所差分として管理する。

## 正当性

二部成分彩色は全反転以外一意で最小黒数min(c0,c1)。別成分は必要なら一方全反転して接続し、同成分同色辺だけが矛盾を作る。寄与の引き算併合足し算は全体最小黒数を保つ。小側移動はサイズ倍増で各頂点log N回。

## 実装上の注意

- merge前に両成分のmin寄与を引き、反転時はsmall側全頂点の色と色数を一貫して入れ替える。DSUのleader選択とmember容器の所有者を同期し、非二部化後は状態更新を省略して-1を出し続ける。

## 復習の核

- 小グラフで全2^N彩色を試すoracleと比較し、孤立点、異色辺の成分内追加、三角形で初めて非二部化する瞬間、同サイズ成分の反転merge、色数が大きく偏る星・鎖を確認する。

## 計算量と制約

### 時間

N頂点Q追加。small-to-large移動O(N log N)、DSU O(Qα(N))。

### 空間

member、色、黒白countで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le Q \le 2 \times 10^5; 1 \le u_i \lt v_i \le N; (u_i, v_i) \ne (u_j, v_j) \ (i \ne j); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/editorial/18091) — source-abc451-editorial-18091-ee0e42ed4ad9b07800e171e23a7943b9727d1666e268304fbe47d241fe0b351a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/tasks/abc451_f) — source-abc451-f-problem-1795336b8ffdf013868cbc1740d0a0261d6fb20324849793e539548d9821aeb5
