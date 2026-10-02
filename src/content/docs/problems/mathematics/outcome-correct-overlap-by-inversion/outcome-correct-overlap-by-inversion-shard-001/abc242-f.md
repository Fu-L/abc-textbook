---
title: "ABC242-F — Black and White Rooks"
draft: true
authoringUnit: {"problemId":"abc242-f","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc242-f.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc242-editorial-3522-d39e3de67b27391779fc77a8c4b78a0c312a6680143b1c75af6a07908174f39f","source-abc242-f-problem-a91e15c3ea5df8a298ef6f8f613cebf8ab72483d0ca9df9344328e0bb0171108"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一行に両色があれば色の異なる隣接rookが攻撃し合うので、使用行集合も列集合も両色で互いに素が必要十分。使用行列数を固定し空行・空列を包除で除いたfを使うと、各配置の実際の使用集合が一意になる。黒用集合と残りからの白用集合の二項係数を掛けることで全配置を一度数える。","sourceRevisionIds":["source-abc242-editorial-3522-d39e3de67b27391779fc77a8c4b78a0c312a6680143b1c75af6a07908174f39f","source-abc242-f-problem-a91e15c3ea5df8a298ef6f8f613cebf8ab72483d0ca9df9344328e0bb0171108"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

一つの行に白黒両方があれば、その行で色が切り替わる隣接二 rook の間に別 rook はなく互いに攻撃する。よって白が使う行・列と黒が使う行・列はそれぞれ互いに素であることが必要十分になる。

具体的な行列集合は対称なので、各色が使う行数・列数だけを固定し、選ぶ集合数を二項係数で掛ければ指数的な subset 選択を避けられる。

採用する候補: 使用行列数 (i,j,k,l) を列挙し、選んだ n×m 全行全列を使って x rook を置く個数 f(n,m,x) を包除原理で前計算して組み合わせる。

色間の非攻撃条件を support 集合の disjointness、同色配置を全 support 使用の cell subset 数へ分離できる。

棄却する候補: 白黒それぞれが使う行集合・列集合を bitmask で全列挙する。

N,M は50で、行または列 subset だけでも指数個になる。

f(n,m,x)=Σ_{a=0}^nΣ_{b=0}^m(-1)^{a+b}C(n,a)C(m,b)C((n-a)(m-b),x) と、空の行・列を包除すれば求められる。

x=B,W について全 n≤N,m≤M の f を計算する。黒の使用行 i・列 k、白の使用行 j・列 l を正の範囲で選び、C(N,i)C(N-i,j)C(M,k)C(M-k,l)f(i,k,B)f(j,l,W) を全て加算する。

## 典型の発動条件

### support 集合のサイズ固定

発動条件: ラベル付き行列の具体的な support 選択は多いが、配置数が support の大きさだけに依存するとき。

サイズを列挙し、具体的集合の選び方を binomial coefficient として後掛けする。

### 空行・空列の包除

発動条件: 選んだ長方形の全行・全列を少なくとも一度使う cell subset を数えるとき。

空にする行列集合を選び、残る cell から選ぶ個数を符号付きで加える。

## 問題固有の要素

rook の間に駒があれば遮られる規則でも、同じ行に二色が共存すれば色境界の隣接 rook が必ず攻撃するため、support disjoint が必要になる。

別の問題へ持ち帰る視点: 遮蔽物付き攻撃条件では、同一直線上の並びで異種が隣接する境界が生じるかを見る。

## 正当性

一行に両色があれば色の異なる隣接rookが攻撃し合うので、使用行集合も列集合も両色で互いに素が必要十分。使用行列数を固定し空行・空列を包除で除いたfを使うと、各配置の実際の使用集合が一意になる。黒用集合と残りからの白用集合の二項係数を掛けることで全配置を一度数える。

## 実装上の注意

- B>n·m などの二項係数は0として扱う。両色は1個以上なので使用行列数も正で、白用集合は黒用を除いた残りから選ぶ。

## 復習の核

- 同じ行に B-W-B と並ぶ例でも中央の色境界に攻撃 pair が残ることを確認し、support disjoint の必要性を説明する。

## 計算量と制約

### 時間

O(N²M²)。各色の全行列数の包除と使用行列数の全組を列挙する。

### 空間

O(NM+NM+B+W)の係数表、階乗表はO(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 50; 1 \leq B,W \leq 2500; B+W \leq N \times M; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/editorial/3522) — source-abc242-editorial-3522-d39e3de67b27391779fc77a8c4b78a0c312a6680143b1c75af6a07908174f39f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/tasks/abc242_f) — source-abc242-f-problem-a91e15c3ea5df8a298ef6f8f613cebf8ab72483d0ca9df9344328e0bb0171108
