# PR #63 のUnit読書順フォローアップ

PRレビューで指定された学習順を反映する。対象はデータ構造、DP、グラフ、組合せ・代数の4章で、Unit内の問題順は今回変更しない。

## 読書順

- **データ構造**: 累積和 → 連結リスト → heap・ordered set → 単調stack・queue → Cartesian tree →
  Fenwick Tree → Segment Treeのmonoid集約・関数合成・静的query・SWAG・区間分解・Merge Sort
  Tree・動的Segment Tree → 遅延作用 → run分割管理 → bucket・Mo → bitset・trie・bitwise minimax →
  rolling fingerprint → rollback・永続化 → Segment Tree Beats。
- **DP**: 最小十分状態 →
  grid・容量 → 列/区間（sequence・LIS・値域・prefix分割・区間合成・区間拡張） → subset →
  digit/string prefix（digit・automaton） → carry/mixed radix → 確率 → game（勝敗・game
  value） → 遷移最適化 → 線形漸化式 → cyclic minimax → frontier/profile・Steiner
  tree・巨大容量knapsack・期待値potential・Conway number games。
- **グラフ**: graph search（state graph・directional grid・transitive closure） → 二部構造 →
  connectivity（DSU・potential） → shortest path → 有向構造（DAG・peeling・SCC・2-SAT） → functional
  graph・doubling → spanning tree → lowlink → flow/matching（bipartite matching・max flow・lower
  bounds・min-cost flow・weighted matching） → graph core・cycle space・Euler/parity → path
  contraction・near-tree kernelization・有向walk周期 → planar duality・path matching
  contraction・一般重み付き完全matching。
- **組合せ・代数**: 組合せ係数 → reflection principle → 包除・約数反転・subset変換 → monoid
  exponentiation・semiring matrix → 線形代数/XOR → Prüfer code・orbit
  counting・deletion-contraction・determinant・poset → **matroid theory・matroid greedy** →
  generating functions・labeled components・convolution・Taylor shift・FPS・multipoint
  evaluation・Bostan–Mori・高度な係数抽出・relaxed/subset convolution・BEST・RSK・FPS composition →
  **linear matroid intersection**。

モデリング、木、文字列、数論、幾何・最適化の5章は順序を変更しない。

## 階層と順序の扱い

`parentId`は概念上の親子関係を保ち、`TEXTBOOK_CHAPTERS`は読書順を保つ。matroidでは`matroid-theory`の子として`matroid-greedy`と`linear-matroid-intersection`を保ちつつ、前者を中盤、後者を発展の最後へ配置する。このような分離を許し、読書順から親を推測しない。

章目次は読書順を平坦な箇条書きで表示する。章直下でないUnitには概念上の親へのリンクを付け、親Unit自身のページには`parentId`から得た直接の下位単元を表示する。Unit間の必須前提は既存の前提DAGを正本とし、読書順とは別にリンクする。

この変更では4章のUnit掲載順、章概要、章目次の表示・生成規則、これらの仕様と契約を同期する。problem
placement、Unit内の問題順、上記以外の章の順序、意味上の親指定は変更しない。
