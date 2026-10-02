---
title: "ABC273-EX — Inv(0,1)ving Insert(1,0)n"
draft: true
authoringUnit: {"problemId":"abc273-ex","docPath":"src/content/docs/problems/mathematics/outcome-traverse-stern-brocot-ancestors/outcome-traverse-stern-brocot-ancestors-shard-001/abc273-ex.md","learningOutcomeIds":["outcome-traverse-stern-brocot-ancestors"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-structure","unit-ordered-set-multiset","unit-recursive-divide-and-conquer","unit-small-to-large"],"excludedTopics":["分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。"],"tagIds":["tag-stern-brocot-ancestry","tag-ordered-set-multiset","tag-recursive-divide-and-conquer","tag-small-to-large"],"sourceRevisionIds":["source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba","source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"原始pairのfractionはStern–Brocot木に一意に現れ、生成に必要な操作はその祖先node集合である。各nodeが区間Tに必要かはT内targetの存在だけで決まる。位置集合Pを含まないsubarrayはP間のgap内に限るので、全subarray数から各gapの三角数を引けばそのnodeの寄与になる。片側しかtargetを持たない連続祖先は位置集合が同じため長さを掛けて圧縮できる。","sourceRevisionIds":["source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba","source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Stern–Brocot木の経路と祖先](src/content/docs/learn/number-theory/stern-brocot-ancestry.md)

- 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)
- [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

対象外:

- 分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。

## 考察

隣接pairsの和を挿入する操作はStern–Brocot treeのinterval nodeでmediantを生成する操作そのもので、追加可能な(p,q)はprimitive pair gcd(p,q)=1である。

あるStern–Brocot interval nodeの操作がsubarray Tに必要なのは、そのopen interval内にTのtarget fractionが一つ以上存在するときである。

棄却する候補: 各subarrayについて必要なfractionsを一つずつStern–Brocot tree上で辿り、操作集合のunion sizeを求める。

subarrayがΘ(N^2)個あり、単一fractionのdepthも座標値に比例し得る。

採用する候補: 全targetsをfraction順にStern–Brocot intervalへ再帰分割し、各nodeを必要とするposition集合からsubarray数を数え、unary descentはまとめてskipする。

必要なtree部分だけを圧縮構築し、position setsをsmall-to-large mergeすることで全nodesの寄与を集約できる。

node interval内targetのoriginal indicesをsorted set Pとすると、そのnodeが必要なsubarraysは全subarraysからPを一つも含まないindex-gap内subarraysを引いて求められる。

targetsが片側childにしか入らない連続区間では、fraction boundsへ同じendpointをk回加える形をbinary searchし、そのk nodesは同じposition set寄与として一括加算できる。

mediant insertion costをcompressed Stern–Brocot trie上のancestor-union countへ写し、ordered-position set mergingで全consecutive subarraysへのnode寄与を合計する。

## 典型の発動条件

### Stern–Brocot treeと連分数的skip

発動条件: coprime positive pairsがmediant operationsで生成され、naive tree depthが座標値まで伸びるとき。

各nodeでtargetsを左右へ再帰分割し、全targetsが同じ側にある最大連続step数はinterval boundsからまとめて進める。

### position集合のsmall-to-large merge

発動条件: 再帰tree各nodeでdescendant itemsのoriginal positions集合に依存する統計を求めたいとき。

小さいordered setを大きいsetへ挿入し、隣接gapの変化からnodeのsubarray coverageを維持する。

## 問題固有の要素

非primitive pairを含むsubarrayは実現不能でf=0なので、primitive targetsだけからなる連続区間を独立に処理し、invalid positionを境界にする。

別の問題へ持ち帰る視点: 定義がimpossible caseを0にする集計では、invalid elementを含むrangesを単に除外し、valid runsへ分割する。

## 正当性

原始pairのfractionはStern–Brocot木に一意に現れ、生成に必要な操作はその祖先node集合である。各nodeが区間Tに必要かはT内targetの存在だけで決まる。位置集合Pを含まないsubarrayはP間のgap内に限るので、全subarray数から各gapの三角数を引けばそのnodeの寄与になる。片側しかtargetを持たない連続祖先は位置集合が同じため長さを掛けて圧縮できる。

## 実装上の注意

- fraction比較とbound更新のcross productsは10^18級となるため十分な整数幅を使い、q=0のinfinite endpointを別扱いする。
- position追加時は所属valid runの両端をsentinelとしてgap contributionを更新し、subarrayをrun外へ広げて数えない。

## 復習の核

- 生成操作がmediantなら、各targetまでの共通操作列をStern–Brocot treeのancestor setsとして共有する。
- implicit treeの長いunary chainは、一方へ分岐し続ける最大stepを数論式でまとめて進める。

## 計算量と制約

### 時間

O(N log²N+N log V)を上界とする。V=max(a_i,b_i)+1、圧縮木の探索と位置集合small-to-large mergeを行う。

### 空間

O(N log V)。圧縮nodeと位置集合。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^5; 0 \le a_i,b_i \le 10^9; a_i \neq a_j or b_i \neq b_j, if i \neq j.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/tasks/abc273_h) — source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/editorial/5032) — source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598
