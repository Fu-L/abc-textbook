---
title: "ABC249-G — Xor Cards"
draft: true
authoringUnit: {"problemId":"abc249-g","docPath":"src/content/docs/problems/mathematics/outcome-maintain-xor-linear-basis/outcome-maintain-xor-linear-basis-shard-001/abc249-g.md","learningOutcomeIds":["outcome-maintain-xor-linear-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis"],"sourceRevisionIds":["source-abc249-editorial-3791-ee382c44f4b4af3bfe1362b47fd7d72e1fd71ef2abda63f6386ceb1b1caa7e32","source-abc249-g-problem-778ba404c2c711fbb755b3caec725c2e66bb81c9bccee22d043387af045a4719"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"連結ベクトルの行基本変形は、同じ選択係数をAとBへ作用させたspanを保つ。A≤Kの値は、Kと一致する場合か最初に異なるbitがK=1,A=0の場合に排他的に分かれるので、列挙枝は全ての許容値を覆う。\n\n固定bitに自由行wがあれば、そのbitを合わせたv0と、wで同じbitを消した残りの行は条件を満たす全解をv0 XOR span(W)として表す。以前の固定bitではw=0だから上位も保たれる。自由行がない場合は全解でbitがv0の値に固定され、矛盾なら解なしとなる。この帰納法により各枝の空間を正確に構成する。Bへ射影しても可能集合はv0.B XOR span(W.B)で、高位pivotの最大化は低位で上位を変えられないことから最適である。\n\n非零の対は空集合では得られない。最大B=0で非零の対がある条件はv0≠0またはdim(W)>0。対が零だけの場合、N個の選択係数から連結ベクトルへの線形写像は階数r、kernel次元N−rなので、N>rと非空な零表現の存在が同値である。従って非空条件を落とさず各枝の最適値を比較できる。","sourceRevisionIds":["source-abc249-editorial-3791-ee382c44f4b4af3bfe1362b47fd7d72e1fd71ef2abda63f6386ceb1b1caa7e32","source-abc249-g-problem-778ba404c2c711fbb755b3caec725c2e66bb81c9bccee22d043387af045a4719"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

カードの選択を(AのXOR,BのXOR)の対として扱う。各カードを(A_i<<30)|B_iという60bitベクトルにし、F₂上の基底へ圧縮する。AとBを別々に消去すると、同じカード集合を使う相関が失われる。元のN枚と連結ベクトルの階数rも保存する。基底は値の集合を保つが、零ベクトルの非空な表現が存在するかは階数だけを残して判定する必要がある。

A≤Kは、全30bitがKと一致する枝と、Kのbit tが1で初めてA_t=0となる枝に分かれる。後者はtより上をKと一致させ、tを0、下位を自由にする。高々31枝であり、各枝はA接頭辞の連立一次条件になる。

条件を付けると実現可能集合は一般に線形空間ではなく、代表解v0をずらしたアフィン空間v0 XOR span(W)になる。各枝はv0=(0,0)、W=元の独立基底から始め、固定bitを高位から次の手順で消去する。

```text
Aのbit tをeに固定する:
  W内でA_t=1の行wを探す
  なければ、v0.A_t!=eの枝は矛盾として捨てる
  あれば、v0.A_t!=eならv0 ^= w
          Wの他のA_t=1の行uをu ^= wとする
          Wからwを取り除く
```

Wの全行は既に固定したbitが0なので、この更新は上位条件を変えない。最後にv0が一つの実現可能な対、Wが固定接頭辞を変えない自由空間の独立基底として残る。

WのB成分だけで通常のXOR基底を作り、res=v0.Bから高bit順に、res XOR basis[b]が大きければ採用する。これはv0.B XOR span(W.B)の最大値である。0から始めると代表解を捨ててしまう。例えば一枚(A,B)=(1,5)、K=1の一致枝ではv0=(1,5)、Wは空で、最大は5となる。

非空条件を最後に確認する。最大B>0なら、それを作る対は非零なので必ず非空である。最大B=0なら全ての実現可能な対のBは0。v0≠(0,0)またはWが空でなければ、非零の対を選べるので0を有効な候補にできる。どちらもなく枝の対が(0,0)だけでも、N>rなら元の選択係数のkernelが非自明であり、非空集合で(0,0)を作れる。N=rなら独立なので零を作るのは空集合だけで、この枝を捨てる。

K=0、一枚(1,0)ならA=0枝はv0=0,W空,N=r=1で不適格、答え−1。同じカードが二枚ならspanは同じでもN=2>r=1で、二枚の選択が(0,0)を作り答え0になる。一枚(0,0)もN=1>r=0で有効である。全ての矛盾しない非空枝の最大を取り、候補がなければ−1を返す。

## 典型の発動条件

### 相関を保つ連結基底

発動条件: 同じ部分集合のXORを、一方で制約し他方で最大化する。

(A,B)を一体として消去する。接頭辞固定後は代表解v0と自由空間Wを保持し、目的側をv0.Bから最大化する。

### 二進上限の枝分け

発動条件: 線形なbit条件に数値上限A≤Kが付く。

最初の相違bitを列挙すると、高々bit数+1個の連立一次条件へ分けられる。非空選択はspanとは別にN−rankを使って判定する。

## 問題固有の要素

制約値Aと目的値Bを一体のベクトルにすることが、同一部分集合という相関を保ったまま線形代数を使う鍵である。

別の問題へ持ち帰る視点: 線形空間上の辞書順制約は、接頭辞が境界未満になる最初の位置を列挙して自由な接尾辞最適化へ分ける。

## 正当性

連結ベクトルの行基本変形は、同じ選択係数をAとBへ作用させたspanを保つ。A≤Kの値は、Kと一致する場合か最初に異なるbitがK=1,A=0の場合に排他的に分かれるので、列挙枝は全ての許容値を覆う。

固定bitに自由行wがあれば、そのbitを合わせたv0と、wで同じbitを消した残りの行は条件を満たす全解をv0 XOR span(W)として表す。以前の固定bitではw=0だから上位も保たれる。自由行がない場合は全解でbitがv0の値に固定され、矛盾なら解なしとなる。この帰納法により各枝の空間を正確に構成する。Bへ射影しても可能集合はv0.B XOR span(W.B)で、高位pivotの最大化は低位で上位を変えられないことから最適である。

非零の対は空集合では得られない。最大B=0で非零の対がある条件はv0≠0またはdim(W)>0。対が零だけの場合、N個の選択係数から連結ベクトルへの線形写像は階数r、kernel次元N−rなので、N>rと非空な零表現の存在が同値である。従って非空条件を落とさず各枝の最適値を比較できる。

## 実装上の注意

- 連結値はAを上位30bit、Bを下位30bitへ置き、符号なし64bitで扱う。各枝は元基底のコピーから始め、矛盾した枝は最大化しない。
- WのB成分が0、またはB側で従属でも、その全対の自由度は非空判定へ必要なので、dim(W)をB側の階数に置き換えない。
- 目的値0と候補なしを区別し、初期回答を−1にする。Nと元の60bit階数rを最後まで保持する。

## 復習の核

- 線形条件の固定後は「代表解＋自由空間」。自由基底だけを0から最大化しない。
- spanが同じでも、零を非空で表せるかはN−rankで変わる。
- 上限制約は最初に小さくなるbitと完全一致の枝で網羅する。

## 計算量と制約

### 時間

O(NB+B³)、B=60。元基底へのN回挿入はO(NB)。高々31枝で、bit条件の消去とB射影基底の構築を各O(B²)、最大化をO(B)で行う。

### 空間

O(B)の作業基底と代表解。各枝を順に処理し、入力も挿入して捨てればO(B)、全カードを保存する実装はO(N+B)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1000; 0 \leq K \lt 2^{30}; 0 \leq A_i, B_i \lt 2^{30} \, (1 \leq i \leq N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3791) — source-abc249-editorial-3791-ee382c44f4b4af3bfe1362b47fd7d72e1fd71ef2abda63f6386ceb1b1caa7e32
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_g) — source-abc249-g-problem-778ba404c2c711fbb755b3caec725c2e66bb81c9bccee22d043387af045a4719
