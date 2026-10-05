---
title: "ABC315-F — Shortcuts"
draft: true
authoringUnit: {"problemId":"abc315-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc315-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-geometry-primitives"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc315-editorial-6993-49cc68eab96132414d85a799b382c6666858d61b80fc2bace9f31c8cd0fdfed4","source-abc315-f-problem-e216857b05d3a1490f0d20893059c08b33dfb0d4ea423314d90b0869d0359b5b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dp[i,c]を点iへ到達し、途中でc点を省いた最小距離とする。直前に訪れた点jからiへ移ると距離を一度足し、省略数をi−j−1だけ足すので全経路と遷移列が一対一になる。全点経由の既知距離Uよりpenalty 2^{c−1}が大きいcは、非負距離と合わせて既知解より劣るため捨ててよい。残るcだけのDPで全最適候補を保持し、終点で総cに対するpenaltyを一回加えた最小を取れば目的関数そのものになる。","sourceRevisionIds":["source-abc315-editorial-6993-49cc68eab96132414d85a799b382c6666858d61b80fc2bace9f31c8cd0fdfed4","source-abc315-f-problem-e216857b05d3a1490f0d20893059c08b33dfb0d4ea423314d90b0869d0359b5b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

## 考察

通過した checkpoint の列が決まれば距離は隣接する選択点間の Euclid 距離の和で、過去の具体的経路は最後に通った点と skip 総数だけで十分である。

skip penalty は 2^{C−1} と指数増加する一方、全点を通る距離は座標範囲と N から多項式上界を持つ。従って大きな C は最適解にならず、小さい定数まで切れる。

採用する候補: dp[i][c] を checkpoint i を最後に通り合計 c 個 skip した最小移動距離とし、小さい c 上限だけ遷移する。

次に通る j までの skip j−i−1 を加える Markov 状態になり、指数 penalty から c を数十程度に制限できる。

棄却する候補: 各中間 checkpoint を通る/skip の 2^{N−2} 通りを全探索する。

N=10^4 では列挙不能で、同じ最後の点と skip 数へ至る履歴を最小距離一つに統合できる。

全点経由の距離上界より 2^{C−1} が大きくなった C は、それだけで既知解を超えるため安全に捨てられる。

dp 遷移では i から j へ直接飛ぶ距離を加え、skip 数を j−i−1 増やす。penalty は最後に一度だけ加える。

座標制約から得た既知上界を超える最小 2^{C−1} を基に CMAX を取る。dp[1][0]=0 とし、各 i,c から j=i+1..min(N,i+CMAX−c+1) へ距離(i,j)を加えて chmin する。最後に dp[N][c]+(c=0?0:2^{c−1}) の最小を出す。

## 典型の発動条件

### 指数 penalty による状態打切り

発動条件: 最適化の一変数に指数増加コストがあり、容易な feasible 解の上界が得られるとき。

penalty 単独で上界を超える領域を証明付きで DP から除く。

### 最後の選択点 DP

発動条件: 順序付き点列から一部を選び、連続して選んだ点間のコストを足すとき。

最後に選んだ index と累積 skip 数を状態にし、次の選択点へ飛ぶ。

## 問題固有の要素

N=10^4 でも skip 数軸は N まで不要で、目的関数の指数項そのものが強い枝刈り証明になる。

別の問題へ持ち帰る視点: DP の次元上限は入力制約だけでなく、既知解上界と penalty 下界を比較して削れないか調べる。

## 正当性

dp[i,c]を点iへ到達し、途中でc点を省いた最小距離とする。直前に訪れた点jからiへ移ると距離を一度足し、省略数をi−j−1だけ足すので全経路と遷移列が一対一になる。全点経由の既知距離Uよりpenalty 2^{c−1}が大きいcは、非負距離と合わせて既知解より劣るため捨ててよい。残るcだけのDPで全最適候補を保持し、終点で総cに対するpenaltyを一回加えた最小を取れば目的関数そのものになる。

## 実装上の注意

- C=0 の penalty は0で 2^{-1} ではない。CMAX は座標・Nからの上界に十分な余裕を持たせ、float の infinity と誤差を管理する。

## 復習の核

- 「100個なら大きい」と感覚で切らず、必ず全点経由解の上界と penalty を比較する。遷移時の skip 増分 j−i−1 を小例で検算する。

## 計算量と制約

### 時間

O(NC²)、Cは既知全点経由上界より大きくなるpenaltyを初めて与えるskip数。

### 空間

O(NC)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \le N \le 10^4; 0 \le X_i,Y_i \le 10^4; (X_i,Y_i) \neq (X_j,Y_j) if i \neq j.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/editorial/6993) — source-abc315-editorial-6993-49cc68eab96132414d85a799b382c6666858d61b80fc2bace9f31c8cd0fdfed4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc315/tasks/abc315_f) — source-abc315-f-problem-e216857b05d3a1490f0d20893059c08b33dfb0d4ea423314d90b0869d0359b5b
