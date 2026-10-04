---
title: "ABC325-G — offence"
draft: true
authoringUnit: {"problemId":"abc325-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc325-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc325-editorial-7486-d763a8df8183edf6b09a76fde61feafc91ae7029cb71557ba2d96f011b9db7a6","source-abc325-g-problem-d6b5bc666733bb0c2482f36735a5b5944ce5be1d38202a2872319af590054561"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"独立区間は最適値和で消せる。先頭oと後方fが操作時に隣接する必要十分条件は間の区間を全削除できること。dp=0の内側を先に消し、ofと後方最大K文字を削る遷移でその場合を表す。最終操作に基づく分類が全削除列を覆う。","sourceRevisionIds":["source-abc325-editorial-7486-d763a8df8183edf6b09a76fde61feafc91ae7029cb71557ba2d96f011b9db7a6","source-abc325-g-problem-d6b5bc666733bb0c2482f36735a5b5944ce5be1d38202a2872319af590054561"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

削除によって離れていたoとfが隣接し新しい操作を作るため、現在見える最初のofだけを処理するgreedyではなくsubstringの縮約結果を持つ必要がある。 dp[l][r]をS[l,r)だけから得られる最小残存長とすると、短い区間から計算するinterval DPが使える。 最終操作のoが区間先頭lか否かで、先頭を使う特殊遷移と、独立な左右区間へのsplit遷移に分けられる。 S[l]='o'、S[i]='f'でdp[l+1][i]=0なら、中間を先に全削除してlとiをofとして最後に使える。 その最後の操作はofに続く縮約済みsuffixから最大K文字消せるので、残りはmax(dp[i+1][r]-K,0)になる。 最終操作のoがlでないなら、そのo位置iより前の文字は最終操作で触られず、[l,i)と[i,r)を独立に最適化した和で表せる。

採用する候補: substringの最小残存長をinterval DPし、最後の削除が先頭oを使うcaseと内部splitを列挙する。

削除後に新しく生じるofを短区間の最適値dp=0で表し、全操作順を最終操作から漏れなく分類できる。

棄却する候補: 左から最初に現れるofを見つけるたび常にK文字まで削除する。

削除文字数を減らして別のofを形成する方が最終長を短くできる場合がある。

棄却する候補: 元文字列に存在するof occurrenceだけを独立に選ぶinterval scheduling。

中間文字の削除で元は非隣接だったo,fが新たなoccurrenceになる。

S[l]='o'、S[i]='f'でdp[l+1][i]=0なら、中間を先に全削除してlとiをofとして最後に使える。

その最後の操作はofに続く縮約済みsuffixから最大K文字消せるので、残りはmax(dp[i+1][r]-K,0)になる。

最終操作のoがlでないなら、そのo位置iより前の文字は最終操作で触られず、[l,i)と[i,r)を独立に最適化した和で表せる。

dp[i][i]=0とし、interval長1から増やす。dp[l][r]をr-lで初期化し、全split mでdp[l][r]=min(dp[l][r],dp[l][m]+dp[m][r])を取る。S[l]='o'なら各i∈(l,r)でS[i]='f'かつdp[l+1][i]=0を確認し、max(dp[i+1][r]-K,0)でも更新する。最後にdp[0][|S|]を出力する。

## 典型の発動条件

### 最後の操作によるinterval DP

発動条件: substring削除が新しい隣接関係を作り、操作順を直接追いにくいとき。

最終削除の位置で場合分けし、それ以前を短区間DPへ委ねる。

### 完全消去可能性の利用

発動条件: 離れた2文字を削除で隣接させてpatternを作るとき。

間のdpが0かを接続条件にする。

### 区間splitの独立化

発動条件: 最終操作が区間先頭を使わず、ある境界を跨がないとき。

左右dpの和を候補にする。

## 問題固有の要素

ofの直後に消せるK文字は元substringの先頭K文字ではなく、suffixを最適に縮約した後に残る先頭K文字なので、長さだけならmax(dp-K,0)で表せる。

別の問題へ持ち帰る視点: 操作が「pattern削除＋後続を一定数削除」なら、後続を先に最適化してから残存量へcap減算を適用できるか検討する。

## 正当性

独立区間は最適値和で消せる。先頭oと後方fが操作時に隣接する必要十分条件は間の区間を全削除できること。dp=0の内側を先に消し、ofと後方最大K文字を削る遷移でその場合を表す。最終操作に基づく分類が全削除列を覆う。

## 実装上の注意

- 半開区間[l,r)でf位置i自身はofとして消え、suffixは[i+1,r)になるindexを揃える。
- splitには空区間だけの自明分割を入れず、すでに計算済みのstrictly shorter intervalだけを参照する。

## 復習の核

- 中間substringを全削除して離れたo,fを隣接させる例を作り、先頭caseのdp=0条件とsuffixからK文字引く順序を確認する。

## 計算量と制約

### 時間

文字列長N。区間O(N²)、splitとo/f相手O(N)で O(N³)。

### 空間

区間DP O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0 \leq K < |S| \leq 300; K is an integer.; S is a string consisting of lowercase English letters.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/editorial/7486) — source-abc325-editorial-7486-d763a8df8183edf6b09a76fde61feafc91ae7029cb71557ba2d96f011b9db7a6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/tasks/abc325_g) — source-abc325-g-problem-d6b5bc666733bb0c2482f36735a5b5944ce5be1d38202a2872319af590054561
