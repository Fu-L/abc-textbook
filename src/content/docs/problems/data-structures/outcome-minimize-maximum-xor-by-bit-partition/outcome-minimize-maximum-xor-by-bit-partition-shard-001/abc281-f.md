---
title: "ABC281-F — Xor Minimization"
draft: true
authoringUnit: {"problemId":"abc281-f","docPath":"src/content/docs/problems/data-structures/outcome-minimize-maximum-xor-by-bit-partition/outcome-minimize-maximum-xor-by-bit-partition-shard-001/abc281-f.md","learningOutcomeIds":["outcome-minimize-maximum-xor-by-bit-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["上位bitの支配関係によるXOR minimaxの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bitwise-minimax-partition"],"sourceRevisionIds":["source-abc281-editorial-5367-d15ed03399d4112df2618abe1eb9f8a67a098d943c9aaefe5184082aa86f1d07","source-abc281-f-problem-b42ed495ca4cdaa9fa2ece7e859c64c8d6340095fa82730a8ffc082dd107b1a7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"bit bが混在するとanswerへ2^bが確定し、x_b=0ならinput bit1 group、x_b=1ならbit0 groupだけが最大候補として下位bit比較に残る。 捨てたgroupは出力bit bが0なので、下位bitが何であっても高bit1のgroupを越えず、以後考慮不要である。 各要素はbit trieの1経路に沿って処理され、未知xを全列挙せず最上位差で候補を分割できる。","sourceRevisionIds":["source-abc281-editorial-5367-d15ed03399d4112df2618abe1eb9f8a67a098d943c9aaefe5184082aa86f1d07","source-abc281-f-problem-b42ed495ca4cdaa9fa2ece7e859c64c8d6340095fa82730a8ffc082dd107b1a7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上位bitの支配関係によるXOR minimax](src/content/docs/learn/query/bitwise-minimax-partition.md)

- 最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

最大値の最小化は最上位bitから辞書順に決まり、xのbit bは全a_iのbitを同時に反転する。

現在候補集合のbit bが一様ならx_bを合わせて出力bitを全て0にできるが、0/1両方なら最大値のbit bは必ず1になる。

採用する候補: bitを上位から再帰し、混在時はx_b=0/1の二案で高bit1となる片側groupだけを残して小さい再帰値を選ぶ。

棄却する候補: xを0≤x<2^30で全列挙してmax_i(a_i xor x)を取る。

x候補が約10^9個あり不可能である。

solve(V,b)を定義する。b<0なら0、一方groupだけならそのgroupでsolve(b-1)、両groupがあれば2^b+min(solve(V0,b-1),solve(V1,b-1))を返す。初期V=A,b=29の値が答え。

## 典型の発動条件

### XORの上位bit divide-and-conquer

発動条件: 共通xとのXOR後のmin/maxを最適化し、値域が固定bit幅のとき。

現在bitで0/1にpartitionし、上位bitが決める支配関係から片側を落とす。

### bit trie的再帰

発動条件: 整数集合をprefix bitごとのgroupへ分ける処理が必要なとき。

上位からpartitionした再帰tree上で各要素を一度ずつ下ろす。

## 問題固有の要素

混在bitでは最大側となるinput groupがx_bによって入れ替わり、二案の下位最適値のminを取るrecurrenceになる。

別の問題へ持ち帰る視点: global XOR最適化では、xの1bit選択がどのgroupをextremum候補にするかを上位bit優先で追う。

## 正当性

bit bが混在するとanswerへ2^bが確定し、x_b=0ならinput bit1 group、x_b=1ならbit0 groupだけが最大候補として下位bit比較に残る。 捨てたgroupは出力bit bが0なので、下位bitが何であっても高bit1のgroupを越えず、以後考慮不要である。 各要素はbit trieの1経路に沿って処理され、未知xを全列挙せず最上位差で候補を分割できる。

## 実装上の注意

- 一様bitでも対応するx_bを自由に選んで0化できるためanswerへ2^bを足さない。
- vector copyを各再帰で過剰に行わず、sort済み区間やbucket moveで総要素処理量を抑える。

## 復習の核

- bit bで混在する小集合についてx_b=0/1後の最大候補groupを色分けし、なぜもう片側を完全に捨てられるか説明する。

## 計算量と制約

### 時間

O(NB)、B=30。区間またはbucketによるbit分割。

### 空間

O(N+B)、入力再配置と再帰stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1.5 \times 10^5; 0 \leq a_i \lt 2^{30}; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/editorial/5367) — source-abc281-editorial-5367-d15ed03399d4112df2618abe1eb9f8a67a098d943c9aaefe5184082aa86f1d07
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/tasks/abc281_f) — source-abc281-f-problem-b42ed495ca4cdaa9fa2ece7e859c64c8d6340095fa82730a8ffc082dd107b1a7
