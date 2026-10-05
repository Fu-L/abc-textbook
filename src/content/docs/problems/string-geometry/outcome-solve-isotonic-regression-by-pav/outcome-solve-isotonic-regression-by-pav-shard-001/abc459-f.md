---
title: "ABC459-F — -1, +1"
draft: true
authoringUnit: {"problemId":"abc459-f","docPath":"src/content/docs/problems/string-geometry/outcome-solve-isotonic-regression-by-pav/outcome-solve-isotonic-regression-by-pav-shard-001/abc459-f.md","learningOutcomeIds":["outcome-solve-isotonic-regression-by-pav"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-isotonic-regression-pav"],"sourceRevisionIds":["source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59","source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各操作は一つの境界の右向き移送数h_iだけを1増やす。最終的な広義増加列bは総和が等しくh_i=Σ_{j≤i}(a_j−b_j)≥0なら左からの移送で実現でき、必要操作数はΣh_iとなる。逆転している境界だけを移送する手順は、任意の実現可能な単調目標への移送数h*を成分ごとに超えない。初めて超える直前にh_i=h*_i、隣の移送数はh*以下なので、現在値はa'_i≤b*_i、a'_{i+1}≥b*_{i+1}となり、b*_i≤b*_{i+1}から逆転できないためである。従ってこの手順は各境界の移送数とその総和を最小にする。\n\n長さL・総和S=Lq+rの均し列は、任意の広義増加整数列の中で全prefix和が最大である。長さkのprefix末尾がq以下なら和≤kq、q+1以上なら後続が全てq+1以上なので和≤S−(L−k)(q+1)。二場合の上限の大きい方kq+max(0,k−(L−r))が均し列のprefix和そのものである。\n\n境界が逆転する二均しblockは、和の均し列へ右移送だけで到達できる。同じ床商qなら左にあるq+1を右のqへ移して、全q+1を後ろへ集めればよい。左床商q_u>q_vなら合併後の床商qはq_v,…,q_u内にある。q<q_uのとき左の値は全てq+1以上、q>q_vのとき右の値は全てq以下なので、合併目標の各prefixは元以下となる。q=q_uまたはq=q_vの端の場合も、合併後の余りはそれぞれ左の余り以下・右の余り以上となり、同じprefix条件を保つ。よって均し目標への移送数hが非負である。逆転解消はこの目標のhを超えず、停止列のprefixは目標以上になる一方、単調列のprefixは上の最大性から目標以下である。従って停止列は均し目標と一致する。stackはこの区間内の逆転解消を一括し、直前境界も再検査するので、最後は逆転解消手順と同じ安定列になる。そのprefix差を合計した回答は最小操作数である。","sourceRevisionIds":["source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59","source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [isotonic regression・PAV](src/content/docs/learn/geometry-optimization/isotonic-regression.md)

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

以下では0-indexとし、a_i=A_i−iへずらす。元の狭義増加条件はaの広義増加になり、操作はa_iを1減らしてa_{i+1}を1増やすままである。操作後に負の値を持ってよいので、非負へ丸めない。

境界iを右へ横切った単位数をh_iとすると、最終列bのprefix差はh_i=Σ_{j=0}^i(a_j−b_j)。操作数はΣ_{i=0}^{N−2}h_iであり、h_i≥0と総和一致が到達可能性の必要十分条件である。実際、左から境界iへh_i個移せばbを作れる。したがって最終列を求めた後は移動を逐次再現する必要はない。

最も左の逆転a_i>a_{i+1}を解消する単位移動を繰り返すと最適な安定列になるが、値差が巨大なのでまとめたい。互いに連結して均された区間を長さL・総和Sのblockで表す。q=floor_div(S,L)、r=S−qL（0≤r<L）として、その均し列は先頭L−r個がq、末尾r個がq+1。つまり位置t=0,…,L−1はfloor((S+t)/L)で、先頭floor(S/L)、末尾ceil(S/L)を定数時間で得る。

各a_iを(L,S)=(1,a_i)としてstackへ追加する。末尾の左block(u,S_u)、右block(v,S_v)が

ceil_div(S_u,u)>floor_div(S_v,v)

なら、この二つの均し列の境界に逆転があるためpopし、(u+v,S_u+S_v)をpushする。新しい直前境界も同じ式で再検査する。整数では平均値の比較だけでは足りない。例えばshift後a=(1,0,1,0)の二block(2,1),(2,1)は平均がともに1/2でも、均し列(0,1),(0,1)の境界は1>0なので併合する。

残った各blockをq,rから全体のbへ一度だけ展開する。prefix差Hを0で始め、i=0,…,N−2でH+=a_i−b_i、answer+=Hとする。同じ値はΣ_{i=0}^{N−1}i(b_i−a_i)でも計算できる。元の値へ戻した列はB_i=b_i+iであり、prefix差はshift前後で同じ。N=1なら境界がなく答え0。

隣接の均し形が両立しないblockをまとめる発想はPAVと共通だが、ここで扱うのは二乗損失の実数平均ではない。整数の先頭・末尾、右向き移送という到達条件、prefix差という目的を具体化して使う。各blockは一回追加され高々一回併合で消えるので、展開と回答集計も含めO(N)。

## 典型の発動条件

### pool adjacent violators

発動条件: 単調制約下で隣接違反をblock平均化して一意解を求めるとき。

stack上で違反blockをmergeし、平坦な整数列へ均す。

### index shiftによる単調制約変換

発動条件: 隣接差が少なくとも1の整数列を作りたいとき。

A_i-iで狭義単調を広義単調へ変える。

## 問題固有の要素

局所操作の回数を追う代わりに、保存されるblock総和と最終単調形を直接構成する。

別の問題へ持ち帰る視点: isotonic型問題では隣接blockの解が境界で両立しないとき、その二blockを一つの平均化問題へ統合する。

## 正当性

各操作は一つの境界の右向き移送数h_iだけを1増やす。最終的な広義増加列bは総和が等しくh_i=Σ_{j≤i}(a_j−b_j)≥0なら左からの移送で実現でき、必要操作数はΣh_iとなる。逆転している境界だけを移送する手順は、任意の実現可能な単調目標への移送数h*を成分ごとに超えない。初めて超える直前にh_i=h*_i、隣の移送数はh*以下なので、現在値はa'_i≤b*_i、a'_{i+1}≥b*_{i+1}となり、b*_i≤b*_{i+1}から逆転できないためである。従ってこの手順は各境界の移送数とその総和を最小にする。

長さL・総和S=Lq+rの均し列は、任意の広義増加整数列の中で全prefix和が最大である。長さkのprefix末尾がq以下なら和≤kq、q+1以上なら後続が全てq+1以上なので和≤S−(L−k)(q+1)。二場合の上限の大きい方kq+max(0,k−(L−r))が均し列のprefix和そのものである。

境界が逆転する二均しblockは、和の均し列へ右移送だけで到達できる。同じ床商qなら左にあるq+1を右のqへ移して、全q+1を後ろへ集めればよい。左床商q_u>q_vなら合併後の床商qはq_v,…,q_u内にある。q<q_uのとき左の値は全てq+1以上、q>q_vのとき右の値は全てq以下なので、合併目標の各prefixは元以下となる。q=q_uまたはq=q_vの端の場合も、合併後の余りはそれぞれ左の余り以下・右の余り以上となり、同じprefix条件を保つ。よって均し目標への移送数hが非負である。逆転解消はこの目標のhを超えず、停止列のprefixは目標以上になる一方、単調列のprefixは上の最大性から目標以下である。従って停止列は均し目標と一致する。stackはこの区間内の逆転解消を一括し、直前境界も再検査するので、最後は逆転解消手順と同じ安定列になる。そのprefix差を合計した回答は最小操作数である。

## 実装上の注意

- Sが負でもq=floor(S/L)、r=S−qLを使う。余りr個を後ろへ置く。切上げは−floor(−S/L)で求める。
- 併合の判定は左末尾ceil(S_u/u)と右先頭floor(S_v/v)。実数の平均だけを比較しない。
- shift後の値も最終値も負になってよい。prefix差と回答は64bitで保持する。

## 復習の核

- PAVの「平均を比較する」をそのまま使わず、整数のblock解の両端を比較する。
- 保存量からprefix差を取り出すと、巨大な回数の隣接移送を列そのものの構築へ置き換えられる。

## 計算量と制約

### 時間

O(N)。長さ・総和blockのstack mergeとprefix操作数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 3 \times 10^5; 1 \le N \le 2 \times 10^5; 0 \le A_i \le 10^9; The sum of N across all test cases is at most 6 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20507) — source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_f) — source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3
