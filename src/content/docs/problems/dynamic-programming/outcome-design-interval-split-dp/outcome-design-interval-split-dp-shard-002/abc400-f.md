---
title: "ABC400-F — Happy Birthday! 3"
draft: true
authoringUnit: {"problemId":"abc400-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-002/abc400-f.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58","source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"前向き塗り列を逆順に見ると、その操作で最終色が確定したマスはcで、後の操作に隠れるマスは既に0である。従って合法な消去列が得られる。逆に消去列を反転して同じ区間をcで塗れば、消去で0だったマスは後の塗りに上書きされ、各マスの目標色を復元する。最適値は同じである。\n\n消去は色を0にするだけなので、最後に消す区間の両端cは、それまで一度も消されていない。両端を跨ぐ先行消去はこのcを消してしまうため存在せず、最後の区間の内部と外部は独立である。線形区間で最後の操作が全区間でなければ、その区間端の少なくとも一方で二つへ切れる。全区間なら両端がC_lであり、前処理は左端を残して0またはC_lへするepである。\n\nepでは右端が残るなら元色がC_lで、短いepへ無料で付け足せる。消えるなら最後に残すC_lの直後で切り、左のepと右のdpへ分けられる。残る左端が先行操作を跨がせないためこの分割も独立である。長さに関する帰納法で二表の遷移は全最適消去列を表す。円でも最後の消去区間の境界をcutに取ると、それ以前の操作はその境界を跨がず線形解になる。全cutの最小が円の最適値に一致する。","sourceRevisionIds":["source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58","source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

円上の塗り上書きは履歴が複雑だが、逆順なら「区間内が0または色cのとき、全て0へ消す」操作に変えられる。費用は区間長+X_c。前向きで後の塗りに隠れたマスを0というwildcardにしておくためである。正の費用なので、消去区間の両端が0なら縮めてよく、両端は元の色cが残る形にできる。

Cを二周へ複製し、半開区間[l,r)の完全消去費用をdp[l][r]とする。補助ep[l][r]は、左端lを消さず、区間内を0またはC_lだけにする最小費用である。残すC_lの位置は自由に選び、他の色は全て消す。この「左端を残す」が固定費を最後に一度だけ払う状態の境界条件になる。

dp[l][l]=ep[l][l]=0、非空区間は∞で初期化し、長さ1,…,Nの昇順に次を計算する。空epは一文字を残す遷移の便宜上の基底であり、C_lへの参照は非空区間だけで行う。

```text
for length = 1,...,N:
    for [l,r) within the doubled array with r-l = length:
        for m = l+1,...,r-1:
            dp[l][r] = min(dp[l][r], dp[l][m] + dp[m][r])
            ep[l][r] = min(ep[l][r], ep[l][m] + dp[m][r])
        if C[l] == C[r-1]:
            ep[l][r] = min(ep[l][r], ep[l][r-1])
            dp[l][r] = min(dp[l][r], ep[l][r] + length + X[C[l]])
answer = min(dp[i][i+N] for i = 0,...,N-1)
```

epの二遷移は、右端を消す場合と右端をC_lのまま残す場合である。前者では最後に残すC_lより右をdpで消し、後者では右端を何もせず足す。dpは独立な二区間への分割と、全区間を最後の一操作で消す候補を比べる。全区間消去候補は両端の元色が同じ時に用い、epを先に確定させる。一文字ではep=0、dp=1+X_{C_l}になる。

例えばC=(1,2,1)なら中央を1+X_2で消し、全体を3+X_1で消すことで色1の固定費を共有できる。色ごとの連続区間を独立に塗るgreedyでは、この離れた同色をまとめる利得を表せない。

## 典型の発動条件

### 操作の逆転とinterval DP

発動条件: 上書き操作の最後の作用範囲がsubproblemを分離するとき。

逆向きの消去として最後のintervalで分割する。

### circular interval DP

発動条件: 円環のcut位置が最適解に依存するとき。

列を二倍して全長N interval開始を試す。

## 問題固有の要素

固定費X_cのため異色部分を先に0へ消せば、最後のc操作でそれらを跨いで一括消去できることをepが表す。

別の問題へ持ち帰る視点: range overwrite最小costは逆操作でwildcard/emptyを許すinterval grammarへ変換する。

## 正当性

前向き塗り列を逆順に見ると、その操作で最終色が確定したマスはcで、後の操作に隠れるマスは既に0である。従って合法な消去列が得られる。逆に消去列を反転して同じ区間をcで塗れば、消去で0だったマスは後の塗りに上書きされ、各マスの目標色を復元する。最適値は同じである。

消去は色を0にするだけなので、最後に消す区間の両端cは、それまで一度も消されていない。両端を跨ぐ先行消去はこのcを消してしまうため存在せず、最後の区間の内部と外部は独立である。線形区間で最後の操作が全区間でなければ、その区間端の少なくとも一方で二つへ切れる。全区間なら両端がC_lであり、前処理は左端を残して0またはC_lへするepである。

epでは右端が残るなら元色がC_lで、短いepへ無料で付け足せる。消えるなら最後に残すC_lの直後で切り、左のepと右のdpへ分けられる。残る左端が先行操作を跨がせないためこの分割も独立である。長さに関する帰納法で二表の遷移は全最適消去列を表す。円でも最後の消去区間の境界をcutに取ると、それ以前の操作はその境界を跨がず線形解になる。全cutの最小が円の最適値に一致する。

## 実装上の注意

- 半開区間と長さr−lを統一する。epの左端を残す意味を保ち、C_l=C_{r−1}の分岐を明示する。
- 同じ区間のepを確定してから全区間消去候補をdpへ入れる。全分割先は短い区間なので長さ昇順でよい。
- 二重列の長さN以下だけを計算する。X_i≤10^9で総費用は32 bitを超えるので64 bit整数を使う。

## 復習の核

- N≤7で操作区間・色をbounded BFSし、同色が離れて現れるcase、全同色、cutを跨ぐ最適操作をDPと比較する。

## 計算量と制約

### 時間

円周 N 点。二重列の長さ≤N区間は O(N²)、各区間に O(N) 分割を試すため O(N³)。

### 空間

dp と補助 ep の区間表で O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 400; 1 \leq C_i \leq N; 1 \leq X_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/editorial/12625) — source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/tasks/abc400_f) — source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a
