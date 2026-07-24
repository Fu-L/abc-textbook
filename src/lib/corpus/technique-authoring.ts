import { TechniqueInventoryItemSchema } from '../domain/schema-parts/catalog.js';

export interface TechniqueAuthoringProblem {
  readonly id: string;
  readonly title: string;
  readonly constraintsSummary: string;
  readonly sourceRevisionIds: readonly string[];
}

export interface TechniqueAuthoringInput {
  readonly problem: TechniqueAuthoringProblem;
  readonly statementText: string;
  readonly editorialText: string;
  readonly authorId?: string;
}

export interface TechniqueAuthoringAnalysis {
  readonly item: ReturnType<typeof TechniqueInventoryItemSchema.parse>;
  readonly signalIds: readonly string[];
  readonly structureId: string;
  readonly complexityEssential: boolean;
  readonly problemComplexityRecorded: boolean;
  readonly classificationMode: 'reviewed_binding' | 'official_term_detection';
}

interface TechniqueSignal {
  readonly id: string;
  readonly pattern: RegExp;
  readonly action: string;
  readonly proof: string;
  readonly prerequisite: string;
  readonly concern: string;
  readonly family: string;
  readonly priority: number;
}

interface StructureSignal {
  readonly id: string;
  readonly pattern: RegExp;
  readonly description: string;
  readonly prerequisite: string;
}

const technique = (
  value: Omit<TechniqueSignal, 'priority'> & { readonly priority?: number },
): TechniqueSignal => ({ ...value, priority: value.priority ?? 0 });

const TECHNIQUE_SIGNALS: readonly TechniqueSignal[] = [
  technique({
    id: 'min-cost-flow',
    pattern: /(?:min(?:imum)?[- ]cost flow|minimum cost flow|最小費用流)/iu,
    action: '残余グラフ上の最小費用流として容量と費用を設計し、必要流量を逐次送る',
    proof:
      '各増加路が残余グラフで最小費用なので、ポテンシャルを保った交換論により総費用の最適性が維持される。',
    prerequisite: '最小費用流と残余グラフ',
    concern: '負辺を含む残余グラフではポテンシャル更新と到達不能頂点を分けて扱う。',
    family: 'flow',
    priority: 40,
  }),
  technique({
    id: 'max-flow-min-cut',
    pattern:
      /(?:max(?:imum)? flow|min(?:imum)? cut|maximum matching|最大流|最小カット|最大マッチング|Dinic)/iu,
    action: '選択条件を容量制約へ写し、最大流・最小カットまたは二部マッチングとして解く',
    proof: '整数容量の増加路とカットの対応を使い、実行可能解と流量が双方向に変換できることを示す。',
    prerequisite: '最大流・最小カット定理',
    concern: '有向辺と逆辺の index を対で保持し、残余容量の更新漏れを防ぐ。',
    family: 'flow',
    priority: 35,
  }),
  technique({
    id: 'centroid-decomposition',
    pattern: /(?:centroid decomposition|重心分解)/iu,
    action: '木を重心で再帰分割し、重心をまたぐ寄与だけを各階層で集計する',
    proof:
      '重心除去後の各連結成分が半分以下になるため、各頂点の寄与は対数個の階層でちょうど一度ずつ処理される。',
    prerequisite: '木の重心と再帰分割',
    concern: '重心を除いた成分ごとの集計を分離し、同一成分内の過剰計上を差し引く。',
    family: 'tree-decomposition',
    priority: 40,
  }),
  technique({
    id: 'heavy-light-decomposition',
    pattern: /(?:heavy[- ]light decomposition|HLD|HL分解|Heavy-Light)/iu,
    action: '木を heavy path に分解し、パス問題を対数本の一次元区間へ写す',
    proof:
      'light edge を通るたび部分木サイズが半減するため、任意の根付き木パスは対数本の区間へ分割できる。',
    prerequisite: 'Heavy-Light Decomposition',
    concern: '頂点値か辺値かに応じて LCA 側端点を含める区間を調整する。',
    family: 'tree-decomposition',
    priority: 38,
  }),
  technique({
    id: 'rerooting-dp',
    pattern: /(?:rerooting|全方位木DP|全方位木 DP|rerooting DP)/iu,
    action:
      '部分木 DP を子方向と親方向に分け、prefix・suffix 合成で全頂点を根とする値へ reroot する',
    proof:
      '各有向辺の部分問題を辺の反対側だけから合成すれば、根を移しても必要な寄与を重複なく再利用できる。',
    prerequisite: '全方位木 DP',
    concern: '単位元と合成順序を明示し、子を除いた値を prefix・suffix から構成する。',
    family: 'tree-dp',
    priority: 38,
  }),
  technique({
    id: 'tree-dp',
    pattern: /(?:tree DP|DP on (?:a )?tree|木DP|木 DP)/iu,
    action: '木を根付き化し、部分木の状態を辺を介して親へ合成する',
    proof:
      '木には閉路がないため、親辺を除く部分木が独立し、帰納法で子の最適値または個数を合成できる。',
    prerequisite: '根付き木と木 DP',
    concern: '再帰深度と親辺の除外を管理し、部分木サイズに応じた配列境界を守る。',
    family: 'tree-dp',
    priority: 25,
  }),
  technique({
    id: 'lca-binary-lifting',
    pattern: /(?:lowest common ancestor|\bLCA\b|最小共通祖先)/iu,
    action: '根付き木の祖先を二冪ごとに前計算し、深さを揃えて最小共通祖先を求める',
    proof: '二進展開した距離だけ祖先へ移動でき、最大の異なる祖先から一段進めば最小共通祖先になる。',
    prerequisite: 'LCA と binary lifting',
    concern: '存在しない祖先の sentinel と根の深さを統一し、log 幅を最大深さから決める。',
    family: 'doubling',
    priority: 36,
  }),
  technique({
    id: 'euler-tour',
    pattern: /(?:Euler tour|Eulerian tour|オイラーツアー|Euler Tour)/iu,
    action: '木の入時刻・出時刻を Euler tour で一次元化し、部分木を連続区間として処理する',
    proof:
      'DFS で頂点へ入ってから出るまでに訪れる頂点はちょうどその部分木なので、時刻区間との対応が成立する。',
    prerequisite: 'Euler tour による木の一次元化',
    concern: '入時刻の半開区間と頂点値・辺値のどちらを記録するかを統一する。',
    family: 'tree-linearization',
    priority: 30,
  }),
  technique({
    id: 'strongly-connected-components',
    pattern: /(?:strongly connected component|strongly-connected|\bSCC\b|強連結成分)/iu,
    action: '強連結成分を縮約し、成分 DAG 上で到達関係や DP を処理する',
    proof: '同一強連結成分内では相互到達可能であり、成分間を縮約すると閉路のない DAG になる。',
    prerequisite: '強連結成分分解',
    concern: '元頂点から成分番号への写像と、重複する成分間辺の扱いを明確にする。',
    family: 'graph-decomposition',
    priority: 34,
  }),
  technique({
    id: 'lowlink-articulation',
    pattern: /(?:LowLink|lowlink|articulation points?|cut vertices|関節点)/u,
    action: 'DFS 木の訪問順と lowlink を計算し、頂点除去で連結成分が分かれる条件を判定する',
    proof:
      '子部分木から祖先へ戻れる最小訪問順を lowlink に保つと、親より上へ戻れない子ごとに頂点除去後の成分が一つ増える。',
    prerequisite: 'DFS 木と lowlink',
    concern: '根だけは DFS 木の子数で判定し、親への木辺と多重辺を区別する。',
    family: 'graph-decomposition',
    priority: 36,
  }),
  technique({
    id: 'topological-dag',
    pattern: /(?:topological sort|topological order|トポロジカルソート|トポロジカル順序|\bDAG\b)/iu,
    action: '依存関係を DAG として表し、トポロジカル順に値を伝播する',
    proof: '全ての辺がトポロジカル順の前から後へ向くため、処理時には必要な先行状態が確定している。',
    prerequisite: 'DAG とトポロジカル順序',
    concern: '入次数更新後に零になった頂点だけを一度 enqueue し、閉路の有無を処理数で検査する。',
    family: 'dag',
    priority: 22,
  }),
  technique({
    id: 'minimum-spanning-tree',
    pattern:
      /(?:minimum spanning tree|\bMST\b|Kruskal|\bPrim(?:'s)?\b|最小全域木|クラスカル|プリム)/iu,
    action: '辺を重み順に調べ、連結成分を併合しながら最小全域木を構成する',
    proof:
      'cut property により異なる成分を結ぶ最小辺は安全であり、閉路を避けた採用を繰り返せば最適な全域木になる。',
    prerequisite: '最小全域木と cut property',
    concern: '同重み辺の順序が答えへ影響する場合は一括判定してから併合する。',
    family: 'spanning-tree',
    priority: 32,
  }),
  technique({
    id: 'dijkstra',
    pattern: /(?:Dijkstra|Dijkstra's|ダイクストラ)/iu,
    action: '非負辺重みの暫定距離を priority queue で管理し、Dijkstra 法で最短距離を確定する',
    proof:
      '未確定頂点の最小暫定距離より短い迂回路は非負辺から作れないため、取り出した距離を確定できる。',
    prerequisite: 'Dijkstra 法と緩和',
    concern: 'priority queue の古い距離を読み飛ばし、距離加算の整数 overflow を避ける。',
    family: 'shortest-path',
    priority: 30,
  }),
  technique({
    id: 'zero-one-bfs',
    pattern: /(?:0[- ]1 BFS|01[- ]?BFS|0-1 BFS)/iu,
    action: '辺重み 0 と 1 を deque の前後へ分けて追加し、距離順を保つ 0-1 BFS を行う',
    proof:
      'deque の先頭距離は非減少で、重み 0 の緩和を前、重み 1 を後へ置くことで Dijkstra と同じ確定順を保つ。',
    prerequisite: '0-1 BFS',
    concern: '改善時だけ deque へ追加し、重み 0 と 1 の挿入方向を逆にしない。',
    family: 'shortest-path',
    priority: 36,
  }),
  technique({
    id: 'bellman-ford',
    pattern: /(?:Bellman[- ]Ford|ベルマン.?フォード)/iu,
    action: '全辺緩和を反復し、負辺を含む最短路と負閉路の影響範囲を判定する',
    proof:
      '辺数 k 以下の最短路は k 回の緩和後に得られ、N 回目の改善は到達可能な負閉路の存在を示す。',
    prerequisite: 'Bellman–Ford 法',
    concern: '未到達 sentinel からの加算を避け、負閉路から到達できる頂点を追加伝播する。',
    family: 'shortest-path',
    priority: 32,
  }),
  technique({
    id: 'floyd-warshall',
    pattern: /(?:Floyd[- ]Warshall|Warshall[- ]Floyd|ワーシャル.?フロイド|Floyd Warshall)/iu,
    action: '中継頂点を順に許可する全点対 DP で最短距離または到達関係を更新する',
    proof: '許可する中継頂点集合について帰納し、最適路が新頂点を使う場合と使わない場合を網羅する。',
    prerequisite: 'Floyd–Warshall 法',
    concern: '到達不能値同士を加算せず、更新順序 k-i-j を崩さない。',
    family: 'shortest-path',
    priority: 32,
  }),
  technique({
    id: 'breadth-first-search',
    pattern: /(?:breadth[- ]first search|\bBFS\b|幅優先探索)/iu,
    action: '状態グラフを距離の層ごとに BFS し、最小遷移回数と到達可能性を求める',
    proof: '単位コスト辺では queue から取り出す距離が非減少なので、初回到達距離が最短距離になる。',
    prerequisite: '幅優先探索',
    concern: '訪問済み判定は enqueue 時に行い、同じ状態の重複追加を防ぐ。',
    family: 'graph-search',
    priority: 18,
  }),
  technique({
    id: 'depth-first-search',
    pattern: /(?:depth[- ]first search|\bDFS\b|深さ優先探索)/iu,
    action: '状態またはグラフを DFS し、連結性・順序・部分問題を再帰的に集約する',
    proof: '各未訪問状態を一度だけ展開することで、到達可能な辺と頂点を漏れなく処理できる。',
    prerequisite: '深さ優先探索',
    concern: '再帰深度上限、親辺、訪問色を区別して無限再帰を防ぐ。',
    family: 'graph-search',
    priority: 12,
  }),
  technique({
    id: 'disjoint-set-union',
    pattern: /(?:Union[- ]?Find|Disjoint Set Union|\bDSU\b|素集合データ構造|素集合系)/iu,
    action: '連結成分を Union-Find で管理し、辺や制約の追加に応じて成分を併合する',
    proof: '代表元が同じことと現在までの追加辺で連結であることを不変条件として保つ。',
    prerequisite: 'Union-Find',
    concern: '経路圧縮と union by size を併用し、成分付随情報は新しい代表元へ集約する。',
    family: 'connectivity',
    priority: 22,
  }),
  technique({
    id: 'binary-lifting',
    pattern: /(?:binary lifting|doubling|ダブリング)/iu,
    action: '遷移先を二冪回ごとに前計算し、回数を二進展開して高速に合成する',
    proof:
      '任意の遷移回数は異なる二冪の和として一意に表せ、前計算した遷移の関数合成で同じ終点へ到達する。',
    prerequisite: 'ダブリングと二進展開',
    concern: '必要な最大 bit 数と遷移不能 sentinel を先に決め、表の参照範囲を揃える。',
    family: 'doubling',
    priority: 28,
  }),
  technique({
    id: 'functional-graph',
    pattern: /(?:functional graph|functional digraph|関数グラフ)/iu,
    action: '各頂点の出次数が一つの関数グラフを、木部分と閉路部分へ分解して処理する',
    proof:
      '遷移を続けると有限頂点上で必ず再訪が起こり、経路は前置き木と一つの閉路へ一意に分かれる。',
    prerequisite: '関数グラフの閉路分解',
    concern: '閉路上の頂点と流入木の頂点を別に印付けし、距離と閉路長を混同しない。',
    family: 'graph-decomposition',
    priority: 26,
  }),
  technique({
    id: 'lazy-segment-tree',
    pattern:
      /(?:lazy segment tree|lazy propagation|遅延セグメント木|遅延評価セグメント木|遅延セグ木)/iu,
    action: '区間作用と区間集約を monoid として設計し、lazy segment tree で更新と取得を両立する',
    proof:
      '作用の合成則と集約演算の準同型性により、遅延値を子へ配る前後で区間の表す値が変わらない。',
    prerequisite: '遅延評価セグメント木',
    concern: '作用合成の順序、単位作用、区間長を使う写像を同じ規約で実装する。',
    family: 'segment-tree',
    priority: 36,
  }),
  technique({
    id: 'segment-tree',
    pattern: /(?:segment tree|セグメント木)/iu,
    action: '必要な区間情報を結合可能な要約へし、segment tree で点更新・区間取得を行う',
    proof:
      '結合演算の単位元と結合則が成り立つため、任意区間を互いに素な節点区間へ分解して同じ要約を得られる。',
    prerequisite: 'セグメント木と monoid',
    concern: '半開区間の規約、結合順序、単位元を固定し、非可換な要約を逆順にしない。',
    family: 'segment-tree',
    priority: 24,
  }),
  technique({
    id: 'fenwick-tree',
    pattern:
      /(?:[Ff]enwick(?: [Tt]ree)?|[Bb]inary [Ii]ndexed [Tt]ree|\bBIT\b|フェニック木|二分木状配列)/u,
    action: '加法可能な量を Fenwick tree に分解し、点更新と prefix 集約を対数時間で処理する',
    proof: '各節点が末尾 bit で決まる区間を保持し、その区間分割が prefix を重複なく被覆する。',
    prerequisite: 'Fenwick tree',
    concern: '内部 index を 1-origin に統一し、差分更新と実値代入を混同しない。',
    family: 'range-query',
    priority: 24,
  }),
  technique({
    id: 'sparse-table',
    pattern: /(?:sparse table|Sparse Table|スパーステーブル)/iu,
    action: '冪長でも冪等な区間要約を二冪長ごとに前計算し、二区間から query を答える',
    proof: '冪等演算では重なる二つの二冪区間を合成しても値が変わらず、任意区間を覆える。',
    prerequisite: 'Sparse Table と冪等演算',
    concern: '区間長の floor log を事前計算し、空区間を問い合わせない。',
    family: 'range-query',
    priority: 25,
  }),
  technique({
    id: 'ordered-set',
    pattern:
      /(?:ordered set|ordered multiset|balanced binary search tree|multiset|平衡二分(?:探索)?木|順序付き集合)/iu,
    action: '順序付き集合で未処理要素の predecessor・successor と挿入削除を管理する',
    proof:
      '全順序の隣接要素だけが次の候補になる条件を示せば、集合 query が必要候補を漏れなく返す。',
    prerequisite: '平衡二分探索木',
    concern: '重複要素を持つ場合は値と一意 index の組にし、存在しない predecessor を分岐する。',
    family: 'ordered-container',
    priority: 18,
  }),
  technique({
    id: 'priority-queue',
    pattern: /(?:priority queue|priority_queue|優先度付きキュー|ヒープ)/iu,
    action: '候補を優先度付き queue に入れ、現在最良の要素だけを順に確定する',
    proof: '未処理候補の最小または最大 key を常に選ぶ greedy-choice property を保つ。',
    prerequisite: 'priority queue',
    concern: '更新前の古い entry を識別して読み飛ばし、tie-break を決定的にする。',
    family: 'ordered-container',
    priority: 10,
  }),
  technique({
    id: 'trie',
    pattern: /(?:binary trie|prefix tree|\btrie\b|Trie|トライ木)/iu,
    action: '文字列または bit 列を Trie に格納し、prefix ごとの候補を共有して探索する',
    proof:
      '根からの辺列と prefix が一対一に対応するため、同じ prefix の候補を一つの部分木として扱える。',
    prerequisite: 'Trie',
    concern: '終端印と重複個数を分け、binary Trie では最上位 bit の位置を固定する。',
    family: 'string-structure',
    priority: 22,
  }),
  technique({
    id: 'convex-hull-trick',
    pattern: /(?:convex hull trick|CHT|Li Chao|Li-Chao|Convex Hull Trick)/iu,
    action:
      'DP 遷移を直線の最小・最大値 query に変形し、Convex Hull Trick または Li Chao tree で処理する',
    proof:
      '各遷移候補を一次関数へ対応させると、求める最適値は query 点での直線群の包絡線に一致する。',
    prerequisite: 'Convex Hull Trick',
    concern: '傾き単調性の有無で構造を選び、積の overflow と等傾き直線を処理する。',
    family: 'dp-optimization',
    priority: 38,
  }),
  technique({
    id: 'bitset-optimization',
    pattern: /(?:dynamic bitset|\bbitset\b|ビットセット)/iu,
    action: '真偽状態を machine word の bit 列へ詰め、集合遷移を bit 演算で並列化する',
    proof: '各 bit が元の一状態に対応し、shift・論理演算が元の遷移を成分ごとに同時実行する。',
    prerequisite: 'bitset による集合演算',
    concern: '末尾 word の不要 bit と shift が word 境界をまたぐ場合を処理する。',
    family: 'state-compression',
    priority: 24,
  }),
  technique({
    id: 'suffix-array',
    pattern: /(?:suffix array|Suffix Array|接尾辞配列)/iu,
    action: '全 suffix を辞書順へ並べ、LCP と区間構造を組み合わせて文字列比較を処理する',
    proof: 'suffix の辞書順と共通接頭辞長が部分文字列比較の最初の不一致位置を一意に決める。',
    prerequisite: 'Suffix Array と LCP',
    concern: 'suffix 長が異なる比較と sentinel の順序を統一する。',
    family: 'string-algorithm',
    priority: 34,
  }),
  technique({
    id: 'z-kmp',
    pattern: /(?:Z[- ]algorithm|Z-function|Knuth|\bKMP\b|Z algorithm|Z アルゴリズム)/iu,
    action:
      'prefix との最長一致長または failure link を線形走査で前計算し、文字列の出現位置を求める',
    proof: '既知の一致区間内では以前の値を再利用し、区間を越える比較だけが全体で線形回数になる。',
    prerequisite: 'Z algorithm または KMP',
    concern: '連結文字列へ置く separator が入力 alphabet と衝突しないようにする。',
    family: 'string-algorithm',
    priority: 32,
  }),
  technique({
    id: 'rolling-hash',
    pattern: /(?:rolling hash|Rolling Hash|ローリングハッシュ)/iu,
    action: '文字列の polynomial hash を prefix 化し、部分文字列の同一性を定数時間で比較する',
    proof:
      'prefix hash の差から位置に依存しない部分文字列 hash を復元でき、等しい文字列は同じ値になる。',
    prerequisite: 'Rolling Hash',
    concern: '衝突確率を抑える複数 modulus または十分広い整数型を選び、負値を正規化する。',
    family: 'string-algorithm',
    priority: 26,
  }),
  technique({
    id: 'formal-power-series',
    pattern: /(?:formal power series|FPS|形式的冪級数|形式冪級数)/iu,
    action: '数え上げの関係を形式的冪級数へ移し、積・逆元・微分積分などの演算として計算する',
    proof: '係数比較により元の再帰・畳み込みと冪級数恒等式が次数ごとに同値であることを示す。',
    prerequisite: '形式的冪級数',
    concern: '必要次数で毎回 truncate し、定数項が逆元や対数の前提を満たすか確認する。',
    family: 'polynomial',
    priority: 40,
  }),
  technique({
    id: 'convolution-ntt',
    pattern:
      /(?:convolution|number theoretic transform|\bNTT\b|\bFFT\b|畳み込み|高速フーリエ変換)/iu,
    action: '組合せの二重和を多項式積へ変換し、convolution で全係数をまとめて求める',
    proof: '積の k 次係数が添字和 k を満たす項の総和なので、元の組合せ和と係数が一致する。',
    prerequisite: '畳み込みと NTT',
    concern: '必要な係数長、padding 長、法が NTT に対応するかを確認する。',
    family: 'polynomial',
    priority: 34,
  }),
  technique({
    id: 'matrix-exponentiation',
    pattern: /(?:matrix exponentiation|matrix power|行列累乗|行列の累乗)/iu,
    action: '線形遷移を行列として表し、binary exponentiation で多数回の遷移を合成する',
    proof:
      '状態ベクトルへの一回遷移が行列積に一致するため、結合則と二進展開で K 回遷移が行列の K 乗になる。',
    prerequisite: '行列累乗',
    concern: '積の添字順序と modulus を統一し、疎行列なら不要な積を省く。',
    family: 'linear-recurrence',
    priority: 30,
  }),
  technique({
    id: 'digit-dp',
    pattern: /(?:digit DP|桁DP|桁 DP)/iu,
    action: '上位桁から tight・leading-zero・必要な集約値を状態に持つ digit DP を行う',
    proof: '同じ prefix 状態以降の選択肢は一致し、tight が上限との大小関係を過不足なく表す。',
    prerequisite: '桁 DP',
    concern: 'leading zero を通常の数字 0 と区別し、上限を含む境界遷移を確認する。',
    family: 'dynamic-programming',
    priority: 38,
  }),
  technique({
    id: 'subset-dp',
    pattern: /(?:bitmask DP|subset DP|bit DP|bit DP|集合DP|bitmask|部分集合 DP)/iu,
    action: '選択済み集合を bitmask で表し、最後の要素または残り条件を加えた subset DP を行う',
    proof:
      '各部分解を選択集合と終端状態で一意に分類し、最後の一手を外す帰納法で遷移の完全性を示す。',
    prerequisite: 'bitmask と subset DP',
    concern: '集合への追加判定、部分集合列挙、状態数 2^N の型と配列長を確認する。',
    family: 'dynamic-programming',
    priority: 34,
  }),
  technique({
    id: 'interval-dp',
    pattern: /(?:interval DP|区間DP|区間 DP)/iu,
    action: '連続区間を状態とし、最後の分割点または端点操作を列挙する interval DP を行う',
    proof:
      '最適解の最後の分割・操作で独立な小区間へ分けると、全候補がちょうど一つの遷移に対応する。',
    prerequisite: '区間 DP',
    concern: '区間長の短い順に計算し、半開区間と閉区間を混在させない。',
    family: 'dynamic-programming',
    priority: 32,
  }),
  technique({
    id: 'probability-expectation-dp',
    pattern:
      /(?:expected value DP|expectation DP|probability DP|expected value|期待値DP|期待値 DP|期待値|確率DP|確率 DP)/iu,
    action: '確率過程の状態を縮約し、全確率または期待値の漸化式を DP として解く',
    proof: '次状態による条件付き分解と全確率・期待値の線形性から、各状態の漸化式が成立する。',
    prerequisite: '条件付き期待値と確率 DP',
    concern: '自己 loop を右辺から移項し、modulus 上の除算では逆元の存在を確認する。',
    family: 'dynamic-programming',
    priority: 34,
  }),
  technique({
    id: 'dynamic-programming',
    pattern: /(?:dynamic programming|\bDP\b|動的計画法)/iu,
    action: '将来に必要な情報だけを状態へ圧縮し、依存順に DP 遷移を評価する',
    proof:
      '同じ状態に到達した履歴は以後の選択肢と評価が一致するため、最適部分構造または加法的な数え上げを利用できる。',
    prerequisite: '動的計画法の状態設計',
    concern: '未到達 sentinel、初期状態、更新前後の配列を区別し、同一段の二重更新を防ぐ。',
    family: 'dynamic-programming',
    priority: 10,
  }),
  technique({
    id: 'binary-search-answer',
    pattern: /(?:binary search on the answer|parametric search|二分探索|binary search)/iu,
    action: '答え候補に単調な判定問題を定義し、二分探索で境界値を求める',
    proof: '判定の真偽が境界の片側で閉じる単調性を示せば、各比較で答えを含む区間を半分に保てる。',
    prerequisite: '二分探索と単調性',
    concern: '整数・実数の境界規約、mid の丸め、半開区間の loop 不変条件を固定する。',
    family: 'search',
    priority: 18,
  }),
  technique({
    id: 'two-pointers',
    pattern: /(?:two pointers|two-pointer|sliding window|尺取り法|スライディングウィンドウ)/iu,
    action: '左右端点を単調に進め、条件を満たす最大または最小区間を two pointers で走査する',
    proof:
      '右端を固定した有効左端集合が単調に移動するため、戻らない二本の pointer で全境界を一度ずつ調べられる。',
    prerequisite: '尺取り法',
    concern: '空区間、条件を満たす直前・直後のどちらを数えるかを loop 不変条件にする。',
    family: 'search',
    priority: 22,
  }),
  technique({
    id: 'meet-in-the-middle',
    pattern: /(?:meet[- ]in[- ]the[- ]middle|meet in the middle|半分全列挙)/iu,
    action: '選択を二群に分けて各側を全列挙し、和・順序・hash lookup で組を結合する',
    proof:
      '任意の全体選択は左右の部分選択の組へ一意に分かれるため、両側の列挙と結合で全候補を覆う。',
    prerequisite: '半分全列挙',
    concern: '左右の列挙値を sort・deduplicate する条件と、補数の境界を確認する。',
    family: 'enumeration',
    priority: 30,
  }),
  technique({
    id: 'coordinate-compression',
    pattern: /(?:coordinate compression|座標圧縮)/iu,
    action: '比較に必要な順序だけを保って値を座標圧縮し、密な index 上の構造へ写す',
    proof: '大小・等値関係を保つ順位写像なので、元座標での順序条件と圧縮後の条件が同値になる。',
    prerequisite: '座標圧縮',
    concern: '区間端点の隣接関係が必要なら隙間用座標も追加し、lower_bound の重複を除く。',
    family: 'normalization',
    priority: 15,
  }),
  technique({
    id: 'sweep-line',
    pattern: /(?:sweep line|plane sweep|走査線|sweep-line)/iu,
    action: 'event を一軸で sort し、active な対象だけをデータ構造で保つ sweep line を行う',
    proof:
      '各 event 間では active 集合が変化せず、端点 event の順に更新すれば全区間の寄与を漏れなく積算できる。',
    prerequisite: 'sweep line と event sort',
    concern: '同一座標の開始・終了・query event の処理順序を境界の包含規約から決める。',
    family: 'geometry-sweep',
    priority: 23,
  }),
  technique({
    id: 'prefix-sum-difference',
    pattern:
      /(?:prefix sum|cumulative sum|difference array|prefix sums|累積和|差分配列|imos法|いもす法)/iu,
    action: '局所量を差分または prefix sum へ変換し、区間寄与をまとめて加算・復元する',
    proof:
      'prefix の差が元区間の総和になり、差分への端点加算を累積すると各位置の寄与がちょうど復元される。',
    prerequisite: '累積和と差分',
    concern: '半開区間の右端、prefix 配列の先頭 0、modulus の負値補正を統一する。',
    family: 'aggregation',
    priority: 12,
  }),
  technique({
    id: 'primitive-root-order',
    pattern: /(?:primitive root|multiplicative order|原始根|乗法的位数)/iu,
    action: '乗法群を原始根の指数または乗法的位数へ移し、合同条件を約数問題として数える',
    proof: '巡回群の元と指数剰余類が一対一に対応し、元の積・冪条件が指数の合同式へ変換される。',
    prerequisite: '有限体の乗法群と原始根',
    concern: '群に入らない 0 と非互いに素な値を先に分離し、位数が群位数の約数か確認する。',
    family: 'number-theory',
    priority: 38,
  }),
  technique({
    id: 'chinese-remainder-theorem',
    pattern: /(?:Chinese remainder theorem|\bCRT\b|中国剰余定理)/iu,
    action: '複数の合同条件を gcd で整合性検査し、中国剰余定理で一つの剰余類へ併合する',
    proof:
      '差が gcd で割り切れることが解存在の必要十分条件で、拡張 Euclid により併合解を構成できる。',
    prerequisite: '中国剰余定理',
    concern: 'lcm 計算の overflow と負の剰余を正規化し、非互いに素な法も扱う。',
    family: 'number-theory',
    priority: 34,
  }),
  technique({
    id: 'mobius-inversion',
    pattern: /(?:Möbius|Moebius|mobius inversion|メビウス反転|メビウス関数)/iu,
    action: '倍数・約数上の累積関係を Möbius inversion で反転し、exact な個数を復元する',
    proof:
      '約数 lattice 上で Möbius 関数の和が恒等元以外で 0 になるため、zeta 変換との逆変換になる。',
    prerequisite: 'Möbius inversion',
    concern: '約数向きと倍数向きのどちらを反転するか、添字 1 の初期値を確認する。',
    family: 'number-theory',
    priority: 36,
  }),
  technique({
    id: 'inclusion-exclusion',
    pattern: /(?:inclusion[- ]exclusion|包除原理)/iu,
    action:
      '満たしてはいけない条件集合を列挙し、交差部分の符号付き和を inclusion–exclusion で数える',
    proof: 'ある対象が k 個の条件に該当するとき寄与の二項係数交代和が 1 または 0 になる。',
    prerequisite: '包除原理',
    concern: '空集合の項と符号を揃え、部分集合列挙の計算量を制約と照合する。',
    family: 'combinatorics',
    priority: 27,
  }),
  technique({
    id: 'prime-factorization-sieve',
    pattern:
      /(?:prime factorization|sieve of Eratosthenes|linear sieve|素因数分解|エラトステネスの篩|素数篩)/iu,
    action: '整数を素因数または最小素因数へ分解し、約数ごとの独立な条件として処理する',
    proof:
      '算術の基本定理により正整数の素因数指数表現は一意で、積・割り切れ条件を指数ごとに判定できる。',
    prerequisite: '素因数分解と約数列挙',
    concern: '試し割り後に残る 1 より大きい素因数と、p² の overflow を処理する。',
    family: 'number-theory',
    priority: 22,
  }),
  technique({
    id: 'gcd-extended-euclid',
    pattern:
      /(?:greatest common divisor|extended Euclid|Euclidean algorithm|\bgcd\b|最大公約数|拡張ユークリッド|ユークリッドの互除法)/iu,
    action: 'gcd で可解性を分離し、必要なら拡張 Euclid により一次合同式の係数を構成する',
    proof:
      '整数線形結合で表せる値の集合が gcd の倍数全体なので、割り切れ条件が可解性の必要十分条件になる。',
    prerequisite: 'gcd と拡張 Euclid',
    concern: '0 を含む gcd、負係数、lcm を積から計算するときの overflow を扱う。',
    family: 'number-theory',
    priority: 18,
  }),
  technique({
    id: 'modular-arithmetic',
    pattern:
      /(?:modular inverse|modular exponentiation|modulo|modulus|mod |剰余|modint|逆元|繰り返し二乗法)/iu,
    action: '式を modulus 上で整理し、逆元・高速冪・組合せ前計算を使って値を計算する',
    proof: '加減乗算と可逆元による除算が同じ剰余類を保つことを式変形ごとに確認する。',
    prerequisite: '剰余演算と modular inverse',
    concern: '減算後の負値、積の整数幅、逆元を取る値と modulus の互いに素性を確認する。',
    family: 'number-theory',
    priority: 8,
  }),
  technique({
    id: 'combinatorics-binomial',
    pattern: /(?:binomial coefficient|combinations|permutations|factorial|二項係数|組合せ|階乗)/iu,
    action: '選択順序を組合せ係数へ分離し、階乗・逆階乗または漸化式で数え上げる',
    proof: '対象を互いに素な選択手順へ分割し、各手順数の積と選択位置の二項係数が一対一に対応する。',
    prerequisite: '組合せ数と二項係数',
    concern: '階乗前計算の上限、modulus より大きい添字、重複要素の除算条件を確認する。',
    family: 'combinatorics',
    priority: 14,
  }),
  technique({
    id: 'gaussian-elimination',
    pattern: /(?:Gaussian elimination|Gauss-Jordan|ガウス消去|掃き出し法)/iu,
    action: '制約を線形方程式系へ写し、Gaussian elimination で rank・解・自由度を求める',
    proof: '基本行変形は解集合を変えず、階段形の pivot と自由変数が解空間を完全に記述する。',
    prerequisite: 'Gaussian elimination',
    concern: '浮動小数なら pivoting と誤差、有限体なら非零 pivot の逆元を扱う。',
    family: 'linear-algebra',
    priority: 30,
  }),
  technique({
    id: 'grundy-game',
    pattern: /(?:Grundy|Sprague|Nim sum|nim-sum|grundy|グランディ数|ニム和)/iu,
    action: '各部分ゲームの Grundy 数を mex で求め、xor 和から勝敗または手を判定する',
    proof:
      'Sprague–Grundy 定理により impartial game は同じ Grundy 数の Nim heap と等価で、直和は xor になる。',
    prerequisite: 'Sprague–Grundy theorem',
    concern: '到達 Grundy 値の重複を除いて mex を取り、終端状態を 0 とする。',
    family: 'game-theory',
    priority: 34,
  }),
  technique({
    id: 'computational-geometry',
    pattern: /(?:cross product|convex hull|orientation|ccw|外積|凸包|幾何)/iu,
    action: '座標条件を外積・内積・向き判定へ変換し、交差や凸性を整数演算で判定する',
    proof:
      '外積の符号が有向面積と回転方向を表すため、幾何条件を符号条件として必要十分に判定できる。',
    prerequisite: '計算幾何の外積・内積',
    concern: '座標積の overflow、collinear な境界点、開区間と閉区間の交差を区別する。',
    family: 'geometry',
    priority: 20,
  }),
  technique({
    id: 'complete-enumeration',
    pattern: /(?:全探索|全列挙|brute force|complete search|enumerate all|全.{0,30}通り)/iu,
    action: '制約で小さく抑えられた候補集合を全列挙し、必要十分条件を各候補へ直接検査する',
    proof:
      '任意の実行可能解が列挙した候補のちょうど一つに対応し、判定条件が必要十分であることを示す。',
    prerequisite: '全探索と候補数の上界評価',
    concern: '同一対象の異なる表現を正規化し、重複計上と境界候補の欠落を防ぐ。',
    family: 'enumeration',
    priority: 16,
  }),
  technique({
    id: 'lattice-translation-classes',
    pattern: /(?:平行移動|translation vector|translated|格子点.*移動)/iu,
    action: '反復移動を一周期の変位ベクトルによる平行移動同値類へ分け、各類の訪問区間の和を数える',
    proof:
      '一周期後の位置は常に同じ変位だけ移るため、変位方向に直交する不変量ごとに訪問点が一次元区間へ対応する。',
    prerequisite: '格子点と gcd による方向ベクトル正規化',
    concern: '総変位が零の場合を分離し、負方向を含む同値類 key と区間端点を正規化する。',
    family: 'lattice-counting',
    priority: 30,
  }),
  technique({
    id: 'degree-sqrt-decomposition',
    pattern:
      /(?:次数が.{0,30}(?:以上|未満)|degree.{0,30}threshold|heavy vertices|light vertices|平方分割)/iu,
    action:
      '頂点を次数の閾値で heavy と light に分け、低次数更新は隣接先へ即時反映し高次数更新は時刻を遅延保持する',
    proof: 'light 頂点の走査長は閾値未満で、heavy 頂点数は次数和を閾値で割った個数以下になる。',
    prerequisite: '次数による平方分割',
    concern: '各値の更新時刻を比較し、heavy 隣接表から最も新しい遅延更新だけを反映する。',
    family: 'sqrt-decomposition',
    priority: 34,
  }),
  technique({
    id: 'floor-quotient-blocks',
    pattern: /(?:floor sum|商が同じ|床関数|floor\s*\()/iu,
    action:
      'floor 除算の商が変わらない添字区間をまとめ、小さい添字側と小さい商側を平方根境界で分割する',
    proof:
      'floor(N/i) の異なる値は平方根より小さい商と平方根以下の添字から全て得られ、各区間端は除算で計算できる。',
    prerequisite: 'floor 除算の商区間列挙',
    concern: '次の区間右端を N/quotient から求め、整数除算の切り捨てと loop の進行を保証する。',
    family: 'number-theory',
    priority: 36,
  }),
  technique({
    id: 'memoized-recursion',
    pattern: /(?:メモ化|memoization|memoized recursion|memoized)/iu,
    action: '丸めた二候補だけへ分岐する再帰を定義し、同じ部分問題を memoize して再利用する',
    proof:
      '最小単位の端数は切り捨て側か切り上げ側のどちらかで清算すればよく、他の選択はそれらより改善しない。',
    prerequisite: 'メモ化再帰と最適部分構造',
    concern: '再帰 key の単位を揃え、切り上げ側で一段上へ carry する境界を処理する。',
    family: 'dynamic-programming',
    priority: 32,
  }),
  technique({
    id: 'recursive-construction',
    pattern: /(?:再帰的に.{0,50}(?:構成|解く|帰着)|recursively construct|recursive construction)/iu,
    action: '小さい instance の構成を基底として、端の帯または部分構造を追加する再帰的構成を行う',
    proof:
      '追加部分が既存構成と衝突せず、始点・終点・被覆条件を保つことをサイズに関する帰納法で示す。',
    prerequisite: '再帰的構成と帰納法',
    concern: '最小幅の基底ケース、行列の転置、再帰で変換した終点座標を個別に確認する。',
    family: 'constructive',
    priority: 28,
  }),
  technique({
    id: 'decimal-carry-scan',
    pattern: /(?:筆算|繰り上がり|桁和|decimal carry|big integer)/iu,
    action:
      '巨大整数を文字列の各桁として扱い、prefix 桁和と carry を下位桁から一回走査して答えの桁を確定する',
    proof:
      '各出力桁へ寄与する入力 prefix が桁和に一致し、十進 carry を次桁へ渡せば筆算と同じ総和になる。',
    prerequisite: '多倍長整数の桁処理',
    concern: '入力桁を全て処理した後も carry が零になるまで出力し、結果を逆順に戻す。',
    family: 'digit-processing',
    priority: 30,
  }),
  technique({
    id: 'spatial-bucketing',
    pattern: /(?:bucket|バケット|格子.*分割|cell.*size|近傍.*マス)/iu,
    action: '座標平面を距離閾値幅の bucket に分け、同一または隣接 bucket の点対だけを列挙する',
    proof:
      '距離条件を満たす二点の bucket 座標差は定数範囲に限られるため、遠い bucket を調べる必要がない。',
    prerequisite: '空間 bucket と距離比較',
    concern: '負座標の floor 除算、境界上の点、同一点対を一度だけ出力する順序を統一する。',
    family: 'geometry-sweep',
    priority: 30,
  }),
  technique({
    id: 'bounded-top-k-merge',
    pattern: /(?:K-th|k-th|上位.{0,30}個|大きい方から.{0,30}個|top.{0,30}values)/iu,
    action:
      '各部分木が必要な上位 K 個だけを保持し、子の候補を merge・降順 truncate して query に答える',
    proof:
      '親部分木の上位 K 個に入らない子内要素は、同じ子だけで K 個以上に負けるため親でも候補にならない。',
    prerequisite: 'small-to-large merge と上位 K 個の保持',
    concern: 'K の全体上限だけ保持し、query の 1-origin 順位と vector index を変換する。',
    family: 'tree-merge',
    priority: 30,
  }),
  technique({
    id: 'piecewise-quadratic-optimization',
    pattern: /(?:二次関数|quadratic function|傾きが.{0,30}変|最大値.{0,30}端点)/iu,
    action: '等差変化する区間内の累積値を二次式で表し、端点と頂点近傍だけを評価して最大値を求める',
    proof:
      '各 run 内の目的関数は離散二次関数なので、差分の符号が変わる点と区間端以外に最大候補はない。',
    prerequisite: '等差数列の和と離散凸・凹関数',
    concern: '頂点の floor・ceil 両方を区間へ clamp し、積と累積和を十分広い整数型で持つ。',
    family: 'optimization',
    priority: 32,
  }),
  technique({
    id: 'mo-algorithm',
    pattern: /(?:Mo['’]s algorithm|Mo’s algorithm|Mo algorithm|クエリ平方分割)/iu,
    action: 'offline 区間 query を Mo 順に並べ、左右端を一要素ずつ伸縮しながら集約値を更新する',
    proof:
      'add・remove が現在区間の集約を正しく保ち、block 順で端点総移動回数が平方根上界に収まる。',
    prerequisite: 'Mo’s algorithm',
    concern:
      '右端を block ごとに交互順へ sort し、add と remove の更新前後の個数条件を逆にしない。',
    family: 'offline-query',
    priority: 38,
  }),
  technique({
    id: 'reverse-topological-pruning',
    pattern:
      /(?:出次数.{0,30}(?:0|ない)|入次数.{0,30}(?:0|ない)|sink.{0,30}remove|数字が書き込まれている頂点)/iu,
    action: '有限歩で必ず停止する頂点を sink から逆向きに削除し、最後まで残る閉路到達頂点を数える',
    proof:
      '削除頂点からは rank が真に減るので無限歩できず、残存頂点は残存辺を選び続けて有限グラフ上の閉路へ到達する。',
    prerequisite: '逆向き topological pruning',
    concern: '逆辺を保持し、出次数が零になった瞬間だけ queue へ追加する。',
    family: 'graph-decomposition',
    priority: 32,
  }),
  technique({
    id: 'sequence-reversal-composition',
    pattern: /(?:逆順に並べ替|reverse.*subarray|reversal|末尾の要素を取り出し)/iu,
    action:
      '大量の swap の辞書順区間を完全な行と端の部分行へ分け、完全行を少数回の列反転として合成する',
    proof:
      '一行分の swap 列が suffix の cyclic shift に等しく、連続する完全行の合成が二回の反転と一致する。',
    prerequisite: '配列反転と操作列の合成',
    concern: 'L・R を行内 offset へ変換し、完全行の前後に残る O(N) 個の swap だけを直接実行する。',
    family: 'constructive',
    priority: 30,
  }),
  technique({
    id: 'frequency-candidate-counting',
    pattern: /(?:出現回数|frequency|連想配列|同じ値.{0,30}個数|値ごとに.{0,30}個数)/iu,
    action: '各制約が要求する基準変数の候補値を導出し、frequency map で最頻候補を数える',
    proof:
      '基準変数を一つ固定すると列全体が一意に決まり、各成功条件はその変数の一候補値と同値になる。',
    prerequisite: '式変形と frequency map',
    concern: '添字 parity による符号反転と負数 key をそのまま正確に保持する。',
    family: 'counting',
    priority: 28,
  }),
  technique({
    id: 'tree-traversal-reconstruction',
    pattern: /(?:pre-?order|in-?order|行きがけ順|通りがけ順)/iu,
    action: 'preorder の先頭を根とし、inorder の根位置で左右区間を分割して二分木を再帰復元する',
    proof:
      '根と左右部分木の要素集合・長さが二つの traversal から一意に定まり、各部分区間へ同じ議論を適用できる。',
    prerequisite: '二分木の preorder と inorder',
    concern: '値から inorder 位置への逆配列を使い、不整合区間や根が 1 でない入力を拒否する。',
    family: 'tree-decomposition',
    priority: 36,
  }),
  technique({
    id: 'pair-witness-pigeonhole',
    pattern: /(?:鳩ノ巣原理|pigeonhole|4-cycle|4 cycle|頂点対)/iu,
    action:
      '小さい側の頂点対ごとに最初の共通隣接点を記録し、二個目を見つけた時点で 4-cycle を復元する',
    proof: '4-cycle は小さい側の二頂点と、それらを共有する異なる二隣接点の組に必要十分に対応する。',
    prerequisite: '鳩ノ巣原理と二部グラフの 4-cycle',
    concern: '同一頂点対を unordered に正規化し、最初の witness と現在頂点が異なることを確認する。',
    family: 'graph-search',
    priority: 34,
  }),
  technique({
    id: 'two-sat-implication-graph',
    pattern: /(?:2[- ]SAT|2-SAT|implication graph|含意グラフ)/iu,
    action: '整数条件を threshold ごとの真偽変数へ分解し、各制約を 2-SAT の含意辺として表す',
    proof:
      '各二項制約と二つの含意辺が論理的に同値で、変数と否定が同じ強連結成分にないことが充足可能性の必要十分条件になる。',
    prerequisite: '2-SAT と implication graph',
    concern:
      '変数と否定の vertex index、threshold の単調含意、常真・常偽 literal を一貫して符号化する。',
    family: 'satisfiability',
    priority: 40,
  }),
  technique({
    id: 'prefix-suffix-permutation-effect',
    pattern: /(?:操作列がほとんど同じ|prefix permutation|suffix permutation|操作を飛ばした)/iu,
    action:
      '全 swap 適用後の逆位置と各時点までの prefix 状態を持ち、一操作を除いた影響を二要素の交換として復元する',
    proof:
      '除いた swap より後の操作は二つの label の役割だけを交換するため、完全適用結果の逆写像から答え位置を得られる。',
    prerequisite: '順列の合成と逆写像',
    concern: '値から位置への逆配列と、除外操作直前の二要素を区別して更新する。',
    family: 'permutation',
    priority: 34,
  }),
  technique({
    id: 'euler-trail-parity',
    pattern: /(?:Euler trail|Euler path|オイラー路|オイラーグラフ|準オイラーグラフ)/iu,
    action:
      '自由移動できる連結成分を縮約し、必須辺だけの multigraph で Euler trail の次数条件を判定する',
    proof:
      '元の歩道から必須辺だけを射影すると Euler trail になり、逆に成分内の自由経路で trail の隣接必須辺を接続できる。',
    prerequisite: 'Euler trail の存在条件',
    concern: '自己 loop と多重辺を許した次数 parity を数え、縮約成分の連結性を保つ。',
    family: 'graph-decomposition',
    priority: 38,
  }),
  technique({
    id: 'sorted-neighbor-lcp',
    pattern: /(?:longest common prefix|\bLCP\b|共通接頭辞|辞書順.*隣)/iu,
    action: '文字列を辞書順に sort し、各文字列と直前・直後の文字列との LCP の最大値だけを調べる',
    proof:
      'ある文字列と prefix を共有する文字列群は辞書順で連続するため、最長一致する相手は隣接位置にも存在する。',
    prerequisite: '辞書順と longest common prefix',
    concern: '元 index を文字列と一緒に保持し、先頭・末尾では存在する片側だけを比較する。',
    family: 'string-algorithm',
    priority: 34,
  }),
  technique({
    id: 'reflection-parity-construction',
    pattern: /(?:対称な位置|reflection|反射|parity.*reflection)/iu,
    action:
      '反射を二回組み合わせた ±2 平行移動を基本操作とし、座標 parity と退化区間を判定して操作列を構成する',
    proof: '一回の反射は座標 parity を保ち、異なる二中心での連続反射が差の二倍の平行移動になる。',
    prerequisite: '一次元反射の合成と parity',
    concern: '区間幅が零の軸、奇数回が必要な初手、二座標の操作回数 parity を揃える。',
    family: 'constructive',
    priority: 36,
  }),
  technique({
    id: 'frontier-connectivity-dp',
    pattern: /(?:各列の一番下|frontier DP|plug DP|連結成分.*状態|輪郭線 DP)/iu,
    action:
      '幅の小さい grid を走査し、frontier の塗色と連結成分 partition を正規化した profile DP を行う',
    proof:
      '未処理領域と接し得るのは frontier 上の頂点だけなので、その連結 partition が将来に必要な情報を全て含む。',
    prerequisite: 'profile DP と連結成分状態の正規化',
    concern:
      'frontier から消える成分を再接続不能として判定し、成分 label を毎遷移後に canonicalize する。',
    family: 'dynamic-programming',
    priority: 40,
  }),
  technique({
    id: 'run-length-recurrence',
    pattern: /(?:Run Length Encoding|run-length encoding|連長圧縮|ランレングス)/iu,
    action: '列を run-length encoding し、末尾 run から逆向きに長さと操作回数の漸化式を更新する',
    proof:
      '有効入力では非 1 の run が隣接せず、操作による増減は直後の run 長だけで決まるため圧縮状態で再現できる。',
    prerequisite: 'Run-Length Encoding と逆向き漸化式',
    concern: '不可能となる隣接条件を先に検査し、各加算を modulus 上で正規化する。',
    family: 'sequence-compression',
    priority: 34,
  }),
  technique({
    id: 'regular-bipartite-factorization',
    pattern: /(?:regular bipartite|regular.*二部|二部グラフ.*正則|perfect matching.*repeat)/iu,
    action:
      '各値の出現を正則二部 multigraph の辺とみなし、完全マッチングを反復抽出して辺彩色を構成する',
    proof:
      '正則二部グラフは Hall 条件を満たして完全マッチングを持ち、それを除くたび正則次数が一つ下がるため全辺を分解できる。',
    prerequisite: '二部マッチングと Hall の定理',
    concern: '多重辺を別々の edge id で保持し、採用した完全マッチングの辺だけを各反復で除く。',
    family: 'matching-factorization',
    priority: 44,
  }),
  technique({
    id: 'sandwich-triple-counting',
    pattern: /(?:sandwich|両端.*同じ|left.*right.*frequency|prefix.*suffix.*count)/iu,
    action:
      '中央位置を左から走査し、左右の値別 frequency から同値な両端の組数を加え、中央と同値な組を除く',
    proof:
      '各 i<j<k は中央 j を一意に持ち、j の左右で同じ値を一つずつ選ぶ積が全候補を重複なく数える。',
    prerequisite: 'prefix・suffix frequency と積の法則',
    concern: '中央要素を右側 frequency から先に除き、同値三要素を除外する更新順序を固定する。',
    family: 'triple-counting',
    priority: 42,
  }),
  technique({
    id: 'critical-distance-interval-enumeration',
    pattern: /(?:critical point|critical value|距離.*大小関係|x_i.*plusmn|区間ごと.*距離)/iu,
    action:
      '距離の適否が変化する臨界座標 X_i±L_j を列挙し、隣接臨界点間の代表値で sorted distance 条件を判定する',
    proof:
      '各 |X_i-k| と L_j の比較結果は臨界座標をまたぐまで変わらないため、各整数区間の一点を調べれば区間全体の可否が決まる。',
    prerequisite: '絶対値の区分線形性と臨界点列挙',
    concern: '臨界点自身と開区間内の整数を分け、距離列と長さ列を同じ順序で sort して比較する。',
    family: 'critical-point-enumeration',
    priority: 42,
  }),
  technique({
    id: 'periodic-residue-precomputation',
    pattern: /(?:least common multiple|lcm|最小公倍数|periodic|周期)/iu,
    action: '各待ち時間の法をまとめた最小公倍数 L に対し、出発時刻の剰余ごとの所要時間を前計算する',
    proof:
      '全ての待ち条件が時刻 modulo L だけで決まり、L の倍数だけずらした行程の到着時刻も同じだけ平行移動する。',
    prerequisite: '合同式と最小公倍数による周期化',
    concern: '固定の始端・終端時間を行程内へ入れる位置と、負でない modulo の定義を統一する。',
    family: 'periodic-precomputation',
    priority: 44,
  }),
  technique({
    id: 'matrix-tree-characteristic-polynomial',
    pattern:
      /(?:Matrix[- ]Tree|matrix tree|Kirchhoff|characteristic polynomial|行列木|特性多項式)/iu,
    action:
      '条件付き辺へ形式変数を付けた Laplacian minor の行列式を作り、係数として条件別の全域木数を取り出す',
    proof:
      'Matrix-Tree 定理で各全域木の辺重み積が行列式へ一度現れ、形式変数の次数が選んだ対象辺数に一致する。',
    prerequisite: 'Matrix-Tree 定理と行列式多項式',
    concern: '有限体上で評価・補間する場合は相異なる評価点を選び、特異な shift と符号を処理する。',
    family: 'algebraic-counting',
    priority: 48,
  }),
  technique({
    id: 'subsequence-prefix-suffix-pairing',
    pattern: /(?:subsequence.*prefix.*suffix|部分列.*prefix|前から.*後ろから.*部分列)/iu,
    action:
      '各文字列が目標文字列の prefix と suffix を何文字 subsequence として取れるか求め、補完可能な組を整列して数える',
    proof:
      '連結後に目標を subsequence として含むことは、前半が取れる prefix 長と後半が取れる suffix 長の和が目標長以上であることと同値になる。',
    prerequisite: 'subsequence の貪欲照合と二分探索',
    concern: '空 prefix・空 suffix を許し、同じ文字列を両側に選べる ordered pair として数える。',
    family: 'subsequence-pairing',
    priority: 42,
  }),
  technique({
    id: 'small-to-large-set-merge',
    pattern: /(?:small[- ]to[- ]large|merge smaller|小さい.*大きい.*集合|set.*swap)/iu,
    action: '各箱の色集合を保持し、小さい集合を大きい集合へ併合する small-to-large merge を行う',
    proof:
      '要素が移されるたび所属集合サイズが少なくとも倍になるので、各要素の移動回数は高々対数回になる。',
    prerequisite: 'small-to-large merge',
    concern: '集合本体を swap してから小さい側を走査し、移動元を空にする問題仕様を保つ。',
    family: 'set-merging',
    priority: 42,
  }),
  technique({
    id: 'dynamic-mex-maintenance',
    pattern: /(?:mex|minimum excluded|最小除外)/iu,
    action: '値 0..N の出現数と、現在欠けている値の ordered set を更新し、その最小値を mex とする',
    proof:
      '長さ N の列の mex は N 以下であり、出現数が零の値だけを集合へ保てば集合最小が定義通りの最小非出現値になる。',
    prerequisite: 'mex と ordered set',
    concern: '置換前後が同値な場合と範囲外の値を分け、出現数が 0↔1 になる瞬間だけ集合を更新する。',
    family: 'mex-query',
    priority: 44,
  }),
  technique({
    id: 'binary-information-encoding',
    pattern: /(?:binary representation|binary code|二進数|bit.*encode|情報量)/iu,
    action:
      '対象番号を二進 codeword に割り当て、各 bit が 1 の対象集合を一回の検査へまとめて結果から番号を復号する',
    proof:
      'ceil(log2 N) bit の codeword は N 個の対象を一意に区別し、各検査結果が対応 bit をそのまま与える。',
    prerequisite: '二進表現と情報量の下界',
    concern: '番号の 0-origin・1-origin を変換し、空の検査集合と対話出力の flush を扱う。',
    family: 'information-encoding',
    priority: 44,
  }),
  technique({
    id: 'circular-capped-window-counting',
    pattern: /(?:circular|円環|cycle.*two pointers|二周|色.*上限)/iu,
    action:
      '列を二周分へ延長し、色ごとの個数を保つ two pointers で上限 K まで寄与する巡回 window を更新する',
    proof:
      '右端を伸ばしたときの新規寄与はその色の保有数が K 未満の場合だけ増え、左端ごとの最大 window を単調に進められる。',
    prerequisite: '円環列の二周化と two pointers',
    concern: 'window 長を元の列長以下に制限し、色数上限と箱単位の切り上げを別々に更新する。',
    family: 'circular-window',
    priority: 42,
  }),
  technique({
    id: 'expression-segment-composition',
    pattern: /(?:evaluate.*expression|式.*評価|plus.*multiply|addition.*multiplication|monoid)/iu,
    action:
      '加算と乗算の優先順位を保つ部分式状態を定義し、区間の連結を結合則のある遷移として DP 合成する',
    proof:
      '各区間を確定済みの加算項と未確定の乗算項へ分ければ、境界演算子ごとの合成が元の式評価を保存する。',
    prerequisite: '式評価 DP と monoid 合成',
    concern: '加算境界で未確定項を確定し、乗算境界では係数だけを更新する状態の意味を固定する。',
    family: 'expression-dp',
    priority: 42,
  }),
  technique({
    id: 'modular-product-fingerprinting',
    pattern: /(?:product equality|積.*等しい|modular hash|random prime|複数.*mod)/iu,
    action:
      '巨大整数を複数の法で fingerprint 化し、値と積の fingerprint の frequency を照合して三つ組を数える',
    proof:
      '真に等しい積は全ての法で同じ剰余になり、十分大きい法または複数法では異なる値の衝突確率を制御できる。',
    prerequisite: 'modular fingerprint と frequency map',
    concern:
      '積を取る前に広い整数型へ上げ、衝突を許す確率的解法か exact な多倍長比較かを明記する。',
    family: 'randomized-fingerprinting',
    priority: 44,
  }),
  technique({
    id: 'range-distribution-data-structure',
    pattern: /(?:quotient.*remainder.*range|商.*余り.*区間|range add.*point|区間加算.*一点)/iu,
    action:
      '一山の個数を商と余りに分け、全周への一様加算と余り個分の循環区間加算を lazy data structure で処理する',
    proof:
      '各位置へ floor(x/N) 個を配った残り x mod N 個が操作位置の直後から連続して一個ずつ配られる。',
    prerequisite: 'range add・point query と商余り分解',
    concern: '循環区間を高々二区間へ分割し、取り出す位置を零へ戻してから配布加算する。',
    family: 'range-distribution',
    priority: 44,
  }),
  technique({
    id: 'top-two-segment-tree',
    pattern: /(?:second largest|二番目に大き|largest.*count|最大値.*個数)/iu,
    action:
      '各 segment node に異なる最大値・第二最大値と各個数を保持し、子の高々四候補を merge する',
    proof:
      '区間全体の上位二種類の値は左右の上位二種類の候補集合に必ず含まれ、同値の個数を足せば正確に復元できる。',
    prerequisite: 'segment tree と固定個数の候補 merge',
    concern: '同じ値の個数を合算してから上位二種類を選び、候補が一種類の node に sentinel を置く。',
    family: 'top-k-range-query',
    priority: 44,
  }),
  technique({
    id: 'reverse-paint-processing',
    pattern: /(?:reverse.*queries|クエリ.*逆順|後の.*上書き|paint.*reverse)/iu,
    action:
      '上書き paint query を逆順に処理し、まだ確定していない行・列の交点数だけを色別に加算する',
    proof:
      '逆順で最初に出会う paint が各 cell へ最後に適用された操作であり、未確定な反対軸との交点を一度だけ数える。',
    prerequisite: '上書き操作の逆順処理',
    concern: '同じ行・列の二回目以降を無視し、最後に未確定 cell を色 0 へ加える。',
    family: 'reverse-query',
    priority: 44,
  }),
  technique({
    id: 'parenthesis-direction-traversal',
    pattern: /(?:matching parentheses|対応する括弧|parenthes.*reverse|括弧.*反転)/iu,
    action:
      '対応括弧を stack で結び、括弧へ着いたら相方へ jump して走査方向を反転し、深さ parity で英字大小を変換する',
    proof:
      '各括弧対の内部は外側と逆向きに一度だけ走査され、入れ子深さの parity が文字反転回数と一致する。',
    prerequisite: '括弧列の stack matching と方向反転',
    concern: 'jump 後に現在方向へ一歩進み、括弧自体を出力せず、大小変換を ASCII 前提にしない。',
    family: 'parenthesis-traversal',
    priority: 44,
  }),
  technique({
    id: 'query-block-rebuild',
    pattern: /(?:rebuild|再構築|block.*queries|クエリ.*平方分割|recent edges)/iu,
    action:
      'online query を平方根個ずつの block に分け、確定済み forest を親・連結成分へ rebuild し、block 内の新辺だけ直接調べる',
    proof:
      '過去 block の辺は rebuild 状態へ完全に集約され、現在 block の高々 B 辺を追加検査すれば query 時点の forest を再現できる。',
    prerequisite: '平方分割と forest の親関係',
    concern:
      '暗号化された入力を直前回答で復号してから分類し、block 境界で pending edge を漏れなく取り込む。',
    family: 'sqrt-rebuild',
    priority: 46,
  }),
  technique({
    id: 'manhattan-coordinate-transform',
    pattern: /(?:x\s*\+\s*y|x\s*-\s*y|rotate.*45|45.*回転|Manhattan.*transform)/iu,
    action:
      '到達可能性を parity 別に分け、u=x+y と v=x-y へ座標変換して Manhattan 距離和を一次元絶対値和へ分離する',
    proof:
      '同 parity 点では Chebyshev 型の移動距離が変換後の |Δu|+|Δv| の半分に等しく、各軸の寄与を独立に数えられる。',
    prerequisite: '45度座標変換と絶対値和',
    concern:
      'parity group を混ぜず、sort 後の prefix sum で各差を一度だけ数え、最後の 2 除算を扱う。',
    family: 'coordinate-transform',
    priority: 44,
  }),
  technique({
    id: 'exact-length-maze-construction',
    pattern: /(?:maze.*construct|迷路.*構成|exact.*path length|ちょうど.*経路長)/iu,
    action:
      '短い基準経路から、壁の局所 gadget を開くたび経路長が一定量増える蛇行迷路を構成して目標 K に合わせる',
    proof:
      '各 gadget は入口・出口と単純路性を保ったまま増分だけを独立に加え、基準値から最大値まで許容 parity の全長を表せる。',
    prerequisite: '構成問題の局所 gadget と parity',
    concern:
      'K の実現可能範囲と parity を先に判定し、未使用 cell から shortcut が生じないよう壁を置く。',
    family: 'maze-construction',
    priority: 44,
  }),
  technique({
    id: 'priority-flood-bottleneck',
    pattern: /(?:priority flood|flooding|水没|sink.*land|bottleneck.*path)/iu,
    action:
      '海に接する境界を始点に、各 cell が到達可能になる最小水位を min-heap で伝播する priority flood を行う',
    proof:
      'cell の水没水位は経路上標高最大値の最小値であり、max(現在水位, 隣接標高) の Dijkstra 緩和と一致する。',
    prerequisite: 'minimax path と Dijkstra 法',
    concern: '同じ cell の古い heap entry を捨て、水位別回答は新規水没数の prefix sum として出す。',
    family: 'bottleneck-shortest-path',
    priority: 46,
  }),
  technique({
    id: 'interval-heavy-light-overlap',
    pattern: /(?:heavy.*light|heavy-light.*interval|sqrt.*interval|区間数.*平方根)/iu,
    action:
      '各人の在室区間数を閾値 C で heavy・light に分け、heavy との重なりを全走査で前計算し light 同士は query 時に merge する',
    proof:
      'light pair は区間 merge が O(C)、heavy は人数が高々 M/C なので全時系列との前計算総量が閾値で抑えられる。',
    prerequisite: '区間列 merge と heavy-light 分類',
    concern: '入退室 event を半開区間へ変換し、C を Q·C と M·N/C の釣り合いから選ぶ。',
    family: 'interval-sqrt-decomposition',
    priority: 46,
  }),
  technique({
    id: 'event-sweep-delay-propagation',
    pattern: /(?:departure.*arrival.*event|発車.*到着.*イベント)/iu,
    action:
      '全発着を時刻表時刻で event sort し、各駅の最新実到着時刻から後続列車へ必要最小の遅延を伝播する',
    proof:
      'ある発車へ影響できるのはその時刻以前の到着だけであり、各駅の最大実到着時刻が全乗継制約を要約する。',
    prerequisite: 'event sweep と因果順序',
    concern:
      '同時刻では到着を発車より先に処理し、初期遅延が与えられる列車を通常更新で上書きしない。',
    family: 'event-sweep',
    priority: 46,
  }),
  technique({
    id: 'absence-gap-subarray-counting',
    pattern: /(?:含まれない連続部分列|subarrays? not containing|complement.*subarray)/iu,
    action:
      '指定値が現れる位置へ番兵を加え、隣接出現位置間の gap ごとの三角数から、その値を含まない部分列数を数える',
    proof:
      '指定値を含まない部分列は二つの連続する出現位置の間へ一意に属し、各 gap 長 g は g(g+1)/2 個を与える。',
    prerequisite: '余事象と出現位置列',
    concern: '両端番兵を含め、複数値を避ける条件では位置集合を merge して同じ gap 式を適用する。',
    family: 'complement-counting',
    priority: 44,
  }),
  technique({
    id: 'permutation-cycle-power',
    pattern: /(?:permutation.*cycle.*power|順列.*サイクル.*累乗)/iu,
    action: '順列を互いに素な cycle へ分解し、各頂点を cycle 長 modulo の 2^K ステップ先へ写す',
    proof:
      '順列の反復は所属 cycle 上の回転であり、指数を cycle 長で割った余りだけ進む写像と一致する。',
    prerequisite: '順列の cycle 分解と modular exponentiation',
    concern: '2^K 自体を構成せず cycle 長を法として累乗し、cycle 内 index を 0-origin で揃える。',
    family: 'permutation-power',
    priority: 46,
  }),
  technique({
    id: 'attack-line-overlap-counting',
    pattern: /(?:queen attack|縦.*横.*斜め|attacked lines)/iu,
    action:
      '駒が利く行・列・二方向の対角線を一意化して総延長を足し、異方向の線の交点だけを列挙して重複を補正する',
    proof:
      '同方向の重複線を除けば多重計上される cell は異なる方向の線の交点に限られ、その総数は O(M^2) である。',
    prerequisite: '包除原理と格子直線の交点',
    concern: '盤外交点、非整数交点、同一点へ三方向以上が集まる場合を multiplicity で補正する。',
    family: 'geometric-union-counting',
    priority: 44,
  }),
  technique({
    id: 'adjacent-visibility-dominance',
    pattern: /(?:visible buildings|遮られない|line of sight)/iu,
    action: '全ての建物対の可視条件を、中間点による支配関係を使って隣接対だけの高さ下限へ縮約する',
    proof:
      '非隣接対の間から任意の建物を取ると、二つの短い対の少なくとも一方が元の対以上に厳しい制約を与える。',
    prerequisite: '直線の傾きと支配関係',
    concern: '分子を整数で交差計算して桁落ちを避け、除算は最後に一度だけ行う。',
    family: 'geometric-dominance',
    priority: 44,
  }),
  technique({
    id: 'continued-fraction-open-interval',
    pattern: /(?:continued fraction|連分数|fraction.*interval)/iu,
    action:
      '開区間の両端から共通整数部を除き、1 未満なら逆数で端点を反転する Euclid 型再帰で最小分母分数を得る',
    proof: '整数平行移動と逆数変換は区間内分数を全単射で対応させ、各段で連分数の一係数が確定する。',
    prerequisite: '連分数と Euclid の互除法',
    concern: '開区間の等号を混ぜず、逆数時に端点順を交換し、分子分母の積を広い整数型で比較する。',
    family: 'continued-fraction',
    priority: 46,
  }),
  technique({
    id: 'thin-grid-zero-sum-rectangles',
    pattern: /(?:zero-sum ranges|balanced rectangles|総和.*0.*長方形)/iu,
    action:
      '短い方を行方向にして上下端を全列挙し、列差分の prefix sum が等しい組を密配列 frequency で数える',
    proof:
      '上下端固定後の平衡長方形は列差分和が零の区間と一対一で、等しい prefix sum の二位置がその区間を定める。',
    prerequisite: '二次元累積更新と零和区間',
    concern:
      'H≤W に転置し、prefix 値域の offset と frequency 配列の初期化コストを全体計算量内へ収める。',
    family: 'thin-grid-enumeration',
    priority: 46,
  }),
  technique({
    id: 'small-to-large-graph-contraction',
    pattern: /(?:graph contraction|縮約.*マージテク|contract.*small.*large)/iu,
    action: '縮約する二頂点の駒数と次数の和を比較し、小さい側の駒・隣接辺だけを大きい側へ移す',
    proof:
      '移された対象の所属サイズは少なくとも倍になるため、各駒・辺が移動する回数は対数回に限られる。',
    prerequisite: 'small-to-large merge と単純グラフ縮約',
    concern:
      '自己 loop と多重辺を除きながら両端の隣接 set を同期し、駒から現頂点への写像も更新する。',
    family: 'graph-contraction',
    priority: 46,
  }),
  technique({
    id: 'slope-midpoint-pair-counting',
    pattern: /(?:trapezium|parallel.*midpoint|平行.*中点)/iu,
    action:
      '点対を既約方向ベクトルごとに数えて平行辺対を足し、同一中点の対角線対で平行四辺形の二重計上を引く',
    proof:
      '非平行四辺形の台形は一組、平行四辺形は二組の平行辺を持ち、後者は対角線中点一致と必要十分である。',
    prerequisite: '有理傾きの正規化と平行四辺形の対角線',
    concern:
      '方向の符号を正規化し、中点は 2 倍座標の整数 pair として浮動小数点を使わず hash する。',
    family: 'geometric-pair-counting',
    priority: 46,
  }),
  technique({
    id: 'signed-divisor-factorization',
    pattern: /(?:4X-1|signed divisors|負.*約数)/iu,
    action:
      '平方根条件を二つの一次因子の積 (2m+2n+1)(2m-2n-1)=4X-1 に変形し、符号付き約数を列挙する',
    proof:
      '各整数解は積の約数対を一意に定め、逆に parity・積・m≥0 を満たす約数対から元の整数解を復元できる。',
    prerequisite: '差の平方と約数列挙',
    concern: '正負両方の約数、2 で割れる parity、復元後の代入確認を行う。',
    family: 'diophantine-factorization',
    priority: 46,
  }),
  technique({
    id: 'amortized-linked-list-erasure',
    pattern: /(?:linked list|連結リスト|erase between)/iu,
    action:
      '値を node ID とする next 配列で列を表し、両端から交互に辿って先に相手へ届いた区間を splice・削除する',
    proof:
      '探索歩数は削除要素数の定数倍で、各 node は追加後に高々一度しか削除されないため全 query で線形になる。',
    prerequisite: '連結リストと償却解析',
    concern: '両方向探索の一時和を分け、到達した向きだけを採用して端点自身を削除しない。',
    family: 'amortized-list',
    priority: 46,
  }),
  technique({
    id: 'subset-mobius-exact-conditions',
    pattern: /(?:Möbius transform|Mobius transform|メビウス変換|exact conditions)/iu,
    action:
      '条件 subset ごとの lcm 倍数個数を求め、subset Möbius 変換で「ちょうどその条件集合だけ」を満たす個数へ反転する',
    proof:
      '部分条件 T の個数は T を含む全 exact 条件 S の和なので、Boolean lattice 上の zeta 変換を反転すればよい。',
    prerequisite: 'subset zeta・Möbius 変換',
    concern: 'lcm が上限を超えた時点で sentinel に丸め、乗算前の除算で overflow を避ける。',
    family: 'subset-transform',
    priority: 46,
  }),
  technique({
    id: 'canonical-transition-sequence-merge',
    pattern: /(?:equivalent.*good sequence|等価な良い列|sequence.*merge.*equivalent)/iu,
    action:
      '任意の操作列を同じ遷移関数を表す単調な canonical 列へ正規化し、二冪 block を binary counter のように線形 merge する',
    proof:
      '隣接二要素の置換が全初期値で遷移関数を保ち、canonical 列同士の merge も関数合成を保つ。',
    prerequisite: '関数合成の canonical form と二進 bucket',
    concern:
      'query は各 canonical block の切替点を二分探索し、追加時は同サイズ block だけを順に merge する。',
    family: 'canonical-sequence',
    priority: 48,
  }),
  technique({
    id: 'balanced-subset-partition-dp',
    pattern: /(?:average.*subset.*bitDP|平均.*部分集合.*bitDP|candy redistribution)/iu,
    action:
      '平均と一致する subset を前計算し、bitmask DP で全要素を覆う balanced group 数を最大化して各 group の操作列を構成する',
    proof:
      '操作グラフの各連結成分は総和を保存するので balanced が必要で、任意の balanced group は木状の移送で十分である。',
    prerequisite: 'subset DP と保存量',
    concern: '平均の割り切れを先に判定し、group 内を初期値降順に処理して移送量を非負に保つ。',
    family: 'partition-subset-dp',
    priority: 46,
  }),
  technique({
    id: 'permutation-cycle-minimum-swaps',
    pattern: /(?:minimum swaps|最小.*swap|cycle count.*swaps)/iu,
    action:
      '順列を cycle 分解し、各 swap が cycle 数を高々一つ増やすことから最小回数を N-C として cycle ごとに数える',
    proof:
      '同一 cycle 内の swap は一つの cycle を二つへ分割でき、恒等順列の N cycle まで毎回一つ増やす構成がある。',
    prerequisite: '順列の cycle 分解',
    concern:
      '固定点も長さ1の cycle として数え、cycle サイズごとの選択数を問題の modulus で合成する。',
    family: 'permutation-swaps',
    priority: 46,
  }),
  technique({
    id: 'radix-convolution-recurrence',
    pattern: /(?:X=dQ\+R|radix.*convolution|基数.*畳み込み)/iu,
    action:
      '非負解を基数 d の商 Q と桁 R に分け、A·R の分布との畳み込みで境界係数列を縮約する操作を反復する',
    proof:
      'X=dQ+R は一意で、各桁和 s ごとの残余問題 f(A,floor((M-s)/d)) が全解を重複なく分割する。',
    prerequisite: '基数分解、生成関数、畳み込み',
    concern: '負 index の係数を零として扱い、support 幅を証明した上で NTT の padding と法を選ぶ。',
    family: 'radix-convolution',
    priority: 48,
  }),
  technique({
    id: 'endpoint-pattern-subsequence-counting',
    pattern: /(?:first comparison.*last comparison|最初.*最後.*大小|Kadomatsu)/iu,
    action:
      '門松条件を「最初の比較が上昇、最後が下降」へ簡約し、内側二端を固定して外端候補数と中間 subset の重みを集計する',
    proof:
      '極大・極小の折返しは交互に現れるため極大が一つ多い条件は最初が上昇かつ最後が下降であることと同値になる。',
    prerequisite: '順列の大小列と Fenwick tree',
    concern: '左右の小さい値個数を別々に数え、長さ3と長さ4以上の 2 の冪重みを二重計上しない。',
    family: 'weighted-subsequence-counting',
    priority: 46,
  }),
  technique({
    id: 'layered-component-top-two-dp',
    pattern: /(?:floors?.*components?.*top two|階.*連結成分.*上位.*2)/iu,
    action:
      '各階を連結成分へ縮約した層状 graph 上で、梯子使用状態の DP を下階から計算し、除外最大値を上位二候補で高速化する',
    proof:
      '同一遷移先を除く最大値は全候補の一位または二位に必ずあり、梯子使用有無が将来に必要な履歴を全て表す。',
    prerequisite: '層状 graph DP と top-two trick',
    concern: '階間辺を成分単位で重複排除し、最大候補の遷移先 ID も保持して自己除外を判定する。',
    family: 'layered-graph-dp',
    priority: 46,
  }),
  technique({
    id: 'prefix-difference-order-counting',
    pattern: /(?:prefix.*difference.*inversion|累積.*差.*転倒)/iu,
    action:
      '文字数差の prefix D_i を作り、i<j かつ D_i<D_j となる pair を Fenwick tree または値域 frequency で数える',
    proof:
      '部分文字列内の A-B は二つの prefix 差であり、正である条件が D_i<D_j と完全に同値になる。',
    prerequisite: 'prefix sum と転倒数型 pair counting',
    concern: '空 prefix D_0 を含め、strict inequality と同値 prefix の除外を崩さない。',
    family: 'prefix-order-counting',
    priority: 44,
  }),
  technique({
    id: 'implicit-fibonacci-word-prefix',
    pattern: /(?:Fibonacci string|Fibonacci word|フィボナッチ.*文字列)/iu,
    action:
      '巨大な再帰連結文字列を展開せず、飽和させた長さと文字別総数を前計算して prefix query を片側へ再帰する',
    proof:
      'S_k=S_{k-1}+S_{k-2} なので prefix は前半だけか、前半全体と後半 prefix の和のどちらかに一意に分かれる。',
    prerequisite: '暗黙文字列と再帰的 prefix 集計',
    concern:
      '必要最大 R で長さを saturate し、L..R は prefix(R)-prefix(L-1) として空 prefix を扱う。',
    family: 'implicit-string',
    priority: 46,
  }),
  technique({
    id: 'small-to-large-bipartite-dsu',
    pattern: /(?:bipartite.*small.*large|二部グラフ.*マージテク)/iu,
    action:
      '各二部連結成分の二色集合を管理し、新辺で成分を結ぶ際に小さい側だけを必要なら反転して DSU merge する',
    proof:
      '二部成分の彩色は全反転を除き一意で、小さい成分の頂点は走査されるたび所属成分サイズが倍以上になる。',
    prerequisite: '二部彩色、DSU、small-to-large merge',
    concern:
      '同一成分内の同色辺で以後不可能を固定し、成分寄与 min(白,黒) を merge 前後で差分更新する。',
    family: 'bipartite-dsu',
    priority: 46,
  }),
  technique({
    id: 'divisor-product-score-dp',
    pattern: /(?:product.*divisors?.*dp|約数.*総積.*DP)/iu,
    action:
      'N の約数だけを積状態とし、選択個数ごとに subset の個数と要素和総計を同時に更新する knapsack DP を行う',
    proof:
      '積が N になる選択は全要素が N の約数で、各約数を使う・使わない遷移が全 subset を一度ずつ生成する。',
    prerequisite: '約数列挙と積 knapsack DP',
    concern: '積状態は c/d への遷移で overflow を避け、順列化する b! を最後に掛ける。',
    family: 'divisor-dp',
    priority: 46,
  }),
  technique({
    id: 'symmetry-piecewise-linear-endpoints',
    pattern: /(?:piecewise linear.*endpoint|一次関数.*端|対称性.*swap)/iu,
    action:
      '符号・座標・費用の対称性で A≤B, X≤Y へ正規化し、歩数 K ごとの費用を区分一次式にして端点だけ評価する',
    proof:
      '各領域では費用が K の一次関数なので最小値は定義域端にあり、対称変換は実行可能路と費用を保存する。',
    prerequisite: '対称性と区分線形最適化',
    concern: 'X+Y の parity を先に処理し、正規化の swap 後も座標と費用の対応を保つ。',
    family: 'closed-form-optimization',
    priority: 44,
  }),
  technique({
    id: 'two-dimensional-suffix-maximum',
    pattern: /(?:two-dimensional imos|2D imos|二次元 imos|右下.*最大)/iu,
    action:
      '各長方形更新を query index の点情報へ置き換え、右下から左上への二次元 suffix maximum で各 cell の最後の更新を求める',
    proof:
      'cell (r,c) を覆う query は R_i≥r かつ C_i≥c の点であり、その右下領域の最大 index が最後の上書きに一致する。',
    prerequisite: '二次元 suffix DP と上書き順序',
    concern:
      '同一点では最大 query index を残し、得た index を最後に X_i へ写して未更新 cell を区別する。',
    family: 'two-dimensional-prefix',
    priority: 44,
  }),
  technique({
    id: 'primitive-root-divisor-aggregation',
    pattern: /(?:primitive root.*gcd|原始根.*gcd)/iu,
    action:
      '非零剰余を原始根の指数へ写して冪条件を一次合同式にし、gcd(P-1,a) ごとに個数を約数上で集約する',
    proof:
      '原始根の指数写像は非零剰余との全単射で、an≡b の可解な b の個数は (P-1)/gcd(P-1,a) になる。',
    prerequisite: '原始根、一次合同式、約数反転型集計',
    concern: 'x=0 を分離し、P-1 の全約数を列挙して gcd が各約数になる指数数を大きい順に差し引く。',
    family: 'finite-group-counting',
    priority: 48,
  }),
  technique({
    id: 'last-symbol-bitmask-dp',
    pattern: /(?:bitDP.*最後|bitmask.*last symbol)/iu,
    action:
      '使用済み種類集合と最後に選んだ種類を状態にし、現在文字を選ばない・同種を続ける・未使用種へ移る遷移を数える',
    proof:
      '各種類が一つの連続 block だけに現れる条件は、再登場を使用済み mask で禁じ、現在 block を末尾種類で識別すれば必要十分になる。',
    prerequisite: 'bitmask DP と末尾状態',
    concern:
      '空部分列を答えから除き、同種継続と新しい種類の開始を別遷移として modulus 上で加算する。',
    family: 'bitmask-sequence-dp',
    priority: 48,
  }),
  technique({
    id: 'shortest-path-edge-recomputation',
    pattern: /(?:one shortest path.*remove|最短経路.*含まれない辺)/iu,
    action:
      '元 graph で最短路を一本復元し、その路上辺を削除した場合だけ BFS を再実行し、他辺は元距離を再利用する',
    proof:
      '選んだ最短路に含まれない辺を削除してもその路が残るため距離は変わらず、再計算対象は高々 N-1 辺である。',
    prerequisite: 'BFS と最短路復元',
    concern: '辺を端点 pair でなく edge id で無効化し、元々終点へ到達不能な場合を全問 -1 とする。',
    family: 'shortest-path-sensitivity',
    priority: 48,
  }),
  technique({
    id: 'multiplicative-order-divisor-search',
    pattern: /(?:Euler.*divisors.*order|オイラーの定理.*約数)/iu,
    action:
      "repdigit 条件を 10^n≡1 mod M' へ変形し、Euler の定理から n を φ(M') の約数へ限定して昇順検査する",
    proof:
      "最小指数 n と φ(M') の gcd も解になるため最小性から n は φ(M') を割り、最初に成功する約数が乗法的位数である。",
    prerequisite: 'Euler の定理、Euler φ、乗法的位数',
    concern:
      "M' が 2 または 5 と共通因子を持つ場合を解なしにし、modular power の積を安全な型で計算する。",
    family: 'multiplicative-order',
    priority: 48,
  }),
  technique({
    id: 'parenthesis-monoid-segment-tree',
    pattern: /(?:parenthesis.*minimum.*sum|括弧列.*最小値.*セグメント木)/iu,
    action:
      '括弧を ±1 とし、各区間の総和と prefix 最小値を monoid として segment tree で点更新・区間取得する',
    proof:
      '括弧列が正しい条件は総和0かつ全prefix非負で、二区間結合時の最小prefixは min(left.min,left.sum+right.min) になる。',
    prerequisite: '正しい括弧列の prefix 条件と segment tree monoid',
    concern: 'swap は二点更新し、query の相対 prefix 最小値を区間左端の累積値から独立に判定する。',
    family: 'parenthesis-range-query',
    priority: 48,
  }),
  technique({
    id: 'four-state-rook-dp',
    pattern: /(?:four states|4.*状態|値の種類.*4)/iu,
    action: '現在位置を終点と行一致・列一致するかの4分類へ圧縮し、各分類の総数だけを K 回遷移する',
    proof:
      '同じ分類内の cell は対称で以後の遷移数が等しく、各遷移係数は行・列内の行先個数だけで決まる。',
    prerequisite: '対称性による状態圧縮 DP',
    concern: 'X=1 または Y=1 で X-2・Y-2 が負になる項は、到達不能状態との積として安全に扱う。',
    family: 'symmetry-compressed-dp',
    priority: 48,
  }),
  technique({
    id: 'shortest-path-tree-edge-selection',
    pattern: /(?:predecessor edge.*Dijkstra|直前に使った道路.*ダイクストラ)/iu,
    action:
      'Dijkstra の各頂点への最終緩和で predecessor edge を記録し、根以外へ一本ずつ選んで最短路木を残す',
    proof:
      '各 predecessor は距離を厳密に満たす最短路の一辺で、根からの辺数に関する帰納で全頂点の元最短距離が保たれる。',
    prerequisite: 'Dijkstra 法と shortest-path tree',
    concern:
      '同距離候補は任意の一本でよく、priority queue の stale entry から predecessor を更新しない。',
    family: 'shortest-path-tree',
    priority: 48,
  }),
  technique({
    id: 'polynomial-moment-fenwick',
    pattern: /(?:i\^2.*Fenwick|重み.*Fenwick|weighted prefix moments)/iu,
    action:
      '三重累積和の係数を i の二次式へ展開し、ΣA_i・ΣiA_i・Σi²A_i を三本の Fenwick tree で点更新・prefix取得する',
    proof:
      'A_i の D_x への寄与回数は (x-i+1)(x-i+2)/2 であり、展開後は x の係数と三つの prefix moment の線形結合になる。',
    prerequisite: '二項係数の展開と Fenwick tree',
    concern:
      '2 の modular inverse、i の1-origin、値の代入更新を旧値との差分へ変換する処理を統一する。',
    family: 'weighted-prefix-query',
    priority: 48,
  }),
  technique({
    id: 'greedy-exchange',
    pattern: /(?:greedy algorithm|greedy method|exchange argument|貪欲法|貪欲|交換法)/iu,
    action: '局所的に最も制約を悪化させない候補を選び、greedy に解を延長する',
    proof: '任意の最適解の最初に異なる選択を交換しても実行可能性と評価が悪化しないことを示す。',
    prerequisite: 'greedy choice と交換論法',
    concern: '同値候補の tie-break が将来の実行可能性へ影響しない条件を確認する。',
    family: 'optimization',
    priority: 12,
  }),
  technique({
    id: 'divide-and-conquer',
    pattern: /(?:divide and conquer|divide-and-conquer|分割統治)/iu,
    action: '問題を独立な半区間へ再帰分割し、境界をまたぐ情報だけを merge する',
    proof: '全対象が左・右・境界をまたぐものの三種に分かれ、再帰解と merge が互いに重複なく覆う。',
    prerequisite: '分割統治',
    concern: '再帰の基底、同一要素を二重計上しない merge 境界、作業配列の再利用を確認する。',
    family: 'decomposition',
    priority: 17,
  }),
  technique({
    id: 'balanced-xor-necklace-mitm',
    pattern: /(?:necklace.*binary trie|ネックレス.*binary trie)/iu,
    action:
      '色ごとの選択数の積が均衡するよう色集合を二分し、各半分の XOR を列挙して binary trie の共有走査で K 番目を上位 bit から決める',
    proof:
      '各ネックレスは左右の選択の組へ一意に分かれ、trie の分岐数が現在の prefix を満たす組数になるため、組数との比較で答えの各 bit を確定できる。',
    prerequisite: '半分全列挙、binary trie、XOR の辞書順',
    concern:
      '左右の列挙数が均衡するよう色単位で分割し、前の bit で到達した trie node から探索を再開する。',
    family: 'xor-mitm',
    priority: 50,
  }),
  technique({
    id: 'diagonal-xor-mitm',
    pattern: /(?:diagonal.*XOR|対角線.*XOR)/iu,
    action:
      '始点側と終点側から対角線までの path XOR を各中継マス別に半分全列挙し、同じ XOR 値の頻度を突き合わせる',
    proof:
      '全 path は対角線上の一マスで始点側と終点側へ一意に分かれ、中継マスの値を一度だけ数える補正後に両 XOR が一致することが全体 XOR が零であることと同値になる。',
    prerequisite: 'grid path の半分全列挙と XOR',
    concern: '対角線のマス値を左右どちらに含めるかを固定し、同値 XOR は頻度の積で数える。',
    family: 'xor-mitm',
    priority: 50,
  }),
  technique({
    id: 'bidirectional-rotation-mitm',
    pattern: /(?:rotation puzzle|回転.*パズル)/iu,
    action:
      '初期盤面と完成盤面の双方から深さ K/2 まで状態を列挙し、到達 layer の共通状態から最小操作回数を復元する',
    proof:
      '長さ K 以下の任意の操作列は中央で二分でき、後半を逆操作として完成盤面側から辿れば、両側の到達集合が必ず中央状態で交わる。',
    prerequisite: '双方向探索と半分全列挙',
    concern: '直前操作の即時打ち消しを除外し、盤面を衝突しない canonical key で保存する。',
    family: 'state-mitm',
    priority: 50,
  }),
  technique({
    id: 'step-size-sqrt-dp',
    pattern: /(?:Hop Sugoroku|すごろく.*平方)/iu,
    action:
      '遷移幅 A_i を閾値 b で分け、小さい幅は剰余別の遅延 DP へ蓄積し、大きい幅だけ遷移先を直接列挙する',
    proof:
      '小さい幅の更新種類は b 個で各位置の受取をまとめられ、大きい幅からの遷移数は一要素あたり N/b 以下なので、両処理が全遷移を重複なく覆う。',
    prerequisite: 'DP と平方根分割による遷移数評価',
    concern: '幅ごとの index の剰余を揃え、現在位置の寄与を遅延表へ加える順序を固定する。',
    family: 'sqrt-dp',
    priority: 50,
  }),
  technique({
    id: 'mo-frequency-bucket-aggregation',
    pattern: /(?:Range Shuffle Query|Mo.*平方分割)/iu,
    action:
      'query を Mo 順に並べて値頻度を O(1) で増減し、頻度別の積と零要素を平方根 bucket にまとめて各答えを O(√N) で合成する',
    proof:
      'Mo の add・remove が現在区間の頻度を保ち、各 bucket の集約値から必要な全頻度範囲の積を漏れなく復元できる。',
    prerequisite: 'Mo’s algorithm と平方根分割による集約',
    concern:
      'modular inverse を含む積では零要素数を別管理し、頻度変更前後の bucket 集約を正しい順序で更新する。',
    family: 'offline-query-bucketing',
    priority: 50,
  }),
  technique({
    id: 'modular-progression-sqrt-decomposition',
    pattern: /(?:arithmetic progressions?.*mod|等差数列.*平方根)/iu,
    action:
      '(Ak+B) mod M の列を鳩の巣原理で得た短い差分を用いて O(√M) 本の等差数列へ分解し、各列の冪和をまとめて求める',
    proof:
      '最初の O(√M) 項には差が O(√M) 以下の二項があり、その index 差で列を分けると wrap 回数の総和も O(√M) 本に抑えられる。',
    prerequisite: '鳩の巣原理、等差数列分解、等比数列の和',
    concern: '差分の向きと modulo の正規化を固定し、各等差列の長さと初項を整数演算で求める。',
    family: 'modular-sequence-decomposition',
    priority: 50,
  }),
];

const STRUCTURE_SIGNALS: readonly StructureSignal[] = [
  {
    id: 'tree',
    pattern:
      /(?:rooted tree|undirected tree|tree with [A-Z0-9]+ vertices|forest|根付き木|無向木|木構造|木である|頂点からなる木)/iu,
    description: '根付き木・部分木・パスの関係',
    prerequisite: '木の連結性と一意な単純路',
  },
  {
    id: 'grid',
    pattern: /(?:grid|cells?|マス目|マス|盤面|[A-Z0-9]+ 行 [A-Z0-9]+ 列)/iu,
    description: '盤面上の位置と局所遷移',
    prerequisite: 'grid の座標表現',
  },
  {
    id: 'string',
    pattern: /(?:string|substring|character|文字列|部分文字列|英小文字|英大文字)/iu,
    description: '文字列の prefix・suffix と一致関係',
    prerequisite: '文字列の添字と prefix',
  },
  {
    id: 'permutation',
    pattern: /(?:permutation|排列|順列)/iu,
    description: '順列の位置と値の対応',
    prerequisite: '順列と逆写像',
  },
  {
    id: 'graph',
    pattern: /(?:graph|vertex|vertices|edge|node|グラフ|頂点|辺)/iu,
    description: '頂点と辺からなる状態グラフ',
    prerequisite: 'グラフの到達可能性',
  },
  {
    id: 'interval',
    pattern: /(?:interval|segment|range|区間|端点)/iu,
    description: '区間端点と包含関係',
    prerequisite: '半開区間の扱い',
  },
  {
    id: 'polynomial',
    pattern: /(?:polynomial|coefficient|generating function|多項式|係数|母関数)/iu,
    description: '多項式係数と組合せ和の対応',
    prerequisite: '多項式の係数演算',
  },
  {
    id: 'sequence',
    pattern: /(?:sequence|array|subsequence|列|配列|数列|部分列)/iu,
    description: '列の順序と prefix 状態',
    prerequisite: '配列と prefix の添字管理',
  },
  {
    id: 'query',
    pattern: /(?:query|queries|update|クエリ|更新|問い合わせ)/iu,
    description: '更新と問い合わせの時系列',
    prerequisite: 'online query の計算量設計',
  },
  {
    id: 'number',
    pattern: /(?:integer|divisor|multiple|prime|modulo|整数|約数|倍数|素数|剰余)/iu,
    description: '整数の約数・剰余構造',
    prerequisite: '整数論の基本的な割り切れ関係',
  },
];

/** Official editorials sometimes present the construction directly without a
 * conventional algorithm name. These reviewed bindings prevent such Problems
 * from silently degrading to a generic fallback. */
const REVIEWED_SIGNAL_BINDINGS: Readonly<Record<string, readonly string[]>> = {
  'abc213-e': ['zero-one-bfs'],
  'abc212-g': ['primitive-root-divisor-aggregation'],
  'abc215-e': ['last-symbol-bitmask-dp'],
  'abc218-f': ['shortest-path-edge-recomputation'],
  'abc219-e': ['complete-enumeration'],
  'abc219-f': ['lattice-translation-classes'],
  'abc219-g': ['degree-sqrt-decomposition'],
  'abc220-g': ['computational-geometry', 'complete-enumeration'],
  'abc221-f': ['breadth-first-search', 'combinatorics-binomial'],
  'abc222-g': ['multiplicative-order-divisor-search'],
  'abc223-e': ['complete-enumeration'],
  'abc223-f': ['parenthesis-monoid-segment-tree'],
  'abc224-g': ['probability-expectation-dp'],
  'abc226-g': ['greedy-exchange'],
  'abc230-e': ['floor-quotient-blocks'],
  'abc231-e': ['memoized-recursion'],
  'abc232-e': ['four-state-rook-dp'],
  'abc232-h': ['recursive-construction'],
  'abc233-e': ['decimal-carry-scan'],
  'abc234-e': ['complete-enumeration'],
  'abc234-ex': ['spatial-bucketing'],
  'abc239-e': ['bounded-top-k-merge'],
  'abc239-f': ['disjoint-set-union', 'greedy-exchange'],
  'abc240-f': ['piecewise-quadratic-optimization'],
  'abc241-g': ['max-flow-min-cut'],
  'abc242-g': ['mo-algorithm'],
  'abc242-e': ['combinatorics-binomial'],
  'abc244-g': ['depth-first-search', 'recursive-construction'],
  'abc245-f': ['reverse-topological-pruning'],
  'abc247-f': ['disjoint-set-union', 'dynamic-programming'],
  'abc248-e': ['computational-geometry', 'complete-enumeration'],
  'abc248-ex': ['lazy-segment-tree'],
  'abc248-g': ['tree-dp'],
  'abc251-g': ['computational-geometry'],
  'abc252-ex': ['balanced-xor-necklace-mitm'],
  'abc252-e': ['shortest-path-tree-edge-selection'],
  'abc253-f': ['fenwick-tree'],
  'abc253-g': ['sequence-reversal-composition'],
  'abc255-e': ['frequency-candidate-counting'],
  'abc255-ex': ['ordered-set'],
  'abc255-f': ['tree-traversal-reconstruction'],
  'abc256-f': ['polynomial-moment-fenwick'],
  'abc260-f': ['pair-witness-pigeonhole'],
  'abc262-e': ['combinatorics-binomial'],
  'abc268-f': ['greedy-exchange'],
  'abc269-f': ['prefix-sum-difference', 'modular-arithmetic'],
  'abc271-f': ['diagonal-xor-mitm'],
  'abc272-e': ['complete-enumeration', 'frequency-candidate-counting'],
  'abc277-ex': ['two-sat-implication-graph'],
  'abc279-e': ['prefix-suffix-permutation-effect'],
  'abc281-e': ['ordered-set'],
  'abc285-f': ['fenwick-tree'],
  'abc286-g': ['disjoint-set-union', 'euler-trail-parity'],
  'abc287-e': ['sorted-neighbor-lcp'],
  'abc289-f': ['reflection-parity-construction'],
  'abc294-e': ['two-pointers'],
  'abc296-e': ['functional-graph', 'reverse-topological-pruning'],
  'abc296-ex': ['frontier-connectivity-dp'],
  'abc296-f': ['fenwick-tree'],
  'abc302-g': ['greedy-exchange'],
  'abc310-e': ['dynamic-programming'],
  'abc312-e': ['complete-enumeration'],
  'abc313-e': ['run-length-recurrence'],
  'abc317-g': ['regular-bipartite-factorization'],
  'abc318-e': ['sandwich-triple-counting'],
  'abc318-f': ['critical-distance-interval-enumeration'],
  'abc319-e': ['periodic-residue-precomputation'],
  'abc323-g': ['matrix-tree-characteristic-polynomial'],
  'abc324-e': ['subsequence-prefix-suffix-pairing'],
  'abc329-f': ['small-to-large-set-merge'],
  'abc335-f': ['step-size-sqrt-dp'],
  'abc336-f': ['bidirectional-rotation-mitm'],
  'abc330-e': ['dynamic-mex-maintenance'],
  'abc334-g': ['lowlink-articulation'],
  'abc337-e': ['binary-information-encoding'],
  'abc337-f': ['circular-capped-window-counting'],
  'abc337-g': ['euler-tour', 'fenwick-tree'],
  'abc338-g': ['expression-segment-composition'],
  'abc339-f': ['modular-product-fingerprinting'],
  'abc340-e': ['range-distribution-data-structure'],
  'abc343-e': ['complete-enumeration'],
  'abc343-f': ['top-two-segment-tree'],
  'abc346-e': ['reverse-paint-processing'],
  'abc350-f': ['parenthesis-direction-traversal'],
  'abc350-g': ['query-block-rebuild'],
  'abc351-e': ['manhattan-coordinate-transform'],
  'abc358-f': ['exact-length-maze-construction'],
  'abc363-e': ['priority-flood-bottleneck'],
  'abc365-g': ['interval-heavy-light-overlap'],
  'abc368-e': ['event-sweep-delay-propagation'],
  'abc371-e': ['absence-gap-subarray-counting'],
  'abc377-e': ['permutation-cycle-power'],
  'abc377-f': ['attack-line-overlap-counting'],
  'abc380-e': ['ordered-set'],
  'abc385-f': ['adjacent-visibility-dominance'],
  'abc390-f': ['absence-gap-subarray-counting'],
  'abc405-g': ['mo-frequency-bucket-aggregation'],
  'abc408-g': ['continued-fraction-open-interval'],
  'abc410-e': ['dynamic-programming'],
  'abc410-f': ['thin-grid-zero-sum-rectangles'],
  'abc411-f': ['small-to-large-graph-contraction'],
  'abc418-e': ['slope-midpoint-pair-counting'],
  'abc420-g': ['signed-divisor-factorization'],
  'abc421-f': ['amortized-linked-list-erasure'],
  'abc423-f': ['subset-mobius-exact-conditions'],
  'abc427-g': ['canonical-transition-sequence-merge'],
  'abc429-g': ['modular-progression-sqrt-decomposition'],
  'abc432-f': ['balanced-subset-partition-dp'],
  'abc436-e': ['permutation-cycle-minimum-swaps'],
  'abc436-g': ['radix-convolution-recurrence'],
  'abc439-f': ['endpoint-pattern-subsequence-counting'],
  'abc440-g': ['layered-component-top-two-dp'],
  'abc441-e': ['prefix-difference-order-counting'],
  'abc447-f': ['tree-dp'],
  'abc450-e': ['implicit-fibonacci-word-prefix'],
  'abc451-f': ['small-to-large-bipartite-dsu'],
  'abc461-f': ['divisor-product-score-dp'],
  'abc462-e': ['symmetry-piecewise-linear-endpoints'],
  'abc464-e': ['two-dimensional-suffix-maximum'],
};

/** Problem-specific constructions are intentionally available only through a
 * reviewed Problem binding. Their prose patterns are documentation aids, not
 * a license to classify a different editorial by a coincidental keyword. */
const REVIEWED_ONLY_SIGNAL_IDS = new Set<string>([
  'binary-information-encoding',
  'balanced-xor-necklace-mitm',
  'balanced-subset-partition-dp',
  'canonical-transition-sequence-merge',
  'circular-capped-window-counting',
  'continued-fraction-open-interval',
  'critical-distance-interval-enumeration',
  'decimal-carry-scan',
  'diagonal-xor-mitm',
  'divisor-product-score-dp',
  'dynamic-mex-maintenance',
  'endpoint-pattern-subsequence-counting',
  'event-sweep-delay-propagation',
  'exact-length-maze-construction',
  'expression-segment-composition',
  'implicit-fibonacci-word-prefix',
  'interval-heavy-light-overlap',
  'layered-component-top-two-dp',
  'last-symbol-bitmask-dp',
  'manhattan-coordinate-transform',
  'matrix-tree-characteristic-polynomial',
  'mo-frequency-bucket-aggregation',
  'modular-progression-sqrt-decomposition',
  'modular-product-fingerprinting',
  'absence-gap-subarray-counting',
  'adjacent-visibility-dominance',
  'amortized-linked-list-erasure',
  'attack-line-overlap-counting',
  'parenthesis-direction-traversal',
  'parenthesis-monoid-segment-tree',
  'periodic-residue-precomputation',
  'permutation-cycle-minimum-swaps',
  'permutation-cycle-power',
  'prefix-difference-order-counting',
  'primitive-root-divisor-aggregation',
  'priority-flood-bottleneck',
  'query-block-rebuild',
  'radix-convolution-recurrence',
  'range-distribution-data-structure',
  'regular-bipartite-factorization',
  'reverse-paint-processing',
  'sandwich-triple-counting',
  'signed-divisor-factorization',
  'shortest-path-edge-recomputation',
  'shortest-path-tree-edge-selection',
  'slope-midpoint-pair-counting',
  'small-to-large-bipartite-dsu',
  'small-to-large-graph-contraction',
  'small-to-large-set-merge',
  'step-size-sqrt-dp',
  'subsequence-prefix-suffix-pairing',
  'subset-mobius-exact-conditions',
  'symmetry-piecewise-linear-endpoints',
  'four-state-rook-dp',
  'multiplicative-order-divisor-search',
  'polynomial-moment-fenwick',
  'thin-grid-zero-sum-rectangles',
  'top-two-segment-tree',
  'two-dimensional-suffix-maximum',
  'bidirectional-rotation-mitm',
  'degree-sqrt-decomposition',
  'frontier-connectivity-dp',
  'lattice-translation-classes',
  'pair-witness-pigeonhole',
  'reflection-parity-construction',
  'spatial-bucketing',
  'tree-traversal-reconstruction',
]);

interface ReviewedComplexityBinding {
  readonly time: string;
  readonly sourceEvidence: RegExp;
}

/** Complexity is a Problem-level editorial decision. A technique-level
 * fallback is intentionally forbidden because the surrounding algorithm can
 * change both the bound and whether the analysis is pedagogically essential. */
const REVIEWED_COMPLEXITY_BINDINGS: Readonly<Record<string, ReviewedComplexityBinding>> = {
  'abc218-f': {
    time: 'O(N[N+M])',
    sourceEvidence: /O\s*\(\s*N\s*\(\s*N\s*\+\s*M\s*\)\s*\)/u,
  },
  'abc252-ex': {
    time: 'O(3^{N/6} log V)',
    sourceEvidence: /O\s*\(\s*3\^\{\\frac\{N\}\{6\}\}\s*\\log\s*V\s*\)/u,
  },
  'abc271-f': {
    time: 'O(N 2^N)',
    sourceEvidence: /O\s*\(\s*N\s*2\^\{N\}\s*\)/u,
  },
  'abc335-f': {
    time: 'O(N√N)',
    sourceEvidence:
      /O\s*\(\s*Nb\s*\+\s*N\s*(?:\\times|×)\s*\\frac\{N\}\{b\}\s*\).*?b\s*=\s*\\sqrt\{N\}/u,
  },
  'abc336-f': {
    time: 'O(3^{K/2} KHW)',
    sourceEvidence: /O\s*\(\s*3\^\{K\/2\}\s*\\cdot\s*KHW\s*\)/u,
  },
  'abc350-g': {
    time: 'O(Q√N)',
    sourceEvidence: /O\s*\(\s*Q\s*\\sqrt\{N\}\s*\)/u,
  },
  'abc405-g': {
    time: 'O(N√Q + Q√N)',
    sourceEvidence: /O\s*\(\s*N\s*\\sqrt\{Q\}\s*\+\s*Q\s*\\sqrt\{N\}\s*\)/u,
  },
  'abc410-f': {
    time: 'O(H²W)',
    sourceEvidence: /O\s*\(\s*H\^2W\s*\)/u,
  },
  'abc411-f': {
    time: 'O(Q + [N+M] log[N+M] log N)',
    sourceEvidence:
      /O\s*\(\s*Q\s*\+\s*\(\s*N\s*\+\s*M\s*\)\s*\\log\s*\(\s*N\s*\+\s*M\s*\)\s*\\log\s*N\s*\)/u,
  },
  'abc421-f': {
    time: 'O(Q)',
    sourceEvidence: /全体の計算量[^。]{0,80}O\s*\(\s*Q\s*\)/u,
  },
  'abc429-g': {
    time: 'O(√M log M)',
    sourceEvidence: /O\s*\(\s*\\sqrt\{M\}\s*\\log\s*M\s*\)/u,
  },
  'abc451-f': {
    time: 'O(Q α[N] + N log N)',
    sourceEvidence: /O\s*\(\s*Q\s*\\alpha\s*\(\s*N\s*\)\s*\+\s*N\s*\\log\s*N\s*\)/u,
  },
};

export const reviewedProblemComplexity = (problemId: string): string | undefined =>
  REVIEWED_COMPLEXITY_BINDINGS[problemId]?.time;

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const countMatches = (value: string, pattern: RegExp): number => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return [...value.matchAll(new RegExp(pattern.source, flags))].length;
};

const detectTechniques = (text: string, problemId: string): readonly TechniqueSignal[] => {
  const matches = TECHNIQUE_SIGNALS.flatMap((signal) => {
    if (REVIEWED_ONLY_SIGNAL_IDS.has(signal.id)) return [];
    const occurrences = countMatches(text, signal.pattern);
    const firstIndex = text.search(signal.pattern);
    return occurrences === 0 || firstIndex < 0 ? [] : [{ signal, occurrences, firstIndex }];
  }).sort(
    (left, right) =>
      left.firstIndex - right.firstIndex ||
      right.signal.priority - left.signal.priority ||
      right.occurrences - left.occurrences ||
      left.signal.id.localeCompare(right.signal.id, 'en'),
  );
  const signalsById = new Map(TECHNIQUE_SIGNALS.map((signal) => [signal.id, signal]));
  const forced = (REVIEWED_SIGNAL_BINDINGS[problemId] ?? []).map((signalId) => {
    const signal = signalsById.get(signalId);
    if (!signal) throw new Error(`Reviewed technique signal is not registered: ${signalId}`);
    return signal;
  });
  if (forced.length > 0) {
    const families = new Set<string>();
    return forced.filter((signal) => {
      if (families.has(signal.family)) return false;
      families.add(signal.family);
      return true;
    });
  }
  const accepted: TechniqueSignal[] = [];
  const families = new Set<string>();
  for (const signal of matches.map(({ signal }) => signal)) {
    if (families.has(signal.family)) continue;
    accepted.push(signal);
    families.add(signal.family);
    // Unbound Problems retain one primary technique. Reviewed bindings are
    // the only place where a source-verified composite method is declared.
    if (accepted.length === 1) break;
  }
  return accepted;
};

const detectStructure = (text: string): StructureSignal =>
  STRUCTURE_SIGNALS.find((signal) => signal.pattern.test(text)) ?? {
    id: 'discrete-state',
    pattern: /(?:)/u,
    description: '入力から構成される離散状態と実行可能な遷移',
    prerequisite: '状態と遷移のモデル化',
  };

const selectReviewedComplexity = (
  problemId: string,
  editorialText: string,
): {
  readonly essential: boolean;
  readonly value?: string;
  readonly fromSource: boolean;
} => {
  const binding = REVIEWED_COMPLEXITY_BINDINGS[problemId];
  if (binding === undefined) return { essential: false, fromSource: false };
  const evidenceText = editorialText.replace(/\\mathrm\s*\{\s*O\s*\}/gu, 'O');
  if (!binding.sourceEvidence.test(evidenceText)) {
    return { essential: true, fromSource: false };
  }
  return {
    essential: true,
    value: `${binding.time}（公式解法全体。特殊な計算量解析を含む）`,
    fromSource: true,
  };
};

const unique = (values: readonly string[]): readonly string[] => [...new Set(values)];

export const authorTechniqueInventoryItem = (
  input: TechniqueAuthoringInput,
): TechniqueAuthoringAnalysis => {
  const statementText = normalizeText(input.statementText);
  const editorialText = normalizeText(input.editorialText);
  // A title can contain an algorithm-shaped everyday word (for example,
  // "1D Bucket Tool") without naming the solution. Prefer the first technique
  // explicitly introduced by the official editorial; later hits are commonly
  // alternatives or comparisons rather than the primary method.
  const signals = detectTechniques(editorialText, input.problem.id);
  const primary = signals[0];
  const structure = detectStructure(`${input.problem.title} ${statementText}`);
  const hasReviewedBinding = REVIEWED_SIGNAL_BINDINGS[input.problem.id] !== undefined;
  const complexity = selectReviewedComplexity(input.problem.id, editorialText);
  const methodActions =
    signals.length > 0
      ? signals.map(({ action }) => action).join('。さらに、')
      : `${structure.description}を同値な状態へ縮約し、必要な候補だけを制約内で列挙する`;
  const proofIdeas = unique([
    ...(signals.length > 0
      ? signals.slice(0, 2).map(({ proof }) => proof)
      : [
          `${structure.description}と解候補の対応を双方向に示し、列挙の漏れと重複がないことを確認する。`,
        ]),
    `${input.problem.title} 固有の境界条件でも、状態の意味と遷移の不変条件が保たれることを確認する。`,
  ]);
  const prerequisites = unique([
    ...(hasReviewedBinding ? [] : [structure.prerequisite]),
    ...signals.map(({ prerequisite }) => prerequisite),
    ...(complexity.value === undefined ? [] : ['特殊な漸近計算量の見積もり']),
  ]);
  const concerns = unique(
    signals.length > 0
      ? signals.map(({ concern }) => concern)
      : [
          '入力の最小ケース、最大ケース、同値な候補の境界を個別にテストする。',
          '状態 key と更新順序を固定し、同じ候補を二重に数えない。',
        ],
  );
  const item = TechniqueInventoryItemSchema.parse({
    problemId: input.problem.id,
    sourceRevisionIds: [...input.problem.sourceRevisionIds].sort(),
    coreMethod: `${input.problem.id}「${input.problem.title}」では、${
      hasReviewedBinding ? '' : '主解法候補として、'
    }${methodActions}。${
      hasReviewedBinding
        ? 'この状態表現から答えを構成する。'
        : `${structure.description}を必要十分な状態だけで表し、答えを構成する。`
    }`,
    proofIdeas,
    ...(complexity.value === undefined ? {} : { asymptoticComplexity: { time: complexity.value } }),
    prerequisiteCandidates: prerequisites,
    implementationConcerns: concerns,
    outcomeCandidates: [
      `${input.problem.title} 型の${hasReviewedBinding ? '問題' : ` ${structure.description}`}に対し、${primary?.prerequisite ?? '状態縮約'}を選び、${complexity.value === undefined ? '状態と証明' : '状態・証明・特殊計算量'}を一貫して設計できる。`,
    ],
    adHocElements: [],
    authorId: input.authorId ?? 'person-maintainer',
    reviewStatus: hasReviewedBinding ? 'reviewed' : 'draft',
  });
  return {
    item,
    signalIds: signals.map(({ id }) => id),
    structureId: structure.id,
    complexityEssential: complexity.essential,
    problemComplexityRecorded: complexity.fromSource,
    classificationMode: hasReviewedBinding ? 'reviewed_binding' : 'official_term_detection',
  };
};
