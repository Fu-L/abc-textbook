/**
 * 習得を勧める読者のAlgorithmレーティング帯。問題Difficultyや履修順からは計算しない。
 * 標準形で発動条件・不変量・計算量を説明し、実装またはライブラリへの還元ができる段階を評価する。
 * 章・案内節は導入部分の対象を示す。子Unitの習得対象はそれぞれ独立に評価する。
 * 色の境界: https://info.atcoder.jp/overview/contest/rating （2026-09-18確認）
 * Unitへの割当ては本書の編集判断であり、AtCoder公式の履修基準ではない。
 */
export const ATCODER_TARGET_BANDS = {
  茶色: '400–799',
  緑色: '800–1199',
  水色: '1200–1599',
  青色: '1600–1999',
  黄色: '2000–2399',
  橙色: '2400–2799',
  赤色: '2800以上',
} as const;

type TargetColor = keyof typeof ATCODER_TARGET_BANDS;
type LearningTarget = readonly [color: TargetColor, reason: string];

export const UNIT_LEARNING_TARGETS: Readonly<Record<string, LearningTarget>> = {
  // モデル変換とアルゴリズム設計
  'unit-chapter-modeling': [
    '緑色',
    '探索・集計・貪欲法を選ぶ前に、保存すべき条件を言葉にする習慣を付ける。',
  ],
  'unit-normalization': [
    '水色',
    '対称性で同じ候補をまとめ、代表だけを残してよい理由を示せるようにする。',
  ],
  'unit-coordinate-compression': [
    '緑色',
    '整列と二分探索を使い、大小関係と実際の距離を区別して添字化する。',
  ],
  'unit-contribution-reordering': [
    '緑色',
    '要素・組・値・区間のどれを固定すれば一意に数えられるかを見抜き、総和の順を交換する。',
  ],
  'unit-bounded-enumeration': [
    '緑色',
    '制約から候補数を見積もり、成功までの探索回数を界する考え方を学ぶ。',
  ],
  'unit-backtracking-search': [
    '緑色',
    '再帰と訪問済み管理を使い、選択と取り消しが対応する探索を実装する。',
  ],
  'unit-divide-enumeration': [
    '水色',
    '探索空間を独立に分ける場合と、再帰的な小問題へ分ける場合を区別する入口。',
  ],
  'unit-xor-threshold-matching': [
    '赤色',
    'XOR閾値ごとにpair可能数を最大化するbit分割再帰を組み立て、同一部分集合内と二集合間のmatching数を合成する根拠を証明する。',
  ],
  'unit-recursive-divide-and-conquer': [
    '水色',
    '分割・再帰・併合の役割を分け、重複のない合成と計算量を説明する。',
  ],
  'unit-meet-in-the-middle': [
    '水色',
    '全列挙と整列・検索を組み合わせ、指数の半減と照合条件を設計する。',
  ],
  'unit-greedy-exchange': [
    '水色',
    '選択の直感を交換論法や支配関係で裏付け、反例のある貪欲法を見分ける。',
  ],
  'unit-bitwise-greedy-feasibility': [
    '水色',
    '上位bitの優先性と単調な可否判定を組み合わせてmaskを決める。',
  ],
  'unit-constructive-witness': [
    '水色',
    '存在判定の証明に操作列や親情報を対応させ、具体的な解へ戻す。',
  ],
  'unit-change-impact-localization': [
    '青色',
    '一つの証拠が残る変更を特定し、答えが変わり得る部分だけを再計算する。',
  ],
  'unit-monotone-search': ['緑色', '二分探索の実装に加え、判定の単調性と境界の意味を説明する。'],
  'unit-two-pointers-window': [
    '緑色',
    '窓の条件とpointerが戻らない理由を定め、全体の走査回数を数える。',
  ],
  'unit-event-sweep': ['水色', '時刻・座標で整列し、同時eventの順序とactive集合の不変量を保つ。'],
  'unit-kinetic-order-maintenance': [
    '橙色',
    '連続的な順序変化を隣接交差に限定し、失効eventと総event数を管理する。',
  ],
  'unit-reverse-offline': [
    '水色',
    '削除を追加に変えるなど、時間を逆に読むことで扱える操作を増やす。',
  ],
  'unit-parallel-binary-search': [
    '青色',
    'offline処理と二分探索を組み合わせ、複数queryで判定器の走査を共有する。',
  ],
  'unit-decomposition-amortization': [
    '水色',
    '一操作の最悪時間から離れ、総仕事量と軽重分類で計算量を設計する入口。',
  ],
  'unit-amortized-monotone-progress': [
    '水色',
    '一度だけの削除やpotentialの減少に課金し、操作列全体を評価する。',
  ],
  'unit-small-to-large': [
    '青色',
    '併合時の倍増と分割時の半減を使い、重複が消える場合も総走査量を証明する。',
  ],
  'unit-threshold-heavy-light': [
    '青色',
    '頻度や次数で場合分けし、二つの計算量の釣合いから閾値を選ぶ。',
  ],
  'unit-randomized-algorithms': [
    '青色',
    '一回の成功確率と試行回数を結び付け、乱択が許す誤りを評価する。',
  ],
  'unit-randomized-algebraic-fingerprint': [
    '黄色',
    '体やXORへの写像を設計し、代数的な衝突確率を全比較回数まで含めて評価する。',
  ],
  'unit-interactive-protocol': [
    '緑色',
    '入出力手順・flush・問い合わせ上限を守り、単純な識別手順を実装する。',
  ],
  'unit-game-parity-invariant': [
    '青色',
    '局面ごとの勝敗再帰が不要な条件を見つけ、手数・終端量の偶奇から成立する戦略を証明する。',
  ],
  'unit-information-theoretic-query-design': [
    '水色',
    '応答で区別できる状態数を数え、bit符号化と復号を設計する。',
  ],

  // データ構造と問い合わせ
  'unit-chapter-query': [
    '緑色',
    '必要な操作と保持する情報を整理し、基本コンテナから区間構造へ進む入口。',
  ],
  'unit-linked-list-index': [
    '茶色',
    '配列や辞書で要素を索引化し、挿入・削除で変わる前後関係だけを更新する。',
  ],
  'unit-ordered-set-heap': [
    '緑色',
    '極値の取得と近傍の検索を区別し、heapとordered setを使い分ける入口。',
  ],
  'unit-priority-queue-best-first': [
    '緑色',
    'heapの操作を使い、現在選べる候補だけを管理して順に取り出す。',
  ],
  'unit-ordered-set-multiset': [
    '緑色',
    '前後要素・重複を管理し、二集合に分けて境界と集計値を保つ基本操作を学ぶ。',
  ],
  'unit-ordered-interval-partition': [
    '青色',
    'run分割やactive区間の和集合を管理し、endpoint更新・重複被覆・消去回数の償却を説明する。',
  ],
  'unit-monotone-stack-queue': [
    '水色',
    '将来不要な候補を削る支配関係と、一要素一度の償却計算量を説明する。',
  ],
  'unit-cartesian-tree': [
    '青色',
    '単調stackから木を構築し、区間極値と再帰分割が同じ構造になることを使う。',
  ],
  'unit-prefix-aggregate': ['茶色', '加算と差分で区間を表し、一次元から二次元の包除へ広げる。'],
  'unit-weighted-prefix-fenwick': [
    '水色',
    '座標圧縮と動的prefix和を組み合わせ、反転数や重み付き統計を数える。',
  ],
  'unit-monoid-segment-tree': ['水色', '結合則・単位元・順序を区間集約の共通言語として使う入口。'],
  'unit-range-monoid-aggregation': [
    '水色',
    '十分な要約と結合演算を定義し、Segment Treeへ正しく載せる。',
  ],
  'unit-finite-function-composition': [
    '水色',
    '小さな遷移表を関数として合成し、適用順の逆転を避ける。',
  ],
  'unit-idempotent-overlap-range-query': [
    '水色',
    '冪等性が区間の重複を許す理由を理解し、静的queryをSparse Tableで処理する。',
  ],
  'unit-swag': ['青色', '非可換な結合順を二つのstackで保ち、窓の集約を償却定数時間にする。'],
  'unit-segment-tree-canonical-decomposition': [
    '青色',
    '区間を少数のnodeへ分解する性質を、値の集約以外の配置にも使う。',
  ],
  'unit-static-sorted-range-index': [
    '青色',
    '区間分解・整列列・prefix和を組み合わせ、二つの軸を持つ問い合わせを処理する。',
  ],
  'unit-dynamic-segment-tree': [
    '青色',
    '通常のSegment Treeを疎なnode生成へ拡張し、座標域とnode数を別々に評価する。',
  ],
  'unit-range-actions': [
    '青色',
    '要約に対する作用と作用同士の合成を定義し、遅延評価の整合性を説明する。',
  ],
  'unit-segment-tree-beats': [
    '橙色',
    '一括更新が失敗する条件を要約に持たせ、再帰下降の回数まで償却解析する。',
  ],
  'unit-value-bucket-aggregation': [
    '水色',
    '平方根分割で完全blockと端数を分け、更新とqueryの費用を調整する。',
  ],
  'unit-mo-offline-range': [
    '青色',
    '追加・削除可能な集計を作り、query順の変更で端点移動量を抑える。',
  ],
  'unit-persistence-rollback': ['青色', '過去へ戻す操作と過去の版を残す操作の違いを理解する入口。'],
  'unit-rollback': ['青色', '変更前の差分を保存し、DFSや時間分割から戻るたびに不変量を復元する。'],
  'unit-persistence': [
    '黄色',
    '更新pathだけの複製と共有部分の不変性を理解し、複数versionを管理する。',
  ],
  'unit-bitset-word-parallel': [
    '水色',
    '真偽配列の演算をbit演算へ写し、word幅を含めた計算量を見積もる。',
  ],
  'unit-binary-trie': ['水色', '整数の大小とXORを上位bitからの分岐に写して検索する。'],
  'unit-bitwise-minimax-partition': [
    '青色',
    '上位bitが最大値を支配することを使い、二群への再帰とminimaxを導く。',
  ],
  'unit-string-hash': [
    '水色',
    '列の一致判定を連結可能な要約へ写し、衝突のある比較として扱う入口。',
  ],
  'unit-sequence-fingerprint': [
    '水色',
    'prefix hashと連結則を実装し、長さ・指数位置・衝突確率を確認する。',
  ],

  // 動的計画法
  'unit-chapter-dynamic-programming': [
    '緑色',
    '状態・基底・遷移・計算順を明示する習慣を身につける入口。',
  ],
  'unit-dp-state-design': ['緑色', '未来の選択に必要な情報だけを残し、履歴を同じ状態へまとめる。'],
  'unit-frontier-profile-dp': [
    '黄色',
    '境界から離れた情報を忘れ、接続関係を正規化した幅指数の状態を設計する。',
  ],
  'unit-dp-grid-table': ['緑色', '二次元以上の添字と依存順を定め、隣接状態から表を埋める。'],
  'unit-dp-sequence-interval': ['緑色', 'prefix・最後の要素・区間という状態の違いを見渡す入口。'],
  'unit-dp-sequence': [
    '緑色',
    '選ぶ・選ばない遷移と最後の要素を状態にし、同じ要素の重複利用を避ける。',
  ],
  'unit-dp-lis': ['水色', '末尾の支配関係で状態を圧縮し、二分探索の境界と復元方法を理解する。'],
  'unit-dp-value-range': [
    '水色',
    '列DPの遷移を値域の集約へ写し、Segment Treeと更新順を組み合わせる。',
  ],
  'unit-dp-prefix-partition': [
    '水色',
    '最後の切れ目を固定し、漏れと重複のない分割の漸化式を立てる。',
  ],
  'unit-dp-interval-composition': [
    '水色',
    '小区間の独立性と長さ順の依存を確認し、分割点を遷移にする。',
  ],
  'unit-dp-interval-expansion': [
    '青色',
    '訪問済み範囲と現在の端で履歴を圧縮し、移動が往復しても非循環なDPを作る。',
  ],
  'unit-dp-subset-resource': [
    '緑色',
    '個数・容量を軸とするナップサック型DPを実装し、更新方向を説明する。',
  ],
  'unit-eventual-unbounded-knapsack': [
    '橙色',
    '交換論で例外部分を有限に界し、巨大容量を小さなDPと線形部分へ分ける。',
  ],
  'unit-dp-subset-state': [
    '水色',
    '使用集合をbitmaskで持ち、集合の増減と遷移順から指数時間DPを設計する。',
  ],
  'unit-steiner-tree-dp': [
    '橙色',
    'terminal集合の分割と多始点最短路を交互に使い、部分解の合成を正当化する。',
  ],
  'unit-dp-digit-string': [
    '水色',
    'prefixの有限情報だけを持つDPを、桁の上限や文字列の制約へ使う入口。',
  ],
  'unit-digit-dp': ['水色', 'tight・先頭の0・残す統計を分け、上限以下の整数を重複なく数える。'],
  'unit-automaton-dp': [
    '青色',
    '構成済みautomatonと位置の直積を使い、禁止状態と受理状態を区別して数える。',
  ],
  'unit-dp-carry-mixed-radix': [
    '青色',
    '繰り上がりや借りだけを次の桁へ渡し、通常の桁DPと異なる走査方向を設計する。',
  ],
  'unit-dp-stochastic': ['水色', '一段先で条件分けし、確率・期待値の式と自己ループの移項を扱う。'],
  'unit-additive-expectation-potential': [
    '橙色',
    '対称性と線形性で期待値を頻度別関数の和に分離し、終端条件まで較正する。',
  ],
  'unit-dp-game': ['水色', 'DAG上の勝敗再帰からGrundy数へ進み、独立なゲームの和をXORで評価する。'],
  'unit-dp-game-value': ['水色', '手番と終端利得を明示し、minimaxや得点差の再帰を実装する。'],
  'unit-cyclic-minimax-game': [
    '黄色',
    '循環する局面でOR・ANDの確定条件を分け、引き分けと有限minimax距離を判定する。',
  ],
  'unit-conway-number-games': [
    '赤色',
    'partisan gameが数になる条件と数の独立和を理解し、Grundy数との違いを扱う。',
  ],
  'unit-dp-transition-optimization': [
    '青色',
    '漸化式の共通項・例外・集約範囲を取り出し、状態数と遷移数を別々に減らす。',
  ],
  'unit-linear-recurrence': [
    '青色',
    '固定線形遷移を行列や漸化式へ写し、巨大回数の反復を二分累乗する。',
  ],

  // グラフアルゴリズム
  'unit-chapter-graph': [
    '緑色',
    '状態と遷移を頂点と辺で表し、距離・連結性・向きの違いを整理する入口。',
  ],
  'unit-graph-search': ['緑色', '入力の頂点以外にも状態を作り、探索と到達関係を使う入口。'],
  'unit-state-graph-search': [
    '緑色',
    '位置と補助情報を一つの頂点にし、状態数・辺数を見積もってBFSやDFSを使う。',
  ],
  'unit-directional-grid-effect-scan': [
    '水色',
    '方向ごとの走査で長距離の影響を前計算し、探索中の判定を軽くする。',
  ],
  'unit-transitive-closure': ['水色', '到達関係の推移性を行列更新やbitsetでまとめて計算する。'],
  'unit-shortest-path-certificates': [
    '緑色',
    '辺の重みに合う距離計算を選び、最短路の復元へ進む入口。',
  ],
  'unit-weighted-shortest-path': [
    '緑色',
    '重みと状態の定義を確認し、Dijkstraなどの標準的な最短路算法を使い分ける。',
  ],
  'unit-shortest-path-reconstruction': [
    '水色',
    '距離だけでなく到達元を保持し、最短路条件を満たす木や経路を取り出す。',
  ],
  'unit-difference-constraints': [
    '青色',
    '不等式を辺へ変換し、負閉路と可解性・最適なpotentialの関係を説明する。',
  ],
  'unit-directed-condensation': [
    '水色',
    '有向グラフの循環部分と非循環部分を区別し、縮約して処理する入口。',
  ],
  'unit-dag-topological-processing': [
    '緑色',
    '入次数による処理順を作り、有向非循環グラフ上の伝播やDPを実装する。',
  ],
  'unit-scc-condensation': ['水色', '相互到達性で頂点をまとめ、縮約後がDAGになることを使う。'],
  'unit-directed-core-peeling': [
    '水色',
    'DFSの訪問状態や次数零の反復削除から、有向cycleと残る領域を判定する。',
  ],
  'unit-directed-walk-periodicity': [
    '黄色',
    'SCC内の閉路長を差分のgcdでまとめ、巨大歩数の到達条件を周期へ写す。',
  ],
  'unit-two-sat': ['青色', '二値制約を含意へ変換し、literalと否定のSCCから可解性と代入を得る。'],
  'unit-functional-graph': ['水色', '後続が一意な遷移をcycleと流入木に分け、反復を圧縮する入口。'],
  'unit-functional-graph-decomposition': [
    '水色',
    '前周期と周期を分離し、cycleへの流入と巨大回数の移動を扱う。',
  ],
  'unit-binary-lifting': ['水色', '二の冪回の遷移を合成し、行き先や累積値を対数回で求める。'],
  'unit-connectivity': ['緑色', '連結成分を単位に情報を管理し、探索と成分併合を使い分ける入口。'],
  'unit-dsu-components': ['緑色', '代表と成分サイズを管理し、辺追加による連結性をDSUで処理する。'],
  'unit-graph-potential-propagation': [
    '水色',
    '辺の差やXORを伝播し、閉路の整合性と成分ごとの自由度を確認する。',
  ],
  'unit-potential-dsu': ['青色', 'DSUの親への差を保ち、経路圧縮・併合時の符号と矛盾判定を導く。'],
  'unit-monotone-path-contraction': [
    '青色',
    '確定した区間を次未処理pointerで飛ばし、削除済み部分を再走査しない。',
  ],
  'unit-lowlink-critical-structure': [
    '青色',
    'DFS木と後退辺を区別し、lowlinkの不変量から橋・関節点を判定する。',
  ],
  'unit-spanning-tree-optimization': [
    '水色',
    'DSUやheapを用い、cut・cycle性質で全域木の辺選択を正当化する。',
  ],
  'unit-kruskal-threshold-sweep': [
    '青色',
    '辺とqueryを同じ重み順に処理し、連結する閾値と同重みの扱いを整理する。',
  ],
  'unit-cycle-space-basis': [
    '青色',
    '非木辺と基本cycleを対応させ、偶数次数の辺集合をF₂上の基底で表し、辺ラベルによるcycle空間の線形像をXOR spanへ移す。',
  ],
  'unit-graph-core-peeling': [
    '水色',
    '辺数と頂点数から閉路数を読み、次数条件で残る核を取り出す入口。',
  ],
  'unit-graph-core': [
    '水色',
    '成分のE−V+1から閉路数を読み、必要なら葉を剥がして残るcoreを調べる。',
  ],
  'unit-near-tree-kernelization': [
    '黄色',
    '葉と次数2のchainを答えを保って縮約し、余分な辺数で残るサイズを界する。',
  ],
  'unit-euler-degree': ['水色', '次数と連結性から全辺を使う歩道や選択辺集合の条件を読む入口。'],
  'unit-euler-trail-circuit': [
    '水色',
    '次数条件を理解し、辺を一度ずつ使うHierholzer法を実装する。',
  ],
  'unit-degree-parity-subgraph': [
    '青色',
    '木の葉から奇偶条件を確定し、指定した奇数次数集合を実現する。',
  ],
  'unit-bipartite-structure': [
    '緑色',
    '二部性と部の反転対称性を扱い、連結二部グラフの彩色重複も補正する。',
  ],
  'unit-flow-matching': [
    '青色',
    '割当て・容量・cutの制約を読み、matchingとflowへの還元を選ぶ入口。',
  ],
  'unit-bipartite-matching': ['青色', '増加路を理解し、Hall条件と最小頂点被覆を割当て問題へ使う。'],
  'unit-max-flow-min-cut': [
    '青色',
    '残余グラフとcutの意味を理解し、選択・排反を容量networkへ還元する。',
  ],
  'unit-flow-lower-bounds': [
    '黄色',
    '下限を需要へ移し、補助source・sinkでcirculationの可解性を判定する。',
  ],
  'unit-min-cost-flow': ['黄色', '残余辺の費用とpotentialを理解し、流量別の最小費用へ還元する。'],
  'unit-weighted-bipartite-matching': [
    '黄色',
    'assignmentの双対potentialとtight edgeを理解し、Hungarian法や費用流を選ぶ。',
  ],
  'unit-min-weight-general-perfect-matching': [
    '赤色',
    '奇cycleのblossom縮約またはTutte多項式を使う一般matchingの理論を学ぶ。',
  ],
  'unit-path-matching-contraction': [
    '橙色',
    '選んだ辺の近傍を補正して縮約し、各cardinalityの最適値が得られる理由を示す。',
  ],
  'unit-planar-duality': [
    '黄色',
    '平面埋め込みのfaceを構成し、primalのcutとdualのpath・cycleを対応させる。',
  ],

  // 木構造
  'unit-chapter-tree': [
    '水色',
    '探索で得る木の距離・祖先・部分木を、集約と分解の共通の土台にする入口。',
  ],
  'unit-tree-metric': [
    '水色',
    '一意経路と直径端点の性質を理解し、少数の距離計算で全頂点を評価する。',
  ],
  'unit-additive-tree-metric-reconstruction': [
    '橙色',
    '距離行列から接続先と辺長を復元し、加法性と全距離の整合を検証する。',
  ],
  'unit-implicit-binary-tree': [
    '水色',
    '二冪・深さ・heap番号の区間を使い、巨大な完全二分木を展開せず数える。',
  ],
  'unit-tree-decomposition': ['水色', '木を区間や祖先関係へ写し、配列上の算法へ接続する入口。'],
  'unit-laminar-interval-containment-tree': [
    '青色',
    '包含条件を確認し、端点の整列とstackで直接の親を構築する。',
  ],
  'unit-tree-euler-flattening': [
    '水色',
    'DFS時刻で部分木が連続区間になることを使い、区間queryへ写す。',
  ],
  'unit-tree-ancestor-lca': [
    '水色',
    '深さ調整とbinary liftingを用い、LCA・祖先・距離のqueryを処理する。',
  ],
  'unit-heavy-light-decomposition': [
    '青色',
    '軽い辺の回数を界し、pathを少数の区間に分解して順序付きqueryを処理する。',
  ],
  'unit-virtual-tree': ['黄色', 'Euler順と隣接LCAで必要な分岐点だけを残し、小さな木上で計算する。'],
  'unit-tree-aggregation': [
    '水色',
    '部分木から親へ渡す要約を定め、根の移動やpath上の合成へ進む入口。',
  ],
  'unit-rooted-tree-aggregation': [
    '水色',
    '子部分木の独立性と親へ渡す状態を定め、bottom-upに合成する。',
  ],
  'unit-rerooting': ['青色', '各辺の両側の情報を設計し、prefix・suffix合成で全根の答えを求める。'],
  'unit-heavy-path-tree-dp': [
    '橙色',
    '多項式の木DPをheavy path上の合成にまとめ、軽い部分木の総費用を評価する。',
  ],
  'unit-tree-balanced-separators': [
    '黄色',
    '重み付きの一点分離と、頂点数を半減させる再帰分解を区別し、分離点を通る寄与を集計する。',
  ],
  'unit-dsu-merge-tree': ['青色', 'DSUの併合履歴を木に保存し、時刻や閾値のqueryを祖先関係へ写す。'],
  'unit-tree-precedence-contraction': [
    '橙色',
    '親先行制約の交換比較量を導き、clusterをheapとDSUで縮約する。',
  ],
  'unit-heavy-light-recursive-dp': [
    '赤色',
    '資源DPを再帰の引数にし、軽い子への重複呼出しまで含めて計算量を証明する。',
  ],
  'unit-static-top-tree': [
    '橙色',
    '境界付きclusterのrake・compressを設計し、更新の影響を木DPの合成で伝播する。',
  ],

  // 文字列
  'unit-chapter-string': [
    '水色',
    'prefix・suffix・一致長・有限状態という文字列の共有単位を学ぶ入口。',
  ],
  'unit-trie-prefix': ['水色', '共有prefixを木にし、通過数・辞書順・文字遷移をnode上で管理する。'],
  'unit-string-prefix-automata': ['水色', '既に調べた一致区間を再利用する考え方へ進む入口。'],
  'unit-z-algorithm': [
    '水色',
    'Z-boxの不変量と再利用範囲を理解し、prefixとの一致長を線形時間で求める。',
  ],
  'unit-string-periodicity': [
    '青色',
    'prefix一致・border・primitive rootを結び付け、周期の必要十分条件を扱う。',
  ],
  'unit-palindrome-radius': [
    '青色',
    '中心の左右対称性と既知区間を再利用し、奇数長・偶数長の回文半径を求める。',
  ],
  'unit-suffix-lcp-index': [
    '青色',
    'suffix arrayとLCPの意味を理解し、ライブラリで得た索引を部分文字列queryへ使う。',
  ],
  'unit-string-automata': ['青色', '未来の受理条件が同じprefixをまとめ、有限状態へ変換する入口。'],
  'unit-finite-pattern-automaton': [
    '青色',
    'suffixや進行状況を状態に選び、全ての文字に対する遷移を構成する。',
  ],
  'unit-aho-corasick': [
    '黄色',
    'Trieのfailure linkで最長suffixを保ち、複数patternの検出情報を伝播する。',
  ],
  'unit-automaton-subset-construction': [
    '黄色',
    'NFAの可能状態集合を一状態へ写し、受理条件と指数的な状態数を評価する。',
  ],
  'unit-suffix-automaton': [
    '橙色',
    'endpos同値類・suffix link・cloneを理解し、全部分文字列を線形状態数で表す。',
  ],
  'unit-recursive-compressed-string': [
    '青色',
    '再帰blockの長さと位置を追い、展開せずに問い合わせや作用の合成を行う。',
  ],
  'unit-run-length-dynamics': [
    '青色',
    'runのsplit・mergeと長さを管理し、一操作と全体のrun数の変化を評価する。',
  ],

  // 数論
  'unit-chapter-number-theory': ['緑色', '素因数・gcd・剰余を整数条件の表現として使い分ける入口。'],
  'unit-prime-divisor': ['緑色', '試し割りや篩を使い、素因数の指数と約数に条件を分解する。'],
  'unit-gcd-structure': ['水色', '差や周期をgcdにまとめ、共通因子と剰余類が保存する条件を示す。'],
  'unit-gcd-diophantine': ['水色', '拡張EuclidとBézoutから一次不定方程式の一解と全解を導く。'],
  'unit-modular-product-foundations': [
    '緑色',
    '法上の四則演算と逆元の存在条件を確認し、積の更新へ進む入口。',
  ],
  'unit-modular-arithmetic': [
    '緑色',
    '二分累乗と逆元を実装し、整数の割り算と法上の除算を区別する。',
  ],
  'unit-dynamic-modular-product': [
    '水色',
    '逆元で除ける因子を確認し、0の個数と非零因子の積を分けて更新する。',
  ],
  'unit-modular-congruence': [
    '青色',
    '一次合同の可解条件を確認し、非互いに素な法も含めてCRTで統合する。',
  ],
  'unit-modular-periodicity': [
    '青色',
    'Fermat・Euler型の指数簡約で必要な互いに素条件と周期を確認する。',
  ],
  'unit-multiplicative-order-periods': [
    '青色',
    '群の位数と要素の位数を区別し、約数を割り落として最小周期を求める。',
  ],
  'unit-baby-step-giant-step': [
    '黄色',
    '可逆性を使って反復回数を二分し、平方根個の状態を照合する。',
  ],
  'unit-cyclic-group-exponent-counting': [
    '黄色',
    '巡回群を指数へ写し、位数・gcd・約数の分類で重複なく数える。',
  ],
  'unit-integer-boundary-blocks': [
    '水色',
    '床関数や整数根が変わる境界を厳密に求め、同じ値の区間をまとめる。',
  ],
  'unit-euclidean-floor-sum': [
    '黄色',
    '床和を格子点数へ写し、傾きと法の交換からEuclid型の再帰を導く。',
  ],
  'unit-rational-approximation': [
    '橙色',
    '連分数や隣接分数の行列式を使い、分母制約下で最良の候補を残す。',
  ],
  'unit-stern-brocot-ancestry': [
    '橙色',
    'mediantの移動をEuclidの商で圧縮し、巨大な経路と祖先集合を扱う。',
  ],
  'unit-numerical-semigroup-reachability': [
    '橙色',
    '非負整数結合が十分先を覆う条件を証明し、有限prefixだけを調べる。',
  ],
  'unit-gaussian-integers-two-squares': [
    '赤色',
    'Gaussian整数の素因数分解と共役を使い、二平方和の構成・計数を行う。',
  ],
  'unit-finite-field-extension': [
    '橙色',
    '既約多項式や基底座標から有限体を構成し、四則演算の実装を正当化する。',
  ],
  'unit-finite-field-frobenius': [
    '橙色',
    '標数による二項係数の消滅を演算子へ適用し、反復と圧縮列の増大を評価する。',
  ],
  'unit-min25-sieve': [
    '赤色',
    '商の異なる値を状態とする篩を構築し、乗法的関数の総和を高速に計算する。',
  ],

  // 組合せ・多項式・線形代数
  'unit-chapter-combinatorics-algebra': [
    '水色',
    '対象を係数・和・積へ翻訳し、数え方と高速な評価を分ける入口。',
  ],
  'unit-combinatorial-coefficients': [
    '水色',
    '通常・Gaussian二項係数、Stirling変換、法上の階乗を使い、rank別計数を基底変換する。',
  ],
  'unit-reflection-principle': [
    '青色',
    '最初に境界を破るpathとの全単射を作り、壁付きの計数を差で表す。',
  ],
  'unit-prufer-code': ['黄色', 'label付き木と列の全単射を理解し、次数を出現回数へ写して数える。'],
  'unit-orbit-counting': [
    '黄色',
    '群作用と固定点を定義し、Burnside・Pólyaによる対称性込みの計数を行う。',
  ],
  'unit-poset-dilworth-antichain': [
    '黄色',
    '半順序のchain・antichainを整理し、matchingやLDSとの対応を使う。',
  ],
  'unit-rsk-young-tableaux': [
    '赤色',
    '挿入対応とYoung図形を理解し、LIS・LDS条件をshapeの計数へ移す。',
  ],
  'unit-deletion-contraction': [
    '黄色',
    '辺の削除と縮約が対象をどう分割するかを示し、graphの計数再帰を立てる。',
  ],
  'unit-inclusion-exclusion': [
    '水色',
    '条件の共通部分を数え、交互符号が重複を打ち消す理由を説明する。',
  ],
  'unit-divisor-mobius-inversion': [
    '青色',
    '約数・倍数の累積値とexact値を区別し、反転でgcd別の個数を取り出す。',
  ],
  'unit-subset-transforms': ['青色', '集合の包含方向に一bitずつ和を集め、zeta変換と逆変換を導く。'],
  'unit-subset-convolution': [
    '橙色',
    '集合サイズ別の変換と反転を組み合わせ、互いに素な分割の畳み込みを求める。',
  ],
  'unit-monoid-exponentiation': [
    '水色',
    '結合則と単位元を定義し、数値以外の反復合成にも二分累乗を使う。',
  ],
  'unit-linear-algebra-xor': ['青色', 'rank・基底・線形写像を制約と変換の共通言語として学ぶ入口。'],
  'unit-linear-system-rank': ['青色', '体上の消去法を実装し、rankから可解性と自由度を判断する。'],
  'unit-xor-linear-basis': [
    '青色',
    'bit列をF₂ベクトルと見なし、pivot消去で独立性・表現可能性を管理し、affine cosetの最小代表を正規化する。',
  ],
  'unit-separable-linear-transform': [
    '黄色',
    '各軸の小変換へ分離し、Walsh–Hadamard変換とXOR畳み込みを導く。',
  ],
  'unit-semiring-matrix-exponentiation': [
    '青色',
    '行列の和と積を遷移の選択・連結に対応させ、min-plusなどへ一般化する。',
  ],
  'unit-generating-functions': [
    '黄色',
    '組合せ構造の和・積を係数列の演算へ写し、求める係数を定める。',
  ],
  'unit-labeled-component-decomposition': [
    '黄色',
    '根を含む成分や成分集合の一意な分解から、指数型母関数やsubset再帰を立てる。',
  ],
  'unit-polynomial-convolution': [
    '黄色',
    '係数積和へ還元し、NTT・FFTの法・長さ・次数の条件を理解して利用する。',
  ],
  'unit-polynomial-taylor-shift': [
    '橙色',
    '二項展開の階乗因子を整理し、全係数の平行移動を一回の畳み込みへ還元する。',
  ],
  'unit-relaxed-convolution': [
    '橙色',
    '未確定の係数を参照しないblock分割で、オンラインの係数再帰を高速化する。',
  ],
  'unit-formal-power-series': [
    '橙色',
    '定数項と打切り次数の条件を押さえ、Newton反復で逆数・log・expを構成する。',
  ],
  'unit-polynomial-multipoint-evaluation': [
    '橙色',
    '一般点の積木・剰余木と等比点のchirp-zを比較し、評価点の構造から変形と計算量を選ぶ。',
  ],
  'unit-bostan-mori': ['橙色', '有理母関数の係数を偶奇で分け、指数を半減する変形を繰り返す。'],
  'unit-fps-composition-power-projection': [
    '赤色',
    'FPS合成と転置の対応を理解し、block分割や有理関数への還元を扱う。',
  ],
  'unit-generating-function-coefficients': [
    '橙色',
    'Lagrange反転・微分による係数比較・Euler積を、式の条件に合わせて選ぶ。',
  ],
  'unit-determinant-counting': [
    '黄色',
    '行列木定理やLGV補題の対応を理解し、組合せ対象を行列式で数える。',
  ],
  'unit-euler-circuit-counting': [
    '橙色',
    '有向全域木と出辺順列への対応を導き、BEST定理の数え方を適用する。',
  ],
  'unit-matroid-theory': ['黄色', '独立性と交換公理を使い、貪欲法の成立範囲を整理する入口。'],
  'unit-matroid-greedy': [
    '黄色',
    '独立性oracleと交換公理から、重み順の選択が最適基底を与えることを示す。',
  ],
  'unit-linear-matroid-intersection': [
    '赤色',
    '二つの線形表現から乱択行列を作り、rankと共通独立集合の大きさを対応させる。',
  ],

  // 幾何・凸最適化
  'unit-chapter-geometry-optimization': [
    '水色',
    '座標と向きによる判定から、凸な境界・関数の最適化へ進む入口。',
  ],
  'unit-geometry-primitives': [
    '水色',
    '外積・端点順・座標変換を用い、退化ケースを含む位置関係を判定する。',
  ],
  'unit-cyclic-order-crossing': [
    '青色',
    '円環を切って端点順を線形化し、交互配置と包含構造で交差を扱う。',
  ],
  'unit-convex-geometry': ['青色', '凸性によって内部の候補を捨て、境界と半平面で領域を表す入口。'],
  'unit-convex-boundary-hull': ['青色', '外積で凸包を構築し、支持方向と境界上の極値を扱う。'],
  'unit-half-plane-constraints': [
    '黄色',
    '平行・非有界・空領域を区別し、向き付き直線で凸領域の共通部分を求める。',
  ],
  'unit-line-envelope': [
    '黄色',
    'DPなどの候補を一次関数へ写し、傾き・交点順やLi Chao Treeで包絡を保つ。',
  ],
  'unit-discrete-convex': [
    '青色',
    '差分の単調性を入口に、凸関数の選択・合成・制約付き最適化を見渡す。',
  ],
  'unit-basic-convex-optimization': [
    '青色',
    '単峰性や差分の単調性を証明し、三分探索・整数境界で最適点を求める。',
  ],
  'unit-two-variable-convex-lattice-optimization': [
    '橙色',
    '折れ目直線の交点から連続最小候補を作り、整数最適点が入る有限近傍を証明する。',
  ],
  'unit-separable-convex-marginals': [
    '青色',
    '単調な限界費用の列を導き、heapや閾値計数で必要個数を選ぶ。',
  ],
  'unit-isotonic-regression': [
    '橙色',
    '順序制約に違反するblockの併合が正しい理由を示し、PAVで最適化する。',
  ],
  'unit-slope-trick': ['黄色', '区分線形凸関数を折れ点で表し、関数への操作をheapの更新へ写す。'],
  'unit-lagrangian-relaxation': [
    '橙色',
    '罰則係数による個数単調性に加え、双対ギャップなく復元できる条件を証明する。',
  ],
  'unit-monge-optimization': [
    '橙色',
    'Monge性から最適位置の単調性を導き、分割統治やSMAWKの条件を確認する。',
  ],
  'unit-fractional-parametric-search': [
    '青色',
    '分母の正性を確認し、比率を加法的な判定へ変換して二分探索する。',
  ],
};

export const unitLearningTarget = (unitId: string) => {
  const target = UNIT_LEARNING_TARGETS[unitId];
  if (target === undefined) throw new Error(`UNIT_LEARNING_TARGET_MISSING:${unitId}`);
  const [color, reason] = target;
  return { color, rating: ATCODER_TARGET_BANDS[color], reason };
};
