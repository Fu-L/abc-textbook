---
title: "ABC427-G — Takahashi's Expectation 2"
draft: true
authoringUnit: {"problemId":"abc427-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc427-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-monotone-search"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-amortized-monotone-progress","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd","source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一価値の作用をf_vとする。p+A>qの場合、二操作の変化が二回上がる領域はT≤q−A、二回下がる領域はT>max(p,q+B)、その間は一回ずつとなる。よって元組も変換後の(q−A,max(q,p−B))も、この三領域でそれぞれT+2A、T−2B、T+A−Bを返す。局所変換は全Tへの作用を保存し、前後との関数合成も保存する。\n\n線形マージの不変量を具体化する。Qの先頭r個を挿入済みとし、出力prefixの後ろに残るP[j]（l≤j<L）の実効値は\n\n```text\nV_j = max(P[j] - rB, h + (j-l+1)A)\n```\n\nである。空prefixでは下限項を省く。残るQはまだ元の順で後ろにあり、r<Rならq=Q[r]−(L−l)A≥h+Aも保つ。\n\np≤qのときV_l=max(p,h+A)≤q。Pの良い条件から後続の生値もP[l]から少なくともAずつ増えるため、V_lを出してlを一つ進めても上の尾部表現を保つ。Q[r]は、このPをまたぐより前に良い条件を満たして停止するか、さらに右で停止するので、出したprefixへ後から入ってこない。\n\nq<pなら全j≥lでP[j]−rB≥p+(j−l)A>q+(j−l)Aとなる。従ってQ[r]は未処理Pの全てと悪い組になり、局所変換でその全てを越えてqとしてprefix直後へ入る。P[j]の変換後はmax(P[j]−(r+1)B,q+(j−l+1)A)となり、h=q、r←r+1で不変量を保つ。次のQ候補はQの良い条件から少なくともq+Aである。Pを出す場合も次のqはA増えるのでq≥h+Aを保つ。片側終了では残るPへこの下限を適用するか、補正不要の残るQを出せばよい。\n\nしたがって出力は良い列で、逐次挿入と同じ作用を表す。各反復はlかrを一つだけ進めるのでL+R回で完了する。良い列の下降prefix長kは狭義増加閾値P_i+iBへの二分探索で求まり、T+mA−k(A+B)が作用を返す。ブロックを時系列順に合成することで元列の結果を得る。","sourceRevisionIds":["source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd","source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

一個の価値vはテンションTへ、T≤vなら+A、T>vなら−Bという作用を持つ。列全体をこの関数の合成と見れば、値が変わっても全初期Tへの作用が同じ列へ置き換えてよい。元列を毎回シミュレーションすると一質問が列長に比例するので、照会しやすい代表列を探す。

「良い列」をP_i+A≤P_{i+1}と定義する。一度上がったらT+A≤P_i+A≤P_{i+1}なので以後も上がり、下がるprefixと上がるsuffixに分かれる。0-indexで最初のk個が下がる条件はT>P_i+iBである。この閾値列は狭義増加なので、lower_boundでT以上である最初の閾値を探し、下がる個数kを得る。長さmの最終値はT+mA−k(A+B)。等号T=P_i+iBは上がる側である。

隣接組(p,q)がp+A>qなら、等価な組(q−A,max(q,p−B))へ変換できる。前後の列はそのままでよい。Qの要素を一つずつP末尾へ追加し、悪い隣接組を左向きに直せば良い列になるが、これだけではO(|P||Q|)。例えばA=B=1、P=(0,…,m−1)、Q=(−m,…,−1)ではm²回変換する。二進ブロックを使う前に、この挿入の反復をまとめる必要がある。

良い列P,Qの長さをL,R、未出力位置をl,r、直前の出力をhとして、次のマージを行う。空prefixのhは数学上の−∞とし、実装では「出力が空ならmaxの第一項を省く」とすれば番兵は不要である。

```text
l = r = 0; out = []
while l < L or r < R:
    if l == L:
        out.append(Q[r]); r += 1
    else:
        p = P[l] - r*B
        if r < R: q = Q[r] - (L-l)*A
        if r < R and q < p:
            out.append(q); r += 1
        else:
            out.append(p if out is empty else max(out.back()+A, p))
            l += 1
```

qはQ[r]を未処理のP全部の左へ通した時の値、pは既に通したQのr個分だけ下がったP[l]の値である。P側には、過去のQが局所変換で作った下限h+Aも残るのでmaxを取る。Q側はqそのものを出す。単に元の先頭値を比較するマージではない。

長さが相異なる2冪のブロックを古い順に持つ。初期N個も末尾追加と同じ方法で取り込む。追加を長さ1の良い列として、末尾が同長なら古い方をP、新しい方をQとして上のマージを繰り返す。質問では古いブロックから順に現在Tを二分探索で更新する。全追加後の長さM≤N+Qに対し、各要素が各サイズ段階で一度ずつマージされるので、追加全体O(M log M)、質問一回O(log²M)になる。

## 典型の発動条件

### 関数としての列の正規形

発動条件: 列が状態への作用を表し、局所的な等価変換で照会しやすい形へ直せるとき。

プレゼント列を全初期値 T に対して同じ結果を返す良い列へ正規化する。

### 二進カウンタ型ブロック分解

発動条件: 末尾追加があり、同サイズの要約を線形時間でマージできるとき。

2 冪長の良い列を高々一つずつ持ち、carry のようにマージして償却計算量を抑える。

### 単調境界の二分探索

発動条件: 正規化後の列で判定結果が一度だけ切り替わるとき。

テンションが下がる区間と上がる区間の境界を探し、まとめて作用を計算する。

## 問題固有の要素

保存すべきものは値列そのものより、任意の T への作用を保つ照会容易な代表列である。

別の問題へ持ち帰る視点: 合成可能な正規形と二進ブロックを組み合わせると、オンライン追加と全体作用の照会を両立できる。

## 正当性

一価値の作用をf_vとする。p+A>qの場合、二操作の変化が二回上がる領域はT≤q−A、二回下がる領域はT>max(p,q+B)、その間は一回ずつとなる。よって元組も変換後の(q−A,max(q,p−B))も、この三領域でそれぞれT+2A、T−2B、T+A−Bを返す。局所変換は全Tへの作用を保存し、前後との関数合成も保存する。

線形マージの不変量を具体化する。Qの先頭r個を挿入済みとし、出力prefixの後ろに残るP[j]（l≤j<L）の実効値は

```text
V_j = max(P[j] - rB, h + (j-l+1)A)
```

である。空prefixでは下限項を省く。残るQはまだ元の順で後ろにあり、r<Rならq=Q[r]−(L−l)A≥h+Aも保つ。

p≤qのときV_l=max(p,h+A)≤q。Pの良い条件から後続の生値もP[l]から少なくともAずつ増えるため、V_lを出してlを一つ進めても上の尾部表現を保つ。Q[r]は、このPをまたぐより前に良い条件を満たして停止するか、さらに右で停止するので、出したprefixへ後から入ってこない。

q<pなら全j≥lでP[j]−rB≥p+(j−l)A>q+(j−l)Aとなる。従ってQ[r]は未処理Pの全てと悪い組になり、局所変換でその全てを越えてqとしてprefix直後へ入る。P[j]の変換後はmax(P[j]−(r+1)B,q+(j−l+1)A)となり、h=q、r←r+1で不変量を保つ。次のQ候補はQの良い条件から少なくともq+Aである。Pを出す場合も次のqはA増えるのでq≥h+Aを保つ。片側終了では残るPへこの下限を適用するか、補正不要の残るQを出せばよい。

したがって出力は良い列で、逐次挿入と同じ作用を表す。各反復はlかrを一つだけ進めるのでL+R回で完了する。良い列の下降prefix長kは狭義増加閾値P_i+iBへの二分探索で求まり、T+mA−k(A+B)が作用を返す。ブロックを時系列順に合成することで元列の結果を得る。

## 実装上の注意

- マージの比較はP[l]−rBとQ[r]−(L−l)A。等号ではP側を出す。P側のmax(h+A,p)を落とさない。
- 空列、片側終了、空の出力prefixを分ける。数学上の−∞を有限整数の最小値にしてAを加える実装は避け、空判定で扱える。
- 値の補正には列長×A,Bが現れる。M≤4×10^5なので64 bit整数を使う。問い合わせはT>閾値の個数で、等号は上昇に含める。
- 同長ブロックの古い方を左引数にし、質問も古い順に作用させる。

## 復習の核

- 局所変換が定数時間でも、その全反復が線形とは限らない。未処理要素の補正をcursor数でまとめる。
- マージでは作用保存、良い列条件、各cursorの単調進行を別々に証明する。
- 二進カウンタの償却が使えるのは、同長ブロックのマージ自体が線形になった後である。

## 計算量と制約

### 時間

Mを初期N個と全追加個数の和、Q₂を質問数とする。初期構築と追加全体O(M log M)、質問全体O(Q₂ log²M)。一マージは二cursorを計L+R回進め、各要素はサイズ倍増の各段で一度参加する。

### 空間

O(M)。保存ブロックの総長M、マージ中の入力と出力も合計O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le A\le10 ^ 9; 1\le B\le10 ^ 9; -10 ^ 9\le P _ i\le10 ^ 9\ (1\le i\le N); 1\le Q\le2\times10 ^ 5; T _ i=1 or T _ i=2\ (1\le i\le Q); There exists an integer i\ (1\le i\le Q) such that T _ i=2.; If T _ i=1, then -10 ^ 9\le X _ i\le10 ^ 9. (1\le i\le Q); If T _ i=2, then -10 ^ {12}\le X _ i\le10 ^ {12}. (1\le i\le Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/editorial/14187) — source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/tasks/abc427_g) — source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1
