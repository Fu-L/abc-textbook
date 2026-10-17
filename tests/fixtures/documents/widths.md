# 横幅の表示確認

以下は表示テスト用の断片であり、実行用のプログラムではない。2つ目の枠は擬似コード。

```cpp
template <class Value, class Combine, class Apply, class Compose>
struct LazySegmentTree {
    void update() {
        if (pending) {
				std::vector<std::pair<std::array<long long, 4>, std::tuple<int, int, int>>> frontier_by_compressed_coordinate;
                // 深い字下げと長い日本語のコメントを途中で折り返さず、元の行に対応させて読むための表示確認です。
        }
    }
};
```

```text
for each vertex in reverse_topological_order:
    for each outgoing_edge in adjacency_list[vertex]:
        best_total_cost[outgoing_edge.destination] = min(best_total_cost[outgoing_edge.destination], best_total_cost[vertex] + outgoing_edge.weight)
```

長い識別子 `best_total_cost_by_compressed_coordinate_and_remaining_resource`
を日本語の文中で説明する。日本語の長い段落は通常どおり折り返し、文字サイズを小さくせずに読み進められる。これは長い文章がページ全体の横幅を押し広げないことも確認する段落である。

短い式 $$dp[S][v]$$ を文章の途中で読む。長い式
$$dp[S][v] = \sum_{u\in S\setminus\{v\}} dp[S\setminus\{v\}][u] + \operatorname{transitionCost}(u,v) + \operatorname{remainingResourcePenalty}(S,u,v)$$
も文字を欠かさず読む。

$$
\begin{aligned}
dp[S][v] &= \sum_{u\in S\setminus\{v\}} dp[S\setminus\{v\}][u] + \operatorname{transitionCost}(u,v) + \operatorname{remainingResourcePenalty}(S,u,v) \\
answer &= \min_{v\in V} dp[V][v]
\end{aligned}
$$

| 状態                             | 遷移前                               | 遷移後                       | 費用                                 | 復元情報                               |
| -------------------------------- | ------------------------------------ | ---------------------------- | ------------------------------------ | -------------------------------------- |
| `remaining_resource_count`       | `previous_compressed_coordinate`     | `next_compressed_coordinate` | `accumulated_transition_cost`        | `previous_vertex_and_resource`         |
| 未処理の頂点と残り資源を保持する | 今までに確定した区間の右端を保持する | 次に訪れる区間の右端へ進める | 新しく確定した区間の費用だけを加える | 最適値を更新したときの親状態を記録する |

| 手法   | 条件         |
| ------ | ------------ |
| 累積和 | 静的な区間和 |

[次の節へ](#確認後)

## 確認後

枠の外では通常の文章とリンクを読み進める。
