---
title: "ABC349-G — Palindrome Construction"
draft: true
authoringUnit: {"problemId":"abc349-g","docPath":"src/content/docs/problems/string-geometry/outcome-characterize-palindrome-intervals/outcome-characterize-palindrome-intervals-shard-001/abc349-g.md","learningOutcomeIds":["outcome-characterize-palindrome-intervals"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-dsu-components"],"excludedTopics":["一般の部分文字列hash比較と、接尾辞・LCPの索引。"],"tagIds":["tag-palindrome-radius","tag-constructive-witness","tag-dsu-components"],"sourceRevisionIds":["source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030","source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"入力Aを満たす列が存在する場合を先に考える。処理した中心iの距離0,…,j−1の等値は、明示unionか前中心の鏡像から既に得られている。k+A[i−k]+1<jなら左の鏡像回文は既知回文内で終わり、次の不等pairも内部にある。中心iを介した反射で右の中心i+kも半径A[i−k]と確定し、その等値は左中心の等値と外側中心iの等値から推移的に導かれる。よってこの中心を省いても必要な連結性を失わない。省略できない最初の中心へ進めば、同じ右端までの等値をj−kとして再利用できる。存在可能なAではこの反射関係が要求半径と整合する。\n\n各明示unionは要求された等値の一つである。従って存在可能なAなら圧縮DSUは全等値pairを張ったDSUと同じ分割を作る。外側不等辺のself-loopは矛盾であり、なければ成分ごとの彩色が半径exact条件を満たす。初出順の最小使用可能色は現在prefixを最小にし、未着色成分には無制限の新色を選べるので辞書順最小性を壊す後続制約がない。\n\n存在しないAでは反射による省略の意味を保証しない。そこで候補の全半径を再計算する。一致すればその候補自身が合法性の証拠であり、不一致なら、存在すると仮定したとき必ず成功する上の構成の対偶からNoが正しい。最終照合を省いてはいけない。\n\n計算量は矛盾したAにも保証できる。union時だけi+jが1増え、中心を進める二代入では不変。明示unionの直前i+j≤i+A_i≤N−1だからunion総数≤N。kの内側ループの反復数も中心の増分へ課金でき、iは単調に増えてNを越える一回で終了する。jは負にならず、kを増やす条件からk≤jが保たれる。従って走査・不等辺・彩色・半径照合は全て線形個の処理で、DSUだけがα(N)因子を持つ。","sourceRevisionIds":["source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030","source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [回文半径と左右対称区間を特定する](src/content/docs/learn/string/palindrome-radius.md)

- 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 考察

0-indexで半径A_iは中心以外の片側文字数とする。中心iから距離1,…,A_iの対称位置は等値であり、両端が存在すれば(i−A_i−1,i+A_i+1)は不等である。等値をDSUで縮約し、不等を成分間の辺へ変換すれば、正整数を色として辞書順最小の彩色を作る問題になる。

全等値pairを張るとΣA_i=Θ(N²)になり得る。通常のManacherは既知文字列の比較を省くが、本問では文字列がまだない。そこで「要求半径を持つ文字列が存在する」という仮定の下で、鏡像から必然となる等値だけを省く。存在判定はこの走査自体では完了せず、最後に候補文字列の半径を全照合する。

変更後の走査は次の通り。jは今の中心で次にunionする距離であり、中心自身j=0も含む。入力制約A_i≤min(i,N−1−i)からunionの両端は範囲内にある。

```text
i = j = 0
while i < N:
    while j < A[i] + 1:
        unite(i-j, i+j)
        j += 1
    k = 1
    while i-k >= 0 and k + A[i-k] + 1 < j:
        k += 1
    i += k
    j -= k
```

処理後の既知回文の右端はi+j−1。鏡像中心i−kの回文がこの区間内に厳密に収まる条件がk+A[i−k]+1<jであり、その間は右側中心i+kも丸ごと省ける。等号では外の不一致を移せず、次の中心として止める。止まった中心へ移ると、右端までの既知範囲をj−kとして引き継ぎ、その外だけunionする。矛盾したAでは引き継いだjがA[i]+1より大きくても、内側をやり直さない。

その後、全iの外側pairが範囲内ならDSU代表間に不等辺を張る。同じ代表ならNo。元indexを左から見て未着色成分が初出したら、既着色の隣接成分で使われていない最小正整数を選ぶ。色は1,…,Nで十分。degree+1までのmark配列を使い、各成分で刻印を変えれば全隣接辺とmex探索の総量はO(N)。未着色の隣接先は後から別色を選べるので、未来を先読みしなくてよい。

生成列Sへ通常の奇数Manacherを適用し、前提Unitの一文字を含む半径d1[i]がA_i+1と全て一致すればYesとS、違えばNoを出す。N=1,A_0=0でも一成分へ1を割り当て、照合に通る。

## 典型の発動条件

### Manacher型の対称制約圧縮

発動条件: 多数centerのpalindrome equality区間が大きく重複する。

既知の右端とmirror radiusを再利用し、未確認部分だけ対称pairを接続する。

### equality縮約後のgreedy coloring

発動条件: 等しい変数群と、異なる必要がある群pairがあり、正整数color数に上限がない。

DSU componentを最初の出現順に処理し、colored neighborのmexを割り当てる。

## 問題固有の要素

lexicographic最小化はindexを左から見て、そのindexのcomponentが初出の時に利用可能な最小値を選べばよい。未来componentは無制限な新色で必ず調整できるため、このgreedyを妨げない。

別の問題へ持ち帰る視点: unbounded graph coloringのlexicographic最小列はcomponent初出順のneighbor-color mexで構成できる。

## 正当性

入力Aを満たす列が存在する場合を先に考える。処理した中心iの距離0,…,j−1の等値は、明示unionか前中心の鏡像から既に得られている。k+A[i−k]+1<jなら左の鏡像回文は既知回文内で終わり、次の不等pairも内部にある。中心iを介した反射で右の中心i+kも半径A[i−k]と確定し、その等値は左中心の等値と外側中心iの等値から推移的に導かれる。よってこの中心を省いても必要な連結性を失わない。省略できない最初の中心へ進めば、同じ右端までの等値をj−kとして再利用できる。存在可能なAではこの反射関係が要求半径と整合する。

各明示unionは要求された等値の一つである。従って存在可能なAなら圧縮DSUは全等値pairを張ったDSUと同じ分割を作る。外側不等辺のself-loopは矛盾であり、なければ成分ごとの彩色が半径exact条件を満たす。初出順の最小使用可能色は現在prefixを最小にし、未着色成分には無制限の新色を選べるので辞書順最小性を壊す後続制約がない。

存在しないAでは反射による省略の意味を保証しない。そこで候補の全半径を再計算する。一致すればその候補自身が合法性の証拠であり、不一致なら、存在すると仮定したとき必ず成功する上の構成の対偶からNoが正しい。最終照合を省いてはいけない。

計算量は矛盾したAにも保証できる。union時だけi+jが1増え、中心を進める二代入では不変。明示unionの直前i+j≤i+A_i≤N−1だからunion総数≤N。kの内側ループの反復数も中心の増分へ課金でき、iは単調に増えてNを越える一回で終了する。jは負にならず、kを増やす条件からk≤jが保たれる。従って走査・不等辺・彩色・半径照合は全て線形個の処理で、DSUだけがα(N)因子を持つ。

## 実装上の注意

- 生成走査のjは一文字を含む半径で、要求A_iは片側の長さ。生成も最後の照合もA_i+1を使う。
- skip条件は厳密なk+A[i−k]+1<j。不等辺はi−A_i−1≥0かつi+A_i+1<Nのときだけ張る。
- 存在を仮定して省略する走査と、任意のSへ行う通常Manacherを分ける。入力の不整合は最終全照合でも判定する。
- 色探索は既着色neighborの色だけをmarkする。色配列全体を毎成分初期化すると二乗時間になるので、刻印かdegreeに比例する初期化を使う。

## 復習の核

- 既知の値を求める典型を構成へ転用するときは、何を仮定して省略できるかを明示する。
- 存在可能な入力での完全性と、全入力での計算量は別に証明する。
- 条件付き制約圧縮は、完成した候補への完全な検証と組み合わせる。

## 計算量と制約

### 時間

O(Nα(N))。i+jの増加からunion≤N、iの進行からskip総数O(N)。不等辺は高々N、全degreeと色探索もO(N)、最後の通常ManacherはO(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i \leq \min\{i-1,N-i\}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/editorial/9782) — source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/tasks/abc349_g) — source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474
