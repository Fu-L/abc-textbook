---
title: "ABC300-G — P-smooth number"
draft: true
authoringUnit: {"problemId":"abc300-g","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc300-g.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-two-pointers-window"],"sourceRevisionIds":["source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf","source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"二群の素数集合は重ならないため、素因数分解の一意性により、各P-smooth数は一方の素数の積uと他方の積vの組へ一意に分解される。各群内でも素数を追加する際、旧リストだけを各正の冪で増やすので重複生成しない。uv≤Nなら各因子もN以下なので、各リストをNで打ち切っても必要な組は残る。sort後、uが増えるとvの許容上限N/uは減るので、二ポインタで全組を一度数える。\n\n小さい側へ次の素数を入れる方針は実用的な分割の工夫であり、それ自体は最悪リストサイズの証明ではない。実行時間は生成したリスト長U,Vに依存する。最大入力N=10^16,P=100で、素数を昇順に追加し、同長なら第二リストへ入れる規約を実際に計算するとU=4,141,074,V=2,903,751、総生成7,044,825個である。答えの2,345,134,674個を全生成する必要はなく、約56.4MBの64bit値配列とsortで扱える。","sourceRevisionIds":["source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf","source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

先に読む単元:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md) — 窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

## 考察

N≤10^16を整数ごとに調べることはできない。P≤100なので使える素数は25個以下だが、全smooth数を一つの列へ生成しても最大入力で約23億個になる。素数集合を二群へ分け、各側でN以下の素数冪積だけを列挙するmeet-in-the-middleを使う。

両リストは1から始める。素数を昇順に見て、現在のリスト長が小さい側へ追加する（同長なら第二側）。旧リストを固定し、その各値uについてu p,u p²,…≤Nを追加する。新しい素数なので全要素は重複しない。最大入力での実際の生成長は正当性節に示す通り、全smooth数より大幅に小さい。

両側をsortし、一方を昇順に走査する。他方の末尾を、v≤N/uになるまで下げ、その位置までの要素数を答えへ加える。配列を均衡化する目的はpair全探索ではなく、生成・sortの最大サイズを抑えることである。

## 典型の発動条件

### meet-in-the-middle

発動条件: 独立な素因数選択の全積は大きいが二群なら列挙可能。

素数集合を分割して半側smooth数を生成する。

### 積制約pair counting

発動条件: sort済み正数列からuv≤Nを数える。

overflowを避けN/uで上限pointerを動かす。

## 問題固有の要素

分割品質を素数数でなく実際の生成listサイズでonline均衡化するのが最大ケースを抑える。

別の問題へ持ち帰る視点: MITMの群分けは状態数推定を重みにする。

## 正当性

二群の素数集合は重ならないため、素因数分解の一意性により、各P-smooth数は一方の素数の積uと他方の積vの組へ一意に分解される。各群内でも素数を追加する際、旧リストだけを各正の冪で増やすので重複生成しない。uv≤Nなら各因子もN以下なので、各リストをNで打ち切っても必要な組は残る。sort後、uが増えるとvの許容上限N/uは減るので、二ポインタで全組を一度数える。

小さい側へ次の素数を入れる方針は実用的な分割の工夫であり、それ自体は最悪リストサイズの証明ではない。実行時間は生成したリスト長U,Vに依存する。最大入力N=10^16,P=100で、素数を昇順に追加し、同長なら第二リストへ入れる規約を実際に計算するとU=4,141,074,V=2,903,751、総生成7,044,825個である。答えの2,345,134,674個を全生成する必要はなく、約56.4MBの64bit値配列とsortで扱える。

## 実装上の注意

- 倍乗の前にu≤N/pで判定する。pair比較もu*vではなくv≤N/uにする。
- 素数を追加する際は旧リストの長さを固定し、新しく追加した値から再び生成しない。
- 約704万個は最終要素数であり、vectorを拡張するときの容量・一時コピーも空間に含める。片側の旧要素数だけを記録してin-placeで追加すれば別の全リストコピーは不要。

## 復習の核

- 小Nのfactor全探索と比較し、P=2、N=1、P以下最大素数の冪境界を確認する。

## 計算量と制約

### 時間

O(U log U+V log V+P(U+V))、P以下primeを列挙し生成list最大長U,V、最後のpair走査O(U+V)。

### 空間

O(U+V+P)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: N is an integer such that 1 \le N \le 10^{16}.; P is a prime such that 2 \le P \le 100.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/editorial/6275) — source-abc300-editorial-6275-de32447888ea06423b4d3f52d5dc0aff7bb6361d3c92f9f0202a1507ea3f6adf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/tasks/abc300_g) — source-abc300-g-problem-a16c13e539b88958dae8d540944e6b9357faeb711b672eb6bf043bd81c0d080b
