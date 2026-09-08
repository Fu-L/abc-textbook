/** 教材のガイドは根拠の記録順ではなく、この明示選定表で固定する。 */
export interface GuidedExampleSelection {
  readonly problemId: string;
  readonly rationale: string;
  readonly scope: string;
  readonly walkthrough?: readonly string[];
  readonly assessmentProblemId?: string;
  readonly assessmentMethod?: string;
  readonly assessmentProcedure?: readonly string[];
}

export const CANONICAL_GUIDED_EXAMPLES: Readonly<Record<string, GuidedExampleSelection>> = {
  'outcome-accelerate-fixed-linear-transition': {
    problemId: 'abc256-g',
    rationale:
      '端点色を白=1、黒=0とすると遷移u→vの重みはC(D-1,k-u-v)で、範囲外の二項係数は0とする。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。局所配置数が隣接する少数状態だけで決まり、同じ遷移を長く反復する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-accelerate-set-operations-with-bitsets': {
    problemId: 'abc221-g',
    rationale:
      'S=ΣD_i とすると、二 target は P=(S+A+B)/2、Q=(S+A-B)/2 である。どちらかが整数でない、負、または S 超過なら不可能と先に判定できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二次元で各操作が x 軸または y 軸方向を選び、符号選択を分離したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-accelerate-tree-dp-by-heavy-path': {
    problemId: 'abc269-ex',
    rationale:
      'heavy path上でg_iをlight childrenのfの積と置くと f_i=x+g_i f_{i+1} となり、path先頭のfはprefix productsの和としてまとめて計算できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。subtreeごとの選び方が子間で独立に直積され、選択個数別の全答えが必要なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-add-conway-number-games': {
    problemId: 'abc229-h',
    rationale:
      '状態 v の白手後継評価の最大値より大きく、黒手後継評価の最小値より小さい最も単純な dyadic rational を eval(v) とすると、正なら先手白が勝つ。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一手が複数領域のうち一領域だけを変え、領域間で合法手が干渉しないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-aggregate-rooted-tree': {
    problemId: 'abc239-e',
    rationale:
      '上位K個だけを求める merge では、各入力集合からK位より下の要素を捨てても、union の上位K個は変わらない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。要求される順位 K に小さい上限があり、集合の merge を繰り返すとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-allocate-by-convex-marginal-costs': {
    problemId: 'abc216-e',
    rationale:
      '貪欲に一回ずつ最大値を取る結果には共通の境界値があり、境界より上は全て選び、境界値だけ必要個数を選ぶ。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数の単調列から大きい要素を多数選ぶが、選択回数そのものが非常に大きいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-answer-idempotent-range-query': {
    problemId: 'abc282-f',
    rationale:
      '2^k≤len<2^{k+1}なので、左右2区間の合計長2^{k+1}はlen以上となりgapがなく、どちらも[L,R]内なのでunionが正確にquery区間になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。idempotent queryやunion表現で、区間を同長power-of-two区間2個へ分けられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-answer-tree-ancestor-queries': {
    problemId: 'abc294-g',
    rationale:
      'd(u,v)=distRoot(u)+distRoot(v)-2distRoot(lca)により、動く重み情報と動かない祖先構造を分離できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分木へ共通に効く辺重みを動的更新する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-apply-formal-power-series-operations': {
    problemId: 'abc260-ex',
    rationale:
      '同色境界が正確に d 個の列数を p_d、指定した n 個以上の同色境界を満たす数を q_n とすると、q_n=Σ_{d≥n}binom(d,n)p_d であり、二項反転で p を得られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。ちょうど d 個成立する対象は数えにくいが、指定した n 個が全て成立する対象なら数えやすいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-apply-heavy-light-decomposition': {
    problemId: 'abc351-g',
    rationale:
      'point cluster は virtual root 配下の子積、path cluster は遠端に値 x の subtree を接続したとき近端 hash が ax+b になる二係数を持てば、rake は積、compress は affine composition にできる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-apply-subset-zeta-mobius-transform': {
    problemId: 'abc295-ex',
    rationale:
      '左から最初に新しい連結が止まる0を境界にすると、prefix全1＋残りfrontier部分集合という互いに重ならない遷移分類になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。幅が小さい格子を行単位で処理し、将来に影響する境界だけを保持する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-approximate-rational-by-euclid': {
    problemId: 'abc333-g',
    rationale:
      'Stern–Brocot木を分母≤Nで切った探索木で、r以下の最大値xとr以上の最小値yは、rの連分数path上にある。連分数の次係数を分母がNを超えない最大値まで進めたsemiconvergentと、その直前境界からx,yを得られ、最適解はこの二つのどちらかである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。実数へ近い有理数を分母上限付きで求めたい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-augment-components-with-metadata': {
    problemId: 'abc279-f',
    rationale:
      'DSU leaderはunion by sizeで変わり得るため、union後に返された新leaderへowner boxを設定し直す。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。集合の併合と、要素が属する集合の外部属性queryが混在するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-balance-heavy-light-threshold': {
    problemId: 'abc219-g',
    rationale:
      '頂点 v を参照する直前に、v の明示値の時刻と v に隣接する全 heavy 頂点の看板時刻を比較すれば、未配布の代入を含む現在値を復元できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。グラフ query の一回の費用が中心頂点の次数に比例し、辺数の総和だけが小さいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-bound-monotone-total-work': {
    problemId: 'abc217-e',
    rationale:
      'heap が空でなければその最小値が必ず列の先頭であり、heap が空になって初めて queue の先頭が列の先頭になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一部の操作だけが既存要素を並べ替え、その後の追加要素は並べ替え済み部分の後ろに残るとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-bound-reachability-in-numerical-semigroup': {
    problemId: 'abc388-f',
    rationale:
      'bad interval間の安全区間I_i=[S_i,T_i]ごとに先頭X_iと末尾Y_iを最大B点だけ保持すれば、外部からの一歩は必ずその境界帯へ着地する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。障害が区間で与えられ、遷移幅が小さいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-balanced-separator-decomposition': {
    problemId: 'abc291-ex',
    rationale:
      '元木のx-yパスが重心を通らない組は同じ除去後成分内に限られるため、成分ごとの再帰結果を重心の子へ接続してよい。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。木を各段階で半分以下の連結成分へ再帰分割したい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-cartesian-tree-decomposition': {
    problemId: 'abc275-ex',
    rationale:
      'node i で追加の全区間攻撃を k 回行うと、k≥max(A_i-j,0) かつ費用は kB_i+F_left(j+k)+F_right(j+k) になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各区間の最大値で操作費用が決まり、最大要素を境に左右が独立するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-component-merge-tree': {
    problemId: 'abc235-ex',
    rationale:
      'm 個の子成分が一つになるとき、独立選択の積に含まれる「各子全体を一回ずつ塗る」X^m は、親全体を一回で塗る同じ集合 X に置き換える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。辺重み閾値ごとの連結成分集合が操作候補となり、その包含階層上で数え上げるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-finite-string-automaton': {
    problemId: 'abc264-g',
    rationale: '状態 xy から文字 z を追加する辺は yz へ進み、重み P(z)+P(yz)+P(xyz) を持つ。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。次の文字を加えた増分が直前の高々L文字だけで決まるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-laminar-interval-containment-tree': {
    problemId: 'abc405-f',
    rationale:
      '点 x を含む初期区間は包含木上で m(x) から根へ並ぶ祖先列そのものであり、クエリ両端の片方だけを含む区間が交差する弦に一致する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。区間同士が交差せず、互いに素か包含のどちらかに限られるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-multi-pattern-automaton': {
    problemId: 'abc419-f',
    rationale:
      'failure link先のoutput maskもnodeへ伝播すれば、ある文字追加で終端するpatternだけでなく、そのsuffixとして同時に出現する短いpatternも一度のORで記録できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数patternのsubstring出現を文字列生成DPの有限suffix状態にしたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-prefix-match-state': {
    problemId: 'abc257-g',
    rationale:
      'Z-algorithmをS+区切り文字+Tへ適用すれば、全開始位置のL_iを合計線形時間で求められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一つのパターンSと文字列Tの全接尾辞との最長共通接頭辞が必要になる。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-shortest-path-certificate': {
    problemId: 'abc218-f',
    rationale:
      '元の最短距離を d とすると、辺削除後の距離は d 以上である。一方 e∉P なら長さ d の P が残るので d 以下でもあり、両方向の不等式から答えは d と決まる。再探索候補は |P|≤N-1 本だけである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。要素を一つ除いた各ケースを問われ、元の最適解が残るケースを判別できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-static-sorted-range-index': {
    problemId: 'abc339-g',
    rationale:
      '完全被覆nodeではsorted配列にupper_bound(X)を行い、そのindexまでのprefix sumを返せば、値≤Xの要素だけの和になる。segment分解されたnodeはindex集合が互いにdisjointなので和を単純加算できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。静的配列に対しindex範囲と値thresholdを同時に指定するqueryが多数ある。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-suffix-automaton': {
    problemId: 'abc433-g',
    rationale:
      'Suffix Automaton の各遷移は表す部分文字列へ一文字追加する操作に対応し、len が増えるため遷移グラフは DAG である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。文字列の全相異なる部分文字列を、末尾への文字追加遷移を保った線形個の状態へ圧縮したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-suffix-lcp-index': {
    problemId: 'abc213-f',
    rationale:
      '必要なのは各 LCP 問合せの値ではなくそれらの総和なので、RMQ を繰り返す代わりに「区間最小値の総和」の問題として処理する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の接尾辞どうしの辞書順関係や共通接頭辞長をまとめて扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-build-virtual-tree': {
    problemId: 'abc340-g',
    rationale:
      'virtual treeで親辺も選ばれるopen状態g_vを考える。子branch選択積P=∏(1+g_child)、ちょうど一子を選ぶ和Q=Σg_childとすると、親接続時は子0ならvがleafなのでg_v=(P-1)+[A_v=c]。vをtopmostとする閉subtreeは子1の時だけvの色条件が必要で、(P-1-Q)+[A_v=c]Qとなる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。特定色の頂点間の祖先・分岐関係だけが必要で、全元頂点を色ごとに走査したくない。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-characterize-bipartite-feasibility-by-hall': {
    problemId: 'abc215-h',
    rationale:
      'g(S) を許可品種集合が S に含まれる一個注文の総数とすると、全注文を満たせる条件は全 S で f(S)−g(S) が非負であることになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数種類の資源を、各要求が受け入れる種類のいずれかへ一対一に割り当てるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-characterize-integer-solvability': {
    problemId: 'abc271-ex',
    rationale:
      '非平行な二vector u,vではdeterminantから係数p,qを一意に求め、割り切れてp,q≥0ならp+qが候補になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数種類の同価操作を可換に組み合わせ、vector relationで同じ結果をより少ない種類へ変形できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-characterize-palindrome-intervals': {
    problemId: 'abc349-g',
    rationale:
      '既に処理したcenterのradius情報で重なるpalindrome内部のequalityをmirrorから再利用し、新しく右端を伸ばす対称pairだけunionすれば、Manacherと同じ償却でunion回数をO(N)にできる。得たcomponent内にinequality edge両端が入れば不可能である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数centerのpalindrome equality区間が大きく重複する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-classify-game-states': {
    problemId: 'abc255-g',
    rationale: '例外でないnでは、直前の例外値bar nからg(n)=n-bar n+h(bar n)と連続的に増える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数の独立な山から一つを選んで動かす不偏ゲームで勝敗を求める。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-color-and-classify-bipartite-components': {
    problemId: 'abc398-e',
    rationale:
      'connected bipartite graphへcross-part edgeを追加しても同じ二部分彩色が有効なので、別候補の合法性は変化しない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各手が独立な候補を一つ消し、他候補の可否を変えないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compare-algebraic-objects-by-random-fingerprint': {
    problemId: 'abc238-g',
    rationale:
      'a_p XOR b_p XOR (a_p XOR b_p)=0 なので、連続する素因数出現を三個周期で符号化すると、任意区間の p の指数が 3 の倍数の場合だけ寄与が必ず消える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。積が完全 k 乗かを多数区間で判定したいが、全素数の指数ベクトルを明示できないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compare-sequences-by-rolling-fingerprint': {
    problemId: 'abc331-f',
    assessmentMethod:
      'ABC274 Exを転移題材とし、加算がXORと一致する体の乗算・減算をO(1)で使える部分問題を与える。体の構成は課さない。二つの区間列の要素ごとのXORと第三の区間列を、共通の基数によるprefix hashとLCP探索で辞書順比較する手順を導く。',
    assessmentProcedure: [
      '同じ長さ・同じ指数位置に揃えたhashを使う。体の分配則からh(A XOR B)=h(A)+h(B)となる。普通の素数法の加算を整数XORと同一視してはいけない。',
      '各prefixのhashを前計算し、h(S[l:r])=H[r]-H[l]b^(r-l)で区間を正規化する。二つの区間hashの和と第三の区間hashの等値を比較する。',
      '真のprefix一致は長さに関して単調なので、hash衝突がない事象の下で最長一致長を二分探索する。先頭不一致位置の元の整数値を直接比較し、全長一致なら同値とする。',
      '前計算O(N)、一比較O(log N)回の体演算。等値試験の総数と差の多項式次数から衝突確率を界す。体演算のAPIを実装する費用は、この部分問題の計算量から分離する。',
    ],
    rationale:
      'nodeを(forward hash, backward hash, power=x^length)とし、S+Tではforward=S.f×T.power+T.f、backward=S.b+S.power×T.bとすれば結合順を保てる。',
    scope:
      '連結順を保つhashと逆順hashの構成・比較を取り出す。更新用segment treeの実装はrange monoidの節で扱う。',
    walkthrough: [
      '文字を体F_pの異なる元へ写し、基数bに対してh(s)=s_0 b^(n-1)+…+s_(n-1)と定める。h(st)=h(s)b^|t|+h(t)なので、文字の順序と長さを保って連結できる。',
      '各列を(f,r,q)=(順方向hash,逆方向hash,b^長さ)で要約する。SとTの連結は(f_S q_T+f_T, r_S+q_S r_T, q_S q_T)。長さ0は(0,0,1)であり、逆向き側の結合順が反転することを確認する。',
      '静的な列ではH[i]=h(S[0:i])と基数冪を前計算すると、h(S[l:r])=H[r]-H[l]b^(r-l)をO(1)で取り出せる。比較する列の長さと指数位置を揃える。',
      '回文なら順方向と逆方向のhashは等しい。例えばabaは常に一致するが、異なる列でも衝突し得る。固定された長さLの異なる二列と一様な非零基数に対し、差の非零多項式の次数は高々L-1なので、衝突確率は高々(L-1)/(p-1)。多数比較ではその総数も含めて評価する。',
      'ABC331 Fではこの要約を順序を保つ区間集約に載せると更新と回文queryを扱える。ここでは要約と結合式までを導出し、後続のデータ構造からそのまま再利用する。',
    ],
  },
  'outcome-compose-dynamic-tree-clusters': {
    problemId: 'abc351-g',
    rationale:
      'point cluster は virtual root 配下の子積、path cluster は遠端に値 x の subtree を接続したとき近端 hash が ax+b になる二係数を持てば、rake は積、compress は affine composition にできる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compose-finite-functions': {
    problemId: 'abc261-e',
    rationale:
      'i 番目の手続きは操作 i だけでなく合成済みの操作 1,…,i を前回の X に再適用するため、prefix 関数そのものを保持する必要がある。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。AND・OR・XOR だけからなる操作列で、bit 間の桁上がりや依存がないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compose-series-and-project-powers': {
    problemId: 'abc387-g',
    rationale:
      'rootに付く独立な子構造はx exp F、rootを含むprime cycleはその構造をp個環状に並べ、二方向の対称性で2除算する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。labelled connected構造がroot周りのsetとcycle blockへ分解できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compress-sparse-keys': {
    problemId: 'abc374-f',
    rationale:
      '注文 j を i より先に出しても不満度は改善しないので、到着順の prefix を順番に処理する最適解へ交換できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。時刻上限は巨大だが、最適行動が入力時刻と固定間隔からしか起きないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-convolution-or-correlation': {
    problemId: 'abc265-ex',
    rationale:
      '全体評価 (S,G)=(Σs_i, XOR g_i) に対し、先手勝ちは S>0 または S=0かつG>0 で特徴付けられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数の独立局面から毎手一つを選ぶゲームで、局面ごとにpartisan値とimpartial値へ分解できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-directed-walk-period': {
    problemId: 'abc306-g',
    rationale:
      '全edgesでd_v≡d_u+1 mod aなら任意closed walk長はaの倍数で、違反edgeがあればtree pathsと組み合わせてa非倍数のclosed walkを作れる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。同じvertexへ戻るwalkの可能lengthを巨大なexact値について判定したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-in-finite-field-extension': {
    problemId: 'abc274-ex',
    rationale:
      'hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数のsubstring/virtual sequenceをlexicographically比較し、prefix equalityを高速判定できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-in-modular-arithmetic': {
    problemId: 'abc228-e',
    rationale:
      'M≡0 (mod P) のとき指数K^Nは正なので答えは0である。この場合に指数をP-1で簡約すると、余り0から誤って0^0を扱う可能性があるため先に分岐する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。素数法Pの下で、Pと互いに素な底を巨大な指数へ累乗したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-online-relaxed-convolution': {
    problemId: 'abc213-h',
    rationale:
      '普通の一括畳み込みでは d 自身が未確定なので計算できないが、分割統治なら左区間の確定値だけを右区間へ送れる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。時系列 DP の現在値が過去列との畳み込みで定まり、全入力列を一度に確定できないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-subset-convolution': {
    problemId: 'abc294-ex',
    rationale:
      '彩色多項式の削除縮約F(G)=F(G-e)-F(G/e)と、独立集合への色クラス分割という二表現を疎グラフの次数に応じて使い分ける。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。グラフ彩色数を辺削除と端点縮約へ分解する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-compute-transitive-closure': {
    problemId: 'abc287-ex',
    rationale:
      '最大頂点番号を最小化する問題は、番号k以下を使用可能にする単調なthreshold判定として見ると、最初に到達可能になるkが答えになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。path costが使用要素の最大keyで、許可thresholdに対し可否が単調なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-condense-and-order-directed-graph': {
    problemId: 'abc214-h',
    rationale:
      '頂点 u の in から out へ、容量 1 の報酬辺と容量無限の無報酬辺を並べると、訪問回数にかかわらず X_u を高々一度だけ獲得できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有向グラフで同一強連結成分内を自由に巡回でき、頂点資源をまとめて回収できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-construct-degree-parity-subgraph': {
    problemId: 'abc345-f',
    rationale:
      'postorderで非root頂点vがoffならparent edgeをtoggleしてvをonに固定してからvを切り離す。この操作はvをoff→on、parentをtoggleするので全体on数は0または2増え、component終了時にはroot以外全てon、parityによりちょうど2floor(s/2)個onになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一操作が各component内のbitを二つ反転する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-construct-euler-trail-or-circuit': {
    problemId: 'abc227-h',
    rationale:
      '辺eの通過回数x_eを多重辺数とみなすと、各頂点の次数は2A_vで全て偶数になる。正の多重辺のsupportが連結ならEuler閉路が存在し、その各出発がちょうど1缶を消費するので元の行動列へ戻せる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各頂点での訪問・出発回数が指定され、実際のwalkを構成する問題で、順序より辺の使用回数を先に決められるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-construct-optimal-spanning-tree': {
    problemId: 'abc218-e',
    rationale:
      'Kruskal 法で両端が既に同じ成分にある辺は連結維持には不要であり、その重みが正のときだけ削除する価値がある。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。要素を削る利益を最大化しつつ、残した集合が連結などの被覆条件を満たすとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-contract-monotone-paths-with-jump-pointers': {
    problemId: 'abc295-g',
    rationale:
      '各SCCは元の有向木上の連結部分木で、xから到達できる最小番号はx所属SCCの最上位頂点になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。辺追加でSCCが分裂せず併合だけする。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-correct-overlap-by-inversion': {
    problemId: 'abc214-g',
    rationale:
      'p と q がともに順列なので、値を頂点とする全体グラフでは各頂点の次数が高々 2 となり、非自明な連結成分はパスかサイクルに限られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各位置に少数の禁止値があり、それらを全て避ける順列の個数を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-combinatorial-objects-by-determinant': {
    problemId: 'abc216-h',
    rationale:
      '終点 y_j を固定したとき、始点 x_i からのパス数は右移動回数を選ぶ C(N,y_j−x_i) であり、LGV により非交差な K 本組はその行列式になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。DAG 上で順序付けられた複数始点・終点間の頂点非共有パス組を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-euler-circuits-by-best': {
    problemId: 'abc336-g',
    rationale:
      '始点・終点候補を8通りずつ調べ、degree差がEuler trail条件を満たす場合は終点から始点への補助辺を加えてEuler閉路へ帰着できる。区別された辺の閉路数はBEST定理の有向全域木数×∏(outdeg(v)-1)!で、全域木数は有向Laplacian minorの行列式になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。固定長substringの出現回数を指定された列を数える。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-implicit-binary-tree-layers': {
    problemId: 'abc321-e',
    rationale:
      'countDesc(v,d)はmax(0,min(N+1,(v+1)2^d)-v2^d)で、label上限Nとの区間intersectionだけになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。親i/2・子2i,2i+1で巨大treeが番号だけ与えられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-labeled-structures-by-components': {
    problemId: 'abc213-g',
    rationale:
      '連結グラフ数 f(S) は全グラフ数から、固定した基準頂点を含む真部分集合 T がその連結成分になる場合を全て引けば得られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。全グラフの数は容易だが、頂点集合全体が連結な場合だけを数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-orbits-by-fixed-points': {
    problemId: 'abc284-ex',
    rationale: 'cycle長列d_1..d_mに対し、固定されるc色彩色は各cycleの色を選ぶc^m通りである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。labelの置換で同一視した構造を数え、自己同型の大きさが対象ごとに異なるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-prefix-constrained-objects': {
    problemId: 'abc235-f',
    rationale:
      '新しい数字 d を末尾へ付けると、総和は旧総和×10＋旧個数×d で更新できるため、完成数を個別に保持しなくてよい。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。上限 N 以下の整数について、十進表記に特定数字が現れる条件を数え上げるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-count-through-cyclic-exponents': {
    problemId: 'abc212-g',
    rationale:
      'an≡b (mod m) が n について解を持つのは gcd(m,a) が b を割るときに限る。したがって固定した a から到達できる b は m/gcd(m,a) 個であり、a の gcd ごとに寄与をまとめられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。素数法の非零剰余に積と冪が現れるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-decompose-by-prime-or-divisor': {
    problemId: 'abc227-g',
    rationale:
      'C(N,K)=N(N-1)…(N-K+1)/K!なので、素数pごとの指数は分子区間の指数総和からK!の指数を引けばよく、巨大な積を持つ必要がない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。巨大な整数の積や組合せ数そのものではなく、約数個数・平方性・割り切れ方を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-decompose-finite-field-frobenius-orbits': {
    problemId: 'abc251-ex',
    rationale: '7^t行上がる変換は、位置jの値を現在列のjとj+7^tの和にする二つのシフトだけで表せる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。法pのパスカル変換をpの冪単位で高速化したい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-decompose-functional-graph': {
    problemId: 'abc241-e',
    rationale:
      '同じ residue に戻った二時点 s<t の間では状態遷移だけでなく加算する A の列も同じになり、cycle gain は prefix[t]-prefix[s] である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有限状態で各状態の次状態が一意、操作回数だけが非常に大きいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-decompose-ranges-into-segment-tree-nodes': {
    problemId: 'abc244-ex',
    rationale:
      '追加-only 集合は時刻 index の prefix なので、segment tree の range decomposition を使えば一つの query を O(log Q) 個の静的点集合 query へ分解できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。固定点集合に対し、様々な方向 vector との最大内積を問うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-derive-updateable-aggregate': {
    problemId: 'abc213-f',
    rationale:
      '必要なのは各 LCP 問合せの値ではなくそれらの総和なので、RMQ を繰り返す代わりに「区間最小値の総和」の問題として処理する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の接尾辞どうしの辞書順関係や共通接頭辞長をまとめて扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-and-bound-randomized-algorithm': {
    problemId: 'abc272-g',
    rationale:
      'candidateは推測だけで返さず、A_i mod Mのfrequencyが実際にN/2を超えるかO(N)で検証するためfalse positiveはない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。未知のgood subsetが全体の半数超を占め、その中の少数sampleから答え候補を生成できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-associative-range-summary': {
    problemId: 'abc223-f',
    rationale:
      'minPrefix は空 prefix を含めて定義する。左 (s_L,m_L) と右 (s_R,m_R) の結合は (s_L+s_R,min(m_L,s_L+m_R))、identity は (0,0) となり、結合順を逆にできない非可換 monoid である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分括弧列の正当性を判定するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-carry-or-mixed-radix-dp': {
    problemId: 'abc231-e',
    rationale:
      '支払い額 Y 自体を探索せず、各額面で生じる繰り上がりを 0 または 1 の状態として追う貨幣版の桁 DP と考える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。単位が次の単位を割り切り、目標値を過不足の両方で表して支払いと釣銭を最小化するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-frontier-profile-dp': {
    problemId: 'abc248-f',
    rationale:
      '状態 0 からは新しい 3 辺のうち 3 本または任意の 2 本を残すと状態 0、横辺 a_i,b_i の片方だけを残す 2 通りが状態 1 になる。両横辺を消す遷移は過去成分を孤立させる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。幅が小さい graph を一方向に構築し、連結性を保つ辺選択を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-grid-table-dp': {
    problemId: 'abc311-e',
    rationale:
      '穴マスでは dp=0、通常マスでは dp=min(dp_up,dp_left,dp_diag)+1 とすれば、新たに加わる下辺・右辺も三小正方形の和で覆われる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。固定した端点に対する有効サイズが 1..k の prefix をなす図形を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-interval-split-dp': {
    problemId: 'abc217-f',
    rationale:
      '左端と位置 2k の生徒が仲良しなら、内側 k-1 組の処理後にその二人を消す k 操作と、右側 j-k 操作を二項係数 C(j,k) 通りに interleave できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。隣接要素の削除によって元の列の区間が独立に閉じ、最終的な対応が非交差になるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-minimal-sufficient-state': {
    problemId: 'abc215-e',
    rationale:
      '同じ文字を続ける遷移だけは使用済みでも許し、別文字へ移った後の再登場を mask で禁止する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。種類数が小さく、各種類を使ったかどうかが将来の可否を決めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-order-preserving-dp': {
    problemId: 'abc214-f',
    rationale:
      '通常の部分列 DP における最終出現による重複排除と、隣接位置を選べないことによる一つ手前までの遷移制限を同時に適用する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。異なる位置選択が同じ文字列を作り得るため、相異なる部分列だけを数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-query-code-by-information-bound': {
    problemId: 'abc337-e',
    rationale:
      'M=ceil(log2 N)なら0,…,N-1は全てM bitで一意である。友人iへi bit目が1のbottleだけ飲ませると、腐ったbottle xによる体調列Sはxのbinary表現と完全に一致する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一回の非adaptive検査で各参加者から0/1だけが返る。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-range-update-action': {
    problemId: 'abc237-g',
    rationale:
      '区間の 1 の個数を S とすれば、昇順ソート後は末尾 S 個だけが 1、降順ソート後は先頭 S 個だけが 1 になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。大小関係だけを使う更新後に、特定値の順位上の位置だけを追いたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-resource-dp': {
    problemId: 'abc216-f',
    rationale:
      '最大値という集合全体の条件を、最大を担当する一要素 i の固定へ変えると、残りは加法的な B のナップサック条件になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分集合条件に最大値または最小値が現れ、各集合を一意な極値要素で分類できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-design-state-transition': {
    problemId: 'abc212-e',
    rationale:
      '密な許可関係をそのまま扱うのでなく、「全候補から疎な禁止集合を引く」という補集合側の表現に反転する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。許される遷移がほぼ全てで、禁止される遷移だけが少数列挙されているとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-detect-crossing-by-cyclic-order': {
    problemId: 'abc338-e',
    rationale:
      '左端を見たchordをpushし、右端iを見た時にstack topがiでなければ、iの内側で開始した別chordがまだ閉じておらずA_i<A_j<B_i<B_jとなる。逆にtopが常に一致すれば全区間は正しくnestedし交差しない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。円周上の端点の交互配置を線形順序で判定したい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-determinize-automaton-by-subsets': {
    problemId: 'abc228-g',
    rationale:
      '集合Sと次の数字dから、dと書かれた辺でSのいずれかに隣接する反対側頂点全体が次集合として一意に決まる。この決定的遷移により、経路の曖昧さを集合へ吸収できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。行と列を交互に選び、交点の情報を出力する操作が続くとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-divide-search-space-recursively': {
    problemId: 'abc282-ex',
    rationale:
      'l≤M≤rなら条件はPB[r]-PB[l-1]≤S-A_Mとなり、l固定ではrのvalid集合がprefix、r固定ではlのvalid集合がsuffixになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。subarray costにminimum/maximumが含まれ、そのextremum位置を含む区間で値を固定できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-dualize-planar-cut-to-path': {
    problemId: 'abc413-g',
    rationale:
      '外側faceはsource-target間のboundary arcで二つにsplitし、top+right側を一端子、left+bottom側を他端子とする。この二端子を結ぶdual pathがprimalのs-t cutになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。平面graphの二点間path存在を、cutを横切るdual pathで判定したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-encode-counting-by-generating-function': {
    problemId: 'abc222-h',
    rationale:
      '根が1の木の母関数を A、根が0の許容部分木を B とすると、子の置き方から B=2A+A^2、A=x(1+A+B)^2=x(1+3A+A^2)^2 を得る。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。木を根の型と左右の独立な部分木へ分解でき、サイズ別個数の畳み込みが現れるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-encode-labeled-trees-by-prufer-code': {
    problemId: 'abc303-ex',
    rationale:
      '許容出現回数集合R={d-1 | dは許容次数}に対しF(x)=Σ_{r∈R}x^r/r!と置く。各labelの出現回数を合計N-2にするmultinomial係数が係数へ組み込まれるため、答えは(N-2)!·[x^(N-2)]F(x)^Nとなる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。label付き木の次数だけに条件があり、辺配置を直接扱う必要がない。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-encode-threshold-constraints-as-two-sat': {
    problemId: 'abc277-ex',
    rationale:
      'L≤X_A+X_Bは全整数tについて P_{A,t}∨P_{B,L-t+1}、X_A+X_B≤Rは ¬P_{A,t}∨¬P_{B,R-t+1} と同値になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。小範囲整数変数への大小・和不等式をboolean制約へ落としたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-enumerate-bounded-candidates-or-cases': {
    problemId: 'abc227-f',
    rationale:
      'Xが大きい方からK番目なら、Xより大きい値の個数はK未満で、X以上の値の個数はK以上である。したがって全ての>Xと必要個数の=Xを採用すれば、採用値は上位K個と一致する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。集合や経路の最大側K個の和など、順位で選ばれる要素の総和を最適化するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-enumerate-by-reversible-backtracking': {
    problemId: 'abc284-e',
    rationale:
      '頂点vへ入った瞬間のstackは始点1からvまでの新しい単純pathなので、長さ0のpathも含めて各呼出しを1回数えればよい。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。単純pathや重複なし列を列挙し、使用済み集合が現在候補にだけ依存するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-enumerate-frontier-best-first': {
    problemId: 'abc297-e',
    rationale:
      '次の金額の買い方から一個外せば既に確定済み以下の金額になるため、確定集合から一手足した候補だけ見れば十分。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。非負加算で生成される半群の小さい値を順に列挙する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-enumerate-subset-state-space': {
    problemId: 'abc232-f',
    rationale:
      'x を次に置くと、まだ未使用で x より小さい元添字は全て後ろへ来るので、その個数が x を左端とする転倒数としてこの時点で確定する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二種類の操作が交換可能で、片方を全て先に寄せると最終構造を離散的に表せるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-evaluate-adversarial-game-value': {
    problemId: 'abc349-e',
    rationale:
      'terminalで同色三目があればその色のplayerが勝ち、全埋まりならred取得weight和とblue取得weight和を比較する。非terminalでは一つでもcurrent player勝利となるchildがあれば勝ち、全childが相手勝利なら負ける。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。運要素がなく、双方が勝利を目的に最適行動し、state遷移がacyclicである。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-evaluate-compressed-integer-blocks': {
    problemId: 'abc240-f',
    rationale:
      'A(n)-A(n-1)=B_0+xn なので、x<0 のとき最大点はこの値が非負である最後の n とその隣にあり、微分ではなく整数差分で境界を決められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。同じ値が巨大回数続く累積和を扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-evaluate-polynomial-at-many-points': {
    problemId: 'abc272-ex',
    rationale:
      "indexを反転したDPの母関数f_iは f_i=x(f_{i−1}+f'_{i−1})+C_i f_{i−1} を満たし、g_i=f_i e^xなら係数ごとに g_{i,j}=(j+C_i)g_{i−1,j} と分離する。",
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一つの高次polynomialを連続する多数の点で評価すればDP coefficientsを得られるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-evolve-run-length-encoded-state': {
    problemId: 'abc313-e',
    rationale:
      '末尾から一文字消える各時刻に、直前の非1数字 x はその左の 1 を x 倍へ写すため、左 run の増分を (x−1)×残り時刻としてまとめられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。文字列操作が同じ文字の連続区間を一様に伸縮し、展開後長が巨大になるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-exploit-modular-periodicity': {
    problemId: 'abc228-e',
    rationale:
      'M≡0 (mod P) のとき指数K^Nは正なので答えは0である。この場合に指数をP-1で簡約すると、余り0から誤って0^0を扱う可能性があるため先に分岐する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。素数法Pの下で、Pと互いに素な底を巨大な指数へ累乗したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-exponentiate-associative-composition': {
    problemId: 'abc448-e',
    rationale:
      'R_{a+b}=R_a×10^b+R_b なので、(10^len,R_len) の pair は文字列結合と同じ結合則を持つ。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。巨大長の同一桁列や文字列値を composite modulus 上で扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-exponentiate-transition-over-semiring': {
    problemId: 'abc236-g',
    rationale:
      '(P⊗Q)_{ij}=min_k max(P_{ik},Q_{kj}) は、前半と後半の walk を中継点 k で連結したときの bottleneck 最小化そのものである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。固定長 walk の DP 遷移が結合的な二演算で行列積と同じ形になり、長さが巨大なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-extract-rational-series-coefficient': {
    problemId: 'abc300-ex',
    rationale:
      'Q(x)Q(-x)が偶多項式になるため、係数の偶数/奇数抽出後も次数K以下の有理式としてNTT畳み込みで更新できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。線形漸化式の巨大index項を高速取得する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-factor-and-accelerate-transitions': {
    problemId: 'abc212-e',
    rationale:
      '密な許可関係をそのまま扱うのでなく、「全候補から疎な禁止集合を引く」という補集合側の表現に反転する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。許される遷移がほぼ全てで、禁止される遷移だけが少数列挙されているとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-factor-separable-linear-transform': {
    problemId: 'abc212-h',
    rationale:
      '求める勝ち局面を直接数えるより、総列数から XOR が 0 の負け局面数を引くと Nim の判定条件をそのまま使える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数の山から一山だけ選んで正の個数を減らす通常プレイのゲームを扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-find-orbit-hit-by-bsgs': {
    problemId: 'abc270-g',
    rationale:
      'affine mapsはpair(a,b)で表し、compositionによりf^MもO(M)またはbinary exponentiationで一つのaffine mapとして得られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。invertible functionの反復でf^n(x)=yとなる最小nを、状態空間全走査より速く求めたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-find-period-by-multiplicative-order': {
    problemId: 'abc222-g',
    rationale:
      "gcd(10,M')=1 のとき求める n は ord_{M'}(10) である。これは有限群 (Z/M'Z)^× の元の位数なので φ(M') を割り、φ(M') の約数を昇順に調べて最初に 10^d≡1 となる d が最小解である。",
    scope:
      'ここでは次の局所的な観察から対象技能を導く。同じ桁の反復や等比数列が a^n≡1 の最小指数へ帰着するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-flatten-tree-by-euler-order': {
    problemId: 'abc240-e',
    rationale:
      '最適値を決めるのは頂点数ではなく、互いに素な最小部分木である葉の個数であり、内部頂点は葉区間の包として新しい整数を消費しない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分木や連結な再帰部分が並び順上の区間になる表現を作りたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-formulate-combinatorial-coefficients': {
    problemId: 'abc217-g',
    rationale:
      '既存 j グループのうち禁止されるのは同余りの先行者が一人ずついる floor((i-1)/M) グループであり、合流可能数は j-floor((i-1)/M) である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。ラベルなしグループへの分割を数え、新要素が singleton を作る場合と既存群へ入る場合に分けられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-identify-bridges-and-articulations': {
    problemId: 'abc301-ex',
    rationale:
      'w<Dなら更新後も≤D、w>Dなら最適pathは対象辺を使わない。w=Dだけ「D以下pathからその辺を除けるか」というbridge問題になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。path costが最大辺重み。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-identify-reusable-abstraction': {
    problemId: 'abc214-e',
    assessmentProblemId: 'abc215-f',
    assessmentMethod:
      'ABC215 Fを転移題材とし、点対のmin(|x_i-x_j|,|y_i-y_j|)を最大にする問題を、閾値dに対する二条件の同時充足へ言い換える。高速な判定器は課さない。変換前後で同じ点対が解になることと、dを下げたときの可否を説明する。',
    assessmentProcedure: [
      'min(|Δx|,|Δy|)≥dと、|Δx|≥dかつ|Δy|≥dが同値であることを両方向に示す。',
      '和や最大値の距離条件へ置き換えると同値でなくなる反例を作る。例えば|Δx|=0,|Δy|=10は正のdに対して不適格である。',
      'dで適格な点対は小さい閾値でも適格である。判定器を全点対O(N²)で作れば小さい入力の検算ができ、高速化は後続の二分探索・走査の課題となる。',
    ],
    rationale:
      '区間内へ球を置く条件を、許容時間窓を持つ単位時間の仕事の割当てへ言い換えるだけで、対象・操作・制約の対応を検証できる。',
    scope:
      '区間と整数枠へのモデル変換までを扱う。最早締切の貪欲法とheap実装はgreedy・event sweepの節で学ぶ。',
    walkthrough: [
      '観察: 球iの行き先は整数x_i∈[L_i,R_i]であり、異なる球に同じ整数を使えない。',
      '候補の比較: 配置順をすべて試す前に、球を単位時間の仕事、整数を時刻、区間を実行可能時間窓へ写す。',
      '不変量: 各球と各仕事、各箱と各時刻が一対一に対応し、同時刻に二仕事を割り当てない条件が箱の重複禁止と一致する。',
      '確認: [1,1]の球が二個なら一枠に二仕事が必要で不可能。[1,2]が二個なら時刻1,2への割当てが配置を与える。変換はO(N)で、値域全体を列挙する必要はない。',
    ],
  },
  'outcome-index-shared-prefixes-with-trie': {
    problemId: 'abc287-e',
    rationale:
      'ある深さのprefixを共有する文字列が2本以上なら、その全ては少なくともその深さまで誰かと一致し、1本になった直前の深さが最大値になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数文字列について共有prefixの深さをまとめて追いたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-invert-divisor-lattice-by-mobius': {
    problemId: 'abc230-g',
    rationale:
      'num(a,b) を i が a の倍数かつ P_i が b の倍数となる位置数とすると、i≤j の組数は num(a,b)(num(a,b)＋1)/2 になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。GCD が 1、または 1 でないという条件を約数の倍数条件へ分解したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-jump-deterministic-transition': {
    problemId: 'abc212-f',
    rationale:
      '旅程は時刻とともに前へ進み、バスを頂点とすると各頂点の後継が高々一つの関数グラフとして表せる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各状態から次状態が一意で、同じ遷移を多数のクエリから長距離たどるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-kernelize-near-tree-graph': {
    problemId: 'abc419-g',
    rationale:
      'terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。指定terminal間simple pathに絶対含まれない枝を除きたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-linearize-events': {
    problemId: 'abc231-f',
    rationale:
      'A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。点対に x の一方向不等式と y の逆方向不等式が同時に課されるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-linearize-static-range-information': {
    problemId: 'abc260-g',
    rationale:
      '水平区間の開始印は (s,t) から下へ M 行続き、終了印は (s,t＋2M),(s＋1,t＋2M−2),… と傾き二の対角線を進む。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。同じ形の斜辺付き領域を大量に加算し、境界が少数の格子方向へ揃っているとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-localize-change-impact-by-witness': {
    problemId: 'abc218-f',
    rationale:
      '元の最短距離を d とすると、辺削除後の距離は d 以上である。一方 e∉P なら長さ d の P が残るので d 以下でもあり、両方向の不等式から答えは d と決まる。再探索候補は |P|≤N-1 本だけである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。要素を一つ除いた各ケースを問われ、元の最適解が残るケースを判別できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-connectivity-components': {
    problemId: 'abc238-e',
    rationale:
      '差 b_v−b_u が既知である関係は、値そのものを保持しなくても u と v の間を移動できる無向辺として扱える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の区間和が与えられ、特定区間の和を既知情報から復元できるか判定するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-interactive-query-protocol': {
    problemId: 'abc305-f',
    rationale:
      'judgeがadaptiveでも、過去に提示された隣接関係と矛盾しない連結グラフが存在する限り、DFSは現在見えた辺だけを使うので同じ論理で進められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。探索先の隣接情報が訪問時にだけ判明し、移動そのものも辺に沿って行う必要があるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-local-sequence-links': {
    problemId: 'abc344-e',
    rationale:
      'distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。既知node位置での挿入・削除を頻繁に行い、最後に順序走査したい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-modular-product-under-factor-updates': {
    problemId: 'abc411-e',
    rationale:
      'threshold v で dice j が許す面数を B_j とすると P[max≤v]=Π_j B_j/6^N。各 B_j は0..6だけなので非零積は逆元で差し替えられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。独立変数の最大値の期待値を求め、閾値以下確率が簡単なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-monotone-window': {
    problemId: 'abc250-f',
    rationale:
      '面積を2倍した外積和で保持すれば、四分の一との差は|全体の2倍面積-4×部分の2倍面積|として整数だけで比較できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一方の端点を固定した部分面積が他方の端点に対して単調に変化する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-order-through-crossing-events': {
    problemId: 'abc344-g',
    rationale:
      '現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。parameter Aの変化に伴いlinear keyのsorted orderが変わり、多数の同parameter queryがある。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-ordered-interval-partition': {
    problemId: 'abc255-ex',
    rationale:
      '値dのブロック[l,r]からの収穫量は(D-d)Σ_(i=l)^r i=(D-d)(l+r)(r-l+1)/2と閉形式で計算できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。巨大な座標域への区間代入があり、値が区間ごとに一定となる。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-ordered-set-statistics': {
    problemId: 'abc281-e',
    rationale:
      '新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。動的multisetの小さい方K個と残りを分け、その集約値を維持したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-piecewise-linear-convex-function': {
    problemId: 'abc217-h',
    rationale:
      '移動更新 min_{|y-x|≤ΔT} f(y) は凸関数の最小値を取る区間を左へ ΔT、右へ ΔT だけ広げ、関数値の最小値自体は変えない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。最小化 DP の状態が一次元座標で、遷移が凸区分線形関数への hinge 加算や区間 min-plus 畳み込みとして書けるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-potential-differences': {
    problemId: 'abc328-f',
    rationale:
      'find時にparent pathの差も加算して圧縮すれば、pot[v]=X_v-X_rootを取得でき、同rootならX_a-X_b=pot[a]-pot[b]である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。onlineに差分等式pot(a)-pot(b)=dを追加し整合性を判定するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-queue-aggregate-with-swag': {
    problemId: 'abc456-f',
    rationale:
      "隣り合う休日間を2日以上空けない条件は、現在日を休まない状態が直前休日状態からだけ遷移する式 dp0'=dp1 を与える。",
    scope:
      'ここでは次の局所的な観察から対象技能を導く。短い状態DPを多数の連続windowで再評価したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-sparse-domain-segment-tree': {
    problemId: 'abc403-g',
    rationale:
      '左の個数が偶数なら親の odd=left.odd+right.odd、even=left.even+right.even、奇数なら右の odd/even を交換して足す。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。座標域は巨大だが、オンライン点更新で実際に触る座標数が少ないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-weighted-prefix-statistics': {
    problemId: 'abc221-e',
    rationale:
      '部分列全体を DP 状態にせず、最初と最後だけを固定すると中間選択が独立な二択になり、その個数が端点間距離だけの冪になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分列の条件が最初と最後だけに依存し、中間要素の採否が自由なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-maintain-xor-linear-basis': {
    problemId: 'abc223-h',
    rationale:
      '右端 r のprefixから、各suffixのspanが変化する添字だけを残すと、その集合は全prefixのspanの基底であり、添字が l 以上のものだけで span(A_l,…,A_r) を生成できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。部分集合XORの実現可能性を問われ、値のbit幅が小さく固定されているとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-match-binary-tree-ancestors': {
    problemId: 'abc254-ex',
    rationale:
      'Aの余剰はどの末尾ビットでも削除して親へ上げられるが、Bの余剰は現在節点へ入る辺が0の場合だけ親へ上げられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。整数操作が二進表記の末尾追加・削除として表せる。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-merge-small-into-large': {
    problemId: 'abc329-f',
    rationale:
      'set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。集合union queryが続き、片方containerを空にできるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-minimize-maximum-xor-by-bit-partition': {
    problemId: 'abc281-f',
    rationale:
      'bit bが混在するとanswerへ2^bが確定し、x_b=0ならinput bit1 group、x_b=1ならbit0 groupだけが最大候補として下位bit比較に残る。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。共通xとのXOR後のmin/maxを最適化し、値域が固定bit幅のとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-and-compute-shortest-path': {
    problemId: 'abc213-e',
    rationale:
      '壊した壁を永続的な盤面状態として追う代わりに、パンチ一回で到達可能になる近傍マスへの有料辺へ操作を畳み込む。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。グラフの辺重みが 0 と 1 だけで、頂点までの最小費用を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-and-exploit-graph': {
    problemId: 'abc212-f',
    rationale:
      '旅程は時刻とともに前へ進み、バスを頂点とすると各頂点の後継が高々一つの関数グラフとして表せる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各状態から次状態が一意で、同じ遷移を多数のクエリから長距離たどるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-and-exploit-tree': {
    problemId: 'abc220-e',
    rationale:
      '残り高さ H=N-1-d に対し、0<k<D の有効範囲は max(1,D-H)≤k≤min(D-1,H) という一つの整数区間になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。暗黙の完全二分木で距離を固定した頂点対を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-max-flow-min-cut': {
    problemId: 'abc225-g',
    rationale:
      'source→cellに容量Aを張るとcellを未選択側へ置くcut費用になり、cell→斜め前cellの容量Cは前者だけ選択したrun開始時に限って切られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。隣接する選択要素を一操作でまとめられ、費用が連結成分やrunの個数で決まるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-min-cost-flow': {
    problemId: 'abc214-h',
    rationale:
      '頂点 u の in から out へ、容量 1 の報酬辺と容量無限の無報酬辺を並べると、訪問回数にかかわらず X_u を高々一度だけ獲得できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有向グラフで同一強連結成分内を自由に巡回でき、頂点資源をまとめて回収できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-model-string-state': {
    problemId: 'abc213-f',
    rationale:
      '必要なのは各 LCP 問合せの値ではなくそれらの総和なので、RMQ を繰り返す代わりに「区間最小値の総和」の問題として処理する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の接尾辞どうしの辞書順関係や共通接頭辞長をまとめて扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-normalize-equivalent-states': {
    problemId: 'abc219-f',
    rationale:
      'a≠0 としたとき q=floor(X/a)、s=X-qa、t=Y-qb を使うと、二点の (s,t) が等しいことと差が v の整数倍であることが同値になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。同じ移動列を非常に多く繰り返し、一周期後の変位が一定であるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-normalize-string-to-primitive-period': {
    problemId: 'abc312-ex',
    rationale:
      '周期 p が |S| を割り、S[j]=S[j−p] を満たす最小 p を Z 値から選べば、prefix 長 p が一意な primitive root になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。文字列の任意回反復同士の等価性・衝突を扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-by-lagrangian-relaxation': {
    problemId: 'abc305-ex',
    rationale:
      'problem pの追加によるfatigue増分は、既存集合が大きいほど前後のaffine composition係数が大きくなり増加するため、fはsupermodularになる。',
    scope:
      '個数別最小費用f(k)を定義した後の離散凸性の証明、penalty oracle、個数の境界探索を扱う。操作の順序付けとoracle高速化は別工程として区別する。',
  },
  'outcome-optimize-by-line-envelope': {
    problemId: 'abc228-h',
    rationale:
      'R_i=Σ_{j≤i}C_jとすると、区間(l,r]を高さA_rへそろえる最終面積は(R_r−R_l)A_rである。全体で元面積ΣA_iC_iを最後に引けば、追加する棒の枚数と種類ごとの固定費XだけをDPできる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。値を一方向にだけ変更でき、異なる完成値の個数にも費用がかかるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-mask-by-bitwise-feasibility': {
    problemId: 'abc408-e',
    rationale:
      'simple path 条件は connectivity 判定を妨げない。許可辺で walk があれば cycle を除いて simple path にでき、その OR は増えない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。実行可能 mask が bit 追加に対して上向き閉集合で、数値最小を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-monge-transitions': {
    problemId: 'abc305-ex',
    rationale:
      'problem pの追加によるfatigue増分は、既存集合が大きいほど前後のaffine composition係数が大きくなり増加するため、fはsupermodularになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。operationsの順序だけを変えられ、二操作の前後比較からscalar keyを導けるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-path-matching-by-contraction': {
    problemId: 'abc464-g',
    rationale:
      '最小辺を採用するたびに近傍を補正重みへ縮約することで、個数別最適値を一段ずつ得る機構を実演できる。',
    scope:
      '差分列から重み付きpathを作った後を扱う。ABC218 Hへの転移では列の非隣接要素をpathの辺とみなし、符号反転で最大化と最小化を対応付ける。',
  },
  'outcome-optimize-poset-antichain-by-dilworth': {
    problemId: 'abc237-ex',
    rationale:
      '禁止条件は回文区間の交差ではなく、回文文字列同士の substring 比較可能性なので、求める量は包含半順序の幅である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二つの要素が半順序で比較可能なら同時に選べず、最大の互いに比較不能な集合を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-ratio-by-parametric-search': {
    problemId: 'abc324-f',
    rationale:
      'cost総和は正なのでratio不等式を掛け算しても向きが変わらず、変換後weight和の符号だけを見ればよい。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。正の分母を持つpath上の総和比を最大化するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-tree-order-by-cluster-contraction': {
    problemId: 'abc376-g',
    rationale:
      '頂点 cluster を (C0,C1)=(重み総和,頂点数) とすると、二 cluster の順序比較は C0_a C1_b と C0_b C1_a の比比較になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。親が子より前という precedence 制約下で二値列の転倒型目的を最小化するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-univariate-convex-function': {
    problemId: 'abc224-g',
    rationale:
      '閾値区間へ入る確率はX/Nなので入るまでの振り直し回数の期待値はN/X、入った位置は一様なのでTまでの増加回数の期待値は(X-1)/2である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。順序付き状態で二操作を選び、一方を選んだ後に他方へ戻る行動が常に損になるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-optimize-weighted-matroid-basis': {
    problemId: 'abc236-f',
    rationale:
      '独立なベクトルを一つ追加するたびに作れる XOR の個数は 2 倍になり、N 回追加すれば 2^N 個の全ベクトルを生成できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。選んだ整数の任意 XOR で作れる値集合や、その rank を管理するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-partition-integer-parameter-ranges': {
    problemId: 'abc230-e',
    rationale:
      '全ての i を走査する代わりに、floor(N/i) の値が同じ区間を数えるという商側からの集約へ視点を移す。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。floor(N/i) を i の広い範囲で集約して和や頻度を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-pass-resource-dp-through-heavy-recursion': {
    problemId: 'abc311-ex',
    rationale:
      'top-down DP の引数は「部分木単独の答え」ではなく、ここまでの選択を織り込んだ配列であり、参照渡しと返値の意味を通常の木 DP と混同しない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。木 DP の子 merge が高価だが、外部 DP を引数にした top-down 分岐として書き換えられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-peel-directed-graph-toward-cycles': {
    problemId: 'abc245-f',
    rationale:
      '削除順を番号とみなすと、削除された頂点から進める先はすべて自分より先に削除済みであり、番号が真に減るので無限歩はできない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有向グラフで、行き先を失った頂点から不可能状態を後方へ伝播したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-peel-graph-core': {
    problemId: 'abc266-f',
    rationale: 'leaf pruning後に残る2-coreはこのグラフでは唯一のcycleそのものである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。連結unicyclic graphの唯一cycle上の頂点を求めたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-persist-data-structure-versions': {
    problemId: 'abc273-e',
    rationale:
      'DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。push/popで変化する列の過去versionへ何度も戻りたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-precompute-directional-grid-effects': {
    problemId: 'abc317-e',
    rationale:
      '左から右のscanでは最後のblockerが右向き人なら、その後の空きマスは監視下にある。壁または別の人に会った時点で状態を更新し、残り三方向も同様に処理する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。grid 上の直線効果が blocker まで続き、方向種類が定数個のとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-process-dag-in-topological-order': {
    problemId: 'abc277-f',
    rationale:
      '非零要素を持つ行はminの昇順に並べ、直前までのmax≤次のminなら行間の全比較を満たす。全0行は既知制約を持たない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。row permutationとcolumn permutationが可換で、最終順序条件を行間・行内へ分けられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-propagate-static-graph-potentials': {
    problemId: 'abc396-e',
    rationale:
      '既訪問vertexへ別pathから到達したとき、既存p_vとp_u xor zが異なればcycle xorが非零で解なしである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。辺が二頂点値のxor差を指定するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-prove-and-search-threshold': {
    problemId: 'abc215-f',
    rationale:
      'min が K 以上という条件は二つの絶対差への AND に分解され、片方をソート順と尺取りで処理できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。最大化する整数値 K について、K を達成可能なら全ての小さい値も達成可能となるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-prove-greedy-order': {
    problemId: 'abc214-e',
    rationale:
      'ある割当てが現在選んだ区間より右端の遅い区間を先に使っていても、両者を交換すれば可否を悪化させない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各要素へ区間内の相異なる整数を一つずつ割り当て、実行時刻を選べるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-prune-dominated-candidates-once': {
    problemId: 'abc228-f',
    rationale:
      '青木の手を『白スタンプの盤面上の位置』で追う必要はなく、固定した黒長方形の内部で最大和となる h2×w2 長方形を引く最小最大問題に変換できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二人の選択後の評価が、先手の領域量から後手との重なり量を引く形になるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-prune-range-actions-by-node-invariant': {
    problemId: 'abc430-g',
    rationale:
      '(O\\A)∩(a∪b)=∅ なら、操作対象の各要素は区間内の全集合に含まれるか全く含まれないので、全葉のサイズ変化が同じで節点へ一括適用できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。区間写像を節点情報だけで適用できる場合とできない場合があり、失敗回数を単調量で償却できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-query-bitwise-order-with-trie': {
    problemId: 'abc425-g',
    rationale:
      '問い合わせ側の最高 bit と一致する集合が非空なら反対側は候補にならず、一致側が空なら最高 bit の寄与 2^(k-1) が全 x に加わる。',
    scope:
      'まず一つのxに対するXOR最小queryを取り出す。全xの総和を区間再帰でまとめる工程は転用時の拡張とする。',
    walkthrough: [
      '観察: bit bでXORが0になる候補があれば、XORが1になる候補の下位bitを全て0にしても優劣は逆転しない。2^b>2^b-1だからである。',
      '設計: W bitに幅を揃えてAをTrieへ挿入し、各部分木の要素数を保つ。query xは上位bitから、xと同じbitの子が非空ならそこへ、空なら逆の子へ進んで答えに2^bを加える。',
      '例: A={1,6}, x=3を3 bitで考える。最上位は0側の001を選び、結果は011 XOR 001=010、すなわち2。反対側110とのXORは5である。構築O(NW)、一query O(W)。',
      '大小queryへの接続: x XOR a<Kの個数を求める。Kのbitが1ならXORのbitを0にする子の個数を全て加え、1にする子で等号prefixを継続する。Kのbitが0なら0にする子だけを辿る。最後の等号は数えない。',
      '境界: 空の子へは進まず、重複は部分木個数に重ねて数える。ABC425 Gではこの同じ分岐をxの区間全体へ共有する。',
    ],
  },
  'outcome-query-recursively-defined-string': {
    problemId: 'abc346-f',
    rationale:
      '現在absolute位置a以降で文字cのb回目出現は、S一周期内のc個数cnt_cでfull cyclesをまとめ、S+S内の出現位置またはposition vectorのlower_boundで残りを決められる。最早出現を選ぶgreedyは後続に最大の余地を残す。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有限base stringの巨大反復上で、指定文字の多数回先の出現位置が欲しい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reconstruct-tree-from-distance-matrix': {
    problemId: 'abc451-e',
    rationale:
      'j が root-to-i path 上なら距離加法 A_{1,j}+A_{j,i}=A_{1,i} が成立し、木では逆も成立する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。正重み木の全点対距離が与えられ、存在判定と構成を行うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-recover-valid-witness': {
    problemId: 'abc232-h',
    rationale:
      'S＝第一列全体と (H,2) を通る経路の末尾は、第一列を除いて上下反転した残り盤面の左上角に対応する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。大きい盤面の一部を固定経路で消費すると、座標変換後に同じ条件の小さい盤面が残るとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-recur-by-edge-deletion-contraction': {
    problemId: 'abc294-ex',
    rationale:
      '彩色多項式の削除縮約F(G)=F(G-e)-F(G/e)と、独立集合への色クラス分割という二表現を疎グラフの次数に応じて使い分ける。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。グラフ彩色数を辺削除と端点縮約へ分解する。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reduce-geometry-to-algebraic-predicates': {
    problemId: 'abc220-g',
    rationale:
      '線分方向の primitive vector (dx,dy) と、二倍中点 (x_i+x_j,y_i+y_j) のその方向への内積を組にすれば、垂直二等分線を実数なしで一意に正規化できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。四点図形の条件が、向かい合う二線分が共有する軸・中点・長さなどで特徴付けられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reduce-integer-structure-by-gcd': {
    problemId: 'abc254-f',
    rationale: '同じ列の値同士を引けばAの隣接差が、同じ行の値同士を引けばBの隣接差が得られる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の和で作る集合のgcdを少数の基準値と差へ変えたい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-remove-boundaries-by-reflection': {
    problemId: 'abc309-ex',
    rationale:
      '開始分布を位置 j に正、鏡位置 2M+2−j に負で置くと、禁止境界を越えて戻る経路が一対一に逆符号で対応して消える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。一様なランダムウォーク・格子路で、壁だけが畳み込み構造を妨げるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reorder-counting-contributions': {
    problemId: 'abc215-g',
    rationale: '色どうしの出現は独立でなくても、期待値の線形性により各色の出現確率を単純に足せる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。異なる種類の出現数の期待値を求め、種類間の依存関係が複雑なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-represent-convex-intersection-by-halfplanes': {
    problemId: 'abc251-g',
    rationale:
      '反時計回りの辺ベクトルq_iに対し、点zが平行移動後の内部にある条件はcross(q_i,z)がその移動後頂点のcross値以上であることと書ける。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。点包含や複数凸集合の共通部分を辺ごとの線形不等式で扱いたい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-represent-integers-as-two-squares': {
    problemId: 'abc444-g',
    rationale:
      '4 mod 3 の素数指数が奇数なら表現は0で、4 mod 1 の素数 p=ππ̄ では π と π̄ への指数配分 e+1 通りが自由度になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。X^2+Y^2=N の解を N の素因数表示から数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reroot-tree-aggregation': {
    problemId: 'abc220-f',
    rationale:
      '辺 p-c をまたぐ reroot 差分は、近くなる sub(c) 個の -1 と遠くなる N-sub(c) 個の +1 の合計 N-2sub(c) である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各頂点を根にした値が必要で、隣接する二つの根の答えの差を辺の両側の情報から求められるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-restrict-geometric-candidates-to-boundary': {
    problemId: 'abc257-ex',
    rationale:
      "f_i'(1)=E[die_i]、f_i''(1)を使うとE[(総和)^2]-費用が選択ベクトル和(X,Y)上のX^2+Yになる。",
    scope:
      'ここでは次の局所的な観察から対象技能を導く。独立確率変数の和の二乗期待値を選択項ごとの量へ分解したい。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-reverse-update-time': {
    problemId: 'abc229-e',
    rationale:
      '頂点 i を追加した直後に成分数を一つ増やし、異なる根を結ぶ辺ごとに一つ減らせば現在の連結成分数を維持できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。更新が削除だけで順序も既知だが、利用したいデータ構造が追加しか扱えないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-rollback-reversible-updates': {
    problemId: 'abc218-g',
    rationale:
      'DFS の入場時に A_v を追加し、退場時に同じ一個を削除すれば、データ構造は常に現在の root-to-v path だけを表す。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各 root-to-node path の統計量を全頂点または全葉で求め、要素の追加と rollback ができるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-run-dp-on-finite-automaton': {
    problemId: 'abc305-g',
    rationale:
      '文字cを追加した列のsuffixのどれかが禁止列と一致した遷移だけを除く。一度禁止列を含んだ状態を保持する必要はなく、安全なprefix間の遷移だけで最終文字列を数えられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。禁止パターンの最大長が小さく、文字を末尾へ追加しながら回避列を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-schedule-range-query-updates': {
    problemId: 'abc242-g',
    rationale:
      '非線形な floor(cnt/2) でも、一個の増減差は cnt の偶奇だけで決まるため Mo の add/remove に必要な十分状態は頻度と総 pair 数だけである。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。静的配列の多数の offline range query で、要素一個の追加・削除から答えを更新できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-select-state-graph-search': {
    problemId: 'abc241-f',
    rationale:
      '通過するだけのマスは次の手を選べないので状態に不要であり、goal も障害物直前として実際に停止できた場合だけ到達扱いになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。座標範囲は巨大だが、移動規則により停止・分岐できる点が障害物周辺などに限られるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-share-threshold-checks-by-parallel-binary-search': {
    problemId: 'abc233-ex',
    rationale:
      '長方形内点数は x≤u＋r の prefix 個数から x＜u−r の prefix 個数を引き、各 prefix を y 区間和で求められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二次元の |Δx|＋|Δy| 距離球を範囲数え上げへ変換したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-shift-polynomial-by-factorial-convolution': {
    problemId: 'abc323-g',
    rationale:
      '係数matrix Bが正則ならdet(A+xB)=det(B)det(xI+B^{-1}A)で、後半は−B^{-1}Aのcharacteristic polynomialになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。spanning treeをedge属性の個数別に数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-bipartite-matching': {
    problemId: 'abc241-g',
    rationale:
      '既に終了した試合 node は実際の winner だけへ、未終了試合 node は両 player へ辺を張れば、fixed result と自由選択を同じ network で扱える。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各 item を候補先の一つへ割り当て、各受け手に上限があるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-cyclic-minimax-game': {
    problemId: 'abc261-ex',
    rationale:
      '有限な高橋状態の値は min(C(v,u)+dp[u][1])、有限な青木状態の値は max(C(v,u)+dp[u][0]) である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。閉路を含む有限ゲームで、終端へ到達できる勝敗・有限性を逆向きに確定したいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-difference-constraints': {
    problemId: 'abc216-g',
    rationale:
      '1 の個数最小化を直接扱わず、補数である 0 の prefix 個数 B_N の最大化へ反転すると差分制約の上界問題になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。多数の区間について要素和の上限・下限が課され、各要素が小さな差分値を取るとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-flow-with-lower-bounds': {
    problemId: 'abc285-g',
    rationale:
      '左側頂点ではsourceからの辺、右側頂点ではsinkへの辺を流量1に強制すれば、そのcellがちょうど1本のdominoに含まれる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。隣接cellを重ならないpairへ分けるtile配置問題。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-isotonic-regression-by-pav': {
    problemId: 'abc459-f',
    rationale:
      '長さL・総和Sのblockを最も均す整数列は floor((S+t)/L), t=0..L-1 で、値は二つの隣接整数だけになる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。単調制約下で隣接違反をblock平均化して一意解を求めるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-linear-system-and-rank': {
    problemId: 'abc276-ex',
    rationale:
      'prefix xor p_{i,j}を使うとrectangle parityはp_{b,d}⊕p_{a-1,d}⊕p_{b,c-1}⊕p_{a-1,c-1}で、queryに現れるcorner以外は0に固定してよい。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。有限体の非零元が小さな巡回群をなし、積条件を加法条件へ変えられるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-min-weight-general-perfect-matching': {
    problemId: 'abc412-g',
    rationale:
      'matching中に同じlabel pair間のweight1 edgeが二本あれば、その4 copyを各label内のweight0二辺へ交換して費用を下げられる。よって最小解は元simple graphの同じedgeを重複使用しない。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。各頂点degreeに上限とparity制約があり、総上限が小さいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-modular-constraints': {
    problemId: 'abc245-ex',
    rationale:
      '互いに素な各 p^q への剰余の組は法 M の剰余と一対一対応するため、各座標で積が N と一致する列数を独立に数えて積を取れる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。法が合成数で、条件が互いに素な素数冪ごとの合同条件へ分離できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-steiner-tree-by-subset-dp': {
    problemId: 'abc364-g',
    rationale:
      'dp[mask][v]←dp[sub][v]+dp[mask−sub][v]はvを共通接続点として二木を合併し、重複辺があれば最適解をさらに改善できるので上界遷移として安全である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。terminal数だけが小さいweighted graphの最小接続部分graph。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-stochastic-recurrence': {
    problemId: 'abc226-h',
    rationale:
      'Y≥x はN個のうち少なくともK個がx以上であることと同値で、独立性から各変数の成功確率p_i(x)を掛けるPoisson-binomial型DPで求められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。非負の連続確率変数の期待値を求め、値以上となる事象の方が組合せ的に数えやすいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-solve-weighted-bipartite-matching': {
    problemId: 'abc373-g',
    rationale:
      '交差点 X に対し |PaX|+|XQb|>|PaQb| と対称な不等式を足すと、交差辺の swap が距離和を改善する。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。幾何的な対応で交差二辺の付け替えが目的値を改善するとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-split-enumeration-space': {
    problemId: 'abc220-h',
    rationale:
      'g[t]=(-1)^{R[t]} として H[z]=Σ_t (-1)^{popcount(z&t)}g[t] を求めると、H[z] は parity(z&t) xor R[t] が0の個数と1の個数の差になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。N が40前後で全 subset は多いが、二分した各側の subset 情報を圧縮して結合できるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-stabilize-unbounded-knapsack-by-best-density': {
    problemId: 'abc415-g',
    rationale:
      '同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。capacityが巨大だがitem weightが小さく、best ratio以外の使用量をboundedにできるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-sum-multiplicative-function-by-min25-sieve': {
    problemId: 'abc370-g',
    rationale:
      'h(p^e)=0 if σ(p^e)≡0 else g(p^e) と乗法的に延長すると、h(n)はσ(n)非零mod3のときだけg(n)に等しく、求めるindicator付き重みはg(n)−h(n)になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。乗法的量の積が0となるprime-power factorを少なくとも一つ含む対象を数えるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-sweep-connectivity-by-kruskal-threshold': {
    problemId: 'abc235-e',
    rationale:
      '答えを知るには完成した MST 自体は不要で、候補辺が現れる瞬間の軽い辺による連結性という途中状態だけで十分である。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。候補辺が MST に入るかを多数問われ、各候補追加は他クエリへ影響しないとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-test-linear-matroid-intersection-rank': {
    problemId: 'abc399-g',
    rationale:
      'graphic matroidはoriented incidence columns、color cのpartition matroidはA_c行のVandermonde columnsで線形表現できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。二つの線形matroidの最大common independent sizeだけが必要なとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-transform-to-combinatorics-algebra': {
    problemId: 'abc212-g',
    rationale:
      'an≡b (mod m) が n について解を持つのは gcd(m,a) が b を割るときに限る。したがって固定した a から到達できる b は m/gcd(m,a) 個であり、a の gcd ごとに寄与をまとめられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。素数法の非零剰余に積と冪が現れるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-transform-to-geometry-optimization': {
    problemId: 'abc216-e',
    rationale:
      '貪欲に一回ずつ最大値を取る結果には共通の境界値があり、境界より上は全て選び、境界値だけ必要個数を選ぶ。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。複数の単調列から大きい要素を多数選ぶが、選択回数そのものが非常に大きいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-transform-to-number-theory': {
    problemId: 'abc212-g',
    rationale:
      'an≡b (mod m) が n について解を持つのは gcd(m,a) が b を割るときに限る。したがって固定した a から到達できる b は m/gcd(m,a) 個であり、a の gcd ごとに寄与をまとめられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。素数法の非零剰余に積と冪が現れるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-translate-sequences-by-rsk': {
    problemId: 'abc378-g',
    rationale:
      '末尾に n+0.5 を加えて長方形へなる挿入過程は、元 tableau で t_{i+1,A-1}<t_{i,A} という追加順序制約に翻訳できる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。permutation の LIS/LDS を同時に固定して数えたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-traverse-stern-brocot-ancestors': {
    problemId: 'abc273-ex',
    rationale:
      'node interval内targetのoriginal indicesをsorted set Pとすると、そのnodeが必要なsubarraysは全subarraysからPを一つも含まないindex-gap内subarraysを引いて求められる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。coprime positive pairsがmediant operationsで生成され、naive tree depthが座標値まで伸びるとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-use-cycle-space-basis': {
    problemId: 'abc419-g',
    rationale:
      'terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。指定terminal間simple pathに絶対含まれない枝を除きたいとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
  'outcome-use-tree-diameter-extrema': {
    problemId: 'abc221-f',
    rationale:
      '奇数 D では中心辺を切った両側から距離 (D-1)/2 の頂点を一つずつ選ぶしかなく、答えは二側の個数の積になる。',
    scope:
      'ここでは次の局所的な観察から対象技能を導く。全頂点対の最大距離や、互いの距離が直径に等しい頂点集合を扱うとき。 問題全体への接続は併用技能を学んだ後に読む。',
  },
};
