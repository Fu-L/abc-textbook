---
title: "ABC446-G — 221 Subsequence"
draft: true
authoringUnit: {"problemId":"abc446-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc446-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c","source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各値列の貪欲添字列は一意である。各文字で最早の一致位置を選ぶと、任意の別の埋込みの対応位置以下になることを帰納的に示せるため、存在する値列をこの選択で失わない。代表のrun末尾列からは、その前回末尾より右の最初のx個のxを取ることで元の値列と代表添字を一意に復元できる。\n\n空列の末尾は0、0回目の出現はJ(x,0)=−1と区別する。末尾pの値をx、k=C_p−xとすると、k<0ではx個足りない。k≥0ではJ(x,k)<j<J(x,k+1)が、jまでにxがk個ありj自身はxでない条件と同値である。従ってこの範囲の直前末尾からxのrunを追加する遷移は合法であり、全ての合法な代表列の最後のrunを取り除く逆操作もこの範囲へ戻る。U=J(x,k+1)≤pなので全遷移元はp未満で、dp[0]=1からの昇順DPが各代表列を一度ずつ数える。各非空列の最後の末尾は1..Nのどれか一つだから、Σ_{p=1}^N dp[p]が回答で、追加の空列除去は不要である。","sourceRevisionIds":["source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c","source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

先に読む単元:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

この解説で扱わないこと:

- 交換論による貪欲順の証明。

## 考察

数える対象は取り出す位置の組ではなく、値列として相異なる221部分列である。同じ値列を複数の位置から作れるので、位置を選ぶ通常の部分列DPでは重複する。各値列を左から順に、前回より右にある最初の一致位置から取り出すことにする。この貪欲な添字列を代表に固定すれば、同じ値列を一度だけ数えられる。

221列の各runは値xをちょうどx個並べる。代表添字列のrun末尾をp_1,…,p_mとし、空列の末尾p_0=0、値A_0=0と置く。直前末尾jから、次runの末尾pまでに現れるx=A_pがちょうどx個で、j=0またはA_j≠xなら、そのrunは最左のx個を取って一意に復元できる。従って末尾列だけをDPで数える。

1-indexでC_pをA[1..p]に現れるA_pの個数、J(x,c)を値xのc回目の出現位置とする。c≥1の位置は値別出現列から得られるが、J(x,0)=−1と定義する。これは空列の末尾0と違う番兵である。

k=C_p−A_pとする。k<0ならrunを作れずdp[p]=0。k≥0なら直前末尾jの必要十分条件は

```text
J(A_p,k) < j < J(A_p,k+1)
```

となる。左端より後、次の出現より前なら、jまでのxの個数はkで、A[j+1..p]にはちょうどx個ある。また両端が連続するx出現なので、開区間内の正のjはA_j≠x。両端を除くことがrunの長さと隣接runの異値を同時に保証する。

dp[p]は末尾pの合法な代表列の個数とし、dp[0]=1からp昇順に計算する。L=J(A_p,k), U=J(A_p,k+1)とおけば加算範囲は半開区間[max(0,L+1),U)。U≤pなので既に計算した状態だけを参照する。

累積和P[t]=Σ_{j=0}^t dp[j]、P[−1]=0を用いるなら次の手順になる。P[−1]は配列の負添字を読むのでなく、分岐で0を返す。

```text
dp[0] = P[0] = 1
for p = 1..N:
    k = C[p] - A[p]
    dp[p] = 0
    if k >= 0:
        l = max(0, J(A[p],k)+1)
        r = J(A[p],k+1)-1
        dp[p] = P[r] - (0 if l == 0 else P[l-1])
    P[p] = P[p-1] + dp[p]
answer = sum(dp[1..N])
```

全演算を法998244353で行う。答えは非空末尾の和なので、さらに1を引かない。P[N]から出す場合だけP[N]−1とする。

N=1,A=(1)ならk=0,L=−1,U=1で、j=0を含みdp[1]=1。公式サンプル1のA=(2,1,2,1,1,2,7,2)ではdp[1..8]=(0,1,1,1,0,1,0,1)、和は5。全て1の列でも最初の位置だけがrun末尾の代表となり、値列(1)を一度だけ数える。

区間和をFenwick木で求めてもよいが、今回は状態が添字順に確定し過去値を変更しない。累積和なら一点更新の対数因子も不要で、全体をO(N)にできる。

## 典型の発動条件

### 正準表現による部分列数え上げ

発動条件: 同じ値列を作る添字列が複数あり、distinct な部分列を数えたいとき。

各値列の辞書順最小添字列だけを数える。

### DP の区間和遷移

発動条件: 直前状態の許容 index が連続区間になるとき。

Fenwick tree・segment tree・累積和で遷移和を取得する。

## 問題固有の要素

run 制約を run の最後だけの列へ圧縮すると、各 block 内の添字は貪欲規則から自動的に決まる。

別の問題へ持ち帰る視点: distinct 部分列では値列ごとの正準な添字表現を定め、その表現が満たす条件を DP にする。

## 正当性

各値列の貪欲添字列は一意である。各文字で最早の一致位置を選ぶと、任意の別の埋込みの対応位置以下になることを帰納的に示せるため、存在する値列をこの選択で失わない。代表のrun末尾列からは、その前回末尾より右の最初のx個のxを取ることで元の値列と代表添字を一意に復元できる。

空列の末尾は0、0回目の出現はJ(x,0)=−1と区別する。末尾pの値をx、k=C_p−xとすると、k<0ではx個足りない。k≥0ではJ(x,k)<j<J(x,k+1)が、jまでにxがk個ありj自身はxでない条件と同値である。従ってこの範囲の直前末尾からxのrunを追加する遷移は合法であり、全ての合法な代表列の最後のrunを取り除く逆操作もこの範囲へ戻る。U=J(x,k+1)≤pなので全遷移元はp未満で、dp[0]=1からの昇順DPが各代表列を一度ずつ数える。各非空列の最後の末尾は1..Nのどれか一つだから、Σ_{p=1}^N dp[p]が回答で、追加の空列除去は不要である。

## 実装上の注意

- J(x,0)=−1、空列の末尾p_0=0、dp[0]=1を別の規約として保持する。k<0ならJを参照せず0とする。
- 開区間(L,U)は半開区間[max(0,L+1),U)へ変換する。k=0では左端0の初期状態を含める。
- 答えをdp[1..N]の和で作るなら1を引かない。空列込み累積値P[N]を使う場合だけ1を引く。
- 出現位置列は値1..Nで直接管理できる。P[−1]は分岐で0とし、差を法で正規化してからP[p]を更新する。

## 復習の核

- 同じ値列を数えるときは、最早の埋込みなどの正準な代表を固定する。
- 空状態の添字と、存在しない出現の番兵を混同しない。初期状態が最初の合法遷移へ入るか最小入力で確認する。
- 区間和DPでも、過去の値が変わらず添字順に確定するなら累積和まで簡約できる。

## 計算量と制約

### 時間

累積和実装ならO(N)。値別出現列・Cの前計算もO(N)、各pの二端取得と累積和差はO(1)。Fenwick木・segment treeで区間和を得る実装ならO(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500\,000; 1 \leq A_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/editorial/16371) — source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/tasks/abc446_g) — source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770
