---
title: "ABC452-G — 221 Substring"
draft: true
authoringUnit: {"problemId":"abc452-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc452-g.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index"],"sourceRevisionIds":["source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938","source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"有効な221連続部分列では内部runを全部使うのでm=v、両端ではv個取り出せるためm≥vである。短いrunを0、ちょうどのrunをv、長いrunをv,0,vとする変換はこの必要十分条件を0-free連続部分列へ写す。長いrunの左側記号は終端用、右側記号は始端用で、途中の0を横切れないため内部には使えない。短列の各vをv個へ展開する逆写像はRLEの一意性から値列として単射で、元の全有効列も表せる。従って種類の集合が一対一で対応するが、位置の多重度は保存しない。\n\n辞書順で並ぶsuffixの共有prefixについて、sa[k]とそれ以前のsuffixの最大LCPは直前とのlcp[k]である。0-freeな長さがlcp[k]以下なら同じprefixが先行suffixにも有効に出現し、それより長ければ初出である。zerofreeで有効長を制限すると新規数はmax(0,zerofree[sa[k]]−lcp[k])となり、全和は全ての相異なる有効短列、従って元の221列の種類を一度ずつ数える。","sourceRevisionIds":["source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938","source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- rolling hashによる一致比較と回文半径。

## 考察

数える対象は連続部分列（substring）の値列の種類であり、非連続な部分列でも出現位置の個数でもない。Sの各runを(v,m)、すなわち値vがm個続くものとする。221列の内部runは元のrunを全部含むのでm=vが必要。両端runだけは一部を取れるためm≥vでよい。

runを次の短列に置き換えて連結したTを作る。

- m<vなら0。v個足りないのでそのrunは使えない。
- m=vならv。内部にも両端にも使える。
- m>vならv,0,v。左のvは元run先頭側のv個を使う連続部分列の右端、右のvは元run末尾側のv個を使う左端を表す。0が内部として使うことを禁じる。

0を含まないTの連続部分列の各値vをv個へ展開すれば、Sに現れる221列を得る。隣り合う元runは異値なので、展開後のrun分解も一意。この対応は値列の種類に対する一対一であり、出現位置に対して一対一ではない。例えばS=(1,1,1)はT=(1,0,1)となり、二つの位置にある短列(1)はどちらも同じ221列(1)を表す。従ってTでdistinct substringを数える必要がある。

Tのsuffix arrayをsa[0..L−1]、lcp[k]をsa[k−1]とsa[k]の共通prefix長、lcp[0]=0と定義する。zerofree[p]は位置pから最初の0の直前までの長さで、T[p]=0なら0である。後ろからzerofree[p]=(T[p]==0 ? 0 : 1+zerofree[p+1])で求める。

sa[k]を先頭とするsubstringのうち、辞書順で先行するsuffixにも現れるものは長さlcp[k]以下である。新しいsubstring長はlcp[k]+1以降で、有効な長さはzerofree[sa[k]]以下だから、寄与はmax(0,zerofree[sa[k]]−lcp[k])。これを全suffixで足す。

直前suffixが共有する0-free prefixはそのsuffixでも有効なので、先行suffixの全prefixを引いてよい。最初のsuffixのlcp=0、0始まりのsuffixの寄与0も同じ式で扱える。S=(1,1,1)では二つの(1)の片方だけが新規となって答え1。

RLE、長さO(N)のT、suffix arrayとLCP、zerofreeを順に作って64 bitで合計する。0..9の固定alphabetを渡す線形suffix arrayなら全体O(N)。各連続部分列をsetに格納する二乗列挙は不要である。

## 典型の発動条件

### run-length 条件の記号列変換

発動条件: 部分文字列の各 run に内部・端点で異なる制約があるとき。

利用可能性を sentinel 0 付きの短列へ符号化する。

### suffix array による distinct substring 数え上げ

発動条件: 禁止記号までに限った異なる連続部分列数を数えたいとき。

suffix ごとの有効 prefix 長から前 suffix との LCP を引く。

## 問題固有の要素

複雑な run 条件を、候補 block 列に sentinel を挿入して単なる禁止記号なし substring へ変換できる。

別の問題へ持ち帰る視点: distinct substring は各 suffix が辞書順で初めて追加する prefix 長区間として数える。

## 正当性

有効な221連続部分列では内部runを全部使うのでm=v、両端ではv個取り出せるためm≥vである。短いrunを0、ちょうどのrunをv、長いrunをv,0,vとする変換はこの必要十分条件を0-free連続部分列へ写す。長いrunの左側記号は終端用、右側記号は始端用で、途中の0を横切れないため内部には使えない。短列の各vをv個へ展開する逆写像はRLEの一意性から値列として単射で、元の全有効列も表せる。従って種類の集合が一対一で対応するが、位置の多重度は保存しない。

辞書順で並ぶsuffixの共有prefixについて、sa[k]とそれ以前のsuffixの最大LCPは直前とのlcp[k]である。0-freeな長さがlcp[k]以下なら同じprefixが先行suffixにも有効に出現し、それより長ければ初出である。zerofreeで有効長を制限すると新規数はmax(0,zerofree[sa[k]]−lcp[k])となり、全和は全ての相異なる有効短列、従って元の221列の種類を一度ずつ数える。

## 実装上の注意

- Tの対象は連続部分列。0を飛ばして二つの側を連結してはならない。
- m>vの左記号は右端用、右記号は左端用。どちらか一つを省くと隣runとつながる候補を落とす。
- SAライブラリがlcp[k]=LCP(sa[k],sa[k+1])を返すなら、寄与kではk=0 ? 0 : lcp[k−1]を使う。
- zerofreeは元のTの位置で管理し、参照はzerofree[sa[k]]。最初のsuffix、全0、同じ短列が複数出現する入力を確認する。

## 復習の核

- v>m、v=m、v<m の三runを端・内部として使えるか比較し、変換 T 上の substring との一対一対応を小例で確かめる。

## 計算量と制約

### 時間

O(N)を線形suffix arrayとLCP構築の場合とする。RLEと短列生成もO(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500\,000; 1 \leq A_i \leq 9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/editorial/18406) — source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/tasks/abc452_g) — source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08
