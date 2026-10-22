---
title: "ABC386-E — Maximize XOR"
draft: true
authoringUnit: {"problemId":"abc386-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc386-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0","source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"全要素のXORは、選択した要素のXORと選択しなかった要素のXORとのXORに等しい。同じ値を二度XORすると打ち消されるため、選択しなかった要素のXORが分かれば、選択した要素のXORを定数時間で復元できる。\n\n列挙では添字を狭義昇順に選ぶ。任意の $$r$$ 個の添字を昇順に並べると、各段階の添字は、残りの個数を選び切れる上限 $$N-q$$ 以下にある。従って、どの組合せにも一意な再帰経路があり、全 $$\\binom{N}{r}=\\binom{N}{K}$$ 個の候補を漏れも重複もなく評価する。補集合への対応も一対一なので、これらの最大値が答えとなる。$$K=N$$ では空の非選択集合を一度評価し、全要素のXORを答えにできる。","sourceRevisionIds":["source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0","source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

制約はN自体でなく組合せ数C(N,K)≤10^6を保証しているため、最終候補集合は全列挙できる。ただし素朴DFSの途中node数はKがNに近いと中央binomialまで膨らむ。

選択K個のXORは、全要素XORと非選択N-K個のXORとのXORで復元できる。

採用する候補: min(K,N-K)側のsubsetを組合せ列挙し、必要なら全体XORで補集合へ戻す

棄却する候補: 常に選択K個をinclude/exclude DFSで列挙する

KがNに近いと答え候補数は少なくても途中で巨大な浅いsubset群を通り、C(N,⌊N/2⌋)級の呼出しが発生し得る。

全要素のXORを `allXor` とし、入力を読みながら計算する。$$r=\min(K,N-K)$$ とおき、$$r$$ 個の添字の組合せを昇順に列挙する。ここでは途中の状態も数えられるように、次の列挙器を使う。

添字を $$0,\ldots,N-1$$ とする。再帰状態 $$(s,q,x)$$ は、次に選べる最小の添字が $$s$$、あと選ぶ個数が $$q$$、すでに選んだ値のXORが $$x$$ であることを表す。初期状態は $$(0,r,0)$$。$$q>0$$ なら、次の添字 $$i$$ を $$s\leq i\leq N-q$$ の範囲で動かし、$$(i+1,q-1,x\mathbin{\oplus}A_i)$$ へ再帰する。上限を $$N-q$$ とするのは、残りの $$q-1$$ 個を必ず選び切れるようにするためである。

$$q=0$$ になったら一つの完成候補である。$$K\leq N-K$$ なら $$x$$、そうでなければ $$\mathrm{allXor}\mathbin{\oplus}x$$ で最大値を更新し、すぐに戻る。XORは再帰のたびに更新しており、完成時に選んだ要素を走査し直す必要はない。$$r=0$$ でも初期状態がそのまま完成候補となり、空組合せのXORである0を一度評価する。

## 典型の発動条件

### 補集合の全探索

発動条件: 選ぶ個数が全体に近く、選ばない個数が小さいとき。

XORの可逆性を使って非選択集合だけを列挙する。

### 出力候補数保証の直接利用

発動条件: 入力sizeでなく組合せ総数そのものが制約されているとき。

C(N,K)個の候補を漏れなく列挙する。

## 問題固有の要素

組合せ数が小さくても通常のbinary DFS木は小さいとは限らず、列挙器が完成候補にほぼ比例して動くかまで評価する必要がある。

別の問題へ持ち帰る視点: 特殊制約を読む際は答え状態数だけでなく、選んだ列挙アルゴリズムの中間状態数も同じ上限で抑えられるか確認する。

## 正当性

全要素のXORは、選択した要素のXORと選択しなかった要素のXORとのXORに等しい。同じ値を二度XORすると打ち消されるため、選択しなかった要素のXORが分かれば、選択した要素のXORを定数時間で復元できる。

列挙では添字を狭義昇順に選ぶ。任意の $$r$$ 個の添字を昇順に並べると、各段階の添字は、残りの個数を選び切れる上限 $$N-q$$ 以下にある。従って、どの組合せにも一意な再帰経路があり、全 $$\binom{N}{r}=\binom{N}{K}$$ 個の候補を漏れも重複もなく評価する。補集合への対応も一対一なので、これらの最大値が答えとなる。$$K=N$$ では空の非選択集合を一度評価し、全要素のXORを答えにできる。

## 実装上の注意

- 値は60 bitなので64 bit unsigned相当で持つ。
- $$q=0$$ の判定は次の添字を選ぶループより先に行う。$$K=N$$ ではこれにより空組合せを一度処理する。
- 再帰には添字・残り個数・XORだけを渡す。各呼出しで入力配列や選んだ要素列をコピーしない。

## 復習の核

- (N,K)=(100,98)のような補集合有利例とK=N,1を試し、N≤20ではbitmask全探索の最大値と比較する。

## 計算量と制約

### 時間

入力の読み込みと全体XORの前計算に $$O(N)$$、完成した $$\binom{N}{r}$$ 個の候補の評価にそれぞれ $$O(1)$$ を使う。

途中の再帰状態も数える。次の添字を $$N-q$$ 以下に制限したので、すべての状態は少なくとも一つの完成候補へ延長できる。完成候補までの経路は根を含め $$r+1$$ 状態であり、列挙木の全状態は、全完成候補への経路を重ね合わせると覆える。従って状態数は高々 $$(r+1)\binom{N}{r}$$。各状態での処理と、子状態一つを生成する処理は定数時間なので、全体の上界は

$$
O\!\left(N+(r+1)\binom{N}{r}\right)
$$

となる。$$r=0$$ では $$\binom{N}{0}=1$$ なので $$O(N+1)$$ であり、空組合せの1回の評価と入力処理の両方を含む。

### 空間

入力配列に $$O(N)$$、深さが高々 $$r$$ の再帰スタックに $$O(r+1)$$ を使い、全体で $$O(N+r+1)$$ 空間。完成候補はその場で評価するので、全候補の保存は不要である。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq K\leq N\leq 2\times 10^5; 0\leq A_i<2^{60}; \dbinom{N}{K}\leq 10^6; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/tasks/abc386_e) — source-abc386-e-problem-e1f49d50548e219465a1696d7c45828cea62061cc1995fd3f4e74f29d60e63c0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/editorial/11697) — source-abc386-editorial-11697-1f8ad337c682c1b9ee95e2c2265649f581f30715ea292ca96743620dacd5c251
